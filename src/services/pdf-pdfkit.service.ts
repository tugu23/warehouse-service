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
  // VAT display option
  showVat?: boolean; // If false, shows "НӨАТ-гүй падаан" (non-VAT receipt)
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

    // Top-right legal note
    this.setFont(doc, "normal");
    doc.fontSize(6).fillColor("#555").text(
      "Сангийн сайдын 2017 оны\n347 дугаар тушаалын хавсралт",
      this.MARGIN,
      yPos,
      { width: contentWidth, align: "right" }
    );
    doc.fillColor("black");

    // Simple left logo mark (text-based to avoid image dependency)
    doc.fontSize(24).text("⊙", this.MARGIN, yPos + 18);

    // Center title
    this.setFont(doc, "bold");
    doc.fontSize(12).text("ТӨЛБӨРИЙН БАРИМТ", this.MARGIN, yPos + 24, {
      width: contentWidth,
      align: "center",
    });

    // Date on right side below title
    this.setFont(doc, "normal");
    doc.fontSize(8).text(`Огноо: ${this.formatDateMongolian(data.orderDate)}`, this.MARGIN, yPos + 54, {
      width: contentWidth,
      align: "right",
    });

    // Divider
    const dividerY = yPos + 68;
    doc.moveTo(this.MARGIN, dividerY).lineTo(pageWidth - this.MARGIN, dividerY).stroke();

    return dividerY + 8;
  }

  private addAllInfoInColumns(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const pageWidth = (doc as any)._pageWidth;
    const contentWidth = (doc as any)._contentWidth;

    const leftX = this.MARGIN;
    const rightX = this.MARGIN + contentWidth * 0.68;

    doc.fontSize(8).font("Roboto-Bold").text(`ДДТД: ${data.ebarimtBillId || "0000000000000000"}`, leftX, yPos);
    yPos += 12;

    doc.fontSize(8).font("Roboto-Bold").text("Борлуулагчийн:", leftX, yPos);
    yPos += 10;
    doc.fontSize(7.2).font("Roboto");
    doc.text(`ТТД: ${this.COMPANY_TIN}`, leftX, yPos);
    yPos += 9;
    doc.text(`НЭР: ${this.COMPANY_NAME}`, leftX, yPos, { width: contentWidth * 0.62 });
    yPos += 9;
    doc.text(`ХАЯГ: ${this.COMPANY_ADDRESS}`, leftX, yPos, { width: contentWidth * 0.62 });
    yPos += 9;
    doc.text(`Утас: ${this.COMPANY_PHONES.join(", ")}`, leftX, yPos);

    let yR = yPos - 28;
    doc.fontSize(8).font("Roboto-Bold").text("Худалдан авагчийн:", rightX, yR);
    yR += 10;
    doc.fontSize(7.2).font("Roboto");
    doc.text(`ТТД: ${data.customer.phoneNumber ? "........" : "........"}`, rightX, yR);
    yR += 9;
    doc.text(`НЭР: ${data.customer.name || "........"}`, rightX, yR, { width: contentWidth * 0.3 });
    yR += 9;
    doc.text(`Хаяг: ${data.customer.address || "........"}`, rightX, yR, { width: contentWidth * 0.3 });
    yR += 9;
    doc.text(`Утас: ${data.customer.phoneNumber || "........"}`, rightX, yR);

    const dividerY = Math.max(yPos, yR) + 10;
    doc.moveTo(this.MARGIN, dividerY).lineTo(pageWidth - this.MARGIN, dividerY).stroke();

    return dividerY + 6;
  }

  private addItemsTable(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const pageWidth = (doc as any)._pageWidth;
    const contentWidth = (doc as any)._contentWidth;

    const tableTop = yPos;
    const col1X = this.MARGIN;
    const noW = 28;
    const nameW = contentWidth * 0.36;
    const codeW = 40;
    const unitW = 44;
    const qtyW = 54;
    const unitPriceW = 100;
    const totalW = contentWidth - (noW + nameW + codeW + unitW + qtyW + unitPriceW);

    const col2X = col1X + noW;
    const col3X = col2X + nameW;
    const col4X = col3X + codeW;
    const col5X = col4X + unitW;
    const col6X = col5X + qtyW;
    const col7X = col6X + unitPriceW;

    const headerH = 22;
    const rowH = 18;

    doc.rect(this.MARGIN, yPos, contentWidth, headerH).stroke("#999");

    [col2X, col3X, col4X, col5X, col6X, col7X].forEach((x) => {
      doc.moveTo(x, yPos).lineTo(x, yPos + headerH).stroke("#999");
    });

    doc.font("Roboto-Bold").fontSize(7.5);
    doc.text("Д/д", col1X + 2, yPos + 7, { width: noW - 4, align: "center" });
    doc.text("Бараа, ажил, үйлчилгээний нэр", col2X + 2, yPos + 7, {
      width: nameW - 4,
      align: "center",
    });
    doc.text("Код", col3X + 2, yPos + 7, { width: codeW - 4, align: "center" });
    doc.text("Хэмжих нэгж", col4X + 2, yPos + 7, { width: unitW - 4, align: "center" });
    doc.text("Тоо, хэмжээ", col5X + 2, yPos + 7, { width: qtyW - 4, align: "center" });
    doc.text("Нэгжийн үнэ", col6X + 2, yPos + 7, { width: unitPriceW - 4, align: "right" });
    doc.text("Бүгд үнэ", col7X + 2, yPos + 7, { width: totalW - 4, align: "right" });

    yPos += headerH;

    const maxRows = 4;
    const rowsToRender = [...data.items];
    while (rowsToRender.length < maxRows) {
      rowsToRender.push({
        productName: "",
        productCode: "",
        quantity: 0,
        unitPrice: 0,
        total: 0,
      });
    }

    doc.font("Roboto").fontSize(7.2);
    rowsToRender.slice(0, maxRows).forEach((item, idx) => {
      doc.rect(this.MARGIN, yPos, contentWidth, rowH).stroke("#bbb");
      [col2X, col3X, col4X, col5X, col6X, col7X].forEach((x) => {
        doc.moveTo(x, yPos).lineTo(x, yPos + rowH).stroke("#bbb");
      });

      if (item.productName) {
        doc.text(String(idx + 1), col1X + 2, yPos + 6, { width: noW - 4, align: "center" });
        doc.text(item.productName, col2X + 2, yPos + 6, { width: nameW - 4 });
        doc.text(item.productCode || "", col3X + 2, yPos + 6, { width: codeW - 4, align: "center" });
        doc.text("ш", col4X + 2, yPos + 6, { width: unitW - 4, align: "center" });
        doc.text(String(item.quantity || 0), col5X + 2, yPos + 6, { width: qtyW - 4, align: "center" });
        doc.text(this.formatCurrencyShort(item.unitPrice), col6X + 2, yPos + 6, {
          width: unitPriceW - 4,
          align: "right",
        });
        doc.text(this.formatCurrencyShort(item.total), col7X + 2, yPos + 6, {
          width: totalW - 4,
          align: "right",
        });
      }

      yPos += rowH;
    });

    return yPos;
  }

  private async addVATAndQRInColumns(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    qrCodeDataURL: string,
    yPos: number
  ): Promise<number> {
    const contentWidth = (doc as any)._contentWidth;

    let subtotal = Number(data.subtotal || 0);
    let vat = Number(data.vat || 0);
    let total = Number(data.total || 0);
    if (subtotal > 0 && total <= subtotal) {
      vat = Math.round(subtotal * 0.1 * 100) / 100;
      total = Math.round((subtotal + vat) * 100) / 100;
    }

    const leftX = this.MARGIN;
    const rightX = this.MARGIN + contentWidth * 0.62;

    // Left: QR area (stamp area style)
    const qrBuffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");
    const qrSize = 60;
    doc.image(qrBuffer, leftX + 14, yPos + 8, { width: qrSize, height: qrSize });
    doc.font("Roboto").fontSize(8).text("Тамга", leftX + 26, yPos + qrSize + 20);

    // Right: totals table block like screenshot
    const labels = [
      "Бараа, ажил үйлчилгээний үнэ:",
      "Нэмэгдсэн өртгийн албан татвар:",
      "Нийслэл хотын албан татвар:",
      "Нийт дүн:",
    ];
    const values = [subtotal, vat, 0, total];

    const rowH = 20;
    const labelW = 160;
    const valueW = 70;

    doc.fontSize(7.5);
    labels.forEach((label, i) => {
      const rowY = yPos + i * rowH;
      doc.rect(rightX, rowY, labelW, rowH).stroke("#bbb");
      doc.rect(rightX + labelW, rowY, valueW, rowH).stroke("#bbb");
      doc.font("Roboto").text(label, rightX + 6, rowY + 6, { width: labelW - 10 });
      doc
        .font(i === labels.length - 1 ? "Roboto-Bold" : "Roboto")
        .text(this.formatCurrencyShort(values[i] || 0), rightX + labelW + 6, rowY + 6, {
          width: valueW - 10,
          align: "right",
        });
    });

    const sigStartY = yPos + rowH * labels.length + 6;
    doc.font("Roboto").fontSize(8);
    doc.text(
      "Хүлээн авсан: ........................................ /................................../",
      this.MARGIN + contentWidth * 0.34,
      sigStartY
    );
    doc.text("(гарын үсэг)   (нэр)", this.MARGIN + contentWidth * 0.58, sigStartY + 13);

    doc.text(
      "Хүлээлгэн өгсөн: .................................... /................................../",
      this.MARGIN + contentWidth * 0.34,
      sigStartY + 30
    );
    doc.text("(гарын үсэг)   (нэр)", this.MARGIN + contentWidth * 0.58, sigStartY + 43);

    return sigStartY + 56;
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
