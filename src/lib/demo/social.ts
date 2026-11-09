/* ── Le graphe social : qui suit qui, parmi les seize ───────────────────────

   Les compteurs « abonnés » et « suivis » étaient écrits à la main sur chaque
   personne — 3 100, 5 620, 8 900 — et l'onglet « Abonnés » de /reseau
   affichait l'annuaire entier, quel que soit le profil. Aucun de ces nombres
   ne se vérifiait en cliquant.

   Ici, une seule donnée : la liste des relations de suivi entre les seize
   personnes de l'annuaire. Tout le reste en dérive :
     · abonnés d'une personne  = relations ENTRANTES ;
     · suivis d'une personne   = relations SORTANTES ;
     · /reseau : les onglets Abonnés / Abonnements listent exactement ces
       personnes, et « Découvrir » celles qu'on ne suit pas encore.

   Un réseau qui se lance : de deux à une quinzaine de relations par personne.
   Le graphe suit le casting (`analyse2/casting.md`, « Relations ») : l'équipe
   Hartmann se suit, Céline suit ceux avec qui elle travaille (Nikola, Elena),
   Ennio — froid — ne suit presque personne, Ana suit le bailleur dont elle
   convoite l'appartement, Mirjana suit la formatrice dont elle a suivi le
   cours.

   Ce module n'importe RIEN du dépôt : `mock-data.ts` et `identity.ts` peuvent
   le lire sans créer de cycle. Le garde-fou (invariant 16) vérifie que les
   compteurs affichés concordent avec ce graphe, et que tout id y est une
   personne de l'annuaire. */

/** Qui suit qui : `[suiveur, suivi]`. Une ligne par personne, pour se relire. */
const FOLLOWING: Readonly<Record<string, readonly string[]>> = {
  /* Léo Martin — bailleur et hôte lausannois : les gens avec qui il travaille
     (Nikola pour les photos, Elena), la formatrice dont il a suivi le cours
     (Sandrine), et quelques pairs hôtes. */
  "user-001": ["user-002", "user-003", "user-005", "user-010", "user-011", "user-013", "user-015", "user-016"],
  /* Céline Bovard — son équipe de fait (Nikola, Elena), ses clients et
     prospects (Ennio, Bernard, Clémence), un confrère (Jean-Luc), Léo. */
  "user-002": ["user-001", "user-003", "user-005", "user-007", "user-008", "user-010", "user-015"],
  /* Ennio Bordoni — l'agente qui lui a vendu son appartement, la fiscaliste. */
  "user-003": ["user-002", "user-011"],
  /* Aline Tschanz — son directeur, l'architecte du projet de l'agence,
     l'apporteur gruérien, le photographe, une consœur. */
  "user-004": ["user-002", "user-005", "user-009", "user-012", "user-015"],
  /* Nikola Ristić — ses clientes et clients. */
  "user-005": ["user-001", "user-002", "user-004", "user-010"],
  /* Ana Ferreira — le bailleur de l'appartement qu'elle vise, deux personnes
     qui expliquent bien. */
  "user-006": ["user-001", "user-008", "user-011"],
  /* Bernard Chappuis — le photographe qu'il a engagé, un retraité comme lui. */
  "user-007": ["user-005", "user-012"],
  /* Clémence Jaquet — ceux qui répondent à ses questions. */
  "user-008": ["user-001", "user-002", "user-003", "user-006", "user-011"],
  /* Reto Jungo — le chantier neuchâtelois (Jean-Luc, Aline), Elena. */
  "user-009": ["user-004", "user-010", "user-015"],
  /* Elena Currat — Céline et Nikola (mêmes mises en vente), Mirjana, Léo. */
  "user-010": ["user-001", "user-002", "user-005", "user-013"],
  /* Sandrine Monnier — Jean-Luc (son agence), Amina (consœur formatrice),
     Hélène (qui recommande sa formation), Léo et Clémence (ses élèves). */
  "user-011": ["user-001", "user-008", "user-014", "user-015", "user-016"],
  /* Yves Mottiez — l'agence à qui il a amené un bien, Bernard. */
  "user-012": ["user-004", "user-007", "user-015"],
  /* Mirjana Kovač — la formatrice qu'elle a suivie, d'autres hôtes. */
  "user-013": ["user-001", "user-003", "user-010", "user-016"],
  /* Hélène Marchal — les créatrices qu'elle recommande, des hôtes. */
  "user-014": ["user-001", "user-011", "user-013", "user-016"],
  /* Jean-Luc Hartmann — son équipe, son architecte, son apporteur, Sandrine
     (cliente), une consœur. */
  "user-015": ["user-002", "user-004", "user-009", "user-011", "user-012"],
  /* Amina El Idrissi — ses élèves et consœurs. */
  "user-016": ["user-001", "user-011", "user-013", "user-014"],
};

/** Le graphe, à plat : une arête par relation de suivi. */
export const FOLLOWS: readonly { from: string; to: string }[] = Object.entries(FOLLOWING).flatMap(
  ([from, tos]) => tos.map((to) => ({ from, to })),
);

/** Les personnes que `id` suit (relations sortantes). */
export function followingOf(id: string): string[] {
  return FOLLOWS.filter((e) => e.from === id).map((e) => e.to);
}

/** Les personnes qui suivent `id` (relations entrantes). */
export function followersOf(id: string): string[] {
  return FOLLOWS.filter((e) => e.to === id).map((e) => e.from);
}

/** Nombre d'abonnés de `id` — dérivé, jamais écrit. */
export function followerCount(id: string): number {
  return followersOf(id).length;
}

/** Nombre de personnes suivies par `id` — dérivé, jamais écrit. */
export function followingCount(id: string): number {
  return followingOf(id).length;
}
