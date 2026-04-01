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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sujet || !form.nom || !form.email || !form.message) return;
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center py-16 space-y-4 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Message envoye !</h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            Merci pour votre message. Notre equipe vous repondra dans les plus brefs delais, generalement sous 24 heures.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ sujet: "", nom: "", email: "", message: "" }); }}
            className="mt-4 px-6 py-2.5 rounded-lg bg-[#C4956A] text-white font-medium hover:opacity-90 transition"
          >
            Envoyer un autre message
          </button>
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
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[#C4956A] transition"
              >
                <option value="">Selectionnez un sujet</option>
                <option value="general">Question generale</option>
                <option value="technique">Probleme technique</option>
                <option value="compte">Mon compte</option>
                <option value="paiement">Paiement et facturation</option>
                <option value="signalement">Signaler un abus</option>
                <option value="partenariat">Proposition de partenariat</option>
                <option value="presse">Presse et media</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">Nom complet</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                required
                placeholder="Votre nom..."
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">Adresse email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
                placeholder="Decrivez votre demande..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-[#C4956A] text-white font-medium hover:opacity-90 transition"
            >
              Envoyer le message
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
