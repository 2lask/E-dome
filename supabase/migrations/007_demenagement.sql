-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 007 : SERVICES DU DÉMÉNAGEMENT (conciergerie)         ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  Idempotente. Une personne qui remet son bail ou trouve un logement a     ║
-- ║  besoin, au même moment, d'un nettoyage de fin de bail, d'un              ║
-- ║  déménageur, d'un débarras. Elle décrit son besoin UNE fois ; E-Dome      ║
-- ║  transmet à des artisans choisis (au plus trois), avec son accord.        ║
-- ║                                                                           ║
-- ║  Phase pilote : la transmission est faite par l'équipe (conciergerie),   ║
-- ║  ce qui mesure la demande réelle avant d'ouvrir un espace artisans.       ║
-- ║  Écriture : uniquement côté serveur (clé de service). Lecture : la        ║
-- ║  personne connectée voit SES demandes ; l'administration voit tout.      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.move_requests (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid references public.profiles (id) on delete set null,
  name          text not null,
  email         text,
  phone         text,
  from_city     text not null,
  to_city       text not null default '',
  move_date     date,
  rooms         numeric,
  services      text[] not null
                check (cardinality(services) > 0
                   and services <@ array['nettoyage', 'demenagement', 'debarras', 'peinture', 'garde-meubles']),
  details       text not null default '',
  consent       boolean not null check (consent),
  status        text not null default 'nouvelle'
                check (status in ('nouvelle', 'transmise', 'devis', 'realisee', 'annulee')),
  admin_note    text not null default '',
  property_id   uuid references public.properties (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (email is not null or phone is not null)
);
create index if not exists move_requests_status_idx on public.move_requests (status, created_at desc);
alter table public.move_requests enable row level security;

drop policy if exists "move_requests_select_own" on public.move_requests;
create policy "move_requests_select_own" on public.move_requests
  for select using (auth.uid() is not null and auth.uid() = requester_id);
-- Aucune politique d'écriture : insertions et suivi passent par le serveur.

drop trigger if exists touch_move_requests on public.move_requests;
create trigger touch_move_requests before update on public.move_requests
  for each row execute function public.touch_updated_at();
