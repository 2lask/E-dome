import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Mail, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/marketing/blocks";
import { ContactForm } from "@/components/marketing/contact-form";
import { CopyEmail } from "@/components/marketing/copy-email";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question, une suggestion ou un problème ? Écrivez à l'équipe E-Dome.",
};

/* ── /contact ────────────────────────────────────────────────────────────────
   Server Component ; seul le formulaire est interactif. Retirés : le
   téléphone, l'adresse postale, les horaires du support et les liens vers des
   réseaux sociaux, qui n'existaient pas (la société n'est pas encore
   constituée, voir la politique de confidentialité), ainsi que le faux envoi
   et la promesse d'un e-mail de confirmation. */

const SUPPORT_EMAIL = "support@edome.world";

const QUICK = [
  { q: "Est-ce gratuit ?", href: "/aide#demarrer" },
  { q: "Comment publier un bien ?", href: "/aide#publier-et-vendre" },
  { q: "Quand la commission est-elle due ?", href: "/aide#la-commission-et-les-apporteurs" },
  { q: "Comment supprimer mon compte ?", href: "/aide#confidentialite" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHero
        eyebrow="Contact"
        title={<>Contactez-nous. <span className="cine-gold">Nous sommes là pour vous aider.</span></>}
        lead="Une question, une suggestion ou un problème ? Écrivez-nous : nous vous répondons par e-mail."
      />

      <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
        <Reveal>
          <ContactForm email={SUPPORT_EMAIL} />
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={0.06}>
            <div className="rounded-3xl border bg-card p-5 sm:p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"><Mail className="h-5 w-5" aria-hidden /></span>
              <h2 className="mt-4 text-[16px] font-semibold">Par e-mail</h2>
              <p className="mt-1 text-[13.5px] text-muted-foreground">Directement, sans passer par le formulaire.</p>
              <div className="mt-4"><CopyEmail email={SUPPORT_EMAIL} /></div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-3xl border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/30 to-card p-5 sm:p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-laiton-border bg-card/60 text-laiton"><BookOpen className="h-5 w-5" aria-hidden /></span>
              <h2 className="mt-4 text-[16px] font-semibold">Avant d&apos;écrire</h2>
              <p className="mt-1 text-[13.5px] text-muted-foreground">La réponse est peut-être déjà dans l&apos;aide.</p>
              <ul className="mt-3 divide-y divide-laiton-border/60">
                {QUICK.map((it) => (
                  <li key={it.q}>
                    <Link href={it.href} className="group flex min-h-[44px] items-center justify-between gap-3 py-2 text-[14px] font-medium">
                      {it.q}
                      <ArrowRight className="h-4 w-4 shrink-0 text-laiton transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex items-start gap-3 rounded-3xl border border-dashed p-5 text-[13px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leman" aria-hidden />
              <p>
                Pour exercer vos droits sur vos données, voyez la <Link href="/confidentialite" className="font-medium text-leman underline underline-offset-2">politique de confidentialité</Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
