"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { AffiliationToggle, type AffiliationValue } from "@/components/business/affiliation-toggle";
import { defaultAffiliationRate } from "@/lib/pricing";
import { pctLabel } from "@/lib/demo/affiliation";
import { recordSessionEvent } from "@/lib/use-session";
import { useActor } from "@/lib/use-actor";
import { eventIdOf } from "@/lib/demo/session-store";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface EventForm {
  titre: string;
  type: string;
  date: string;
  heure: string;
  duree: string;
  enLigne: boolean;
  lieu: string;
  description: string;
  image: string;
  places: number;
  prix: number;
}

const TYPES = ["Webinaire", "Conférence", "Atelier", "Networking", "Formation live"];

const emptyForm: EventForm = {
  titre: "", type: "", date: "", heure: "", duree: "", enLigne: false, lieu: "", description: "", image: "",
  places: 0, prix: 0,
};

const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/50 transition-colors";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CreerEvenementPage() {
  const { formatPrice } = useApp();
  const [form, setForm] = useState<EventForm>(emptyForm);
  /* Correctif P6c : « Publier » affichait « maintenant visible » sans rien
     créer, et l'intervenant était un nom libre (donc inventé). L'événement
     entre désormais au journal de session (`event.published`) et
     l'organisateur est la personne incarnée. */
  const actor = useActor();
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [affiliation, setAffiliation] = useState<AffiliationValue>({ open: false, rate: defaultAffiliationRate("evenement") });

  const update = <K extends keyof EventForm>(key: K, value: EventForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePublish = () => {
    if (form.titre.trim().length < 5 || !form.type || !form.date || !form.heure || !(form.places > 0) || (!form.enLigne && !form.lieu.trim())) {
      setError("Indiquez un titre (cinq caractères au moins), un type, une date, une heure, un lieu et un nombre de places.");
      return;
    }
    const ev = recordSessionEvent({
      kind: "event.published",
      data: {
        titre: form.titre.trim(),
        type: form.type,
        date: form.date,
        heure: form.heure,
        duree: form.duree.trim() || "1h",
        lieu: form.enLigne ? "En ligne" : form.lieu.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        places: Math.round(form.places),
        prix: Math.max(0, Math.round(form.prix || 0)),
        affiliationRate: affiliation.open && form.prix > 0 ? affiliation.rate : undefined,
      },
    });
    setError(null);
    setPublishedId(eventIdOf(ev.seq));
  };

  if (publishedId) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl page-heading mb-2">Événement publié !</h1>
          <p className="text-[var(--text-secondary)] mb-6">Votre événement &quot;{form.titre}&quot; est maintenant visible.</p>
          {affiliation.open && form.prix > 0 && (
            <p className="text-sm text-[var(--text-muted)] -mt-4 mb-6">Ouvert à l&apos;affiliation à {pctLabel(affiliation.rate)} du prix du billet.</p>
          )}
          <a href={`/evenements/${publishedId}`} className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors inline-block">
            Voir l&apos;événement
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl page-heading mb-2">Créer un événement</h1>
        <p className="text-[var(--text-secondary)] mb-8">Remplissez les informations de votre événement</p>

        <div className="space-y-5">
          <div>
            <label className={labelCls}>Titre de l&apos;événement</label>
            <input className={inputCls} placeholder="Ex: Webinaire immobilier 2026" value={form.titre} onChange={(e) => update("titre", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Type d&apos;événement</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={t} onClick={() => update("type", t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${form.type === t ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} value={form.date} onChange={(e) => update("date", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Heure</label>
              <input type="time" className={inputCls} value={form.heure} onChange={(e) => update("heure", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Durée</label>
              <input className={inputCls} placeholder="Ex: 2h" value={form.duree} onChange={(e) => update("duree", e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className={`${labelCls} mb-0`}>Lieu</label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                <button onClick={() => update("enLigne", !form.enLigne)} className={`w-10 h-5 rounded-full transition-colors relative ${form.enLigne ? "bg-[var(--primary)]" : "bg-[var(--text-muted)]"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.enLigne ? "left-5" : "left-0.5"}`} />
                </button>
                En ligne
              </label>
            </div>
            {!form.enLigne && (
              <input className={inputCls} placeholder="Adresse du lieu" value={form.lieu} onChange={(e) => update("lieu", e.target.value)} />
            )}
            {form.enLigne && <p className="text-sm text-[var(--primary)]">L&apos;événement se déroulera en ligne. Un lien sera envoyé aux participants.</p>}
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} min-h-[120px] resize-y`} placeholder="Décrivez votre événement..." value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Image de couverture (URL)</label>
            <input className={inputCls} placeholder="https://..." value={form.image} onChange={(e) => update("image", e.target.value)} />
            {form.image && <img src={form.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-xl" />}
          </div>

          {/* L'organisateur : la personne incarnée, jamais un nom saisi */}
          <div className="p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl flex items-center gap-3">
            <img src={actor.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm text-[var(--text-muted)]">Organisateur</p>
              <p className="font-medium">{actor.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nombre de places</label>
              <input type="number" className={inputCls} placeholder="100" value={form.places || ""} onChange={(e) => update("places", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Prix (0 = Gratuit)</label>
              <input type="number" className={inputCls} placeholder="0" value={form.prix || ""} onChange={(e) => update("prix", Number(e.target.value))} />
              {form.prix > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">Affiche : {formatPrice(form.prix)}</p>}
              {form.prix === 0 && <p className="text-xs text-green-400 mt-1">Gratuit</p>}
            </div>
          </div>

          <AffiliationToggle pole="evenement" priceChf={form.prix} value={affiliation} onChange={setAffiliation} priceLabel="par billet" />

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <button onClick={handlePublish} className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors mt-4">
            Publier l&apos;événement
          </button>
        </div>
      </div>
    </div>
  );
}
