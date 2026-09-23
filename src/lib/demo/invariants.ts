import { properties as CATALOGUE, formations as FORMATIONS } from "@/lib/mock-data";
import { DEMO_TODAY } from "./clock";
import { bySource, currentMonth, monthly, total } from "./derive";
import { LEDGER } from "./ledger";
import { OWNED_PROPERTY_IDS } from "./identity";

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
   échec soit lisible en une seconde plutôt qu'au milieu d'un log de build. */

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`[journal de démonstration] ${message}`);
}

/* 1 — Aucun identifiant dupliqué. */
{
  const ids = LEDGER.map((e) => e.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert(dupes.length === 0, `identifiants dupliqués : ${[...new Set(dupes)].join(", ")}`);
}

/* 2 — Toute écriture porte sur un objet qui existe au catalogue. On ne peut
   donc plus facturer un produit inexistant, ce que faisaient deux des trois
   alertes boutique. */
for (const e of LEDGER) {
  if (e.subject.kind === "property") {
    assert(
      CATALOGUE.some((p) => p.id === e.subject.id),
      `écriture ${e.id} sur un bien absent du catalogue : ${e.subject.id}`,
    );
  }
  if (e.subject.kind === "formation") {
    assert(
      FORMATIONS.some((f) => f.id === e.subject.id),
      `écriture ${e.id} sur une formation absente du catalogue : ${e.subject.id}`,
    );
  }
}

/* 3 — Le montant d'un séjour vaut nuits × prix de la nuit du catalogue. Deux
   des trois biens affichaient auparavant un tarif qui ne correspondait pas à
   leur fiche, et l'un en avait même deux différents. */
for (const e of LEDGER) {
  if (!e.stay) continue;
  const price = CATALOGUE.find((p) => p.id === e.subject.id)!.price;
  assert(
    e.gross === e.stay.nights * price,
    `séjour ${e.id} : ${e.gross} au lieu de ${e.stay.nights} × ${price}`,
  );
}

/* 4 — La somme de la série mensuelle égale le total. */
assert(
  monthly().reduce((s, m) => s + m.value, 0) === total(),
  "la série mensuelle ne somme pas au total",
);

/* 5 — Le revenu du mois courant égale la dernière valeur de la série. C'est
   précisément ce qui manquait : 24 850 pour le mois contre une série dont la
   dernière valeur valait aussi 24 850, mais pour les biens seuls. */
{
  const series = monthly();
  assert(
    series[series.length - 1]!.value === currentMonth(),
    `dernier mois de la série (${series[series.length - 1]!.value}) ≠ mois courant (${currentMonth()})`,
  );
}

/* 6 — La répartition par source somme au revenu du mois. */
{
  const sum = bySource().reduce((s, r) => s + r.value, 0);
  assert(
    sum === currentMonth(),
    `répartition par source (${sum}) ≠ revenu du mois (${currentMonth()})`,
  );
}

/* 7 — Chaque bien possédé a une activité. Un bien au tableau de bord sans
   aucune écriture afficherait un revenu nul sous un badge de croissance. */
for (const id of OWNED_PROPERTY_IDS) {
  assert(
    LEDGER.some((e) => e.subject.id === id),
    `le bien ${id} est déclaré possédé mais n'a aucune écriture`,
  );
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

  for (const e of LEDGER) {
    const d = new Date(`${e.date}T12:00:00Z`);
    assert(
      d >= floor && d <= ceiling,
      `écriture ${e.id} datée ${e.date}, hors de la fenêtre de démonstration`,
    );
  }
}

/* 9 — Aucun montant négatif ni nul : une écriture sans montant n'a rien à
   faire dans un journal de revenus. */
for (const e of LEDGER) {
  assert(e.gross > 0, `écriture ${e.id} sans montant positif : ${e.gross}`);
}

export const INVARIANTS_CHECKED = true;
