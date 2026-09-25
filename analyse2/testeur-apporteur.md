# Audit — profil Apporteur d'affaires

Périmètre testé : `/apporteurs`, `/dashboard/apporteurs`, génération/partage de liens de parrainage
(picker « Lien pour une annonce », dialogue « Nouveau lien », QR, copie, e-mail), suivi clics/
conversions/gains, `src/lib/referral-links.ts`, `src/lib/dashboard-data.ts`, `src/lib/pricing/*`.
Méthode : lecture de code + sessions Playwright réelles sur `http://localhost:3002` (création d'un
lien pour `prop1`, clic effectif du lien généré avec `?ref=AP-7291`, vérification des compteurs avant/
après, captures desktop 1280×900 et mobile 360×780). Captures dans `SCRATCH/apporteur-*.png`.

Persona : Léo Martin (`CURRENT_USER`, rôles `proprietaire/hote/apporteur/formateur`), qui veut
comprendre comment il gagne de l'argent en recommandant des biens/prestations, et vérifier que les
gains affichés sont crédibles.

---

## 1. Le funnel s'arrête au clic — aucune conversion n'est jamais possible, vérifié en direct — CRITIQUE

`registerReferralClick` (`src/lib/context.tsx:389-397`) est le **seul** point d'écriture sur un
`ReferralLink` en dehors de la création : il incrémente `clicks`, et rien d'autre. `grep -rn
"conversions|earned" src/lib/context.tsx` ne retourne aucun résultat — nulle part dans le code
applicatif un événement (réservation confirmée, achat boutique, inscription formation, paiement) ne
transforme un clic en conversion ou en gain. Test en direct : création d'un lien pour `prop1`, visite de
`/explorer/prop1?ref=AP-7291` (la bannière « Vous suivez la recommandation d'un apporteur » s'affiche
bien, preuve que le tracking de clic fonctionne), retour sur `/apporteurs` → `Clics: 1` / **`Conv.: 0`**
/ **`Gagné: 0 CHF`**. Le troisième point du hero (« Part versée ») et toute l'section « Comment ça
fonctionne » promettent une boucle complète ; le produit ne permet d'expérimenter que le premier tiers.
Pour le persona testé — quelqu'un qui veut *comprendre comment il gagne de l'argent* — c'est la question
centrale, et il n'y a littéralement rien à cliquer ou observer qui y réponde au-delà du texte.

**Gravité : critique.**

## 2. Le « Total gagné » ne recoupe pas la somme des liens juste au-dessus, sur le même écran — CRITIQUE

Les 3 cartes de `DEFAULT_REFERRAL_LINKS` (`src/lib/referral-links.ts:17-48`) affichent chacune un
« Gagné » : 200 + 320 + 250 = **770 CHF**. Juste en dessous, la section « Résumé de ma rémunération »
(`src/app/(app)/apporteurs/page.tsx:222`, `totalCommissions = MOCK_APPORTS.reduce(...)`) additionne un
tableau totalement différent (`MOCK_APPORTS`, lignes 125-132) et affiche **« Total gagné : 1'034 CHF »**
— confirmé à l'écran en direct. Un utilisateur qui additionne mentalement ses trois cartes de liens et
compare au total affiché 10 cm plus bas obtient deux chiffres qui ne concordent pas, sans qu'aucun des
deux ne soit qualifié d'exemple ou d'estimation. Aucune dérivation partagée entre les deux jeux de
données (contrairement à `src/lib/demo/derive.ts`, qui existe précisément pour empêcher ce genre d'écart
ailleurs dans le produit).

**Gravité : critique — désaccord avec le principe même de « rien ne sonne faux ».**

## 3. Le bounty « hôte » vaut 60 CHF *et* 100 CHF sur le même écran — CRITIQUE

La carte « Amener un hôte » dit « Rémunération : **60 CHF** / hôte activé »
(`src/lib/referral-links.ts:20-26`, correctement câblée sur `HOST_BOUNTY_CHF` = 60, dérivé de
`BOUNTIES["host-activated"]` dans `src/lib/pricing/catalog.ts:138`). Plus bas, la grille « Types
d'apport » affiche pour le même intitulé « Bounty fixe **100 CHF** »
(`src/app/(app)/apporteurs/page.tsx:110`, chaîne codée en dur, jamais migrée vers `HOST_BOUNTY_CHF`).
Encore plus bas, la table « Mes apports » crédite deux conversions « Amener un hôte » (Marc Dupont,
Pierre Blanc) à **100 CHF** chacune (`page.tsx:126,129`). Trois lectures du même montant, sur le même
écran, avec deux valeurs différentes. Le commentaire à la ligne 118-124 du même fichier calibre
explicitement ces montants sur « bounty fixe 100 CHF » — c'est-à-dire l'ancien modèle, jamais mis à jour
quand `HOST_BOUNTY_CHF` est passé de 100 à 60 (voir point 4).

**Gravité : critique.**

## 4. Le discours « dès activation » contredit le modèle anti-fraude documenté dans le code — MAJEUR, désaccord

`src/lib/pricing/catalog.ts:130-136` est explicite : les primes (`BOUNTIES`) sont « Versées **après un
premier encaissement réel**, jamais à l'activation. La fraude d'auto-parrainage est un coût, pas une
hypothèse ». C'est un changement de modèle documenté et volontaire (l'ancien `HOST_BOUNTY_CHF` valait
100 CHF « à l'activation », il vaut maintenant 60 CHF après premier encaissement). Mais le texte
utilisateur ne l'a jamais suivi : `src/lib/referral-links.ts:21` dit « Prime fixe de 60 CHF **dès
activation du compte** » ; `src/lib/dashboard-data.ts:406` dit « 60 CHF **/ activation** ». Le montant a
été corrigé, la condition de versement — pourtant le point que le fondateur juge assez important pour le
documenter comme un garde-fou anti-fraude — ne l'a pas été, à deux endroits distincts. Un apporteur qui
lit cette carte croit être payé dès qu'un hôte crée un compte ; le modèle réel dit qu'il faut que cet
hôte encaisse un premier paiement.

**Gravité : majeure — désaccord entre le commentaire de garde-fou et le texte réellement affiché.**

## 5. Deux classements d'apporteurs incompatibles pour le même utilisateur, le même jour — CRITIQUE

`/apporteurs` (`src/app/(app)/apporteurs/page.tsx:149-160`, `LEADERBOARD`) classe « vous » (Léo M.)
**4ᵉ sur 8**, par nombre d'apports (28), sans aucun montant CHF — le commentaire aux lignes 139-148
explique explicitement que les montants (4 200 / 3 380 / 3 010 CHF) ont été retirés parce que
« ce n'est pas les données d'un utilisateur sur son propre écran — c'est E-Dome qui affirme avoir versé
des milliers de francs à un réseau d'apporteurs actif », d'où le badge « Exemple de classement ».
`/dashboard/apporteurs` (`src/lib/dashboard-data.ts:418-423`, `leaderboard`) classe la même personne
**2ᵉ sur 4**, avec des montants CHF nommés et bien réels en apparence (Laura M. 15'200 CHF, Léo M.
9'500 CHF, Jean-Pierre D. 8'700 CHF, Nadia S. 6'100 CHF), **sans aucun badge « exemple »** — exactement
le pattern que l'autre écran vient de justifier avoir supprimé. Même personne, même journée, deux rangs
différents (2ᵉ vs 4ᵉ), deux ensembles de concurrents différents (Sarah K., Thomas R., Amina K., Patrick
L. n'existent que sur un des deux écrans), et une des deux versions réintroduit précisément le problème
que l'autre a corrigé et documenté.

**Gravité : critique — désaccord direct entre deux écrans du même parcours, l'un contredisant la
justification écrite de l'autre.**

## 6. Bug visuel confirmé en direct : « Léo M. · vous (vous) » — MAJEUR

Sur `/dashboard/apporteurs`, le nom affiché est **« Léo M. · vous (vous) »** (confirmé desktop et
mobile). `src/lib/dashboard-data.ts:420` code le nom en dur avec `"Léo M. · vous"` déjà inclus, et
`src/app/(app)/dashboard/apporteurs/page.tsx:155` et `:175` ajoutent un second `(vous)` conditionnel sur
`isCurrentUser`. C'est très exactement le bug que `src/app/(app)/apporteurs/page.tsx:152-154` a déjà
rencontré et corrigé sur l'autre écran (commentaire : « Note : nom sans " (Vous)" — le rendu ajoute deja
le tag (vous) en bleu via isYou. Avoir les deux donnait "Leo M. (Vous) (vous)" ») — le correctif n'a
simplement pas été reporté sur son écran jumeau.

**Gravité : majeure — régression connue et documentée ailleurs dans le même dépôt, non appliquée ici.**

## 7. Badge KPI absurde : « Déjà versé... +497 % » — MAJEUR

`src/app/(app)/dashboard/apporteurs/page.tsx:60-66` : la carte « Déjà versé » affiche un `delta` calculé
comme `Math.round((apporteurSummary.alreadyPaid / apporteurSummary.earnedThisMonth) * 100)`, avec
`trend="up"` — visuellement identique au badge « +26 % » de croissance mensuelle de la carte voisine.
Avec les valeurs du jour (929 CHF déjà versé / 187 CHF ce mois), cela affiche **« 497 % »** avec une
flèche montante. Ce n'est pas un taux de croissance, c'est un ratio de deux montants sans rapport
(cumulé vs mensuel) déguisé en badge de tendance — confirmé à l'écran, desktop et mobile. Une personne
qui scanne rapidement les 4 cartes KPI lit « paiements en hausse de 497 % », ce qui n'a aucun sens et
n'est corroboré par rien.

**Gravité : majeure — chiffre visuellement trompeur, bien qu'techniquement « dérivé » et non codé en
dur.**

## 8. Le « 10 à 30 % » promis partout n'est jamais celui que le moteur de calcul canonique produirait — MAJEUR, désaccord

Toutes les surfaces apporteur (hero de `/apporteurs`, les 3 cartes de liens, les 6 cartes « Types
d'apport », l'étape 3 de « Comment ça fonctionne », l'étape 6 de `/publier`, l'encart « Devenez
apporteur » sur une fiche bien) citent **« 10 à 30 % »** via `APPORTEUR_SHARE_LABEL`
(`src/lib/pricing/legacy.ts:50`, marquée `@deprecated`). Le moteur que le code désigne lui-même comme
point d'entrée unique pour tout montant affiché — `src/lib/pricing/quote.ts:25-33`, dont le commentaire
explique qu'il existe précisément pour empêcher « le bouton Recommander [d'annoncer] 5 100 CHF pendant
que l'encart juste en dessous annonçait 48 à 143 CHF » — calcule la part apporteur avec des taux fixes
et différents : `APPORTEUR_SHARES` = 25 % (abonnement), 15 % (commission), 15 % (forfait)
(`src/lib/pricing/catalog.ts:110-117`). Sous ce modèle « canonique », **30 % n'est jamais atteignable**
(maximum réel : 25 %, et seulement sur un abonnement agence — pas un cas qu'un apporteur peut recommander
directement). De plus, `APPORTEUR_WINDOW_MONTHS = 12` (catalog.ts:126) plafonne la fenêtre de
rémunération à 12 mois — cette limite n'apparaît sur **aucun** écran apporteur. Enfin, `grep -rn
"hasApporteur" src` ne trouve aucun site d'appel qui le mette à `true` : le moteur « correct » n'est
jamais exécuté avec un apporteur réel nulle part dans l'app, donc le nombre que l'architecture du projet
considère comme la vérité n'est jamais celui montré à l'utilisateur.

**Gravité : majeure — désaccord entre l'architecture documentée comme garde-fou anti-contradiction et
ce qu'elle protège réellement.**

## 9. « Amener un prestataire » promet 100–500 CHF sans aucune existence dans le modèle de prix — MINEUR/MOYEN

`src/app/(app)/apporteurs/page.tsx:113` : carte « Amener un prestataire » → « Bounty fixe 100–500 CHF ».
`src/lib/pricing/catalog.ts:137-140` (`BOUNTIES`) ne définit que deux primes : `host-activated` (60 CHF)
et `user-activated` (15 CHF). Aucune prime « prestataire » n'existe où que ce soit dans le modèle de
tarification. Ce type d'apport est sélectionnable dans le dialogue « Nouveau lien » (`newLinkType`,
`page.tsx:739-746`) et génère un lien dont le libellé de rémunération est directement ce texte inventé.

**Gravité : mineure à moyenne — chiffre sans aucune assise dans le modèle économique documenté.**

## 10. Aucun moyen de créer un lien pour un prestataire ou un partenaire précis — MANQUE

Le picker « Lien pour une annonce » (`page.tsx:48-90`, `CATALOG_TABS`) ne couvre que
`bien/formation/evenement/produit`. Il n'existe aucune fiche prestataire individuelle dans l'app
(`src/app/(app)/services/` ne contient que `page.tsx` et `proposer/page.tsx`, pas de `[id]/page.tsx`) :
impossible de générer un lien traçable vers « ce photographe précis » ou « ce partenaire local précis »,
alors que 2 des 6 « Types d'apport » avancés portent exactement sur ce cas (« Amener un prestataire »,
« Partenariat local »). Seul un lien générique et vague reste possible pour ces deux types.

**Gravité : mineure — lacune fonctionnelle plutôt que bug, mais restreint concrètement ce que le
persona peut réellement faire.**

## 11. « Activation après KYC » n'a aucune existence dans le produit — MINEUR

Le hero de `/apporteurs` présente l'activation KYC comme « la première opt-in »
(`page.tsx:278`). `grep -rln "KYC" src/app` ne retourne que cette page : aucun flux de vérification
d'identité, aucun bouton « Activer mon compte apporteur », aucun état visible dans `/profil` ou
`/paramètres`. Léo arrive sur `/apporteurs` déjà pleinement « activé », historique et liens compris,
sans qu'aucune étape n'ait jamais été franchie. Le garde-fou avancé dans le texte n'est démontrable nulle
part (à distinguer du double opt-in vendeur, lui bien implémenté : toggle « Autoriser les apporteurs »
dans `src/app/(app)/publier/page.tsx:476-488`, qui fonctionne correctement).

**Gravité : mineure.**

## 12. Notification « Commission apporteur » pointe vers une route inexistante — MINEUR

`src/lib/mock-data.ts:2176-2183` (`notif-008`, « Commission de 740 CHF créditée pour le parrainage de
Fatima Zahra ») a pour `href` **`/dashboard/referrals`**. Cette route n'existe pas ; la seule page réelle
est `/dashboard/apporteurs` (`find "src/app/(app)/dashboard" -maxdepth 1 -type d"` le confirme). Cliquer
cette notification — probablement la plus alléchante pour ce persona, puisqu'elle annonce un gain
concret — mène à un 404.

**Gravité : mineure, mais tombe exactement sur le persona testé.**

## 13. Widgets flottants qui recouvrent les chiffres de gains — COSMÉTIQUE

Desktop 1280 px : la bulle « Expert IA » recouvre partiellement « Gagné : 250 CHF » sur la 3ᵉ carte de
lien (`SCRATCH/apporteur-06-qr-shown.png`). Mobile 360 px : les boutons flottants « Visite guidée » et
« Expert IA » chevauchent les cartes KPI « Déjà versé » / « En attente » de `/dashboard/apporteurs`
(`SCRATCH/apporteur-mob-dash-apporteurs.png`). Problème probablement transverse au site (pas spécifique
à l'apporteur), mais il atterrit précisément sur les montants que ce persona vient chercher.

**Gravité : cosmétique.**

---

## Ce qui fonctionne bien (pour équilibrer)

- Le tracking de clic est réellement câblé : `ReferralBanner` (`src/components/affiliate/referral-banner.tsx`)
  + `registerReferralClick` incrémentent bien le compteur `clicks` du lien correspondant, vérifié en
  direct (0 → 1 après une visite avec `?ref=`), avec dédoublonnage par `useRef` pour ne pas compter deux
  fois au même chargement.
- Le picker « Lien pour une annonce » (bien/formation/événement/produit) est bien fait : recherche,
  onglets, dédup visuel (bouton « Créé » si le lien existe déjà via `hasReferralLinkFor`), toast de
  confirmation — testé en direct sans erreur console.
- Le double opt-in vendeur (`/publier` étape 6, toggle « Autoriser les apporteurs ») est réellement
  implémenté et cohérent avec le discours de `/apporteurs`.
- Le cadrage juridique (pas de courtage, part prélevée sur E-Dome et non sur le prix, KYC + double
  opt-in) est un texte clair et correctement positionné avant que l'utilisateur ne s'engage.

---

## Réponses aux 4 questions

**(1) Cherché / trouvé ?** Le lien « Apporteurs » dans la sidebar mène directement à un écran complet et
lisible ; le picker par annonce est un bon réflexe produit. Trouvé rapidement.

**(2) Perdu / bloqué ?** Pas de blocage de navigation franc (un seul lien mort, point 12). Le vrai
blocage est narratif : après avoir cliqué son propre lien, rien ne montre ni ne simule *comment* ce clic
devient un jour une conversion (point 1) — on tourne en rond entre clic et « 0 conversion ».

**(3) Faux / vide / artificiel ?** Abondamment, et souvent sur le même écran en une seule vue : total
gagné qui ne recoupe pas la somme des cartes (point 2), bounty à deux valeurs (point 3), classement à
deux versions incompatibles (point 5), badge de tendance à 497 % (point 7), QR code qui n'est qu'un
encadré gris avec le texte « QR Code », modèle « 10-30 % » jamais atteint par le moteur de calcul
(point 8).

**(4) Manque ?** Une preuve — même simulée — qu'un clic peut devenir une conversion ; un lien
individuel vers un prestataire précis ; toute trace de la fenêtre de 12 mois et du vrai taux plafond
(25 %, pas 30 %) ; une activation KYC qui existe quelque part dans le produit.

---

## Désaccords avec le fondateur

- Le commentaire de `src/lib/dashboard-data.ts:425-427` affirme avoir corrigé la contradiction entre les
  trois montants du résumé (« Derive du journal ») — c'est vrai pour `apporteurSummary`, mais faux pour
  les deux classements et pour le total de `/apporteurs` (`MOCK_APPORTS`), qui n'ont jamais été migrés
  vers le même mécanisme et divergent toujours, y compris en interne à `/apporteurs` (point 2).
- `src/lib/pricing/quote.ts` est présenté dans son propre commentaire comme LA solution au problème de
  chiffres contradictoires entre écrans. Pour le pôle apporteur spécifiquement, il n'est jamais appelé
  (`hasApporteur` jamais `true`) : le problème qu'il est censé avoir réglé existe encore, intégralement,
  sur ce persona précis (point 8).
