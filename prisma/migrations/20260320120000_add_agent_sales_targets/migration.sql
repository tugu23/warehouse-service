-- CreateEnum
CREATE TYPE "AgentSalesTargetPeriodType" AS ENUM ('DAY', 'MONTH', 'YEAR');

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

-- CreateIndex
CREATE UNIQUE INDEX "agent_sales_targets_employee_id_period_type_period_start_key" ON "agent_sales_targets"("employee_id", "period_type", "period_start");

-- AddForeignKey
ALTER TABLE "agent_sales_targets" ADD CONSTRAINT "agent_sales_targets_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
