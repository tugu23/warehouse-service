import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

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
}

class PDFService {
  private readonly COMPANY_NAME = "Warehouse Management System";
  private readonly COMPANY_ADDRESS = "Ulaanbaatar, Mongolia";
  private readonly COMPANY_PHONE = "+976-XXXX-XXXX";
  private readonly COMPANY_EMAIL = "info@warehouse.mn";

  async generateOrderReceiptPDF(data: ReceiptData): Promise<Buffer> {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set font
    doc.setFont("helvetica");

    // Generate QR Code
    const qrCodeDataURL = await this.generateQRCode(data);

    // Add content to PDF
    this.addHeader(doc);
    this.addCompanyInfo(doc);
    this.addOrderInfo(doc, data);
    this.addCustomerInfo(doc, data);
    this.addItemsTable(doc, data);
    this.addTotalsSection(doc, data);
    this.addPaymentInfo(doc, data);
    this.addQRCode(doc, qrCodeDataURL);
    this.addFooter(doc);

    // Convert to Buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    return pdfBuffer;
  }

  private addHeader(doc: jsPDF): void {
    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER RECEIPT", 105, 20, { align: "center" });
    doc.setFont("helvetica", "normal");
  }

  private addCompanyInfo(doc: jsPDF): void {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(this.COMPANY_NAME, 105, 30, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(this.COMPANY_ADDRESS, 105, 35, { align: "center" });
    doc.text(`${this.COMPANY_PHONE} | ${this.COMPANY_EMAIL}`, 105, 40, {
      align: "center",
    });

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);
  }

  private addOrderInfo(doc: jsPDF, data: ReceiptData): void {
    let yPos = 55;
    doc.setFontSize(10);

    // Left column
    doc.setFont("helvetica", "bold");
    doc.text("Order Number:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.orderNumber, 55, yPos);

    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Order Date:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(this.formatDate(data.orderDate), 55, yPos);

    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Order Type:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.orderType, 55, yPos);

    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Status:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.status, 55, yPos);

    // Right column - Sales Agent
    doc.setFont("helvetica", "bold");
    doc.text("Sales Agent:", 120, 55);
    doc.setFont("helvetica", "normal");
    doc.text(data.agent.name, 160, 55);
  }

  private addCustomerInfo(doc: jsPDF, data: ReceiptData): void {
    let yPos = 85;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 15, yPos);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.customer.name, 40, yPos);

    if (data.customer.address) {
      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Address:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(data.customer.address, 40, yPos);
    }

    if (data.customer.phoneNumber) {
      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Phone:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(data.customer.phoneNumber, 40, yPos);
    }
  }

  private addItemsTable(doc: jsPDF, data: ReceiptData): void {
    const tableData = data.items.map((item, index) => [
      (index + 1).toString(),
      item.productName,
      item.productCode,
      item.quantity.toString(),
      this.formatCurrency(item.unitPrice),
      this.formatCurrency(item.total),
    ]);

    autoTable(doc, {
      startY: 120,
      head: [["#", "Product Name", "Code", "Qty", "Unit Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: 65 },
        2: { halign: "center", cellWidth: 25 },
        3: { halign: "center", cellWidth: 15 },
        4: { halign: "right", cellWidth: 30 },
        5: { halign: "right", cellWidth: 35 },
      },
      margin: { left: 15, right: 15 },
    });
  }

  private addTotalsSection(doc: jsPDF, data: ReceiptData): void {
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    let yPos = finalY + 10;

    const xLabelStart = 130;
    const xValueStart = 175;

    doc.setFontSize(10);

    // Subtotal
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", xLabelStart, yPos, { align: "right" });
    doc.text(this.formatCurrency(data.subtotal), xValueStart, yPos, {
      align: "right",
    });

    // VAT (only for Store orders)
    if (data.orderType === "Store" && data.vat > 0) {
      yPos += 6;
      doc.text("VAT (10%):", xLabelStart, yPos, { align: "right" });
      doc.text(this.formatCurrency(data.vat), xValueStart, yPos, {
        align: "right",
      });
    }

    // Total
    yPos += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", xLabelStart, yPos, { align: "right" });
    doc.text(this.formatCurrency(data.total), xValueStart, yPos, {
      align: "right",
    });

    // Draw line above total
    doc.setLineWidth(0.3);
    doc.line(130, yPos - 3, 195, yPos - 3);
  }

  private addPaymentInfo(doc: jsPDF, data: ReceiptData): void {
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    let yPos = finalY + 40;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information", 15, yPos);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Method:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.paymentMethod, 60, yPos);

    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Payment Status:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.paymentStatus, 60, yPos);

    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Paid Amount:", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(this.formatCurrency(data.paidAmount), 60, yPos);

    if (data.remainingAmount > 0) {
      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Remaining Amount:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(this.formatCurrency(data.remainingAmount), 60, yPos);
    }

    // Credit terms
    if (data.paymentMethod === "Credit" && data.dueDate) {
      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Credit Terms:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${data.creditTermDays || 0} days`, 60, yPos);

      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Due Date:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(this.formatDate(data.dueDate), 60, yPos);
    }
  }

  private addQRCode(doc: jsPDF, qrCodeDataURL: string): void {
    // Add QR code in bottom right corner
    const qrSize = 30;
    const xPos = 195 - qrSize;
    const yPos = 250;

    doc.addImage(qrCodeDataURL, "PNG", xPos, yPos, qrSize, qrSize);

    // Add label
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Scan to verify", xPos + qrSize / 2, yPos + qrSize + 5, {
      align: "center",
    });
  }

  private addFooter(doc: jsPDF): void {
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", 105, 287, { align: "center" });
    doc.text(`Generated on ${this.formatDateTime(new Date())}`, 105, 292, {
      align: "center",
    });
  }

  private async generateQRCode(data: ReceiptData): Promise<string> {
    const qrData = JSON.stringify({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      total: data.total,
      date: data.orderDate,
    });

    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
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

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
}

export default new PDFService();
