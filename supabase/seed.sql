-- =============================================================
-- Como en Casa — Supabase schema + seed
-- Source of truth: src/lib/mock-data.ts
-- Idempotent: safe to run multiple times.
-- Paste into Supabase SQL Editor and run.
-- =============================================================


-- =============================================================
-- 1. TABLE: employees
-- Existing columns: id, name, short_name, role, phone,
--                   active, created_at
-- Adding all remaining Employee fields from mock-data.ts.
-- short_name is left untouched (may already have real values).
-- =============================================================

ALTER TABLE employees ADD COLUMN IF NOT EXISTS hired_at          DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS base_shift        TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS contract_type     TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS salary_base       TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS eps               TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS arl               TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS pension_fund      TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_phone   TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_relation TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS internal_notes    TEXT;

INSERT INTO employees (
  id, name, role, phone, active,
  hired_at, base_shift, contract_type, salary_base,
  eps, arl, pension_fund,
  emergency_contact, emergency_phone, emergency_relation,
  internal_notes
) VALUES
  ('lilina',  'Lilina',  'cocina',     '', true, '2026-01-01', 'Cocina',     'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('sandra',  'Sandra',  'cocina',     '', true, '2026-01-01', 'Cocina',     'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('valeria', 'Valeria', 'cocina',     '', true, '2026-01-01', 'Cocina',     'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('andrea',  'Andrea',  'estacion',   '', true, '2026-01-01', 'Estación',   'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('yamile',  'Yamile',  'estacion',   '', true, '2026-01-01', 'Estación',   'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('mildrey', 'Mildrey', 'estacion',   '', true, '2026-01-01', 'Estación',   'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('yeral',   'Yeral',   'reposteria', '', true, '2026-01-01', 'Repostería', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('huber',   'Huber',   'mesero',     '', true, '2026-01-01', 'Mesero',     'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.'),
  ('wilton',  'Wilton',  'mesero',     '', true, '2026-01-01', 'Mesero',     'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '', 'Pendiente', 'Tip eligible.')
ON CONFLICT (id) DO UPDATE SET
  name              = EXCLUDED.name,
  role              = EXCLUDED.role,
  phone             = EXCLUDED.phone,
  active            = EXCLUDED.active,
  hired_at          = EXCLUDED.hired_at,
  base_shift        = EXCLUDED.base_shift,
  contract_type     = EXCLUDED.contract_type,
  salary_base       = EXCLUDED.salary_base,
  eps               = EXCLUDED.eps,
  arl               = EXCLUDED.arl,
  pension_fund      = EXCLUDED.pension_fund,
  emergency_contact    = EXCLUDED.emergency_contact,
  emergency_phone      = EXCLUDED.emergency_phone,
  emergency_relation   = EXCLUDED.emergency_relation,
  internal_notes       = EXCLUDED.internal_notes;


-- =============================================================
-- 2. TABLE: inventory (88 items across 7 categories)
-- =============================================================

CREATE TABLE IF NOT EXISTS inventory (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  supplier      TEXT,
  unit          TEXT        NOT NULL,
  current_stock INTEGER     NOT NULL DEFAULT 0,
  ideal_stock   INTEGER     NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO inventory (id, name, category, supplier, unit, current_stock, ideal_stock) VALUES
-- Proteínas (21)
  ('carne-ahumada',                   'Carne ahumada',                   'Proteínas',           'Supermercado OR',      'un',      28, 40),
  ('carne-desmechada',                'Carne desmechada',                'Proteínas',           'Supermercado OR',      'un',      61, 70),
  ('carne-molida',                    'Carne molida',                    'Proteínas',           'Supermercado OR',      'un',      17, 30),
  ('pollo-corte-100-gr',              'Pollo corte 100 gr',              'Proteínas',           'Supermercado OR',      'un',      41, 50),
  ('pollo-corte-150-gr',              'Pollo corte 150 gr',              'Proteínas',           'Supermercado OR',      'un',      25, 35),
  ('carne-res-corte-mariposa-200-gr', 'Carne res corte mariposa 200 gr', 'Proteínas',           'Supermercado OR',      'un',       9, 20),
  ('chorizo-santarrosano',            'Chorizo santarrosano',            'Proteínas',           'Supermercado OR',      'un',      19, 30),
  ('carne-hamburguesa',               'Carne de hamburguesa',            'Proteínas',           'Supermercado OR',      'un',      23, 35),
  ('veggie',                          'Veggie',                          'Proteínas',           'Supermercado OR',      'un',       6, 12),
  ('salchicha-italiana',              'Salchicha italiana',              'Proteínas',           'Supermercado OR',      'un',      19, 30),
  ('salchicha-argentina',             'Salchicha argentina',             'Proteínas',           'Supermercado OR',      'un',      28, 35),
  ('salchicha-alemana',               'Salchicha alemana',               'Proteínas',           'Supermercado OR',      'un',      23, 30),
  ('salchicha-santarrosana',          'Salchicha santarrosana',          'Proteínas',           'Supermercado OR',      'un',      26, 35),
  ('punta-de-anca',                   'Punta de anca',                   'Proteínas',           'Supermercado OR',      'un',       9, 25),
  ('chuleta',                         'Chuleta',                         'Proteínas',           'Supermercado OR',      'un',      22, 30),
  ('churrasco',                       'Churrasco',                       'Proteínas',           'Supermercado OR',      'un',      33, 40),
  ('tocineta',                        'Tocineta',                        'Proteínas',           'Supermercado OR',      'un',       0,  0),
  ('salchicha-ranchera',              'Salchicha ranchera',              'Proteínas',           'Supermercado OR',      'un',       0,  0),
  ('cabano',                          'Cabano',                          'Proteínas',           'Supermercado OR',      'un',       0,  0),
  ('serrano',                         'Serrano',                         'Proteínas',           'Supermercado OR',      'un',       0,  0),
  ('huevos',                          'Huevos',                          'Proteínas',           'Supermercado OR',      'un',       0,  0),
-- Verduras y frutas (18)
  ('maracuya',                        'Maracuyá',                        'Verduras y frutas',   'Mario',                'un',       0,    0),
  ('arandanos',                       'Arándanos',                       'Verduras y frutas',   'Mario',                'g',     1000, 1500),
  ('cilantro',                        'Cilantro',                        'Verduras y frutas',   'Mario',                'g',      400, 1000),
  ('repollo-morado',                  'Repollo morado',                  'Verduras y frutas',   'Mario',                'un',       0,    0),
  ('fruta-del-dia',                   'Fruta del día',                   'Verduras y frutas',   'Mario',                'un',       0,    0),
  ('lechuga',                         'Lechuga',                         'Verduras y frutas',   'Mario',                'un',      10,   15),
  ('limones',                         'Limones',                         'Verduras y frutas',   'Mario',                'un',       0,    0),
  ('perejil',                         'Perejil',                         'Verduras y frutas',   'Mario',                'g',      200,  500),
  ('aji',                             'Ají',                             'Verduras y frutas',   'Mario',                'un',       0,    0),
  ('papas',                           'Papas',                           'Verduras y frutas',   'Mario',                'kg',       1,    5),
  ('pepinos',                         'Pepinos',                         'Verduras y frutas',   'Mario',                'un',       6,   10),
  ('pimenton',                        'Pimentón',                        'Verduras y frutas',   'Mario',                'un',       6,   10),
  ('pina',                            'Piña',                            'Verduras y frutas',   'Mario',                'un',       2,    4),
  ('tomate-chonto',                   'Tomate chonto',                   'Verduras y frutas',   'Mario',                'un',       5,   10),
  ('guacamole',                       'Guacamole',                       'Verduras y frutas',   'Mario',                'un',       0,    0),
  ('tomate-rinon',                    'Tomate riñón',                    'Verduras y frutas',   'Mario',                'un',      10,   15),
  ('cebolla-blanca',                  'Cebolla blanca',                  'Verduras y frutas',   'Mario',                'un',       5,   10),
  ('cebolla-rama',                    'Cebolla rama',                    'Verduras y frutas',   'Mario',                'g',      300,  600),
-- Lácteos (12)
  ('crema-agria',                     'Crema agria',                     'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('queso-bloque',                    'Queso bloque',                    'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('queso-cheddar',                   'Queso cheddar',                   'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('queso-tajado',                    'Queso tajado',                    'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('crema-de-leche',                  'Crema de leche',                  'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('leche',                           'Leche',                           'Lácteos',             'Sin proveedor',        'L',   0, 0),
  ('queso-parmesano',                 'Queso parmesano',                 'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('queso-crema',                     'Queso crema',                     'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('mozzarella',                      'Mozzarella',                      'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('helado-vainilla',                 'Helado de vainilla',              'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('helado-frutos-rojos',             'Helado de frutos rojos',          'Lácteos',             'Sin proveedor',        'un',  0, 0),
  ('mantequilla',                     'Mantequilla',                     'Lácteos',             'Sin proveedor',        'un',  0, 0),
-- Harinas y panadería (5)
  ('harina-de-trigo',                 'Harina de trigo',                 'Harinas y panadería', 'Sin proveedor',        'kg',      0, 0),
  ('pan-baguette',                    'Pan baguette',                    'Harinas y panadería', 'Sin proveedor',        'un',      0, 0),
  ('pan-tajado',                      'Pan tajado',                      'Harinas y panadería', 'Sin proveedor',        'paquete', 0, 0),
  ('tortillas-mexicanas',             'Tortillas mexicanas',             'Harinas y panadería', 'Sin proveedor',        'paquete', 0, 0),
  ('masa-pan-de-yuca',                'Masa pan de yuca',                'Harinas y panadería', 'Sin proveedor',        'paquete', 0, 0),
-- Abarrotes (15)
  ('aceite',                          'Aceite',                          'Abarrotes',           'Sin proveedor',        'L',       0, 0),
  ('especias',                        'Especias',                        'Abarrotes',           'Sin proveedor',        'un',      0, 0),
  ('sal-abarrotes',                   'Sal',                             'Abarrotes',           'Sin proveedor',        'g',       0, 0),
  ('ajo',                             'Ajo',                             'Abarrotes',           'Sin proveedor',        'un',      0, 0),
  ('canela',                          'Canela',                          'Abarrotes',           'Sin proveedor',        'g',       0, 0),
  ('brevas',                          'Brevas',                          'Abarrotes',           'Sin proveedor',        'un',      0, 0),
  ('nachos',                          'Nachos',                          'Abarrotes',           'Distribuidora La 50',  'kg',      0, 5),
  ('nibs-de-chocolate',               'Nibs de chocolate',               'Abarrotes',           'Sin proveedor',        'paquete', 0, 0),
  ('pasta',                           'Pasta',                           'Abarrotes',           'Sin proveedor',        'paquete', 0, 0),
  ('alonjoli',                        'Alonjolí',                        'Abarrotes',           'Sin proveedor',        'g',       0, 0),
  ('miel-de-maple',                   'Miel de maple',                   'Abarrotes',           'Sin proveedor',        'un',      0, 0),
  ('oregano',                         'Orégano',                         'Abarrotes',           'Sin proveedor',        'g',       0, 0),
  ('paprika',                         'Paprika',                         'Abarrotes',           'Sin proveedor',        'g',       0, 0),
  ('pimienta',                        'Pimienta',                        'Abarrotes',           'Sin proveedor',        'g',       0, 0),
  ('crema-de-avellanas',              'Crema de avellanas',              'Abarrotes',           'Sin proveedor',        'un',      0, 0),
-- Salsas y aderezos (10)
  ('salsa-de-tomate',                 'Salsa de tomate',                 'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('salsa-bbq',                       'Salsa BBQ',                       'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('salsa-de-humo',                   'Salsa de humo',                   'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('salsa-negra',                     'Salsa negra',                     'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('salsa-para-carnes',               'Salsa para carnes',               'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('salsa-soya',                      'Salsa soya',                      'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('sazonador-de-pollo',              'Sazonador de pollo',              'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('vinagre',                         'Vinagre',                         'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('mostaza',                         'Mostaza',                         'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
  ('topping-de-salsa',                'Topping de salsa',                'Salsas y aderezos',   'Sin proveedor',        'un',  0, 0),
-- Insumos y aseo (7)
  ('bolsas-transparentes-10x14',      'Bolsas transparentes 10x14',      'Insumos y aseo',      'Distribuidora La 50',  'paquete', 0, 0),
  ('bolsas-transparentes-6x8',        'Bolsas transparentes 6x8',        'Insumos y aseo',      'Distribuidora La 50',  'paquete', 0, 0),
  ('esponjas',                        'Esponjas',                        'Insumos y aseo',      'Sin proveedor',        'un',      0, 0),
  ('jabon-liquido',                   'Jabón líquido',                   'Insumos y aseo',      'Sin proveedor',        'un',      0, 0),
  ('desengrasante',                   'Desengrasante',                   'Insumos y aseo',      'Sin proveedor',        'un',      0, 0),
  ('hipoclorito',                     'Hipoclorito',                     'Insumos y aseo',      'Sin proveedor',        'un',      0, 0),
  ('papeles-de-hamburguesa',          'Papeles de hamburguesa',          'Insumos y aseo',      'Sin proveedor',        'paquete', 0, 0)
ON CONFLICT (id) DO UPDATE SET
  name          = EXCLUDED.name,
  category      = EXCLUDED.category,
  supplier      = EXCLUDED.supplier,
  unit          = EXCLUDED.unit,
  current_stock = EXCLUDED.current_stock,
  ideal_stock   = EXCLUDED.ideal_stock,
  updated_at    = NOW();


-- =============================================================
-- 3. TABLE: manual_shopping_items
-- Represents one-off purchase requests not tied to inventory.
-- =============================================================

CREATE TABLE IF NOT EXISTS manual_shopping_items (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL,
  quantity   NUMERIC     NOT NULL DEFAULT 1,
  unit       TEXT        NOT NULL,
  category   TEXT,
  status     TEXT        NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO manual_shopping_items (id, name, quantity, unit, category, status) VALUES
  ('manual-velas-cumpleanos', 'Velas de cumpleaños', 1, 'paq', 'Sin categoría', 'pendiente')
ON CONFLICT (id) DO UPDATE SET
  name     = EXCLUDED.name,
  quantity = EXCLUDED.quantity,
  unit     = EXCLUDED.unit,
  category = EXCLUDED.category,
  status   = EXCLUDED.status;


-- =============================================================
-- 4. TABLE: tip_weeks
-- Stores weekly tip totals, per-day amounts, per-employee
-- payment status, and daily work attendance.
--
-- daily_tips:  { "YYYY-MM-DD": amount_COP, ... }
-- payments:    { "employee_id": "pagado"|"pendiente", ... }
-- work_days:   [ { "date": "YYYY-MM-DD",
--                  "worked": { "employee_id": true|false, ... }
--                }, ... ]
--
-- work_days for the closed week (tips-2026-04-25) is stored as
-- [] because that schedule only exists in client.tsx, not in
-- mock-data.ts. Fill it in manually if needed.
-- =============================================================

CREATE TABLE IF NOT EXISTS tip_weeks (
  id         TEXT        PRIMARY KEY,
  label      TEXT        NOT NULL,
  start_date DATE        NOT NULL,
  end_date   DATE        NOT NULL,
  total_tips INTEGER     NOT NULL DEFAULT 0,
  daily_tips JSONB       NOT NULL DEFAULT '{}',
  payments   JSONB       NOT NULL DEFAULT '{}',
  work_days  JSONB       NOT NULL DEFAULT '[]',
  status     TEXT        NOT NULL DEFAULT 'abierta',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tip_weeks (id, label, start_date, end_date, total_tips, daily_tips, payments, work_days, status) VALUES
(
  'tips-2026-05-02',
  'Semana 2 al 8 de mayo',
  '2026-05-02',
  '2026-05-08',
  1280000,
  '{"2026-05-02":268000,"2026-05-03":162000,"2026-05-04":145000,"2026-05-05":158000,"2026-05-06":162000,"2026-05-07":175000,"2026-05-08":210000}',
  '{"lilina":"pendiente","sandra":"pendiente","valeria":"pendiente","andrea":"pendiente","yamile":"pendiente","mildrey":"pendiente","yeral":"pendiente","huber":"pendiente","wilton":"pendiente"}',
  '[{"date":"2026-05-02","worked":{"lilina":true,"sandra":true,"valeria":true,"andrea":true,"yamile":true,"mildrey":false,"yeral":true,"huber":true,"wilton":true}},{"date":"2026-05-03","worked":{"lilina":true,"sandra":false,"valeria":true,"andrea":true,"yamile":false,"mildrey":true,"yeral":true,"huber":true,"wilton":false}},{"date":"2026-05-04","worked":{"lilina":false,"sandra":true,"valeria":true,"andrea":true,"yamile":true,"mildrey":true,"yeral":false,"huber":true,"wilton":true}},{"date":"2026-05-05","worked":{"lilina":true,"sandra":true,"valeria":false,"andrea":false,"yamile":true,"mildrey":true,"yeral":true,"huber":true,"wilton":true}},{"date":"2026-05-06","worked":{"lilina":true,"sandra":true,"valeria":true,"andrea":true,"yamile":true,"mildrey":true,"yeral":true,"huber":false,"wilton":true}},{"date":"2026-05-07","worked":{"lilina":true,"sandra":true,"valeria":true,"andrea":true,"yamile":true,"mildrey":false,"yeral":true,"huber":true,"wilton":true}},{"date":"2026-05-08","worked":{"lilina":true,"sandra":false,"valeria":true,"andrea":true,"yamile":true,"mildrey":true,"yeral":false,"huber":true,"wilton":true}}]',
  'abierta'
),
(
  'tips-2026-04-25',
  'Semana 25 de abril al 1 de mayo',
  '2026-04-25',
  '2026-05-01',
  1165000,
  '{"2026-04-25":260000,"2026-04-26":152000,"2026-04-27":120000,"2026-04-28":135000,"2026-04-29":142000,"2026-04-30":151000,"2026-05-01":205000}',
  '{"lilina":"pagado","sandra":"pagado","valeria":"pagado","andrea":"pagado","yamile":"pagado","mildrey":"pagado","yeral":"pagado","huber":"pagado","wilton":"pagado"}',
  '[]',
  'cerrada'
)
ON CONFLICT (id) DO UPDATE SET
  label      = EXCLUDED.label,
  start_date = EXCLUDED.start_date,
  end_date   = EXCLUDED.end_date,
  total_tips = EXCLUDED.total_tips,
  daily_tips = EXCLUDED.daily_tips,
  payments   = EXCLUDED.payments,
  work_days  = EXCLUDED.work_days,
  status     = EXCLUDED.status;
