/* ── DOSSIER DE LOCATION — modèle partagé (client-safe) ──────────────────────
   Rempli une fois, joint en un clic. Les pièces que demande toute régie
   romande : extrait des poursuites (moins de 3 mois), trois dernières fiches
   de salaire, pièce d'identité ou permis, attestation d'assurance RC. */

export type DocKind = "poursuites" | "salaire" | "identite" | "assurance_rc" | "autre";

export const DOC_KINDS: { kind: DocKind; label: string; hint: string; required: boolean }[] = [
  { kind: "poursuites", label: "Extrait des poursuites", hint: "De moins de 3 mois — à commander à l'office des poursuites de votre domicile.", required: true },
  { kind: "salaire", label: "Fiches de salaire", hint: "Les 3 dernières, ou une attestation de revenu.", required: true },
  { kind: "identite", label: "Pièce d'identité ou permis", hint: "Carte d'identité, passeport ou permis de séjour.", required: true },
  { kind: "assurance_rc", label: "Assurance responsabilité civile", hint: "Attestation ou police RC ménage.", required: false },
  { kind: "autre", label: "Autre pièce", hint: "Garant, lettre de recommandation…", required: false },
];

export const SITUATIONS: { value: string; label: string }[] = [
  { value: "salarie", label: "Salarié·e" },
  { value: "independant", label: "Indépendant·e" },
  { value: "etudiant", label: "Étudiant·e" },
  { value: "retraite", label: "Retraité·e" },
  { value: "autre", label: "Autre" },
];

export const PERMITS: { value: string; label: string }[] = [
  { value: "suisse", label: "Nationalité suisse" },
  { value: "C", label: "Permis C" },
  { value: "B", label: "Permis B" },
  { value: "L", label: "Permis L" },
  { value: "G", label: "Permis G" },
  { value: "autre", label: "Autre" },
];

export interface Dossier {
  situation: string;
  employer: string;
  monthlyIncome: number | null;
  occupants: number;
  children: number;
  pets: boolean;
  smoker: boolean;
  permit: string;
  intro: string;
  updatedAt: string | null;
}

export interface DossierDoc {
  id: string;
  kind: DocKind;
  name: string;
  createdAt: string;
}

export const EMPTY_DOSSIER: Dossier = {
  situation: "", employer: "", monthlyIncome: null, occupants: 1, children: 0,
  pets: false, smoker: false, permit: "", intro: "", updatedAt: null,
};

/** Complétude (0–100) : ce qu'une régie regarde en premier. */
export function dossierScore(d: Dossier, docs: DossierDoc[]): { pct: number; missing: string[] } {
  const has = (k: DocKind) => docs.some((x) => x.kind === k);
  const checks: [boolean, string][] = [
    [!!d.situation, "Votre situation"],
    [!!d.monthlyIncome && d.monthlyIncome > 0, "Votre revenu mensuel"],
    [!!d.permit, "Nationalité ou permis"],
    [d.intro.trim().length >= 40, "Quelques mots de présentation"],
    [has("poursuites"), "Extrait des poursuites"],
    [has("salaire"), "Fiches de salaire"],
    [has("identite"), "Pièce d'identité"],
  ];
  const done = checks.filter(([ok]) => ok).length;
  return { pct: Math.round((done / checks.length) * 100), missing: checks.filter(([ok]) => !ok).map(([, l]) => l) };
}
