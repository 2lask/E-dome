import type { User, SocialPost, Comment } from "./types";
import type { Profile } from "./profile-types";
import { properties } from "./mock-data";
import { buildObjectAffiliate } from "./referral-links";

/* Posts affichés dans l'onglet « Publications » du profil : les vraies
   publications du feed social (vidéos, légendes, commentaires, biens
   affiliés + lien commission). Générés à partir de l'auteur (profil courant
   ou profil consulté) pour que nom/avatar correspondent. */

const hAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

/** Convertit un profil en auteur (User) pour ses publications. */
export function profileToAuthor(p: Profile): User {
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    avatar: p.avatar,
    city: p.location.city,
    country: p.location.country,
    roles: p.roles,
    activeRole: p.roles[0] ?? "client",
    stats: {
      followers: p.stats.followers,
      following: p.stats.following,
      properties: 0,
      reviews: p.stats.reviewsCount,
      rating: p.stats.rating,
      transactions: 0,
      revenue: 0,
    },
    bio: p.headline,
  };
}

// Quelques commentateurs (mock) pour peupler les fils.
const C_SOPHIE: User = {
  id: "user-002", firstName: "Sophie", lastName: "Durand", email: "sophie@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
  city: "Lausanne", country: "Suisse", roles: ["courtier"], activeRole: "courtier",
  stats: { followers: 890, following: 210, properties: 0, reviews: 42, rating: 4.8, transactions: 0, revenue: 0 }, bio: "",
};
const C_MARC: User = {
  id: "user-003", firstName: "Marc", lastName: "Favre", email: "marc@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1519345182560-cabd3c3338a3?w=100",
  city: "Genève", country: "Suisse", roles: ["courtier"], activeRole: "courtier",
  stats: { followers: 640, following: 340, properties: 0, reviews: 42, rating: 4.7, transactions: 0, revenue: 0 }, bio: "",
};
const C_AMINA: User = {
  id: "user-004", firstName: "Amina", lastName: "El Idrissi", email: "amina@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
  city: "Marrakech", country: "Maroc", roles: ["formateur"], activeRole: "formateur",
  stats: { followers: 1200, following: 610, properties: 0, reviews: 98, rating: 4.9, transactions: 0, revenue: 0 }, bio: "",
};

const mkComments = (postId: string, items: { author: User; content: string; h: number; likes?: number }[]): Comment[] =>
  items.map((c, i) => ({ id: `c-${postId}-${i}`, author: c.author, content: c.content, createdAt: hAgo(c.h), likes: c.likes ?? 0 }));

const clip = (n: number) => `/videos/feed/clip-${String(n).padStart(2, "0")}.mp4`;

const IMG = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&fit=crop`;

// Formation recommandée (post d'affiliation formation).
const FORMATION_F1 = {
  id: "f1",
  title: "Investissement immobilier : de 0 à expert",
  instructor: "Léo Martin",
  price: 497,
  students: 342,
  thumbnail: IMG("1560518883-ce09059eeffa", 600),
};

/* Mes publications (profil owner) : un mix riche et varié façon feed —
   plusieurs vidéos, photos, galeries, texte, biens recommandés en
   affiliation (avec commission) et formation. */
export function getMyPosts(author: User): SocialPost[] {
  const prop1 = properties.find((p) => p.id === "prop1"); // Lausanne, vente
  const prop3 = properties.find((p) => p.id === "prop3"); // Villa, vente
  const affiliate = (p?: (typeof properties)[number]) =>
    p ? buildObjectAffiliate("bien", p.id, p.title, { image: p.images[0], price: p.price, currency: p.currency, transactionType: p.transactionType }) : undefined;

  return [
    {
      id: "me-p1", author,
      content: "Bienvenue sur mon profil E-Dome.\n\nJe partage ici mes analyses, mes coups de cœur et les meilleures opportunités de mon réseau. #immobilier #investissement",
      media: [clip(1)], type: "post", likes: 2140, location: "Genève, Suisse", createdAt: hAgo(2),
      comments: mkComments("me-p1", [
        { author: C_SOPHIE, content: "Hâte de suivre tes analyses !", h: 1.5, likes: 24 },
        { author: C_MARC, content: "La référence romande. On suit.", h: 1, likes: 18 },
      ]),
    },
    {
      id: "me-p2", author,
      content: "Coup de cœur : appartement vue lac à Lausanne. Je le recommande à mon réseau — belle opportunité de rendement.\n\nLien direct ci-dessous 👇 #bien #lausanne",
      media: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=900&fit=crop"], type: "post",
      likes: 512, location: "Lausanne, Suisse", createdAt: hAgo(6),
      comments: mkComments("me-p2", [{ author: C_SOPHIE, content: "La vue lac fait toute la différence.", h: 5, likes: 12 }]),
      property: prop1, affiliate: affiliate(prop1),
    },
    {
      id: "me-p3", author,
      content: "Le marché romand premium sur 5 ans : +37 % en moyenne. Je décortique rendement brut/net, ROI et TIR sur trois cas réels. #analyse",
      media: [clip(4)], type: "post", likes: 1240, location: "Lausanne, Suisse", createdAt: hAgo(10),
      comments: mkComments("me-p3", [{ author: C_MARC, content: "Analyse au top, comme toujours.", h: 8, likes: 18 }]),
    },
    {
      id: "me-p4", author,
      content: "Avant / après — rénovation d'une cuisine à Vevey. Petit budget, gros impact visuel. #renovation #avantapres",
      media: [IMG("1556909211-d5b0c0b3a4b8"), IMG("1556909114-f6e7ad7d3136")],
      type: "post", likes: 408, location: "Vevey, Suisse", createdAt: hAgo(14),
      comments: mkComments("me-p4", [{ author: C_AMINA, content: "Le plan de travail change tout !", h: 12, likes: 7 }]),
    },
    {
      id: "me-p5", author,
      content: "Ma formation « Investissement immobilier : de 0 à expert » a déjà accompagné 342 personnes. Module 1 offert à ma communauté. #formation",
      media: [clip(17)], type: "post", likes: 1875, location: "Genève, Suisse", createdAt: hAgo(20),
      comments: mkComments("me-p5", [{ author: C_SOPHIE, content: "La formation qui m'a fait basculer. Merci.", h: 18, likes: 56 }]),
      formation: FORMATION_F1,
      affiliate: buildObjectAffiliate("formation", FORMATION_F1.id, FORMATION_F1.title, { image: FORMATION_F1.thumbnail, price: FORMATION_F1.price }),
    },
    {
      id: "me-p6", author,
      content: "Visite privée d'un penthouse rive droite à Genève. 280 m², terrasse 60 m², vue Mont-Blanc 360°. #penthouse #luxe",
      media: [IMG("1512917774080-9991f1c4c750")], type: "post", likes: 1052, location: "Genève, Suisse", createdAt: hAgo(26),
      comments: mkComments("me-p6", [{ author: C_MARC, content: "Niveau exceptionnel.", h: 24, likes: 19 }]),
    },
    {
      id: "me-p7", author,
      content: "Suivi de chantier ce matin — programme Minergie-P Zurich Nord. Gros œuvre quasi terminé, livraison Q3 2026. #promotion #chantier",
      media: [IMG("1503387762-592deb58ef4e"), IMG("1545324418-cc1a3fa10c00"), IMG("1556909114-f6e7ad7d3136")],
      type: "post", likes: 541, location: "Zurich, Suisse", createdAt: hAgo(32),
      comments: mkComments("me-p7", [{ author: C_MARC, content: "Belle qualité de finition déjà visible.", h: 30, likes: 14 }]),
    },
    {
      id: "me-p8", author,
      content: "Question simple : si vous deviez investir 100 K CHF aujourd'hui dans un seul canton suisse, lequel et pourquoi ? #débat #suisse",
      media: [], type: "post", likes: 932, location: "Genève, Suisse", createdAt: hAgo(40),
      comments: mkComments("me-p8", [
        { author: C_MARC, content: "Tessin, marché sous-coté.", h: 38, likes: 41 },
        { author: C_SOPHIE, content: "Valais pour la courte durée premium.", h: 36, likes: 33 },
      ]),
    },
    {
      id: "me-p9", author,
      content: "Off-market : villa d'architecte avec piscine à débordement. Réservé à mon réseau d'investisseurs. #offmarket #prestige",
      media: [clip(6)], type: "post", likes: 2103, location: "Nice, France", createdAt: hAgo(48),
      comments: mkComments("me-p9", [{ author: C_MARC, content: "Sérieusement intéressé. Je t'écris.", h: 46, likes: 38 }]),
      property: prop3, affiliate: affiliate(prop3),
    },
    {
      id: "me-p10", author,
      content: "Petit tour photos d'un penthouse en bord de mer. 4 chambres, vue 270°, livré meublé. #penthouse",
      media: [IMG("1600585154340-be6161a56a0c"), IMG("1600585154526-990dced4db0d"), IMG("1600596542815-ffad4c1539a9"), IMG("1600607687939-ce8a6c25118c")],
      type: "post", likes: 1102, location: "Cannes, France", createdAt: hAgo(56),
      comments: mkComments("me-p10", [{ author: C_SOPHIE, content: "La rareté absolue.", h: 54, likes: 26 }]),
    },
    {
      id: "me-p11", author,
      content: "Survol drone d'un projet alpin : 12 chalets en bois local, certifiés Minergie-P, vue plein sud. #chalet #alpes",
      media: [clip(26)], type: "post", likes: 743, location: "Crans-Montana, Suisse", createdAt: hAgo(70),
      comments: mkComments("me-p11", [{ author: C_MARC, content: "Crans-Montana en plein boom.", h: 68, likes: 18 }]),
    },
    {
      id: "me-p12", author,
      content: "Mon astuce du jour : le rendement NET (après charges, impôts, vacance) est LA donnée qui sépare les amateurs des sérieux. #conseil",
      media: [IMG("1454165804606-c3d57bc86b40")], type: "post", likes: 856, location: "Genève, Suisse", createdAt: hAgo(80),
      comments: mkComments("me-p12", [{ author: C_SOPHIE, content: "Tellement vrai.", h: 78, likes: 22 }]),
    },
    {
      id: "me-p13", author,
      content: "Deal bouclé en 9 jours, +18 % au-dessus de la mise à prix. Quand le réseau parle, ça va vite. #deal #network",
      media: [clip(22)], type: "post", likes: 2456, location: "Dubaï, Émirats", createdAt: hAgo(96),
      comments: mkComments("me-p13", [{ author: C_MARC, content: "Performance hallucinante.", h: 94, likes: 42 }]),
    },
    {
      id: "me-p14", author,
      content: "Coucher de soleil sur la médina. L'immobilier, c'est aussi un art de vivre. #marrakech #lifestyle",
      media: [IMG("1539020140153-e479b8c22e70")], type: "post", likes: 1567, location: "Marrakech, Maroc", createdAt: hAgo(120),
      comments: mkComments("me-p14", [{ author: C_AMINA, content: "Ma ville 🧡", h: 118, likes: 22 }]),
    },
  ];
}

/* Publications d'un profil consulté (public) : un jeu varié (vidéo, photos,
   galerie, texte) attribué à la personne consultée. */
export function getPublicPosts(author: User): SocialPost[] {
  const loc = `${author.city}, ${author.country}`;
  return [
    {
      id: `pub-${author.id}-1`, author,
      content: "Nouvelle vidéo : visite d'un bien d'exception de mon portefeuille. #immobilier",
      media: [clip(2)], type: "post", likes: 421, location: loc, createdAt: hAgo(5),
      comments: mkComments(`pub-${author.id}-1`, [{ author: C_SOPHIE, content: "Magnifique !", h: 4, likes: 8 }]),
    },
    {
      id: `pub-${author.id}-2`, author,
      content: "Coup de projecteur sur une belle opportunité cette semaine.",
      media: [IMG("1512917774080-9991f1c4c750")], type: "post", likes: 214, location: loc, createdAt: hAgo(14),
      comments: mkComments(`pub-${author.id}-2`, [{ author: C_MARC, content: "Intéressant.", h: 12, likes: 4 }]),
    },
    {
      id: `pub-${author.id}-3`, author,
      content: "Galerie : quelques biens phares de mon catalogue.",
      media: [IMG("1600596542815-ffad4c1539a9"), IMG("1600585154340-be6161a56a0c"), IMG("1512917774080-9991f1c4c750")],
      type: "post", likes: 176, location: loc, createdAt: hAgo(30),
      comments: [],
    },
    {
      id: `pub-${author.id}-4`, author,
      content: "Merci à la communauté pour cette belle semaine de visites et de rencontres ! #réseau",
      media: [], type: "post", likes: 96, location: loc, createdAt: hAgo(48),
      comments: [],
    },
    {
      id: `pub-${author.id}-5`, author,
      content: "En direct du terrain 🎥", media: [clip(11)], type: "post", likes: 333, location: loc, createdAt: hAgo(72),
      comments: mkComments(`pub-${author.id}-5`, [{ author: C_AMINA, content: "Superbe énergie.", h: 70, likes: 6 }]),
    },
  ];
}
