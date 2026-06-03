"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export type Language = "fr" | "en" | "th";

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Sidebar nav
    "nav.feed": "Feed",
    "nav.explorer": "Explorer",
    "nav.live": "Live",
    "nav.publier": "Publier",
    "nav.favoris": "Favoris",
    "nav.messages": "Messages",
    "nav.notifications": "Notifications",
    "nav.reservations": "Réservations",
    "nav.dashboard": "Dashboard",
    "nav.statistiques": "Statistiques",
    "nav.apporteurs": "Apporteurs",
    "nav.formations": "Formations",
    "nav.services": "Services",
    "nav.boutique": "Boutique",
    "nav.evenements": "Événements",
    "nav.investisseurs": "Investisseurs",
    "nav.profil": "Profil",
    "nav.parametres": "Paramètres",
    "nav.deconnexion": "Déconnexion",
    "nav.administration": "Administration",
    // Common buttons
    "btn.publier": "Publier",
    "btn.suivre": "Suivre",
    "btn.partager": "Partager",
    "btn.envoyer": "Envoyer",
    "btn.annuler": "Annuler",
    "btn.sauvegarder": "Sauvegarder",
    "btn.rechercher": "Rechercher",
    "btn.modifier": "Modifier",
    "btn.supprimer": "Supprimer",
    "btn.voirPlus": "Voir plus",
    "btn.voirTout": "Voir tout",
  },
  en: {
    "nav.feed": "Feed",
    "nav.explorer": "Explore",
    "nav.live": "Live",
    "nav.publier": "Publish",
    "nav.favoris": "Favorites",
    "nav.messages": "Messages",
    "nav.notifications": "Notifications",
    "nav.reservations": "Reservations",
    "nav.dashboard": "Dashboard",
    "nav.statistiques": "Statistics",
    "nav.apporteurs": "Referrals",
    "nav.formations": "Training",
    "nav.services": "Services",
    "nav.boutique": "Shop",
    "nav.evenements": "Events",
    "nav.investisseurs": "Investors",
    "nav.profil": "Profile",
    "nav.parametres": "Settings",
    "nav.deconnexion": "Logout",
    "nav.administration": "Administration",
    "btn.publier": "Publish",
    "btn.suivre": "Follow",
    "btn.partager": "Share",
    "btn.envoyer": "Send",
    "btn.annuler": "Cancel",
    "btn.sauvegarder": "Save",
    "btn.rechercher": "Search",
    "btn.modifier": "Edit",
    "btn.supprimer": "Delete",
    "btn.voirPlus": "See more",
    "btn.voirTout": "See all",
  },
  th: {
    "nav.feed": "ฟีด",
    "nav.explorer": "สำรวจ",
    "nav.live": "ถ่ายทอดสด",
    "nav.publier": "เผยแพร่",
    "nav.favoris": "รายการโปรด",
    "nav.messages": "ข้อความ",
    "nav.notifications": "การแจ้งเตือน",
    "nav.reservations": "การจอง",
    "nav.dashboard": "แดชบอร์ด",
    "nav.statistiques": "สถิติ",
    "nav.apporteurs": "ผู้แนะนำ",
    "nav.formations": "การฝึกอบรม",
    "nav.services": "บริการ",
    "nav.boutique": "ร้านค้า",
    "nav.evenements": "กิจกรรม",
    "nav.investisseurs": "นักลงทุน",
    "nav.profil": "โปรไฟล์",
    "nav.parametres": "ตั้งค่า",
    "nav.deconnexion": "ออกจากระบบ",
    "nav.administration": "การจัดการ",
    "btn.publier": "เผยแพร่",
    "btn.suivre": "ติดตาม",
    "btn.partager": "แชร์",
    "btn.envoyer": "ส่ง",
    "btn.annuler": "ยกเลิก",
    "btn.sauvegarder": "บันทึก",
    "btn.rechercher": "ค้นหา",
    "btn.modifier": "แก้ไข",
    "btn.supprimer": "ลบ",
    "btn.voirPlus": "ดูเพิ่มเติม",
    "btn.voirTout": "ดูทั้งหมด",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "edome_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && translations[stored]) {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, language);
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] ?? key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
