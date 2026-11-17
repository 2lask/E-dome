# PLAN V1 — « E-Dome Pro » (plan de transformation)

*Plan d'exécution de la version 1 décidée dans [STRATEGIE.md](STRATEGIE.md)
(tête de pont validée par le fondateur le 2026-11-17). Un chantier = un commit,
poussé, portes de qualité vertes à chaque fois, vérification à l'écran, URL de
préproduction donnée. Rien n'est fusionné, la landing n'est jamais touchée.*

## Périmètre V1 (rappel)
Le parcours **professionnel** complet et réel : compte pro, **vitrine publique**,
**gestion d'annonces**, **copilote IA**, **abonnement (simulé)**. Cible : agents
et petites agences de **Suisse romande**. Tout le reste est parqué (sans être
supprimé) et ordonné en roadmap V2→V5.

## Portes de qualité (à chaque chantier)
`npm run typecheck` · `npm run lint` · `npm run build` · `npm run test:data` ·
Playwright · bandeau « données fictives » présent tant que la donnée est mock ·
zéro affirmation de traction · aucun bouton mort · 360 px → grand écran · a11y.

---

## Les chantiers, dans l'ordre des dépendances

### C1 — Recentrage produit autour du Pro  *(sans backend, réversible — prêt)*
- Navigation principale (`sidebar-whop`, `mobile-nav`, `header`) recentrée sur le
  parcours pro : **Accueil · Ma vitrine · Mes annonces · Copilote IA · Abonnement**
  (plus le réseau/feed minimal).
- **Parquer hors nav principale** (code conservé, routes vivantes, marquées
  « bientôt / démonstration ») : apporteurs, boutique, événements/lives, courte
  durée. **Différer** sous une entrée « Bientôt » : formations, services,
  investisseurs.
- Bandeau de démonstration : nommer la V1 (« E-Dome Pro — démonstration »).
- **Aucune suppression de fichier.** Tout est réversible par la nav.
- *Livrable : 1 commit. Porte : gates vertes, parcours pro cohérent de bout en
  bout en mode démo.*

### C2 — Provision Supabase  *(action du fondateur)*
- Créer le projet, renseigner les 3 clés (local + Vercel), exécuter `leads.sql`
  puis `schema.sql`, activer Google. Guide : [BACKEND-SETUP.md](BACKEND-SETUP.md).
- Dès que fait : inscription/connexion réelles, profil créé en base à
  l'inscription. *Je vérifie contre la vraie base.*

### C3 — La face pro sur la vraie base  *(backend, après C2)*
- `getCurrentUser()` branché : l'**en-tête montre la personne connectée**.
- `/profil` = **la vraie vitrine** de la personne (lecture/écriture en base).
- `/publier` + `/dashboard/annonces` : les annonces **s'écrivent en base** ; la
  vitrine publique `/profil/[id]` et l'explorer pro les affichent.
- Le sélecteur « être un profil » reste en démo et s'efface quand on est connecté.
- *Livrable : 2–3 commits. Porte : un pro réel crée un compte, publie une
  annonce, elle survit, elle apparaît sur sa page publique.*

### C4 — Le copilote IA en situation pro  *(après C3)*
- L'assistant IA travaille sur les **vraies annonces du pro** ; mettre en avant
  les cas d'usage : estimer (comparables), **rédiger une annonce**, qualifier.
- *Porte : un pro obtient une estimation et une annonce rédigée sur son bien.*

### C5 — L'abonnement bout en bout (simulé)  *(après C3)*
- `/tarifs` par rôle → choix de formule → **simulation d'activation** → l'état
  d'abonnement **gate** les fonctions (plafonds déjà dans `catalog.ts`).
- **Pas de Stripe** (gelé jusqu'au juridique + société).
- *Porte : passer de Présence à Vitrine change ce qui est débloqué, sans argent
  réel, avec la mention « paiement simulé ».*

### C6 — Onboarding pro réel + honnêteté  *(après C3–C5)*
- Tunnel « créer mon compte pro » clair ; états vides soignés ; mentions
  « bientôt » cohérentes partout ; QA 360 px→desktop ; a11y ; chasse aux
  incohérences ; tests utilisateurs simulés.

### C7 — Juridique, question étroite  *(action du fondateur + avocat, en parallèle)*
- Faire valider **d'abord** la question de l'abonnement indexé au volume
  (hors courtage ?) — `JURIDIQUE-A-VALIDER.md §1`. Moins cher et plus rapide que
  tout le modèle apporteur.
- Feu vert → chantier ultérieur **Stripe** (paiements réels) + constitution de la
  société.

---

## Dépendances
```
C1 (recentrage, sans backend)  ─ prêt, indépendant
C2 (provision Supabase) ─ fondateur ─► C3 (face pro en base) ─► C4 (IA pro)
                                                              └► C5 (abonnement simulé) ─► C6 (onboarding + QA)
C7 (juridique) ─ fondateur + avocat, en parallèle ─► (plus tard) Stripe + société
```

## Ce que j'attends du fondateur (actions humaines)
1. **Provisionner Supabase** (C2) — débloque tout le cœur V1 vérifiable.
2. **Mandater un avocat** pour la question étroite de l'abonnement (C7).
3. Plus tard : **constituer la société**, décider les prix finaux, fournir le
   contenu dont tu es propriétaire. (Détail dans `STRATEGIE.md §9`.)

*Mis à jour à chaque chantier terminé.*
