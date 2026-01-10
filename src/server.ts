import app from "./app";
import { config } from "./config";
import logger from "./utils/logger";
import prisma from "./db/prisma";
import schedulerService from "./services/scheduler.service";

const PORT = config.port;

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    // Stop scheduler service
    schedulerService.shutdown();
    logger.info("Scheduler service stopped");

    // Close database connection
    await prisma.$disconnect();
    logger.info("Database connection closed");

    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info("Database connected successfully");

    // Initialize scheduler for eBarimt automated tasks
    schedulerService.initialize();
    logger.info("Scheduler service initialized");

    app.listen(PORT, () => {
      logger.info(
        `Server is running on port ${PORT} in ${config.nodeEnv} mode`
      );
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info("eBarimt scheduler active: daily send, lottery check, auto-register");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer();
