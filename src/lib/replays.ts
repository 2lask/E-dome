/* Replays des lives — source unique.

   La liste (/live) et la fiche (/live/replay/[id]) portaient chacune leur
   copie des six replays, avec des titres qui divergeaient déjà par les
   accents (« Fiscalité » contre « Fiscalite »). Surtout, la liste liait par
   position — `idx + 1` — alors que ses replays sont identifiés R1 à R6 :
   l'identifiant affiché n'était pas celui de l'URL, et insérer un replay en
   tête aurait décalé silencieusement tous les liens.

   Les deux pages lisent maintenant ce tableau, et l'adressage se fait par
   identifiant.

   Chantier P6c : chaque replay est celui d'un live animé par une personne de
   l'annuaire (`speakerId`) — plus de « Jean-Pierre Dumont » ni de « Nadia
   Silva » —, daté avant le « aujourd'hui » de la démonstration, avec des vues
   à l'échelle d'un réseau qui se lance (des dizaines). La vidéo YouTube sans
   rapport qui tenait lieu de replay est retirée : la fiche le dit. */

import { requirePerson } from "@/lib/demo/directory";
import { groupThousands } from "@/lib/demo/session-views";

export interface Replay {
  id: string;
  titre: string;
  /** L'animateur : une personne de l'annuaire. */
  speakerId: string;
  /** « Prénom Nom », lu dans l'annuaire. */
  speaker: string;
  date: string;
  vues: number;
  duree: string;
}

const SEEDS: Omit<Replay, "speaker">[] = [
  { id: "R1", titre: "Le marché romand au troisième trimestre", speakerId: "user-003", date: "17 septembre 2026", vues: 46, duree: "52min" },
  { id: "R2", titre: "Fixer son prix en courte durée", speakerId: "user-013", date: "9 septembre 2026", vues: 38, duree: "45min" },
  { id: "R3", titre: "Fiscalité immobilière en Suisse", speakerId: "user-011", date: "2 septembre 2026", vues: 61, duree: "1h10" },
  { id: "R4", titre: "Home staging : avant/après", speakerId: "user-010", date: "26 août 2026", vues: 29, duree: "38min" },
  { id: "R5", titre: "Droit du bail : les obligations du bailleur", speakerId: "user-004", date: "19 août 2026", vues: 33, duree: "55min" },
  { id: "R6", titre: "Photographie immobilière : les bases", speakerId: "user-005", date: "12 août 2026", vues: 22, duree: "42min" },
];

export const REPLAYS: Replay[] = SEEDS.map((r) => {
  const p = requirePerson(r.speakerId);
  return { ...r, speaker: `${p.firstName} ${p.lastName}` };
});

export function getReplayById(id: string): Replay | undefined {
  return REPLAYS.find((r) => r.id === id);
}

/** Groupement suisse, sans `toLocaleString` (hydratation stable). */
export function formatVues(vues: number): string {
  return groupThousands(vues);
}
