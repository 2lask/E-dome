"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Check,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { roleLabels } from "@/lib/types";
import { currentUser } from "@/lib/mock-data";
import { useApp, type Currency } from "@/lib/context";
import { useTheme } from "@/lib/theme-context";
import { useTranslation, type Language } from "@/lib/i18n";

// ─── Types ───────────────────────────────────────────────

interface HeaderProps {
  onMenuClick: () => void;
}

const roleBadgeStyles: Record<string, string> = {
  client: "bg-gray-500/15 text-gray-400",
  hote: "bg-blue-500/15 text-blue-400",
  proprietaire: "bg-green-500/15 text-green-400",
  agence: "bg-violet-500/15 text-violet-400",
  promoteur: "bg-orange-500/15 text-orange-400",
  apporteur: "bg-yellow-500/15 text-yellow-400",
  investisseur: "bg-red-500/15 text-red-400",
  formateur: "bg-teal-500/15 text-teal-400",
  admin: "bg-white/10 text-white",
};

const currencies: Currency[] = ['CHF', 'EUR', 'USD', 'GBP', 'AED', 'MAD', 'THB'];

const languageLabels: Record<Language, string> = {
  fr: 'FR',
  en: 'EN',
  th: 'TH',
};

const languageNames: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  th: 'ไทย',
};

// ─── Component ───────────────────────────────────────────

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { activeRole, availableRoles, setActiveRole, currency, setCurrency } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();

  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("edome-recent-searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  // Notifications with local state for read/unread
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Nouvelle réservation",
      message: "Sophie Martin a réservé votre appartement à Lausanne",
      time: "Il y a 5 min",
      read: false,
      href: "/reservations",
    },
    {
      id: "2",
      title: "Commission validée",
      message: "Votre commission de CHF 2'500 a été validée",
      time: "Il y a 1h",
      read: false,
      href: "/apporteurs",
    },
    {
      id: "3",
      title: "Nouveau message",
      message: "Marc Dupont vous a envoyé un message",
      time: "Il y a 3h",
      read: true,
      href: "/messages",
    },
    {
      id: "4",
      title: "Avis reçu",
      message: "Nouveau commentaire 5 étoiles sur votre propriété",
      time: "Il y a 6h",
      read: true,
      href: "/explorer",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("edome-recent-searches", JSON.stringify(updated));
    } catch {}
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      setSearchFocused(false);
      router.push(`/recherche?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    saveRecentSearch(term);
    setSearchTerm(term);
    setSearchFocused(false);
    router.push(`/explorer?q=${encodeURIComponent(term)}`);
  };

  const closeAllDropdowns = () => {
    setRoleOpen(false);
    setNotifOpen(false);
    setUserOpen(false);
    setCurrencyOpen(false);
    setLangOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node))
        setRoleOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchFocused(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node))
        setCurrencyOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-xl md:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder={t('header.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          onFocus={() => setSearchFocused(true)}
          className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-16 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50 focus:ring-1 focus:ring-[#C4956A]/20"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[var(--border-hover)] bg-[var(--card-hover)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
          Ctrl+K
        </kbd>

        {/* Search dropdown */}
        {searchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50">
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="border-b border-[var(--border)] p-2">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {t('header.recent')}
                </p>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                  >
                    <Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="p-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t('header.popular')}
              </p>
              {[
                "Villas en Suisse",
                "Appartements à Paris",
                "Location Maroc",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                >
                  <Search className="h-3.5 w-3.5 text-[#C4956A]" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--foreground)]"
          title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
        >
          {theme === 'dark' ? (
            <Moon className="h-4.5 w-4.5" />
          ) : (
            <Sun className="h-4.5 w-4.5" />
          )}
        </button>

        {/* Language selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => {
              setLangOpen(!langOpen);
              setRoleOpen(false);
              setNotifOpen(false);
              setUserOpen(false);
              setCurrencyOpen(false);
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--foreground)]"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{languageLabels[language]}</span>
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50">
              <div className="p-1.5">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold">{languageLabels[lang]}</span>
                      <span className="text-xs">{languageNames[lang]}</span>
                    </span>
                    {language === lang && (
                      <Check className="h-3.5 w-3.5 text-[#C4956A]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Currency selector */}
        <div ref={currencyRef} className="relative hidden sm:block">
          <button
            onClick={() => {
              setCurrencyOpen(!currencyOpen);
              setRoleOpen(false);
              setNotifOpen(false);
              setUserOpen(false);
              setLangOpen(false);
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--foreground)]"
          >
            {currency}
            <ChevronDown className="h-3 w-3" />
          </button>

          {currencyOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50">
              <div className="p-1.5 max-h-60 overflow-y-auto">
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                  >
                    <span>{c}</span>
                    {currency === c && (
                      <Check className="h-3.5 w-3.5 text-[#C4956A]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role switcher */}
        <div ref={roleRef} className="relative hidden md:block">
          <button
            onClick={() => {
              setRoleOpen(!roleOpen);
              setNotifOpen(false);
              setUserOpen(false);
              setCurrencyOpen(false);
              setLangOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:brightness-125",
              roleBadgeStyles[activeRole]
            )}
          >
            {roleLabels[activeRole]}
            <ChevronDown className="h-3 w-3" />
          </button>

          {roleOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50">
              <div className="p-1.5">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {t('header.changeRole')}
                </p>
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setActiveRole(role);
                      setRoleOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          roleBadgeStyles[role]
                        )}
                      >
                        {roleLabels[role]}
                      </span>
                    </span>
                    {activeRole === role && (
                      <Check className="h-3.5 w-3.5 text-[#C4956A]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setRoleOpen(false);
              setUserOpen(false);
              setCurrencyOpen(false);
              setLangOpen(false);
            }}
            className="relative rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C4956A] px-1 text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl md:w-96 z-50">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {t('header.notifications')}
                </h3>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#C4956A] hover:underline"
                >
                  {t('header.markAllRead')}
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
                      );
                      setNotifOpen(false);
                      router.push(notif.href);
                    }}
                    className={cn(
                      "flex w-full gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition-colors hover:bg-[var(--accent)]/[0.04] cursor-pointer",
                      !notif.read && "bg-[#C4956A]/[0.03]"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 flex-shrink-0 rounded-full",
                        notif.read ? "bg-transparent" : "bg-[#C4956A]"
                      )}
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {notif.title}
                      </p>
                      <p className="truncate text-xs text-[var(--text-secondary)]">
                        {notif.message}
                      </p>
                      <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                        {notif.time}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-[var(--border)] p-2">
                <Link
                  href="/notifications"
                  className="block rounded-lg py-2 text-center text-xs font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/5"
                  onClick={() => setNotifOpen(false)}
                >
                  {t('header.viewAll')}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User avatar dropdown */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => {
              setUserOpen(!userOpen);
              setRoleOpen(false);
              setNotifOpen(false);
              setCurrencyOpen(false);
              setLangOpen(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-xs font-bold text-black transition-opacity hover:opacity-90"
          >
            KB
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50">
              {/* User info */}
              <div className="border-b border-[var(--border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Karim Benali
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  karim.benali@edome.ch
                </p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/profil"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                >
                  <User className="h-4 w-4" />
                  {t('nav.profil')}
                </Link>
                <Link
                  href="/parametres"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.parametres')}
                </Link>
                <div className="my-1 border-t border-[var(--border)]" />
                <button
                  onClick={() => {
                    setUserOpen(false);
                    router.push("/auth/connexion");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.deconnexion')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
