import { ChevronDown } from "lucide-react";
import { faq } from "@/content/landing";
import { Section } from "./section";

/* Accordéon de FAQ bâti sur `<details>` / `<summary>`.

   Choix délibéré plutôt qu'un accordéon en JavaScript : l'élément natif est
   déjà accessible au clavier (Entrée et Espace), annonce son état ouvert ou
   fermé aux lecteurs d'écran, reste ouvrable si le JavaScript échoue, et
   permet la recherche dans la page sur les navigateurs récents. Aucun
   `aria-expanded` à maintenir, aucun composant client à charger.

   Les `<details>` ne partagent pas de `name` : plusieurs réponses peuvent
   donc rester ouvertes en même temps, ce qui évite qu'une lecture en referme
   une autre. */

export function FaqSection() {
  return (
    <Section eyebrow={faq.eyebrow} title={faq.title} centered>
      <div className="mx-auto max-w-3xl divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {faq.items.map((item) => (
          <details key={item.id} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium text-[var(--foreground)] transition-colors hover:text-[var(--text-secondary)] [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                strokeWidth={2}
                className="shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <div className="pb-5 pr-8">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
