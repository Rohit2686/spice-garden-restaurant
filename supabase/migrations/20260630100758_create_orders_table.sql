/*
# Create orders table for Spice Garden online ordering

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `order_type` (text, not null) — 'dine_in' or 'takeaway'
  - `customer_name` (text, not null)
  - `customer_phone` (text, not null)
  - `table_number` (text, nullable) — for dine-in only
  - `items` (jsonb, not null) — array of {name, price, qty}
  - `total` (integer, not null) — total in paise-free rupees
  - `notes` (text, nullable) — optional special instructions
  - `status` (text, not null, default 'received') — received / preparing / ready / completed / cancelled
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- No-auth public ordering form: anon + authenticated can INSERT new orders.
- SELECT/UPDATE/DELETE restricted to authenticated staff only (protects customer PII and order data).

3. Notes
- The order form submits as the anon-key client, so the INSERT policy MUST include `anon`.
- Customers cannot list or read other orders — only staff (authenticated) can.
- `items` stored as jsonb so the cart structure is preserved without a separate line-items table.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type text NOT NULL CHECK (order_type IN ('dine_in', 'takeaway')),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  table_number text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total integer NOT NULL DEFAULT 0 CHECK (total >= 0),
  notes text,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to create an order
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Only authenticated staff can view orders (protects customer PII)
DROP POLICY IF EXISTS "staff_select_orders" ON orders;
CREATE POLICY "staff_select_orders" ON orders FOR SELECT
TO authenticated USING (true);

-- Only authenticated staff can update order status
DROP POLICY IF EXISTS "staff_update_orders" ON orders;
CREATE POLICY "staff_update_orders" ON orders FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated staff can delete orders
DROP POLICY IF EXISTS "staff_delete_orders" ON orders;
CREATE POLICY "staff_delete_orders" ON orders FOR DELETE
TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
