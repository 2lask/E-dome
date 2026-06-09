"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "@/lib/context";
import type { TransactionType, PropertyType } from "@/lib/types";
import { LottiePlayer } from "@/components/ui/lottie-player";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface PublishForm {
  transactionType: TransactionType | "";
  propertyType: PropertyType | "";
  adresse: string;
  ville: string;
  codePostal: string;
  prix: number;
  chambres: number;
  sallesDeBain: number;
  surface: number;
  titre: string;
  description: string;
  photos: string[];
  video: string;
  equipements: string[];
  documents: string[];
  // Analytics (vente only)
  rendementBrut: number;
  dpe: string;
  roi5ans: number;
  roi10ans: number;
  chargesAnnuelles: number;
  anneeConstruction: number;
  etatGeneral: string;
  potentielPlusValue: number;
  tauxOccupation: number;
  // Apporteurs — V1.0 : seul controle vendeur = ON/OFF (opt-in).
  // Le taux 10-30 % est fixe par la plateforme selon le pole, jamais
  // par le vendeur. Aucun champ commissionApporteur cote form.
  autoriserApporteurs: boolean;
  // Options
  optionMiseEnAvant: boolean;
  optionPhotosPro: boolean;
  optionVisite3D: boolean;
  termsAccepted: boolean;
}

const STORAGE_KEY = "edome_publish_draft";
const DRAFTS_KEY = "edome_publish_drafts";

const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "vente", label: "Vente" },
  { value: "location-ct", label: "Location courte durée" },
  { value: "location-lt", label: "Location longue durée" },
];

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "appartement", label: "Appartement" },
  { value: "villa", label: "Villa" },
  { value: "maison", label: "Maison" },
  { value: "chalet", label: "Chalet" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
  { value: "terrain", label: "Terrain" },
  { value: "commercial", label: "Commercial" },
  { value: "bureau", label: "Bureau" },
  { value: "riad", label: "Riad" },
];

const EQUIPEMENTS = [
  "Parking", "Balcon", "Terrasse", "Jardin", "Piscine", "Cave", "Ascenseur",
  "Lave-vaisselle", "Machine à laver", "Climatisation", "Cheminée", "Sauna",
  "Wifi", "Vue lac", "Vue montagne", "Meublé",
];

const DPE_OPTIONS = ["A", "B", "C", "D", "E", "F", "G"];
const ETAT_OPTIONS = ["Neuf", "Excellent", "Bon", "A renover", "A restaurer"];

const emptyForm: PublishForm = {
  transactionType: "", propertyType: "", adresse: "", ville: "", codePostal: "", prix: 0,
  chambres: 1, sallesDeBain: 1, surface: 0, titre: "", description: "",
  photos: [], video: "", equipements: [], documents: [],
  rendementBrut: 0, dpe: "C", roi5ans: 0, roi10ans: 0, chargesAnnuelles: 0,
  anneeConstruction: 2000, etatGeneral: "Bon", potentielPlusValue: 0, tauxOccupation: 0,
  autoriserApporteurs: true,
  optionMiseEnAvant: false, optionPhotosPro: false, optionVisite3D: false, termsAccepted: false,
};

const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function PublierPage() {
  const { formatPrice } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PublishForm>(emptyForm);
  const [published, setPublished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [drafts, setDrafts] = useState<{ id: string; titre: string; date: string }[]>([]);
  const [photoInput, setPhotoInput] = useState("");
  const [docInput, setDocInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isVente = form.transactionType === "vente";
  const totalSteps = isVente ? 7 : 6;
  const [toastMsg, setToastMsg] = useState("");

  // Load form + drafts
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm(JSON.parse(saved));
      const savedDrafts = localStorage.getItem(DRAFTS_KEY);
      if (savedDrafts) setDrafts(JSON.parse(savedDrafts));
    } catch { /* ignore */ }
  }, []);

  // Persist form
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const update = useCallback(<K extends keyof PublishForm>(key: K, value: PublishForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleEquipement = (eq: string) => {
    setForm((prev) => ({
      ...prev,
      equipements: prev.equipements.includes(eq) ? prev.equipements.filter((e) => e !== eq) : [...prev.equipements, eq],
    }));
  };

  const addPhoto = () => { if (photoInput.trim()) { update("photos", [...form.photos, photoInput.trim()]); setPhotoInput(""); } };
  const removePhoto = (i: number) => { update("photos", form.photos.filter((_, idx) => idx !== i)); };
  const reorderPhoto = (from: number, to: number) => {
    const arr = [...form.photos];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    update("photos", arr);
  };
  const addDoc = () => { if (docInput.trim()) { update("documents", [...form.documents, docInput.trim()]); setDocInput(""); } };

  /* Draft system */
  const saveDraft = () => {
    const id = `draft-${Date.now()}`;
    const newDraft = { id, titre: form.titre || "Sans titre", date: new Date().toLocaleDateString("fr-CH") };
    const allDrafts = [...drafts, newDraft];
    setDrafts(allDrafts);
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(allDrafts));
      localStorage.setItem(`edome_draft_${id}`, JSON.stringify(form));
    } catch { /* ignore */ }
  };

  const loadDraft = (draftId: string) => {
    try {
      const saved = localStorage.getItem(`edome_draft_${draftId}`);
      if (saved) { setForm(JSON.parse(saved)); setStep(1); }
    } catch { /* ignore */ }
  };

  const deleteDraft = (draftId: string) => {
    const newDrafts = drafts.filter((d) => d.id !== draftId);
    setDrafts(newDrafts);
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts));
      localStorage.removeItem(`edome_draft_${draftId}`);
    } catch { /* ignore */ }
  };

  const handlePublish = () => {
    setShowConfetti(true);
    setToastMsg("Bien publié avec succès ! Il est maintenant visible dans l'Explorer. (démonstration)");
    setTimeout(() => { setPublished(true); try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }, 2500);
    setTimeout(() => setToastMsg(""), 5000);
  };

  /* ── Published success ──────────────────────────────────────────────── */

  if (published) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl page-heading mb-2">Bien publié avec succès !</h1>
          <p className="text-[var(--text-secondary)] mb-6">Votre annonce &quot;{form.titre}&quot; est maintenant en ligne.</p>
          <a href="/explorer" className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors inline-block">
            Voir l&apos;annonce
          </a>
        </div>
      </div>
    );
  }

  /* ── Confetti overlay ───────────────────────────────────────────────── */

  const confettiOverlay = showConfetti && !published && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 pointer-events-none">
      <div className="text-center animate-scale-in">
        <div className="text-6xl mb-4">&#127881;</div>
        <p className="text-2xl font-bold text-white">Publication en cours...</p>
      </div>
    </div>
  );

  /* ── Step labels ─────────────────────────────────────────────────────── */

  const stepLabels = isVente
    ? ["Type & Adresse", "Détails", "Médias", "Analytics", "Équipements", "Apporteurs", "Options & Publication"]
    : ["Type & Adresse", "Détails", "Médias", "Équipements", "Apporteurs", "Options & Publication"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {confettiOverlay}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl page-heading">Publier un bien</h1>
            <p className="text-[var(--text-secondary)] mt-1">Étape {step} sur {totalSteps}</p>
          </div>
          <button onClick={saveDraft} className="px-4 py-2 border border-[var(--card-border)] rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
            Sauvegarder brouillon
          </button>
        </div>

        {/* Drafts */}
        {drafts.length > 0 && (
          <div className="mb-6 p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Brouillons</h3>
            <div className="space-y-1">
              {drafts.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <button onClick={() => loadDraft(d.id)} className="text-[#1e9df1] hover:underline">{d.titre} - {d.date}</button>
                  <button onClick={() => deleteDraft(d.id)} className="text-red-400 hover:text-red-300 text-xs">Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabels.map((s, i) => (
            <React.Fragment key={i}>
              <button onClick={() => setStep(i + 1)} className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${step === i + 1 ? "bg-[#1e9df1] text-white" : step > i + 1 ? "bg-[#1e9df1]/20 text-[#1e9df1]" : "bg-[var(--card)] text-[var(--text-muted)]"}`}>
                <span className="hidden sm:inline">{s}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
              {i < stepLabels.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-[#1e9df1]" : "bg-[var(--card-border)]"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Type & Address ──────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className={labelCls}>Type de transaction</label>
              <div className="grid grid-cols-3 gap-3">
                {TRANSACTION_TYPES.map((t) => (
                  <button key={t.value} onClick={() => update("transactionType", t.value)} className={`p-4 rounded-xl text-sm font-medium text-center transition-colors border ${form.transactionType === t.value ? "bg-[#1e9df1]/20 border-[#1e9df1] text-[#1e9df1]" : "bg-[var(--card)] border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/40"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Type de bien</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <button key={t.value} onClick={() => update("propertyType", t.value)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${form.propertyType === t.value ? "bg-[#1e9df1]/20 border-[#1e9df1] text-[#1e9df1]" : "bg-[var(--card)] border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/40"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div><label className={labelCls}>Adresse</label><input className={inputCls} placeholder="Rue et numero" value={form.adresse} onChange={(e) => update("adresse", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Ville</label><input className={inputCls} placeholder="Genève" value={form.ville} onChange={(e) => update("ville", e.target.value)} /></div>
              <div><label className={labelCls}>Code postal</label><input className={inputCls} placeholder="1200" value={form.codePostal} onChange={(e) => update("codePostal", e.target.value)} /></div>
            </div>
            <div>
              <label className={labelCls}>Prix</label>
              <input type="number" className={inputCls} placeholder="0" value={form.prix || ""} onChange={(e) => update("prix", Number(e.target.value))} />
              {form.prix > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">Affiche : {formatPrice(form.prix)}</p>}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 2: Details ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelCls}>Chambres</label><input type="number" className={inputCls} value={form.chambres} onChange={(e) => update("chambres", Number(e.target.value))} /></div>
              <div><label className={labelCls}>Salles de bain</label><input type="number" className={inputCls} value={form.sallesDeBain} onChange={(e) => update("sallesDeBain", Number(e.target.value))} /></div>
              <div><label className={labelCls}>Surface (m2)</label><input type="number" className={inputCls} value={form.surface || ""} onChange={(e) => update("surface", Number(e.target.value))} /></div>
            </div>
            <div><label className={labelCls}>Titre de l&apos;annonce</label><input className={inputCls} placeholder="Ex: Magnifique appartement avec vue lac" value={form.titre} onChange={(e) => update("titre", e.target.value)} /></div>
            <div><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[150px] resize-y`} placeholder="Décrivez votre bien en détail..." value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(3)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 3: Medias ──────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Photos */}
            <div>
              <label className={labelCls}>Photos</label>
              <div className="flex gap-2 mb-3">
                <input className={`${inputCls} flex-1`} placeholder="URL de la photo..." value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} />
                <button onClick={addPhoto} className="px-4 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Ajouter</button>
              </div>
              {/* Drag-reorder hint */}
              {form.photos.length > 1 && <p className="text-xs text-[var(--text-muted)] mb-2">Cliquez sur les flèches pour réordonner.</p>}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {form.photos.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-28 object-cover rounded-xl" />
                    {i === 0 && <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#1e9df1] text-white text-[10px] rounded-full">Principale</span>}
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {i > 0 && <button onClick={() => reorderPhoto(i, i - 1)} className="w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs">&lt;</button>}
                      {i < form.photos.length - 1 && <button onClick={() => reorderPhoto(i, i + 1)} className="w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs">&gt;</button>}
                      <button onClick={() => removePhoto(i)} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">X</button>
                    </div>
                  </div>
                ))}
                {/* Drop zone placeholder */}
                <button onClick={() => fileRef.current?.click()} className="h-28 border-2 border-dashed border-[var(--card-border)] rounded-xl flex flex-col items-center justify-center text-[var(--text-muted)] hover:border-[#1e9df1]/40 transition-colors">
                  <LottiePlayer src="/lottie/lottieflow-multimedia-8-5-000000-easey.json" width={40} height={40} />
                  <span className="text-xs">Glisser-déposer</span>
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  /* Upload reel local : URL.createObjectURL genere un blob:
                     accessible par le navigateur. Aucune requete reseau, l'image
                     vit en memoire jusqu'au rafraichissement de la page. */
                  const files = Array.from(e.target.files ?? []);
                  if (files.length === 0) return;
                  const urls = files.map((f) => URL.createObjectURL(f));
                  update("photos", [...form.photos, ...urls]);
                  e.target.value = "";
                }}
              />
            </div>

            {/* Video */}
            <div>
              <label className={labelCls}>Video (URL)</label>
              <input className={inputCls} placeholder="https://youtube.com/..." value={form.video} onChange={(e) => update("video", e.target.value)} />
            </div>

            {/* Documents */}
            <div>
              <label className={labelCls}>Documents (URLs)</label>
              <div className="flex gap-2 mb-2">
                <input className={`${inputCls} flex-1`} placeholder="URL du document..." value={docInput} onChange={(e) => setDocInput(e.target.value)} />
                <button onClick={addDoc} className="px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Ajouter</button>
              </div>
              {form.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] py-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="truncate flex-1">{doc}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(4)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 4: Equipements (non-vente) or Analytics (vente) ──── */}
        {step === 4 && !isVente && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-semibold">Équipements</h2>
            <div className="flex flex-wrap gap-2">
              {EQUIPEMENTS.map((eq) => (
                <button key={eq} onClick={() => toggleEquipement(eq)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${form.equipements.includes(eq) ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/40"}`}>
                  {eq}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(5)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {step === 4 && isVente && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-semibold">Données analytiques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Rendement brut (%)</label><input type="number" className={inputCls} value={form.rendementBrut || ""} onChange={(e) => update("rendementBrut", Number(e.target.value))} /></div>
              <div>
                <label className={labelCls}>DPE</label>
                <select className={inputCls} value={form.dpe} onChange={(e) => update("dpe", e.target.value)}>
                  {DPE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>ROI 5 ans (%)</label><input type="number" className={inputCls} value={form.roi5ans || ""} onChange={(e) => update("roi5ans", Number(e.target.value))} /></div>
              <div><label className={labelCls}>ROI 10 ans (%)</label><input type="number" className={inputCls} value={form.roi10ans || ""} onChange={(e) => update("roi10ans", Number(e.target.value))} /></div>
              <div>
                <label className={labelCls}>Charges annuelles</label>
                <input type="number" className={inputCls} value={form.chargesAnnuelles || ""} onChange={(e) => update("chargesAnnuelles", Number(e.target.value))} />
                {form.chargesAnnuelles > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">{formatPrice(form.chargesAnnuelles)}/an</p>}
              </div>
              <div><label className={labelCls}>Annee de construction</label><input type="number" className={inputCls} value={form.anneeConstruction} onChange={(e) => update("anneeConstruction", Number(e.target.value))} /></div>
              <div>
                <label className={labelCls}>Etat general</label>
                <select className={inputCls} value={form.etatGeneral} onChange={(e) => update("etatGeneral", e.target.value)}>
                  {ETAT_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Potentiel plus-value (%)</label><input type="number" className={inputCls} value={form.potentielPlusValue || ""} onChange={(e) => update("potentielPlusValue", Number(e.target.value))} /></div>
              <div><label className={labelCls}>Taux d&apos;occupation (%)</label><input type="number" className={inputCls} value={form.tauxOccupation || ""} onChange={(e) => update("tauxOccupation", Number(e.target.value))} /></div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(5)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 5: Equipements (vente path) ───────────────────────── */}
        {step === 5 && isVente && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-semibold">Équipements</h2>
            <div className="flex flex-wrap gap-2">
              {EQUIPEMENTS.map((eq) => (
                <button key={eq} onClick={() => toggleEquipement(eq)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${form.equipements.includes(eq) ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/40"}`}>
                  {eq}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(4)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(6)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 5/6: Apporteurs (non-vente=5, vente=6) ────────────── */}
        {step === (isVente ? 6 : 5) && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold">Apporteurs d&apos;affaires</h2>
            <p className="text-sm text-[var(--text-secondary)]">Permettez aux apporteurs d&apos;affaires de promouvoir votre bien et recevez plus de visibilité.</p>

            {/* Toggle autoriser */}
            <button
              onClick={() => update("autoriserApporteurs", !form.autoriserApporteurs)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${form.autoriserApporteurs ? "bg-[#1e9df1]/10 border-[#1e9df1]" : "bg-[var(--card)] border-[var(--card-border)] hover:border-[#1e9df1]/40"}`}
            >
              <div className="text-left">
                <h3 className="font-medium">Autoriser les apporteurs</h3>
                <p className="text-xs text-[var(--text-muted)]">Les apporteurs pourront partager votre annonce via leur lien personnel</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${form.autoriserApporteurs ? "bg-[#1e9df1]" : "bg-[var(--card-border)]"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.autoriserApporteurs ? "translate-x-6" : "translate-x-0.5"}`} />
              </div>
            </button>

            {/* Bloc lecture seule V1.0 — le taux apporteur est fixé par
                E-Dome, jamais par le vendeur. Le seul contrôle du vendeur est
                le toggle ON/OFF au-dessus (opt-out). Ici on affiche :
                - le rappel du modèle ("taux fixé par la plateforme"),
                - la fourchette indicative simulée sur le pôle de l'annonce,
                - le tracking. Pas de slider, pas d'input. */}
            {form.autoriserApporteurs && (
              <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-5">
                {/* Bandeau lecture seule */}
                <div className="p-4 rounded-xl bg-[#1e9df1]/5 border border-[#1e9df1]/20 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      Taux apporteur fixé par la plateforme
                    </span>
                    <span
                      className="text-sm font-semibold tabular-nums px-2.5 py-1 rounded-full"
                      style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                    >
                      10 – 30 %
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    Si activé, E-Dome reverse une part fixe de <strong>sa propre rémunération</strong> aux apporteurs — jamais ajoutée à ton prix, jamais payée par toi. Le taux (10 – 30 % selon le pôle) est défini par E-Dome, pas par le vendeur.
                  </p>
                </div>

                {/* Simulation adaptative par pôle — fourchette basse/haute */}
                {(() => {
                  // base = ce que E-Dome encaisse sur cette transaction.
                  let edomeRevenue = 0;
                  let baseLabel = "";
                  let priceLabel = "Prix";
                  if (form.transactionType === "vente" && form.prix > 0) {
                    edomeRevenue = form.prix < 1_000_000 ? 500 : 2500;
                    baseLabel = "Frais fixe E-Dome (vente particuliers)";
                    priceLabel = "Prix de vente";
                  } else if (form.transactionType === "location-ct" && form.prix > 0) {
                    edomeRevenue = form.prix * 0.08;
                    baseLabel = "Commission marketplace E-Dome (8 % standard)";
                    priceLabel = "Loyer par nuit";
                  } else if (form.transactionType === "location-lt") {
                    edomeRevenue = 250;
                    baseLabel = "Frais fixe E-Dome (bail médian, 6–12 mois)";
                  }
                  if (edomeRevenue === 0) return null;
                  const apporteurLow = edomeRevenue * 0.10;
                  const apporteurHigh = edomeRevenue * 0.30;
                  return (
                    <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] space-y-2.5">
                      <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Simulation pour cette annonce</h4>
                      {form.prix > 0 && form.transactionType !== "location-lt" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">{priceLabel}</span>
                          <span className="font-medium text-[var(--foreground)]">{formatPrice(form.prix)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">{baseLabel}</span>
                        <span className="font-medium text-[var(--foreground)]">{formatPrice(edomeRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Part apporteur (10 – 30 % de la rémunération E-Dome)</span>
                        <span className="font-medium text-[#1e9df1] tabular-nums">
                          {formatPrice(apporteurLow)} – {formatPrice(apporteurHigh)}
                        </span>
                      </div>
                      <div className="h-px bg-[var(--card-border)] my-1" />
                      <p className="text-xs italic text-[var(--text-muted)]">
                        Votre revenu reste identique avec ou sans apporteur — la part est prélevée sur ce qu&apos;E-Dome encaisse, jamais ajoutée à ce que paie l&apos;acheteur, le locataire ou le voyageur.
                      </p>
                    </div>
                  );
                })()}

                {/* Tracking details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Durée du cookie de tracking</p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">30 jours</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Attribution</p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Premier clic</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(isVente ? 5 : 4)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(totalSteps)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Final Step: Frais de publication + Options + Preview + Publish ────── */}
        {step === totalSteps && (
          <div className="space-y-6 animate-fade-in">
            {/* Bloc « Frais de publication » — V1.0 : adapte au type de transaction.
                - Vente : frais fixe 500 CHF (< 1 M) ou 2 500 CHF (≥ 1 M), dû à
                  la publication, indépendant du prix de vente, jamais un %.
                - Location LT : 150 / 250 / 400 CHF selon la durée du bail
                  (tarifs affichés à titre indicatif — la durée est précisée
                  au moment du contrat).
                - Location CT : publication gratuite, commission marketplace
                  5-10 % prélevée sur chaque réservation. */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Frais de publication</h2>
              {form.transactionType === "vente" && (
                <div className="p-5 rounded-2xl border border-[#1e9df1]/30 bg-[#1e9df1]/5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {form.prix > 0 && form.prix < 1_000_000
                        ? "Bien inférieur à 1 000 000 CHF"
                        : form.prix >= 1_000_000
                        ? "Bien supérieur ou égal à 1 000 000 CHF"
                        : "Selon le prix renseigné à l'étape 2"}
                    </p>
                    <span className="text-2xl font-bold text-[#1e9df1] tabular-nums">
                      {form.prix > 0
                        ? formatPrice(form.prix < 1_000_000 ? 500 : 2500)
                        : formatPrice(500) + " ou " + formatPrice(2500)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Frais fixe de plateforme, dû à la publication — indépendant du résultat de la vente.
                    Couvre la publication premium, les outils de gestion, la messagerie et la diffusion sur E-Dome.
                    <strong className="text-[var(--text-secondary)]"> Ce n&apos;est pas un pourcentage du prix.</strong>
                  </p>
                </div>
              )}
              {form.transactionType === "location-lt" && (
                <div className="p-5 rounded-2xl border border-[#1e9df1]/30 bg-[#1e9df1]/5 space-y-3">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    Frais fixe de mise en ligne, selon la durée du bail :
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                      <p className="text-xs text-[var(--text-muted)]">Bail 1–6 mois</p>
                      <p className="text-lg font-bold text-[#1e9df1] tabular-nums">{formatPrice(150)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                      <p className="text-xs text-[var(--text-muted)]">Bail 6–12 mois</p>
                      <p className="text-lg font-bold text-[#1e9df1] tabular-nums">{formatPrice(250)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                      <p className="text-xs text-[var(--text-muted)]">Bail 12 mois +</p>
                      <p className="text-lg font-bold text-[#1e9df1] tabular-nums">{formatPrice(400)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Frais fixe — la durée du bail définitif est précisée lors de la signature.
                    <strong className="text-[var(--text-secondary)]"> Ce n&apos;est pas un pourcentage du loyer.</strong>
                  </p>
                </div>
              )}
              {form.transactionType === "location-ct" && (
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm text-[var(--text-secondary)]">Publication</p>
                    <span className="text-2xl font-bold text-emerald-400">Gratuite</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Publication gratuite. E-Dome prélève une <strong className="text-[var(--text-secondary)]">commission marketplace
                    de 5 à 10 %</strong> sur chaque réservation réalisée via la plateforme — jamais ajoutée au prix payé par le voyageur.
                  </p>
                </div>
              )}
            </div>

            {/* Options de visibilité (facultatives) — anciennement « Options payantes ». */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Options de visibilité (facultatives)</h2>
              <div className="space-y-3">
                {[
                  { key: "optionMiseEnAvant" as const, label: "Mise en avant", desc: "Votre annonce apparaît en tête des résultats", price: 29 },
                  { key: "optionPhotosPro" as const, label: "Photos professionnelles", desc: "Un photographe professionnel viendra sur place", price: 199 },
                  { key: "optionVisite3D" as const, label: "Visite 3D", desc: "Création d'une visite virtuelle 360°", price: 349 },
                ].map((opt) => (
                  <button key={opt.key} onClick={() => update(opt.key, !form[opt.key])} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${form[opt.key] ? "bg-[#1e9df1]/10 border-[#1e9df1]" : "bg-[var(--card)] border-[var(--card-border)] hover:border-[#1e9df1]/40"}`}>
                    <div className="text-left">
                      <h3 className="font-medium">{opt.label}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{opt.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="font-bold text-[#1e9df1]">{formatPrice(opt.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview card */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Aperçu</h2>
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
                {form.photos.length > 0 && <img src={form.photos[0]} alt={form.titre} className="w-full h-48 object-cover" />}
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold">{form.titre || "Sans titre"}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{form.adresse} {form.ville} {form.codePostal}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                    {form.chambres > 0 && <span>{form.chambres} ch.</span>}
                    {form.sallesDeBain > 0 && <span>{form.sallesDeBain} sdb.</span>}
                    {form.surface > 0 && <span>{form.surface} m2</span>}
                  </div>
                  <p className="font-bold text-xl text-[#1e9df1]">{form.prix > 0 ? formatPrice(form.prix) : "Prix à définir"}</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <button onClick={() => update("termsAccepted", !form.termsAccepted)} className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${form.termsAccepted ? "bg-[#1e9df1] border-[#1e9df1]" : "border-[var(--text-muted)]"}`}>
                {form.termsAccepted && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
              <span className="text-sm text-[var(--text-secondary)]">J&apos;accepte les conditions générales d&apos;utilisation et la politique de confidentialité d&apos;E-Dome.</span>
            </label>

            <div className="flex justify-between">
              <button onClick={() => setStep(isVente ? 6 : 5)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={handlePublish} disabled={!form.termsAccepted} className={`px-8 py-3 rounded-xl font-medium transition-colors ${form.termsAccepted ? "bg-[#1e9df1] hover:bg-[#1583c9] text-white" : "bg-[var(--card)] text-[var(--text-muted)] cursor-not-allowed"}`}>
                Publier le bien
              </button>
            </div>
          </div>
        )}

        {/* Toast — décalé au-dessus de la bottom-nav mobile sinon
            "Brouillon enregistré" / "Publié" reste caché derrière. */}
        {toastMsg && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-[calc(80px+env(safe-area-inset-bottom)+1rem)] md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 toast-success rounded-xl shadow-lg text-sm font-medium animate-fade-in"
          >
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
