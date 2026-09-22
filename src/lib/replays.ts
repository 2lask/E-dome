/* Replays des lives — source unique.

   La liste (/live) et la fiche (/live/replay/[id]) portaient chacune leur
   copie des six replays, avec des titres qui divergeaient déjà par les
   accents (« Fiscalité » contre « Fiscalite »). Surtout, la liste liait par
   position — `idx + 1` — alors que ses replays sont identifiés R1 à R6 :
   l'identifiant affiché n'était pas celui de l'URL, et insérer un replay en
   tête aurait décalé silencieusement tous les liens.

   Les deux pages lisent maintenant ce tableau, et l'adressage se fait par
   identifiant. */

export interface Replay {
  id: string;
  titre: string;
  speaker: string;
  date: string;
  vues: number;
  duree: string;
  /** Identifiant de la vidéo YouTube intégrée sur la fiche. */
  youtubeId: string;
}

export const REPLAYS: Replay[] = [
  { id: "R1", titre: "Les tendances du marché Q1 2026", speaker: "Jean-Pierre Dumont", date: "20 mars 2026", vues: 1240, duree: "1h12", youtubeId: "FqjDgXlE2nQ" },
  { id: "R2", titre: "Comment fixer le bon prix de location", speaker: "Nadia Silva", date: "15 mars 2026", vues: 890, duree: "45min", youtubeId: "E0dyHPjiJDo" },
  { id: "R3", titre: "Fiscalité immobilière en Suisse", speaker: "Patrick Leroy", date: "10 mars 2026", vues: 2100, duree: "1h30", youtubeId: "_DtWLPqqnwU" },
  { id: "R4", titre: "Home staging : avant/après", speaker: "Amina Koné", date: "5 mars 2026", vues: 670, duree: "38min", youtubeId: "p5Kk_HBASHg" },
  { id: "R5", titre: "Droit du bail : vos obligations", speaker: "Thomas Roth", date: "28 février 2026", vues: 1560, duree: "55min", youtubeId: "NBjn9FkvpCQ" },
  { id: "R6", titre: "Photographie immobilière pro", speaker: "Amina Koné", date: "20 février 2026", vues: 780, duree: "42min", youtubeId: "FqjDgXlE2nQ" },
];

export function getReplayById(id: string): Replay | undefined {
  return REPLAYS.find((r) => r.id === id);
}

export function formatVues(vues: number): string {
  return vues.toLocaleString("fr-CH");
}
