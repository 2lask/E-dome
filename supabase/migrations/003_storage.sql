-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 003 : stockage des photos des biens                   ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  Bucket PUBLIC en lecture (les photos d'une annonce sont publiques).      ║
-- ║  AUCUNE politique d'écriture : les envois passent par des URL signées     ║
-- ║  émises côté serveur (`storage-actions.ts`), après vérification de        ║
-- ║  l'identité, dans le dossier `<id utilisateur>/`. Idempotente.            ║
-- ║                                                                          ║
-- ║  Déjà créé sur le projet actuel (2026-11-18, via l'API de stockage) ;     ║
-- ║  ce fichier sert à reproduire un nouvel environnement.                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  8388608,                                   -- 8 Mo
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
