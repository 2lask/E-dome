import type { Metadata } from "next";
import { form, site } from "@/content/landing";
import { ANCHORS } from "@/components/landing/anchors";
import { ProfileSelectionProvider } from "@/components/landing/profile-selection";
import { LandingHeader } from "@/components/landing/landing-header";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { AudienceSection } from "@/components/landing/audience-section";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { DemoSection } from "@/components/landing/demo-section";
import { FoundingSection } from "@/components/landing/founding-section";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Section } from "@/components/landing/section";

/* ── Landing page ────────────────────────────────────────────────────────────

   Cette route remplace une page qui retournait littéralement `<main />`, donc
   un écran blanc — alors que le bandeau « En savoir plus » de la maquette et
   l'entrée « Quitter la maquette » du menu profil y renvoient tous les deux.
   Ces deux liens aboutissent désormais sur une vraie page.

   La page est un Server Component. Seuls l'en-tête (menu mobile), la section
   « Pour qui » et le formulaire sont clients. `ProfileSelectionProvider` est
   une frontière client qui reçoit `children` : les sections non interactives
   restent donc rendues côté serveur en la traversant.

   Tous les textes viennent de `src/content/landing.ts`. */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: site.seo.title,
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.seo.locale,
    url: "/",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: site.seo.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage],
  },
};

export default function LandingPage() {
  return (
    <ProfileSelectionProvider>
      {/* Lien d'évitement : l'en-tête est fixe et compte plusieurs liens,
          une navigation au clavier doit pouvoir le sauter. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--primary-foreground)]"
      >
        Aller au contenu
      </a>

      <LandingHeader />

      <main id="contenu">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <AudienceSection />
        <RoadmapSection />
        <DemoSection />
        <FoundingSection />

        {/* Étape 2 du chantier : remplacé par le formulaire de manifestation
            d'intérêt. L'ancre est déjà en place pour que les appels à l'action
            de l'en-tête, du hero et des cartes « C'est moi » soient
            fonctionnels dès maintenant. */}
        <Section
          id={ANCHORS.form}
          eyebrow={form.eyebrow}
          title={form.title}
          intro={form.intro}
          centered
        >
          <p className="mx-auto max-w-md rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)] p-6 text-center text-sm text-[var(--text-muted)]">
            Formulaire en cours d&apos;intégration.
          </p>
        </Section>

        <FaqSection />
      </main>

      <LandingFooter />
    </ProfileSelectionProvider>
  );
}
