import { chf } from "@/lib/model/billing";
import type { PlatformRole } from "@/lib/model/identity";
import type { Charge } from "@/lib/pricing/charge";
import { quote, type MoneyFlow } from "@/lib/pricing/quote";
import type { EventRegistrationData, SessionState } from "./session-store";

/* ── Inscriptions aux événements et aux lives (chantier P6c) ─────────────────

   Fonctions PURES sur le journal de session : qui est inscrit à quoi, combien
   d'inscriptions la visite a ajoutées, ce que la personne a mis à son agenda,
   et le flux d'argent d'un billet payé — calculé par `quote()`, la seule
   source du modèle (pôles `evenement` et `live`). Testées par
   `tests/data/p6c-poles.test.ts`. */

export type EventTarget = EventRegistrationData["target"];

/** Les ids (événements et lives) auxquels `actorId` est inscrit, à l'instant. */
export function registeredIds(state: SessionState, actorId: string): Set<string> {
  const out = new Set<string>();
  for (const e of state.events) {
    if (e.actorId !== actorId) continue;
    if (e.kind === "event.registered") out.add(e.data.eventId);
    else if (e.kind === "event.unregistered") out.delete(e.data.eventId);
  }
  return out;
}

/** Le nombre de personnes que la visite a inscrites à `eventId` (net des
    désinscriptions). S'ajoute aux inscrits de l'amorce. */
export function sessionRegistrationCount(state: SessionState, eventId: string): number {
  const who = new Set<string>();
  for (const e of state.events) {
    if (e.kind === "event.registered" && e.data.eventId === eventId) who.add(e.actorId);
    else if (e.kind === "event.unregistered" && e.data.eventId === eventId) who.delete(e.actorId);
  }
  return who.size;
}

/** Ce que `actorId` a ajouté à son agenda pendant la visite. */
export function agendaIds(state: SessionState, actorId: string): Set<string> {
  const out = new Set<string>();
  for (const e of state.events) if (e.actorId === actorId && e.kind === "agenda.added") out.add(e.data.eventId);
  return out;
}

/** La charge d'un billet : commission du pôle, part fixe par billet pour un
    événement. `null` si c'est gratuit — rien ne circule. */
export function registrationCharge(target: EventTarget, priceChf: number): Charge | null {
  if (!(priceChf > 0)) return null;
  return target === "live"
    ? { kind: "commission", pole: "live", gross: chf(priceChf) }
    : { kind: "commission", pole: "evenement", gross: chf(priceChf), units: 1 };
}

/** Le flux d'argent d'une inscription payée (qui touche quoi), ou `null`. */
export function registrationFlow(target: EventTarget, priceChf: number): MoneyFlow | null {
  const charge = registrationCharge(target, priceChf);
  return charge ? quote(charge).flow : null;
}

/** Peut animer un live ou organiser un événement : qui crée, vend une
    prestation, accueille ou représente une agence. Un particulier, un
    investisseur ou un apporteur s'inscrit — il n'anime pas. */
const HOST_ROLES: readonly PlatformRole[] = ["createur", "prestataire", "agent", "agence", "hote"];
export function canHost(roles: readonly PlatformRole[]): boolean {
  return roles.some((r) => HOST_ROLES.includes(r));
}
