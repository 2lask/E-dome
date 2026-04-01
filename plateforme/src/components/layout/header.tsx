"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  ChevronDown,
  X,
  Globe,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useTheme } from "@/lib/theme-context";
import { useLanguage, type Language } from "@/lib/i18n";
import { roleLabels, roleBadgeColors } from "@/lib/types";
import type { Currency, Role } from "@/lib/types";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "CHF", label: "CHF - Franc suisse" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "USD", label: "USD - Dollar US" },
  { code: "GBP", label: "GBP - Livre sterling" },
  { code: "AED", label: "AED - Dirham EAU" },
  { code: "MAD", label: "MAD - Dirham marocain" },
  { code: "THB", label: "THB - Baht thai" },
];

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "th", label: "TH" },
];

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { activeRole, setActiveRole, availableRoles, currency, setCurrency } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showCurrency, setShowCurrency] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem("edome_recent_searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setShowCurrency(false);
        setShowLanguage(false);
        setShowRole(false);
        setShowNotifications(false);
        setShowUser(false);
      }
      if (searchRef.current && !searchRef.current.contains(target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const closeAllDropdowns = () => {
    setShowCurrency(false);
    setShowLanguage(false);
    setShowRole(false);
    setShowNotifications(false);
    setShowUser(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("edome_recent_searches", JSON.stringify(updated));
    router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`);
    setSearchFocused(false);
  };

  const removeRecentSearch = (s: string) => {
    const updated = recentSearches.filter((r) => r !== s);
    setRecentSearches(updated);
    localStorage.setItem("edome_recent_searches", JSON.stringify(updated));
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 8,
    background: "var(--card)",
    border: "1px solid var(--card-border)",
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    zIndex: 50,
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-16"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg cursor-pointer"
        style={{ color: "var(--text-secondary)" }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md" data-dropdown>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder={t("btn.rechercher") + "..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-colors"
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </form>
        {searchFocused && (
          <div style={dropdownStyle}>
            {recentSearches.length > 0 && (
              <>
                <p className="text-xs font-medium px-3 py-1.5" style={{ color: "var(--text-muted)" }}>
                  Recherches recentes
                </p>
                {recentSearches.map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={() => {
                      setSearchQuery(s);
                      router.push(`/recherche?q=${encodeURIComponent(s)}`);
                      setSearchFocused(false);
                    }}
                  >
                    <span className="text-sm">{s}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(s);
                      }}
                      className="cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </>
            )}
            {recentSearches.length > 0 && (
              <div style={{ borderTop: "1px solid var(--card-border)", margin: "4px 0" }} />
            )}
            <p className="text-xs font-medium px-3 py-1.5" style={{ color: "var(--text-muted)" }}>
              Suggestions
            </p>
            {["Villa Lausanne", "Appartement Geneve", "Investissement", "Chalet Verbier"].map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => {
                  setSearchQuery(s);
                  router.push(`/recherche?q=${encodeURIComponent(s)}`);
                  setSearchFocused(false);
                }}
              >
                <Search size={12} style={{ color: "var(--text-muted)" }} />
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={theme === "dark" ? "Mode clair" : "Mode sombre"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language selector */}
        <div className="relative hidden md:block" data-dropdown>
          <button
            onClick={() => {
              closeAllDropdowns();
              setShowLanguage(!showLanguage);
            }}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Globe size={16} />
            <span>{language.toUpperCase()}</span>
          </button>
          {showLanguage && (
            <div style={dropdownStyle}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLanguage(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer"
                  style={{
                    color: language === l.code ? "var(--gold)" : "var(--text-secondary)",
                    fontWeight: language === l.code ? 600 : 400,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currency selector */}
        <div className="relative hidden md:block" data-dropdown>
          <button
            onClick={() => {
              closeAllDropdowns();
              setShowCurrency(!showCurrency);
            }}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span>{currency}</span>
            <ChevronDown size={14} />
          </button>
          {showCurrency && (
            <div style={{ ...dropdownStyle, minWidth: 220 }}>
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setShowCurrency(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer"
                  style={{
                    color: currency === c.code ? "var(--gold)" : "var(--text-secondary)",
                    fontWeight: currency === c.code ? 600 : 400,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role switcher */}
        <div className="relative hidden md:block" data-dropdown>
          <button
            onClick={() => {
              closeAllDropdowns();
              setShowRole(!showRole);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${roleBadgeColors[activeRole]}`}
          >
            <span>{roleLabels[activeRole]}</span>
            <ChevronDown size={12} />
          </button>
          {showRole && (
            <div style={dropdownStyle}>
              {availableRoles.map((role: Role) => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    setShowRole(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer flex items-center gap-2"
                  style={{
                    color: activeRole === role ? "var(--gold)" : "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${roleBadgeColors[role]}`}
                  >
                    {roleLabels[role]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => {
              closeAllDropdowns();
              setShowNotifications(!showNotifications);
            }}
            className="p-2 rounded-lg transition-colors cursor-pointer relative"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Bell size={18} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: "var(--gold)" }}
            />
          </button>
          {showNotifications && (
            <div style={{ ...dropdownStyle, minWidth: 300, maxHeight: 400, overflow: "auto" }}>
              <p className="text-sm font-medium px-3 py-2" style={{ color: "var(--text-primary)" }}>
                Notifications
              </p>
              <div className="px-3 py-8 text-center" style={{ color: "var(--text-muted)" }}>
                <p className="text-sm">Aucune nouvelle notification</p>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => {
              closeAllDropdowns();
              setShowUser(!showUser);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            LD
          </button>
          {showUser && (
            <div style={dropdownStyle}>
              <div className="px-3 py-2 mb-1" style={{ borderBottom: "1px solid var(--divider)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Léo Martin
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  leo@edome.ch
                </p>
              </div>
              <button
                onClick={() => {
                  router.push("/profil");
                  setShowUser(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <User size={16} />
                Profil
              </button>
              <button
                onClick={() => {
                  router.push("/parametres");
                  setShowUser(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Settings size={16} />
                Parametres
              </button>
              <button
                onClick={() => {
                  router.push("/auth/connexion");
                  setShowUser(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{ color: "#ef4444" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <LogOut size={16} />
                Deconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
