"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, AlertCircle, ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, Briefcase, MessageSquare, Clock, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_TI8c1iuF9PjO1Ohu_0zVJThqjZ03f-pSOgioCFdr-NdQI_N-5Ar4a1rQxR0oyDSW/exec";

const ROLES = [
  "Agence immobili\u00e8re", "H\u00f4te / Location courte dur\u00e9e", "Investisseur", "Promoteur immobilier",
  "Apporteur d'affaires", "Formateur / Coach", "Propri\u00e9taire", "Photographe / Vid\u00e9aste",
  "Courtier", "Architecte / D\u00e9corateur", "Gestionnaire de biens", "Notaire", "Autre",
];

const SOURCES = ["R\u00e9seaux sociaux", "Bouche-\u00e0-oreille", "Recherche web", "\u00c9v\u00e9nement", "Article / Presse", "Autre"];

const PAIN_POINTS = [
  { id: "commissions", label: "Les commissions des plateformes r\u00e9duisent mes revenus", icon: BarChart3, color: "#EF4444" },
  { id: "visibilite", label: "Je dois payer pour \u00eatre visible en ligne", icon: Briefcase, color: "#F59E0B" },
  { id: "outils", label: "J'utilise plusieurs outils non connect\u00e9s entre eux", icon: MessageSquare, color: "#3B82F6" },
  { id: "referral", label: "Je recommande des clients sans rien recevoir en retour", icon: User, color: "#10B981" },
  { id: "clients", label: "Je perds des clients redirig\u00e9s vers des sites externes", icon: Clock, color: "#EC4899" },
  { id: "donnees", label: "Je n'ai pas de vue d'ensemble sur mon activit\u00e9", icon: BarChart3, color: "#8B5CF6" },
];

const INTEREST_LEVELS = [
  { value: "tres-interesse", label: "Tr\u00e8s int\u00e9ress\u00e9 \u2014 je veux \u00eatre parmi les premiers", color: "#10B981" },
  { value: "interesse", label: "Int\u00e9ress\u00e9 \u2014 je veux en savoir plus", color: "#3B82F6" },
  { value: "curieux", label: "Curieux \u2014 je d\u00e9couvre le projet", color: "#F59E0B" },
  { value: "professionnel", label: "Professionnel \u2014 je cherche un partenariat", color: "#8B5CF6" },
];

interface FormData {
  nom: string; email: string; telephone: string; pays: string; role: string; roleAutre: string;
  painPoints: string[]; painAutre: string; projet: string; delai: string; source: string; website: string;
}

const INITIAL: FormData = { nom: "", email: "", telephone: "", pays: "", role: "", roleAutre: "", painPoints: [], painAutre: "", projet: "", delai: "", source: "", website: "" };

export function FounderForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    try {
      const s = localStorage.getItem("edome-lead");
      if (s) { const p = JSON.parse(s); setForm((f) => ({ ...f, nom: p.nom || "", pays: p.pays || "", role: p.role || "" })); }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("edome-lead", JSON.stringify({ nom: form.nom, pays: form.pays, role: form.role })); } catch {}
  }, [form.nom, form.pays, form.role]);

  const set = (name: string, value: string | string[]) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const togglePain = (id: string) => {
    setForm((p) => ({
      ...p,
      painPoints: p.painPoints.includes(id) ? p.painPoints.filter((x) => x !== id) : [...p.painPoints, id],
    }));
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.nom || form.nom.length < 2) e.nom = "Nom requis";
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
      if (form.telephone && !/^[+\d\s()-]{6,20}$/.test(form.telephone)) e.telephone = "Num\u00e9ro invalide";
      if (!form.pays || form.pays.length < 2) e.pays = "Pays requis";
      if (!form.role) e.role = "R\u00f4le requis";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 2)); };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (form.website) return;
    if (!validateStep()) return;
    setStatus("sending");
    try {
      const params = new URLSearchParams();
      params.append("nom", form.nom);
      params.append("email", form.email);
      params.append("telephone", form.telephone);
      params.append("pays", form.pays);
      params.append("role", form.role === "Autre" && form.roleAutre ? `Autre: ${form.roleAutre}` : form.role);
      const pains = form.painPoints.map(id => id === "autre" && form.painAutre ? `Autre: ${form.painAutre}` : PAIN_POINTS.find(p => p.id === id)?.label || id);
      params.append("painPoints", pains.join(", "));
      params.append("projet", form.projet);
      params.append("interet", form.delai);
      params.append("source", form.source);
      await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, { method: "GET", mode: "no-cors" });
      localStorage.removeItem("edome-lead");
      setStatus("sent");
    } catch { setStatus("error"); }
  };

  const steps = [
    { num: 1, label: "Coordonn\u00e9es" },
    { num: 2, label: "Votre exp\u00e9rience" },
    { num: 3, label: "Int\u00e9r\u00eat" },
  ];

  const FieldErr = ({ name }: { name: string }) => errors[name] ? (
    <p className="text-[#EF4444] text-xs mt-1 flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" />{errors[name]}</p>
  ) : null;

  if (status === "sent") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8 rounded-2xl bg-white/[0.03] border border-[#10B981]/20">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Merci pour votre inscription !</h3>
        <p className="text-white/40 text-sm max-w-sm mx-auto">Nous avons bien re&ccedil;u votre demande. Notre &eacute;quipe vous contactera prochainement pour la suite du processus.</p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden max-w-[600px] mx-auto">
      {/* Honeypot */}
      <div className="hidden"><input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)} tabIndex={-1} /></div>

      {/* Step indicator */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i <= step ? "bg-[#8B5CF6] text-white" : "bg-white/[0.06] text-white/30"
            }`}>{s.num}</div>
            <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-white/70" : "text-white/20"}`}>{s.label}</span>
            {i < 2 && <div className={`w-8 sm:w-16 h-px mx-2 ${i < step ? "bg-[#8B5CF6]" : "bg-white/[0.08]"}`} />}
          </div>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Coordonnées */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <Label htmlFor="nom" className="mb-1.5 block">Nom complet *</Label>
                <div className="relative">
                  <Input id="nom" value={form.nom} onChange={(e) => set("nom", e.target.value)} placeholder="Jean Dupont" className="pl-10" />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
                <FieldErr name="nom" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="mb-1.5 block">Email *</Label>
                  <div className="relative">
                    <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vous@email.com" className="pl-10" />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  </div>
                  <FieldErr name="email" />
                </div>
                <div>
                  <Label htmlFor="telephone" className="mb-1.5 block">T&eacute;l&eacute;phone</Label>
                  <div className="relative">
                    <Input id="telephone" type="tel" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+33 6 00 00 00 00" className="pl-10" />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  </div>
                  <FieldErr name="telephone" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pays" className="mb-1.5 block">Pays / Ville *</Label>
                  <div className="relative">
                    <Input id="pays" value={form.pays} onChange={(e) => set("pays", e.target.value)} placeholder="Paris, France" className="pl-10" />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  </div>
                  <FieldErr name="pays" />
                </div>
                <div>
                  <Label htmlFor="role" className="mb-1.5 block">R&ocirc;le principal *</Label>
                  <select id="role" value={form.role} onChange={(e) => set("role", e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm text-white transition-all focus:outline-none focus:border-[#8B5CF6]/50 appearance-none">
                    <option value="" disabled className="bg-[#0a0a0a]">S&eacute;lectionnez</option>
                    {ROLES.map((r) => <option key={r} value={r} className="bg-[#0a0a0a] text-white">{r}</option>)}
                  </select>
                  <FieldErr name="role" />
                  {form.role === "Autre" && (
                    <Input className="mt-2" value={form.roleAutre} onChange={(e) => set("roleAutre", e.target.value)} placeholder="Pr&eacute;cisez votre r&ocirc;le..." />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Expérience & Pain Points */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-white mb-1">Quels probl&egrave;mes rencontrez-vous aujourd&apos;hui ?</p>
                <p className="text-xs text-white/30 mb-4">S&eacute;lectionnez tous ceux qui s&apos;appliquent</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PAIN_POINTS.map((p) => {
                    const active = form.painPoints.includes(p.id);
                    return (
                      <button key={p.id} type="button" onClick={() => togglePain(p.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all ${
                          active ? "text-white" : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:border-white/[0.15]"
                        }`}
                        style={active ? { backgroundColor: `${p.color}15`, borderColor: `${p.color}40` } : {}}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: active ? `${p.color}20` : "rgba(255,255,255,0.04)" }}>
                          <p.icon className="w-3.5 h-3.5" style={{ color: active ? p.color : "rgba(255,255,255,0.2)" }} />
                        </div>
                        <span className="flex-1">{p.label}</span>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: p.color }} />}
                      </button>
                    );
                  })}
                  {/* Option Autre */}
                  <button type="button" onClick={() => togglePain("autre")}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all ${
                      form.painPoints.includes("autre") ? "bg-[#C4956A]/10 border-[#C4956A]/30 text-white" : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:border-white/[0.15]"
                    }`}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: form.painPoints.includes("autre") ? "rgba(196,149,106,0.2)" : "rgba(255,255,255,0.04)" }}>
                      <MessageSquare className="w-3.5 h-3.5" style={{ color: form.painPoints.includes("autre") ? "#C4956A" : "rgba(255,255,255,0.2)" }} />
                    </div>
                    <span className="flex-1">Autre probl&egrave;me</span>
                    {form.painPoints.includes("autre") && <CheckCircle2 className="w-3.5 h-3.5 text-[#C4956A] ml-auto shrink-0" />}
                  </button>
                </div>
                {form.painPoints.includes("autre") && (
                  <Input className="mt-3" value={form.painAutre} onChange={(e) => set("painAutre", e.target.value)} placeholder="D&eacute;crivez votre probl&egrave;me..." />
                )}
              </div>

              <div>
                <Label htmlFor="projet" className="mb-1.5 block">D&eacute;crivez votre activit&eacute; (optionnel)</Label>
                <div className="relative">
                  <textarea id="projet" value={form.projet} onChange={(e) => set("projet", e.target.value)} rows={3}
                    placeholder="Nombre de biens, plateformes utilis&eacute;es, objectifs..."
                    className="flex w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:border-[#8B5CF6]/50 resize-none" />
                  <span className="absolute bottom-2 right-3 text-xs text-white/15">{form.projet.length}/500</span>
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Comment avez-vous connu E-Dome ?</Label>
                <select value={form.source} onChange={(e) => set("source", e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm text-white transition-all focus:outline-none focus:border-[#8B5CF6]/50 appearance-none">
                  <option value="" disabled className="bg-[#0a0a0a]">S&eacute;lectionnez</option>
                  {SOURCES.map((s) => <option key={s} value={s} className="bg-[#0a0a0a] text-white">{s}</option>)}
                </select>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Délai */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-white mb-1">Quel est votre niveau d&apos;int&eacute;r&ecirc;t ?</p>
                <p className="text-xs text-white/30 mb-4">Cela nous aide &agrave; adapter notre accompagnement</p>
                <div className="space-y-2">
                  {INTEREST_LEVELS.map((d) => {
                    const active = form.delai === d.value;
                    return (
                      <button key={d.value} type="button" onClick={() => set("delai", d.value)}
                        className={`w-full p-4 rounded-xl border text-sm font-medium text-left transition-all flex items-center gap-3 ${
                          active ? "text-white" : "bg-white/[0.02] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/60"
                        }`}
                        style={active ? { backgroundColor: `${d.color}15`, borderColor: `${d.color}40` } : {}}>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: active ? d.color : "rgba(255,255,255,0.15)" }}>
                          {active && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />}
                        </div>
                        <span>{d.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                <p className="text-xs text-white/40 leading-relaxed">En soumettant ce formulaire, vous manifestez votre int&eacute;r&ecirc;t pour le programme Membres Fondateurs. <strong className="text-white/60">Aucun engagement, aucun paiement requis.</strong> Vos donn&eacute;es sont trait&eacute;es de mani&egrave;re confidentielle.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
        {step > 0 ? (
          <button onClick={prev} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-4 h-4" />Retour
          </button>
        ) : <div />}

        {step < 2 ? (
          <button onClick={next}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] text-white text-sm font-semibold hover:bg-[#7C3AED] transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            Continuer <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={status === "sending"}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-sm font-semibold hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50">
            {status === "sending" ? <><Loader2 className="w-4 h-4 animate-spin" />Envoi...</> : <><Send className="w-4 h-4" />Envoyer ma demande</>}
          </button>
        )}
      </div>

      {status === "error" && (
        <p className="text-[#EF4444] text-xs text-center pb-4">Erreur. R&eacute;essayez ou contactez contact@edome.world</p>
      )}
    </div>
  );
}
