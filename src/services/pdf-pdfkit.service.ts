import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
import QRCode from "qrcode";
import * as path from "path";
import * as fs from "fs";

interface ReceiptItem {
  productName: string;
  productCode: string;
  barcode?: string;
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

  // A5 dimensions in points (72 points = 1 inch, A5 Landscape = 210mm x 148mm)
  // A4 dimensions in points (A4 Landscape = 297mm x 210mm)
  private readonly A5_WIDTH = 595.28; // 210mm in points (landscape)
  private readonly A5_HEIGHT = 419.53; // 148mm in points (landscape)
  private readonly A4_WIDTH = 841.89; // 297mm in points (landscape)
  private readonly A4_HEIGHT = 595.28; // 210mm in points (landscape)
  private readonly MARGIN = 20; // Reduced margin for more space

  async generateOrderReceiptPDF(data: ReceiptData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // Determine page size based on number of items
        // If more than 12 items, use A4, otherwise use A5
        // Increased from 8 to 12 due to optimized compact layout
        const useA4 = data.items.length > 12;
        const pageWidth = useA4 ? this.A4_WIDTH : this.A5_WIDTH;
        const pageHeight = useA4 ? this.A4_HEIGHT : this.A5_HEIGHT;
        const contentWidth = pageWidth - 2 * this.MARGIN;

        // Create PDF document with UTF-8 encoding
        const doc = new PDFDocument({
          size: [pageWidth, pageHeight],
          margins: {
            top: this.MARGIN,
            bottom: this.MARGIN,
            left: this.MARGIN,
            right: this.MARGIN,
          },
          bufferPages: true,
          autoFirstPage: true,
        });

        // Store page dimensions for use in other methods
        (doc as any)._pageWidth = pageWidth;
        (doc as any)._pageHeight = pageHeight;
        (doc as any)._contentWidth = contentWidth;
        (doc as any)._margin = this.MARGIN;

        // Store font paths for later use
        // Determine font path based on environment
        let fontPath: string;
        let regularFontPath: string;
        let boldFontPath: string;

        // Check if running from dist (production) or src (development)
        if (__dirname.includes("/dist/")) {
          // Production: fonts are in dist/fonts/
          fontPath = path.join(__dirname, "../fonts");
        } else {
          // Development: fonts are in src/fonts/
          fontPath = path.join(__dirname, "../fonts");
        }

        regularFontPath = path.join(fontPath, "Roboto-Regular.ttf");
        boldFontPath = path.join(fontPath, "Roboto-Bold.ttf");

        console.log("=== Font Loading Debug ===");
        console.log("__dirname:", __dirname);
        console.log("Font path:", fontPath);
        console.log("Regular font:", regularFontPath);
        console.log("Bold font:", boldFontPath);
        console.log("Regular font exists:", fs.existsSync(regularFontPath));
        console.log("Bold font exists:", fs.existsSync(boldFontPath));

        // Store paths in doc for later use instead of pre-registering
        (doc as any)._fontPaths = {
          regular: regularFontPath,
          bold: boldFontPath,
        };

        // Register fonts with names so we can use them easily
        doc.registerFont("Roboto", regularFontPath);
        doc.registerFont("Roboto-Bold", boldFontPath);

        // Collect PDF data
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Generate QR code
        const qrCodeDataURL = await this.generateQRCode(data);

        // Add content
        let yPos = this.MARGIN;
        yPos = this.addHeader(doc, data, yPos);
        yPos = this.addAllInfoInColumns(doc, data, yPos);
        yPos = this.addItemsTable(doc, data, yPos);
        yPos = await this.addVATAndQRInColumns(doc, data, qrCodeDataURL, yPos);
        this.addFooter(doc);

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private setFont(
    doc: PDFKit.PDFDocument,
    style: "bold" | "normal" = "normal"
  ): void {
    const fontPaths = (doc as any)._fontPaths;
    if (fontPaths) {
      try {
        const fontPath = style === "bold" ? fontPaths.bold : fontPaths.regular;
        doc.font(fontPath);
      } catch (err) {
        console.error("Error loading font:", err);
        doc.font("Courier");
      }
    } else {
      doc.font("Courier");
    }
  }

  private addHeader(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const pageWidth = (doc as any)._pageWidth;
    const contentWidth = (doc as any)._contentWidth;

    // Date on top left corner
    this.setFont(doc, "normal");
    doc
      .fontSize(7)
      .text(this.formatDateMongolian(data.orderDate), this.MARGIN, yPos);

    yPos += 10;

    // Simple header with company info - no unnecessary titles
    this.setFont(doc, "bold");
    doc.fontSize(10).text(this.COMPANY_NAME, this.MARGIN, yPos, {
      width: contentWidth,
      align: "center",
    });

    yPos += 12;

    this.setFont(doc, "normal");
    doc.fontSize(7).text(this.COMPANY_ADDRESS, this.MARGIN, yPos, {
      width: contentWidth,
      align: "center",
    });

    yPos += 10;

    doc
      .fontSize(7)
      .text(`Утас: ${this.COMPANY_PHONES.join(", ")}`, this.MARGIN, yPos, {
        width: contentWidth,
        align: "center",
      });

    yPos += 8;

    // Divider line
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(pageWidth - this.MARGIN, yPos)
      .stroke();

    return yPos + 8;
  }

  private addAllInfoInColumns(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const pageWidth = (doc as any)._pageWidth;
    const contentWidth = (doc as any)._contentWidth;
    const startY = yPos;
    const col1X = this.MARGIN;
    const col2X = this.MARGIN + contentWidth / 3;
    const col3X = this.MARGIN + (contentWidth * 2) / 3;
    const colWidth = contentWidth / 3 - 10;

    // Column 1: Баримтын мэдээлэл
    let y1 = startY;
    doc.fontSize(7).font("Roboto-Bold");
    doc.text("Баримтын мэдээлэл", col1X, y1, { width: colWidth });
    y1 += 10;
    doc.fontSize(6.5);

    const labelWidth = 45;
    const valueX = col1X + labelWidth;

    // Receipt number
    doc.font("Roboto-Bold").text("Падаан №:", col1X, y1);
    doc.font("Roboto").text(data.orderNumber || "N/A", valueX, y1);
    y1 += 9;

    // ДДТД - IMPORTANT
    doc.font("Roboto-Bold").text("ДДТД:", col1X, y1);
    doc.font("Roboto").text(data.ebarimtBillId || "Бүртгэлгүй", valueX, y1);
    y1 += 9;

    // TIN
    doc.font("Roboto-Bold").text("ТТД:", col1X, y1);
    doc.font("Roboto").text(this.COMPANY_TIN, valueX, y1);
    y1 += 9;

    // Payment method
    doc.font("Roboto-Bold").text("Төлбөр:", col1X, y1);
    doc
      .font("Roboto")
      .text(this.translatePaymentMethod(data.paymentMethod), valueX, y1);

    // Column 2: Борлуулагчийн мэдээлэл
    let y2 = startY;
    doc.fontSize(7).font("Roboto-Bold");
    doc.text("Борлуулагч", col2X, y2, { width: colWidth });
    y2 += 10;
    doc.fontSize(6.5);

    const labelWidth2 = 28;
    const valueX2 = col2X + labelWidth2;

    // Seller name
    doc.font("Roboto-Bold").text("Нэр:", col2X, y2);
    doc.font("Roboto").text(data.agent.name || "N/A", valueX2, y2);
    y2 += 9;

    // Seller phone
    if (data.agent.phoneNumber) {
      doc.font("Roboto-Bold").text("Утас:", col2X, y2);
      doc.font("Roboto").text(data.agent.phoneNumber, valueX2, y2);
      y2 += 9;
    }

    // Column 3: Худалдан авагчийн мэдээлэл
    let y3 = startY;
    doc.fontSize(7).font("Roboto-Bold");
    doc.text("Худалдан авагч", col3X, y3, { width: colWidth });
    y3 += 10;
    doc.fontSize(6.5);

    const labelWidth3 = 28;
    const valueX3 = col3X + labelWidth3;

    // Buyer name
    doc.font("Roboto-Bold").text("Нэр:", col3X, y3);
    doc.font("Roboto").text(data.customer.name || "N/A", valueX3, y3);
    y3 += 9;

    // Buyer phone
    if (data.customer.phoneNumber) {
      doc.font("Roboto-Bold").text("Утас:", col3X, y3);
      doc.font("Roboto").text(data.customer.phoneNumber, valueX3, y3);
      y3 += 9;
    }

    // Find the maximum Y position
    const maxY = Math.max(y1, y2, y3);
    yPos = maxY + 8;

    // Divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(pageWidth - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 8;
  }

  private addItemsTable(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const pageWidth = (doc as any)._pageWidth;
    const contentWidth = (doc as any)._contentWidth;

    // Table settings - optimized column widths
    const tableTop = yPos;
    const col1X = this.MARGIN;
    const numWidth = 18; // № column width
    const col2X = col1X + numWidth; // №

    // Calculate optimal widths based on content
    const nameWidth = contentWidth * 0.28; // Барааны нэр - reduced from 0.35
    const barcodeWidth = contentWidth * 0.14; // Баркод - reduced from 0.18
    const qtyWidth = contentWidth * 0.1; // Тоо/Ширхэг
    const unitPriceWidth = contentWidth * 0.14; // Нэгж үнэ
    const totalPriceWidth = contentWidth * 0.16; // Нийт үнэ - increased

    const col3X = col2X + nameWidth;
    const col4X = col3X + barcodeWidth;
    const col5X = col4X + qtyWidth;
    const col6X = col5X + unitPriceWidth;
    const rowHeight = 14;

    // Table header
    doc.fontSize(6.5).font("Roboto-Bold");

    // Header background
    doc
      .rect(this.MARGIN, yPos, contentWidth, rowHeight)
      .fillOpacity(0.1)
      .fill()
      .fillOpacity(1);

    yPos += 5;

    doc.text("№", col1X + 2, yPos, { width: numWidth - 4, align: "center" });
    doc.text("Барааны нэр", col2X, yPos, { width: nameWidth });
    doc.text("Баркод", col3X, yPos, { width: barcodeWidth });
    doc.text("Тоо/Ширхэг", col4X, yPos, {
      width: qtyWidth,
      align: "center",
    });
    doc.text("Нэгж үнэ", col5X, yPos, {
      width: unitPriceWidth,
      align: "right",
    });
    doc.text("Нийт үнэ", col6X, yPos, {
      width: totalPriceWidth,
      align: "right",
    });

    yPos += rowHeight - 5;

    // Table border
    doc
      .moveTo(this.MARGIN, tableTop)
      .lineTo(pageWidth - this.MARGIN, tableTop)
      .moveTo(this.MARGIN, yPos)
      .lineTo(pageWidth - this.MARGIN, yPos)
      .stroke();

    // Table rows
    doc.fontSize(6.5).font("Roboto");

    data.items.forEach((item, index) => {
      yPos += 3;

      doc.text((index + 1).toString(), col1X + 2, yPos, {
        width: numWidth - 4,
        align: "center",
      });
      doc.text(item.productName, col2X, yPos, { width: nameWidth - 2 });
      doc.text(item.barcode || item.productCode || "N/A", col3X, yPos, {
        width: barcodeWidth - 2,
      });
      doc.text(item.quantity.toString(), col4X, yPos, {
        width: qtyWidth,
        align: "center",
      });
      doc.text(this.formatCurrencyShort(item.unitPrice), col5X, yPos, {
        width: unitPriceWidth,
        align: "right",
      });
      doc.text(this.formatCurrencyShort(item.total), col6X, yPos, {
        width: totalPriceWidth,
        align: "right",
      });

      yPos += rowHeight - 3;

      // Row divider
      doc
        .moveTo(this.MARGIN, yPos)
        .lineTo(pageWidth - this.MARGIN, yPos)
        .strokeOpacity(0.2)
        .stroke()
        .strokeOpacity(1);
    });

    yPos += 8;

    // Final divider
    doc
      .moveTo(this.MARGIN, yPos)
      .lineTo(pageWidth - this.MARGIN, yPos)
      .strokeOpacity(0.3)
      .stroke()
      .strokeOpacity(1);

    return yPos + 8;
  }

  private async addVATAndQRInColumns(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    qrCodeDataURL: string,
    yPos: number
  ): Promise<number> {
    const pageWidth = (doc as any)._pageWidth;
    const contentWidth = (doc as any)._contentWidth;
    const startY = yPos;

    // Left column: QR код ба Сугалааны дугаар
    const col1X = this.MARGIN;
    const col1Width = contentWidth / 2 - 10;

    doc.fontSize(7).font("Roboto-Bold");
    doc.text("QR код ба Сугалаа", col1X, yPos, { width: col1Width });
    let y1 = yPos + 10;

    // Convert QR data URL to buffer
    const qrBuffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");

    // Add QR code
    const qrSize = 60;
    doc.image(qrBuffer, col1X, y1, { width: qrSize, height: qrSize });

    // Lottery number (if available)
    if (data.ebarimtLottery) {
      const lotteryX = col1X + qrSize + 10;

      doc.fontSize(7).font("Roboto-Bold").text("Сугалаа:", lotteryX, y1);

      doc
        .fontSize(11)
        .font("Roboto-Bold")
        .text(data.ebarimtLottery, lotteryX, y1 + 12);

      doc
        .fontSize(5.5)
        .font("Roboto")
        .text(
          "Та энэ дугаараа хадгалж,\nсарын эцэст сугалаанд\nоролцоно уу!",
          lotteryX,
          y1 + 28,
          { width: 100 }
        );
    } else {
      const lotteryX = col1X + qrSize + 10;
      doc
        .fontSize(6.5)
        .font("Roboto")
        .text("E-Barimt\nбүртгэлгүй", lotteryX, y1 + 20);
    }

    // QR verification text
    doc
      .fontSize(5.5)
      .font("Roboto")
      .text("QR код уншуулж\nбаримт шалгана уу", col1X, y1 + qrSize + 3, {
        width: qrSize,
        align: "center",
      });

    // Right column: Price summary (no header)
    const col2X = this.MARGIN + contentWidth / 2 + 10;
    const col2Width = contentWidth / 2 - 10;

    let y2 = yPos;
    doc.fontSize(6.5);

    // Calculate VAT as 10% of subtotal
    const vat10Percent = data.subtotal * 0.1;
    const totalWithVat = data.subtotal + vat10Percent;

    // Subtotal (Барааны нийт дүн)
    doc.font("Roboto-Bold").text("Барааны нийт дүн:", col2X, y2);
    doc
      .font("Roboto")
      .text(this.formatCurrencyShort(data.subtotal), col2X + 90, y2);
    y2 += 10;

    // VAT 10%
    doc.font("Roboto-Bold").text("НӨАТ (10%):", col2X, y2);
    doc
      .font("Roboto")
      .text(this.formatCurrencyShort(vat10Percent), col2X + 90, y2);
    y2 += 10;

    // Total (Нийт үнэ = Subtotal + VAT 10%)
    doc.font("Roboto-Bold").text("Нийт үнэ:", col2X, y2);
    doc
      .font("Roboto")
      .text(this.formatCurrencyShort(totalWithVat), col2X + 90, y2);

    const maxY = Math.max(y1 + qrSize + 15, y2);
    yPos = maxY + 15;

    // Signature section - vertical layout, centered
    doc.fontSize(6.5).font("Roboto");

    // Хүлээлгэн өгсөн (дээр)
    doc.text(
      "Хүлээлгэн өгсөн: ......................./......................./",
      this.MARGIN,
      yPos,
      {
        width: contentWidth,
        align: "center",
      }
    );

    yPos += 12;

    // Хүлээн авсан (доор)
    doc.text(
      "Хүлээн авсан: ......................./......................./",
      this.MARGIN,
      yPos,
      {
        width: contentWidth,
        align: "center",
      }
    );

    yPos += 15;

    return yPos;
  }

  private addFooter(doc: PDFKit.PDFDocument): void {
    const pageHeight = (doc as any)._pageHeight;
    const contentWidth = (doc as any)._contentWidth;
    const footerY = pageHeight - this.MARGIN - 15;

    doc
      .fontSize(6)
      .font("Roboto")
      .text("Худалдан авалт хийсэнд баярлалаа!", this.MARGIN, footerY, {
        width: contentWidth,
        align: "center",
      });
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
