"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Check } from "lucide-react";

const CATEGORIES = ["Conciergerie", "Transport", "Photographie", "Décoration", "Juridique", "Finance", "Rénovation", "Déménagement"];
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function ProposerServicePage() {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({ title: "", category: CATEGORIES[0], description: "", zone: "", tarifs: "", jours: new Set<string>(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]) });

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleJour = (j: string) => setForm(prev => { const next = new Set(prev.jours); next.has(j) ? next.delete(j) : next.add(j); return { ...prev, jours: next }; });

  const handlePublish = () => { setPublishing(true); setTimeout(() => { setPublishing(false); setPublished(true); }, 1500); };

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C4956A]/20 flex items-center justify-center"><Check className="w-10 h-10 text-[#C4956A]" /></div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Service publié !</h2>
          <p className="text-[var(--text-secondary)] mb-6">Votre service est maintenant visible sur la marketplace.</p>
          <button onClick={() => router.push("/services")} className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold hover:bg-[#D4A574] transition-colors">Voir les services</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">Proposer un service</h1>
      <div className="space-y-5">
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1 block">Titre du service *</label>
          <input value={form.title} onChange={e => update("title", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" placeholder="Ex: Photographie immobilière professionnelle" />
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1 block">Catégorie</label>
          <select value={form.category} onChange={e => update("category", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1 block">Description</label>
          <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40 resize-none" placeholder="Décrivez votre service en détail..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Zone géographique</label>
            <input value={form.zone} onChange={e => update("zone", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none" placeholder="Ex: Neuchâtel et environs" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Tarifs</label>
            <input value={form.tarifs} onChange={e => update("tarifs", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none" placeholder="Ex: À partir de CHF 150/h" />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-2 block">Disponibilités</label>
          <div className="flex flex-wrap gap-2">
            {JOURS.map(j => (
              <button key={j} onClick={() => toggleJour(j)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${form.jours.has(j) ? "bg-[#C4956A]/10 border-[#C4956A]/30 text-[#C4956A]" : "bg-white/[0.02] border-[var(--card-border)] text-[var(--text-secondary)]"}`}>{j}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1 block">Photos (max 5)</label>
          <div className="border border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#C4956A]/30 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-xs text-[var(--text-muted)]">Cliquez ou glissez vos photos</p>
          </div>
        </div>
        <div className="pt-6 border-t border-[var(--card-border)]">
          <button onClick={handlePublish} disabled={publishing || !form.title} className="w-full py-3 rounded-xl bg-[#C4956A] text-black font-semibold hover:bg-[#D4A574] transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {publishing && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {publishing ? "Publication..." : "Publier mon service"}
          </button>
        </div>
      </div>
    </div>
  );
}
