"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/components/listing/track";
import type { MyProperty } from "@/lib/my-property";
import { listingText } from "@/lib/diffusion";

/* ── Kit de diffusion (en attendant les accords de diffusion avec les portails)
   Un texte d'annonce prêt à coller, et les endroits où le publier soi-même.
   Le lien E-Dome garde visites et contacts dans le suivi, là où le portail
   autorise un lien. Aucun tarif de portail n'est affirmé ici. */

const PLACES = [
  { name: "newhome.ch", href: "https://www.newhome.ch", note: "portail des banques cantonales, publication gratuite" },
  { name: "Homegate", href: "https://www.homegate.ch", note: "portail principal, selon ses tarifs" },
  { name: "ImmoScout24", href: "https://www.immoscout24.ch", note: "portail principal, selon ses tarifs" },
  { name: "Groupes locaux", href: null, note: "Facebook, WhatsApp de quartier, employeur, association" },
];

export function DiffusionKit({ p }: { p: MyProperty }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}/explorer/${p.id}`;
    try {
      await navigator.clipboard.writeText(listingText(p, url));
      setCopied(true);
      track(p.id, "partage");
      setTimeout(() => setCopied(false), 2000);
    } catch { /* presse-papiers refusé : rien à faire */ }
  };

  return (
    <details className="group border-t px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-[13px] font-medium">
        <Megaphone className="h-4 w-4 text-leman" aria-hidden /> Diffuser ailleurs
        <span className="text-muted-foreground group-open:hidden">· texte prêt à coller et portails</span>
      </summary>
      <div className="mt-3 space-y-3">
        <Button size="sm" variant="outline" onClick={() => void copy()}>
          {copied ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Texte copié" : "Copier le texte de l'annonce"}
        </Button>
        <ul className="grid gap-2 sm:grid-cols-2">
          {PLACES.map((pl) => (
            <li key={pl.name} className="rounded-lg border bg-background px-3 py-2 text-[12.5px]">
              {pl.href ? (
                <a href={pl.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-leman hover:underline">
                  {pl.name} <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ) : <span className="font-medium">{pl.name}</span>}
              <span className="block text-muted-foreground">{pl.note}</span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-muted-foreground">
          Mettez votre lien E-Dome partout où c&apos;est autorisé : les visites et les demandes restent dans votre tableau de bord. Respectez les règles de chaque portail.
        </p>
      </div>
    </details>
  );
}
