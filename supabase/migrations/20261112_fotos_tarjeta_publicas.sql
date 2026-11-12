-- =============================================================
-- Como en Casa — Foto de la tarjeta visible desde WhatsApp
-- Fecha: 2026-11-12 · Idempotente. Supabase → SQL Editor → Run.
--
-- wa.me solo permite texto: no se puede adjuntar la foto al mensaje.
-- Solución: el bucket de fotos de tarjeta pasa a ser público, y el
-- mensaje lleva el link a la foto. Lina la abre desde el chat, sin
-- entrar al admin.
--
-- Seguridad: cada archivo se llama con un UUID aleatorio
-- (ej. 3f9c…e1.jpg), imposible de adivinar. "Público" significa que
-- quien tenga el link exacto puede verla; nadie puede LISTAR el bucket
-- (no hay policy de SELECT para el público). Los comprobantes de pago
-- (payment-proofs) siguen privados.
-- =============================================================

UPDATE storage.buckets SET public = true WHERE id = 'reservation-photos';
