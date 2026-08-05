import express, { Application } from "express";

import cron from 'node-cron';

import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";
import { swaggerSpec } from "./config/swagger";
import logger from "./utils/logger";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { languageMiddleware } from "./middleware/language.middleware";

// Import routes
import authRoutes from "./routes/auth.routes";
import employeesRoutes from "./routes/employees.routes";
import productsRoutes from "./routes/products.routes";
import customersRoutes from "./routes/customers.routes";
import ordersRoutes from "./routes/orders.routes";
import agentsRoutes from "./routes/agents.routes";
import categoriesRoutes from "./routes/categories.routes";
import paymentsRoutes from "./routes/payments.routes";
import deliveryPlansRoutes from "./routes/delivery-plans.routes";
import reportsRoutes from "./routes/reports.routes";
import posapiRoutes from "./routes/posapi.routes";
import storesRoutes from "./routes/stores.routes";
import productPriceRoutes from "./routes/productPrice.routes";
import customerTypesRoutes from "./routes/customerTypes.routes";
import etaxRoutes from "./routes/etax.routes";
import ebarimtRoutes from "./routes/ebarimt.routes";
import bunaRoutes from "./routes/buna.routes";
import agentKpiRoutes from "./routes/agent-kpi.routes";
import salesKpiRoutes from "./routes/sales-kpi.routes";
import promotionsRoutes from "./routes/promotions.routes";
import ebarimtService from "./services/ebarimt.service";

const app: Application = express();

// Trust proxy - important for rate limiting behind reverse proxies
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all origins for development
      callback(null, true);
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable caching for API responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Language middleware - must be before routes
app.use(languageMiddleware);

// HTTP request logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "test" ? 1000 :
       process.env.NODE_ENV === "development" ? 1000 : 5, // Much higher limit for development
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: process.env.NODE_ENV === "test" ? 10000 : 
       process.env.NODE_ENV === "development" ? 1000 : // Much higher limit for development
       config.rateLimit.max, // Use config value for production
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Only apply rate limiting in non-test environments
if (process.env.NODE_ENV !== "test") {
  app.use("/api", generalLimiter);
  // app.use("/api/auth/login", loginLimiter); // Disabled login rate limiting
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Cron job to auto-send E-Barimt data daily at 23:00 (Asia/Ulaanbaatar)
cron.schedule(
  "0 23 * * *",
  async () => {
    try {
      if (!ebarimtService.isServiceEnabled()) {
        logger.warn("E-Barimt service is disabled; skipping scheduled sendData");
        return;
      }

      logger.info("Scheduled sendData triggered");
      const result = await ebarimtService.sendData();

      if (result.success) {
        logger.info("Scheduled sendData completed", {
          sentBillCount: result.sentBillCount,
          sentAmount: result.sentAmount,
        });
      } else {
        logger.warn("Scheduled sendData failed", {
          message: result.message,
          errorCode: result.errorCode,
        });
      }
    } catch (error) {
      logger.error("Scheduled sendData error", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
  { timezone: "Asia/Ulaanbaatar" }
);
// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Warehouse API Docs",
  })
);

// API routes
app.use("/api/prices", productPriceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/agents", agentsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/delivery-plans", deliveryPlansRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/posapi", posapiRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/product-prices", productPriceRoutes);
app.use("/api/customer-types", customerTypesRoutes);
app.use("/api/etax", etaxRoutes);
app.use("/api/ebarimt", ebarimtRoutes);
app.use("/api/buna", bunaRoutes);
app.use("/api/agent-kpi", agentKpiRoutes);
app.use("/api/sales-kpi", salesKpiRoutes);
app.use("/api", promotionsRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
