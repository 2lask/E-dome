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
