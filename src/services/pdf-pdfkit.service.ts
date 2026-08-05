import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
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
    systemName?: string | null;
    address?: string | null;
    phoneNumber?: string | null;
    registrationNumber?: string | null;
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
  isB2B?: boolean;
}

class PDFKitService {
  private readonly COMPANY_NAME = "Жи Эл Эф ххк";
  private readonly COMPANY_ADDRESS =
    "13000500 5070262037";
  private readonly COMPANY_PHONES = ["88049870"];
  private readonly COMPANY_TIN = "5317878";

  private readonly A4_WIDTH = 595.28; // 210mm in points (portrait)
  private readonly A4_HEIGHT = 841.89; // 297mm in points (portrait)
  private readonly MARGIN = 20; // Reduced margin for more space

  async generateOrderReceiptPDF(data: ReceiptData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // Always generate the receipt in A4 landscape to match the printed document layout.
        const pageWidth = this.A4_WIDTH;
        const pageHeight = this.A4_HEIGHT;
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

        // Add content
        let yPos = this.MARGIN;
        yPos = this.addHeader(doc, data, yPos);
        yPos = this.addAllInfoInColumns(doc, data, yPos);
        yPos = this.addItemsTable(doc, data, yPos);
        yPos = this.addTotalsAndSignatureBlock(doc, data, yPos);

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
    const subtitle = data.isB2B ? "1-р хувь – байгууллагын" : "1-р хувь – сугалаатай";

    this.setFont(doc, "normal");
    doc
      .fontSize(8)
      .fillColor("#2f63ff")
      .text(this.formatDateMongolian(data.orderDate), this.MARGIN, yPos, {
        width: 90,
        align: "left",
      });

    doc.fillColor("black");
    this.setFont(doc, "bold");
    doc.fontSize(16).text("ТӨЛБӨРИЙН БАРИМТ", this.MARGIN, yPos + 20, {
      width: contentWidth,
      align: "center",
    });
    this.setFont(doc, "normal");
    doc.fontSize(8.5).text(subtitle, this.MARGIN, yPos + 35, {
      width: contentWidth,
      align: "center",
    });

    const dividerY = yPos + 46;
    doc.lineWidth(0.7);
    doc.moveTo(this.MARGIN, dividerY).lineTo(pageWidth - this.MARGIN, dividerY).stroke();

    return dividerY + 12;
  }

  private addAllInfoInColumns(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const pageWidth = (doc as any)._pageWidth;
    const contentWidth = (doc as any)._contentWidth;
    const leftX = this.MARGIN;
    const rightX = this.MARGIN + contentWidth * 0.58;
    const leftW = contentWidth * 0.52;
    const rightW = contentWidth * 0.40;

    doc.fontSize(8.5).font("Roboto-Bold").text("Борлуулагч", leftX, yPos);
    doc.fontSize(7.5).font("Roboto");
    yPos += 10;
    doc.text(`Байгууллага: ${this.COMPANY_NAME}`, leftX, yPos, { width: leftW });
    yPos += 9;
    doc.text(`Данс: ${this.COMPANY_ADDRESS}`, leftX, yPos, { width: leftW });
    yPos += 9;
    doc.text(`Утас: ${this.COMPANY_PHONES.join(", ")}`, leftX, yPos, { width: leftW });
    yPos += 9;
    doc.text(`ДДТД: ${data.ebarimtBillId || "........"}`, leftX, yPos, { width: leftW });
    yPos += 9;
    doc.text(`ТТД: ${this.COMPANY_TIN}`, leftX, yPos, { width: leftW });
    yPos += 9;
    doc.text(`Төлбөр: ${this.translatePaymentMethod(data.paymentMethod)}`, leftX, yPos, {
      width: leftW,
    });
    yPos += 9;
    doc.text(`Борлуулагч: ${data.agent.name || "........"}`, leftX, yPos, { width: leftW });
    yPos += 9;
    doc.text(`Утас: ${data.agent.phoneNumber || "........"}`, leftX, yPos, { width: leftW });

    let yR = yPos - 54;
    doc.fontSize(8.5).font("Roboto-Bold").text("Худалдан авагч", rightX, yR);
    doc.fontSize(7.5).font("Roboto");
    yR += 10;
    doc.text(`Нэр: ${data.customer.name || "........"}`, rightX, yR, { width: rightW });
    yR += 9;
    doc.text(`Системийн нэр: ${data.customer.systemName || data.customer.name || "........"}`, rightX, yR, {
      width: rightW,
    });
    yR += 9;
    if (data.customer.registrationNumber) {
      doc.text(`Регистр: ${data.customer.registrationNumber}`, rightX, yR, { width: rightW });
    } else {
      doc.text(`Утас: ${data.customer.phoneNumber || "........"}`, rightX, yR, { width: rightW });
    }

    const dividerY = Math.max(yPos + 8, yR + 8) + 6;
    doc.lineWidth(0.7);
    doc.moveTo(this.MARGIN, dividerY).lineTo(pageWidth - this.MARGIN, dividerY).stroke();

    return dividerY + 8;
  }

  private addItemsTable(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const contentWidth = (doc as any)._contentWidth;

    const col1X = this.MARGIN;
    const noW = 18;
    const nameW = 235;
    const barcodeW = 140;
    const qtyW = 52;
    const unitPriceW = 55;
    const totalW = contentWidth - (noW + nameW + barcodeW + qtyW + unitPriceW);

    const col2X = col1X + noW;
    const col3X = col2X + nameW;
    const col4X = col3X + barcodeW;
    const col5X = col4X + qtyW;
    const col6X = col5X + unitPriceW;

    const headerH = 18;
    const rowH = 15;

    doc.rect(this.MARGIN, yPos, contentWidth, headerH).stroke("#999");

    [col2X, col3X, col4X, col5X, col6X].forEach((x) => {
      doc.moveTo(x, yPos).lineTo(x, yPos + headerH).stroke("#999");
    });

    doc.font("Roboto-Bold").fontSize(6.8);
    doc.text("Д/д", col1X + 1, yPos + 5, { width: noW - 2, align: "center" });
    doc.text("Бараа, ажил, үйлчилгээний нэр", col2X + 2, yPos + 7, {
      width: nameW - 4,
      align: "center",
    });
    doc.text("Баркод", col3X + 2, yPos + 5, { width: barcodeW - 4, align: "center" });
    doc.text("Тоо/Ширхэг", col4X + 2, yPos + 5, { width: qtyW - 4, align: "center" });
    doc.text("Нэгж үнэ", col5X + 2, yPos + 5, { width: unitPriceW - 4, align: "center" });
    doc.text("Нийт үнэ", col6X + 2, yPos + 5, { width: totalW - 4, align: "center" });

    yPos += headerH;

    const maxRows = 12;
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

    doc.font("Roboto").fontSize(6.8);
    rowsToRender.slice(0, maxRows).forEach((item, idx) => {
      doc.rect(this.MARGIN, yPos, contentWidth, rowH).stroke("#bbb");
      [col2X, col3X, col4X, col5X, col6X].forEach((x) => {
        doc.moveTo(x, yPos).lineTo(x, yPos + rowH).stroke("#bbb");
      });

      if (item.productName) {
        doc.text(String(idx + 1), col1X + 1, yPos + 4, { width: noW - 2, align: "center" });
        doc.text(item.productName, col2X + 2, yPos + 4, { width: nameW - 4 });
        doc.text(item.barcode || item.productCode || "N/A", col3X + 2, yPos + 4, {
          width: barcodeW - 4,
          align: "center",
        });
        doc.text(String(item.quantity || 0), col4X + 2, yPos + 4, {
          width: qtyW - 4,
          align: "center",
        });
        doc.text(this.formatCurrencyShort(item.unitPrice), col5X + 2, yPos + 4, {
          width: unitPriceW - 4,
          align: "right",
        });
        doc.text(this.formatCurrencyShort(item.total), col6X + 2, yPos + 4, {
          width: totalW - 4,
          align: "right",
        });
      }

      yPos += rowH;
    });

    return yPos;
  }

  private addTotalsAndSignatureBlock(
    doc: PDFKit.PDFDocument,
    data: ReceiptData,
    yPos: number
  ): number {
    const contentWidth = (doc as any)._contentWidth;
    const rightX = this.MARGIN + contentWidth * 0.60;

    let subtotal = Number(data.subtotal || 0);
    let vat = Number(data.vat || 0);
    let total = Number(data.total || 0);
    if (subtotal > 0 && total <= subtotal) {
      vat = Math.round(subtotal * 0.1 * 100) / 100;
      total = Math.round((subtotal + vat) * 100) / 100;
    }

    const labels = ["Барааны нийт дүн:", "НӨАТ (10%):", "Нийт үнэ:"];
    const values = [subtotal, vat, total];
    const rowH = 20;
    const labelW = 150;
    const valueW = 82;

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

    doc.font("Roboto").fontSize(8);
    doc.text(
      "Хүлээн авсан: ........................................ /................................../",
      this.MARGIN + contentWidth * 0.18,
      yPos + rowH * labels.length + 12
    );
    doc.text(
      "(гарын үсэг)   (нэр)",
      this.MARGIN + contentWidth * 0.55,
      yPos + rowH * labels.length + 25
    );

    doc.text(
      "Хүлээлгэн өгсөн: .................................... /................................../",
      this.MARGIN + contentWidth * 0.18,
      yPos + rowH * labels.length + 42
    );
    doc.text(
      "(гарын үсэг)   (нэр)",
      this.MARGIN + contentWidth * 0.55,
      yPos + rowH * labels.length + 55
    );

    return yPos + rowH * labels.length + 70;
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
