"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Role, Currency, ReferralLink } from "./types";
import { DEFAULT_REFERRAL_LINKS } from "./referral-links";

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

export interface CartItem {
  id: string;
  qty: number;
  /** Snapshot lors de l'ajout — affichage panier sans relookup. */
  title?: string;
  price?: number;
  currency?: Currency;
  cover?: string;
}

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
  /* ── Panier boutique ── */
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  /* ── Liens d'apporteur d'affaires (partagés entre /apporteurs et le
     composer du feed, pour attacher un lien de redirection affilié) ── */
  referralLinks: ReferralLink[];
  /* Ajoute un lien s'il n'existe pas déjà (dédup par url). Retourne true si
     un nouveau lien a été créé, false s'il existait déjà. */
  addReferralLink: (link: ReferralLink) => boolean;
  /* Vrai si un lien rattaché à cette annonce existe déjà. */
  hasReferralLinkFor: (kind: string, id: string) => boolean;
  /* Incrémente le compteur de clics du lien rattaché à cette annonce (clic
     depuis une redirection ?ref=). No-op si aucun lien ne correspond. */
  registerReferralClick: (target: { kind: string; id: string }) => void;
  /* ── Récompenses (gamification apporteur) ── */
  rewardPoints: number;
  addRewardPoints: (n: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Default values ─────────────────────────────────────────────────────────

const DEFAULT_ROLE: Role = "client";
const DEFAULT_ROLES: Role[] = ["client", "hote", "formateur", "apporteur", "investisseur", "agence"];
const DEFAULT_CURRENCY: Currency = "CHF";
const DEFAULT_FAVORITES: string[] = ["prop2", "prop5", "prop3", "prop9"];
const STORAGE_PREFIX = "edome_";

// ─── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [activeRole, setActiveRoleState] = useState<Role>(DEFAULT_ROLE);
  const [availableRoles, setAvailableRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(DEFAULT_FAVORITES));
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>(DEFAULT_REFERRAL_LINKS);
  const [rewardPoints, setRewardPoints] = useState<number>(1450); // seed démo → palier Argent

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

      const storedCart = localStorage.getItem(`${STORAGE_PREFIX}cart`);
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }

      const storedReferralLinks = localStorage.getItem(`${STORAGE_PREFIX}referralLinks`);
      if (storedReferralLinks) {
        const parsed = JSON.parse(storedReferralLinks);
        if (Array.isArray(parsed)) setReferralLinks(parsed);
      }

      const storedPoints = localStorage.getItem(`${STORAGE_PREFIX}rewardPoints`);
      if (storedPoints != null) {
        const n = Number(storedPoints);
        if (Number.isFinite(n)) setRewardPoints(n);
      }
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

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}referralLinks`, JSON.stringify(referralLinks));
  }, [referralLinks, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`${STORAGE_PREFIX}rewardPoints`, String(rewardPoints));
  }, [rewardPoints, mounted]);

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

  const addToCart = useCallback((item: Omit<CartItem, "qty"> & { qty?: number }) => {
    const qty = item.qty ?? 1;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCartQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id));
      return;
    }
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const addReferralLink = useCallback((link: ReferralLink) => {
    let created = false;
    setReferralLinks((prev) => {
      if (prev.some((l) => l.url === link.url)) return prev; // dédup
      created = true;
      return [...prev, link];
    });
    return created;
  }, []);

  const hasReferralLinkFor = useCallback(
    (kind: string, id: string) =>
      referralLinks.some((l) => l.target?.kind === kind && l.target?.id === id),
    [referralLinks],
  );

  const registerReferralClick = useCallback(
    (target: { kind: string; id: string }) => {
      setReferralLinks((prev) =>
        prev.map((l) =>
          l.target?.kind === target.kind && l.target?.id === target.id
            ? { ...l, clicks: l.clicks + 1 }
            : l,
        ),
      );
    },
    [],
  );

  const addRewardPoints = useCallback((n: number) => {
    setRewardPoints((prev) => Math.max(0, prev + n));
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  const formatPrice = useCallback(
    (amount: number, originalCurrency: Currency = "CHF") => {
      const inCHF = amount / EXCHANGE_RATES[originalCurrency];
      const converted = inCHF * EXCHANGE_RATES[currency];
      /* Apostrophe suisse : 24850 -> "24'850". Intl produit
         l'espace insecable, ce qui contredit la convention suisse
         "24'850 CHF" et l'audit visuel. */
      const rounded = Math.round(converted);
      const grouped = Math.abs(rounded)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      const formatted = rounded < 0 ? `-${grouped}` : grouped;
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
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      referralLinks,
      addReferralLink,
      hasReferralLinkFor,
      registerReferralClick,
      rewardPoints,
      addRewardPoints,
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
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      referralLinks,
      addReferralLink,
      hasReferralLinkFor,
      registerReferralClick,
      rewardPoints,
      addRewardPoints,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
