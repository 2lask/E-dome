-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 005 : DOSSIER DE LOCATION RÉUTILISABLE                ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 002. Idempotente.                                       ║
-- ║  Le locataire remplit son dossier UNE fois (situation, revenu, pièces :   ║
-- ║  poursuites, salaires, identité, RC) et le joint en un clic à une demande.║
-- ║  Données sensibles :                                                      ║
-- ║   · tables lisibles par leur seul titulaire (RLS) ;                       ║
-- ║   · fichiers dans un bucket PRIVÉ, servis par URL signée de courte durée ;║
-- ║   · partage par jeton, limité à UNE demande, expirant (30 jours),         ║
-- ║     révocable ; la lecture par le destinataire passe par le serveur.      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.rental_dossiers (
  user_id         uuid primary key references public.profiles (id) on delete cascade,
  situation       text not null default '',          -- salarie | independant | etudiant | retraite | autre
  employer        text not null default '',
  monthly_income  numeric,
  occupants       int not null default 1,
  children        int not null default 0,
  pets            boolean not null default false,
  smoker          boolean not null default false,
  permit          text not null default '',          -- suisse | C | B | L | G | autre
  intro           text not null default '',
  updated_at      timestamptz not null default now()
);
alter table public.rental_dossiers enable row level security;
drop policy if exists "dossier_own" on public.rental_dossiers;
create policy "dossier_own" on public.rental_dossiers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop trigger if exists touch_rental_dossiers on public.rental_dossiers;
create trigger touch_rental_dossiers before update on public.rental_dossiers
  for each row execute function public.touch_updated_at();

create table if not exists public.dossier_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        text not null check (kind in ('poursuites', 'salaire', 'identite', 'assurance_rc', 'autre')),
  path        text not null,                        -- chemin dans le bucket privé `dossiers`
  name        text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists dossier_documents_user_idx on public.dossier_documents (user_id);
alter table public.dossier_documents enable row level security;
drop policy if exists "dossier_docs_own" on public.dossier_documents;
create policy "dossier_docs_own" on public.dossier_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Partage : un jeton par demande, lisible par son titulaire ; le destinataire
-- y accède via le serveur (clé de service) après vérification du jeton.
create table if not exists public.dossier_shares (
  token       text primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  property_id uuid references public.properties (id) on delete cascade,
  expires_at  timestamptz not null default (now() + interval '30 days'),
  revoked     boolean not null default false,
  views       int not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.dossier_shares enable row level security;
drop policy if exists "dossier_shares_own" on public.dossier_shares;
create policy "dossier_shares_own" on public.dossier_shares
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- La demande garde le jeton du dossier joint (le vendeur voit « Dossier joint »).
alter table public.inquiries add column if not exists dossier_token text references public.dossier_shares (token) on delete set null;

-- Bucket PRIVÉ (aucune lecture publique ; URL signées émises par le serveur).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dossiers', 'dossiers', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
