"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { header } from "@/content/landing";
import { FORM_HREF } from "./anchors";
import { Container } from "./section";

/* En-tête fixe de la landing.

   Composant client pour deux raisons seulement : l'ouverture du menu mobile
   et l'ombre qui apparaît au défilement. Les liens viennent du contenu.

   Accessibilité : le bouton porte `aria-expanded` et `aria-controls`, le
   panneau se ferme à la touche Échap et après un clic sur un lien, et les
   cibles tactiles respectent 44 px de haut. */

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-[var(--background)]/90 backdrop-blur-md transition-shadow ${
        scrolled ? "border-[var(--border)] shadow-sm" : "border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* TODO visuel — remplacer par le logo définitif quand il existe. */}
          <Link
            href="/"
            className="page-heading shrink-0 text-lg font-semibold tracking-tight text-[var(--foreground)]"
          >
            E-Dome
          </Link>

          <nav aria-label="Sections de la page" className="hidden items-center gap-1 md:flex">
            {header.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={FORM_HREF}
              className="hidden items-center rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 sm:inline-flex"
            >
              {header.cta}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="landing-menu-mobile"
              aria-label={open ? header.menuCloseLabel : header.menuLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] md:hidden"
            >
              {open ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Panneau mobile. `hidden` plutôt qu'un démontage : l'état du bouton
          reste cohérent et le contenu est lisible par les technologies
          d'assistance dès qu'il est affiché. */}
      <div
        id="landing-menu-mobile"
        hidden={!open}
        className="border-t border-[var(--border)] bg-[var(--background)] md:hidden"
      >
        <Container>
          <nav aria-label="Sections de la page" className="flex flex-col py-2">
            {header.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-2 text-base text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
            <a
              href={FORM_HREF}
              onClick={() => setOpen(false)}
              className="mt-2 mb-3 flex min-h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)]"
            >
              {header.cta}
            </a>
          </nav>
        </Container>
      </div>
    </header>
  );
}
