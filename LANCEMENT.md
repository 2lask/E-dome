# Lancement — mercredi 25 novembre 2026

**Focus unique : l'apport d'affaires et les commissions.** Un bien mis en valeur
(photos, vidéo, informations), des apporteurs qui le recommandent avec un lien
tracé, un parcours de vente suivi jusqu'à l'acte, une commission calculée et
réglée, et un tableau de bord qui montre tout en temps réel.

Rien n'est effacé : les autres pôles (recherches, dossier, déménagement,
agence) restent dans le code mais sortent de la navigation jusqu'après le
lancement.

## 1. Cadre légal (vérification rapide, à faire confirmer par un avocat)

| Point | Constat | Conséquence produit |
|---|---|---|
| Courtage (art. 412–418 CO) | Le courtier d'**indication** signale une occasion de conclure ; c'est un contrat légal en Suisse. | La commission d'apport est un **courtage d'indication**. Accord accepté en ligne par le vendeur (horodaté). |
| Autorisation | Aucune autorisation fédérale. Pas de loi cantonale de courtage à Genève (projet PL 13732 déposé en déc. 2025, pas en vigueur). Le **Tessin** soumet le courtage immobilier à une autorisation de fiduciaire. | Lancement NE et VD. **Tessin exclu.** Genève : surveiller PL 13732. |
| Quand la commission est due (art. 413 CO) | Quand le contrat (vente) est **conclu grâce** à l'indication ; il faut un **lien de causalité**. Règle dispositive : les parties peuvent convenir autre chose. | Par défaut, due **à la conclusion** (vente signée). Le lien tracé et la mise en relation horodatée **prouvent la causalité**. Option « due à l'acceptation du contact » pour un montant fixe. |
| Montant | Fixe ou pourcentage, libre ; le juge peut réduire une commission excessive (art. 417 CO). | Fixe de 50 à 50'000 CHF, ou de 0,1 % à 3 % du prix de vente (plafond prudent). Le pourcentage n'est possible que pour une vente. |
| Location | Frais à la charge du locataire encadrés selon les cantons. | En location : montant **fixe payé par le propriétaire** seulement. |
| Fonds | E-Dome ne détient pas l'argent (pas d'intermédiation financière). | Règlements directs (TWINT, virement), suivis et confirmés ; prestataire agréé plus tard. |
| Données (nLPD) | Les leads sont des données personnelles. | Consentement du contact, coordonnées révélées seulement aux parties, suivi des visites **sans adresse IP** (identifiant aléatoire). |

Sources : weka.ch (courtage immobilier), lawinside.ch (courtage d'indication), droitpourlapratique.ch (art. 413 et 417 CO), ge.ch (PL 13732), my-swiss-company.com (Tessin). **À valider par un avocat** avant d'annoncer des commissions en pourcentage.

## 2. Ce qui est livré pour le 25

1. **Commission v2** : fixe ou pourcentage, déclencheur (conclusion ou acceptation), conditions acceptées par le vendeur.
2. **Lien d'apporteur tracé** par bien : visites, partages et leads attribués automatiquement (60 jours).
3. **Parcours de vente** : lead → contacté → visite → offre → vendu (prix final) ou perdu. À « vendu », la commission est **calculée et créée automatiquement** comme règlement dû à l'apporteur.
4. **Tableau de bord temps réel** : vues, visiteurs, leads, conversion, entonnoir, ventes, chiffre d'affaires, commissions, bénéfice net ; par bien et par apporteur. Mise à jour en direct (Supabase Realtime).
5. **Page de bien vitrine** : grand visuel ou vidéo en fond, galerie, vidéo, chiffres clés, carte, compteur de vues, bloc apporteur « recommandez et gagnez ».
6. **Navigation recentrée** et finitions de design.

## 3. Ce que le fondateur doit faire avant le 25

- [ ] Coller `supabase/APPLIQUER-TOUT.sql` dans Supabase (inclut la migration 009), puis `npm run db:check`.
- [ ] Variables Vercel : `EDOME_ADMIN_EMAILS`, `NEXT_PUBLIC_SITE_URL`, et Resend (`RESEND_API_KEY`, `EDOME_EMAIL_FROM`).
- [ ] Publier 5 à 10 vrais biens (photos, vidéo si possible, commission).
- [ ] Faire relire par un avocat : conditions de commission, `JURIDIQUE-A-VALIDER.md`.
- [ ] Donner le feu vert pour **fusionner `feat/plateforme-v2` dans `master`** (= mise en production Vercel).
