import {
  properties as CATALOGUE,
  formations as FORMATIONS,
  users as PEOPLE,
  conversations,
  mockReviews,
} from "@/lib/mock-data";
import { DEMO_TODAY, MONTH_LABELS, last12Months } from "./clock";
import { bySource, currentMonth, entries, monthly, total, gmvVolume } from "./derive";
import { LEDGER } from "./ledger";
import { PROFILES, CURRENT_USER_ID } from "./identity";
import { PLATFORM_ACCOUNT_ID } from "./directory";
import { FOLLOWS, followersOf, followingOf } from "./social";
import { AGENCY_MEMBERS, MANDATE_TRACKING, agencyProperties } from "./agency";
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
     revenu des autres profils. S'applique aux profils à activité RÉCURRENTE
     (biens en courte durée, formations) : un photographe qui n'a pas facturé
     ce mois-ci n'a pas de tableau de revenus mensuel à remplir. */
  for (const profile of PROFILES) {
    if (profile.ownedPropertyIds.length === 0 && profile.ownedFormationIds.length === 0) continue;
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
  /* Même garde pour les mandats de vente : un mandat déclaré sans écriture GMV
     afficherait un volume d'affaires vide. */
  for (const id of profile.agencySalePropertyIds ?? []) {
    assert(
      LEDGER.some((e) => e.subject.id === id && e.ownerId === profile.ownerId && e.source === "vente"),
      7,
      {
        rule: "Chaque mandat de vente déclaré a au moins une écriture GMV, à son propriétaire.",
        found: `le mandat ${id} n'a aucune écriture « vente » attribuée à ${profile.ownerId}`,
        expected: "au moins une écriture GMV du bon propriétaire",
        fix: `${LEDGER_FILE} — générer son écriture « vente », ou le retirer d'agencySalePropertyIds dans src/lib/demo/identity.ts.`,
      },
    );
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
    refs.push({ id: r.recipientId, where: `destinataire de l'avis ${r.id}` });
  }
  for (const m of AGENCY_MEMBERS) {
    refs.push({ id: m.accountId, where: "membre de l'agence de démonstration" });
  }
  for (const p of CATALOGUE) {
    refs.push({ id: p.host.id, where: `hôte du bien ${p.id}` });
    if (p.soldTo) refs.push({ id: p.soldTo, where: `acheteur du bien ${p.id}` });
  }
  for (const prof of PROFILES) {
    for (const s of prof.serviceSales ?? []) refs.push({ id: s.clientId, where: `client de la prestation ${s.id}` });
  }
  /* Le suivi des mandats de l'agence désigne exactement ses biens en vente. */
  {
    const saleIds = agencyProperties().filter((p) => p.transactionType === "vente").map((p) => p.id).sort();
    const tracked = Object.keys(MANDATE_TRACKING).sort();
    assert(saleIds.join(",") === tracked.join(","), 11, {
      rule: "Le suivi des mandats de l'agence porte exactement sur ses biens en vente.",
      found: `suivi : ${tracked.join(", ")}`,
      expected: `biens en vente de l'agence : ${saleIds.join(", ")}`,
      fix: "src/lib/demo/agency.ts — aligner MANDATE_TRACKING sur les biens en vente des membres.",
    });
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

/* 15 — Les stats des SEIZE personnes concordent avec le journal et les avis.

   Le cœur de l'audit — « aucun nombre divergent » — appliqué à TOUTE
   l'annuaire, plus seulement aux trois premiers profils :
     · biens        = biens hébergés au catalogue ;
     · avis / note  = avis réellement reçus (`recipientId`), note arrondie au
                      dixième ;
     · transactions = écritures non annulées du journal (0 pour une personne
                      absente de PROFILES : elle n'a rien vendu) ;
     · revenu       = revenu COMMISSIONNABLE du journal. Le volume de mandats
                      de vente (GMV) reste un volume, jamais un revenu (D4).
   L'utilisateur courant garde un `revenue` neutralisé à 0 (son tableau de
   bord affiche le revenu dérivé) — garde-fou couvert par tests/data (« 16 »). */
{
  const round1 = (n: number) => Math.round(n * 10) / 10;
  for (const profile of PROFILES) {
    assert(PEOPLE.some((p) => p.id === profile.ownerId), 15, {
      rule: "Tout profil porteur de montants a une ligne d'annuaire.",
      found: `le profil ${profile.ownerId} n'existe pas dans users[]`,
      expected: "une personne de l'annuaire",
      fix: `${DIRECTORY_FILE} — ajouter la personne, ou retirer le profil de PROFILES.`,
    });
  }
  for (const person of PEOPLE) {
    const id = person.id;
    const hostCount = CATALOGUE.filter((p) => p.host.id === id).length;
    const activity = LEDGER.filter((e) => e.ownerId === id && e.status !== "cancelled").length;
    const revenue = id === CURRENT_USER_ID ? 0 : Math.round(total({ ownerId: id }));
    const revs = mockReviews.filter((r) => r.recipientId === id);
    const rating = revs.length ? round1(revs.reduce((s, r) => s + r.rating, 0) / revs.length) : 0;

    assert(person.stats.properties === hostCount, 15, {
      rule: "Le nombre de biens annoncé égale les biens hébergés au catalogue.",
      found: `${id} : stats.properties = ${person.stats.properties}`,
      expected: `${hostCount} bien(s) hébergé(s) au catalogue`,
      fix: `${DIRECTORY_FILE} — stats.properties est dérivé par stampDerivedStats() ; vérifier l'attribution host des biens.`,
    });
    assert(person.stats.transactions === activity, 15, {
      rule: "Le nombre de transactions annoncé égale les écritures non annulées du journal.",
      found: `${id} : stats.transactions = ${person.stats.transactions}`,
      expected: `${activity} écriture(s) au journal`,
      fix: `${DIRECTORY_FILE} — aligner stats.transactions sur le journal (écritures non annulées de l'owner).`,
    });
    assert(person.stats.revenue === revenue, 15, {
      rule: "Le revenu annoncé égale le revenu commissionnable du journal (le GMV reste un volume).",
      found: `${id} : stats.revenue = ${person.stats.revenue}`,
      expected: `${revenue} CHF (total commissionnable ; GMV = ${Math.round(gmvVolume(id))} CHF, hors revenu)`,
      fix: `${DIRECTORY_FILE} — aligner stats.revenue sur derive.total({ ownerId }).`,
    });
    assert(person.stats.reviews === revs.length, 15, {
      rule: "Le nombre d'avis annoncé égale les avis réellement reçus.",
      found: `${id} : stats.reviews = ${person.stats.reviews}`,
      expected: `${revs.length} avis reçus`,
      fix: `${DIRECTORY_FILE} — stats.reviews est dérivé de mockReviews (recipientId).`,
    });
    assert(person.stats.rating === rating, 15, {
      rule: "La note annoncée égale la moyenne des avis reçus (arrondie au dixième).",
      found: `${id} : stats.rating = ${person.stats.rating}`,
      expected: `${rating} (moyenne de ${revs.length} avis)`,
      fix: `${DIRECTORY_FILE} — stats.rating est dérivé de mockReviews (recipientId).`,
    });
  }
}

/* 16 — Abonnés et suivis concordent avec le graphe FOLLOWS.

   « Abonnés » affichait l'annuaire entier, et chaque fiche portait un nombre
   écrit à la main (3 100, 5 620, 8 900). Désormais : abonnés = relations
   entrantes, suivis = relations sortantes, pour les seize — et le graphe ne
   contient que des personnes de l'annuaire, sans doublon ni auto-suivi. */
{
  const SOCIAL_FILE = "src/lib/demo/social.ts";
  const seen = new Set<string>();
  for (const e of FOLLOWS) {
    const key = `${e.from}→${e.to}`;
    assert(directoryIds.has(e.from) && directoryIds.has(e.to), 16, {
      rule: "Toute relation de suivi relie deux personnes de l'annuaire.",
      found: `relation ${key}`,
      expected: "deux ids de users[]",
      fix: `${SOCIAL_FILE} — remplacer l'id inconnu.`,
    });
    assert(e.from !== e.to, 16, {
      rule: "Personne ne se suit soi-même.",
      found: `relation ${key}`,
      expected: "deux personnes distinctes",
      fix: `${SOCIAL_FILE} — retirer la relation.`,
    });
    assert(!seen.has(key), 16, {
      rule: "Une relation de suivi n'apparaît qu'une fois.",
      found: `relation ${key} en double`,
      expected: "aucun doublon",
      fix: `${SOCIAL_FILE} — retirer le doublon.`,
    });
    seen.add(key);
  }
  for (const person of PEOPLE) {
    const followers = followersOf(person.id).length;
    const following = followingOf(person.id).length;
    assert(person.stats.followers === followers && person.stats.following === following, 16, {
      rule: "Abonnés et suivis égalent les relations entrantes et sortantes du graphe FOLLOWS.",
      found: `${person.id} : ${person.stats.followers} abonné(s), ${person.stats.following} suivi(s)`,
      expected: `${followers} abonné(s), ${following} suivi(s) d'après ${SOCIAL_FILE}`,
      fix: `${DIRECTORY_FILE} — les compteurs se dérivent du graphe (stampDerivedStats) ; ne pas les écrire.`,
    });
    /* Un réseau qui se lance : quelques abonnés, une quinzaine au plus. */
    assert(followers <= 15, 16, {
      rule: "Un réseau qui se lance : une quinzaine d'abonnés au plus.",
      found: `${person.id} : ${followers} abonnés`,
      expected: "≤ 15",
      fix: `${SOCIAL_FILE} — retirer des relations entrantes.`,
    });
  }
}

/* 17 — Chaque bien est exploité selon ce qu'il est, par la bonne personne.

   · un bien en courte durée est exploité par son hôte (`ownedPropertyIds`),
     sans quoi il n'aurait aucune écriture et son hôte un revenu faux ;
   · un bien en longue durée d'un profil est déclaré `longTermPropertyIds` ;
   · un mandat conclu (`agencySalePropertyIds`) est un bien EN VENTE, VENDU
     (`soldTo`, une personne de l'annuaire), et réciproquement : un bien vendu
     est le mandat conclu de son hôte. Un bien vendu ne peut donc plus
     s'afficher « à vendre » sans écriture de volume, ni l'inverse. */
{
  const ownerOf = new Map(PROFILES.map((p) => [p.ownerId, p]));
  for (const p of CATALOGUE) {
    const prof = ownerOf.get(p.host.id);
    if (p.transactionType === "location-ct") {
      assert(!!prof && prof.ownedPropertyIds.includes(p.id), 17, {
        rule: "Un bien en courte durée est exploité par son hôte (ownedPropertyIds).",
        found: `${p.id} (courte durée, hôte ${p.host.id}) absent des biens exploités de son hôte`,
        expected: `${p.id} dans PROFILES[${p.host.id}].ownedPropertyIds`,
        fix: "src/lib/demo/identity.ts — déclarer le bien dans ownedPropertyIds de son hôte (et un plan d'occupation dans ledger.ts).",
      });
    }
    if (p.soldTo) {
      assert(directoryIds.has(p.soldTo) && p.soldTo !== p.host.id && p.transactionType === "vente", 17, {
        rule: "Un bien vendu est un bien en vente, acheté par une autre personne de l'annuaire.",
        found: `${p.id} : soldTo « ${p.soldTo} », hôte ${p.host.id}, ${p.transactionType}`,
        expected: "un acheteur de l'annuaire, distinct de l'hôte, sur un bien en vente",
        fix: `${DIRECTORY_FILE} — corriger soldTo.`,
      });
      assert(!!prof && (prof.agencySalePropertyIds ?? []).includes(p.id), 17, {
        rule: "Un bien vendu est le mandat conclu de son hôte (écriture de volume au journal).",
        found: `${p.id} vendu, absent de agencySalePropertyIds de ${p.host.id}`,
        expected: `${p.id} dans PROFILES[${p.host.id}].agencySalePropertyIds`,
        fix: "src/lib/demo/identity.ts — déclarer le mandat conclu.",
      });
    }
  }
  for (const prof of PROFILES) {
    for (const id of prof.ownedPropertyIds) {
      const p = CATALOGUE.find((x) => x.id === id);
      assert(!!p && p.host.id === prof.ownerId && p.transactionType === "location-ct", 17, {
        rule: "Un bien exploité en courte durée est hébergé par son exploitant et loué à la nuit.",
        found: `${prof.ownerId} exploite ${id} (${p ? `hôte ${p.host.id}, ${p.transactionType}` : "absent du catalogue"})`,
        expected: "hôte = exploitant, location-ct",
        fix: "src/lib/demo/identity.ts / src/lib/mock-data.ts — aligner host et transactionType.",
      });
    }
    for (const id of prof.longTermPropertyIds ?? []) {
      const p = CATALOGUE.find((x) => x.id === id);
      assert(!!p && p.host.id === prof.ownerId && p.transactionType === "location-lt", 17, {
        rule: "Un bien loué en longue durée est hébergé par son bailleur et loué au mois.",
        found: `${prof.ownerId} loue ${id} (${p ? `hôte ${p.host.id}, ${p.transactionType}` : "absent du catalogue"})`,
        expected: "hôte = bailleur, location-lt",
        fix: "src/lib/demo/identity.ts / src/lib/mock-data.ts — aligner host et transactionType.",
      });
    }
    for (const id of prof.agencySalePropertyIds ?? []) {
      const p = CATALOGUE.find((x) => x.id === id);
      assert(!!p && p.host.id === prof.ownerId && !!p.soldTo, 17, {
        rule: "Un mandat conclu est un bien de son hôte, marqué vendu (soldTo).",
        found: `${prof.ownerId} : mandat ${id} (${p ? `hôte ${p.host.id}, soldTo ${String(p.soldTo)}` : "absent du catalogue"})`,
        expected: "hôte = mandataire, soldTo renseigné",
        fix: `${DIRECTORY_FILE} — renseigner soldTo sur le bien.`,
      });
    }
  }
}

/* 18 — Chaque avis se rattache à ce que son auteur a réellement acheté.

   Un avis de séjour exige un séjour à son nom au journal ; un avis d'achat,
   que l'auteur soit l'acheteur (`soldTo`) ; un avis de formation, une
   inscription à son nom ; un avis de prestation, une prestation dont il est
   le client (ou, dans l'autre sens, le prestataire). Toujours AVANT la date de
   l'avis, et jamais sur soi-même. */
{
  const REVIEWS_FILE = "src/lib/mock-data.ts (mockReviews)";
  const nameOf = (id: string) => {
    const p = PEOPLE.find((u) => u.id === id);
    return p ? `${p.firstName} ${p.lastName}` : `?${id}`;
  };
  const saleOf = new Map(PROFILES.flatMap((p) => (p.serviceSales ?? []).map((s) => [s.id, { ...s, providerId: p.ownerId }] as const)));
  for (const r of mockReviews) {
    const day = r.createdAt.slice(0, 10);
    const author = r.author.id;
    assert(directoryIds.has(r.recipientId) && author !== r.recipientId, 18, {
      rule: "Un avis est reçu par une personne de l'annuaire, distincte de son auteur.",
      found: `avis ${r.id} : ${author} → ${r.recipientId}`,
      expected: "deux personnes distinctes de l'annuaire",
      fix: `${REVIEWS_FILE} — corriger l'avis.`,
    });
    let anchored = false;
    let expected = "";
    if (r.subject.kind === "property") {
      const p = CATALOGUE.find((x) => x.id === r.subject.id);
      if (p?.soldTo) {
        const gmv = LEDGER.find((e) => e.source === "vente" && e.subject.id === p.id);
        anchored = p.soldTo === author && !!gmv && gmv.date <= day && r.recipientId === p.host.id;
        expected = `l'acheteur ${p.soldTo}, après la vente (${gmv?.date ?? "sans écriture"})`;
      } else if (p && p.transactionType === "location-ct") {
        anchored =
          r.recipientId === p.host.id &&
          LEDGER.some((e) => e.subject.id === p.id && !!e.stay && e.counterparty === nameOf(author) && e.date <= day);
        expected = `un séjour au nom de ${nameOf(author)} sur ${p.id}, avant le ${day}`;
      } else {
        expected = "un bien en courte durée ou vendu";
      }
    } else if (r.subject.kind === "formation") {
      const f = FORMATIONS.find((x) => x.id === r.subject.id);
      anchored =
        !!f &&
        f.instructor.id === r.recipientId &&
        LEDGER.some((e) => e.source === "formations" && e.subject.id === f.id && e.counterparty === nameOf(author) && e.date <= day);
      expected = `une inscription au nom de ${nameOf(author)} à ${r.subject.id}, avant le ${day}`;
    } else {
      const sale = saleOf.get(r.subject.id);
      const entry = LEDGER.find((e) => e.id === r.subject.id && e.source === "services");
      anchored =
        !!sale &&
        !!entry &&
        entry.date <= day &&
        ((author === sale.clientId && r.recipientId === sale.providerId) ||
          (author === sale.providerId && r.recipientId === sale.clientId));
      expected = sale
        ? `client ${sale.clientId} ↔ prestataire ${sale.providerId}, après le ${entry?.date ?? "?"}`
        : `une prestation « ${r.subject.id} » au journal`;
    }
    assert(anchored, 18, {
      rule: "Tout avis se rattache à un achat, un séjour, une inscription ou une prestation réels, antérieurs à l'avis.",
      found: `avis ${r.id} de ${author} sur ${r.subject.kind} ${r.subject.id}`,
      expected,
      fix: `${REVIEWS_FILE} / ${LEDGER_FILE} — rattacher l'avis à une écriture réelle (NAMED_GUESTS, NAMED_STUDENTS, serviceSales), ou le retirer.`,
    });
  }
}

/* 19 — Une formation est vendue par son formateur, et son nombre d'élèves
   égale ses inscriptions au journal. Le catalogue annonçait 342 élèves pour
   une formation qui en vendait quarante. */
for (const f of FORMATIONS) {
  const owner = PROFILES.find((p) => p.ownedFormationIds.includes(f.id));
  assert(!!owner && owner.ownerId === f.instructor.id, 19, {
    rule: "Une formation est déclarée par son formateur dans PROFILES.",
    found: `${f.id} : formateur ${f.instructor.id}, déclarée par ${owner?.ownerId ?? "personne"}`,
    expected: `${f.id} dans PROFILES[${f.instructor.id}].ownedFormationIds`,
    fix: "src/lib/demo/identity.ts — déclarer la formation chez son formateur.",
  });
  const sales = LEDGER.filter((e) => e.source === "formations" && e.subject.id === f.id && e.status !== "cancelled").length;
  assert(f.studentCount === sales, 19, {
    rule: "Le nombre d'élèves d'une formation égale ses inscriptions au journal.",
    found: `${f.id} : studentCount = ${f.studentCount}`,
    expected: `${sales} inscription(s) au journal`,
    fix: `${DIRECTORY_FILE} — aligner studentCount sur le plan d'inscriptions (FORMATION_SALES, ${LEDGER_FILE}).`,
  });
}

if (WARN_ONLY && violations > 0) {
  console.error(
    `\n[EDOME_INVARIANTS=warn] ${violations} violation(s) tolérée(s). ` +
      `Les chiffres affichés se contredisent. Retirer cette variable dès que le correctif est livré.\n`,
  );
}

export const INVARIANTS_CHECKED = true;
