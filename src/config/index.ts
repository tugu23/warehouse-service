import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },
  posApi: {
    url: process.env.POS_API_URL || "http://localhost:8080/api",
    apiKey: process.env.POS_API_KEY || "",
    timeout: parseInt(process.env.POS_API_TIMEOUT || "30000", 10),
    mockMode: process.env.POS_API_MOCK_MODE === "true",
  },
  ebarimt: {
    apiUrl: process.env.EBARIMT_API_URL || "https://api.ebarimt.mn/api",
    posNo: process.env.EBARIMT_POS_NO || "",
    merchantTin: process.env.EBARIMT_MERCHANT_TIN || "",
    apiKey: process.env.EBARIMT_API_KEY || "",
    apiSecret: process.env.EBARIMT_API_SECRET || "",
    districtCode: process.env.EBARIMT_DISTRICT_CODE || "2501",
    mockMode: process.env.EBARIMT_MOCK_MODE === "true",
  },
  creditPayment: {
    defaultTermDays: parseInt(process.env.DEFAULT_CREDIT_TERM_DAYS || "30", 10),
    gracePeriodDays: parseInt(process.env.CREDIT_GRACE_PERIOD_DAYS || "3", 10),
    maxTermDays: parseInt(process.env.MAX_CREDIT_TERM_DAYS || "90", 10),
  },
};
