-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 011 : SOURCES DU TRAFIC                               ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 009. Idempotente.                                       ║
-- ║  Chaque vue d'annonce garde sa provenance (WhatsApp, QR code, e-mail,     ║
-- ║  Facebook, moteur de recherche, direct…), normalisée par le serveur.      ║
-- ║  Aucune adresse IP, aucune URL complète : une étiquette courte.           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

alter table public.property_events add column if not exists source text;

alter table public.property_events drop constraint if exists property_events_source_check;
alter table public.property_events add constraint property_events_source_check
  check (source is null or source ~ '^[a-z-]{1,20}$');
