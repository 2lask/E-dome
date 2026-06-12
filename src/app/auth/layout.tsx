import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* Layout auth : split-screen.
   - Gauche : zone form (max-w-md centree) sur fond white
   - Droite : hero immobilier avec gradient + tagline (cache < lg) */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form side */}
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between p-6 lg:p-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Retour
            </Link>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              E-Dome
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center px-6 pb-10 lg:px-12">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>

        {/* Hero side */}
        <aside
          className="relative hidden bg-black lg:flex lg:flex-col lg:justify-between lg:p-12"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 100%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=2000&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
            Plateforme immobiliere
          </p>
          <div>
            <p className="page-heading max-w-md text-3xl text-white">
              La plateforme tout-en-un pour gerer, investir et louer.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                4.14
              </span>
              <span className="h-px flex-1 bg-white/20" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                487 avis
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
