import styles from "./marketing.module.css";

/* ── Briques de mise en page des pages publiques (Server Components) ─────────
   En-tête cinématique, titre de section, bandeau sombre plein cadre et
   bandeau d'appel à l'action. Aucune logique : seulement la présentation. */

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  aside,
  className = "",
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`cine relative overflow-hidden rounded-3xl border border-white/10 px-6 py-10 md:px-10 md:py-12 ${className}`}>
      <div aria-hidden className="cine-aurora" />
      <div aria-hidden className="cine-grid" />
      <div className={`relative ${aside ? "grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]" : ""}`}>
        <div className="max-w-3xl">
          <p className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">{eyebrow}</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[48px]">{title}</h1>
          {lead && <div className="mt-4 text-[16px] leading-relaxed text-white/70">{lead}</div>}
          {children}
        </div>
        {aside && <div className="relative hidden lg:block">{aside}</div>}
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
  id,
  className = "",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className={`flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-laiton ${center ? "justify-center" : ""}`}>
          <span aria-hidden className="h-px w-6 bg-gradient-to-r from-transparent to-laiton" />
          {eyebrow}
          {center && <span aria-hidden className="h-px w-6 bg-gradient-to-l from-transparent to-laiton" />}
        </p>
      )}
      <h2 id={id} className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">{title}</h2>
      {lead && <p className={`mt-3 text-[15px] leading-relaxed text-muted-foreground ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{lead}</p>}
    </div>
  );
}

/* Panneau sombre (toujours sombre, quel que soit le thème). */
export function CineBand({ children, className = "", labelledBy }: { children: React.ReactNode; className?: string; labelledBy?: string }) {
  return (
    <section aria-labelledby={labelledBy} className={`cine relative overflow-hidden rounded-[2rem] border border-white/10 px-5 py-10 sm:px-8 md:px-12 md:py-14 ${className}`}>
      <div aria-hidden className="cine-aurora opacity-60" />
      <div aria-hidden className="cine-grid" />
      <div className="relative">{children}</div>
    </section>
  );
}

export function CtaBand({
  title,
  text,
  children,
  className = "",
}: {
  title: React.ReactNode;
  text?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`cine relative overflow-hidden rounded-3xl border border-white/10 px-6 py-12 text-center md:px-12 md:py-16 ${className}`}>
      <div aria-hidden className="cine-aurora" />
      <div aria-hidden className="cine-grid" />
      <div aria-hidden className={`pointer-events-none absolute left-1/2 top-full h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(217_164_65/0.35),transparent)] ${styles.breathe}`} />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[38px]">{title}</h2>
        {text && <p className="mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/65">{text}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </section>
  );
}

/* Pastille numérotée lumineuse. */
export function GlowNumber({ n, gold = true }: { n: number; gold?: boolean }) {
  return (
    <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center">
      <span aria-hidden className={`absolute inset-0 rounded-full ${gold ? "bg-[#d9a441]/30" : "bg-[#2daa9c]/30"} ${styles.ping}`} />
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[13px] font-semibold ${gold ? "border-[#e3b85c]/50 bg-[#1d170c] text-[#f7d488]" : "border-[#5fd3c4]/40 bg-[#0d1d1b] text-[#8fe3d8]"}`}>
        {String(n).padStart(2, "0")}
      </span>
    </span>
  );
}
