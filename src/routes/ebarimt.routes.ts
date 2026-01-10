import { Router } from "express";
import { param, body, query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import ebarimtService from "../services/ebarimt.service";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: E-Barimt
 *   description: Electronic Receipt (E-Barimt) POS API 3.0 integration endpoints
 */

// All routes require authentication
router.use(authMiddleware);

// ==================== SYSTEM STATUS & INFO ====================

/**
 * @swagger
 * /api/ebarimt/status:
 *   get:
 *     summary: Check e-Barimt system status with full information
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: E-Barimt system status
 */
router.get(
  "/status",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ebarimtService.checkStatus();

      res.json({
        status: result.success ? "success" : "error",
        data: {
          online: result.online,
          message: result.message,
          info: result.info,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/information:
 *   get:
 *     summary: Get POS API information (lottery count, pending bills, etc.)
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Returns system information including:
 *       - Lottery count (сугалааны үлдэгдэл)
 *       - Pending bills count and amount (илгээгээгүй баримтууд)
 *       - Last sent date (сүүлд илгээсэн огноо)
 *       - Warning messages (сугалаа дуусах, 3 хоногийн хугацаа гэх мэт)
 *     responses:
 *       200:
 *         description: POS API information retrieved
 */
router.get(
  "/information",
  checkRole(["Admin", "Manager"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ebarimtService.getInformation();

      res.json({
        status: result.success ? "success" : "error",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/send-data:
 *   post:
 *     summary: Send pending bills to central system
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Sends all pending receipts to the central eBarimt system.
 *       According to law, this must be done at least once every 3 days.
 *     responses:
 *       200:
 *         description: Data sent successfully
 */
router.post(
  "/send-data",
  checkRole(["Admin", "Manager"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ebarimtService.sendData();

      if (result.success) {
        logger.info("Manual sendData triggered", {
          sentBillCount: result.sentBillCount,
          sentAmount: result.sentAmount,
        });
      }

      res.json({
        status: result.success ? "success" : "error",
        data: {
          sentBillCount: result.sentBillCount,
          sentAmount: result.sentAmount,
          message: result.message,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==================== REFERENCE DATA ====================

/**
 * @swagger
 * /api/ebarimt/check-tin/{tin}:
 *   get:
 *     summary: Check taxpayer identification number (TIN)
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tin
 *         required: true
 *         schema:
 *           type: string
 *         description: Taxpayer Identification Number (ТТД)
 *     responses:
 *       200:
 *         description: TIN lookup result
 */
router.get(
  "/check-tin/:tin",
  validate([param("tin").notEmpty().withMessage("TIN is required")]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tin } = req.params;
      const result = await ebarimtService.checkTin(tin);

      res.json({
        status: result.success ? "success" : "error",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/district-codes:
 *   get:
 *     summary: Get district codes for Ulaanbaatar
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: District codes list
 */
router.get(
  "/district-codes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ebarimtService.getDistrictCodes();

      res.json({
        status: "success",
        data: result.districts,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/vat-free-codes:
 *   get:
 *     summary: Get VAT-free product codes (НӨАТ-с чөлөөлөгдсөн)
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: VAT-free codes list
 */
router.get(
  "/vat-free-codes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ebarimtService.getVatFreeCodes();

      res.json({
        status: result.success ? "success" : "error",
        data: result.codes,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/classification-codes:
 *   get:
 *     summary: Get classification codes (БҮНА - 7-digit codes)
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for classification codes
 *     responses:
 *       200:
 *         description: Classification codes list
 */
router.get(
  "/classification-codes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const result = await ebarimtService.getClassificationCodes(search);

      res.json({
        status: result.success ? "success" : "error",
        data: result.codes,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==================== RECEIPT REGISTRATION ====================

/**
 * @swagger
 * /api/ebarimt/register/{orderId}:
 *   post:
 *     summary: Register order with e-Barimt
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: Register an existing order with e-Barimt system
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
  checkRole(["Admin", "Manager", "Cashier"]),
  validate([
    param("orderId").isInt().withMessage("Valid order ID is required"),
  ]),
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
        throw new AppError(
          "Only Store orders can be registered with e-Barimt",
          400
        );
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

      // Prepare e-Barimt data with NHAT support
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
          `E-Barimt registration for order ${orderId}: Lottery ${result.lottery}`
        );

        // Determine if B2B (no lottery for organizations)
        const isB2B = !!order.customer.registrationNumber;

        res.json({
          status: "success",
          data: {
            orderId: order.id,
            ebarimtId: result.id,
            billId: result.billId,
            lottery: isB2B ? undefined : result.lottery, // No lottery for B2B
            qrData: result.qrData,
            isB2B,
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

// ==================== BILL OPERATIONS ====================

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
 *         description: E-Barimt Bill ID (ДДТД)
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
 *     summary: Return/Cancel e-Barimt bill (Баримт буцаах)
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for return
 *     responses:
 *       200:
 *         description: Bill returned successfully
 */
router.post(
  "/return/:orderId",
  checkRole(["Admin", "Manager"]),
  validate([
    param("orderId").isInt().withMessage("Valid order ID is required"),
    body("reason").optional().isString(),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;

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
      const result = await ebarimtService.returnBill(
        order.ebarimtBillId,
        reason
      );

      if (result.success) {
        // Update order with return information
        await prisma.order.update({
          where: { id: order.id },
          data: {
            ebarimtReturnId: result.id,
          },
        });

        logger.info(
          `E-Barimt bill returned for order ${orderId}: ${result.id}`
        );

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
 * /api/ebarimt/edit/{orderId}:
 *   post:
 *     summary: Edit/Correct e-Barimt bill (Баримт засварлах)
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Edit an existing e-Barimt bill. This will:
 *       1. Return the original bill
 *       2. Create a new corrected bill
 *       Note: Only available within the same month
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for editing
 *     responses:
 *       200:
 *         description: Bill edited successfully
 */
router.post(
  "/edit/:orderId",
  checkRole(["Admin", "Manager"]),
  validate([
    param("orderId").isInt().withMessage("Valid order ID is required"),
    body("reason").notEmpty().withMessage("Edit reason is required"),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;

      // Get order with items
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

      if (!order.ebarimtRegistered || !order.ebarimtBillId) {
        throw new AppError("Order not registered with e-Barimt", 400);
      }

      // Check if within same month
      const registrationDate = order.ebarimtDate || order.orderDate;
      const now = new Date();
      if (
        registrationDate.getMonth() !== now.getMonth() ||
        registrationDate.getFullYear() !== now.getFullYear()
      ) {
        throw new AppError(
          "Баримт засварлах нь зөвхөн тухайн сарын хүрээнд боломжтой",
          400
        );
      }

      // Prepare corrected bill data
      const ebarimtData = ebarimtService.prepareOrderData({
        ...order,
        orderNumber: order.orderNumber || `ORD${order.id}`,
      });

      // Edit the receipt
      const result = await ebarimtService.editReceipt({
        originalBillId: order.ebarimtBillId,
        editType: "EDIT",
        reason,
        newData: ebarimtData as any,
      });

      if (result.success) {
        // Update order with new e-Barimt information
        await prisma.order.update({
          where: { id: order.id },
          data: {
            ebarimtId: result.data?.id,
            ebarimtBillId: result.data?.billId,
            ebarimtLottery: result.data?.lottery,
            ebarimtQrData: result.data?.qrData,
            ebarimtDate: new Date(),
          },
        });

        logger.info(`E-Barimt bill edited for order ${orderId}`);

        res.json({
          status: "success",
          data: {
            orderId: order.id,
            newBillId: result.data?.billId,
            lottery: result.data?.lottery,
            message: "Bill edited successfully",
          },
        });
      } else {
        throw new AppError(`Failed to edit bill: ${result.message}`, 500);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/ebarimt/supplement/{orderId}:
 *   post:
 *     summary: Supplement bill for previous month (Өмнөх сарын баримт нөхөж олгох)
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Issue a supplementary receipt for an order from the previous month.
 *       Only available for orders from the immediate previous month.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplementary bill issued
 */
router.post(
  "/supplement/:orderId",
  checkRole(["Admin", "Manager"]),
  validate([
    param("orderId").isInt().withMessage("Valid order ID is required"),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;

      // Get order with items
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

      if (order.ebarimtRegistered) {
        throw new AppError("Order already has e-Barimt registration", 400);
      }

      // Prepare data
      const ebarimtData = ebarimtService.prepareOrderData({
        ...order,
        orderNumber: order.orderNumber || `ORD${order.id}`,
      });

      // Register as supplement
      const result = await ebarimtService.supplementReceipt({
        ...ebarimtData,
        originalDate: order.orderDate,
      });

      if (result.success && result.data) {
        // Update order with e-Barimt information
        await prisma.order.update({
          where: { id: order.id },
          data: {
            ebarimtId: result.data.id,
            ebarimtBillId: result.data.billId,
            ebarimtLottery: result.data.lottery,
            ebarimtQrData: result.data.qrData,
            ebarimtRegistered: true,
            ebarimtDate: new Date(),
          },
        });

        logger.info(`Supplementary e-Barimt issued for order ${orderId}`);

        res.json({
          status: "success",
          data: {
            orderId: order.id,
            billId: result.data.billId,
            lottery: result.data.lottery,
            message: "Supplementary bill issued successfully",
          },
        });
      } else {
        throw new AppError(
          `Failed to issue supplementary bill: ${result.message}`,
          500
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// ==================== LISTING & REPORTS ====================

/**
 * @swagger
 * /api/ebarimt/orders/unregistered:
 *   get:
 *     summary: Get list of unregistered Store orders
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     description: Get Store orders that haven't been registered with e-Barimt
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: List of unregistered orders
 */
router.get(
  "/orders/unregistered",
  checkRole(["Admin", "Manager"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;

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
              registrationNumber: true,
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
        take: limit,
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

/**
 * @swagger
 * /api/ebarimt/orders/registered:
 *   get:
 *     summary: Get list of registered orders
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: List of registered orders
 */
router.get(
  "/orders/registered",
  checkRole(["Admin", "Manager"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const where: any = {
        ebarimtRegistered: true,
      };

      if (startDate || endDate) {
        where.ebarimtDate = {};
        if (startDate) where.ebarimtDate.gte = startDate;
        if (endDate) where.ebarimtDate.lte = endDate;
      }

      const registeredOrders = await prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              name: true,
              organizationName: true,
              registrationNumber: true,
            },
          },
        },
        orderBy: {
          ebarimtDate: "desc",
        },
        take: limit,
      });

      // Calculate totals
      const totals = registeredOrders.reduce(
        (acc, order) => {
          const total = order.totalAmount
            ? parseFloat(order.totalAmount.toString())
            : 0;
          const vat = order.vatAmount
            ? parseFloat(order.vatAmount.toString())
            : 0;
          return {
            totalAmount: acc.totalAmount + total,
            totalVat: acc.totalVat + vat,
            count: acc.count + 1,
          };
        },
        { totalAmount: 0, totalVat: 0, count: 0 }
      );

      res.json({
        status: "success",
        data: {
          count: registeredOrders.length,
          totals,
          orders: registeredOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==================== DEVICE REGISTRATION ====================

/**
 * @swagger
 * /api/ebarimt/register-device:
 *   post:
 *     summary: Register POS device with location and MAC address
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - macAddress
 *             properties:
 *               macAddress:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device registered successfully
 */
router.post(
  "/register-device",
  checkRole(["Admin"]),
  validate([
    body("macAddress").notEmpty().withMessage("MAC address is required"),
    body("latitude").optional().isNumeric(),
    body("longitude").optional().isNumeric(),
    body("location").optional().isString(),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { macAddress, latitude, longitude, location } = req.body;

      const result = await ebarimtService.registerDevice({
        macAddress,
        latitude,
        longitude,
        location,
      });

      res.json({
        status: result.success ? "success" : "error",
        data: {
          message: result.message,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==================== UTILITY ====================

/**
 * @swagger
 * /api/ebarimt/calculate-city-tax:
 *   post:
 *     summary: Calculate city tax (NHAT) for an amount
 *     tags: [E-Barimt]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               districtCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: City tax calculated
 */
router.post(
  "/calculate-city-tax",
  validate([body("amount").isNumeric().withMessage("Amount is required")]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, districtCode } = req.body;

      const cityTax = ebarimtService.calculateCityTax(amount, districtCode);

      res.json({
        status: "success",
        data: {
          amount,
          districtCode: districtCode || ebarimtService.getConfig().districtCode,
          cityTax,
          isUlaanbaatar: cityTax > 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
