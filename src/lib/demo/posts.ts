import { properties as ALL_PROPERTIES, formations as ALL_FORMATIONS } from "@/lib/mock-data";
import { CURRENT_USER as DEMO_USER, OWNED_PROPERTY_IDS } from "@/lib/demo/identity";
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
export const U_LEO: User = {
  id: DEMO_USER.id,
  firstName: DEMO_USER.firstName,
  lastName: DEMO_USER.lastName,
  email: DEMO_USER.email,
  avatar: DEMO_USER.avatar,
  city: DEMO_USER.city,
  country: DEMO_USER.country,
  roles: [...DEMO_USER.roles] as User["roles"],
  activeRole: "hote",
  stats: {
    followers: DEMO_USER.stats.followers,
    following: DEMO_USER.stats.following,
    properties: OWNED_PROPERTY_IDS.length,
    reviews: DEMO_USER.stats.reviewsCount,
    rating: DEMO_USER.stats.rating,
    transactions: 19,
    revenue: 0,
  },
  bio: DEMO_USER.about,
};

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

export const U_SOPHIE: User = {
  id: "u1", firstName: "Sophie", lastName: "Martin", email: "sophie@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
  stats: { followers: 1240, following: 380, properties: 12, reviews: 89, rating: 4.8, transactions: 45, revenue: 125000 },
  bio: "Hôte passionnée — Riviera lémanique.", responseTime: "< 1h",
};

export const U_MARC: User = {
  id: "u2", firstName: "Marc", lastName: "Dubois", email: "marc@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  city: "Genève", country: "Suisse", roles: ["investisseur"], activeRole: "investisseur",
  stats: { followers: 3200, following: 150, properties: 24, reviews: 56, rating: 4.9, transactions: 120, revenue: 890000 },
  bio: "Investisseur immobilier — luxe & rendement.",
};

export const U_AMIRA: User = {
  id: "u3", firstName: "Amira", lastName: "El Fassi", email: "amira@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  city: "Marrakech", country: "Maroc", roles: ["agence"], activeRole: "agence",
  stats: { followers: 5600, following: 420, properties: 85, reviews: 230, rating: 4.7, transactions: 300, revenue: 2400000 },
  bio: "Directrice Agence Fassi — Médina & palmeraie.",
};

export const U_THOMAS: User = {
  id: "u4", firstName: "Thomas", lastName: "Weber", email: "thomas@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  city: "Zurich", country: "Suisse", roles: ["promoteur"], activeRole: "promoteur",
  stats: { followers: 2100, following: 90, properties: 6, reviews: 34, rating: 4.6, transactions: 18, revenue: 5_600_000 },
  bio: "Promoteur — projets Minergie haut de gamme.",
};

export const U_AMINA: User = {
  id: "user-004", firstName: "Amina", lastName: "El Idrissi", email: "amina@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100",
  city: "Marrakech", country: "Maroc", roles: ["formateur"], activeRole: "formateur",
  stats: { followers: 8900, following: 310, properties: 0, reviews: 412, rating: 4.9, transactions: 0, revenue: 0 },
  bio: "Formatrice — Gestion locative & pricing dynamique.",
};

export const U_YASMIN: User = {
  id: "u-yasmin", firstName: "Yasmin", lastName: "Al Falasi", email: "yasmin@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
  city: "Dubaï", country: "Émirats arabes unis", roles: ["apporteur"], activeRole: "apporteur",
  stats: { followers: 6800, following: 180, properties: 0, reviews: 145, rating: 4.9, transactions: 92, revenue: 4_800_000 },
  bio: "Apporteuse d'affaires — off-market Dubaï & Émirats.",
};

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
  {
    id: "p2", author: U_SOPHIE,
    content: "Visite express de mon appart 135 m² avec vue sur le Léman\n\nBelle luminosité, parquet d'origine, cuisine refaite l'an dernier. Disponible à la vente — DM si intéressé. #lausanne #appartement #vente",
    media: [clip(2)], type: "post", likes: 312, location: "Lausanne, Suisse",
    createdAt: hAgo(5),
    comments: mkComments("p2", [
      { author: U_MARC, content: "La vue lac est un argument de vente redoutable", h: 4, likes: 18 },
      { author: U_THOMAS, content: "Le standing est superbe. Tu acceptes les visites week-end ?", h: 2, likes: 6 },
    ]),
    property: propRef("prop1"),
  },
  {
    id: "p3", author: U_AMIRA,
    content: "Riad d'exception au cœur de la médina\n\n200 m², patio central, hammam privé, 4 suites. Rendement locatif courte durée : 9.5 % brut. Une perle rare — déjà 12 demandes de visite. #marrakech #riad #investissement",
    media: [clip(3)], type: "post", likes: 845, location: "Marrakech, Maroc",
    createdAt: hAgo(8),
    comments: mkComments("p3", [
      { author: U_MARC, content: "Marrakech affiche des rendements imbattables en ce moment. À surveiller", h: 6, likes: 32 },
      { author: U_YASMIN, content: "Magnifique. Tu as la fiscalité sur la table ?", h: 4, likes: 14 },
      { author: U_LEO, content: "Le bois de cèdre original, c'est rare. Bravo Amira.", h: 2, likes: 21 },
    ]),
    property: propRef("prop4"),
  },
  {
    id: "p4", author: U_MARC,
    content: "Le marché suisse romand sur 5 ans : +37 % en moyenne sur les biens premium\n\nLa formation « Investissement locatif : de zéro à rentier » passe au crible chaque ratio : rendement brut/net, ROI, TIR, LTV. Je la recommande à tous ceux qui démarrent. #investissement #formation",
    media: [clip(4)], type: "post", likes: 1240, location: "Genève, Suisse",
    createdAt: hAgo(12),
    comments: mkComments("p4", [
      { author: U_LEO, content: "La meilleure formation de la plateforme. Sérieux et rigoureux.", h: 10, likes: 67 },
      { author: U_SOPHIE, content: "Inscrite à la prochaine session, hâte", h: 8, likes: 12 },
    ]),
    formation: mkFormation("form-001"),
  },
  {
    id: "p5", author: U_THOMAS,
    content: "Premier coup d'œil sur notre nouveau projet — Zurich Nord\n\n28 logements certifiés Minergie-P, livraison Q3 2026, vue dégagée sur le Limmat. Réservez votre visite privée avant l'ouverture officielle. #promotion #zurich #minergie",
    media: [clip(5)], type: "post", likes: 578, location: "Zurich, Suisse",
    createdAt: hAgo(16),
    comments: mkComments("p5", [
      { author: U_MARC, content: "Minergie-P et Zurich Nord, c'est du gagnant. Demande envoyée.", h: 14, likes: 24 },
    ]),
    property: propRef("prop15"),
  },
  {
    id: "p6", author: U_YASMIN,
    content: "Off-market à Dubaï Marina\n\nPenthouse 4 chambres, vue Burj Al Arab, livré meublé, vendu 12 % sous le prix du marché. Pas publié sur les portails — réservé à mon réseau d'apporteurs.\n\nDM avec votre budget. #dubai #offmarket #apporteur",
    media: [clip(6)], type: "post", likes: 2103, location: "Dubaï, Émirats arabes unis",
    createdAt: hAgo(20),
    comments: mkComments("p6", [
      { author: U_MARC, content: "Sérieusement intéressé. Je t'écris ce soir.", h: 18, likes: 38 },
      { author: U_LEO, content: "Yasmin gère le off-market à Dubaï comme personne. Référence absolue.", h: 16, likes: 91 },
    ]),
  },
  {
    id: "p7", author: U_SOPHIE,
    content: "Mon astuce préférée pour booster mes revenus Airbnb\n\nChanger les photos tous les 3 mois pour suivre la saisonnalité : +18 % de réservations en moyenne. La formation d'@amina détaille tout. #locationcourtedurée #airbnb #conseil",
    media: [clip(7)], type: "post", likes: 421, location: "Lausanne, Suisse",
    createdAt: hAgo(26),
    comments: mkComments("p7", [
      { author: U_AMINA, content: "Exact ! Le pricing dynamique fait le reste. Merci pour le shout-out", h: 22, likes: 28 },
    ]),
    formation: mkFormation("form-002"),
    // Sophie recommande la formation d'Amina via son lien d'affiliation.
    affiliate: mkFormationAffiliate("form-002"),
  },
  {
    id: "p8", author: U_AMINA,
    content: "Nouveau module dans \"Maîtriser la location courte durée\"\n\nPricing dynamique avec automatisation Beyond Pricing + PriceLabs. Mes étudiants augmentent leurs revenus de 30 à 40 % en moyenne. Inscriptions sur le profil. #gestionlocative #formation #automatisation",
    media: [clip(8)], type: "post", likes: 1567, location: "Marrakech, Maroc",
    createdAt: hAgo(32),
    comments: mkComments("p8", [
      { author: U_SOPHIE, content: "J'attendais ce module module commandé.", h: 30, likes: 19 },
      { author: U_THOMAS, content: "Tu peux automatiser ça aussi sur les long-séjours ?", h: 28, likes: 8 },
      { author: U_AMIRA, content: "Référence dans le métier. Merci Amina.", h: 26, likes: 22 },
    ]),
    formation: mkFormation("form-002"),
  },
  {
    id: "p9", author: U_LEO,
    content: "On y sera le 15 mai au Palexpo\n\nStand E-Dome — venez discuter de notre roadmap 2026 et tester les nouvelles fonctionnalités en avant-première. Places limitées, pensez à réserver. #salon #geneve #networking",
    media: [clip(9)], type: "post", likes: 894, location: "Genève, Suisse",
    createdAt: hAgo(40),
    comments: mkComments("p9", [
      { author: U_MARC, content: "Je passe avec deux investisseurs. À très vite.", h: 38, likes: 15 },
      { author: U_AMIRA, content: "Le Maroc sera représenté", h: 36, likes: 11 },
    ]),
  },
  {
    id: "p10", author: U_MARC,
    content: "Visite privée hier soir d'un penthouse rive droite à Genève\n\n280 m², terrasse 60 m², vue Mont-Blanc 360°. Prix : 4.8 M CHF. Je négocie pour un client — disponible jusqu'à fin du mois si l'offre n'aboutit pas. #penthouse #geneve #luxe",
    media: [clip(10)], type: "post", likes: 1052, location: "Genève, Suisse",
    createdAt: hAgo(48),
    comments: mkComments("p10", [
      { author: U_YASMIN, content: "Niveau Dubaï", h: 46, likes: 19 },
      { author: U_LEO, content: "Un de mes clients pourrait être intéressé. Je t'écris.", h: 44, likes: 12 },
    ]),
    property: propRef("prop16"),
  },
  {
    id: "p11", author: U_AMIRA,
    content: "La médina à l'aube — magie pure\n\nTrois biens en stock cette semaine pour investisseurs courageux. Rendement net 7-9 % sur le courte durée saisonnier. #marrakech #medina #investissement",
    media: [clip(11)], type: "post", likes: 612, location: "Marrakech, Maroc",
    createdAt: hAgo(56),
    comments: mkComments("p11", [
      { author: U_SOPHIE, content: "Splendide", h: 54, likes: 8 },
    ]),
  },
  {
    id: "p12", author: U_THOMAS,
    content: "Webinaire gratuit le 20 avril à 18h\n\nComment lire un dossier de rendement comme un promoteur — on déchire 3 cas réels en direct (Lausanne, Lugano, Zurich). Posez vos questions en live. #webinaire #rendement #formation",
    media: [clip(12)], type: "post", likes: 387, location: "En ligne",
    createdAt: hAgo(64),
    comments: mkComments("p12", [
      { author: U_MARC, content: "Inscrit", h: 62, likes: 14 },
      { author: U_LEO, content: "Format que je recommande à tous mes étudiants débutants.", h: 60, likes: 22 },
    ]),
  },
  {
    id: "p13", author: U_SOPHIE,
    content: "Atelier home staging Lausanne — déjà inscrite\n\nClaire Bernard est une référence en Suisse romande. J'attendais ce cours depuis 6 mois. Encore 8 places dispo. #homestaging #atelier #lausanne",
    media: [clip(13)], type: "post", likes: 234, location: "Lausanne, Suisse",
    createdAt: hAgo(72),
    comments: mkComments("p13", [
      { author: U_AMINA, content: "Claire est incroyable, tu vas voir", h: 70, likes: 9 },
    ]),
  },
  {
    id: "p14", author: U_YASMIN,
    content: "Nouveau lancement Dubai Marina\n\n1 chambre à partir de 480 000 AED, livraison 2027, plan de paiement 60/40. Mes clients européens prennent leur place avant l'official launch — les meilleures vues partent en 48h. #dubai #investissement #neuf",
    media: [clip(14)], type: "post", likes: 1789, location: "Dubaï, Émirats arabes unis",
    createdAt: hAgo(80),
    comments: mkComments("p14", [
      { author: U_MARC, content: "Le 60/40, c'est devenu standard ? Je vois ça partout.", h: 78, likes: 16 },
      { author: U_YASMIN, content: "@marc oui, c'est devenu le standard sur les off-plans depuis 2025.", h: 76, likes: 22 },
      { author: U_LEO, content: "Yasmin, tu es ma référence Dubaï. Continue", h: 72, likes: 41 },
    ]),
    property: propRef("prop17"),
  },
  {
    id: "p15", author: U_MARC,
    content: "Networking investisseurs romands — Montreux\n\nLa dernière édition a généré 3 deals à 7 chiffres. Je serai sur place le 5 avril, venez checker. Format : drinks → pitch → matchmaking. #networking #investisseurs #montreux",
    media: [clip(15)], type: "post", likes: 412, location: "Montreux, Suisse",
    createdAt: hAgo(88),
    comments: mkComments("p15", [
      { author: U_THOMAS, content: "J'y serai avec deux projets en pré-commercialisation.", h: 86, likes: 11 },
    ]),
  },
  {
    id: "p16", author: U_AMIRA,
    content: "Cinéma dans ce riad du XVIIIe siècle restauré\n\nMosaïques originales, plafonds de cèdre sculpté, source dans le patio. À vendre, hors marché. Investisseurs passion → DM. #riad #patrimoine #marrakech",
    media: [clip(16)], type: "post", likes: 1023, location: "Marrakech, Maroc",
    createdAt: hAgo(96),
    comments: mkComments("p16", [
      { author: U_SOPHIE, content: "Le plus beau riad que j'ai vu cette année", h: 94, likes: 24 },
      { author: U_LEO, content: "Patrimoine pur. Bravo Amira.", h: 92, likes: 31 },
    ]),
    property: propRef("prop18"),
  },
  {
    id: "p17", author: U_LEO,
    content: "Ma formation \"Investissement locatif : de zéro à rentier\"\n\nDe la première analyse au closing notarial, tout est cadré. Module 1 gratuit en commentaire si tu débutes. #formation #investissement #zeroaexpert",
    media: [clip(17)], type: "post", likes: 1875, location: "Genève, Suisse",
    createdAt: hAgo(104),
    comments: mkComments("p17", [
      { author: U_SOPHIE, content: "C'est la formation qui m'a fait basculer dans le métier. Merci.", h: 102, likes: 56 },
      { author: U_MARC, content: "Référence absolue. Je l'envoie à tous mes débutants.", h: 100, likes: 38 },
      { author: U_AMINA, content: "Module 1 svp !", h: 98, likes: 14 },
    ]),
    formation: mkFormation("form-001"),
  },
  {
    id: "p18", author: U_SOPHIE,
    content: "Coup de cœur cette semaine — chalet à Verbier\n\n5 chambres, jacuzzi sous étoiles, ski-in/ski-out. Mon client veut louer 6 mois/an et habiter le reste. On planifie sa stratégie hybride. #verbier #chalet #montagne",
    media: [clip(18)], type: "post", likes: 467, location: "Verbier, Suisse",
    createdAt: hAgo(112),
    comments: mkComments("p18", [
      { author: U_THOMAS, content: "Verbier c'est le saint Graal de la location alpine. Bons revenus en perspective.", h: 110, likes: 17 },
    ]),
    property: propRef("prop19"),
  },
  {
    id: "p19", author: U_THOMAS,
    content: "Notre nouveau projet à Lugano repense l'éco-conception\n\nPanneaux solaires intégrés à la façade, géothermie, récupération d'eau de pluie. Performance énergétique A+. Bientôt en pré-vente, avant-premières privées en mai. #ecoresponsable #lugano #minergie",
    media: [clip(19)], type: "post", likes: 821, location: "Lugano, Suisse",
    createdAt: hAgo(120),
    comments: mkComments("p19", [
      { author: U_LEO, content: "C'est le futur de la promotion. Bravo Thomas.", h: 118, likes: 28 },
      { author: U_MARC, content: "Brochure disponible ?", h: 116, likes: 9 },
    ]),
    property: propRef("prop20"),
  },
  {
    id: "p20", author: U_AMINA,
    content: "30 secondes pour comprendre pourquoi tes annonces ne convertissent pas\n\nSpoiler : c'est la première photo. Toujours. Si elle est sombre ou floue, tu perds 60 % des regards. #astuce #marketing #airbnb",
    media: [clip(20)], type: "post", likes: 1340, location: "Marrakech, Maroc",
    createdAt: hAgo(128),
    comments: mkComments("p20", [
      { author: U_SOPHIE, content: "Tellement vrai. J'ai refait mes 12 covers ce mois-ci, +24 % de bookings.", h: 126, likes: 41 },
      { author: U_AMIRA, content: "Confirmation totale", h: 124, likes: 15 },
    ]),
  },
  {
    id: "p21", author: U_MARC,
    content: "Formation live le 20 mars — fiscalité immobilière en Suisse\n\nOptimisation légale, impôts sur la fortune, gain en capital, structures holding. Pour investisseurs sérieux uniquement. Tarif early bird jusqu'à dimanche. #fiscalite #formation #live",
    media: [clip(21)], type: "post", likes: 532, location: "En ligne",
    createdAt: hAgo(136),
    comments: mkComments("p21", [
      { author: U_THOMAS, content: "Inscrit. Très attendu, surtout la partie holding.", h: 134, likes: 18 },
    ]),
  },
  {
    id: "p22", author: U_YASMIN,
    content: "Vue aérienne du quartier où je viens de boucler un deal\n\nDowntown Dubai, 200 m du Burj Khalifa. Vente sous 9 jours, +18 % au-dessus de la mise à prix. Quand le réseau parle, ça va vite. #dubai #downtown #deal",
    media: [clip(22)], type: "post", likes: 2456, location: "Dubaï, Émirats arabes unis",
    createdAt: hAgo(144),
    comments: mkComments("p22", [
      { author: U_LEO, content: "Performance hallucinante. La méthode Al Falasi", h: 142, likes: 87 },
      { author: U_MARC, content: "+18 % en 9 jours, ça se challenge sérieusement. Bravo.", h: 140, likes: 42 },
      { author: U_AMIRA, content: "Yasmin, on parle Marrakech bientôt ?", h: 138, likes: 19 },
    ]),
    property: propRef("prop21"),
  },
  {
    id: "p23", author: U_SOPHIE,
    content: "Témoignage d'un de mes locataires longue durée\n\nIl repart après 3 ans, hôte heureuse. Communication régulière + entretien sérieux = locataires qui restent. Mon meilleur ROI, c'est la confiance. #temoignage #locationlongue #relation",
    media: [clip(23)], type: "post", likes: 654, location: "Lausanne, Suisse",
    createdAt: hAgo(152),
    comments: mkComments("p23", [
      { author: U_AMINA, content: "C'est exactement ce que j'enseigne. Le service > le tarif.", h: 150, likes: 28 },
    ]),
  },
  {
    id: "p24", author: U_LEO,
    content: "Conférence \"Marché immobilier 2026\" à l'EPFL le 10 mars\n\nGratuit, sur inscription. Je présente nos data internes E-Dome — les chiffres que personne d'autre n'a sur les volumes et la rotation du marché romand. #conference #epfl #marche",
    media: [clip(24)], type: "post", likes: 1102, location: "Lausanne, Suisse",
    createdAt: hAgo(160),
    comments: mkComments("p24", [
      { author: U_MARC, content: "Je serai au premier rang. Toujours un plaisir.", h: 158, likes: 31 },
      { author: U_THOMAS, content: "Les data E-Dome valent leur pesant d'or. Hâte.", h: 156, likes: 24 },
    ]),
  },
  {
    id: "p25", author: U_AMIRA,
    content: "Coucher de soleil sur les remparts\n\nMarrakech n'est pas seulement un investissement, c'est un mode de vie. Si tu n'as pas encore visité, c'est l'année. #marrakech #medina #coucherdesoleil",
    media: [clip(25)], type: "post", likes: 1567, location: "Marrakech, Maroc",
    createdAt: hAgo(168),
    comments: mkComments("p25", [
      { author: U_SOPHIE, content: "Je réserve mes billets dès demain", h: 166, likes: 22 },
      { author: U_LEO, content: "Une des plus belles villes du monde. Confirmé.", h: 164, likes: 35 },
    ]),
  },
  {
    id: "p26", author: U_THOMAS,
    content: "Survol drone d'un projet alpin en cours\n\n12 chalets en bois local, certifiés Minergie-P, prix de départ 1.2 M CHF. Pré-réservations ouvertes en mai. Vue plein sud, accès ski direct. #chalet #alpes #ecoresponsable",
    media: [clip(26)], type: "post", likes: 743, location: "Crans-Montana, Suisse",
    createdAt: hAgo(176),
    comments: mkComments("p26", [
      { author: U_SOPHIE, content: "Crans-Montana en plein boom. Excellent placement.", h: 174, likes: 18 },
    ]),
    property: propRef("prop22"),
  },
  {
    id: "p27", author: U_AMINA,
    content: "Le module qui m’a le plus servi dans \"Marketing digital pour l’immobilier\"\n\nInstagram Reels qui convertissent — les leads ne viennent plus des portails, ils viennent du contenu. Inscriptions ouvertes jusqu'au 30 mai. #marketing #reels #formation",
    media: [clip(27)], type: "post", likes: 1289, location: "Marrakech, Maroc",
    createdAt: hAgo(184),
    comments: mkComments("p27", [
      { author: U_SOPHIE, content: "Mes reels ont fait x3 depuis cette formation. Incontournable.", h: 182, likes: 47 },
      { author: U_AMIRA, content: "Format imparable 2026, à ne pas rater.", h: 180, likes: 22 },
    ]),
    formation: mkFormation("form-006"),
  },

  /* ── Posts varies (formats Twitter-like) ──────────────────────────────
     Ajoutes pour casser l'uniformite du flux video. Mix texte seul,
     photo unique, galerie 2/3/4 photos. Inseres au debut du feed grace
     a un createdAt recent. */
  {
    id: "p-text-1", author: U_LEO,
    content: "Question simple : si vous deviez investir 100 K CHF aujourd'hui dans un seul canton suisse, lequel et pourquoi ?\n\nVaud, Geneve, Zurich, Tessin, Valais… Les commentaires sont a vous. #investissement #debat #suisse",
    media: [], type: "post", likes: 932, location: "Geneve, Suisse",
    createdAt: hAgo(1),
    comments: mkComments("p-text-1", [
      { author: U_MARC, content: "Tessin, sans hesiter. Marche sous-cote et rendements LT corrects.", h: 0.8, likes: 41 },
      { author: U_SOPHIE, content: "Valais bas pour la location courte duree premium. Marche encore artisanal.", h: 0.5, likes: 33 },
      { author: U_THOMAS, content: "Zurich pour la liquidite a la revente. Les autres pour les rendements.", h: 0.3, likes: 28 },
    ]),
  },
  {
    id: "p-photo-1", author: U_AMINA,
    content: "Riad de la semaine. 6 chambres, 2 patios, hammam d'epoque restaure a l'identique. Mise en marche dans 10 jours. #marrakech #patrimoine",
    media: ["https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900"],
    type: "post", likes: 612, location: "Marrakech, Maroc",
    createdAt: hAgo(3),
    comments: mkComments("p-photo-1", [
      { author: U_AMIRA, content: "Magnifique. La fontaine du patio nord est d'origine ?", h: 2.5, likes: 9 },
    ]),
  },
  {
    id: "p-gal-2", author: U_SOPHIE,
    content: "Avant / apres — renovation cuisine de notre 4.5 pieces a Vevey. Petit budget, gros effet visuel. #renovation #avantapres",
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
    id: "p-gal-3", author: U_THOMAS,
    content: "Visite du chantier ce matin — Programme Minergie-P Zurich Nord. Gros oeuvre quasi termine, livraison Q3 2026 tient le cap. #promotion #chantier",
    media: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
    ],
    type: "post", likes: 541, location: "Zurich, Suisse",
    createdAt: hAgo(9),
    comments: mkComments("p-gal-3", [
      { author: U_MARC, content: "Belle qualite de finition deja visible. Hate de voir les terrasses.", h: 8, likes: 14 },
    ]),
  },
  {
    id: "p-gal-4", author: U_YASMIN,
    content: "Petit tour photos d'un penthouse Dubai Marina que je propose en off-market. 4 chambres, vue 270deg, livre meuble. DM pour la fiche complete. #dubai #penthouse",
    media: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900",
    ],
    type: "post", likes: 1102, location: "Dubai, EAU",
    createdAt: hAgo(14),
    comments: mkComments("p-gal-4", [
      { author: U_MARC, content: "Penthouse Marina avec vue Burj : la rarete absolue. Interesse.", h: 12, likes: 26 },
      { author: U_LEO, content: "Yasmin reste la reference off-market a Dubai.", h: 10, likes: 47 },
    ]),
  },
  {
    id: "p-photo-formation", author: U_MARC,
    content: "Slide cle de la formation \"Investissement locatif : de zero a rentier\" : comprendre le rendement net (apres charges, impots, vacance). C'est LA donnee qui separe les amateurs des serieux. #formation #investissement",
    media: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900"],
    type: "post", likes: 856, location: "Geneve, Suisse",
    createdAt: hAgo(18),
    comments: mkComments("p-photo-formation", [
      { author: U_SOPHIE, content: "Le passage du brut au net surprend toujours les nouveaux investisseurs.", h: 16, likes: 22 },
    ]),
    formation: mkFormation("form-001"),
  },

  /* ── Posts texte seul (facon X / Twitter) ─────────────────────────────
     Formats courts, mis en avant en grand par le PostCard quand il n'y a
     ni media ni objet attache. createdAt recents pour remonter dans le tri. */
  {
    id: "p-t2", author: U_LEO,
    content: "Rappel du jour : le meilleur moment pour investir dans l'immobilier, c'etait il y a 10 ans. Le deuxieme meilleur moment, c'est aujourd'hui.\n\nArretez d'attendre le marche parfait. #investissement #mindset",
    media: [], type: "post", likes: 1284, location: "Geneve, Suisse", createdAt: hAgo(0.4),
    comments: mkComments("p-t2", [
      { author: U_MARC, content: "A encadrer.", h: 0.3, likes: 54 },
      { author: U_SOPHIE, content: "Tellement vrai, j'ai trop attendu pour mon 1er bien.", h: 0.2, likes: 31 },
    ]),
  },
  {
    id: "p-t3", author: U_MARC,
    content: "Petit sondage pour la communaute : en 2026, vous misez sur quoi ?\n\n1) Locatif longue duree\n2) Courte duree / Airbnb\n3) Colocation\n4) Parking / box\n\nJe lis toutes vos reponses en commentaire.",
    media: [], type: "post", likes: 642, location: "Geneve, Suisse", createdAt: hAgo(0.8),
    comments: mkComments("p-t3", [
      { author: U_THOMAS, content: "3) La colocation, rendement imbattable en ville.", h: 0.6, likes: 22 },
      { author: U_AMINA, content: "2) sans hesiter, mais faut gerer le pricing.", h: 0.5, likes: 18 },
      { author: U_YASMIN, content: "1) pour la tranquillite.", h: 0.4, likes: 9 },
    ]),
  },
  {
    id: "p-t4", author: U_SOPHIE,
    content: "3 ans que je suis hote sur E-Dome. Ce que j'aurais aime savoir au debut :\n\n— Repondre en < 1h change tout\n— Les photos font 80% de la reservation\n— Un bon menage vaut chaque centime\n\n#locationcourteduree #conseils",
    media: [], type: "post", likes: 917, location: "Lausanne, Suisse", createdAt: hAgo(4),
    comments: mkComments("p-t4", [
      { author: U_AMINA, content: "La regle du < 1h est sous-estimee. Bravo.", h: 3, likes: 27 },
    ]),
  },
  {
    id: "p-t5", author: U_AMINA,
    content: "Hot take : la plupart des gens ne calculent JAMAIS leur rendement net. Ils regardent le loyer, pas les charges, la vacance, les impots et la gestion.\n\nResultat : ils croient faire 6% et font 3%. #fiscalite #rendement",
    media: [], type: "post", likes: 1533, location: "Marrakech, Maroc", createdAt: hAgo(7),
    comments: mkComments("p-t5", [
      { author: U_MARC, content: "Je le repete a chaque formation. Merci de le dire.", h: 6, likes: 44 },
      { author: U_LEO, content: "Le brut ment, le net dit la verite.", h: 5, likes: 38 },
    ]),
  },
  {
    id: "p-t6", author: U_THOMAS,
    content: "Zurich vient de depasser 15'000 CHF/m2 en moyenne dans l'hypercentre. Geneve suit de pres.\n\nLa Suisse reste l'un des marches les plus resilients d'Europe. Qui investit encore en ville ?",
    media: [], type: "post", likes: 728, location: "Zurich, Suisse", createdAt: hAgo(11),
    comments: mkComments("p-t6", [
      { author: U_MARC, content: "Les prix defient la gravite.", h: 9, likes: 19 },
    ]),
  },
  {
    id: "p-analytics-1", author: U_MARC,
    content: "Petite demo de la carte analytique E-Dome : le rendement net d'un bien, en un coup d'oeil. On adore la transparence. #data #immobilier",
    media: [], type: "post", likes: 512, location: "Geneve, Suisse", createdAt: hAgo(15),
    comments: mkComments("p-analytics-1", [
      { author: U_SOPHIE, content: "Cette carte est geniale pour comparer vite.", h: 13, likes: 12 },
    ]),
    attachment: {
      type: "analytics",
      data: {
        propertyId: "prop1",
        propertyTitle: "Appartement vue lac · Lausanne",
        metric: "rendementNet",
        label: "Rendement net annuel",
        headline: "3.8%",
      },
    },
  },

  /* ── Sondages interactifs (facon X) ───────────────────────────────────── */
  {
    id: "p-poll-1", author: U_LEO,
    content: "Selon vous, quelle ville romande offre le meilleur potentiel d'investissement en 2026 ?",
    media: [], type: "post", likes: 486, location: "Geneve, Suisse", createdAt: hAgo(0.5),
    comments: mkComments("p-poll-1", [
      { author: U_MARC, content: "Geneve pour la liquidite, mais Fribourg pour le rendement.", h: 0.4, likes: 21 },
    ]),
    poll: {
      options: [
        { id: "o1", label: "Geneve", votes: 420 },
        { id: "o2", label: "Lausanne", votes: 380 },
        { id: "o3", label: "Fribourg", votes: 95 },
        { id: "o4", label: "Sion", votes: 60 },
      ],
      totalVotes: 955,
      endsAt: new Date(Date.now() + 2 * 24 * 3600_000).toISOString(),
    },
  },
  {
    id: "p-poll-2", author: U_MARC,
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
      endsAt: new Date(Date.now() + 6 * 3600_000).toISOString(),
    },
  },
];

// CTAs custom par id de post.
export type CustomCTA = { href: string; title: string; subtitle: string; icon: "users" | "search" | "user" | "calendar" };
export const CUSTOM_CTA: Record<string, CustomCTA> = {
  p6: { href: "/apporteurs", title: "Rejoindre le réseau d'apporteurs", subtitle: "Accès aux deals off-market", icon: "users" },
  p11: { href: "/recherche?q=marrakech", title: "Explorer Marrakech", subtitle: "Biens disponibles dans la médina", icon: "search" },
  p23: { href: "/profil/u1", title: "Voir le profil de Sophie", subtitle: "Hôte Lausanne · 4.8/5 · 89 avis", icon: "user" },
  p25: { href: "/recherche?q=marrakech", title: "Découvrir le Maroc", subtitle: "Riads & investissements patrimoine", icon: "search" },
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

export const SUGGESTIONS = [U_LEO, U_AMIRA, U_THOMAS, U_YASMIN];

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
