"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Role, Currency } from "./types";

// ─── Exchange rates (base CHF = 1) ──────────────────────────────────────────

const EXCHANGE_RATES: Record<Currency, number> = {
  CHF: 1,
  EUR: 0.94,
  USD: 1.08,
  GBP: 0.82,
  AED: 3.97,
  MAD: 10.5,
  THB: 37.5,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CHF: "CHF",
  EUR: "€",
  USD: "$",
  GBP: "£",
  AED: "AED",
  MAD: "MAD",
  THB: "฿",
};

// ─── Context shape ──────────────────────────────────────────────────────────

interface AppContextValue {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  availableRoles: Role[];
  toggleAvailableRole: (role: Role) => void;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  followedUsers: Set<string>;
  toggleFollow: (id: string) => void;
  isFollowing: (id: string) => boolean;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number, originalCurrency?: Currency) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Default values ─────────────────────────────────────────────────────────

const DEFAULT_ROLE: Role = "client";
const DEFAULT_ROLES: Role[] = ["client", "hote"];
const DEFAULT_CURRENCY: Currency = "CHF";
const STORAGE_PREFIX = "edome_";

// ─── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [activeRole, setActiveRoleState] = useState<Role>(DEFAULT_ROLE);
  const [availableRoles, setAvailableRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  // Load from localStorage after mount
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(`${STORAGE_PREFIX}activeRole`);
      if (storedRole) setActiveRoleState(storedRole as Role);

      const storedRoles = localStorage.getItem(`${STORAGE_PREFIX}availableRoles`);
      if (storedRoles) setAvailableRoles(JSON.parse(storedRoles));

      const storedFavs = localStorage.getItem(`${STORAGE_PREFIX}favorites`);
      if (storedFavs) setFavorites(new Set(JSON.parse(storedFavs)));

      const storedFollows = localStorage.getItem(`${STORAGE_PREFIX}followedUsers`);
      if (storedFollows) setFollowedUsers(new Set(JSON.parse(storedFollows)));

      const storedCurrency = localStorage.getItem(`${STORAGE_PREFIX}currency`);
      if (storedCurrency) setCurrencyState(storedCurrency as Currency);
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Persist effects (only after mount)
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}activeRole`, activeRole);
  }, [activeRole, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}availableRoles`, JSON.stringify(availableRoles));
  }, [availableRoles, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}favorites`, JSON.stringify([...favorites]));
  }, [favorites, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}followedUsers`, JSON.stringify([...followedUsers]));
  }, [followedUsers, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}currency`, currency);
  }, [currency, mounted]);

  // ── Actions ─────────────────────────────────────────────────────────────

  const setActiveRole = useCallback((role: Role) => {
    setActiveRoleState(role);
  }, []);

  const toggleAvailableRole = useCallback((role: Role) => {
    setAvailableRoles((prev) => {
      if (prev.includes(role)) {
        return prev.length > 1 ? prev.filter((r) => r !== role) : prev;
      }
      return [...prev, role];
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites]
  );

  const toggleFollow = useCallback((id: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isFollowing = useCallback(
    (id: string) => followedUsers.has(id),
    [followedUsers]
  );

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
  }, []);

  const formatPrice = useCallback(
    (amount: number, originalCurrency: Currency = "CHF") => {
      const inCHF = amount / EXCHANGE_RATES[originalCurrency];
      const converted = inCHF * EXCHANGE_RATES[currency];
      const formatted = new Intl.NumberFormat("fr-CH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(converted));
      return `${formatted} ${CURRENCY_SYMBOLS[currency]}`;
    },
    [currency]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      activeRole,
      setActiveRole,
      availableRoles,
      toggleAvailableRole,
      favorites,
      toggleFavorite,
      isFavorite,
      followedUsers,
      toggleFollow,
      isFollowing,
      currency,
      setCurrency,
      formatPrice,
    }),
    [
      activeRole,
      setActiveRole,
      availableRoles,
      toggleAvailableRole,
      favorites,
      toggleFavorite,
      isFavorite,
      followedUsers,
      toggleFollow,
      isFollowing,
      currency,
      setCurrency,
      formatPrice,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
