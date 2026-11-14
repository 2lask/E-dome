-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Schéma de la plateforme (Supabase / PostgreSQL)                  ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║                                                                            ║
-- ║  Phase 1 du backend réel. À exécuter dans l'éditeur SQL de Supabase        ║
-- ║  (Dashboard → SQL Editor → New query → coller → Run), APRÈS `leads.sql`.   ║
-- ║                                                                            ║
-- ║  Principes :                                                               ║
-- ║   · chaque personne = une ligne de `profiles`, liée 1-1 à `auth.users` ;   ║
-- ║     un déclencheur crée le profil à l'inscription (prénom/nom pris dans    ║
-- ║     les métadonnées envoyées par le formulaire d'inscription).             ║
-- ║   · RLS (Row Level Security) activée PARTOUT. Lecture publique du contenu  ║
-- ║     (annonces, formations, profils…), écriture réservée au propriétaire.   ║
-- ║     Les données privées (messages, notifications, journal) ne sont         ║
-- ║     lisibles que par leur titulaire.                                       ║
-- ║   · PAIEMENTS SIMULÉS pour l'instant (décision : réels après validation    ║
-- ║     juridique). `transactions` modélise le flux d'argent sans encaisser.   ║
-- ║   · idempotent : réexécutable sans casser (IF NOT EXISTS / DROP POLICY).   ║
-- ║                                                                            ║
-- ║  L'application fonctionne SANS ce schéma (mode démo, données fictives).    ║
-- ║  Une fois Supabase configuré (.env.local) et ce schéma exécuté, la         ║
-- ║  migration des écrans se fait pôle par pôle (phases suivantes).            ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 1. PROFILES — une personne, liée à un compte auth                         │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  first_name    text not null default '',
  last_name     text not null default '',
  avatar        text,
  city          text,
  country       text not null default 'Suisse',
  bio           text,
  -- Capacités sur la plateforme (PlatformRole), cumulables. Ex. {particulier}.
  roles         text[] not null default '{particulier}',
  active_role   text not null default 'particulier',
  -- Métier(s) d'un prestataire (ProviderTrade) ; aucun droit.
  trades        text[] not null default '{}',
  -- Centres d'intérêt (ProfileInterest) ; aucun droit, aucun écran.
  interests     text[] not null default '{}',
  -- Pays de résidence sert à la restriction d'affiliation biens (Loi Hoguet, FR).
  languages     text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all" on public.profiles
  for select using (true); -- un profil est public (annuaire, auteur d'annonce…)

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Création automatique du profil à l'inscription.
-- Le formulaire envoie { firstName, lastName } dans raw_user_meta_data ;
-- on les récupère ici pour amorcer le profil.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'firstName', ''),
    coalesce(new.raw_user_meta_data ->> 'lastName', ''),
    new.raw_user_meta_data ->> 'avatar_url' -- fourni par Google le cas échéant
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 2. PROPERTIES — les biens                                                 │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.properties (
  id               uuid primary key default gen_random_uuid(),
  host_id          uuid not null references public.profiles (id) on delete cascade,
  title            text not null,
  description      text not null default '',
  type             text not null,              -- appartement|villa|chalet|studio|…
  transaction_type text not null,              -- vente|location-ct|location-lt
  price            numeric not null check (price >= 0),
  currency         text not null default 'CHF',
  city             text not null,
  country          text not null default 'Suisse',
  address          text,
  lat              double precision,
  lng              double precision,
  images           text[] not null default '{}',
  videos           text[] not null default '{}',
  bedrooms         int not null default 0,
  bathrooms        int not null default 0,
  area             numeric not null default 0,
  floor            int,
  amenities        text[] not null default '{}',
  featured         boolean not null default false,
  -- Vendu : l'acheteur (un profil). Un bien vendu reste au catalogue.
  sold_to          uuid references public.profiles (id) on delete set null,
  analytics        jsonb,                      -- rendement, DPE, ROI… (optionnel)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists properties_host_idx on public.properties (host_id);
create index if not exists properties_txn_idx  on public.properties (transaction_type);
create index if not exists properties_city_idx on public.properties (city);

alter table public.properties enable row level security;

drop policy if exists "properties_read_all" on public.properties;
create policy "properties_read_all" on public.properties for select using (true);

drop policy if exists "properties_write_own" on public.properties;
create policy "properties_write_own" on public.properties
  for all using (auth.uid() = host_id) with check (auth.uid() = host_id);

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 3. FORMATIONS + inscriptions                                              │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.formations (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  description text not null default '',
  price       numeric not null default 0,
  currency    text not null default 'CHF',
  level       text,                            -- debutant|intermediaire|avance
  duration    text,
  thumbnail   text,
  -- Modules et leçons (titres, durées) ; le contenu riche viendra ensuite.
  modules     jsonb not null default '[]',
  created_at  timestamptz not null default now()
);
create index if not exists formations_author_idx on public.formations (author_id);

alter table public.formations enable row level security;
drop policy if exists "formations_read_all" on public.formations;
create policy "formations_read_all" on public.formations for select using (true);
drop policy if exists "formations_write_own" on public.formations;
create policy "formations_write_own" on public.formations
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

create table if not exists public.formation_enrollments (
  id            uuid primary key default gen_random_uuid(),
  formation_id  uuid not null references public.formations (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  lessons_done  text[] not null default '{}', -- ids des leçons terminées
  enrolled_at   timestamptz not null default now(),
  unique (formation_id, user_id)
);
alter table public.formation_enrollments enable row level security;
drop policy if exists "enrollments_own" on public.formation_enrollments;
create policy "enrollments_own" on public.formation_enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 4. SERVICES + demandes de devis                                           │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  provider_id  uuid not null references public.profiles (id) on delete cascade,
  title        text not null,
  category     text,
  description  text not null default '',
  price_from   numeric,
  currency     text not null default 'CHF',
  images       text[] not null default '{}',
  created_at   timestamptz not null default now()
);
create index if not exists services_provider_idx on public.services (provider_id);
alter table public.services enable row level security;
drop policy if exists "services_read_all" on public.services;
create policy "services_read_all" on public.services for select using (true);
drop policy if exists "services_write_own" on public.services;
create policy "services_write_own" on public.services
  for all using (auth.uid() = provider_id) with check (auth.uid() = provider_id);

create table if not exists public.service_requests (
  id           uuid primary key default gen_random_uuid(),
  service_id   uuid not null references public.services (id) on delete cascade,
  requester_id uuid not null references public.profiles (id) on delete cascade,
  provider_id  uuid not null references public.profiles (id) on delete cascade,
  need         text not null default '',
  desired_date date,
  budget       numeric,
  -- envoyee|devis-recu|acceptee|realisee|annulee
  status       text not null default 'envoyee',
  created_at   timestamptz not null default now()
);
alter table public.service_requests enable row level security;
drop policy if exists "service_requests_participants" on public.service_requests;
create policy "service_requests_participants" on public.service_requests
  for all using (auth.uid() = requester_id or auth.uid() = provider_id)
  with check (auth.uid() = requester_id or auth.uid() = provider_id);

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 5. ÉVÉNEMENTS + inscriptions                                              │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  organizer_id  uuid not null references public.profiles (id) on delete cascade,
  title         text not null,
  description   text not null default '',
  starts_at     timestamptz not null,
  city          text,
  price         numeric not null default 0,
  currency      text not null default 'CHF',
  thumbnail     text,
  is_live       boolean not null default false, -- événement vs live
  created_at    timestamptz not null default now()
);
create index if not exists events_organizer_idx on public.events (organizer_id);
alter table public.events enable row level security;
drop policy if exists "events_read_all" on public.events;
create policy "events_read_all" on public.events for select using (true);
drop policy if exists "events_write_own" on public.events;
create policy "events_write_own" on public.events
  for all using (auth.uid() = organizer_id) with check (auth.uid() = organizer_id);

create table if not exists public.event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
alter table public.event_registrations enable row level security;
drop policy if exists "event_registrations_own" on public.event_registrations;
create policy "event_registrations_own" on public.event_registrations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 6. MESSAGERIE — fils + messages                                           │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.message_threads (
  id          uuid primary key default gen_random_uuid(),
  -- Deux participants, triés pour qu'un fil soit unique entre deux personnes.
  participant_a uuid not null references public.profiles (id) on delete cascade,
  participant_b uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (participant_a, participant_b),
  check (participant_a < participant_b)
);
alter table public.message_threads enable row level security;
drop policy if exists "threads_participants" on public.message_threads;
create policy "threads_participants" on public.message_threads
  for all using (auth.uid() in (participant_a, participant_b))
  with check (auth.uid() in (participant_a, participant_b));

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references public.message_threads (id) on delete cascade,
  sender_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null default '',
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists messages_thread_idx on public.messages (thread_id, created_at);
alter table public.messages enable row level security;
-- Un message est lisible/écrivable par les participants de son fil.
drop policy if exists "messages_participants" on public.messages;
create policy "messages_participants" on public.messages
  for all using (
    exists (
      select 1 from public.message_threads t
      where t.id = thread_id and auth.uid() in (t.participant_a, t.participant_b)
    )
  ) with check (
    sender_id = auth.uid() and exists (
      select 1 from public.message_threads t
      where t.id = thread_id and auth.uid() in (t.participant_a, t.participant_b)
    )
  );

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 7. NOTIFICATIONS                                                          │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  kind       text not null,                    -- contact|offre|devis|avis|…
  data       jsonb not null default '{}',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id, created_at);
alter table public.notifications enable row level security;
drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 8. RÉSEAU — abonnements                                                   │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.follows (
  follower_id  uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
alter table public.follows enable row level security;
-- Les abonnements sont publics (on dérive les compteurs) ; on n'écrit que les siens.
drop policy if exists "follows_read_all" on public.follows;
create policy "follows_read_all" on public.follows for select using (true);
drop policy if exists "follows_write_own" on public.follows;
create policy "follows_write_own" on public.follows
  for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 9. AVIS — liés à une transaction réelle (contrôle applicatif)             │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references public.profiles (id) on delete cascade,
  subject_kind text not null,                  -- property|formation|service|person
  subject_id   uuid not null,
  rating       int not null check (rating between 1 and 5),
  comment      text not null default '',
  created_at   timestamptz not null default now()
);
create index if not exists reviews_subject_idx on public.reviews (subject_kind, subject_id);
alter table public.reviews enable row level security;
drop policy if exists "reviews_read_all" on public.reviews;
create policy "reviews_read_all" on public.reviews for select using (true);
drop policy if exists "reviews_write_own" on public.reviews;
create policy "reviews_write_own" on public.reviews
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 10. APPORTEURS — liens de parrainage, primes biens, mises en relation     │
-- ╰──────────────────────────────────────────────────────────────────────────╯
create table if not exists public.referral_links (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  target_kind text not null,                   -- bien|formation|service|event|compte
  target_id   text,                            -- id de la cible (ou null = compte)
  code        text not null unique,
  clicks      int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists referral_owner_idx on public.referral_links (owner_id);
alter table public.referral_links enable row level security;
drop policy if exists "referral_read_all" on public.referral_links;
create policy "referral_read_all" on public.referral_links for select using (true);
drop policy if exists "referral_write_own" on public.referral_links;
create policy "referral_write_own" on public.referral_links
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Prime biens : fixée par le vendeur sur une annonce, en CHF. Jamais un % du prix.
create table if not exists public.primes (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  seller_id   uuid not null references public.profiles (id) on delete cascade,
  amount_chf  numeric not null check (amount_chf between 50 and 3000),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.primes enable row level security;
drop policy if exists "primes_read_all" on public.primes;
create policy "primes_read_all" on public.primes for select using (true);
drop policy if exists "primes_write_own" on public.primes;
create policy "primes_write_own" on public.primes
  for all using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

-- Mise en relation apportée : facturée seulement si le vendeur l'accepte.
create table if not exists public.introductions (
  id           uuid primary key default gen_random_uuid(),
  prime_id     uuid not null references public.primes (id) on delete cascade,
  apporteur_id uuid not null references public.profiles (id) on delete cascade,
  seller_id    uuid not null references public.profiles (id) on delete cascade,
  contact_label text not null default '',
  -- proposee|acceptee|refusee|contestee
  status       text not null default 'proposee',
  created_at   timestamptz not null default now()
);
alter table public.introductions enable row level security;
drop policy if exists "introductions_participants" on public.introductions;
create policy "introductions_participants" on public.introductions
  for all using (auth.uid() in (apporteur_id, seller_id))
  with check (auth.uid() in (apporteur_id, seller_id));

-- ╭──────────────────────────────────────────────────────────────────────────╮
-- │ 11. JOURNAL DES FLUX — transactions SIMULÉES (pas d'encaissement réel)    │
-- ╰──────────────────────────────────────────────────────────────────────────╯
-- Modélise « qui paie quoi » sans traiter d'argent. Les vrais paiements
-- (Stripe) viendront après la validation juridique du modèle d'affiliation.
create table if not exists public.transactions (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references public.profiles (id) on delete cascade,
  source         text not null,                -- vente|location|formation|service|…
  amount         numeric not null,
  currency       text not null default 'CHF',
  counterparty   text,
  subject        jsonb,                         -- { kind, id } de l'objet concerné
  commissionable boolean not null default true, -- false = volume (GMV), pas un revenu
  occurred_at    timestamptz not null default now()
);
create index if not exists transactions_owner_idx on public.transactions (owner_id);
alter table public.transactions enable row level security;
-- Le journal d'une personne n'est lisible que par elle (données financières).
drop policy if exists "transactions_own" on public.transactions;
create policy "transactions_own" on public.transactions
  for select using (auth.uid() = owner_id);
-- Écriture : réservée au serveur (clé de service). Aucune policy d'insert côté
-- client : une transaction naît d'un acte vérifié côté serveur, jamais d'un
-- client qui s'auto-crédite.

-- ── Déclencheur updated_at générique ─────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists touch_profiles on public.profiles;
create trigger touch_profiles before update on public.profiles
  for each row execute function public.touch_updated_at();
drop trigger if exists touch_properties on public.properties;
create trigger touch_properties before update on public.properties
  for each row execute function public.touch_updated_at();

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  FIN. Prochaine étape : exécuter `seed.sql` (les seize personnes et leur   ║
-- ║  contenu de démonstration), puis brancher les écrans pôle par pôle.        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
