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
