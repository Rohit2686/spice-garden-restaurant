/*
# Update menu_items RLS for demo admin panel

The admin panel uses hardcoded credentials and the anon key.
For demo purposes, allow anon to INSERT/UPDATE/DELETE menu items.

In production, you would use Supabase Auth or a service account.
*/

-- Allow anon to insert (admin panel demo)
DROP POLICY IF EXISTS "authenticated_insert_menu_items" ON menu_items;
CREATE POLICY "demo_insert_menu_items" ON menu_items FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Allow anon to update (admin panel demo)
DROP POLICY IF EXISTS "authenticated_update_menu_items" ON menu_items;
CREATE POLICY "demo_update_menu_items" ON menu_items FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow anon to delete (admin panel demo)
DROP POLICY IF EXISTS "authenticated_delete_menu_items" ON menu_items;
CREATE POLICY "demo_delete_menu_items" ON menu_items FOR DELETE
TO anon, authenticated USING (true);
