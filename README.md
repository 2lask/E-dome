# E-Dome

Plateforme immobilière (maquette interactive) et sa page d'accueil publique.

- Application : Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- Code applicatif : `src/` uniquement
- Déploiement : projet Vercel `plateforme`, connecté à Git. **Un push sur `master` déclenche la mise en production** (`https://edome-demo.vercel.app`).

```bash
npm install
npm run dev        # http://localhost:3002
npm run lint       # ESLint — strict sur le code neuf, avertissements sur l'existant
npm run typecheck  # tsc --noEmit
npm run build
```

> La maquette (`/feed`, `/explorer`, `/dashboard`, …) fonctionne sur des
> **données fictives**. Aucun backend n'est branché à ce jour.

---

## Landing page

La page d'accueil `/` présente le projet, dit où il en est et recueille des
manifestations d'intérêt qualifiées.

### Modifier les textes

**Tout le contenu est dans un seul fichier : [`src/content/landing.ts`](src/content/landing.ts).**

Titres, paragraphes, libellés de boutons, badges des pôles, statuts de la
frise, questions du formulaire, options et tranches de réponse, FAQ, page de
remerciement, métadonnées SEO. Aucun texte n'est écrit en dur dans les
composants.

Quelques points utiles :

| Ce que vous voulez changer | Où |
|---|---|
| Un pôle « Au lancement » plutôt qu'« Ensuite » | `solution.poles[].availability` |
| Une étape de la frise terminée ou en cours | `roadmap.steps[].status` |
| Ajouter ou retirer une question du formulaire | `form.profileQuestions[profil]` |
| Le barème du score d'engagement | `form.engagement[].weight` |
| Les avantages des membres fondateurs | `founding.perks` |

Deux règles à respecter en éditant :

1. **Aucun chiffre de traction** — pas de nombre d'inscrits, pas de montants
   gagnés, pas de compteur. Le projet n'a pas encore de traction réelle.
2. Toute promesse tarifaire reste marquée `À CONFIRMER`. La clé
   `founding.pricingNote` est volontairement vide : le bloc n'apparaît que si
   vous la remplissez.

Ajouter une question au contenu suffit : elle est automatiquement validée
côté serveur et exportée dans le CSV, sans toucher au code.

### Remplacer les visuels

Les emplacements réservés affichent un cadre marqué `TODO visuel`. Déposez les
fichiers dans `public/landing/`, puis passez leur chemin en `src` au composant
`PlaceholderVisual` (hero et encart démo). Le rendu bascule alors sur
`next/image`.

`public/landing/og.png` est un aplat provisoire de 1200×630 — remplacez le
fichier, pas le chemin.

### Variables d'environnement

Copiez `.env.local.example` en `.env.local`. Aucune n'est nécessaire pour
afficher la landing ; elles le deviennent pour enregistrer les inscriptions.

| Variable | Rôle | Sans elle |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Projet Supabase | Repli fichier en développement, **échec en production** |
| `SUPABASE_SERVICE_ROLE_KEY` | Écriture serveur dans `leads`. **Jamais exposée au client** | Idem |
| `ADMIN_PASSWORD` | Accès à `/admin/leads` | La page affiche « aucun mot de passe configuré » |
| `LEAD_IP_SALT` | Sel du hachage des adresses IP pour la limite de débit | Repli sur un compteur en mémoire, non partagé entre instances |
| `NEXT_PUBLIC_BASE_URL` | URL canonique et liens de parrainage | Déduite des en-têtes de la requête |
| `NEXT_PUBLIC_BOOKING_URL` | Prise de rendez-vous sur `/merci` | Le bouton n'apparaît pas |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Mesure d'audience Plausible | Aucun script chargé, aucun cookie |
| `NEXT_PUBLIC_POSTHOG_KEY` | Mesure d'audience PostHog | Idem |

> Activer PostHog impose une bannière de consentement **et** une mise à jour de
> la politique de confidentialité, qui affirme aujourd'hui n'utiliser aucun
> traçage tiers. Plausible ne pose pas de cookie.

### Mise en place de Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. **Project Settings → API** : copiez l'URL du projet et la clé `service_role`.
3. Renseignez `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.
4. Ouvrez l'éditeur SQL et exécutez [`supabase/leads.sql`](supabase/leads.sql).

Le script crée la table `leads`, ses index, un déclencheur `updated_at`, et
**active la sécurité au niveau des lignes sans aucune politique**. C'est
volontaire : ni la clé anonyme ni un utilisateur authentifié ne peuvent lire
cette table. Seul le serveur y accède, par la clé de service.

Sans configuration, en développement, les inscriptions sont écrites dans
`.leads.local.json` (ignoré par git) avec un avertissement en console. En
production, l'envoi échoue explicitement plutôt que de perdre des
inscriptions en silence — le système de fichiers de Vercel est éphémère.

Pour brancher un autre back-end (Airtable, Notion, une API maison), écrivez
une implémentation de `LeadStore` (`src/lib/leads/types.ts`) et déclarez-la
dans `src/lib/leads/store.ts`.

### Accéder aux inscriptions

`/admin/leads`, protégée par `ADMIN_PASSWORD`. La page n'est liée depuis aucun
endroit du site, est en `noindex` et absente du plan du site.

Compteurs, répartitions par profil, par engagement et par source, filtres
(profil, engagement, score minimum) et export CSV. Le CSV utilise le
point-virgule et une marque d'ordre des octets, pour s'ouvrir correctement
dans Excel en français.

Changer `ADMIN_PASSWORD` invalide immédiatement toutes les sessions ouvertes.

### Limite de débit

Cinq envois par heure et par adresse. Le compteur est tenu en base, dans
`lead_submissions`, donc partagé entre toutes les instances — un compteur en
mémoire ne limite rien sur un hébergement sans état.

L'adresse IP n'est jamais enregistrée : seule une empreinte HMAC-SHA256 l'est,
calculée avec `LEAD_IP_SALT`. Le sel n'est pas décoratif — il n'existe que
quatre milliards d'adresses IPv4, qu'un condensé nu laisse retrouver par force
brute en quelques minutes.

Sans sel configuré, rien n'est écrit en base et le compteur retombe en
mémoire, avec une erreur en console. Mieux vaut une limite faible qu'un
condensé réversible en base.

### Parrainage et provenance

Chaque inscription reçoit un code court. Arriver par `?ref=CODE` dépose un
cookie de 30 jours, enregistré comme parrain à l'envoi du formulaire. Les
paramètres `utm_*` sont conservés le temps de la visite. La page `/merci`
affiche le lien personnel à partager.

### Structure

```
src/content/landing.ts              tous les textes
src/components/landing/             une section par composant
  interest-form/                    formulaire en trois étapes
src/lib/leads/                      schéma, score, parrainage, stockage, action
src/lib/analytics.ts                mesure, inactive sans variable
src/app/page.tsx                    la landing
src/app/merci/                      confirmation et partage
src/app/admin/leads/                administration
supabase/leads.sql                  schéma de la table
```

### Qualité

`npm run lint` est vert par construction : strict sur le code neuf, les
violations du code existant sont en avertissement. Elles ne sont pas du bruit
à ignorer — elles recensent une dette réelle, dont six violations de
`rules-of-hooks`. Le détail et le parti pris sont documentés dans
[`eslint.config.mjs`](eslint.config.mjs).
