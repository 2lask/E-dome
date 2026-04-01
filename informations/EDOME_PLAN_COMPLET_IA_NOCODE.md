# 🏠 E-DOME — PLAN COMPLET D'AMÉLIORATION POUR IA NO-CODE
## Audit exhaustif · Site : https://plateforme-beige.vercel.app · Avril 2026

---

> **Instructions pour l'IA no-code :** Ce document est ton plan de travail complet. Chaque section décrit une page ou une fonctionnalité du site avec les bugs trouvés, les incohérences détectées et les améliorations exactes à apporter. Traite chaque point dans l'ordre des priorités (🔴 → 🟠 → 🟡 → 🟢). Ne rien inventer qui ne soit pas dans ce document. Respecter l'identité visuelle existante (design sobre, tons beige/blanc/sombre, style premium immobilier).

---

## 🧠 VISION GLOBALE DU PROJET

**E-Dome** est une plateforme immobilière tout-en-un qui fusionne en un seul écosystème :
- Réseau social immobilier (type Instagram/TikTok)
- Marketplace immobilière (vente, location CT & LT)
- Système de réservation (type Airbnb)
- Plateforme de formations (type Kajabi)
- Système d'apporteurs d'affaires avec commissions automatisées
- Marketplace de services annexes
- Espace événements & lives en direct
- Dashboards analytiques par rôle

**Modèle économique :** Commission sur locations (8%), ventes (3.5%), formations (20%), location LT (50% premier loyer). L'apporteur touche jusqu'à 15% de la commission plateforme.

**Types de profils utilisateurs :** Client · Hôte · Propriétaire · Agence · Agent immobilier · Promoteur · Apporteur d'affaires · Investisseur · Formateur/Coach

**Règle fondamentale :** Un compte = plusieurs rôles activables. L'interface, la navigation et les dashboards doivent s'adapter dynamiquement au rôle actif de l'utilisateur connecté.

---

## 🔴 PRIORITÉ 1 — BUGS CRITIQUES ET INCOHÉRENCES BLOQUANTES

Ces bugs doivent être corrigés en premier car ils cassent la crédibilité du site.

---

### BUG 1.1 — Double identité du compte connecté

**Page(s) concernée(s) :** Toutes
**Problème détaillé :** Le compte connecté s'affiche "Leo Demo" dans le header, la sidebar et le badge "LD". Mais la page `/profil` affiche "Léo Martin". Ce sont deux noms différents pour la même personne. Par ailleurs, `/profil/u1` affiche "Sophie Bernard" alors que dans le feed, les formations et les fiches biens, cette même personne s'appelle "Sophie Martin". Il y a donc au moins deux utilisateurs avec une identité divisée.
**Correction exacte :**
- Synchroniser le nom affiché partout depuis une seule source de données (base utilisateurs).
- "Leo Demo / Léo Martin" → choisir un seul nom et l'appliquer partout : header, sidebar, badge initiales, page profil, avis rédigés.
- "Sophie Martin / Sophie Bernard" → idem, unifier le nom sur le profil `/profil/u1`, dans les posts du feed, dans les formations et sur les fiches biens.
- Les initiales dans le badge (actuellement "LD") doivent correspondre au vrai prénom et nom.

---

### BUG 1.2 — Profil Client incohérent avec son rôle

**Page(s) concernée(s) :** `/profil`
**Problème détaillé :** L'utilisateur connecté a le rôle "Client" (visible dans la sidebar et le badge de rôle). Or son profil public affiche : "8 Biens", "1.2K Abonnés", un onglet "Mes Biens" avec 3 propriétés listées (Chalet Alpin Premium, Appartement Vue Lac, Villa Prestige). Un Client ne publie pas de biens immobiliers. C'est une incohérence de données de démonstration qui confuse l'utilisateur.
**Correction exacte :**
- Pour le rôle Client : masquer le compteur "Biens", supprimer l'onglet "Mes Biens" ou le remplacer par "Biens sauvegardés / Favoris". Afficher à la place : Formations en cours, Événements inscrits, Réservations récentes.
- Les 3 propriétés affichées doivent disparaître du profil de Leo (elles appartiennent à un Hôte/Agence).
- La note 4.8/5 affiché sur le profil Client n'a pas de sens (notes de quoi ? d'un vendeur ? d'un locataire ?). La remplacer par "Membre vérifié" ou supprimer si pas pertinent pour un Client.

---

### BUG 1.3 — Spinner "Chargement..." permanent sur toutes les pages

**Page(s) concernée(s) :** Feed, Explorer, Profil, Messages, Réservations, Formations, Services, Événements, Dashboard, Paramètres, Live, Favoris
**Problème détaillé :** Un texte ou spinner "Chargement..." reste affiché en permanence sur presque toutes les pages même une fois que le contenu est entièrement chargé et visible. C'est un état de loading non résolu côté code.
**Correction exacte :** L'état de chargement doit disparaître automatiquement quand le contenu est prêt. Le spinner ne doit s'afficher que pendant le temps de chargement réel des données (< 2 secondes en conditions normales). Une fois les données affichées, le loader disparaît sans délai. Mettre en place un state management correct (isLoading = false une fois les données reçues).

---

### BUG 1.4 — Visite virtuelle brisée sur les fiches biens

**Page(s) concernée(s) :** `/explorer/prop1` (et probablement toutes les fiches biens avec visite virtuelle)
**Problème détaillé :** La section "Visite virtuelle" sur la fiche bien `prop1` (Villa moderne avec piscine) contient un lien cliquable qui pointe vers `https://example.com/visite-virtuelle.mp4`. C'est une URL placeholder de développement, totalement non fonctionnelle, visible par tous les utilisateurs.
**Correction exacte :**
- Option A (recommandée) : Intégrer un lecteur vidéo embarqué (iframe YouTube ou Vimeo, ou lecteur HTML5 natif). L'hôte peut ajouter une URL vidéo via son dashboard.
- Option B : Si aucune visite virtuelle n'est disponible pour un bien, masquer complètement la section (ne pas l'afficher avec un lien mort).
- Ne jamais exposer des URLs `example.com` ou placeholder à un utilisateur final.

---

### BUG 1.5 — Revenus de réservation mal calculés

**Page(s) concernée(s) :** `/reservations`
**Problème détaillé :** L'en-tête affiche "Revenus : 2 806 CHF". Ce montant semble inclure des réservations annulées (720 CHF pour Sophie Bernard annulée) et des réservations en attente (900 CHF + 1 750 CHF). Seules les réservations confirmées et terminées (2 450 CHF + 356 CHF = 2 806 CHF) devraient compter. Par coïncidence ces chiffres se combinent mais la logique doit être explicite.
**Correction exacte :**
- Le chiffre "Revenus" affiché en header ne doit compter que les statuts "Confirmée" + "Terminée".
- Ajouter des sous-totaux visuels explicites : "Revenus confirmés : X CHF · En attente de paiement : X CHF · Annulés : X CHF".
- Les stats "Total : 5, Confirmées : 1, En attente : 2" semblent correctes — vérifier que le compteur "Confirmées" ne compte pas les "Terminées".

---

### BUG 1.6 — Compteur de biens du profil ne correspond pas aux biens affichés

**Page(s) concernée(s) :** `/profil/u1` (Sophie Bernard/Martin)
**Problème détaillé :** Le profil de Sophie affiche "5 Biens" mais seulement 2 propriétés sont visibles dans l'onglet Biens (Penthouse Genève + Studio Carouge). 3 biens sont manquants.
**Correction exacte :** Le compteur doit correspondre exactement au nombre de biens affichés. Soit afficher les 5 biens, soit corriger le compteur à 2. Ce type d'incohérence chiffre/contenu détruit la confiance.

---

### BUG 1.7 — Nom de Sophie incohérent entre pages

**Page(s) concernée(s) :** `/profil/u1`, `/feed`, `/formations/f1`, `/explorer/prop1`, `/explorer/prop2`
**Problème détaillé :** Sur le feed et dans les formations, cette utilisatrice est "Sophie Martin". Sur `/profil/u1`, elle est "Sophie Bernard". Sur les fiches biens prop1 et prop2, l'hôte est aussi décrit comme "Sophie Martin". C'est la même photo (Unsplash) mais deux noms différents.
**Correction exacte :** Unifier le nom partout. Choisir "Sophie Martin" (le plus utilisé) et l'appliquer à l'URL `/profil/u1`, au profil public, aux posts, aux formations et aux fiches biens.

---

## 🔴 PRIORITÉ 2 — NAVIGATION ET ACCÈS PAR RÔLE

---

### NAV 2.1 — "Publier" visible mais bloqué pour le rôle Client

**Page(s) concernée(s) :** Toutes les pages (sidebar), `/publier`
**Problème détaillé :** "Publier" apparaît dans la navigation principale (sidebar desktop + bottom bar mobile) pour l'utilisateur Client. En cliquant dessus, on arrive sur une page "Accès restreint" qui dit simplement que le rôle Client ne peut pas publier. C'est frustrant et trompeur.
**Correction exacte :**
- Dans la sidebar, remplacer le lien "Publier" pour le rôle Client par un lien intitulé "Devenir Hôte / Agence" avec une icône de cadenas ou d'upgrade (🔓), qui redirige vers `/parametres` onglet "Rôles".
- Sur la page `/publier`, améliorer le message d'accès restreint : expliquer clairement les rôles qui permettent de publier, afficher un bouton CTA "Activer le rôle Hôte" qui mène directement à l'onglet Rôles.
- Dans la bottom bar mobile, même correction.

---

### NAV 2.2 — "Statistiques" visible mais bloqué pour le rôle Client

**Page(s) concernée(s) :** Sidebar, `/statistiques`
**Problème détaillé :** Même problème que Publier. "Statistiques" apparaît dans le menu pour tout le monde, mais la page affiche "Accès restreint" pour les Clients. C'est du bruit inutile dans la navigation.
**Correction exacte :**
- Masquer "Statistiques" dans la sidebar pour les rôles Client et Investisseur-lecture-seule.
- Pour les rôles Hôte/Agence/Promoteur/Formateur : afficher Statistiques avec un contenu réel (voir section Dashboard).
- Si on veut l'afficher à tous : ajouter une preview verrouillée avec un CTA "Débloquer avec le rôle Hôte".

---

### NAV 2.3 — Navigation principale surchargée pour tous les rôles

**Page(s) concernée(s) :** Sidebar desktop (13 items), Bottom bar mobile (5 items fixes)
**Problème détaillé :** La sidebar liste 13 liens visibles par tous : Feed · Live · Explorer · Publier · Favoris · Messages · Notifications · Réservations · Dashboard · Statistiques · Formations · Services · Événements. C'est identique pour un Client et un Promoteur, ce qui est incohérent et écrasant.
**Correction exacte — Navigation adaptative par rôle :**

**Client :** Feed · Explorer · Formations · Événements · Messages · Favoris · Réservations
**Hôte :** Feed · Explorer · Publier · Réservations · Calendrier · Messages · Dashboard · Statistiques · Live
**Agence / Agent :** Feed · Explorer · Publier · Réservations · Messages · Dashboard · Statistiques · Services
**Promoteur :** Feed · Explorer · Publier · Dashboard · Statistiques · Services · Événements
**Formateur :** Feed · Mes Formations · Live · Dashboard · Statistiques · Messages
**Apporteur :** Feed · Explorer · Dashboard Apporteur · Messages · Formations
**Investisseur :** Feed · Explorer · Favoris · Dashboard Investisseur · Formations · Événements

**Bottom bar mobile :** 5 éléments les plus utilisés selon le rôle. Ne jamais montrer des items bloqués dans la bottom bar.

---

### NAV 2.4 — Dashboard Client vide et sans valeur ajoutée

**Page(s) concernée(s) :** `/dashboard`
**Problème détaillé :** La page Dashboard affiche uniquement "👋 Bienvenue sur E-Dome" avec 3 liens (Favoris, Réservations, Explorer). Pour une plateforme de cette ambition, c'est une page quasi vide qui ne donne aucune information utile.
**Correction exacte — Dashboard adaptatif par rôle :**

**Dashboard Client :**
- Prochaines réservations (avec statut et date)
- Formations en cours (barre de progression, reprendre là où on s'est arrêté)
- Prochains événements auxquels il est inscrit
- Biens récemment consultés ou sauvegardés
- Suggestions personnalisées de biens (basées sur les favoris et l'historique)
- Fil d'actualité de ses abonnements (résumé)

**Dashboard Hôte :**
- Revenus du mois en cours vs mois précédent (graphique)
- Réservations en attente d'action (bouton Confirmer/Refuser direct)
- Taux d'occupation de chaque bien (graphique circulaire)
- Messages non lus avec aperçu
- Prochains check-ins (dans les 7 jours)
- Biens les plus vus cette semaine
- Commissions apporteurs actives

**Dashboard Formateur :**
- Revenus formations du mois
- Nombre de nouveaux inscrits cette semaine
- Formations les mieux notées
- Prochain live programmé (countdown)
- Statistiques par formation (vues, inscrits, taux de completion)

**Dashboard Apporteur :**
- Total des commissions générées (vie + 30 derniers jours)
- Réservations apportées (liste avec statut)
- Liens de tracking générés (avec clics et conversions)
- Classement de performance apporteur
- Commissions en attente de paiement vs reçues

**Dashboard Investisseur :**
- Portefeuille de biens suivis/investis
- Rendement global estimé
- Alertes : nouveaux biens matchant ses critères
- Évolution des prix dans ses zones d'intérêt

---

## 🔴 PRIORITÉ 3 — FONCTIONNALITÉS NON FONCTIONNELLES (PAGE PAR PAGE)

---

### FEED — `/feed`

**3.1 — Stories non fonctionnelles**
Les stories (Sophie, Marc, Amira, Thomas + "Votre story") s'affichent mais aucun clic ne réagit. Aucune story ne s'ouvre.
**Correction :** Implémenter un overlay plein écran de story : fond sombre, image/vidéo centrée, barre de progression en haut, fermeture par clic n'importe où ou icône ×, défilement automatique après 5 secondes. "Votre story" ouvre une interface de création (upload photo/vidéo). Les stories vues doivent s'afficher avec un cercle grisé (déjà vues). Les non-vues = cercle coloré gradient.

**3.2 — Interactions Feed non persistantes**
Les compteurs de likes/commentaires s'affichent (450, 119, 159, 65, 294) mais il est impossible de liker, commenter ou partager depuis le feed.
**Correction :** Ajouter sur chaque post les boutons d'action :
- ❤️ **Like** : toggle actif/inactif, compteur se met à jour instantanément, animation cœur au clic.
- 💬 **Commenter** : ouvre un champ inline sous le post avec envoi par Entrée.
- 🔁 **Partager** : menu déroulant (Copier le lien · WhatsApp · Email · Partager sur le profil).
- 🔖 **Sauvegarder** : ajoute le post aux Favoris > onglet Publications.
- **…** Menu "Plus" : Signaler · Masquer · Ne plus voir ce compte.

**3.3 — Onglets Feed ne filtrent pas**
"Pour vous / Suivis / Tendances" : les 3 onglets affichent le même contenu.
**Correction :**
- **Pour vous :** Posts recommandés par l'algorithme (biens populaires, nouveaux comptes suggérés, posts engageants).
- **Suivis :** Uniquement les posts des comptes que l'utilisateur suit. Si aucun abonnement : message "Abonnez-vous à des comptes pour voir leur contenu" + suggestions.
- **Tendances :** Posts avec le plus de likes/commentaires des 48 dernières heures. Afficher les hashtags populaires en haut.

**3.4 — Liens hashtags et mentions sans destination**
Les hashtags (#immobilier, #luxe, etc.) redirigent vers `/recherche?q=#immobilier`. Les mentions @marc n'ont pas de lien visible.
**Correction :**
- La page `/recherche` doit exister et être fonctionnelle (voir section Recherche).
- Les mentions `@utilisateur` doivent pointer vers `/profil/[id_utilisateur]`.
- Les hashtags doivent ouvrir une page de résultats filtrés.

**3.5 — Boutons "Suivre" dans les suggestions**
Les boutons "Suivre" dans le widget "Suggestions" (Marc Dubois, Amira El Fassi, Thomas Weber) ne font rien.
**Correction :** Un clic "Suivre" → bouton devient "Suivi ✓", le compteur d'abonnés du profil cible augmente de 1, les posts de ce compte apparaissent dans l'onglet "Suivis" du feed. Un second clic → "Se désabonner" confirmation.

**3.6 — Widget "Événements à venir" du feed non cliquable**
Les deux événements en sidebar ("Salon immobilier Genève" et "Webinar investissement") s'affichent mais ne sont probablement pas cliquables.
**Correction :** Ces événements doivent être cliquables et rediriger vers la page de l'événement correspondant sur `/evenements/[id]`.

**3.7 — Widget "Tendances" du feed**
Les hashtags tendances (#immobilier 12.4K, etc.) sont affichés mais le clic ne filtre pas.
**Correction :** Clic sur un hashtag → redirige vers `/recherche?q=immobilier` avec les résultats filtrés.

**3.8 — Zone de création de post (Client)**
La zone de post en haut du feed (0/2000, bouton Publier, onglets Post/Reel) est visible pour le rôle Client.
**Correction :** Un Client peut créer des **publications sociales** (partager son opinion, ses recherches, des articles). Il ne peut pas publier de biens immobiliers. La zone de création doit être active pour tous les rôles mais avec des options différentes :
- Client → Post texte + photos uniquement.
- Hôte/Agence → Post texte + photos + possibilité d'attacher une fiche bien.
- Formateur → Post texte + photos + possibilité d'attacher une formation ou un live.

---

### EXPLORER — `/explorer`

**3.9 — Carte interactive absente**
Le bouton "Carte" existe mais aucune carte ne s'affiche.
**Correction :** Implémenter une carte interactive complète (Google Maps ou Mapbox) :
- Mode vue liste / vue carte (toggle en haut à droite).
- En mode carte : chaque bien = un marqueur avec le prix affiché sur le marqueur (style Airbnb).
- Clic sur un marqueur = popup avec photo miniature, nom, prix, note et lien "Voir le bien".
- Filtre synchronisé : quand on filtre les biens, les marqueurs disparaissent/apparaissent.
- Bouton "Rechercher dans cette zone" qui se déclenche quand on déplace la carte.
- Géolocalisation "Me localiser" (bouton en haut à gauche de la carte).

**3.10 — Filtres de type de bien non fonctionnels**
Les filtres "Tout / Location CT / Location LT / Vente / Terrains" n'affectent pas la liste.
**Correction :** Chaque filtre doit modifier dynamiquement la liste. Filtre actif = style visuel distinctif (fond coloré, underline, etc.). Le compteur de résultats doit se mettre à jour ("6 biens trouvés" → "3 biens trouvés" avec filtre Vente).

**3.11 — Tri non fonctionnel**
"Plus récents / Prix croissant / Prix décroissant" : les 3 options donnent le même ordre.
**Correction :** Le tri doit réellement réordonner les biens affichés selon le critère choisi. Ajouter aussi : "Mieux notés" et "Surface croissante/décroissante".

**3.12 — Filtres avancés manquants**
Aucun filtre avancé n'est disponible (fourchette de prix, surface, chambres, pays, etc.).
**Correction :** Ajouter un panneau "Filtres avancés" (bouton en haut) avec :
- Fourchette de prix (slider min-max)
- Nombre de chambres (1, 2, 3, 4, 5+)
- Nombre de salles de bain
- Surface (m²) min-max
- Pays / Ville (champ de recherche avec autocomplétion)
- Note minimale (étoiles)
- Équipements (piscine, garage, jardin, WiFi, etc.)
- Disponibilité (sélecteur de dates pour Location CT)
- Rendement brut minimum (pour les Investisseurs)
- Bouton "Appliquer" et "Réinitialiser"

**3.13 — "Charger plus" incomplet**
La page affiche "9 biens trouvés" mais seulement 6 sont visibles. Le bouton "Charger plus" existe.
**Correction :** Charger les 3 biens restants au clic sur "Charger plus". Afficher "Affichage de 6 sur 9 biens". Quand tous sont affichés, le bouton disparaît ou devient inactif avec le texte "Tous les biens sont affichés".

---

### FICHE BIEN — `/explorer/prop1` (Vente) et `/explorer/prop2` (Location CT)

**3.14 — Fiche Vente : pas de bouton "Planifier une visite"**
Sur prop1 (Villa 1 850 000 CHF), le seul CTA est "Contacter". C'est trop vague.
**Correction :** Ajouter des CTAs contextuels pour les biens en vente :
- "Planifier une visite" → ouvre un sélecteur de créneaux horaires ou envoie une demande à l'agent.
- "Faire une offre" → formulaire d'offre d'achat avec montant proposé et conditions.
- "Contacter l'agent" → ouvre la messagerie.
- "Télécharger la fiche PDF" → génère un PDF du bien.

**3.15 — Fiche Location CT : pas de widget de réservation complet**
Sur prop2 (Appartement 250 CHF/nuit), il y a un calendrier et un bouton "Demander la disponibilité" mais pas de vrai tunnel de réservation.
**Correction :** Remplacer "Demander la disponibilité" par un widget de réservation Airbnb-like :
1. Calendrier de sélection (Arrivée → Départ) avec dates indisponibles barrées en rouge.
2. Sélecteur de voyageurs.
3. Affichage du calcul automatique : X nuits × 250 CHF = X CHF + frais de service E-Dome + options sélectionnées.
4. Liste des options disponibles (Nettoyage 150 CHF ✓, Transfert aéroport 80 CHF ✓, etc.) avec cases à cocher.
5. Bouton "Réserver" → tunnel de paiement (si connecté) ou "Se connecter pour réserver" (si non connecté).
6. En-dessous : "Contacter l'hôte avant de réserver".

**3.16 — Calendrier de disponibilité non interactif**
Le calendrier d'avril 2026 sur prop2 affiche les jours mais sans distinction visuelle entre dates disponibles et indisponibles.
**Correction :** Les dates réservées doivent être barrées ou grises avec curseur "non disponible". Les dates disponibles = blanches cliquables. Les weekends peuvent avoir un style différent. Navigation entre mois (mois précédent/suivant).

**3.17 — Options additionnelles sur prop2 : pas achetables**
Les options (Nettoyage 150 CHF, Transfert 80 CHF, etc.) sont listées mais non sélectionnables ni achetables.
**Correction :** Chaque option doit avoir une case à cocher. Les options cochées s'ajoutent au total de la réservation. Ce total est affiché en temps réel dans le widget de réservation.

**3.18 — Simulateur hypothécaire statique**
Sur prop1, le simulateur affiche des valeurs (Mensualité : 7 142 CHF, Coût total : 1 714 001 CHF) qui ne se recalculent pas quand on modifie l'apport, la durée ou le taux.
**Correction :** Implémenter le calcul en temps réel. Formule standard de crédit immobilier : M = P × (r(1+r)^n) / ((1+r)^n - 1) où P = capital emprunté, r = taux mensuel, n = nombre de mensualités. Ajouter des sliders pour l'apport (0-50% du prix) et la durée (5-30 ans). Le taux peut être manuel ou suggéré automatiquement.

**3.19 — Formulaire "Laisser un avis" non fonctionnel sur les fiches biens**
Le formulaire d'avis existe (bouton "Publier l'avis") mais sans champ de texte visible ni notation par étoiles.
**Correction :**
- Afficher un système de notation 1-5 étoiles cliquables.
- Champ texte "Votre avis" (minimum 20 caractères).
- Bouton "Publier" : l'avis s'affiche immédiatement dans la liste, le nombre d'avis et la note moyenne se mettent à jour.
- L'avis doit aussi apparaître sur le profil public de l'hôte.
- Restriction : ne permettre l'avis qu'aux utilisateurs ayant eu une réservation terminée pour ce bien.

**3.20 — Galerie photos sans navigation**
Les 5 photos du bien s'affichent mais sans boutons de navigation entre elles, sans vue plein écran, sans compteur.
**Correction :** Ajouter flèches gauche/droite, navigation par points (ou miniatures), vue lightbox plein écran au clic, compteur "2/5", swipe mobile.

**3.21 — "Sauvegarder" ne sauvegarde pas**
Le bouton "Sauvegarder" sur les fiches biens ne semble pas ajouter le bien aux favoris.
**Correction :** Clic "Sauvegarder" → icône cœur devient plein (rouge), le bien apparaît dans `/favoris` onglet Biens. Second clic → retire des favoris avec confirmation. Si non connecté → rediriger vers la connexion.

**3.22 — "Partager" et "Imprimer" non fonctionnels**
Les boutons "Partager" et "Imprimer" n'ont pas d'action visible.
**Correction :**
- "Partager" → menu déroulant : Copier le lien · WhatsApp · Email · LinkedIn · Instagram.
- "Imprimer" → `window.print()` avec CSS d'impression adapté (masquer nav, header, footer, montrer seulement les infos du bien).

**3.23 — "Biens similaires" avec liens brisés**
Les biens similaires pointent vers `/explorer/prop4`, `/explorer/prop8`, `/explorer/prop5`. `prop8` et d'autres n'ont pas été vérifiés mais peuvent pointer vers des biens inexistants.
**Correction :** Vérifier que tous les IDs de biens similaires correspondent à des fiches existantes. Mettre en place une logique de suggestion basée sur le type de bien, la localité et la fourchette de prix.

---

### MESSAGES — `/messages`

**3.24 — Conversations non cliquables / messagerie non fonctionnelle**
3 conversations sont listées à gauche (Sophie Bernard, Jean Dupont, Marie Leroy) mais cliquer dessus n'ouvre probablement pas le fil de discussion. La zone principale dit "Sélectionnez une conversation" de façon permanente.
**Correction :** Implémenter une messagerie deux colonnes fonctionnelle :
- Colonne gauche : liste des conversations avec photo, nom, dernière ligne du message, date et badge "non lu" (point bleu).
- Clic sur une conversation → colonne droite affiche l'historique complet des messages, classés chronologiquement avec date/heure.
- En bas de la colonne droite : champ de saisie + bouton Envoyer (ou Entrée).
- Indicateur "En train d'écrire…".
- Bouton "+" pour démarrer une nouvelle conversation (recherche d'utilisateur par nom).
- Bouton d'attachment : joindre une photo, un document PDF, une fiche bien (lien vers `/explorer/[id]`).
- Option : Bloquer un utilisateur · Signaler.

---

### RÉSERVATIONS — `/reservations`

**3.25 — Boutons "Confirmer" et "Annuler" sans effet**
Les réservations "En attente" (Jean Dupont, Marie Leroy) ont des boutons Confirmer/Annuler qui ne changent probablement pas le statut.
**Correction :**
- "Confirmer" → modale de confirmation "Confirmer la réservation de X du [date] au [date] ?" → Oui/Non. Si oui : statut devient "Confirmée", notification envoyée au client, dates bloquées dans le calendrier du bien.
- "Annuler" → modale avec champ "Raison de l'annulation" + bouton Confirmer l'annulation. Statut devient "Annulée". Notification envoyée au client. Politique de remboursement automatique.

**3.26 — Bouton "Facture" non fonctionnel**
Chaque réservation a un bouton "Facture" qui ne génère rien.
**Correction :** Clic sur "Facture" → génère et télécharge un PDF de facture contenant : logo E-Dome, numéro de facture unique, date d'émission, nom et coordonnées des deux parties, détail du bien, dates du séjour, nombre de nuits, prix/nuit, options additionnelles, frais de service, total TTC, conditions d'annulation.

**3.27 — "Laisser un avis" sur réservation terminée ne fonctionne pas**
Le bouton apparaît sur la réservation terminée de Marie Leroy mais n'ouvre probablement rien.
**Correction :** Ouvre une modale avec : système de notation 1-5 étoiles séparées (Propreté, Communication, Emplacement, Rapport qualité/prix), champ texte libre, bouton Soumettre. L'avis est ensuite visible sur la fiche bien et le profil de l'hôte. Un seul avis par réservation terminée.

**3.28 — Vue "Calendrier" des réservations non fonctionnelle**
Le toggle "Liste / Calendrier" existe mais la vue calendrier affiche probablement une page vide.
**Correction :** La vue Calendrier doit afficher un calendrier mensuel (navigable) avec les réservations placées sur leurs dates sous forme de blocs colorés (vert = confirmée, orange = en attente, gris = terminée, rouge = annulée). Clic sur un bloc = popup avec les détails.

**3.29 — Filtres de statut dans les réservations**
Les onglets "Toutes / En attente / Confirmées / Terminées / Annulées" existent mais filtrent-ils réellement ?
**Correction :** Chaque onglet doit afficher uniquement les réservations du statut correspondant. L'onglet actif a un style visuel distinct. Le compteur dans le header ("Total 5, Confirmées 1, En attente 2") doit correspondre aux vrais chiffres.

---

### LIVE — `/live`

**3.30 — Boutons "S'inscrire" aux prochains lives sans action**
Les 3 lives à venir (Marc Bonnard, Sophie Meier, Laura Fischer) ont des boutons "S'inscrire" qui ne font rien.
**Correction :** "S'inscrire" → enregistre l'inscription, affiche "Inscrit ✓" avec option "Se désinscrire", envoie une notification/email de confirmation avec le lien de connexion au live, et ajoute le live au calendrier de l'utilisateur. Le compteur d'inscrits se met à jour (124 → 125).

**3.31 — Replays sans lecteur vidéo**
Les 6 replays affichent un bouton ▶ et une durée (1h12, 45min, etc.) mais aucun lecteur ne s'ouvre.
**Correction :** Clic sur un replay → ouvre une page dédiée ou une modale avec :
- Lecteur vidéo intégré (YouTube iframe, Vimeo, ou lecteur HTML5 natif).
- Titre, orateur, date.
- Compteur de vues mis à jour.
- Boutons : pause/play, volume, plein écran, vitesse de lecture (0.75x, 1x, 1.25x, 1.5x, 2x).
- Certains replays peuvent être payants (accès après paiement).

**3.32 — Aucun live en cours : absence de contenu de remplacement**
Quand il n'y a pas de live en cours, la section affiche juste "Aucun live en cours" sans aucun CTA engageant.
**Correction :** Améliorer l'état vide : afficher "Le prochain live commence dans [countdown timer]" avec le titre du prochain live, un bouton "S'inscrire". Afficher aussi 2-3 replays populaires recommandés.

**3.33 — Aucun bouton pour lancer un live**
Les utilisateurs Hôtes, Formateurs, Agences n'ont aucun bouton pour créer ou lancer un live depuis cette page.
**Correction :** Pour ces rôles, afficher en haut de la page `/live` un bouton "Programmer un live" qui ouvre un formulaire : titre, date/heure, durée estimée, description, prix (gratuit ou payant), lien de diffusion (YouTube Live, etc.), image de couverture.

---

### FORMATIONS — `/formations` et `/formations/f1`

**3.34 — Modules 2 à 5 vides sur la fiche formation**
Sur `/formations/f1`, le module 1 est détaillé (3 leçons avec durées). Les modules 2, 3, 4, 5 sont affichés avec "X leçons" mais sans détail de contenu.
**Correction :** Chaque module doit être un accordéon qui s'ouvre au clic pour révéler les leçons (titre + durée). Les modules non achetés peuvent être verrouillés mais leurs titres et durées sont visibles (comme sur Udemy).

**3.35 — Bouton "S'inscrire à la formation" sans tunnel de paiement**
Le bouton "S'inscrire à la formation (299 CHF)" n'a pas de tunnel de paiement visible.
**Correction :** Clic → étapes :
1. Récapitulatif de commande (formation, prix, formateur).
2. Choix de paiement (carte, Apple Pay, Google Pay).
3. Confirmation et accès immédiat.
- Pour les formations déjà achetées : bouton devient "Reprendre la formation" et mène directement à la leçon en cours.

**3.36 — Aucun lecteur vidéo dans les formations achetées**
Il n'y a aucun lecteur de leçon visible. L'utilisateur a 65% de progression sur la formation f1 mais aucun moyen de regarder les vidéos.
**Correction :** Une fois une formation achetée/inscrite, cliquer sur une leçon doit ouvrir :
- Un lecteur vidéo full-width en haut (YouTube embed, Vimeo ou natif).
- La liste des leçons à gauche (sidebar) avec progression (✓ terminée, → en cours, ○ à faire).
- Sous la vidéo : onglets (Description · Ressources téléchargeables · Notes · Questions/Réponses).
- Bouton "Marquer comme terminé" pour passer à la leçon suivante.
- Barre de progression globale en haut.

**3.37 — Filtres de catégorie des formations non fonctionnels**
Les onglets de catégorie (Tous / Immobilier / Finance / Marketing / Juridique / Design / Gestion locative / Investissement) sont cliquables mais ne filtrent pas les formations affichées.
**Correction :** Chaque onglet filtre réellement les formations. L'onglet actif est visuellement distinct. Le nombre de formations dans chaque catégorie peut être affiché entre parenthèses (Finance · 2).

---

### SERVICES — `/services` et `/services/proposer`

**3.38 — Boutons "Demander un devis" sans action**
Les 9 services affichés ont chacun un bouton "Demander un devis" qui ne fait rien.
**Correction :** Clic → ouvre une modale ou une page dédiée avec :
- Nom du service et prestataire (pré-remplis).
- Champ "Description de votre besoin".
- Date souhaitée.
- Lieu de la prestation.
- Numéro de téléphone ou email de contact.
- Bouton "Envoyer la demande" → notifie le prestataire par email/notification + crée une demande visible dans "Mes demandes de devis" (à créer dans le profil ou dashboard).

**3.39 — Formulaire "Proposer un service" : UX problématique**
Sur `/services/proposer`, le champ "Photos (URLs)" demande à l'utilisateur d'entrer manuellement des URLs d'images. C'est une expérience catastrophique. Aucun utilisateur normal ne connaît les URLs directes de ses photos.
**Correction :** Remplacer le champ URL par un bouton "Ajouter des photos" qui ouvre un sélecteur de fichiers (upload natif). Limiter à 5 photos max. Afficher des miniatures après upload. Les URLs sont gérées côté backend, invisible pour l'utilisateur.

**3.40 — Formulaire "Proposer un service" : pas de soumission fonctionnelle**
Le bouton "Publier le service" ne crée probablement pas de service réel.
**Correction :** La soumission du formulaire doit :
1. Valider les champs obligatoires (titre, catégorie, description, tarif).
2. Créer une fiche service avec statut "En attente de validation".
3. Notifier l'équipe E-Dome pour modération.
4. Confirmer à l'utilisateur : "Votre service a été soumis. Il sera visible après validation sous 24-48h."
5. Afficher le service dans "Mes services proposés" dans le Dashboard.

---

### ÉVÉNEMENTS — `/evenements` et `/evenements/creer`

**3.41 — "S'inscrire" aux événements sans traitement**
Les 4 événements listés ont un bouton "S'inscrire" qui ne traite probablement pas l'inscription.
**Correction :**
- **Événement gratuit :** Inscription directe → bouton devient "Inscrit ✓", compteur de places décrémente, confirmation email, ajout au calendrier.
- **Événement payant (45 CHF, 89 CHF, 35 CHF) :** Ouvre un tunnel de paiement → confirmation → ticket numérique (PDF ou QR code) → notification email.
- Un événement complet doit afficher "Complet - Liste d'attente" avec possibilité de s'inscrire sur la liste d'attente.

**3.42 — Vue "Calendrier" des événements non fonctionnelle**
Le toggle "Liste / Calendrier" est présent mais la vue calendrier est probablement vide ou non implémentée.
**Correction :** Vue calendrier mensuel avec les événements positionnés sur leurs dates. Clic sur un événement dans le calendrier → popup avec les détails et bouton S'inscrire.

**3.43 — Formulaire "Créer un événement" accessible à tous les rôles**
Sur `/evenements/creer`, n'importe qui (y compris un Client basique) peut accéder à ce formulaire.
**Correction :** Restreindre la création d'événements aux rôles : Hôte, Agence, Promoteur, Formateur. Pour un Client, le bouton "+ Créer" soit masqué, soit redirige vers une page expliquant quel rôle activer.

**3.44 — Formulaire "Créer un événement" : image par URL**
Même problème que Services : "Image de couverture (URL)" est une mauvaise UX.
**Correction :** Remplacer par un bouton d'upload d'image avec prévisualisation.

**3.45 — Formulaire "Créer un événement" : pas de soumission fonctionnelle**
Le bouton "Publier l'événement" ne publie probablement rien.
**Correction :** La soumission doit créer l'événement et l'afficher dans `/evenements` immédiatement (ou après validation). Le créateur voit l'événement dans son dashboard avec les statistiques d'inscription.

---

### CENTRE D'AIDE — `/aide`

**3.46 — Accordéon FAQ non fonctionnel**
Les questions affichées avec un "▼" ne s'ouvrent probablement pas pour révéler les réponses.
**Correction :** Chaque question est un accordéon cliquable. Au clic : la réponse apparaît en dessous, le "▼" tourne à "▲". Un deuxième clic ferme. Une seule question ouverte à la fois (ou plusieurs selon le design choisi).

---

### CONTACT — `/contact`

**3.47 — Formulaire de contact sans envoi réel**
Le formulaire (Sujet, Nom, Email, Message) est bien conçu mais le bouton "Envoyer le message" ne déclenche probablement aucun envoi d'email.
**Correction :** La soumission du formulaire doit envoyer un email réel à support@edome.world (via un service comme EmailJS, Resend, SendGrid ou équivalent no-code). L'utilisateur reçoit :
1. Un message de confirmation à l'écran "Votre message a été envoyé. Nous vous répondrons sous 24-48h."
2. Un email de confirmation automatique avec le récapitulatif de son message.

---

### INSCRIPTION — `/auth/inscription`

**3.48 — Processus d'inscription incomplet (seulement l'étape 1 visible)**
La page affiche "Étape 1 sur 3 — Identité" (Nom, Prénom, Email, Mot de passe). Les étapes 2 et 3 n'existent pas ou ne sont pas liées.
**Correction :** Implémenter les 3 étapes :
- **Étape 1 — Identité :** Prénom, Nom, Email, Mot de passe, Confirmation mot de passe.
- **Étape 2 — Rôle(s) :** Choix visuel du ou des rôles initiaux (Client, Hôte, Agence, etc.) avec icônes et courtes descriptions. Plusieurs sélectables.
- **Étape 3 — Profil :** Photo de profil (upload ou URL), Localisation (ville + pays), Bio courte, acceptation CGU. Bouton "Créer mon compte".

**3.49 — "Continuer avec Google" non fonctionnel**
Le bouton OAuth Google sur la page de connexion est probablement non connecté à une vraie intégration Google.
**Correction :** Connecter le bouton à Google OAuth 2.0. Après connexion Google : si nouvel utilisateur → aller à l'étape 2 d'inscription (choix du rôle). Si utilisateur existant → connexion directe.

**3.50 — "Mot de passe oublié ?" sans page dédiée**
Le lien "Mot de passe oublié ?" sur la page de connexion ne mène probablement nulle part.
**Correction :** Créer la page `/auth/mot-de-passe-oublie` avec un champ email et un bouton "Envoyer le lien de réinitialisation". L'email reçu contient un lien unique valide 1 heure vers `/auth/nouveau-mot-de-passe`.

---

## 🟠 PRIORITÉ 4 — FONCTIONNALITÉS MANQUANTES À CRÉER

---

### MANQUANT 4.1 — Système complet d'apporteurs d'affaires

Selon le concept, les apporteurs d'affaires sont un pilier de la monétisation. Rien n'existe sur le site.

**Page à créer : `/apporteurs`** (accessible avec le rôle Apporteur activé)
Contenu :
- **En-tête Dashboard :** Commissions totales générées · Commissions du mois · Réservations apportées · Taux de conversion
- **Mes liens de tracking :** Tableau avec chaque lien créé (bien cible, date de création, clics, conversions, commissions générées). Bouton "Copier le lien" par ligne. Bouton "Créer un nouveau lien" qui ouvre un sélecteur de bien à promouvoir.
- **Historique des commissions :** Tableau : Date · Bien · Client · Montant de la transaction · Commission plateforme · Ma commission · Statut (En attente / Payée)
- **Graphiques :** Évolution mensuelle des commissions · Répartition par type de transaction
- **Paiements :** Solde disponible · Bouton "Demander un virement" · Historique des virements reçus

**Côté Hôte — Section "Apporteurs" dans le Dashboard Hôte :**
- Activer/désactiver les apporteurs pour chaque bien
- Définir le % de commission apporteur (par défaut selon CGU)
- Voir les apporteurs actifs sur ses biens + performances

**Fonctionnement technique :**
- Chaque lien apporteur contient un paramètre unique `?ref=APPORTEUR_ID`
- Toute réservation générée via ce lien est attribuée à l'apporteur
- Cookie de tracking de 30 jours (si le visiteur revient réserver plus tard)
- Calcul automatique : 15% de la commission plateforme versée à l'apporteur
- Exemple : Location 1 000 CHF → commission plateforme 8% = 80 CHF → apporteur reçoit 15% de 80 CHF = 12 CHF

---

### MANQUANT 4.2 — Système de paiement intégré

Actuellement aucun paiement réel n'est possible sur le site (réservations, formations, événements, services).

**À implémenter :**
- Intégration Stripe (ou équivalent no-code) pour tous les tunnels de paiement.
- **Séquestration :** Le paiement de location CT est séquestré jusqu'au check-in (J+1 après arrivée), puis libéré automatiquement vers l'hôte (moins la commission E-Dome).
- **Split automatique :** Si un apporteur est attaché à la transaction, la commission apporteur est déduite automatiquement avant virement.
- **Wallet utilisateur :** Accessible dans `/parametres` onglet Facturation : Solde disponible · Demander un virement · Historique des transactions · Télécharger les factures.

---

### MANQUANT 4.3 — Page de recherche globale `/recherche`

Les hashtags et mentions redirigent vers `/recherche?q=...` mais cette page n'existe pas ou est vide.

**À créer :** Page de recherche universelle avec :
- Barre de recherche en haut (pré-remplie avec le terme de la query string).
- Onglets de résultats : Biens · Profils · Posts · Formations · Événements · Services.
- Filtres contextuels selon l'onglet actif.
- Résultats pertinents par catégorie.
- Recherche instantanée (debounce 300ms).
- Suggestions de recherche populaires quand le champ est vide.

---

### MANQUANT 4.4 — Barre de recherche globale accessible partout

Il n'y a aucun champ de recherche dans le header ou la navbar.

**À ajouter :** Une icône loupe 🔍 dans le header (à droite du logo ou en haut de la sidebar). Au clic : overlay de recherche full-width avec champ de saisie, suggestions en temps réel, recherches récentes.

---

### MANQUANT 4.5 — Onboarding des nouveaux utilisateurs

Aucun flow d'onboarding n'existe après l'inscription.

**À créer :** Après la première connexion (détection par flag `onboardingCompleted`), afficher un écran d'onboarding en 4 étapes :
1. **Bienvenue :** "Bienvenue sur E-Dome, [Prénom] !" + résumé des fonctionnalités clés (30 secondes).
2. **Compléter le profil :** Upload photo, bio, localisation. Barre de complétion "Votre profil est complété à 60%".
3. **Activer vos rôles :** Sélection visuelle des rôles souhaités.
4. **Commencer :** Suggestions personnalisées selon les rôles choisis (Explorer des biens · Publier un bien · Trouver une formation).
Bouton "Passer" à chaque étape. Barre de progression en haut.

---

### MANQUANT 4.6 — Page profil : onglets "Publications", "Avis" et "À propos" vides

Sur `/profil` et `/profil/u1`, l'onglet actif "Biens" affiche des propriétés. Les autres onglets (Publications, Avis, À propos) sont cliquables mais probablement vides.

**Onglet Publications :**
- Grille de posts (photos/vidéos) publiés par cet utilisateur, style Instagram.
- Clic sur un post → lightbox ou page de post dédiée avec likes, commentaires.

**Onglet Avis :**
- Pour un Hôte : avis laissés par des clients sur ses biens. Note globale + histogramme des étoiles (5★ · 4★ · etc.).
- Pour un Formateur : avis d'apprenants sur ses formations.
- Pour un Client : avis qu'il a reçus en tant que voyageur (évaluation par les hôtes).
- Date, texte, note, bien/formation associé, photo de l'auteur de l'avis.

**Onglet À propos :**
- Bio complète.
- Langues parlées.
- Membre depuis (date d'inscription).
- Liens externes (site web, LinkedIn, Instagram...).
- Certifications / badges obtenus.
- Zones géographiques de travail (pour agents et agences).
- Pour Investisseur : profil d'investissement (type de biens recherchés, budget, zones).

---

### MANQUANT 4.7 — Notifications fonctionnelles `/notifications`

La page `/notifications` (badge "5") n'a pas été accessible mais est probablement basique ou non fonctionnelle.

**À implémenter :**
- Liste chronologique des notifications avec icône de type, texte, heure relative, lien.
- Types : ❤️ Like · 💬 Commentaire · 👤 Nouvel abonné · 🏠 Nouvelle réservation · ✅ Réservation confirmée · ❌ Réservation annulée · 💰 Paiement reçu · 🎓 Formation disponible · 📅 Rappel événement · 📩 Nouveau message · ⭐ Nouvel avis.
- Clic sur une notification → marquer comme lu + rediriger vers la page concernée.
- Bouton "Tout marquer comme lu".
- Onglet Paramètres notifications dans `/parametres` pour activer/désactiver chaque type.

---

### MANQUANT 4.8 — Paramètres : onglet "Rôles" fonctionnel

L'onglet "Rôles" dans `/parametres` existe dans la navigation mais son contenu est inconnu.

**À implémenter :**
- Afficher tous les rôles disponibles avec une description courte et une icône.
- Pour chaque rôle : toggle Activer/Désactiver.
- Certains rôles nécessitent une vérification (KYC) : afficher "Vérification requise" avec lien vers le processus.
- Rôle actif actuellement = badge "Actif".
- "Changer le rôle affiché" : sélecteur pour choisir quel rôle apparaît sur le profil public.
- Les changements de rôle mettent à jour immédiatement la navigation et le dashboard.

---

### MANQUANT 4.9 — Paramètres : onglets complets

Les onglets Sécurité, Notifications, Confidentialité, Facturation dans `/parametres` ont été vus dans la navigation mais leur contenu est inconnu.

**Onglet Sécurité :**
- Changer le mot de passe (ancien, nouveau, confirmation).
- Activer/désactiver l'authentification à deux facteurs (2FA).
- Sessions actives (liste des appareils connectés avec bouton "Déconnecter").
- Historique des connexions.

**Onglet Notifications :**
- Toggle par type de notification : Email · In-app · Push (mobile).
- Paramétrable finement (ex : "Ne pas me notifier les likes, seulement les commentaires").

**Onglet Confidentialité :**
- Compte public ou privé.
- Qui peut voir mes biens / publications / abonnés.
- Bloquer des utilisateurs.
- Télécharger mes données.
- Supprimer mon compte (avec confirmation en 2 étapes).

**Onglet Facturation :**
- Wallet E-Dome : solde disponible + historique.
- Moyens de paiement enregistrés (ajouter/supprimer carte).
- Historique de toutes les transactions (achats formations, réservations, paiements reçus).
- Télécharger toutes les factures.
- Informations de facturation (pour les pros : SIRET/IDE, adresse de facturation).

---

## 🟡 PRIORITÉ 5 — INCOHÉRENCES UX ET PROBLÈMES DE COHÉRENCE

---

### UX 5.1 — Accents français manquants sur l'ensemble du site

De nombreuses pages ont des textes sans accents (résultat probable d'un encodage ou d'une base de données non UTF-8) :
- "Acces restreint" → "Accès restreint"
- "Developpez vos competences" → "Développez vos compétences"
- "Evenements" → "Événements"
- "Debutant" → "Débutant"
- "A propos" → "À propos"
- "Creer un evenement" → "Créer un événement"
- "Decrivez le service" → "Décrivez le service"
- "Trouvez les meilleurs prestataires" → accent correct ✓
- CGU entière sans accents

**Correction :** Vérifier et corriger l'encodage UTF-8 de toutes les chaînes de caractères dans la base de données et les templates. Passer en revue systematiquement toutes les pages et corriger chaque mot manquant d'accent.

---

### UX 5.2 — Sélecteur de langue non fonctionnel

"FR" est affiché dans le header mais le sélecteur ne change probablement pas la langue.
**Correction :** Implémenter le changement de langue (FR / EN au minimum). L'interface entière bascule en anglais quand EN est sélectionné. La préférence est sauvegardée dans le profil utilisateur.

---

### UX 5.3 — Sélecteur de devise non fonctionnel

"CHF" est affiché mais les prix ne se convertissent probablement pas.
**Correction :** Permettre de basculer entre CHF / EUR / USD / MAD (selon les pays cibles). Conversion en temps réel via un taux de change. La devise choisie est sauvegardée.

---

### UX 5.4 — Bottom bar mobile inadaptée

La navigation mobile affiche toujours : Feed / Explorer / Publier / Messages / Profil, quelle que soit la situation.
**Correction :** La bottom bar mobile doit être adaptée au rôle (voir NAV 2.3). L'icône active doit avoir un style visuel distinctif (couleur, point, underline).

---

### UX 5.5 — Photos via URLs (problème global)

Partout où l'utilisateur doit fournir des images (proposer un service, créer un événement, publier un bien, modifier le profil), des champs URL sont utilisés.
**Correction globale :** Remplacer tous les champs "URL d'image" par des composants d'upload natifs avec :
- Drag & drop ou bouton "Choisir un fichier".
- Prévisualisation immédiate après upload.
- Formats acceptés : JPG, PNG, WEBP.
- Taille max recommandée : 10 MB.
- Redimensionnement automatique côté backend.

---

### UX 5.6 — Page Dashboard trop générique dans le header

L'affichage "Client" dans la sidebar (sous "LD / Leo Demo") est statique. Si l'utilisateur change de rôle actif, ce label doit changer.
**Correction :** Ce badge de rôle doit être dynamique et refléter le rôle actif en temps réel. Idéalement, c'est un sélecteur rapide cliquable qui permet de switcher de rôle sans passer par les Paramètres.

---

### UX 5.7 — Favoris toujours vides malgré l'utilisation

La page `/favoris` affiche "Aucun favori" alors que l'utilisateur demo devrait logiquement avoir des favoris dans une démo.
**Correction :** Pré-remplir les favoris avec 2-3 biens pour le compte de démonstration. ET implémenter correctement le bouton "Sauvegarder" sur les fiches biens pour que les favoris se remplissent réellement quand un utilisateur clique.

---

### UX 5.8 — Statistiques masquées pour Client : aucune alternative proposée

La page `/statistiques` affiche juste "Accès restreint" sans aucune information utile ni invitation à monter de rôle.
**Correction :** Afficher une preview bloquée des statistiques avec un bandeau "Ces données seront disponibles avec le rôle Hôte" + bouton "Activer le rôle Hôte" + aperçu flou/verrouillé de graphiques.

---

## 🟢 PRIORITÉ 6 — AMÉLIORATIONS ET ENRICHISSEMENTS

---

### AMÉLIORATION 6.1 — Page d'accueil publique (Landing Page)

Actuellement, `/auth/connexion` est la seule entrée pour les non-connectés. Il n'y a pas de landing page publique présentant E-Dome.
**À créer : `/` (page d'accueil publique)**
Sections :
1. Hero : "L'écosystème immobilier tout-en-un" + CTA "Créer un compte" + "Voir les biens".
2. Chiffres clés : X biens · X utilisateurs · X pays · X CHF de transactions.
3. Fonctionnalités : Réseau social · Réservation · Formations · Apporteurs (cards avec icônes).
4. Témoignages d'utilisateurs.
5. Appel à l'action final : "Rejoignez E-Dome gratuitement".
6. Footer avec liens légaux et réseaux sociaux.

---

### AMÉLIORATION 6.2 — Boost de visibilité (fonctionnalité payante)

Le concept prévoit un système de boost payant pour mettre en avant les biens et posts.
**À ajouter :**
- Depuis la fiche bien ou le post : bouton "Booster ce bien / ce post".
- Choix de la durée (7j / 14j / 30j) et du budget.
- Le bien boosté apparaît en premier dans l'Explorer avec un badge "Mis en avant".
- Le post boosté apparaît dans le feed "Pour vous" d'utilisateurs non abonnés.

---

### AMÉLIORATION 6.3 — Signalement de contenu

Le lien "Signaler cette annonce" existe sur les fiches biens mais est probablement non fonctionnel.
**Correction :** Ouvre une modale avec les raisons de signalement : Fausse annonce · Contenu inapproprié · Prix incorrect · Doublons · Autre. Soumission → notifie l'équipe de modération.

---

### AMÉLIORATION 6.4 — Réseaux sociaux du Contact non vérifiés

La page Contact liste des liens vers LinkedIn, Instagram, Facebook, X, YouTube de E-Dome (linkedin.com/company/edome, instagram.com/edome.world, etc.).
**Vérifier :** Ces pages existent-elles réellement ? Si non, masquer les liens jusqu'à création des comptes ou mettre des liens placeholder vers "#".

---

### AMÉLIORATION 6.5 — Données investisseurs sur les fiches biens

La section "Analyse d'investissement" de prop1 (rendement brut 5.2%, net 3.8%, ROI 5 ans +32%, etc.) est très bien pour les Investisseurs.
**Amélioration :** Ajouter une option "Afficher en mode Investisseur" qui remplace la description classique par les données financières détaillées : historique des loyers, comparaison avec le marché local, graphique d'évolution de valeur, simulation de cashflow mensuel.

---

## 📋 TABLEAU DE BORD — ORDRE D'EXÉCUTION POUR L'IA NO-CODE

| # | Section | Action | Priorité |
|---|---------|---------|----------|
| 1 | Global | Corriger le spinner "Chargement..." permanent | 🔴 Critique |
| 2 | Global | Unifier les noms (Leo Demo/Martin, Sophie Martin/Bernard) | 🔴 Critique |
| 3 | Global | Corriger tous les accents français manquants | 🔴 Critique |
| 4 | Global | Remplacer tous les champs URL-image par des uploads | 🔴 Critique |
| 5 | `/profil` | Adapter le profil au rôle Client (suppr. onglet Biens) | 🔴 Critique |
| 6 | `/explorer/prop1` | Supprimer/réparer la visite virtuelle brisée | 🔴 Critique |
| 7 | `/reservations` | Recalculer les revenus (exclure annulés) | 🔴 Critique |
| 8 | Navigation | Adapter la sidebar et bottom bar au rôle actif | 🔴 Critique |
| 9 | `/dashboard` | Créer des dashboards complets par rôle | 🔴 Critique |
| 10 | `/publier` | Améliorer le message d'accès restreint + CTA rôle | 🔴 Critique |
| 11 | `/messages` | Implémenter messagerie fonctionnelle | 🔴 Critique |
| 12 | `/explorer` | Connecter les filtres et tris | 🟠 Élevé |
| 13 | `/explorer` | Implémenter la carte interactive | 🟠 Élevé |
| 14 | `/explorer/prop2` | Implémenter le widget de réservation complet | 🟠 Élevé |
| 15 | `/explorer/prop2` | Rendre le calendrier de dispo interactif | 🟠 Élevé |
| 16 | `/explorer/prop1` | Simulateur hypothécaire dynamique | 🟠 Élevé |
| 17 | `/feed` | Implémenter les interactions (likes, commentaires) | 🟠 Élevé |
| 18 | `/feed` | Implémenter les stories | 🟠 Élevé |
| 19 | `/feed` | Connecter les onglets Pour vous/Suivis/Tendances | 🟠 Élevé |
| 20 | `/live` | Connecter les replays à un lecteur vidéo | 🟠 Élevé |
| 21 | `/live` | Rendre les inscriptions fonctionnelles | 🟠 Élevé |
| 22 | `/reservations` | Boutons Confirmer/Annuler fonctionnels | 🟠 Élevé |
| 23 | `/reservations` | Génération de factures PDF | 🟠 Élevé |
| 24 | `/formations/f1` | Accordéon des modules + lecteur vidéo | 🟠 Élevé |
| 25 | `/services` | Boutons "Demander un devis" fonctionnels | 🟡 Moyen |
| 26 | `/evenements` | Boutons "S'inscrire" fonctionnels + paiement | 🟡 Moyen |
| 27 | `/aide` | Accordéon FAQ fonctionnel avec réponses | 🟡 Moyen |
| 28 | `/contact` | Envoi d'email réel | 🟡 Moyen |
| 29 | `/auth/inscription` | Compléter les étapes 2 et 3 | 🟡 Moyen |
| 30 | `/auth/connexion` | Connecter Google OAuth + mot de passe oublié | 🟡 Moyen |
| 31 | Nouveau | Créer le système apporteurs complet | 🟡 Moyen |
| 32 | Nouveau | Créer `/recherche` globale fonctionnelle | 🟡 Moyen |
| 33 | Nouveau | Créer le flow d'onboarding | 🟡 Moyen |
| 34 | `/profil` | Onglets Publications, Avis, À propos complets | 🟡 Moyen |
| 35 | `/parametres` | Tous les onglets fonctionnels (Sécurité, Facturation…) | 🟡 Moyen |
| 36 | Intégration | Stripe / paiements sur tout le site | 🟡 Moyen |
| 37 | Nouveau | Landing page publique `/` | 🟢 Normal |
| 38 | Global | Sélecteur de langue fonctionnel | 🟢 Normal |
| 39 | Global | Sélecteur de devise fonctionnel | 🟢 Normal |
| 40 | `/statistiques` | Débloquer avec preview pour Client | 🟢 Normal |

---

*Document établi après inspection complète du site E-Dome (https://plateforme-beige.vercel.app) et analyse des documents de concept. Toutes les pages accessibles ont été visitées et auditées. — Avril 2026*
