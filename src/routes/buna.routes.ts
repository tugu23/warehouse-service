/**
 * BUNA Routes - API routes for BUNA (Unified Classification) system
 */

import express from "express";
import * as bunaController from "../controllers/buna.controller";

const router = express.Router();

/**
 * @route   GET /api/buna/sectors
 * @desc    Get all sectors (Level 1 - Салбар)
 * @access  Public
 */
router.get("/sectors", bunaController.getSectors);

/**
 * @route   GET /api/buna/subsectors/:sector
 * @desc    Get subsectors for a sector (Level 2 - Дэд салбар)
 * @access  Public
 * @param   sector - Sector code (2 digits, e.g., "01")
 */
router.get("/subsectors/:sector", bunaController.getSubsectors);

/**
 * @route   GET /api/buna/groups/:sector/:subsector
 * @desc    Get groups for a subsector (Level 3 - Бүлэг)
 * @access  Public
 * @param   sector - Sector code (2 digits)
 * @param   subsector - Subsector code (3 digits, e.g., "011")
 */
router.get("/groups/:sector/:subsector", bunaController.getGroups);

/**
 * @route   GET /api/buna/classes/:sector/:subsector/:group
 * @desc    Get classes for a group (Level 4 - Анги)
 * @access  Public
 * @param   sector - Sector code (2 digits)
 * @param   subsector - Subsector code (3 digits)
 * @param   group - Group code (4 digits, e.g., "0111")
 */
router.get("/classes/:sector/:subsector/:group", bunaController.getClasses);

/**
 * @route   GET /api/buna/subclasses/:sector/:subsector/:group/:class
 * @desc    Get subclasses for a class (Level 5 - Дэд анги)
 * @access  Public
 * @param   sector - Sector code (2 digits)
 * @param   subsector - Subsector code (3 digits)
 * @param   group - Group code (4 digits)
 * @param   class - Class code (5 digits, e.g., "01111")
 */
router.get(
  "/subclasses/:sector/:subsector/:group/:class",
  bunaController.getSubclasses
);

/**
 * @route   GET /api/buna/codes/:sector/:subsector/:group/:class/:subclass
 * @desc    Get BUNA codes for a subclass (Level 6 - БҮНА код)
 * @access  Public
 * @param   sector - Sector code (2 digits)
 * @param   subsector - Subsector code (3 digits)
 * @param   group - Group code (4 digits)
 * @param   class - Class code (5 digits)
 * @param   subclass - Subclass code (5 digits)
 * @returns Array of 7-digit BUNA codes
 */
router.get(
  "/codes/:sector/:subsector/:group/:class/:subclass",
  bunaController.getBunaCodes
);

/**
 * @route   GET /api/buna/barcodes/:sector/:subsector/:group/:class/:subclass/:buna
 * @desc    Get barcodes for a BUNA code (Level 7)
 * @access  Public
 * @param   sector - Sector code (2 digits)
 * @param   subsector - Subsector code (3 digits)
 * @param   group - Group code (4 digits)
 * @param   class - Class code (5 digits)
 * @param   subclass - Subclass code (5 digits)
 * @param   buna - BUNA code (7 digits, e.g., "0111100")
 * @returns Array of barcodes with product names and dates
 */
router.get(
  "/barcodes/:sector/:subsector/:group/:class/:subclass/:buna",
  bunaController.getBarcodes
);

/**
 * @route   GET /api/buna/search/barcode/:barcode
 * @desc    Search for a product by barcode in LOCAL database
 * @access  Public
 * @param   barcode - Product barcode
 * @returns Product with BUNA classification if found
 * @note    This searches YOUR database, not the E-Barimt system
 */
router.get("/search/barcode/:barcode", bunaController.searchByBarcode);

/**
 * @route   GET /api/buna/check/:bunaCode/:barcode
 * @desc    Check if a barcode exists in E-Barimt system for a specific BUNA code
 * @access  Public
 * @param   bunaCode - 7-digit BUNA code
 * @param   barcode - Product barcode to check
 * @returns Boolean indicating if barcode is registered under the BUNA code
 */
router.get("/check/:bunaCode/:barcode", bunaController.checkBarcodeInBunaCode);

/**
 * @route   GET /api/buna/path/:bunaCode
 * @desc    Get the full classification path for a BUNA code
 * @access  Public
 * @param   bunaCode - 7-digit BUNA code (e.g., "0111100")
 * @returns Complete hierarchy from sector to BUNA code
 */
router.get("/path/:bunaCode", bunaController.getClassificationPath);

/**
 * @route   GET /api/buna/validate/:bunaCode
 * @desc    Validate a BUNA code and get its details
 * @access  Public
 * @param   bunaCode - 7-digit BUNA code to validate
 * @returns Validation result with full classification path if valid
 */
router.get("/validate/:bunaCode", bunaController.validateBunaCode);

/**
 * @route   GET /api/buna/suggestions
 * @desc    Get suggested BUNA codes for common product categories
 * @access  Public
 * @returns List of commonly used BUNA codes organized by category
 */
router.get("/suggestions", bunaController.getSuggestions);

/**
 * @route   POST /api/buna/cache/clear
 * @desc    Clear the BUNA service cache
 * @access  Public (should be protected in production)
 */
router.post("/cache/clear", bunaController.clearCache);

export default router;
