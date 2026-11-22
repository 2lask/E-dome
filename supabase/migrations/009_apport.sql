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
