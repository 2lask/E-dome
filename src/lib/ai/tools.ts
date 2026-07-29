/* ─── Couche outils (Tools) de l'IA immobilière ───────────────────────────
   Chaque outil expose une fonction métier sur les DONNÉES RÉELLES du SaaS
   (src/lib/mock-data.ts aujourd'hui, Supabase demain) et/ou le moteur de
   calcul pur (src/lib/ai/calc.ts). Le LLM n'invente jamais : il appelle ces
   outils et raisonne sur leurs résultats. Les définitions suivent le schéma
   d'outil de l'API Claude (name / description / input_schema JSON Schema).

   Ajouter une capacité métier = ajouter un outil ici (pas de logique dans le
   prompt). Isolé de tout SDK : la route mappe ces définitions vers l'API. */

import { properties as ALL_PROPERTIES, getPropertyById } from "@/lib/mock-data";
import type { Property } from "@/lib/types";
import { computeYield, computeCashflow, estimateByComparables, pricePerM2 } from "./calc";

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
  run: (input: Record<string, unknown>) => unknown;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const num = (v: unknown, fallback = 0): number => (typeof v === "number" && isFinite(v) ? v : fallback);
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);

function summarize(p: Property) {
  return {
    id: p.id,
    titre: p.title,
    type: p.type,
    transaction: p.transactionType,
    prix: p.price,
    devise: p.currency,
    ville: p.location.city,
    pays: p.location.country,
    chambres: p.bedrooms,
    sallesDeBain: p.bathrooms,
    surface: p.area,
    prixM2: p.analytics?.prixM2 ?? pricePerM2(p.price, p.area),
    note: p.rating,
    rendementBrut: p.analytics?.rendementBrut,
    rendementNet: p.analytics?.rendementNet,
    dpe: p.analytics?.dpe,
    url: `/explorer/${p.id}`,
  };
}

function comparablesFor(city: string, type: string | undefined, excludeId?: string): Property[] {
  return ALL_PROPERTIES.filter(
    (p) =>
      p.transactionType === "vente" &&
      p.location.city.toLowerCase() === city.toLowerCase() &&
      (!type || p.type === type) &&
      p.id !== excludeId &&
      p.area > 0,
  );
}

// ─── Outils ─────────────────────────────────────────────────────────────────

export const TOOLS: AiTool[] = [
  {
    definition: {
      name: "search_properties",
      description:
        "Recherche des biens réels du catalogue E-Dome selon des critères. À utiliser dès que l'utilisateur cherche des biens (ville, type, budget, chambres, achat/location). Renvoie une liste compacte de biens réels avec leur id.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          city: { type: "string", description: "Ville (ex: Lausanne, Marrakech)" },
          country: { type: "string", description: "Pays (ex: Suisse, Maroc)" },
          type: { type: "string", description: "Type de bien (appartement, villa, studio, penthouse, chalet, riad, maison, terrain)" },
          transactionType: { type: "string", enum: ["vente", "location-ct", "location-lt"], description: "Type de transaction" },
          maxPrice: { type: "number", description: "Prix maximum" },
          minBedrooms: { type: "number", description: "Nombre minimum de chambres" },
          limit: { type: "number", description: "Nombre max de résultats (défaut 8)" },
        },
      },
    },
    run: (input) => {
      const city = str(input.city);
      const country = str(input.country);
      const type = str(input.type);
      const transactionType = str(input.transactionType);
      const maxPrice = input.maxPrice != null ? num(input.maxPrice) : undefined;
      const minBedrooms = input.minBedrooms != null ? num(input.minBedrooms) : undefined;
      const limit = input.limit != null ? Math.max(1, Math.min(20, num(input.limit, 8))) : 8;

      let results = [...ALL_PROPERTIES];
      if (city) results = results.filter((p) => p.location.city.toLowerCase().includes(city.toLowerCase()));
      if (country) results = results.filter((p) => p.location.country.toLowerCase().includes(country.toLowerCase()));
      if (type) results = results.filter((p) => p.type === type);
      if (transactionType) results = results.filter((p) => p.transactionType === transactionType);
      if (maxPrice != null) results = results.filter((p) => p.price <= maxPrice);
      if (minBedrooms != null) results = results.filter((p) => p.bedrooms >= minBedrooms);

      return { count: results.length, results: results.slice(0, limit).map(summarize) };
    },
  },

  {
    definition: {
      name: "get_property",
      description:
        "Renvoie la fiche détaillée réelle d'un bien par son id (rendement, prix/m², DPE, ROI, occupation, hôte…). À utiliser avant d'analyser ou de commenter un bien précis.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: { id: { type: "string", description: "id du bien (ex: prop1, prop11)" } },
        required: ["id"],
      },
    },
    run: (input) => {
      const id = str(input.id);
      const p = id ? getPropertyById(id) : undefined;
      if (!p) return { error: "Bien introuvable", id: id ?? null };
      return {
        ...summarize(p),
        description: p.description,
        equipements: p.amenities,
        hote: `${p.host.firstName} ${p.host.lastName}`,
        analytics: p.analytics ?? null,
      };
    },
  },

  {
    definition: {
      name: "search_comparable_sales",
      description:
        "Renvoie les ventes comparables réelles (même ville, même type) et le prix/m² médian. Base d'une estimation. Utiliser avant estimate_property pour justifier une valeur.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          city: { type: "string", description: "Ville" },
          type: { type: "string", description: "Type de bien (optionnel)" },
          excludeId: { type: "string", description: "id d'un bien à exclure des comparables" },
        },
        required: ["city"],
      },
    },
    run: (input) => {
      const city = str(input.city);
      if (!city) return { error: "Ville requise" };
      const comps = comparablesFor(city, str(input.type), str(input.excludeId));
      const pm2 = comps.map((p) => p.analytics?.prixM2 ?? pricePerM2(p.price, p.area)).filter((n) => n > 0);
      return {
        ville: city,
        nombreComparables: comps.length,
        prixM2: pm2.sort((a, b) => a - b),
        comparables: comps.map(summarize),
      };
    },
  },

  {
    definition: {
      name: "estimate_property",
      description:
        "Estime la valeur d'un bien par comparables (prix/m² médian des ventes réelles de la même ville/type appliqué à la surface). Renvoie une fourchette. Toujours expliquer la méthode et les comparables utilisés.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          city: { type: "string", description: "Ville du bien" },
          type: { type: "string", description: "Type de bien (optionnel mais recommandé)" },
          area: { type: "number", description: "Surface en m²" },
          excludeId: { type: "string", description: "id du bien estimé (exclu des comparables)" },
        },
        required: ["city", "area"],
      },
    },
    run: (input) => {
      const city = str(input.city);
      const area = num(input.area);
      if (!city || area <= 0) return { error: "Ville et surface (>0) requises" };
      const comps = comparablesFor(city, str(input.type), str(input.excludeId));
      const pm2 = comps.map((p) => p.analytics?.prixM2 ?? pricePerM2(p.price, p.area)).filter((n) => n > 0);
      if (pm2.length === 0) return { error: "Aucun comparable disponible pour cette ville/type", ville: city };
      const est = estimateByComparables(area, pm2);
      return {
        methode: "Prix/m² médian des ventes comparables × surface",
        ville: city,
        surface: area,
        nombreComparables: comps.length,
        prixM2Median: est.medianPricePerM2,
        estimation: est.estimate,
        fourchetteBasse: est.low,
        fourchetteHaute: est.high,
        devise: "CHF",
        comparablesUtilises: comps.map((p) => ({ id: p.id, titre: p.title, prix: p.price, surface: p.area })),
      };
    },
  },

  {
    definition: {
      name: "calculate_yield",
      description:
        "Calcule le rendement locatif brut et net à partir d'un prix et d'un loyer mensuel. Hypothèses par défaut : charges 20% du loyer, vacance 5%. Renvoie les hypothèses utilisées — à expliciter.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          price: { type: "number", description: "Prix d'achat" },
          monthlyRent: { type: "number", description: "Loyer mensuel hors charges" },
          chargesRate: { type: "number", description: "Charges non récupérables en fraction du loyer (0.20 = 20%)" },
          vacancyRate: { type: "number", description: "Taux de vacance en fraction (0.05 = 5%)" },
          propertyTaxYearly: { type: "number", description: "Taxe/impôt annuel" },
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
        "Calcule le cash-flow mensuel/annuel et le cash-on-cash d'un investissement locatif financé (apport + prêt). Combine rendement net et mensualité de prêt.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          price: { type: "number", description: "Prix d'achat" },
          monthlyRent: { type: "number", description: "Loyer mensuel hors charges" },
          downPayment: { type: "number", description: "Apport" },
          loanRatePct: { type: "number", description: "Taux annuel du prêt en % (ex: 2.5)" },
          loanYears: { type: "number", description: "Durée du prêt en années" },
          chargesRate: { type: "number", description: "Charges (fraction du loyer, défaut 0.20)" },
          vacancyRate: { type: "number", description: "Vacance (fraction, défaut 0.05)" },
          propertyTaxYearly: { type: "number", description: "Taxe/impôt annuel" },
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

  {
    definition: {
      name: "analyse_investment",
      description:
        "Analyse complète d'un bien réel du catalogue comme investissement : reprend ses analytics (rendement, ROI, occupation) et, si un loyer mensuel estimé est fourni, calcule rendement net et cash-flow. Renvoie des indicateurs bruts à interpréter, pas un conseil.",
      input_schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", description: "id du bien à analyser" },
          monthlyRent: { type: "number", description: "Loyer mensuel estimé (optionnel, pour le rendement net/cash-flow)" },
          downPayment: { type: "number", description: "Apport (optionnel, pour le cash-flow)" },
          loanRatePct: { type: "number", description: "Taux du prêt en % (optionnel)" },
          loanYears: { type: "number", description: "Durée du prêt en années (optionnel)" },
        },
        required: ["id"],
      },
    },
    run: (input) => {
      const id = str(input.id);
      const p = id ? getPropertyById(id) : undefined;
      if (!p) return { error: "Bien introuvable", id: id ?? null };

      const out: Record<string, unknown> = {
        bien: summarize(p),
        analyticsCommuniquees: p.analytics ?? null,
        avertissement: "Données communiquées par le vendeur — à vérifier. Ceci n'est pas un conseil financier.",
      };
      const monthlyRent = input.monthlyRent != null ? num(input.monthlyRent) : undefined;
      if (monthlyRent && monthlyRent > 0) {
        out.rendementCalcule = computeYield({ price: p.price, monthlyRent });
        if (input.downPayment != null && input.loanRatePct != null && input.loanYears != null) {
          out.cashflow = computeCashflow({
            price: p.price,
            monthlyRent,
            downPayment: num(input.downPayment),
            loanRatePct: num(input.loanRatePct),
            loanYears: num(input.loanYears),
          });
        }
      }
      return out;
    },
  },
];

const TOOL_MAP = new Map(TOOLS.map((t) => [t.definition.name, t]));

export function getToolDefinitions(): ToolDefinition[] {
  return TOOLS.map((t) => t.definition);
}

export function runTool(name: string, input: Record<string, unknown>): unknown {
  const tool = TOOL_MAP.get(name);
  if (!tool) return { error: `Outil inconnu: ${name}` };
  try {
    return tool.run(input ?? {});
  } catch (e) {
    return { error: "Erreur d'exécution de l'outil", detail: e instanceof Error ? e.message : String(e) };
  }
}
