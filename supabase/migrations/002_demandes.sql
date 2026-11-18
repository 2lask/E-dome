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
