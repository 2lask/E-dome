import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { AuthShowcase } from "@/components/auth/auth-showcase";

/* ── Authentification : écran partagé (REBUILD.md §4) ────────────────────────
   Gauche : le formulaire, sur un fond à peine éclairé. Droite (grand écran) :
   un panneau cinématique — aurore, grille, la promesse d'E-Dome, ses règles et
   un aperçu du produit explicitement marqué « Illustration ». Sur mobile, un
   bandeau compact reprend la promesse au-dessus du formulaire. L'ancienne note
   « 4.14 · 487 avis » était inventée : elle a disparu. */

const RULES = [
  "Publier un bien est gratuit, sans commission d'agence.",
  "Recommandez un bien avec votre lien : la vente conclue, vous touchez la commission.",
  "Vues, leads et ventes suivis en temps réel dans votre tableau de bord.",
  "E-Dome ne détient jamais l'argent de la transaction.",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
        {/* ── Formulaire ─────────────────────────────────────────────────── */}
        <div className="relative isolate flex flex-col">
          {/* Lumière douce derrière le formulaire, aux couleurs de la marque. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-[-12%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--leman)_14%,transparent),transparent)]" />
            <div className="absolute bottom-[-18%] left-[-10%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--laiton)_9%,transparent),transparent)]" />
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-10 lg:py-7">
            <Brand />
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Retour au site
            </Link>
          </div>

          {/* Bandeau mobile : la promesse, en une ligne de lumière. */}
          <div className="cine relative mx-4 overflow-hidden rounded-2xl border border-white/10 px-5 py-5 lg:hidden">
            <div aria-hidden className="cine-aurora opacity-80" />
            <div aria-hidden className="cine-grid" />
            <div className="relative">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Le réseau immobilier suisse</p>
              <p className="mt-1.5 text-[22px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
                Votre réseau <span className="cine-gold">vaut de l&apos;argent.</span>
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 pb-12 pt-8 lg:px-12 lg:pt-0">
            <div className="w-full max-w-[420px]">{children}</div>
          </div>
        </div>

        {/* ── Panneau cinématique (couleurs fixes : sombre dans les deux thèmes) ── */}
        <aside className="hidden p-3 lg:block">
          <div className="cine relative flex h-full min-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-[28px] border border-white/10 px-12 py-11 xl:px-14">
            <div aria-hidden className="cine-aurora" />
            <div aria-hidden className="cine-grid" />
            <div aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c]/60 to-transparent" />
            {/* Halo bas : le panneau se pose, il ne s'arrête pas net. */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0a08] to-transparent" />

            <p className="relative inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e3b85c]" aria-hidden />
              Le réseau immobilier suisse
            </p>

            <div className="relative mt-10">
              <p className="text-[44px] font-semibold leading-[1.02] tracking-[-0.04em] text-white xl:text-[52px]">
                Votre réseau
                <br />
                <span className="cine-gold">vaut de l&apos;argent.</span>
              </p>
              <ul className="mt-8 grid max-w-[520px] gap-3">
                {RULES.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[14.5px] leading-snug text-white/80">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgb(227_184_92/0.4)] bg-[rgb(227_184_92/0.14)] text-[#f0c977]">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-auto pt-10">
              <AuthShowcase />
            </div>

            <p className="relative mt-6 text-[12px] text-white/45">Suisse romande</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
