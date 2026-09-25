import {
  properties as CATALOGUE,
  formations as FORMATIONS,
  users as PEOPLE,
  conversations,
  mockReviews,
} from "@/lib/mock-data";
import { DEMO_TODAY, MONTH_LABELS, last12Months } from "./clock";
import { bySource, currentMonth, entries, monthly } from "./derive";
import { LEDGER } from "./ledger";
import { PROFILES } from "./identity";
import { PLATFORM_ACCOUNT_ID } from "./directory";
import { VIDEO_POSTS, SUGGESTIONS } from "./posts";
import { PUBLIC_SEED_IDS } from "@/lib/profile-data";

/* ── Les invariants, levés à l'import ───────────────────────────────────────

   Pas dans un test : à l'import. `next build` prérend les pages, donc ce
   module s'exécute au build et une violation **fait échouer la construction**.

   Ce choix est délibéré. Il n'existe pas de lanceur de tests unitaires dans ce
   dépôt — `npm test` est Playwright, qui démarre un serveur et un navigateur.
   Une assertion à l'import bloque le commit sans ajouter ni dépendance ni
   porte de qualité, et surtout elle ne peut pas être oubliée : il n'y a aucune
   commande à penser à lancer.

   Ce que ces règles rendent impossible, concrètement : ajouter un second
   tableau de montants quelque part. C'est exactement ce qui s'était produit
   entre `dashboard-data.ts` et `revenue-data.ts`, avec un facteur 5 à la clé.

   `tests/data/` reprend ces mêmes assertions sous `node --test`, pour qu'un
   échec soit lisible en une seconde plutôt qu'au milieu d'un log de build.

   ── L'effet de bord, et ce qu'on en fait ──────────────────────────────────

   Un blocage au build bloque le déploiement. C'est le prix de la garantie, et
   on ne peut pas l'annuler sans annuler la garantie : si un chiffre incohérent
   ne doit jamais atteindre la production, une construction qui en porte un
   doit échouer. Deux choses sont faisables, et sont faites ici.

   1. RENDRE LA PANNE RÉPARABLE EN UNE MINUTE. Chaque message nomme le fichier
      à ouvrir et les DEUX valeurs qui divergent, pas seulement la règle violée.
      C'est l'objet du type `Fault` ci-dessous, dont les quatre champs sont
      obligatoires. Une assertion qui dit « la série ne somme pas au total »
      oblige à rouvrir l'enquête ; une qui donne les deux montants et le
      fichier se corrige directement.

   2. LAISSER UNE PORTE DE SECOURS EXPLICITE. `EDOME_INVARIANTS=warn` rétrograde
      les violations en avertissements bruyants au lieu de les lever. Elle
      existe pour un cas et un seul : livrer un correctif urgent sans rapport
      pendant qu'une incohérence de données est encore ouverte.

      Une porte de secours vaut mieux qu'une règle affaiblie. Rendre ces
      contrôles non bloquants en production « pour ne pas gêner » reviendrait à
      les désactiver en silence le jour où ils servent — les chiffres qui se
      contredisaient étaient le défaut n°1 de l'audit, pas un détail de
      présentation. Là, il faut une variable d'environnement, elle laisse une
      trace dans le log de construction, et elle ne devient pas la norme sans
      que quelqu'un l'ait décidé.

   Voir aussi la section « Pourquoi mon build échoue » du README. */

/** Rétrograde les violations en avertissements. Voir le commentaire ci-dessus. */
const WARN_ONLY = process.env.EDOME_INVARIANTS === "warn";

interface Fault {
  /** Ce que la règle garantit, en une ligne. */
  rule: string;
  /** La valeur constatée, et celle attendue. Les deux, toujours. */
  found: string;
  expected: string;
  /** Le fichier à ouvrir, et ce qu'il faut y faire. */
  fix: string;
}

let violations = 0;

function assert(condition: boolean, n: number, fault: Fault): void {
  if (condition) return;
  violations++;

  const message = [
    ``,
    `  Invariant ${n} des données de démonstration — VIOLÉ`,
    `  ${fault.rule}`,
    ``,
    `      constaté : ${fault.found}`,
    `      attendu  : ${fault.expected}`,
    ``,
    `  À corriger dans : ${fault.fix}`,
    ``,
    `  Détail lisible en 0,2 s : npm run test:data`,
    `  Pourquoi ce build échoue : voir README, « Pourquoi mon build échoue »`,
    ``,
  ].join("\n");

  if (WARN_ONLY) {
    console.error(`\n[EDOME_INVARIANTS=warn] Violation TOLÉRÉE, chiffres incohérents en ligne :${message}`);
    return;
  }
  throw new Error(message);
}

/* Les douze cles "AAAA-MM" que la serie sait recevoir. Tout ce qui tombe a
   cote est ignore par monthly() — c'est l'objet de l'invariant 4. */
const monthKeys = new Set(
  last12Months().map((m) => `${m.year}-${String(m.month + 1).padStart(2, "0")}`),
);

const LEDGER_FILE = "src/lib/demo/ledger.ts";
const DERIVE_FILE = "src/lib/demo/derive.ts";

/* 1 — Aucun identifiant dupliqué. */
{
  const ids = LEDGER.map((e) => e.id);
  const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  assert(dupes.length === 0, 1, {
    rule: "Chaque écriture du journal porte un identifiant unique.",
    found: `${dupes.length} identifiant(s) en double : ${dupes.join(", ")}`,
    expected: "aucun doublon",
    fix: `${LEDGER_FILE} — renommer les écritures en double.`,
  });
}

/* 2 — Toute écriture porte sur un objet qui existe au catalogue. On ne peut
   donc plus facturer un produit inexistant, ce que faisaient deux des trois
   alertes boutique. */
for (const e of LEDGER) {
  if (e.subject.kind === "property") {
    assert(CATALOGUE.some((p) => p.id === e.subject.id), 2, {
      rule: "Toute écriture porte sur un bien qui existe au catalogue.",
      found: `écriture ${e.id} sur le bien « ${e.subject.id} », absent du catalogue`,
      expected: `un identifiant parmi : ${CATALOGUE.map((p) => p.id).join(", ")}`,
      fix: `${LEDGER_FILE} — corriger l'identifiant, ou ajouter le bien dans src/lib/mock-data.ts.`,
    });
  }
  if (e.subject.kind === "formation") {
    assert(FORMATIONS.some((f) => f.id === e.subject.id), 2, {
      rule: "Toute écriture porte sur une formation qui existe au catalogue.",
      found: `écriture ${e.id} sur la formation « ${e.subject.id} », absente du catalogue`,
      expected: `un identifiant parmi : ${FORMATIONS.map((f) => f.id).join(", ")}`,
      fix: `${LEDGER_FILE} — corriger l'identifiant, ou ajouter la formation dans src/lib/mock-data.ts.`,
    });
  }
}

/* 3 — Le montant d'un séjour vaut nuits × prix de la nuit du catalogue. Deux
   des trois biens affichaient auparavant un tarif qui ne correspondait pas à
   leur fiche, et l'un en avait même deux différents. */
for (const e of LEDGER) {
  if (!e.stay) continue;
  const price = CATALOGUE.find((p) => p.id === e.subject.id)!.price;
  assert(e.gross === e.stay.nights * price, 3, {
    rule: "Le montant d'un séjour vaut nuits × tarif de la fiche du bien.",
    found: `écriture ${e.id} : ${e.gross} CHF`,
    expected: `${e.stay.nights * price} CHF (${e.stay.nights} nuits × ${price} CHF, tarif de ${e.subject.id})`,
    fix: `${LEDGER_FILE} — le montant se calcule, il ne s'écrit pas. Corriger le nombre de nuits, ou le tarif de la fiche dans src/lib/mock-data.ts.`,
  });
}

/* 4 — Aucune écriture passée n'est silencieusement exclue de la série.

   `monthly()` répartit les écritures dans les douze mois de `last12Months()`,
   et laisse tomber sans bruit tout ce qui tombe à côté. C'est voulu pour les
   réservations à venir, que l'invariant 8 autorise jusqu'à trois mois après.
   Ça ne l'est pas pour une écriture passée mal datée : elle disparaîtrait de
   tous les totaux sans que rien ne le signale.

   NOTE — les versions précédentes des invariants 4 et 5 comparaient
   `monthly()` à `total()` et à `currentMonth()`. Ces deux fonctions sont
   DÉFINIES à partir de `monthly()` : les deux règles s'écrivaient `x === x` et
   ne pouvaient pas échouer. Elles donnaient une garantie qui n'existait pas.
   Les vraies vérifications de ce croisement sont dans `tests/data/`, où elles
   traversent les enveloppes `dashboard-data.ts` et `revenue-data.ts` — c'est
   ce passage-là qui peut diverger, pas le calcul. */
/* Bouclé PAR PROPRIÉTAIRE : une passe globale masquerait un montant qui fuit
   d'un profil vers un autre (la série d'un profil compenserait le trou d'un
   autre). Chaque profil doit balancer seul. */
{
  const today = DEMO_TODAY.toISOString().slice(0, 10);
  for (const profile of PROFILES) {
    const owner = profile.ownerId;
    const serie = monthly({ ownerId: owner }).reduce((s, m) => s + m.value, 0);
    const passees = entries({ ownerId: owner }).filter((e) => e.date <= today);
    const attendu = Math.round(passees.reduce((s, e) => s + e.gross, 0));
    const orphelines = passees.filter((e) => !monthKeys.has(e.date.slice(0, 7)));

    assert(serie === attendu, 4, {
      rule: "Toute écriture passée est comptée dans la série des douze mois (par propriétaire).",
      found: `profil ${owner} : série = ${serie} CHF`,
      expected: `${attendu} CHF — somme des ${passees.length} écritures de ${owner} jusqu'au ${today}`,
      fix:
        orphelines.length > 0
          ? `${LEDGER_FILE} — ${orphelines.length} écriture(s) de ${owner} hors de la fenêtre, donc ignorée(s) : ${orphelines.map((e) => `${e.id} (${e.date})`).join(", ")}`
          : `${DERIVE_FILE} — l'écart ne vient pas des dates ; vérifier l'arrondi de monthly().`,
    });
  }
}

/* 5 — La série couvre bien douze mois et se termine sur le mois courant, qui
   n'est pas vide. Un dernier mois à zéro afficherait « Revenus du mois : 0 »
   sous un badge de croissance ; une série décalée daterait tout l'écran d'un
   mois qui n'est pas celui de la démonstration. */
{
  const series = monthly();
  const last = series[series.length - 1]!;
  const attendu = MONTH_LABELS[DEMO_TODAY.getUTCMonth()];

  assert(series.length === 12 && last.label === attendu, 5, {
    rule: "La série couvre douze mois et se termine sur le mois de DEMO_TODAY.",
    found: `${series.length} points, finissant sur « ${last.label} » (${series.map((m) => m.label).join(" ")})`,
    expected: `12 points, finissant sur « ${attendu} »`,
    fix: `src/lib/demo/clock.ts — last12Months() a dérivé de DEMO_TODAY.`,
  });

  /* Le mois courant non vide, PAR PROFIL : un profil vide afficherait « 0 CHF »
     sous un badge de croissance. Une passe globale le masquerait derrière le
     revenu des autres profils. */
  for (const profile of PROFILES) {
    assert(currentMonth({ ownerId: profile.ownerId }) > 0, 5, {
      rule: "Le mois courant n'est pas vide (par propriétaire).",
      found: `profil ${profile.ownerId} : ${last.label} = 0 CHF`,
      expected: "un revenu strictement positif",
      fix: `${LEDGER_FILE} — le profil ${profile.ownerId} n'a aucune écriture sur le mois courant ; son écran afficherait 0 sous un badge de croissance.`,
    });
  }
}

/* 6 — La répartition par source somme au revenu du mois, PAR PROPRIÉTAIRE. */
for (const profile of PROFILES) {
  const owner = profile.ownerId;
  const parts = bySource(owner);
  const sum = parts.reduce((s, r) => s + r.value, 0);
  const mois = currentMonth({ ownerId: owner });
  assert(sum === mois, 6, {
    rule: "La répartition par source somme au revenu du mois (par propriétaire).",
    found: `profil ${owner} : ${sum} CHF réparti sur ${parts.length} sources (${parts.map((p) => `${p.source} ${p.value}`).join(", ")})`,
    expected: `${mois} CHF`,
    fix: `${DERIVE_FILE} — un écart signale une source absente de la liste de répartition. C'est ce qui masquait 2 590 CHF de « services ».`,
  });
}

/* 7 — Chaque bien possédé a une activité ATTRIBUÉE À SON PROPRIÉTAIRE. Un bien
   au tableau de bord sans aucune écriture afficherait un revenu nul sous un
   badge de croissance ; une écriture au mauvais propriétaire ferait fuir son
   revenu vers un autre profil. */
for (const profile of PROFILES) {
  for (const id of profile.ownedPropertyIds) {
    assert(LEDGER.some((e) => e.subject.id === id && e.ownerId === profile.ownerId), 7, {
      rule: "Chaque bien déclaré possédé a au moins une écriture au journal, à son propriétaire.",
      found: `le bien ${id} n'a aucune écriture attribuée à ${profile.ownerId}`,
      expected: "au moins une écriture du bon propriétaire",
      fix: `${LEDGER_FILE} — lui donner de l'activité (taguée du bon ownerId), ou le retirer de PROFILES dans src/lib/demo/identity.ts.`,
    });
  }
}

/* 8 — Aucune date hors de la fenêtre des douze mois qui précèdent le
   « aujourd'hui » de la démonstration, ni au-delà de trois mois après. Le mois
   courant variait de mars à juin selon l'écran, pour une date réelle en
   septembre. */
{
  const floor = new Date(DEMO_TODAY);
  floor.setUTCMonth(floor.getUTCMonth() - 12);
  const ceiling = new Date(DEMO_TODAY);
  ceiling.setUTCMonth(ceiling.getUTCMonth() + 3);
  const window = `${floor.toISOString().slice(0, 10)} → ${ceiling.toISOString().slice(0, 10)}`;

  for (const e of LEDGER) {
    const d = new Date(`${e.date}T12:00:00Z`);
    assert(d >= floor && d <= ceiling, 8, {
      rule: "Toute écriture tombe dans la fenêtre de la démonstration.",
      found: `écriture ${e.id} datée ${e.date}`,
      expected: `une date dans ${window}`,
      fix: `${LEDGER_FILE} — les dates dérivent de DEMO_TODAY (src/lib/demo/clock.ts) ; ne jamais en écrire une en dur.`,
    });
  }
}

/* 9 — Aucun montant négatif ni nul : une écriture sans montant n'a rien à
   faire dans un journal de revenus. */
for (const e of LEDGER) {
  assert(e.gross > 0, 9, {
    rule: "Toute écriture porte un montant strictement positif.",
    found: `écriture ${e.id} : ${e.gross} CHF`,
    expected: "un montant > 0",
    fix: `${LEDGER_FILE} — supprimer l'écriture, ou lui donner un montant.`,
  });
}

/* ── L'ANNUAIRE UNIQUE DES PERSONNES (Mission 2, étape 1) ────────────────────

   Le même garde-fou que pour l'argent et les biens, appliqué aux personnes :
   un seul enregistrement par id, et tout id référencé dans la donnée de démo
   résout à l'annuaire. C'est ce qui rend littéralement impossible d'écrire à
   nouveau « user-007 = deux personnes différentes selon l'écran ». */

const DIRECTORY_FILE = "src/lib/mock-data.ts";
const directoryIds = new Set(PEOPLE.map((p) => p.id));

/** Un id référencé est valide s'il est à l'annuaire, ou s'il s'agit du compte
    officiel de la plateforme (qui n'est pas une personne réelle). */
function resolves(id: string): boolean {
  return id === PLATFORM_ACCOUNT_ID || directoryIds.has(id);
}

/* 10 — Aucun id dupliqué dans l'annuaire. Le doublon « user-007 » à deux
   identités devient impossible à écrire, pas seulement découragé. */
{
  const ids = PEOPLE.map((p) => p.id);
  const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  assert(dupes.length === 0, 10, {
    rule: "Chaque personne de l'annuaire porte un identifiant unique.",
    found: `${dupes.length} identifiant(s) en double : ${dupes.join(", ")}`,
    expected: "aucun doublon",
    fix: `${DIRECTORY_FILE} — deux entrées de users[] partagent un id.`,
  });
}

/* 11 — Tout id de personne référencé dans la donnée de démo résout à
   l'annuaire (auteurs et commentateurs du fil, suggestions « qui suivre »,
   participants et membres de conversation, auteurs d'avis). Le compte « edome »
   est exempté. Un id fantôme comme « u1 » — qui menait à « Profil introuvable »
   depuis le fil — casse désormais le build.

   PÉRIMÈTRE : ne sont énumérées que les données importables à l'import (le fil
   `demo/posts`, et `conversations`/`mockReviews` de `mock-data`). Les
   conversations LOCALES de la page /messages vivent dans un composant et ne
   sont pas énumérables ici ; leurs ids sont garantis par `requirePerson` au
   chargement de ce module-là (voir src/app/(app)/messages/page.tsx). */
{
  type Ref = { id: string; where: string };
  const refs: Ref[] = [];

  for (const post of VIDEO_POSTS) {
    refs.push({ id: post.author.id, where: `auteur du post ${post.id}` });
    for (const c of post.comments) {
      refs.push({ id: c.author.id, where: `commentaire ${c.id}` });
    }
  }
  for (const s of SUGGESTIONS) {
    refs.push({ id: s.id, where: "suggestion « qui suivre »" });
  }
  for (const conv of conversations) {
    refs.push({ id: conv.participant.id, where: `participant de ${conv.id}` });
    for (const m of conv.members ?? []) {
      refs.push({ id: m.id, where: `membre de ${conv.id}` });
    }
  }
  for (const r of mockReviews) {
    refs.push({ id: r.author.id, where: `auteur de l'avis ${r.id}` });
  }

  const orphans = refs.filter((r) => !resolves(r.id));
  assert(orphans.length === 0, 11, {
    rule: "Tout id de personne référencé résout à l'annuaire (ou est « edome »).",
    found:
      orphans.length > 0
        ? `${orphans.length} référence(s) fantôme(s) : ${orphans.map((o) => `${o.id} (${o.where})`).join(", ")}`
        : "aucune",
    expected: `un id parmi l'annuaire (${PEOPLE.length} personnes) ou « ${PLATFORM_ACCOUNT_ID} »`,
    fix: `src/lib/demo/posts.ts / ${DIRECTORY_FILE} — remplacer l'id inventé par un vrai id de users[] (requirePerson).`,
  });
}

/* 12 — Toute clé d'enrichissement de profil-data existe à l'annuaire : un seed
   ne peut pas décrire quelqu'un qui n'a pas de ligne d'annuaire. */
for (const id of PUBLIC_SEED_IDS) {
  assert(resolves(id), 12, {
    rule: "Tout enrichissement de profil porte sur une personne de l'annuaire.",
    found: `l'enrichissement « ${id} » ne correspond à aucune personne`,
    expected: `un id parmi l'annuaire (${PEOPLE.length} personnes)`,
    fix: "src/lib/profile-data.ts — aligner la clé de PUBLIC_SEEDS sur un vrai id de users[].",
  });
}

/* ── L'ARGENT PAR PROFIL (Mission 2, étape 2) ───────────────────────────────

   Le pendant, pour l'argent, de l'annuaire unique : un montant ne peut plus
   flotter sans propriétaire connu, ni glisser d'un profil à l'autre. */

const PROFILE_IDS = new Set<string>(PROFILES.map((p) => p.ownerId));

/* 13 — Aucune écriture n'est attribuée à un propriétaire inconnu de PROFILES.
   Sans ça, une écriture au mauvais `ownerId` disparaîtrait de tous les totaux
   (aucun profil ne la revendique) sans que rien ne le signale — exactement le
   type de montant fantôme que le journal doit rendre impossible. */
{
  const orphelines = LEDGER.filter((e) => !PROFILE_IDS.has(e.ownerId));
  assert(orphelines.length === 0, 13, {
    rule: "Toute écriture est attribuée à un propriétaire connu de PROFILES.",
    found:
      orphelines.length > 0
        ? `${orphelines.length} écriture(s) orpheline(s) : ${orphelines.map((e) => `${e.id} (ownerId « ${e.ownerId} »)`).join(", ")}`
        : "aucune",
    expected: `un ownerId parmi PROFILES (${[...PROFILE_IDS].join(", ")})`,
    fix: `${LEDGER_FILE} — tagger l'écriture d'un ownerId de PROFILES, ou ajouter le profil dans src/lib/demo/identity.ts.`,
  });
}

/* 14 — Le volume d'agence (source « vente ») n'est JAMAIS commissionnable.
   C'est ce qui garantit qu'un futur écran ne pourra pas sommer par erreur ces
   millions dans le revenu d'E-Dome : `derive.ts` exclut `commissionable:
   false`, et cette règle lie la source à ce drapeau. */
for (const e of LEDGER) {
  if (e.source !== "vente") continue;
  assert(e.commissionable === false, 14, {
    rule: "Une écriture « vente » (GMV agence) porte toujours commissionable: false.",
    found: `écriture ${e.id} : source « vente », commissionable = ${String(e.commissionable)}`,
    expected: "commissionable: false — la vente immobilière n'est pas facturée par E-Dome",
    fix: `${LEDGER_FILE} — marquer l'écriture commissionable: false, ou changer sa source.`,
  });
}

if (WARN_ONLY && violations > 0) {
  console.error(
    `\n[EDOME_INVARIANTS=warn] ${violations} violation(s) tolérée(s). ` +
      `Les chiffres affichés se contredisent. Retirer cette variable dès que le correctif est livré.\n`,
  );
}

export const INVARIANTS_CHECKED = true;
