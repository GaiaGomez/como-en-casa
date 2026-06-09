-- =============================================================
-- Como en Casa — Reservas schema
-- Run in Supabase SQL Editor after seed.sql
-- Idempotent: safe to run multiple times.
-- =============================================================


-- ─── Enums ───────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE reservation_status AS ENUM (
    'new', 'reviewing', 'confirmed', 'preparing', 'completed', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending', 'proof_sent', 'verified', 'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ─── celebration_packages ────────────────────────────────────

CREATE TABLE IF NOT EXISTS celebration_packages (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  position    int         NOT NULL DEFAULT 0,
  active      boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── reservations ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reservations (
  id                  uuid               PRIMARY KEY DEFAULT gen_random_uuid(),
  -- package reference (denormalized name preserved if package is deleted)
  package_id          uuid               REFERENCES celebration_packages(id) ON DELETE SET NULL,
  package_name        text               NOT NULL,
  -- event details
  event_date          date               NOT NULL,
  event_time          time               NOT NULL,
  guest_count         int                NOT NULL DEFAULT 1,
  -- client info
  client_name         text               NOT NULL,
  client_whatsapp     text               NOT NULL,
  -- optional guest info
  honoree_name        text,
  occasion            text,
  card_message        text,
  decoration_color    text,
  -- file storage paths (private buckets, never public URLs)
  card_photo_path     text,
  payment_proof_path  text,
  observations        text,
  -- selected variant (label + price chosen by customer at time of reservation)
  selected_variant_label text,
  selected_variant_price text,
  -- admin-only fields
  assigned_zone       text,
  internal_notes      text,
  -- status
  reservation_status  reservation_status NOT NULL DEFAULT 'new',
  payment_status      payment_status     NOT NULL DEFAULT 'pending',
  created_at          timestamptz        NOT NULL DEFAULT now()
);


-- ─── RLS: celebration_packages ───────────────────────────────

ALTER TABLE celebration_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "packages_public_select" ON celebration_packages;
CREATE POLICY "packages_public_select" ON celebration_packages
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "packages_admin_all" ON celebration_packages;
CREATE POLICY "packages_admin_all" ON celebration_packages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─── RLS: reservations ───────────────────────────────────────

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public: insert only (no reads, no updates, no deletes)
DROP POLICY IF EXISTS "reservations_public_insert" ON reservations;
CREATE POLICY "reservations_public_insert" ON reservations
  FOR INSERT WITH CHECK (true);

-- Admin: read
DROP POLICY IF EXISTS "reservations_admin_select" ON reservations;
CREATE POLICY "reservations_admin_select" ON reservations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: update (no delete for safety)
DROP POLICY IF EXISTS "reservations_admin_update" ON reservations;
CREATE POLICY "reservations_admin_update" ON reservations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─── Storage buckets ─────────────────────────────────────────
-- Both buckets are private (public = false).
-- card photos: public form can upload, admin can preview via signed URL.
-- payment proofs: public form can upload, admin only via signed URL.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'reservation-photos',
    'reservation-photos',
    false,
    10485760,
    ARRAY['image/jpeg','image/png','image/webp','image/heic','image/heif']
  ),
  (
    'payment-proofs',
    'payment-proofs',
    false,
    10485760,
    ARRAY['image/jpeg','image/png','image/webp','application/pdf']
  )
ON CONFLICT (id) DO NOTHING;


-- ─── Storage policies: reservation-photos ────────────────────

DROP POLICY IF EXISTS "reservation_photos_insert" ON storage.objects;
CREATE POLICY "reservation_photos_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reservation-photos');

DROP POLICY IF EXISTS "reservation_photos_admin_select" ON storage.objects;
CREATE POLICY "reservation_photos_admin_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reservation-photos'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─── Storage policies: payment-proofs ────────────────────────

DROP POLICY IF EXISTS "payment_proofs_insert" ON storage.objects;
CREATE POLICY "payment_proofs_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "payment_proofs_admin_select" ON storage.objects;
CREATE POLICY "payment_proofs_admin_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─── Seed: celebration_packages ──────────────────────────────

INSERT INTO celebration_packages (slug, name, description, position, active) VALUES
  ('momento-de-celebracion', 'Momento de celebración',  'El momento perfecto para celebrar juntos.',                     1, true),
  ('momento-de-felicidad',   'Momento de felicidad',    'Regala una experiencia llena de amor.',                         2, true),
  ('momento-con-minicake',   'Momento con minicake',    'Una celebración dulce con minicake incluido.',                  3, true),
  ('momento-como-en-casa',   'Momento Como en Casa',    'Nuestra experiencia más completa y especial.',                  4, true),
  ('torta-de-corazon',       'Torta de corazón',        'Una torta en forma de corazón para los que amas.',              5, true),
  ('aniversario-corazon',    'Aniversario corazón',     'Celebra tu amor con una experiencia única.',                    6, true),
  ('pinta-tu-torta',         'Pinta tu torta',          'Una actividad especial: personaliza y decora tu propia torta.', 7, true)
ON CONFLICT (slug) DO NOTHING;


-- ─── Migration: run once on existing databases ───────────────
-- ALTER TABLE reservations
--   ADD COLUMN IF NOT EXISTS selected_variant_label text,
--   ADD COLUMN IF NOT EXISTS selected_variant_price  text;
