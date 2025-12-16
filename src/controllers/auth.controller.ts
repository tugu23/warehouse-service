import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma";
import { config } from "../config";
import logger from "../utils/logger";
import { AppError } from "../middleware/error.middleware";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    // Find user by email
    const employee = await prisma.employee.findUnique({
      where: { email: identifier },
      include: { role: true },
    });

    if (!employee) {
      throw new AppError(req.t.auth.invalidCredentials, 401);
    }

    // Check if account is active
    if (!employee.isActive) {
      throw new AppError(req.t.auth.accountDeactivated, 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      employee.passwordHash
    );

    if (!isPasswordValid) {
      throw new AppError(req.t.auth.invalidCredentials, 401);
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: employee.id,
        email: employee.email,
        role: employee.role.name,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    logger.info(`User ${employee.email} logged in successfully`);

    res.json({
      status: "success",
      data: {
        token,
        user: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
