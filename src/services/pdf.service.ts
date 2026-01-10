import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { RobotoRegular } from "../fonts/Roboto-Regular";
import { RobotoBold } from "../fonts/Roboto-Bold";

interface ReceiptItem {
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ReceiptData {
  orderId: number;
  orderNumber: string;
  orderDate: Date;
  orderType: "Store" | "Market";
  status: string;
  customer: {
    name: string;
    address?: string | null;
    phoneNumber?: string | null;
    registrationNumber?: string | null; // ТТД - for B2B detection
  };
  agent: {
    name: string;
    phoneNumber?: string | null;
  };
  items: ReceiptItem[];
  subtotal: number;
  vat: number;
  total: number;
  cityTax?: number; // НХАТ
  paymentMethod: string;
  paymentStatus: string;
  paidAmount: number;
  remainingAmount: number;
  creditTermDays?: number | null;
  dueDate?: Date | null;
  // E-Barimt fields
  ebarimtId?: string | null;
  ebarimtBillId?: string | null;
  ebarimtLottery?: string | null;
  ebarimtQrData?: string | null;
  ebarimtRegistered?: boolean;
  ebarimtDate?: Date | null;
  // B2B flag - organizations don't get lottery numbers
  isB2B?: boolean;
}

class PDFService {
  private readonly COMPANY_NAME = "GLF LLC OASIS Boony tov";
  private readonly COMPANY_NAME_EN = "GLF LLC OASIS Wholesale Center";
  private readonly COMPANY_ADDRESS =
    "Mongol, Ulaanbaatar, Sukhbaatar duureg, 6-r khoroo, 27-49";
  private readonly COMPANY_ADDRESS_EN =
    "Mongolia, Ulaanbaatar, Sukhbaatar, 6th khoroo, 27-49";
  private readonly COMPANY_PHONES = ["70121128", "88048350", "89741277"];
  private readonly COMPANY_TIN = "5317878"; // Tax Identification Number (TTD)
  private readonly COMPANY_EMAIL = "info@warehouse.mn";

  async generateOrderReceiptPDF(data: ReceiptData): Promise<Buffer> {
    try {
      // A5 Format: 148mm x 210mm (portrait)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [148, 210], // A5 size
      });

      // Try to add custom fonts with error handling
      try {
        doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
        doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
        doc.setFont("Roboto", "normal");
        console.log("Custom Roboto fonts loaded successfully");
      } catch (fontError) {
        console.error(
          "Failed to load custom fonts, falling back to helvetica:",
          fontError
        );
        // Fallback to helvetica if custom font fails
        doc.setFont("helvetica", "normal");
      }

      // Generate QR Code (E-Barimt QR if available, otherwise order QR)
      const qrCodeDataURL = await this.generateQRCode(data);

      // Add content to PDF (A5 format optimized)
      let yPos = this.addA5Header(doc);
      yPos = this.addA5GeneralInfo(doc, data, yPos);
      yPos = this.addA5SellerInfo(doc, data, yPos);
      yPos = this.addA5BuyerInfo(doc, data, yPos);
      yPos = this.addA5StoreInfo(doc, yPos);
      yPos = this.addA5ItemsTable(doc, data, yPos);
      yPos = this.addA5VATInfo(doc, data, yPos);
      yPos = this.addA5QRCodeAndLottery(doc, data, qrCodeDataURL, yPos);
      this.addA5Footer(doc);

      // Convert to Buffer
      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

      return pdfBuffer;
    } catch (error) {
      console.error("Error in generateOrderReceiptPDF:", error);
      throw new Error(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // A5 Format Methods (148mm x 210mm)
  private addA5Header(doc: jsPDF): number {
    let yPos = 10;

    // Title - centered
    doc.setFontSize(14);
    doc.setFont("Roboto", "bold");
    doc.text("Warehouse Goods Registration System", 74, yPos, {
      align: "center",
    });

    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.text("E-Barimt Receipt / Payment Receipt", 74, yPos, {
      align: "center",
    });

    // Divider line
    yPos += 4;
    doc.setLineWidth(0.3);
    doc.line(10, yPos, 138, yPos);

    return yPos + 5;
  }

  private addA5GeneralInfo(
    doc: jsPDF,
    data: ReceiptData,
    yPos: number
  ): number {
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text("1. Баримтын ерөнхий мэдээлэл", 10, yPos);

    yPos += 5;
    doc.setFontSize(8);

    // Receipt number
    doc.setFont("Roboto", "bold");
    doc.text("Зарлагын падаан №:", 12, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(data.orderNumber || "N/A", 50, yPos);

    // E-Barimt DDTD
    if (data.ebarimtBillId) {
      yPos += 4;
      doc.setFont("Roboto", "bold");
      doc.text("ДДТД:", 12, yPos);
      doc.setFont("Roboto", "normal");
      doc.text(data.ebarimtBillId, 50, yPos);
    }

    // TIN
    yPos += 4;
    doc.setFont("Roboto", "bold");
    doc.text("ТТД:", 12, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.COMPANY_TIN, 50, yPos);

    // Registration date
    if (data.ebarimtDate) {
      yPos += 4;
      doc.setFont("Roboto", "bold");
      doc.text("Баримт бүртгэгдсэн огноо:", 12, yPos);
      doc.setFont("Roboto", "normal");
      doc.text(this.formatDateMongolian(data.ebarimtDate), 60, yPos);
    }

    // Order date
    yPos += 4;
    doc.setFont("Roboto", "bold");
    doc.text("Бараа олгосон огноо:", 12, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.formatDateMongolian(data.orderDate), 60, yPos);

    // Payment method
    yPos += 4;
    doc.setFont("Roboto", "bold");
    doc.text("Төлбөрийн хэлбэр:", 12, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.translatePaymentMethod(data.paymentMethod), 50, yPos);

    // Divider
    yPos += 4;
    doc.setLineWidth(0.2);
    doc.line(10, yPos, 138, yPos);

    return yPos + 4;
  }

  private addA5SellerInfo(doc: jsPDF, data: ReceiptData, yPos: number): number {
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text("2. Борлуулагчийн мэдээлэл", 10, yPos);

    yPos += 5;
    doc.setFontSize(8);

    // Seller name
    doc.setFont("Roboto", "bold");
    doc.text("Нэр:", 12, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(data.agent.name || "N/A", 25, yPos);

    // Seller phone
    if (data.agent.phoneNumber) {
      yPos += 4;
      doc.setFont("Roboto", "bold");
      doc.text("Утас:", 12, yPos);
      doc.setFont("Roboto", "normal");
      doc.text(data.agent.phoneNumber, 25, yPos);
    }

    // Divider
    yPos += 4;
    doc.setLineWidth(0.2);
    doc.line(10, yPos, 138, yPos);

    return yPos + 4;
  }

  private addA5BuyerInfo(doc: jsPDF, data: ReceiptData, yPos: number): number {
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text("3. Худалдан авагчийн мэдээлэл", 10, yPos);

    yPos += 5;
    doc.setFontSize(8);

    // Buyer name
    doc.setFont("Roboto", "bold");
    doc.text("Нэр:", 12, yPos);
    doc.setFont("Roboto", "normal");
    const buyerName = data.customer.name || "N/A";
    // Wrap long names
    if (buyerName.length > 40) {
      const lines = doc.splitTextToSize(buyerName, 100);
      doc.text(lines[0], 25, yPos);
      if (lines[1]) {
        yPos += 4;
        doc.text(lines[1], 25, yPos);
      }
    } else {
      doc.text(buyerName, 25, yPos);
    }

    // Buyer phone
    if (data.customer.phoneNumber) {
      yPos += 4;
      doc.setFont("Roboto", "bold");
      doc.text("Утас:", 12, yPos);
      doc.setFont("Roboto", "normal");
      doc.text(data.customer.phoneNumber, 25, yPos);
    }

    // Divider
    yPos += 4;
    doc.setLineWidth(0.2);
    doc.line(10, yPos, 138, yPos);

    return yPos + 4;
  }

  private addA5StoreInfo(doc: jsPDF, yPos: number): number {
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text("4. Дэлгүүр / Байгууллагын мэдээлэл", 10, yPos);

    yPos += 5;
    doc.setFontSize(8);

    // Store name
    doc.setFont("Roboto", "bold");
    doc.text("Нэр:", 12, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.COMPANY_NAME, 25, yPos);

    // Address
    yPos += 4;
    doc.setFont("Roboto", "bold");
    doc.text("Хаяг:", 12, yPos);
    doc.setFont("Roboto", "normal");
    const addressLines = doc.splitTextToSize(this.COMPANY_ADDRESS, 110);
    doc.text(addressLines, 25, yPos);
    if (addressLines.length > 1) {
      yPos += (addressLines.length - 1) * 4;
    }

    // Phones
    yPos += 4;
    doc.setFont("Roboto", "bold");
    doc.text("Утас:", 12, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.COMPANY_PHONES.join(", "), 25, yPos);

    // Divider
    yPos += 4;
    doc.setLineWidth(0.2);
    doc.line(10, yPos, 138, yPos);

    return yPos + 4;
  }

  private addA5ItemsTable(doc: jsPDF, data: ReceiptData, yPos: number): number {
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text("5. Худалдан авсан барааны жагсаалт", 10, yPos);

    yPos += 3;

    const tableData = data.items.map((item, index) => [
      (index + 1).toString(),
      item.productName,
      item.productCode,
      item.quantity.toString(),
      this.formatCurrencyShort(item.unitPrice),
      this.formatCurrencyShort(item.total),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["№", "Барааны нэр", "Баркод", "Тоо", "Нэгж үнэ", "Нийт үнэ"]],
      body: tableData,
      theme: "grid",
      styles: {
        font: "Roboto",
        fontStyle: "normal",
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
        fontSize: 7,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 7,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 8 },
        1: { cellWidth: 45 },
        2: { halign: "center", cellWidth: 25 },
        3: { halign: "center", cellWidth: 12 },
        4: { halign: "right", cellWidth: 20 },
        5: { halign: "right", cellWidth: 20 },
      },
      margin: { left: 10, right: 10 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || yPos;

    // Divider
    doc.setLineWidth(0.2);
    doc.line(10, finalY + 2, 138, finalY + 2);

    return finalY + 5;
  }

  private addA5VATInfo(doc: jsPDF, data: ReceiptData, yPos: number): number {
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text("6. Татварын мэдээлэл", 10, yPos);

    yPos += 5;
    doc.setFontSize(8);

    const xLabel = 12;
    const xValue = 100;

    // Subtotal (НӨАТ-гүй дүн)
    doc.setFont("Roboto", "bold");
    doc.text("Татваргүй дүн:", xLabel, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.formatCurrencyShort(data.subtotal), xValue, yPos, {
      align: "right",
    });

    // VAT
    yPos += 4;
    doc.setFont("Roboto", "bold");
    doc.text("НӨАТ (10%):", xLabel, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.formatCurrencyShort(data.vat), xValue, yPos, {
      align: "right",
    });

    // City Tax (NHAT) - only for Ulaanbaatar
    if (data.cityTax && data.cityTax > 0) {
      yPos += 4;
      doc.setFont("Roboto", "bold");
      doc.text("НХАТ (2%):", xLabel, yPos);
      doc.setFont("Roboto", "normal");
      doc.text(this.formatCurrencyShort(data.cityTax), xValue, yPos, {
        align: "right",
      });
    }

    // Total with all taxes
    yPos += 4;
    doc.setFont("Roboto", "bold");
    doc.text("Нийт дүн:", xLabel, yPos);
    doc.setFont("Roboto", "normal");
    doc.text(this.formatCurrencyShort(data.total), xValue, yPos, {
      align: "right",
    });

    // Divider
    yPos += 4;
    doc.setLineWidth(0.2);
    doc.line(10, yPos, 138, yPos);

    return yPos + 4;
  }

  private addA5QRCodeAndLottery(
    doc: jsPDF,
    data: ReceiptData,
    qrCodeDataURL: string,
    yPos: number
  ): number {
    // Detect B2B transaction (organization with TIN)
    const isB2B = data.isB2B || !!data.customer.registrationNumber;
    
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    
    // Different title for B2B vs B2C
    if (isB2B) {
      doc.text("7. QR код ба Баримтын мэдээлэл", 10, yPos);
    } else {
      doc.text("7. QR код ба Сугалааны дугаар", 10, yPos);
    }

    yPos += 5;

    // Add QR code
    const qrSize = 35;
    const qrX = 15;
    doc.addImage(qrCodeDataURL, "PNG", qrX, yPos, qrSize, qrSize);

    // B2B receipt - show customer TIN, NO lottery
    if (isB2B) {
      doc.setFontSize(9);
      doc.setFont("Roboto", "bold");
      doc.text("Байгууллагын баримт", qrX + qrSize + 10, yPos + 8);

      doc.setFontSize(8);
      doc.setFont("Roboto", "normal");
      
      // Customer TIN
      if (data.customer.registrationNumber) {
        doc.text(`Худалдан авагч ТТД: ${data.customer.registrationNumber}`, qrX + qrSize + 10, yPos + 14);
      }
      
      // Customer name
      const customerName = data.customer.name || "N/A";
      const nameLines = doc.splitTextToSize(`Нэр: ${customerName}`, 55);
      doc.text(nameLines, qrX + qrSize + 10, yPos + 20);
      
      // Note about no lottery for B2B
      doc.setFontSize(6);
      doc.setFont("Roboto", "normal");
      doc.text("(ААН-д сугалаа олгогдохгүй)", qrX + qrSize + 10, yPos + 30);
      
    } else {
      // B2C receipt - show lottery number
      if (data.ebarimtLottery) {
        doc.setFontSize(11);
        doc.setFont("Roboto", "bold");
        doc.text("Сугалаа:", qrX + qrSize + 10, yPos + 8);

        doc.setFontSize(16);
        doc.setFont("Roboto", "bold");
        doc.text(data.ebarimtLottery, qrX + qrSize + 10, yPos + 18);

        doc.setFontSize(7);
        doc.setFont("Roboto", "normal");
        const lotteryText = doc.splitTextToSize(
          "Та энэ дугаараа хадгалж, сарын эцэст сугалаанд оролцоно уу!",
          60
        );
        doc.text(lotteryText, qrX + qrSize + 10, yPos + 24);
      } else if (!data.ebarimtRegistered) {
        doc.setFontSize(8);
        doc.setFont("Roboto", "normal");
        doc.text("E-Barimt бүртгэлгүй", qrX + qrSize + 10, yPos + 15);
      }
    }

    // E-Barimt verification info
    doc.setFontSize(7);
    doc.setFont("Roboto", "normal");
    doc.text(
      "QR код уншуулж баримт шалгана уу",
      qrX + qrSize / 2,
      yPos + qrSize + 4,
      { align: "center" }
    );

    return yPos + qrSize + 10;
  }

  private addA5Footer(doc: jsPDF): void {
    const pageHeight = 210; // A5 height in mm
    const yPos = pageHeight - 10;

    doc.setFontSize(7);
    doc.setFont("Roboto", "normal");
    doc.text("Худалдан авалт хийсэнд баярлалаа!", 74, yPos, {
      align: "center",
    });
    doc.text(
      `Хэвлэсэн огноо: ${this.formatDateTime(new Date())}`,
      74,
      yPos + 3,
      { align: "center" }
    );
  }

  private async generateQRCode(data: ReceiptData): Promise<string> {
    // Prefer e-Barimt QR data if available
    let qrData: string;

    if (data.ebarimtQrData) {
      qrData = data.ebarimtQrData;
    } else {
      // Fallback to order QR
      qrData = JSON.stringify({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        total: data.total,
        date: data.orderDate,
      });
    }

    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 1,
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      // Return empty data URL if QR generation fails
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    }
  }

  private formatCurrency(amount: number): string {
    return `₮${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  private formatCurrencyShort(amount: number): string {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  private formatDateMongolian(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private formatDateTime(date: Date): string {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  private translatePaymentMethod(method: string): string {
    const translations: { [key: string]: string } = {
      Cash: "Бэлэн",
      Card: "Карт",
      BankTransfer: "Шилжүүлэг",
      Credit: "Зээл",
      QR: "QR",
      Mobile: "Гар утас",
    };
    return translations[method] || method;
  }
}

export default new PDFService();
