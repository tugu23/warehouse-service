/**
 * BUNA Controller - API endpoints for BUNA (Unified Classification) system
 */

import { Request, Response, NextFunction } from "express";
import bunaService from "../services/buna.service";
import logger from "../utils/logger";

/**
 * Get all sectors (Level 1)
 * GET /api/buna/sectors
 */
export const getSectors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectors = await bunaService.getSectors();
    res.json({
      success: true,
      data: sectors,
      level: "sector",
    });
  } catch (error) {
    logger.error("Error in getSectors controller", { error });
    next(error);
  }
};

/**
 * Get subsectors for a sector (Level 2)
 * GET /api/buna/subsectors/:sector
 */
export const getSubsectors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sector } = req.params;
    const subsectors = await bunaService.getSubsectors(sector);
    res.json({
      success: true,
      data: subsectors,
      level: "subsector",
      path: { sector },
    });
  } catch (error) {
    logger.error("Error in getSubsectors controller", { error });
    next(error);
  }
};

/**
 * Get groups for a subsector (Level 3)
 * GET /api/buna/groups/:sector/:subsector
 */
export const getGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sector, subsector } = req.params;
    const groups = await bunaService.getGroups(sector, subsector);
    res.json({
      success: true,
      data: groups,
      level: "group",
      path: { sector, subsector },
    });
  } catch (error) {
    logger.error("Error in getGroups controller", { error });
    next(error);
  }
};

/**
 * Get classes for a group (Level 4)
 * GET /api/buna/classes/:sector/:subsector/:group
 */
export const getClasses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sector, subsector, group } = req.params;
    const classes = await bunaService.getClasses(sector, subsector, group);
    res.json({
      success: true,
      data: classes,
      level: "class",
      path: { sector, subsector, group },
    });
  } catch (error) {
    logger.error("Error in getClasses controller", { error });
    next(error);
  }
};

/**
 * Get subclasses for a class (Level 5)
 * GET /api/buna/subclasses/:sector/:subsector/:group/:class
 */
export const getSubclasses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sector, subsector, group, class: classCode } = req.params;
    const subclasses = await bunaService.getSubclasses(
      sector,
      subsector,
      group,
      classCode
    );
    res.json({
      success: true,
      data: subclasses,
      level: "subclass",
      path: { sector, subsector, group, class: classCode },
    });
  } catch (error) {
    logger.error("Error in getSubclasses controller", { error });
    next(error);
  }
};

/**
 * Get BUNA codes for a subclass (Level 6)
 * GET /api/buna/codes/:sector/:subsector/:group/:class/:subclass
 */
export const getBunaCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sector, subsector, group, class: classCode, subclass } = req.params;
    const bunaCodes = await bunaService.getBunaCodes(
      sector,
      subsector,
      group,
      classCode,
      subclass
    );
    res.json({
      success: true,
      data: bunaCodes,
      level: "buna",
      path: { sector, subsector, group, class: classCode, subclass },
    });
  } catch (error) {
    logger.error("Error in getBunaCodes controller", { error });
    next(error);
  }
};

/**
 * Get barcodes for a BUNA code (Level 7)
 * GET /api/buna/barcodes/:sector/:subsector/:group/:class/:subclass/:buna
 */
export const getBarcodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      sector,
      subsector,
      group,
      class: classCode,
      subclass,
      buna,
    } = req.params;
    const barcodes = await bunaService.getBarcodes(
      sector,
      subsector,
      group,
      classCode,
      subclass,
      buna
    );
    res.json({
      success: true,
      data: barcodes,
      level: "barcode",
      path: { sector, subsector, group, class: classCode, subclass, buna },
    });
  } catch (error) {
    logger.error("Error in getBarcodes controller", { error });
    next(error);
  }
};

/**
 * Search for a product by barcode
 * GET /api/buna/search/barcode/:barcode
 * 
 * NOTE: This searches the LOCAL database, not the E-Barimt API
 */
export const searchByBarcode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { barcode } = req.params;
    const result = await bunaService.searchByBarcode(barcode);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Barcode ${barcode} not found in local database or has no BUNA code assigned`,
        hint: "To assign a BUNA code, update the product's classificationCode field",
      });
    }
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error in searchByBarcode controller", { error });
    next(error);
  }
};

/**
 * Check if a barcode exists in E-Barimt system for a specific BUNA code
 * GET /api/buna/check/:bunaCode/:barcode
 */
export const checkBarcodeInBunaCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bunaCode, barcode } = req.params;
    const exists = await bunaService.checkBarcodeInBunaCode(barcode, bunaCode);
    
    res.json({
      success: true,
      exists,
      message: exists
        ? `Barcode ${barcode} is registered under BUNA code ${bunaCode}`
        : `Barcode ${barcode} is NOT registered under BUNA code ${bunaCode}`,
    });
  } catch (error) {
    logger.error("Error in checkBarcodeInBunaCode controller", { error });
    next(error);
  }
};

/**
 * Get classification path for a BUNA code
 * GET /api/buna/path/:bunaCode
 */
export const getClassificationPath = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bunaCode } = req.params;
    const path = await bunaService.getClassificationPath(bunaCode);
    
    if (!path) {
      return res.status(404).json({
        success: false,
        message: `BUNA code ${bunaCode} not found`,
      });
    }
    
    res.json({
      success: true,
      data: path,
    });
  } catch (error) {
    logger.error("Error in getClassificationPath controller", { error });
    next(error);
  }
};

/**
 * Clear the BUNA cache
 * POST /api/buna/cache/clear
 */
export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    bunaService.clearCache();
    res.json({
      success: true,
      message: "BUNA cache cleared successfully",
    });
  } catch (error) {
    logger.error("Error in clearCache controller", { error });
    next(error);
  }
};
