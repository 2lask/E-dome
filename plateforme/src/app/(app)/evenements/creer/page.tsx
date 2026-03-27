"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Upload, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = ["Webinaire", "Conférence", "Atelier", "Networking", "Formation live"];
const DUREES = ["30 min", "1h", "2h", "3h", "Journée"];

export default function CreerEvenementPage() {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({ title: "", type: TYPES[0], date: "", time: "", duree: DUREES[1], isOnline: false, lieu: "", lienVisio: "", description: "", intervenant: "", intervenantBio: "", places: 50, price: 0, isFree: true, currency: "CHF" });

  const update = (key: string, val: string | number | boolean) => setForm(prev => ({ ...prev, [key]: val }));

  const handlePublish = () => { setPublishing(true); setTimeout(() => { setPublishing(false); setPublished(true); }, 1500); };

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C4956A]/20 flex items-center justify-center"><Check className="w-10 h-10 text-[#C4956A]" /></div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Événement publié !</h2>
          <p className="text-[var(--text-secondary)] mb-6">Votre événement est maintenant visible par tous.</p>
          <button onClick={() => router.push("/evenements")} className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold hover:bg-[#D4A574] transition-colors">Voir les événements</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">Créer un événement</h1>
      <div className="space-y-5">
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1 block">Titre *</label>
          <input value={form.title} onChange={e => update("title", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" placeholder="Ex: Webinaire - Investir en 2026" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Type</label>
            <select value={form.type} onChange={e => update("type", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none">{TYPES.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Durée</label>
            <select value={form.duree} onChange={e => update("duree", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none">{DUREES.map(d => <option key={d}>{d}</option>)}</select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Date *</label>
            <input type="date" value={form.date} onChange={e => update("date", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Heure *</label>
            <input type="time" value={form.time} onChange={e => update("time", e.target.value)} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="text-sm text-[var(--text-secondary)]">Lieu</label>
            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer ml-auto">
              <Globe className="w-3.5 h-3.5" />
              <span>En ligne</span>
              <div className={cn("w-9 h-5 rounded-full transition-colors relative cursor-pointer", form.isOnline ? "bg-[#C4956A]" : "bg-white/10")} onClick={() => update("isOnline", !form.isOnline)}>
                <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", form.isOnline ? "translate-x-4" : "translate-x-0.5")} />
              </div>
            </label>
          </div>
          {form.isOnline ? (
            <input value={form.lienVisio} onChange={e => update("lienVisio", e.target.value)} placeholder="Lien de la visioconférence (Zoom, Meet...)" className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" />
          ) : (
            <input value={form.lieu} onChange={e => update("lieu", e.target.value)} placeholder="Adresse du lieu" className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" />
          )}
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1 block">Description</label>
          <textarea value={form.description} onChange={e => update("description", e.target.value.slice(0, 2000))} rows={4} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40 resize-none" placeholder="Décrivez votre événement..." />
          <p className="text-right text-[11px] text-[var(--text-muted)] mt-1">{form.description.length}/2000</p>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1 block">Image de couverture</label>
          <div className="border border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#C4956A]/30 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-xs text-[var(--text-muted)]">Cliquez ou glissez une image</p>
          </div>
        </div>
        <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] p-4 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Intervenant</h3>
          <input value={form.intervenant} onChange={e => update("intervenant", e.target.value)} placeholder="Nom de l'intervenant" className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30" />
          <textarea value={form.intervenantBio} onChange={e => update("intervenantBio", e.target.value)} placeholder="Courte biographie..." rows={2} className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Places disponibles</label>
            <input type="number" min={1} value={form.places} onChange={e => update("places", Number(e.target.value))} className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Prix</label>
            <div className="flex gap-2">
              <input type="number" min={0} value={form.isFree ? 0 : form.price} disabled={form.isFree} onChange={e => update("price", Number(e.target.value))} className="flex-1 bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm disabled:opacity-30 focus:outline-none" />
              <select value={form.currency} onChange={e => update("currency", e.target.value)} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-3 text-[var(--foreground)] text-sm"><option>CHF</option><option>EUR</option></select>
            </div>
            <label className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)] cursor-pointer"><input type="checkbox" checked={form.isFree} onChange={e => update("isFree", e.target.checked)} className="accent-[#C4956A]" /> Gratuit</label>
          </div>
        </div>
        <div className="pt-6 border-t border-[var(--card-border)]">
          <button onClick={handlePublish} disabled={publishing || !form.title || !form.date} className="w-full py-3 rounded-xl bg-[#C4956A] text-black font-semibold hover:bg-[#D4A574] transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {publishing && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {publishing ? "Publication..." : "Publier l'événement"}
          </button>
        </div>
      </div>
    </div>
  );
}
