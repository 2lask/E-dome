import type React from "react";
import { cn } from "@/lib/utils";

/* Coquilles de mise en page partagées par les sections de la landing.

   Les couleurs, la typographie et les rayons viennent des tokens de la
   maquette (`--background`, `--foreground`, `--text-secondary`, `--border`,
   `--card`, `--primary`) pour que la landing paraisse appartenir au même
   produit. La classe `.page-heading` est celle qu'emploient déjà les pages de
   l'application pour les titres en Source Serif.

   À ne pas utiliser ici : l'accent teal `--ed-accent` et les classes `.ed-*`
   de `globals.css`. Ce sont des vestiges de l'ancienne landing, inutilisés
   ailleurs dans le produit — s'en servir réintroduirait une couleur absente
   de la maquette. */

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
      {children}
    </p>
  );
}

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
  /** Fond alterné pour séparer visuellement deux sections voisines. */
  muted?: boolean;
  /** Titre et chapeau centrés plutôt qu'alignés à gauche. */
  centered?: boolean;
  /** Niveau de titre. La page n'a qu'un seul h1, porté par le hero. */
  as?: "h2" | "h3";
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  muted = false,
  centered = false,
  as: Heading = "h2",
}: SectionProps) {
  return (
    <section
      id={id}
      /* scroll-mt compense l'en-tête fixe : sans lui, un lien d'ancre place le
         titre sous la barre de navigation. */
      className={cn(
        "scroll-mt-20 py-16 sm:py-20 lg:py-24",
        muted && "bg-[var(--muted)]",
        className,
      )}
    >
      <Container>
        {(eyebrow || title || intro) && (
          <header className={cn("mb-10 sm:mb-14", centered && "mx-auto max-w-2xl text-center")}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <Heading className="page-heading text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">
                {title}
              </Heading>
            )}
            {intro && (
              <p
                className={cn(
                  "mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg",
                  !centered && "max-w-2xl",
                )}
              >
                {intro}
              </p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
