-- Add missing return fields to orders table
ALTER TABLE orders ADD COLUMN returned_at TIMESTAMP(3) WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN return_reason VARCHAR(500);
ALTER TABLE orders ADD COLUMN returned_by_id INTEGER;
ALTER TABLE orders ADD COLUMN return_note VARCHAR(1000);

-- Add foreign key for returned_by_id
ALTER TABLE orders ADD CONSTRAINT fk_orders_returned_by
  FOREIGN KEY (returned_by_id) REFERENCES employees(id) ON DELETE SET NULL;