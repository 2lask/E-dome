"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { roleLabels } from "@/lib/types";
import type { Property, User } from "@/lib/types";
import type { SocialPost } from "@/lib/types";
import { formatCount, timeAgo } from "@/lib/utils";

// ─── Mock data ──────────────────────────────────────────────────────────────

const mockUsers: Record<string, User> = {
  "user-001": {
    id: "user-001", firstName: "Léo", lastName: "Martin", email: "leo.martin@edome.ch",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    city: "Lausanne", country: "Suisse", roles: ["hote", "formateur", "apporteur"], activeRole: "hote",
    stats: { followers: 2340, following: 812, properties: 4, reviews: 87, rating: 4.8, transactions: 52, revenue: 485000 },
    bio: "Expert immobilier certifié USPI. Spécialiste des investissements locatifs en Suisse romande et à l'international. Passionné par l'innovation proptech.",
    languages: ["Français", "Anglais", "Arabe"],
    certifications: ["Expert Immobilier USPI (2024)", "Courtier Fédéral (2022)"],
    responseTime: "< 2 heures",
  },
  "user-002": {
    id: "user-002", firstName: "Sophie", lastName: "Durand", email: "sophie.durand@edome.ch",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
    stats: { followers: 890, following: 210, properties: 5, reviews: 42, rating: 4.8, transactions: 78, revenue: 920000 },
    bio: "Hôte passionnée spécialisée dans l'immobilier de standing en Suisse romande.",
    languages: ["Français", "Deutsch", "Anglais"],
    certifications: ["Courtière Brevet Fédéral (2019)"],
    responseTime: "< 1 heure",
  },
  "user-003": {
    id: "user-003", firstName: "Marc", lastName: "Favre", email: "marc.favre@edome.ch",
    avatar: "https://images.unsplash.com/photo-1519345182560-cabd3c3338a3?w=200&h=200&fit=crop",
    city: "Genève", country: "Suisse", roles: ["hote", "courtier"], activeRole: "hote",
    stats: { followers: 640, following: 340, properties: 8, reviews: 42, rating: 4.7, transactions: 31, revenue: 1250000 },
    bio: "Agent immobilier et hôte actif à Genève. Spécialiste de la location courte durée.",
    languages: ["Français", "Anglais", "Portugais"],
    certifications: ["CFA Level II (2018)"],
    responseTime: "< 4 heures",
  },
  "user-004": {
    id: "user-004", firstName: "Amina", lastName: "El Idrissi", email: "amina.elidrissi@edome.ch",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    city: "Marrakech", country: "Maroc", roles: ["formateur", "hote"], activeRole: "formateur",
    stats: { followers: 1200, following: 610, properties: 6, reviews: 98, rating: 4.9, transactions: 45, revenue: 340000 },
    bio: "Formatrice et hôte au Maroc. Experte en investissement locatif dans les marchés émergents.",
    languages: ["Français", "Arabe", "Anglais"],
    certifications: ["Gestion Hôtelière (ISCAE 2020)"],
    responseTime: "< 3 heures",
  },
  "user-005": {
    id: "user-005", firstName: "Lucas", lastName: "Renaud", email: "lucas.renaud@edome.ch",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    city: "Nice", country: "France", roles: ["promoteur"], activeRole: "promoteur",
    stats: { followers: 520, following: 430, properties: 4, reviews: 56, rating: 4.6, transactions: 28, revenue: 195000 },
    bio: "Promoteur immobilier sur la Côte d'Azur. Spécialiste des villas de prestige.",
    languages: ["Français", "Anglais", "Italien"],
    certifications: ["Pilote Drone (DGAC 2023)"],
    responseTime: "< 2 heures",
  },
  "user-006": {
    id: "user-006", firstName: "Yasmin", lastName: "Al Maktoum", email: "yasmin@edome.ch",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    city: "Dubaï", country: "EAU", roles: ["agence"], activeRole: "agence",
    stats: { followers: 3500, following: 480, properties: 9, reviews: 64, rating: 4.8, transactions: 72, revenue: 2100000 },
    bio: "Agence immobilière premium à Dubaï. Spécialiste des résidences de luxe.",
    languages: ["Français", "Anglais", "Arabe"],
    certifications: ["RERA Licensed Broker (2021)", "Luxury Real Estate Specialist"],
    responseTime: "< 1 heure",
  },
  "user-015": {
    id: "user-015", firstName: "Jean-Luc", lastName: "Hartmann", email: "jeanluc@edome.ch",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    city: "Neuchâtel", country: "Suisse", roles: ["agence"], activeRole: "agence",
    stats: { followers: 280, following: 150, properties: 3, reviews: 22, rating: 4.5, transactions: 35, revenue: 420000 },
    bio: "Agent immobilier indépendant à Neuchâtel. 20 ans d'expérience.",
    languages: ["Français", "Allemand"],
    certifications: ["Brevet fédéral de courtier (2006)", "Expert USPI Neuchâtel"],
    responseTime: "< 2 heures",
  },
  u1: {
    id: "u1", firstName: "Sophie", lastName: "Martin", email: "sophie@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    city: "Genève", country: "Suisse", roles: ["hote", "courtier"], activeRole: "hote",
    stats: { followers: 890, following: 210, properties: 5, reviews: 42, rating: 4.9, transactions: 89, revenue: 120000 },
    bio: "Courtière immobilière indépendante avec 12 ans d'expérience sur l'arc lémanique. Spécialisée dans les biens de standing et l'accompagnement personnalisé de chaque client.",
    languages: ["Français", "Anglais", "Italien"],
    certifications: ["Courtière certifiée USPI", "Experte en estimation"],
    responseTime: "< 30 min",
  },
  u2: {
    id: "u2", firstName: "Marc", lastName: "Dupont", email: "marc@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    city: "Zürich", country: "Suisse", roles: ["investisseur", "formateur"], activeRole: "investisseur",
    stats: { followers: 2100, following: 150, properties: 15, reviews: 78, rating: 4.7, transactions: 200, revenue: 450000 },
    bio: "Investisseur et formateur, spécialiste de l'analyse financière immobilière.",
    languages: ["Français", "Allemand", "Anglais"],
    certifications: ["Analyste financier certifié", "Formateur USPI"],
    responseTime: "< 2 heures",
  },
  u3: {
    id: "u3", firstName: "Amira", lastName: "El Fassi", email: "amira@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    city: "Marrakech", country: "Maroc", roles: ["agence"], activeRole: "agence",
    stats: { followers: 1500, following: 320, properties: 12, reviews: 45, rating: 4.8, transactions: 60, revenue: 280000 },
    bio: "Agence spécialisée dans l'immobilier de prestige au Maroc. 10 ans d'expérience en gestion de riads et villas de luxe.",
    languages: ["Français", "Arabe", "Anglais"],
    certifications: ["Agence agréée FNPI"],
    responseTime: "< 1 heure",
  },
  u4: {
    id: "u4", firstName: "Thomas", lastName: "Weber", email: "thomas@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop",
    city: "Zurich", country: "Suisse", roles: ["promoteur"], activeRole: "promoteur",
    stats: { followers: 3200, following: 180, properties: 20, reviews: 92, rating: 4.6, transactions: 150, revenue: 1200000 },
    bio: "Promoteur immobilier actif en Suisse alémanique.",
    languages: ["Deutsch", "Français", "English"],
    certifications: ["Promoteur agréé SVIT"],
    responseTime: "< 3 heures",
  },
  g1: {
    id: "g1", firstName: "Sophie", lastName: "Bernard", email: "sophie.bernard@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    city: "Genève", country: "Suisse", roles: ["client"], activeRole: "client",
    stats: { followers: 120, following: 85, properties: 0, reviews: 5, rating: 4.5, transactions: 2, revenue: 0 },
    bio: "En recherche d'un bien immobilier à Genève. Passionnée d'architecture et de design d'intérieur.",
    languages: ["Français", "Anglais"],
    certifications: [],
    responseTime: "< 4 heures",
  },
  g2: {
    id: "g2", firstName: "Jean-Marc", lastName: "Dupont", email: "jeanmarc@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    city: "Zurich", country: "Suisse", roles: ["client"], activeRole: "client",
    stats: { followers: 95, following: 60, properties: 0, reviews: 3, rating: 4.2, transactions: 1, revenue: 0 },
    bio: "Cadre dans la finance, en quête d'un premier investissement immobilier en Suisse alémanique.",
    languages: ["Français", "Deutsch", "English"],
    certifications: [],
    responseTime: "< 6 heures",
  },
  g3: {
    id: "g3", firstName: "Marie", lastName: "Leroy", email: "marie.leroy@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    city: "Lausanne", country: "Suisse", roles: ["client"], activeRole: "client",
    stats: { followers: 75, following: 110, properties: 0, reviews: 7, rating: 4.4, transactions: 3, revenue: 0 },
    bio: "Jeune professionnelle à Lausanne, intéressée par la location et l'achat d'un premier appartement.",
    languages: ["Français", "Anglais"],
    certifications: [],
    responseTime: "< 5 heures",
  },
};

const mockProperties: Record<string, Property[]> = {
  "user-001": [
    {
      id: "prop7", title: "Loft moderne Neuchâtel", description: "", type: "appartement", transactionType: "location-ct",
      price: 150, currency: "CHF", location: { city: "Neuchâtel", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"],
      host: mockUsers["user-001"], bedrooms: 2, bathrooms: 1, area: 85, amenities: [], rating: 4.8, reviewCount: 34,
    },
  ],
  "user-002": [
    {
      id: "prop1", title: "Appartement standing Lausanne", description: "", type: "appartement", transactionType: "vente",
      price: 1450000, currency: "CHF", location: { city: "Lausanne", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"],
      host: mockUsers["user-002"], bedrooms: 3, bathrooms: 2, area: 120, amenities: [], rating: 4.8, reviewCount: 18,
    },
  ],
  "user-003": [
    {
      id: "prop2", title: "Duplex vue lac Genève", description: "", type: "appartement", transactionType: "location-ct",
      price: 200, currency: "CHF", location: { city: "Genève", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      host: mockUsers["user-003"], bedrooms: 3, bathrooms: 2, area: 110, amenities: [], rating: 4.7, reviewCount: 15,
    },
  ],
  "user-004": [
    {
      id: "prop4", title: "Riad traditionnel Marrakech", description: "", type: "riad", transactionType: "location-ct",
      price: 180, currency: "EUR", location: { city: "Marrakech", country: "Maroc" },
      images: ["https://images.unsplash.com/photo-1590059390258-ea0456c8548a?w=400&h=300&fit=crop"],
      host: mockUsers["user-004"], bedrooms: 4, bathrooms: 3, area: 250, amenities: [], rating: 4.9, reviewCount: 42,
    },
  ],
  "user-005": [
    {
      id: "prop3", title: "Villa prestige Nice", description: "", type: "villa", transactionType: "vente",
      price: 2200000, currency: "EUR", location: { city: "Nice", country: "France" },
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"],
      host: mockUsers["user-005"], bedrooms: 5, bathrooms: 4, area: 300, amenities: [], rating: 4.6, reviewCount: 8,
    },
  ],
  "user-006": [
    {
      id: "prop-d1", title: "Penthouse Marina Dubaï", description: "", type: "penthouse", transactionType: "vente",
      price: 4500000, currency: "CHF", location: { city: "Dubaï", country: "EAU" },
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"],
      host: mockUsers["user-006"], bedrooms: 5, bathrooms: 4, area: 350, amenities: [], rating: 4.9, reviewCount: 18,
    },
    {
      id: "prop-d2", title: "Villa Palm Jumeirah", description: "", type: "villa", transactionType: "vente",
      price: 8200000, currency: "CHF", location: { city: "Dubaï", country: "EAU" },
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"],
      host: mockUsers["user-006"], bedrooms: 7, bathrooms: 6, area: 600, amenities: [], rating: 5.0, reviewCount: 9,
    },
  ],
  "user-015": [
    {
      id: "prop-n1", title: "Appartement vue lac Neuchâtel", description: "", type: "appartement", transactionType: "vente",
      price: 680000, currency: "CHF", location: { city: "Neuchâtel", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"],
      host: mockUsers["user-015"], bedrooms: 3, bathrooms: 2, area: 95, amenities: [], rating: 4.6, reviewCount: 7,
    },
    {
      id: "prop-n2", title: "Studio centre-ville Neuchâtel", description: "", type: "studio", transactionType: "location-ct",
      price: 110, currency: "CHF", location: { city: "Neuchâtel", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
      host: mockUsers["user-015"], bedrooms: 1, bathrooms: 1, area: 38, amenities: [], rating: 4.4, reviewCount: 14,
    },
  ],
  u1: [
    {
      id: "prop3", title: "Penthouse Genève", description: "", type: "penthouse", transactionType: "vente",
      price: 2800000, currency: "CHF", location: { city: "Genève", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"],
      host: mockUsers.u1, bedrooms: 4, bathrooms: 3, area: 200, amenities: [], rating: 4.9, reviewCount: 12,
    },
    {
      id: "prop4", title: "Studio Carouge", description: "", type: "studio", transactionType: "location-ct",
      price: 120, currency: "CHF", location: { city: "Carouge", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
      host: mockUsers.u1, bedrooms: 1, bathrooms: 1, area: 35, amenities: [], rating: 4.6, reviewCount: 22,
    },
  ],
  u2: [
    {
      id: "prop11", title: "Résidence Neuve Zürich", description: "", type: "appartement", transactionType: "vente",
      price: 980000, currency: "CHF", location: { city: "Zürich", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      host: mockUsers.u2, bedrooms: 3, bathrooms: 2, area: 95, amenities: [], rating: 4.8, reviewCount: 5,
    },
  ],
  u3: [
    {
      id: "prop4", title: "Riad de prestige Marrakech", description: "", type: "riad", transactionType: "vente",
      price: 450000, currency: "EUR", location: { city: "Marrakech", country: "Maroc" },
      images: ["https://images.unsplash.com/photo-1590059390258-ea0456c8548a?w=400&h=300&fit=crop"],
      host: mockUsers.u3, bedrooms: 5, bathrooms: 4, area: 320, amenities: [], rating: 4.9, reviewCount: 18,
    },
  ],
  u4: [
    {
      id: "prop10", title: "Projet résidentiel Zurich Nord", description: "", type: "appartement", transactionType: "vente",
      price: 1250000, currency: "CHF", location: { city: "Zurich", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      host: mockUsers.u4, bedrooms: 4, bathrooms: 2, area: 120, amenities: [], rating: 4.7, reviewCount: 8,
    },
  ],
};

const mockReviews: Record<string, { id: string; author: string; rating: number; text: string; date: string; reply: string | null }[]> = {
  "user-001": [
    { id: "r01", author: "Sophie D.", rating: 5, text: "Léo est un excellent hôte et formateur. Très professionnel.", date: "2026-03-20", reply: null },
    { id: "r02", author: "Marc F.", rating: 5, text: "Investisseur passionné, toujours de bons conseils.", date: "2026-03-12", reply: "Merci Marc !" },
  ],
  "user-002": [
    { id: "r03", author: "Léo M.", rating: 5, text: "Sophie offre un service impeccable. Biens de très grande qualité.", date: "2026-03-18", reply: null },
    { id: "r04", author: "Claire B.", rating: 4, text: "Très bonne expérience, communication fluide.", date: "2026-03-05", reply: "Merci Claire !" },
  ],
  "user-003": [
    { id: "r05", author: "Amina E.", rating: 5, text: "Marc connaît parfaitement le marché genevois. Recommandé.", date: "2026-03-15", reply: null },
    { id: "r06", author: "Lucas R.", rating: 4, text: "Agent fiable et réactif. Bonne collaboration.", date: "2026-02-28", reply: null },
  ],
  "user-004": [
    { id: "r07", author: "Sophie D.", rating: 5, text: "Amina est une formatrice exceptionnelle. Contenu de qualité.", date: "2026-03-22", reply: null },
    { id: "r08", author: "Léo M.", rating: 5, text: "Experte en marché marocain. Ses formations sont incontournables.", date: "2026-03-10", reply: "Merci Léo, ravie !" },
  ],
  "user-005": [
    { id: "r09", author: "Marc F.", rating: 5, text: "Lucas livre des villas exceptionnelles sur la Côte d'Azur.", date: "2026-03-14", reply: null },
    { id: "r10b", author: "Amina E.", rating: 4, text: "Très beau projet, finitions soignées.", date: "2026-02-20", reply: null },
  ],
  "user-006": [
    { id: "r-d1", author: "Khalid M.", rating: 5, text: "Yasmin connaît parfaitement le marché de Dubaï. Service impeccable.", date: "2026-03-25", reply: null },
    { id: "r-d2", author: "Sophie D.", rating: 5, text: "Agence très professionnelle. Villa exceptionnelle à Palm Jumeirah.", date: "2026-03-15", reply: "Merci Sophie !" },
  ],
  "user-015": [
    { id: "r-n1", author: "Pierre M.", rating: 5, text: "Jean-Luc est un agent de confiance. 20 ans d'expérience, ça se voit.", date: "2026-03-20", reply: null },
    { id: "r-n2", author: "Marie L.", rating: 4, text: "Bonne connaissance du marché neuchâtelois. Réactif et honnête.", date: "2026-03-10", reply: "Merci Marie !" },
  ],
  u1: [
    { id: "r10", author: "Marc T.", rating: 5, text: "Sophie est incroyable, très professionnelle.", date: "2026-03-18", reply: null },
    { id: "r11", author: "Laura K.", rating: 5, text: "Service impeccable du début à la fin.", date: "2026-03-10", reply: "Merci beaucoup Laura !" },
    { id: "r12", author: "Jean-Pierre V.", rating: 5, text: "Courtière de confiance, elle connaît parfaitement le marché lémanique. Vente conclue en 3 semaines.", date: "2026-02-25", reply: "Merci Jean-Pierre, ravie d'avoir pu vous accompagner !" },
  ],
  u2: [
    { id: "r20", author: "Pierre N.", rating: 5, text: "Marc est un excellent formateur, ses analyses financières sont très pertinentes.", date: "2026-03-12", reply: null },
    { id: "r21", author: "Sophie B.", rating: 4, text: "Formation de qualité, très bon investisseur.", date: "2026-02-28", reply: "Merci Sophie, ravi que la formation vous ait plu !" },
  ],
  u3: [
    { id: "r30", author: "Laurent M.", rating: 5, text: "Amira connaît parfaitement le marché marocain. Service irréprochable.", date: "2026-03-15", reply: null },
    { id: "r31", author: "Catherine D.", rating: 5, text: "Agence de confiance, très professionnelle. Le riad trouvé est magnifique.", date: "2026-02-20", reply: "Merci Catherine, bienvenue à Marrakech !" },
  ],
  u4: [
    { id: "r40", author: "Hans K.", rating: 4, text: "Thomas livre des projets de qualité dans les délais.", date: "2026-03-10", reply: null },
    { id: "r41", author: "Markus W.", rating: 5, text: "Excellent promoteur, finitions haut de gamme.", date: "2026-02-15", reply: null },
  ],
  g1: [
    { id: "r50", author: "Agent A.", rating: 5, text: "Cliente agréable et décisive. Transaction fluide.", date: "2026-03-08", reply: null },
  ],
  g2: [
    { id: "r60", author: "Conseiller B.", rating: 4, text: "Client sérieux, bon dossier financier.", date: "2026-03-05", reply: null },
  ],
  g3: [
    { id: "r70", author: "Agent C.", rating: 5, text: "Marie sait exactement ce qu'elle veut. Collaboration très agréable.", date: "2026-03-01", reply: null },
  ],
};

const mockPosts: Record<string, SocialPost[]> = {
  "user-001": [
    {
      id: "sp01", author: mockUsers["user-001"], content: "Nouvelle formation en ligne sur l'investissement locatif. Inscrivez-vous dès maintenant sur E-Dome !",
      media: ["https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop"],
      type: "post", likes: 85, comments: [], createdAt: "2026-03-25T09:00:00",
    },
  ],
  "user-002": [
    {
      id: "sp02", author: mockUsers["user-002"], content: "Ravie d'accueillir mes premiers hôtes dans le nouvel appartement à Lausanne. Vue imprenable sur le lac !",
      media: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"],
      type: "post", likes: 52, comments: [], createdAt: "2026-03-20T14:00:00",
    },
  ],
  "user-003": [
    {
      id: "sp03", author: mockUsers["user-003"], content: "Le marché immobilier genevois reste dynamique en 2026. Analyse complète disponible sur mon profil.",
      media: [], type: "post", likes: 41, comments: [], createdAt: "2026-03-18T10:00:00",
    },
  ],
  "user-004": [
    {
      id: "sp04", author: mockUsers["user-004"], content: "Session de formation en direct depuis Marrakech ce week-end. Investissement locatif dans les marchés émergents.",
      media: ["https://images.unsplash.com/photo-1590059390258-ea0456c8548a?w=600&h=400&fit=crop"],
      type: "post", likes: 73, comments: [], createdAt: "2026-03-22T11:00:00",
    },
  ],
  "user-005": [
    {
      id: "sp05", author: mockUsers["user-005"], content: "Nouveau projet de villa de prestige à Nice. Livraison prévue fin 2026. Contactez-moi pour plus de détails.",
      media: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"],
      type: "post", likes: 36, comments: [], createdAt: "2026-03-19T15:00:00",
    },
  ],
  "user-006": [
    {
      id: "sp06", author: mockUsers["user-006"], content: "Nouvelle résidence de luxe disponible à Dubai Marina. Vue panoramique sur la skyline.",
      media: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"],
      type: "post", likes: 124, comments: [], createdAt: "2026-03-27T12:00:00",
    },
  ],
  "user-015": [
    {
      id: "sp15", author: mockUsers["user-015"], content: "Bel appartement avec vue sur le lac de Neuchâtel, idéal pour un premier investissement.",
      media: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop"],
      type: "post", likes: 28, comments: [], createdAt: "2026-03-24T09:00:00",
    },
  ],
  u1: [
    {
      id: "sp10", author: mockUsers.u1, content: "Nouvelle vente conclue à Genève ! Un magnifique penthouse avec vue sur le jet d'eau.",
      media: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"],
      type: "post", likes: 64, comments: [], createdAt: "2026-03-22T10:00:00",
    },
    {
      id: "sp11", author: mockUsers.u1, content: "Ravie de participer au salon de l'immobilier de Genève cette année. Venez me rencontrer au stand 12 !",
      media: [], type: "post", likes: 38, comments: [], createdAt: "2026-03-15T14:00:00",
    },
  ],
  u2: [
    {
      id: "sp20", author: mockUsers.u2, content: "Nouvelle analyse financière publiée : rendements locatifs 2026 en Suisse alémanique. Des opportunités à saisir !",
      media: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop"],
      type: "post", likes: 112, comments: [], createdAt: "2026-03-20T09:00:00",
    },
  ],
  u3: [
    {
      id: "sp30", author: mockUsers.u3, content: "Magnifique riad rénové dans la médina de Marrakech. Un bijou architectural disponible à la vente.",
      media: ["https://images.unsplash.com/photo-1590059390258-ea0456c8548a?w=600&h=400&fit=crop"],
      type: "post", likes: 87, comments: [], createdAt: "2026-03-18T11:00:00",
    },
  ],
  u4: [
    {
      id: "sp40", author: mockUsers.u4, content: "Nouveau projet résidentiel à Zurich Nord : 32 appartements modernes avec label Minergie. Livraison 2027.",
      media: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop"],
      type: "post", likes: 95, comments: [], createdAt: "2026-03-16T08:00:00",
    },
  ],
};

const ratingBreakdowns: Record<string, { stars: number; count: number }[]> = {
  "user-001": [{ stars: 5, count: 60 }, { stars: 4, count: 20 }, { stars: 3, count: 5 }, { stars: 2, count: 2 }, { stars: 1, count: 0 }],
  "user-002": [{ stars: 5, count: 28 }, { stars: 4, count: 10 }, { stars: 3, count: 3 }, { stars: 2, count: 1 }, { stars: 1, count: 0 }],
  "user-003": [{ stars: 5, count: 25 }, { stars: 4, count: 12 }, { stars: 3, count: 4 }, { stars: 2, count: 1 }, { stars: 1, count: 0 }],
  "user-004": [{ stars: 5, count: 70 }, { stars: 4, count: 20 }, { stars: 3, count: 6 }, { stars: 2, count: 2 }, { stars: 1, count: 0 }],
  "user-005": [{ stars: 5, count: 35 }, { stars: 4, count: 15 }, { stars: 3, count: 4 }, { stars: 2, count: 2 }, { stars: 1, count: 0 }],
  u1: [{ stars: 5, count: 35 }, { stars: 4, count: 5 }, { stars: 3, count: 2 }, { stars: 2, count: 0 }, { stars: 1, count: 0 }],
  u2: [{ stars: 5, count: 50 }, { stars: 4, count: 20 }, { stars: 3, count: 5 }, { stars: 2, count: 2 }, { stars: 1, count: 1 }],
  u3: [{ stars: 5, count: 30 }, { stars: 4, count: 10 }, { stars: 3, count: 4 }, { stars: 2, count: 1 }, { stars: 1, count: 0 }],
  u4: [{ stars: 5, count: 55 }, { stars: 4, count: 25 }, { stars: 3, count: 8 }, { stars: 2, count: 3 }, { stars: 1, count: 1 }],
  g1: [{ stars: 5, count: 4 }, { stars: 4, count: 1 }, { stars: 3, count: 0 }, { stars: 2, count: 0 }, { stars: 1, count: 0 }],
  g2: [{ stars: 5, count: 1 }, { stars: 4, count: 2 }, { stars: 3, count: 0 }, { stars: 2, count: 0 }, { stars: 1, count: 0 }],
  g3: [{ stars: 5, count: 5 }, { stars: 4, count: 2 }, { stars: 3, count: 0 }, { stars: 2, count: 0 }, { stars: 1, count: 0 }],
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function PublicProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isFollowing, toggleFollow, formatPrice } = useApp();
  const [tab, setTab] = useState<"biens" | "publications" | "avis" | "apropos">("biens");

  const user = mockUsers[id];
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Profil introuvable.</p>
      </div>
    );
  }

  const properties = mockProperties[id] || [];
  const reviews = mockReviews[id] || [];
  const breakdown = ratingBreakdowns[id] || [];
  const totalReviews = breakdown.reduce((s, r) => s + r.count, 0);
  const following = isFollowing(id);
  const propertyCount = properties.length;

  const tabs = [
    { key: "biens" as const, label: "Biens" },
    { key: "publications" as const, label: "Publications" },
    { key: "avis" as const, label: "Avis" },
    { key: "apropos" as const, label: "À propos" },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Cover */}
      <div className="relative h-48 md:h-56 rounded-b-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C4956A] via-[#C4956A]/60 to-[var(--background)]" />
      </div>

      <div className="px-4 md:px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <img src={user.avatar} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-[var(--background)]" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {roleLabels[user.activeRole]} - {user.city}, {user.country}
            </p>
          </div>
          <div className="flex gap-2 self-start md:self-auto">
            <button
              onClick={() => toggleFollow(id)}
              className={`px-5 py-2 text-sm rounded-xl transition-colors ${
                following
                  ? "bg-[var(--card)] border border-[#C4956A] text-[#C4956A]"
                  : "bg-[#C4956A] text-white hover:bg-[#b8845a]"
              }`}
            >
              {following ? "Suivi" : "Suivre"}
            </button>
            <Link
              href="/messages"
              className="px-5 py-2 text-sm rounded-xl border border-[var(--card-border)] text-[var(--foreground)] hover:border-[#C4956A]/50 transition-colors"
            >
              Contacter
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 flex-wrap">
          {[
            { label: "Biens", value: propertyCount },
            { label: "Abonnés", value: user.stats.followers },
            { label: "Suivis", value: user.stats.following },
            { label: "Note", value: `${user.stats.rating}/5` },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold text-[var(--foreground)]">
                {typeof s.value === "number" ? formatCount(s.value) : s.value}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 mt-8">
        <div className="flex gap-1 border-b border-[var(--card-border)]">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                tab === t.key ? "text-[#C4956A]" : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t.label}
              {tab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4956A] rounded-full" />}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "biens" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.length === 0 ? (
                <p className="text-[var(--text-muted)] col-span-full text-center py-12">Aucun bien publié.</p>
              ) : (
                properties.map((p) => (
                  <Link
                    key={p.id}
                    href={`/explorer/${p.id}`}
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden hover:border-[#C4956A]/30 transition-colors"
                  >
                    <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] truncate">{p.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{p.location.city}, {p.location.country}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-[#C4956A]">
                          {formatPrice(p.price, p.currency)}
                          {p.transactionType === "location-ct" ? "/nuit" : ""}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{p.rating} ({p.reviewCount})</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {tab === "publications" && (
            <div className="space-y-4">
              {(mockPosts[id] || []).length === 0 ? (
                <div className="text-center py-12 text-[var(--text-muted)]">Aucune publication pour le moment.</div>
              ) : (
                (mockPosts[id] || []).map((post) => (
                  <div key={post.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                    <p className="text-sm text-[var(--foreground)]">{post.content}</p>
                    {post.media.length > 0 && (
                      <img src={post.media[0]} alt="" className="w-full h-48 object-cover rounded-lg mt-3" />
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                      <span>{post.likes} likes</span>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "avis" && (
            <div className="space-y-6">
              {breakdown.length > 0 && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[var(--foreground)]">{user.stats.rating}</div>
                      <div className="text-sm text-[var(--text-muted)]">{totalReviews} avis</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {breakdown.map((r) => (
                        <div key={r.stars} className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-muted)] w-3">{r.stars}</span>
                          <div className="flex-1 h-2 bg-[var(--input-bg)] rounded-full overflow-hidden">
                            <div className="h-full bg-[#C4956A] rounded-full" style={{ width: `${totalReviews > 0 ? (r.count / totalReviews) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-[var(--text-muted)] w-6 text-right">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">{review.author}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{review.text}</p>
                  <div className="text-xs text-[var(--text-muted)] mt-2">{review.date}</div>
                  {review.reply && (
                    <div className="mt-3 pl-4 border-l-2 border-[#C4956A]/30">
                      <p className="text-sm text-[var(--text-secondary)] italic">{review.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "apropos" && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Bio</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{user.bio}</p>
              </div>
              {user.languages && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Langues</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((l) => (
                      <span key={l} className="px-3 py-1 text-xs rounded-full bg-[#C4956A]/10 text-[#C4956A]">{l}</span>
                    ))}
                  </div>
                </div>
              )}
              {user.certifications && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Certifications</h3>
                  <ul className="space-y-2">
                    {user.certifications.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[#C4956A]">✓</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {user.responseTime && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Temps de réponse</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{user.responseTime}</p>
                </div>
              )}
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Membre depuis</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {{ "user-001": "Janvier 2022", "user-002": "Mars 2023", "user-003": "Juin 2022", "user-004": "Janvier 2024", "user-005": "Septembre 2023", u1: "Mars 2023", u2: "Juin 2022", u3: "Janvier 2024", u4: "Septembre 2023", g1: "Février 2025", g2: "Mai 2025", g3: "Novembre 2024" }[id] || "Janvier 2025"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
