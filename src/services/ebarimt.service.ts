import axios, { AxiosInstance } from "axios";
import logger from "../utils/logger";

// ==================== INTERFACES ====================

interface EBarimtConfig {
  apiUrl: string;
  posNo: string;
  merchantTin: string; // ТТД (Татвар төлөгчийн дугаар)
  apiKey?: string;
  districtCode: string;
  branchNo: string; // Branch number: 3-digit string like "001"
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
  data?: Record<string, unknown>;
  items: EBarimtItem[];
}

// Official API request format from https://developer.itc.gov.mn
interface EBarimtRequest {
  branchNo: string; // MUST be 3-digit string like "001" (0-999 padded)
  totalAmount: number;
  totalVAT: number;
  totalCityTax: number;
  districtCode: string;
  merchantTin: string;
  posNo: string;
  customerTin?: string | null;
  consumerNo?: string; // Customer's eBarimt app registration number (8-digit)
  type: "B2C_RECEIPT" | "B2B_RECEIPT" | "B2C_INVOICE" | "B2B_INVOICE" | "STOCK_QR";
  inactiveId?: string | null; // For return receipts
  reportMonth?: string | null; // YYYYMM format for supplement
  billIdSuffix?: string;
  data?: Record<string, unknown>;
  receipts: EBarimtReceiptItem[];
  payments: Array<{
    code: "CASH" | "PAYMENT_CARD" | "BANK_TRANSFER" | "EASY_BANK_CARD";
    status: "PAID" | "UNPAID";
    paidAmount: number;
    data?: Record<string, unknown>;
  }>;
}

// Raw PosAPI 3.0 response from POST /rest/receipt
interface PosApiReceiptResponse {
  id: string;        // ДДТД (33-digit)
  posId?: number;     // PosAPI system number
  status: string;     // Receipt status
  message: string;    // Description
  qrData: string;     // QR Code value
  lottery: string;    // Lottery number
  date: string;       // Receipt print date
  easyRegister?: boolean; // Easy registration performed
  receipts?: Array<{
    id: string;             // Sub-receipt ДДТД
    bankAccountId?: string; // Bank account ID
  }>;
}

interface EBarimtResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;        // ДДТД (33-digit)
    billId: string;    // Same as id (backward compat alias)
    date: string;
    lottery: string;
    qrData: string;
    easyRegister?: boolean;
    receipts?: Array<{ id: string; bankAccountId?: string }>;
  };
  errorCode?: string;
  errorMessage?: string;
}

// PosAPI 3.0 getInformation response interface
// Official API: GET /rest/info
// Reference: https://developer.itc.gov.mn/docs/ebarimt-api/xy84sum9avx4v-azhillagaany-medeelel-h-leen-avah
interface PosApiInformation {
  operatorName?: string;
  operatorTIN?: string;
  posId?: number;
  posNo?: string;
  version?: string; // PosAPI version (e.g., "3.2.35")
  lastSentDate?: string; // Last sent date to central system
  leftLotteries?: number; // Remaining lottery numbers (сугалааны үлдсэн тоо)
  appInfo?: {
    applicationDir?: string;
    currentDir?: string;
    database?: string;
    "database-host"?: string;
    "supported-databases"?: string[];
    workDir?: string;
  };
  paymentTypes?: Array<{
    code: string; // "CASH", "PAYMENT_CARD", "EMD", "BANK_TRANSFER", etc.
    name: string; // Mongolian name
  }>;
  merchants?: Array<{
    name?: string;
    tin?: string;
    vatPayer?: boolean; // Changed from string to boolean
    customers?: Array<{
      name?: string;
      tin?: string;
      vatPayer?: boolean; // Changed from string to boolean
    }>;
  }>;
  condition?: {
    isMedicine?: boolean;
  };
  // Additional fields for internal use
  billCount?: number;
  billAmount?: number;
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

// 4-digit district codes for Ulaanbaatar (for NHAT calculation)
// Official PosAPI 3.0 requires 4-digit codes (prefix "25" = Улаанбаатар)
const ULAANBAATAR_DISTRICT_PREFIX = "25";
const ULAANBAATAR_DISTRICTS = [
  "2501", // Баянзүрх
  "2502", // Баянгол
  "2503", // Сонгинохайрхан
  "2504", // Хан-Уул
  "2505", // Чингэлтэй
  "2506", // Сүхбаатар
  "2507", // Багануур
  "2508", // Багахангай
  "2509", // Налайх
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
      apiUrl: process.env.EBARIMT_API_URL || "http://192.168.1.213:7080",
      posNo: process.env.EBARIMT_POS_NO || "10012516",
      merchantTin: process.env.EBARIMT_MERCHANT_TIN || process.env.EBARIMT_REG_NO || "37900846788",
      apiKey: process.env.EBARIMT_API_KEY,
      districtCode: process.env.EBARIMT_DISTRICT_CODE || "2506", // Default: Сүхбаатар (4-digit)
      branchNo: (process.env.EBARIMT_BRANCH_NO || "1").toString().padStart(3, "0"), // 3-digit string like "001"
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
   * 
   * Official API: GET /rest/info
   * Reference: https://developer.itc.gov.mn/docs/ebarimt-api/xy84sum9avx4v-azhillagaany-medeelel-h-leen-avah
   */
  async getInformation(): Promise<{
    success: boolean;
    operatorName?: string;
    operatorTIN?: string;
    posId?: number;
    posNo?: string;
    version?: string;
    lastSentDate?: string;
    leftLotteries?: number;
    paymentTypes?: Array<{
      code: string;
      name: string;
    }>;
    merchants?: Array<{
      name?: string;
      tin?: string;
      vatPayer?: boolean;
      customers?: Array<{
        name?: string;
        tin?: string;
        vatPayer?: boolean;
      }>;
    }>;
    condition?: {
      isMedicine?: boolean;
    };
    warningMessage?: string;
    shouldSendNow?: boolean;
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

      // Official API endpoint: GET /rest/info
      const response = await this.client.get<PosApiInformation>(
        "/rest/info",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = response.data;

      // Check if lottery count is running low (less than 100)
      const lotteryWarning = (data.leftLotteries || 0) < 100;

      // Check if bills need to be sent (3-day rule)
      const shouldSendNow = this.checkSendRequired(data.lastSentDate);

      // Build warning message
      let warningMessage = "";
      if (lotteryWarning) {
        warningMessage += `Сугалааны дугаар дуусаж байна! Үлдсэн: ${data.leftLotteries}. `;
      }
      if (shouldSendNow) {
        warningMessage += `Баримтуудыг нэгдсэн системд илгээх шаардлагатай (3 хоногийн хугацаа). `;
      }

      logger.info("POS API information retrieved", {
        operatorName: data.operatorName,
        posNo: data.posNo,
        version: data.version,
        leftLotteries: data.leftLotteries,
        lastSentDate: data.lastSentDate,
        shouldSendNow,
      });

      return {
        success: true,
        operatorName: data.operatorName,
        operatorTIN: data.operatorTIN,
        posId: data.posId,
        posNo: data.posNo,
        version: data.version,
        lastSentDate: data.lastSentDate,
        leftLotteries: data.leftLotteries,
        paymentTypes: data.paymentTypes,
        merchants: data.merchants,
        condition: data.condition,
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

      const response = await this.client.get<SendDataResponse>("/rest/send");

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

      // Return default Ulaanbaatar districts as fallback (4-digit codes)
      return {
        success: true,
        districts: [
          { code: "2501", name: "Баянзүрх" },
          { code: "2502", name: "Баянгол" },
          { code: "2503", name: "Сонгинохайрхан" },
          { code: "2504", name: "Хан-Уул" },
          { code: "2505", name: "Чингэлтэй" },
          { code: "2506", name: "Сүхбаатар" },
          { code: "2507", name: "Багануур" },
          { code: "2508", name: "Багахангай" },
          { code: "2509", name: "Налайх" },
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
    consumerNo?: string; // Customer's eBarimt app registration number (8-digit)
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

        // Build item object, filtering out empty strings for optional fields
        const ebarimtItem: any = {
          name: item.productName,
          taxProductCode: null,
          measureUnit: item.measureUnit || "ширхэг",
          qty: item.quantity,
          unitPrice: item.unitPrice,
          totalAmount: item.total,
          totalVAT: itemVat,
          totalCityTax: itemCityTax,
        };

        // Only add optional fields if they have actual values (not empty strings)
        if (item.barcode && item.barcode.trim()) {
          ebarimtItem.barCode = item.barcode;
          ebarimtItem.barCodeType = this.detectBarcodeType(item.barcode);
        }

        if (item.classificationCode && item.classificationCode.trim()) {
          ebarimtItem.classificationCode = item.classificationCode;
        }

        return ebarimtItem;
      });

      // Validate: every item must have either barCode or classificationCode
      for (const item of items) {
        if (!item.barCode && !item.classificationCode) {
          logger.warn(`Item "${item.name}" missing barCode and classificationCode`, {
            itemName: item.name,
          });
        }
      }

      // Determine tax type for receipt
      const taxType = orderData.items.some(i => i.vatType === "VAT_FREE")
        ? "VAT_FREE" as const
        : orderData.items.some(i => i.vatType === "VAT_ZERO")
          ? "VAT_ZERO" as const
          : orderData.items.some(i => i.vatType === "NO_VAT")
            ? "NO_VAT" as const
            : "VAT_ABLE" as const;

      // Validate and prepare customerTin (must be 11-14 digits for B2B)
      let customerTin: string | null = null;
      if (orderData.customer.registrationNumber) {
        const tin = orderData.customer.registrationNumber.replace(/\D/g, ""); // Remove non-digits
        if (tin.length >= 11 && tin.length <= 14) {
          customerTin = tin;
        } else {
          logger.warn("Invalid customerTin length, treating as B2C", {
            originalTin: orderData.customer.registrationNumber,
            cleanedTin: tin,
            length: tin.length,
          });
        }
      }

      // consumerNo is the customer's eBarimt app registration number (8-digit)
      // Only pass if explicitly provided; do NOT generate from order number
      const consumerNo = receiptType === "B2C_RECEIPT" ? orderData.consumerNo : undefined;

      // Prepare request data using official API format
      const requestData: EBarimtRequest = {
        branchNo: this.config.branchNo, // MUST be string (not number!)
        totalAmount: orderData.total,
        totalVAT: Math.round(totalVAT * 100) / 100,
        totalCityTax: Math.round(totalCityTax * 100) / 100,
        districtCode,
        merchantTin: this.config.merchantTin,
        posNo: this.config.posNo,
        customerTin,
        consumerNo,
        type: receiptType,
        receipts: [
          {
            totalAmount: orderData.total,
            taxType,
            merchantTin: this.config.merchantTin,
            customerTin,
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
            code: paymentCode as "CASH" | "PAYMENT_CARD" | "BANK_TRANSFER" | "EASY_BANK_CARD",
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
        requestData: JSON.stringify(requestData, null, 2), // Log full request for debugging
      });

      // Send request to E-Barimt API (official endpoint: POST /rest/receipt)
      // PosAPI 3.0 returns flat response: { id, posId, status, message, qrData, lottery, date, ... }
      const response = await this.client.post<PosApiReceiptResponse>(
        "/rest/receipt",
        requestData
      );

      const raw = response.data;

      logger.info("E-Barimt API response received", {
        orderNumber: orderData.orderNumber,
        status: raw.status,
        id: raw.id,
        response: JSON.stringify(raw, null, 2),
      });

      // PosAPI returns status field; a valid ДДТД means success
      const isSuccess = !!raw.id && raw.id.length > 0;

      if (isSuccess) {
        logger.info("Receipt registered successfully with E-Barimt", {
          orderNumber: orderData.orderNumber,
          billId: raw.id,
          lottery: raw.lottery,
        });

        return {
          success: true,
          data: {
            id: raw.id,
            billId: raw.id,
            date: raw.date,
            lottery: raw.lottery,
            qrData: raw.qrData,
            easyRegister: raw.easyRegister,
            receipts: raw.receipts,
          },
        };
      }

      logger.error("E-Barimt registration failed", {
        orderNumber: orderData.orderNumber,
        error: raw.message,
        status: raw.status,
      });

      return {
        success: false,
        message: raw.message || "Registration failed",
        errorCode: raw.status,
        errorMessage: raw.message,
      };
    } catch (error) {
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        logger.error("Error registering receipt with E-Barimt", {
          error: error.message,
          orderNumber: orderData.orderNumber,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          requestData: {
            orderNumber: orderData.orderNumber,
            total: orderData.total,
            itemCount: orderData.items.length,
          },
        });
      } else {
        logger.error("Error registering receipt with E-Barimt", {
          error: error instanceof Error ? error.message : String(error),
          orderNumber: orderData.orderNumber,
        });
      }

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
    return districtCode.startsWith(ULAANBAATAR_DISTRICT_PREFIX);
  }

  // ==================== BILL OPERATIONS ====================

  /**
   * Return/delete a receipt - Баримт буцаах (идэвхгүй болгох)
   * 
   * Зөвхөн иргэн баталгаажуулаагүй баримтыг шууд идэвхгүй болгох боломжтой.
   * Хэрэв баталгаажсан баримт буцаагдсан бол:
   * - Баримт "Баталгаажаагүй буцаалт" төлөвтэй болно
   * - Иргэн ИБАРИМТ аппликейшнээс зөвшөөрсний дараа идэвхгүй болно
   * 
   * Official API: DELETE /rest/receipt
   * Reference: https://developer.itc.gov.mn/docs/ebarimt-api
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
      logger.info("Returning receipt in E-Barimt", { billId, reason });

      // Official API uses DELETE /rest/receipt
      // The billId should be passed as query parameter or in request body
      const response = await this.client.delete<{
        success: boolean;
        message?: string;
        status?: string; // "INACTIVE" or "UNCONFIRMED_RETURN"
        errorCode?: string;
        errorMessage?: string;
      }>(`/rest/receipt`, {
        params: {
          id: billId,
        },
      });

      const result = response.data;

      if (result.success) {
        // Check if it's direct deactivation or pending citizen approval
        const isPendingApproval = result.status === "UNCONFIRMED_RETURN";

        logger.info("Receipt return processed", {
          billId,
          status: result.status,
          isPendingApproval,
        });

        return {
          success: true,
          message: isPendingApproval
            ? "Баримт буцаалт хүлээгдэж байна. Иргэн ИБАРИМТ аппликейшнээс зөвшөөрөх шаардлагатай."
            : "Баримт амжилттай идэвхгүй болгогдлоо",
          data: {
            id: billId,
            billId: billId,
            date: new Date().toISOString(),
            lottery: "",
            qrData: "",
          },
        };
      }

      return {
        success: false,
        message: result.message || "Баримт буцаах амжилтгүй",
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
      };
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
   * PosAPI 3.0: POST /rest/receipt with inactiveId set to original ДДТД
   * The original receipt gets deactivated and a new corrected one is issued
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

      // For RETURN only, use DELETE endpoint
      if (editRequest.editType === "RETURN") {
        return this.returnReceipt(
          editRequest.originalBillId,
          editRequest.reason || "Баримт буцаах"
        );
      }

      // For EDIT and SUPPLEMENT: create new receipt with inactiveId referencing original
      // PosAPI 3.0 automatically deactivates the original and issues a new one
      if (!editRequest.newData) {
        return {
          success: false,
          message: "New data is required for edit/supplement",
          errorCode: "MISSING_DATA",
        };
      }

      const correctedData: EBarimtRequest = {
        ...editRequest.newData as EBarimtRequest,
        inactiveId: editRequest.originalBillId,
      };

      const response = await this.client.post<PosApiReceiptResponse>(
        "/rest/receipt",
        correctedData
      );

      const raw = response.data;
      const isSuccess = !!raw.id && raw.id.length > 0;

      if (isSuccess) {
        logger.info("Corrected receipt created", {
          originalBillId: editRequest.originalBillId,
          newBillId: raw.id,
        });

        return {
          success: true,
          data: {
            id: raw.id,
            billId: raw.id,
            date: raw.date,
            lottery: raw.lottery,
            qrData: raw.qrData,
            easyRegister: raw.easyRegister,
            receipts: raw.receipts,
          },
        };
      }

      return {
        success: false,
        message: raw.message || "Failed to edit receipt",
        errorCode: raw.status,
        errorMessage: raw.message,
      };
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
      Card: "PAYMENT_CARD",
      BankTransfer: "BANK_TRANSFER",
      Sales: "CASH",
      Padan: "CASH",
      Credit: "CASH",
      QR: "PAYMENT_CARD",
      Mobile: "PAYMENT_CARD",
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
      operatorName?: string;
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
          lotteryCount: info.leftLotteries,
          operatorName: info.operatorName,
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
        message: `E-Barimt system unavailable: ${error instanceof Error ? error.message : "Unknown error"
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
      ebarimtConsumerNo?: string | null;
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
    consumerNo?: string;
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
      consumerNo: order.customer?.ebarimtConsumerNo || undefined,
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
    consumerNo?: string;
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
        message: `Failed to get bill: ${error instanceof Error ? error.message : "Unknown error"
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
   * Get BUNA classification codes (Бараа, Үйлчилгээний Нэгдсэн Ангилал)
   * 
   * This API provides hierarchical classification lookup:
   * 1. No params → Returns "Салбар" (Sector) list
   * 2. With p1 → Returns "Дэд салбар" (Sub-sector) list
   * 3. With p1,p2 → Returns "Бүлэг" (Group) list
   * 4. With p1,p2,p3 → Returns "Анги" (Class) list
   * 5. And so on to get BUNA codes and barcodes
   * 
   * Official API: GET https://api.ebarimt.mn/api/info/check/barcode/v2/{p4}/{p5}/{p1}/{p2}/{p3}/{p6}
   * Reference: https://developer.itc.gov.mn/docs/ebarimt-api/said1mgfz0gb7-b-na-baraa-b-teegdeh-nij-angilal-barkod-lavlah
   */
  async getClassificationCodes(params?: {
    p1?: string; // Салбар (Sector)
    p2?: string; // Дэд салбар (Sub-sector)
    p3?: string; // Бүлэг (Group)
    p4?: string; // Анги (Class)
    p5?: string; // Дэд анги (Sub-class)
    p6?: string; // БҮНА код or Barcode
  }): Promise<{
    success: boolean;
    codes?: Array<{ code: string; name: string }>;
    level?: string;
    message?: string;
  }> {
    try {
      // Build the URL path with parameters
      const p1 = params?.p1 || "";
      const p2 = params?.p2 || "";
      const p3 = params?.p3 || "";
      const p4 = params?.p4 || "";
      const p5 = params?.p5 || "";
      const p6 = params?.p6 || "";

      // Official API endpoint on api.ebarimt.mn
      const apiUrl = `https://api.ebarimt.mn/api/info/check/barcode/v2/${p4}/${p5}/${p1}/${p2}/${p3}/${p6}`;

      logger.info("Fetching BUNA classification codes", {
        p1, p2, p3, p4, p5, p6
      });

      const response = await axios.get<Array<[string, string]>>(apiUrl, {
        headers: {
          Accept: "application/json",
        },
        timeout: 30000,
      });

      // Response is array of [code, name] tuples
      const codes = response.data.map(([code, name]) => ({
        code,
        name,
      }));

      // Determine the current level
      let level = "Салбар";
      if (p1) level = "Дэд салбар";
      if (p2) level = "Бүлэг";
      if (p3) level = "Анги";
      if (p4) level = "Дэд анги";
      if (p5) level = "БҮНА код";
      if (p6) level = "Баркод";

      logger.info("BUNA classification codes retrieved", {
        level,
        count: codes.length,
      });

      return {
        success: true,
        codes,
        level,
        message: `${level} мэдээлэл амжилттай татагдлаа`,
      };
    } catch (error) {
      logger.error("Error getting BUNA classification codes", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        message: "БҮНА ангиллын мэдээлэл татахад алдаа гарлаа",
      };
    }
  }

  /**
   * Get top-level BUNA sectors (Салбар)
   * Convenience method to get the root classification list
   */
  async getBunaSectors(): Promise<{
    success: boolean;
    sectors?: Array<{ code: string; name: string }>;
    message?: string;
  }> {
    const result = await this.getClassificationCodes();
    return {
      success: result.success,
      sectors: result.codes,
      message: result.message,
    };
  }

  /**
   * Look up barcode information in BUNA system
   * Returns classification details for a given barcode
   */
  async lookupBarcode(barcode: string): Promise<{
    success: boolean;
    found: boolean;
    barcode?: string;
    classificationCode?: string;
    classificationName?: string;
    message?: string;
  }> {
    try {
      // Search for barcode in the system
      const apiUrl = `https://api.ebarimt.mn/api/info/check/barcode/v2//////${barcode}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Accept: "application/json",
        },
        timeout: 30000,
      });

      if (response.data && response.data.length > 0) {
        const [code, name] = response.data[0];
        return {
          success: true,
          found: true,
          barcode,
          classificationCode: code,
          classificationName: name,
          message: "Баркод олдлоо",
        };
      }

      return {
        success: true,
        found: false,
        barcode,
        message: "Баркод олдсонгүй",
      };
    } catch (error) {
      logger.error("Error looking up barcode", {
        error: error instanceof Error ? error.message : String(error),
        barcode,
      });
      return {
        success: false,
        found: false,
        message: "Баркод хайхад алдаа гарлаа",
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
