"use client";

import Link from "next/link";

/* ── Halo qui suit le pointeur ───────────────────────────────────────────────
   Pose --mx / --my sur l'élément (variables CSS, aucun re-rendu React).
   À combiner avec la classe `.v3-card` (globals.css, section Design v3). */

function track(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function SpotlightCard({
  className = "",
  children,
  as = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li" | "article";
}) {
  const Comp = as;
  return (
    <Comp onPointerMove={track} className={`v3-card ${className}`}>
      {children}
    </Comp>
  );
}

export function SpotlightLink({
  href,
  className = "",
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  return (
    <Link href={href} onPointerMove={track} className={`v3-card ${className}`} {...rest}>
      {children}
    </Link>
  );
}
