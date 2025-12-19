-- CreateTable
CREATE TABLE "product_prices" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "customer_type_id" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "returns" 
ADD COLUMN "customer_id" INTEGER,
ADD COLUMN "unit_price" DECIMAL(10,2),
ADD COLUMN "expiry_date" TIMESTAMPTZ(3),
ADD COLUMN "notes" TEXT,
ALTER COLUMN "order_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_prices_product_id_customer_type_id_key" ON "product_prices"("product_id", "customer_type_id");

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_customer_type_id_fkey" FOREIGN KEY ("customer_type_id") REFERENCES "customer_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

