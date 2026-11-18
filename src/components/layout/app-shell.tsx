"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/lib/context";
import type { SessionUser } from "@/lib/session-user";
import type { NavEntry } from "@/lib/nav";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/toast";
import { AppSidebar, SIDEBAR_WIDTH } from "@/components/layout/app-sidebar";
import { MobileTopBar, MobileTabBar } from "@/components/layout/mobile-bars";
import { CommandMenu } from "@/components/layout/command-menu";
import { AiAssistant } from "@/components/ai/ai-assistant";

/* ── La coquille unique (REBUILD.md §3.2–3.3) ────────────────────────────────

   UNE seule coquille pour tout le site — fini la barre latérale de bureau, le
   tiroir mobile et le tableau de bord à sa propre navigation (trois
   navigations, trois logiques). Bureau : barre latérale fixe + contenu.
   Mobile : barre du haut + barre d'onglets. Partout : le menu ⌘K et le
   copilote.

   Ce composant reste le seul client de la chrome : `app/(app)/layout.tsx`
   demeure un Server Component qui lui passe la personne connectée (ou `null`
   pour un visiteur) et les compteurs RÉELS. Ne jamais transformer `children`
   ici (ni `Children.map` ni `cloneElement`) : les pages restent rendues côté
   serveur. */

export function AppShell({
  children,
  currentUser = null,
  counts = {},
}: {
  children: React.ReactNode;
  currentUser?: SessionUser | null;
  counts?: Partial<Record<NavEntry["key"], number>>;
}) {
  const pathname = usePathname();

  /* Défense : un verrou de défilement de modale mal nettoyé ne doit pas
     survivre à un changement de page. */
  useEffect(() => {
    const body = document.body;
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflowY = "";
    delete document.documentElement.dataset.lockedScrollY;
    delete document.documentElement.dataset.lockCount;
  }, [pathname]);

  return (
    <AppProvider currentUser={currentUser}>
      <LanguageProvider>
        <ToastProvider>
          <div className="app-shell">
            <AppSidebar user={currentUser} counts={counts} />

            <div className="app-content flex min-h-screen flex-col md:pl-[var(--sidebar-w)]" style={{ ["--sidebar-w" as string]: `${SIDEBAR_WIDTH}px` }}>
              <MobileTopBar user={currentUser} />
              <main key={pathname} className="app-page-enter flex-1 px-4 py-6 md:px-8 md:py-8">
                {children}
              </main>
            </div>

            <MobileTabBar user={currentUser} counts={counts} />
            <CommandMenu member={!!currentUser} />
            <AiAssistant hideTrigger />
          </div>
        </ToastProvider>
      </LanguageProvider>
    </AppProvider>
  );
}
