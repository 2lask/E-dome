# Architecture & données — Mission 2 (B.1 : « un profil identique partout »)

Domaine couvert : architecture des données, sources de vérité, duplication,
modèle cible, couplage Supabase, `context.tsx`, scalabilité du contenu
(`demo/clock.ts`), dette technique. Lecture seule ; aucune autre écriture que
ce fichier.

---

## Verdict

**Non, en l'état l'architecture ne peut pas porter B.1.** Elle peut porter un
**sous-ensemble** — le bien immobilier, l'argent — parce que M1 a déjà fait ce
travail-là (`src/lib/demo/ledger.ts` + `derive.ts` + `invariants.ts`, et
`src/lib/data/properties.ts` comme point d'entrée unique vers
`mock-data.properties`). Mais **la personne** — celle que B.1 vise
explicitement (« un profil doit être identique partout ») — n'a **jamais reçu
ce traitement**. Il n'existe aujourd'hui **aucune source unique de vérité pour
« qui est user-007 »**, et j'ai trouvé **six** représentations indépendantes et
mutuellement contradictoires de l'annuaire de démonstration, plus une
septième — le modèle `Account`/`RoleGrant` de M1 — qui est la bonne forme
cible mais qui est **entièrement vide** : zéro instance dans tout le dépôt.

Le renversement de posture de M1 (« un journal, tout le reste en dérive ») a
fonctionné pour l'argent. Il n'a **pas été étendu aux personnes**, et c'est
précisément le trou que Mission 2 doit combler. Ce n'est pas une correction de
valeurs : comme pour `dashboard-data.ts` en M1, corriger les nombres ne
tiendrait pas — il faut le même geste que le journal, appliqué à l'annuaire.

---

## 1. Les six annuaires qui se contredisent

Chercher « qui est user-007 » dans ce dépôt renvoie six réponses différentes.
C'est la preuve la plus directe que l'architecture actuelle ne peut pas porter
B.1 : ce n'est pas une question de complétude (« il manque des infos »), c'est
une question de **cohérence** (« deux écrans affirment deux choses
différentes du même identifiant »).

### 1.1 Le cas le plus grave : des identités échangées sous le même id

| Id | `mock-data.ts` (`users[]`) | `profile-data.ts` (`PUBLIC_SEEDS`) |
| --- | --- | --- |
| `user-007` | **Pierre Gonçalves**, Lisbonne, hôte/apporteur — `mock-data.ts:143-158` | **Camille Rochat**, Fribourg, investisseuse — `profile-data.ts:231-242` |
| `user-008` | **Nathalie Blanc**, Genève, notaire — `mock-data.ts:159-174` | **Nicolas Berger**, Zurich, promoteur — `profile-data.ts:243-254` |
| `user-009` | **Thomas Müller**, Lausanne, architecte — `mock-data.ts:175-190` | **Fatima Zahra**, Casablanca, agence — `profile-data.ts:255-266` |
| `user-010` | **Fatima Zahra**, Dakar, apporteuse/formatrice — `mock-data.ts:191-206` | **David Meier**, Zoug, courtier — `profile-data.ts:267-278` |
| `user-011` | **Alexandre Petit**, Bangkok, hôte/investisseur — `mock-data.ts:207-222` | **Elena Rossi**, Lugano, formatrice — `profile-data.ts:279-290` |
| `user-012` | **Clémence Moreau**, Lausanne, client/investisseur — `mock-data.ts:223-238` | **Omar Haddad**, Dubaï, apporteur — `profile-data.ts:291-302` |

Ce n'est pas une divergence de chiffres (comme le facteur 5 que M1 a corrigé) :
ce sont **des personnes différentes sous le même identifiant**, et même
« Fatima Zahra » apparaît deux fois avec deux identités (`user-010` dans
`mock-data.ts`, `user-009` dans `profile-data.ts`) — un glissement d'un cran
qui trahit deux annuaires écrits indépendamment sans jamais se relire l'un
l'autre.

**Conséquence traçable, pas hypothétique** — `mock-data.ts:1306-1317` (conversation
`conv-004`) montre le participant `users[11]` (Clémence Moreau) qui écrit « je
suis intéressée par l'appartement à Neuchâtel ». `/profil/user-012` (résolu par
`profile-data.getMockProfile`, `profile-data.ts:309-334`) affiche à cette même
adresse **Omar Haddad, apporteur d'affaires basé à Dubaï**. Un visiteur qui
clique sur l'interlocuteur d'une conversation tombe sur quelqu'un d'autre.
Même mécanique pour `conv-006` (`mock-data.ts:1329-1341`, Nathalie Blanc ↔
`user-008` = Nicolas Berger en profil public) et pour tout avis produit par
`users[11]` ou `users[7]` dans `mockReviews` (`mock-data.ts:2356` et suivants,
ex. `rev-001`, `rev-004` signés `users[11]`).

### 1.2 Même les cas « alignés » divergent sur les chiffres

Pour `user-001` à `user-006`, les deux fichiers désignent la même personne
mais pas les mêmes stats. Exemple Sophie Durand (`user-002`) :

| Source | followers | avis | ordre des rôles |
| --- | --- | --- | --- |
| `mock-data.ts:64-78` | 3 100 | 134 | `['hote', 'courtier']` |
| `profile-data.ts:150-163` | 890 | 42 | `['courtier', 'hote']` |
| `profile-posts.ts:39-44` (`C_SOPHIE`, commentatrice) | 890 | 42 | `['courtier']` seul |

`profile-posts.ts` s'accorde avec `profile-data.ts` (les deux fichiers du
« profil ») mais **pas** avec `mock-data.ts` (le fichier du « feed/annuaire »).
Ce sont deux camps cohérents en interne, incohérents entre eux — exactement le
schéma que M1 a documenté et corrigé pour l'utilisateur courant
(`demo/identity.ts:1-29` : « Huit sources décrivaient cette personne… ») mais
qui **n'a jamais été traité pour les 15 autres profils**.

### 1.3 Un cinquième annuaire, complètement hors ids : le fil lui-même

`src/lib/demo/posts.ts:72-118` définit `U_SOPHIE`, `U_MARC`, `U_AMIRA`,
`U_THOMAS`, `U_YASMIN` — cinq auteurs du fil avec des identifiants `"u1"` à
`"u-yasmin"`, **un espace d'identifiants entièrement différent** de
`user-00X`. Ces personnes portent des prénoms déjà pris (Sophie **Martin**
contre Sophie **Durand** de `user-002` ; Marc **Dubois** contre Marc **Favre**
de `user-003` ; Yasmin **Al Falasi** contre Yasmin **Al Maktoum** de
`user-006`) avec des stats sans rapport (`U_MARC` : 3 200 abonnés / 890 000 CHF
de revenu, contre `user-003` Marc Favre : 5 620 abonnés / 1 250 000 CHF). Ces
auteurs de posts n'ont **aucune fiche profil qui leur corresponde** : cliquer
sur l'auteur d'un post signé `U_SOPHIE` (id `u1`) ne peut mener nulle part de
cohérent, puisque `/profil/u1` n'existe dans aucun des deux annuaires.

Le seul cas où `demo/posts.ts` réutilise un vrai id (`U_AMINA`, id
`"user-004"`, `demo/posts.ts:104-110`) **divergence quand même** :
8 900 abonnés / 412 avis contre 4 200 / 98 dans `mock-data.ts:96-110` pour le
même `user-004`. Même quand l'intention de cohérence existe, l'exécution la
rate — preuve qu'aucun mécanisme structurel ne l'impose.

### 1.4 Un sixième annuaire, hors modèle : l'équipe d'agence

`/agence/equipe` (`src/app/(app)/agence/equipe/page.tsx:3,28`) affiche
`agencyTeam` depuis `@/content/agence` — des lignes `{id, name, role,
permissions, mandates}` sans avatar, sans lien vers un profil, sans rapport
avec `users`, `PUBLIC_SEEDS` ni le type `AgencyMember` de
`src/lib/model/agency.ts:55-64`. Un agent d'équipe n'est **pas une personne**
dans le modèle actuel, c'est une ligne de tableau HTML. C'est directement
visé par la mission (« l'équipe d'agence » doit être cohérente), et
aujourd'hui elle n'a même pas de représentation individuelle réutilisable.

### 1.5 Le septième acteur : le modèle cible existe, mais il est vide

`src/lib/model/identity.ts` définit `Account`, `RoleGrant`,
`holdsRole()` — exactement la forme qu'il faut : un compte, des rôles
cumulés/datés/scopés, découplés de la vue (`viewingAs`). `src/lib/model/agency.ts`
définit `Agency`, `AgencyMember`, `Mandate`, `VisitSlot`, `DocumentRef`,
`AssistanceRequest/Proposal`. Le commentaire du fichier le dit noir sur blanc
(`agency.ts:7-9`) : **« Rien de tout cela n'existe aujourd'hui dans le
dépôt »**. `grep` confirme : aucune instance de `RoleGrant` ni d'`Account` nulle
part dans `src/`, hors la définition du type et son usage dans
`content/roles.ts` pour le pont `PlatformRole ↔ Role`. C'est un plan
d'architecture posé et non construit — la bonne nouvelle est qu'il n'y a rien
à défaire pour l'utiliser, seulement à le peupler.

---

## 2. Ce qui, à l'inverse, fonctionne déjà et doit servir de patron

M1 a résolu exactement ce problème pour deux domaines, et le motif est
directement réutilisable :

- **L'argent** : `src/lib/demo/ledger.ts` (seul tableau qui porte des
  montants) → `src/lib/demo/derive.ts` (fonctions pures, zéro chiffre en dur) →
  `src/lib/demo/invariants.ts` (assertions levées à l'import, `next build`
  échoue si ça diverge) → `dashboard-data.ts` / `revenue-data.ts` réduits à des
  enveloppes qui rappellent ces fonctions sans réécrire les pages.
- **Le bien immobilier** : `src/lib/data/properties.ts` documente
  explicitement le même problème que celui décrit ici pour les personnes
  (« `/favoris` déclarait son propre tableau… `/recherche` indexait des
  identifiants inventés… ») et le résout en devenant **le point d'entrée
  unique** vers `mock-data.properties`, sans dupliquer les données.

Le motif à copier pour les personnes : **un annuaire, des vues dérivées,
zéro embarquement de copie**. Actuellement les personnes sont **embarquées
par valeur** partout où on les utilise — c'est la racine technique du
problème.

---

## 3. Cause racine : le modèle embarque des personnes, il ne les référence pas

`src/lib/types.ts` définit tout par embarquement :

```
Property.host: User            (types.ts:100)
Formation.instructor: User      (types.ts:313)
Reservation.guest: User         (types.ts:290)
Conversation.participant: User  (types.ts:273)
Conversation.members?: User[]   (types.ts:282)
Comment.author: User            (types.ts:143)
SocialPost.author: User         (types.ts:235)
Review.author: User             (mock-data.ts:2350)
```

Chaque fois qu'un fichier construit un `Property`, un `SocialPost`, une
`Conversation`, il doit **recopier un `User` complet en valeur**. Rien
n'empêche (ni même ne décourage) d'écrire cette copie à la main, avec des
chiffres inventés sur le moment — c'est exactement ce que font
`profile-posts.ts` (`C_SOPHIE`, `C_MARC`, `C_AMINA`, lignes 39-56) et
`demo/posts.ts` (`U_SOPHIE`…`U_YASMIN`, lignes 72-118). `getUserById()`
existe (`mock-data.ts:305-307`) mais n'est **appelé par aucun de ces deux
fichiers** : rien ne force son usage, ce n'est qu'une fonction parmi
d'autres, pas un point de passage obligé.

Comparer avec le bien : `Property` est aussi embarquée par valeur dans
`SocialPost.property`, mais **une seule fabrique** (`mock-data.properties`,
via `data/properties.ts`) produit ces objets, et `demo/posts.ts:144-148`
lève une erreur de compilation-time (`propRef()`) si un id de bien est
inconnu. Rien d'équivalent n'existe pour les personnes : pas de `personRef()`
qui échoue sur un id inconnu, pas d'invariant qui vérifie qu'un auteur de
post, un participant de conversation et un profil public s'accordent.

---

## 4. Modèle de données cible pour Mission 2

### 4.1 Principe : un annuaire, tout le reste par référence ou par vue dérivée

```
src/lib/demo/
  identity.ts     — existe. Étendre : au lieu d'un seul CURRENT_USER,
                    porter DIRECTORY: Account[] — les 15-18 comptes de
                    démonstration, un seul enregistrement par id.
  directory.ts     — NOUVEAU. Les fonctions pures : accountById(id),
                    personSummary(id) (vue légère pour listes réseau/
                    stories/suggestions), publicProfile(id) (vue riche pour
                    /profil/[id]), requireAccount(id) qui lève si l'id est
                    inconnu — le pendant de propRef() pour les personnes.
  posts.ts         — ne définit plus U_SOPHIE etc. ; référence
                    accountById("user-00X") et échoue à la compilation si
                    l'id n'existe pas au DIRECTORY.
  ledger.ts        — inchangé, déjà correct.
```

`src/lib/model/identity.ts` fournit déjà le type `Account` — c'est la forme à
remplir, pas à réinventer. Le seul écart à combler : `Account.grants:
RoleGrant[]` porte `PlatformRole`, alors que `demo/identity.ts` et tout le
reste du dépôt raisonnent encore en `Role` hérité (voir §6). Peupler
`DIRECTORY` est l'occasion de migrer, pas de perpétuer le double système.

### 4.2 Ce qui doit changer de forme, entité par entité

| Entité | Aujourd'hui | Cible |
| --- | --- | --- |
| **Personne** | `User` embarqué par valeur dans 8 endroits (`types.ts`), 6 annuaires indépendants | `Account` (déjà typé, `model/identity.ts`), un seul tableau `DIRECTORY` dans `demo/identity.ts`, référencé par `id` partout |
| **Bien** | Déjà centralisé — `mock-data.properties` via `data/properties.ts` | Inchangé, patron à copier |
| **Post** | `SocialPost.author: User` embarqué ; `demo/posts.ts` fabrique ses propres auteurs | `SocialPost.author` reste un objet affichable (pas besoin de casser l'UI), mais **produit par une fabrique unique** `authorFrom(accountId)` qui lit `DIRECTORY`, jamais écrit à la main |
| **Conversation** | `participant: User` = `users[N]` (mock-data.ts) — correct en interne, mais `users[]` lui-même contredit `PUBLIC_SEEDS` | Même geste : `participant` construit depuis `DIRECTORY`, pas depuis un second tableau `users[]` |
| **Réservation** | `guest: User` = `users[N]` | Idem |
| **Avis** | `author: User` = `users[N]` | Idem ; et la case commentée « note » (mockReviews) doit dériver de `DIRECTORY`, pas d'un index de tableau qui peut changer d'ordre |
| **Équipe d'agence** | Lignes plates `{id, name, role}` dans `content/agence.ts`, hors modèle | `AgencyMember.accountId: AccountId` (déjà typé, `model/agency.ts:55-64`) référence `DIRECTORY` ; `agencyTeam` devient une vue dérivée de `Agency.members` + `DIRECTORY`, pas un contenu éditorial séparé |
| **Relation entre profils** (suivi, mutualConnections) | `suggestedUsers`, `storyUsers` recopient `name`/`avatar` en dur (`mock-data.ts:2597-2639`), plus `followedUsers` dans `context.tsx` (ids seuls, correct) | Vues dérivées de `DIRECTORY`, comme `bySource()` dérive du `LEDGER` — zéro champ recopié |

### 4.3 Le garde-fou à ajouter : un invariant d'annuaire

`src/lib/demo/invariants.ts` vérifie déjà que les biens et formations
référencés par le journal existent au catalogue (invariant 2). Le même
principe, étendu :

- chaque `id` référencé par `conversations`, `mockReviews`, `SocialPost.author`,
  `AgencyMember.accountId` doit exister dans `DIRECTORY` — sinon build cassé,
  message avec fichier + id, comme le reste du module ;
- un seul enregistrement par id dans `DIRECTORY` (le doublon `user-007` à deux
  identités devient littéralement impossible à écrire, pas seulement
  découragé) ;
- optionnel mais peu coûteux : une vérification que `PersonSummary`
  (`profile-types.ts:173-182`) dérivée d'un compte porte le même prénom/nom que
  la fiche complète — le filet qui aurait attrapé Sophie 3 100 vs 890.

C'est la même philosophie que celle déjà documentée dans
`invariants.ts:1-52` : pas de test à lancer, une assertion qui bloque le
commit à l'import, avec porte de secours `EDOME_INVARIANTS=warn` déjà
existante et réutilisable telle quelle.

### 4.4 Effort, pour cadrer

Ce n'est pas une réécriture : c'est la **suppression** de cinq fichiers de
définitions concurrentes (`PUBLIC_SEEDS` dans `profile-data.ts`,
`C_SOPHIE/C_MARC/C_AMINA` dans `profile-posts.ts`, `U_SOPHIE…U_YASMIN` dans
`demo/posts.ts`, `agencyTeam` dans `content/agence.ts`, la duplication
`users[]` vs `PUBLIC_SEEDS`) au profit d'un seul tableau alimenté une fois. Le
even plus petit que la refonte du journal en M1, parce que la forme cible
(`Account`) existe déjà et n'a **jamais** été branchée sur des données — il
n'y a pas de migration de schéma à faire, seulement une bascule des call
sites.

---

## 5. Supabase, `context.tsx`, scalabilité du contenu

### 5.1 Supabase — couplage faible, sans risque pour Mission 2

`src/lib/supabase/*` (client, server, admin, proxy, config) n'est câblé qu'à
la couche `leads/` (formulaire de la landing, `/admin/leads`) — un domaine que
`DECISIONS.md` et `PLAN.md` déclarent gelé (« la landing reste gelée… toute
autre nécessité de la toucher → s'arrêter et demander »). Aucun import de
`@/lib/supabase` dans `mock-data.ts`, `profile-data.ts`, `demo/*` ou les pages
de profil/feed/messages. Le modèle de données de Mission 2 est donc **libre
de toute contrainte Supabase** : construire `DIRECTORY` en mémoire ne touche
aucun chemin déjà connecté à une base réelle. Le typage `Profile`
(`profile-types.ts`) et sa validation Zod (`profile-schema.ts`) sont d'ailleurs
déjà écrits « pour un backend plus tard sans toucher à l'UI » — c'est une
bonne base, à condition de la nourrir depuis `DIRECTORY` plutôt que depuis
`PUBLIC_SEEDS`.

### 5.2 `context.tsx` — trois représentations du rôle coexistent

`src/lib/context.tsx` porte simultanément :
- `activeRole: Role` (l'ancien union à 13 valeurs, `types.ts:3-16`) — persistée,
  validée à la lecture (`isKnownRole`, ligne 115-117) ;
- `viewingAs: PlatformRole` (le nouvel axe à 11 valeurs, `model/identity.ts`) —
  persistée, validée (`isPlatformRole`, ligne 172) ;
- `profile: Profile` (`profile-data.DEFAULT_PROFILE`), dont `roles: Role[]`
  utilise encore l'ancien type (`profile-types.ts:149`).

`setViewingAs` (ligne 299-303) pousse manuellement `activeRole` en aval via
`tourFor(role)?.legacyRole` — un pont ad hoc plutôt qu'une seule source. Pour
Mission 2, `profile.roles` (donc l'affichage réel d'un profil) reste piloté
par l'ancien système, **pas** par les quatre axes que M1 a posés. Tant que
`Profile` n'adopte pas `PlatformRole` (+ `ProviderTrade` + `ProfileInterest`),
un profil affiché peut légitimement porter un badge « Courtier » ou
« Investisseur » que `DECISIONS.md` §3.1 a explicitement fait disparaître de
l'interface — et c'est précisément le cas aujourd'hui : `profile-data.ts:158,171`
et `mock-data.ts:71,135,279` écrivent encore `courtier` et `investisseur` en
toutes lettres dans des tableaux `roles`.

### 5.3 Scalabilité du contenu — le socle temporel est solide

`src/lib/demo/clock.ts` est un bon fondement pour un fil vivant : `DEMO_TODAY`
figé, `last12Months()`, `daysFromToday()`, tout dérive d'une seule constante.
`demo/ledger.ts` l'exploite déjà pour étaler l'activité dans le temps
(saisonnalité par bien, génération déterministe via `mulberry32`). **Ce moteur
n'est pas branché sur le fil social** : `demo/posts.ts` date ses posts avec
`hAgo(h)` = `Date.now() - h*3600_000` (ligne 122, et repris dans
`profile-posts.ts:11`) — donc relatif à l'horloge réelle du visiteur, pas à
`DEMO_TODAY`. Deux conséquences pour Mission 2 : (1) un fil « vivant et étalé
dans le temps » ne peut pas se vérifier par invariant tant qu'il ne dérive pas
de `DEMO_TODAY` comme le journal le fait déjà ; (2) le jour où l'horloge
réelle dépasse largement le 30.09.2026 fixé dans `clock.ts:18`, les posts du
fil resteront « d'il y a 2h » indéfiniment alors que les réservations du
tableau de bord, elles, glisseront hors fenêtre (invariant 8,
`invariants.ts:234-254`) — un nouveau désaccord de dates entre écrans, du
même ordre que celui que `clock.ts` documente avoir résolu.

---

## 6. Dette technique qui gênera directement Mission 2

| Dette | Fichier:ligne | Gravité | Pourquoi ça bloque B.1 |
| --- | --- | --- | --- |
| Six annuaires contradictoires | §1 ci-dessus | **Bloquant** | C'est littéralement l'objet de B.1 |
| `Account`/`RoleGrant` vide | `model/identity.ts`, `model/agency.ts:7-9` | **Bloquant** | La forme cible existe mais ne sert à rien tant qu'elle n'a aucune donnée |
| `User` embarqué par valeur, pas par référence | `types.ts:100,143,235,273,282,290,313` | Élevée | Racine technique : rien n'empêche une copie divergente à l'écriture |
| `Profile.roles: Role[]` (legacy) au lieu de `PlatformRole[]` | `profile-types.ts:149` | Élevée | Des rôles supprimés sur avis juridique (`courtier`) réapparaissent dans l'UI de profil |
| `courtier`/`investisseur` encore écrits comme rôles de personnes | `mock-data.ts:71,87,135,279` ; `profile-data.ts:158,171,198,238` | Élevée | Contredit `DECISIONS.md` §3.1 (D6), déjà tranché, pas juste « à faire » |
| `getUserById()` non contraignant | `mock-data.ts:305-307` | Moyenne | Existe mais n'est appelé par aucun des fichiers qui embarquent des auteurs à la main |
| Fil non daté depuis `DEMO_TODAY` | `demo/posts.ts:122` ; `profile-posts.ts:11` | Moyenne | Empêche un fil vivant vérifiable par invariant, et dérivera de la fenêtre du journal |
| `mock-data.ts` = 2 727 lignes, mélange 14 entités | fichier entier | Moyenne | Chaque nouvelle entité de Mission 2 (avis, relations) tentera d'y ajouter un 15ᵉ tableau plutôt qu'un module dédié |
| Trois systèmes de rôle en coexistence (`Role`, `PlatformRole`, `Profile.roles`) | `context.tsx:47-58,144-154,299-303` | Moyenne | Pont manuel (`tourFor().legacyRole`) = un point de désynchronisation de plus à surveiller à chaque nouvel écran |
| `agencyTeam` hors modèle | `content/agence.ts` (consommé par `agence/equipe/page.tsx:3,28`) | Moyenne | Un agent d'équipe n'est pas une personne référençable ; toute page qui voudrait le lier à un profil devra d'abord lui donner un id d'annuaire |

---

## 7. Désaccords / réserves

1. **Je ne recommande pas de fusionner `mock-data.ts` en un seul gros
   refactor.** Le motif juste, déjà appliqué avec succès par M1
   (`data/properties.ts`, `demo/ledger.ts`), est l'enveloppe incrémentale : un
   nouveau `demo/directory.ts` qui devient la source, `mock-data.ts` réduit
   pièce par pièce à des ré-exports. Casser `mock-data.ts` d'un coup casserait
   27 fichiers qui l'importent directement pour les biens/formations/etc.,
   qui eux n'ont pas besoin de changer.
2. **Je marque un désaccord avec l'idée, si elle circule, que le problème de
   B.1 est « juste des chiffres à corriger ».** Ce n'est pas le cas pour les
   personnes, contrairement à l'argent en M1 : `user-007` porte deux
   *identités* différentes (pas deux nombres pour la même personne). Corriger
   les valeurs sans changer la structure (embarquement par valeur, zéro
   annuaire unique) reproduira l'écart dès le prochain écran écrit à la main —
   exactement le raisonnement que `DECISIONS.md` §3.3 applique déjà à l'argent
   et qu'il faut répliquer ici sans l'affaiblir.
3. **Point ouvert que je ne tranche pas** : faut-il migrer `Profile.roles`
   vers `PlatformRole` *avant* de peupler `DIRECTORY`, ou l'inverse ? Techniquement
   les deux sont indépendants (`Account.grants[].role` est déjà `PlatformRole`),
   mais tant que `Profile` reste sur `Role`, peupler `DIRECTORY` avec des
   `Account` obligera une conversion à chaque affichage de profil — un pont de
   plus, provisoire par nature. Je recommande de trancher ce point avant
   d'écrire `demo/directory.ts`, pas pendant.
