"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/lib/context";
import { LottiePlayer } from "@/components/ui/lottie-player";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ModuleItem {
  id: string;
  title: string;
  lessons: { id: string; title: string; duration: string }[];
}

interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
}

interface FormData {
  titre: string;
  categorie: string;
  niveau: string;
  description: string;
  image: string;
  prix: number;
  duree: string;
  modules: ModuleItem[];
  quiz: QuizQuestion[];
}

const STORAGE_KEY = "edome_formation_draft";

const CATEGORIES = ["Immobilier", "Finance", "Marketing", "Juridique", "Design", "Gestion locative", "Investissement"];
const NIVEAUX = [
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "avance", label: "Avancé" },
];

const emptyForm: FormData = {
  titre: "", categorie: "", niveau: "debutant", description: "", image: "", prix: 0, duree: "",
  modules: [{ id: "mod-1", title: "", lessons: [{ id: "les-1", title: "", duration: "" }] }],
  quiz: [],
};

let idCounter = 100;
const uid = () => `gen-${++idCounter}`;

/* ─── Input helpers ──────────────────────────────────────────────────────── */

const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CreerFormationPage() {
  const { formatPrice } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [published, setPublished] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form]);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ── Module helpers ─────────────────────────────────────────────────── */

  const addModule = () => {
    updateField("modules", [...form.modules, { id: uid(), title: "", lessons: [{ id: uid(), title: "", duration: "" }] }]);
  };

  const removeModule = (modId: string) => {
    if (form.modules.length <= 1) return;
    updateField("modules", form.modules.filter((m) => m.id !== modId));
  };

  const moveModule = (index: number, dir: -1 | 1) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= form.modules.length) return;
    const arr = [...form.modules];
    [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
    updateField("modules", arr);
  };

  const updateModuleTitle = (modId: string, title: string) => {
    updateField("modules", form.modules.map((m) => m.id === modId ? { ...m, title } : m));
  };

  const addLesson = (modId: string) => {
    updateField("modules", form.modules.map((m) => m.id === modId ? { ...m, lessons: [...m.lessons, { id: uid(), title: "", duration: "" }] } : m));
  };

  const removeLesson = (modId: string, lesId: string) => {
    updateField("modules", form.modules.map((m) => {
      if (m.id !== modId) return m;
      if (m.lessons.length <= 1) return m;
      return { ...m, lessons: m.lessons.filter((l) => l.id !== lesId) };
    }));
  };

  const updateLesson = (modId: string, lesId: string, field: "title" | "duration", value: string) => {
    updateField("modules", form.modules.map((m) => {
      if (m.id !== modId) return m;
      return { ...m, lessons: m.lessons.map((l) => l.id === lesId ? { ...l, [field]: value } : l) };
    }));
  };

  /* ── Quiz helpers ───────────────────────────────────────────────────── */

  const addQuestion = () => {
    updateField("quiz", [...form.quiz, { id: uid(), question: "", choices: ["", "", "", ""], correctIndex: 0 }]);
  };

  const removeQuestion = (qId: string) => {
    updateField("quiz", form.quiz.filter((q) => q.id !== qId));
  };

  const updateQuestion = (qId: string, field: string, value: string | number) => {
    updateField("quiz", form.quiz.map((q) => q.id === qId ? { ...q, [field]: value } : q));
  };

  const updateChoice = (qId: string, ci: number, value: string) => {
    updateField("quiz", form.quiz.map((q) => {
      if (q.id !== qId) return q;
      const choices = [...q.choices];
      choices[ci] = value;
      return { ...q, choices };
    }));
  };

  const handlePublish = () => {
    setPublished(true);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  /* ── Published success ──────────────────────────────────────────────── */

  if (published) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl page-heading mb-2">Formation publiée !</h1>
          <p className="text-[var(--text-secondary)] mb-6">Votre formation &quot;{form.titre}&quot; est maintenant disponible.</p>
          <a href="/formations" className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors inline-block">
            Voir mes formations
          </a>
        </div>
      </div>
    );
  }

  /* ── Step indicators ─────────────────────────────────────────────────── */

  const STEPS = ["Informations", "Modules", "Quiz", "Aperçu"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl page-heading mb-2">Créer une formation</h1>
        <p className="text-[var(--text-secondary)] mb-8">Étape {step} sur 4</p>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => setStep(i + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === i + 1 ? "bg-[#1e9df1] text-white" : step > i + 1 ? "bg-[#1e9df1]/20 text-[#1e9df1]" : "bg-[var(--card)] text-[var(--text-muted)]"}`}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">{i + 1}</span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < 3 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-[#1e9df1]" : "bg-[var(--card-border)]"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Informations ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div><label className={labelCls}>Titre de la formation</label><input className={inputCls} placeholder="Ex: Investissement immobilier pour débutants" value={form.titre} onChange={(e) => updateField("titre", e.target.value)} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Catégorie</label>
                <select className={inputCls} value={form.categorie} onChange={(e) => updateField("categorie", e.target.value)}>
                  <option value="">Choisir...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Niveau</label>
                <select className={inputCls} value={form.niveau} onChange={(e) => updateField("niveau", e.target.value)}>
                  {NIVEAUX.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
                </select>
              </div>
            </div>
            <div><label className={labelCls}>Description</label><textarea className={`${inputCls} min-h-[120px] resize-y`} placeholder="Décrivez votre formation..." value={form.description} onChange={(e) => updateField("description", e.target.value)} /></div>
            <div>
              <label className={labelCls}>Image de couverture</label>
              <div className="flex items-center gap-3">
                <LottiePlayer src="/lottie/lottieflow-multimedia-8-1-000000-easey.json" width={60} height={60} className="flex-shrink-0" />
                <input className={`${inputCls} flex-1`} placeholder="URL https://… ou téléverser →" value={form.image} onChange={(e) => updateField("image", e.target.value)} />
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ border: "1px solid var(--card-border)", background: "var(--card)", color: "var(--foreground)" }}
                >
                  Téléverser
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      updateField("image", URL.createObjectURL(f));
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {form.image && (
                <img src={form.image} alt="" className="mt-3 w-full max-w-md h-40 object-cover rounded-xl border border-[var(--card-border)]" />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Prix</label>
                <input type="number" className={inputCls} placeholder="0" value={form.prix || ""} onChange={(e) => updateField("prix", Number(e.target.value))} />
                {form.prix > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">Affiche : {formatPrice(form.prix)}</p>}
              </div>
              <div><label className={labelCls}>Durée estimée</label><input className={inputCls} placeholder="Ex: 12h" value={form.duree} onChange={(e) => updateField("duree", e.target.value)} /></div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 2: Modules ──────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            {form.modules.map((mod, mi) => (
              <div key={mod.id} className="p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-[#1e9df1]/20 text-[#1e9df1] rounded-lg text-sm font-bold flex-shrink-0">{mi + 1}</span>
                  <input className={`${inputCls} flex-1`} placeholder="Titre du module" value={mod.title} onChange={(e) => updateModuleTitle(mod.id, e.target.value)} />
                  <div className="flex gap-1">
                    <button onClick={() => moveModule(mi, -1)} disabled={mi === 0} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg disabled:opacity-30 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                    <button onClick={() => moveModule(mi, 1)} disabled={mi === form.modules.length - 1} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg disabled:opacity-30 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                    <button onClick={() => removeModule(mod.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
                {/* Lessons */}
                <div className="ml-11 space-y-2">
                  {mod.lessons.map((les) => (
                    <div key={les.id} className="flex items-center gap-2">
                      <input className={`${inputCls} flex-1`} placeholder="Titre de la leçon" value={les.title} onChange={(e) => updateLesson(mod.id, les.id, "title", e.target.value)} />
                      <input className={`${inputCls} w-28`} placeholder="Durée" value={les.duration} onChange={(e) => updateLesson(mod.id, les.id, "duration", e.target.value)} />
                      <button onClick={() => removeLesson(mod.id, les.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors flex-shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  ))}
                  <button onClick={() => addLesson(mod.id)} className="text-sm text-[#1e9df1] hover:text-[#1583c9] transition-colors">+ Ajouter une leçon</button>
                </div>
              </div>
            ))}
            <button onClick={addModule} className="w-full py-3 border-2 border-dashed border-[var(--card-border)] rounded-2xl text-[var(--text-muted)] hover:border-[#1e9df1]/40 hover:text-[#1e9df1] transition-colors">
              + Ajouter un module
            </button>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(3)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 3: Quiz (optional) ──────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-[var(--text-secondary)]">Ajoutez un quiz optionnel pour évaluer les étudiants.</p>
            {form.quiz.map((q, qi) => (
              <div key={q.id} className="p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#1e9df1]">Q{qi + 1}</span>
                  <input className={`${inputCls} flex-1`} placeholder="Question..." value={q.question} onChange={(e) => updateQuestion(q.id, "question", e.target.value)} />
                  <button onClick={() => removeQuestion(q.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
                <div className="ml-8 space-y-2">
                  {q.choices.map((c, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      <button onClick={() => updateQuestion(q.id, "correctIndex", ci)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${q.correctIndex === ci ? "border-[#1e9df1] bg-[#1e9df1]" : "border-[var(--text-muted)]"}`}>
                        {q.correctIndex === ci && <div className="w-2 h-2 bg-white rounded-full" />}
                      </button>
                      <input className={`${inputCls} flex-1`} placeholder={`Choix ${ci + 1}`} value={c} onChange={(e) => updateChoice(q.id, ci, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-[var(--card-border)] rounded-2xl text-[var(--text-muted)] hover:border-[#1e9df1]/40 hover:text-[#1e9df1] transition-colors">
              + Ajouter une question
            </button>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={() => setStep(4)} className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">Suivant</button>
            </div>
          </div>
        )}

        {/* ── Step 4: Preview + Publish ────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold">Aperçu de votre formation</h2>

            {/* Preview card */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
              {form.image && <img src={form.image} alt={form.titre} className="w-full h-48 object-cover" />}
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold">{form.titre || "Sans titre"}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-[var(--text-muted)]">
                  {form.categorie && <span className="px-3 py-1 bg-[#1e9df1]/20 text-[#1e9df1] rounded-full">{form.categorie}</span>}
                  <span>{NIVEAUX.find((n) => n.value === form.niveau)?.label}</span>
                  {form.duree && <span>{form.duree}</span>}
                </div>
                <p className="text-[var(--text-secondary)] text-sm">{form.description || "Pas de description."}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
                  <span className="font-bold text-[#1e9df1] text-lg">{form.prix > 0 ? formatPrice(form.prix) : "Gratuit"}</span>
                  <span className="text-sm text-[var(--text-muted)]">{form.modules.length} modules &middot; {form.modules.reduce((a, m) => a + m.lessons.length, 0)} leçons</span>
                </div>
              </div>
            </div>

            {/* Module summary */}
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--text-secondary)]">Modules</h3>
              {form.modules.map((mod, mi) => (
                <div key={mod.id} className="flex items-center gap-3 px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-sm">
                  <span className="text-[#1e9df1] font-bold">{mi + 1}.</span>
                  <span>{mod.title || "Module sans titre"}</span>
                  <span className="text-[var(--text-muted)] ml-auto">{mod.lessons.length} leçons</span>
                </div>
              ))}
            </div>

            {form.quiz.length > 0 && (
              <p className="text-sm text-[var(--text-muted)]">Quiz : {form.quiz.length} question(s)</p>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Retour</button>
              <button onClick={handlePublish} className="px-8 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">
                Publier la formation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
