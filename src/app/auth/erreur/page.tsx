import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card/80 p-7 text-center shadow-[0_30px_80px_-40px_rgb(0_0_0/0.55)] backdrop-blur">
      <div aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--danger-text)]/50 to-transparent" />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-[var(--danger-text)]">
        <AlertCircle className="h-6 w-6" aria-hidden />
      </div>
      <h1 className="page-heading mt-5 text-[28px]">Connexion impossible</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Le lien a expiré ou la connexion par un service externe a échoué. Réessayez depuis la page de connexion.
      </p>
      <Link
        href="/auth/connexion"
        className="group mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-[14px] font-semibold text-background transition-opacity hover:opacity-90"
      >
        Retour à la connexion
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </div>
  );
}
