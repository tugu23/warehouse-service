-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Credit', 'BankTransfer', 'Sales', 'Padan');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Paid', 'Pending', 'Partial', 'Overdue');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('Planned', 'InProgress', 'Completed', 'Cancelled');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "credit_term_days" INTEGER,
ADD COLUMN     "delivery_plan_id" INTEGER,
ADD COLUMN     "due_date" TIMESTAMPTZ(3),
ADD COLUMN     "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL DEFAULT 'Cash',
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "remaining_amount" DECIMAL(12,2);

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
CREATE TABLE "product_batches" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "batch_number" VARCHAR(100) NOT NULL,
    "arrival_date" TIMESTAMPTZ(3) NOT NULL,
    "expiry_date" TIMESTAMPTZ(3),
    "quantity" INTEGER NOT NULL,
    "cost_price" DECIMAL(10,2),
    "supplier_invoice" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_batches_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "delivery_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_batches_product_id_batch_number_key" ON "product_batches"("product_id", "batch_number");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_balances_product_id_month_year_key" ON "inventory_balances"("product_id", "month", "year");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_batches" ADD CONSTRAINT "product_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_plans" ADD CONSTRAINT "delivery_plans_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_plans" ADD CONSTRAINT "delivery_plans_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
