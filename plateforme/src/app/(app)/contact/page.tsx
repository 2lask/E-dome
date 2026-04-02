"use client";

import React, { useState } from "react";

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ContactPage() {
  const [form, setForm] = useState({
    sujet: "",
    nom: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.sujet) errs.sujet = "Veuillez selectionner un sujet.";
    if (!form.nom.trim()) errs.nom = "Le nom est requis.";
    if (!form.email.trim()) errs.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "L'email n'est pas valide.";
    if (!form.message.trim()) errs.message = "Le message est requis.";
    else if (form.message.trim().length < 10) errs.message = "Le message doit contenir au moins 10 caracteres.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    // Simulate email sending delay
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ sujet: "", nom: "", email: "", message: "" });
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center py-16 space-y-4 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
          {/* Animated checkmark */}
          <div className="relative mx-auto w-20 h-20">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #C4956A, #d4a574)",
                animation: "scaleIn 0.5s ease-out",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" style={{ strokeDasharray: 24, strokeDashoffset: 0, animation: "drawCheck 0.6s ease-out 0.3s both" }} />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Message envoyé !</h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            Votre message a été envoyé. Nous vous répondrons sous 24-48h.
          </p>
          <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
            Un email de confirmation a été envoyé à <span className="text-[var(--foreground)] font-medium">{form.email || "votre adresse"}</span>.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-6 py-2.5 rounded-lg bg-[#C4956A] text-white font-medium hover:opacity-90 transition"
          >
            Envoyer un autre message
          </button>
          <style>{`
            @keyframes scaleIn {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.15); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes drawCheck {
              0% { stroke-dashoffset: 24; }
              100% { stroke-dashoffset: 0; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Contactez-nous</h1>
        <p className="text-[var(--text-secondary)]">Une question, une suggestion ou un probleme ? Nous sommes la pour vous aider.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-5">
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">Sujet</label>
              <select
                value={form.sujet}
                onChange={(e) => handleChange("sujet", e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border text-[var(--foreground)] outline-none focus:border-[#C4956A] transition ${
                  errors.sujet ? "border-red-400" : "border-[var(--input-border)]"
                }`}
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="general">Question generale</option>
                <option value="technique">Probleme technique</option>
                <option value="compte">Mon compte</option>
                <option value="paiement">Paiement et facturation</option>
                <option value="signalement">Signaler un abus</option>
                <option value="partenariat">Proposition de partenariat</option>
                <option value="presse">Presse et media</option>
                <option value="autre">Autre</option>
              </select>
              {errors.sujet && <p className="text-xs text-red-400 mt-1">{errors.sujet}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">Nom complet</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                required
                placeholder="Votre nom..."
                className={`w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition ${
                  errors.nom ? "border-red-400" : "border-[var(--input-border)]"
                }`}
              />
              {errors.nom && <p className="text-xs text-red-400 mt-1">{errors.nom}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">Adresse email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="votre@email.com"
                className={`w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition ${
                  errors.email ? "border-red-400" : "border-[var(--input-border)]"
                }`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
                placeholder="Décrivez votre demande..."
                rows={5}
                className={`w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition resize-none ${
                  errors.message ? "border-red-400" : "border-[var(--input-border)]"
                }`}
              />
              {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3 rounded-lg bg-[#C4956A] text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le message"
              )}
            </button>
          </form>
        </div>

        {/* Info sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Informations de contact</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-[var(--text-muted)]">Email</p>
                <p className="text-[var(--foreground)]">support@edome.world</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[var(--text-muted)]">Telephone</p>
                <p className="text-[var(--foreground)]">+41 32 000 00 00</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[var(--text-muted)]">Adresse</p>
                <p className="text-[var(--foreground)]">E-Dome Sarl<br />Rue de la Gare 12<br />2000 Neuchatel, Suisse</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Horaires du support</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Lundi - Vendredi</span>
                <span className="text-[var(--foreground)] font-medium">9h00 - 18h00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Samedi</span>
                <span className="text-[var(--foreground)] font-medium">10h00 - 14h00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Dimanche</span>
                <span className="text-[var(--text-muted)]">Ferme</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Fuseau horaire : CET (Zurich)</p>
          </div>

          {/* Social Links */}
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Suivez-nous</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "LinkedIn", url: "https://linkedin.com/company/edome" },
                { name: "Instagram", url: "https://instagram.com/edome.world" },
                { name: "Facebook", url: "https://facebook.com/edome.world" },
                { name: "X (Twitter)", url: "https://x.com/edome_world" },
                { name: "YouTube", url: "https://youtube.com/@edome" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm hover:text-[#C4956A] transition"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
