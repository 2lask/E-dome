import type { Property, TransactionType } from "@/lib/types";
import { roomsOf } from "@/lib/explore/listing";

/* ── La recherche tokenisée (chantier P6b) ──────────────────────────────────

   « 3 pièces Lausanne moins de 2500 », « chalet Verbier » : la requête libre
   est découpée en FILTRES — ville (lue dans les données), pièces, chambres,
   budget, type de bien, type de transaction. Chaque filtre devient une puce
   que l'on peut retirer ; les mots inconnus sont ignorés par les filtres.

   Fonctions pures, sans React ni navigateur : `tests/data/p6b-poles.test.ts`.
   Les libellés lisibles des puces vivent dans `src/content/recherche.ts`. */

export type TokenKind = "city" | "rooms" | "bedrooms" | "priceMax" | "priceMin" | "transaction" | "type";

export interface QueryToken {
  /** Unique dans une requête : sert de clé et à retirer la puce. */
  id: string;
  kind: TokenKind;
  /** Texte canonique de la puce, réinjecté dans la requête si on retire une AUTRE puce. */
  text: string;
  /** Valeur structurée. */
  value: string | number;
}

export type BienKind = "appartement" | "studio" | "maison" | "chalet" | "riad" | "penthouse" | "terrain";

export interface SearchFilters {
  transaction?: TransactionType;
  /** La transaction n'est pas écrite : elle est déduite du montant du budget. */
  transactionInferred?: boolean;
  /** Noms de ville tels qu'écrits dans les données. */
  cities: string[];
  /** Nombre de pièces demandé. */
  rooms?: number;
  /** « 3,5 pièces » : exact. « 3 pièces » : 3 ou 3,5. */
  roomsExact?: boolean;
  bedroomsMin?: number;
  kinds: BienKind[];
  priceMax?: number;
  priceMin?: number;
}

export interface ParsedQuery {
  tokens: QueryToken[];
  filters: SearchFilters;
  /** Mots non reconnus (hors mots vides) — ignorés par les filtres. */
  free: string[];
}

// ─── Normalisation ───────────────────────────────────────────────────────────

/** Minuscules, sans accents, apostrophes et tirets en espaces. */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/(\d)'(?=\d{3}\b)/g, "$1") // 2'500 → 2500
    .replace(/(\d)[\s  ](?=\d{3}\b)/g, "$1") // 2 500 → 2500
    .replace(/(\d),(?=\d{3}\b)/g, "$1") // 2,500 → 2500
    .replace(/(\d),(\d)/g, "$1.$2") // 3,5 → 3.5
    .replace(/['\-–—/]/g, " ")
    .replace(/[^\p{L}\p{N}.<>=+\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Les règles de reconnaissance ────────────────────────────────────────────

const TRANSACTION_RULES: { re: RegExp; value: TransactionType; text: string }[] = [
  { re: /\b(?:location )?(?:courte duree|court sejour|courts sejours|vacances?|sejours?|nuitees?|nuits?|week end|weekend)\b/, value: "location-ct", text: "vacances" },
  { re: /\b(?:a louer|louer|location(?: longue duree)?|longue duree|loyer|locataire|bail)\b/, value: "location-lt", text: "à louer" },
  { re: /\b(?:a vendre|acheter|achat|acquerir|vente|vendre|investir|investissement)\b/, value: "vente", text: "à acheter" },
];

const KIND_RULES: { re: RegExp; value: BienKind; text: string }[] = [
  { re: /\b(?:appartements?|apparts?|appts?)\b/, value: "appartement", text: "appartement" },
  { re: /\bstudios?\b/, value: "studio", text: "studio" },
  { re: /\b(?:maisons?|villas?)\b/, value: "maison", text: "maison" },
  { re: /\bchalets?\b/, value: "chalet", text: "chalet" },
  { re: /\briads?\b/, value: "riad", text: "riad" },
  { re: /\b(?:penthouses?|attiques?)\b/, value: "penthouse", text: "attique" },
  { re: /\bterrains?\b/, value: "terrain", text: "terrain" },
];

const NUM = String.raw`(\d+(?:\.\d+)?)\s*(k|m|mio|millions?|mios?)?\b`;
const CURRENCY = String.raw`(?:\s*(?:chf|fr|frs|francs|\.\s*))?`;
const PRICE_MAX = new RegExp(String.raw`(?:moins de|max(?:imum)?|jusqu ?a|<=?|sous|budget(?: de)?|au plus|pas plus de)\s*` + NUM + CURRENCY);
const PRICE_MIN = new RegExp(String.raw`(?:plus de|min(?:imum)?|>=?|des|a partir de|au moins)\s*` + NUM + CURRENCY);
const ROOMS = /\b(\d+(?:\.5)?)\s*(?:pieces?|pces?|pc|p)\b\.?/;
const BEDROOMS = /\b(\d+)\s*(?:chambres?|ch)\b\.?/;
const BARE_PRICE = new RegExp(String.raw`\b` + NUM + String.raw`\s*(?:chf|fr|frs|francs)\b`);
const BARE_NUMBER = /\b(\d{3,})\b/;
/** Une surface (« 80 m2 ») : absorbée pour ne pas être lue comme un budget. */
const AREA = /\b\d+\s*(?:m2|m²|mc|metres? carres?)(?![\p{L}\p{N}])/u;

const STOPWORDS = new Set([
  "a", "au", "aux", "avec", "dans", "de", "des", "du", "en", "et", "la", "le", "les", "l", "d", "un", "une",
  "pour", "par", "sur", "pres", "proche", "vers", "ou", "chf", "fr", "francs", "je", "cherche", "recherche",
]);

function amount(n: string, unit?: string): number {
  const v = Number(n);
  if (!unit) return Math.round(v);
  if (unit === "k") return Math.round(v * 1000);
  return Math.round(v * 1_000_000);
}

/** Les alias d'une ville : son nom complet, et sa tête avant « -les- » (Yverdon, Évian). */
function cityAliases(city: string): string[] {
  const full = normalize(city);
  const out = new Set([full]);
  const head = full.split(" les ")[0];
  if (head && head !== full) out.add(head);
  if (full === "geneve") { out.add("genf"); out.add("geneva"); }
  return [...out];
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Seuils de déduction : sous 1 000 CHF on parle d'une nuit, sous 20 000 d'un loyer, au-delà d'un achat. */
export const NIGHTLY_BELOW = 1000;
export const MONTHLY_BELOW = 20000;

export function inferTransaction(amountChf: number): TransactionType {
  return amountChf < NIGHTLY_BELOW ? "location-ct" : amountChf < MONTHLY_BELOW ? "location-lt" : "vente";
}

const groupInt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");

/**
 * Découpe une requête libre en filtres. `cities` : les noms de ville connus
 * (catalogue + biens publiés pendant la session).
 */
export function parseQuery(query: string, cities: readonly string[]): ParsedQuery {
  let s = ` ${normalize(query)} `;
  const tokens: QueryToken[] = [];
  const filters: SearchFilters = { cities: [], kinds: [] };
  const consume = (m: RegExpMatchArray) => {
    s = s.slice(0, m.index!) + " " + s.slice(m.index! + m[0].length);
  };

  // Villes — les noms les plus longs d'abord (« yverdon les bains » avant « yverdon »).
  const aliases = [...new Set(cities)]
    .flatMap((city) => cityAliases(city).map((alias) => ({ alias, city })))
    .sort((a, b) => b.alias.length - a.alias.length);
  for (const { alias, city } of aliases) {
    const re = new RegExp(String.raw`(?<![\p{L}\p{N}])` + escapeRe(alias) + String.raw`(?![\p{L}\p{N}])`, "u");
    const m = s.match(re);
    if (!m) continue;
    consume(m);
    if (!filters.cities.includes(city)) {
      filters.cities.push(city);
      tokens.push({ id: `city:${normalize(city)}`, kind: "city", text: city, value: city });
    }
  }

  // Budget maximum, puis minimum.
  let m = s.match(PRICE_MAX);
  if (m) {
    consume(m);
    filters.priceMax = amount(m[1]!, m[2]);
    tokens.push({ id: "priceMax", kind: "priceMax", text: `moins de ${filters.priceMax}`, value: filters.priceMax });
  }
  m = s.match(PRICE_MIN);
  if (m) {
    consume(m);
    filters.priceMin = amount(m[1]!, m[2]);
    tokens.push({ id: "priceMin", kind: "priceMin", text: `plus de ${filters.priceMin}`, value: filters.priceMin });
  }

  // Pièces, chambres.
  m = s.match(ROOMS);
  if (m) {
    consume(m);
    const n = Number(m[1]);
    filters.rooms = n;
    filters.roomsExact = !Number.isInteger(n);
    tokens.push({ id: "rooms", kind: "rooms", text: `${String(n).replace(".", ",")} pièces`, value: n });
  }
  m = s.match(BEDROOMS);
  if (m) {
    consume(m);
    filters.bedroomsMin = Number(m[1]);
    tokens.push({ id: "bedrooms", kind: "bedrooms", text: `${filters.bedroomsMin} chambres`, value: filters.bedroomsMin });
  }

  m = s.match(AREA);
  if (m) consume(m);

  // Un montant nu :« 2500 CHF », ou un nombre d'au moins trois chiffres = un budget maximum.
  if (filters.priceMax === undefined) {
    m = s.match(BARE_PRICE) ?? s.match(BARE_NUMBER);
    if (m && Number(m[1]) >= 50) {
      consume(m);
      filters.priceMax = amount(m[1]!, m[2]);
      tokens.push({ id: "priceMax", kind: "priceMax", text: `moins de ${filters.priceMax}`, value: filters.priceMax });
    }
  }

  // Transaction — la première règle qui correspond gagne ; les autres mots de transaction sont absorbés.
  for (const rule of TRANSACTION_RULES) {
    let hit = s.match(rule.re);
    while (hit) {
      consume(hit);
      if (!filters.transaction) {
        filters.transaction = rule.value;
        tokens.push({ id: "transaction", kind: "transaction", text: rule.text, value: rule.value });
      }
      hit = s.match(rule.re);
    }
  }

  // Types de bien.
  for (const rule of KIND_RULES) {
    let hit = s.match(rule.re);
    while (hit) {
      consume(hit);
      if (!filters.kinds.includes(rule.value)) {
        filters.kinds.push(rule.value);
        tokens.push({ id: `type:${rule.value}`, kind: "type", text: rule.text, value: rule.value });
      }
      hit = s.match(rule.re);
    }
  }

  // Transaction déduite du budget quand elle n'est pas écrite.
  const budget = filters.priceMax ?? filters.priceMin;
  if (!filters.transaction && budget !== undefined) {
    filters.transaction = inferTransaction(budget);
    filters.transactionInferred = true;
  }

  const free = s
    .split(" ")
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w) && !/^[\d.<>=+]+$/.test(w));

  return { tokens, filters, free };
}

/** Vrai si la requête porte au moins un filtre de bien. */
export function hasFilters(f: SearchFilters): boolean {
  return (
    f.cities.length > 0 ||
    f.kinds.length > 0 ||
    f.transaction !== undefined ||
    f.rooms !== undefined ||
    f.bedroomsMin !== undefined ||
    f.priceMax !== undefined ||
    f.priceMin !== undefined
  );
}

const KIND_TYPES: Record<BienKind, readonly string[]> = {
  appartement: ["appartement", "penthouse", "studio"],
  studio: ["studio"],
  maison: ["maison", "villa"],
  chalet: ["chalet"],
  riad: ["riad"],
  penthouse: ["penthouse"],
  terrain: ["terrain"],
};

/** Un bien correspond-il à ce type ? Par son type, ou par son titre (« appartement dans un chalet »). */
function matchesKind(p: Property, kind: BienKind): boolean {
  if (KIND_TYPES[kind].includes(p.type)) return true;
  return normalize(p.title).split(" ").some((w) => w === kind || w === `${kind}s`);
}

/** Le bien respecte-t-il tous les filtres ? */
export function matchesFilters(p: Property, f: SearchFilters): boolean {
  if (f.transaction && p.transactionType !== f.transaction) return false;
  if (f.cities.length && !f.cities.some((c) => normalize(c) === normalize(p.location.city))) return false;
  if (f.kinds.length && !f.kinds.some((k) => matchesKind(p, k))) return false;
  if (f.rooms !== undefined) {
    const r = roomsOf(p);
    if (f.roomsExact ? r !== f.rooms : r < f.rooms || r > f.rooms + 0.5) return false;
  }
  if (f.bedroomsMin !== undefined && p.bedrooms < f.bedroomsMin) return false;
  if (f.priceMax !== undefined && p.price > f.priceMax) return false;
  if (f.priceMin !== undefined && p.price < f.priceMin) return false;
  return true;
}

/** Recherche plein texte de repli, quand la requête ne porte aucun filtre. */
function matchesFree(p: Property, free: readonly string[]): boolean {
  if (free.length === 0) return false;
  const hay = normalize(`${p.title} ${p.location.city} ${p.location.country} ${p.type}`);
  return free.some((w) => w.length >= 3 && hay.includes(w));
}

/**
 * Les biens d'une requête. Avec des filtres : ceux qui les respectent tous
 * (les mots inconnus n'y changent rien). Sans filtre : repli plein texte.
 * Les biens vendus ne sont jamais proposés.
 */
export function searchListings(pool: readonly Property[], parsed: ParsedQuery): Property[] {
  const avail = pool.filter((p) => !p.soldTo);
  if (hasFilters(parsed.filters)) return avail.filter((p) => matchesFilters(p, parsed.filters));
  return avail.filter((p) => matchesFree(p, parsed.free));
}

/** La requête sans une puce : le texte canonique des autres puces + les mots libres. */
export function queryWithout(parsed: ParsedQuery, tokenId: string): string {
  return [...parsed.tokens.filter((t) => t.id !== tokenId).map((t) => t.text), ...parsed.free].join(" ").trim();
}

/** Les villes connues, dans l'ordre des données, sans doublon. */
export function citiesOf(pool: readonly Pick<Property, "location">[]): string[] {
  return [...new Set(pool.map((p) => p.location.city).filter(Boolean))];
}

export interface Suggestion {
  /** La requête proposée. */
  query: string;
  /** Combien de biens elle donnerait. */
  count: number;
  /** Ce qui a changé : la puce retirée, ou la ville voisine proposée. */
  removed?: QueryToken;
  city?: string;
}

/**
 * L'état vide utile : pour chaque puce, ce que donnerait la requête sans elle ;
 * et pour une ville sans résultat, les villes voisines qui en ont.
 */
export function suggestionsFor(
  pool: readonly Property[],
  parsed: ParsedQuery,
  cities: readonly string[],
  nearbyCities: (city: string) => string[] = () => [],
): Suggestion[] {
  const out: Suggestion[] = [];
  for (const t of parsed.tokens) {
    const q = queryWithout(parsed, t.id);
    if (!q) continue;
    const count = searchListings(pool, parseQuery(q, cities)).length;
    if (count > 0) out.push({ query: q, count, removed: t });
  }
  for (const city of parsed.filters.cities) {
    for (const near of nearbyCities(city)) {
      const swapped = parsed.tokens.map((t) => (t.kind === "city" && t.value === city ? near : t.text));
      const q = [...swapped, ...parsed.free].join(" ");
      const count = searchListings(pool, parseQuery(q, cities)).length;
      if (count > 0 && !out.some((s) => s.query === q)) out.push({ query: q, count, city: near });
    }
  }
  return out.sort((a, b) => b.count - a.count).slice(0, 5);
}

/** Les villes du catalogue à moins de `km` d'une ville (par les coordonnées des biens). */
export function nearbyCitiesIn(pool: readonly Property[], km = 25): (city: string) => string[] {
  const centre = new Map<string, { lat: number; lng: number }>();
  for (const p of pool) {
    if (p.location.lat == null || p.location.lng == null || centre.has(p.location.city)) continue;
    centre.set(p.location.city, { lat: p.location.lat, lng: p.location.lng });
  }
  return (city: string) => {
    const c = centre.get(city);
    if (!c) return [];
    const res: { city: string; d: number }[] = [];
    for (const [other, o] of centre) {
      if (other === city) continue;
      const d = Math.hypot((o.lat - c.lat) * 111, (o.lng - c.lng) * 76);
      if (d <= km) res.push({ city: other, d });
    }
    return res.sort((a, b) => a.d - b.d).map((r) => r.city);
  };
}

/** Pour l'affichage d'un montant de puce, sans `toLocaleString`. */
export const groupedChf = (n: number) => `${groupInt(n)} CHF`;
