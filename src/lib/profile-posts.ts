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

/* Mes publications (profil owner) : un mix représentatif du feed — vidéo,
   bien recommandé en affiliation avec commission, galerie photo, texte. */
export function getMyPosts(author: User): SocialPost[] {
  const prop = properties.find((p) => p.id === "prop1");

  const posts: SocialPost[] = [
    {
      id: "me-p1", author,
      content:
        "Le marché romand premium sur 5 ans : +37 % en moyenne.\n\nDans ma dernière analyse, je décortique rendement brut/net, ROI et TIR sur trois cas réels. On en parle ? #investissement #immobilier",
      media: [clip(4)], type: "post", likes: 1240, location: "Lausanne, Suisse", createdAt: hAgo(3),
      comments: mkComments("me-p1", [
        { author: C_MARC, content: "Analyse au top, comme toujours.", h: 2, likes: 18 },
        { author: C_SOPHIE, content: "Le passage brut → net surprend toujours les débutants.", h: 1, likes: 9 },
      ]),
    },
    {
      id: "me-p2", author,
      content:
        "Coup de cœur : appartement vue lac à Lausanne. Je le recommande à mon réseau — belle opportunité de rendement.\n\nLien direct ci-dessous 👇 #bien #lausanne",
      media: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900"], type: "post",
      likes: 512, location: "Lausanne, Suisse", createdAt: hAgo(9),
      comments: mkComments("me-p2", [
        { author: C_SOPHIE, content: "La vue lac fait toute la différence.", h: 7, likes: 12 },
      ]),
      property: prop,
      affiliate: prop
        ? buildObjectAffiliate("bien", prop.id, prop.title, {
            image: prop.images[0], price: prop.price, currency: prop.currency, transactionType: prop.transactionType,
          })
        : undefined,
    },
    {
      id: "me-p3", author,
      content: "Avant / après — rénovation d'une cuisine à Vevey. Petit budget, gros impact visuel. #renovation #avantapres",
      media: [
        "https://images.unsplash.com/photo-1556909211-d5b0c0b3a4b8?w=900",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
      ],
      type: "post", likes: 408, location: "Vevey, Suisse", createdAt: hAgo(26),
      comments: mkComments("me-p3", [
        { author: C_AMINA, content: "Le plan de travail change tout !", h: 22, likes: 7 },
      ]),
    },
    {
      id: "me-p4", author,
      content:
        "Question simple : si vous deviez investir 100 K CHF aujourd'hui dans un seul canton suisse, lequel et pourquoi ?\n\nLes commentaires sont à vous. #débat #suisse",
      media: [], type: "post", likes: 932, location: "Genève, Suisse", createdAt: hAgo(48),
      comments: mkComments("me-p4", [
        { author: C_MARC, content: "Tessin, marché sous-coté.", h: 40, likes: 41 },
        { author: C_SOPHIE, content: "Valais pour la courte durée premium.", h: 36, likes: 33 },
      ]),
    },
  ];

  return posts;
}

/* Publications d'un profil consulté (public) : un jeu plus léger. */
export function getPublicPosts(author: User): SocialPost[] {
  return [
    {
      id: `pub-${author.id}-1`, author,
      content: "Nouvelle publication sur E-Dome. Ravi de partager mon actualité avec vous. #immobilier",
      media: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900"], type: "post",
      likes: 214, location: `${author.city}, ${author.country}`, createdAt: hAgo(12),
      comments: mkComments(`pub-${author.id}-1`, [
        { author: C_SOPHIE, content: "Superbe !", h: 8, likes: 4 },
      ]),
    },
    {
      id: `pub-${author.id}-2`, author,
      content: "Retour sur une belle semaine de visites et de rencontres. Merci à la communauté ! #réseau",
      media: [], type: "post", likes: 96, location: `${author.city}, ${author.country}`, createdAt: hAgo(40),
      comments: [],
    },
  ];
}
