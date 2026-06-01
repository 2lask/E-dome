"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Home,
  Compass,
  MessageCircle,
  LayoutDashboard,
  Building2,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Video,
  CalendarDays,
  Plus,
  BarChart3,
  Calendar,
  Users,
  Heart,
  Package,
  User as UserIcon,
  Bell,
  Settings,
  HelpCircle,
  Mail,
  FileText,
  Shield,
  LogOut,
  Newspaper,
  TrendingUp,
  Radio,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   QuickLauncher — panneau plein écran qui ouvre toutes les
   fonctionnalités de la plateforme d'un coup. Style Spotlight :
   recherche live + grille de catégories. Permet d'atteindre vite
   n'importe quelle route sans surcharger la sidebar (qui reste
   à 6 entrées).

   Ouvre/ferme via Esc, Cmd+K (Ctrl+K), ou clic outside.
   ───────────────────────────────────────────────────────────── */

interface LauncherItem {
  label: string;
  href: string;
  icon: LucideIcon;
  desc?: string;
}

interface LauncherCategory {
  title: string;
  items: LauncherItem[];
}

const CATEGORIES: LauncherCategory[] = [
  {
    title: "Découvrir",
    items: [
      { label: "Accueil", href: "/feed", icon: Home, desc: "Feed social" },
      { label: "Explorer", href: "/explorer", icon: Compass, desc: "Tous les biens" },
      { label: "Boutique", href: "/boutique", icon: ShoppingBag, desc: "Marketplace produits" },
      { label: "Services", href: "/services", icon: Briefcase, desc: "Prestataires & artisans" },
      { label: "Formations", href: "/formations", icon: GraduationCap, desc: "Apprendre l'immobilier" },
      { label: "Lives", href: "/live", icon: Video, desc: "Direct & replays" },
      { label: "Événements", href: "/evenements", icon: CalendarDays, desc: "Visites, salons, ateliers" },
      { label: "Recherche avancée", href: "/recherche", icon: Search, desc: "Filtres détaillés" },
    ],
  },
  {
    title: "Mon espace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, desc: "Vue d'ensemble" },
      { label: "Revenus & stats", href: "/statistiques", icon: BarChart3 },
      { label: "Réservations", href: "/reservations", icon: Calendar },
      { label: "Mes annonces", href: "/dashboard/annonces", icon: Package },
      { label: "Apporteurs", href: "/apporteurs", icon: Users, desc: "Programme de parrainage" },
      { label: "Favoris", href: "/favoris", icon: Heart },
      { label: "Investisseurs", href: "/investisseurs", icon: TrendingUp },
    ],
  },
  {
    title: "Publier",
    items: [
      { label: "Publier un bien", href: "/publier", icon: Building2, desc: "Vente ou location" },
      { label: "Vendre un produit", href: "/boutique/vendre", icon: ShoppingBag, desc: "Catalogue boutique" },
      { label: "Créer une formation", href: "/formations/creer", icon: GraduationCap },
      { label: "Programmer un live", href: "/live", icon: Video },
      { label: "Créer un événement", href: "/evenements/creer", icon: CalendarDays },
      { label: "Proposer un service", href: "/services", icon: Briefcase },
      { label: "Nouveau post", href: "/creer-post", icon: Plus, desc: "Texte / média" },
      { label: "Nouveau Reel", href: "/creer-reel", icon: Radio, desc: "Vidéo verticale" },
    ],
  },
  {
    title: "Communauté",
    items: [
      { label: "Messages", href: "/messages", icon: MessageCircle },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Mon profil", href: "/profil", icon: UserIcon },
    ],
  },
  {
    title: "Compte & infos",
    items: [
      { label: "Paramètres", href: "/parametres", icon: Settings },
      { label: "Aide & FAQ", href: "/aide", icon: HelpCircle },
      { label: "Contact", href: "/contact", icon: Mail },
      { label: "Conditions", href: "/conditions", icon: FileText },
      { label: "Confidentialité", href: "/confidentialite", icon: Shield },
      { label: "Quitter la maquette", href: "/", icon: LogOut },
    ],
  },
];

interface QuickLauncherProps {
  open: boolean;
  onClose: () => void;
}

export function QuickLauncher({ open, onClose }: QuickLauncherProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // Focus auto + reset query à chaque ouverture
  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // Esc pour fermer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return CATEGORIES;
    const q = query.toLowerCase();
    return CATEGORIES.map((c) => ({
      ...c,
      items: c.items.filter(
        (it) =>
          it.label.toLowerCase().includes(q) ||
          (it.desc ?? "").toLowerCase().includes(q)
      ),
    })).filter((c) => c.items.length > 0);
  }, [query]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 animate-fade-in"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]"
        style={{
          background: "var(--card)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 24px 48px rgba(15,23,42,0.18)",
        }}
      >
        {/* Header recherche */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <Search size={18} style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher une fonctionnalité, une page…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)]"
            style={{ color: "var(--foreground)" }}
          />
          <span
            className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium"
            style={{
              background: "var(--hover-bg)",
              color: "var(--text-muted)",
              border: "1px solid var(--card-border)",
            }}
          >
            Esc
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Catégories */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {filtered.length === 0 ? (
            <p className="text-sm py-10 text-center" style={{ color: "var(--text-muted)" }}>
              Aucun résultat pour « {query} ».
            </p>
          ) : (
            filtered.map((cat) => (
              <section key={cat.title}>
                <h3
                  className="text-[11px] uppercase tracking-wider font-semibold mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cat.title}
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cat.items.map((it) => {
                    const Icon = it.icon;
                    return (
                      <li key={it.href + it.label}>
                        <button
                          onClick={() => go(it.href)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left"
                          style={{ color: "var(--foreground)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <span
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium leading-tight truncate">
                              {it.label}
                            </span>
                            {it.desc && (
                              <span
                                className="block text-[11px] leading-tight mt-0.5 truncate"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {it.desc}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

        {/* Footer raccourci */}
        <div
          className="px-4 py-2 flex items-center justify-between text-[11px]"
          style={{
            borderTop: "1px solid var(--card-border)",
            color: "var(--text-muted)",
          }}
        >
          <span>Astuce : ⌘K / Ctrl+K pour ouvrir, Esc pour fermer</span>
          <span>{filtered.reduce((s, c) => s + c.items.length, 0)} fonctionnalités</span>
        </div>
      </div>
    </div>
  );
}
