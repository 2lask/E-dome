"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Repeat2, Eye,
  MapPin, X, ChevronRight, Play, Check,
  Edit3, Trash2, Flag, EyeOff, Copy,
  Volume2, VolumeX, Calendar, Search, User as UserIcon,
  Users, Building2, GraduationCap,
  Image as ImageIcon, BarChart3, Film, Paperclip, TrendingUp, TrendingDown, ArrowRight,
} from "lucide-react";
import { roleLabels } from "@/lib/types";
import { useApp } from "@/lib/context";
import { timeAgo, formatCount, formatDate } from "@/lib/utils";
import { properties as ALL_PROPERTIES, formations as ALL_FORMATIONS } from "@/lib/mock-data";
import { getVideoMetadata } from "@/lib/video-metadata";
import type {
  User, SocialPost, Comment, Property, AnalyticsMetric, AnalyticsCardData,
  PostAttachment,
} from "@/lib/types";
import { DiscoverHub } from "@/components/layout/discover-hub";

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
    content: "Bienvenue sur E-Dome\n\nLa plateforme qui réunit hôtes, investisseurs, apporteurs et formateurs autour de l'immobilier — sans intermédiaire. Trois mois de bêta, +4 500 inscrits, on accélère.\n\nMerci à toute la communauté qui construit ça avec nous. #immobilier #suisse #startup",
    media: [clip(1)], type: "post", likes: 4521, location: "Genève, Suisse",
    createdAt: hAgo(2),
    comments: mkComments("p1", [
      { author: U_SOPHIE, content: "Tellement fier de faire partie de l'aventure depuis le jour 1", h: 1.5, likes: 84 },
      { author: U_MARC, content: "La meilleure plateforme pour les investisseurs sérieux. On continue.", h: 1, likes: 56 },
      { author: U_AMIRA, content: "Bravo @léo, le Maroc te remercie", h: 0.5, likes: 42 },
    ]),
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
    content: "Riad d'exception au cœur de la médina\n\n200 m², patio central, hammam privé, 4 suites. Rendement locatif courte durée : 9.5 % brut. Une perle rare — déjà 12 demandes de visite. #marrakech #riad #investissement",
    media: [clip(3)], type: "post", likes: 845, location: "Marrakech, Maroc",
    createdAt: hAgo(8),
    comments: mkComments("p3", [
      { author: U_MARC, content: "Marrakech affiche des rendements imbattables en ce moment. À surveiller", h: 6, likes: 32 },
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
    content: "Le marché suisse romand sur 5 ans : +37 % en moyenne sur les biens premium\n\nMa formation \"Analyse financière pour investisseurs\" passe au crible chaque ratio : rendement brut/net, ROI, TIR, LTV. Inscriptions ouvertes — les places partent vite. #investissement #formation",
    media: [clip(4)], type: "post", likes: 1240, location: "Genève, Suisse",
    createdAt: hAgo(12),
    comments: mkComments("p4", [
      { author: U_LEO, content: "La meilleure formation de la plateforme. Sérieux et rigoureux.", h: 10, likes: 67 },
      { author: U_SOPHIE, content: "Inscrite à la prochaine session, hâte", h: 8, likes: 12 },
    ]),
    formation: { id: "f5", title: "Analyse financière pour investisseurs", instructor: "Marc Dubois", price: 349, students: 420, thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop" },
  },
  {
    id: "p5", author: U_THOMAS,
    content: "Premier coup d'œil sur notre nouveau projet — Zurich Nord\n\n28 logements certifiés Minergie-P, livraison Q3 2026, vue dégagée sur le Limmat. Réservez votre visite privée avant l'ouverture officielle. #promotion #zurich #minergie",
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
    formation: { id: "f2", title: "Gestion locative avancée", instructor: "Amina El Idrissi", price: 199, students: 890, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
  },
  {
    id: "p8", author: U_AMINA,
    content: "Nouveau module dans \"Gestion locative avancée\"\n\nPricing dynamique avec automatisation Beyond Pricing + PriceLabs. Mes étudiants augmentent leurs revenus de 30 à 40 % en moyenne. Inscriptions sur le profil. #gestionlocative #formation #automatisation",
    media: [clip(8)], type: "post", likes: 1567, location: "Marrakech, Maroc",
    createdAt: hAgo(32),
    comments: mkComments("p8", [
      { author: U_SOPHIE, content: "J'attendais ce module module commandé.", h: 30, likes: 19 },
      { author: U_THOMAS, content: "Tu peux automatiser ça aussi sur les long-séjours ?", h: 28, likes: 8 },
      { author: U_AMIRA, content: "Référence dans le métier. Merci Amina.", h: 26, likes: 22 },
    ]),
    formation: { id: "f2", title: "Gestion locative avancée", instructor: "Amina El Idrissi", price: 199, students: 890, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
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
    content: "Ma formation \"Investissement immobilier : de 0 à expert\" a déjà accompagné 342 personnes\n\nDe la première analyse au closing notarial, tout est cadré. Module 1 gratuit en commentaire si tu débutes. #formation #investissement #zeroaexpert",
    media: [clip(17)], type: "post", likes: 1875, location: "Genève, Suisse",
    createdAt: hAgo(104),
    comments: mkComments("p17", [
      { author: U_SOPHIE, content: "C'est la formation qui m'a fait basculer dans le métier. Merci.", h: 102, likes: 56 },
      { author: U_MARC, content: "Référence absolue. Je l'envoie à tous mes débutants.", h: 100, likes: 38 },
      { author: U_AMINA, content: "Module 1 svp !", h: 98, likes: 14 },
    ]),
    formation: { id: "f1", title: "Investissement immobilier : de 0 à expert", instructor: "Léo Martin", price: 497, students: 342, thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop" },
  },
  {
    id: "p18", author: U_SOPHIE,
    content: "Coup de cœur cette semaine — chalet à Verbier\n\n5 chambres, jacuzzi sous étoiles, ski-in/ski-out. Mon client veut louer 6 mois/an et habiter le reste. On planifie sa stratégie hybride. #verbier #chalet #montagne",
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
    content: "Notre nouveau projet à Lugano repense l'éco-conception\n\nPanneaux solaires intégrés à la façade, géothermie, récupération d'eau de pluie. Performance énergétique A+. Bientôt en pré-vente, avant-premières privées en mai. #ecoresponsable #lugano #minergie",
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
    content: "Nouveau module dans \"Marketing digital immobilier\"\n\nInstagram Reels qui convertissent — les leads ne viennent plus des portails, ils viennent du contenu. Inscriptions ouvertes jusqu'au 30 mai. #marketing #reels #formation",
    media: [clip(27)], type: "post", likes: 1289, location: "Marrakech, Maroc",
    createdAt: hAgo(184),
    comments: mkComments("p27", [
      { author: U_SOPHIE, content: "Mes reels ont fait x3 depuis cette formation. Incontournable.", h: 182, likes: 47 },
      { author: U_AMIRA, content: "Format imparable 2026, à ne pas rater.", h: 180, likes: 22 },
    ]),
    formation: { id: "f3", title: "Marketing digital immobilier", instructor: "Claire Bernard", price: 149, students: 670, thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" },
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
    content: "Slide cle de ma nouvelle formation : comprendre le rendement net (apres charges, impots, vacance). C'est LA donnee qui separe les amateurs des serieux. #formation #investissement",
    media: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900"],
    type: "post", likes: 856, location: "Geneve, Suisse",
    createdAt: hAgo(18),
    comments: mkComments("p-photo-formation", [
      { author: U_SOPHIE, content: "Le passage du brut au net surprend toujours les nouveaux investisseurs.", h: 16, likes: 22 },
    ]),
    formation: { id: "f5", title: "Analyse financiere pour investisseurs", instructor: "Marc Dubois", price: 349, students: 420, thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop" },
  },
];

// CTAs custom par id de post.
type CustomCTA = { href: string; title: string; subtitle: string; icon: "users" | "search" | "user" | "calendar" };
const CUSTOM_CTA: Record<string, CustomCTA> = {
  p6: { href: "/apporteurs", title: "Rejoindre le réseau d'apporteurs", subtitle: "Accès aux deals off-market", icon: "users" },
  p11: { href: "/recherche?q=marrakech", title: "Explorer Marrakech", subtitle: "Biens disponibles dans la médina", icon: "search" },
  p23: { href: "/profil/u1", title: "Voir le profil de Sophie", subtitle: "Hôte Lausanne · 4.8/5 · 89 avis", icon: "user" },
  p25: { href: "/recherche?q=marrakech", title: "Découvrir le Maroc", subtitle: "Riads & investissements patrimoine", icon: "search" },
};

// Événements (lookup par id de post).
type EventCTA = { id: string; titre: string; type: string; date: string; heure: string; lieu: string; prix: number; thumbnail: string };
const EVENTS_BY_POST: Record<string, EventCTA> = {
  p9: { id: "e1", titre: "Salon de l'immobilier Suisse 2026", type: "Conférence", date: "2026-05-15", heure: "09:00", lieu: "Palexpo, Genève", prix: 45, thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
  p12: { id: "e2", titre: "Webinaire : Optimiser son rendement locatif", type: "Webinaire", date: "2026-04-20", heure: "18:00", lieu: "En ligne", prix: 0, thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop" },
  p13: { id: "e3", titre: "Atelier : Home staging pratique", type: "Atelier", date: "2026-04-10", heure: "14:00", lieu: "Lausanne, Centre Flon", prix: 89, thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
  p15: { id: "e4", titre: "Networking investisseurs romands", type: "Networking", date: "2026-04-05", heure: "19:00", lieu: "Hôtel Royal, Montreux", prix: 35, thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
  p21: { id: "e5", titre: "Formation live : Fiscalité immobilière", type: "Formation live", date: "2026-03-20", heure: "10:00", lieu: "En ligne", prix: 120, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
  p24: { id: "e6", titre: "Conférence : Marché immobilier 2026", type: "Conférence", date: "2026-03-10", heure: "17:00", lieu: "EPFL, Lausanne", prix: 0, thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop" },
};

const TRENDING_HASHTAGS = [
  { tag: "#immobilier", count: 12400 },
  { tag: "#investissement", count: 8900 },
  { tag: "#luxe", count: 7200 },
  { tag: "#dubai", count: 5800 },
  { tag: "#marrakech", count: 4300 },
];

const SUGGESTIONS = [U_LEO, U_AMIRA, U_THOMAS, U_YASMIN];

// ─── Misc ──────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "u1";
const CURRENT_USER = U_SOPHIE;
const formatEventDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" });

/* Parse @mentions et #hashtags en liens cliquables.
   Avant : les @mentions étaient des <span> non cliquables (cul-de-sac
   UX — clicable visuellement, sans action). Maintenant : les deux
   pointent vers /recherche?q=<token>. stopPropagation pour ne pas
   déclencher l'expand du texte ou la fermeture des menus du PostCard.
   Regex \p{L}\p{N}_ : lettres unicode + chiffres + underscore — supporte
   les accents (@léo) sans casser sur la ponctuation. */
function renderContent(content: string) {
  return content.split(/([@#][\p{L}\p{N}_]+)/gu).map((part, i) => {
    if (part.startsWith("@") || part.startsWith("#")) {
      return (
        <Link
          key={i}
          href={`/recherche?q=${encodeURIComponent(part)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[var(--primary)] hover:underline"
        >
          {part}
        </Link>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ─── Media (VideoPlayer / ImageView) ───────────────────────────────────────

type MediaProps = { src: string; muted: boolean; onToggleMute: () => void };

// Clamp inspiré Reels Instagram : on tolère des médias plus verticaux (0.6 ≈ 3:5
// portrait, équivalent à Reels Instagram en aspect le plus haut) sans pousser
// jusqu'au 9:16 pur, qui casserait le viewport. Max 1.5 (3:2 landscape doux).
// Combiné avec MEDIA_MAX_HEIGHT, garantit que la carte reste lisible en
// scroll Twitter sans qu'une vidéo monopolise tout l'écran.
const ASPECT_MIN = 0.6;
const ASPECT_MAX = 1.5;
const clampAspect = (r: number) => Math.max(ASPECT_MIN, Math.min(r, ASPECT_MAX));
const MEDIA_MAX_HEIGHT = "min(72svh, 620px)";

function VideoPlayer({ src, muted, onToggleMute }: MediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  /* Aspect ratio : on tente d'abord la map statique (VIDEO_RATIOS via
     getVideoMetadata) pour que le container ait le BON ratio des le 1er
     render, avant meme que la balise <video> soit montee. Sinon fallback
     9:16 (portrait) car 89% des clips du feed sont verticaux (Reels-like).
     onLoadedMetadata reste branche en filet de securite pour les URLs
     inconnues (blob: du composer, mocks futurs). */
  const initialAspect = useMemo(() => {
    const meta = getVideoMetadata(src);
    return clampAspect(meta ? meta.ratio : 9 / 16);
  }, [src]);
  const [aspectRatio, setAspectRatio] = useState<number>(initialAspect);
  /* mounted : controle le rendering DU <video> tag lui-meme. Tant que pas
     mounted, on affiche un poster sombre + bouton Play. Le <video> n'est
     mis dans le DOM qu'apres intersection (vrai lazy load).
     Vu que les MP4 font 1-16MB, on evite ainsi de monter 27 <video> tags
     simultanement (chaque tag charge metadata + premieres frames). */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          /* Mount le <video> tag pour la 1ere fois si necessaire. */
          if (!mounted) setMounted(true);
        }
        const v = videoRef.current;
        if (!v) return;
        if (entry.intersectionRatio >= 0.6) {
          v.play().then(() => setPaused(false)).catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.3, 0.5, 0.6, 0.8] }
    );
    obs.observe(c);
    return () => obs.disconnect();
  }, [mounted]);

  const togglePlay = () => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPaused(false)).catch(() => {});
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden"
      style={{ aspectRatio, maxHeight: MEDIA_MAX_HEIGHT }}
    >
      {/* Le <video> n'est rendu QUE quand mounted=true. Avant : poster noir. */}
      {mounted ? (
        <video
          ref={videoRef}
          src={src}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          autoPlay
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth > 0 && v.videoHeight > 0) {
              setAspectRatio(clampAspect(v.videoWidth / v.videoHeight));
            }
          }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100);
          }}
        />
      ) : (
        /* Poster : fond noir + Play discret. Aucun reseau utilise. */
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
          aria-label="Charger et lire la vidéo"
        >
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </button>
      )}
      {paused && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/25"
          aria-label="Lire la vidéo"
        >
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
            <Play className="w-7 h-7 text-white fill-white" />
          </div>
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center hover:bg-black/75 transition-colors z-10"
        aria-label={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15">
        <div className="h-full bg-[var(--primary)]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* BlurImage — image avec skeleton + blur-up + onLoad propre.
   Affiche un fond shimmer le temps du chargement, puis l'image
   apparaît avec un léger déflou. Combiné avec object-cover sur
   un container à aspect ratio fixe (tuile galerie). */
function BlurImage({
  src,
  alt = "",
  onLoad,
}: {
  src: string;
  alt?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`absolute inset-0 w-full h-full object-cover blur-up ${loaded ? "loaded" : ""}`}
      />
    </>
  );
}

function ImageView({ src }: { src: string }) {
  // Aspect ratio natif lu à onLoad, clampé identique aux vidéos.
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  return (
    <div
      className="relative bg-[var(--hover-bg)] rounded-2xl overflow-hidden"
      style={{ aspectRatio, maxHeight: MEDIA_MAX_HEIGHT }}
    >
      <BlurImage
        src={src}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setAspectRatio(clampAspect(img.naturalWidth / img.naturalHeight));
          }
        }}
      />
    </div>
  );
}

/* MediaGallery — rendu Twitter/X façon galerie selon la longueur :
   1 image : aspect ratio natif (ImageView).
   2 images : 2 colonnes 1:1.
   3 images : 1 grande à gauche (occupe les 2 lignes) + 2 petites à droite empilées.
   4 images : grille 2x2 carrée.
   ≥5 : limite à 4 visibles avec un overlay "+N" sur la dernière. */
function MediaGallery({ media }: { media: string[] }) {
  const n = Math.min(media.length, 4);
  const extra = media.length - 4;

  if (n === 1) return <ImageView src={media[0]} />;

  const tileCls = "relative overflow-hidden bg-[var(--hover-bg)]";

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {media.slice(0, 2).map((src, i) => (
          <div key={i} className={tileCls}>
            <BlurImage src={src} />
          </div>
        ))}
      </div>
    );
  }

  if (n === 3) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <div className={tileCls + " row-span-2"}>
          <BlurImage src={media[0]} />
        </div>
        <div className={tileCls}>
          <BlurImage src={media[1]} />
        </div>
        <div className={tileCls}>
          <BlurImage src={media[2]} />
        </div>
      </div>
    );
  }

  // n === 4
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-2xl overflow-hidden" style={{ aspectRatio: "1/1" }}>
      {media.slice(0, 4).map((src, i) => (
        <div key={i} className={tileCls}>
          <BlurImage src={src} />
          {i === 3 && extra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white text-2xl font-semibold">
              +{extra}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Légende avec ellipsis automatique + lien « Voir plus » en bleu (style Twitter)
// quand le texte est tronqué. Détecte le débordement via scrollHeight vs
// clientHeight (ref-based) après le rendu, recalcule à chaque changement
// de contenu et au resize.
function PostCaption({ content }: { content: string }) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const p = pRef.current;
    if (!p) return;
    const check = () => {
      // 2 px de tolérance pour les arrondis sub-pixel.
      setOverflowing(p.scrollHeight > p.clientHeight + 2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(p);
    return () => ro.disconnect();
  }, [content, expanded]);

  return (
    <>
      <p
        ref={pRef}
        className={`text-[14px] text-[var(--foreground)] whitespace-pre-wrap leading-relaxed ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {renderContent(content)}
      </p>
      {!expanded && overflowing && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
          className="text-[var(--primary)] text-sm font-medium hover:underline mt-1"
        >
          Voir plus
        </button>
      )}
      {expanded && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
          className="text-[var(--primary)] text-sm font-medium hover:underline mt-1"
        >
          Voir moins
        </button>
      )}
    </>
  );
}

// ─── Composer : helpers, data, sous-composants ────────────────────────────

interface ComposerActionProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
  badge?: boolean;
}

/* Bouton-icône du composer (Photo/Vidéo, Bien, Formation, Événement, Analyse).
   `badge` ajoute un point bleu pour marquer une action "premium" attachable. */
function ComposerAction({ icon: Icon, label, onClick, badge }: ComposerActionProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="relative w-10 h-10 flex items-center justify-center rounded-full text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
    >
      <Icon size={18} />
      {badge && (
        <span aria-hidden className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
      )}
    </button>
  );
}

/* ─── Événements disponibles pour attachement ───────────────────────────
   Liste curatée des prochains événements/webinaires E-Dome — sous-ensemble
   suffisant pour le picker. Reflète la copie de la page /evenements. */
interface ComposerEvent {
  id: string;
  titre: string;
  date: string;
  lieu: string;
  thumbnail: string;
  eventType: string;
  spotsRemaining?: number;
  prix?: number;
}

const EVENTS_AVAILABLE: ComposerEvent[] = [
  {
    id: "e1",
    titre: "Salon de l'immobilier Suisse 2026",
    date: "2026-05-15",
    lieu: "Palexpo, Genève",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    eventType: "Conférence",
    spotsRemaining: 127,
    prix: 45,
  },
  {
    id: "e2",
    titre: "Webinaire : Optimiser son rendement locatif",
    date: "2026-04-20",
    lieu: "En ligne",
    thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop",
    eventType: "Webinaire",
    spotsRemaining: 84,
    prix: 0,
  },
  {
    id: "e3",
    titre: "Atelier : Home staging pratique",
    date: "2026-04-10",
    lieu: "Lausanne, Centre Flon",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    eventType: "Atelier",
    spotsRemaining: 8,
    prix: 89,
  },
  {
    id: "e4",
    titre: "Networking investisseurs romands",
    date: "2026-04-05",
    lieu: "Hôtel Royal, Montreux",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    eventType: "Networking",
    spotsRemaining: 22,
    prix: 35,
  },
];

/* ─── Calcul de la card analytics ───────────────────────────────────────
   Génère un dataset déterministe (seedé sur l'id du bien) pour les
   métriques qui n'ont pas de série temporelle dans le mock. Évite tout
   `Math.random()` — sinon mismatch d'hydratation SSR/client. */
function computeAnalyticsCard(property: Property, metric: AnalyticsMetric): AnalyticsCardData {
  const seed =
    property.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + property.id.length;
  const seededRand = (i: number) => {
    const v = Math.abs(Math.sin(seed + i * 137)) * 10000;
    return v - Math.floor(v);
  };

  if (metric === "views7d") {
    const spark = Array.from({ length: 7 }, (_, i) => Math.round(80 + seededRand(i) * 240));
    const total = spark.reduce((a, b) => a + b, 0);
    const prevTotal = Math.round(total * (0.65 + seededRand(99) * 0.4));
    const delta = +(((total - prevTotal) / prevTotal) * 100).toFixed(1);
    return {
      propertyId: property.id,
      propertyTitle: property.title,
      metric,
      label: "Vues 7 derniers jours",
      headline: total.toLocaleString("fr-CH"),
      delta,
      sparkData: spark,
    };
  }

  if (metric === "rendementNet") {
    const val = property.analytics?.rendementNet ?? 3.2;
    return {
      propertyId: property.id,
      propertyTitle: property.title,
      metric,
      label: "Rendement net annuel",
      headline: `${val.toFixed(1)}%`,
    };
  }

  // occupation30d
  const base = property.analytics?.tauxOccupation ?? 75;
  const spark = Array.from({ length: 30 }, (_, i) =>
    Math.round(Math.min(100, Math.max(40, base + (seededRand(i) - 0.5) * 22))),
  );
  const first = spark[0] ?? base;
  const last = spark[spark.length - 1] ?? base;
  const delta = +(last - first).toFixed(1);
  return {
    propertyId: property.id,
    propertyTitle: property.title,
    metric,
    label: "Taux d'occupation 30j",
    headline: `${last}%`,
    delta,
    sparkData: spark,
  };
}

/* ─── Sparkline SVG inline ──────────────────────────────────────────────
   Pas de lib : 30 datapoints max, un seul polyline + gradient subtil sous
   la courbe. Largeur fluide (100%), hauteur fixe. */
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

function Sparkline({ data, width = 96, height = 28, color = "var(--primary)" }: SparklineProps) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data
    .map((v, i) => `${(i * stepX).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`)
    .join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const gradId = `spark-grad-${color.replace("#", "")}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Cartes attachables (preview composer + render dans PostCard) ──────

/* Carte Bien — image + titre + ville + m² + prix (formaté CHF). Clic →
   /explorer/[id]. Utilisable dans le composer (avec X de retrait) et
   dans le post publié. */
function PropertyAttachCard({ property, onRemove }: { property: Property; onRemove?: () => void }) {
  const { formatPrice } = useApp();
  const transactionSuffix =
    property.transactionType === "location-ct"
      ? "/nuit"
      : property.transactionType === "location-lt"
        ? "/mois"
        : "";
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)] group">
      <Link href={`/explorer/${property.id}`} className="flex">
        <img src={property.images[0]} alt="" className="w-28 h-28 object-cover shrink-0" />
        <div className="flex-1 p-3 min-w-0">
          <p className="text-xs text-[var(--primary)] font-medium">Bien immobilier</p>
          <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">
            {property.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1 inline-flex items-center gap-1">
            <MapPin size={11} /> {property.location.city}
            {property.area ? ` · ${property.area} m²` : ""}
          </p>
          <p className="text-sm font-bold text-[var(--primary)] mt-1.5">
            {formatPrice(property.price, property.currency)}
            {transactionSuffix && (
              <span className="text-xs text-[var(--text-muted)] font-normal">{transactionSuffix}</span>
            )}
          </p>
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer le bien attaché"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

interface FormationLike {
  id: string;
  title: string;
  instructor: string;
  price: number;
  students: number;
  thumbnail: string;
}

function FormationAttachCard({ formation, onRemove }: { formation: FormationLike; onRemove?: () => void }) {
  const { formatPrice } = useApp();
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)]">
      <Link href={`/formations/${formation.id}`} className="flex">
        <img src={formation.thumbnail} alt="" className="w-28 h-28 object-cover shrink-0" />
        <div className="flex-1 p-3 min-w-0">
          <p className="text-xs text-orange-400 font-medium inline-flex items-center gap-1">
            <GraduationCap size={11} /> Formation
          </p>
          <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">
            {formation.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Par {formation.instructor} · {formatCount(formation.students)} élèves
          </p>
          <p className="text-sm font-bold text-[var(--primary)] mt-1.5">{formatPrice(formation.price)}</p>
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer la formation attachée"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function EventAttachCard({ event, onRemove }: { event: ComposerEvent; onRemove?: () => void }) {
  const { formatPrice } = useApp();
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)]">
      <Link href={`/evenements/${event.id}`} className="flex">
        <img src={event.thumbnail} alt="" className="w-28 h-28 object-cover shrink-0" />
        <div className="flex-1 p-3 min-w-0">
          <p className="text-xs text-purple-400 font-medium inline-flex items-center gap-1">
            <Calendar size={11} /> {event.eventType}
          </p>
          <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">
            {event.titre}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {formatDate(event.date)} · {event.lieu}
          </p>
          <p className="text-sm font-bold text-[var(--primary)] mt-1.5">
            {event.prix && event.prix > 0 ? formatPrice(event.prix) : "Gratuit"}
            {typeof event.spotsRemaining === "number" && (
              <span className="text-xs text-[var(--text-muted)] font-normal">
                {" "}· {event.spotsRemaining} places restantes
              </span>
            )}
          </p>
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer l'événement attaché"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function AnalyticsAttachCard({ data, onRemove }: { data: AnalyticsCardData; onRemove?: () => void }) {
  const positive = (data.delta ?? 0) >= 0;
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)]">
      <Link href={`/explorer/${data.propertyId}`} className="block p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1">
              <BarChart3 size={11} /> Analyse de bien
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
              {data.propertyTitle}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">{data.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-bold text-[var(--foreground)] tabular-nums leading-none">
                {data.headline}
              </p>
              {typeof data.delta === "number" && (
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                    positive ? "text-emerald-400" : "text-red-400"
                  } pb-0.5`}
                >
                  {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {positive ? "+" : ""}
                  {data.delta}%
                </span>
              )}
            </div>
          </div>
          {data.sparkData && data.sparkData.length > 1 && (
            <div className="shrink-0">
              <Sparkline
                data={data.sparkData}
                color={positive ? "#10b981" : "#ef4444"}
                width={104}
                height={48}
              />
            </div>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-3 inline-flex items-center gap-1">
          Voir le bien <ArrowRight size={11} />
        </p>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer l'analyse attachée"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ─── PostCard ──────────────────────────────────────────────────────────────

type PostCardProps = {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  reposted: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleRepost: () => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onOpenMore: () => void;
  shareOpen: boolean;
  moreOpen: boolean;
  closeMenus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSignal: () => void;
  onShareCopy: () => void;
};

function PostCard({
  post, liked, saved, reposted, muted, onToggleMute,
  onToggleLike, onToggleSave, onToggleRepost, onOpenComments, onOpenShare, onOpenMore,
  shareOpen, moreOpen, closeMenus, onEdit, onDelete, onSignal, onShareCopy,
}: PostCardProps) {
  const { formatPrice } = useApp();
  const cta = CUSTOM_CTA[post.id];
  const event = EVENTS_BY_POST[post.id];
  const isOwn = post.author.id === CURRENT_USER_ID;
  /* Détection vidéo : on consulte mediaTypes (renseigné par le composer
     d'upload) sinon on tombe sur l'heuristique d'extension pour les
     mocks (.mp4). Les blob: URLs du composer ne portent pas d'extension. */
  const isVideo =
    post.mediaTypes?.[0] === "video" ||
    post.media[0]?.endsWith(".mp4") ||
    post.media[0]?.endsWith(".webm");
  const handle = post.author.firstName.toLowerCase();

  return (
    <article
      onClick={closeMenus}
      className="w-full border-b border-[var(--card-border)] last:border-b-0 px-4 py-2.5 transition-colors"
    >
      {/* Layout Twitter : avatar gauche + colonne contenu droite */}
      <div className="flex gap-3">
        {/* Avatar gauche - 32px Whop */}
        <Link href={`/profil/${post.author.id}`} onClick={(e) => e.stopPropagation()} className="shrink-0">
          <img
            src={post.author.avatar}
            alt={post.author.firstName}
            className="w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Colonne contenu */}
        <div className="flex-1 min-w-0">
          {/* Header inline : nom · @handle · time + menu (text-13 Whop) */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0 min-w-0">
              <Link
                href={`/profil/${post.author.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[13px] font-semibold text-[var(--foreground)] hover:underline truncate leading-tight"
              >
                {post.author.firstName} {post.author.lastName}
              </Link>
              <span className="text-[12px] text-[var(--text-muted)] truncate">@{handle}</span>
              <span className="text-[12px] text-[var(--text-muted)]" aria-hidden>·</span>
              <span className="text-[12px] text-[var(--text-muted)]">{timeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span className="text-[12px] text-[var(--text-muted)]" aria-hidden>·</span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-[var(--text-muted)] truncate max-w-[140px]">
                    <MapPin className="w-3 h-3" />
                    {post.location}
                  </span>
                </>
              )}
            </div>

            {/* More menu */}
            <div className="relative shrink-0 -mt-1 -mr-1">
              <button
                onClick={(e) => { e.stopPropagation(); onOpenMore(); }}
                className="p-1.5 rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors"
                aria-label="Plus d'options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {moreOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-9 w-48 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden"
                >
                  {isOwn ? (
                    <>
                      <button onClick={onEdit} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                        <Edit3 className="w-4 h-4" /> Modifier
                      </button>
                      <button onClick={onDelete} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[var(--hover-bg)] transition-colors">
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={onSignal} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                        <Flag className="w-4 h-4" /> Signaler
                      </button>
                      <button onClick={closeMenus} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                        <EyeOff className="w-4 h-4" /> Ne plus afficher
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Caption — directement sous le header, sans gap excessif */}
          {post.content && (
            <div className="mt-0.5">
              <PostCaption content={post.content} />
            </div>
          )}

          {/* Media — video, image ou galerie. Format d'origine inchange. */}
          {post.media.length > 0 && (
            <div className="mt-2">
              {isVideo ? (
                <VideoPlayer src={post.media[0]} muted={muted} onToggleMute={onToggleMute} />
              ) : (
                <MediaGallery media={post.media} />
              )}
            </div>
          )}

          {/* Property CTA — compact */}
          {post.property && (
            <Link
              href={`/explorer/${post.property.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <img src={post.property.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-[var(--primary)]" />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold">Bien</span>
                </div>
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate leading-tight">{post.property.title}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">
                  <span className="font-semibold tabular-nums text-[var(--foreground)]">
                    {formatPrice(post.property.price, post.property.currency)}
                  </span>
                  {" · "}{post.property.bedrooms} ch · {post.property.area} m²
                  {post.property.transactionType === "vente" && post.property.analytics &&
                    ` · ${post.property.analytics.rendementBrut.toFixed(1)} % brut`}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] self-center shrink-0" />
            </Link>
          )}

          {/* Formation CTA */}
          {post.formation && (
            <Link
              href={`/formations/${post.formation.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <img src={post.formation.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3 text-[var(--primary)]" />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold">Formation</span>
                </div>
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate leading-tight">{post.formation.title}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">
                  <span className="font-semibold tabular-nums text-[var(--foreground)]">{formatPrice(post.formation.price)}</span>
                  {" · "}{post.formation.instructor} · {post.formation.students} étudiants
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] self-center shrink-0" />
            </Link>
          )}

          {/* Event CTA (ancien format via EVENTS_BY_POST map) */}
          {event && (
            <Link
              href={`/evenements/${event.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <img src={event.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-violet-400" />
                  <span className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold">Événement · {event.type}</span>
                </div>
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate leading-tight">{event.titre}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">
                  {formatEventDate(event.date)} · {event.heure} · {event.lieu} · {event.prix === 0 ? "Gratuit" : formatPrice(event.prix)}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] self-center shrink-0" />
            </Link>
          )}

          {/* Nouveau format : post.attachment (event ou analytics) */}
          {post.attachment?.type === "event" && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <EventAttachCard event={post.attachment.event} />
            </div>
          )}
          {post.attachment?.type === "analytics" && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <AnalyticsAttachCard data={post.attachment.data} />
            </div>
          )}

          {/* Custom CTA */}
          {cta && (
            <Link
              href={cta.href}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex items-center gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                {cta.icon === "users" ? <Users className="w-4 h-4 text-[var(--primary)]" />
                  : cta.icon === "search" ? <Search className="w-4 h-4 text-[var(--primary)]" />
                  : cta.icon === "calendar" ? <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  : <UserIcon className="w-4 h-4 text-[var(--primary)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate">{cta.title}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{cta.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            </Link>
          )}

          {/* Actions — Twitter-style : Reply | Repost | Like | View | Bookmark | Share.
              Compact, sans border-t, dans le flux de la colonne contenu. */}
          <div className="mt-2 -ml-2 flex items-center justify-between max-w-md">
            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onOpenComments(); }}
              hoverColor="primary"
              label="Répondre"
              count={post.comments.length}
            >
              <MessageCircle className="w-[16px] h-[16px]" />
            </ActionBtn>

            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onToggleRepost(); }}
              hoverColor="emerald"
              label={reposted ? "Annuler le repost" : "Reposter"}
              active={reposted}
              count={Math.round(post.likes / 8) + (reposted ? 1 : 0)}
            >
              <Repeat2 className={`w-[16px] h-[16px] ${reposted ? "animate-pop" : ""}`} />
            </ActionBtn>

            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
              hoverColor="rose"
              label={liked ? "Retirer le j'aime" : "J'aime"}
              active={liked}
              count={post.likes}
            >
              <Heart className={`w-[16px] h-[16px] ${liked ? "fill-rose-500 text-rose-500 animate-pop" : ""}`} />
            </ActionBtn>

            <div className="hidden items-center gap-1 px-2 py-1 text-[12px] text-[var(--text-muted)]">
              <Eye className="w-[16px] h-[16px]" />
              <span className="tabular-nums">{formatCount(post.likes * 25 + post.comments.length * 50)}</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
              className={`group p-1.5 rounded-full transition-colors hover:bg-[var(--primary)]/10 ${
                saved ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"
              }`}
              aria-label={saved ? "Retirer du marque-pages" : "Enregistrer"}
              aria-pressed={saved}
            >
              <Bookmark className={`w-[16px] h-[16px] ${saved ? "fill-current" : ""}`} />
            </button>

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); onOpenShare(); }}
                className="group p-1.5 rounded-full text-[var(--text-muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                aria-label="Partager"
                aria-expanded={shareOpen}
              >
                <Share2 className="w-[16px] h-[16px]" />
              </button>
              {shareOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 bottom-10 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); onShareCopy(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copier le lien
                  </button>
                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer par message
                  </button>
                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager via…
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ActionBtn : bouton d'action compact style Twitter — icone + count
   inline, hover colore selon hoverColor (primary/emerald/rose). */
function ActionBtn({
  children, onClick, hoverColor, label, count, active,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  hoverColor: "primary" | "emerald" | "rose";
  label: string;
  count?: number;
  active?: boolean;
}) {
  const colorClass = active
    ? hoverColor === "emerald"
      ? "text-emerald-500"
      : hoverColor === "rose"
      ? "text-rose-500"
      : "text-[var(--primary)]"
    : "text-[var(--text-muted)]";
  const hoverClass =
    hoverColor === "emerald"
      ? "group-hover:bg-emerald-500/10 group-hover:text-emerald-500"
      : hoverColor === "rose"
      ? "group-hover:bg-rose-500/10 group-hover:text-rose-500"
      : "group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]";
  const countColorClass = active
    ? colorClass
    : hoverColor === "emerald"
    ? "group-hover:text-emerald-500"
    : hoverColor === "rose"
    ? "group-hover:text-rose-500"
    : "group-hover:text-[var(--primary)]";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="group inline-flex items-center gap-1 px-1.5 py-1 transition-colors"
    >
      <span className={`p-1 rounded-full transition-colors ${colorClass} ${hoverClass}`}>
        {children}
      </span>
      {typeof count === "number" && count > 0 && (
        <span className={`text-[12px] tabular-nums transition-colors ${colorClass} ${countColorClass}`}>
          {formatCount(count)}
        </span>
      )}
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function FeedPage() {
  const { isFollowing, toggleFollow } = useApp();
  const [posts, setPosts] = useState<SocialPost[]>(VIDEO_POSTS);
  /* ─── Composer rapide en tête du feed ─────────────────────────────────
     Texte court (≤280) + jusqu'à 4 médias (image/vidéo) + 1 attachement
     parmi : Bien, Formation, Événement, Analyse de bien. Picker tabbed
     pour l'attachement (ouvre un drawer modal plein écran sur mobile). */
  const [composerText, setComposerText] = useState("");
  const [composerMedia, setComposerMedia] = useState<{ url: string; type: "image" | "video" }[]>([]);
  type ComposerAttachmentState =
    | { kind: "property"; property: Property }
    | { kind: "formation"; formation: FormationLike }
    | { kind: "event"; event: ComposerEvent }
    | { kind: "analytics"; data: AnalyticsCardData }
    | null;
  const [composerAttachment, setComposerAttachment] = useState<ComposerAttachmentState>(null);
  const [attachPicker, setAttachPicker] = useState<
    null | "property" | "formation" | "event" | "analytics"
  >(null);
  /* Pour l'onglet "Analyse", il faut d'abord choisir un bien, puis la
     métrique. On garde le bien sélectionné en attente. */
  const [analyticsPickerProperty, setAnalyticsPickerProperty] = useState<Property | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_COMPOSER_MEDIA = 4;
  const [activeTab, setActiveTab] = useState<"pour-vous" | "suivis">("pour-vous");

  // Persiste l'état mute entre les posts (le user ne doit pas le réajuster à chaque card).
  const [muted, setMuted] = useState(true);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [repostedPosts, setRepostedPosts] = useState<Set<string>>(new Set());
  const [shareMenuPost, setShareMenuPost] = useState<string | null>(null);
  const [moreMenuPost, setMoreMenuPost] = useState<string | null>(null);
  const [commentsModalPost, setCommentsModalPost] = useState<string | null>(null);
  const [editModalPost, setEditModalPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [feedToast, setFeedToast] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    // Tri par date desc pour que les nouveaux formats varies (texte seul,
    // galeries photo) se melangent naturellement avec les videos selon
    // leur createdAt, plutot que d'apparaitre en bas du tableau.
    const base = activeTab === "suivis"
      ? posts.filter((p) => isFollowing(p.author.id))
      : posts;
    return [...base].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [posts, activeTab, isFollowing]);

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

  const toggleRepost = (postId: string) => {
    setRepostedPosts((prev) => {
      const next = new Set(prev);
      const wasReposted = next.has(postId);
      if (wasReposted) next.delete(postId);
      else next.add(postId);
      setFeedToast(wasReposted ? "Repost annulé" : "Reposté");
      setTimeout(() => setFeedToast(null), 1800);
      return next;
    });
  };

  const handleShareCopy = (postId: string) => {
    const url = `${typeof window !== "undefined" ? window.location.origin : "https://edome.world"}/feed#${postId}`;
    try {
      navigator.clipboard.writeText(url);
      setFeedToast("Lien copié");
    } catch {
      setFeedToast("Impossible de copier");
    }
    setShareMenuPost(null);
    setTimeout(() => setFeedToast(null), 1800);
  };

  const addComment = (postId: string) => {
    const text = commentInput.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `c-new-${Date.now()}`,
      author: CURRENT_USER,
      content: replyTo ? `@${replyTo} ${text}` : text,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setCommentInput("");
    setReplyTo(null);
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setMoreMenuPost(null);
  };

  /* ─── Composer : handlers ─────────────────────────────────────────── */

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = MAX_COMPOSER_MEDIA - composerMedia.length;
    const toAdd = files.slice(0, remaining).map((f) => ({
      url: URL.createObjectURL(f),
      type: (f.type.startsWith("video") ? "video" : "image") as "image" | "video",
    }));
    setComposerMedia((prev) => [...prev, ...toAdd]);
    e.target.value = "";
    if (files.length > remaining) {
      setFeedToast(`Maximum ${MAX_COMPOSER_MEDIA} fichiers`);
      setTimeout(() => setFeedToast(null), 1800);
    }
  };

  const removeMedia = (idx: number) => {
    setComposerMedia((prev) => {
      const removed = prev[idx];
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const openAttachPicker = (kind: "property" | "formation" | "event" | "analytics") => {
    setAttachPicker(kind);
    setAnalyticsPickerProperty(null);
  };
  const closeAttachPicker = () => {
    setAttachPicker(null);
    setAnalyticsPickerProperty(null);
  };

  const attachProperty = (p: Property) => {
    setComposerAttachment({ kind: "property", property: p });
    closeAttachPicker();
  };
  const attachFormation = (f: FormationLike) => {
    setComposerAttachment({ kind: "formation", formation: f });
    closeAttachPicker();
  };
  const attachEvent = (e: ComposerEvent) => {
    setComposerAttachment({ kind: "event", event: e });
    closeAttachPicker();
  };
  const attachAnalytics = (p: Property, metric: AnalyticsMetric) => {
    setComposerAttachment({
      kind: "analytics",
      data: computeAnalyticsCard(p, metric),
    });
    closeAttachPicker();
  };

  const composerHasContent =
    composerText.trim().length > 0 ||
    composerMedia.length > 0 ||
    composerAttachment !== null;

  /* Publication depuis le composer : texte + médias uploadés + 1 pièce
     jointe (bien/formation/événement/analyse). On bascule sur l'onglet
     "Pour vous" pour qu'on voie sa propre publication (on ne se suit pas
     soi-même côté mock). */
  const publishFromComposer = () => {
    if (!composerHasContent) return;

    const newPost: SocialPost = {
      id: `p-${Date.now()}`,
      author: CURRENT_USER,
      content: composerText.trim(),
      media: composerMedia.map((m) => m.url),
      mediaTypes: composerMedia.map((m) => m.type),
      type: "post",
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    if (composerAttachment?.kind === "property") {
      newPost.property = composerAttachment.property;
    } else if (composerAttachment?.kind === "formation") {
      newPost.formation = composerAttachment.formation;
    } else if (composerAttachment?.kind === "event") {
      const a: PostAttachment = { type: "event", event: composerAttachment.event };
      newPost.attachment = a;
    } else if (composerAttachment?.kind === "analytics") {
      const a: PostAttachment = { type: "analytics", data: composerAttachment.data };
      newPost.attachment = a;
    }

    setPosts((prev) => [newPost, ...prev]);
    setComposerText("");
    setComposerMedia([]);
    setComposerAttachment(null);
    setActiveTab("pour-vous");
    setFeedToast("Publié");
    setTimeout(() => setFeedToast(null), 1800);
  };

  const saveEdit = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: editContent } : p))
    );
    setEditModalPost(null);
    setEditContent("");
  };

  const showToast = (msg: string) => {
    setFeedToast(msg);
    setTimeout(() => setFeedToast(null), 2400);
  };

  const closeMenus = () => {
    setShareMenuPost(null);
    setMoreMenuPost(null);
  };

  const commentsForPost = commentsModalPost
    ? posts.find((p) => p.id === commentsModalPost)
    : null;

  return (
    <div>
      {/* Toast */}
      {feedToast && (
        <div className="fixed top-6 right-6 z-[100] inline-flex items-center gap-1.5 px-5 py-3 rounded-xl toast-success text-sm font-medium shadow-lg animate-fade-in">
          <Check size={14} strokeWidth={2.5} /> {feedToast}
        </div>
      )}

      {/* Pas de max-w/centrage : le feed est colle a gauche apres la sidebar
          (style Whop ou le centre n'est PAS au milieu de l'espace). */}
      <div className="flex gap-8">
        {/* Colonne centrale — timeline alignee a gauche */}
        <div className="flex-1 min-w-0">
          {/* DiscoverHub */}
          <div className="max-w-[760px]">
            <DiscoverHub />
          </div>

          {/* Tabs sticky : style underline subtle (Whop). py-2 gap-5,
              inactif text-muted, underline plus discret. */}
          <div className="sticky top-16 z-20 -mx-4 px-4 py-1 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--card-border)] md:-mx-0 md:px-0 md:bg-transparent md:backdrop-blur-0">
            <div className="max-w-[760px] flex items-center gap-5 px-2">
              {(["pour-vous", "suivis"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2 text-[14px] font-medium transition-colors ${
                    activeTab === tab
                      ? "text-[var(--foreground)]"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab === "pour-vous" ? "Pour vous" : "Suivis"}
                  {activeTab === tab && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[var(--foreground)]"
                      aria-hidden
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Composer rapide en tête du feed — style X/Twitter mais
              adapté E-Dome : pas de GIF / emoji / sondage (jamais utilisés
              dans le projet), à la place upload média (image+vidéo, jusqu'à
              4 via picker iOS natif) + 4 attachements pertinents : Bien
              immobilier, Formation, Événement, Analyse de bien. */}
          <div className="mt-2 max-w-[760px]">
            <div className="px-4 py-3 border-b border-[var(--card-border)]">
              <div className="flex gap-3">
                <img
                  src={CURRENT_USER.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={composerRef}
                    value={composerText}
                    onChange={(e) => {
                      setComposerText(e.target.value);
                      // auto-grow : reset puis adapte à scrollHeight
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
                    }}
                    onKeyDown={(e) => {
                      // Cmd/Ctrl + Enter → publier (raccourci Twitter)
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        publishFromComposer();
                      }
                    }}
                    placeholder={`Quoi de neuf, ${CURRENT_USER.firstName} ?`}
                    maxLength={280}
                    rows={1}
                    aria-label="Rédiger une publication"
                    className="w-full bg-transparent text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none text-base leading-snug py-1.5"
                  />

                  {/* Aperçu médias uploadés (image + vidéo). Grid 2 cols
                      sur mobile, jusqu'à 4 items, suppression individuelle. */}
                  {composerMedia.length > 0 && (
                    <div
                      className={`mt-2 grid gap-1.5 rounded-2xl overflow-hidden ${
                        composerMedia.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2"
                      }`}
                    >
                      {composerMedia.map((m, i) => (
                        <div
                          key={i}
                          className="relative aspect-video bg-black rounded-xl overflow-hidden group"
                        >
                          {m.type === "video" ? (
                            <video
                              src={m.url}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                              autoPlay
                            />
                          ) : (
                            <img
                              src={m.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          {m.type === "video" && (
                            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                              <Film size={10} /> Vidéo
                            </span>
                          )}
                          <button
                            onClick={() => removeMedia(i)}
                            aria-label="Retirer ce média"
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Aperçu pièce jointe (bien/formation/événement/analyse) */}
                  {composerAttachment && (
                    <div className="mt-2">
                      {composerAttachment.kind === "property" && (
                        <PropertyAttachCard
                          property={composerAttachment.property}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                      {composerAttachment.kind === "formation" && (
                        <FormationAttachCard
                          formation={composerAttachment.formation}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                      {composerAttachment.kind === "event" && (
                        <EventAttachCard
                          event={composerAttachment.event}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                      {composerAttachment.kind === "analytics" && (
                        <AnalyticsAttachCard
                          data={composerAttachment.data}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                    </div>
                  )}

                  {/* Input file caché — accept image+video, multiple, pas de
                      `capture` pour laisser iOS proposer le choix entre
                      Bibliothèque / Photo / Vidéo via le bottom sheet
                      natif (UX iOS standard). */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleAddMedia}
                    className="hidden"
                    aria-hidden
                  />

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      <ComposerAction
                        icon={ImageIcon}
                        label="Ajouter une photo ou vidéo"
                        onClick={() => fileInputRef.current?.click()}
                      />
                      <ComposerAction
                        icon={Building2}
                        label="Attacher un bien immobilier"
                        onClick={() => openAttachPicker("property")}
                        badge={composerAttachment?.kind === "property"}
                      />
                      <ComposerAction
                        icon={GraduationCap}
                        label="Attacher une formation"
                        onClick={() => openAttachPicker("formation")}
                        badge={composerAttachment?.kind === "formation"}
                      />
                      <ComposerAction
                        icon={Calendar}
                        label="Attacher un événement"
                        onClick={() => openAttachPicker("event")}
                        badge={composerAttachment?.kind === "event"}
                      />
                      <ComposerAction
                        icon={BarChart3}
                        label="Attacher une analyse de bien"
                        onClick={() => openAttachPicker("analytics")}
                        badge={composerAttachment?.kind === "analytics"}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      {composerText.length > 0 && (
                        <span
                          aria-hidden
                          className={`text-xs tabular-nums ${
                            composerText.length > 260
                              ? "text-amber-400"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          {280 - composerText.length}
                        </span>
                      )}
                      <button
                        onClick={publishFromComposer}
                        disabled={!composerHasContent}
                        className="px-5 h-9 rounded-full bg-[var(--primary)] hover:bg-[var(--primary)] text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Publier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Timeline Twitter-like : posts contigus, séparés par filet fin */}
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                <Users className="w-12 h-12 text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-secondary)] max-w-xs">
                  Vous n'êtes abonné à personne pour le moment. Abonnez-vous à des utilisateurs pour voir leurs publications ici.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  liked={likedPosts.has(post.id)}
                  saved={savedPosts.has(post.id)}
                  reposted={repostedPosts.has(post.id)}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                  onToggleLike={() => toggleLike(post.id)}
                  onToggleSave={() => toggleSave(post.id)}
                  onToggleRepost={() => toggleRepost(post.id)}
                  onOpenComments={() => setCommentsModalPost(post.id)}
                  onOpenShare={() => {
                    setShareMenuPost(shareMenuPost === post.id ? null : post.id);
                    setMoreMenuPost(null);
                  }}
                  onOpenMore={() => {
                    setMoreMenuPost(moreMenuPost === post.id ? null : post.id);
                    setShareMenuPost(null);
                  }}
                  shareOpen={shareMenuPost === post.id}
                  moreOpen={moreMenuPost === post.id}
                  closeMenus={closeMenus}
                  onEdit={() => {
                    setEditContent(post.content);
                    setEditModalPost(post.id);
                    setMoreMenuPost(null);
                  }}
                  onDelete={() => deletePost(post.id)}
                  onSignal={() => {
                    setMoreMenuPost(null);
                    showToast("Publication signalée");
                  }}
                  onShareCopy={() => handleShareCopy(post.id)}
                />
              ))
            )}

            {filteredPosts.length > 0 && (
              <div className="py-10 text-center text-xs text-[var(--text-muted)]">
                Vous avez parcouru tout le feed — {filteredPosts.length} publications.
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite Whop : 280px, UNIQUEMENT suggestions a suivre
            (Search + Tendances masques pour matcher la sidebar simple Whop). */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
          {/* Search — masque (Whop n'a pas de search dans la sidebar droite) */}
          <form onSubmit={(e) => e.preventDefault()} className="hidden">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="search"
              placeholder="Rechercher sur E-Dome"
              className="w-full pl-10 pr-3 py-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition-colors"
            />
          </form>

          {/* Tendances — masque (Whop ne montre pas trending sur la home) */}
          <div className="hidden">
            <h3 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Tendances
            </h3>
            <ul className="space-y-0.5">
              {TRENDING_HASHTAGS.slice(0, 3).map((item) => (
                <li key={item.tag}>
                  <Link
                    href={`/recherche?q=${encodeURIComponent(item.tag)}`}
                    className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <span className="text-sm font-medium text-[var(--foreground)] truncate">{item.tag}</span>
                    <span className="text-[11px] text-[var(--text-muted)] tabular-nums shrink-0">
                      {formatCount(item.count)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/recherche"
              className="block mt-1 px-2 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Voir plus →
            </Link>
          </div>

          {/* Suggestions Whop : aucun header de section, liste verticale
              dense, 10 profils, avatar 40px + bouton Suivre pill. */}
          <div>
            <ul className="space-y-0.5">
              {SUGGESTIONS.slice(0, 10).map((user) => (
                <li key={user.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors">
                  <Link href={`/profil/${user.id}`} className="shrink-0">
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profil/${user.id}`}
                      className="text-[13px] font-semibold text-[var(--foreground)] hover:underline truncate block leading-tight"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      {roleLabels[user.activeRole]}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className="text-[12px] px-3.5 py-1.5 rounded-full font-semibold transition-colors shrink-0"
                    style={{
                      background: isFollowing(user.id) ? "transparent" : "var(--foreground)",
                      color: isFollowing(user.id) ? "var(--text-secondary)" : "var(--background)",
                      border: isFollowing(user.id) ? "1px solid var(--card-border)" : "none",
                    }}
                  >
                    {isFollowing(user.id) ? "Suivi" : "Suivre"}
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href="/recherche"
              className="block mt-1 px-2 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Voir plus →
            </Link>
          </div>
        </aside>
      </div>

      {/* Comments modal */}
      {commentsForPost && (
        <div className="fixed inset-0 z-[80] flex items-end md:items-center md:justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setCommentsModalPost(null); setReplyTo(null); setCommentInput(""); }}
          />
          <div className="relative w-full md:w-[480px] md:max-w-[90vw] h-[75vh] md:h-[640px] md:rounded-2xl rounded-t-3xl bg-[var(--card)] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Commentaires · {commentsForPost.comments.length}
              </h3>
              <button
                onClick={() => { setCommentsModalPost(null); setReplyTo(null); setCommentInput(""); }}
                className="p-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {commentsForPost.comments.length === 0 && (
                <p className="text-center text-sm text-[var(--text-muted)] py-12">
                  Aucun commentaire pour l'instant. Sois le premier !
                </p>
              )}
              {commentsForPost.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img src={c.author.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link href={`/profil/${c.author.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:underline">
                        {c.author.firstName}
                      </Link>
                      <span className="text-xs text-[var(--text-muted)]">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {renderContent(c.content)}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <button className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                        {c.likes > 0 && `${c.likes} `}J&apos;aime
                      </button>
                      <button
                        onClick={() => setReplyTo(c.author.firstName)}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        Répondre
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--card-border)] p-3">
              {replyTo && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[var(--primary)]">Réponse à @{replyTo}</span>
                  <button onClick={() => setReplyTo(null)} className="text-[var(--text-muted)]">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <img src={CURRENT_USER.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment(commentsForPost.id)}
                  placeholder={replyTo ? `Répondre à ${replyTo}...` : "Écrire un commentaire..."}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                  autoFocus
                />
                <button
                  onClick={() => addComment(commentsForPost.id)}
                  disabled={!commentInput.trim()}
                  className="p-2.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)] transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editModalPost && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditModalPost(null)} />
          <div className="relative w-full max-w-[500px] rounded-2xl bg-[var(--card)] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
              <h3 className="text-sm font-semibold">Modifier la publication</h3>
              <button onClick={() => setEditModalPost(null)} className="p-1 rounded-lg hover:bg-[var(--hover-bg)]">
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={2000}
                rows={6}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-sm text-[var(--foreground)] outline-none resize-none focus:border-[var(--primary)]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditModalPost(null)}
                  className="px-4 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => saveEdit(editModalPost)}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)] text-white text-sm font-medium transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Picker d'attachement (Bien / Formation / Événement / Analyse) ─── */}
      {attachPicker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choisir une pièce jointe"
          className="fixed inset-0 z-[80] bg-black/70 flex items-end md:items-center justify-center animate-fade-in"
          onClick={closeAttachPicker}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-lg bg-[var(--card)] border border-[var(--card-border)] rounded-t-2xl md:rounded-2xl max-h-[85vh] flex flex-col animate-slide-in-bottom md:animate-scale-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)] shrink-0">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {attachPicker === "property" && "Attacher un bien"}
                {attachPicker === "formation" && "Attacher une formation"}
                {attachPicker === "event" && "Attacher un événement"}
                {attachPicker === "analytics" &&
                  (analyticsPickerProperty ? "Choisir l'indicateur" : "Analyser un bien")}
              </h3>
              <button
                onClick={closeAttachPicker}
                aria-label="Fermer"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {attachPicker === "property" && (
                <PropertyPickerList properties={ALL_PROPERTIES} onSelect={attachProperty} />
              )}
              {attachPicker === "formation" && (
                <FormationPickerList onSelect={attachFormation} />
              )}
              {attachPicker === "event" && (
                <EventPickerList events={EVENTS_AVAILABLE} onSelect={attachEvent} />
              )}
              {attachPicker === "analytics" && !analyticsPickerProperty && (
                <PropertyPickerList
                  properties={ALL_PROPERTIES.filter((p) => p.analytics)}
                  onSelect={(p) => setAnalyticsPickerProperty(p)}
                  ctaLabel="Choisir"
                />
              )}
              {attachPicker === "analytics" && analyticsPickerProperty && (
                <AnalyticsMetricPicker
                  property={analyticsPickerProperty}
                  onBack={() => setAnalyticsPickerProperty(null)}
                  onSelect={(m) => attachAnalytics(analyticsPickerProperty, m)}
                />
              )}
            </div>

            {/* Pied avec safe-area iOS pour le drawer mobile */}
            <div
              className="border-t border-[var(--card-border)] shrink-0"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Listes du picker d'attachement ──────────────────────────────────── */

function PropertyPickerList({
  properties,
  onSelect,
  ctaLabel = "Attacher",
}: {
  properties: Property[];
  onSelect: (p: Property) => void;
  ctaLabel?: string;
}) {
  const { formatPrice } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return properties;
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.location.city.toLowerCase().includes(needle),
    );
  }, [properties, q]);

  return (
    <>
      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un bien…"
          className="w-full pl-9 pr-3 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]/40"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)] py-8">Aucun bien.</p>
      ) : (
        filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--hover-bg)] text-left transition-colors"
          >
            <img src={p.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{p.title}</p>
              <p className="text-xs text-[var(--text-muted)] inline-flex items-center gap-1">
                <MapPin size={11} /> {p.location.city} · {formatPrice(p.price, p.currency)}
              </p>
            </div>
            <span className="text-xs font-medium text-[var(--primary)] shrink-0">{ctaLabel}</span>
          </button>
        ))
      )}
    </>
  );
}

function FormationPickerList({ onSelect }: { onSelect: (f: FormationLike) => void }) {
  const { formatPrice } = useApp();
  const [q, setQ] = useState("");
  const formations = useMemo<FormationLike[]>(
    () =>
      ALL_FORMATIONS.map((f) => ({
        id: f.id,
        title: f.title,
        instructor: `${f.instructor.firstName} ${f.instructor.lastName}`,
        price: f.price,
        students: f.studentCount ?? 0,
        thumbnail: f.thumbnail,
      })),
    [],
  );
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return formations;
    return formations.filter(
      (f) =>
        f.title.toLowerCase().includes(needle) ||
        f.instructor.toLowerCase().includes(needle),
    );
  }, [formations, q]);

  return (
    <>
      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une formation…"
          className="w-full pl-9 pr-3 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]/40"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)] py-8">Aucune formation.</p>
      ) : (
        filtered.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--hover-bg)] text-left transition-colors"
          >
            <img src={f.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{f.title}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {f.instructor} · {formatPrice(f.price)}
              </p>
            </div>
            <span className="text-xs font-medium text-[var(--primary)] shrink-0">Attacher</span>
          </button>
        ))
      )}
    </>
  );
}

function EventPickerList({
  events,
  onSelect,
}: {
  events: ComposerEvent[];
  onSelect: (e: ComposerEvent) => void;
}) {
  const { formatPrice } = useApp();
  return (
    <>
      {events.map((e) => (
        <button
          key={e.id}
          onClick={() => onSelect(e)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--hover-bg)] text-left transition-colors"
        >
          <img src={e.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">{e.titre}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {formatDate(e.date)} · {e.lieu} ·{" "}
              {e.prix && e.prix > 0 ? formatPrice(e.prix) : "Gratuit"}
            </p>
          </div>
          <span className="text-xs font-medium text-[var(--primary)] shrink-0">Attacher</span>
        </button>
      ))}
    </>
  );
}

function AnalyticsMetricPicker({
  property,
  onBack,
  onSelect,
}: {
  property: Property;
  onBack: () => void;
  onSelect: (m: AnalyticsMetric) => void;
}) {
  const metrics: { key: AnalyticsMetric; title: string; desc: string }[] = [
    {
      key: "views7d",
      title: "Vues 7 derniers jours",
      desc: "Sparkline + delta vs semaine précédente",
    },
    {
      key: "rendementNet",
      title: "Rendement net annuel",
      desc: `${property.analytics?.rendementNet?.toFixed(1) ?? "—"}% sur ce bien`,
    },
    {
      key: "occupation30d",
      title: "Taux d'occupation 30j",
      desc: "Sparkline + delta sur le mois",
    },
  ];
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] mb-2"
      >
        ← Changer de bien
      </button>
      <div className="flex items-center gap-2 p-2 mb-2 rounded-xl bg-[var(--hover-bg)]">
        <img
          src={property.images[0]}
          alt=""
          className="w-10 h-10 rounded-lg object-cover shrink-0"
        />
        <p className="text-xs font-medium text-[var(--foreground)] truncate">{property.title}</p>
      </div>
      {metrics.map((m) => (
        <button
          key={m.key}
          onClick={() => onSelect(m.key)}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--card-border)] hover:border-[var(--primary)]/40 hover:bg-[var(--hover-bg)] text-left transition-colors mb-2"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
            <BarChart3 size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)]">{m.title}</p>
            <p className="text-xs text-[var(--text-muted)]">{m.desc}</p>
          </div>
          <ArrowRight size={14} className="text-[var(--text-muted)] shrink-0" />
        </button>
      ))}
    </>
  );
}
