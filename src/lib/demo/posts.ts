import { properties as ALL_PROPERTIES, formations as ALL_FORMATIONS } from "@/lib/mock-data";
import { CURRENT_USER as DEMO_USER } from "@/lib/demo/identity";
import { DIRECTORY, requirePerson } from "@/lib/demo/directory";
import { followingOf } from "@/lib/demo/social";
import { DEMO_TODAY } from "@/lib/demo/clock";
import { buildObjectAffiliate } from "@/lib/referral-links";
import type { User, SocialPost, Comment, Property } from "@/lib/types";

/* ── Les données du fil ──────────────────────────────────────────────────

   Extrait de `src/app/(app)/feed/page.tsx`, qui faisait 3 232 lignes.
   Ce fichier ne porte que des données et les fabriques qui les
   construisent depuis le catalogue partagé : aucun rendu, aucun état.

   La séparation n'est pas cosmétique. `/creer-post` redéclarait ses
   propres utilisateurs et son propre catalogue de biens, et les deux
   divergeaient. Une seule déclaration rend la divergence impossible. */

// ─── Users ─────────────────────────────────────────────────────────────────

/* L utilisateur courant, derive de demo/identity.

   Il portait ici une troisieme identite : Geneve au lieu de Lausanne,
   « Co-fondateur E-Dome » au lieu de « Fondateur », 12 400 abonnes, 38 biens
   et 12,4 millions de francs de revenu cumule. Ces chiffres se lisaient comme
   une traction de la plateforme, puisque la personne EST la plateforme. */
export const U_LEO: User = requirePerson(DEMO_USER.id);

/* Compte de la plateforme. Il n'existe que pour le post épinglé d'accueil.

   Ce message était signé par l'utilisateur de démonstration. Après l'étape 2,
   cet utilisateur est un propriétaire lausannois qui loue en courte durée, pas
   un porte-parole : un avis de la plateforme signé par lui ramenait dans le
   fil la confusion que l'étape 2 avait retirée du profil.

   Aucune statistique, et c'est voulu — un compte officiel qui annoncerait des
   abonnés serait précisément l'affirmation de traction qu'on retire partout
   ailleurs. Les zéros ne s'affichent pas : `ActionBtn` masque déjà tout
   compteur nul. L'avatar est l'icône de l'application, celle produite par
   `npm run icons`. */
export const U_EDOME: User = {
  id: "edome",
  firstName: "E-Dome",
  lastName: "",
  email: "contact@e-dome.ch",
  avatar: "/icons/icon-192x192.png",
  city: "Suisse",
  country: "Suisse",
  roles: ["admin"],
  activeRole: "admin",
  stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 },
  bio: "Compte officiel de la plateforme.",
};

/* Les auteurs du fil sont de VRAIES personnes de l'annuaire, choisies dans le
   casting des seize (analyse2/casting.md). Le contenu du fil sera réécrit au
   chantier P2bis (« le fil vivant ») ; ici, les posts ont été ré-attribués à la
   personne du casting qui pouvait les écrire, et ceux dont le sujet n'existe
   plus (Dubaï, Zurich, Lugano, Crans-Montana, riad à vendre) ont été retirés.
   `requirePerson` échoue au chargement si un de ces ids disparaissait. */
export const U_CELINE = requirePerson("user-002"); // agente indépendante, Lutry
export const U_ENNIO = requirePerson("user-003"); // investisseur, Genève
export const U_NIKOLA = requirePerson("user-005"); // photographe, Yverdon
export const U_ANA = requirePerson("user-006"); // cherche à louer, Renens
export const U_CLEMENCE = requirePerson("user-008"); // premier achat, Morges
export const U_RETO = requirePerson("user-009"); // architecte, Fribourg
export const U_ELENA = requirePerson("user-010"); // home staging, Vevey
export const U_SANDRINE = requirePerson("user-011"); // formatrice fiscalité, Neuchâtel
export const U_MIRJANA = requirePerson("user-013"); // hôte, Montreux
export const U_JEANLUC = requirePerson("user-015"); // Hartmann Immobilier SA
export const U_AMINA = requirePerson("user-016"); // formatrice, Marrakech

// ─── Helpers ───────────────────────────────────────────────────────────────

/* Daté sur l'horloge FIGÉE de la démo, pas `Date.now()` : un timestamp calculé
   au chargement du module diffère entre le serveur et le client, ce qui
   provoquait une erreur d'hydratation dans le fil (audit Mission 2). */
export const hAgo = (h: number) => new Date(DEMO_TODAY.getTime() - h * 3600_000).toISOString();

export type SimpleComment = { author: User; content: string; h?: number; likes?: number };

export const mkComments = (postId: string, items: SimpleComment[]): Comment[] =>
  items.map((c, i) => ({
    id: `c-${postId}-${i}`,
    author: c.author,
    content: c.content,
    createdAt: hAgo(c.h ?? 1),
    likes: c.likes ?? 0,
  }));

/* Bien attaché à un post, lu dans le catalogue partagé.

   Le feed définissait ses propres biens en dur, sous des identifiants déjà
   pris par des biens différents : la carte « Penthouse 360° · Rive droite
   Genève » à 4,8 M CHF ouvrait une villa à Nice à 2,85 M EUR. Les huit
   biens qui n'existaient que dans le feed ont été versés au catalogue
   (prop15 à prop22) ; les deux autres y figuraient déjà.

   Un identifiant inconnu casse maintenant la compilation, pas la page. */
export const propRef = (id: string): Property => {
  const found = ALL_PROPERTIES.find((p) => p.id === id);
  if (!found) throw new Error(`Bien inconnu référencé par le feed : ${id}`);
  return found;
};

/* Carte formation d'un post, construite depuis le catalogue partagé.

   Les cartes portaient auparavant des identifiants « f1 » à « f5 » et des
   titres qui n'existaient nulle part ailleurs : cliquer ouvrait une
   formation différente de celle annoncée. En lisant le catalogue, la carte
   et la fiche ne peuvent plus diverger — et un identifiant inconnu casse
   la compilation plutôt que l'expérience. */
export const mkFormation = (id: string): NonNullable<SocialPost["formation"]> => {
  const f = ALL_FORMATIONS.find((x) => x.id === id);
  if (!f) throw new Error(`Formation inconnue référencée par le feed : ${id}`);
  return {
    id: f.id,
    title: f.title,
    instructor: `${f.instructor.firstName} ${f.instructor.lastName}`,
    price: f.price,
    students: f.studentCount,
    thumbnail: f.thumbnail,
  };
};

/* Lien d'affiliation vers une formation. Son `redirect` pointe vers
   /formations/<id> : il doit donc porter un identifiant du catalogue, sans
   quoi le lien partagé mène à une page introuvable. */
export const mkFormationAffiliate = (id: string) => {
  const f = mkFormation(id);
  return buildObjectAffiliate("formation", f.id, f.title, {
    price: f.price,
    image: f.thumbnail,
  });
};

// ─── Posts: 27 vidéos ──────────────────────────────────────────────────────

export const clip = (n: number) => `/videos/feed/clip-${String(n).padStart(2, "0")}.mp4`;

/* Le post d'accueil est ÉPINGLÉ, pas seulement récent.

   Le fil trie par date décroissante. L'avertissement portait `hAgo(2)`,
   donc tout ce qui était plus récent passait devant : à l'écran il arrivait
   en cinquième position, après quatre annonces et un sondage. Le lecteur
   rencontrait les exemples avant d'apprendre que c'en sont — exactement
   l'inverse de ce que ce post doit faire.

   Le dater à l'instant aurait été fragile : publier depuis le composer crée
   un post plus récent, qui le repousserait aussitôt. L'épinglage est donc
   explicite, et il tient sur les deux onglets — un avis de la plateforme
   n'est pas le contenu d'un compte qu'on suit ou non. */
export const PINNED_POST_ID = "p1";

export const VIDEO_POSTS: SocialPost[] = [
  {
    id: "p1", author: U_EDOME,
    /* Post épinglé. C'est la première chose que lit un visiteur arrivé depuis
       la landing, donc c'est là que la maquette se présente pour ce qu'elle
       est — avant les biens, les montants et les avis qui suivent.

       Il portait 4 521 « j'aime » et trois commentaires élogieux : « fier de
       faire partie de l'aventure depuis le jour 1 », « la meilleure
       plateforme pour les investisseurs sérieux », « bravo, le Maroc te
       remercie ». Le compteur était le dernier écho des « +4 500 inscrits »
       retirés en phase A, et les trois commentaires étaient des témoignages
       fabriqués pour une plateforme qui n'a pas encore d'utilisateurs.

       Aucun compteur, aucun commentaire : `likes: 0` et `comments: []`
       suffisent, parce qu'`ActionBtn` n'affiche pas un compteur nul. Rien à
       ajouter au composant — un avertissement qui demande du code spécial
       finit toujours par être contourné.

       Plus de lieu non plus : un avis de la plateforme n'est pas géolocalisé,
       et celui-ci annonçait Genève pour un auteur devenu lausannois. */
    content: "Bienvenue sur E-Dome\n\nVous parcourez une maquette de démonstration. Tout ce qui suit est un exemple : les profils, les biens, les annonces, les montants, les avis et les commentaires. Aucun chiffre affiché ici ne décrit l'activité réelle d'E-Dome, et aucune personne présentée n'est un utilisateur réel.\n\nCe que la maquette montre : réunir sur un même fil les propriétaires, les hôtes, les agences, les prestataires, les formateurs et les apporteurs de l'immobilier.\n\nCe qu'elle ne montre pas : une plateforme en service. Le projet est en construction.\n\nDites-nous ce qui manque, et ce qui vous paraît faux.",
    media: [clip(1)], type: "post", likes: 0,
    createdAt: hAgo(2),
    comments: [],
  },
  /* ── Jean-Luc Hartmann (user-015) — patron d'agence à Neuchâtel ──────────
     Ses deux posts de l'étape 3 : un mandat conclu (avec son bien réel prop27)
     et une lecture du marché neuchâtelois. Commentaires croisés avec Céline et
     Ennio — le point « communauté » : les trois profils se répondent. */
  {
    id: "p-jl-1", author: U_JEANLUC,
    content: "Mandat conclu — villa individuelle à Hauterive vendue en six semaines\n\nVue lac, jardin arboré, 210 m². Estimation juste dès le départ, deux visites ciblées, signature sereine chez le notaire. C'est le métier qu'on aime chez Hartmann Immobilier depuis 20 ans. #neuchâtel #vente #mandat",
    media: [clip(24)], type: "post", likes: 176, location: "Neuchâtel, Suisse",
    createdAt: hAgo(4),
    comments: mkComments("p-jl-1", [
      { author: U_CELINE, content: "Bravo Jean-Luc ! Six semaines sur ce segment, c'est du beau travail.", h: 3, likes: 14 },
      { author: U_ENNIO, content: "Belle rotation. Le littoral neuchâtelois reste sous-coté à mon sens.", h: 2, likes: 9 },
    ]),
    property: propRef("prop27"),
  },
  {
    id: "p-jl-2", author: U_JEANLUC,
    content: "Le marché neuchâtelois en 2026 : les prix se stabilisent après trois ans de hausse\n\nBonne nouvelle pour les primo-accédants, et un retour à des délais de vente raisonnables. Notre analyse complète, du littoral au Val-de-Ruz. #neuchâtel #marché #immobilier",
    media: [], type: "post", likes: 243, location: "Neuchâtel, Suisse",
    createdAt: hAgo(20),
    comments: mkComments("p-jl-2", [
      { author: U_ENNIO, content: "Analyse posée et utile. La stabilisation crée des points d'entrée intéressants.", h: 18, likes: 21 },
      { author: U_CELINE, content: "Même tendance sur l'arc lémanique haut de gamme. Merci pour le partage.", h: 16, likes: 12 },
    ]),
  },
  {
    id: "p2", author: U_CELINE,
    content: "Vendu — le 4,5 pièces vue lac de Lutry a trouvé son acquéreur\n\nSept semaines entre la mise en ligne et la signature. Merci à Nikola pour les photos et à Elena pour la mise en scène : la lumière du matin dans la cuisine a fait le reste. #lutry #lavaux #vendu",
    media: [clip(2)], type: "post", likes: 312, location: "Lutry, Suisse",
    createdAt: hAgo(5),
    comments: mkComments("p2", [
      { author: U_ENNIO, content: "Sept semaines. Conforme à ce qui était annoncé.", h: 4, likes: 18 },
      { author: U_NIKOLA, content: "merci celine, top collab", h: 2, likes: 6 },
      { author: U_JEANLUC, content: "Belle mise en valeur, Céline. Ce segment part vite en ce moment.", h: 1, likes: 8 },
    ]),
    property: propRef("prop1"),
  },
  /* Deuxième post de Céline : une observation de marché lémanique,
     à côté de sa mise en vente (p2). Ton d'agente immobilière : factuel, pas
     auto-promotionnel. Commentaires croisés avec Ennio et Jean-Luc. */
  {
    id: "p-so-mkt", author: U_CELINE,
    content: "Ce que je vois sur l'arc lémanique ce trimestre\n\nLes biens de caractère bien estimés partent en moins de 30 jours ; les autres stagnent. À Lausanne et dans le Lavaux, la vue lac et le cachet d'origine restent les deux critères qui font vraiment la différence à la vente. #lausanne #lavaux #marché",
    media: [], type: "post", likes: 388, location: "Lausanne, Suisse",
    createdAt: hAgo(7),
    comments: mkComments("p-so-mkt", [
      { author: U_ENNIO, content: "Confirmé côté investisseur : l'écart de délai entre un bien bien estimé et un bien surévalué n'a jamais été aussi net.", h: 6, likes: 24 },
      { author: U_JEANLUC, content: "Idem sur Neuchâtel. L'estimation juste vaut tous les argumentaires.", h: 5, likes: 17 },
    ]),
  },
  {
    id: "p3", author: U_AMINA,
    content: "Mon riad, au cœur de la médina\n\nQuatre suites autour du patio, la terrasse pour le petit-déjeuner, les orangers. Les dates d'octobre partent vite : si vous visez l'automne, réservez maintenant. #marrakech #riad #locationcourtedurée",
    media: [clip(3)], type: "post", likes: 845, location: "Marrakech, Maroc",
    createdAt: hAgo(8),
    comments: mkComments("p3", [
      { author: U_MIRJANA, content: "Tu fixes un minimum de nuits en octobre ?", h: 6, likes: 12 },
      { author: U_CELINE, content: "J'y étais en avril : c'est encore plus beau qu'en photo.", h: 4, likes: 14 },
      { author: U_LEO, content: "Le bois de cèdre original, c'est rare. Bravo Amina.", h: 2, likes: 21 },
    ]),
    property: propRef("prop4"),
  },
  {
    id: "p4", author: U_ENNIO,
    content: "Suisse romande, 5 ans : +37 % sur le premium\n\nC'est un chiffre brut. Net de charges, d'impôts et de vacance, comptez moitié moins. La formation de Léo Martin explique le calcul correctement. Ses hypothèses de taux sont optimistes. #investissement #rendement",
    media: [clip(4)], type: "post", likes: 1240, location: "Genève, Suisse",
    createdAt: hAgo(12),
    comments: mkComments("p4", [
      { author: U_CLEMENCE, content: "Moitié moins… ça fait réfléchir. Merci pour la franchise.", h: 10, likes: 27 },
      { author: U_LEO, content: "Remarque juste sur les taux, Ennio. Je mets le module 2 à jour.", h: 8, likes: 12 },
      { author: U_JEANLUC, content: "+37 % sur cinq ans, ça correspond à ce qu'on observe sur le haut de gamme lémanique. Chiffres solides.", h: 6, likes: 15 },
    ]),
    formation: mkFormation("form-001"),
  },
  {
    id: "p7", author: U_CELINE,
    content: "Mon astuce préférée pour booster mes revenus Airbnb\n\nChanger les photos tous les 3 mois pour suivre la saisonnalité : +18 % de réservations en moyenne. La formation d'@amina détaille tout. #locationcourtedurée #airbnb #conseil",
    media: [clip(7)], type: "post", likes: 421, location: "Lausanne, Suisse",
    createdAt: hAgo(26),
    comments: mkComments("p7", [
      { author: U_AMINA, content: "Exact ! Le pricing dynamique fait le reste. Merci pour le shout-out", h: 22, likes: 28 },
    ]),
    formation: mkFormation("form-002"),
    // Céline recommande la formation d'Amina via son lien d'affiliation.
    affiliate: mkFormationAffiliate("form-002"),
  },
  {
    id: "p8", author: U_AMINA,
    content: "Nouveau module dans \"Maîtriser la location courte durée\"\n\nPricing dynamique avec automatisation Beyond Pricing + PriceLabs. Mes étudiants augmentent leurs revenus de 30 à 40 % en moyenne. Inscriptions sur le profil. #gestionlocative #formation #automatisation",
    media: [clip(8)], type: "post", likes: 1567, location: "Marrakech, Maroc",
    createdAt: hAgo(32),
    comments: mkComments("p8", [
      { author: U_CELINE, content: "J'attendais ce module.", h: 30, likes: 19 },
      { author: U_RETO, content: "Tu peux automatiser ça aussi sur les longs séjours ?", h: 28, likes: 8 },
      { author: U_MIRJANA, content: "Testé tout l'hiver sur mes deux apparts. Ça marche.", h: 26, likes: 22 },
    ]),
    formation: mkFormation("form-002"),
  },
  {
    id: "p9", author: U_LEO,
    content: "Le 15 mai au Palexpo\n\nSalon de l'immobilier : j'y passe la matinée, surtout pour les conférences sur la fiscalité et la courte durée. On se croise ? #salon #geneve #networking",
    media: [clip(9)], type: "post", likes: 894, location: "Lausanne, Suisse",
    createdAt: hAgo(40),
    comments: mkComments("p9", [
      { author: U_ENNIO, content: "Je passe l'après-midi.", h: 38, likes: 15 },
      { author: U_AMINA, content: "Le Maroc sera représenté", h: 36, likes: 11 },
    ]),
  },
  {
    id: "p10", author: U_ENNIO,
    content: "En vente : 5 pièces à Champel\n\n142 m², 4e étage, rénové en 2019. 3,15 M CHF. Vente directe, sans intermédiaire. Dossier complet sur demande, avec charges et travaux des dix dernières années. #geneve #champel #vente",
    media: [clip(10)], type: "post", likes: 1052, location: "Genève, Suisse",
    createdAt: hAgo(48),
    comments: mkComments("p10", [
      { author: U_LEO, content: "Un de mes clients pourrait être intéressé. Je t'écris.", h: 44, likes: 12 },
    ]),
    property: propRef("prop16"),
  },
  {
    id: "p11", author: U_AMINA,
    content: "La médina à l'aube — le meilleur moment pour vos photos d'annonce\n\nLumière douce, ruelles vides, pas de reflets. Astuce valable partout : photographiez votre logement le matin, fenêtres ouvertes. #marrakech #photo #astuce",
    media: [clip(11)], type: "post", likes: 612, location: "Marrakech, Maroc",
    createdAt: hAgo(56),
    comments: mkComments("p11", [
      { author: U_CELINE, content: "Splendide", h: 54, likes: 8 },
    ]),
  },
  {
    id: "p12", author: U_RETO,
    content: "Webinaire gratuit le 20 avril à 18h\n\nRénover un immeuble des années 1960 : par quoi commencer ? Trois cas réels (Neuchâtel, Fribourg, Bulle), CECB avant/après, coûts et subventions. Questions en direct. #webinaire #renovation #cecb",
    media: [clip(12)], type: "post", likes: 387, location: "En ligne",
    createdAt: hAgo(64),
    comments: mkComments("p12", [
      { author: U_ENNIO, content: "Inscrit.", h: 62, likes: 14 },
      { author: U_LEO, content: "Format que je recommande à tous mes étudiants débutants.", h: 60, likes: 22 },
    ]),
  },
  {
    id: "p13", author: U_CELINE,
    content: "Atelier home staging Lausanne — déjà inscrite\n\nElena Currat prépare mes mises en vente depuis deux ans : elle explique enfin sa méthode. Encore 8 places. #homestaging #atelier #lausanne",
    media: [clip(13)], type: "post", likes: 234, location: "Lausanne, Suisse",
    createdAt: hAgo(72),
    comments: mkComments("p13", [
      { author: U_NIKOLA, content: "elena est trop forte, tu vas voir", h: 70, likes: 9 },
    ]),
  },
  {
    id: "p15", author: U_ENNIO,
    content: "Networking investisseurs romands — Montreux, 5 avril\n\nJ'y serai. Format : vingt minutes de chiffres, puis questions. Venez avec les vôtres. #networking #investisseurs #montreux",
    media: [clip(15)], type: "post", likes: 412, location: "Montreux, Suisse",
    createdAt: hAgo(88),
    comments: mkComments("p15", [
      { author: U_RETO, content: "J'y serai, avec les chiffres avant/après de la rue des Parcs.", h: 86, likes: 11 },
    ]),
  },
  {
    id: "p17", author: U_LEO,
    content: "Ma formation \"Investissement locatif : de zéro à rentier\"\n\nDe la première analyse au closing notarial, tout est cadré. Module 1 gratuit en commentaire si tu débutes. #formation #investissement #zeroaexpert",
    media: [clip(17)], type: "post", likes: 1875, location: "Lausanne, Suisse",
    createdAt: hAgo(104),
    comments: mkComments("p17", [
      { author: U_CLEMENCE, content: "J'ai fait le module 1, c'est clair même pour moi.", h: 102, likes: 56 },
      { author: U_ENNIO, content: "Correct pour débuter.", h: 100, likes: 38 },
      { author: U_ANA, content: "Module 1 svp, merci !", h: 98, likes: 14 },
    ]),
    formation: mkFormation("form-001"),
  },
  {
    id: "p18", author: U_CELINE,
    content: "Coup de cœur cette semaine — une maison vigneronne à Riex\n\nCave voûtée, poutres d'origine, la terrasse au-dessus des vignes en terrasses. Nikola a fait les photos au coucher du soleil, Elena a préparé les pièces. Visites dès samedi. #lavaux #riex #maisonvigneronne",
    media: [clip(18)], type: "post", likes: 467, location: "Riex, Suisse",
    createdAt: hAgo(112),
    comments: mkComments("p18", [
      { author: U_ELENA, content: "Cette lumière dans la cave… j'adore ce qu'on en a fait.", h: 110, likes: 17 },
    ]),
    property: propRef("prop19"),
  },
  {
    id: "p20", author: U_AMINA,
    content: "30 secondes pour comprendre pourquoi tes annonces ne convertissent pas\n\nSpoiler : c'est la première photo. Toujours. Si elle est sombre ou floue, tu perds 60 % des regards. #astuce #marketing #airbnb",
    media: [clip(20)], type: "post", likes: 1340, location: "Marrakech, Maroc",
    createdAt: hAgo(128),
    comments: mkComments("p20", [
      { author: U_NIKOLA, content: "confirme. photo 1 = tout", h: 126, likes: 41 },
      { author: U_MIRJANA, content: "Confirmé. J'ai refait les miennes en mars.", h: 124, likes: 15 },
    ]),
  },
  {
    id: "p21", author: U_SANDRINE,
    content: "Formation live le 20 mars — fiscalité immobilière en Suisse romande\n\nValeur locative, déductions, revenus d'un bien situé dans un autre canton. Deux heures, en trois temps : la règle, le calcul, un cas réel. Questions en direct. #fiscalite #formation #live",
    media: [clip(21)], type: "post", likes: 532, location: "En ligne",
    createdAt: hAgo(136),
    comments: mkComments("p21", [
      { author: U_LEO, content: "Inscrit. J'ai une question sur mon studio de Genève.", h: 134, likes: 18 },
    ]),
  },
  {
    id: "p23", author: U_LEO,
    content: "Mon locataire de Renens repart après trois ans\n\nIl déménage pour le travail, et il m'a laissé un mot. Communication régulière, réparations faites vite : des locataires qui restent. L'appartement se libère au 1er novembre. #locationlongue #renens #relation",
    media: [clip(23)], type: "post", likes: 654, location: "Lausanne, Suisse",
    createdAt: hAgo(152),
    comments: mkComments("p23", [
      { author: U_AMINA, content: "C'est exactement ce que j'enseigne. Le service > le tarif.", h: 150, likes: 28 },
    ]),
  },
  {
    id: "p24", author: U_LEO,
    content: "Conférence \"Marché immobilier 2026\" à l'EPFL le 10 mars\n\nGratuit, sur inscription. J'y vais pour la table ronde sur la location courte durée à Lausanne. Qui vient ? #conference #epfl #marche",
    media: [clip(24)], type: "post", likes: 1102, location: "Lausanne, Suisse",
    createdAt: hAgo(160),
    comments: mkComments("p24", [
      { author: U_ENNIO, content: "Je viendrai.", h: 158, likes: 31 },
      { author: U_RETO, content: "J'y serai aussi, pour la partie rénovation.", h: 156, likes: 24 },
    ]),
  },
  {
    id: "p25", author: U_AMINA,
    content: "Coucher de soleil sur les remparts\n\nMarrakech n'est pas seulement un investissement, c'est un mode de vie. Si tu n'as pas encore visité, c'est l'année. #marrakech #medina #coucherdesoleil",
    media: [clip(25)], type: "post", likes: 1567, location: "Marrakech, Maroc",
    createdAt: hAgo(168),
    comments: mkComments("p25", [
      { author: U_CELINE, content: "Je confirme : j'y retourne au printemps.", h: 166, likes: 22 },
      { author: U_LEO, content: "Une des plus belles villes du monde. Confirmé.", h: 164, likes: 35 },
    ]),
  },

  /* ── Posts varies (formats Twitter-like) ──────────────────────────────
     Ajoutes pour casser l'uniformite du flux video. Mix texte seul,
     photo unique, galerie 2/3/4 photos. Inseres au debut du feed grace
     a un createdAt recent. */
  {
    id: "p-text-1", author: U_LEO,
    content: "Question simple : si vous deviez investir 100 K CHF aujourd'hui dans un seul canton suisse, lequel et pourquoi ?\n\nVaud, Geneve, Zurich, Tessin, Valais… Les commentaires sont a vous. #investissement #debat #suisse",
    media: [], type: "post", likes: 932, location: "Lausanne, Suisse",
    createdAt: hAgo(1),
    comments: mkComments("p-text-1", [
      { author: U_ENNIO, content: "Aucun avec 100 K. Fonds propres insuffisants pour un achat direct.", h: 0.8, likes: 41 },
      { author: U_CLEMENCE, content: "C'est exactement notre question… on hésite entre Vaud et Fribourg.", h: 0.5, likes: 33 },
      { author: U_RETO, content: "Fribourg : prix plus bas, et beaucoup d'immeubles à rénover.", h: 0.3, likes: 28 },
    ]),
  },
  {
    id: "p-photo-1", author: U_AMINA,
    content: "Riad de la semaine. 6 chambres, 2 patios, hammam d'epoque restaure a l'identique. Mise en marche dans 10 jours. #marrakech #patrimoine",
    media: ["https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900"],
    type: "post", likes: 612, location: "Marrakech, Maroc",
    createdAt: hAgo(3),
    comments: mkComments("p-photo-1", [
      { author: U_MIRJANA, content: "Magnifique. La fontaine du patio nord est d'origine ?", h: 2.5, likes: 9 },
    ]),
  },
  {
    id: "p-gal-2", author: U_ELENA,
    content: "Avant / après — la cuisine d'un 3,5 pièces à Vevey. Petit budget, gros effet : une couleur, deux luminaires, plus rien sur le plan de travail. #homestaging #avantapres",
    media: [
      "https://images.unsplash.com/photo-1556909211-d5b0c0b3a4b8?w=900",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
    ],
    type: "post", likes: 408, location: "Vevey, Suisse",
    createdAt: hAgo(6),
    comments: mkComments("p-gal-2", [
      { author: U_LEO, content: "Le plan de travail change tout. Quel materiau ?", h: 4, likes: 7 },
    ]),
  },
  {
    id: "p-gal-3", author: U_RETO,
    content: "Visite du chantier ce matin — rue des Parcs, Neuchâtel. Façade isolée, fenêtres posées, la pompe à chaleur arrive la semaine prochaine. CECB visé : B. #renovation #chantier #cecb",
    media: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
    ],
    type: "post", likes: 541, location: "Neuchâtel, Suisse",
    createdAt: hAgo(9),
    comments: mkComments("p-gal-3", [
      { author: U_JEANLUC, content: "Les propriétaires ont visité samedi : ils sont ravis. Merci Reto.", h: 8, likes: 14 },
    ]),
  },
  {
    id: "p-photo-formation", author: U_ENNIO,
    content: "Slide cle de la formation \"Investissement locatif : de zero a rentier\" : comprendre le rendement net (apres charges, impots, vacance). C'est LA donnee qui separe les amateurs des serieux. #formation #investissement",
    media: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900"],
    type: "post", likes: 856, location: "Geneve, Suisse",
    createdAt: hAgo(18),
    comments: mkComments("p-photo-formation", [
      { author: U_CELINE, content: "Le passage du brut au net surprend toujours les nouveaux investisseurs.", h: 16, likes: 22 },
    ]),
    formation: mkFormation("form-001"),
  },

  /* ── Posts texte seul (facon X / Twitter) ─────────────────────────────
     Formats courts, mis en avant en grand par le PostCard quand il n'y a
     ni media ni objet attache. createdAt recents pour remonter dans le tri. */
  {
    id: "p-t2", author: U_LEO,
    content: "Rappel du jour : le meilleur moment pour investir dans l'immobilier, c'etait il y a 10 ans. Le deuxieme meilleur moment, c'est aujourd'hui.\n\nArretez d'attendre le marche parfait. #investissement #mindset",
    media: [], type: "post", likes: 1284, location: "Lausanne, Suisse", createdAt: hAgo(0.4),
    comments: mkComments("p-t2", [
      { author: U_CLEMENCE, content: "Facile à dire… mais merci, ça me pousse un peu.", h: 0.3, likes: 54 },
      { author: U_CELINE, content: "Tellement vrai, j'ai trop attendu pour mon 1er bien.", h: 0.2, likes: 31 },
    ]),
  },
  {
    id: "p-t3", author: U_ENNIO,
    content: "Petit sondage pour la communaute : en 2026, vous misez sur quoi ?\n\n1) Locatif longue duree\n2) Courte duree / Airbnb\n3) Colocation\n4) Parking / box\n\nJe lis toutes vos reponses en commentaire.",
    media: [], type: "post", likes: 642, location: "Geneve, Suisse", createdAt: hAgo(0.8),
    comments: mkComments("p-t3", [
      { author: U_RETO, content: "3) La colocation, si le bâtiment s'y prête.", h: 0.6, likes: 22 },
      { author: U_AMINA, content: "2) sans hesiter, mais faut gerer le pricing.", h: 0.5, likes: 18 },
      { author: U_JEANLUC, content: "1) pour la tranquillité.", h: 0.4, likes: 9 },
    ]),
  },
  {
    id: "p-t4", author: U_MIRJANA,
    content: "Neuf ans que je suis hôte. Ce que j'aurais aimé savoir au début :\n\n— Repondre en < 1h change tout\n— Les photos font 80% de la reservation\n— Un bon menage vaut chaque centime\n\n#locationcourteduree #conseils",
    media: [], type: "post", likes: 917, location: "Montreux, Suisse", createdAt: hAgo(4),
    comments: mkComments("p-t4", [
      { author: U_AMINA, content: "La regle du < 1h est sous-estimee. Bravo.", h: 3, likes: 27 },
    ]),
  },
  {
    id: "p-t5", author: U_AMINA,
    content: "Hot take : la plupart des gens ne calculent JAMAIS leur rendement net. Ils regardent le loyer, pas les charges, la vacance, les impots et la gestion.\n\nResultat : ils croient faire 6% et font 3%. #fiscalite #rendement",
    media: [], type: "post", likes: 1533, location: "Marrakech, Maroc", createdAt: hAgo(7),
    comments: mkComments("p-t5", [
      { author: U_ENNIO, content: "Exact. Le net.", h: 6, likes: 44 },
      { author: U_LEO, content: "Le brut ment, le net dit la verite.", h: 5, likes: 38 },
    ]),
  },
  {
    id: "p-t6", author: U_RETO,
    content: "Zurich vient de depasser 15'000 CHF/m2 en moyenne dans l'hypercentre. Geneve suit de pres.\n\nLa Suisse reste l'un des marches les plus resilients d'Europe. Qui investit encore en ville ?",
    media: [], type: "post", likes: 728, location: "Zurich, Suisse", createdAt: hAgo(11),
    comments: mkComments("p-t6", [
      { author: U_ENNIO, content: "Les prix défient la gravité.", h: 9, likes: 19 },
    ]),
  },
  {
    id: "p-analytics-1", author: U_ENNIO,
    content: "Petite demo de la carte analytique E-Dome : le rendement net d'un bien, en un coup d'oeil. On adore la transparence. #data #immobilier",
    media: [], type: "post", likes: 512, location: "Geneve, Suisse", createdAt: hAgo(15),
    comments: mkComments("p-analytics-1", [
      { author: U_CELINE, content: "Cette carte est geniale pour comparer vite.", h: 13, likes: 12 },
    ]),
    attachment: {
      type: "analytics",
      data: {
        propertyId: "prop1",
        propertyTitle: "Appartement vue lac · Lutry",
        metric: "rendementNet",
        label: "Rendement net annuel",
        headline: "2.1%",
      },
    },
  },

  /* ── Sondages interactifs (facon X) ───────────────────────────────────── */
  {
    id: "p-poll-1", author: U_LEO,
    content: "Selon vous, quelle ville romande offre le meilleur potentiel d'investissement en 2026 ?",
    media: [], type: "post", likes: 486, location: "Lausanne, Suisse", createdAt: hAgo(0.5),
    comments: mkComments("p-poll-1", [
      { author: U_ENNIO, content: "Genève pour la liquidité. Fribourg pour le rendement.", h: 0.4, likes: 21 },
    ]),
    poll: {
      options: [
        { id: "o1", label: "Geneve", votes: 420 },
        { id: "o2", label: "Lausanne", votes: 380 },
        { id: "o3", label: "Fribourg", votes: 95 },
        { id: "o4", label: "Sion", votes: 60 },
      ],
      totalVotes: 955,
      endsAt: new Date(DEMO_TODAY.getTime() + 2 * 24 * 3600_000).toISOString(),
    },
  },
  {
    id: "p-poll-2", author: U_ENNIO,
    content: "Location courte duree ou longue duree : votre strategie preferee ?",
    media: [], type: "post", likes: 312, location: "Geneve, Suisse", createdAt: hAgo(9),
    comments: mkComments("p-poll-2", [
      { author: U_AMINA, content: "Courte duree, mais il faut aimer gerer.", h: 8, likes: 14 },
    ]),
    poll: {
      options: [
        { id: "o1", label: "Courte duree", votes: 512 },
        { id: "o2", label: "Longue duree", votes: 388 },
        { id: "o3", label: "Les deux", votes: 240 },
      ],
      totalVotes: 1140,
      endsAt: new Date(DEMO_TODAY.getTime() + 6 * 3600_000).toISOString(),
    },
  },
];

// CTAs custom par id de post.
export type CustomCTA = { href: string; title: string; subtitle: string; icon: "users" | "search" | "user" | "calendar" };
export const CUSTOM_CTA: Record<string, CustomCTA> = {
  p11: { href: "/explorer/prop4", title: "Voir le riad d'Amina", subtitle: "Quatre suites en médina, à la nuit", icon: "search" },
  p23: { href: "/explorer/prop8", title: "Voir le 4,5 pièces de Renens", subtitle: "Location longue durée, libre au 1er novembre", icon: "search" },
  p25: { href: "/profil/user-016", title: "Voir le profil d'Amina", subtitle: "Formatrice et hôte à Marrakech", icon: "user" },
};

// Événements (lookup par id de post).
export type EventCTA = { id: string; titre: string; type: string; date: string; heure: string; lieu: string; prix: number; thumbnail: string };
export const EVENTS_BY_POST: Record<string, EventCTA> = {
  p9: { id: "e1", titre: "Salon de l'immobilier Suisse 2026", type: "Conférence", date: "2026-05-15", heure: "09:00", lieu: "Palexpo, Genève", prix: 45, thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
  p12: { id: "e2", titre: "Webinaire : Optimiser son rendement locatif", type: "Webinaire", date: "2026-04-20", heure: "18:00", lieu: "En ligne", prix: 0, thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop" },
  p13: { id: "e3", titre: "Atelier : Home staging pratique", type: "Atelier", date: "2026-04-10", heure: "14:00", lieu: "Lausanne, Centre Flon", prix: 89, thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
  p15: { id: "e4", titre: "Networking investisseurs romands", type: "Networking", date: "2026-04-05", heure: "19:00", lieu: "Hôtel Royal, Montreux", prix: 35, thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
  p21: { id: "e5", titre: "Formation live : Fiscalité immobilière", type: "Formation live", date: "2026-03-20", heure: "10:00", lieu: "En ligne", prix: 120, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
  p24: { id: "e6", titre: "Conférence : Marché immobilier 2026", type: "Conférence", date: "2026-03-10", heure: "17:00", lieu: "EPFL, Lausanne", prix: 0, thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop" },
};

/* Le vocabulaire de mots-dièse de la maquette. Une seule liste : le fil et
   `/creer-post` en déclaraient chacun une, de cinq et quinze entrées.

   Elle portait un compte par mot-dièse — #immobilier 12 400, #investissement
   8 900 — rendu en « 12,4 K » dans la colonne de droite. C'est un volume de
   publications sur E-Dome, donc une affirmation de traction. Le bloc qui
   l'affichait était `className="hidden"`, jamais rendu : du code mort qui
   portait un chiffre faux, ce qui est pire que du code vivant, puisque
   personne ne le relit et que quelqu'un finira par le démasquer. Le bloc est
   supprimé, les comptes avec. */
export const HASHTAGS = [
  "#immobilier", "#investissement", "#luxe", "#suisse", "#location",
  "#villa", "#appartement", "#marché", "#rendement", "#architecture",
  "#design", "#maison", "#genève", "#lausanne", "#zurich",
];

/* « Qui suivre » : les personnes de l'annuaire que l'utilisateur courant ne
   suit PAS encore d'après le graphe FOLLOWS — jamais lui-même, jamais quelqu'un
   qu'il suit déjà. Les écrans filtrent en plus sur les suivis de la session. */
export const SUGGESTIONS: User[] = DIRECTORY.filter(
  (p) => p.id !== DEMO_USER.id && !followingOf(DEMO_USER.id).includes(p.id),
);

// ─── Misc ──────────────────────────────────────────────────────────────────

/* Ce n etait pas une variante d identite, c etait un bug : « u1 » designe
   Sophie Martin. L utilisateur courant du fil etait donc quelqu un d autre
   que celui du profil, du tableau de bord et de la messagerie. */
export const CURRENT_USER_ID = DEMO_USER.id;
export const CURRENT_USER = U_LEO;
export const formatEventDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" });

/* Parse @mentions et #hashtags en liens cliquables.
   Avant : les @mentions étaient des <span> non cliquables (cul-de-sac
   UX — clicable visuellement, sans action). Maintenant : les deux
   pointent vers /recherche?q=<token>. stopPropagation pour ne pas
   déclencher l'expand du texte ou la fermeture des menus du PostCard.
   Regex \p{L}\p{N}_ : lettres unicode + chiffres + underscore — supporte
   les accents (@léo) sans casser sur la ponctuation. */
