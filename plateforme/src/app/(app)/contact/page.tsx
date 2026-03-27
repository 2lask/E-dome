"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────

const subjects = [
  "Question générale",
  "Support technique",
  "Signalement",
  "Partenariat",
  "Presse",
  "Autre",
];

// ─── Page ───────────────────────────────────────────────

export default function ContactPage() {
  const [formData, setFormData] = useState({
    subject: "",
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid =
    formData.subject && formData.name && formData.email && formData.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[900px] pb-16"
    >
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4956A]/10">
            <Mail className="h-5 w-5 text-[#C4956A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Contactez-nous</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Notre équipe est là pour vous aider
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
        {/* Left: Form */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
                  Message envoyé !
                </h2>
                <p className="mb-6 max-w-sm text-sm text-[var(--text-secondary)]">
                  Nous reviendrons vers vous sous 48h. Merci de votre confiance.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setFormData({ subject: "", name: "", email: "", message: "" });
                  }}
                  className="text-sm text-[#C4956A] hover:text-[#D4A574] transition-colors"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Objet
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/40 appearance-none"
                  >
                    <option value="" disabled>
                      Sélectionnez un objet
                    </option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/40"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/40"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande..."
                    rows={6}
                    className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/40"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid || sending}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all",
                    isValid && !sending
                      ? "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                      : "bg-[var(--card)] text-[var(--text-muted)] cursor-not-allowed"
                  )}
                >
                  {sending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Contact Info */}
        <div className="space-y-4">
          {/* Email */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C4956A]/10">
                <Mail className="h-4 w-4 text-[#C4956A]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Email</p>
                <a
                  href="mailto:contact@edome.world"
                  className="text-sm font-medium text-[var(--foreground)] hover:text-[#C4956A] transition-colors"
                >
                  contact@edome.world
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C4956A]/10">
                <MapPin className="h-4 w-4 text-[#C4956A]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Adresse</p>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Neuchâtel, Suisse
                </p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C4956A]/10">
                <Clock className="h-4 w-4 text-[#C4956A]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Horaires</p>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Lun-Ven, 9h-18h CET
                </p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Suivez-nous
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[var(--text-secondary)] transition-colors hover:bg-[#C4956A]/10 hover:text-[#C4956A]"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[var(--text-secondary)] transition-colors hover:bg-[#C4956A]/10 hover:text-[#C4956A]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[var(--text-secondary)] transition-colors hover:bg-[#C4956A]/10 hover:text-[#C4956A]"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* FAQ Link */}
          <Link
            href="/aide"
            className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 transition-colors hover:border-[#C4956A]/20"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C4956A]/10">
              <HelpCircle className="h-4 w-4 text-[#C4956A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Centre d&apos;aide</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Consultez notre FAQ
              </p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
