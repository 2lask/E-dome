"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/lib/context";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/toast";
import { Wrench } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarWhop, SIDEBAR_WHOP_WIDTH } from "@/components/layout/sidebar-whop";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ExplorerTabs } from "@/components/layout/explorer-tabs";

/* Routes des hubs Explorer — liste blanche explicite.
   Les onglets de hub sont rendus uniquement sur ces pathnames exacts.
   Toute sous-route détail (/explorer/[id], /boutique/[id], /formations/[id],
   etc.) ne matche pas et n'affiche donc pas les onglets — c'est du bruit
   sur une fiche.

   Sous-routes "compagnes" listées car légitimes :
   - /boutique/vendre, /formations/creer, /evenements/creer : formulaires
     de création qui restent dans le pôle. */
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

/* Largeur de la sidebar permanente Whop-style. Le contenu central
   s'offset de cette largeur a gauche. Sur mobile la sidebar passe en
   overlay drawer (ancien composant Sidebar forceExpanded). */
const SIDEBAR_COLLAPSED_WIDTH = SIDEBAR_WHOP_WIDTH;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const showExplorerTabs = EXPLORER_PATHS.has(pathname);

  /* Toutes les routes /dashboard/* sont enveloppees par leur propre
     DashboardShell (header EDOME + nav 5 onglets). On masque ici la
     sidebar globale + le Header global + MobileNav pour eviter d'avoir
     une triple navigation sur ces pages. La banniere demo reste
     toujours visible (info essentielle). */
  const isDashboardRoute = pathname.startsWith("/dashboard");

  /* Ferme automatiquement la sidebar overlay mobile dès qu'on
     change de route. */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /* Defense scroll : force-reset les styles inline du body au montage
     ET a chaque changement de route. Si un useLockBodyScroll precedent
     a laisse body.style.position = "fixed", on s'assure que la page
     reste scrollable. */
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
          <div
            className="app-shell flex"
            style={{
              background: "var(--background)",
              color: "var(--foreground)",
              minHeight: "100vh",
            }}
          >
            {/* Sidebar globale Whop-style + drawer mobile : masques sur
                /dashboard/* car le DashboardShell prend le relais. */}
            {!isDashboardRoute && (
              <>
                <SidebarWhop />

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
                      <Sidebar forceExpanded />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Main content — offset de la sidebar Whop sur md+ uniquement
                (sur mobile la sidebar est en drawer overlay). */}
            <div
              className={`flex-1 flex flex-col min-h-screen app-content ${
                isDashboardRoute ? "" : "md:ml-[192px]"
              }`}
            >
              {/* Banniere demo : toujours visible, meme sur le dashboard. */}
              <div className="w-full px-4 py-1.5 bg-[var(--primary)]/10 border-b border-[var(--primary)]/20 text-center text-xs text-[var(--primary)] flex items-center justify-center gap-1.5">
                <Wrench size={12} strokeWidth={2} />
                <span>
                  Maquette de démonstration — Toutes les données sont fictives ·{" "}
                  <a
                    href="/"
                    className="underline hover:opacity-80"
                    title="Retour à la page d'accueil de la maquette E-Dome"
                  >
                    En savoir plus
                  </a>
                </span>
              </div>

              {/* Header global : masque sur /dashboard/* (DashboardShell a
                  son propre header EDOME). */}
              {!isDashboardRoute && (
                <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
              )}

              <main
                /* key={pathname} : remount le main à chaque change de route
                   → relance l'animation app-page-enter. */
                key={pathname}
                className={
                  isDashboardRoute
                    ? "flex-1 app-page-enter"
                    : "flex-1 px-4 py-6 md:px-6 pb-20 md:pb-6 app-page-enter"
                }
              >
                {showExplorerTabs && <ExplorerTabs />}
                {children}
              </main>
            </div>

            {/* MobileNav (barre bas mobile) : masque sur /dashboard/* car
                DashboardShell a sa propre nav horizontale en haut sur mobile. */}
            {!isDashboardRoute && <MobileNav />}
          </div>
        </ToastProvider>
      </LanguageProvider>
    </AppProvider>
  );
}
