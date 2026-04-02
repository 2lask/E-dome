"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "@/lib/context";
import type { TransactionType, PropertyType } from "@/lib/types";

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
  // Apporteurs
  autoriserApporteurs: boolean;
  commissionApporteur: number;
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
  { value: "location-ct", label: "Location courte duree" },
  { value: "location-lt", label: "Location longue duree" },
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
  "Lave-vaisselle", "Machine a laver", "Climatisation", "Cheminee", "Sauna",
  "Wifi", "Vue lac", "Vue montagne", "Meuble",
];

const DPE_OPTIONS = ["A", "B", "C", "D", "E", "F", "G"];
const ETAT_OPTIONS = ["Neuf", "Excellent", "Bon", "A renover", "A restaurer"];

const emptyForm: PublishForm = {
  transactionType: "", propertyType: "", adresse: "", ville: "", codePostal: "", prix: 0,
  chambres: 1, sallesDeBain: 1, surface: 0, titre: "", description: "",
  photos: [], video: "", equipements: [], documents: [],
  rendementBrut: 0, dpe: "C", roi5ans: 0, roi10ans: 0, chargesAnnuelles: 0,
  anneeConstruction: 2000, etatGeneral: "Bon", potentielPlusValue: 0, tauxOccupation: 0,
  autoriserApporteurs: true, commissionApporteur: 15,
  optionMiseEnAvant: false, optionPhotosPro: false, optionVisite3D: false, termsAccepted: false,
};

const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A]/50 transition-colors";
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
    setToastMsg("Bien publie avec succes ! Il est maintenant visible dans l'Explorer. (demonstration)");
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
          <h1 className="text-2xl font-bold mb-2">Bien publie avec succes !</h1>
          <p className="text-[var(--text-secondary)] mb-6">Votre annonce &quot;{form.titre}&quot; est maintenant en ligne.</p>
          <a href="/explorer" className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors inline-block">
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
    ? ["Type & Adresse", "Details", "Medias", "Analytics", "Equipements", "Apporteurs", "Options & Publication"]
    : ["Type & Adresse", "Details", "Medias", "Equipements", "Apporteurs", "Options & Publication"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {confettiOverlay}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">Publier un bien</h1>
            <p className="text-[var(--text-secondary)] mt-1">Etape {step} sur {totalSteps}</p>
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
                  <button onClick={() => loadDraft(d.id)} className="text-[#C4956A] hover:underline">{d.titre} - {d.date}</button>
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
              <button onClick={() => setStep(i + 1)} className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${step === i + 1 ? "bg-[#C4956A] text-white" : step > i + 1 ? "bg-[#C4956A]/20 text-[#C4956A]" : "bg-[var(--card)] text-[var(--text-muted)]"}`}>
                <span className="hidden sm:inline">{s}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
              {i < stepLabels.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-[#C4956A]" : "bg-[var(--card-border)]"}`} />}
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
                  <button key={t.value} onClick={() => update("transactionType", t.value)} className={`p-4 rounded-xl text-sm font-medium text-center transition-colors border ${form.transactionType === t.value ? "bg-[#C4956A]/20 border-[#C4956A] text-[#C4956A]" : "bg-[var(--card)] border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#C4956A]/40"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Type de bien</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <button key={t.value} onClick={() => update("propertyType", t.value)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${form.propertyType === t.value ? "bg-[#C4956A]/20 border-[#C4956A] text-[#C4956A]" : "bg-[var(--card)] border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#C4956A]/40"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div><label className={labelCls}>Adresse</label><input className={inputCls} placeholder="Rue et numero" value={form.adresse} onChange={(e) => update("adresse", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Ville</label><input className={inputCls} placeholder="Geneve" value={form.ville} onChange={(e) => update("ville", e.target.value)} /></div>
              <div><label className={labelCls}>Code postal</label><input className={inputCls} placeholder="1200" value={form.codePostal} onChange={(e) => update("codePostal", e.target.value)} /></div>
            </div>
            <div>
              <label className={labelCls}>Prix</label>
              <input type="number" className={inputCls} placeholder="0" value={form.prix || ""} onChange={(e) => update("prix", Number(e.target.value))} />
              {form.prix > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">Affiche : {formatPrice(form.prix)}</p>}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Suivant</button>
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
              <button onClick={() => setStep(3)} className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Suivant</button>
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
                <button onClick={addPhoto} className="px-4 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Ajouter</button>
              </div>
              {/* Drag-reorder hint */}
              {form.photos.length > 1 && <p className="text-xs text-[var(--text-muted)] mb-2">Cliquez sur les fleches pour reordonner.</p>}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {form.photos.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-28 object-cover rounded-xl" />
                    {i === 0 && <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#C4956A] text-white text-[10px] rounded-full">Principale</span>}
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {i > 0 && <button onClick={() => reorderPhoto(i, i - 1)} className="w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs">&lt;</button>}
                      {i < form.photos.length - 1 && <button onClick={() => reorderPhoto(i, i + 1)} className="w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs">&gt;</button>}
                      <button onClick={() => removePhoto(i)} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">X</button>
                    </div>
                  </div>
                ))}
                {/* Drop zone placeholder */}
                <button onClick={() => fileRef.current?.click()} className="h-28 border-2 border-dashed border-[var(--card-border)] rounded-xl flex flex-col items-center justify-center text-[var(--text-muted)] hover:border-[#C4956A]/40 transition-colors">
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  <span className="text-xs">Glisser-deposer</span>
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
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
              <button onClick={() => setStep(4)} className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 4: Equipements (non-vente) or Analytics (vente) ──── */}
        {step === 4 && !isVente && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-semibold">Equipements</h2>
            <div className="flex flex-wrap gap-2">
              {EQUIPEMENTS.map((eq) => (
                <button key={eq} onClick={() => toggleEquipement(eq)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${form.equipements.includes(eq) ? "bg-[#C4956A] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#C4956A]/40"}`}>
                  {eq}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(5)} className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {step === 4 && isVente && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-semibold">Donnees analytiques</h2>
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
              <button onClick={() => setStep(5)} className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 5: Equipements (vente path) ───────────────────────── */}
        {step === 5 && isVente && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-semibold">Equipements</h2>
            <div className="flex flex-wrap gap-2">
              {EQUIPEMENTS.map((eq) => (
                <button key={eq} onClick={() => toggleEquipement(eq)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${form.equipements.includes(eq) ? "bg-[#C4956A] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#C4956A]/40"}`}>
                  {eq}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(4)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(6)} className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 5/6: Apporteurs (non-vente=5, vente=6) ────────────── */}
        {step === (isVente ? 6 : 5) && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold">Apporteurs d&apos;affaires</h2>
            <p className="text-sm text-[var(--text-secondary)]">Permettez aux apporteurs d&apos;affaires de promouvoir votre bien et recevez plus de visibilite.</p>

            {/* Toggle autoriser */}
            <button
              onClick={() => update("autoriserApporteurs", !form.autoriserApporteurs)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${form.autoriserApporteurs ? "bg-[#C4956A]/10 border-[#C4956A]" : "bg-[var(--card)] border-[var(--card-border)] hover:border-[#C4956A]/40"}`}
            >
              <div className="text-left">
                <h3 className="font-medium">Autoriser les apporteurs</h3>
                <p className="text-xs text-[var(--text-muted)]">Les apporteurs pourront partager votre annonce via leur lien personnel</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${form.autoriserApporteurs ? "bg-[#C4956A]" : "bg-[var(--card-border)]"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.autoriserApporteurs ? "translate-x-6" : "translate-x-0.5"}`} />
              </div>
            </button>

            {/* Commission slider */}
            {form.autoriserApporteurs && (
              <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Commission apporteur</label>
                  <span className="text-lg font-bold text-[#C4956A]">{form.commissionApporteur}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={15}
                  step={1}
                  value={form.commissionApporteur}
                  onChange={(e) => update("commissionApporteur", Number(e.target.value))}
                  className="w-full accent-[#C4956A]"
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>5%</span>
                  <span>10%</span>
                  <span>15%</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Cette commission est prelevee sur la part plateforme E-Dome. Aucun cout supplementaire pour vous.
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(isVente ? 5 : 4)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(totalSteps)} className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Final Step: Options + Preview + Publish ─────────────────── */}
        {step === totalSteps && (
          <div className="space-y-6 animate-fade-in">
            {/* Paid options */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Options payantes</h2>
              <div className="space-y-3">
                {[
                  { key: "optionMiseEnAvant" as const, label: "Mise en avant", desc: "Votre annonce apparait en tete des resultats", price: 29 },
                  { key: "optionPhotosPro" as const, label: "Photos professionnelles", desc: "Un photographe professionnel viendra sur place", price: 199 },
                  { key: "optionVisite3D" as const, label: "Visite 3D", desc: "Creation d'une visite virtuelle 360°", price: 349 },
                ].map((opt) => (
                  <button key={opt.key} onClick={() => update(opt.key, !form[opt.key])} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${form[opt.key] ? "bg-[#C4956A]/10 border-[#C4956A]" : "bg-[var(--card)] border-[var(--card-border)] hover:border-[#C4956A]/40"}`}>
                    <div className="text-left">
                      <h3 className="font-medium">{opt.label}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{opt.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="font-bold text-[#C4956A]">{formatPrice(opt.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview card */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Apercu</h2>
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
                  <p className="font-bold text-xl text-[#C4956A]">{form.prix > 0 ? formatPrice(form.prix) : "Prix a definir"}</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <button onClick={() => update("termsAccepted", !form.termsAccepted)} className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${form.termsAccepted ? "bg-[#C4956A] border-[#C4956A]" : "border-[var(--text-muted)]"}`}>
                {form.termsAccepted && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
              <span className="text-sm text-[var(--text-secondary)]">J&apos;accepte les conditions generales d&apos;utilisation et la politique de confidentialite d&apos;E-Dome.</span>
            </label>

            <div className="flex justify-between">
              <button onClick={() => setStep(isVente ? 6 : 5)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={handlePublish} disabled={!form.termsAccepted} className={`px-8 py-3 rounded-xl font-medium transition-colors ${form.termsAccepted ? "bg-[#C4956A] hover:bg-[#b8845a] text-white" : "bg-[var(--card)] text-[var(--text-muted)] cursor-not-allowed"}`}>
                Publier le bien
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg text-sm font-medium animate-fade-in">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
