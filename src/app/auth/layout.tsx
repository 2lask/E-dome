import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Brand } from "@/components/layout/brand";

/* ── Authentification : écran partagé (REBUILD.md §4) ────────────────────────
   Gauche : le formulaire. Droite (grand écran) : la promesse d'E-Dome et ses
   règles — et rien d'autre. L'ancienne note « 4.14 · 487 avis » était
   inventée : elle a disparu. */

const RULES = [
  "Publier un bien est gratuit, sans commission d'agence.",
  "Recommandez le bon contact : le vendeur vous verse une prime fixe.",
  "Recommandez un bien avec votre lien : la commission est suivie jusqu'au paiement.",
  "E-Dome ne détient jamais l'argent de la transaction.",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,560px)]">
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-5 lg:p-8">
            <Brand />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Retour au site
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center px-5 pb-12 lg:px-12">
            <div className="w-full max-w-[400px]">{children}</div>
          </div>
        </div>

        {/* Couleurs fixes : le panneau reste encre sur papier dans les deux thèmes. */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#15130f] p-12 text-[#faf9f6] lg:flex">
          {/* Le dôme de la marque, en grand, comme filigrane. */}
          <svg aria-hidden viewBox="0 0 400 260" className="pointer-events-none absolute -bottom-6 -right-28 w-[520px] opacity-[0.06]">
            <path d="M40 230a160 160 0 0 1 320 0" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
            <path d="M10 230h380" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          </svg>
          <p className="eyebrow !text-[#faf9f6]/60">Le réseau immobilier suisse</p>
          <div className="relative">
            <p className="text-[34px] font-semibold leading-[1.1] tracking-[-0.03em]">
              Votre réseau
              <br />
              vaut de l&apos;argent.
            </p>
            <ul className="mt-8 space-y-3">
              {RULES.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[14.5px] leading-snug text-[#faf9f6]/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9a441]/20 text-[#e3b85c]">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-[12.5px] text-[#faf9f6]/50">Suisse romande</p>
        </aside>
      </div>
    </div>
  );
}
