/*
  Warnings:

  - You are about to drop the column `name_english` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `name_english` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name_korean` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "name_english";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "name_english",
DROP COLUMN "name_korean";
