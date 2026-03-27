"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ToastProvider } from "@/components/ui/toast";
import { AppProvider } from "@/lib/context";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ThemeProvider>
    <LanguageProvider>
    <AppProvider>
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--background)]">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 flex-shrink-0 transition-all duration-300 ease-in-out
            lg:relative lg:z-auto
            ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${collapsed ? "w-[72px]" : "w-[260px]"}
          `}
        >
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
            onClose={() => setMobileOpen(false)}
          />
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6 lg:p-8 lg:pb-8">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </main>
        </div>

        {/* Mobile bottom navigation */}
        <MobileNav />
      </div>
    </ToastProvider>
    </AppProvider>
    </LanguageProvider>
    </ThemeProvider>
  );
}
