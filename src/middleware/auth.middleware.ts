import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import logger from "../utils/logger";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    email: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        status: "error",
        message:
          "No token provided. Authorization header must be in format: Bearer <token>",
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        userId: number;
        role: string;
        email: string;
      };

      (req as AuthRequest).user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          status: "error",
          message: "Token has expired",
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          status: "error",
          message: "Invalid token",
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    logger.error("Error in auth middleware:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during authentication",
    });
  }
};

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user) {
        res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
        return;
      }

      if (!allowedRoles.includes(authReq.user.role)) {
        res.status(403).json({
          status: "error",
          message: "You do not have permission to access this resource",
        });
        return;
      }

      next();
    } catch (error) {
      logger.error("Error in role check middleware:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error during authorization",
      });
    }
  };
};
