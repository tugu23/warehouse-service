/*
  Warnings:

  - You are about to drop the column `supplier_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_supplier_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "supplier_id";

-- DropTable
DROP TABLE "suppliers";
