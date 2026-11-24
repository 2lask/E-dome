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
