/*
# Create menu_items table for Spice Garden

1. New Tables
- `menu_items`
  - `id` (uuid, primary key)
  - `name` (text, unique, not null)
  - `description` (text, not null)
  - `price` (integer, not null) — price in INR
  - `image` (text, not null) — Pexels image URL
  - `category_id` (text, not null) — e.g., 'starters', 'main-course', 'desserts', 'beverages'
  - `category_label` (text, not null) — e.g., 'Starters', 'Main Course'
  - `category_blurb` (text, not null) — category description
  - `is_veg` (boolean, default true) — vegetarian toggle
  - `tags` (text[], default '{}') — array of tags like 'Chef Special', 'Fried', etc.
  - `is_popular` (boolean, default false)
  - `sort_order` (integer, default 0) — for ordering within category
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `menu_items`.
- Public read (anon + authenticated) for menu display.
- Only authenticated staff can INSERT/UPDATE/DELETE (admin panel uses anon key for simplicity in demo).

3. Notes
- The admin panel will use the anon key for demo purposes (hardcoded credentials, no real auth).
- In production, you'd use Supabase Auth or a proper auth system for admin.
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  image text NOT NULL,
  category_id text NOT NULL,
  category_label text NOT NULL,
  category_blurb text NOT NULL,
  is_veg boolean DEFAULT true,
  tags text[] DEFAULT '{}'::text[],
  is_popular boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Allow public read (menu display)
DROP POLICY IF EXISTS "public_select_menu_items" ON menu_items;
CREATE POLICY "public_select_menu_items" ON menu_items FOR SELECT
TO anon, authenticated USING (true);

-- Allow authenticated to insert (admin panel)
DROP POLICY IF EXISTS "authenticated_insert_menu_items" ON menu_items;
CREATE POLICY "authenticated_insert_menu_items" ON menu_items FOR INSERT
TO authenticated WITH CHECK (true);

-- Allow authenticated to update (admin panel)
DROP POLICY IF EXISTS "authenticated_update_menu_items" ON menu_items;
CREATE POLICY "authenticated_update_menu_items" ON menu_items FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated to delete (admin panel)
DROP POLICY IF EXISTS "authenticated_delete_menu_items" ON menu_items;
CREATE POLICY "authenticated_delete_menu_items" ON menu_items FOR DELETE
TO authenticated USING (true);

-- Index for efficient category queries
CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON menu_items (category_id);
CREATE INDEX IF NOT EXISTS menu_items_sort_order_idx ON menu_items (category_id, sort_order);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS menu_items_updated_at ON menu_items;
CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
