/**
 * Seed script to import product expiration/batch data from vldegdel.json
 * This integrates manufacturing dates, expiration dates, and storage durations with products
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface VldegdelData {
  name: string;
  columns: string[];
  rows: any[][];
}

function mapRowToObject(columns: string[], row: any[]): any {
  const obj: any = {};
  columns.forEach((col, idx) => {
    obj[col] = row[idx];
  });
  return obj;
}

function parseDate(dateStr: any): Date | null {
  if (!dateStr || dateStr === null || dateStr === "") return null;
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

async function seedProductBatches() {
  console.log(
    "\n📦 Importing product expiration data from vldegdel.json...\n"
  );

  const vldegdelPath = path.join(__dirname, "parsed-data", "vldegdel.json");
  const vldegdelRaw = fs.readFileSync(vldegdelPath, "utf-8");
  const vldegdelData: VldegdelData = JSON.parse(vldegdelRaw);

  console.log(`📊 Нийт ${vldegdelData.rows.length} үлдэгдэл мэдээлэл олдлоо`);

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let updatedStockCount = 0;

  // Get all existing products
  const products = await prisma.product.findMany({
    select: { id: true },
  });
  const productIds = new Set(products.map((p) => p.id));

  console.log(`📦 Системд ${products.length} бүтээгдэхүүн байна\n`);

  for (const row of vldegdelData.rows) {
    const obj = mapRowToObject(vldegdelData.columns, row);

    // Skip if product doesn't exist
    if (!obj.baraanii_id || !productIds.has(obj.baraanii_id)) {
      skippedCount++;
      continue;
    }

    try {
      const productId = obj.baraanii_id;
      const quantity = obj.too || 0;
      const manufacturingDate = parseDate(obj.vildverlesen_hugatsaa);
      const expirationDate = parseDate(obj.duusah_hugatsaa);
      const storageDuration = obj.hadgalah_hugatsaa || 0;

      // Create batch record if we have valid date information
      if (manufacturingDate || expirationDate) {
        const batchNumber = `BATCH-${obj.id}-${productId}`;

        await prisma.productBatch.upsert({
          where: {
            productId_batchNumber: {
              productId: productId,
              batchNumber: batchNumber,
            },
          },
          update: {
            quantity: quantity,
            arrivalDate: manufacturingDate || new Date(),
            expiryDate: expirationDate,
            isActive: expirationDate ? expirationDate > new Date() : true,
          },
          create: {
            productId: productId,
            batchNumber: batchNumber,
            quantity: quantity,
            arrivalDate: manufacturingDate || new Date(),
            expiryDate: expirationDate,
            isActive: expirationDate ? expirationDate > new Date() : true,
          },
        });
      }

      // Update product stock quantity if there's a quantity
      if (quantity > 0) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            stockQuantity: {
              increment: quantity,
            },
          },
        });
        updatedStockCount++;
      }

      processedCount++;

      if (processedCount % 100 === 0) {
        console.log(`✅ ${processedCount} үлдэгдэл боловсруулагдсан...`);
      }
    } catch (error: any) {
      errorCount++;
      if (errorCount <= 10) {
        console.error(
          `❌ Алдаа гарлаа (id: ${obj.id}, product_id: ${obj.baraanii_id}):`,
          error.message
        );
      }
    }
  }

  console.log(`\n✅ Үлдэгдэл мэдээлэл амжилттай орууллаа!`);
  console.log(`   - Боловсруулсан: ${processedCount}`);
  console.log(`   - Агуулах үлдэгдэл шинэчилсэн: ${updatedStockCount}`);
  console.log(`   - Алгассан: ${skippedCount}`);
  console.log(`   - Алдаатай: ${errorCount}`);
}

async function main() {
  console.log("🚀 Бүтээгдэхүүний үлдэгдэл, хугацаа мэдээллийг оруулж байна...\n");

  try {
    await seedProductBatches();
    console.log("\n🎉 Амжилттай дууслаа!");
  } catch (error) {
    console.error("❌ Алдаа гарлаа:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

