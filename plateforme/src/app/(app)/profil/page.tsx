"use client";

import React, { useState } from "react";
import { ProfileVitrine, type ProfileUser, type ProfileData } from "@/components/profile/profile-vitrine";

/* /profil — mon profil. Consomme <ProfileVitrine> avec isOwn=true.
   Données fictives partagées avec /profil/[id] pour cohérence visuelle. */

const ME: ProfileUser = {
  id: "me",
  firstName: "Léo",
  lastName: "Martin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240",
  city: "Lausanne",
  country: "Suisse",
  roles: ["Hôte", "Formateur", "Apporteur", "Investisseur"],
  bio: "Passionné d'immobilier depuis 15 ans. Hôte actif en Suisse romande, formateur certifié USPI et apporteur d'affaires.",
  isMembreFondateur: true,
  stats: { followers: 2340, following: 812, rating: 4.8, reviewsCount: 56 },
};

const DATA: ProfileData = {
  publications: [
    { id: "pub1", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", caption: "Visite du jour : villa contemporaine à Genolier." },
    { id: "pub2", src: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=600", caption: "Chalet Verbier sous la première neige." },
    { id: "pub3", src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600", caption: "Aménagement intérieur signé Studio Verbier." },
    { id: "pub4", src: "https://images.unsplash.com/photo-1590073242678-70ee818e55fb?w=600", caption: "Riad Marrakech — patio rénové." },
    { id: "pub5", src: "https://images.unsplash.com/photo-1600047509807-ba7fdd402464?w=600", caption: "Penthouse Montreux, vue lac." },
    { id: "pub6", src: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600", caption: "Évolution du rendement locatif 2026." },
  ],
  biens: [
    { id: "prop1", title: "Chalet Alpin Premium", cover: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600", price: 350, currency: "CHF", unit: "/nuit", location: "Verbier, Suisse" },
    { id: "prop2", title: "Appartement Vue Lac", cover: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", price: 1_250_000, currency: "CHF", unit: "", location: "Montreux, Suisse" },
    { id: "prop3", title: "Villa Prestige", cover: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600", price: 3_200_000, currency: "CHF", unit: "", location: "Lausanne, Suisse" },
    { id: "prop4", title: "Studio Zurich Centre", cover: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600", price: 180, currency: "CHF", unit: "/nuit", location: "Zurich, Suisse" },
  ],
  produits: [
    { id: "prod1", title: "Plaid lin lavé bleu nuit", cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", price: 89, currency: "CHF", stock: 14 },
    { id: "prod2", title: "Lampe céramique nordique", cover: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600", price: 145, currency: "CHF", stock: 6 },
    { id: "prod3", title: "Vase grès noir mat", cover: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", price: 65, currency: "CHF", stock: 22 },
  ],
  formations: [
    { id: "form-001", title: "Investissement locatif : de zéro à rentier", cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", price: 497, currency: "CHF", students: 342, rating: 4.9 },
    { id: "form-002", title: "Maîtriser la gestion locative CT", cover: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600", price: 397, currency: "CHF", students: 178, rating: 4.8 },
  ],
  lives: [
    { id: "live1", title: "Décrypter les annonces immobilières", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", status: "scheduled", scheduledAt: "2026-06-12 19:00", expectedViewers: 320 },
    { id: "live2", title: "Q&R : fiscalité locative en Suisse", cover: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600", status: "replay", replayViews: 1240 },
  ],
  services: [
    { id: "s1", title: "Conseil investissement personnalisé", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 250, currency: "CHF", unit: "/h" },
    { id: "s2", title: "Audit de portefeuille immobilier", cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", price: 1800, currency: "CHF", unit: "" },
  ],
  avis: [
    { id: "r1", author: "Jean-Pierre M.", rating: 5, text: "Hôte exceptionnel, chalet magnifique et communication parfaite.", date: "15 mars 2026" },
    { id: "r2", author: "Marie L.", rating: 5, text: "Formation très claire et actionnable. J'ai investi 3 mois après.", date: "28 fév. 2026" },
    { id: "r3", author: "Thomas K.", rating: 5, text: "Appartement propre, moderne et lumineux. Vue sur le Léman à couper le souffle.", date: "10 jan. 2026" },
    { id: "r4", author: "Amira B.", rating: 5, text: "Formation investissement top niveau. Les modules fiscalité sont très utiles.", date: "5 jan. 2026" },
    { id: "r5", author: "Pierre S.", rating: 4, text: "Apporteur fiable et sérieux. Rémunération versée rapidement.", date: "20 déc. 2025" },
  ],
  ratingBreakdown: [
    { stars: 5, count: 4 },
    { stars: 4, count: 1 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
};

export default function ProfilPage() {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <ProfileVitrine user={ME} data={DATA} isOwn onEdit={() => setShowEditModal(true)} />

      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
              Modifier le profil
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Formulaire d&apos;édition (maquette).
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 text-sm rounded-xl transition-colors"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--text-secondary)",
                  background: "var(--card)",
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
