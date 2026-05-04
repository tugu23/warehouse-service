-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PERCENT_DISCOUNT', 'BUY_X_GET_Y');

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "PromotionType" NOT NULL,
    "discount_percent" DECIMAL(5,2),
    "buy_qty" INTEGER,
    "free_qty" INTEGER,
    "start_date" TIMESTAMPTZ(3) NOT NULL,
    "end_date" TIMESTAMPTZ(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "promotions_product_id_end_date_idx" ON "promotions"("product_id", "end_date");

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
