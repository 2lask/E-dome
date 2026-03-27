'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'th';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Sidebar nav
    'nav.feed': 'Feed',
    'nav.live': 'Live',
    'nav.explorer': 'Explorer',
    'nav.publier': 'Publier',
    'nav.favoris': 'Favoris',
    'nav.messages': 'Messages',
    'nav.notifications': 'Notifications',
    'nav.reservations': 'Réservations',
    'nav.dashboard': 'Dashboard',
    'nav.statistiques': 'Statistiques',
    'nav.apporteurs': 'Apporteurs',
    'nav.investisseurs': 'Investisseurs',
    'nav.formations': 'Formations',
    'nav.services': 'Services',
    'nav.evenements': 'Événements',
    'nav.profil': 'Profil',
    'nav.parametres': 'Paramètres',
    'nav.admin': 'Administration',
    'nav.deconnexion': 'Déconnexion',
    // Sidebar footer
    'nav.conditions': 'Conditions',
    'nav.confidentialite': 'Confidentialité',
    'nav.aide': 'Aide',
    'nav.contact': 'Contact',
    // Header
    'header.search': 'Rechercher...',
    'header.recent': 'Recherches récentes',
    'header.popular': 'Recherches populaires',
    'header.changeRole': 'Changer de rôle',
    'header.notifications': 'Notifications',
    'header.markAllRead': 'Tout marquer lu',
    'header.viewAll': 'Voir toutes les notifications',
    // Common buttons
    'btn.publish': 'Publier',
    'btn.follow': 'Suivre',
    'btn.unfollow': 'Ne plus suivre',
    'btn.share': 'Partager',
    'btn.send': 'Envoyer',
    'btn.cancel': 'Annuler',
    'btn.save': 'Sauvegarder',
    'btn.search': 'Rechercher',
    'btn.delete': 'Supprimer',
    'btn.edit': 'Modifier',
    'btn.confirm': 'Confirmer',
    'btn.back': 'Retour',
    'btn.next': 'Suivant',
    'btn.previous': 'Précédent',
    'btn.close': 'Fermer',
    'btn.apply': 'Appliquer',
    'btn.reset': 'Réinitialiser',
    'btn.filter': 'Filtrer',
    'btn.sort': 'Trier',
    'btn.more': 'Voir plus',
    'btn.less': 'Voir moins',
    // Currency
    'currency.label': 'Devise',
    // Language
    'language.label': 'Langue',
    // Theme
    'theme.dark': 'Sombre',
    'theme.light': 'Clair',
  },
  en: {
    // Sidebar nav
    'nav.feed': 'Feed',
    'nav.live': 'Live',
    'nav.explorer': 'Explore',
    'nav.publier': 'Publish',
    'nav.favoris': 'Favorites',
    'nav.messages': 'Messages',
    'nav.notifications': 'Notifications',
    'nav.reservations': 'Bookings',
    'nav.dashboard': 'Dashboard',
    'nav.statistiques': 'Statistics',
    'nav.apporteurs': 'Referrals',
    'nav.investisseurs': 'Investors',
    'nav.formations': 'Training',
    'nav.services': 'Services',
    'nav.evenements': 'Events',
    'nav.profil': 'Profile',
    'nav.parametres': 'Settings',
    'nav.admin': 'Administration',
    'nav.deconnexion': 'Log out',
    // Sidebar footer
    'nav.conditions': 'Terms',
    'nav.confidentialite': 'Privacy',
    'nav.aide': 'Help',
    'nav.contact': 'Contact',
    // Header
    'header.search': 'Search...',
    'header.recent': 'Recent searches',
    'header.popular': 'Popular searches',
    'header.changeRole': 'Switch role',
    'header.notifications': 'Notifications',
    'header.markAllRead': 'Mark all as read',
    'header.viewAll': 'View all notifications',
    // Common buttons
    'btn.publish': 'Publish',
    'btn.follow': 'Follow',
    'btn.unfollow': 'Unfollow',
    'btn.share': 'Share',
    'btn.send': 'Send',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.search': 'Search',
    'btn.delete': 'Delete',
    'btn.edit': 'Edit',
    'btn.confirm': 'Confirm',
    'btn.back': 'Back',
    'btn.next': 'Next',
    'btn.previous': 'Previous',
    'btn.close': 'Close',
    'btn.apply': 'Apply',
    'btn.reset': 'Reset',
    'btn.filter': 'Filter',
    'btn.sort': 'Sort',
    'btn.more': 'See more',
    'btn.less': 'See less',
    // Currency
    'currency.label': 'Currency',
    // Language
    'language.label': 'Language',
    // Theme
    'theme.dark': 'Dark',
    'theme.light': 'Light',
  },
  th: {
    // Sidebar nav
    'nav.feed': 'ฟีด',
    'nav.live': 'ถ่ายทอดสด',
    'nav.explorer': 'สำรวจ',
    'nav.publier': 'เผยแพร่',
    'nav.favoris': 'รายการโปรด',
    'nav.messages': 'ข้อความ',
    'nav.notifications': 'การแจ้งเตือน',
    'nav.reservations': 'การจอง',
    'nav.dashboard': 'แดชบอร์ด',
    'nav.statistiques': 'สถิติ',
    'nav.apporteurs': 'ผู้แนะนำ',
    'nav.investisseurs': 'นักลงทุน',
    'nav.formations': 'การอบรม',
    'nav.services': 'บริการ',
    'nav.evenements': 'กิจกรรม',
    'nav.profil': 'โปรไฟล์',
    'nav.parametres': 'ตั้งค่า',
    'nav.admin': 'จัดการระบบ',
    'nav.deconnexion': 'ออกจากระบบ',
    // Sidebar footer
    'nav.conditions': 'เงื่อนไข',
    'nav.confidentialite': 'ความเป็นส่วนตัว',
    'nav.aide': 'ช่วยเหลือ',
    'nav.contact': 'ติดต่อ',
    // Header
    'header.search': 'ค้นหา...',
    'header.recent': 'ค้นหาล่าสุด',
    'header.popular': 'ค้นหายอดนิยม',
    'header.changeRole': 'เปลี่ยนบทบาท',
    'header.notifications': 'การแจ้งเตือน',
    'header.markAllRead': 'ทำเครื่องหมายอ่านแล้วทั้งหมด',
    'header.viewAll': 'ดูการแจ้งเตือนทั้งหมด',
    // Common buttons
    'btn.publish': 'เผยแพร่',
    'btn.follow': 'ติดตาม',
    'btn.unfollow': 'เลิกติดตาม',
    'btn.share': 'แชร์',
    'btn.send': 'ส่ง',
    'btn.cancel': 'ยกเลิก',
    'btn.save': 'บันทึก',
    'btn.search': 'ค้นหา',
    'btn.delete': 'ลบ',
    'btn.edit': 'แก้ไข',
    'btn.confirm': 'ยืนยัน',
    'btn.back': 'กลับ',
    'btn.next': 'ถัดไป',
    'btn.previous': 'ก่อนหน้า',
    'btn.close': 'ปิด',
    'btn.apply': 'ใช้งาน',
    'btn.reset': 'รีเซ็ต',
    'btn.filter': 'กรอง',
    'btn.sort': 'เรียง',
    'btn.more': 'ดูเพิ่มเติม',
    'btn.less': 'ดูน้อยลง',
    // Currency
    'currency.label': 'สกุลเงิน',
    // Language
    'language.label': 'ภาษา',
    // Theme
    'theme.dark': 'มืด',
    'theme.light': 'สว่าง',
  },
};

const I18nContext = createContext<I18nState | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('edome_language') as Language | null;
      if (saved && (saved === 'fr' || saved === 'en' || saved === 'th')) {
        setLanguageState(saved);
      }
    } catch {}
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('edome_language', lang);
    } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] ?? translations['fr']?.[key] ?? key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx;
}
