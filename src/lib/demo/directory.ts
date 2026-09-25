import { users, getUserById } from "@/lib/mock-data";
import { roleLabels } from "@/lib/types";
import type { User } from "@/lib/types";

/* ── L'ANNUAIRE UNIQUE DES PERSONNES ────────────────────────────────────────

   C'est LA source unique d'accès aux personnes de la démonstration. Le tableau
   `users[]` de `mock-data.ts` reste la donnée ; ce module est la seule couche
   d'accès. Plus personne n'invente de gens : les auteurs du fil, les
   participants de conversation, les profils publics et les avis passent tous
   par ici, par identifiant.

   C'est le pendant, pour les personnes, de ce que `data/properties.ts` est aux
   biens : `requirePerson()` échoue bruyamment sur un id fantôme (comme
   `propRef()`), au lieu d'afficher « Profil introuvable » ou d'inventer une
   identité concurrente. Le même id ne peut donc plus désigner deux personnes
   différentes selon l'écran.

   Attention aux cycles : `mock-data.ts` ne doit JAMAIS importer ce module. Le
   sens de dépendance est unique — directory → mock-data, jamais l'inverse. */

/** Le compte officiel de la plateforme (fil), qui n'est PAS une personne réelle
    et ne figure donc pas à l'annuaire. Les invariants et vues l'exemptent. */
export const PLATFORM_ACCOUNT_ID = "edome";

/** L'annuaire, exposé sous un nom qui dit ce qu'il est. Alias de `users[]` :
    on n'en fait pas une copie, on lui donne un point d'accès. */
export const DIRECTORY: User[] = users;

/** Les identifiants de toutes les personnes connues à l'annuaire. */
export const DIRECTORY_IDS: string[] = users.map((u) => u.id);

/** La personne d'identifiant `id`, ou `undefined` si elle est inconnue. */
export function personById(id: string): User | undefined {
  return getUserById(id);
}

/** La personne d'identifiant `id`, ou une erreur claire si l'id est inconnu.
    Sur le modèle de `propRef()` pour les biens : un id fantôme échoue
    bruyamment, pas silencieusement. */
export function requirePerson(id: string): User {
  const person = getUserById(id);
  if (!person) throw new Error("Personne inconnue à l'annuaire : " + id);
  return person;
}

/** Vue légère d'une personne (listes réseau, suggestions, participants…).
    `name` = « prénom nom », `role` = libellé lisible du rôle actif. */
export function personSummary(id: string): {
  id: string;
  name: string;
  avatar: string;
  role: string;
} {
  const p = requirePerson(id);
  return {
    id: p.id,
    name: `${p.firstName} ${p.lastName}`.trim(),
    avatar: p.avatar,
    role: roleLabels[p.activeRole],
  };
}
