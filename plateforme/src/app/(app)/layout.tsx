"use client";

import React, { useState } from "react";
import { AppProvider } from "@/lib/context";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AppProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            {/* Sidebar - desktop only (position: fixed) */}
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

            {/* Page content */}
            <div
              className="app-content min-h-screen flex flex-col"
              style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
            >
              {/* Demo banner */}
              <div className="w-full px-4 py-1.5 bg-[#C4956A]/10 border-b border-[#C4956A]/20 text-center text-xs text-[#C4956A] shrink-0">
                🛠️ Maquette de démonstration — Toutes les données sont fictives · <a href="/" className="underline hover:opacity-80">En savoir plus</a>
              </div>

              <Header
                onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              />

              <main className="flex-1 px-4 py-6 md:px-6 pb-24 md:pb-6">
                {children}
              </main>
            </div>

            {/* Mobile bottom nav */}
            <MobileNav />
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
