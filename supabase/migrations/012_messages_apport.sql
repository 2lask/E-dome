-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — Migration 012 : MESSAGES VENDEUR ↔ APPORTEUR                    ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  À exécuter après 009. Idempotente.                                       ║
-- ║  Une conversation par lien d'apporteur : seuls l'apporteur du lien et le  ║
-- ║  propriétaire du bien la lisent et y écrivent. Aucune donnée d'acheteur   ║
-- ║  n'y transite par le système. Temps réel activé.                          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.link_messages (
  id          uuid primary key default gen_random_uuid(),
  link_id     uuid not null references public.apport_links (id) on delete cascade,
  sender_id   uuid not null references public.profiles (id) on delete cascade,
  body        text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at  timestamptz not null default now(),
  read_at     timestamptz
);
create index if not exists link_messages_link_idx on public.link_messages (link_id, created_at);
alter table public.link_messages enable row level security;

-- Partie au lien : son apporteur, ou le propriétaire du bien.
create or replace function public.is_link_party(l uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.apport_links a
    join public.properties p on p.id = a.property_id
    where a.id = l and (a.apporteur_id = auth.uid() or p.host_id = auth.uid())
  );
$$;
revoke execute on function public.is_link_party(uuid) from public, anon;
grant execute on function public.is_link_party(uuid) to authenticated;

drop policy if exists "link_messages_select" on public.link_messages;
create policy "link_messages_select" on public.link_messages
  for select using (public.is_link_party(link_id));

drop policy if exists "link_messages_insert" on public.link_messages;
create policy "link_messages_insert" on public.link_messages
  for insert with check (sender_id = auth.uid() and read_at is null and public.is_link_party(link_id));
-- Ni modification ni suppression par les membres : la conversation fait foi.

-- Marquer comme lus les messages REÇUS sur un lien (seul changement permis).
create or replace function public.mark_link_messages_read(l uuid)
returns void
language sql security definer set search_path = public as $$
  update public.link_messages
     set read_at = now()
   where link_id = l and sender_id <> auth.uid() and read_at is null
     and public.is_link_party(l);
$$;
revoke execute on function public.mark_link_messages_read(uuid) from public, anon;
grant execute on function public.mark_link_messages_read(uuid) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'link_messages') then
      alter publication supabase_realtime add table public.link_messages;
    end if;
  end if;
end $$;
