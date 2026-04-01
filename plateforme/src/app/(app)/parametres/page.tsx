"use client";

import React, { useState, useCallback } from "react";
import { useApp } from "@/lib/context";
import { roleLabels } from "@/lib/types";
import type { Role } from "@/lib/types";

// ─── Types ──────────────────────────────────────────────────────────────────

type Section = "general" | "securite" | "notifications" | "confidentialite" | "facturation" | "roles";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "general", label: "Général" },
  { key: "securite", label: "Sécurité" },
  { key: "notifications", label: "Notifications" },
  { key: "confidentialite", label: "Confidentialité" },
  { key: "facturation", label: "Facturation" },
  { key: "roles", label: "Rôles" },
];

const ALL_ROLES: Role[] = [
  "client", "hote", "agence", "promoteur", "apporteur",
  "investisseur", "formateur", "proprietaire", "photographe",
  "courtier", "architecte", "notaire",
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ParametresPage() {
  const { formatPrice, availableRoles, toggleAvailableRole } = useApp();
  const [section, setSection] = useState<Section>("general");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // General
  const [genForm, setGenForm] = useState({
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    firstName: "Léo",
    lastName: "Martin",
    email: "leo@e-dome.ch",
    phone: "+41 79 123 45 67",
    country: "Suisse",
    city: "Lausanne",
    bio: "Passionné d'immobilier.",
    language: "fr",
  });

  // Security
  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [twoFAVerified, setTwoFAVerified] = useState(false);

  const pwdStrength = (() => {
    const p = passwords.newPwd;
    if (p.length === 0) return { level: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ["Faible", "Moyen", "Bon", "Excellent"];
    const colors = ["bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
    return { level: score, label: labels[score - 1] || "", color: colors[score - 1] || "" };
  })();

  // Notifications
  const [notifChannels, setNotifChannels] = useState({ email: true, push: true, sms: false });
  const [notifCategories, setNotifCategories] = useState({
    reservations: true,
    messages: true,
    apporteurs: true,
    formations: false,
    systeme: true,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showStats: true,
  });
  const [showGDPR, setShowGDPR] = useState(false);

  // Billing
  const mockPlan = { name: "Premium", price: 49, period: "/mois" };
  const mockPaymentMethod = { type: "Visa", last4: "4242", expiry: "12/27" };
  const mockBillingHistory = [
    { id: "b1", date: "2026-03-01", amount: 49, description: "Abonnement Premium - Mars 2026" },
    { id: "b2", date: "2026-02-01", amount: 49, description: "Abonnement Premium - Février 2026" },
    { id: "b3", date: "2026-01-01", amount: 49, description: "Abonnement Premium - Janvier 2026" },
  ];

  // Roles
  const [otherRole, setOtherRole] = useState("");

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Paramètres</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-56 flex-shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`px-4 py-2.5 text-sm rounded-xl text-left whitespace-nowrap transition-colors ${
                  section === s.key
                    ? "bg-[#C4956A]/10 text-[#C4956A] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ─── Général ─────────────────────────────────────────── */}
          {section === "general" && (
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Général</h2>

              <div className="flex items-center gap-4">
                <img src={genForm.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                <button className="px-4 py-2 text-sm rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]">
                  Changer la photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Prénom", key: "firstName" as const },
                  { label: "Nom", key: "lastName" as const },
                  { label: "Email", key: "email" as const },
                  { label: "Téléphone", key: "phone" as const },
                  { label: "Pays", key: "country" as const },
                  { label: "Ville", key: "city" as const },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">{f.label}</label>
                    <input
                      value={genForm[f.key]}
                      onChange={(e) => setGenForm({ ...genForm, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Bio</label>
                <textarea
                  value={genForm.bio}
                  onChange={(e) => setGenForm({ ...genForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Langue</label>
                <select
                  value={genForm.language}
                  onChange={(e) => setGenForm({ ...genForm, language: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="th">ไทย</option>
                </select>
              </div>

              <button
                onClick={() => showToast("Profil sauvegardé !")}
                className="px-6 py-2.5 text-sm rounded-xl bg-[#C4956A] text-white hover:bg-[#b8845a] transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          )}

          {/* ─── Sécurité ────────────────────────────────────────── */}
          {section === "securite" && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Changer le mot de passe</h2>
                {[
                  { label: "Mot de passe actuel", key: "current" as const, type: "password" },
                  { label: "Nouveau mot de passe", key: "newPwd" as const, type: "password" },
                  { label: "Confirmer", key: "confirm" as const, type: "password" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={passwords[f.key]}
                      onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                    />
                  </div>
                ))}

                {passwords.newPwd && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i <= pwdStrength.level ? pwdStrength.color : "bg-[var(--input-bg)]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">{pwdStrength.label}</span>
                  </div>
                )}

                <button
                  onClick={() => showToast("Mot de passe mis à jour !")}
                  className="px-6 py-2.5 text-sm rounded-xl bg-[#C4956A] text-white hover:bg-[#b8845a]"
                >
                  Mettre à jour
                </button>
              </div>

              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">Authentification à deux facteurs</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Sécurisez votre compte avec un code à usage unique.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!twoFA) { setShowQR(true); setTwoFA(true); }
                      else { setTwoFA(false); setShowQR(false); setTwoFAVerified(false); }
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${twoFA ? "bg-[#C4956A]" : "bg-[var(--input-bg)]"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${twoFA ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>

                {showQR && !twoFAVerified && (
                  <div className="mt-4 space-y-4">
                    <div className="w-40 h-40 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-xs text-[var(--text-muted)]">QR Code 2FA</span>
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Code de vérification (6 chiffres)</label>
                      <div className="flex gap-2">
                        <input
                          value={verifyCode}
                          onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          maxLength={6}
                          placeholder="000000"
                          className="w-32 px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] text-center tracking-widest"
                        />
                        <button
                          onClick={() => {
                            if (verifyCode.length === 6) { setTwoFAVerified(true); showToast("2FA activé !"); }
                          }}
                          className="px-4 py-2 text-sm rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a]"
                        >
                          Vérifier
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {twoFAVerified && (
                  <p className="mt-3 text-sm text-emerald-400">2FA activé avec succès.</p>
                )}
              </div>
            </div>
          )}

          {/* ─── Notifications ───────────────────────────────────── */}
          {section === "notifications" && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Canaux de notification</h2>
                <div className="space-y-3">
                  {(Object.keys(notifChannels) as Array<keyof typeof notifChannels>).map((ch) => (
                    <div key={ch} className="flex items-center justify-between py-2">
                      <span className="text-sm text-[var(--foreground)] capitalize">{ch}</span>
                      <button
                        onClick={() => {
                          setNotifChannels({ ...notifChannels, [ch]: !notifChannels[ch] });
                          showToast(`${ch} ${!notifChannels[ch] ? "activé" : "désactivé"}`);
                        }}
                        className={`w-12 h-6 rounded-full transition-colors relative ${notifChannels[ch] ? "bg-[#C4956A]" : "bg-[var(--input-bg)]"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${notifChannels[ch] ? "translate-x-6" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Catégories</h2>
                <div className="space-y-3">
                  {(Object.entries(notifCategories) as [string, boolean][]).map(([cat, enabled]) => {
                    const labels: Record<string, string> = {
                      reservations: "Réservations",
                      messages: "Messages",
                      apporteurs: "Apporteurs",
                      formations: "Formations",
                      systeme: "Système",
                    };
                    return (
                      <div key={cat} className="flex items-center justify-between py-2">
                        <span className="text-sm text-[var(--foreground)]">{labels[cat] || cat}</span>
                        <button
                          onClick={() => {
                            setNotifCategories({ ...notifCategories, [cat]: !enabled });
                            showToast(`${labels[cat]} ${!enabled ? "activé" : "désactivé"}`);
                          }}
                          className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? "bg-[#C4956A]" : "bg-[var(--input-bg)]"}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${enabled ? "translate-x-6" : "translate-x-0.5"}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── Confidentialité ──────────────────────────────────── */}
          {section === "confidentialite" && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Confidentialité</h2>
                <div className="space-y-3">
                  {[
                    { key: "profilePublic", label: "Profil public" },
                    { key: "showEmail", label: "Afficher l'email" },
                    { key: "showPhone", label: "Afficher le téléphone" },
                    { key: "showStats", label: "Afficher les statistiques" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <span className="text-sm text-[var(--foreground)]">{item.label}</span>
                      <button
                        onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key as keyof typeof privacy] })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          privacy[item.key as keyof typeof privacy] ? "bg-[#C4956A]" : "bg-[var(--input-bg)]"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          privacy[item.key as keyof typeof privacy] ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">RGPD</h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Vous pouvez demander une exportation de toutes vos données personnelles.
                </p>
                <button
                  onClick={() => setShowGDPR(true)}
                  className="px-5 py-2 text-sm rounded-xl border border-[var(--card-border)] text-[var(--foreground)] hover:border-[#C4956A]/50"
                >
                  Exporter mes données
                </button>
              </div>

              {showGDPR && (
                <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4" onClick={() => setShowGDPR(false)}>
                  <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Exportation des données</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Votre demande d'exportation a été prise en compte. Vous recevrez un email avec un lien de téléchargement dans les 48 heures.
                    </p>
                    <button onClick={() => { setShowGDPR(false); showToast("Demande envoyée !"); }} className="w-full py-2.5 text-sm rounded-xl bg-[#C4956A] text-white hover:bg-[#b8845a]">
                      Compris
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Facturation ──────────────────────────────────────── */}
          {section === "facturation" && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Plan actuel</h2>
                <div className="flex items-center justify-between p-4 bg-[#C4956A]/10 border border-[#C4956A]/20 rounded-xl">
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{mockPlan.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">Renouvellement automatique</div>
                  </div>
                  <div className="text-lg font-bold text-[#C4956A]">
                    {formatPrice(mockPlan.price)}{mockPlan.period}
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Moyen de paiement</h2>
                <div className="flex items-center gap-3 p-3 bg-[var(--input-bg)] rounded-xl">
                  <div className="w-10 h-7 bg-[var(--card-border)] rounded flex items-center justify-center text-xs text-[var(--text-muted)]">
                    {mockPaymentMethod.type}
                  </div>
                  <div>
                    <div className="text-sm text-[var(--foreground)]">•••• {mockPaymentMethod.last4}</div>
                    <div className="text-xs text-[var(--text-muted)]">Expire {mockPaymentMethod.expiry}</div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Historique de facturation</h2>
                <div className="space-y-3">
                  {mockBillingHistory.map((b) => (
                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0">
                      <div>
                        <div className="text-sm text-[var(--foreground)]">{b.description}</div>
                        <div className="text-xs text-[var(--text-muted)]">{b.date}</div>
                      </div>
                      <span className="text-sm font-medium text-[var(--foreground)]">{formatPrice(b.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Rôles ────────────────────────────────────────────── */}
          {section === "roles" && (
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Mes rôles</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Activez ou désactivez vos rôles sur la plateforme. Au moins un rôle doit rester actif.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ALL_ROLES.map((role) => {
                  const active = availableRoles.includes(role);
                  return (
                    <div
                      key={role}
                      className={`p-4 rounded-xl border transition-colors ${
                        active
                          ? "border-[#C4956A] bg-[#C4956A]/5"
                          : "border-[var(--card-border)] hover:border-[var(--text-muted)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {roleLabels[role]}
                        </span>
                        <button
                          onClick={() => {
                            toggleAvailableRole(role);
                            showToast(`${roleLabels[role]} ${active ? "désactivé" : "activé"}`);
                          }}
                          className={`w-10 h-5 rounded-full transition-colors relative ${
                            active ? "bg-[#C4956A]" : "bg-[var(--input-bg)]"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                              active ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* "Autre" option */}
                <div className="p-4 rounded-xl border border-[var(--card-border)]">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Autre</label>
                  <input
                    value={otherRole}
                    onChange={(e) => setOtherRole(e.target.value)}
                    placeholder="Précisez..."
                    className="w-full px-3 py-1.5 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm shadow-xl animate-slide-up z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
