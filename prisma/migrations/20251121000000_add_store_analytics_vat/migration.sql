-- CreateEnum
CREATE TYPE "StoreType" AS ENUM ('Market', 'Store');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Market', 'Store');

-- AlterTable
ALTER TABLE "employees" ADD COLUMN "store_id" INTEGER;

-- AlterTable
ALTER TABLE "orders" 
ADD COLUMN "order_type" "OrderType" NOT NULL DEFAULT 'Store',
ADD COLUMN "delivery_date" TIMESTAMPTZ(3),
ADD COLUMN "subtotal_amount" DECIMAL(12,2),
ADD COLUMN "vat_amount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "store_type" "StoreType" NOT NULL,
    "location_latitude" DOUBLE PRECISION,
    "location_longitude" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sales_analytics" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "quantity_sold" INTEGER NOT NULL DEFAULT 0,
    "average_monthly_sales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "three_month_average" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "six_month_average" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_outlier" BOOLEAN NOT NULL DEFAULT false,
    "outlier_reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "product_sales_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_forecasts" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "recommended_order_quantity" INTEGER NOT NULL DEFAULT 0,
    "based_on_average" VARCHAR(50) NOT NULL,
    "forecast_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "inventory_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_sales_analytics_product_id_month_year_key" ON "product_sales_analytics"("product_id", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_forecasts_product_id_month_year_key" ON "inventory_forecasts"("product_id", "month", "year");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sales_analytics" ADD CONSTRAINT "product_sales_analytics_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_forecasts" ADD CONSTRAINT "inventory_forecasts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

