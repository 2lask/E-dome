"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ServiceForm {
  titre: string;
  categorie: string;
  description: string;
  zone: string;
  tarif: number;
  uniteTarif: string;
  disponibilites: boolean[];
  photos: string[];
}

const CATEGORIES = ["Conciergerie", "Transport", "Photographie", "Decoration", "Juridique", "Finance", "Renovation", "Demenagement"];
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const emptyForm: ServiceForm = {
  titre: "", categorie: "", description: "", zone: "", tarif: 0, uniteTarif: "/h",
  disponibilites: [true, true, true, true, true, false, false],
  photos: [],
};

const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A]/50 transition-colors";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProposerServicePage() {
  const { formatPrice } = useApp();
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [published, setPublished] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const update = <K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDay = (index: number) => {
    const next = [...form.disponibilites];
    next[index] = !next[index];
    update("disponibilites", next);
  };

  const addPhoto = () => {
    if (photoUrl.trim()) {
      update("photos", [...form.photos, photoUrl.trim()]);
      setPhotoUrl("");
    }
  };

  const removePhoto = (index: number) => {
    update("photos", form.photos.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    setPublished(true);
  };

  if (published) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Service publie !</h1>
          <p className="text-[var(--text-secondary)] mb-6">Votre service &quot;{form.titre}&quot; est maintenant disponible sur la plateforme.</p>
          <a href="/services" className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors inline-block">
            Voir les services
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Proposer un service</h1>
        <p className="text-[var(--text-secondary)] mb-8">Décrivez le service que vous souhaitez proposer</p>

        <div className="space-y-5">
          <div>
            <label className={labelCls}>Titre du service</label>
            <input className={inputCls} placeholder="Ex: Photographie immobiliere professionnelle" value={form.titre} onChange={(e) => update("titre", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Categorie</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => update("categorie", c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${form.categorie === c ? "bg-[#C4956A] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#C4956A]/40"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} min-h-[120px] resize-y`} placeholder="Décrivez votre service en détail..." value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Zone d&apos;intervention</label>
            <input className={inputCls} placeholder="Ex: Suisse romande, Geneve, Lausanne..." value={form.zone} onChange={(e) => update("zone", e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tarif</label>
              <input type="number" className={inputCls} placeholder="0" value={form.tarif || ""} onChange={(e) => update("tarif", Number(e.target.value))} />
              {form.tarif > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">Affiche : {formatPrice(form.tarif)}{form.uniteTarif}</p>}
            </div>
            <div>
              <label className={labelCls}>Unite</label>
              <select className={inputCls} value={form.uniteTarif} onChange={(e) => update("uniteTarif", e.target.value)}>
                <option value="/h">/heure</option>
                <option value="/seance">/seance</option>
                <option value="/jour">/jour</option>
                <option value="/projet">/projet</option>
                <option value="/mois">/mois</option>
              </select>
            </div>
          </div>

          {/* Disponibilites */}
          <div>
            <label className={labelCls}>Disponibilites</label>
            <div className="flex gap-2">
              {JOURS.map((jour, i) => (
                <button
                  key={jour}
                  onClick={() => toggleDay(i)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${form.disponibilites[i] ? "bg-[#C4956A] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-muted)]"}`}
                >
                  {jour}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className={labelCls}>Photos (URLs)</label>
            <div className="flex gap-2 mb-2">
              <input className={`${inputCls} flex-1`} placeholder="https://..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
              <button onClick={addPhoto} className="px-4 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">
                Ajouter
              </button>
            </div>
            {form.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {form.photos.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-24 object-cover rounded-xl" />
                    <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handlePublish} className="w-full py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors mt-4">
            Publier le service
          </button>
        </div>
      </div>
    </div>
  );
}
