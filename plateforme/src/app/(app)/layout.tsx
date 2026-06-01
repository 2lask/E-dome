"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/lib/context";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ExplorerTabs } from "@/components/layout/explorer-tabs";
import { DashboardTabs } from "@/components/layout/dashboard-tabs";

/* Routes regroupées sous les hubs Explorer / Dashboard.
   Quand le pathname commence par l'un de ces préfixes, la barre
   d'onglets du hub correspondant est rendue au-dessus du contenu. */
const EXPLORER_ROUTES = ["/explorer", "/boutique", "/services", "/formations", "/live", "/evenements"];
const DASHBOARD_ROUTES = ["/dashboard", "/statistiques", "/reservations", "/apporteurs", "/favoris"];

function matchesHub(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const showExplorerTabs = matchesHub(pathname, EXPLORER_ROUTES);
  const showDashboardTabs = matchesHub(pathname, DASHBOARD_ROUTES);

  return (
    <AppProvider>
      <LanguageProvider>
        <ToastProvider>
          <div className="app-light flex min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
              {/* Sidebar - desktop */}
              <div className="hidden md:block">
                <Sidebar
                  collapsed={sidebarCollapsed}
                  onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              </div>

              {/* Mobile sidebar overlay */}
              {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                  <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  <div className="relative z-10 h-full w-[280px]">
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
                <div className="w-full px-4 py-1.5 bg-[#1e9df1]/10 border-b border-[#1e9df1]/20 text-center text-xs text-[#1e9df1]">
                  🛠️ Maquette de démonstration — Toutes les données sont fictives · <a href="/" className="underline hover:opacity-80" title="Retour à la page d'accueil de la maquette E-Dome">En savoir plus</a>
                </div>
                <Header
                  onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
                <main className="flex-1 px-4 py-6 md:px-6 pb-20 md:pb-6">
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
