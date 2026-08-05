import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import logger from "../utils/logger";

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Run all validations
    logger.debug(`validate start ${req.method} ${req.originalUrl}`);
    await Promise.all(validations.map((validation) => validation.run(req)));
    logger.debug(`validate end ${req.method} ${req.originalUrl}`);

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.type === "field" ? error.path : undefined,
        message: error.msg,
      })),
    });
  };
};
