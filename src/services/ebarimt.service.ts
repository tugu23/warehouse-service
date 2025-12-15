import { config } from "../config";
import logger from "../utils/logger";
import crypto from "crypto";

/**
 * E-Barimt Bill Item
 */
interface EbarimtBillItem {
  barCode: string;              // Product barcode
  barCodeType: "ITEM" | "SERVICE"; // Item type
  classificationCode: string;   // Product classification code (12 digits)
  name: string;                 // Product name
  measureUnit: string;          // Unit (e.g., "ш", "л", "кг")
  qty: number;                  // Quantity
  unitPrice: number;            // Unit price
  totalAmount: number;          // Total (qty * unitPrice)
  cityTax: number;              // City tax amount
  vat: number;                  // VAT amount (НӨАТ)
  discount: number;             // Discount amount
}

/**
 * E-Barimt Bill Request
 */
interface EbarimtBillRequest {
  amount: number;               // Total amount
  vat: number;                  // Total VAT
  cityTax: number;              // Total city tax
  districtCode: string;         // District code
  merchantTin: string;          // Merchant tax ID
  posNo: string;                // POS number
  customerNo?: string;          // Customer number (optional)
  customerName?: string;        // Customer name (optional)
  billType: "1" | "3";          // 1=B2C (Consumer), 3=B2B (Organization)
  billIdSuffix: string;         // Invoice number from your system
  returnBillId?: string;        // Original bill ID for returns
  stocks: EbarimtBillItem[];    // Line items
  payments: Array<{             // Payment methods
    code: string;               // Payment code (CASH, CARD, TRANSFER, etc)
    amount: number;             // Payment amount
  }>;
  bankAccountNo?: string;       // Bank account for electronic payment
}

/**
 * E-Barimt Bill Response
 */
interface EbarimtBillResponse {
  success: boolean;
  id?: string;                  // E-Barimt ID
  billId?: string;              // Full bill ID
  lottery?: string;             // Lottery number
  qrData?: string;              // QR code data
  date?: string;                // Receipt date
  message?: string;             // Error/Success message
}

/**
 * E-Barimt Service
 * Handles integration with Mongolia's e-Barimt (Electronic Receipt) system
 */
export class EbarimtService {
  private apiUrl: string;
  private posNo: string;
  private merchantTin: string;
  private apiKey: string;
  private apiSecret: string;
  private districtCode: string;
  private mockMode: boolean;

  constructor() {
    this.apiUrl = config.ebarimt.apiUrl;
    this.posNo = config.ebarimt.posNo;
    this.merchantTin = config.ebarimt.merchantTin;
    this.apiKey = config.ebarimt.apiKey;
    this.apiSecret = config.ebarimt.apiSecret;
    this.districtCode = config.ebarimt.districtCode;
    this.mockMode = config.ebarimt.mockMode;
  }

  /**
   * Register bill (PUT /bill)
   * This creates an e-Barimt receipt for a sale
   */
  async registerBill(
    orderData: EbarimtBillRequest
  ): Promise<EbarimtBillResponse> {
    if (this.mockMode) {
      logger.info(`[MOCK] Registering e-Barimt bill: ${orderData.billIdSuffix}`);
      
      // Simulate API delay
      await this.delay(500);
      
      // Mock response with fake lottery number
      const mockId = `MOCK_${Date.now()}`;
      const mockLottery = this.generateMockLottery();
      const mockBillId = `${this.posNo}_${orderData.billIdSuffix}`;
      
      return {
        success: true,
        id: mockId,
        billId: mockBillId,
        lottery: mockLottery,
        qrData: this.generateMockQR(mockBillId, mockLottery),
        date: new Date().toISOString(),
        message: "Bill registered successfully (mock mode)",
      };
    }

    try {
      // Real API call to e-Barimt
      const response = await this.makeAuthenticatedRequest(
        "PUT",
        "/bill",
        orderData
      );

      logger.info(`E-Barimt bill registered: ${response.billId}, lottery: ${response.lottery}`);

      return {
        success: true,
        id: response.id,
        billId: response.billId,
        lottery: response.lottery,
        qrData: response.qrData,
        date: response.date,
        message: "Bill registered successfully",
      };
    } catch (error) {
      logger.error("Error registering e-Barimt bill:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get bill details (GET /bill)
   * Retrieve an existing e-Barimt receipt
   */
  async getBill(billId: string): Promise<EbarimtBillResponse> {
    if (this.mockMode) {
      logger.info(`[MOCK] Getting e-Barimt bill: ${billId}`);
      
      await this.delay(300);
      
      return {
        success: true,
        id: `MOCK_${billId}`,
        billId: billId,
        lottery: this.generateMockLottery(),
        qrData: this.generateMockQR(billId, "123456"),
        date: new Date().toISOString(),
        message: "Bill retrieved successfully (mock mode)",
      };
    }

    try {
      const response = await this.makeAuthenticatedRequest(
        "GET",
        `/bill/${billId}`,
        null
      );

      return {
        success: true,
        ...response,
        message: "Bill retrieved successfully",
      };
    } catch (error) {
      logger.error(`Error getting e-Barimt bill ${billId}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Return/Cancel bill (DELETE /bill)
   * Used for returns and cancellations
   */
  async returnBill(billId: string): Promise<EbarimtBillResponse> {
    if (this.mockMode) {
      logger.info(`[MOCK] Returning e-Barimt bill: ${billId}`);
      
      await this.delay(400);
      
      return {
        success: true,
        id: `RETURN_${billId}`,
        message: "Bill returned successfully (mock mode)",
      };
    }

    try {
      const response = await this.makeAuthenticatedRequest(
        "DELETE",
        `/bill/${billId}`,
        null
      );

      logger.info(`E-Barimt bill returned: ${billId}`);

      return {
        success: true,
        ...response,
        message: "Bill returned successfully",
      };
    } catch (error) {
      logger.error(`Error returning e-Barimt bill ${billId}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Check e-Barimt system status
   */
  async checkStatus(): Promise<{
    success: boolean;
    online: boolean;
    message: string;
  }> {
    if (this.mockMode) {
      logger.info("[MOCK] Checking e-Barimt system status");
      
      await this.delay(200);
      
      return {
        success: true,
        online: true,
        message: "E-Barimt system is online (mock mode)",
      };
    }

    try {
      // Check if system is reachable
      await this.makeAuthenticatedRequest("GET", "/health", null);
      
      return {
        success: true,
        online: true,
        message: "E-Barimt system is online",
      };
    } catch (error) {
      logger.error("E-Barimt system is offline:", error);
      return {
        success: false,
        online: false,
        message: "E-Barimt system is offline or unreachable",
      };
    }
  }

  /**
   * Make authenticated request to e-Barimt API
   */
  private async makeAuthenticatedRequest(
    method: string,
    endpoint: string,
    data: any
  ): Promise<any> {
    const url = `${this.apiUrl}${endpoint}`;
    
    // Generate authentication token
    const timestamp = Date.now().toString();
    const token = this.generateAuthToken(timestamp);

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Timestamp": timestamp,
        "X-API-Key": this.apiKey,
      },
    };

    if (data && (method === "PUT" || method === "POST")) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`E-Barimt API error: ${response.status} - ${errorBody}`);
    }

    return await response.json();
  }

  /**
   * Generate authentication token using HMAC-SHA256
   * Based on e-Barimt API authentication requirements
   */
  private generateAuthToken(timestamp: string): string {
    const message = `${this.apiKey}${timestamp}`;
    const hmac = crypto.createHmac("sha256", this.apiSecret);
    hmac.update(message);
    return hmac.digest("hex");
  }

  /**
   * Generate mock lottery number for testing (6 digits)
   */
  private generateMockLottery(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate mock QR code data
   */
  private generateMockQR(billId: string, lottery: string): string {
    return `ebarimt:${billId}:${lottery}:${Date.now()}`;
  }

  /**
   * Delay helper for mock responses
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Helper: Prepare e-Barimt data from order
   */
  prepareOrderData(order: any): EbarimtBillRequest {
    const customer = order.customer;
    const orderItems = order.orderItems;

    // Generate unique order number if not exists
    const billIdSuffix = order.orderNumber || `ORD${order.id}${Date.now()}`;

    // Prepare line items
    const stocks: EbarimtBillItem[] = orderItems.map((item: any) => {
      const product = item.product;
      const itemTotal = parseFloat(item.totalPrice.toString());
      const itemVat = order.vatAmount ? itemTotal * 0.1 : 0;

      return {
        barCode: product.barcode || product.productCode || `PROD${product.id}`,
        barCodeType: "ITEM" as const,
        classificationCode: "123456789012", // TODO: Get from product category
        name: product.nameMongolian,
        measureUnit: "ш", // TODO: Get from product
        qty: item.quantity,
        unitPrice: parseFloat(item.price.toString()),
        totalAmount: itemTotal,
        cityTax: 0,
        vat: itemVat,
        discount: 0,
      };
    });

    // Prepare payment info
    const paymentCode = this.mapPaymentMethod(order.paymentMethod);
    const payments = [{
      code: paymentCode,
      amount: parseFloat(order.totalAmount.toString()),
    }];

    return {
      amount: parseFloat(order.totalAmount.toString()),
      vat: order.vatAmount ? parseFloat(order.vatAmount.toString()) : 0,
      cityTax: 0,
      districtCode: customer.district || this.districtCode,
      merchantTin: this.merchantTin,
      posNo: this.posNo,
      customerNo: customer.registrationNumber || undefined,
      customerName: customer.organizationName || customer.name,
      billType: customer.isVatPayer ? "3" : "1",
      billIdSuffix,
      stocks,
      payments,
    };
  }

  /**
   * Map payment method to e-Barimt payment code
   */
  private mapPaymentMethod(method: string): string {
    const mapping: { [key: string]: string } = {
      Cash: "CASH",
      Card: "CARD",
      BankTransfer: "TRANSFER",
      Credit: "CREDIT",
      QR: "QRCODE",
      Mobile: "MOBILE",
    };
    return mapping[method] || "CASH";
  }
}

// Export singleton instance
export const ebarimtService = new EbarimtService();

// Export types
export type {
  EbarimtBillItem,
  EbarimtBillRequest,
  EbarimtBillResponse,
};

