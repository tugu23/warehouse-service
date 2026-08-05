import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";
import { Prisma } from "@prisma/client";
import { addDays, isBefore, startOfDay } from "date-fns";
import vatService from "../services/vat.service";
import pdfService from "../services/pdf-pdfkit.service";
import ebarimtService from "../services/ebarimt.service";
import { resolveOrderItemUnitPrice } from "../utils/orderPricing";
import { shouldForceInactiveProduct } from "../utils/productAvailability";
import { serializeDecimal } from "../utils/serializer";
import { getBuyXGetYBonusQty, isPromotionCurrentlyActive } from "../utils/promotion.utils";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const {
      customerId,
      items,
      paymentMethod = "Cash",
      creditTermDays: creditTermDaysRaw,
      orderType = "Store", // Default to Store
      orderDate, // Захиалгын огноо
      deliveryDate,
      ebarimtReceiptType,
    } = req.body;

    const customerIdNum = Number(customerId);
    if (!Number.isInteger(customerIdNum)) {
      throw new AppError("Valid customerId is required", 400);
    }

    const creditTermDays =
      creditTermDaysRaw === undefined ||
      creditTermDaysRaw === null ||
      creditTermDaysRaw === ""
        ? undefined
        : Number(creditTermDaysRaw);

    if (!items || items.length === 0) {
      throw new AppError(req.t.orders.noItems, 400);
    }

    // Validate credit terms if payment method is Credit
    if (
      paymentMethod === "Credit" &&
      (!creditTermDays || !Number.isFinite(creditTermDays))
    ) {
      throw new AppError("Ð—ÑÑÐ»Ð¸Ð¹Ð½ Ñ‚Ó©Ð»Ð±Ó©Ñ€Ñ‚ Ñ…ÑƒÐ³Ð°Ñ†Ð°Ð° Ð·Ð°Ð°Ñ… ÑˆÐ°Ð°Ñ€Ð´Ð»Ð°Ð³Ð°Ñ‚Ð°Ð¹", 400);
    }

    // Validate orderType
    if (!["Market", "Store"].includes(orderType)) {
      throw new AppError(
        "Ð—Ð°Ñ…Ð¸Ð°Ð»Ð³Ñ‹Ð½ Ñ‚Ó©Ñ€Ó©Ð» Ð·Ó©Ð²Ñ…Ó©Ð½ Ð—Ð°Ñ… ÑÑÐ²ÑÐ» Ð”ÑÐ»Ð³Ò¯Ò¯Ñ€ Ð±Ð°Ð¹Ñ… Ñ‘ÑÑ‚Ð¾Ð¹",
        400
      );
    }

    // Market order: delivery date is optional, but if provided must be in the future
    if (orderType === "Market" && deliveryDate) {
      const deliveryDateObj = startOfDay(new Date(deliveryDate));
      const today = startOfDay(new Date());

      if (!isBefore(today, deliveryDateObj)) {
        throw new AppError(req.t.orders.invalidDeliveryDate, 400);
      }
    }

    // Use transaction to ensure data consistency
    const order = await prisma.$transaction(async (tx) => {
      // Validate customer exists
      const customer = await tx.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new AppError(req.t.customers.notFound, 404);
      }

      // Validate stock availability and calculate total
      let grossAmount = new Prisma.Decimal(0);
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            prices: {
              select: {
                price: true,
              },
            },
            promotions: true,
          },
        });

        if (!product) {
          throw new AppError(
            `ID ${item.productId} Ð´ÑƒÐ³Ð°Ð°Ñ€Ñ‚Ð°Ð¹ Ð±Ð°Ñ€Ð°Ð° Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹`,
            404
          );
        }

        if (product.isActive === false || shouldForceInactiveProduct(product)) {
          throw new AppError(
            `${product.nameMongolian} Ð±Ð°Ñ€Ð°Ð° Ð¸Ð´ÑÐ²Ñ…Ð³Ò¯Ð¹ Ñ‚ÑƒÐ» Ð·Ð°Ñ…Ð¸Ð°Ð»Ð³Ð°Ð´ Ð¾Ñ€ÑƒÑƒÐ»Ð°Ñ… Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ð³Ò¯Ð¹`,
            400
          );
        }

        const selectedPromotion = item.promotionId == null
          ? null
          : product.promotions.find(
              (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
            );
        if (item.promotionId != null && !selectedPromotion) {
          throw new AppError(`${product.nameMongolian}: сонгосон урамшуулал хүчингүй болсон`, 400);
        }
        if (
          selectedPromotion?.type === "PERCENT_DISCOUNT" &&
          selectedPromotion.minQuantity != null &&
          item.quantity < selectedPromotion.minQuantity
        ) {
          throw new AppError(
            `${product.nameMongolian}: ${selectedPromotion.minQuantity} ширхэгээс хямдрал үйлчилнэ`,
            400
          );
        }

        // Calculate bonusFreeQty if promotion is selected
        const bonusFreeQty = (() => {
          if (!selectedPromotion || selectedPromotion.type !== "BUY_X_GET_Y") return 0;
          return getBuyXGetYBonusQty(
            item.quantity,
            [selectedPromotion],
            undefined,
            { promotionId: item.promotionId }
          );
        })();

        const totalQty = item.quantity + bonusFreeQty;

        if (product.stockQuantity < totalQty) {
          throw new AppError(
            `${product.nameMongolian} Ð±Ð°Ñ€Ð°Ð°Ð½Ñ‹ Ò¯Ð»Ð´ÑÐ³Ð´ÑÐ» Ñ…Ò¯Ñ€ÑÐ»Ñ†ÑÑ…Ð³Ò¯Ð¹ Ð±Ð°Ð¹Ð½Ð°. Ò®Ð»Ð´ÑÐ³Ð´ÑÐ»: ${product.stockQuantity}, Ð—Ð°Ñ…Ð¸Ð°Ð»ÑÐ°Ð½: ${totalQty} (Ð¾Ñ€Ð»Ð¾Ð³Ð¾: ${item.quantity}, ÑƒÑ€Ð°Ð¼ÑˆÑƒÑƒÐ»Ð°Ð»: ${bonusFreeQty})`,
            400
          );
        }

        const mode = (item.priceMode || "auto") as
          | "auto"
          | "wholesale"
          | "retail"
          | "defaultPrice"
          | "custom"
          | "customerType";

        const unitPrice = await resolveOrderItemUnitPrice(tx, {
          product,
          customer,
          mode,
          item,
          productName: product.nameMongolian,
        });

        const itemTotal = new Prisma.Decimal(unitPrice.toString()).mul(
          item.quantity
        );
        grossAmount = grossAmount.add(itemTotal);

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          promotionId: item.promotionId ?? null,
        });

        // Decrement product stock (including bonus items)
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: totalQty,
            },
          },
        });

        // Update inventory balance for current month
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const existingBalance = await tx.inventoryBalance.findUnique({
          where: {
            productId_month_year: {
              productId: item.productId,
              month,
              year,
            },
          },
        });

        if (existingBalance) {
          await tx.inventoryBalance.update({
            where: {
              productId_month_year: {
                productId: item.productId,
                month,
                year,
              },
            },
            data: {
              totalOut: {
                increment: totalQty,
              },
              closingBalance: {
                decrement: totalQty,
              },
            },
          });
        }
      }

      // Stored item prices are VAT-included. Split them into subtotal/VAT here.
      const vatCalc = vatService.extractVAT(grossAmount);
      const subtotalAmount = vatCalc.subtotal;
      const vatAmount = vatCalc.vat;
      const totalAmount = vatCalc.total;

      // Calculate due date for credit payments
      let dueDate = null;
      let paymentStatus: "Paid" | "Pending" = "Pending";

      if (paymentMethod === "Credit" && creditTermDays) {
        dueDate = addDays(new Date(), creditTermDays);
      } else if (paymentMethod === "Cash") {
        paymentStatus = "Paid";
      }

      // Create order with payment information
      const newOrder = await tx.order.create({
        data: {
          customerId: customerIdNum,
          agentId: authReq.user!.userId,
          orderType,
          orderDate: orderDate ? new Date(orderDate) : new Date(), // Захиалгын огноо (default: одоо)
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          subtotalAmount,
          vatAmount,
          totalAmount,
          status: "Pending",
          paymentMethod,
          paymentStatus,
          creditTermDays: creditTermDays ?? null,
          dueDate,
          paidAmount: paymentMethod === "Cash" ? totalAmount : 0,
          remainingAmount: paymentMethod === "Cash" ? 0 : totalAmount,
          ...(ebarimtReceiptType === "B2B" || ebarimtReceiptType === "B2C"
            ? { ebarimtReceiptType }
            : {}),
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          agent: {
            include: { role: true },
          },
          orderItems: {
            include: {
              product: {
                include: { promotions: true },
              },
            },
          },
        },
      });

      // If cash payment, create payment record
      if (paymentMethod === "Cash") {
        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            amount: totalAmount,
            paymentMethod: "Cash",
            notes: "Initial cash payment",
          },
        });
      }

      return newOrder;
    });

    logger.info(
      `New ${order.orderType} order created: Order ID ${order.id}, Subtotal: ${order.subtotalAmount}, VAT: ${order.vatAmount}, Total: ${order.totalAmount}, Payment: ${paymentMethod}`
    );

    // eBarimt registration is handled by the frontend (POS device at localhost:7080)
    // Frontend will call PUT /api/orders/:id/ebarimt to save the result

    // Add subtotal to orderItems for frontend
    const orderWithSubtotals = serializeDecimal({
      ...order,
      createdBy: order.agent, // Alias for frontend
      createdAt: order.orderDate, // Alias for frontend
      orderItems: order.orderItems.map((item) => {
        const bonusFreeQty = (() => {
          if (item.promotionId == null) return 0;
          if (!item.product?.promotions?.length) return 0;
          const activePromo = item.product.promotions.find(
            (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
          );
          if (!activePromo) return 0;
          return getBuyXGetYBonusQty(item.quantity, [activePromo], undefined, { promotionId: item.promotionId });
        })();
        return {
          ...item,
          subtotal: new Prisma.Decimal(item.unitPrice.toString()).mul(item.quantity),
          bonusFreeQty,
        };
      }),
    });

    res.status(201).json({
      status: "success",
      data: { order: orderWithSubtotals },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const page = parseInt(req.query.page as string) || 1;
    // Support 'all' as limit value to get all records (use with caution for large datasets)
    const limitParam = req.query.limit as string;
    const fetchAll = limitParam === "all" || limitParam === "-1";
    const limit = fetchAll ? undefined : parseInt(limitParam) || 10;
    const skip = fetchAll ? undefined : (page - 1) * (limit || 10);
    const status = req.query.status as string;
    const customerId = req.query.customerId as string;
    const paymentStatus = req.query.paymentStatus as string;
    const paymentMethod = req.query.paymentMethod as string;
    const orderType = req.query.orderType as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const where: any = {};

    // Agents must never receive another employee's orders. Keep this on the
    // server rather than relying on clients to pass an agentId filter.
    if (authReq.user?.role === "SalesAgent") {
      where.agentId = authReq.user.userId;
    }

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = parseInt(customerId);
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (orderType) {
      where.orderType = orderType;
    }

    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) {
        where.orderDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.orderDate.lte = new Date(endDate);
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        ...(skip !== undefined && { skip }),
        ...(limit !== undefined && { take: limit }),
        include: {
          customer: true,
          agent: {
            include: { role: true },
          },
          orderItems: {
            include: {
              product: {
                include: { promotions: true },
              },
            },
          },
          payments: true,
          returnedBy: {
            include: { role: true },
          },
        },
        orderBy: { orderDate: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    // Add aliases for frontend compatibility
    const ordersWithAliases = orders.map((order) => ({
      ...order,
      createdBy: order.agent, // Alias for frontend
      createdAt: order.orderDate, // Alias for frontend (orderDate as createdAt)
      orderItems: order.orderItems.map((item) => {
        // Compute bonusFreeQty exactly like getOrderById does
        const bonusFreeQty = (() => {
          if (item.promotionId == null) return 0;
          if (!item.product?.promotions?.length) return 0;
          const activePromo = item.product.promotions.find(
            (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
          );
          if (!activePromo) return 0;
          return getBuyXGetYBonusQty(item.quantity, [activePromo], undefined, { promotionId: item.promotionId });
        })();
        return {
          ...item,
          subtotal: new Prisma.Decimal(item.unitPrice.toString()).mul(item.quantity),
          bonusFreeQty,
        };
      }),
    }));

    const actualLimit = limit || total;
    res.json({
      status: "success",
      data: {
        orders: ordersWithAliases,
        pagination: {
          page: fetchAll ? 1 : page,
          limit: fetchAll ? total : actualLimit,
          total,
          totalPages: fetchAll ? 1 : Math.ceil(total / actualLimit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        agent: {
          include: { role: true },
        },
        orderItems: {
          include: {
            product: {
              include: { promotions: true },
            },
          },
        },
        returnedBy: {
          include: { role: true },
        },
      },
    });

    if (!order) {
      throw new AppError(req.t.orders.notFound, 404);
    }

    // Add aliases for frontend compatibility
    const orderWithAliases = serializeDecimal({
      ...order,
      createdBy: order.agent, // Alias for frontend
      createdAt: order.orderDate, // Alias for frontend (orderDate as createdAt)
      orderItems: order.orderItems.map((item) => {
        // Only show bonus if a promotion was explicitly selected and is still active
        const bonusFreeQty = (() => {
          if (item.promotionId == null) return 0;
          if (!item.product?.promotions?.length) return 0;
          const activePromo = item.product.promotions.find(
            (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
          );
          if (!activePromo) return 0;
          return getBuyXGetYBonusQty(item.quantity, [activePromo], undefined, { promotionId: item.promotionId });
        })();

        return {
          ...item,
          subtotal: new Prisma.Decimal(item.unitPrice.toString()).mul(item.quantity),
          bonusFreeQty,
        };
      }),
    });

    res.json({
      status: "success",
      data: { order: orderWithAliases },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const orderId = parseInt(id);
    const {
      customerId,
      items,
      paymentMethod = "Cash",
      creditTermDays: creditTermDaysRaw,
      orderType = "Store",
      deliveryDate,
      ebarimtReceiptType,
    } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: { include: { promotions: true } } },
        },
      },
    });

    if (!existingOrder) throw new AppError(req.t.orders.notFound, 404);
    if (existingOrder.status === "Cancelled") throw new AppError("Цуцлагдсан захиалгыг засах боломжгүй", 400);
    if (existingOrder.ebarimtRegistered) throw new AppError("И-баримт бүртгэгдсэн захиалгыг засах боломжгүй", 400);

    if (authReq.user?.role === "SalesAgent" && existingOrder.agentId !== authReq.user.userId) {
      throw new AppError(req.t.auth.forbidden, 403);
    }

    const customerIdNum = Number(customerId);
    if (!Number.isInteger(customerIdNum)) throw new AppError("Valid customerId is required", 400);
    if (!Array.isArray(items) || items.length === 0) throw new AppError(req.t.orders.noItems, 400);

    const creditTermDays =
      creditTermDaysRaw === undefined || creditTermDaysRaw === null || creditTermDaysRaw === ""
        ? undefined
        : Number(creditTermDaysRaw);

    if (paymentMethod === "Credit" && (!creditTermDays || !Number.isFinite(creditTermDays))) {
      throw new AppError("Ð—ÑÑÐ»Ð¸Ð¹Ð½ Ñ‚Ó©Ð»Ð±Ó©Ñ€Ñ‚ Ñ…ÑƒÐ³Ð°Ñ†Ð°Ð° Ð·Ð°Ð°Ñ… ÑˆÐ°Ð°Ñ€Ð´Ð»Ð°Ð³Ð°Ñ‚Ð°Ð¹", 400);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({ where: { id: customerIdNum } });
      if (!customer) throw new AppError(req.t.customers.notFound, 404);

      for (const oldItem of existingOrder.orderItems) {
        // Calculate bonusFreeQty for the old item to restore correct stock
        const oldBonusFreeQty = (() => {
          if (oldItem.promotionId == null) return 0;
          const activePromo = oldItem.product?.promotions?.find(
            (p) => p.id === oldItem.promotionId && isPromotionCurrentlyActive(p)
          );
          if (!activePromo) return 0;
          return getBuyXGetYBonusQty(
            oldItem.quantity,
            (oldItem.product?.promotions || []).filter((p) => p.id === oldItem.promotionId),
            undefined,
            { promotionId: oldItem.promotionId }
          );
        })();
        await tx.product.update({
          where: { id: oldItem.productId },
          data: { stockQuantity: { increment: oldItem.quantity + oldBonusFreeQty } },
        });
      }

      await tx.orderItem.deleteMany({ where: { orderId } });

      let grossAmount = new Prisma.Decimal(0);
      const orderItemsData: { productId: number; quantity: number; unitPrice: Prisma.Decimal; promotionId: number | null }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            prices: {
              select: {
                price: true,
              },
            },
            promotions: true,
          },
        });
        if (!product) throw new AppError(`ID ${item.productId} Ð´ÑƒÐ³Ð°Ð°Ñ€Ñ‚Ð°Ð¹ Ð±Ð°Ñ€Ð°Ð° Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹`, 404);
        if (product.isActive === false || shouldForceInactiveProduct(product)) {
          throw new AppError(
            `${product.nameMongolian} Ð±Ð°Ñ€Ð°Ð° Ð¸Ð´ÑÐ²Ñ…Ð³Ò¯Ð¹ Ñ‚ÑƒÐ» Ð·Ð°Ñ…Ð¸Ð°Ð»Ð³Ð°Ð´ Ð¾Ñ€ÑƒÑƒÐ»Ð°Ñ… Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ð³Ò¯Ð¹`,
            400
          );
        }

        const selectedPromotion = item.promotionId == null
          ? null
          : product.promotions.find(
              (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
            );
        if (item.promotionId != null && !selectedPromotion) {
          throw new AppError(`${product.nameMongolian}: сонгосон урамшуулал хүчингүй болсон`, 400);
        }
        if (
          selectedPromotion?.type === "PERCENT_DISCOUNT" &&
          selectedPromotion.minQuantity != null &&
          item.quantity < selectedPromotion.minQuantity
        ) {
          throw new AppError(
            `${product.nameMongolian}: ${selectedPromotion.minQuantity} ширхэгээс хямдрал үйлчилнэ`,
            400
          );
        }

        // Calculate bonusFreeQty if promotion is selected
        const bonusFreeQty = (() => {
          if (!selectedPromotion || selectedPromotion.type !== "BUY_X_GET_Y") return 0;
          return getBuyXGetYBonusQty(
            item.quantity,
            [selectedPromotion],
            undefined,
            { promotionId: item.promotionId }
          );
        })();

        const totalQty = item.quantity + bonusFreeQty;
        if (product.stockQuantity < totalQty) {
          throw new AppError(
            `${product.nameMongolian} Ð±Ð°Ñ€Ð°Ð°Ð½Ñ‹ Ò¯Ð»Ð´ÑÐ³Ð´ÑÐ» Ñ…Ò¯Ñ€ÑÐ»Ñ†ÑÑ…Ð³Ò¯Ð¹ Ð±Ð°Ð¹Ð½Ð°. Ò®Ð»Ð´ÑÐ³Ð´ÑÐ»: ${product.stockQuantity}, Ð—Ð°Ñ…Ð¸Ð°Ð»ÑÐ°Ð½: ${totalQty} (Ð¾Ñ€Ð»Ð¾Ð³Ð¾: ${item.quantity}, ÑƒÑ€Ð°Ð¼ÑˆÑƒÑƒÐ»Ð°Ð»: ${bonusFreeQty})`,
            400
          );
        }

        const mode = (item.priceMode || "auto") as
          | "auto"
          | "wholesale"
          | "retail"
          | "defaultPrice"
          | "custom"
          | "customerType";

        const unitPrice = await resolveOrderItemUnitPrice(tx, {
          product,
          customer,
          mode,
          item,
          productName: product.nameMongolian,
        });

        grossAmount = grossAmount.add(new Prisma.Decimal(unitPrice.toString()).mul(item.quantity));
        orderItemsData.push({ productId: item.productId, quantity: item.quantity, unitPrice, promotionId: item.promotionId ?? null });

        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: totalQty } },
        });
      }

      const vatCalc = vatService.extractVAT(grossAmount);
      const subtotalAmount = vatCalc.subtotal;
      const vatAmount = vatCalc.vat;
      const totalAmount = vatCalc.total;

      const dueDate = paymentMethod === "Credit" && creditTermDays ? addDays(new Date(), creditTermDays) : null;
      const paymentStatus: "Paid" | "Pending" = paymentMethod === "Cash" ? "Paid" : "Pending";

      return await tx.order.update({
        where: { id: orderId },
        data: {
          customerId: customerIdNum,
          orderType,
          deliveryDate: orderType === "Market" && deliveryDate ? new Date(deliveryDate) : null,
          subtotalAmount,
          vatAmount,
          totalAmount,
          paymentMethod,
          paymentStatus,
          creditTermDays: creditTermDays ?? null,
          dueDate,
          paidAmount: paymentMethod === "Cash" ? totalAmount : 0,
          remainingAmount: paymentMethod === "Cash" ? 0 : totalAmount,
          orderItems: { create: orderItemsData },
        },
        include: {
          customer: true,
          agent: { include: { role: true } },
          orderItems: {
            include: {
              product: {
                include: { promotions: true },
              },
            },
          },
        },
      });
    });

    res.json({
      status: "success",
      data: {
        order: serializeDecimal({
          ...updatedOrder,
          createdBy: updatedOrder.agent,
          createdAt: updatedOrder.orderDate,
          orderItems: updatedOrder.orderItems.map((item) => {
            const bonusFreeQty = (() => {
              if (item.promotionId == null) return 0;
              if (!item.product?.promotions?.length) return 0;
              const activePromo = item.product.promotions.find(
                (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
              );
              if (!activePromo) return 0;
              return getBuyXGetYBonusQty(item.quantity, [activePromo], undefined, { promotionId: item.promotionId });
            })();
            return {
              ...item,
              subtotal: new Prisma.Decimal(item.unitPrice.toString()).mul(item.quantity),
              bonusFreeQty,
            };
          }),
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      throw new AppError(req.t.orders.notFound, 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        customer: true,
        agent: {
          include: { role: true },
        },
        orderItems: {
          include: {
            product: {
              include: { promotions: true },
            },
          },
        },
      },
    });

    logger.info(`Order ${id} status updated to: ${status}`);

    res.json({
      status: "success",
      data: { order: serializeDecimal(updatedOrder) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderEbarimt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { ebarimtId, ebarimtBillId, ebarimtDate, ebarimtReceiptType, ebarimtType } =
      req.body as {
        ebarimtId?: string;
        ebarimtBillId?: string;
        ebarimtDate?: string;
        ebarimtReceiptType?: string;
        ebarimtType?: string;
      };

    const rawKind = ebarimtReceiptType ?? ebarimtType;
    const receiptKind =
      rawKind === "B2B" || rawKind === "B2C" ? rawKind : undefined;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      throw new AppError("Ð—Ð°Ñ…Ð¸Ð°Ð»Ð³Ð° Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹", 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        ebarimtId,
        ebarimtBillId,
        ebarimtRegistered: true,
        ebarimtDate: ebarimtDate ? new Date(ebarimtDate) : new Date(),
        ...(receiptKind ? { ebarimtReceiptType: receiptKind } : {}),
      },
    });

    logger.info(
      `Order ${id} eBarimt info updated: ID=${ebarimtId}, BillID=${ebarimtBillId}`
    );

    res.json({
      status: "success",
      data: { order: updatedOrder },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                nameMongolian: true,
                nameEnglish: true,
                productCode: true,
                barcode: true,
                promotions: true,
              },
            },
            promotion: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new AppError(req.t.orders.notFound, 404);
    }

    // Sales agents can only see their own orders
    if (
      authReq.user?.role === "SalesAgent" &&
      order.agentId !== authReq.user.userId
    ) {
      throw new AppError(req.t.auth.forbidden, 403);
    }

    // Format receipt data for frontend/printing
    const receiptData = {
      orderId: order.id,
      orderDate: order.orderDate,
      status: order.status,
      customer: {
        id: order.customer.id,
        name: order.customer.name,
        address: order.customer.address,
        phoneNumber: order.customer.phoneNumber,
      },
      agent: {
        id: order.agent.id,
        name: order.agent.name,
      },
      items: order.orderItems.map((item) => {
        // Only show bonus if a promotion was explicitly selected and is still active
        const bonusFreeQty = (() => {
          if (item.promotionId == null) return 0;
          if (!item.product?.promotions?.length) return 0;
          const activePromo = item.product.promotions.find(
            (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
          );
          if (!activePromo) return 0;
          return getBuyXGetYBonusQty(item.quantity, [activePromo], undefined, { promotionId: item.promotionId });
        })();

        return {
          productId: item.product.id,
          productName: item.product.nameMongolian,
          productCode: item.product.productCode,
          barcode: item.product.barcode || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: parseFloat(item.unitPrice.toString()) * item.quantity,
          promotionId: item.promotionId ?? null,
          bonusFreeQty,
        };
      }),
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        totalAmount: order.totalAmount,
        paidAmount: order.paidAmount,
        remainingAmount: order.remainingAmount,
        creditTermDays: order.creditTermDays,
        dueDate: order.dueDate,
      },
      payments: order.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.paymentMethod,
        date: p.paymentDate,
        notes: p.notes,
      })),
    };

    res.json({
      status: "success",
      data: { receipt: receiptData },
    });
  } catch (error) {
    next(error);
  }
};

export const prepareOrderDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        orderItems: {
          include: {
            product: {
              include: { promotions: true },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new AppError(req.t.orders.notFound, 404);
    }

    // Sales agents can only see their own orders
    if (
      authReq.user?.role === "SalesAgent" &&
      order.agentId !== authReq.user.userId
    ) {
      throw new AppError(req.t.auth.forbidden, 403);
    }

    // Prepare comprehensive document data for printing
    const documentData = {
      documentType: "SALES_ORDER",
      documentNumber: `ORD-${order.id.toString().padStart(6, "0")}`,
      issueDate: order.orderDate,
      companyInfo: {
        name: "Warehouse Management System",
        address: "Mongolia, Ulaanbaatar",
        phone: "+976-XXXXXXXX",
      },
      customer: {
        id: order.customer.id,
        name: order.customer.name,
        address: order.customer.address || "N/A",
        phoneNumber: order.customer.phoneNumber || "N/A",
      },
      agent: {
        name: order.agent.name,
        email: order.agent.email,
        phone: order.agent.phoneNumber || "N/A",
      },
      items: order.orderItems.map((item, index) => {
        // Only show bonus if a promotion was explicitly selected and is still active
        const bonusFreeQty = (() => {
          if (item.promotionId == null) return 0;
          if (!item.product?.promotions?.length) return 0;
          const activePromo = item.product.promotions.find(
            (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
          );
          if (!activePromo) return 0;
          return getBuyXGetYBonusQty(item.quantity, [activePromo], undefined, { promotionId: item.promotionId });
        })();

        return {
          no: index + 1,
          productCode: item.product.productCode || "N/A",
          productName: item.product.nameMongolian,
          quantity: item.quantity,
          unit: "ÑˆÐ¸Ñ€Ñ…ÑÐ³",
          unitPrice: parseFloat(item.unitPrice.toString()),
          total: parseFloat(item.unitPrice.toString()) * item.quantity,
          bonusFreeQty,
        };
      }),
      summary: {
        subtotal: parseFloat(
          order.subtotalAmount?.toString() ||
          order.totalAmount?.toString() ||
          "0"
        ),
        tax: parseFloat(order.vatAmount?.toString() || "0"),
        total: parseFloat(order.totalAmount?.toString() || "0"),
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        paidAmount: parseFloat(order.paidAmount?.toString() || "0"),
        remainingAmount: parseFloat(order.remainingAmount?.toString() || "0"),
        creditTermDays: order.creditTermDays,
        dueDate: order.dueDate,
      },
      notes:
        order.paymentMethod === "Credit"
          ? `Ð—ÑÑÐ»Ð¸Ð¹Ð½ Ð½Ó©Ñ…Ñ†Ó©Ð»: ${order.creditTermDays
          } Ó©Ð´Ó©Ñ€. Ð¢Ó©Ð»Ð±Ó©Ñ€ Ñ‚Ó©Ð»Ó©Ñ… Ó©Ð´Ó©Ñ€: ${order.dueDate?.toLocaleDateString(
            "mn-MN"
          )}`
          : "Ð‘ÑÐ»ÑÐ½ Ð¼Ó©Ð½Ð³Ó©Ó©Ñ€ Ñ‚Ó©Ð»ÑÓ©Ð½",
      printedAt: new Date(),
    };

    res.json({
      status: "success",
      data: { document: documentData },
    });
  } catch (error) {
    next(error);
  }
};

export const getMarketOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.query.orderType = "Market";
    await getAllOrders(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getStoreOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.query.orderType = "Store";
    await getAllOrders(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getOrderReceiptPDF = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const download = req.query.download === "true";
    const showVat = req.query.showVat === "true"; // If true, show VAT; if false/undefined, show ÐÓ¨ÐÐ¢-Ð³Ò¯Ð¹ Ð¿Ð°Ð´Ð°Ð°Ð½

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                nameMongolian: true,
                nameEnglish: true,
                productCode: true,
                barcode: true,
                classificationCode: true,
                promotions: true,
                category: {
                  select: {
                    classificationCode: true,
                  },
                },
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new AppError(req.t.orders.notFound, 404);
    }

    // Validate that order has required data for PDF generation
    if (!order.customer) {
      throw new AppError("Ð—Ð°Ñ…Ð¸Ð°Ð»Ð³Ñ‹Ð½ Ñ…Ð°Ñ€Ð¸Ð»Ñ†Ð°Ð³Ñ‡Ð¸Ð¹Ð½ Ð¼ÑÐ´ÑÑÐ»ÑÐ» Ð´ÑƒÑ‚ÑƒÑƒ Ð±Ð°Ð¹Ð½Ð°", 500);
    }

    if (!order.agent) {
      throw new AppError("Ð—Ð°Ñ…Ð¸Ð°Ð»Ð³Ñ‹Ð½ Ð±Ð¾Ñ€Ð»ÑƒÑƒÐ»Ð°Ð³Ñ‡Ð¸Ð¹Ð½ Ð¼ÑÐ´ÑÑÐ»ÑÐ» Ð´ÑƒÑ‚ÑƒÑƒ Ð±Ð°Ð¹Ð½Ð°", 500);
    }

    if (!order.orderItems || order.orderItems.length === 0) {
      throw new AppError(req.t.orders.noItems, 500);
    }

    // Sales agents can only see their own orders
    if (
      authReq.user?.role === "SalesAgent" &&
      order.agentId !== authReq.user.userId
    ) {
      throw new AppError(req.t.auth.forbidden, 403);
    }

    // Use backend-calculated values instead of recalculating
    // The order already has correct subtotal, VAT, and total amounts
    const subtotal = parseFloat(order.subtotalAmount?.toString() || "0");
    const vat = parseFloat(order.vatAmount?.toString() || "0");
    const total = parseFloat(order.totalAmount?.toString() || "0");

    // City tax (NHAT) - only for Ulaanbaatar Store orders (4-digit codes, prefix "25")
    const districtCode = order.customer.district || "2506";
    const isUlaanbaatar = districtCode.startsWith("25");

    // Calculate city tax from subtotal if applicable
    let cityTax = 0;
    if (isUlaanbaatar && order.orderType === "Store" && subtotal > 0) {
      cityTax = Math.round(subtotal * 0.02 * 100) / 100;
    }

    // Detect B2B: use stored type for already-registered orders; for new registrations it gets set below
    const isB2B = order.ebarimtReceiptType === "B2B" || (order.ebarimtReceiptType == null && !!order.customer.registrationNumber);

    let ebarimtLotteryForPrint: string | undefined;
    let ebarimtQrDataForPrint: string | undefined;

    if (!order.ebarimtRegistered && process.env.EBARIMT_ENABLED === "true") {
      logger.info(`Registering order ${order.id} with E-Barimt before generating PDF`);

      const ebarimtResult = await ebarimtService.registerReceipt({
        orderNumber: order.orderNumber || `ORD-${order.id.toString().padStart(6, "0")}`,
        customer: {
          name: order.customer.name,
          registrationNumber: order.customer.registrationNumber,
        },
        consumerNo: (order.customer as any).ebarimtConsumerNo || undefined,
        items: order.orderItems.map((item) => ({
          productName: item.product.nameMongolian,
          barcode: item.product.barcode || undefined,
          classificationCode: item.product.classificationCode || (item.product as any).category?.classificationCode || undefined,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice.toString()),
          total: parseFloat(item.unitPrice.toString()) * item.quantity,
        })),
        subtotal,
        vat,
        total,
        cityTax,
        paymentMethod: order.paymentMethod,
        districtCode: order.customer.district || undefined,
      });

      if (!ebarimtResult.success || !ebarimtResult.data) {
        const errorMsg = ebarimtResult.message || ebarimtResult.errorMessage || "Unknown error";
        const errorCode = ebarimtResult.errorCode || "UNKNOWN";

        logger.error(`E-Barimt registration failed for order ${order.id}`, {
          error: errorMsg,
          errorCode: errorCode,
          fullResponse: JSON.stringify(ebarimtResult),
        });

        const isConnectionError = errorMsg.includes("timeout") ||
          errorMsg.includes("ECONNREFUSED") ||
          errorMsg.includes("ETIMEDOUT") ||
          errorMsg.includes("ENOTFOUND");

        const userMessage = isConnectionError
          ? "E-Barimt ÑÐ¸ÑÑ‚ÐµÐ¼Ð´ Ñ…Ð¾Ð»Ð±Ð¾Ð³Ð´Ð¾Ñ… Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ð³Ò¯Ð¹ Ð±Ð°Ð¹Ð½Ð°. API ÑÐµÑ€Ð²ÐµÑ€Ð¸Ð¹Ð³ ÑˆÐ°Ð»Ð³Ð°Ð½Ð° ÑƒÑƒ."
          : `E-BÐ°Ñ€Ð¸mt Ð±Ð°Ñ€Ð¸Ð¼Ñ‚ Ð±Ò¯Ñ€Ñ‚Ð³ÑÐ» Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ð³Ò¯Ð¹ [${errorCode}]: ${errorMsg}`;

        throw new AppError(userMessage, 500);
      }

      logger.info(`E-Barimt registration successful for order ${order.id}`, {
        billId: ebarimtResult.data.billId,
        lottery: ebarimtResult.data.lottery,
      });

      // Persist only Ð”Ð”Ð¢Ð” and registration status (NOT lottery/qrData per legal requirement)
      // receiptType comes directly from the API response â€” no recalculation needed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          ebarimtId: ebarimtResult.data.id,
          ebarimtBillId: ebarimtResult.data.billId,
          ebarimtRegistered: true,
          ebarimtDate: new Date(ebarimtResult.data.date),
          ebarimtReceiptType: ebarimtResult.data.receiptType === "B2B_RECEIPT" ? "B2B" : "B2C",
        },
      });

      // Keep lottery/qrData in memory for immediate PDF printing only
      ebarimtLotteryForPrint = ebarimtResult.data.lottery;
      ebarimtQrDataForPrint = ebarimtResult.data.qrData;

      order.ebarimtId = ebarimtResult.data.id;
      order.ebarimtBillId = ebarimtResult.data.billId;
      order.ebarimtRegistered = true;
      order.ebarimtDate = new Date(ebarimtResult.data.date);
      order.ebarimtReceiptType = ebarimtResult.data.receiptType === "B2B_RECEIPT" ? "B2B" : "B2C";
    }

    const receiptData = {
      orderId: order.id,
      orderNumber:
        order.orderNumber || `ORD-${order.id.toString().padStart(6, "0")}`,
      orderDate: order.orderDate,
      orderType: order.orderType,
      status: order.status,
      customer: {
        name: order.customer.name,
        systemName: order.customer.name,
        address: order.customer.address,
        phoneNumber: order.customer.phoneNumber,
        registrationNumber: order.customer.registrationNumber, // Ð¢Ð¢Ð” for B2B
      },
      agent: {
        name: order.agent.name,
        phoneNumber: order.agent.phoneNumber,
      },
      items: order.orderItems.map((item) => {
        // Only show bonus rows if a promotion was explicitly selected for this item
        const bonusFreeQty = (() => {
          // If no promotion was explicitly selected, don't show bonus
          if (item.promotionId == null) return 0;

          // Must have promotions loaded to validate the promotion still exists
          if (!item.product?.promotions?.length) return 0;

          // Find the selected promotion and verify it's still active
          const activePromo = item.product.promotions.find(
            (p) => p.id === item.promotionId && isPromotionCurrentlyActive(p)
          );
          if (!activePromo) return 0;

          // Use explicit promotionId so we ONLY use the selected promotion
          return getBuyXGetYBonusQty(item.quantity, [activePromo], undefined, { promotionId: item.promotionId });
        })();

        return {
          productName: item.product.nameMongolian,
          productCode: item.product.productCode || "N/A",
          barcode: item.product.barcode || undefined,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice.toString()),
          total: parseFloat(item.unitPrice.toString()) * item.quantity,
          bonusFreeQty,
        };
      }),
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total,
      cityTax: Math.round(cityTax * 100) / 100, // ÐÐ¥ÐÐ¢
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paidAmount: parseFloat(order.paidAmount?.toString() || "0"),
      remainingAmount: parseFloat(order.remainingAmount?.toString() || "0"),
      creditTermDays: order.creditTermDays,
      dueDate: order.dueDate,
      // E-Barimt fields (lottery/qrData from memory only, not persisted)
      ebarimtId: order.ebarimtId,
      ebarimtBillId: order.ebarimtBillId,
      ebarimtLottery: order.ebarimtReceiptType === "B2B" ? undefined : ebarimtLotteryForPrint,
      ebarimtQrData: ebarimtQrDataForPrint,
      ebarimtRegistered: order.ebarimtRegistered,
      ebarimtDate: order.ebarimtDate,
      isB2B: order.ebarimtReceiptType === "B2B", // Use actual DB/API value
      showVat: showVat, // true = ÐÓ¨ÐÐ¢-Ñ‚Ð°Ð¹, false = ÐÓ¨ÐÐ¢-Ð³Ò¯Ð¹ Ð¿Ð°Ð´Ð°Ð°Ð½
    };

    // Generate PDF
    const pdfBuffer = await pdfService.generateOrderReceiptPDF(receiptData);

    // Set appropriate headers with UTF-8 encoding
    res.setHeader("Content-Type", "application/pdf; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      download
        ? `attachment; filename="receipt-${receiptData.orderNumber}.pdf"`
        : `inline; filename="receipt-${receiptData.orderNumber}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Content-Encoding", "utf-8");

    // Send PDF
    res.send(pdfBuffer);

    logger.info(
      `PDF receipt generated for order ${order.id} (${download ? "download" : "view"
      })`
    );
  } catch (error) {
    logger.error("Error generating PDF receipt:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      orderId: req.params.id,
    });
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id);

    await prisma.$transaction(async (tx) => {
      // Find order with items
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });

      if (!order) {
        throw new AppError("Захиалга олдсонгүй", 404);
      }

      // Restore stock for each item
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        });
      }

      // Delete order items first (foreign key constraint)
      await tx.orderItem.deleteMany({
        where: { orderId },
      });

      // Delete payments
      await tx.payment.deleteMany({
        where: { orderId },
      });

      // Delete order
      await tx.order.delete({
        where: { id: orderId },
      });
    });

    logger.info(`Order ${orderId} deleted successfully`);

    res.json({
      status: "success",
      message: "Захиалга амжилттай устгагдлаа",
    });
  } catch (error) {
    next(error);
  }
};
