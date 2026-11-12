-- =============================================================
-- Como en Casa — Momentos: nuevo momento + orden de venta
-- Fecha: 2026-11-12 · Idempotente. Pegar en Supabase → SQL Editor → Run.
-- Textos, precios y fotos viven en src/lib/package-details.ts;
-- aquí solo se registra el momento (para que las reservas tengan package_id)
-- y el orden en que aparecen.
-- =============================================================

INSERT INTO celebration_packages (slug, name, description, position, active)
VALUES (
  'momento-felicidad-con-torta',
  'Momento de felicidad con torta',
  'Escoge tu torta del catálogo y nosotros preparamos la mesa.',
  7,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Orden: de la opción más accesible a la más completa.
UPDATE celebration_packages SET position = 1 WHERE slug = 'momento-de-celebracion';
UPDATE celebration_packages SET position = 2 WHERE slug = 'momento-con-minicake';
UPDATE celebration_packages SET position = 3 WHERE slug = 'pinta-tu-torta';
UPDATE celebration_packages SET position = 4 WHERE slug = 'torta-de-corazon';
UPDATE celebration_packages SET position = 5 WHERE slug = 'aniversario-corazon';
UPDATE celebration_packages SET position = 6 WHERE slug = 'momento-como-en-casa';
UPDATE celebration_packages SET position = 7 WHERE slug = 'momento-felicidad-con-torta';
UPDATE celebration_packages SET position = 8 WHERE slug = 'momento-de-felicidad';
