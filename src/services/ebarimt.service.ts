import axios, { AxiosInstance } from "axios";
import logger from "../utils/logger";

// ==================== INTERFACES ====================

interface EBarimtConfig {
  apiUrl: string;
  posNo: string;
  merchantTin: string; // ТТД (Татвар төлөгчийн дугаар)
  apiKey?: string;
  districtCode: string;
  branchNo: string;
  macAddress?: string;
}

// Item interface matching official API
interface EBarimtItem {
  name: string;
  barCode?: string;
  barCodeType?: string; // GS1, ISBN, UNDEFINED
  classificationCode?: string; // 7-digit BUNA code
  taxProductCode?: string | null;
  measureUnit?: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
  totalVAT: number;
  totalCityTax: number;
}

// Receipt sub-object in request
interface EBarimtReceiptItem {
  totalAmount: number;
  taxType: "VAT_ABLE" | "VAT_FREE" | "VAT_ZERO" | "NO_VAT";
  merchantTin: string;
  customerTin?: string | null;
  totalVAT: number;
  totalCityTax: number;
  invoiceId?: string | null;
  bankAccountNo?: string;
  iBan?: string;
  items: EBarimtItem[];
}

// Official API request format from https://developer.itc.gov.mn
interface EBarimtRequest {
  branchNo: string;
  totalAmount: number;
  totalVAT: number;
  totalCityTax: number;
  districtCode: string;
  merchantTin: string;
  posNo: string;
  customerTin?: string | null;
  consumerNo?: string; // Order number
  type: "B2C_RECEIPT" | "B2B_RECEIPT";
  inactiveId?: string | null; // For return receipts
  reportMonth?: string | null; // YYYYMM format for supplement
  billIdSuffix?: string;
  receipts: EBarimtReceiptItem[];
  payments: Array<{
    code: "CASH" | "CARD" | "BANK" | "MOBILE" | "CREDIT";
    status: "PAID" | "UNPAID";
    paidAmount: number;
  }>;
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

// PosAPI getInformation response interface
interface PosApiInformation {
  success: boolean;
  registerNo?: string;
  branchNo?: string;
  posNo?: string;
  dbDirPath?: string;
  lastSentDate?: string; // Last sent date to central system
  lotteryCount?: number; // Remaining lottery numbers
  billCount?: number; // Unsent bills count
  billAmount?: number; // Unsent bills total amount
  lottery?: {
    warningCount?: number; // Warning threshold for lottery
    warningMsg?: string; // Warning message
  };
  message?: string;
  errorCode?: string;
}

// PosAPI sendData response interface
interface SendDataResponse {
  success: boolean;
  sentBillCount?: number;
  sentAmount?: number;
  message?: string;
  errorCode?: string;
  errorMessage?: string;
}

// Bill edit/correction interface
interface BillEditRequest {
  originalBillId: string;
  editType: "EDIT" | "RETURN" | "SUPPLEMENT"; // Засварлах, Буцаах, Нөхөж олгох
  reason?: string;
  newData?: Partial<EBarimtRequest>;
}

// District codes for Ulaanbaatar (for NHAT calculation)
const ULAANBAATAR_DISTRICTS = [
  "01", // Баянзүрх
  "02", // Баянгол
  "03", // Сонгинохайрхан
  "04", // Хан-Уул
  "05", // Чингэлтэй
  "06", // Сүхбаатар
  "07", // Багануур
  "08", // Багахангай
  "09", // Налайх
];

// VAT rate constant
const VAT_RATE = 0.1; // 10%
// City tax (NHAT) rate for Ulaanbaatar
const CITY_TAX_RATE = 0.02; // 2%

class EBarimtService {
  private client: AxiosInstance;
  private config: EBarimtConfig;
  private isEnabled: boolean;

  constructor() {
    // Configuration from environment variables
    // Official eBarimt API runs on localhost:7080
    this.config = {
      apiUrl: process.env.EBARIMT_API_URL || "http://localhost:7080",
      posNo: process.env.EBARIMT_POS_NO || "001",
      merchantTin: process.env.EBARIMT_MERCHANT_TIN || process.env.EBARIMT_REG_NO || "",
      apiKey: process.env.EBARIMT_API_KEY,
      districtCode: process.env.EBARIMT_DISTRICT_CODE || "06", // Default: Сүхбаатар
      branchNo: process.env.EBARIMT_BRANCH_NO || "001",
      macAddress: process.env.EBARIMT_MAC_ADDRESS,
    };

    // Enable/disable E-Barimt based on configuration
    this.isEnabled =
      process.env.EBARIMT_ENABLED === "true" &&
      !!this.config.posNo &&
      !!this.config.merchantTin;

    // Create axios instance for POS API
    // Official API requires Accept: application/soap+xml header
    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/soap+xml",
        ...(this.config.apiKey && {
          Authorization: `Bearer ${this.config.apiKey}`,
        }),
      },
    });

    if (!this.isEnabled) {
      logger.warn(
        "E-Barimt service is disabled. Set EBARIMT_ENABLED=true and configure POS_NO and MERCHANT_TIN to enable."
      );
    } else {
      logger.info("E-Barimt service initialized successfully", {
        posNo: this.config.posNo,
        districtCode: this.config.districtCode,
      });
    }
  }

  /**
   * Check if E-Barimt service is enabled
   */
  public isServiceEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Get configuration
   */
  public getConfig(): EBarimtConfig {
    return { ...this.config };
  }

  // ==================== POS API 3.0 FUNCTIONS ====================

  /**
   * getInformation - Ажиллагааны мэдээлэл хүлээн авах
   * Gets system information including lottery count, last sent date, and warnings
   * Required by: https://developer.itc.gov.mn
   */
  async getInformation(): Promise<{
    success: boolean;
    posNo?: string;
    branchNo?: string;
    lastSentDate?: string;
    lotteryCount?: number;
    billCount?: number;
    billAmount?: number;
    warningMessage?: string;
    shouldSendNow?: boolean; // True if 3-day limit approaching or lottery low
    message?: string;
    errorCode?: string;
  }> {
    if (!this.isEnabled) {
      return {
        success: false,
        message: "E-Barimt service is disabled",
        errorCode: "SERVICE_DISABLED",
      };
    }

    try {
      logger.info("Getting POS API information");

      const response = await this.client.get<PosApiInformation>(
        "/getInformation"
      );

      const data = response.data;

      // Check if lottery count is running low (less than 100)
      const lotteryWarning = (data.lotteryCount || 0) < 100;

      // Check if bills need to be sent (3-day rule)
      const shouldSendNow = this.checkSendRequired(data.lastSentDate);

      // Build warning message
      let warningMessage = "";
      if (lotteryWarning) {
        warningMessage += `Сугалааны дугаар дуусаж байна! Үлдсэн: ${data.lotteryCount}. `;
      }
      if (data.lottery?.warningMsg) {
        warningMessage += data.lottery.warningMsg + " ";
      }
      if (shouldSendNow) {
        warningMessage += `Баримтуудыг нэгдсэн системд илгээх шаардлагатай (3 хоногийн хугацаа). `;
      }
      if ((data.billCount || 0) > 0) {
        warningMessage += `Илгээгээгүй баримт: ${
          data.billCount
        } ширхэг, ${data.billAmount?.toLocaleString()}₮. `;
      }

      logger.info("POS API information retrieved", {
        lotteryCount: data.lotteryCount,
        billCount: data.billCount,
        lastSentDate: data.lastSentDate,
        shouldSendNow,
      });

      return {
        success: true,
        posNo: data.posNo,
        branchNo: data.branchNo,
        lastSentDate: data.lastSentDate,
        lotteryCount: data.lotteryCount,
        billCount: data.billCount,
        billAmount: data.billAmount,
        warningMessage: warningMessage.trim() || undefined,
        shouldSendNow: shouldSendNow || lotteryWarning,
        message: "Information retrieved successfully",
      };
    } catch (error) {
      logger.error("Error getting POS API information", {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        success: false,
        message: "Failed to get information",
        errorCode: "API_ERROR",
      };
    }
  }

  /**
   * Check if we need to send data based on 3-day rule
   */
  private checkSendRequired(lastSentDate?: string): boolean {
    if (!lastSentDate) return true;

    const lastSent = new Date(lastSentDate);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24)
    );

    // According to law, must send at least once every 3 days
    return diffDays >= 2; // Warn when 2 days passed
  }

  /**
   * sendData - Төлбөрийн баримтын нэгдсэн системд мэдээлэл илгээх
   * Sends collected receipts to the central system
   * Required by: https://developer.itc.gov.mn
   */
  async sendData(): Promise<SendDataResponse> {
    if (!this.isEnabled) {
      return {
        success: false,
        message: "E-Barimt service is disabled",
        errorCode: "SERVICE_DISABLED",
      };
    }

    try {
      logger.info("Sending data to central system");

      const response = await this.client.get<SendDataResponse>("/sendData");

      if (response.data.success) {
        logger.info("Data sent successfully to central system", {
          sentBillCount: response.data.sentBillCount,
          sentAmount: response.data.sentAmount,
        });
      } else {
        logger.warn("sendData returned unsuccessful", {
          errorCode: response.data.errorCode,
          message: response.data.message,
        });
      }

      return response.data;
    } catch (error) {
      logger.error("Error sending data to central system", {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        success: false,
        message: "Failed to send data",
        errorCode: "API_ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * checkTin - Татвар төлөгчийн дугаар лавлах (TIN/Civil_id)
   */
  async checkTin(tin: string): Promise<{
    success: boolean;
    found: boolean;
    name?: string;
    tin?: string;
    message?: string;
  }> {
    if (!this.isEnabled) {
      return {
        success: false,
        found: false,
        message: "E-Barimt service is disabled",
      };
    }

    try {
      const response = await this.client.get(`/checkTin?tin=${tin}`);

      return {
        success: true,
        found: response.data.found || false,
        name: response.data.name,
        tin: response.data.tin,
        message: response.data.found ? "TIN found" : "TIN not found",
      };
    } catch (error) {
      logger.error("Error checking TIN", {
        error: error instanceof Error ? error.message : String(error),
        tin,
      });

      return {
        success: false,
        found: false,
        message: "Failed to check TIN",
      };
    }
  }

  /**
   * getDistrictCodes - Аймаг дүүргийн код лавлах
   */
  async getDistrictCodes(): Promise<{
    success: boolean;
    districts?: Array<{ code: string; name: string }>;
    message?: string;
  }> {
    try {
      const response = await this.client.get("/getDistrictCodes");

      return {
        success: true,
        districts: response.data.districts || [],
        message: "District codes retrieved",
      };
    } catch (error) {
      logger.error("Error getting district codes", {
        error: error instanceof Error ? error.message : String(error),
      });

      // Return default Ulaanbaatar districts as fallback
      return {
        success: true,
        districts: [
          { code: "01", name: "Баянзүрх" },
          { code: "02", name: "Баянгол" },
          { code: "03", name: "Сонгинохайрхан" },
          { code: "04", name: "Хан-Уул" },
          { code: "05", name: "Чингэлтэй" },
          { code: "06", name: "Сүхбаатар" },
          { code: "07", name: "Багануур" },
          { code: "08", name: "Багахангай" },
          { code: "09", name: "Налайх" },
        ],
        message: "Using default district codes",
      };
    }
  }

  // ==================== RECEIPT REGISTRATION ====================

  /**
   * Register a receipt with E-Barimt system
   * Uses official API format from https://developer.itc.gov.mn
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
      classificationCode?: string; // 7-digit BUNA code
      quantity: number;
      unitPrice: number;
      total: number;
      vatType?: "VAT" | "VAT_FREE" | "VAT_ZERO" | "NO_VAT";
      measureUnit?: string;
    }>;
    subtotal: number;
    vat: number;
    total: number;
    cityTax?: number; // NHAT
    paymentMethod: string;
    districtCode?: string; // For NHAT calculation
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
      // Map payment method to E-Barimt payment code
      const paymentCode = this.mapPaymentMethod(orderData.paymentMethod);

      // Determine receipt type (B2C or B2B)
      const receiptType = orderData.customer.registrationNumber 
        ? "B2B_RECEIPT" 
        : "B2C_RECEIPT";

      // Get district code (for NHAT calculation)
      const districtCode = orderData.districtCode || this.config.districtCode;

      // Check if this district requires NHAT (Ulaanbaatar only)
      const requiresNHAT = this.isUlaanbaatarDistrict(districtCode);

      // Calculate totals and prepare items
      let totalVAT = 0;
      let totalCityTax = 0;

      const items: EBarimtItem[] = orderData.items.map((item) => {
        const vatType = item.vatType || "VAT";
        let itemVat = 0;
        let itemCityTax = 0;

        // Calculate VAT based on type (VAT is included in total)
        if (vatType === "VAT") {
          // VAT = total * 10 / 110 (extracting VAT from inclusive price)
          itemVat = Math.round((item.total * VAT_RATE / (1 + VAT_RATE)) * 100) / 100;
          totalVAT += itemVat;
        }

        // Calculate NHAT (City Tax) for Ulaanbaatar
        if (requiresNHAT && vatType === "VAT") {
          // City Tax = (total - VAT) * 2%
          const baseAmount = item.total - itemVat;
          itemCityTax = Math.round(baseAmount * CITY_TAX_RATE * 100) / 100;
          totalCityTax += itemCityTax;
        }

        return {
          name: item.productName,
          barCode: item.barcode || undefined,
          barCodeType: item.barcode
            ? this.detectBarcodeType(item.barcode)
            : undefined,
          classificationCode: item.classificationCode || undefined,
          taxProductCode: null,
          measureUnit: item.measureUnit || "ширхэг",
          qty: item.quantity,
          unitPrice: item.unitPrice,
          totalAmount: item.total,
          totalVAT: itemVat,
          totalCityTax: itemCityTax,
        };
      });

      // Determine tax type for receipt
      const taxType = orderData.items.some(i => i.vatType === "VAT_FREE") 
        ? "VAT_FREE" as const
        : orderData.items.some(i => i.vatType === "VAT_ZERO")
          ? "VAT_ZERO" as const
          : orderData.items.some(i => i.vatType === "NO_VAT")
            ? "NO_VAT" as const
            : "VAT_ABLE" as const;

      // Prepare request data using official API format
      const requestData: EBarimtRequest = {
        branchNo: this.config.branchNo,
        totalAmount: orderData.total,
        totalVAT: Math.round(totalVAT * 100) / 100,
        totalCityTax: Math.round(totalCityTax * 100) / 100,
        districtCode,
        merchantTin: this.config.merchantTin,
        posNo: this.config.posNo,
        customerTin: orderData.customer.registrationNumber || null,
        consumerNo: orderData.orderNumber,
        type: receiptType,
        inactiveId: null,
        reportMonth: null,
        billIdSuffix: "01",
        receipts: [
          {
            totalAmount: orderData.total,
            taxType,
            merchantTin: this.config.merchantTin,
            customerTin: orderData.customer.registrationNumber || null,
            totalVAT: Math.round(totalVAT * 100) / 100,
            totalCityTax: Math.round(totalCityTax * 100) / 100,
            invoiceId: null,
            bankAccountNo: "",
            iBan: "",
            items,
          },
        ],
        payments: [
          {
            code: paymentCode as "CASH" | "CARD" | "BANK" | "MOBILE" | "CREDIT",
            status: "PAID",
            paidAmount: orderData.total,
          },
        ],
      };

      logger.info("Registering receipt with E-Barimt", {
        orderNumber: orderData.orderNumber,
        total: orderData.total,
        type: receiptType,
        districtCode,
        hasCityTax: totalCityTax > 0,
      });

      // Send request to E-Barimt API (official endpoint: /rest/receipt)
      const response = await this.client.post<EBarimtResponse>(
        "/rest/receipt",
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
          errorCode: response.data.errorCode,
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
   * Detect barcode type based on format
   */
  private detectBarcodeType(barcode: string): string {
    if (!barcode) return "UNDEFINED";

    // GS1 barcodes are typically 8, 12, 13, or 14 digits
    if (/^\d{8}$/.test(barcode) || /^\d{12,14}$/.test(barcode)) {
      return "GS1";
    }

    // ISBN is 10 or 13 digits, often starts with 978 or 979
    if (/^(978|979)\d{10}$/.test(barcode) || /^\d{10}$/.test(barcode)) {
      return "ISBN";
    }

    return "UNDEFINED";
  }

  /**
   * Check if district is in Ulaanbaatar (requires NHAT)
   */
  private isUlaanbaatarDistrict(districtCode: string): boolean {
    return ULAANBAATAR_DISTRICTS.includes(districtCode);
  }

  // ==================== BILL OPERATIONS ====================

  /**
   * Return/delete a receipt - Баримт буцаах
   */
  async returnReceipt(
    billId: string,
    reason?: string
  ): Promise<EBarimtResponse> {
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
        merchantTin: this.config.merchantTin,
        billId,
        returnReason: reason || "Буцаалт",
      };

      logger.info("Returning receipt in E-Barimt", { billId, reason });

      const response = await this.client.delete<EBarimtResponse>(`/delete`, {
        data: requestData,
      });

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
   * Edit/correct a receipt - Баримт засварлах
   * Note: Only available within the same month
   */
  async editReceipt(editRequest: BillEditRequest): Promise<EBarimtResponse> {
    if (!this.isEnabled) {
      return {
        success: false,
        message: "E-Barimt service is disabled",
        errorCode: "SERVICE_DISABLED",
      };
    }

    try {
      logger.info("Editing receipt in E-Barimt", {
        originalBillId: editRequest.originalBillId,
        editType: editRequest.editType,
      });

      // First, return the original bill
      const returnResult = await this.returnReceipt(
        editRequest.originalBillId,
        editRequest.reason || `Засварлах: ${editRequest.editType}`
      );

      if (!returnResult.success) {
        return {
          success: false,
          message: `Failed to return original bill: ${returnResult.message}`,
          errorCode: returnResult.errorCode,
        };
      }

      // If just returning, we're done
      if (editRequest.editType === "RETURN") {
        return returnResult;
      }

      // For EDIT and SUPPLEMENT, create a new bill with corrected data
      if (editRequest.newData) {
        const newBillData = {
          ...editRequest.newData,
          returnBillId: editRequest.originalBillId, // Reference to original
        };

        const response = await this.client.post<EBarimtResponse>(
          "/put",
          newBillData
        );

        logger.info("Corrected receipt created", {
          originalBillId: editRequest.originalBillId,
          newBillId: response.data.data?.billId,
        });

        return response.data;
      }

      return returnResult;
    } catch (error) {
      logger.error("Error editing receipt", {
        error: error instanceof Error ? error.message : String(error),
        originalBillId: editRequest.originalBillId,
      });

      return {
        success: false,
        message: "Failed to edit receipt",
        errorCode: "API_ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Supplement receipt for previous month - Өмнөх сарын баримт нөхөж олгох
   */
  async supplementReceipt(orderData: {
    orderNumber: string;
    customer: {
      name: string;
      registrationNumber?: string | null;
    };
    items: Array<{
      productName: string;
      barcode?: string;
      classificationCode?: string;
      quantity: number;
      unitPrice: number;
      total: number;
      vatType?: "VAT" | "VAT_FREE" | "VAT_ZERO" | "NO_VAT";
    }>;
    subtotal: number;
    vat: number;
    total: number;
    paymentMethod: string;
    originalDate: Date; // The date of original transaction
  }): Promise<EBarimtResponse> {
    if (!this.isEnabled) {
      return {
        success: false,
        message: "E-Barimt service is disabled",
        errorCode: "SERVICE_DISABLED",
      };
    }

    // Check if supplement is for previous month only
    const now = new Date();
    const originalDate = new Date(orderData.originalDate);
    const monthDiff =
      (now.getFullYear() - originalDate.getFullYear()) * 12 +
      (now.getMonth() - originalDate.getMonth());

    if (monthDiff !== 1) {
      return {
        success: false,
        message: "Нөхөж олгох нь зөвхөн өмнөх сарын баримтад л боломжтой",
        errorCode: "INVALID_SUPPLEMENT_DATE",
      };
    }

    try {
      logger.info("Supplementing receipt for previous month", {
        orderNumber: orderData.orderNumber,
        originalDate: orderData.originalDate,
      });

      // Register as supplement
      const result = await this.registerReceipt({
        ...orderData,
        cityTax: 0, // Will be calculated in registerReceipt
      });

      return result;
    } catch (error) {
      logger.error("Error supplementing receipt", {
        error: error instanceof Error ? error.message : String(error),
        orderNumber: orderData.orderNumber,
      });

      return {
        success: false,
        message: "Failed to supplement receipt",
        errorCode: "API_ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

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

  /**
   * Check E-Barimt system status
   */
  async checkStatus(): Promise<{
    success: boolean;
    online: boolean;
    message: string;
    info?: {
      lotteryCount?: number;
      billCount?: number;
      lastSentDate?: string;
      warningMessage?: string;
    };
  }> {
    if (!this.isEnabled) {
      return {
        success: true,
        online: false,
        message: "E-Barimt service is disabled",
      };
    }

    try {
      // Get full information instead of just ping
      const info = await this.getInformation();

      return {
        success: true,
        online: info.success,
        message: info.success
          ? "E-Barimt system is online"
          : "E-Barimt system unavailable",
        info: {
          lotteryCount: info.lotteryCount,
          billCount: info.billCount,
          lastSentDate: info.lastSentDate,
          warningMessage: info.warningMessage,
        },
      };
    } catch (error) {
      logger.error("E-Barimt status check failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: true,
        online: false,
        message: `E-Barimt system unavailable: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Prepare order data for E-Barimt registration
   */
  prepareOrderData(order: {
    orderNumber: string;
    customer?: {
      name?: string;
      registrationNumber?: string | null;
      district?: string | null;
    } | null;
    orderItems: Array<{
      product: {
        nameMongolian: string;
        barcode?: string | null;
        classificationCode?: string | null;
        vatType?: string | null;
      };
      quantity: number;
      unitPrice: number | { toNumber?: () => number };
    }>;
    totalAmount?: number | { toNumber?: () => number } | null;
    paymentMethod?: string | null;
    districtCode?: string | null;
  }): {
    orderNumber: string;
    customer: { name: string; registrationNumber?: string | null };
    items: Array<{
      productName: string;
      barcode?: string;
      classificationCode?: string;
      quantity: number;
      unitPrice: number;
      total: number;
      vatType?: "VAT" | "VAT_FREE" | "VAT_ZERO" | "NO_VAT";
    }>;
    subtotal: number;
    vat: number;
    total: number;
    cityTax: number;
    paymentMethod: string;
    districtCode?: string;
  } {
    // Helper to convert Decimal to number
    const toNum = (
      val: number | { toNumber?: () => number } | null | undefined
    ): number => {
      if (val === null || val === undefined) return 0;
      if (typeof val === "number") return val;
      if (typeof val.toNumber === "function") return val.toNumber();
      return Number(val);
    };

    const total = toNum(order.totalAmount);
    const districtCode =
      order.districtCode ||
      order.customer?.district ||
      this.config.districtCode;
    const requiresNHAT = this.isUlaanbaatarDistrict(districtCode);

    // Calculate with VAT and NHAT
    let subtotal: number;
    let vat: number;
    let cityTax = 0;

    if (requiresNHAT) {
      // Total = subtotal * (1 + VAT_RATE + CITY_TAX_RATE)
      subtotal = total / (1 + VAT_RATE + CITY_TAX_RATE);
      vat = subtotal * VAT_RATE;
      cityTax = subtotal * CITY_TAX_RATE;
    } else {
      // Total = subtotal * (1 + VAT_RATE)
      subtotal = total / (1 + VAT_RATE);
      vat = total - subtotal;
    }

    return {
      orderNumber: order.orderNumber,
      customer: {
        name: order.customer?.name || "Жирэмсэн худалдан авагч",
        registrationNumber: order.customer?.registrationNumber,
      },
      items: order.orderItems.map((item) => {
        const unitPrice = toNum(item.unitPrice);
        const itemTotal = unitPrice * item.quantity;
        const vatType =
          (item.product.vatType as
            | "VAT"
            | "VAT_FREE"
            | "VAT_ZERO"
            | "NO_VAT") || "VAT";

        return {
          productName: item.product.nameMongolian,
          barcode: item.product.barcode || undefined,
          classificationCode: item.product.classificationCode || undefined,
          quantity: item.quantity,
          unitPrice,
          total: itemTotal,
          vatType,
        };
      }),
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total,
      cityTax: Math.round(cityTax * 100) / 100,
      paymentMethod: order.paymentMethod || "Cash",
      districtCode,
    };
  }

  /**
   * Register a bill with E-Barimt
   */
  async registerBill(data: {
    orderNumber: string;
    customer: { name: string; registrationNumber?: string | null };
    items: Array<{
      productName: string;
      barcode?: string;
      classificationCode?: string;
      quantity: number;
      unitPrice: number;
      total: number;
      vatType?: "VAT" | "VAT_FREE" | "VAT_ZERO" | "NO_VAT";
    }>;
    subtotal: number;
    vat: number;
    total: number;
    cityTax?: number;
    paymentMethod: string;
    districtCode?: string;
  }): Promise<{
    success: boolean;
    id?: string;
    billId?: string;
    lottery?: string;
    qrData?: string;
    message?: string;
  }> {
    const result = await this.registerReceipt(data);

    if (result.success && result.data) {
      return {
        success: true,
        id: result.data.id,
        billId: result.data.billId,
        lottery: result.data.lottery,
        qrData: result.data.qrData,
        message: "Bill registered successfully",
      };
    }

    return {
      success: false,
      message: result.message || result.errorMessage || "Registration failed",
    };
  }

  /**
   * Get bill details from E-Barimt
   */
  async getBill(billId: string): Promise<{
    success: boolean;
    billId?: string;
    data?: unknown;
    message?: string;
  }> {
    if (!this.isEnabled) {
      return {
        success: false,
        message: "E-Barimt service is disabled",
      };
    }

    try {
      const response = await this.client.get(`/getBill?billId=${billId}`);
      return {
        success: true,
        billId,
        data: response.data,
        message: "Bill retrieved successfully",
      };
    } catch (error) {
      logger.error("Error getting bill from E-Barimt", {
        error: error instanceof Error ? error.message : String(error),
        billId,
      });
      return {
        success: false,
        message: `Failed to get bill: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Return/cancel a bill in E-Barimt
   */
  async returnBill(
    billId: string,
    reason?: string
  ): Promise<{
    success: boolean;
    id?: string;
    message?: string;
  }> {
    const result = await this.returnReceipt(billId, reason);

    if (result.success && result.data) {
      return {
        success: true,
        id: result.data.id,
        message: "Bill returned successfully",
      };
    }

    return {
      success: false,
      message: result.message || result.errorMessage || "Return failed",
    };
  }

  /**
   * Calculate NHAT (City Tax) for an amount
   */
  calculateCityTax(amount: number, districtCode?: string): number {
    const district = districtCode || this.config.districtCode;
    if (!this.isUlaanbaatarDistrict(district)) {
      return 0;
    }
    return Math.round(amount * CITY_TAX_RATE * 100) / 100;
  }

  /**
   * Get VAT-free product classification codes
   */
  async getVatFreeCodes(): Promise<{
    success: boolean;
    codes?: Array<{ code: string; name: string; type: string }>;
    message?: string;
  }> {
    try {
      const response = await this.client.get("/getVatFreeCodes");
      return {
        success: true,
        codes: response.data.codes || [],
        message: "VAT-free codes retrieved",
      };
    } catch (error) {
      logger.error("Error getting VAT-free codes", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        message: "Failed to get VAT-free codes",
      };
    }
  }

  /**
   * Get classification codes (BUNA)
   */
  async getClassificationCodes(search?: string): Promise<{
    success: boolean;
    codes?: Array<{ code: string; name: string }>;
    message?: string;
  }> {
    try {
      const url = search
        ? `/getClassificationCodes?search=${encodeURIComponent(search)}`
        : "/getClassificationCodes";
      const response = await this.client.get(url);
      return {
        success: true,
        codes: response.data.codes || [],
        message: "Classification codes retrieved",
      };
    } catch (error) {
      logger.error("Error getting classification codes", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        message: "Failed to get classification codes",
      };
    }
  }

  /**
   * Register POS device with location and MAC address
   */
  async registerDevice(deviceInfo: {
    macAddress: string;
    latitude?: number;
    longitude?: number;
    location?: string;
  }): Promise<{
    success: boolean;
    message?: string;
  }> {
    if (!this.isEnabled) {
      return {
        success: false,
        message: "E-Barimt service is disabled",
      };
    }

    try {
      const response = await this.client.post("/registerDevice", {
        posNo: this.config.posNo,
        merchantTin: this.config.merchantTin,
        macAddress: deviceInfo.macAddress,
        latitude: deviceInfo.latitude,
        longitude: deviceInfo.longitude,
        location: deviceInfo.location,
      });

      logger.info("Device registered", { macAddress: deviceInfo.macAddress });

      return {
        success: true,
        message: "Device registered successfully",
      };
    } catch (error) {
      logger.error("Error registering device", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        message: "Failed to register device",
      };
    }
  }
}

export default new EBarimtService();
