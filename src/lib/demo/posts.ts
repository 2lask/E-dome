import { properties as ALL_PROPERTIES, formations as ALL_FORMATIONS } from "@/lib/mock-data";
import { CURRENT_USER as DEMO_USER } from "@/lib/demo/identity";
import { DIRECTORY, requirePerson } from "@/lib/demo/directory";
import { followingOf } from "@/lib/demo/social";
import { DEMO_TODAY, dayMonth } from "@/lib/demo/clock";
import { buildObjectAffiliate } from "@/lib/referral-links";
import type { User, SocialPost, Comment, Property, Poll, AnalyticsCardData } from "@/lib/types";

/* ── Le fil vivant (Mission 2, chantier P2bis) ─────────────────────────────

   Ce fichier ne porte que des données et les fabriques qui les construisent
   depuis le catalogue partagé : aucun rendu, aucun état.

   Le fil est écrit autour des SEIZE personnes du casting
   (`analyse2/casting.md`), dans leurs voix : Nikola court et sans accents,
   Bernard formel et un peu perdu, Ana qui pose des questions de débutante,
   Clémence qui doute, Ennio froid et chiffré, Yves qui signe « Meilleures
   salutations ». Les pros publient plus que les particuliers. Les
   publications s'étalent sur trois semaines avant `DEMO_TODAY`, jamais
   toutes le même jour.

   Règle des compteurs (B.3) : un réseau de seize personnes ne peut pas
   afficher 214 « j'aime ». Les « j'aime » sont donc une LISTE d'identifiants
   de l'annuaire (`likedBy`) et le compteur en dérive ; les votes d'un sondage
   sont des listes de votants ; les commentaires sont réels. Aucun compteur de
   partages. Les seules « vues » sont celles des vidéos, qui peuvent venir de
   visiteurs non inscrits : modestes. Le garde-fou est dans
   `tests/data/integrity.test.ts` (épreuve 37). */

// ─── Personnes ─────────────────────────────────────────────────────────────

/* L'utilisateur courant, dérivé de demo/identity. */
export const U_LEO: User = requirePerson(DEMO_USER.id);

/* Compte de la plateforme. Il n'existe que pour le post épinglé d'accueil.
   Aucune statistique, et c'est voulu — un compte officiel qui annoncerait des
   abonnés serait précisément l'affirmation de traction qu'on retire partout
   ailleurs. L'avatar est l'icône de l'application (`npm run icons`). */
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

/* Les seize, par identifiant d'annuaire. Raccourcis de lecture : le fil
   référence des ids, `requirePerson` les résout (et casse le chargement si
   l'un d'eux disparaissait de l'annuaire). */
const LEO = "user-001"; // Léo Martin — bailleur et hôte, Lausanne
const CEL = "user-002"; // Céline Bovard — agente indépendante, Lutry
const ENN = "user-003"; // Ennio Bordoni — investisseur, Genève
const ALI = "user-004"; // Aline Tschanz — agente, Hartmann Immobilier SA
const NIK = "user-005"; // Nikola Ristić — photographe, Yverdon
const ANA = "user-006"; // Ana Ferreira — cherche à louer, Renens
const BER = "user-007"; // Bernard Chappuis — vend seul, Pully
const CLE = "user-008"; // Clémence Jaquet — premier achat, Morges
const RET = "user-009"; // Reto Jungo — architecte, Fribourg
const ELE = "user-010"; // Elena Currat — home staging, Vevey
const SAN = "user-011"; // Sandrine Monnier — formatrice fiscalité, Neuchâtel
const YVE = "user-012"; // Yves Mottiez — apporteur, Bulle
const MIR = "user-013"; // Mirjana Kovač — hôte, Montreux
const HEL = "user-014"; // Hélène Marchal — apporteuse marketplace, Évian
const JLH = "user-015"; // Jean-Luc Hartmann — directeur, Hartmann Immobilier SA
const AMI = "user-016"; // Amina El Idrissi — formatrice, Marrakech

// ─── Helpers ───────────────────────────────────────────────────────────────

/* Daté sur l'horloge FIGÉE de la démo, pas `Date.now()` : un timestamp calculé
   au chargement du module diffère entre le serveur et le client (hydratation). */
export const hAgo = (h: number) => new Date(DEMO_TODAY.getTime() - h * 3600_000).toISOString();

/* « Il y a 3 h », relatif à l'horloge de la démo — pas à l'horloge réelle,
   qui afficherait « il y a six semaines » sur tout le fil, et différerait
   entre serveur et client. Au-delà de quatre semaines : « 12 septembre ». */
export function feedTimeAgo(isoDate: string): string {
  const d = new Date(isoDate);
  const minutes = Math.floor((DEMO_TODAY.getTime() - d.getTime()) / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `Il y a ${weeks} sem.`;
  return dayMonth(d);
}

/* Minuit (UTC) du jour de `DEMO_TODAY`. Les heures du fil sont écrites en
   heure suisse d'été (UTC+2), comme on les lirait sur un téléphone. */
const DAY0 = Date.UTC(DEMO_TODAY.getUTCFullYear(), DEMO_TODAY.getUTCMonth(), DEMO_TODAY.getUTCDate());
const SWISS_SUMMER_OFFSET_H = 2;

/** `at(3, "18:40")` : il y a trois jours, à 18 h 40 (heure suisse). */
export const at = (daysAgo: number, hhmm: string): string => {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(DAY0 - daysAgo * 86_400_000 + (h - SWISS_SUMMER_OFFSET_H) * 3_600_000 + m * 60_000).toISOString();
};

/* Bien attaché à un post, lu dans le catalogue partagé. Un identifiant inconnu
   casse le chargement, pas la page. */
export const propRef = (id: string): Property => {
  const found = ALL_PROPERTIES.find((p) => p.id === id);
  if (!found) throw new Error(`Bien inconnu référencé par le feed : ${id}`);
  return found;
};

/* Carte formation d'un post, construite depuis le catalogue partagé : la carte
   et la fiche ne peuvent pas diverger. */
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

/* Lien d'affiliation vers une formation du catalogue. */
export const mkFormationAffiliate = (id: string) => {
  const f = mkFormation(id);
  return buildObjectAffiliate("formation", f.id, f.title, {
    price: f.price,
    image: f.thumbnail,
  });
};

export const clip = (n: number) => `/videos/feed/clip-${String(n).padStart(2, "0")}.mp4`;

const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?w=900`;
const KITCHEN_BEFORE = IMG("1556909211-d5b0c0b3a4b8");
const KITCHEN_AFTER = IMG("1556909114-f6e7ad7d3136");
const SITE_FACADE = IMG("1503387762-592deb58ef4e");
const SITE_DETAIL = IMG("1545324418-cc1a3fa10c00");
const MEDINA = IMG("1539020140153-e479b8c22e70");

// ─── Le modèle d'un post du fil ────────────────────────────────────────────

/** Un post du fil : un `SocialPost`, plus la LISTE de ceux qui l'aiment
    (le compteur `likes` en dérive) et, pour les vidéos, des vues modestes. */
export type FeedPost = SocialPost & { likedBy: string[]; views?: number };

/** Un commentaire du fil : la liste de ceux qui l'aiment, le compteur dérivé. */
export type FeedComment = Comment & { likedBy: string[] };

type CommentSpec = { by: string; at: string; text: string; likedBy?: string[] };

type PostSpec = {
  id: string;
  by: string;
  at: string;
  text: string;
  likedBy: string[];
  comments?: CommentSpec[];
  media?: string[];
  location?: string;
  property?: string;
  formation?: string;
  affiliateFormation?: string;
  poll?: { options: { label: string; voters: string[] }[]; endsInH: number };
  analytics?: AnalyticsCardData;
  views?: number;
};

const authorOf = (id: string): User => (id === U_EDOME.id ? U_EDOME : requirePerson(id));

function mkPoll(spec: NonNullable<PostSpec["poll"]>): Poll {
  const options = spec.options.map((o, i) => ({ id: `o${i + 1}`, label: o.label, votes: o.voters.length }));
  const mine = spec.options.findIndex((o) => o.voters.includes(DEMO_USER.id));
  return {
    options,
    totalVotes: options.reduce((s, o) => s + o.votes, 0),
    endsAt: new Date(DEMO_TODAY.getTime() + spec.endsInH * 3_600_000).toISOString(),
    ...(mine >= 0 ? { userVote: options[mine].id } : {}),
  };
}

/** Les votants d'un sondage, par option — pour les vérifier à l'annuaire. */
export const POLL_VOTERS: Record<string, string[][]> = {};

function build(s: PostSpec): FeedPost {
  if (s.poll) POLL_VOTERS[s.id] = s.poll.options.map((o) => o.voters);
  const comments: FeedComment[] = (s.comments ?? []).map((c, i) => ({
    id: `c-${s.id}-${i}`,
    author: requirePerson(c.by),
    content: c.text,
    createdAt: c.at,
    likedBy: c.likedBy ?? [],
    likes: (c.likedBy ?? []).length,
  }));
  return {
    id: s.id,
    author: authorOf(s.by),
    content: s.text,
    media: s.media ?? [],
    type: "post",
    likedBy: s.likedBy,
    likes: s.likedBy.length,
    comments,
    createdAt: s.at,
    ...(s.location ? { location: s.location } : {}),
    ...(s.property ? { property: propRef(s.property) } : {}),
    ...(s.formation ? { formation: mkFormation(s.formation) } : {}),
    ...(s.affiliateFormation ? { affiliate: mkFormationAffiliate(s.affiliateFormation) } : {}),
    ...(s.poll ? { poll: mkPoll(s.poll) } : {}),
    ...(s.analytics ? { attachment: { type: "analytics" as const, data: s.analytics } } : {}),
    ...(typeof s.views === "number" ? { views: s.views } : {}),
  };
}

/** Ceux qui aiment un post (vide pour un post publié pendant la session). */
export function likersOf(post: SocialPost): string[] {
  return (post as Partial<FeedPost>).likedBy ?? [];
}

/** L'utilisateur courant aime-t-il déjà ce post, d'après la donnée ? */
export function likedByMe(post: SocialPost): boolean {
  return likersOf(post).includes(DEMO_USER.id);
}

/** Les vues d'une vidéo, ou `null` : aucun autre post n'affiche de vues. */
export function viewsOf(post: SocialPost): number | null {
  const v = (post as Partial<FeedPost>).views;
  return typeof v === "number" ? v : null;
}

// ─── Le post épinglé ───────────────────────────────────────────────────────

/* Le post d'accueil est ÉPINGLÉ, pas seulement récent : publier depuis le
   composer crée un post plus récent, qui le repousserait. L'épinglage tient
   sur les deux onglets — un avis de la plateforme n'est pas le contenu d'un
   compte qu'on suit ou non.

   Il ne porte plus de vidéo : le clip qu'il affichait (clip-01) était un
   gabarit « Before / After » avec le filigrane « surjo.aep » — le nom d'un
   projet After Effects tiers — incrusté dans l'image. Le fichier est retiré
   de `public/videos/feed/`. */
export const PINNED_POST_ID = "p1";

const PINNED: PostSpec = {
  id: PINNED_POST_ID,
  by: U_EDOME.id,
  at: at(0, "08:00"),
  text: "Bienvenue sur E-Dome\n\nVous parcourez une maquette de démonstration. Tout ce qui suit est un exemple : les profils, les biens, les annonces, les montants, les avis et les commentaires. Aucun chiffre affiché ici ne décrit l'activité réelle d'E-Dome, et aucune personne présentée n'est un utilisateur réel.\n\nCe que la maquette montre : réunir sur un même fil les propriétaires, les hôtes, les agences, les prestataires, les formateurs et les apporteurs de l'immobilier.\n\nCe qu'elle ne montre pas : une plateforme en service. Le projet est en construction.\n\nDites-nous ce qui manque, et ce qui vous paraît faux.",
  likedBy: [],
};

// ─── Le fil : trois semaines, du plus ancien au plus récent ────────────────

const SPECS: PostSpec[] = [
  /* ── Semaine 1 (9 – 15 septembre) ─────────────────────────────────────── */
  {
    id: "leo-fisc", by: LEO, at: at(21, "19:40"), location: "Lausanne",
    text: "J'ai terminé la formation de Sandrine Monnier sur la fiscalité immobilière. Ce que j'en retiens, concrètement, pour mes quatre logements :\n\n1. La valeur locative de l'appartement que j'habite, je la déclarais mal depuis deux ans.\n2. Les frais d'entretien du studio de Sous-Gare : forfait ou frais effectifs, on choisit chaque année. Je prenais toujours le forfait, par paresse.\n3. Le studio de Genève et l'appartement de Verbier sont imposés là où ils se trouvent, avec une répartition entre cantons que je ne soupçonnais pas.\n\nCe n'est pas la formation la plus vivante que j'aie suivie. C'est la plus rentable.",
    formation: "form-007",
    likedBy: [SAN, CLE, HEL, AMI, MIR],
    comments: [
      { by: SAN, at: at(21, "21:05"), text: "Merci Léo. Pour le point 2 : le choix forfait ou frais effectifs se fait par bien ET par année. On le revoit au module 4.", likedBy: [LEO] },
      { by: ENN, at: at(20, "08:12"), text: "Utile. Le chapitre sur l'entretien est trop court." },
      { by: SAN, at: at(20, "09:30"), text: "C'est noté, Ennio. Je l'étoffe pour la prochaine session.", likedBy: [ENN] },
    ],
  },
  {
    id: "nik-dispo", by: NIK, at: at(20, "07:15"),
    text: "dispo sam 19 et dim 20 pr shooting photo/drone, region yverdon lausanne neuch. visite 3d aussi. msg moi",
    likedBy: [CEL, ELE],
    comments: [
      { by: ALI, at: at(20, "08:02"), text: "Nikola, je te réserve samedi matin pour deux appartements à Neuchâtel ? Je t'envoie les adresses." },
      { by: NIK, at: at(20, "08:20"), text: "ok parfait 9h", likedBy: [ALI] },
    ],
  },
  {
    id: "cel-riex", by: CEL, at: at(20, "18:30"), location: "Riex",
    text: "Riex, hier soir. Nikola attendait que la lumière tombe sur les vignes pour la dernière photo, Elena déplaçait un fauteuil de dix centimètres pour la quatrième fois. Moi, je regardais la cave voûtée en me disant que c'est elle qui vendra la maison.\n\nLes visites commencent la semaine prochaine. Une maison vigneronne, ça se visite lentement : je bloque une heure par visite.",
    media: propRef("prop19").images,
    property: "prop19",
    likedBy: [NIK, ELE, JLH, LEO, ALI, YVE],
    comments: [
      { by: ELE, at: at(20, "19:10"), text: "Dix centimètres qui changent tout, je maintiens !", likedBy: [CEL, NIK] },
      { by: NIK, at: at(20, "21:47"), text: "photos hd dans ta boite demain matin" },
      { by: JLH, at: at(19, "08:30"), text: "Belle maison. Combien de visites prévoyez-vous avant d'ajuster le prix, Céline ?" },
      { by: CEL, at: at(19, "09:05"), text: "Je ne raisonne pas comme ça, Jean-Luc : si le prix est juste, on n'ajuste pas. On en reparle dans un mois ?" },
    ],
  },
  {
    id: "jlh-marche", by: JLH, at: at(19, "08:00"), location: "Neuchâtel",
    text: "Hartmann Immobilier SA — point de marché, littoral neuchâtelois, fin d'été 2026\n\nSur les huit derniers mois, nos ventes d'appartements entre Neuchâtel et Saint-Blaise se sont conclues en moyenne à 2 % sous le prix d'annonce, contre 5 % il y a deux ans. Les délais se sont raccourcis : neuf semaines en moyenne, contre quatorze.\n\nDeux observations, avec la prudence qui s'impose sur un échantillon de cette taille :\n— les biens rénovés énergétiquement partent nettement plus vite ;\n— les acquéreurs d'un premier logement sont de retour, souvent avec un apport familial.\n\nNous publierons le détail par commune à la fin de l'année.",
    likedBy: [ALI, RET, SAN, YVE, CEL],
    comments: [
      { by: ENN, at: at(19, "12:30"), text: "Échantillon ?" },
      { by: JLH, at: at(19, "13:05"), text: "Vingt-trois ventes. C'est peu, d'où la prudence." },
      { by: ENN, at: at(19, "13:20"), text: "C'est peu." },
      { by: RET, at: at(18, "07:50"), text: "Sur les biens rénovés, ça rejoint ce que je vois : une classe CECB gagnée, c'est un argument de visite que les acheteurs comprennent tout de suite.", likedBy: [JLH, ALI] },
    ],
  },
  {
    id: "ber-photos", by: BER, at: at(19, "10:20"),
    text: "Bonjour à tous,\n\nJe me permet de vous demander conseil. Je vends notre maison de Pully, où nous habitons depuis 1979. J'ai créé l'annonce sur ce site mais je n'arrive pas à y mettre les photographies. Mon petit-fils m'a dit de « glisser les fichiers », mais je ne vois pas ou.\n\nQuelqu'un pourrait-il m'expliquer ? Je vous en remercie d'avance.\n\nBernard Chappuis",
    likedBy: [YVE],
    comments: [
      { by: NIK, at: at(19, "11:02"), text: "bonjour mr chappuis, je suis photographe, je peux passer chez vous faire les photos + les mettre en ligne pr vous. devis gratuit je vous envoi un msg" },
      { by: ALI, at: at(19, "11:40"), text: "Bonjour Monsieur Chappuis : dans votre annonce, bouton « Modifier », puis « Photos », puis « Ajouter ». Sur ordinateur, vous pouvez aussi faire glisser les fichiers depuis un dossier jusque dans le cadre gris.", likedBy: [BER] },
      { by: BER, at: at(19, "16:15"), text: "Merci Madame, c'est très aimable. Et merci Monsieur Ristić, je vous appelle lundi. Vos photographies seront certainement plus belles que les miennes." },
      { by: CEL, at: at(18, "09:12"), text: "Bonjour Monsieur Chappuis, si vous le souhaitez je peux passer voir la maison, sans engagement, simplement pour vous donner un avis sur le prix. Je suis à Lutry, à dix minutes." },
      { by: BER, at: at(18, "17:40"), text: "Merci Madame Bovard. Je préfère essayer d'abord seul, je vous recontacterai peut-être." },
    ],
  },
  {
    id: "san-vl", by: SAN, at: at(18, "09:40"), location: "Neuchâtel",
    text: "Valeur locative : trois idées reçues que j'entends chaque semaine\n\n1. « Elle va disparaître, donc je ne m'en occupe plus. » Sa suppression a été acceptée en votation en septembre 2025, mais elle n'entrera pas en vigueur avant 2028 au plus tôt. Pour votre déclaration 2026, elle s'applique.\n\n2. « Mes travaux sont toujours déductibles. » L'entretien, oui ; la plus-value, non. Une cuisine remplacée à l'identique : entretien. Une cuisine agrandie : en partie plus-value.\n\n3. « Le forfait est plus simple, donc meilleur. » Plus simple, oui. Meilleur, seulement les années sans gros travaux.\n\nSi vous avez un cas particulier, posez-le en commentaire : je réponds à tout ce qui peut servir à d'autres.",
    likedBy: [LEO, CLE, HEL, JLH, ANA, ALI, AMI],
    comments: [
      { by: CLE, at: at(18, "11:15"), text: "Question peut-être bête : si j'achète l'année prochaine, je paie la valeur locative un an ou deux, et ensuite plus jamais ?" },
      { by: SAN, at: at(18, "12:02"), text: "Pas bête du tout. Oui, en principe jusqu'à l'entrée en vigueur. Mais avec la réforme, les intérêts hypothécaires ne seront plus déductibles non plus. Pour un premier achat très financé, ce n'est pas forcément une bonne nouvelle.", likedBy: [CLE, LEO, ENN] },
      { by: BER, at: at(17, "10:30"), text: "Merci Madame pour ces explications. Pour une maison que l'on vend en cours d'année, comment cela se passe t-il ?" },
      { by: SAN, at: at(17, "11:00"), text: "Au prorata, Monsieur Chappuis : jusqu'au jour du transfert de propriété. Et pensez à l'impôt sur le gain immobilier, c'est souvent la vraie surprise. Je vous écris en privé si vous voulez.", likedBy: [BER] },
    ],
  },
  {
    id: "ele-avap", by: ELE, at: at(17, "17:20"), location: "Vevey",
    text: "Avant / après. Un 3,5 pièces à Vevey, budget 2 400 CHF tout compris.\n\nCe qu'on a fait : vider le plan de travail, repeindre un seul mur, changer deux luminaires, louer trois plantes. Ce qu'on n'a pas fait : toucher à la cuisine elle-même.\n\nLe propriétaire voulait la refaire avant de vendre (devis à 28 000). On a gardé l'argent.",
    media: [KITCHEN_BEFORE, KITCHEN_AFTER],
    likedBy: [CEL, NIK, MIR, LEO, ALI, HEL],
    comments: [
      { by: LEO, at: at(17, "18:40"), text: "Les luminaires, vous les avez laissés au propriétaire ou repris après la vente ?" },
      { by: ELE, at: at(17, "19:02"), text: "Laissés, ils faisaient partie du budget. Les plantes, elles, sont reparties avec moi !", likedBy: [LEO, MIR] },
      { by: RET, at: at(16, "08:15"), text: "Bon conseil en général. Mais pour être honnête : si la cuisine a plus de vingt-cinq ans, l'acheteur la refera de toute façon et le négociera dans le prix. Ça dépend du bien.", likedBy: [JLH] },
      { by: ELE, at: at(16, "09:30"), text: "C'est vrai, Reto. Ici elle avait douze ans — on ne l'aurait pas fait sur une cuisine de 1990." },
    ],
  },
  {
    id: "enn-net", by: ENN, at: at(17, "21:05"), location: "Genève",
    text: "Rendement brut affiché sur la plupart des annonces lémaniques : 3 à 4 %.\nNet réel, après charges, entretien, vacance et impôt : 2 % environ.\nMon appartement de Lutry : 2,1 % net. Je l'ai acheté pour y habiter. Pas pour le rendement.\nFaites le calcul avant de visiter.",
    analytics: {
      propertyId: "prop1",
      propertyTitle: propRef("prop1").title,
      metric: "rendementNet",
      label: "Rendement net annuel",
      headline: "2,1 %",
    },
    likedBy: [SAN, LEO, CEL, CLE],
    comments: [
      { by: AMI, at: at(16, "10:12"), text: "Vrai en Suisse. À Marrakech, on tourne plutôt à 6–7 % net en courte durée — avec beaucoup plus de travail derrière." },
      { by: ENN, at: at(16, "10:40"), text: "Et un risque de change. Que vous n'intégrez pas." },
      { by: AMI, at: at(16, "11:05"), text: "C'est juste. Je l'ajoute au module sur l'investissement à l'étranger.", likedBy: [LEO] },
    ],
  },
  {
    id: "ali-bulle", by: ALI, at: at(16, "09:10"), location: "Bulle",
    text: "Nouveau mandat : une maison de 5,5 pièces à Bulle, vue sur le Moléson. Jardin, garage double, chauffage à pellets refait en 2018, à dix minutes à pied du centre.\n\nC'est Yves Mottiez qui nous a mis en relation avec les propriétaires, qu'il connaît depuis trente ans. Merci Yves !\n\nPremières visites samedi 26 septembre, sur inscription.",
    media: propRef("prop20").images,
    property: "prop20",
    likedBy: [JLH, YVE, NIK, RET],
    comments: [
      { by: YVE, at: at(16, "14:22"), text: "Madame Tschanz, je vous remercie de vos mots. Les propriétaires sont des gens de confiance et la maison a toujours été bien entretenue.\n\nMeilleures salutations, Y. Mottiez", likedBy: [ALI, JLH] },
      { by: JLH, at: at(16, "15:00"), text: "Merci à Yves pour sa confiance. C'est la deuxième fois." },
    ],
  },
  {
    id: "ami-riad", by: AMI, at: at(16, "20:30"), location: "Marrakech",
    text: "Octobre au riad : il me reste six nuits libres sur le mois. Ce n'est pas un argument de vente, c'est une information — le reste est réservé depuis juillet, surtout par des habitués.\n\nPour celles et ceux qui demandent : oui, je baisse le prix en semaine. Non, je ne le baisse jamais le week-end.",
    media: [MEDINA, ...propRef("prop4").images.slice(0, 2)],
    property: "prop4",
    likedBy: [MIR, HEL, LEO, SAN],
    comments: [
      { by: MIR, at: at(15, "07:45"), text: "Pourquoi jamais le week-end ? Chez moi le samedi se remplit à la dernière minute, je baisse le vendredi midi." },
      { by: AMI, at: at(15, "09:20"), text: "Ici, le week-end se remplit toujours : baisser, c'est perdre de l'argent. Ton marché n'est pas le mien — teste les deux et garde les chiffres.", likedBy: [MIR] },
    ],
  },
  {
    id: "yve-benichon", by: YVE, at: at(15, "11:00"), location: "Bulle",
    text: "Mesdames, Messieurs,\n\nLa Bénichon est passée, et avec elle les conversations de fin d'été. Trois familles de la région m'ont parlé ces jours de vendre une maison ou un chalet d'ici le printemps. Ce sont des biens qui ne seront pas sur internet avant longtemps.\n\nSi vous cherchez sérieusement en Gruyère ou en Veveyse, écrivez-moi ; je transmets aux agences avec qui je travaille.\n\nMeilleures salutations, Y. Mottiez",
    likedBy: [ALI, JLH, BER],
    comments: [
      { by: HEL, at: at(15, "13:30"), text: "Bonjour Yves, j'ai des clients côté français qui cherchent un chalet en Gruyère. Je vous écris ?" },
      { by: YVE, at: at(15, "17:05"), text: "Madame Marchal, volontiers. Je précise que pour les biens, je ne travaille qu'avec des agences suisses.\n\nMeilleures salutations, Y. Mottiez" },
    ],
  },
  {
    id: "ret-parcs", by: RET, at: at(15, "16:45"), location: "Neuchâtel",
    text: "Rue des Parcs, Neuchâtel — fin de chantier. Les échafaudages sont tombés hier.\n\nIsolation périphérique 20 cm (laine de roche), triple vitrage sur toutes les façades, pompe à chaleur air-eau en service depuis août. CECB de départ : F. Mesuré à la réception : B.\n\nIl reste les aménagements extérieurs et la réception définitive en octobre.",
    media: [SITE_FACADE, SITE_DETAIL],
    likedBy: [JLH, ALI, ELE, SAN, ENN],
    comments: [
      { by: JLH, at: at(15, "18:10"), text: "Les locataires du deuxième étage nous ont remerciés pour la propreté du chantier. C'est assez rare pour être dit, Reto.", likedBy: [RET, ALI] },
      { by: ENN, at: at(14, "07:30"), text: "Coût total ? Durée d'amortissement ?" },
      { by: RET, at: at(14, "08:05"), text: "1,9 M CHF pour douze logements, dont 380 000 de subventions (Programme Bâtiments et canton). Amortissement énergétique seul : 22 ans. Avec la hausse de valeur et les loyers après travaux : 13 à 15 ans." },
      { by: ENN, at: at(14, "08:20"), text: "Sans les subventions, je n'aurais pas fait." },
      { by: RET, at: at(14, "08:41"), text: "Sans les subventions, beaucoup de propriétaires ne le feraient pas. C'est bien pour ça qu'elles existent.", likedBy: [JLH, SAN, ALI] },
    ],
  },

  /* ── Semaine 2 (16 – 22 septembre, Jeûne fédéral le 20) ───────────────── */
  {
    id: "cel-cles", by: CEL, at: at(14, "12:30"), location: "Lutry",
    text: "Remise des clés à Lutry ce matin. Le 4,5 pièces de la route de Lavaux a changé de mains ; l'acquéreur m'a laissé un avis de deux lignes, ce qui, le connaissant, est presque une déclaration.\n\nJe garde de cette vente une chose : le prix fixé au départ était le bon, et personne n'a eu à le défendre.",
    likedBy: [ENN, NIK, ELE, JLH, LEO, ALI, CLE],
    comments: [
      { by: ENN, at: at(14, "13:10"), text: "Délais tenus. Prix tenu. Merci.", likedBy: [CEL] },
      { by: NIK, at: at(14, "14:00"), text: "felicitations !!" },
    ],
  },
  {
    id: "nik-drone", by: NIK, at: at(14, "19:00"),
    text: "quelques plans test du nouveau drone. stabilisation bcp mieux que l'ancien. dispo pr vols jusqu'a fin octobre, apres la meteo c complique",
    media: [clip(14)], views: 124,
    likedBy: [CEL, ELE, ALI, LEO],
    comments: [
      { by: RET, at: at(14, "20:12"), text: "Tu as les autorisations pour voler en ville à Neuchâtel ? Il me faudrait des vues de la toiture rue des Parcs pour le dossier de réception." },
      { by: NIK, at: at(14, "20:30"), text: "oui categorie specific ok. je te fais un devis demain", likedBy: [RET] },
    ],
  },
  {
    id: "mir-ete", by: MIR, at: at(13, "08:50"), location: "Montreux",
    text: "Bilan de l'été pour mes deux appartements :\n— 2 pièces à Montreux : 94 % en juillet (Jazz), 86 % en août\n— studio à Clarens : 81 % et 77 %\n\nSeptembre est plus calme que l'an dernier. Je ne sais pas encore si c'est la météo ou mes prix. Quelqu'un voit la même chose sur la Riviera ?",
    likedBy: [AMI, LEO, ELE],
    comments: [
      { by: LEO, at: at(13, "10:15"), text: "Pareil à Lausanne : dix points de moins en septembre au studio de Sous-Gare. Je pense que ce sont les prix, j'étais trop haut." },
      { by: AMI, at: at(13, "12:40"), text: "Regarde ton délai moyen de réservation sur septembre : s'il a raccourci, c'est le prix ; s'il est stable, c'est la demande.", likedBy: [MIR, LEO] },
      { by: MIR, at: at(13, "13:02"), text: "Raccourci. Donc le prix. Merci." },
    ],
  },
  {
    id: "hel-affil", by: HEL, at: at(13, "20:15"), location: "Évian-les-Bains",
    text: "Je recommande souvent la formation de Sandrine Monnier à mes clients qui achètent côté suisse : la fiscalité immobilière romande expliquée clairement, avec des cas réels.\n\nTransparence : le lien ci-dessous est un lien d'affiliation, je touche une commission si vous vous inscrivez. Le prix pour vous ne change pas.",
    formation: "form-007",
    affiliateFormation: "form-007",
    likedBy: [SAN, AMI],
    comments: [
      { by: SAN, at: at(12, "08:30"), text: "Merci Hélène. Une précision pour vos clients frontaliers : la formation traite des biens situés en Suisse. Si vous résidez en France, votre imposition dépend aussi de la convention franco-suisse, que je n'aborde qu'en surface.", likedBy: [HEL, LEO] },
      { by: HEL, at: at(12, "09:10"), text: "Très juste, merci de le préciser." },
    ],
  },
  {
    id: "jlh-parcs", by: JLH, at: at(12, "14:00"), location: "Neuchâtel",
    text: "Hartmann Immobilier SA gère depuis 2009 l'immeuble de la rue des Parcs, à Neuchâtel. Ses propriétaires y ont mené cette année une rénovation énergétique complète, confiée au bureau de Reto Jungo.\n\nNous avons fait le choix de maintenir les locataires en place pendant les travaux. C'est plus long et plus complexe ; c'est aussi, à notre sens, la seule manière correcte de procéder. Aline Tschanz a assuré le lien avec chaque ménage.",
    likedBy: [RET, ALI, SAN, YVE],
    comments: [
      { by: RET, at: at(12, "15:30"), text: "Merci Jean-Luc. Pour être précis : deux ménages ont été relogés trois semaines, pendant le remplacement des colonnes. Les autres sont restés.", likedBy: [JLH] },
      { by: CEL, at: at(12, "18:00"), text: "Belle démarche. On en parle trop peu." },
    ],
  },
  {
    id: "ana-garantie", by: ANA, at: at(12, "21:40"),
    text: "Bonjour, une question peut-être bête. On cherche un 4,5 pièces à Renens (on a deux enfants) et on nous demande 3 mois de garantie de loyer. C'est normal qu'on demande 3 mois de garantie ? Ça fait presque 7 000 CHF d'un coup pour nous.",
    likedBy: [CLE],
    comments: [
      { by: LEO, at: at(11, "07:40"), text: "Bonjour Ana, c'est le maximum légal (art. 257e CO) : trois mois, pas plus. L'argent doit être déposé sur un compte bloqué à votre nom, pas chez le bailleur. Il existe aussi des assurances de garantie si vous ne voulez pas immobiliser la somme — plus chères sur la durée.", likedBy: [ANA, SAN, ALI] },
      { by: SAN, at: at(11, "08:15"), text: "Ce que dit Léo est juste. Et les intérêts du compte bloqué vous reviennent." },
      { by: ALI, at: at(11, "09:00"), text: "Côté agence : trois mois, c'est ce que demandent presque toutes les régies vaudoises pour un appartement familial. Ce n'est pas un signe de méfiance envers vous." },
      { by: ANA, at: at(11, "12:20"), text: "Merci beaucoup à tous, je ne savais pas pour le compte à notre nom. On va regarder l'assurance aussi." },
      { by: CLE, at: at(11, "19:30"), text: "Merci pour la question Ana, je me la posais aussi." },
    ],
  },
  {
    id: "leo-renens", by: LEO, at: at(11, "10:30"), location: "Renens",
    text: "Mon locataire de Renens part fin octobre, après trois ans — une mutation professionnelle. Le 4,5 pièces se libère au 1er novembre.\n\nLoyer : 2 280 CHF + 200 CHF de charges, inchangé. Il figure sur la formule officielle de notification du loyer initial, obligatoire dans le canton de Vaud, que vous recevrez avec le bail.\n\nVisites samedi 26 septembre. Dossiers par message.",
    media: propRef("prop8").images,
    property: "prop8",
    likedBy: [ANA, CLE, SAN, MIR],
    comments: [
      { by: ANA, at: at(11, "11:05"), text: "Bonjour, c'est quoi exactement la formule officielle ? On doit la remplir nous ?" },
      { by: LEO, at: at(11, "11:40"), text: "Non, c'est le bailleur qui la remplit. Elle vous indique le loyer précédent et, s'il augmente, pourquoi. Vous pouvez contester le loyer initial dans les 30 jours après la remise des clés si vous l'estimez abusif.", likedBy: [ANA, SAN] },
      { by: ANA, at: at(11, "12:05"), text: "D'accord merci ! On vous a envoyé notre dossier." },
    ],
  },
  {
    id: "ami-module", by: AMI, at: at(11, "18:15"), location: "Marrakech",
    text: "Nouveau module dans « Pricing dynamique pour la location courte durée » : les événements locaux.\n\nUn festival, un salon, un congrès : la demande double sur trois nuits, et la plupart des hôtes s'en rendent compte trop tard. Je montre comment je repère ces dates six mois à l'avance, avec des outils gratuits.\n\nInscrits : le module est déjà dans votre espace.",
    formation: "form-010",
    likedBy: [MIR, HEL, LEO],
    comments: [
      { by: MIR, at: at(11, "19:00"), text: "Le Jazz, je l'ai compris il y a des années. Les congrès au 2m2c, je rate encore souvent les dates." },
      { by: AMI, at: at(10, "09:30"), text: "Leur calendrier est publié un an à l'avance. Je t'envoie comment je l'intègre à mes règles de prix.", likedBy: [MIR] },
      { by: LEO, at: at(10, "10:00"), text: "Je reste sceptique sur l'automatisation complète. J'ai essayé deux mois : les prix montaient très bien, mais redescendaient trop tard." },
      { by: AMI, at: at(10, "11:20"), text: "C'est le réglage le plus fréquent à corriger : le prix plancher. Tu as raison de garder la main." },
    ],
  },
  {
    id: "nik-pully", by: NIK, at: at(10, "16:20"), location: "Pully",
    text: "shooting chez mr chappuis a pully. maison de 1978, jardin enorme, lumiere top en fin d'aprem. photos en ligne demain sur son annonce",
    media: propRef("prop3").images,
    likedBy: [BER, CEL, ELE, YVE],
    comments: [
      { by: BER, at: at(10, "18:45"), text: "Merci Monsieur Ristić. Je ne savais pas que notre jardin pouvait être aussi beau en photographie." },
      { by: ELE, at: at(10, "19:30"), text: "Superbe lumière ! Monsieur Chappuis, si besoin je peux vous conseiller pour le salon avant les visites." },
    ],
  },
  {
    id: "ber-annonce", by: BER, at: at(9, "15:10"), location: "Pully",
    text: "Notre maison est maintenant en vente, avec les belles photographies de Monsieur Ristić.\n\nMaison familiale de 6,5 pièces à Pully, jardin de 850 m², vue sur le lac depuis l'étage. Nous y avons élevé nos trois enfants. Prix : 2 950 000 CHF.\n\nJe fais les visites moi-même, le mardi et le jeudi après-midi. Merci de prendre rendez vous par message.",
    media: [propRef("prop3").images[0]],
    property: "prop3",
    likedBy: [NIK, YVE, CEL],
    comments: [
      { by: CEL, at: at(9, "16:00"), text: "Très belles photos. Monsieur Chappuis, ma proposition tient toujours si vous voulez un deuxième avis sur le prix." },
      { by: BER, at: at(9, "18:20"), text: "Merci Madame Bovard. Je vais attendre de voir les premières visites." },
      { by: ENN, at: at(8, "07:10"), text: "2,95 M pour une maison de 1978 sans rénovation énergétique : c'est haut." },
      { by: BER, at: at(8, "10:45"), text: "Merci de votre avis Monsieur. La maison a été bien entretenue, mais je retiens la remarque." },
      { by: RET, at: at(8, "11:30"), text: "Si ça peut aider les acheteurs à se projeter : un CECB coûte environ 600 à 900 CHF pour une maison individuelle. C'est un document qui rassure.", likedBy: [BER, JLH] },
    ],
  },
  {
    id: "cel-morges", by: CEL, at: at(8, "12:15"), location: "Morges",
    text: "À Morges, à trois rues du quai : un 3,5 pièces de 92 m² au troisième étage, avec une loggia où le café du matin se prend au soleil. 985 000 CHF.\n\nUn vrai premier achat — c'est rare, à ce prix, si près du lac.",
    media: propRef("prop13").images,
    property: "prop13",
    likedBy: [CLE, NIK, ELE, ALI],
    comments: [
      { by: CLE, at: at(8, "13:30"), text: "Je l'ai vu passer… c'est exactement ce qu'on cherche. Mais 985 000, je ne sais pas si on peut." },
      { by: CEL, at: at(8, "14:02"), text: "Venez le visiter sans pression, Clémence. On fera le calcul ensemble ensuite, honnêtement.", likedBy: [CLE] },
    ],
  },
  {
    id: "ele-video", by: ELE, at: at(8, "19:30"), location: "Vevey",
    text: "Préparation d'une mise en vente, en vidéo. Deux heures sur place, trois cartons de déco, un seul principe : on enlève tout ce qui raconte la vie du propriétaire, on garde tout ce qui raconte la lumière.",
    media: [clip(26)], views: 88,
    likedBy: [CEL, MIR, NIK, AMI],
    comments: [
      { by: MIR, at: at(8, "21:00"), text: "Tu fais aussi les locations courte durée ? Mon studio de Clarens aurait besoin d'un coup de neuf." },
      { by: ELE, at: at(7, "08:30"), text: "Oui ! En courte durée c'est l'inverse : on ajoute plutôt qu'on enlève. Je t'écris.", likedBy: [MIR] },
    ],
  },

  /* ── Semaine 3 (23 – 30 septembre) ────────────────────────────────────── */
  {
    id: "ret-cecb", by: RET, at: at(7, "10:00"), location: "Fribourg",
    text: "CECB, CECB Plus, Minergie : on me pose la question chaque semaine, alors voici la version courte.\n\n— CECB : un diagnostic. Deux lettres, l'enveloppe et l'énergie globale. Environ 600 à 1 200 CHF selon le bâtiment.\n— CECB Plus : le même diagnostic, avec des variantes de travaux chiffrées. C'est lui qui ouvre la plupart des subventions cantonales.\n— Minergie : un label, pas un diagnostic. On le vise pour une rénovation lourde ou du neuf.\n\nL'ordre qui évite de jeter de l'argent : CECB Plus d'abord, travaux ensuite, label éventuellement. Trois chantiers réels détaillés dans ma formation.\n\n(Für Deutschfreiburger: GEAK = CECB, gleiche Logik.)",
    formation: "form-005",
    likedBy: [JLH, ALI, SAN, BER, YVE, LEO],
    comments: [
      { by: BER, at: at(7, "14:30"), text: "Merci Monsieur Jungo. Pour ma maison, le CECB simple suffit t-il pour vendre ?" },
      { by: RET, at: at(7, "15:10"), text: "Pour vendre, le CECB simple suffit, Monsieur Chappuis. Le Plus n'a de sens que si vous faites des travaux vous-même.", likedBy: [BER] },
    ],
  },
  {
    id: "yve-ferme", by: YVE, at: at(7, "18:40"), location: "Bulle",
    text: "Mesdames, Messieurs,\n\nJe cherche, pour une famille de ma connaissance, une ferme à rénover en Gruyère ou dans la Glâne. Budget raisonnable, travaux acceptés, résidence principale.\n\nSi vous connaissez quelqu'un qui pense à vendre, je vous serais reconnaissant de me le faire savoir.\n\nMeilleures salutations, Y. Mottiez",
    likedBy: [ALI, RET],
    comments: [
      { by: RET, at: at(6, "08:00"), text: "Attention aux fermes en zone agricole, Monsieur Mottiez : la transformation y est très encadrée (LAT). Je peux regarder un dossier avant achat.", likedBy: [YVE] },
      { by: YVE, at: at(6, "10:15"), text: "Monsieur Jungo, je n'y manquerai pas.\n\nMeilleures salutations, Y. Mottiez" },
    ],
  },
  {
    id: "mir-retour", by: MIR, at: at(6, "08:40"), location: "Montreux",
    text: "Retour honnête sur la formation d'Amina (pricing dynamique), trois mois après :\n\n+ J'ai enfin un prix plancher et un prix plafond par saison, au lieu de changer au feeling.\n+ Le module sur les événements m'a fait gagner le week-end du Jeûne : complet à 230 CHF la nuit.\n− Les exemples sont très marocains. Pour Montreux, j'ai dû refaire les saisons moi-même.\n\nJe la recommande, mais pas comme une recette.",
    formation: "form-010",
    likedBy: [AMI, LEO, HEL, ELE],
    comments: [
      { by: AMI, at: at(6, "10:05"), text: "Merci Mirjana, c'est le genre de retour qui m'aide. Je prépare un exemple suisse pour le module 3 — je peux utiliser tes chiffres, anonymisés ?" },
      { by: MIR, at: at(6, "10:30"), text: "Oui, sans problème." },
    ],
  },
  {
    id: "cle-doute", by: CLE, at: at(6, "21:10"), location: "Morges",
    text: "Je me pose la question depuis des mois, alors je la pose ici.\n\nJ'ai 27 ans, je loue un 2,5 pièces à Morges. Avec mon copain, on a environ 150 000 CHF de fonds propres, dont une partie de mon 2e pilier. On a visité un 3,5 pièces la semaine passée qui nous plaît vraiment.\n\nMais : les taux pourraient remonter, on n'est pas mariés, et mon contrat se termine dans un an. Tout le monde me dit « achète, le loyer c'est de l'argent jeté par la fenêtre ». Je n'en suis pas si sûre.\n\nEst-ce vraiment le moment ?",
    likedBy: [ANA, SAN, CEL, LEO],
    comments: [
      { by: ENN, at: at(6, "21:50"), text: "Le 3,5 pièces de Morges à 985 000, je suppose. Fonds propres requis : 197 000, dont au moins 98 500 hors 2e pilier. Vous avez 150 000. Il manque 47 000. Charges théoriques retenues par la banque : environ 58 000 par an. Revenu brut nécessaire : 174 000. Sans ces chiffres, la question du moment ne se pose pas.", likedBy: [SAN, LEO, JLH] },
      { by: SAN, at: at(5, "08:20"), text: "Ennio a raison sur les chiffres, mais je prendrais les choses dans l'ordre, Clémence :\n1. votre capacité (ce qu'Ennio vient de calculer) ;\n2. votre situation : le contrat, et le couple — en copropriété sans être mariés, il vous faut une convention écrite ;\n3. seulement ensuite, le marché.\nLe « moment » est la dernière question, pas la première.", likedBy: [CLE, ANA, LEO, HEL] },
      { by: CEL, at: at(5, "09:00"), text: "Clémence, je passe souvent à Morges. Un café un de ces matins ? Sans parler d'un bien précis, juste pour démêler tout ça.", likedBy: [CLE] },
      { by: CLE, at: at(5, "12:30"), text: "Merci à vous trois. Ennio, ça pique mais c'est clair. Céline, avec plaisir pour le café." },
      { by: ANA, at: at(5, "13:10"), text: "On se pose les mêmes questions, même si nous on loue encore pour l'instant. Merci pour ce post." },
    ],
  },
  {
    id: "san-live", by: SAN, at: at(5, "12:00"), location: "En ligne",
    text: "Live gratuit jeudi 8 octobre, 18 h 30 : « Déclaration d'impôt et bien immobilier — les questions que vous n'osez pas poser ».\n\nUne heure, en ligne. Pas de diapositives : vous demandez, je réponds, cas réels uniquement. Je commencerai par les questions de ce fil.\n\nInscription par message sur mon profil.",
    likedBy: [LEO, CLE, HEL, ANA, JLH, BER],
    comments: [
      { by: BER, at: at(5, "14:00"), text: "Madame Monnier, est-ce que ce sera enregistré ? Je ne suis pas sûr de réussir à me connecter." },
      { by: SAN, at: at(5, "14:30"), text: "Oui, Monsieur Chappuis, l'enregistrement sera envoyé à tous les inscrits. Et vous pouvez m'envoyer votre question à l'avance.", likedBy: [BER] },
    ],
  },
  {
    id: "leo-annul", by: LEO, at: at(5, "22:15"), location: "Lausanne",
    text: "Petite réflexion du soir. Trois annulations en septembre sur le studio de Sous-Gare, toutes dans les dix jours avant l'arrivée, avec une politique d'annulation « flexible ».\n\nJe passe en « modérée », ou je garde la flexibilité qui me fait réserver plus ? Je n'ai pas la réponse. Je teste octobre en modérée.",
    likedBy: [MIR, AMI],
    comments: [
      { by: MIR, at: at(4, "08:10"), text: "Modérée depuis deux ans. Moins de réservations, mais je dors mieux." },
      { by: AMI, at: at(4, "09:00"), text: "Teste au moins deux mois. Un seul mois, c'est du bruit." },
    ],
  },
  {
    id: "ami-reponse", by: AMI, at: at(4, "08:15"), location: "Marrakech",
    text: "Une chose que je répète à toutes mes élèves : répondez à la première question d'un voyageur en moins d'une heure. Pas pour l'algorithme. Parce que celui qui demande est en train de comparer avec trois autres logements.",
    likedBy: [MIR, LEO, HEL, ELE],
    comments: [
      { by: NIK, at: at(4, "09:30"), text: "pareil pr les devis photo. qui repond en 1er gagne" },
    ],
  },
  {
    id: "jlh-beauxarts", by: JLH, at: at(4, "11:30"), location: "Neuchâtel",
    text: "Nouveau mandat à Neuchâtel : un 4,5 pièces de 118 m² dans un immeuble de maître du quartier des Beaux-Arts, entièrement rénové en 2023. Parquet d'origine, hauts plafonds, balcon côté lac. 920 000 CHF.\n\nVisites dès le samedi 3 octobre, auprès d'Aline Tschanz.",
    media: [propRef("prop28").images[0]],
    property: "prop28",
    likedBy: [ALI, RET, SAN, YVE],
    comments: [
      { by: SAN, at: at(4, "13:00"), text: "Je connais bien le quartier : beaucoup de ces immeubles n'ont pas d'ascenseur. C'est le cas ici ?" },
      { by: ALI, at: at(4, "13:25"), text: "Bonne question, Sandrine : il y en a un. C'est dans l'annonce, mais je vais le mettre plus en évidence.", likedBy: [SAN, JLH] },
    ],
  },
  {
    id: "hel-soiree", by: HEL, at: at(4, "17:00"), location: "Évian-les-Bains",
    text: "Soirée réseau transfrontalière à Évian, jeudi 15 octobre à 19 h 15 : agents, notaires et acheteurs des deux rives du Léman.\n\nAu programme, la question que je reçois chaque semaine : acheter en France quand on travaille en Suisse, qu'est-ce que ça change vraiment ? Entrée libre, 40 places.",
    likedBy: [AMI, SAN],
    comments: [
      { by: CEL, at: at(4, "18:30"), text: "Je viendrai si je peux me libérer, Hélène. Le bateau de fin d'après-midi depuis Ouchy, c'est jouable ?" },
      { by: HEL, at: at(4, "19:00"), text: "Tout à fait, c'est pour ça qu'on commence à 19 h 15 — le temps de la traversée." },
    ],
  },
  {
    id: "enn-champel", by: ENN, at: at(3, "10:20"), location: "Genève",
    text: "Champel. 5 pièces. 142 m².\nToujours disponible.\nPrix inchangé : 3,15 M.\nJe m'installe à Lutry à la fin de l'année. Pas d'urgence, pas de rabais.",
    media: [propRef("prop16").images[0]],
    property: "prop16",
    likedBy: [CEL],
    comments: [
      { by: CEL, at: at(3, "11:00"), text: "Si tu veux un regard extérieur sur le prix, tu sais où me trouver." },
      { by: ENN, at: at(3, "11:30"), text: "Le prix est juste." },
    ],
  },
  {
    id: "ele-atelier", by: ELE, at: at(3, "16:40"), location: "Vevey",
    text: "Atelier home staging à Vevey, samedi 17 octobre, 9 h – 12 h. Huit places.\n\nPour les propriétaires qui vendent seuls ou qui mettent un logement en courte durée : ce qu'on enlève, ce qu'on ajoute, et comment photographier soi-même. 60 CHF, café compris.",
    likedBy: [CEL, MIR, BER, NIK],
    comments: [
      { by: BER, at: at(3, "18:00"), text: "Bonjour Madame, est-ce adapté pour quelqu'un de mon âge qui n'y connaît rien ?" },
      { by: ELE, at: at(3, "18:20"), text: "Bonjour Monsieur Chappuis, c'est précisément pour vous ! Aucune connaissance nécessaire.", likedBy: [BER] },
      { by: NIK, at: at(2, "08:00"), text: "je passe a la fin pr la partie photo si tu veux", likedBy: [ELE] },
    ],
  },
  {
    id: "ali-visites", by: ALI, at: at(3, "19:30"), location: "Neuchâtel",
    text: "Question aux acheteurs et aux locataires : pour une première visite, vous préférez…",
    poll: {
      options: [
        { label: "Un créneau individuel", voters: [CLE, ANA, BER, ENN, LEO] },
        { label: "Une visite groupée le samedi", voters: [MIR] },
        { label: "La visite 3D d'abord, puis sur place", voters: [NIK, SAN, RET, HEL] },
      ],
      endsInH: 52,
    },
    likedBy: [JLH, NIK],
    comments: [
      { by: NIK, at: at(3, "20:00"), text: "visite 3d dabord evidemment" },
      { by: ENN, at: at(2, "07:30"), text: "Individuel. Les visites groupées servent à mettre la pression. Ça se voit." },
      { by: ALI, at: at(2, "08:10"), text: "Parfois, Ennio. Chez nous, c'est surtout pour les gens qui ne peuvent venir que le samedi. Mais je note que vous n'êtes pas le seul à le penser." },
    ],
  },
  {
    id: "nik-montage", by: NIK, at: at(2, "07:50"),
    text: "nouveau montage pr une cliente, 40 sec. plans interieurs au stabilisateur + la piscine. ca vous plait ? critiques bienvenues",
    media: [clip(9)], views: 156,
    likedBy: [CEL, ELE, ALI, AMI, MIR],
    comments: [
      { by: ELE, at: at(2, "09:00"), text: "Le plan de l'escalier est superbe." },
      { by: CEL, at: at(2, "10:15"), text: "Très beau, mais un peu rapide pour une visite : un acheteur veut avoir le temps de voir la pièce. Pour mes biens, je préférerais deux fois plus lent.", likedBy: [JLH] },
      { by: NIK, at: at(2, "10:40"), text: "ok note, version lente pr tes biens alors" },
    ],
  },
  {
    id: "mir-novembre", by: MIR, at: at(2, "13:00"), location: "Montreux",
    text: "Novembre arrive. Pour vos logements en courte durée, vous faites quoi ?",
    poll: {
      options: [
        { label: "Je baisse les prix de 20 à 30 %", voters: [AMI] },
        { label: "Je ferme et je fais les travaux", voters: [ELE] },
        { label: "Je passe en moyenne durée (1–3 mois)", voters: [HEL, ENN] },
      ],
      endsInH: 72,
    },
    likedBy: [AMI, LEO],
    comments: [
      { by: LEO, at: at(2, "15:00"), text: "Moyenne durée l'an dernier pour le studio de Genève : un consultant pendant deux mois. Moins de travail, moins d'argent. Je ne sais pas encore si je recommence." },
    ],
  },
  {
    id: "ana-poursuites", by: ANA, at: at(2, "20:30"),
    text: "On a visité deux appartements samedi, un à Renens et un à Prilly. La régie de Prilly nous demande un extrait des poursuites de moins de 3 mois. On l'a commandé en ligne, 17 CHF. C'est normal de payer pour ça ?",
    likedBy: [CLE],
    comments: [
      { by: ALI, at: at(1, "08:30"), text: "Oui Ana, c'est normal, chaque office le facture. Gardez-le : il vous servira pour toutes vos candidatures pendant trois mois.", likedBy: [ANA] },
      { by: ANA, at: at(1, "12:00"), text: "Ah super, merci !" },
    ],
  },
  {
    id: "ret-visite", by: RET, at: at(1, "09:15"), location: "Neuchâtel",
    text: "Visite de chantier ouverte, samedi 10 octobre à 10 h, rue des Parcs à Neuchâtel — avant la réception définitive.\n\nPour les propriétaires qui envisagent une rénovation énergétique : on montre l'isolation, la pompe à chaleur et les vrais chiffres, y compris ce qui a coûté plus cher que prévu. Gratuit, quinze personnes au plus, chaussures fermées obligatoires.",
    likedBy: [JLH, ALI, YVE, SAN, BER, ENN],
    comments: [
      { by: JLH, at: at(1, "10:00"), text: "Merci Reto. Nous préviendrons les locataires de l'immeuble." },
      { by: ENN, at: at(1, "11:20"), text: "Je viendrai. Pour la partie « plus cher que prévu »." },
    ],
  },
  {
    id: "cel-question", by: CEL, at: at(1, "12:20"), location: "Lutry",
    text: "Ce matin, trois visites, trois fois la même question : « Vous pensez que les prix vont baisser ? »\n\nJe réponds honnêtement : je ne sais pas. Personne ne le sait. Ce que je sais, c'est ce que vaut ce bien aujourd'hui, et pourquoi.",
    likedBy: [CLE, JLH, ALI, LEO, ELE, SAN, ENN],
    comments: [
      { by: ENN, at: at(1, "13:00"), text: "Bonne réponse." },
      { by: CLE, at: at(1, "14:20"), text: "C'est rassurant à lire, bizarrement." },
    ],
  },
  {
    id: "cle-sondage", by: CLE, at: at(1, "18:30"), location: "Morges",
    text: "Merci encore pour toutes vos réponses de la semaine dernière. On a refait les calculs (merci Ennio…) : il nous manque environ 50 000 CHF. Vous feriez quoi à notre place ?",
    poll: {
      options: [
        { label: "Attendre un an et épargner", voters: [ENN, SAN, ANA, JLH] },
        { label: "Demander un coup de pouce à la famille", voters: [CEL, YVE] },
        { label: "Chercher moins cher, plus loin du lac", voters: [ALI, RET, MIR] },
      ],
      endsInH: 96,
    },
    likedBy: [ANA, SAN, CEL],
    comments: [
      { by: YVE, at: at(1, "20:00"), text: "Mademoiselle, à votre âge j'ai attendu trois ans. Je ne l'ai jamais regretté.\n\nMeilleures salutations, Y. Mottiez", likedBy: [CLE] },
      { by: SAN, at: at(0, "08:05"), text: "Si l'aide de la famille est une donation ou un prêt, ça change tout pour la banque. Dans les deux cas, faites-le par écrit." },
    ],
  },
  {
    id: "san-premier", by: SAN, at: at(0, "08:45"), location: "Neuchâtel",
    text: "Pour celles et ceux qui ont suivi le fil de Clémence : la question des fonds propres revient sans cesse. Le premier chapitre de ma formation « Premier achat » tient en une phrase — 20 % de fonds propres, dont la moitié au moins hors 2e pilier. Le reste de la formation explique comment y arriver.",
    formation: "form-009",
    likedBy: [CLE, ANA, HEL],
    comments: [
      { by: CLE, at: at(0, "09:30"), text: "Merci Sandrine, je regarde ce soir." },
    ],
  },
];

/* Le fil complet : l'avis épinglé, puis les publications des seize. Le nom
   historique `VIDEO_POSTS` est gardé (invariants, pages) ; ce n'est plus un
   fil de vidéos — il en reste trois, toutes propres et cohérentes avec leur
   auteur (Nikola, photographe et pilote de drone ; Elena, home staging). */
export const VIDEO_POSTS: FeedPost[] = [PINNED, ...SPECS].map(build);

// ─── Appels à l'action ─────────────────────────────────────────────────────

/* CTA par id de post. Les événements du fil (un live, un atelier, une visite
   de chantier, une soirée réseau) sont organisés par leur auteur : on
   s'inscrit en lui écrivant, depuis son profil — pas sur une fiche
   d'événement qui n'existe pas. */
export type CustomCTA = { href: string; title: string; subtitle: string; icon: "users" | "search" | "user" | "calendar" };
export const CUSTOM_CTA: Record<string, CustomCTA> = {
  "san-live": { href: `/profil/${SAN}`, title: "Écrire à Sandrine pour s'inscrire", subtitle: "Live gratuit · jeudi 8 octobre, 18 h 30 · en ligne", icon: "calendar" },
  "hel-soiree": { href: `/profil/${HEL}`, title: "Écrire à Hélène pour réserver", subtitle: "Soirée réseau · jeudi 15 octobre, 19 h 15 · Évian", icon: "calendar" },
  "ele-atelier": { href: `/profil/${ELE}`, title: "Écrire à Elena pour réserver", subtitle: "Atelier · samedi 17 octobre, 9 h – 12 h · Vevey", icon: "calendar" },
  "ret-visite": { href: `/profil/${RET}`, title: "Écrire à Reto pour s'inscrire", subtitle: "Visite de chantier · samedi 10 octobre, 10 h · Neuchâtel", icon: "calendar" },
  "yve-ferme": { href: `/profil/${YVE}`, title: "Écrire à Yves Mottiez", subtitle: "Apporteur · Gruyère, Veveyse, Glâne", icon: "user" },
};

/* Le vocabulaire de mots-dièse de la maquette, sans compteur (un volume de
   publications serait une affirmation de traction). `/creer-post` le propose
   à la saisie. */
export const HASHTAGS = [
  "#immobilier", "#investissement", "#location", "#suisse", "#marché",
  "#rendement", "#rénovation", "#homestaging", "#fiscalité", "#premierachat",
  "#lausanne", "#genève", "#neuchâtel", "#fribourg", "#lavaux",
];

/* « Qui suivre » : les personnes de l'annuaire que l'utilisateur courant ne
   suit PAS encore d'après le graphe FOLLOWS — jamais lui-même, jamais quelqu'un
   qu'il suit déjà. Les écrans filtrent en plus sur les suivis de la session. */
export const SUGGESTIONS: User[] = DIRECTORY.filter(
  (p) => p.id !== DEMO_USER.id && !followingOf(DEMO_USER.id).includes(p.id),
);

// ─── Misc ──────────────────────────────────────────────────────────────────

export const CURRENT_USER_ID = DEMO_USER.id;
export const CURRENT_USER = U_LEO;

/** Les publications d'une personne, dans le fil — pour l'onglet du profil. */
export function postsByAuthor(id: string): FeedPost[] {
  return VIDEO_POSTS.filter((p) => p.author.id === id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
