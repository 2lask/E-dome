-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — TOUTES LES MIGRATIONS EN UN SEUL FICHIER                        ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  1. Supabase → SQL Editor → New query                                     ║
-- ║  2. Coller TOUT ce fichier → Run                                          ║
-- ║  3. Vérifier : npm run db:check                                           ║
-- ║  Idempotent : peut être rejoué sans risque. Fichier GÉNÉRÉ par            ║
-- ║  scripts/build-migrations.mjs — modifier les migrations, pas ce fichier.  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Contenu : 002_demandes.sql, 003_storage.sql, 004_recherches.sql, 005_dossier.sql, 006_agences.sql, 007_demenagement.sql, 008_reglements.sql, 009_apport.sql, 010_parcours_vente.sql

-- ════════ 002_demandes.sql ════════
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 002 : les DEMANDES et la mise en relation sécurisée  ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter UNE fois dans Supabase → SQL Editor → New query → Run,       ║
-- ║  après `schema.sql`. Idempotente : réexécutable sans casse.              ║
-- ║  Voir REBUILD.md §3.4.                                                   ║
-- ║                                                                          ║
-- ║  1. CORRIGE une faille : un apporteur pouvait passer lui-même sa mise    ║
-- ║     en relation en « acceptée » (la prime devenait due sans le vendeur). ║
-- ║  2. Mise en relation honnête : description anonyme → le vendeur accepte  ║
-- ║     (prime due, montant FIGÉ) → les coordonnées sont révélées.           ║
-- ║  3. DEMANDES : une boîte unique (contact, visite, apport) avec un        ║
-- ║     historique horodaté — la preuve de « qui a amené qui, quand ».       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 1. INTRODUCTIONS — droits resserrés, montant figé, décision horodatée     │
-- ╰──────────────────────────────────────────────────────────────────────────╯
alter table public.introductions add column if not exists amount_chf    numeric;
alter table public.introductions add column if not exists property_id   uuid references public.properties (id) on delete cascade;
alter table public.introductions add column if not exists decided_at    timestamptz;

-- L'ancienne politique « tout participant peut tout faire » est retirée.
drop policy if exists "introductions_participants" on public.introductions;

drop policy if exists "introductions_select_participants" on public.introductions;
create policy "introductions_select_participants" on public.introductions
  for select using (auth.uid() in (apporteur_id, seller_id));

-- L'apporteur crée une mise en relation PROPOSÉE, sur une prime ACTIVE d'un
-- autre que lui.
drop policy if exists "introductions_insert_apporteur" on public.introductions;
create policy "introductions_insert_apporteur" on public.introductions
  for insert with check (
    auth.uid() = apporteur_id
    and status = 'proposee'
    and apporteur_id <> seller_id
    and exists (
      select 1 from public.primes p
      where p.id = prime_id and p.seller_id = introductions.seller_id and p.active
    )
  );

-- Seul le VENDEUR décide.
drop policy if exists "introductions_update_seller" on public.introductions;
create policy "introductions_update_seller" on public.introductions
  for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

-- À la création : on FIGE le montant de la prime et le bien (une prime
-- modifiée plus tard ne change pas ce qui était promis).
create or replace function public.snapshot_introduction()
returns trigger language plpgsql security definer set search_path = public as $$
declare p record;
begin
  select amount_chf, property_id into p from public.primes where id = new.prime_id;
  new.amount_chf  := p.amount_chf;
  new.property_id := p.property_id;
  new.decided_at  := null;
  return new;
end $$;

drop trigger if exists snapshot_introduction on public.introductions;
create trigger snapshot_introduction before insert on public.introductions
  for each row execute function public.snapshot_introduction();

-- À la mise à jour : seuls le statut et sa date bougent ; une décision est
-- définitive (« contestée » réservée à l'administration, clé de service).
create or replace function public.guard_introduction_update()
returns trigger language plpgsql as $$
begin
  if new.prime_id is distinct from old.prime_id
     or new.apporteur_id is distinct from old.apporteur_id
     or new.seller_id is distinct from old.seller_id
     or new.contact_label is distinct from old.contact_label
     or new.amount_chf is distinct from old.amount_chf
     or new.property_id is distinct from old.property_id
     or new.created_at is distinct from old.created_at then
    raise exception 'introduction : champ immuable';
  end if;
  if new.status not in ('proposee', 'acceptee', 'refusee', 'contestee') then
    raise exception 'introduction : statut invalide';
  end if;
  if new.status is distinct from old.status then
    if old.status <> 'proposee' and coalesce(auth.role(), '') <> 'service_role' then
      raise exception 'introduction : décision déjà prise';
    end if;
    if new.status = 'contestee' and coalesce(auth.role(), '') <> 'service_role' then
      raise exception 'introduction : contestation réservée à l''administration';
    end if;
    new.decided_at := now();
  end if;
  return new;
end $$;

drop trigger if exists guard_introduction_update on public.introductions;
create trigger guard_introduction_update before update on public.introductions
  for each row execute function public.guard_introduction_update();

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 2. COORDONNÉES APPORTÉES — révélées au vendeur APRÈS acceptation          │
-- ╰──────────────────────────────────────────────────────────────────────────╯
-- Séparées de `introductions` : la RLS est par ligne, pas par colonne. Ainsi
-- un vendeur ne peut PAS lire les coordonnées avant d'avoir accepté (pas de
-- contournement de l'apporteur), même en interrogeant l'API directement.
create table if not exists public.introduction_contacts (
  introduction_id   uuid primary key references public.introductions (id) on delete cascade,
  contact_name      text not null,
  contact_email     text,
  contact_phone     text,
  -- La personne apportée a accepté d'être mise en relation (nLPD).
  consent_confirmed boolean not null default false,
  created_at        timestamptz not null default now(),
  check (contact_email is not null or contact_phone is not null)
);
alter table public.introduction_contacts enable row level security;

drop policy if exists "intro_contacts_select" on public.introduction_contacts;
create policy "intro_contacts_select" on public.introduction_contacts
  for select using (
    exists (
      select 1 from public.introductions i
      where i.id = introduction_id
        and (
          i.apporteur_id = auth.uid()
          or (i.seller_id = auth.uid() and i.status = 'acceptee')
        )
    )
  );

drop policy if exists "intro_contacts_insert_apporteur" on public.introduction_contacts;
create policy "intro_contacts_insert_apporteur" on public.introduction_contacts
  for insert with check (
    consent_confirmed
    and exists (
      select 1 from public.introductions i
      where i.id = introduction_id and i.apporteur_id = auth.uid() and i.status = 'proposee'
    )
  );

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 3. DEMANDES — une boîte unique, un pipeline, un historique                │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.inquiries (
  id               uuid primary key default gen_random_uuid(),
  property_id      uuid not null references public.properties (id) on delete cascade,
  seller_id        uuid not null references public.profiles (id) on delete cascade,
  -- La personne qui écrit, si elle a un compte (sinon visiteur).
  sender_id        uuid references public.profiles (id) on delete set null,
  sender_name      text not null,
  sender_email     text,
  sender_phone     text,
  kind             text not null check (kind in ('contact', 'visite', 'apport')),
  message          text not null default '',
  preferred_date   date,
  status           text not null default 'nouvelle'
                   check (status in ('nouvelle', 'en-cours', 'visite', 'offre', 'conclue', 'fermee')),
  -- Si la demande vient d'une mise en relation acceptée.
  introduction_id  uuid unique references public.introductions (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (sender_email is not null or sender_phone is not null)
);
create index if not exists inquiries_seller_idx on public.inquiries (seller_id, created_at desc);
create index if not exists inquiries_sender_idx on public.inquiries (sender_id);

alter table public.inquiries enable row level security;

-- Lecture : le vendeur, et l'expéditeur s'il a un compte.
drop policy if exists "inquiries_select_parties" on public.inquiries;
create policy "inquiries_select_parties" on public.inquiries
  for select using (auth.uid() = seller_id or auth.uid() = sender_id);

-- Mise à jour (statut) : le vendeur seulement.
drop policy if exists "inquiries_update_seller" on public.inquiries;
create policy "inquiries_update_seller" on public.inquiries
  for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

-- AUCUNE politique d'insertion : une demande naît côté serveur (action
-- validée, vendeur déduit du bien, clé de service) — jamais d'un client qui
-- choisirait lui-même le destinataire.

drop trigger if exists touch_inquiries on public.inquiries;
create trigger touch_inquiries before update on public.inquiries
  for each row execute function public.touch_updated_at();

-- Historique horodaté (création, changements de statut, notes).
create table if not exists public.inquiry_events (
  id          uuid primary key default gen_random_uuid(),
  inquiry_id  uuid not null references public.inquiries (id) on delete cascade,
  actor_id    uuid references public.profiles (id) on delete set null,
  kind        text not null check (kind in ('creee', 'statut', 'note')),
  data        jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists inquiry_events_idx on public.inquiry_events (inquiry_id, created_at);

alter table public.inquiry_events enable row level security;

drop policy if exists "inquiry_events_select_parties" on public.inquiry_events;
create policy "inquiry_events_select_parties" on public.inquiry_events
  for select using (
    exists (
      select 1 from public.inquiries q
      where q.id = inquiry_id and auth.uid() in (q.seller_id, q.sender_id)
    )
  );
-- Écriture : serveur uniquement (clé de service), comme `transactions`.

-- Chaque changement de statut d'une demande est journalisé automatiquement.
create or replace function public.log_inquiry_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into public.inquiry_events (inquiry_id, actor_id, kind, data)
    values (new.id, auth.uid(), 'statut', jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  return new;
end $$;

drop trigger if exists log_inquiry_status on public.inquiries;
create trigger log_inquiry_status after update on public.inquiries
  for each row execute function public.log_inquiry_status();

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  FIN. Vérification : Table Editor → `inquiries`, `inquiry_events`,        ║
-- ║  `introduction_contacts` doivent apparaître.                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ════════ 003_storage.sql ════════
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

-- ════════ 004_recherches.sql ════════
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 004 : RECHERCHES À RÉCOMPENSE                         ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 002. Idempotente.                                       ║
-- ║  Le côté DEMANDE du moteur de récompenses :                               ║
-- ║   · un chercheur de logement (location ou achat) ou une agence qui        ║
-- ║     cherche des vendeurs publie ce qu'il cherche + une récompense fixe ;  ║
-- ║   · n'importe qui propose (un logement, un vendeur) ;                     ║
-- ║   · l'auteur accepte (récompense due, montant FIGÉ) ou refuse (rien dû) ; ║
-- ║   · les coordonnées d'un tiers ne sont révélées qu'après acceptation.     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── 1. Les recherches ───────────────────────────────────────────────────────
create table if not exists public.searches (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles (id) on delete cascade,
  -- logement : je cherche où habiter · vendeurs : je cherche des propriétaires vendeurs
  kind          text not null check (kind in ('logement', 'vendeurs')),
  transaction   text not null default 'location' check (transaction in ('location', 'achat')),
  city          text not null,
  area          text not null default '',
  rooms_min     numeric,
  budget_max    numeric,
  needed_by     date,
  description   text not null default '',
  reward_chf    numeric not null check (reward_chf between 50 and 3000),
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists searches_city_idx on public.searches (city);
create index if not exists searches_author_idx on public.searches (author_id);
alter table public.searches enable row level security;

drop policy if exists "searches_read_active" on public.searches;
create policy "searches_read_active" on public.searches
  for select using (active or auth.uid() = author_id);
drop policy if exists "searches_write_own" on public.searches;
create policy "searches_write_own" on public.searches
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

drop trigger if exists touch_searches on public.searches;
create trigger touch_searches before update on public.searches
  for each row execute function public.touch_updated_at();

-- ── 2. Les propositions ─────────────────────────────────────────────────────
create table if not exists public.search_answers (
  id            uuid primary key default gen_random_uuid(),
  search_id     uuid not null references public.searches (id) on delete cascade,
  author_id     uuid not null references public.profiles (id) on delete cascade, -- qui propose
  searcher_id   uuid references public.profiles (id) on delete cascade,          -- figé
  pitch         text not null,
  property_id   uuid references public.properties (id) on delete set null,       -- annonce E-Dome éventuelle
  reward_chf    numeric,                                                          -- figé
  status        text not null default 'proposee'
                check (status in ('proposee', 'acceptee', 'refusee', 'contestee')),
  decided_at    timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists search_answers_search_idx on public.search_answers (search_id);
alter table public.search_answers enable row level security;

drop policy if exists "answers_select_parties" on public.search_answers;
create policy "answers_select_parties" on public.search_answers
  for select using (auth.uid() in (author_id, searcher_id));

drop policy if exists "answers_insert_author" on public.search_answers;
create policy "answers_insert_author" on public.search_answers
  for insert with check (
    auth.uid() = author_id
    and status = 'proposee'
    and exists (
      select 1 from public.searches s
      where s.id = search_id and s.active and s.author_id <> auth.uid()
    )
  );

drop policy if exists "answers_update_searcher" on public.search_answers;
create policy "answers_update_searcher" on public.search_answers
  for update using (auth.uid() = searcher_id) with check (auth.uid() = searcher_id);

create or replace function public.snapshot_search_answer()
returns trigger language plpgsql security definer set search_path = public as $$
declare s record;
begin
  select author_id, reward_chf into s from public.searches where id = new.search_id;
  new.searcher_id := s.author_id;
  new.reward_chf  := s.reward_chf;
  new.decided_at  := null;
  return new;
end $$;
drop trigger if exists snapshot_search_answer on public.search_answers;
create trigger snapshot_search_answer before insert on public.search_answers
  for each row execute function public.snapshot_search_answer();

create or replace function public.guard_search_answer_update()
returns trigger language plpgsql as $$
begin
  if new.search_id is distinct from old.search_id
     or new.author_id is distinct from old.author_id
     or new.searcher_id is distinct from old.searcher_id
     or new.pitch is distinct from old.pitch
     or new.reward_chf is distinct from old.reward_chf
     or new.created_at is distinct from old.created_at then
    raise exception 'proposition : champ immuable';
  end if;
  if new.status is distinct from old.status then
    if old.status <> 'proposee' and coalesce(auth.role(), '') <> 'service_role' then
      raise exception 'proposition : décision déjà prise';
    end if;
    if new.status = 'contestee' and coalesce(auth.role(), '') <> 'service_role' then
      raise exception 'proposition : contestation réservée à l''administration';
    end if;
    new.decided_at := now();
  end if;
  return new;
end $$;
drop trigger if exists guard_search_answer_update on public.search_answers;
create trigger guard_search_answer_update before update on public.search_answers
  for each row execute function public.guard_search_answer_update();

-- ── 3. Coordonnées d'un tiers : révélées APRÈS acceptation ──────────────────
create table if not exists public.search_answer_contacts (
  answer_id         uuid primary key references public.search_answers (id) on delete cascade,
  contact_name      text not null,
  contact_email     text,
  contact_phone     text,
  consent_confirmed boolean not null default false,
  created_at        timestamptz not null default now(),
  check (contact_email is not null or contact_phone is not null)
);
alter table public.search_answer_contacts enable row level security;

drop policy if exists "answer_contacts_select" on public.search_answer_contacts;
create policy "answer_contacts_select" on public.search_answer_contacts
  for select using (
    exists (
      select 1 from public.search_answers a
      where a.id = answer_id
        and (a.author_id = auth.uid() or (a.searcher_id = auth.uid() and a.status = 'acceptee'))
    )
  );
drop policy if exists "answer_contacts_insert" on public.search_answer_contacts;
create policy "answer_contacts_insert" on public.search_answer_contacts
  for insert with check (
    consent_confirmed
    and exists (
      select 1 from public.search_answers a
      where a.id = answer_id and a.author_id = auth.uid() and a.status = 'proposee'
    )
  );

-- ════════ 005_dossier.sql ════════
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

-- ════════ 006_agences.sql ════════
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 006 : ESPACE AGENCE (programme d'apporteurs)          ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 004. Idempotente.                                       ║
-- ║  Les agences paient déjà des apporteurs, chacune avec son programme       ║
-- ║  maison. E-Dome leur donne un programme clé en main :                     ║
-- ║   · une page publique à leur nom (/agences/<adresse>) ;                   ║
-- ║   · leurs recherches de vendeurs à récompense (table searches, 004) ;     ║
-- ║   · leurs biens avec prime (properties + primes) ;                        ║
-- ║   · le suivi des recommandations (search_answers, introductions).         ║
-- ║  Le badge « vérifiée » et la formule ne se modifient que par E-Dome       ║
-- ║  (clé de service) : une agence ne peut pas se déclarer vérifiée.          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.agencies (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null unique references public.profiles (id) on delete cascade,
  slug          text not null unique
                check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  name          text not null check (char_length(name) between 2 and 80),
  city          text not null,
  zone          text not null default '',          -- communes couvertes
  description   text not null default '',
  website       text,
  phone         text,
  public_email  text,
  uid_number    text,                               -- numéro IDE déclaré (CHE-…)
  verified      boolean not null default false,     -- contrôlé par E-Dome
  plan          text not null default 'pilote' check (plan in ('pilote', 'pro')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists agencies_city_idx on public.agencies (city);
alter table public.agencies enable row level security;

drop policy if exists "agencies_read_all" on public.agencies;
create policy "agencies_read_all" on public.agencies for select using (true);

drop policy if exists "agencies_insert_own" on public.agencies;
create policy "agencies_insert_own" on public.agencies
  for insert with check (auth.uid() = owner_id and verified = false and plan = 'pilote');

drop policy if exists "agencies_update_own" on public.agencies;
create policy "agencies_update_own" on public.agencies
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "agencies_delete_own" on public.agencies;
create policy "agencies_delete_own" on public.agencies
  for delete using (auth.uid() = owner_id);

drop trigger if exists touch_agencies on public.agencies;
create trigger touch_agencies before update on public.agencies
  for each row execute function public.touch_updated_at();

-- Badge, formule et propriétaire : immuables hors administration.
create or replace function public.guard_agency_update()
returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if new.owner_id is distinct from old.owner_id
       or new.verified is distinct from old.verified
       or new.plan is distinct from old.plan then
      raise exception 'agence : champ réservé à E-Dome';
    end if;
    -- Changer le numéro IDE retire la vérification (à refaire).
    if new.uid_number is distinct from old.uid_number then
      new.verified := false;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists guard_agency_update on public.agencies;
create trigger guard_agency_update before update on public.agencies
  for each row execute function public.guard_agency_update();

-- ════════ 007_demenagement.sql ════════
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

-- ════════ 008_reglements.sql ════════
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 008 : RÈGLEMENTS DES PRIMES ET RÉCOMPENSES            ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 002 et 004. Idempotente.                                ║
-- ║  Chaque acceptation (mise en relation ou proposition) crée un règlement  ║
-- ║  DÛ, au montant figé : brut, part E-Dome (12 %, 3 CHF minimum), net.     ║
-- ║                                                                           ║
-- ║  Phase pilote, indépendante du prestataire de paiement :                  ║
-- ║   dû → déclaré payé (le payeur) → confirmé (l'apporteur) | contesté       ║
-- ║  Le payeur règle le NET directement à l'apporteur (TWINT ou virement) :  ║
-- ║  E-Dome ne détient jamais les fonds. La part E-Dome est enregistrée ;    ║
-- ║  son encaissement s'activera avec le prestataire agréé (Stripe Connect,  ║
-- ║  Payrexx…), qui remplacera seulement l'étape « payer ».                   ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── 1. Coordonnées de versement (chacun les siennes) ───────────────────────
create table if not exists public.payout_profiles (
  user_id      uuid primary key references public.profiles (id) on delete cascade,
  holder_name  text not null default '',
  iban         text,
  twint_phone  text,
  updated_at   timestamptz not null default now()
);
alter table public.payout_profiles enable row level security;
drop policy if exists "payout_own" on public.payout_profiles;
create policy "payout_own" on public.payout_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Le payeur d'un règlement en cours les lit par le serveur (clé de service),
-- après contrôle : aucune lecture directe par un tiers.

-- ── 2. Les règlements ──────────────────────────────────────────────────────
create table if not exists public.settlements (
  id            uuid primary key default gen_random_uuid(),
  source_kind   text not null check (source_kind in ('introduction', 'answer')),
  source_id     uuid not null,
  payer_id      uuid not null references public.profiles (id) on delete cascade,
  payee_id      uuid not null references public.profiles (id) on delete cascade,
  label         text not null default '',
  gross_chf     numeric not null check (gross_chf >= 0),
  fee_chf       numeric not null check (fee_chf >= 0),
  net_chf       numeric not null check (net_chf >= 0),
  status        text not null default 'due' check (status in ('due', 'declared', 'confirmed', 'disputed')),
  method        text check (method in ('twint', 'virement', 'autre')),
  declared_at   timestamptz,
  confirmed_at  timestamptz,
  created_at    timestamptz not null default now(),
  unique (source_kind, source_id)
);
create index if not exists settlements_payer_idx on public.settlements (payer_id, status);
create index if not exists settlements_payee_idx on public.settlements (payee_id, status);
alter table public.settlements enable row level security;

drop policy if exists "settlements_select_parties" on public.settlements;
create policy "settlements_select_parties" on public.settlements
  for select using (auth.uid() in (payer_id, payee_id));
drop policy if exists "settlements_update_parties" on public.settlements;
create policy "settlements_update_parties" on public.settlements
  for update using (auth.uid() in (payer_id, payee_id)) with check (auth.uid() in (payer_id, payee_id));
-- Aucune insertion directe : seuls les déclencheurs ci-dessous créent un règlement.

-- Transitions autorisées et montants immuables.
create or replace function public.guard_settlement_update()
returns trigger language plpgsql as $$
declare is_admin boolean := coalesce(auth.role(), '') = 'service_role';
begin
  if new.source_kind is distinct from old.source_kind or new.source_id is distinct from old.source_id
     or new.payer_id is distinct from old.payer_id or new.payee_id is distinct from old.payee_id
     or new.gross_chf is distinct from old.gross_chf or new.fee_chf is distinct from old.fee_chf
     or new.net_chf is distinct from old.net_chf or new.label is distinct from old.label
     or new.created_at is distinct from old.created_at then
    raise exception 'règlement : champ immuable';
  end if;
  if new.status is distinct from old.status and not is_admin then
    if old.status = 'due' and new.status = 'declared' and auth.uid() = old.payer_id then
      new.declared_at := now();
    elsif old.status = 'declared' and new.status in ('confirmed', 'disputed') and auth.uid() = old.payee_id then
      if new.status = 'confirmed' then new.confirmed_at := now(); end if;
    else
      raise exception 'règlement : transition non autorisée';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists guard_settlement_update on public.settlements;
create trigger guard_settlement_update before update on public.settlements
  for each row execute function public.guard_settlement_update();

-- Part E-Dome : 12 %, 3 CHF minimum, jamais plus que le montant (même règle
-- que `apporteurNetChf` dans le code).
create or replace function public.edome_fee_chf(gross numeric)
returns numeric language sql immutable as $$
  select least(greatest(round(gross * 100 * 0.12), 300), round(gross * 100)) / 100.0
$$;

-- ── 3. Création automatique à l'acceptation ────────────────────────────────
create or replace function public.settle_on_introduction()
returns trigger language plpgsql security definer set search_path = public as $$
declare g numeric;
begin
  if new.status = 'acceptee' and old.status is distinct from 'acceptee' then
    g := coalesce(new.amount_chf, 0);
    insert into public.settlements (source_kind, source_id, payer_id, payee_id, label, gross_chf, fee_chf, net_chf)
    values ('introduction', new.id, new.seller_id, new.apporteur_id, left(new.contact_label, 140),
            g, public.edome_fee_chf(g), g - public.edome_fee_chf(g))
    on conflict (source_kind, source_id) do nothing;
  end if;
  return new;
end $$;
drop trigger if exists settle_on_introduction on public.introductions;
create trigger settle_on_introduction after update on public.introductions
  for each row execute function public.settle_on_introduction();

create or replace function public.settle_on_answer()
returns trigger language plpgsql security definer set search_path = public as $$
declare g numeric;
begin
  if new.status = 'acceptee' and old.status is distinct from 'acceptee' then
    g := coalesce(new.reward_chf, 0);
    insert into public.settlements (source_kind, source_id, payer_id, payee_id, label, gross_chf, fee_chf, net_chf)
    values ('answer', new.id, new.searcher_id, new.author_id, left(new.pitch, 140),
            g, public.edome_fee_chf(g), g - public.edome_fee_chf(g))
    on conflict (source_kind, source_id) do nothing;
  end if;
  return new;
end $$;
drop trigger if exists settle_on_answer on public.search_answers;
create trigger settle_on_answer after update on public.search_answers
  for each row execute function public.settle_on_answer();

-- ── 4. Rattrapage : les acceptations déjà faites ───────────────────────────
insert into public.settlements (source_kind, source_id, payer_id, payee_id, label, gross_chf, fee_chf, net_chf)
select 'introduction', i.id, i.seller_id, i.apporteur_id, left(i.contact_label, 140),
       coalesce(i.amount_chf, 0), public.edome_fee_chf(coalesce(i.amount_chf, 0)),
       coalesce(i.amount_chf, 0) - public.edome_fee_chf(coalesce(i.amount_chf, 0))
from public.introductions i where i.status = 'acceptee'
on conflict (source_kind, source_id) do nothing;

insert into public.settlements (source_kind, source_id, payer_id, payee_id, label, gross_chf, fee_chf, net_chf)
select 'answer', a.id, a.searcher_id, a.author_id, left(a.pitch, 140),
       coalesce(a.reward_chf, 0), public.edome_fee_chf(coalesce(a.reward_chf, 0)),
       coalesce(a.reward_chf, 0) - public.edome_fee_chf(coalesce(a.reward_chf, 0))
from public.search_answers a where a.status = 'acceptee' and a.searcher_id is not null
on conflict (source_kind, source_id) do nothing;

-- ════════ 009_apport.sql ════════
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 009 : APPORT D'AFFAIRES v2 (lancement 25.11.2026)     ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 002, 004 et 008. Idempotente.                           ║
-- ║  1. Commission v2 : fixe (50–50'000 CHF) ou % du prix de vente (≤ 3 %),   ║
-- ║     due à la conclusion (art. 413 CO) ou, si fixe, à l'acceptation.       ║
-- ║  2. Liens d'apporteur tracés (un par bien et par apporteur).              ║
-- ║  3. Événements de suivi (vues, partages, leads…) — temps réel.            ║
-- ║  4. Leads attribués, conditions FIGÉES au moment du lead, commission      ║
-- ║     créée automatiquement quand la vente est conclue.                     ║
-- ║  5. Stockage des vidéos d'annonces.                                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── 1. Commission v2 sur les primes ────────────────────────────────────────
alter table public.primes drop constraint if exists primes_amount_chf_check;
alter table public.primes alter column amount_chf drop not null;
alter table public.primes add column if not exists commission_kind   text not null default 'fixe';
alter table public.primes add column if not exists rate_pct          numeric;
alter table public.primes add column if not exists due_on            text not null default 'acceptation';
alter table public.primes add column if not exists terms_accepted_at timestamptz;
alter table public.primes drop constraint if exists primes_terms_check;
alter table public.primes add constraint primes_terms_check check (
  commission_kind in ('fixe', 'pourcentage')
  and due_on in ('acceptation', 'conclusion')
  and (
    (commission_kind = 'fixe' and amount_chf between 50 and 50000 and rate_pct is null)
    or (commission_kind = 'pourcentage' and rate_pct > 0 and rate_pct <= 3 and due_on = 'conclusion')
  )
);

-- Les mises en relation figent aussi la forme de la commission.
alter table public.introductions add column if not exists commission_kind text;
alter table public.introductions add column if not exists rate_pct        numeric;
alter table public.introductions add column if not exists due_on          text;

create or replace function public.snapshot_introduction()
returns trigger language plpgsql security definer set search_path = public as $$
declare p record;
begin
  select amount_chf, property_id, commission_kind, rate_pct, due_on into p from public.primes where id = new.prime_id;
  new.amount_chf      := p.amount_chf;
  new.property_id     := p.property_id;
  new.commission_kind := coalesce(p.commission_kind, 'fixe');
  new.rate_pct        := p.rate_pct;
  new.due_on          := coalesce(p.due_on, 'acceptation');
  new.decided_at      := null;
  return new;
end $$;

-- Ces trois champs sont immuables, comme le montant (protection 002 étendue).
create or replace function public.guard_introduction_update()
returns trigger language plpgsql as $$
begin
  if new.prime_id is distinct from old.prime_id
     or new.apporteur_id is distinct from old.apporteur_id
     or new.seller_id is distinct from old.seller_id
     or new.contact_label is distinct from old.contact_label
     or new.amount_chf is distinct from old.amount_chf
     or new.property_id is distinct from old.property_id
     or new.commission_kind is distinct from old.commission_kind
     or new.rate_pct is distinct from old.rate_pct
     or new.due_on is distinct from old.due_on
     or new.created_at is distinct from old.created_at then
    raise exception 'introduction : champ immuable';
  end if;
  if new.status not in ('proposee', 'acceptee', 'refusee', 'contestee') then
    raise exception 'introduction : statut invalide';
  end if;
  if new.status is distinct from old.status then
    if old.status <> 'proposee' and coalesce(auth.role(), '') <> 'service_role' then
      raise exception 'introduction : décision déjà prise';
    end if;
    if new.status = 'contestee' and coalesce(auth.role(), '') <> 'service_role' then
      raise exception 'introduction : contestation réservée à l''administration';
    end if;
    new.decided_at := now();
  end if;
  return new;
end $$;

-- Règlement à l'acceptation : seulement pour une commission fixe due à l'acceptation.
create or replace function public.settle_on_introduction()
returns trigger language plpgsql security definer set search_path = public as $$
declare g numeric;
begin
  if new.status = 'acceptee' and old.status is distinct from 'acceptee'
     and coalesce(new.due_on, 'acceptation') = 'acceptation'
     and coalesce(new.commission_kind, 'fixe') = 'fixe' then
    g := coalesce(new.amount_chf, 0);
    insert into public.settlements (source_kind, source_id, payer_id, payee_id, label, gross_chf, fee_chf, net_chf)
    values ('introduction', new.id, new.seller_id, new.apporteur_id, left(new.contact_label, 140),
            g, public.edome_fee_chf(g), g - public.edome_fee_chf(g))
    on conflict (source_kind, source_id) do nothing;
  end if;
  return new;
end $$;

-- ── 2. Liens d'apporteur ───────────────────────────────────────────────────
create table if not exists public.apport_links (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique check (code ~ '^[a-z0-9]{6,12}$'),
  property_id   uuid not null references public.properties (id) on delete cascade,
  apporteur_id  uuid not null references public.profiles (id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (property_id, apporteur_id)
);
alter table public.apport_links enable row level security;
drop policy if exists "apport_links_select" on public.apport_links;
create policy "apport_links_select" on public.apport_links
  for select using (
    auth.uid() = apporteur_id
    or exists (select 1 from public.properties p where p.id = property_id and p.host_id = auth.uid())
  );
-- Création : serveur uniquement (clé de service), après contrôle.

-- ── 3. Événements de suivi ─────────────────────────────────────────────────
create table if not exists public.property_events (
  id           bigint generated always as identity primary key,
  property_id  uuid not null references public.properties (id) on delete cascade,
  kind         text not null check (kind in ('vue', 'partage', 'lead', 'video', 'contact')),
  link_id      uuid references public.apport_links (id) on delete set null,
  visitor      text not null default '',   -- identifiant aléatoire (cookie), jamais l'adresse IP
  created_at   timestamptz not null default now()
);
create index if not exists property_events_prop_idx on public.property_events (property_id, created_at desc);
create index if not exists property_events_link_idx on public.property_events (link_id, created_at desc);
alter table public.property_events enable row level security;
drop policy if exists "property_events_select" on public.property_events;
create policy "property_events_select" on public.property_events
  for select using (
    exists (select 1 from public.properties p where p.id = property_id and p.host_id = auth.uid())
    or exists (select 1 from public.apport_links l where l.id = link_id and l.apporteur_id = auth.uid())
  );
-- Écriture : serveur uniquement (route /api/track, clé de service).

-- ── 4. Leads attribués et commission à la conclusion ───────────────────────
alter table public.inquiries add column if not exists link_id                uuid references public.apport_links (id) on delete set null;
alter table public.inquiries add column if not exists apporteur_id           uuid references public.profiles (id) on delete set null;
alter table public.inquiries add column if not exists commission_kind        text;
alter table public.inquiries add column if not exists commission_amount_chf  numeric;
alter table public.inquiries add column if not exists commission_rate_pct    numeric;
alter table public.inquiries add column if not exists commission_due_on      text;
alter table public.inquiries add column if not exists sale_price             numeric check (sale_price is null or sale_price > 0);
alter table public.inquiries add column if not exists closed_at              timestamptz;
create index if not exists inquiries_apporteur_idx on public.inquiries (apporteur_id);

-- L'apporteur voit les leads qu'il a apportés (sans pouvoir les modifier).
drop policy if exists "inquiries_select_parties" on public.inquiries;
create policy "inquiries_select_parties" on public.inquiries
  for select using (auth.uid() = seller_id or auth.uid() = sender_id or auth.uid() = apporteur_id);

-- Le vendeur ne peut ni retirer l'apporteur ni changer la commission promise.
create or replace function public.guard_inquiry_update()
returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then return new; end if;
  if new.property_id is distinct from old.property_id or new.seller_id is distinct from old.seller_id
     or new.sender_id is distinct from old.sender_id or new.sender_name is distinct from old.sender_name
     or new.sender_email is distinct from old.sender_email or new.sender_phone is distinct from old.sender_phone
     or new.link_id is distinct from old.link_id or new.apporteur_id is distinct from old.apporteur_id
     or new.commission_kind is distinct from old.commission_kind
     or new.commission_amount_chf is distinct from old.commission_amount_chf
     or new.commission_rate_pct is distinct from old.commission_rate_pct
     or new.commission_due_on is distinct from old.commission_due_on
     or new.introduction_id is distinct from old.introduction_id
     or new.created_at is distinct from old.created_at then
    raise exception 'demande : champ immuable';
  end if;
  -- Une vente conclue est définitive (correction : administration).
  if old.status = 'conclue' and (new.status is distinct from old.status or new.sale_price is distinct from old.sale_price) then
    raise exception 'demande : vente déjà conclue';
  end if;
  if new.status = 'conclue' and old.status is distinct from 'conclue' then
    if new.apporteur_id is not null and new.commission_kind = 'pourcentage' and new.sale_price is null then
      raise exception 'demande : prix de vente requis pour calculer la commission';
    end if;
    new.closed_at := now();
  end if;
  return new;
end $$;
drop trigger if exists guard_inquiry_update on public.inquiries;
create trigger guard_inquiry_update before update on public.inquiries
  for each row execute function public.guard_inquiry_update();

-- Les règlements acceptent une nouvelle source : la vente conclue.
alter table public.settlements drop constraint if exists settlements_source_kind_check;
alter table public.settlements add constraint settlements_source_kind_check
  check (source_kind in ('introduction', 'answer', 'vente'));

create or replace function public.settle_on_sale()
returns trigger language plpgsql security definer set search_path = public as $$
declare g numeric; t text;
begin
  if new.status = 'conclue' and old.status is distinct from 'conclue'
     and new.apporteur_id is not null and new.apporteur_id <> new.seller_id
     and coalesce(new.commission_due_on, 'conclusion') = 'conclusion' then
    if new.commission_kind = 'pourcentage' then
      g := round(coalesce(new.sale_price, 0) * coalesce(new.commission_rate_pct, 0)) / 100.0;
    else
      g := coalesce(new.commission_amount_chf, 0);
    end if;
    if g > 0 then
      select left(title, 140) into t from public.properties where id = new.property_id;
      insert into public.settlements (source_kind, source_id, payer_id, payee_id, label, gross_chf, fee_chf, net_chf)
      values ('vente', new.id, new.seller_id, new.apporteur_id, coalesce(t, 'Vente'),
              g, public.edome_fee_chf(g), g - public.edome_fee_chf(g))
      on conflict (source_kind, source_id) do nothing;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists settle_on_sale on public.inquiries;
create trigger settle_on_sale after update on public.inquiries
  for each row execute function public.settle_on_sale();

-- ── 5. Temps réel : le tableau de bord écoute ces tables (RLS appliquée) ───
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'property_events') then
      alter publication supabase_realtime add table public.property_events;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'inquiries') then
      alter publication supabase_realtime add table public.inquiries;
    end if;
  end if;
end $$;

-- ── 6. Vidéos des annonces (lecture publique, envoi par URL signée) ────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-videos', 'property-videos', true, 52428800, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do nothing;

-- ════════ 010_parcours_vente.sql ════════
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 010 : PARCOURS DE VENTE (offres → acte)               ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 002 et 009. Idempotente.                                ║
-- ║  1. Offres reçues sur une demande : montant, financement, conditions,     ║
-- ║     validité ; acceptée, refusée, contre-offre ou retirée.                ║
-- ║  2. Étapes suisses jusqu'à l'acte : financement confirmé, projet d'acte   ║
-- ║     du notaire, réservation, acte authentique signé.                      ║
-- ║  Le vendeur de la demande écrit ; l'expéditeur (s'il a un compte) lit.    ║
-- ║  E-Dome ne détient aucun fonds : il s'agit d'un suivi, pas d'un séquestre.║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── 1. Offres ──────────────────────────────────────────────────────────────
create table if not exists public.deal_offers (
  id                  uuid primary key default gen_random_uuid(),
  inquiry_id          uuid not null references public.inquiries (id) on delete cascade,
  seller_id           uuid not null references public.profiles (id) on delete cascade,
  amount_chf          numeric(14, 2) not null check (amount_chf > 0 and amount_chf < 10000000000),
  financing           text not null default 'inconnu'
                      check (financing in ('inconnu', 'fonds-propres', 'hypotheque-en-cours', 'hypotheque-confirmee')),
  conditions          text not null default '' check (char_length(conditions) <= 1000),
  valid_until         date,
  status              text not null default 'en-attente'
                      check (status in ('en-attente', 'acceptee', 'refusee', 'contre-offre', 'retiree')),
  counter_amount_chf  numeric(14, 2) check (counter_amount_chf is null or counter_amount_chf > 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (status <> 'contre-offre' or counter_amount_chf is not null)
);
create index if not exists deal_offers_inquiry_idx on public.deal_offers (inquiry_id, created_at desc);
create index if not exists deal_offers_seller_idx on public.deal_offers (seller_id, created_at desc);

alter table public.deal_offers enable row level security;

drop policy if exists "deal_offers_select_parties" on public.deal_offers;
create policy "deal_offers_select_parties" on public.deal_offers
  for select using (
    exists (select 1 from public.inquiries q where q.id = inquiry_id and auth.uid() in (q.seller_id, q.sender_id))
  );

drop policy if exists "deal_offers_insert_seller" on public.deal_offers;
create policy "deal_offers_insert_seller" on public.deal_offers
  for insert with check (
    auth.uid() = seller_id
    and exists (select 1 from public.inquiries q where q.id = inquiry_id and q.seller_id = auth.uid() and q.status <> 'conclue')
  );

drop policy if exists "deal_offers_update_seller" on public.deal_offers;
create policy "deal_offers_update_seller" on public.deal_offers
  for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

drop policy if exists "deal_offers_delete_seller" on public.deal_offers;
create policy "deal_offers_delete_seller" on public.deal_offers
  for delete using (
    auth.uid() = seller_id
    and not exists (select 1 from public.inquiries q where q.id = inquiry_id and q.status = 'conclue')
  );

-- Une offre ne change ni de demande ni de vendeur ; une vente conclue fige
-- ses offres.
create or replace function public.guard_deal_offer()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.inquiry_id is distinct from old.inquiry_id or new.seller_id is distinct from old.seller_id then
    raise exception 'offre : demande et vendeur non modifiables';
  end if;
  if exists (select 1 from public.inquiries q where q.id = old.inquiry_id and q.status = 'conclue') then
    raise exception 'offre : vente déjà conclue';
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists guard_deal_offer on public.deal_offers;
create trigger guard_deal_offer before update on public.deal_offers
  for each row execute function public.guard_deal_offer();

-- ── 2. Étapes jusqu'à l'acte ───────────────────────────────────────────────
create table if not exists public.deal_steps (
  inquiry_id  uuid not null references public.inquiries (id) on delete cascade,
  step        text not null check (step in ('financement', 'projet-acte', 'reservation', 'acte')),
  done_by     uuid references public.profiles (id) on delete set null,
  done_at     timestamptz not null default now(),
  primary key (inquiry_id, step)
);

alter table public.deal_steps enable row level security;

drop policy if exists "deal_steps_select_parties" on public.deal_steps;
create policy "deal_steps_select_parties" on public.deal_steps
  for select using (
    exists (select 1 from public.inquiries q where q.id = inquiry_id and auth.uid() in (q.seller_id, q.sender_id))
  );

drop policy if exists "deal_steps_insert_seller" on public.deal_steps;
create policy "deal_steps_insert_seller" on public.deal_steps
  for insert with check (
    done_by = auth.uid()
    and exists (select 1 from public.inquiries q where q.id = inquiry_id and q.seller_id = auth.uid() and q.status <> 'conclue')
  );

drop policy if exists "deal_steps_delete_seller" on public.deal_steps;
create policy "deal_steps_delete_seller" on public.deal_steps
  for delete using (
    exists (select 1 from public.inquiries q where q.id = inquiry_id and q.seller_id = auth.uid() and q.status <> 'conclue')
  );
