-- =============================================================
-- Como en Casa Admin — Persistencia de Equipo, Horario y Propinas
-- Fecha: 2026-11-12
-- Idempotente: se puede correr varias veces sin romper nada.
-- Pegar en Supabase → SQL Editor → Run. CORRER ANTES de desplegar
-- el código nuevo (el código lee estas columnas).
-- =============================================================

-- -------------------------------------------------------------
-- 1. Columnas que el formulario de empleado pedía pero no existían
-- -------------------------------------------------------------
ALTER TABLE employees ADD COLUMN IF NOT EXISTS document_id TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS birth_date  DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS address     TEXT;

-- status = estado laboral (activo / descanso / inactivo).
-- active  = solo para "eliminar" (soft delete). Antes se mezclaban:
-- poner a alguien en "descanso" lo marcaba active=false y desaparecía.
ALTER TABLE employees ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'activo';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'employees_status_check'
  ) THEN
    ALTER TABLE employees
      ADD CONSTRAINT employees_status_check
      CHECK (status IN ('activo', 'descanso', 'inactivo'));
  END IF;
END $$;

-- -------------------------------------------------------------
-- 2. Helper: ¿el usuario logueado es admin?
-- SECURITY DEFINER = corre con permisos del dueño de la función,
-- así la policy puede leer profiles sin chocar con el RLS de profiles.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- -------------------------------------------------------------
-- 3. Policies: cualquier usuario logueado LEE; solo admin ESCRIBE.
-- Las policies en Postgres son permisivas (se suman con OR), así que
-- estas no rompen las que ya existan; solo garantizan el mínimo.
-- Un upsert necesita INSERT + UPDATE (+ SELECT si hace .select()).
-- -------------------------------------------------------------
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['employees','tip_weeks','tip_daily_amounts','work_schedule','tip_payments']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_auth_select', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT TO authenticated USING (true)', t || '_auth_select', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_insert', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR INSERT TO authenticated WITH CHECK (public.is_admin())', t || '_admin_insert', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin_update', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t || '_admin_update', t);
  END LOOP;
END $$;

-- -------------------------------------------------------------
-- 4. Diagnóstico (opcional): ver qué policies quedaron
-- -------------------------------------------------------------
-- SELECT tablename, policyname, cmd, roles
-- FROM pg_policies
-- WHERE tablename IN ('employees','tip_weeks','tip_daily_amounts','work_schedule','tip_payments')
-- ORDER BY tablename, cmd;
