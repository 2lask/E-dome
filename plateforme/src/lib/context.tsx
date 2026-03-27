'use client';
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { currentUser } from './mock-data';
import type { Role } from './types';

export type Currency = 'CHF' | 'EUR' | 'USD' | 'GBP' | 'AED' | 'MAD' | 'THB';

// Simple fixed exchange rates relative to CHF (demo purposes)
const exchangeRates: Record<Currency, number> = {
  CHF: 1,
  EUR: 0.94,
  USD: 1.12,
  GBP: 0.81,
  AED: 4.12,
  MAD: 10.85,
  THB: 38.50,
};

const currencySymbols: Record<Currency, string> = {
  CHF: 'CHF',
  EUR: '€',
  USD: '$',
  GBP: '£',
  AED: 'AED',
  MAD: 'MAD',
  THB: '฿',
};

interface AppState {
  activeRole: Role;
  availableRoles: Role[];
  setActiveRole: (role: Role) => void;
  toggleAvailableRole: (role: Role) => void;
  favorites: Set<string>;
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  followedUsers: Set<string>;
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  mounted: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number, originalCurrency?: Currency) => string;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [activeRole, setActiveRoleState] = useState<Role>(currentUser.activeRole);
  const [availableRoles, setAvailableRoles] = useState<Role[]>(currentUser.roles);
  const [favorites, setFavorites] = useState<Set<string>>(new Set<string>());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set<string>());
  const [currency, setCurrencyState] = useState<Currency>('CHF');

  // Load from localStorage AFTER mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('edome_activeRole');
      if (savedRole) setActiveRoleState(savedRole as Role);

      const savedRoles = localStorage.getItem('edome_availableRoles');
      if (savedRoles) setAvailableRoles(JSON.parse(savedRoles));

      const savedFavs = localStorage.getItem('edome_favorites');
      if (savedFavs) setFavorites(new Set(JSON.parse(savedFavs)));

      const savedFollows = localStorage.getItem('edome_follows');
      if (savedFollows) setFollowedUsers(new Set(JSON.parse(savedFollows)));

      const savedCurrency = localStorage.getItem('edome_currency');
      if (savedCurrency) setCurrencyState(savedCurrency as Currency);
    } catch {}
    setMounted(true);
  }, []);

  // Persist to localStorage only after mount
  useEffect(() => { if (mounted) localStorage.setItem('edome_activeRole', activeRole); }, [activeRole, mounted]);
  useEffect(() => { if (mounted) localStorage.setItem('edome_availableRoles', JSON.stringify(availableRoles)); }, [availableRoles, mounted]);
  useEffect(() => { if (mounted) localStorage.setItem('edome_favorites', JSON.stringify([...favorites])); }, [favorites, mounted]);
  useEffect(() => { if (mounted) localStorage.setItem('edome_follows', JSON.stringify([...followedUsers])); }, [followedUsers, mounted]);
  useEffect(() => { if (mounted) localStorage.setItem('edome_currency', currency); }, [currency, mounted]);

  const setActiveRole = useCallback((role: Role) => { setActiveRoleState(role); }, []);

  const toggleAvailableRole = useCallback((role: Role) => {
    setAvailableRoles(prev => {
      if (prev.includes(role)) {
        const next = prev.filter(r => r !== role);
        if (role === activeRole && next.length > 0) setActiveRoleState(next[0]);
        return next;
      }
      return [...prev, role];
    });
  }, [activeRole]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  const toggleFollow = useCallback((id: string) => {
    setFollowedUsers(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const isFollowing = useCallback((id: string) => followedUsers.has(id), [followedUsers]);

  const setCurrency = useCallback((c: Currency) => { setCurrencyState(c); }, []);

  const formatPrice = useCallback((amount: number, originalCurrency: Currency = 'CHF') => {
    // Convert from original currency to CHF, then to target currency
    const amountInCHF = amount / exchangeRates[originalCurrency];
    const converted = amountInCHF * exchangeRates[currency];
    const symbol = currencySymbols[currency];
    const formatted = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 0 }).format(Math.round(converted));
    if (currency === 'CHF' || currency === 'AED' || currency === 'MAD') {
      return `${symbol} ${formatted}`;
    }
    return `${symbol}${formatted}`;
  }, [currency]);

  return (
    <AppContext.Provider value={{ activeRole, availableRoles, setActiveRole, toggleAvailableRole, favorites, toggleFavorite, isFavorite, followedUsers, toggleFollow, isFollowing, mounted, currency, setCurrency, formatPrice }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
