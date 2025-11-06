import { config } from "../config";
import logger from "../utils/logger";

export class PosApiService {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;
  private mockMode: boolean;

  constructor() {
    this.baseUrl = config.posApi.url;
    this.apiKey = config.posApi.apiKey;
    this.timeout = config.posApi.timeout;
    this.mockMode = config.posApi.mockMode;
  }

  /**
   * Sync order to POS system
   */
  async syncOrder(orderId: number): Promise<{
    success: boolean;
    posOrderId?: string;
    message: string;
  }> {
    if (this.mockMode) {
      logger.info(`[MOCK] Syncing order ${orderId} to POS`);
      
      // Simulate API delay
      await this.delay(500);
      
      // Mock success response
      return {
        success: true,
        posOrderId: `POS-${Date.now()}-${orderId}`,
        message: "Order synced successfully to POS (mock)",
      };
    }

    // Real API implementation
    try {
      const response = await this.makeRequest("POST", `/orders/sync`, {
        orderId,
      });
      
      return {
        success: true,
        posOrderId: response.posOrderId,
        message: "Order synced successfully",
      };
    } catch (error) {
      logger.error(`Error syncing order ${orderId} to POS:`, error);
      return {
        success: false,
        message: `Failed to sync order: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  /**
   * Sync product to POS system
   */
  async syncProduct(productId: number): Promise<{
    success: boolean;
    posProductId?: string;
    message: string;
  }> {
    if (this.mockMode) {
      logger.info(`[MOCK] Syncing product ${productId} to POS`);
      
      await this.delay(300);
      
      return {
        success: true,
        posProductId: `PROD-POS-${Date.now()}-${productId}`,
        message: "Product synced successfully to POS (mock)",
      };
    }

    try {
      const response = await this.makeRequest("POST", `/products/sync`, {
        productId,
      });
      
      return {
        success: true,
        posProductId: response.posProductId,
        message: "Product synced successfully",
      };
    } catch (error) {
      logger.error(`Error syncing product ${productId} to POS:`, error);
      return {
        success: false,
        message: `Failed to sync product: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  /**
   * Get POS sales data for a date range
   */
  async getPosSalesData(startDate: Date, endDate: Date): Promise<{
    success: boolean;
    data?: any[];
    message: string;
  }> {
    if (this.mockMode) {
      logger.info(
        `[MOCK] Getting POS sales data from ${startDate.toISOString()} to ${endDate.toISOString()}`
      );
      
      await this.delay(800);
      
      // Generate mock sales data
      const mockData = this.generateMockSalesData(startDate, endDate);
      
      return {
        success: true,
        data: mockData,
        message: "Sales data retrieved successfully from POS (mock)",
      };
    }

    try {
      const response = await this.makeRequest("GET", `/sales/data`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      return {
        success: true,
        data: response.sales,
        message: "Sales data retrieved successfully",
      };
    } catch (error) {
      logger.error(`Error getting POS sales data:`, error);
      return {
        success: false,
        message: `Failed to get sales data: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  /**
   * Check POS system status
   */
  async checkStatus(): Promise<{
    success: boolean;
    online: boolean;
    message: string;
  }> {
    if (this.mockMode) {
      logger.info("[MOCK] Checking POS system status");
      
      await this.delay(200);
      
      return {
        success: true,
        online: true,
        message: "POS system is online (mock)",
      };
    }

    try {
      await this.makeRequest("GET", `/status`);
      
      return {
        success: true,
        online: true,
        message: "POS system is online",
      };
    } catch (error) {
      logger.error("Error checking POS status:", error);
      return {
        success: false,
        online: false,
        message: "POS system is offline or unreachable",
      };
    }
  }

  /**
   * Make HTTP request to POS API (real implementation)
   */
  private async makeRequest(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`POS API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Generate mock sales data for testing
   */
  private generateMockSalesData(startDate: Date, endDate: Date): any[] {
    const data: any[] = [];
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i < Math.min(days, 10); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      data.push({
        date: date.toISOString(),
        totalSales: Math.floor(Math.random() * 1000000) + 100000,
        transactionCount: Math.floor(Math.random() * 50) + 10,
        topProducts: [
          {
            productCode: `PROD-00${i + 1}`,
            productName: `Sample Product ${i + 1}`,
            quantitySold: Math.floor(Math.random() * 100) + 10,
            revenue: Math.floor(Math.random() * 100000) + 10000,
          },
        ],
      });
    }

    return data;
  }

  /**
   * Delay helper for mock responses
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const posApiService = new PosApiService();

