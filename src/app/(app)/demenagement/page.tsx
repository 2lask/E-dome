import type { Metadata } from "next";
import { Sparkles, Truck, ShieldCheck, Clock3 } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listMyMoveRequests } from "@/lib/supabase/move-actions";
import { MoveForm } from "@/components/demenagement/move-form";
import { frDay } from "@/lib/my-property";
import { MOVE_STATUS_LABEL, SERVICE_LABEL, isMoveService, type MoveService } from "@/lib/demenagement";

export const metadata: Metadata = {
  title: "Déménagement : nettoyage de fin de bail, déménageurs — devis gratuits",
  description: "Décrivez votre déménagement une fois : nettoyage avec garantie de remise, transport, débarras. Jusqu'à trois devis d'artisans de votre région.",
};

/* ── /demenagement — le service du moment de vérité ──────────────────────────
   Celui qui remet son bail ou trouve un logement doit, la même semaine, faire
   nettoyer (avec garantie de remise), transporter, débarrasser. On le lui
   propose au bon moment, en une demande. Préremplissage : ?depuis=&service=&bien= */

export default async function DemenagementPage({
  searchParams,
}: {
  searchParams: Promise<{ depuis?: string; service?: string; bien?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const { requests, ready } = user ? await listMyMoveRequests() : { requests: [], ready: true };
  const service = (sp.service ?? "").split(",").filter(isMoveService) as MoveService[];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="eyebrow">Déménagement</p>
      <h1 className="page-heading mt-1.5 text-[30px] sm:text-[36px]">Un déménagement, une seule demande</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Nettoyage de fin de bail, déménageurs, débarras : décrivez votre besoin une fois, recevez
        jusqu&apos;à trois devis d&apos;artisans de votre région. Gratuit et sans engagement.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          {ready ? (
            <MoveForm
              defaults={{
                name: user ? `${user.firstName} ${user.lastName}`.trim() : "",
                email: user?.email ?? "",
                fromCity: (sp.depuis ?? "").slice(0, 80),
                services: service,
                propertyId: /^[0-9a-f-]{36}$/i.test(sp.bien ?? "") ? sp.bien! : "",
              }}
            />
          ) : (
            <p role="status" className="rounded-lg bg-warning-soft px-3 py-2.5 text-[13px]">Le service ouvre bientôt (base à mettre à jour).</p>
          )}
        </section>

        <aside className="space-y-3">
          {[
            { icon: Sparkles, t: "Garantie de remise", d: "Le nettoyage de fin de bail est refait si la régie le refuse à l'état des lieux (selon l'artisan, précisé dans son devis)." },
            { icon: Truck, t: "Tout en une fois", d: "Nettoyage, transport, débarras, peinture, garde-meubles." },
            { icon: Clock3, t: "Devis rapides", d: "Les artisans vous contactent directement." },
            { icon: ShieldCheck, t: "Vos coordonnées protégées", d: "Transmises à trois artisans au plus, jamais revendues ailleurs." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border bg-card p-4">
              <Icon className="h-5 w-5 text-leman" aria-hidden />
              <p className="mt-2 text-[14px] font-semibold">{t}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </aside>
      </div>

      {requests.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[18px] font-semibold">Vos demandes</h2>
          <ul className="mt-3 divide-y rounded-2xl border bg-card">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 text-[13.5px]">
                <span className="flex-1">{r.services.map((s) => SERVICE_LABEL[s]).join(", ")} · {r.fromCity}{r.moveDate ? ` · ${frDay(r.moveDate)}` : ""}</span>
                <span className="rounded-md bg-subtle px-2 py-0.5 text-[12px]">{MOVE_STATUS_LABEL[r.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-[12px] leading-relaxed text-muted-foreground">
        E-Dome transmet votre demande ; le contrat se conclut directement entre vous et l&apos;artisan choisi. Vous pouvez
        demander l&apos;effacement de votre demande à tout moment (page Contact).
      </p>
    </div>
  );
}
