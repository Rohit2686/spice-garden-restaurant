/*
# Secure RLS policies - only service role can write

The Edge Function uses the service role key which bypasses RLS.
We restrict RLS to only allow reads for anon/authenticated users.
Writes must go through the Edge Function.
*/

-- Menu items: public read, no direct writes (use Edge Function)
DROP POLICY IF EXISTS "public_select_menu_items" ON menu_items;
DROP POLICY IF EXISTS "demo_admin_insert" ON menu_items;
DROP POLICY IF EXISTS "demo_admin_update" ON menu_items;
DROP POLICY IF EXISTS "demo_admin_delete" ON menu_items;

-- Only allow SELECT for anon/authenticated
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
TO anon, authenticated USING (true);

-- Note: INSERT/UPDATE/DELETE are blocked for anon/authenticated
-- The Edge Function (admin-menu) uses service role which bypasses RLS

-- Orders: Allow anon to insert (public ordering), staff can update via Edge Function
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
TO anon, authenticated 
WITH CHECK (
  customer_name IS NOT NULL 
  AND customer_phone IS NOT NULL
  AND total > 0
);

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "public_read_orders" ON orders FOR SELECT
TO anon, authenticated USING (true);

-- Remove direct UPDATE/DELETE - must use Edge Function for staff operations
DROP POLICY IF EXISTS "staff_update_orders" ON orders;
DROP POLICY IF EXISTS "staff_delete_orders" ON orders;

-- Reservations: Allow anon to insert (public booking)
DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "public_insert_reservations" ON reservations FOR INSERT
TO anon, authenticated 
WITH CHECK (
  name IS NOT NULL 
  AND email IS NOT NULL
  AND phone IS NOT NULL
  AND guests > 0
  AND reservation_date IS NOT NULL
  AND reservation_time IS NOT NULL
);

DROP POLICY IF EXISTS "anon_select_reservations" ON reservations;
CREATE POLICY "public_read_reservations" ON reservations FOR SELECT
TO anon, authenticated USING (true);

-- Remove direct UPDATE/DELETE - must use Edge Function for staff operations
DROP POLICY IF EXISTS "staff_update_reservations" ON reservations;
DROP POLICY IF EXISTS "staff_delete_reservations" ON reservations;
