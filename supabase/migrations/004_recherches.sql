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
