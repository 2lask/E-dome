"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/lib/context";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/toast";
import { Wrench } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ExplorerTabs } from "@/components/layout/explorer-tabs";
import { DashboardTabs } from "@/components/layout/dashboard-tabs";

/* Routes des hubs Explorer / Dashboard — liste blanche explicite.
   Les onglets de hub sont rendus uniquement sur ces pathnames exacts.
   Toute sous-route détail (/explorer/[id], /boutique/[id], /formations/[id],
   etc.) ne matche pas et n'affiche donc pas les onglets — c'est du bruit
   sur une fiche.

   Sous-routes "compagnes" listées car légitimes :
   - /boutique/vendre, /formations/creer, /evenements/creer : formulaires
     de création qui restent dans le pôle.
   - /dashboard/annonces : sous-onglet du hub Dashboard. */
const EXPLORER_PATHS = new Set([
  "/explorer",
  "/boutique",
  "/boutique/vendre",
  "/services",
  "/formations",
  "/formations/creer",
  "/live",
  "/evenements",
  "/evenements/creer",
]);
const DASHBOARD_PATHS = new Set([
  "/dashboard",
  "/dashboard/annonces",
  "/statistiques",
  "/reservations",
  "/apporteurs",
  "/favoris",
]);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const showExplorerTabs = EXPLORER_PATHS.has(pathname);
  const showDashboardTabs = DASHBOARD_PATHS.has(pathname);

  /* Ferme automatiquement la sidebar overlay mobile dès qu'on
     change de route. Avant ce useEffect, le drawer restait visible
     ~500 ms après le click sur un lien (sensation de lag sur
     connexion lente). Maintenant : transition propre. */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /* Defense scroll : force-reset les styles inline du body au montage
     ET a chaque changement de route. Si un useLockBodyScroll precedent
     a laisse body.style.position = "fixed" (cas signale en prod avec un
     ancien build cache par SW), on s'assure que la page reste scrollable.
     N'affecte pas les modals actifs car le hook reapplique l'etat juste
     apres si une instance live est encore montee. */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    const html = document.documentElement;
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflowY = "";
    delete html.dataset.lockedScrollY;
    delete html.dataset.lockCount;
  }, [pathname]);

  return (
    <AppProvider>
      <LanguageProvider>
        <ToastProvider>
          {/* min-h-screen sur app-shell : ASSURE que le wrapper occupe au
              moins le viewport, mais peut grandir au-dela quand le contenu
              deborde. Le scroll est gere par le window (body) — pas par
              un container interne avec overflow-y:auto. */}
          <div className="app-shell flex" style={{ background: "var(--background)", color: "var(--foreground)", minHeight: "100vh" }}>
              {/* Sidebar - desktop */}
              <div className="hidden md:block">
                <Sidebar
                  collapsed={sidebarCollapsed}
                  onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              </div>

              {/* Mobile sidebar overlay : fade-in du voile, slide-in de la sidebar */}
              {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                  <div
                    className="absolute inset-0 bg-black/60 animate-fade-in"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  <div
                    className="relative z-10 h-full animate-slide-in-left"
                    style={{ width: "min(280px, 88vw)" }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu de navigation"
                  >
                    <Sidebar
                      collapsed={false}
                      onToggle={() => setMobileMenuOpen(false)}
                    />
                  </div>
                </div>
              )}

              {/* Main content */}
              <div
                className="flex-1 flex flex-col min-h-screen transition-all duration-300 app-content"
                style={{
                  marginLeft: sidebarCollapsed ? "72px" : "240px",
                }}
              >
                {/* Demo banner */}
                <div className="w-full px-4 py-1.5 bg-[#1e9df1]/10 border-b border-[#1e9df1]/20 text-center text-xs text-[#1e9df1] flex items-center justify-center gap-1.5">
                  <Wrench size={12} strokeWidth={2} />
                  <span>Maquette de démonstration — Toutes les données sont fictives · <a href="/" className="underline hover:opacity-80" title="Retour à la page d'accueil de la maquette E-Dome">En savoir plus</a></span>
                </div>
                <Header
                  onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
                <main
                  /* key={pathname} : remount le main à chaque change
                     de route → relance l'animation app-page-enter
                     (fade + slide-up 6 px) pour un feel "transition
                     d'app" plutôt que page web instantanée. */
                  key={pathname}
                  className="flex-1 px-4 py-6 md:px-6 pb-20 md:pb-6 app-page-enter"
                >
                  {showExplorerTabs && <ExplorerTabs />}
                  {showDashboardTabs && <DashboardTabs />}
                  {children}
                </main>
              </div>

          {/* Mobile bottom nav */}
          <MobileNav />
        </div>
        </ToastProvider>
      </LanguageProvider>
    </AppProvider>
  );
}
