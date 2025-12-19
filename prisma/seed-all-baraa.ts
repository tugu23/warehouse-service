/**
 * Seed script to import ALL baraa.json products with their original IDs
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface BaraaData {
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

function parseDecimal(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

async function seedAllProducts() {
  console.log(
    "\n🛍️  Importing ALL products from baraa.json with original IDs...\n"
  );

  const baraaPath = path.join(__dirname, "parsed-data", "baraa.json");
  const baraaRaw = fs.readFileSync(baraaPath, "utf-8");
  const baraaData: BaraaData = JSON.parse(baraaRaw);

  console.log(`📊 Нийт ${baraaData.rows.length} бүтээгдэхүүн олдлоо`);

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Get existing suppliers and categories
  const suppliers = await prisma.supplier.findMany({ select: { id: true } });
  const categories = await prisma.category.findMany({ select: { id: true } });
  const supplierIds = new Set(suppliers.map((s) => s.id));
  const categoryIds = new Set(categories.map((c) => c.id));

  console.log(
    `📦 Системд ${suppliers.length} supplier, ${categories.length} category байна\n`
  );

  for (const row of baraaData.rows) {
    const obj = mapRowToObject(baraaData.columns, row);

    // Skip products without names or IDs
    if (!obj.mon_ner || !obj.id) {
      skippedCount++;
      continue;
    }

    try {
      // Check if supplier and category exist
      const supplierId =
        obj.company && supplierIds.has(obj.company) ? obj.company : null;
      const categoryId =
        obj.turul && categoryIds.has(obj.turul) ? obj.turul : null;

      // Keep barcode as-is (allow duplicates)
      const barcode = obj.bar_code ? String(obj.bar_code) : null;

      // Create product with original ID
      await prisma.product.upsert({
        where: { id: obj.id },
        update: {
          nameMongolian: obj.mon_ner || "Нэргүй бараа",
          nameEnglish: obj.eng_ner || null,
          nameKorean: obj.ko_ner || null,
          productCode: obj.code ? String(obj.code) : null,
          barcode: barcode,
          supplierId: supplierId,
          categoryId: categoryId,
          stockQuantity: 0,
          unitsPerBox: obj.khairtsag || null,
          priceWholesale: parseDecimal(obj.price_sh_w),
          priceRetail: parseDecimal(obj.price_sh_d),
          pricePerBox: parseDecimal(obj.price_box_d),
          netWeight: parseDecimal(obj.tsewer_jin),
          grossWeight: parseDecimal(obj.bohir_jin),
          isActive: obj.status === 1,
        },
        create: {
          id: obj.id, // Use original ID
          nameMongolian: obj.mon_ner || "Нэргүй бараа",
          nameEnglish: obj.eng_ner || null,
          nameKorean: obj.ko_ner || null,
          productCode: obj.code ? String(obj.code) : null,
          barcode: barcode,
          supplierId: supplierId,
          categoryId: categoryId,
          stockQuantity: 0,
          unitsPerBox: obj.khairtsag || null,
          priceWholesale: parseDecimal(obj.price_sh_w),
          priceRetail: parseDecimal(obj.price_sh_d),
          pricePerBox: parseDecimal(obj.price_box_d),
          netWeight: parseDecimal(obj.tsewer_jin),
          grossWeight: parseDecimal(obj.bohir_jin),
          isActive: obj.status === 1,
        },
      });

      processedCount++;

      if (processedCount % 100 === 0) {
        console.log(`✅ ${processedCount} бүтээгдэхүүн боловсруулагдсан...`);
      }
    } catch (error: any) {
      errorCount++;
      if (errorCount <= 10) {
        console.error(
          `❌ Алдаа гарлаа (id: ${obj.id}, name: ${obj.mon_ner}):`,
          error.message
        );
      }
    }
  }

  console.log(`\n✅ Бүх бүтээгдэхүүн амжилттай орууллаа!`);
  console.log(`   - Боловсруулсан: ${processedCount}`);
  console.log(`   - Алгассан: ${skippedCount}`);
  console.log(`   - Алдаатай: ${errorCount}`);

  // Update sequence
  console.log(`\n🔄 Product ID sequence шинэчилж байна...`);
  const maxId = await prisma.$queryRaw<
    Array<{ max: number }>
  >`SELECT MAX(id) as max FROM products`;
  if (maxId[0]?.max) {
    await prisma.$executeRawUnsafe(
      `ALTER SEQUENCE products_id_seq RESTART WITH ${maxId[0].max + 1}`
    );
    console.log(`✅ Sequence ${maxId[0].max + 1} болгон шинэчлэгдлээ`);
  }
}

async function main() {
  console.log("🚀 БҮХ бүтээгдэхүүнийг хуучин ID-тай нь оруулж байна...\n");

  try {
    await seedAllProducts();
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
