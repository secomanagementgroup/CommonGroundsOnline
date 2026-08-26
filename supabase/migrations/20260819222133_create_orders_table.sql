/*
# Create orders table for Common Grounds Coffee

1. Purpose
   - Stores customer orders submitted from the Common Grounds Coffee landing page.
   - Each row represents one completed order with its line items, totals, and optional customer info.

2. New Tables
   - `orders`
     - `id` (uuid, primary key)
     - `items` (jsonb, not null) — array of line items: { name, milk, quantity, price }
     - `total_cents` (integer, not null) — order total in cents (USD)
     - `status` (text, not null, default 'pending') — pending | paid | cancelled
     - `customer_name` (text, nullable) — optional pickup name
     - `customer_phone` (text, nullable) — optional contact
     - `notes` (text, nullable) — optional special instructions
     - `created_at` (timestamptz, default now())

3. Security
   - Enable RLS on `orders`.
   - This is a public ordering app with no sign-in screen, so the anon-key frontend must be able to insert and read its own submissions.
   - SELECT: allow anon + authenticated to read (orders are shared/public for this demo).
   - INSERT: allow anon + authenticated to insert new orders.
   - UPDATE: allow anon + authenticated to update (e.g., status changes once Square is linked).
   - DELETE: allow anon + authenticated to delete.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  items jsonb NOT NULL,
  total_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  customer_name text,
  customer_phone text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
