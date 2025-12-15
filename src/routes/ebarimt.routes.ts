import { Router } from "express";
import { param, body, query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { ebarimtService } from "../services/ebarimt.service";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: E-Barimt
 *   description: Electronic Receipt (E-Barimt) integration endpoints
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/ebarimt/status:
 *   get:
 *     summary: Check e-Barimt system status
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: E-Barimt system status
 */
router.get("/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ebarimtService.checkStatus();
    
    res.json({
      status: result.success ? "success" : "error",
      data: {
        online: result.online,
        message: result.message,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/ebarimt/register/{orderId}:
 *   post:
 *     summary: Manually register order with e-Barimt
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: Register an existing order with e-Barimt system (retry failed registrations)
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: E-Barimt registration successful
 *       404:
 *         description: Order not found
 *       400:
 *         description: Order already registered or invalid
 */
router.post(
  "/register/:orderId",
  checkRole(["Admin", "Manager"]),
  validate([param("orderId").isInt().withMessage("Valid order ID is required")]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;

      // Get order with customer and items
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      // Check if already registered
      if (order.ebarimtRegistered) {
        throw new AppError(
          `Order already registered with e-Barimt. Bill ID: ${order.ebarimtBillId}, Lottery: ${order.ebarimtLottery}`,
          400
        );
      }

      // Only Store orders need e-Barimt
      if (order.orderType !== "Store") {
        throw new AppError("Only Store orders can be registered with e-Barimt", 400);
      }

      // Generate order number if not exists
      let orderNumber = order.orderNumber;
      if (!orderNumber) {
        orderNumber = `ORD${order.id}${Date.now()}`;
        await prisma.order.update({
          where: { id: order.id },
          data: { orderNumber },
        });
      }

      // Prepare e-Barimt data
      const ebarimtData = ebarimtService.prepareOrderData({
        ...order,
        orderNumber,
      });

      // Register with e-Barimt
      const result = await ebarimtService.registerBill(ebarimtData);

      if (result.success) {
        // Update order with e-Barimt information
        await prisma.order.update({
          where: { id: order.id },
          data: {
            ebarimtId: result.id,
            ebarimtBillId: result.billId,
            ebarimtLottery: result.lottery,
            ebarimtQrData: result.qrData,
            ebarimtRegistered: true,
            ebarimtDate: new Date(),
          },
        });

        logger.info(
          `Manual e-Barimt registration for order ${orderId}: Lottery ${result.lottery}`
        );

        res.json({
          status: "success",
          data: {
            orderId: order.id,
            ebarimtId: result.id,
            billId: result.billId,
            lottery: result.lottery,
            qrData: result.qrData,
            message: result.message,
          },
        });
      } else {
        throw new AppError(
          `E-Barimt registration failed: ${result.message}`,
          500
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/bill/{billId}:
 *   get:
 *     summary: Get e-Barimt bill details
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: billId
 *         required: true
 *         schema:
 *           type: string
 *         description: E-Barimt Bill ID
 *     responses:
 *       200:
 *         description: Bill details retrieved
 */
router.get(
  "/bill/:billId",
  checkRole(["Admin", "Manager"]),
  validate([param("billId").notEmpty().withMessage("Bill ID is required")]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { billId } = req.params;

      const result = await ebarimtService.getBill(billId);

      if (result.success) {
        res.json({
          status: "success",
          data: result,
        });
      } else {
        throw new AppError(`Failed to get bill: ${result.message}`, 500);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/return/{orderId}:
 *   post:
 *     summary: Return/Cancel e-Barimt bill
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: Cancel an e-Barimt bill for returns
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Bill returned successfully
 */
router.post(
  "/return/:orderId",
  checkRole(["Admin", "Manager"]),
  validate([param("orderId").isInt().withMessage("Valid order ID is required")]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;

      // Get order
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
      });

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (!order.ebarimtRegistered || !order.ebarimtBillId) {
        throw new AppError("Order not registered with e-Barimt", 400);
      }

      if (order.ebarimtReturnId) {
        throw new AppError("Order bill already returned", 400);
      }

      // Return bill in e-Barimt
      const result = await ebarimtService.returnBill(order.ebarimtBillId);

      if (result.success) {
        // Update order with return information
        await prisma.order.update({
          where: { id: order.id },
          data: {
            ebarimtReturnId: result.id,
          },
        });

        logger.info(`E-Barimt bill returned for order ${orderId}: ${result.id}`);

        res.json({
          status: "success",
          data: {
            orderId: order.id,
            returnId: result.id,
            message: result.message,
          },
        });
      } else {
        throw new AppError(`Failed to return bill: ${result.message}`, 500);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/orders/unregistered:
 *   get:
 *     summary: Get list of unregistered Store orders
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: Get Store orders that haven't been registered with e-Barimt
 *     responses:
 *       200:
 *         description: List of unregistered orders
 */
router.get(
  "/orders/unregistered",
  checkRole(["Admin", "Manager"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unregisteredOrders = await prisma.order.findMany({
        where: {
          orderType: "Store",
          ebarimtRegistered: false,
        },
        include: {
          customer: {
            select: {
              name: true,
              organizationName: true,
            },
          },
          agent: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          orderDate: "desc",
        },
        take: 100, // Limit to recent 100
      });

      res.json({
        status: "success",
        data: {
          count: unregisteredOrders.length,
          orders: unregisteredOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

