import Link from "next/link";
import { footer, site } from "@/content/landing";
import { Container } from "./section";

/* Pied de page.

   L'année est calculée au rendu. La page étant prérendue statiquement, elle
   est donc figée au moment du build : elle se met à jour au prochain
   déploiement. C'est acceptable ici et cela évite d'ajouter un composant
   client uniquement pour afficher quatre chiffres. */

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)] py-12">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="page-heading text-lg font-semibold text-[var(--foreground)]">
              {site.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {site.tagline}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">{footer.note}</p>
          </div>

          <nav aria-label="Liens de pied de page" className="flex flex-col gap-1">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
            {/* À COMPLÉTER — adresse de contact définitive dans le contenu. */}
            <a
              href={`mailto:${footer.contactEmail}`}
              className="inline-flex min-h-11 items-center text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--foreground)]"
            >
              {footer.contactLabel}
            </a>
          </nav>
        </div>

        <p className="mt-10 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)]">
          © {year} {footer.copyright}
        </p>
      </Container>
    </footer>
  );
}
