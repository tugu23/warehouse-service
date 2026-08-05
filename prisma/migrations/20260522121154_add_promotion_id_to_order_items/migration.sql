-- Add promotionId column to order_items table
ALTER TABLE order_items ADD COLUMN promotion_id INTEGER;

-- Add foreign key constraint (nullable, so no existing rows will fail)
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_promotion
  FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_order_items_promotion_id ON order_items(promotion_id);