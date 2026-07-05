/*
# Create reservations table for Spice Garden table bookings

1. New Tables
- `reservations`
  - `id` (uuid, primary key)
  - `name` (text, not null) — guest's full name
  - `email` (text, not null) — guest contact email
  - `phone` (text, not null) — guest phone number
  - `guests` (integer, not null, default 2) — party size
  - `reservation_date` (date, not null) — date of booking
  - `reservation_time` (time, not null) — time of booking
  - `message` (text, nullable) — optional special requests
  - `status` (text, not null, default 'pending') — pending / confirmed / cancelled
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `reservations`.
- This is a no-auth public booking form, so anon + authenticated can INSERT new reservations.
- SELECT/UPDATE/DELETE are restricted to authenticated staff only (no public read of bookings, to protect guest PII).

3. Notes
- The booking form on the website submits as the anon-key client, so the INSERT policy MUST include `anon`.
- Guests cannot list or read other bookings — only staff (authenticated) can.
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  guests integer NOT NULL DEFAULT 2 CHECK (guests > 0 AND guests <= 20),
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to create a reservation
DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "anon_insert_reservations" ON reservations FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Only authenticated staff can view reservations (protects guest PII)
DROP POLICY IF EXISTS "staff_select_reservations" ON reservations;
CREATE POLICY "staff_select_reservations" ON reservations FOR SELECT
TO authenticated USING (true);

-- Only authenticated staff can update reservation status
DROP POLICY IF EXISTS "staff_update_reservations" ON reservations;
CREATE POLICY "staff_update_reservations" ON reservations FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated staff can delete reservations
DROP POLICY IF EXISTS "staff_delete_reservations" ON reservations;
CREATE POLICY "staff_delete_reservations" ON reservations FOR DELETE
TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS reservations_reservation_date_idx ON reservations (reservation_date);
CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations (status);
