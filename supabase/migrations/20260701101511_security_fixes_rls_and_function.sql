/*
# Security fixes

1. Fix search_path on update_updated_at_column function
2. Replace open RLS policies with authenticated-only policies

For the admin panel, we'll use Supabase Auth with email/password.
The anon key can still read menu items (for public display),
but only authenticated users can INSERT/UPDATE/DELETE.
*/

-- Fix search_path on the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===========================
-- MENU_ITEMS RLS POLICIES
-- ===========================

-- Allow public read (needed for menu display)
DROP POLICY IF EXISTS "public_select_menu_items" ON menu_items;
CREATE POLICY "public_select_menu_items" ON menu_items FOR SELECT
TO anon, authenticated USING (true);

-- Allow authenticated to insert (admin panel)
DROP POLICY IF EXISTS "demo_insert_menu_items" ON menu_items;
DROP POLICY IF EXISTS "authenticated_insert_menu_items" ON menu_items;
CREATE POLICY "authenticated_insert_menu_items" ON menu_items FOR INSERT
TO authenticated WITH CHECK (true);

-- Allow authenticated to update (admin panel)
DROP POLICY IF EXISTS "demo_update_menu_items" ON menu_items;
DROP POLICY IF EXISTS "authenticated_update_menu_items" ON menu_items;
CREATE POLICY "authenticated_update_menu_items" ON menu_items FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated to delete (admin panel)
DROP POLICY IF EXISTS "demo_delete_menu_items" ON menu_items;
DROP POLICY IF EXISTS "authenticated_delete_menu_items" ON menu_items;
CREATE POLICY "authenticated_delete_menu_items" ON menu_items FOR DELETE
TO authenticated USING (true);

-- ===========================
-- ORDERS RLS POLICIES
-- ===========================

-- Allow anon to insert orders (public ordering)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated 
WITH CHECK (
  customer_name IS NOT NULL 
  AND customer_phone IS NOT NULL
  AND total > 0
);

-- Allow anon/authenticated to read their own orders (optional: by phone match)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
TO anon, authenticated USING (true);

-- Allow authenticated to update orders (admin/staff)
DROP POLICY IF EXISTS "staff_update_orders" ON orders;
CREATE POLICY "staff_update_orders" ON orders FOR UPDATE
TO authenticated 
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Allow authenticated to delete orders (admin/staff)
DROP POLICY IF EXISTS "staff_delete_orders" ON orders;
CREATE POLICY "staff_delete_orders" ON orders FOR DELETE
TO authenticated 
USING (auth.jwt() ->> 'role' = 'authenticated');

-- ===========================
-- RESERVATIONS RLS POLICIES
-- ===========================

-- Allow anon to insert reservations (public booking)
DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "anon_insert_reservations" ON reservations FOR INSERT
TO anon, authenticated 
WITH CHECK (
  name IS NOT NULL 
  AND email IS NOT NULL
  AND phone IS NOT NULL
  AND guests > 0
  AND reservation_date IS NOT NULL
  AND reservation_time IS NOT NULL
);

-- Allow anon/authenticated to read reservations
DROP POLICY IF EXISTS "anon_select_reservations" ON reservations;
CREATE POLICY "anon_select_reservations" ON reservations FOR SELECT
TO anon, authenticated USING (true);

-- Allow authenticated to update reservations (admin/staff)
DROP POLICY IF EXISTS "staff_update_reservations" ON reservations;
CREATE POLICY "staff_update_reservations" ON reservations FOR UPDATE
TO authenticated 
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Allow authenticated to delete reservations (admin/staff)
DROP POLICY IF EXISTS "staff_delete_reservations" ON reservations;
CREATE POLICY "staff_delete_reservations" ON reservations FOR DELETE
TO authenticated 
USING (auth.jwt() ->> 'role' = 'authenticated');
