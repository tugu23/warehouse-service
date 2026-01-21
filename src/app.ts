import express, { Application } from "express";
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
import returnsRoutes from "./routes/returns.routes";
import agentsRoutes from "./routes/agents.routes";
import categoriesRoutes from "./routes/categories.routes";
import paymentsRoutes from "./routes/payments.routes";
import productBatchesRoutes from "./routes/product-batches.routes";
import deliveryPlansRoutes from "./routes/delivery-plans.routes";
import reportsRoutes from "./routes/reports.routes";
import posapiRoutes from "./routes/posapi.routes";
import storesRoutes from "./routes/stores.routes";
import analyticsRoutes from "./routes/analytics.routes";
import productPriceRoutes from "./routes/productPrice.routes";
import customerTypesRoutes from "./routes/customerTypes.routes";
import etaxRoutes from "./routes/etax.routes";
import ebarimtRoutes from "./routes/ebarimt.routes";

const app: Application = express();

// Trust proxy - important for rate limiting behind reverse proxies
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  max: process.env.NODE_ENV === "test" ? 1000 : 5, // Higher limit for tests
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
  app.use("/api/auth/login", loginLimiter);
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

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
app.use("/api/products", productBatchesRoutes); // Product batch routes nested under products
app.use("/api/customers", customersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/returns", returnsRoutes);
app.use("/api/agents", agentsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/delivery-plans", deliveryPlansRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/posapi", posapiRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/product-prices", productPriceRoutes);
app.use("/api/customer-types", customerTypesRoutes);
app.use("/api/etax", etaxRoutes);
app.use("/api/ebarimt", ebarimtRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
