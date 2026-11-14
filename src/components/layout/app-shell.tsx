"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/lib/context";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarWhop } from "@/components/layout/sidebar-whop";
import { DemoLegendBar } from "@/components/layout/demo-legend-bar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ExplorerTabs } from "@/components/layout/explorer-tabs";
import { AiAssistant } from "@/components/ai/ai-assistant";

/* ── Chrome applicative interactive ──────────────────────────────────────────

   Ce composant porte TOUT ce qui exige le client : les providers d'état
   global, l'état du drawer mobile, et les conditions d'affichage dérivées
   du pathname.

   Il est volontairement séparé de `app/(app)/layout.tsx`, qui reste un
   Server Component. La raison est structurelle : lorsqu'un Server Component
   passe `children` à un Client Component, ces enfants sont rendus sur le
   serveur et transmis en tant que prop déjà évaluée. La frontière client
   s'arrête donc à la chrome — chaque page de `(app)/` peut être un Server
   Component, faire son propre `await` de données et exposer un
   `generateMetadata`.

   Tant que `"use client"` était posé sur le layout lui-même, les 48 routes
   du groupe étaient client-only : aucun accès serveur aux données, aucune
   Server Action, aucune métadonnée dynamique. C'était le verrou principal
   du projet.

   Corollaire à respecter : ne jamais remonter `"use client"` dans le
   layout, et ne pas transformer `children` ici (pas de `React.Children.map`,
   pas de `cloneElement`) — cela forcerait l'évaluation côté client. */

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

/* Note : le décalage du contenu central est écrit en dur (`md:ml-[220px]`
   plus bas) et n'est donc pas lié à `SIDEBAR_WHOP_WIDTH` exporté par
   `sidebar-whop`. L'ancienne constante `SIDEBAR_COLLAPSED_WIDTH` prétendait
   faire ce lien mais n'était référencée nulle part — supprimée. Si la
   largeur de la sidebar change, il faut ajuster les deux endroits. */

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const showExplorerTabs = EXPLORER_PATHS.has(pathname);

  /* Toutes les routes /dashboard/* sont enveloppees par leur propre
     DashboardShell (header EDOME + nav 5 onglets). On masque ici la
     sidebar globale + le Header global + MobileNav pour eviter d'avoir
     une triple navigation sur ces pages. La banniere demo reste
     toujours visible (info essentielle). */
  const isDashboardRoute = pathname.startsWith("/dashboard");
  /* /feed (et /) : pas de Header global pour matcher le layout Whop
     ou le contenu colle direct sous la banniere demo. */
  const isFeedRoute = pathname === "/feed" || pathname === "/";

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
                isDashboardRoute ? "" : "md:ml-[220px]"
              }`}
            >
              {/* Bandeau-légende permanent : mention « données d'exemple »,
                  légende des statuts, et sélecteur de rôle. Ici plutôt que dans
                  une sidebar parce que c'est le seul emplacement présent sur
                  toutes les routes, tableau de bord compris. */}
              <DemoLegendBar />

              {/* Header global : masque sur /dashboard/* et sur /feed (Whop). */}
              {!isDashboardRoute && !isFeedRoute && (
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

            {/* Assistant IA « Expert E-Dome » — accessible partout. */}
            <AiAssistant />
          </div>
        </ToastProvider>
      </LanguageProvider>
    </AppProvider>
  );
}
