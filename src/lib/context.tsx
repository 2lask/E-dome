"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Currency, ReferralLink } from "./types";
import type { PlatformRole } from "./model/identity";
import { isPlatformRole, migrateLegacyRoles } from "./model/identity";
import type { Profile } from "./profile-types";
import { DEFAULT_PROFILE } from "./profile-data";
import { DEFAULT_REFERRAL_LINKS } from "./referral-links";
import { DEFAULT_VIEWING_AS } from "./../content/roles";

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
  /* Le rôle sous lequel l'interface se présente (garde-fous « Créer »,
     tableau de bord). Un `PlatformRole`, comme `viewingAs`, qui le pilote. */
  activeRole: PlatformRole;
  setActiveRole: (role: PlatformRole) => void;
  availableRoles: PlatformRole[];
  toggleAvailableRole: (role: PlatformRole) => void;
  /* Le rôle qu'on VISITE, découplé des droits : le sélecteur de rôle le
     pilote pour montrer la plateforme de chaque point de vue. Le régler met
     aussi à jour `activeRole`. */
  viewingAs: PlatformRole;
  setViewingAs: (role: PlatformRole) => void;
  /* Le mode explicatif : les affordances « ? » qui expliquent un élément.
     Actif par défaut — une démonstration se lit mieux commentée — mais on peut
     l'éteindre pour voir la maquette nue. */
  explainMode: boolean;
  setExplainMode: (on: boolean) => void;
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
  /* ── Profil (source de vérité unique, persisté en localStorage) ──
     Partagé entre /profil, l'onboarding et les paramètres. Les modales
     d'édition calculent le nouvel état d'une section et appellent
     updateProfile({ experiences: [...] }) — API générique et évolutive.
     Interface prête à être branchée sur Supabase sans toucher à l'UI. */
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
  resetProfile: () => void;
  /* ── Publications : épinglage & masquage (persistés) ──
     pinnedPosts : ids épinglés en haut du profil (max 3, façon Instagram).
     hiddenPosts : ids supprimés/masqués de la vue. */
  pinnedPosts: string[];
  togglePinPost: (id: string) => "pinned" | "unpinned" | "limit";
  isPinned: (id: string) => boolean;
  hiddenPosts: string[];
  hidePost: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Default values ─────────────────────────────────────────────────────────

const DEFAULT_ROLE: PlatformRole = "particulier";
const DEFAULT_ROLES: PlatformRole[] = ["particulier", "hote", "createur", "apporteur", "agence"];
const DEFAULT_CURRENCY: Currency = "CHF";
const DEFAULT_FAVORITES: string[] = ["prop2", "prop5", "prop3", "prop9"];
const STORAGE_PREFIX = "edome_";

/* Ecriture localStorage tolerante aux pannes.
   setItem leve QuotaExceededError des que le quota (~5 Mo) est atteint —
   typiquement une photo de profil encodee en base64 — et leve
   systematiquement en navigation privee Safari. Appelee a nu dans un
   useEffect, l'exception remonte a l'error boundary et casse l'application
   entiere. On degrade silencieusement : la donnee n'est pas persistee,
   mais la session reste utilisable. */
function persist(key: string, value: string) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
  } catch {
    /* Quota depasse ou stockage indisponible. */
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [activeRole, setActiveRoleState] = useState<PlatformRole>(DEFAULT_ROLE);
  const [availableRoles, setAvailableRoles] = useState<PlatformRole[]>(DEFAULT_ROLES);
  const [viewingAs, setViewingAsState] = useState<PlatformRole>(DEFAULT_VIEWING_AS);
  const [explainMode, setExplainModeState] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(DEFAULT_FAVORITES));
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>(DEFAULT_REFERRAL_LINKS);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [pinnedPosts, setPinnedPosts] = useState<string[]>([]);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  // Load from localStorage after mount
  useEffect(() => {
    try {
      /* Validation, et non un transtypage. Le jeu de rôles a changé à
         l'étape 4a : un navigateur peut avoir mémorisé un ancien rôle
         (« formateur », « client »…). On le convertit par la table de passage
         (`migrateLegacyRoles`) ; une valeur inconnue est ignorée et l'on
         retombe sur le défaut — réparable, là où un rôle fantôme ne l'est pas. */
      const storedRole = localStorage.getItem(`${STORAGE_PREFIX}activeRole`);
      if (storedRole) {
        const migrated = migrateLegacyRoles([storedRole]).roles[0];
        if (migrated) setActiveRoleState(migrated);
      }

      /* Même prudence que pour `activeRole` : une valeur inconnue est ignorée,
         on retombe sur le défaut. `PlatformRole` peut évoluer. */
      const storedViewingAs = localStorage.getItem(`${STORAGE_PREFIX}viewingAs`);
      if (storedViewingAs && isPlatformRole(storedViewingAs)) setViewingAsState(storedViewingAs);

      const storedExplain = localStorage.getItem(`${STORAGE_PREFIX}explainMode`);
      if (storedExplain === "0") setExplainModeState(false);

      const storedRoles = localStorage.getItem(`${STORAGE_PREFIX}availableRoles`);
      if (storedRoles) {
        const parsed: unknown = JSON.parse(storedRoles);
        if (Array.isArray(parsed)) {
          const migrated = migrateLegacyRoles(parsed).roles;
          if (migrated.length > 0) setAvailableRoles(migrated);
        }
      }

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

      const storedProfile = localStorage.getItem(`${STORAGE_PREFIX}profile`);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile) as Partial<Profile>;
        /* Rôles relus par la table de passage : un profil stocké avant
           l'étape 4a porte d'anciens rôles (« formateur »…). */
        const migratedRoles = Array.isArray(parsed.roles) ? migrateLegacyRoles(parsed.roles) : null;
        /* Merge sur DEFAULT_PROFILE pour tolérer l'évolution du schéma :
           un profil stocké avant l'ajout d'un champ reste valide. */
        setProfile({
          ...DEFAULT_PROFILE,
          ...parsed,
          roles: migratedRoles && migratedRoles.roles.length > 0 ? migratedRoles.roles : DEFAULT_PROFILE.roles,
          trades: parsed.trades ?? (migratedRoles?.trades.length ? migratedRoles.trades : DEFAULT_PROFILE.trades),
          interests: parsed.interests ?? (migratedRoles?.interests.length ? migratedRoles.interests : DEFAULT_PROFILE.interests),
          location: { ...DEFAULT_PROFILE.location, ...(parsed.location ?? {}) },
          visibility: { ...DEFAULT_PROFILE.visibility, ...(parsed.visibility ?? {}) },
          meta: { ...DEFAULT_PROFILE.meta, ...(parsed.meta ?? {}) },
          stats: { ...DEFAULT_PROFILE.stats, ...(parsed.stats ?? {}) },
        });
      }

      const storedPinned = localStorage.getItem(`${STORAGE_PREFIX}pinnedPosts`);
      if (storedPinned) { const p = JSON.parse(storedPinned); if (Array.isArray(p)) setPinnedPosts(p); }
      const storedHidden = localStorage.getItem(`${STORAGE_PREFIX}hiddenPosts`);
      if (storedHidden) { const p = JSON.parse(storedHidden); if (Array.isArray(p)) setHiddenPosts(p); }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Persist effects (only after mount)
  useEffect(() => {
    if (!mounted) return;
    persist("activeRole", activeRole);
  }, [activeRole, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("viewingAs", viewingAs);
  }, [viewingAs, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("explainMode", explainMode ? "1" : "0");
  }, [explainMode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("availableRoles", JSON.stringify(availableRoles));
  }, [availableRoles, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("favorites", JSON.stringify([...favorites]));
  }, [favorites, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("followedUsers", JSON.stringify([...followedUsers]));
  }, [followedUsers, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("currency", currency);
  }, [currency, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("cart", JSON.stringify(cart));
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("referralLinks", JSON.stringify(referralLinks));
  }, [referralLinks, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("profile", JSON.stringify(profile));
  }, [profile, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("pinnedPosts", JSON.stringify(pinnedPosts));
  }, [pinnedPosts, mounted]);

  useEffect(() => {
    if (!mounted) return;
    persist("hiddenPosts", JSON.stringify(hiddenPosts));
  }, [hiddenPosts, mounted]);

  // ── Actions ─────────────────────────────────────────────────────────────

  const setActiveRole = useCallback((role: PlatformRole) => {
    setActiveRoleState(role);
  }, []);

  /* Régler le rôle de visite met aussi à jour `activeRole` : les deux
     parlent désormais le même `PlatformRole`, il n'y a plus de pont. */
  const setViewingAs = useCallback((role: PlatformRole) => {
    setViewingAsState(role);
    setActiveRoleState(role);
  }, []);

  const setExplainMode = useCallback((on: boolean) => setExplainModeState(on), []);

  const toggleAvailableRole = useCallback((role: PlatformRole) => {
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

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetProfile = useCallback(() => setProfile(DEFAULT_PROFILE), []);

  const MAX_PINNED = 3;
  const togglePinPost = useCallback((postId: string): "pinned" | "unpinned" | "limit" => {
    let result: "pinned" | "unpinned" | "limit" = "pinned";
    setPinnedPosts((prev) => {
      if (prev.includes(postId)) { result = "unpinned"; return prev.filter((x) => x !== postId); }
      if (prev.length >= MAX_PINNED) { result = "limit"; return prev; }
      result = "pinned";
      return [...prev, postId];
    });
    return result;
  }, []);

  const isPinned = useCallback((postId: string) => pinnedPosts.includes(postId), [pinnedPosts]);

  const hidePost = useCallback((postId: string) => {
    setHiddenPosts((prev) => (prev.includes(postId) ? prev : [...prev, postId]));
    setPinnedPosts((prev) => prev.filter((x) => x !== postId));
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
      viewingAs,
      setViewingAs,
      explainMode,
      setExplainMode,
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
      profile,
      updateProfile,
      resetProfile,
      pinnedPosts,
      togglePinPost,
      isPinned,
      hiddenPosts,
      hidePost,
    }),
    [
      activeRole,
      setActiveRole,
      viewingAs,
      setViewingAs,
      explainMode,
      setExplainMode,
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
      profile,
      updateProfile,
      resetProfile,
      pinnedPosts,
      togglePinPost,
      isPinned,
      hiddenPosts,
      hidePost,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
