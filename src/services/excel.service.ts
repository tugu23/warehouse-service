import ExcelJS from "exceljs";
import { Order, Customer, Product } from "@prisma/client";

export class ExcelService {
  /**
   * Export orders to Excel
   */
  static async exportOrdersToExcel(orders: any[]): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // Define columns
    worksheet.columns = [
      { header: "Захиалгын дугаар", key: "orderNumber", width: 20 },
      { header: "Огноо", key: "orderDate", width: 15 },
      { header: "Харилцагч", key: "customerName", width: 30 },
      { header: "Борлуулагч", key: "agentName", width: 25 },
      { header: "Төлөв", key: "status", width: 15 },
      { header: "Төлбөрийн хэлбэр", key: "paymentMethod", width: 20 },
      { header: "Төлбөрийн төлөв", key: "paymentStatus", width: 20 },
      { header: "Нийт дүн", key: "totalAmount", width: 15 },
      { header: "Төлсөн дүн", key: "paidAmount", width: 15 },
      { header: "Үлдэгдэл дүн", key: "remainingAmount", width: 15 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Add data
    orders.forEach((order) => {
      worksheet.addRow({
        orderNumber: `ORD-${order.id.toString().padStart(6, "0")}`,
        orderDate: new Date(order.orderDate).toLocaleDateString("mn-MN"),
        customerName: order.customer?.name || "N/A",
        agentName: order.agent?.name || "N/A",
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: parseFloat(order.totalAmount?.toString() || "0"),
        paidAmount: parseFloat(order.paidAmount?.toString() || "0"),
        remainingAmount: parseFloat(order.remainingAmount?.toString() || "0"),
      });
    });

    // Format currency columns
    worksheet.getColumn("totalAmount").numFmt = "#,##0.00";
    worksheet.getColumn("paidAmount").numFmt = "#,##0.00";
    worksheet.getColumn("remainingAmount").numFmt = "#,##0.00";

    return await workbook.xlsx.writeBuffer();
  }

  /**
   * Export sales report to Excel
   */
  static async exportSalesReportToExcel(reportData: any): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Summary sheet
    const summarySheet = workbook.addWorksheet("Нэгтгэл");
    summarySheet.columns = [
      { header: "Үзүүлэлт", key: "metric", width: 30 },
      { header: "Утга", key: "value", width: 20 },
    ];
    
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.addRows([
      { metric: "Нийт захиалга", value: reportData.summary.totalOrders },
      { metric: "Нийт борлуулалт", value: reportData.summary.totalRevenue },
      { metric: "Төлсөн дүн", value: reportData.summary.totalPaid },
      { metric: "Төлөөгүй дүн", value: reportData.summary.totalUnpaid },
    ]);

    // Orders sheet
    const ordersSheet = workbook.addWorksheet("Захиалгууд");
    ordersSheet.columns = [
      { header: "Дугаар", key: "orderNumber", width: 20 },
      { header: "Огноо", key: "orderDate", width: 15 },
      { header: "Харилцагч", key: "customer", width: 30 },
      { header: "Борлуулагч", key: "agent", width: 25 },
      { header: "Нийт дүн", key: "totalAmount", width: 15 },
      { header: "Төлсөн дүн", key: "paidAmount", width: 15 },
      { header: "Үлдэгдэл дүн", key: "remainingAmount", width: 15 },
      { header: "Төлбөрийн хэлбэр", key: "paymentMethod", width: 20 },
      { header: "Төлбөрийн төлөв", key: "paymentStatus", width: 20 },
      { header: "Төлөв", key: "status", width: 15 },
    ];

    ordersSheet.getRow(1).font = { bold: true };
    ordersSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    reportData.orders.forEach((order: any) => {
      ordersSheet.addRow({
        orderNumber: order.orderNumber,
        orderDate: new Date(order.orderDate).toLocaleDateString("mn-MN"),
        customer: order.customer,
        agent: order.agent,
        totalAmount: order.totalAmount,
        paidAmount: order.paidAmount,
        remainingAmount: order.remainingAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
      });
    });

    ordersSheet.getColumn("totalAmount").numFmt = "#,##0.00";
    ordersSheet.getColumn("paidAmount").numFmt = "#,##0.00";
    ordersSheet.getColumn("remainingAmount").numFmt = "#,##0.00";

    return await workbook.xlsx.writeBuffer();
  }

  /**
   * Export customers to Excel
   */
  static async exportCustomersToExcel(customers: any[]): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Харилцагчид");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Нэр", key: "name", width: 30 },
      { header: "Байгууллагын нэр", key: "organizationName", width: 30 },
      { header: "Байгууллагын төрөл", key: "organizationType", width: 20 },
      { header: "Регистр", key: "registrationNumber", width: 20 },
      { header: "Дүүрэг", key: "district", width: 15 },
      { header: "Хаяг", key: "address", width: 40 },
      { header: "Утас", key: "phoneNumber", width: 15 },
      { header: "НӨАТ төлөгч", key: "isVatPayer", width: 15 },
      { header: "Төлбөрийн нөхцөл", key: "paymentTerms", width: 20 },
      { header: "Төрөл", key: "customerType", width: 15 },
      { header: "Хариуцсан борлуулагч", key: "assignedAgent", width: 25 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    customers.forEach((customer) => {
      worksheet.addRow({
        id: customer.id,
        name: customer.name,
        organizationName: customer.organizationName || "N/A",
        organizationType: customer.organizationType || "N/A",
        registrationNumber: customer.registrationNumber || "N/A",
        district: customer.district || "N/A",
        address: customer.address || "N/A",
        phoneNumber: customer.phoneNumber || "N/A",
        isVatPayer: customer.isVatPayer ? "Тийм" : "Үгүй",
        paymentTerms: customer.paymentTerms || "N/A",
        customerType: customer.customerType?.typeName || "N/A",
        assignedAgent: customer.assignedAgent?.name || "N/A",
      });
    });

    return await workbook.xlsx.writeBuffer();
  }

  /**
   * Export products to Excel
   */
  static async exportProductsToExcel(products: any[]): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Барааны жагсаалт");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Код", key: "productCode", width: 15 },
      { header: "Баркод", key: "barcode", width: 15 },
      { header: "Монгол нэр", key: "nameMongolian", width: 30 },
      { header: "Англи нэр", key: "nameEnglish", width: 30 },
      { header: "Солонгос нэр", key: "nameKorean", width: 30 },
      { header: "Ангилал", key: "category", width: 20 },
      { header: "Үлдэгдэл", key: "stockQuantity", width: 12 },
      { header: "Хайрцаг дахь тоо", key: "unitsPerBox", width: 15 },
      { header: "Бөөний үнэ", key: "priceWholesale", width: 15 },
      { header: "Жижиглэнгийн үнэ", key: "priceRetail", width: 18 },
      { header: "Хайрцагны үнэ", key: "pricePerBox", width: 15 },
      { header: "Цэвэр жин (кг)", key: "netWeight", width: 15 },
      { header: "Бохир жин (кг)", key: "grossWeight", width: 15 },
      { header: "Нийлүүлэгч", key: "supplier", width: 25 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    products.forEach((product) => {
      worksheet.addRow({
        id: product.id,
        productCode: product.productCode || "N/A",
        barcode: product.barcode || "N/A",
        nameMongolian: product.nameMongolian,
        nameEnglish: product.nameEnglish || "N/A",
        nameKorean: product.nameKorean || "N/A",
        category: product.category?.nameMongolian || "N/A",
        stockQuantity: product.stockQuantity,
        unitsPerBox: product.unitsPerBox || "N/A",
        priceWholesale: parseFloat(product.priceWholesale?.toString() || "0"),
        priceRetail: parseFloat(product.priceRetail?.toString() || "0"),
        pricePerBox: parseFloat(product.pricePerBox?.toString() || "0"),
        netWeight: parseFloat(product.netWeight?.toString() || "0"),
        grossWeight: parseFloat(product.grossWeight?.toString() || "0"),
        supplier: product.supplier?.name || "N/A",
      });
    });

    worksheet.getColumn("priceWholesale").numFmt = "#,##0.00";
    worksheet.getColumn("priceRetail").numFmt = "#,##0.00";
    worksheet.getColumn("pricePerBox").numFmt = "#,##0.00";
    worksheet.getColumn("netWeight").numFmt = "#,##0.000";
    worksheet.getColumn("grossWeight").numFmt = "#,##0.000";

    return await workbook.xlsx.writeBuffer();
  }

  /**
   * Export inventory report to Excel
   */
  static async exportInventoryToExcel(reportData: any): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Summary sheet
    const summarySheet = workbook.addWorksheet("Нэгтгэл");
    summarySheet.columns = [
      { header: "Үзүүлэлт", key: "metric", width: 30 },
      { header: "Утга", key: "value", width: 20 },
    ];
    
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.addRows([
      { metric: "Нийт бараа", value: reportData.totalProducts },
      { metric: "Нийт үлдэгдлийн үнэ", value: reportData.totalStockValue },
      { metric: "Бага үлдэгдэлтэй бараа", value: reportData.lowStockProducts },
    ]);

    summarySheet.getColumn("value").numFmt = "#,##0.00";

    // Products sheet
    const productsSheet = workbook.addWorksheet("Барааны үлдэгдэл");
    productsSheet.columns = [
      { header: "Код", key: "productCode", width: 15 },
      { header: "Нэр", key: "name", width: 30 },
      { header: "Ангилал", key: "category", width: 20 },
      { header: "Нийлүүлэгч", key: "supplier", width: 25 },
      { header: "Үлдэгдэл", key: "stockQuantity", width: 12 },
      { header: "Бөөний үнэ", key: "priceWholesale", width: 15 },
      { header: "Үлдэгдлийн үнэ", key: "stockValue", width: 18 },
    ];

    productsSheet.getRow(1).font = { bold: true };
    productsSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    reportData.products.forEach((product: any) => {
      productsSheet.addRow({
        productCode: product.productCode || "N/A",
        name: product.name,
        category: product.category,
        supplier: product.supplier,
        stockQuantity: product.stockQuantity,
        priceWholesale: product.priceWholesale,
        stockValue: product.stockValue,
      });
    });

    productsSheet.getColumn("priceWholesale").numFmt = "#,##0.00";
    productsSheet.getColumn("stockValue").numFmt = "#,##0.00";

    return await workbook.xlsx.writeBuffer();
  }

  /**
   * Export single order with details to Excel
   */
  static async exportSingleOrderToExcel(order: any): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Захиалгын дэлгэрэнгүй");

    // Order header info
    worksheet.addRow(["ЗАХИАЛГЫН БАРИМТ"]);
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    
    worksheet.addRow([]);
    worksheet.addRow(["Захиалгын дугаар:", `ORD-${order.id.toString().padStart(6, "0")}`]);
    worksheet.addRow(["Огноо:", new Date(order.orderDate).toLocaleDateString("mn-MN")]);
    worksheet.addRow(["Харилцагч:", order.customer.name]);
    worksheet.addRow(["Утас:", order.customer.phoneNumber || "N/A"]);
    worksheet.addRow(["Хаяг:", order.customer.address || "N/A"]);
    worksheet.addRow(["Борлуулагч:", order.agent.name]);
    worksheet.addRow([]);

    // Items table
    worksheet.addRow(["№", "Барааны код", "Барааны нэр", "Тоо ширхэг", "Нэгж үнэ", "Нийт дүн"]);
    const headerRow = worksheet.lastRow;
    if (headerRow) {
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
    }

    order.orderItems.forEach((item: any, index: number) => {
      worksheet.addRow([
        index + 1,
        item.product.productCode || "N/A",
        item.product.nameMongolian,
        item.quantity,
        parseFloat(item.unitPrice.toString()),
        parseFloat(item.unitPrice.toString()) * item.quantity,
      ]);
    });

    worksheet.addRow([]);
    worksheet.addRow(["", "", "", "", "Нийт дүн:", parseFloat(order.totalAmount?.toString() || "0")]);
    worksheet.addRow(["", "", "", "", "Төлбөрийн хэлбэр:", order.paymentMethod]);
    worksheet.addRow(["", "", "", "", "Төлбөрийн төлөв:", order.paymentStatus]);

    // Format currency columns
    worksheet.getColumn(5).numFmt = "#,##0.00";
    worksheet.getColumn(6).numFmt = "#,##0.00";

    // Set column widths
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;

    return await workbook.xlsx.writeBuffer();
  }
}

export default ExcelService;

