"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, ChevronUp, ChevronDown, Check, Upload, X, Play, FileText, HelpCircle, Star, Clock, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module { id: string; title: string; description: string; duration: number; type: "video" | "texte" | "quiz"; }
interface Question { id: string; text: string; answers: string[]; correct: number; }
interface FormData { title: string; category: string; level: string; description: string; coverImage: string | null; price: number; currency: string; isFree: boolean; duration: number; modules: Module[]; hasQuiz: boolean; questions: Question[]; minScore: number; }

const CATEGORIES = ["Investissement", "Location", "Vente", "Luxe", "Rénovation", "Marketing", "Juridique", "Photographie"];
const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];
const STEPS = ["Informations", "Modules", "Quiz", "Publication"];

function newModule(): Module { return { id: Date.now().toString(), title: "", description: "", duration: 15, type: "video" }; }
function newQuestion(): Question { return { id: Date.now().toString(), text: "", answers: ["", "", "", ""], correct: 0 }; }

export default function CreerFormationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const [form, setForm] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edome_draft_formation");
      if (saved) return JSON.parse(saved);
    }
    return { title: "", category: CATEGORIES[0], level: LEVELS[0], description: "", coverImage: null, price: 0, currency: "CHF", isFree: false, duration: 1, modules: [newModule()], hasQuiz: false, questions: [newQuestion()], minScore: 70 };
  });

  useEffect(() => { localStorage.setItem("edome_draft_formation", JSON.stringify(form)); }, [form]);

  const update = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => { setForm(prev => ({ ...prev, [key]: val })); }, []);

  const addModule = () => update("modules", [...form.modules, newModule()]);
  const removeModule = (id: string) => update("modules", form.modules.filter(m => m.id !== id));
  const moveModule = (i: number, dir: -1 | 1) => { const arr = [...form.modules]; [arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]; update("modules", arr); };
  const updateModule = (id: string, field: keyof Module, val: string | number) => update("modules", form.modules.map(m => m.id === id ? { ...m, [field]: val } : m));

  const addQuestion = () => update("questions", [...form.questions, newQuestion()]);
  const removeQuestion = (id: string) => update("questions", form.questions.filter(q => q.id !== id));
  const updateQuestion = (id: string, field: string, val: string | number | string[]) => update("questions", form.questions.map(q => q.id === id ? { ...q, [field]: val } : q));

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setPublished(true); localStorage.removeItem("edome_draft_formation"); }, 2000);
  };

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C4956A]/20 flex items-center justify-center"><Check className="w-10 h-10 text-[#C4956A]" /></div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Formation publiée !</h2>
          <p className="text-[var(--text-secondary)] mb-6">Votre formation est maintenant disponible pour tous les utilisateurs.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/formations")} className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold hover:bg-[#D4A574] transition-colors">Voir mes formations</button>
            <button onClick={() => { setPublished(false); setStep(1); setForm({ title: "", category: CATEGORIES[0], level: LEVELS[0], description: "", coverImage: null, price: 0, currency: "CHF", isFree: false, duration: 1, modules: [newModule()], hasQuiz: false, questions: [newQuestion()], minScore: 70 }); }} className="px-6 py-2.5 rounded-xl border border-white/10 text-[var(--text-secondary)] hover:bg-white/[0.04] transition-colors">Créer une autre</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Créer une formation</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <button onClick={() => i + 1 < step ? setStep(i + 1) : undefined} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors", i + 1 <= step ? "bg-[#C4956A] text-black" : "bg-white/[0.06] text-[var(--text-muted)]")}>{i + 1}</button>
            <span className={cn("text-xs hidden sm:inline", i + 1 <= step ? "text-[var(--foreground)]" : "text-[var(--text-muted)]")}>{label}</span>
            {i < STEPS.length - 1 && <div className={cn("flex-1 h-px", i + 1 < step ? "bg-[#C4956A]" : "bg-[var(--card-border)]")} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Titre de la formation *</label>
            <input value={form.title} onChange={e => update("title", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" placeholder="Ex: Investir dans l'immobilier locatif" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">Catégorie</label>
              <select value={form.category} onChange={e => update("category", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">Niveau</label>
              <select value={form.level} onChange={e => update("level", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40">{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select>
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => update("description", e.target.value.slice(0, 2000))} rows={5} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40 resize-none" placeholder="Décrivez le contenu et les objectifs..." />
            <p className="text-right text-[11px] text-[var(--text-muted)] mt-1">{form.description.length}/2000</p>
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Image de couverture</label>
            <div className="border border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#C4956A]/30 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-xs text-[var(--text-muted)]">Cliquez ou glissez une image</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">Prix</label>
              <div className="flex gap-2">
                <input type="number" value={form.isFree ? 0 : form.price} disabled={form.isFree} onChange={e => update("price", Number(e.target.value))} className="flex-1 bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40 disabled:opacity-30" />
                <select value={form.currency} onChange={e => update("currency", e.target.value)} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-3 text-[var(--foreground)] text-sm"><option>CHF</option><option>EUR</option></select>
              </div>
              <label className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" checked={form.isFree} onChange={e => update("isFree", e.target.checked)} className="accent-[#C4956A]" /> Gratuit
              </label>
            </div>
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">Durée estimée (heures)</label>
              <input type="number" min={0.5} step={0.5} value={form.duration} onChange={e => update("duration", Number(e.target.value))} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Modules ({form.modules.length})</h2>
            <button onClick={addModule} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C4956A]/10 text-[#C4956A] text-xs font-medium hover:bg-[#C4956A]/20 transition-colors"><Plus className="w-3.5 h-3.5" />Ajouter</button>
          </div>
          {form.modules.map((mod, i) => (
            <motion.div key={mod.id} layout className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#C4956A]">Module {i + 1}</span>
                <div className="flex items-center gap-1">
                  <button disabled={i === 0} onClick={() => moveModule(i, -1)} className="p-1 text-[var(--text-muted)] hover:text-[var(--foreground)] disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                  <button disabled={i === form.modules.length - 1} onClick={() => moveModule(i, 1)} className="p-1 text-[var(--text-muted)] hover:text-[var(--foreground)] disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                  {form.modules.length > 1 && <button onClick={() => removeModule(mod.id)} className="p-1 text-red-400/60 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
              <input value={mod.title} onChange={e => updateModule(mod.id, "title", e.target.value)} placeholder="Titre du module" className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30" />
              <textarea value={mod.description} onChange={e => updateModule(mod.id, "description", e.target.value)} placeholder="Description..." rows={2} className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30 resize-none" />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-[var(--text-muted)] mb-1 block">Durée (min)</label>
                  <input type="number" min={1} value={mod.duration} onChange={e => updateModule(mod.id, "duration", Number(e.target.value))} className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-[var(--text-muted)] mb-1 block">Type</label>
                  <select value={mod.type} onChange={e => updateModule(mod.id, "type", e.target.value)} className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none">
                    <option value="video">Vidéo</option><option value="texte">Texte</option><option value="quiz">Quiz</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={cn("w-10 h-5 rounded-full transition-colors relative", form.hasQuiz ? "bg-[#C4956A]" : "bg-white/10")} onClick={() => update("hasQuiz", !form.hasQuiz)}>
              <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", form.hasQuiz ? "translate-x-5" : "translate-x-0.5")} />
            </div>
            <span className="text-sm text-[var(--foreground)]">Ajouter un quiz final</span>
          </label>
          {form.hasQuiz && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1 block">Score minimum pour réussir (%)</label>
                <input type="number" min={0} max={100} value={form.minScore} onChange={e => update("minScore", Number(e.target.value))} className="w-32 bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" />
              </div>
              {form.questions.map((q, qi) => (
                <div key={q.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--foreground)]">Question {qi + 1}</span>
                    {form.questions.length > 1 && <button onClick={() => removeQuestion(q.id)} className="p-1 text-red-400/60 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <input value={q.text} onChange={e => updateQuestion(q.id, "text", e.target.value)} placeholder="Votre question..." className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30" />
                  <div className="space-y-2">
                    {q.answers.map((ans, ai) => (
                      <div key={ai} className="flex items-center gap-2">
                        <button onClick={() => updateQuestion(q.id, "correct", ai)} className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors", q.correct === ai ? "border-[#C4956A] bg-[#C4956A]" : "border-white/20")}>
                          {q.correct === ai && <Check className="w-3 h-3 text-black" />}
                        </button>
                        <input value={ans} onChange={e => { const newAns = [...q.answers]; newAns[ai] = e.target.value; updateQuestion(q.id, "answers", newAns); }} placeholder={`Réponse ${ai + 1}`} className="flex-1 bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={addQuestion} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] text-[var(--text-secondary)] text-xs hover:bg-white/[0.06] transition-colors"><Plus className="w-3.5 h-3.5" />Ajouter une question</button>
            </div>
          )}
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Aperçu de votre formation</h2>
          <div className="rounded-2xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-[#C4956A]/20 to-[#C4956A]/5 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#C4956A]/40" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#C4956A]/10 text-[#C4956A] text-[10px] font-medium">{form.category}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[var(--text-secondary)] text-[10px]">{form.level}</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{form.title || "Titre de la formation"}</h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{form.description || "Description..."}</p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{form.duration}h</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{form.modules.length} modules</span>
                {form.hasQuiz && <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />Quiz</span>}
              </div>
              <div className="pt-3 border-t border-[var(--card-border)]">
                <span className="text-xl font-bold text-[#C4956A]">{form.isFree ? "Gratuit" : `${form.price} ${form.currency}`}</span>
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input type="checkbox" className="accent-[#C4956A]" />
            J&apos;accepte les conditions de publication
          </label>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--card-border)]">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 rounded-xl border border-white/10 text-[var(--text-secondary)] text-sm hover:bg-white/[0.04] transition-colors">Précédent</button>
        ) : <div />}
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black text-sm font-semibold hover:bg-[#D4A574] transition-colors">Suivant</button>
        ) : (
          <button onClick={handlePublish} disabled={publishing} className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black text-sm font-semibold hover:bg-[#D4A574] transition-colors disabled:opacity-50 flex items-center gap-2">
            {publishing && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {publishing ? "Publication..." : "Publier la formation"}
          </button>
        )}
      </div>
    </div>
  );
}
