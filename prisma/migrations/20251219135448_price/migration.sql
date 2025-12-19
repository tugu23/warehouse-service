-- DropForeignKey
ALTER TABLE "returns" DROP CONSTRAINT "returns_order_id_fkey";

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
