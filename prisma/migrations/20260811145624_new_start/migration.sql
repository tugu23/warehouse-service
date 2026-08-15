-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "fk_order_items_promotion";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "fk_orders_returned_by";

-- DropIndex
DROP INDEX "idx_order_items_promotion_id";

-- AlterTable
ALTER TABLE "promotions" ALTER COLUMN "end_date" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_returned_by_id_fkey" FOREIGN KEY ("returned_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
