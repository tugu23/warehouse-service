import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface VneData {
  name: string;
  columns: string[];
  rows: Array<[number, number, number, number]>; // [id, baraanii_id, turul_id, vne]
}

/**
 * Хуучин turul_id (жишээ нь 8) нь одоогийн 5 суваг (id 1–5)-тай таарахгүй үед.
 * Шаардлагатай бол өөрчилнө үү (бизнесийн логикоор аль суваг руу оноохоо).
 */
const LEGACY_TURUL_ID_FALLBACK: Record<number, number> = {
  8: 2, // жишээ: хуучин 8 → Дэлгүүр (id 2)
};

function mapRowToObject(columns: string[], row: unknown[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  columns.forEach((col, idx) => {
    obj[col] = row[idx];
  });
  return obj;
}

/**
 * Legacy turul id → одоогийн customer_types.id (ихэвчлэн 1–5).
 */
async function buildLegacyTurulResolver(): Promise<(legacyTurulId: number) => number | null> {
  const existing = await prisma.customerType.findMany({ select: { id: true, typeName: true } });
  const existingById = new Map(existing.map((c) => [c.id, c]));
  const legacyToCurrent = new Map<number, number>();

  for (const ct of existing) {
    legacyToCurrent.set(ct.id, ct.id);
  }

  const harPath = path.join(__dirname, "parsed-data", "turul_hariltsagch.json");
  if (fs.existsSync(harPath)) {
    const raw = JSON.parse(fs.readFileSync(harPath, "utf-8")) as {
      columns: string[];
      rows: unknown[][];
    };
    for (const row of raw.rows) {
      const obj = mapRowToObject(raw.columns, row);
      const legacyId = Number(obj.id);
      if (Number.isNaN(legacyId)) continue;
      const typeName = String(obj.turul ?? `Төрөл ${obj.id}`);
      const match = existing.find((c) => c.typeName === typeName);
      if (match) legacyToCurrent.set(legacyId, match.id);
    }
  }

  for (const [legacy, targetId] of Object.entries(LEGACY_TURUL_ID_FALLBACK)) {
    const lid = Number(legacy);
    if (existingById.has(targetId) && !legacyToCurrent.has(lid)) {
      legacyToCurrent.set(lid, targetId);
    }
  }

  const warned = new Set<number>();

  return (legacyTurulId: number): number | null => {
    if (legacyToCurrent.has(legacyTurulId)) {
      return legacyToCurrent.get(legacyTurulId)!;
    }
    if (existingById.has(legacyTurulId)) {
      return legacyTurulId;
    }
    if (!warned.has(legacyTurulId)) {
      warned.add(legacyTurulId);
      console.log(
        `⚠️  Legacy turul_id ${legacyTurulId} has no mapping to current customer_types (1–5). Add turul_hariltsagch.json or LEGACY_TURUL_ID_FALLBACK.`
      );
    }
    return null;
  };
}

async function main() {
  console.log("🏷️  Starting price data seed from vne.json...");

  const resolveTurul = await buildLegacyTurulResolver();

  // Read vne.json file
  const vneFilePath = path.join(__dirname, "parsed-data", "vne.json");
  const vneDataRaw = fs.readFileSync(vneFilePath, "utf-8");
  const vneData: VneData = JSON.parse(vneDataRaw);

  console.log(`📊 Total price records to process: ${vneData.rows.length}`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Process each price record
  for (const row of vneData.rows) {
    const [id, baraanii_id, turul_id, vne] = row;

    try {
      // Skip if price is 0
      if (vne === 0) {
        skipCount++;
        continue;
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: baraanii_id },
      });

      if (!product) {
        console.log(
          `⚠️  Product not found for baraanii_id: ${baraanii_id}, skipping...`
        );
        skipCount++;
        continue;
      }

      const customerTypeId = resolveTurul(turul_id);
      if (customerTypeId === null) {
        skipCount++;
        continue;
      }

      // Upsert product price
      await prisma.productPrice.upsert({
        where: {
          productId_customerTypeId: {
            productId: baraanii_id,
            customerTypeId: customerTypeId,
          },
        },
        update: {
          price: vne,
        },
        create: {
          productId: baraanii_id,
          customerTypeId: customerTypeId,
          price: vne,
        },
      });

      successCount++;

      if (successCount % 100 === 0) {
        console.log(`✅ Processed ${successCount} prices...`);
      }
    } catch (error) {
      errorCount++;
      console.error(
        `❌ Error processing price for product ${baraanii_id}, customer type ${turul_id}:`,
        error
      );
    }
  }

  console.log("\n📊 Price Data Seed Summary:");
  console.log(`   ✅ Successfully seeded: ${successCount} prices`);
  console.log(`   ⚠️  Skipped: ${skipCount} records`);
  console.log(`   ❌ Errors: ${errorCount} records`);
  console.log("\n🎉 Price data seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error during price seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
