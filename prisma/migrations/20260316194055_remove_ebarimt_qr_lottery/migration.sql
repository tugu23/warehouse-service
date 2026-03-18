/*
  Warnings:

  - You are about to drop the column `ebarimt_lottery` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `ebarimt_qr_data` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "ebarimt_lottery",
DROP COLUMN "ebarimt_qr_data";
