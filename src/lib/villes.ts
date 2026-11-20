/* ── Les villes de lancement (pages /ville/<adresse>) ────────────────────────
   Densité avant étendue : une page par ville regroupe tout ce qui s'y passe
   (biens, reprises de bail, recherches à récompense, agences). Ces pages sont
   faites pour être trouvées (moteurs de recherche) et partagées (groupes de
   logement). Ajouter une ville = une ligne ici. */

export interface City {
  slug: string;
  name: string;
  canton: string;
  /** Localités voisines rattachées à la page (comparées sans accents). */
  nearby: string[];
}

export const CITIES: City[] = [
  { slug: "neuchatel", name: "Neuchâtel", canton: "NE", nearby: ["Peseux", "Corcelles", "Hauterive", "Saint-Blaise", "Marin", "Colombier", "Boudry", "Cortaillod", "Auvernier", "Bevaix", "La Chaux-de-Fonds", "Le Locle"] },
  { slug: "lausanne", name: "Lausanne", canton: "VD", nearby: ["Renens", "Prilly", "Pully", "Lutry", "Ecublens", "Crissier", "Le Mont-sur-Lausanne", "Epalinges", "Bussigny", "Morges", "Chavannes-près-Renens"] },
];

/** Sans accents, minuscules, espaces simples : « Neuchâtel 2000 » → « neuchatel 2000 ». */
export function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function cityBySlug(slug: string): City | null {
  return CITIES.find((c) => c.slug === slug) ?? null;
}

/** Une localité saisie appartient-elle à la page de cette ville ? */
export function inCity(locality: string, city: City): boolean {
  const l = ` ${norm(locality)} `;
  return [city.name, ...city.nearby].some((n) => l.includes(` ${norm(n)} `));
}
