import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { tLang } from "../i18n";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get translations for the request language or default to Mongolian
  const t = req.t || tLang('mn');
  
  let statusCode = 500;
  let message = t.common.serverError;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message || t.common.validationError;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = t.auth.unauthorized;
  }

  logger.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const t = req.t || tLang('mn');
  res.status(404).json({
    status: "error",
    message: `${req.originalUrl} замбар олдсонгүй`,
  });
};
