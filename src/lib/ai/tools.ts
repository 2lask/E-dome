import "server-only";

/* ─── Outils du Copilote, sur les DONNÉES RÉELLES d'E-Dome ──────────────────
   Chaque outil lit la base Supabase (sous la session de la personne, donc avec
   ses droits RLS) ou appelle un calcul pur déjà utilisé par l'interface. Le
   modèle n'invente rien : il appelle ces outils et raisonne sur leurs
   résultats.

   Ce qui a été retiré (phase 0 de la vision « Bureau ») : les anciens outils
   lisaient `mock-data` (biens fictifs, rendements codés en dur) et
   présentaient des « ventes comparables » qui n'existent pas. E-Dome ne
   connaît pas les prix de vente conclus du marché : l'outil de marché
   renvoie donc des PRIX DEMANDÉS sur E-Dome, présentés comme tels, et refuse
   de conclure sous trois annonces.

   Données personnelles : rien ne sort sur les acheteurs ni sur les apporteurs
   (noms, coordonnées) ; seulement des chiffres agrégés et les annonces
   publiques. Ajouter une capacité = ajouter un outil ici. */

import { getPublicProperty, listPublicProperties } from "@/lib/supabase/property-actions";
import { listPrimedProperties } from "@/lib/supabase/introduction-actions";
import { getDashboard } from "@/lib/supabase/dashboard-actions";
import type { MyProperty, PrimedProperty } from "@/lib/my-property";
import { affordability } from "@/lib/affordability";
import { commissionLabel, dueLabel, netForApporteur } from "@/lib/commission";
import { PERIODS, type Period } from "@/lib/dashboard-stats";
import { computeCashflow, computeYield, pricePerM2 } from "./calc";

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties: false;
  };
}

export interface AiTool {
  definition: ToolDefinition;
  run: (input: Record<string, unknown>) => Promise<unknown> | unknown;
}

// ─── Aides ──────────────────────────────────────────────────────────────────

const num = (v: unknown, fallback = 0): number => (typeof v === "number" && isFinite(v) ? v : fallback);
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : undefined);
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

const TX = ["vente", "location-lt", "location-ct"] as const;

function summarize(p: MyProperty, prime?: PrimedProperty) {
  return {
    id: p.id,
    titre: p.title,
    type: p.type,
    transaction: p.transactionType,
    prix: p.price,
    devise: p.currency,
    unitePrix: p.transactionType === "vente" ? "prix de vente" : p.transactionType === "location-lt" ? "loyer mensuel" : "prix par nuit",
    ville: p.city,
    chambres: p.bedrooms,
    sallesDeau: p.bathrooms,
    surfaceM2: p.area || null,
    prixAuM2: p.transactionType === "vente" && p.area > 0 ? pricePerM2(p.price, p.area) : null,
    commission: prime ? { conditions: commissionLabel(prime.terms), echeance: dueLabel(prime.terms, prime.transactionType) } : null,
    publieLe: p.createdAt.slice(0, 10),
    url: `/explorer/${p.id}`,
  };
}

async function primesByProperty(): Promise<Map<string, PrimedProperty>> {
  const list = await listPrimedProperties();
  return new Map(list.map((p) => [p.propertyId, p]));
}

// ─── Outils ─────────────────────────────────────────────────────────────────

export const TOOLS: AiTool[] = [
  {
    definition: {
      name: "search_properties",
      description:
        "Cherche parmi les annonces réelles publiées sur E-Dome (ventes et locations en Suisse). À utiliser dès que l'utilisateur cherche des biens. Renvoie une liste compacte avec l'id, le prix, la surface et la commission d'apport éventuelle.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          city: { type: "string", description: "Localité (ex : Neuchâtel, Lausanne)" },
          type: { type: "string", description: "Type de bien (appartement, maison, villa, attique, studio, chalet, terrain…)" },
          transactionType: { type: "string", enum: [...TX], description: "vente, location-lt (longue durée) ou location-ct (courte durée)" },
          maxPrice: { type: "number", description: "Prix ou loyer maximum en CHF" },
          minBedrooms: { type: "number", description: "Nombre minimum de chambres" },
          withCommission: { type: "boolean", description: "Seulement les biens avec une commission d'apport" },
          limit: { type: "number", description: "Nombre maximum de résultats (défaut 8, max 20)" },
        },
      },
    },
    run: async (input) => {
      const [all, primes] = await Promise.all([listPublicProperties(200), primesByProperty()]);
      const city = str(input.city);
      const type = str(input.type);
      const tx = str(input.transactionType);
      const maxPrice = input.maxPrice != null ? num(input.maxPrice) : undefined;
      const minBedrooms = input.minBedrooms != null ? num(input.minBedrooms) : undefined;
      const limit = Math.max(1, Math.min(20, num(input.limit, 8)));
      let r = all;
      if (city) r = r.filter((p) => norm(p.city).includes(norm(city)));
      if (type) r = r.filter((p) => norm(p.type) === norm(type));
      if (tx) r = r.filter((p) => p.transactionType === tx);
      if (maxPrice != null) r = r.filter((p) => p.price <= maxPrice);
      if (minBedrooms != null) r = r.filter((p) => p.bedrooms >= minBedrooms);
      if (input.withCommission === true) r = r.filter((p) => primes.has(p.id));
      return {
        source: "Annonces publiées sur E-Dome",
        totalEnLigne: all.length,
        nombre: r.length,
        resultats: r.slice(0, limit).map((p) => summarize(p, primes.get(p.id))),
      };
    },
  },

  {
    definition: {
      name: "get_property",
      description:
        "Renvoie la fiche réelle d'une annonce E-Dome par son id (uuid) : description, équipements, chiffres déclarés par le propriétaire, commission d'apport. À appeler avant de commenter un bien précis.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: { id: { type: "string", description: "id de l'annonce (uuid, visible dans l'adresse /explorer/<id>)" } },
        required: ["id"],
      },
    },
    run: async (input) => {
      const id = str(input.id);
      if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return { erreur: "Identifiant d'annonce invalide", id: id ?? null };
      const [p, primes] = await Promise.all([getPublicProperty(id), primesByProperty()]);
      if (!p) return { erreur: "Annonce introuvable ou retirée", id };
      return {
        ...summarize(p, primes.get(p.id)),
        description: p.description.slice(0, 3000),
        equipements: p.amenities,
        nombrePhotos: p.images.length,
        videoDeVisite: p.videos.length > 0,
        chiffresDeclares: p.analytics ?? null,
        avertissement: "Informations déclarées par le propriétaire, non vérifiées par E-Dome.",
      };
    },
  },

  {
    definition: {
      name: "market_asking_prices",
      description:
        "Statistiques des PRIX DEMANDÉS sur les annonces E-Dome d'une localité (prix au m² médian, minimum, maximum, nombre d'annonces). Ce ne sont PAS des prix de vente conclus : toujours le dire. Sous trois annonces, l'outil refuse de conclure.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          city: { type: "string", description: "Localité" },
          type: { type: "string", description: "Type de bien (optionnel)" },
          transactionType: { type: "string", enum: [...TX], description: "Défaut : vente" },
          excludeId: { type: "string", description: "id d'une annonce à exclure (le bien analysé)" },
        },
        required: ["city"],
      },
    },
    run: async (input) => {
      const city = str(input.city);
      if (!city) return { erreur: "Localité requise" };
      const tx = str(input.transactionType) ?? "vente";
      const type = str(input.type);
      const all = await listPublicProperties(200);
      const comps = all.filter((p) =>
        norm(p.city).includes(norm(city)) && p.transactionType === tx && p.area > 0 && p.price > 0 &&
        (!type || norm(p.type) === norm(type)) && p.id !== str(input.excludeId));
      const perM2 = comps.map((p) => Math.round(p.price / p.area));
      const base = { localite: city, transaction: tx, nature: "Prix demandés sur E-Dome (pas des ventes conclues)", nombreAnnonces: comps.length };
      if (comps.length < 3) {
        return { ...base, suffisant: false, message: "Moins de trois annonces comparables sur E-Dome : aucune conclusion de prix possible. Orienter vers une estimation par un professionnel ou les statistiques officielles." };
      }
      return {
        ...base,
        suffisant: true,
        prixAuM2Median: median(perM2),
        prixAuM2Min: Math.min(...perM2),
        prixAuM2Max: Math.max(...perM2),
        annonces: comps.slice(0, 10).map((p) => ({ id: p.id, titre: p.title, prix: p.price, surfaceM2: p.area })),
      };
    },
  },

  {
    definition: {
      name: "check_affordability",
      description:
        "Calcule si un achat est finançable selon la règle usuelle des banques suisses : 20 % de fonds propres, charges théoriques (intérêt 5 %, amortissement 1 %, entretien 1 %) au plus un tiers du revenu brut. Indicatif, pas une offre de crédit.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          price: { type: "number", description: "Prix d'achat en CHF" },
          equity: { type: "number", description: "Fonds propres disponibles en CHF" },
          grossIncome: { type: "number", description: "Revenu brut annuel du ménage en CHF (0 si inconnu)" },
        },
        required: ["price", "equity"],
      },
    },
    run: (input) => ({
      ...affordability(num(input.price), num(input.equity), num(input.grossIncome)),
      hypotheses: "Taux théorique 5 %, amortissement 1 %, entretien 1 % du prix ; charges ≤ 1/3 du revenu brut ; fonds propres ≥ 20 %.",
      avertissement: "Règle usuelle ; chaque banque calcule à sa façon. Pas un conseil ni une offre de crédit.",
    }),
  },

  {
    definition: {
      name: "commission_breakdown",
      description:
        "Pour une annonce avec commission d'apport : montant brut (fixe, ou estimé au prix demandé si pourcentage), part nette de l'apporteur (88 %) et part E-Dome (12 %, minimum 3 CHF), et moment où elle est due.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: { id: { type: "string", description: "id de l'annonce" } },
        required: ["id"],
      },
    },
    run: async (input) => {
      const id = str(input.id);
      if (!id) return { erreur: "id requis" };
      const prime = (await primesByProperty()).get(id);
      if (!prime) return { id, commission: null, message: "Cette annonce ne propose pas de commission d'apport." };
      const gross = Math.round(prime.amountChf);
      const net = Math.round(netForApporteur(prime.amountChf));
      return {
        id,
        conditions: commissionLabel(prime.terms),
        echeance: dueLabel(prime.terms, prime.transactionType),
        brutChf: gross,
        apporteurNetChf: net,
        partEdomeChf: gross - net,
        estimation: prime.terms.kind === "pourcentage",
        note: prime.terms.kind === "pourcentage" ? "Estimation au prix demandé ; calculée sur le prix final à la vente." : "Montant fixe.",
      };
    },
  },

  {
    definition: {
      name: "my_activity",
      description:
        "Chiffres réels de l'utilisateur connecté sur une période (7, 30 ou 90 jours) : pour ses annonces (vues, visiteurs, leads, conversion, ventes, provenance des visites, performance par annonce) et pour ses liens d'apporteur (clics, leads, ventes, commissions nettes). Aucune donnée personnelle de tiers.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: { period: { type: "number", enum: [...PERIODS], description: "Période en jours (défaut 30)" } },
      },
    },
    run: async (input) => {
      const p = num(input.period, 30);
      const period = ((PERIODS as readonly number[]).includes(p) ? p : 30) as Period;
      const d = await getDashboard(period);
      if (!d) return { erreur: "Connexion requise pour lire vos chiffres." };
      const s = d.seller;
      const a = d.apporteur;
      return {
        periodeJours: period,
        suiviComplet: d.ready,
        vendeur: s ? {
          vues: s.views, visiteurs: s.visitors, leads: s.leads, conversionPct: s.conversion,
          visites: s.visits, offres: s.offers, ventes: s.sales, chiffreAffairesChf: s.revenue,
          commissionsDuesChf: s.commissions, partDesVuesViaApporteursPct: s.viaApporteurs,
          provenance: s.sources?.map((x) => ({ canal: x.label, vues: x.value, pct: x.pct })) ?? null,
          parAnnonce: s.topListings.map((l) => ({ id: l.id, titre: l.title, vues: l.views, leads: l.leads, conversionPct: l.conversion })),
          nombreApporteursActifs: s.topApporteurs.length,
        } : null,
        apporteur: a ? {
          clics: a.clicks, personnes: a.visitors, leads: a.leads, ventes: a.sales,
          commissionsGagneesNetChf: Math.round(a.commissionsEarned), enCoursEstimeNetChf: Math.round(a.commissionsPending),
          provenance: a.sources?.map((x) => ({ canal: x.label, clics: x.value, pct: x.pct })) ?? null,
          parLien: a.links.map((l) => ({ id: l.propertyId, titre: l.title, clics: l.clicks, leads: l.leads, ventes: l.sales, gagneNetChf: Math.round(l.earned) })),
        } : null,
      };
    },
  },

  {
    definition: {
      name: "calculate_yield",
      description:
        "Calcule le rendement locatif brut et net à partir d'un prix et d'un loyer mensuel. Hypothèses par défaut : charges 20 % du loyer, vacance 5 %. Expliciter les hypothèses.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          price: { type: "number", description: "Prix d'achat" },
          monthlyRent: { type: "number", description: "Loyer mensuel hors charges" },
          chargesRate: { type: "number", description: "Charges non récupérables en fraction du loyer (0.20 = 20 %)" },
          vacancyRate: { type: "number", description: "Taux de vacance en fraction (0.05 = 5 %)" },
          propertyTaxYearly: { type: "number", description: "Impôts et taxes annuels" },
        },
        required: ["price", "monthlyRent"],
      },
    },
    run: (input) =>
      computeYield({
        price: num(input.price),
        monthlyRent: num(input.monthlyRent),
        chargesRate: input.chargesRate != null ? num(input.chargesRate) : undefined,
        vacancyRate: input.vacancyRate != null ? num(input.vacancyRate) : undefined,
        propertyTaxYearly: input.propertyTaxYearly != null ? num(input.propertyTaxYearly) : undefined,
      }),
  },

  {
    definition: {
      name: "calculate_cashflow",
      description:
        "Calcule le cash-flow mensuel et annuel et le rendement des fonds propres d'un investissement locatif financé (apport + prêt).",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          price: { type: "number", description: "Prix d'achat" },
          monthlyRent: { type: "number", description: "Loyer mensuel hors charges" },
          downPayment: { type: "number", description: "Apport" },
          loanRatePct: { type: "number", description: "Taux annuel du prêt en % (ex : 2.5)" },
          loanYears: { type: "number", description: "Durée du prêt en années" },
          chargesRate: { type: "number", description: "Charges (fraction du loyer, défaut 0.20)" },
          vacancyRate: { type: "number", description: "Vacance (fraction, défaut 0.05)" },
          propertyTaxYearly: { type: "number", description: "Impôts et taxes annuels" },
        },
        required: ["price", "monthlyRent", "downPayment", "loanRatePct", "loanYears"],
      },
    },
    run: (input) =>
      computeCashflow({
        price: num(input.price),
        monthlyRent: num(input.monthlyRent),
        downPayment: num(input.downPayment),
        loanRatePct: num(input.loanRatePct),
        loanYears: num(input.loanYears),
        chargesRate: input.chargesRate != null ? num(input.chargesRate) : undefined,
        vacancyRate: input.vacancyRate != null ? num(input.vacancyRate) : undefined,
        propertyTaxYearly: input.propertyTaxYearly != null ? num(input.propertyTaxYearly) : undefined,
      }),
  },
];

const TOOL_MAP = new Map(TOOLS.map((t) => [t.definition.name, t]));

export function getToolDefinitions(): ToolDefinition[] {
  return TOOLS.map((t) => t.definition);
}

export async function runTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  const tool = TOOL_MAP.get(name);
  if (!tool) return { erreur: `Outil inconnu : ${name}` };
  try {
    return await tool.run(input ?? {});
  } catch (e) {
    return { erreur: "Erreur d'exécution de l'outil", detail: e instanceof Error ? e.message.slice(0, 200) : String(e) };
  }
}
