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
      deliveryDate,
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
      throw new AppError("Зээлийн төлбөрт хугацаа заах шаардлагатай", 400);
    }

    // Validate orderType
    if (!["Market", "Store"].includes(orderType)) {
      throw new AppError(
        "Захиалгын төрөл зөвхөн Зах эсвэл Дэлгүүр байх ёстой",
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
      let subtotalAmount = new Prisma.Decimal(0);
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new AppError(
            `ID ${item.productId} дугаартай бараа олдсонгүй`,
            404
          );
        }

        if (product.stockQuantity < item.quantity) {
          throw new AppError(
            `${product.nameMongolian} барааны үлдэгдэл хүрэлцэхгүй байна. Үлдэгдэл: ${product.stockQuantity}, Захиалсан: ${item.quantity}`,
            400
          );
        }

        // Get active batches using FIFO logic (oldest first, non-expired)
        const batches = await tx.productBatch.findMany({
          where: {
            productId: item.productId,
            isActive: true,
            quantity: {
              gt: 0,
            },
            OR: [
              { expiryDate: null },
              { expiryDate: { gt: new Date() } }, // Not expired
            ],
          },
          orderBy: {
            arrivalDate: "asc", // FIFO - oldest first
          },
        });

        // Check if we have enough inventory in non-expired batches
        const totalBatchQuantity = batches.reduce(
          (sum, batch) => sum + batch.quantity,
          0
        );

        if (totalBatchQuantity < item.quantity) {
          throw new AppError(
            `${product.nameMongolian} барааны идэвхтэй багцын үлдэгдэл хүрэлцэхгүй. Үлдэгдэл: ${totalBatchQuantity}, Захиалсан: ${item.quantity}`,
            400
          );
        }

        // Allocate quantity from batches using FIFO
        let remainingQuantity = item.quantity;
        for (const batch of batches) {
          if (remainingQuantity <= 0) break;

          const quantityToUse = Math.min(batch.quantity, remainingQuantity);

          // Update batch quantity
          await tx.productBatch.update({
            where: { id: batch.id },
            data: {
              quantity: {
                decrement: quantityToUse,
              },
            },
          });

          remainingQuantity -= quantityToUse;

          logger.info(
            `Allocated ${quantityToUse} units from batch ${batch.batchNumber} (Product: ${product.nameMongolian})`
          );
        }

        // Determine price independent of customer/org selection.
        // Market orders use wholesale; Store orders use retail.
        let unitPrice: Prisma.Decimal | null =
          orderType === "Market" ? product.priceWholesale : product.priceRetail;

        // Fallback if one side is missing
        if (!unitPrice) unitPrice = product.priceRetail || product.priceWholesale;

        if (!unitPrice) {
          throw new AppError(
            `${product.nameMongolian} барааны үнэ тохируулаагүй байна`,
            400
          );
        }

        const itemTotal = new Prisma.Decimal(unitPrice.toString()).mul(
          item.quantity
        );
        subtotalAmount = subtotalAmount.add(itemTotal);

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
        });

        // Decrement overall product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
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
                increment: item.quantity,
              },
              closingBalance: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Calculate VAT for all orders (both Market and Store) (10%)
      // Market vs Store only affects product pricing, not VAT calculation
      const vatCalc = vatService.addVAT(subtotalAmount);
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
            include: { product: true },
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

    // Register with E-Barimt for Store orders only
    if (order.orderType === "Store" && ebarimtService.isServiceEnabled()) {
      try {
        // Generate unique order number if not exists
        const orderNumber = `ORD-${order.id.toString().padStart(6, "0")}`;

        // Update order with order number before E-Barimt registration
        await prisma.order.update({
          where: { id: order.id },
          data: { orderNumber },
        });

        // Register with E-Barimt
        const ebarimtResult = await ebarimtService.registerReceipt({
          orderNumber,
          customer: {
            name: order.customer.name,
            registrationNumber: order.customer.registrationNumber,
          },
          consumerNo: (order.customer as any).ebarimtConsumerNo || undefined,
          items: order.orderItems.map((item) => ({
            productName: item.product.nameMongolian,
            barcode: item.product.barcode || undefined,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice.toString()),
            total: parseFloat(item.unitPrice.toString()) * item.quantity,
          })),
          subtotal: parseFloat(order.subtotalAmount?.toString() || "0"),
          vat: parseFloat(order.vatAmount?.toString() || "0"),
          total: parseFloat(order.totalAmount?.toString() || "0"),
          paymentMethod: order.paymentMethod,
        });

        if (ebarimtResult.success && ebarimtResult.data) {
          // Update order with E-Barimt information (do NOT persist lottery/qrData per legal requirement)
          await prisma.order.update({
            where: { id: order.id },
            data: {
              ebarimtId: ebarimtResult.data.id,
              ebarimtBillId: ebarimtResult.data.billId,
              ebarimtRegistered: true,
              ebarimtDate: new Date(ebarimtResult.data.date),
            },
          });

          logger.info(
            `Order ${order.id} registered with E-Barimt. ДДТД: ${ebarimtResult.data.billId}, Lottery: ${ebarimtResult.data.lottery}`
          );
        } else {
          logger.error(
            `Failed to register order ${order.id} with E-Barimt: ${ebarimtResult.message}`
          );
          // Note: Order is still created even if E-Barimt registration fails
          // Can be retried later using manual endpoint
        }
      } catch (error) {
        logger.error(
          `Error during E-Barimt registration for order ${order.id}:`,
          error
        );
        // Continue - order is already created
      }
    }

    // Add subtotal to orderItems for frontend
    const orderWithSubtotals = {
      ...order,
      createdBy: order.agent, // Alias for frontend
      createdAt: order.orderDate, // Alias for frontend
      orderItems: order.orderItems.map((item) => ({
        ...item,
        subtotal: new Prisma.Decimal(item.unitPrice.toString()).mul(
          item.quantity
        ),
      })),
    };

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

    // Sales agents can only see their own orders
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
            include: { product: true },
          },
          payments: true,
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
      orderItems: order.orderItems.map((item) => ({
        ...item,
        subtotal: new Prisma.Decimal(item.unitPrice.toString()).mul(
          item.quantity
        ), // Calculate subtotal
      })),
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
          include: { product: true },
        },
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

    // Add aliases for frontend compatibility
    const orderWithAliases = {
      ...order,
      createdBy: order.agent, // Alias for frontend
      createdAt: order.orderDate, // Alias for frontend (orderDate as createdAt)
      orderItems: order.orderItems.map((item) => ({
        ...item,
        subtotal: new Prisma.Decimal(item.unitPrice.toString()).mul(
          item.quantity
        ), // Calculate subtotal
      })),
    };

    res.json({
      status: "success",
      data: { order: orderWithAliases },
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
          include: { product: true },
        },
      },
    });

    logger.info(`Order ${id} status updated to: ${status}`);

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
      items: order.orderItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.nameMongolian,
        productCode: item.product.productCode,
        barcode: item.product.barcode || undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: parseFloat(item.unitPrice.toString()) * item.quantity,
      })),
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
            product: true,
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
      items: order.orderItems.map((item, index) => ({
        no: index + 1,
        productCode: item.product.productCode || "N/A",
        productName: item.product.nameMongolian,
        quantity: item.quantity,
        unit: "ширхэг",
        unitPrice: parseFloat(item.unitPrice.toString()),
        total: parseFloat(item.unitPrice.toString()) * item.quantity,
      })),
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
          ? `Зээлийн нөхцөл: ${order.creditTermDays
          } өдөр. Төлбөр төлөх өдөр: ${order.dueDate?.toLocaleDateString(
            "mn-MN"
          )}`
          : "Бэлэн мөнгөөр төлсөн",
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
    const showVat = req.query.showVat === "true"; // If true, show VAT; if false/undefined, show НӨАТ-гүй падаан

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
      throw new AppError("Захиалгын харилцагчийн мэдээлэл дутуу байна", 500);
    }

    if (!order.agent) {
      throw new AppError("Захиалгын борлуулагчийн мэдээлэл дутуу байна", 500);
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

    // Detect B2B (organization with TIN)
    const isB2B = !!order.customer.registrationNumber;

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
          classificationCode: item.product.classificationCode || undefined,
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
          ? "E-Barimt системд холбогдох боломжгүй байна. API серверийг шалгана уу."
          : `E-Bариmt баримт бүртгэл амжилтгүй [${errorCode}]: ${errorMsg}`;

        throw new AppError(userMessage, 500);
      }

      logger.info(`E-Barimt registration successful for order ${order.id}`, {
        billId: ebarimtResult.data.billId,
        lottery: ebarimtResult.data.lottery,
      });

      // Persist only ДДТД and registration status (NOT lottery/qrData per legal requirement)
      await prisma.order.update({
        where: { id: order.id },
        data: {
          ebarimtId: ebarimtResult.data.id,
          ebarimtBillId: ebarimtResult.data.billId,
          ebarimtRegistered: true,
          ebarimtDate: new Date(ebarimtResult.data.date),
        },
      });

      // Keep lottery/qrData in memory for immediate PDF printing only
      ebarimtLotteryForPrint = ebarimtResult.data.lottery;
      ebarimtQrDataForPrint = ebarimtResult.data.qrData;

      order.ebarimtId = ebarimtResult.data.id;
      order.ebarimtBillId = ebarimtResult.data.billId;
      order.ebarimtRegistered = true;
      order.ebarimtDate = new Date(ebarimtResult.data.date);
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
        address: order.customer.address,
        phoneNumber: order.customer.phoneNumber,
        registrationNumber: order.customer.registrationNumber, // ТТД for B2B
      },
      agent: {
        name: order.agent.name,
        phoneNumber: order.agent.phoneNumber,
      },
      items: order.orderItems.map((item) => ({
        productName: item.product.nameMongolian,
        productCode: item.product.productCode || "N/A",
        barcode: item.product.barcode || undefined,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice.toString()),
        total: parseFloat(item.unitPrice.toString()) * item.quantity,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total,
      cityTax: Math.round(cityTax * 100) / 100, // НХАТ
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paidAmount: parseFloat(order.paidAmount?.toString() || "0"),
      remainingAmount: parseFloat(order.remainingAmount?.toString() || "0"),
      creditTermDays: order.creditTermDays,
      dueDate: order.dueDate,
      // E-Barimt fields (lottery/qrData from memory only, not persisted)
      ebarimtId: order.ebarimtId,
      ebarimtBillId: order.ebarimtBillId,
      ebarimtLottery: isB2B ? undefined : ebarimtLotteryForPrint,
      ebarimtQrData: ebarimtQrDataForPrint,
      ebarimtRegistered: order.ebarimtRegistered,
      ebarimtDate: order.ebarimtDate,
      isB2B, // Flag for PDF service
      showVat: showVat, // true = НӨАТ-тай, false = НӨАТ-гүй падаан
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
