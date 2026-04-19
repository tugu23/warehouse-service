-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Credit', 'BankTransfer', 'Sales', 'Padan');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Paid', 'Pending', 'Partial', 'Overdue');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('Planned', 'InProgress', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "StoreType" AS ENUM ('Market', 'Store');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Market', 'Store');

-- CreateEnum
CREATE TYPE "AgentSalesTargetPeriodType" AS ENUM ('DAY', 'MONTH', 'YEAR');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(50),
    "password_hash" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "store_id" INTEGER,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contact_info" TEXT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name_mongolian" VARCHAR(255) NOT NULL,
    "name_english" VARCHAR(255),
    "description" TEXT,
    "classification_code" VARCHAR(20),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name_mongolian" VARCHAR(255) NOT NULL,
    "name_english" VARCHAR(255),
    "product_code" VARCHAR(100),
    "supplier_id" INTEGER,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "default_price" DECIMAL(10,2),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" INTEGER,
    "name_korean" VARCHAR(255),
    "barcode" VARCHAR(100),
    "units_per_box" INTEGER,
    "price_per_box" DECIMAL(10,2),
    "net_weight" DECIMAL(10,3),
    "gross_weight" DECIMAL(10,3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "classification_code" VARCHAR(20),
    "vat_type" VARCHAR(20) DEFAULT 'VAT',

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_types" (
    "id" SERIAL NOT NULL,
    "type_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "customer_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "real_name" VARCHAR(255),
    "name_2" VARCHAR(255),
    "legacy_customer_id" INTEGER,
    "address" TEXT,
    "phone_number" VARCHAR(50),
    "location_latitude" DOUBLE PRECISION,
    "location_longitude" DOUBLE PRECISION,
    "customer_type_id" INTEGER,
    "assigned_agent_id" INTEGER,
    "organization_name" VARCHAR(255),
    "organization_type" VARCHAR(100),
    "contact_person_name" VARCHAR(255),
    "registration_number" VARCHAR(100),
    "district" VARCHAR(100),
    "detailed_address" TEXT,
    "ebarimt_consumer_no" VARCHAR(20),
    "is_vat_payer" BOOLEAN NOT NULL DEFAULT false,
    "payment_terms" VARCHAR(100),
    "direction" VARCHAR(100),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "order_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pending',
    "total_amount" DECIMAL(12,2),
    "credit_term_days" INTEGER,
    "delivery_plan_id" INTEGER,
    "due_date" TIMESTAMPTZ(3),
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'Cash',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "remaining_amount" DECIMAL(12,2),
    "order_type" "OrderType" NOT NULL DEFAULT 'Store',
    "delivery_date" TIMESTAMPTZ(3),
    "subtotal_amount" DECIMAL(12,2),
    "vat_amount" DECIMAL(12,2) DEFAULT 0,
    "ebarimt_id" VARCHAR(100),
    "ebarimt_bill_id" VARCHAR(100),
    "ebarimt_registered" BOOLEAN NOT NULL DEFAULT false,
    "ebarimt_date" TIMESTAMPTZ(3),
    "ebarimt_return_id" VARCHAR(100),
    "ebarimt_receipt_type" VARCHAR(10),
    "order_number" VARCHAR(50),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "returns" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2),
    "reason" TEXT,
    "return_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_locations" (
    "id" SERIAL NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_method" "PaymentMethod" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_balances" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "opening_balance" INTEGER NOT NULL DEFAULT 0,
    "closing_balance" INTEGER NOT NULL DEFAULT 0,
    "total_in" INTEGER NOT NULL DEFAULT 0,
    "total_out" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "inventory_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_plans" (
    "id" SERIAL NOT NULL,
    "plan_date" TIMESTAMPTZ(3) NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "scheduled_time" TIMESTAMPTZ(3),
    "status" "DeliveryStatus" NOT NULL DEFAULT 'Planned',
    "delivery_notes" TEXT,
    "actual_delivery_time" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "description" TEXT,
    "target_area" VARCHAR(255),
    "estimated_orders" INTEGER,

    CONSTRAINT "delivery_plans_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "agent_sales_targets" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "period_type" "AgentSalesTargetPeriodType" NOT NULL,
    "period_start" DATE NOT NULL,
    "target_amount" DECIMAL(14,2) NOT NULL,
    "target_box_qty" DECIMAL(14,2),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "agent_sales_targets_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_balances_product_id_month_year_key" ON "inventory_balances"("product_id", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "product_sales_analytics_product_id_month_year_key" ON "product_sales_analytics"("product_id", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_forecasts_product_id_month_year_key" ON "inventory_forecasts"("product_id", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "agent_sales_targets_employee_id_period_type_period_start_key" ON "agent_sales_targets"("employee_id", "period_type", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "product_prices_product_id_customer_type_id_key" ON "product_prices"("product_id", "customer_type_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_assigned_agent_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_customer_type_id_fkey" FOREIGN KEY ("customer_type_id") REFERENCES "customer_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_locations" ADD CONSTRAINT "agent_locations_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_plans" ADD CONSTRAINT "delivery_plans_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_plans" ADD CONSTRAINT "delivery_plans_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sales_analytics" ADD CONSTRAINT "product_sales_analytics_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_forecasts" ADD CONSTRAINT "inventory_forecasts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_sales_targets" ADD CONSTRAINT "agent_sales_targets_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_customer_type_id_fkey" FOREIGN KEY ("customer_type_id") REFERENCES "customer_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

