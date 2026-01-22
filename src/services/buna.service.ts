/**
 * BUNA Service - Бараа, Үйлчилгээний Нэгдсэн Ангилал (Unified Classification of Goods and Services)
 * 
 * This service provides methods to interact with the E-Barimt BUNA API
 * to retrieve hierarchical product classification codes and barcodes.
 * 
 * BUNA Code Structure (7 digits):
 * - Level 1: Sector (Салбар) - 2 digits (e.g., "01")
 * - Level 2: Subsector (Дэд салбар) - 3 digits (e.g., "011")
 * - Level 3: Group (Бүлэг) - 4 digits (e.g., "0111")
 * - Level 4: Class (Анги) - 5 digits (e.g., "01111")
 * - Level 5: Subclass (Дэд анги) - 5 digits (same as class)
 * - Level 6: BUNA Code - 7 digits (e.g., "0111100")
 * - Level 7: Barcodes associated with the BUNA code
 */

import axios, { AxiosInstance } from "axios";
import logger from "../utils/logger";

// Type definitions
export interface BunaItem {
  code: string;
  name: string;
  addedDate?: string; // Only for barcodes
}

export interface BunaSearchResult {
  level: "sector" | "subsector" | "group" | "class" | "subclass" | "buna" | "barcode";
  items: BunaItem[];
  path?: {
    sector?: string;
    subsector?: string;
    group?: string;
    class?: string;
    subclass?: string;
    buna?: string;
  };
}

export interface BarcodeInfo {
  barcode: string;
  productName: string;
  bunaCode: string;
  addedDate: string;
  fullPath: {
    sector: string;
    subsector: string;
    group: string;
    class: string;
    subclass: string;
    buna: string;
  };
}

class BunaService {
  private client: AxiosInstance;
  private cache: Map<string, any>;
  private cacheTimeout: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // E-Barimt BUNA API endpoint
    this.client = axios.create({
      baseURL: "https://api.ebarimt.mn/api/info/check/barcode/v2",
      timeout: 30000,
      headers: {
        Accept: "application/json",
      },
    });

    this.cache = new Map();

    logger.info("BUNA service initialized");
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
    logger.info("BUNA cache cleared");
  }

  /**
   * Get sectors (Level 1) - Салбар
   * This is the top level of the BUNA hierarchy
   */
  async getSectors(): Promise<BunaItem[]> {
    const cacheKey = "sectors";
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info("Fetching BUNA sectors");
      
      // Call API without any parameters to get sectors
      const response = await this.client.get("/0/0/0/0/0/0");
      
      const sectors: BunaItem[] = response.data.map((item: [string, string]) => ({
        code: item[0],
        name: item[1],
      }));

      this.cache.set(cacheKey, sectors);
      logger.info(`Fetched ${sectors.length} BUNA sectors`);
      
      return sectors;
    } catch (error) {
      logger.error("Error fetching BUNA sectors", { error: error instanceof Error ? error.message : String(error) });
      throw new Error("Failed to fetch BUNA sectors");
    }
  }

  /**
   * Get subsectors (Level 2) - Дэд салбар
   * @param sector - Sector code (2 digits, e.g., "01")
   */
  async getSubsectors(sector: string): Promise<BunaItem[]> {
    const cacheKey = `subsectors-${sector}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info(`Fetching BUNA subsectors for sector ${sector}`);
      
      const response = await this.client.get(`/0/0/${sector}/0/0/0`);
      
      const subsectors: BunaItem[] = response.data.map((item: [string, string]) => ({
        code: item[0],
        name: item[1],
      }));

      this.cache.set(cacheKey, subsectors);
      logger.info(`Fetched ${subsectors.length} subsectors for sector ${sector}`);
      
      return subsectors;
    } catch (error) {
      logger.error(`Error fetching BUNA subsectors for sector ${sector}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch BUNA subsectors for sector ${sector}`);
    }
  }

  /**
   * Get groups (Level 3) - Бүлэг
   * @param sector - Sector code (2 digits)
   * @param subsector - Subsector code (3 digits)
   */
  async getGroups(sector: string, subsector: string): Promise<BunaItem[]> {
    const cacheKey = `groups-${sector}-${subsector}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info(`Fetching BUNA groups for ${sector}/${subsector}`);
      
      const response = await this.client.get(`/0/0/${sector}/${subsector}/0/0`);
      
      const groups: BunaItem[] = response.data.map((item: [string, string]) => ({
        code: item[0],
        name: item[1],
      }));

      this.cache.set(cacheKey, groups);
      logger.info(`Fetched ${groups.length} groups for ${sector}/${subsector}`);
      
      return groups;
    } catch (error) {
      logger.error(`Error fetching BUNA groups for ${sector}/${subsector}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch BUNA groups for ${sector}/${subsector}`);
    }
  }

  /**
   * Get classes (Level 4) - Анги
   * @param sector - Sector code (2 digits)
   * @param subsector - Subsector code (3 digits)
   * @param group - Group code (4 digits)
   */
  async getClasses(sector: string, subsector: string, group: string): Promise<BunaItem[]> {
    const cacheKey = `classes-${sector}-${subsector}-${group}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info(`Fetching BUNA classes for ${sector}/${subsector}/${group}`);
      
      const response = await this.client.get(`/${group}/0/${sector}/${subsector}/0/0`);
      
      const classes: BunaItem[] = response.data.map((item: [string, string]) => ({
        code: item[0],
        name: item[1],
      }));

      this.cache.set(cacheKey, classes);
      logger.info(`Fetched ${classes.length} classes for ${sector}/${subsector}/${group}`);
      
      return classes;
    } catch (error) {
      logger.error(`Error fetching BUNA classes for ${sector}/${subsector}/${group}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch BUNA classes for ${sector}/${subsector}/${group}`);
    }
  }

  /**
   * Get subclasses (Level 5) - Дэд анги
   * @param sector - Sector code (2 digits)
   * @param subsector - Subsector code (3 digits)
   * @param group - Group code (4 digits)
   * @param classCode - Class code (5 digits)
   */
  async getSubclasses(
    sector: string,
    subsector: string,
    group: string,
    classCode: string
  ): Promise<BunaItem[]> {
    const cacheKey = `subclasses-${sector}-${subsector}-${group}-${classCode}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info(`Fetching BUNA subclasses for ${sector}/${subsector}/${group}/${classCode}`);
      
      const response = await this.client.get(`/${group}/${classCode}/${sector}/${subsector}/0/0`);
      
      const subclasses: BunaItem[] = response.data.map((item: [string, string]) => ({
        code: item[0],
        name: item[1],
      }));

      this.cache.set(cacheKey, subclasses);
      logger.info(`Fetched ${subclasses.length} subclasses`);
      
      return subclasses;
    } catch (error) {
      logger.error(`Error fetching BUNA subclasses`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch BUNA subclasses`);
    }
  }

  /**
   * Get BUNA codes (Level 6) - БҮНА код
   * @param sector - Sector code (2 digits)
   * @param subsector - Subsector code (3 digits)
   * @param group - Group code (4 digits)
   * @param classCode - Class code (5 digits)
   * @param subclass - Subclass code (5 digits)
   */
  async getBunaCodes(
    sector: string,
    subsector: string,
    group: string,
    classCode: string,
    subclass: string
  ): Promise<BunaItem[]> {
    const cacheKey = `buna-${sector}-${subsector}-${group}-${classCode}-${subclass}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info(`Fetching BUNA codes`);
      
      const response = await this.client.get(`/${group}/${classCode}/${sector}/${subsector}/${subclass}/0`);
      
      const bunaCodes: BunaItem[] = response.data.map((item: [string, string]) => ({
        code: item[0],
        name: item[1],
      }));

      this.cache.set(cacheKey, bunaCodes);
      logger.info(`Fetched ${bunaCodes.length} BUNA codes`);
      
      return bunaCodes;
    } catch (error) {
      logger.error(`Error fetching BUNA codes`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch BUNA codes`);
    }
  }

  /**
   * Get barcodes for a specific BUNA code (Level 7)
   * @param sector - Sector code (2 digits)
   * @param subsector - Subsector code (3 digits)
   * @param group - Group code (4 digits)
   * @param classCode - Class code (5 digits)
   * @param subclass - Subclass code (5 digits)
   * @param bunaCode - BUNA code (7 digits)
   */
  async getBarcodes(
    sector: string,
    subsector: string,
    group: string,
    classCode: string,
    subclass: string,
    bunaCode: string
  ): Promise<BunaItem[]> {
    const cacheKey = `barcodes-${bunaCode}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info(`Fetching barcodes for BUNA code ${bunaCode}`);
      
      const response = await this.client.get(`/${group}/${classCode}/${sector}/${subsector}/${subclass}/${bunaCode}`);
      
      const barcodes: BunaItem[] = response.data.map((item: [string, string, string]) => ({
        code: item[0],
        name: item[1],
        addedDate: item[2],
      }));

      this.cache.set(cacheKey, barcodes);
      logger.info(`Fetched ${barcodes.length} barcodes for BUNA code ${bunaCode}`);
      
      return barcodes;
    } catch (error) {
      logger.error(`Error fetching barcodes for BUNA code ${bunaCode}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch barcodes for BUNA code ${bunaCode}`);
    }
  }

  /**
   * Search for a product by barcode
   * 
   * NOTE: The E-Barimt API does not provide a direct barcode search endpoint.
   * This method checks if a barcode exists in the local product database.
   * 
   * For manual lookup, you need to know the full BUNA classification path.
   * 
   * @param barcode - Product barcode to search for
   * @returns Product information with BUNA code if found in local database
   */
  async searchByBarcode(barcode: string): Promise<BarcodeInfo | null> {
    try {
      logger.info(`Searching for barcode ${barcode} in local database`);
      
      // Import prisma dynamically to avoid circular dependencies
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      
      try {
        // Search in local product database
        const product = await prisma.product.findFirst({
          where: {
            barcode: barcode,
          },
          select: {
            id: true,
            nameMongolian: true,
            barcode: true,
            classificationCode: true,
          },
        });
        
        if (!product || !product.classificationCode) {
          logger.info(`Barcode ${barcode} not found in local database or has no BUNA code`);
          return null;
        }
        
        // Get the full classification path for the BUNA code
        const path = await this.getClassificationPath(product.classificationCode);
        
        if (!path) {
          logger.warn(`Invalid BUNA code ${product.classificationCode} for product ${product.id}`);
          return null;
        }
        
        logger.info(`Found barcode ${barcode} with BUNA code ${product.classificationCode}`);
        
        return {
          barcode: barcode,
          productName: product.nameMongolian,
          bunaCode: product.classificationCode,
          addedDate: "",
          fullPath: {
            sector: path.sector.code,
            subsector: path.subsector.code,
            group: path.group.code,
            class: path.class.code,
            subclass: path.subclass.code,
            buna: path.buna.code,
          },
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      logger.error(`Error searching for barcode ${barcode}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to search for barcode ${barcode}`);
    }
  }
  
  /**
   * Check if a barcode exists in the E-Barimt system for a specific BUNA code
   * This is more efficient than searching the entire hierarchy
   * 
   * @param barcode - Barcode to check
   * @param bunaCode - 7-digit BUNA code (if known)
   * @returns True if barcode exists in the E-Barimt system
   */
  async checkBarcodeInBunaCode(barcode: string, bunaCode: string): Promise<boolean> {
    try {
      if (bunaCode.length !== 7) {
        throw new Error("BUNA code must be 7 digits");
      }
      
      const sector = bunaCode.substring(0, 2);
      const subsector = bunaCode.substring(0, 3);
      const group = bunaCode.substring(0, 4);
      const classCode = bunaCode.substring(0, 5);
      const subclass = bunaCode.substring(0, 5);
      
      const barcodes = await this.getBarcodes(
        sector,
        subsector,
        group,
        classCode,
        subclass,
        bunaCode
      );
      
      return barcodes.some((b) => b.code === barcode);
    } catch (error) {
      logger.error(`Error checking barcode ${barcode} in BUNA code ${bunaCode}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Get the full classification path for a BUNA code
   * @param bunaCode - 7-digit BUNA code
   */
  async getClassificationPath(bunaCode: string): Promise<{
    sector: BunaItem;
    subsector: BunaItem;
    group: BunaItem;
    class: BunaItem;
    subclass: BunaItem;
    buna: BunaItem;
  } | null> {
    try {
      // Extract codes from BUNA code
      // BUNA code structure: SSGCCCD (7 digits)
      // SS = Sector, SSG = Subsector, SSGC = Group, SSGCC = Class, SSGCC = Subclass, SSGCCCD = BUNA
      
      if (bunaCode.length !== 7) {
        throw new Error("BUNA code must be 7 digits");
      }

      const sector = bunaCode.substring(0, 2);
      const subsector = bunaCode.substring(0, 3);
      const group = bunaCode.substring(0, 4);
      const classCode = bunaCode.substring(0, 5);
      const subclass = bunaCode.substring(0, 5); // Same as class in this structure
      
      // Fetch each level
      const sectors = await this.getSectors();
      const sectorItem = sectors.find((s) => s.code === sector);
      if (!sectorItem) return null;

      const subsectors = await this.getSubsectors(sector);
      const subsectorItem = subsectors.find((s) => s.code === subsector);
      if (!subsectorItem) return null;

      const groups = await this.getGroups(sector, subsector);
      const groupItem = groups.find((g) => g.code === group);
      if (!groupItem) return null;

      const classes = await this.getClasses(sector, subsector, group);
      const classItem = classes.find((c) => c.code === classCode);
      if (!classItem) return null;

      const subclasses = await this.getSubclasses(sector, subsector, group, classCode);
      const subclassItem = subclasses.find((s) => s.code === subclass);
      if (!subclassItem) return null;

      const bunaCodes = await this.getBunaCodes(sector, subsector, group, classCode, subclass);
      const bunaItem = bunaCodes.find((b) => b.code === bunaCode);
      if (!bunaItem) return null;

      return {
        sector: sectorItem,
        subsector: subsectorItem,
        group: groupItem,
        class: classItem,
        subclass: subclassItem,
        buna: bunaItem,
      };
    } catch (error) {
      logger.error(`Error getting classification path for BUNA code ${bunaCode}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to get classification path for BUNA code ${bunaCode}`);
    }
  }
}

// Export singleton instance
const bunaService = new BunaService();
export default bunaService;
