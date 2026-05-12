"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send,
  MapPin, X, ChevronUp,
  Edit3, Trash2, Flag, EyeOff, Copy, Play,
  Volume2, VolumeX, Calendar, Search, User as UserIcon,
  TrendingUp, Users, UserPlus,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { timeAgo, formatCount } from "@/lib/utils";
import { roleBadgeColors, roleLabels } from "@/lib/types";
import type { User, SocialPost, Comment, Property } from "@/lib/types";

// ─── Users ─────────────────────────────────────────────────────────────────

const U_LEO: User = {
  id: "u-leo", firstName: "Léo", lastName: "Martin", email: "leo@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
  city: "Genève", country: "Suisse", roles: ["investisseur", "formateur"], activeRole: "investisseur",
  stats: { followers: 12400, following: 240, properties: 38, reviews: 156, rating: 4.9, transactions: 220, revenue: 12_400_000 },
  bio: "Co-fondateur E-Dome — l'immobilier sans intermédiaire.",
};

const U_SOPHIE: User = {
  id: "u1", firstName: "Sophie", lastName: "Martin", email: "sophie@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
  stats: { followers: 1240, following: 380, properties: 12, reviews: 89, rating: 4.8, transactions: 45, revenue: 125000 },
  bio: "Hôte passionnée — Riviera lémanique.", responseTime: "< 1h",
};

const U_MARC: User = {
  id: "u2", firstName: "Marc", lastName: "Dubois", email: "marc@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  city: "Genève", country: "Suisse", roles: ["investisseur"], activeRole: "investisseur",
  stats: { followers: 3200, following: 150, properties: 24, reviews: 56, rating: 4.9, transactions: 120, revenue: 890000 },
  bio: "Investisseur immobilier — luxe & rendement.",
};

const U_AMIRA: User = {
  id: "u3", firstName: "Amira", lastName: "El Fassi", email: "amira@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  city: "Marrakech", country: "Maroc", roles: ["agence"], activeRole: "agence",
  stats: { followers: 5600, following: 420, properties: 85, reviews: 230, rating: 4.7, transactions: 300, revenue: 2400000 },
  bio: "Directrice Agence Fassi — Médina & palmeraie.",
};

const U_THOMAS: User = {
  id: "u4", firstName: "Thomas", lastName: "Weber", email: "thomas@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  city: "Zurich", country: "Suisse", roles: ["promoteur"], activeRole: "promoteur",
  stats: { followers: 2100, following: 90, properties: 6, reviews: 34, rating: 4.6, transactions: 18, revenue: 5_600_000 },
  bio: "Promoteur — projets Minergie haut de gamme.",
};

const U_AMINA: User = {
  id: "user-004", firstName: "Amina", lastName: "El Idrissi", email: "amina@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100",
  city: "Marrakech", country: "Maroc", roles: ["formateur"], activeRole: "formateur",
  stats: { followers: 8900, following: 310, properties: 0, reviews: 412, rating: 4.9, transactions: 0, revenue: 0 },
  bio: "Formatrice — Gestion locative & pricing dynamique.",
};

const U_YASMIN: User = {
  id: "u-yasmin", firstName: "Yasmin", lastName: "Al Falasi", email: "yasmin@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
  city: "Dubaï", country: "Émirats arabes unis", roles: ["apporteur"], activeRole: "apporteur",
  stats: { followers: 6800, following: 180, properties: 0, reviews: 145, rating: 4.9, transactions: 92, revenue: 4_800_000 },
  bio: "Apporteuse d'affaires — off-market Dubaï & Émirats.",
};

const ALL_USERS: User[] = [U_LEO, U_SOPHIE, U_MARC, U_AMIRA, U_THOMAS, U_AMINA, U_YASMIN];

// ─── Helpers ───────────────────────────────────────────────────────────────

const hAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

type SimpleComment = { author: User; content: string; h?: number; likes?: number };

const mkComments = (postId: string, items: SimpleComment[]): Comment[] =>
  items.map((c, i) => ({
    id: `c-${postId}-${i}`,
    author: c.author,
    content: c.content,
    createdAt: hAgo(c.h ?? 1),
    likes: c.likes ?? 0,
  }));

type PropArgs = Pick<Property, "id" | "title" | "type" | "transactionType" | "price" | "currency" | "bedrooms" | "bathrooms" | "area" | "host" | "location" | "images"> & Partial<Property>;
const mkProp = (p: PropArgs): Property => ({
  description: p.title,
  amenities: [],
  rating: 4.8,
  reviewCount: 24,
  ...p,
});

// ─── Posts: 27 vidéos ──────────────────────────────────────────────────────

const clip = (n: number) => `/videos/feed/clip-${String(n).padStart(2, "0")}.mp4`;

const VIDEO_POSTS: SocialPost[] = [
  {
    id: "p1", author: U_LEO,
    content: "Bienvenue sur E-Dome 🌍\n\nLa plateforme qui réunit hôtes, investisseurs, apporteurs et formateurs autour de l'immobilier — sans intermédiaire. Trois mois de bêta, +4 500 inscrits, on accélère.\n\nMerci à toute la communauté qui construit ça avec nous. #immobilier #suisse #startup",
    media: [clip(1)], type: "post", likes: 4521, location: "Genève, Suisse",
    createdAt: hAgo(2),
    comments: mkComments("p1", [
      { author: U_SOPHIE, content: "Tellement fier de faire partie de l'aventure depuis le jour 1 🚀", h: 1.5, likes: 84 },
      { author: U_MARC, content: "La meilleure plateforme pour les investisseurs sérieux. On continue.", h: 1, likes: 56 },
      { author: U_AMIRA, content: "Bravo @léo, le Maroc te remercie 🌅", h: 0.5, likes: 42 },
    ]),
  },
  {
    id: "p2", author: U_SOPHIE,
    content: "Visite express de mon appart 135 m² avec vue sur le Léman 🌊\n\nBelle luminosité, parquet d'origine, cuisine refaite l'an dernier. Disponible à la vente — DM si intéressé. #lausanne #appartement #vente",
    media: [clip(2)], type: "post", likes: 312, location: "Lausanne, Suisse",
    createdAt: hAgo(5),
    comments: mkComments("p2", [
      { author: U_MARC, content: "La vue lac est un argument de vente redoutable 🎯", h: 4, likes: 18 },
      { author: U_THOMAS, content: "Le standing est superbe. Tu acceptes les visites week-end ?", h: 2, likes: 6 },
    ]),
    property: mkProp({
      id: "prop1", title: "Appartement vue lac · Lausanne",
      type: "appartement", transactionType: "vente", price: 1_450_000, currency: "CHF",
      bedrooms: 3, bathrooms: 2, area: 135, host: U_SOPHIE,
      location: { city: "Lausanne", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"],
      analytics: { rendementBrut: 5.2, rendementNet: 3.8, prixM2: 10741, dpe: "B", etatGeneral: "Excellent", anneeConstruction: 2020, potentielPlusValue: 15, roi5ans: 30, roi10ans: 68, tauxOccupation: 92 },
    }),
  },
  {
    id: "p3", author: U_AMIRA,
    content: "Riad d'exception au cœur de la médina ✨\n\n200 m², patio central, hammam privé, 4 suites. Rendement locatif courte durée : 9.5 % brut. Une perle rare — déjà 12 demandes de visite. #marrakech #riad #investissement",
    media: [clip(3)], type: "post", likes: 845, location: "Marrakech, Maroc",
    createdAt: hAgo(8),
    comments: mkComments("p3", [
      { author: U_MARC, content: "Marrakech affiche des rendements imbattables en ce moment. À surveiller 🔥", h: 6, likes: 32 },
      { author: U_YASMIN, content: "Magnifique. Tu as la fiscalité sur la table ?", h: 4, likes: 14 },
      { author: U_LEO, content: "Le bois de cèdre original, c'est rare. Bravo Amira.", h: 2, likes: 21 },
    ]),
    property: mkProp({
      id: "prop11", title: "Riad médina · Marrakech",
      type: "riad", transactionType: "vente", price: 340_000, currency: "EUR",
      bedrooms: 4, bathrooms: 3, area: 200, host: U_AMIRA,
      location: { city: "Marrakech", country: "Maroc" },
      images: ["https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400"],
      analytics: { rendementBrut: 9.5, rendementNet: 7.2, prixM2: 1700, dpe: "C", etatGeneral: "Restauré", anneeConstruction: 1820, potentielPlusValue: 25, roi5ans: 48, roi10ans: 110, tauxOccupation: 88 },
    }),
  },
  {
    id: "p4", author: U_MARC,
    content: "Le marché suisse romand sur 5 ans : +37 % en moyenne sur les biens premium 📈\n\nMa formation \"Analyse financière pour investisseurs\" passe au crible chaque ratio : rendement brut/net, ROI, TIR, LTV. Inscriptions ouvertes — les places partent vite. #investissement #formation",
    media: [clip(4)], type: "post", likes: 1240, location: "Genève, Suisse",
    createdAt: hAgo(12),
    comments: mkComments("p4", [
      { author: U_LEO, content: "La meilleure formation de la plateforme. Sérieux et rigoureux.", h: 10, likes: 67 },
      { author: U_SOPHIE, content: "Inscrite à la prochaine session, hâte 🎯", h: 8, likes: 12 },
    ]),
    formation: { id: "f5", title: "Analyse financière pour investisseurs", instructor: "Marc Dubois", price: 349, students: 420, thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop" },
  },
  {
    id: "p5", author: U_THOMAS,
    content: "Premier coup d'œil sur notre nouveau projet — Zurich Nord 🏗️\n\n28 logements certifiés Minergie-P, livraison Q3 2026, vue dégagée sur le Limmat. Réservez votre visite privée avant l'ouverture officielle. #promotion #zurich #minergie",
    media: [clip(5)], type: "post", likes: 578, location: "Zurich, Suisse",
    createdAt: hAgo(16),
    comments: mkComments("p5", [
      { author: U_MARC, content: "Minergie-P et Zurich Nord, c'est du gagnant. Demande envoyée.", h: 14, likes: 24 },
    ]),
    property: mkProp({
      id: "prop7", title: "Programme Minergie-P · Zurich Nord",
      type: "appartement", transactionType: "vente", price: 980_000, currency: "CHF",
      bedrooms: 3, bathrooms: 2, area: 110, host: U_THOMAS,
      location: { city: "Zurich", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"],
      analytics: { rendementBrut: 4.1, rendementNet: 3.2, prixM2: 8909, dpe: "A", etatGeneral: "Neuf", anneeConstruction: 2026, potentielPlusValue: 18, roi5ans: 28, roi10ans: 62, tauxOccupation: 95 },
    }),
  },
  {
    id: "p6", author: U_YASMIN,
    content: "Off-market à Dubaï Marina 🏙️\n\nPenthouse 4 chambres, vue Burj Al Arab, livré meublé, vendu 12 % sous le prix du marché. Pas publié sur les portails — réservé à mon réseau d'apporteurs.\n\nDM avec votre budget. #dubai #offmarket #apporteur",
    media: [clip(6)], type: "post", likes: 2103, location: "Dubaï, Émirats arabes unis",
    createdAt: hAgo(20),
    comments: mkComments("p6", [
      { author: U_MARC, content: "Sérieusement intéressé. Je t'écris ce soir.", h: 18, likes: 38 },
      { author: U_LEO, content: "Yasmin gère le off-market à Dubaï comme personne. Référence absolue.", h: 16, likes: 91 },
    ]),
  },
  {
    id: "p7", author: U_SOPHIE,
    content: "Mon astuce préférée pour booster mes revenus Airbnb 📸\n\nChanger les photos tous les 3 mois pour suivre la saisonnalité : +18 % de réservations en moyenne. La formation d'@amina détaille tout. #locationcourtedurée #airbnb #conseil",
    media: [clip(7)], type: "post", likes: 421, location: "Lausanne, Suisse",
    createdAt: hAgo(26),
    comments: mkComments("p7", [
      { author: U_AMINA, content: "Exact ! Le pricing dynamique fait le reste. Merci pour le shout-out 💙", h: 22, likes: 28 },
    ]),
    formation: { id: "f2", title: "Gestion locative avancée", instructor: "Amina El Idrissi", price: 199, students: 890, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
  },
  {
    id: "p8", author: U_AMINA,
    content: "Nouveau module dans \"Gestion locative avancée\" 🚀\n\nPricing dynamique avec automatisation Beyond Pricing + PriceLabs. Mes étudiants augmentent leurs revenus de 30 à 40 % en moyenne. Inscriptions sur le profil. #gestionlocative #formation #automatisation",
    media: [clip(8)], type: "post", likes: 1567, location: "Marrakech, Maroc",
    createdAt: hAgo(32),
    comments: mkComments("p8", [
      { author: U_SOPHIE, content: "J'attendais ce module 🔥 module commandé.", h: 30, likes: 19 },
      { author: U_THOMAS, content: "Tu peux automatiser ça aussi sur les long-séjours ?", h: 28, likes: 8 },
      { author: U_AMIRA, content: "Référence dans le métier. Merci Amina.", h: 26, likes: 22 },
    ]),
    formation: { id: "f2", title: "Gestion locative avancée", instructor: "Amina El Idrissi", price: 199, students: 890, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
  },
  {
    id: "p9", author: U_LEO,
    content: "On y sera le 15 mai au Palexpo 🎯\n\nStand E-Dome — venez discuter de notre roadmap 2026 et tester les nouvelles fonctionnalités en avant-première. Places limitées, pensez à réserver. #salon #geneve #networking",
    media: [clip(9)], type: "post", likes: 894, location: "Genève, Suisse",
    createdAt: hAgo(40),
    comments: mkComments("p9", [
      { author: U_MARC, content: "Je passe avec deux investisseurs. À très vite.", h: 38, likes: 15 },
      { author: U_AMIRA, content: "Le Maroc sera représenté 💪", h: 36, likes: 11 },
    ]),
  },
  {
    id: "p10", author: U_MARC,
    content: "Visite privée hier soir d'un penthouse rive droite à Genève 🌆\n\n280 m², terrasse 60 m², vue Mont-Blanc 360°. Prix : 4.8 M CHF. Je négocie pour un client — disponible jusqu'à fin du mois si l'offre n'aboutit pas. #penthouse #geneve #luxe",
    media: [clip(10)], type: "post", likes: 1052, location: "Genève, Suisse",
    createdAt: hAgo(48),
    comments: mkComments("p10", [
      { author: U_YASMIN, content: "Niveau Dubaï 👌", h: 46, likes: 19 },
      { author: U_LEO, content: "Un de mes clients pourrait être intéressé. Je t'écris.", h: 44, likes: 12 },
    ]),
    property: mkProp({
      id: "prop3", title: "Penthouse 360° · Rive droite Genève",
      type: "penthouse", transactionType: "vente", price: 4_800_000, currency: "CHF",
      bedrooms: 4, bathrooms: 3, area: 280, host: U_MARC,
      location: { city: "Genève", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400"],
      analytics: { rendementBrut: 3.8, rendementNet: 2.6, prixM2: 17142, dpe: "B", etatGeneral: "Excellent", anneeConstruction: 2019, potentielPlusValue: 22, roi5ans: 35, roi10ans: 78, tauxOccupation: 100 },
    }),
  },
  {
    id: "p11", author: U_AMIRA,
    content: "La médina à l'aube — magie pure 🌅\n\nTrois biens en stock cette semaine pour investisseurs courageux. Rendement net 7-9 % sur le courte durée saisonnier. #marrakech #medina #investissement",
    media: [clip(11)], type: "post", likes: 612, location: "Marrakech, Maroc",
    createdAt: hAgo(56),
    comments: mkComments("p11", [
      { author: U_SOPHIE, content: "Splendide 😍", h: 54, likes: 8 },
    ]),
  },
  {
    id: "p12", author: U_THOMAS,
    content: "Webinaire gratuit le 20 avril à 18h 🎥\n\nComment lire un dossier de rendement comme un promoteur — on déchire 3 cas réels en direct (Lausanne, Lugano, Zurich). Posez vos questions en live. #webinaire #rendement #formation",
    media: [clip(12)], type: "post", likes: 387, location: "En ligne",
    createdAt: hAgo(64),
    comments: mkComments("p12", [
      { author: U_MARC, content: "Inscrit ✅", h: 62, likes: 14 },
      { author: U_LEO, content: "Format que je recommande à tous mes étudiants débutants.", h: 60, likes: 22 },
    ]),
  },
  {
    id: "p13", author: U_SOPHIE,
    content: "Atelier home staging Lausanne — déjà inscrite 🎨\n\nClaire Bernard est une référence en Suisse romande. J'attendais ce cours depuis 6 mois. Encore 8 places dispo. #homestaging #atelier #lausanne",
    media: [clip(13)], type: "post", likes: 234, location: "Lausanne, Suisse",
    createdAt: hAgo(72),
    comments: mkComments("p13", [
      { author: U_AMINA, content: "Claire est incroyable, tu vas voir 👌", h: 70, likes: 9 },
    ]),
  },
  {
    id: "p14", author: U_YASMIN,
    content: "Nouveau lancement Dubai Marina 🏝️\n\n1 chambre à partir de 480 000 AED, livraison 2027, plan de paiement 60/40. Mes clients européens prennent leur place avant l'official launch — les meilleures vues partent en 48h. #dubai #investissement #neuf",
    media: [clip(14)], type: "post", likes: 1789, location: "Dubaï, Émirats arabes unis",
    createdAt: hAgo(80),
    comments: mkComments("p14", [
      { author: U_MARC, content: "Le 60/40, c'est devenu standard ? Je vois ça partout.", h: 78, likes: 16 },
      { author: U_YASMIN, content: "@marc oui, c'est devenu le standard sur les off-plans depuis 2025.", h: 76, likes: 22 },
      { author: U_LEO, content: "Yasmin, tu es ma référence Dubaï. Continue 🚀", h: 72, likes: 41 },
    ]),
    property: mkProp({
      id: "prop4", title: "Studio Dubai Marina · Off-plan 2027",
      type: "studio", transactionType: "vente", price: 480_000, currency: "AED",
      bedrooms: 1, bathrooms: 1, area: 52, host: U_YASMIN,
      location: { city: "Dubaï", country: "Émirats arabes unis" },
      images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400"],
      analytics: { rendementBrut: 8.2, rendementNet: 6.8, prixM2: 9230, dpe: "A", etatGeneral: "Neuf", anneeConstruction: 2027, potentielPlusValue: 30, roi5ans: 42, roi10ans: 95, tauxOccupation: 91 },
    }),
  },
  {
    id: "p15", author: U_MARC,
    content: "Networking investisseurs romands — Montreux 🏔️\n\nLa dernière édition a généré 3 deals à 7 chiffres. Je serai sur place le 5 avril, venez checker. Format : drinks → pitch → matchmaking. #networking #investisseurs #montreux",
    media: [clip(15)], type: "post", likes: 412, location: "Montreux, Suisse",
    createdAt: hAgo(88),
    comments: mkComments("p15", [
      { author: U_THOMAS, content: "J'y serai avec deux projets en pré-commercialisation.", h: 86, likes: 11 },
    ]),
  },
  {
    id: "p16", author: U_AMIRA,
    content: "Cinéma dans ce riad du XVIIIe siècle restauré 🎬\n\nMosaïques originales, plafonds de cèdre sculpté, source dans le patio. À vendre, hors marché. Investisseurs passion → DM. #riad #patrimoine #marrakech",
    media: [clip(16)], type: "post", likes: 1023, location: "Marrakech, Maroc",
    createdAt: hAgo(96),
    comments: mkComments("p16", [
      { author: U_SOPHIE, content: "Le plus beau riad que j'ai vu cette année 😍", h: 94, likes: 24 },
      { author: U_LEO, content: "Patrimoine pur. Bravo Amira.", h: 92, likes: 31 },
    ]),
    property: mkProp({
      id: "prop12", title: "Riad XVIIIe siècle · Patrimoine",
      type: "riad", transactionType: "vente", price: 520_000, currency: "EUR",
      bedrooms: 5, bathrooms: 4, area: 280, host: U_AMIRA,
      location: { city: "Marrakech", country: "Maroc" },
      images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400"],
      analytics: { rendementBrut: 7.8, rendementNet: 5.9, prixM2: 1857, dpe: "C", etatGeneral: "Restauré", anneeConstruction: 1780, potentielPlusValue: 18, roi5ans: 38, roi10ans: 85, tauxOccupation: 82 },
    }),
  },
  {
    id: "p17", author: U_LEO,
    content: "Ma formation \"Investissement immobilier : de 0 à expert\" a déjà accompagné 342 personnes 🎓\n\nDe la première analyse au closing notarial, tout est cadré. Module 1 gratuit en commentaire si tu débutes. #formation #investissement #zeroaexpert",
    media: [clip(17)], type: "post", likes: 1875, location: "Genève, Suisse",
    createdAt: hAgo(104),
    comments: mkComments("p17", [
      { author: U_SOPHIE, content: "C'est la formation qui m'a fait basculer dans le métier. Merci.", h: 102, likes: 56 },
      { author: U_MARC, content: "Référence absolue. Je l'envoie à tous mes débutants.", h: 100, likes: 38 },
      { author: U_AMINA, content: "Module 1 svp ! 🙏", h: 98, likes: 14 },
    ]),
    formation: { id: "f1", title: "Investissement immobilier : de 0 à expert", instructor: "Léo Martin", price: 497, students: 342, thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop" },
  },
  {
    id: "p18", author: U_SOPHIE,
    content: "Coup de cœur cette semaine — chalet à Verbier 🏔️\n\n5 chambres, jacuzzi sous étoiles, ski-in/ski-out. Mon client veut louer 6 mois/an et habiter le reste. On planifie sa stratégie hybride. #verbier #chalet #montagne",
    media: [clip(18)], type: "post", likes: 467, location: "Verbier, Suisse",
    createdAt: hAgo(112),
    comments: mkComments("p18", [
      { author: U_THOMAS, content: "Verbier c'est le saint Graal de la location alpine. Bons revenus en perspective.", h: 110, likes: 17 },
    ]),
    property: mkProp({
      id: "prop6", title: "Chalet ski-in · Verbier",
      type: "chalet", transactionType: "vente", price: 3_200_000, currency: "CHF",
      bedrooms: 5, bathrooms: 4, area: 280, host: U_SOPHIE,
      location: { city: "Verbier", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"],
      analytics: { rendementBrut: 5.4, rendementNet: 3.9, prixM2: 11428, dpe: "B", etatGeneral: "Excellent", anneeConstruction: 2018, potentielPlusValue: 16, roi5ans: 32, roi10ans: 71, tauxOccupation: 78 },
    }),
  },
  {
    id: "p19", author: U_THOMAS,
    content: "Notre nouveau projet à Lugano repense l'éco-conception 🌱\n\nPanneaux solaires intégrés à la façade, géothermie, récupération d'eau de pluie. Performance énergétique A+. Bientôt en pré-vente, avant-premières privées en mai. #ecoresponsable #lugano #minergie",
    media: [clip(19)], type: "post", likes: 821, location: "Lugano, Suisse",
    createdAt: hAgo(120),
    comments: mkComments("p19", [
      { author: U_LEO, content: "C'est le futur de la promotion. Bravo Thomas.", h: 118, likes: 28 },
      { author: U_MARC, content: "Brochure disponible ?", h: 116, likes: 9 },
    ]),
    property: mkProp({
      id: "prop9", title: "Résidence A+ géothermie · Lugano",
      type: "appartement", transactionType: "vente", price: 1_180_000, currency: "CHF",
      bedrooms: 3, bathrooms: 2, area: 125, host: U_THOMAS,
      location: { city: "Lugano", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400"],
      analytics: { rendementBrut: 4.6, rendementNet: 3.5, prixM2: 9440, dpe: "A", etatGeneral: "Neuf", anneeConstruction: 2026, potentielPlusValue: 22, roi5ans: 30, roi10ans: 68, tauxOccupation: 94 },
    }),
  },
  {
    id: "p20", author: U_AMINA,
    content: "30 secondes pour comprendre pourquoi tes annonces ne convertissent pas ⚡\n\nSpoiler : c'est la première photo. Toujours. Si elle est sombre ou floue, tu perds 60 % des regards. #astuce #marketing #airbnb",
    media: [clip(20)], type: "post", likes: 1340, location: "Marrakech, Maroc",
    createdAt: hAgo(128),
    comments: mkComments("p20", [
      { author: U_SOPHIE, content: "Tellement vrai. J'ai refait mes 12 covers ce mois-ci, +24 % de bookings.", h: 126, likes: 41 },
      { author: U_AMIRA, content: "Confirmation totale 👌", h: 124, likes: 15 },
    ]),
  },
  {
    id: "p21", author: U_MARC,
    content: "Formation live le 20 mars — fiscalité immobilière en Suisse 📚\n\nOptimisation légale, impôts sur la fortune, gain en capital, structures holding. Pour investisseurs sérieux uniquement. Tarif early bird jusqu'à dimanche. #fiscalite #formation #live",
    media: [clip(21)], type: "post", likes: 532, location: "En ligne",
    createdAt: hAgo(136),
    comments: mkComments("p21", [
      { author: U_THOMAS, content: "Inscrit. Très attendu, surtout la partie holding.", h: 134, likes: 18 },
    ]),
  },
  {
    id: "p22", author: U_YASMIN,
    content: "Vue aérienne du quartier où je viens de boucler un deal 🛸\n\nDowntown Dubai, 200 m du Burj Khalifa. Vente sous 9 jours, +18 % au-dessus de la mise à prix. Quand le réseau parle, ça va vite. #dubai #downtown #deal",
    media: [clip(22)], type: "post", likes: 2456, location: "Dubaï, Émirats arabes unis",
    createdAt: hAgo(144),
    comments: mkComments("p22", [
      { author: U_LEO, content: "Performance hallucinante. La méthode Al Falasi 🔥", h: 142, likes: 87 },
      { author: U_MARC, content: "+18 % en 9 jours, ça se challenge sérieusement. Bravo.", h: 140, likes: 42 },
      { author: U_AMIRA, content: "Yasmin, on parle Marrakech bientôt ?", h: 138, likes: 19 },
    ]),
    property: mkProp({
      id: "prop8", title: "Appartement Downtown · Vue Burj",
      type: "appartement", transactionType: "vente", price: 2_100_000, currency: "AED",
      bedrooms: 2, bathrooms: 2, area: 98, host: U_YASMIN,
      location: { city: "Dubaï", country: "Émirats arabes unis" },
      images: ["https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400"],
      analytics: { rendementBrut: 7.1, rendementNet: 5.8, prixM2: 21428, dpe: "A", etatGeneral: "Excellent", anneeConstruction: 2022, potentielPlusValue: 28, roi5ans: 40, roi10ans: 92, tauxOccupation: 96 },
    }),
  },
  {
    id: "p23", author: U_SOPHIE,
    content: "Témoignage d'un de mes locataires longue durée 💬\n\nIl repart après 3 ans, hôte heureuse. Communication régulière + entretien sérieux = locataires qui restent. Mon meilleur ROI, c'est la confiance. #temoignage #locationlongue #relation",
    media: [clip(23)], type: "post", likes: 654, location: "Lausanne, Suisse",
    createdAt: hAgo(152),
    comments: mkComments("p23", [
      { author: U_AMINA, content: "C'est exactement ce que j'enseigne. Le service > le tarif.", h: 150, likes: 28 },
    ]),
  },
  {
    id: "p24", author: U_LEO,
    content: "Conférence \"Marché immobilier 2026\" à l'EPFL le 10 mars 🎤\n\nGratuit, sur inscription. Je présente nos data internes E-Dome — les chiffres que personne d'autre n'a sur les volumes et la rotation du marché romand. #conference #epfl #marche",
    media: [clip(24)], type: "post", likes: 1102, location: "Lausanne, Suisse",
    createdAt: hAgo(160),
    comments: mkComments("p24", [
      { author: U_MARC, content: "Je serai au premier rang. Toujours un plaisir.", h: 158, likes: 31 },
      { author: U_THOMAS, content: "Les data E-Dome valent leur pesant d'or. Hâte.", h: 156, likes: 24 },
    ]),
  },
  {
    id: "p25", author: U_AMIRA,
    content: "Coucher de soleil sur les remparts 🌇\n\nMarrakech n'est pas seulement un investissement, c'est un mode de vie. Si tu n'as pas encore visité, c'est l'année. #marrakech #medina #coucherdesoleil",
    media: [clip(25)], type: "post", likes: 1567, location: "Marrakech, Maroc",
    createdAt: hAgo(168),
    comments: mkComments("p25", [
      { author: U_SOPHIE, content: "Je réserve mes billets dès demain 😍", h: 166, likes: 22 },
      { author: U_LEO, content: "Une des plus belles villes du monde. Confirmé.", h: 164, likes: 35 },
    ]),
  },
  {
    id: "p26", author: U_THOMAS,
    content: "Survol drone d'un projet alpin en cours 🚁\n\n12 chalets en bois local, certifiés Minergie-P, prix de départ 1.2 M CHF. Pré-réservations ouvertes en mai. Vue plein sud, accès ski direct. #chalet #alpes #ecoresponsable",
    media: [clip(26)], type: "post", likes: 743, location: "Crans-Montana, Suisse",
    createdAt: hAgo(176),
    comments: mkComments("p26", [
      { author: U_SOPHIE, content: "Crans-Montana en plein boom. Excellent placement.", h: 174, likes: 18 },
    ]),
    property: mkProp({
      id: "prop13", title: "Chalet Minergie-P · Crans-Montana",
      type: "chalet", transactionType: "vente", price: 1_200_000, currency: "CHF",
      bedrooms: 4, bathrooms: 3, area: 165, host: U_THOMAS,
      location: { city: "Crans-Montana", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400"],
      analytics: { rendementBrut: 5.1, rendementNet: 3.7, prixM2: 7272, dpe: "A", etatGeneral: "Neuf", anneeConstruction: 2026, potentielPlusValue: 20, roi5ans: 31, roi10ans: 69, tauxOccupation: 81 },
    }),
  },
  {
    id: "p27", author: U_AMINA,
    content: "Nouveau module dans \"Marketing digital immobilier\" 📲\n\nInstagram Reels qui convertissent — les leads ne viennent plus des portails, ils viennent du contenu. Inscriptions ouvertes jusqu'au 30 mai. #marketing #reels #formation",
    media: [clip(27)], type: "post", likes: 1289, location: "Marrakech, Maroc",
    createdAt: hAgo(184),
    comments: mkComments("p27", [
      { author: U_SOPHIE, content: "Mes reels ont fait x3 depuis cette formation. Incontournable.", h: 182, likes: 47 },
      { author: U_AMIRA, content: "Format imparable 2026, à ne pas rater.", h: 180, likes: 22 },
    ]),
    formation: { id: "f3", title: "Marketing digital immobilier", instructor: "Claire Bernard", price: 149, students: 670, thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" },
  },
];

// Custom CTA (apporteurs / recherche / profil) par id de post
type CustomCTA = { href: string; title: string; subtitle: string; icon: "users" | "search" | "user" | "calendar" };
const CUSTOM_CTA: Record<string, CustomCTA> = {
  p6: { href: "/apporteurs", title: "Rejoindre le réseau d'apporteurs", subtitle: "Accès aux deals off-market", icon: "users" },
  p11: { href: "/recherche?q=marrakech", title: "Explorer Marrakech", subtitle: "Biens disponibles dans la médina", icon: "search" },
  p23: { href: "/profil/u1", title: "Voir le profil de Sophie", subtitle: "Hôte Lausanne · 4.8 ★ · 89 avis", icon: "user" },
  p25: { href: "/recherche?q=marrakech", title: "Découvrir le Maroc", subtitle: "Riads & investissements patrimoine", icon: "search" },
};

// Events (lookup par id de post)
type EventCTA = { id: string; titre: string; type: string; date: string; heure: string; lieu: string; prix: number; thumbnail: string };
const EVENTS_BY_POST: Record<string, EventCTA> = {
  p9: { id: "e1", titre: "Salon de l'immobilier Suisse 2026", type: "Conférence", date: "2026-05-15", heure: "09:00", lieu: "Palexpo, Genève", prix: 45, thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
  p12: { id: "e2", titre: "Webinaire : Optimiser son rendement locatif", type: "Webinaire", date: "2026-04-20", heure: "18:00", lieu: "En ligne", prix: 0, thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop" },
  p13: { id: "e3", titre: "Atelier : Home staging pratique", type: "Atelier", date: "2026-04-10", heure: "14:00", lieu: "Lausanne, Centre Flon", prix: 89, thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
  p15: { id: "e4", titre: "Networking investisseurs romands", type: "Networking", date: "2026-04-05", heure: "19:00", lieu: "Hôtel Royal, Montreux", prix: 35, thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
  p21: { id: "e5", titre: "Formation live : Fiscalité immobilière", type: "Formation live", date: "2026-03-20", heure: "10:00", lieu: "En ligne", prix: 120, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
  p24: { id: "e6", titre: "Conférence : Marché immobilier 2026", type: "Conférence", date: "2026-03-10", heure: "17:00", lieu: "EPFL, Lausanne", prix: 0, thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop" },
};

// ─── Misc ──────────────────────────────────────────────────────────────────

const TRENDING_HASHTAGS = [
  { tag: "#immobilier", count: 12400 },
  { tag: "#investissement", count: 8900 },
  { tag: "#luxe", count: 7200 },
  { tag: "#dubai", count: 5800 },
  { tag: "#marrakech", count: 4300 },
];

const FONDATEUR_NUMBERS: Record<string, number> = { "Léo": 1, "Sophie": 2, "Marc": 3, "Amira": 4, "Thomas": 5 };
const CURRENT_USER_ID = "u1";
const formatEventDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" });

// ─── Inline video player ───────────────────────────────────────────────────

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          vid.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          vid.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.5, 0.75] }
    );
    obs.observe(vid);
    return () => obs.disconnect();
  }, []);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative aspect-video bg-black overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100);
        }}
      />
      {/* Mute toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors z-10"
        aria-label={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
        <div className="h-full bg-[#1e9df1] transition-all" style={{ width: `${progress}%` }} />
      </div>
      {/* Play overlay when paused */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
          aria-label="Lire la vidéo"
        >
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/20">
            <Play className="w-7 h-7 text-white fill-white" />
          </div>
        </button>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function FeedPage() {
  const { formatPrice, toggleFollow, isFollowing } = useApp();
  const [posts, setPosts] = useState<SocialPost[]>(VIDEO_POSTS);
  const [activeTab, setActiveTab] = useState<"pour-vous" | "suivis">("pour-vous");

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyTo, setReplyTo] = useState<Record<string, string>>({});
  const [shareMenuPost, setShareMenuPost] = useState<string | null>(null);
  const [moreMenuPost, setMoreMenuPost] = useState<string | null>(null);
  const [feedToast, setFeedToast] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLike = (postId: string) => {
    const wasLiked = likedPosts.has(postId);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + (wasLiked ? -1 : 1) } : p
      )
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `c-new-${Date.now()}`,
      author: U_SOPHIE,
      content: replyTo[postId] ? `@${replyTo[postId]} ${text}` : text,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setReplyTo((prev) => {
      const next = { ...prev };
      delete next[postId];
      return next;
    });
    setExpandedComments((prev) => new Set([...prev, postId]));
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setMoreMenuPost(null);
  };

  const saveEdit = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: editContent } : p))
    );
    setEditingPost(null);
    setEditContent("");
  };

  const filteredPosts = useMemo(() => {
    if (activeTab === "suivis") return posts.filter((p) => isFollowing(p.author.id));
    return posts;
  }, [posts, activeTab, isFollowing]);

  const renderContent = (content: string) => {
    return content.split(/([@#]\S+)/g).map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="text-[#1e9df1] cursor-pointer hover:underline">
            {part}
          </span>
        );
      }
      if (part.startsWith("#")) {
        return (
          <Link key={i} href={`/recherche?q=${encodeURIComponent(part)}`} className="text-[#1e9df1] hover:underline">
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  const ctaIcon = (icon: CustomCTA["icon"]) => {
    const Icon = icon === "users" ? Users : icon === "search" ? Search : icon === "calendar" ? Calendar : UserIcon;
    return <Icon className="w-5 h-5 text-[#1e9df1]" />;
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      {feedToast && (
        <div className="fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-medium shadow-lg animate-fade-in">
          ✓ {feedToast}
        </div>
      )}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {/* Feed tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
            {(["pour-vous", "suivis"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#1e9df1] text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab === "pour-vous" ? "Pour vous" : "Suivis"}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--text-secondary)]">
                  {activeTab === "suivis"
                    ? "Vous n'êtes abonné à personne pour le moment. Abonnez-vous à des utilisateurs pour voir leurs publications ici."
                    : "Aucune publication à afficher."}
                </p>
              </div>
            )}

            {filteredPosts.map((post, idx) => {
              const customCta = CUSTOM_CTA[post.id];
              const eventCta = EVENTS_BY_POST[post.id];
              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-[#1e9df1]/10 bg-[var(--card)] shadow-xl shadow-black/10 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Post header */}
                  <div className="flex items-start justify-between p-5 pb-0">
                    <div className="flex items-center gap-3">
                      <Link href={`/profil/${post.author.id}`}>
                        <img
                          src={post.author.avatar}
                          alt={post.author.firstName}
                          className="w-11 h-11 rounded-full object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <Link
                            href={`/profil/${post.author.id}`}
                            className="text-sm font-semibold text-[var(--foreground)] hover:underline"
                          >
                            {post.author.firstName} {post.author.lastName}
                          </Link>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              roleBadgeColors[post.author.activeRole]
                            }`}
                          >
                            {roleLabels[post.author.activeRole]}
                          </span>
                          {FONDATEUR_NUMBERS[post.author.firstName] && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold tracking-wide bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30">
                              #{FONDATEUR_NUMBERS[post.author.firstName]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <span className="opacity-80">@{post.author.firstName.toLowerCase()}</span>
                          {post.location && (
                            <>
                              <span>·</span>
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">{post.location}</span>
                            </>
                          )}
                          <span>·</span>
                          <span>{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMoreMenuPost(moreMenuPost === post.id ? null : post.id)}
                        className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      {moreMenuPost === post.id && (
                        <div className="absolute right-0 top-10 w-48 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden">
                          {post.author.id === CURRENT_USER_ID ? (
                            <>
                              <button
                                onClick={() => {
                                  setEditingPost(post.id);
                                  setEditContent(post.content);
                                  setMoreMenuPost(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                              >
                                <Edit3 className="w-4 h-4" /> Modifier
                              </button>
                              <button
                                onClick={() => deletePost(post.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[var(--hover-bg)] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Supprimer
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setMoreMenuPost(null);
                                  setFeedToast("Publication signalée");
                                  setTimeout(() => setFeedToast(null), 2500);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                              >
                                <Flag className="w-4 h-4" /> Signaler
                              </button>
                              <button
                                onClick={() => setMoreMenuPost(null)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                              >
                                <EyeOff className="w-4 h-4" /> Ne plus afficher
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post content */}
                  <div className="px-5 pt-3 pb-1">
                    {editingPost === post.id ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          maxLength={2000}
                          rows={4}
                          className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-sm text-[var(--foreground)] outline-none resize-none focus:border-[#1e9df1]"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveEdit(post.id)}
                            className="px-4 py-2 rounded-lg bg-[#1e9df1] hover:bg-[#1583c9] text-white text-sm font-medium transition-colors"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={() => setEditingPost(null)}
                            className="px-4 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[15px] text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                        {renderContent(post.content)}
                      </p>
                    )}
                  </div>

                  {/* Video */}
                  {post.media.length > 0 && (
                    <div className="mx-5 mt-3 rounded-2xl overflow-hidden">
                      <VideoPlayer src={post.media[0]} />
                    </div>
                  )}

                  {/* Property CTA */}
                  {post.property && (
                    <div className="mx-5 mt-3 rounded-2xl border border-[var(--card-border)] overflow-hidden hover:border-[#1e9df1]/30 transition-colors">
                      <Link href={`/explorer/${post.property.id}`} className="flex gap-3 p-3">
                        <img
                          src={post.property.images[0]}
                          alt=""
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] truncate">
                            {post.property.title}
                          </p>
                          <p className="text-sm font-bold text-[#1e9df1] mt-1 tabular-nums">
                            {formatPrice(post.property.price, post.property.currency)}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {post.property.bedrooms} ch · {post.property.area}m²
                          </p>
                          {post.property.transactionType === "vente" && post.property.analytics && (
                            <p className="text-xs text-emerald-400 mt-1 tabular-nums">
                              Rendement : {post.property.analytics.rendementBrut.toFixed(1)} % brut
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Formation CTA */}
                  {post.formation && (
                    <div className="mx-5 mt-3 rounded-2xl border border-[var(--card-border)] overflow-hidden hover:border-[#1e9df1]/30 transition-colors">
                      <Link href={`/formations/${post.formation.id}`} className="flex gap-3 p-3">
                        <img
                          src={post.formation.thumbnail}
                          alt=""
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-[#1e9df1]/20 text-[#1e9df1] text-[10px] font-medium rounded-full">Formation</span>
                          </div>
                          <p className="text-sm font-medium text-[var(--foreground)] truncate">
                            {post.formation.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {post.formation.instructor} · {post.formation.students} étudiants
                          </p>
                          <p className="text-sm font-bold text-[#1e9df1] mt-1 tabular-nums">
                            {formatPrice(post.formation.price)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Event CTA */}
                  {eventCta && (
                    <div className="mx-5 mt-3 rounded-2xl border border-[var(--card-border)] overflow-hidden hover:border-[#1e9df1]/30 transition-colors">
                      <Link href={`/evenements/${eventCta.id}`} className="flex gap-3 p-3">
                        <img
                          src={eventCta.thumbnail}
                          alt=""
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-[10px] font-medium rounded-full">Événement · {eventCta.type}</span>
                          </div>
                          <p className="text-sm font-medium text-[var(--foreground)] truncate">
                            {eventCta.titre}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatEventDate(eventCta.date)} · {eventCta.heure} · {eventCta.lieu}
                          </p>
                          <p className="text-sm font-bold text-[#1e9df1] mt-1 tabular-nums">
                            {eventCta.prix === 0 ? "Gratuit" : formatPrice(eventCta.prix)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Custom CTA */}
                  {customCta && (
                    <div className="mx-5 mt-3 rounded-2xl border border-[var(--card-border)] overflow-hidden hover:border-[#1e9df1]/30 transition-colors">
                      <Link href={customCta.href} className="flex items-center gap-3 p-3">
                        <div className="w-12 h-12 rounded-xl bg-[#1e9df1]/10 flex items-center justify-center shrink-0">
                          {ctaIcon(customCta.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] truncate">
                            {customCta.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                            {customCta.subtitle}
                          </p>
                        </div>
                        <span className="text-xs text-[#1e9df1] font-medium">Découvrir →</span>
                      </Link>
                    </div>
                  )}

                  {/* Engagement bar */}
                  <div className="mt-4 flex items-center gap-1 px-3 py-2 border-t border-[var(--card-border)]">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          likedPosts.has(post.id) ? "fill-rose-500 text-rose-500" : "text-[var(--text-muted)]"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium tabular-nums max-sm:hidden ${
                          likedPosts.has(post.id) ? "text-rose-500" : "text-[var(--foreground)]/85"
                        }`}
                      >
                        {formatCount(post.likes)}
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedComments((prev) => {
                          const next = new Set(prev);
                          if (next.has(post.id)) next.delete(post.id);
                          else next.add(post.id);
                          return next;
                        })
                      }
                      className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                    >
                      <MessageCircle
                        className={`w-5 h-5 transition-colors ${
                          expandedComments.has(post.id) ? "text-[#1e9df1]" : "text-[var(--text-muted)]"
                        }`}
                      />
                      <span className="text-sm font-medium tabular-nums max-sm:hidden text-[var(--foreground)]/85">
                        {formatCount(post.comments.length)}
                      </span>
                    </button>

                    <div className="relative grow flex">
                      <button
                        onClick={() => setShareMenuPost(shareMenuPost === post.id ? null : post.id)}
                        className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                      >
                        <Share2 className="w-5 h-5 text-[var(--text-muted)]" />
                        <span className="text-sm font-medium max-sm:hidden text-[var(--foreground)]/85">
                          Partager
                        </span>
                      </button>
                      {shareMenuPost === post.id && (
                        <div className="absolute left-0 bottom-12 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden">
                          {[
                            { label: "Republier", icon: Share2 },
                            { label: "Email", icon: Send },
                            { label: "Copier le lien", icon: Copy },
                          ].map(({ label, icon: Icon }) => (
                            <button
                              key={label}
                              onClick={() => {
                                setShareMenuPost(null);
                                setFeedToast(label === "Copier le lien" ? "Lien copié" : `${label} envoyé`);
                                setTimeout(() => setFeedToast(null), 2500);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleSave(post.id)}
                      className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                    >
                      <Bookmark
                        className={`w-5 h-5 transition-colors ${
                          savedPosts.has(post.id) ? "fill-[#1e9df1] text-[#1e9df1]" : "text-[var(--text-muted)]"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium max-sm:hidden ${
                          savedPosts.has(post.id) ? "text-[#1e9df1]" : "text-[var(--foreground)]/85"
                        }`}
                      >
                        {savedPosts.has(post.id) ? "Enregistré" : "Enregistrer"}
                      </span>
                    </button>
                  </div>

                  {/* Comments */}
                  {expandedComments.has(post.id) && (
                    <div className="px-4 pb-4 border-t border-[var(--card-border)] animate-fade-in">
                      <div className="space-y-3 pt-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2.5">
                            <img
                              src={comment.author.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/profil/${comment.author.id}`}
                                  className="text-xs font-semibold text-[var(--foreground)] hover:underline"
                                >
                                  {comment.author.firstName}
                                </Link>
                                <span className="text-xs text-[var(--text-muted)]">
                                  {timeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                {renderContent(comment.content)}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <button className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)]">
                                  {comment.likes > 0 && `${comment.likes} `}J&apos;aime
                                </button>
                                <button
                                  onClick={() =>
                                    setReplyTo((prev) => ({
                                      ...prev,
                                      [post.id]: comment.author.firstName,
                                    }))
                                  }
                                  className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)]"
                                >
                                  Répondre
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--card-border)]">
                        <img
                          src={U_SOPHIE.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 relative">
                          {replyTo[post.id] && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs text-[#1e9df1]">
                                @{replyTo[post.id]}
                              </span>
                              <button
                                onClick={() =>
                                  setReplyTo((prev) => {
                                    const next = { ...prev };
                                    delete next[post.id];
                                    return next;
                                  })
                                }
                                className="text-[var(--text-muted)]"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                              placeholder="Écrire un commentaire..."
                              className="flex-1 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#1e9df1]"
                            />
                            <button
                              onClick={() => addComment(post.id)}
                              className="p-2 rounded-lg bg-[#1e9df1] text-white hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-40"
                              disabled={!commentInputs[post.id]?.trim()}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* End of feed */}
          {filteredPosts.length > 0 && (
            <div className="py-10 text-center text-xs text-[var(--text-muted)]">
              Vous avez parcouru tout le feed — {filteredPosts.length} publications.
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-5">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#1e9df1]" />
                Suggestions
              </h3>
              <Link href="/recherche" className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[#1e9df1] transition-colors">
                Voir tout
              </Link>
            </div>
            <div className="space-y-3">
              {ALL_USERS.filter((u) => u.id !== "u1").slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Link href={`/profil/${user.id}`}>
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profil/${user.id}`}
                      className="text-sm font-medium text-[var(--foreground)] hover:underline truncate block"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {roleLabels[user.activeRole]}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                      isFollowing(user.id)
                        ? "bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                        : "bg-[#1e9df1] text-white hover:bg-[#1583c9]"
                    }`}
                  >
                    {isFollowing(user.id) ? "Suivi" : "Suivre"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1e9df1]" />
              Tendances
            </h3>
            <div className="space-y-3">
              {TRENDING_HASHTAGS.slice(0, 5).map((item) => (
                <Link
                  key={item.tag}
                  href={`/recherche?q=${encodeURIComponent(item.tag)}`}
                  className="flex items-center justify-between group"
                >
                  <span className="text-sm text-[#1e9df1] group-hover:underline">{item.tag}</span>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">{formatCount(item.count)}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 md:bottom-8 right-6 z-30 w-10 h-10 rounded-full bg-[#1e9df1] text-white flex items-center justify-center shadow-lg hover:bg-[var(--gold-hover)] transition-colors animate-scale-in"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
