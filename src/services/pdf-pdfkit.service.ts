import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
import QRCode from "qrcode";
import * as path from "path";
import * as fs from "fs";

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
  };
  agent: {
    name: string;
    phoneNumber?: string | null;
  };
  items: ReceiptItem[];
  subtotal: number;
  vat: number;
  total: number;
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
}

class PDFKitService {
  private readonly COMPANY_NAME = "GLF LLC OASIS Бөөний төв";
  private readonly COMPANY_ADDRESS =
    "Монгол, Улаанбаатар, Сүхбаатар дүүрэг, 6-р хороо, 27-49";
  private readonly COMPANY_PHONES = ["70121128", "88048350", "89741277"];
  private readonly COMPANY_TIN = "5317878";

  // A5 dimensions in points (72 points = 1 inch, A5 = 148mm x 210mm)
  private readonly PAGE_WIDTH = 419.53; // 148mm in points
  private readonly PAGE_HEIGHT = 595.28; // 210mm in points
  private readonly MARGIN = 28.35; // 10mm in points
  private readonly CONTENT_WIDTH = this.PAGE_WIDTH - 2 * this.MARGIN;

  async generateOrderReceiptPDF(data: ReceiptData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create PDF document with UTF-8 encoding
        const doc = new PDFDocument({
          size: [this.PAGE_WIDTH, this.PAGE_HEIGHT],
          margins: {
            top: this.MARGIN,
            bottom: this.MARGIN,
            left: this.MARGIN,
            right: this.MARGIN,
          },
          bufferPages: true,
          autoFirstPage: true,
        });

        // Register Roboto fonts for Cyrillic support
        try {
          // Determine font path based on environment
          let fontPath: string;
          let regularFont: string;
          let boldFont: string;
          
          // Check if running from dist (production) or src (development)
          if (__dirname.includes('/dist/')) {
            // Production: fonts are in dist/fonts/
            fontPath = path.join(__dirname, "../fonts");
            regularFont = path.join(fontPath, "Roboto-Regular.ttf");
            boldFont = path.join(fontPath, "Roboto-Bold.ttf");
          } else {
            // Development: fonts are in src/fonts/
            fontPath = path.join(__dirname, "../fonts");
            regularFont = path.join(fontPath, "Roboto-Regular.ttf");
            boldFont = path.join(fontPath, "Roboto-Bold.ttf");
          }
          
          console.log("=== Font Loading Debug ===");
          console.log("__dirname:", __dirname);
          console.log("Font path:", fontPath);
          console.log("Regular font:", regularFont);
          console.log("Bold font:", boldFont);
          console.log("Regular font exists:", fs.existsSync(regularFont));
          console.log("Bold font exists:", fs.existsSync(boldFont));
          
          if (fs.existsSync(regularFont) && fs.existsSync(boldFont)) {
            doc.registerFont("Roboto", regularFont);
            doc.registerFont("Roboto-Bold", boldFont);
            doc.font("Roboto");
            console.log("✅ Fonts registered successfully!");
          } else {
            console.error("❌ Font files not found!");
            console.error("Tried paths:");
            console.error("  Regular:", regularFont);
            console.error("  Bold:", boldFont);
            doc.font("Courier");
          }
        } catch (fontError) {
          console.error("❌ Font loading error:", fontError);
          doc.font("Courier");
        }

        // Collect PDF data
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Generate QR code
        const qrCodeDataURL = await this.generateQRCode(data);

        // Add content
        let yPos = this.MARGIN;
        yPos = this.addHeader(doc, yPos);
        yPos = this.addGeneralInfo(doc, data, yPos);
        yPos = this.addSellerInfo(doc, data, yPos);
        yPos = this.addBuyerInfo(doc, data, yPos);
        yPos = this.addStoreInfo(doc, yPos);
        yPos = this.addItemsTable(doc, data, yPos);
        yPos = this.addVATInfo(doc, data, yPos);
        yPos = await this.addQRCodeAndLottery(doc, data, qrCodeDataURL, yPos);
        this.addFooter(doc);

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addHeader(doc: PDFKit.PDFDocument, yPos: number): number {
    // Main title
    doc
      .fontSize(14)
      .font("Roboto-Bold")
      .text("Агуулахын бараа бүртгэлийн систем", this.MARGIN, yPos, {
        width: this.CONTENT_WIDTH,
        align: "center",
      });

    yPos += 20;

    // Subtitle
    doc
      .fontSize(10)
      .font("Roboto")
      .text("E-Barimt Receipt / Төлбөрийн баримт", this.MARGIN, yPos, {
        width: this.CONTENT_WIDTH,
        align: "center",
      });

    yPos += 15;

    // Divider line
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .stroke();

    return yPos + 15;
  }

  private addGeneralInfo(doc: PDFKit.PDFDocument, data: ReceiptData, yPos: number): number {
    // Section header
    doc
      .fontSize(9)
      .font("Roboto-Bold")
      .text("1. Баримтын ерөнхий мэдээлэл", this.MARGIN, yPos);

    yPos += 15;

    const labelX = this.MARGIN + 7;
    const valueX = this.MARGIN + 140;

    doc.fontSize(8);

    // Receipt number
    doc
      .font("Roboto-Bold")
      .text("Зарлагын падаан №:", labelX, yPos, { continued: false });
    doc
      .font("Roboto")
      .text(data.orderNumber || "N/A", valueX, yPos);

    yPos += 12;

    // DDTD
    if (data.ebarimtBillId) {
      doc.font("Roboto-Bold").text("ДДТД:", labelX, yPos);
      doc.font("Roboto").text(data.ebarimtBillId, valueX, yPos);
      yPos += 12;
    }

    // TIN
    doc.font("Roboto-Bold").text("ТТД:", labelX, yPos);
    doc.font("Roboto").text(this.COMPANY_TIN, valueX, yPos);
    yPos += 12;

    // Registration date
    if (data.ebarimtDate) {
      doc
        .font("Roboto-Bold")
        .text("Баримт бүртгэгдсэн огноо:", labelX, yPos);
      doc
        .font("Roboto")
        .text(this.formatDateMongolian(data.ebarimtDate), valueX, yPos);
      yPos += 12;
    }

    // Order date
    doc.font("Roboto-Bold").text("Бараа олгосон огноо:", labelX, yPos);
    doc
      .font("Roboto")
      .text(this.formatDateMongolian(data.orderDate), valueX, yPos);
    yPos += 12;

    // Payment method
    doc.font("Roboto-Bold").text("Төлбөрийн хэлбэр:", labelX, yPos);
    doc
      .font("Roboto")
      .text(this.translatePaymentMethod(data.paymentMethod), valueX, yPos);

    yPos += 15;

    // Divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 12;
  }

  private addSellerInfo(doc: PDFKit.PDFDocument, data: ReceiptData, yPos: number): number {
    doc
      .fontSize(9)
      .font("Roboto-Bold")
      .text("2. Борлуулагчийн мэдээлэл", this.MARGIN, yPos);

    yPos += 15;

    const labelX = this.MARGIN + 7;
    const valueX = this.MARGIN + 30;

    doc.fontSize(8);

    // Seller name
    doc.font("Roboto-Bold").text("Нэр:", labelX, yPos);
    doc.font("Roboto").text(data.agent.name || "N/A", valueX, yPos);
    yPos += 12;

    // Seller phone
    if (data.agent.phoneNumber) {
      doc.font("Roboto-Bold").text("Утас:", labelX, yPos);
      doc.font("Roboto").text(data.agent.phoneNumber, valueX, yPos);
      yPos += 12;
    }

    yPos += 3;

    // Divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 12;
  }

  private addBuyerInfo(doc: PDFKit.PDFDocument, data: ReceiptData, yPos: number): number {
    doc
      .fontSize(9)
      .font("Roboto-Bold")
      .text("3. Худалдан авагчийн мэдээлэл", this.MARGIN, yPos);

    yPos += 15;

    const labelX = this.MARGIN + 7;
    const valueX = this.MARGIN + 30;

    doc.fontSize(8);

    // Buyer name
    doc.font("Roboto-Bold").text("Нэр:", labelX, yPos);
    doc.font("Roboto").text(data.customer.name || "N/A", valueX, yPos);
    yPos += 12;

    // Buyer phone
    if (data.customer.phoneNumber) {
      doc.font("Roboto-Bold").text("Утас:", labelX, yPos);
      doc.font("Roboto").text(data.customer.phoneNumber, valueX, yPos);
      yPos += 12;
    }

    yPos += 3;

    // Divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 12;
  }

  private addStoreInfo(doc: PDFKit.PDFDocument, yPos: number): number {
    doc
      .fontSize(9)
      .font("Roboto-Bold")
      .text("4. Дэлгүүр / Байгууллагын мэдээлэл", this.MARGIN, yPos);

    yPos += 15;

    const labelX = this.MARGIN + 7;
    const valueX = this.MARGIN + 30;

    doc.fontSize(8);

    // Store name
    doc.font("Roboto-Bold").text("Нэр:", labelX, yPos);
    doc.font("Roboto").text(this.COMPANY_NAME, valueX, yPos);
    yPos += 12;

    // Address
    doc.font("Roboto-Bold").text("Хаяг:", labelX, yPos);
    doc.font("Roboto").text(this.COMPANY_ADDRESS, valueX, yPos, {
      width: this.CONTENT_WIDTH - (valueX - this.MARGIN),
    });
    yPos += 20;

    // Phones
    doc.font("Roboto-Bold").text("Утас:", labelX, yPos);
    doc.font("Roboto").text(this.COMPANY_PHONES.join(", "), valueX, yPos);
    yPos += 15;

    // Divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 12;
  }

  private addItemsTable(doc: PDFKit.PDFDocument, data: ReceiptData, yPos: number): number {
    doc
      .fontSize(9)
      .font("Roboto-Bold")
      .text("5. Худалдан авсан барааны жагсаалт", this.MARGIN, yPos);

    yPos += 10;

    // Table settings
    const tableTop = yPos;
    const col1X = this.MARGIN;
    const col2X = col1X + 22;
    const col3X = col2X + 125;
    const col4X = col3X + 70;
    const col5X = col4X + 35;
    const col6X = col5X + 55;
    const rowHeight = 18;

    // Table header
    doc.fontSize(7).font("Roboto-Bold");

    // Header background
    doc
      .rect(this.MARGIN, yPos, this.CONTENT_WIDTH, rowHeight)
      .fillOpacity(0.1)
      .fill()
      .fillOpacity(1);

    yPos += 6;

    doc.text("№", col1X + 3, yPos, { width: 20, align: "center" });
    doc.text("Барааны нэр", col2X, yPos);
    doc.text("Баркод", col3X, yPos);
    doc.text("Тоо", col4X, yPos, { width: 35, align: "center" });
    doc.text("Нэгж үнэ", col5X, yPos, { width: 55, align: "right" });
    doc.text("Нийт үнэ", col6X, yPos, { width: 55, align: "right" });

    yPos += rowHeight - 6;

    // Table border
    doc
      .moveTo(this.MARGIN, tableTop)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, tableTop)
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .stroke();

    // Table rows
    doc.fontSize(7).font("Roboto");

    data.items.forEach((item, index) => {
      yPos += 4;

      doc.text((index + 1).toString(), col1X + 3, yPos, {
        width: 20,
        align: "center",
      });
      doc.text(item.productName, col2X, yPos, { width: 120 });
      doc.text(item.productCode, col3X, yPos, { width: 65 });
      doc.text(item.quantity.toString(), col4X, yPos, {
        width: 35,
        align: "center",
      });
      doc.text(this.formatCurrencyShort(item.unitPrice), col5X, yPos, {
        width: 55,
        align: "right",
      });
      doc.text(this.formatCurrencyShort(item.total), col6X, yPos, {
        width: 55,
        align: "right",
      });

      yPos += rowHeight - 4;

      // Row divider
      doc
        .moveTo(this.MARGIN, yPos)
        .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
        .strokeOpacity(0.2)
        .stroke()
        .strokeOpacity(1);
    });

    yPos += 12;

    // Final divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 15;
  }

  private addVATInfo(doc: PDFKit.PDFDocument, data: ReceiptData, yPos: number): number {
    doc
      .fontSize(9)
      .font("Roboto-Bold")
      .text("6. НӨАТ мэдээлэл", this.MARGIN, yPos);

    yPos += 15;

    const labelX = this.MARGIN + 7;
    const valueX = this.PAGE_WIDTH - this.MARGIN - 60;

    doc.fontSize(8);

    // Total with VAT
    doc.font("Roboto-Bold").text("НӨАТ-тэй дүн:", labelX, yPos);
    doc.font("Roboto").text(this.formatCurrencyShort(data.total), valueX, yPos, {
      width: 60,
      align: "right",
    });
    yPos += 12;

    // VAT
    doc.font("Roboto-Bold").text("НӨАТ:", labelX, yPos);
    doc.font("Roboto").text(this.formatCurrencyShort(data.vat), valueX, yPos, {
      width: 60,
      align: "right",
    });
    yPos += 12;

    // City tax
    doc.font("Roboto-Bold").text("НХАТ:", labelX, yPos);
    doc.font("Roboto").text("0", valueX, yPos, { width: 60, align: "right" });
    yPos += 15;

    // Divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(this.PAGE_WIDTH - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 12;
  }

  private async addQRCodeAndLottery(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    qrCodeDataURL: string,
    yPos: number
  ): Promise<number> {
    doc
      .fontSize(9)
      .font("Roboto-Bold")
      .text("7. QR код ба Сугалааны дугаар", this.MARGIN, yPos);

    yPos += 15;

    // Convert QR data URL to buffer
    const qrBuffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");

    // Add QR code
    const qrSize = 100; // ~35mm
    const qrX = this.MARGIN + 10;
    doc.image(qrBuffer, qrX, yPos, { width: qrSize, height: qrSize });

    // Lottery number (if available)
    if (data.ebarimtLottery) {
      const lotteryX = qrX + qrSize + 20;

      doc
        .fontSize(11)
        .font("Roboto-Bold")
        .text("Сугалааны дугаар:", lotteryX, yPos + 10);

      doc
        .fontSize(16)
        .font("Roboto-Bold")
        .text(data.ebarimtLottery, lotteryX, yPos + 28);

      doc
        .fontSize(7)
        .font("Roboto")
        .text(
          "Та энэ дугаараа хадгалж, сарын\nэцэст сугалаанд оролцоно уу!",
          lotteryX,
          yPos + 50,
          { width: 150 }
        );
    } else {
      const lotteryX = qrX + qrSize + 20;
      doc
        .fontSize(8)
        .font("Roboto")
        .text("E-Barimt бүртгэлгүй", lotteryX, yPos + 40);
    }

    // QR verification text
    doc
      .fontSize(7)
      .font("Roboto")
      .text("QR код уншуулж баримт шалгана уу", qrX + qrSize / 2, yPos + qrSize + 8, {
        width: qrSize,
        align: "center",
      });

    return yPos + qrSize + 25;
  }

  private addFooter(doc: PDFKit.PDFDocument): void {
    const footerY = this.PAGE_HEIGHT - this.MARGIN - 20;

    doc
      .fontSize(7)
      .font("Roboto")
      .text("Худалдан авалт хийсэнд баярлалаа!", this.MARGIN, footerY, {
        width: this.CONTENT_WIDTH,
        align: "center",
      });

    doc.text(
      `Хэвлэсэн огноо: ${this.formatDateTime(new Date())}`,
      this.MARGIN,
      footerY + 10,
      { width: this.CONTENT_WIDTH, align: "center" }
    );
  }

  private async generateQRCode(data: ReceiptData): Promise<string> {
    let qrData: string;

    if (data.ebarimtQrData) {
      qrData = data.ebarimtQrData;
    } else {
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
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    }
  }

  private formatCurrencyShort(amount: number): string {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

export default new PDFKitService();

