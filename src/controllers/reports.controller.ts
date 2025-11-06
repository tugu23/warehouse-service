import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

export const getSalesReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate, agentId, customerId } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Start date and end date are required", 400);
    }

    const where: any = {
      orderDate: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    };

    if (agentId) {
      where.agentId = parseInt(agentId as string);
    }

    if (customerId) {
      where.customerId = parseInt(customerId as string);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                nameMongolian: true,
                productCode: true,
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { orderDate: "asc" },
    });

    // Calculate summary
    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + parseFloat(order.totalAmount?.toString() || "0"),
        0
      ),
      totalPaid: orders.reduce(
        (sum, order) => sum + parseFloat(order.paidAmount?.toString() || "0"),
        0
      ),
      totalUnpaid: orders.reduce(
        (sum, order) =>
          sum + parseFloat(order.remainingAmount?.toString() || "0"),
        0
      ),
      byPaymentMethod: {} as Record<string, number>,
      byPaymentStatus: {} as Record<string, number>,
    };

    orders.forEach((order) => {
      summary.byPaymentMethod[order.paymentMethod] =
        (summary.byPaymentMethod[order.paymentMethod] || 0) + 1;
      summary.byPaymentStatus[order.paymentStatus] =
        (summary.byPaymentStatus[order.paymentStatus] || 0) + 1;
    });

    const reportData = {
      dateRange: {
        startDate: startDate as string,
        endDate: endDate as string,
      },
      summary,
      orders: orders.map((order) => ({
        orderId: order.id,
        orderDate: order.orderDate,
        orderNumber: `ORD-${order.id.toString().padStart(6, "0")}`,
        customer: order.customer.name,
        agent: order.agent.name,
        totalAmount: parseFloat(order.totalAmount?.toString() || "0"),
        paidAmount: parseFloat(order.paidAmount?.toString() || "0"),
        remainingAmount: parseFloat(order.remainingAmount?.toString() || "0"),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        items: order.orderItems.map((item) => ({
          product: item.product.nameMongolian,
          productCode: item.product.productCode,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice.toString()),
          total: parseFloat(item.unitPrice.toString()) * item.quantity,
        })),
      })),
    };

    res.json({
      status: "success",
      data: { report: reportData },
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categoryId, supplierId, lowStock } = req.query;

    const where: any = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }

    if (supplierId) {
      where.supplierId = parseInt(supplierId as string);
    }

    if (lowStock === "true") {
      where.stockQuantity = {
        lt: 10, // Low stock threshold
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            nameMongolian: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        batches: {
          where: {
            isActive: true,
          },
          orderBy: {
            expiryDate: "asc",
          },
        },
      },
      orderBy: {
        nameMongolian: "asc",
      },
    });

    const reportData = {
      totalProducts: products.length,
      totalStockValue: products.reduce(
        (sum, product) =>
          sum +
          product.stockQuantity *
            parseFloat(product.priceWholesale?.toString() || "0"),
        0
      ),
      lowStockProducts: products.filter((p) => p.stockQuantity < 10).length,
      products: products.map((product) => ({
        id: product.id,
        productCode: product.productCode,
        name: product.nameMongolian,
        category: product.category?.nameMongolian || "N/A",
        supplier: product.supplier?.name || "N/A",
        stockQuantity: product.stockQuantity,
        priceWholesale: parseFloat(product.priceWholesale?.toString() || "0"),
        priceRetail: parseFloat(product.priceRetail?.toString() || "0"),
        stockValue:
          product.stockQuantity *
          parseFloat(product.priceWholesale?.toString() || "0"),
        batches: product.batches.map((batch) => ({
          batchNumber: batch.batchNumber,
          quantity: batch.quantity,
          arrivalDate: batch.arrivalDate,
          expiryDate: batch.expiryDate,
          daysUntilExpiry: batch.expiryDate
            ? Math.ceil(
                (batch.expiryDate.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null,
        })),
      })),
    };

    res.json({
      status: "success",
      data: { report: reportData },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomersReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerTypeId, agentId } = req.query;

    const where: any = {};

    if (customerTypeId) {
      where.customerTypeId = parseInt(customerTypeId as string);
    }

    if (agentId) {
      where.assignedAgentId = parseInt(agentId as string);
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        customerType: {
          select: {
            id: true,
            typeName: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            name: true,
          },
        },
        orders: {
          select: {
            id: true,
            totalAmount: true,
            paidAmount: true,
            remainingAmount: true,
            orderDate: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const reportData = {
      totalCustomers: customers.length,
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        phoneNumber: customer.phoneNumber || "N/A",
        address: customer.address || "N/A",
        customerType: customer.customerType?.typeName || "N/A",
        assignedAgent: customer.assignedAgent?.name || "N/A",
        totalOrders: customer.orders.length,
        totalSpent: customer.orders.reduce(
          (sum, order) =>
            sum + parseFloat(order.totalAmount?.toString() || "0"),
          0
        ),
        totalPaid: customer.orders.reduce(
          (sum, order) => sum + parseFloat(order.paidAmount?.toString() || "0"),
          0
        ),
        totalUnpaid: customer.orders.reduce(
          (sum, order) =>
            sum + parseFloat(order.remainingAmount?.toString() || "0"),
          0
        ),
        lastOrderDate: customer.orders.length
          ? customer.orders[customer.orders.length - 1].orderDate
          : null,
      })),
    };

    res.json({
      status: "success",
      data: { report: reportData },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderExport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
      throw new AppError("Order not found", 404);
    }

    const exportData = {
      orderNumber: `ORD-${order.id.toString().padStart(6, "0")}`,
      orderDate: order.orderDate,
      customer: {
        name: order.customer.name,
        phoneNumber: order.customer.phoneNumber,
        address: order.customer.address,
      },
      agent: {
        name: order.agent.name,
        phoneNumber: order.agent.phoneNumber,
      },
      items: order.orderItems.map((item, index) => ({
        no: index + 1,
        productCode: item.product.productCode,
        productName: item.product.nameMongolian,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice.toString()),
        total: parseFloat(item.unitPrice.toString()) * item.quantity,
      })),
      totalAmount: parseFloat(order.totalAmount?.toString() || "0"),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paidAmount: parseFloat(order.paidAmount?.toString() || "0"),
      remainingAmount: parseFloat(order.remainingAmount?.toString() || "0"),
      creditTermDays: order.creditTermDays,
      dueDate: order.dueDate,
      payments: order.payments.map((p) => ({
        date: p.paymentDate,
        amount: parseFloat(p.amount.toString()),
        method: p.paymentMethod,
        notes: p.notes,
      })),
    };

    res.json({
      status: "success",
      data: { export: exportData },
    });
  } catch (error) {
    next(error);
  }
};

export const getCreditStatusReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerId, agentId } = req.query;

    const where: any = {
      paymentMethod: "Credit",
      paymentStatus: {
        in: ["Pending", "Partial", "Overdue"],
      },
    };

    if (customerId) {
      where.customerId = parseInt(customerId as string);
    }

    if (agentId) {
      where.agentId = parseInt(agentId as string);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
        payments: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const now = new Date();

    const reportData = {
      summary: {
        totalCreditOrders: orders.length,
        totalCreditAmount: orders.reduce(
          (sum, order) =>
            sum + parseFloat(order.remainingAmount?.toString() || "0"),
          0
        ),
        overdueCount: orders.filter(
          (order) => order.dueDate && order.dueDate < now
        ).length,
        overdueAmount: orders
          .filter((order) => order.dueDate && order.dueDate < now)
          .reduce(
            (sum, order) =>
              sum + parseFloat(order.remainingAmount?.toString() || "0"),
            0
          ),
      },
      orders: orders.map((order) => ({
        orderId: order.id,
        orderNumber: `ORD-${order.id.toString().padStart(6, "0")}`,
        orderDate: order.orderDate,
        customer: order.customer.name,
        customerPhone: order.customer.phoneNumber,
        agent: order.agent.name,
        totalAmount: parseFloat(order.totalAmount?.toString() || "0"),
        paidAmount: parseFloat(order.paidAmount?.toString() || "0"),
        remainingAmount: parseFloat(order.remainingAmount?.toString() || "0"),
        creditTermDays: order.creditTermDays,
        dueDate: order.dueDate,
        daysOverdue: order.dueDate
          ? Math.max(
              0,
              Math.ceil(
                (now.getTime() - order.dueDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0,
        paymentStatus: order.paymentStatus,
        paymentCount: order.payments.length,
      })),
    };

    res.json({
      status: "success",
      data: { report: reportData },
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryScheduleReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate, agentId, status } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Start date and end date are required", 400);
    }

    const where: any = {
      planDate: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    };

    if (agentId) {
      where.agentId = parseInt(agentId as string);
    }

    if (status) {
      where.status = status;
    }

    const plans = await prisma.deliveryPlan.findMany({
      where,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            address: true,
            phoneNumber: true,
            locationLatitude: true,
            locationLongitude: true,
          },
        },
      },
      orderBy: [{ planDate: "asc" }, { scheduledTime: "asc" }],
    });

    const reportData = {
      dateRange: {
        startDate: startDate as string,
        endDate: endDate as string,
      },
      summary: {
        totalPlans: plans.length,
        byStatus: {} as Record<string, number>,
      },
      plans: plans.map((plan) => ({
        id: plan.id,
        planDate: plan.planDate,
        scheduledTime: plan.scheduledTime,
        agent: plan.agent.name,
        agentPhone: plan.agent.phoneNumber,
        customer: plan.customer.name,
        customerAddress: plan.customer.address,
        customerPhone: plan.customer.phoneNumber,
        location: {
          latitude: plan.customer.locationLatitude,
          longitude: plan.customer.locationLongitude,
        },
        status: plan.status,
        deliveryNotes: plan.deliveryNotes,
        actualDeliveryTime: plan.actualDeliveryTime,
      })),
    };

    plans.forEach((plan) => {
      reportData.summary.byStatus[plan.status] =
        (reportData.summary.byStatus[plan.status] || 0) + 1;
    });

    res.json({
      status: "success",
      data: { report: reportData },
    });
  } catch (error) {
    next(error);
  }
};

