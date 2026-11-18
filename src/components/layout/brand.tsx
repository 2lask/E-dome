import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── La marque E-Dome ────────────────────────────────────────────────────────

   Le monogramme : un dôme posé sur une ligne de sol (le toit, le bien), et au
   sommet un point LAITON — la prime, ce que ton réseau te rapporte. C'est la
   seule touche de laiton hors des montants : la marque porte la promesse.
   Dessiné en SVG inline : net à toutes les tailles, suit le thème. */

export function BrandMark({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <rect width="24" height="24" rx="6.5" className="fill-ink" />
      <path
        d="M6.6 16.4a5.4 5.4 0 0 1 10.8 0"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-paper"
      />
      <path d="M5.2 16.4h13.6" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-paper" />
      {/* Laiton clair fixe : le laiton de texte (foncé) se perdrait sur l'encre. */}
      <circle cx="12" cy="7.4" r="1.45" fill="#d9a441" />
    </svg>
  );
}

export function Brand({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label="E-Dome, accueil"
      className={cn("inline-flex items-center gap-2 rounded-md", className)}
    >
      <BrandMark />
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">E-Dome</span>
    </Link>
  );
}
