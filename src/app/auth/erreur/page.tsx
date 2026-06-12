import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h1 className="page-heading mt-4 text-2xl">Connexion impossible</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Le lien a expire ou la connexion OAuth a echoue. Reessaie depuis la page
        de connexion.
      </p>
      <Link
        href="/auth/connexion"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Retour a la connexion
      </Link>
    </div>
  );
}
