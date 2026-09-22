-- ─── Table des manifestations d'intérêt (landing page) ──────────────────────
--
-- À exécuter dans l'éditeur SQL du projet Supabase.
--
-- Cette table est FERMÉE : la sécurité au niveau des lignes est activée et
-- aucune politique n'est créée. Conséquence voulue — ni la clé anonyme, ni un
-- utilisateur authentifié ne peuvent la lire ou y écrire. Seule la clé de
-- service y accède, et donc uniquement le serveur, via
-- `src/lib/leads/supabase-store.ts`.
--
-- C'est important ici : la table contient des données personnelles (nom,
-- adresse e-mail, canton, réponses métier) et un consentement horodaté.
--
-- Aucune adresse IP n'est stockée en clair. La limitation d'envoi s'appuie sur
-- la table `lead_submissions` définie plus bas, qui ne contient qu'un HMAC
-- salé de l'adresse (voir `src/lib/leads/rate-limit.ts`).

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- Couche 1 : commune à tous les profils.
  first_name         text        not null,
  email              text        not null,
  profile            text        not null,
  canton             text        not null,
  -- Renseigné seulement lorsque `canton` vaut « Hors de Suisse ».
  country            text,

  -- Couche 2 : réponses propres au profil, indexées par identifiant de
  -- question. En jsonb parce que les questions évoluent avec le contenu de la
  -- landing : ajouter une question ne doit pas imposer une migration.
  profile_answers    jsonb       not null default '{}'::jsonb,

  -- Couche 3 : identifiants des engagements cochés.
  engagements        text[]      not null default '{}',

  -- Consentement. `consent_at` est la preuve qui compte en cas de demande
  -- d'accès ou de suppression, pas la seule valeur booléenne.
  consent_privacy    boolean     not null default false,
  consent_at         timestamptz,
  consent_newsletter boolean     not null default false,

  -- Parrainage. `ref_code` appartient à cette personne ; `referred_by` est le
  -- code de celle qui l'a amenée. Pas de clé étrangère : un code peut circuler
  -- avant que son porteur existe en base, et un lien cassé ne doit pas faire
  -- échouer une inscription.
  ref_code           text        not null,
  referred_by        text,

  -- Provenance.
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  landing_path       text,

  -- Calculé côté serveur uniquement (`src/lib/leads/score.ts`).
  engagement_score   integer     not null default 0,

  constraint leads_email_key    unique (email),
  constraint leads_ref_code_key unique (ref_code),
  constraint leads_profile_check check (
    profile in ('agence', 'createur', 'prestataire', 'investisseur', 'proprietaire', 'equipe')
  ),
  -- Un enregistrement sans consentement ne devrait jamais exister : la
  -- contrainte le garantit même si le code applicatif régresse.
  constraint leads_consent_check check (consent_privacy is true and consent_at is not null)
);

-- L'unicité de l'e-mail est le véritable garde-fou contre les doublons : un
-- second envoi devient une mise à jour (voir `upsert` dans le store), le
-- compteur en mémoire n'étant pas fiable entre instances serverless.

create index if not exists leads_created_at_idx     on public.leads (created_at desc);
create index if not exists leads_profile_idx        on public.leads (profile);
create index if not exists leads_score_idx          on public.leads (engagement_score desc);
create index if not exists leads_referred_by_idx    on public.leads (referred_by);
-- Index GIN : nécessaire pour filtrer par engagement avec l'opérateur @>
-- (« a coché tel engagement ») dans l'admin.
create index if not exists leads_engagements_gin_idx on public.leads using gin (engagements);

-- `updated_at` tenu à jour par la base, pour rester juste même si une écriture
-- passe un jour à côté du code applicatif.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ─── Fermeture des accès ────────────────────────────────────────────────────
-- RLS activée SANS aucune politique : tout accès par la clé anonyme ou par un
-- utilisateur authentifié est refusé. La clé de service n'est pas soumise à
-- RLS, elle continue de fonctionner côté serveur.
alter table public.leads enable row level security;

-- Ceinture et bretelles : on retire aussi les privilèges de table aux rôles
-- exposés publiquement par l'API, au cas où une politique serait ajoutée par
-- inadvertance un jour.
revoke all on table public.leads from anon, authenticated;


-- ─── Limitation des envois ──────────────────────────────────────────────────
--
-- Le compteur vivait en mémoire du processus. Sur un hébergement sans état,
-- deux requêtes successives tombent volontiers sur deux instances
-- différentes, et une instance froide démarre le compteur à zéro : la limite
-- ne tenait pas. Elle est ici, donc partagée.
--
-- `ip_hash` est un HMAC-SHA256 de l'adresse IP, calculé avec le secret
-- `LEAD_IP_SALT`. Ce n'est pas un simple condensé, et la distinction compte :
-- il n'existe que quatre milliards d'adresses IPv4, qu'un condensé nu laisse
-- retrouver par force brute en quelques minutes. Sans le sel, une empreinte
-- ne mène à rien, même pour qui lit la table.
--
-- Si `LEAD_IP_SALT` n'est pas configuré, l'application n'écrit rien ici et
-- retombe sur un compteur en mémoire : mieux vaut une limite faible qu'un
-- condensé réversible en base.

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz not null default now()
);

-- L'index porte les deux colonnes du filtre : empreinte, puis fenêtre de
-- temps. Il sert aussi la purge, qui balaie par date.
create index if not exists lead_submissions_ip_hash_created_at_idx
  on public.lead_submissions (ip_hash, created_at desc);

comment on table public.lead_submissions is
  'Compteur d''envois du formulaire. Empreintes HMAC salées, jamais d''adresse IP.';

-- L'application purge les empreintes de plus de 24 h, au hasard d'un envoi
-- sur vingt. Si vous préférez une purge régulière et indépendante du trafic,
-- pg_cron fait l'affaire :
--
--   select cron.schedule(
--     'purge-lead-submissions', '0 4 * * *',
--     $$delete from public.lead_submissions where created_at < now() - interval '24 hours'$$
--   );

-- Même régime de fermeture que `leads`.
alter table public.lead_submissions enable row level security;
revoke all on table public.lead_submissions from anon, authenticated;
