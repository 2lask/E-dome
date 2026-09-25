# Test terrain — Particulier cherchant un appartement à louer (longue durée), arc lémanique

Persona : je cherche un 2-3 pièces à louer en longue durée quelque part entre Genève et Lausanne (voire Montreux/Nyon). Parcours testé : `/explorer` (filtres, tri, carte) → une fiche bien `location-lt` via `/explorer/[id]` → `/recherche` → `/favoris` → `/messages` (contacter un propriétaire) → `/reseau`. Tests faits en live sur `localhost:3002` avec Playwright (desktop 1280×900 et mobile 360×780), plus lecture du code source pour identifier les causes exactes.

Rôle actif dans l'app au moment du test : « Particulier » (déjà sélectionné par défaut dans le panneau démo). Devise CHF, langue FR.

---

## 0. Le constat qui chapeaute tout : il n'y a que 2 biens en location longue durée, et aucun dans l'arc lémanique

`src/lib/mock-data.ts` contient 22 biens. Un seul `grep` sur `transactionType` suffit à le voir : 12× `'vente'`, 4× `'location-ct'` (court séjour), et **seulement 2× `'location-lt'`** :

- `src/lib/mock-data.ts:534-560` — `prop7`, « 3.5 pièces lumineux au bord du lac », **Neuchâtel**, 1'850 CHF/mois.
- `src/lib/mock-data.ts:781-807` — `prop14`, « 2.5 pièces meublé proche université », **Neuchâtel**, 1'350 CHF/mois.

Les deux loyers sont crédibles pour Neuchâtel (~20-25 CHF/m²/mois, cohérent avec le marché réel — bon point, quelqu'un a fait attention aux ordres de grandeur). Mais **aucun des deux n'est dans l'arc lémanique** (Genève, Lausanne, Montreux, Nyon, Vevey...) — qui est pourtant la zone géographique que j'étais censé chercher, et que le produit met lui-même en avant ailleurs (`POPULAR_SEARCHES` dans `src/app/(app)/recherche/page.tsx:80-81` propose littéralement « Villa Lausanne » et « Appartement Genève » comme recherches populaires).

**Gravité : bloquant.** Un vrai locataire lémanique ouvrant cette maquette ne trouve *rien* qui corresponde à sa recherche géographique. Sur 22 biens, 0% de l'offre locative longue durée couvre la zone que la marque met en avant. Toute la suite du test (filtres, tri, fiche bien) porte donc forcément sur les 2 seuls biens neuchâtelois disponibles — ce n'est pas un choix de ma part, c'est la seule option.

---

## 1. `/explorer` — recherche et filtres

### 1.1 Les filtres eux-mêmes fonctionnent
Testé en live : onglet « Louer » → 2 biens (Neuchâtel uniquement) ; tri prix croissant/décroissant, surface, note → cohérent ; preset de prix « < 200 » (CHF) → 0 bien (comportement correct, le filtre marche techniquement).

### 1.2 Mais deux filtres visibles en mode « Louer » sont des pièges à 0 résultat
- **`src/app/(app)/explorer/page.tsx:186`** — `if (filterDpe.length) r = r.filter((p) => p.analytics?.dpe && filterDpe.includes(p.analytics.dpe));`
  Les biens `location-lt` (`prop7`, `prop14`) n'ont **pas de champ `analytics`** du tout (voir `mock-data.ts:534-560` et `:781-807` : pas de bloc `analytics: {...}` contrairement aux biens `vente`). Testé en live : onglet Louer + DPE « A » → **0 bien**, avec le message générique « Aucun bien trouvé. Élargissez vos critères. » Rien n'indique à l'utilisateur que la classe énergétique n'est simplement jamais renseignée sur les locations — il croira avoir mal filtré ou que l'app est cassée.
  **Gravité : important.** Filtre visible, cliquable, qui vide silencieusement les résultats pour 100% des biens en location.

- **`src/app/(app)/explorer/page.tsx:389-397`** — le filtre « Rendement » (rendement brut minimum) reste affiché et actif dans la barre de filtres **quel que soit l'onglet transaction sélectionné**, y compris « Louer ». C'est un filtre d'investisseur (rendement locatif brut sur un achat) qui n'a aucun sens pour quelqu'un qui loue. Il n'est pas grisé, pas masqué, pas même annoté « biens à la vente uniquement » dans son libellé bouton (seulement dans le texte d'aide sous le dropdown, `:396`, qu'on ne voit qu'en l'ouvrant). Un locataire qui l'essaie tombera sur le même type de résultat vide que pour le DPE.
  **Gravité : cosmétique/important.** Ce n'est pas bloquant (on peut l'ignorer), mais ça dilue la barre de filtres avec un outil hors-sujet pour mon profil, et ça n'inspire pas confiance dans le ciblage du produit.

### 1.3 Presets de prix pas calibrés pour la location longue durée suisse
`src/app/(app)/explorer/page.tsx:100` — pour la location (`isRent`), les presets sont `< 200`, `200 – 500`, `500 – 2 000`, `> 2 000` (CHF). Ces mêmes presets servent à la fois pour `location-ct` (prix/nuit, où « < 200 » est pertinent) et `location-lt` (prix/mois, où aucun loyer réel en Suisse romande ne descend sous 800-1000 CHF/mois). Le preset « < 200 » n'a aucun sens en mode Louer longue durée — vide garanti.
**Gravité : cosmétique.** Les presets ne distinguent pas court/long séjour alors que les échelles de prix n'ont rien à voir.

---

## 2. Fiche bien `location-lt` (`/explorer/prop7`, `/explorer/prop14`)

### 2.1 Pas de bloc CTA dédié dans la colonne latérale — contrairement à vente et location-ct
`src/app/(app)/explorer/[id]/page.tsx` — la colonne latérale (`<aside>`, ligne 1034) contient un bloc conditionnel pour `location-ct` (widget de réservation avec calendrier, lignes 1036-1125) et un bloc conditionnel pour `vente` (visite/offre, lignes 1128-1158). **Il n'existe aucun bloc équivalent pour `location-lt`.** Pour un bien en location longue durée, l'aside saute directement à la « Host card » (contact générique, ligne 1161+) : pas de récap de loyer dans la sidebar, pas de bouton « Planifier une visite » (qui existe pourtant pour `vente`, alors que visiter avant de signer un bail est au moins aussi pertinent que pour un achat), pas de CTA nommé.
**Gravité : important.** Le parcours "vente" et "court séjour" ont un CTA clair et dédié ; le parcours "location longue durée" — pourtant mon cas — se retrouve avec le traitement le moins soigné des trois, alors que 100% des biens réellement adaptés à cette persona sont dans cette catégorie.

### 2.2 Bug mobile bloquant : le bouton « Réserver » sticky mène à une impasse
`src/app/(app)/explorer/[id]/page.tsx:1466-1476` — la barre CTA sticky mobile affiche un bouton « Réserver » pour tout bien qui n'est pas `vente` (donc aussi pour `location-lt`), avec la même logique que pour `location-ct` :
```
onClick={() => {
  if (!checkIn || !checkOut) { addToast("Sélectionnez vos dates.", "warning"); return; }
  router.push("/paiement");
}}
```
Or le calendrier qui permet de renseigner `checkIn`/`checkOut` n'existe que pour `location-ct` (bloc gardé par `property.transactionType === "location-ct"`, ligne 786). **Sur mobile, pour `prop7`/`prop14`, il n'y a strictement aucun moyen de renseigner une date.** J'ai reproduit en live (viewport 360×780) : je scrolle jusqu'en bas de la fiche `prop7`, je tape sur « Réserver » → toast « Sélectionnez vos dates. » en boucle, pour toujours. Le bouton principal de la fiche, sur mobile, est un cul-de-sac permanent.
**Gravité : bloquant.** C'est le bouton le plus visible de l'écran (barre fixe en bas, toujours à l'écran) et il ne mène jamais nulle part pour ce type de bien, sur le device que la plupart des vrais chercheurs de logement utilisent en premier.

### 2.3 Prix sans unité sur la barre sticky mobile
Même bloc, lignes 1449-1456 : le label « par nuit » n'est affiché que pour `location-ct` (`{property.transactionType === "location-ct" && <span>...par nuit</span>}`). Pour `location-lt`, la barre sticky mobile montre juste **« 1'850 CHF »** sans « /mois » (vérifié en live sur `prop7` mobile — confirmé : le montant apparaît nu juste au-dessus du bouton « Réserver » cassé). Sur desktop, le prix en haut de fiche affiche bien « par mois » (ligne 415-417) — l'incohérence est spécifique au mobile.
**Gravité : cosmétique.** Ambigu mais pas trompeur au point de faire une erreur d'action (contrairement au 2.2).

### 2.4 « Biens similaires » n'a aucun sens pour une location longue durée
`src/lib/mock-data.ts:2696-2709`, fonction `getSimilarProperties` : elle cherche d'abord des biens de même `transactionType`, et si moins de 3 trouvés (ce qui est **toujours** le cas pour `location-lt`, puisqu'il n'y en a que 2 au total), elle bascule sur un fallback « même pays ». Résultat vérifié en live sur la fiche `prop7` (1'850 CHF/mois, Neuchâtel) : la section « Biens similaires » propose
- une villa à **Lausanne à 1'450'000 CHF** (vente),
- un studio **à Genève, 120 CHF/nuit** (court séjour),
- un chalet **à Verbier, 850 CHF/nuit** (court séjour).

Aucun de ces trois biens n'est comparable en type de transaction, en échelle de prix, ni en ville. Pour quelqu'un qui cherche un loyer mensuel à 1'850 CHF, se voir recommander un bien à 1,45 million est la meilleure façon de comprendre que le module « biens similaires » est un algorithme de démonstration qui n'a pas été pensé pour ce cas — ça « sonne faux » immédiatement.
**Gravité : important.** C'est visible sur la seule vraie fiche bien pertinente pour ma recherche, et ça casse la confiance juste après avoir lu la fiche.

### 2.5 Positif à noter
- Les avis (`getReviewsForProperty`) sur `prop7` sont cohérents avec le contexte locatif (« idéal pour une location longue durée », « propriétaire réactif ») — quelqu'un a écrit ces avis en pensant spécifiquement à ce bien, pas du texte générique copié-collé.
- Le prix, le plan des pièces, les équipements (buanderie, cave, parking vélo) sont plausibles et du niveau de détail attendu pour la Suisse.
- Le badge « Location longue durée » (ligne 427) est correctement affiché dans les badges de la fiche.

---

## 3. Contacter le propriétaire — le vrai test, et le vrai échec

C'est le point le plus grave du test : **impossible, en tant que particulier, de faire aboutir un contact avec le propriétaire d'un bien en location longue durée.** Reconstitué et vérifié en live, étape par étape.

### 3.1 Le formulaire de contact sur la fiche bien ne va nulle part
`src/app/(app)/explorer/[id]/page.tsx:275-278` :
```js
const handleContactSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setContactSent(true);
};
```
J'ai rempli le formulaire (nom, email, message) sous la « Host card » de `prop7` et cliqué « Contacter l'hôte ». Résultat : un encart vert « Message envoyé avec succès ! » (ligne 1201-1206) s'affiche **localement**, l'URL ne bouge pas (`/explorer/prop7`). Je suis ensuite allé vérifier `/messages` : **aucune trace de Jean-Luc Hartmann ni de « Hartmann » nulle part dans la liste de conversations.** Le message n'est jamais parti où que ce soit — c'est un `useState` local qui affiche un succès factice puis disparaît si on recharge la page.
**Gravité : bloquant.** C'est le seul CTA de contact disponible sur une fiche `location-lt` (voir 2.1 — pas d'autre bouton de contact dans l'aside), et il ne fait absolument rien de persistant.

### 3.2 Le lien « Message » depuis le profil du propriétaire échoue silencieusement
Le propriétaire de `prop7`/`prop14` est Jean-Luc Hartmann, `id: 'user-015'` (`mock-data.ts:271-280`). Sa fiche profil publique existe bien (`/profil/user-015` se charge, `profile-data.ts:218` a un seed pour cet id) et propose un bouton « Message » :
`src/app/(app)/profil/[id]/page.tsx:139` — `onMessage={() => router.push(`/messages?to=${profile.id}`)}`.

J'ai cliqué ce bouton en live. Il redirige bien vers `/messages` (l'URL affichée devient `/messages`, le `?to=user-015` est consommé), mais **aucune conversation ne s'ouvre** : j'atterris sur la liste de conversations existantes (Sophie Martin, Jean Dupont, Marie Leroy, Amira El Fassi, 2 groupes), sans que celle avec Jean-Luc Hartmann n'apparaisse ni ne s'ouvre.

Cause exacte : `src/app/(app)/messages/page.tsx:320-327` —
```js
if (to) {
  const conv = conversations.find((c) => c.participant.id === to);
  if (conv) {
    setActiveConvId(conv.id);
    autoSelectAppliedRef.current = true;
  }
}
```
Aucun `else` : si l'id demandé (`user-015`) ne correspond à aucun `participant.id` du tableau `mockConversations` (qui ne connaît que `u1`, `u2`, `u3`, `u4` en dur, lignes 93-254), rien ne se passe. Pas de conversation créée, pas de message d'erreur, pas de redirection — l'utilisateur est juste déposé sur l'écran de liste sans comprendre pourquoi son clic n'a rien donné.

### 3.3 Et je ne peux pas non plus créer la conversation moi-même
La modale « Nouvelle conversation » (`src/app/(app)/messages/page.tsx:850-859`) ne propose que 3 personnes **en dur** : Alain Bernard, Clara Fischer, David Müller (`u10`, `u11`, `u12`) — aucun rapport avec Jean-Luc Hartmann ni avec qui que ce soit lié aux biens réels du catalogue. Il n'y a pas de recherche libre d'utilisateur pour démarrer une conversation avec n'importe qui.

**Conclusion 3 : gravité bloquante, désaccord fort avec le reste du produit.** En tant que particulier, je n'ai **aucun chemin fonctionnel** pour contacter le propriétaire de l'un des deux seuls biens en location longue durée du catalogue. Le formulaire de contact de la fiche bien est un simulacre local (3.1), le deep-link « Message » depuis son profil échoue silencieusement (3.2), et la création manuelle de conversation ne propose pas cette personne (3.3). Pour une maquette dont la mission explicite est « chaque clic mène quelque part », c'est l'endroit où ça casse le plus fort sur le parcours locataire : l'action la plus importante du persona (« je veux visiter cet appart ») n'aboutit jamais à une vraie conversation.

---

## 4. `/recherche` — recherche globale

### 4.1 La recherche suggérée par l'app elle-même ne retourne rien
`src/app/(app)/recherche/page.tsx:79-88`, `POPULAR_SEARCHES` inclut littéralement `"Appartement Genève"`. Testé en live : recherche `?q=appartement+gen%C3%A8ve` → **« Aucun résultat pour «appartement genève» »**, avec en dessous... la suggestion « Appartement Genève » toujours proposée dans les recherches populaires.

Cause exacte : `src/app/(app)/recherche/page.tsx:105-131`, `filterResults(query)` fait `b.titre.toLowerCase().includes(q)` où `q` est la requête **entière**, non tokenisée. Aucun titre de bien ne contient le substring littéral « appartement genève » collé (les titres sont formulés différemment, p. ex. « Studio meublé design au cœur de Genève »). Testé pour confirmer la cause : `Genève` seul → 5 résultats ; `Appartement` seul → 7 résultats ; `Appartement Genève` (les deux mots, espace compris, comme suggéré) → 0. La recherche ne fait pas d'intersection de mots-clés, juste un match de sous-chaîne exacte sur la requête complète.
**Gravité : important, et désaccord marqué avec le fondateur.** C'est la fonctionnalité la plus visible de l'app (barre de recherche globale) et elle échoue sur sa propre suggestion, affichée juste au-dessus du message d'échec — l'incohérence saute aux yeux en une seule action.

### 4.2 Aucun résultat de location longue durée pour la zone qui m'intéresse, de toute façon
Même en corrigeant la requête (« Genève » seul → 5 résultats), ces résultats sont des biens à la vente ou en court séjour — aucune location longue durée genevoise ou lausannoise n'existe dans le catalogue (cf. §0). La recherche fonctionne correctement une fois qu'on sait qu'il faut taper un seul mot, mais elle ne peut de toute façon rien trouver qui corresponde à mon besoin réel.

### 4.3 Positif à noter
Le reste de `/recherche` est plutôt bien pensé : l'autocomplete groupé par catégorie, les recherches récentes persistées en `localStorage` et partagées avec le header, le fait que chaque résultat mène à une vraie page (`/explorer/[id]`, `/profil/[id]`, `/formations/[id]`) sans lien mort — contrairement à ce que le commentaire en tête de fichier (lignes 19-31) indique avoir corrigé par le passé (anciens ids inventés B1-B8 qui menaient à des 404). Ce nettoyage tient la route, c'est juste la tokenisation de la requête qui n'a pas suivi.

---

## 5. `/favoris`

### 5.1 Bug confirmé : le prix des locations longue durée s'affiche sans unité
`src/app/(app)/favoris/page.tsx:132-135` :
```jsx
<span className="text-sm font-bold text-[var(--primary)]">
  {formatPrice(p.price, p.currency)}
  {p.transactionType === "location-ct" ? "/nuit" : ""}
</span>
```
Le cas `location-lt` (« /mois ») n'est simplement pas traité — seul `location-ct` reçoit un suffixe, tout le reste (vente ET location longue durée) tombe dans la chaîne vide. Vérifié en live : après avoir ajouté `prop7` et `prop14` à mes favoris, la page `/favoris` affiche côte à côte :
```
Villa contemporaine avec piscine à débordement   3'031'915 CHF
3.5 pièces lumineux au bord du lac               1'850 CHF
2.5 pièces meublé proche université              1'350 CHF
```
« 1'850 CHF » nu, dans la même liste qu'un prix de vente à plus de 3 millions, sans aucune unité pour les distinguer visuellement d'un prix total. Sur la fiche détaillée du bien lui-même, le prix est correctement annoté « par mois » (desktop) — l'incohérence est spécifique à cette liste condensée.
**Gravité : important.** Rien n'empêche de cliquer pour vérifier, mais un coup d'œil rapide sur sa liste de favoris (l'usage normal de cet écran) peut faire lire « 1'850 CHF » comme un prix d'achat très bas plutôt qu'un loyer mensuel — d'autant plus troublant que le voisin direct dans la liste affiche un prix de vente à 7 chiffres sans distinction visuelle de nature.

Le même bug existe à l'identique dans `/recherche` : `src/app/(app)/recherche/page.tsx:544` — `<span>{formatPrice(b.prix)}</span>` sans aucun suffixe, pour tous les types de transaction confondus.

### 5.2 Le reste fonctionne bien
Ajout/retrait de favori testé en live (bouton « Sauvegarder » sur la fiche, bouton « Retirer des favoris » sur la carte) : cohérent, instantané, la liste se met à jour sans recharger. Le commentaire en tête de fichier (`favoris/page.tsx:9-13`) indique que cet écran a déjà été corrigé une fois pour un bug similaire (désynchronisation entre biens codés en dur et catalogue réel) — cette fois la source de données est unifiée (`getPropertiesByIds(favorites)`), donc plus de bien fantôme. Seul le suffixe d'unité a été oublié dans cette correction.

Point neutre à signaler : la liste de favoris n'est pas vide au premier chargement — 4 biens (Genève, Verbier, Nice, Phuket) y figurent déjà par défaut avant toute action de ma part, ce qui correspond à un compte « déjà vécu » plutôt qu'à un compte neuf. Cohérent avec l'objectif de rendre la démo vivante, mais à mentionner car ça change la lecture de "mes favoris" : ce ne sont pas QUE mes choix de la session.

---

## 6. `/messages` et `/reseau` — comportement général

### 6.1 `/reseau` reproduit exactement le même problème d'id que le profil
`src/app/(app)/reseau/page.tsx:56` — le bouton « Message » sur chaque carte personne fait `router.push(`/messages?to=${person.id}`)`, où `person` vient de `listPeople()` (`src/lib/profile-data.ts:341-354`, ids au format `user-XXX`). Comme documenté en §3.2, ce format d'id ne correspond à aucun `participant.id` de `mockConversations`. **Tout contact initié depuis `/reseau` vers une personne qui n'a pas déjà une conversation ouverte en dur (`u1`-`u4`) échoue silencieusement**, exactement comme depuis un profil. Je n'ai pas eu besoin de retester en live : c'est littéralement le même appel (`/messages?to=...`) qui alimente la même logique cassée en §3.2 — le bug n'est pas local à la fiche bien, il touche tout mécanisme de « contacter cette personne » du site.
**Gravité : bloquant, transverse.** Ce n'est pas un bug de fiche bien isolé — c'est le mécanisme générique de prise de contact qui est cassé partout où il est utilisé en dehors des 4 conversations pré-scriptées.

### 6.2 Les conversations existantes (une fois qu'on tombe dessus) sont crédibles
Les 4 conversations 1-1 et 2 groupes pré-remplis dans `mockConversations` ont un contenu de messages cohérent et daté (échanges sur un chalet, une villa avec piscine, un appartement 3 mois) — mais aucune n'implique le persona locataire longue durée cherchant un logement principal dans l'arc lémanique ni le propriétaire Jean-Luc Hartmann. Rien dans `/messages` ne reflète mon parcours de test.

---

## Synthèse — réponses aux 4 questions

**(1) Cherché / trouvé ?** Cherché : un 2-3 pièces à louer en longue durée dans l'arc lémanique. Trouvé : 2 appartements, tous deux à Neuchâtel — zéro correspondance géographique. J'ai fini par consulter les deux seuls biens disponibles faute d'alternative, pas parce qu'ils correspondaient à ma recherche.

**(2) Perdu / bloqué / ralenti ?** Bloqué deux fois de façon sérieuse : (a) sur mobile, le bouton « Réserver » de la fiche bien ne mène jamais nulle part pour une location longue durée (§2.2) ; (b) impossible de faire aboutir un contact avec le propriétaire par n'importe quel chemin de l'app — formulaire local fantôme, deep-link silencieusement cassé, pas de recherche libre pour démarrer une conversation (§3). Ralenti par les filtres DPE et Rendement qui vident les résultats sans explication (§1.2) et par la recherche globale qui échoue sur sa propre suggestion (§4.1).

**(3) Faux / vide / artificiel ?** Le module « Biens similaires » sur la fiche `prop7` recommande une villa à 1,45 million et deux locations de vacances à une personne qui loue un 3.5 pièces à 1'850 CHF/mois (§2.4) — c'est l'endroit où la maquette « sonne » le plus faux dans mon parcours. Le prix sans unité dans `/favoris` (§5.1) contribue au même sentiment : des chiffres à des échelles incompatibles affichés côte à côte sans distinction.

**(4) Qu'est-ce qu'il manque pour être utile ?** Du contenu — plus de locations longue durée, réparties sur plusieurs villes dont au moins Genève/Lausanne — et une chaîne de contact qui fonctionne réellement de bout en bout (formulaire → conversation persistée → réponse), ce qui est aujourd'hui la brique la plus cassée alors que c'est objectivement l'action la plus importante pour ce persona.

## Désaccords avec le fondateur (ce qu'il n'a probablement pas vu)

1. Le module « biens similaires » (§2.4) et les filtres DPE/Rendement en mode Louer (§1.2) sont des symptômes directs du fait qu'il n'existe que 2 biens `location-lt` dans tout le catalogue — un problème de volume de données qui se répercute silencieusement dans plusieurs modules qui, eux, sont censés être génériques. Ce n'est probablement pas perçu comme un bug de ces modules mais comme un manque de contenu ; en pratique les deux se manifestent comme des bugs pour l'utilisateur.
2. Le formulaire de contact de la fiche bien (§3.1) *a l'air* de fonctionner — toast de succès, état affiché — ce qui le rend plus trompeur qu'une simple absence de fonctionnalité : quelqu'un qui teste rapidement le parcours croira que « contacter » marche, alors que rien n'est persisté nulle part. C'est le genre de faux positif qui survit facilement à une relecture rapide.
3. Le bug de recherche non-tokenisée (§4.1) est ironique et facilement démontrable en une seule requête copiée depuis la propre liste de suggestions de l'app — à mon avis le correctif le plus simple à isoler (un `.split(" ").every(...)` au lieu d'un `.includes()` unique) pour l'impact le plus visible.
