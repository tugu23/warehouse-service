import cron from "node-cron";
import logger from "../utils/logger";
import ebarimtService from "./ebarimt.service";
import prisma from "../db/prisma";

/**
 * Scheduler Service
 * Handles automated tasks for eBarimt compliance:
 * - Daily data sending to central system (required by law every 3 days)
 * - Lottery count monitoring
 * - Automated registration of pending orders
 */

class SchedulerService {
  private isInitialized = false;
  private dailySendJob: cron.ScheduledTask | null = null;
  private lotteryCheckJob: cron.ScheduledTask | null = null;
  private autoRegisterJob: cron.ScheduledTask | null = null;

  /**
   * Initialize all scheduled jobs
   */
  initialize(): void {
    if (this.isInitialized) {
      logger.warn("Scheduler service already initialized");
      return;
    }

    if (!ebarimtService.isServiceEnabled()) {
      logger.info("E-Barimt is disabled, skipping scheduler initialization");
      return;
    }

    logger.info("Initializing scheduler service...");

    // Schedule daily data send to central system
    // Runs at 23:00 (11 PM) every day
    this.dailySendJob = cron.schedule(
      "0 23 * * *",
      async () => {
        await this.executeDailySend();
      },
      {
        scheduled: true,
        timezone: "Asia/Ulaanbaatar",
      }
    );

    // Schedule lottery count check
    // Runs every 4 hours
    this.lotteryCheckJob = cron.schedule(
      "0 */4 * * *",
      async () => {
        await this.checkLotteryCount();
      },
      {
        scheduled: true,
        timezone: "Asia/Ulaanbaatar",
      }
    );

    // Schedule auto-registration of pending Store orders
    // Runs every 30 minutes during business hours (8 AM - 10 PM)
    this.autoRegisterJob = cron.schedule(
      "*/30 8-22 * * *",
      async () => {
        await this.autoRegisterPendingOrders();
      },
      {
        scheduled: true,
        timezone: "Asia/Ulaanbaatar",
      }
    );

    this.isInitialized = true;
    logger.info("Scheduler service initialized successfully", {
      jobs: ["dailySend (23:00)", "lotteryCheck (every 4h)", "autoRegister (every 30m 8AM-10PM)"],
    });
  }

  /**
   * Stop all scheduled jobs
   */
  shutdown(): void {
    if (this.dailySendJob) {
      this.dailySendJob.stop();
      this.dailySendJob = null;
    }
    if (this.lotteryCheckJob) {
      this.lotteryCheckJob.stop();
      this.lotteryCheckJob = null;
    }
    if (this.autoRegisterJob) {
      this.autoRegisterJob.stop();
      this.autoRegisterJob = null;
    }
    this.isInitialized = false;
    logger.info("Scheduler service stopped");
  }

  /**
   * Execute daily data send to central system
   * Required by law: must send at least once every 3 days
   */
  async executeDailySend(): Promise<{
    success: boolean;
    sentCount?: number;
    message?: string;
  }> {
    logger.info("Executing scheduled daily data send to central system");

    try {
      // First, check if there's data to send
      const info = await ebarimtService.getInformation();

      if (!info.success) {
        logger.error("Failed to get information before sending data", {
          message: info.message,
        });
        return {
          success: false,
          message: "Failed to check pending data",
        };
      }

      if ((info.billCount || 0) === 0) {
        logger.info("No pending bills to send");
        return {
          success: true,
          sentCount: 0,
          message: "No pending bills",
        };
      }

      logger.info("Pending bills found, sending to central system", {
        billCount: info.billCount,
        billAmount: info.billAmount,
      });

      // Send data
      const result = await ebarimtService.sendData();

      if (result.success) {
        logger.info("Daily data send completed successfully", {
          sentBillCount: result.sentBillCount,
          sentAmount: result.sentAmount,
        });
      } else {
        logger.error("Daily data send failed", {
          errorCode: result.errorCode,
          message: result.message,
        });
      }

      return {
        success: result.success,
        sentCount: result.sentBillCount,
        message: result.message,
      };
    } catch (error) {
      logger.error("Error in scheduled daily send", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Check lottery count and warn if running low
   */
  async checkLotteryCount(): Promise<{
    lotteryCount?: number;
    warningLevel?: "ok" | "low" | "critical";
    message?: string;
  }> {
    logger.info("Checking lottery count");

    try {
      const info = await ebarimtService.getInformation();

      if (!info.success) {
        logger.error("Failed to check lottery count", {
          message: info.message,
        });
        return { message: info.message };
      }

      const lotteryCount = info.lotteryCount || 0;
      let warningLevel: "ok" | "low" | "critical" = "ok";

      if (lotteryCount < 50) {
        warningLevel = "critical";
        logger.error("CRITICAL: Lottery count is very low!", {
          lotteryCount,
          action: "Contact tax authority immediately for new lottery numbers",
        });
      } else if (lotteryCount < 100) {
        warningLevel = "low";
        logger.warn("WARNING: Lottery count is running low", {
          lotteryCount,
          action: "Consider requesting new lottery numbers soon",
        });
      } else {
        logger.info("Lottery count is OK", { lotteryCount });
      }

      // Also check 3-day rule
      if (info.shouldSendNow) {
        logger.warn("Data should be sent to central system soon (3-day rule)", {
          lastSentDate: info.lastSentDate,
        });
      }

      return {
        lotteryCount,
        warningLevel,
        message: info.warningMessage,
      };
    } catch (error) {
      logger.error("Error checking lottery count", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Auto-register pending Store orders with e-Barimt
   * This ensures all orders get registered even if manual registration failed
   */
  async autoRegisterPendingOrders(): Promise<{
    processed: number;
    success: number;
    failed: number;
  }> {
    logger.info("Auto-registering pending Store orders");

    const result = {
      processed: 0,
      success: 0,
      failed: 0,
    };

    try {
      // Find unregistered Store orders from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pendingOrders = await prisma.order.findMany({
        where: {
          orderType: "Store",
          ebarimtRegistered: false,
          orderDate: {
            gte: today,
          },
          status: {
            in: ["Completed", "Delivered"], // Only completed orders
          },
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        take: 50, // Process max 50 at a time
      });

      if (pendingOrders.length === 0) {
        logger.info("No pending orders to auto-register");
        return result;
      }

      logger.info(`Found ${pendingOrders.length} orders to auto-register`);

      for (const order of pendingOrders) {
        result.processed++;

        try {
          // Generate order number if missing
          const orderNumber = order.orderNumber || `ORD${order.id}${Date.now()}`;
          if (!order.orderNumber) {
            await prisma.order.update({
              where: { id: order.id },
              data: { orderNumber },
            });
          }

          // Prepare and register
          const ebarimtData = ebarimtService.prepareOrderData({
            ...order,
            orderNumber,
          });

          const registerResult = await ebarimtService.registerBill(ebarimtData);

          if (registerResult.success) {
            // Update order
            await prisma.order.update({
              where: { id: order.id },
              data: {
                ebarimtId: registerResult.id,
                ebarimtBillId: registerResult.billId,
                ebarimtLottery: registerResult.lottery,
                ebarimtQrData: registerResult.qrData,
                ebarimtRegistered: true,
                ebarimtDate: new Date(),
              },
            });

            result.success++;
            logger.info(`Auto-registered order ${order.id}`, {
              billId: registerResult.billId,
            });
          } else {
            result.failed++;
            logger.error(`Failed to auto-register order ${order.id}`, {
              message: registerResult.message,
            });
          }
        } catch (orderError) {
          result.failed++;
          logger.error(`Error auto-registering order ${order.id}`, {
            error: orderError instanceof Error ? orderError.message : String(orderError),
          });
        }

        // Small delay between registrations to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      logger.info("Auto-registration batch completed", result);
      return result;
    } catch (error) {
      logger.error("Error in auto-registration job", {
        error: error instanceof Error ? error.message : String(error),
      });
      return result;
    }
  }

  /**
   * Manual trigger for daily send (for UI button)
   */
  async triggerManualSend(): Promise<{
    success: boolean;
    sentCount?: number;
    message?: string;
  }> {
    logger.info("Manual data send triggered");
    return this.executeDailySend();
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    initialized: boolean;
    jobs: {
      dailySend: boolean;
      lotteryCheck: boolean;
      autoRegister: boolean;
    };
  } {
    return {
      initialized: this.isInitialized,
      jobs: {
        dailySend: this.dailySendJob !== null,
        lotteryCheck: this.lotteryCheckJob !== null,
        autoRegister: this.autoRegisterJob !== null,
      },
    };
  }
}

export default new SchedulerService();

