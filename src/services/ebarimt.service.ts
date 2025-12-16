import axios, { AxiosInstance } from "axios";
import logger from "../utils/logger";

interface EBarimtConfig {
  apiUrl: string;
  posNo: string;
  regNo: string;
  apiKey?: string;
}

interface EBarimtItem {
  name: string;
  barCode?: string;
  barCodeType?: string;
  classificationCode?: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
  cityTax: number;
  vat: number;
}

interface EBarimtRequest {
  posNo: string;
  regNo: string;
  orgName: string;
  orgCity?: string;
  orgDistrict?: string;
  customerNo?: string;
  customerName?: string;
  customerTin?: string;
  totalAmount: number;
  totalVat: number;
  totalCityTax: number;
  districtCode?: string;
  branchNo?: string;
  paymentType: string; // CASH, CARD, etc.
  billType: string; // 1=Retail, 3=Organization
  stocks: EBarimtItem[];
}

interface EBarimtResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string; // E-Barimt ID
    billId: string; // ДДТД (Bill ID)
    date: string;
    lottery: string; // Сугалааны дугаар
    qrData: string; // QR code data
    billIdHash?: string;
    lotteryWarningMsg?: string;
  };
  errorCode?: string;
  errorMessage?: string;
}

class EBarimtService {
  private client: AxiosInstance;
  private config: EBarimtConfig;
  private isEnabled: boolean;

  constructor() {
    // Configuration from environment variables
    this.config = {
      apiUrl:
        process.env.EBARIMT_API_URL || "https://api.ebarimt.mn/api/put/put",
      posNo: process.env.EBARIMT_POS_NO || "",
      regNo: process.env.EBARIMT_REG_NO || "",
      apiKey: process.env.EBARIMT_API_KEY,
    };

    // Enable/disable E-Barimt based on configuration
    this.isEnabled =
      process.env.EBARIMT_ENABLED === "true" &&
      !!this.config.posNo &&
      !!this.config.regNo;

    // Create axios instance
    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        ...(this.config.apiKey && {
          Authorization: `Bearer ${this.config.apiKey}`,
        }),
      },
    });

    if (!this.isEnabled) {
      logger.warn(
        "E-Barimt service is disabled. Set EBARIMT_ENABLED=true and configure POS_NO and REG_NO to enable."
      );
    } else {
      logger.info("E-Barimt service initialized successfully");
    }
  }

  /**
   * Check if E-Barimt service is enabled
   */
  public isServiceEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Register a receipt with E-Barimt system
   */
  async registerReceipt(orderData: {
    orderNumber: string;
    customer: {
      name: string;
      registrationNumber?: string | null;
    };
    items: Array<{
      productName: string;
      barcode?: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    vat: number;
    total: number;
    paymentMethod: string;
  }): Promise<EBarimtResponse> {
    if (!this.isEnabled) {
      logger.warn("E-Barimt service is disabled, skipping registration");
      return {
        success: false,
        message: "E-Barimt service is disabled",
        errorCode: "SERVICE_DISABLED",
      };
    }

    try {
      // Map payment method to E-Barimt payment type
      const paymentType = this.mapPaymentMethod(orderData.paymentMethod);

      // Determine bill type (1=Retail, 3=Organization)
      const billType = orderData.customer.registrationNumber ? "3" : "1";

      // Prepare request data
      const requestData: EBarimtRequest = {
        posNo: this.config.posNo,
        regNo: this.config.regNo,
        orgName: "GLF LLC OASIS Бөөний төв",
        customerNo: orderData.orderNumber,
        customerName: orderData.customer.name,
        customerTin: orderData.customer.registrationNumber || undefined,
        totalAmount: orderData.total,
        totalVat: orderData.vat,
        totalCityTax: 0,
        paymentType,
        billType,
        stocks: orderData.items.map((item) => ({
          name: item.productName,
          barCode: item.barcode || undefined,
          barCodeType: item.barcode ? "GS1" : undefined,
          qty: item.quantity,
          unitPrice: item.unitPrice,
          totalAmount: item.total,
          cityTax: 0,
          vat: item.total * 0.1, // 10% VAT
        })),
      };

      logger.info("Registering receipt with E-Barimt", {
        orderNumber: orderData.orderNumber,
        total: orderData.total,
      });

      // Send request to E-Barimt API
      const response = await this.client.post<EBarimtResponse>(
        "/api/put/put",
        requestData
      );

      if (response.data.success) {
        logger.info("Receipt registered successfully with E-Barimt", {
          orderNumber: orderData.orderNumber,
          billId: response.data.data?.billId,
          lottery: response.data.data?.lottery,
        });
      } else {
        logger.error("E-Barimt registration failed", {
          orderNumber: orderData.orderNumber,
          error: response.data.errorMessage,
        });
      }

      return response.data;
    } catch (error) {
      logger.error("Error registering receipt with E-Barimt", {
        error: error instanceof Error ? error.message : String(error),
        orderNumber: orderData.orderNumber,
      });

      return {
        success: false,
        message: "Failed to register with E-Barimt",
        errorCode: "API_ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Return/cancel a receipt
   */
  async returnReceipt(billId: string): Promise<EBarimtResponse> {
    if (!this.isEnabled) {
      return {
        success: false,
        message: "E-Barimt service is disabled",
        errorCode: "SERVICE_DISABLED",
      };
    }

    try {
      const requestData = {
        posNo: this.config.posNo,
        regNo: this.config.regNo,
        billId,
      };

      logger.info("Returning receipt in E-Barimt", { billId });

      const response = await this.client.post<EBarimtResponse>(
        "/api/put/return",
        requestData
      );

      if (response.data.success) {
        logger.info("Receipt returned successfully", { billId });
      }

      return response.data;
    } catch (error) {
      logger.error("Error returning receipt", {
        error: error instanceof Error ? error.message : String(error),
        billId,
      });

      return {
        success: false,
        message: "Failed to return receipt",
        errorCode: "API_ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Map payment method to E-Barimt payment type
   */
  private mapPaymentMethod(method: string): string {
    const paymentMapping: { [key: string]: string } = {
      Cash: "CASH",
      Card: "CARD",
      BankTransfer: "BANK",
      Credit: "CREDIT",
      QR: "MOBILE",
      Mobile: "MOBILE",
    };

    return paymentMapping[method] || "CASH";
  }

  /**
   * Format QR code data for display
   */
  generateQRData(billId: string, date: string, amount: number): string {
    // Standard E-Barimt QR format
    return `${billId}|${date}|${amount}`;
  }
}

export default new EBarimtService();
