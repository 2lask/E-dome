import { mockReviews, averageRating } from "@/lib/mock-data";
import { chf } from "@/lib/model/billing";
import { quote, type Quote } from "@/lib/pricing";
import { requirePerson, personById } from "./directory";
import { frDate } from "./showcase";
import type { ServiceQuoteData, SessionEvent, SessionState } from "./session-store";
import { sessionServices, sessionServiceReviews } from "./session-views";

/* ── LE PÔLE SERVICES (chantier P6a) ────────────────────────────────────────

   Le catalogue affichait treize services, dont dix tenus par des entreprises
   sans compte (« Swiss Concierge », « MoveSwiss »…) et des notes inventées
   (4,9 — 127 avis) qu'aucun avis ne justifiait. Ici, chaque service est tenu
   par une personne de l'annuaire, et sa note se DÉRIVE :
     · des avis d'amorce rattachés à une prestation réelle du journal
       (`serviceSales` → `mockReviews`, invariant 18), reçus par le prestataire ;
     · des avis laissés pendant la session (`service.reviewed`).
   Sans avis : « Nouveau », jamais « 0 (0 avis) ».

   Le parcours devis → paiement → avis se lit dans le journal de session :
   `quote.sent` (demande, fil de messagerie) → `service.quoted` (réponse
   simulée du prestataire) → `service.quote.accepted` → `service.paid` (flux
   via `quote()`) → `service.completed` → `service.reviewed`. */

export interface CatalogService {
  id: string;
  title: string;
  category: string;
  providerId: string;
  /** Prix d'appel (« dès »), en CHF. */
  price: number;
  unit: string;
  description: string;
  /** Le mot du prestataire, dans SA voix (casting). */
  providerWords: string;
  includes: string[];
  zone: string;
  /** Délai indicatif de réalisation. */
  delay: string;
  /** Le devis type que le prestataire renvoie (réponse simulée). */
  quoteLines: { label: string; amountChf: number }[];
  /** Message accompagnant le devis, dans la voix du prestataire. */
  quoteMessage: string;
  /** Prestations réelles du journal (`serviceSales`) rattachées à ce service. */
  saleIds: string[];
}

export const SERVICES: CatalogService[] = [
  {
    id: "s3",
    title: "Photographie immobilière, drone et visite 3D",
    category: "Photographie",
    providerId: "user-005",
    price: 350,
    unit: "/séance",
    description:
      "Reportage photo d'un bien à vendre ou à louer : 25 images retouchées, vues aériennes par drone (pilote enregistré OFAC) et visite virtuelle 3D en option. Livraison sous 48 heures.",
    providerWords: "photos + drone + 3d. livre en 48h. dispo aussi le sam, msg moi",
    includes: ["25 photos retouchées, format web et impression", "Vues drone (selon zone de vol autorisée)", "Livraison en 48 h", "Droits d'usage pour l'annonce"],
    zone: "Nord vaudois, Lausanne, Riviera",
    delay: "Séance sous 7 jours",
    quoteLines: [
      { label: "Séance photo, 25 images retouchées", amountChf: 350 },
      { label: "Vues drone (4 angles)", amountChf: 150 },
      { label: "Déplacement", amountChf: 40 },
    ],
    quoteMessage: "salut, voila le devis. dispo la semaine pro, msg moi pr caler le jour",
    saleIds: ["sv-nik-leo", "sv-nik-riex", "sv-nik-pully", "sv-nik-morges"],
  },
  {
    id: "s14",
    title: "Visite virtuelle 3D seule",
    category: "Photographie",
    providerId: "user-005",
    price: 280,
    unit: "/bien",
    description:
      "Scan 3D du logement (jusqu'à 120 m²) et visite en ligne hébergée douze mois, à intégrer dans l'annonce. Idéal pour les candidats qui habitent loin.",
    providerWords: "scan 3d jusqu a 120m2, lien pret le lendemain",
    includes: ["Scan 3D jusqu'à 120 m²", "Visite hébergée 12 mois", "Lien prêt le lendemain"],
    zone: "Nord vaudois, Lausanne",
    delay: "Scan sous 5 jours",
    quoteLines: [
      { label: "Scan 3D jusqu'à 120 m²", amountChf: 280 },
      { label: "Hébergement de la visite, 12 mois", amountChf: 60 },
    ],
    quoteMessage: "hello, devis pr la 3d. si + de 120m2 je te refais le prix",
    saleIds: [],
  },
  {
    id: "s4",
    title: "Home staging pour la vente et la location",
    category: "Décoration",
    providerId: "user-010",
    price: 200,
    unit: "/pièce",
    description:
      "Mise en scène d'un logement avant les photos et les visites : tri, déplacement des meubles, textiles, lumière, bouquets de saison. Mobilier d'appoint loué au mois si le logement est vide.",
    providerWords: "Rendre un lieu désirable sans en faire un décor : quelques meubles déplacés, du lin, de la lumière. Les visiteurs doivent s'y voir vivre.",
    includes: ["Visite conseil et plan d'aménagement", "Mise en scène le jour des photos", "Mobilier d'appoint en option", "Rangement après la vente"],
    zone: "Riviera, Lavaux, La Côte",
    delay: "Intervention sous 10 jours",
    quoteLines: [
      { label: "Visite conseil et plan d'aménagement", amountChf: 180 },
      { label: "Mise en scène de 3 pièces (3 × 200)", amountChf: 600 },
      { label: "Location de mobilier et accessoires, 1 mois", amountChf: 320 },
    ],
    quoteMessage:
      "Bonjour ! Merci pour votre demande. Voici ma proposition pour trois pièces — on l'ajuste après la visite. J'ai hâte de découvrir le lieu.",
    saleIds: ["sv-ele-riex", "sv-ele-morges"],
  },
  {
    id: "s15",
    title: "Conseil couleurs et aménagement en visio",
    category: "Décoration",
    providerId: "user-010",
    price: 150,
    unit: "/séance",
    description:
      "Une heure en visio pour choisir les couleurs, la disposition et les quelques achats qui changent une pièce. Vous recevez ensuite une planche d'ambiance et une liste d'achats.",
    providerWords: "Une heure suffit souvent pour débloquer une pièce. Préparez trois photos et vos questions !",
    includes: ["Séance visio d'une heure", "Planche d'ambiance", "Liste d'achats avec budget"],
    zone: "Partout en Suisse romande (à distance)",
    delay: "Séance sous 3 jours",
    quoteLines: [
      { label: "Séance visio, 1 heure", amountChf: 150 },
      { label: "Planche d'ambiance et liste d'achats", amountChf: 60 },
    ],
    quoteMessage: "Bonjour ! Avec plaisir. Voici le détail de la séance — envoyez-moi trois photos de la pièce avant notre rendez-vous.",
    saleIds: [],
  },
  {
    id: "s10",
    title: "Rénovation énergétique : CECB Plus et direction de travaux",
    category: "Architecture",
    providerId: "user-009",
    price: 4500,
    unit: "/projet",
    description:
      "Étude énergétique CECB Plus, variantes de rénovation chiffrées par étapes, dossier de subventions (Programme Bâtiments et aides cantonales), puis direction de travaux si vous le souhaitez.",
    providerWords:
      "Je commence toujours par mesurer avant de proposer. Une rénovation par étapes bien ordonnées coûte moins cher qu'un grand chantier mal préparé.",
    includes: ["Relevés et rapport CECB Plus", "Variantes chiffrées par étapes", "Dossier de subventions", "Direction de travaux sur offre séparée"],
    zone: "Fribourg, Neuchâtel, Berne francophone",
    delay: "Rapport sous 4 semaines",
    quoteLines: [
      { label: "CECB Plus : relevés, rapport et variantes", amountChf: 2100 },
      { label: "Concept de rénovation par étapes", amountChf: 1600 },
      { label: "Dossier de subventions (Programme Bâtiments, canton)", amountChf: 900 },
    ],
    quoteMessage:
      "Bonjour, voici mon offre pour la phase d'étude. La direction de travaux fera l'objet d'une offre séparée, une fois la variante choisie. Meilleures salutations — freundliche Grüsse, Reto Jungo",
    saleIds: ["sv-reto-cecb"],
  },
  {
    id: "s16",
    title: "Expertise de l'état du bâtiment avant achat",
    category: "Architecture",
    providerId: "user-009",
    price: 850,
    unit: "/visite",
    description:
      "Avant de signer : visite technique du bien (toiture, façades, installations, humidité), puis rapport écrit avec une estimation des travaux à prévoir dans les dix ans.",
    providerWords: "Mieux vaut connaître le coût d'une toiture avant la signature qu'après.",
    includes: ["Visite technique de 2 heures", "Rapport écrit sous 5 jours", "Estimation des travaux à 10 ans"],
    zone: "Fribourg, Neuchâtel, Vaud",
    delay: "Visite sous 7 jours",
    quoteLines: [
      { label: "Visite technique et relevés (2 h)", amountChf: 450 },
      { label: "Rapport écrit avec estimation des travaux", amountChf: 400 },
      { label: "Déplacement", amountChf: 60 },
    ],
    quoteMessage:
      "Bonjour, voici mon offre pour l'expertise. Merci de me transmettre les plans et l'année de construction si vous les avez. Meilleures salutations, Reto Jungo",
    saleIds: [],
  },
];

/* ── Une vue unique : catalogue + services publiés pendant la session ───── */

export interface ServiceView extends CatalogService {
  provider: string;
  avatar: string;
  fromSession: boolean;
}

function fromCatalog(s: CatalogService): ServiceView {
  const p = requirePerson(s.providerId);
  return { ...s, provider: `${p.firstName} ${p.lastName}`, avatar: p.avatar, fromSession: false };
}

/** Tous les services visibles : ceux publiés pendant la session d'abord. */
export function allServices(state: SessionState): ServiceView[] {
  const published: ServiceView[] = sessionServices(state).map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    providerId: s.providerId,
    price: s.price,
    unit: s.unit,
    description: s.description || "Service publié pendant cette démonstration.",
    providerWords: "",
    includes: [],
    zone: s.zone,
    delay: "À convenir",
    quoteLines: [{ label: s.title, amountChf: s.price }],
    quoteMessage: "Bonjour, merci pour votre demande. Voici mon devis.",
    saleIds: [],
    provider: s.provider,
    avatar: s.avatar,
    fromSession: true,
  }));
  return [...published, ...SERVICES.map(fromCatalog)];
}

export function findService(state: SessionState, id: string): ServiceView | undefined {
  return allServices(state).find((s) => s.id === id);
}

/** Les services d'un prestataire (catalogue + session). */
export function servicesOf(state: SessionState, providerId: string): ServiceView[] {
  return allServices(state).filter((s) => s.providerId === providerId);
}

/* ── Les avis d'un service ───────────────────────────────────────────── */

export interface ServiceReviewView {
  id: string;
  authorId: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  fromSession: boolean;
}

/** Les avis d'un service : amorce (prestations réelles) + session. */
export function serviceReviews(state: SessionState, service: Pick<CatalogService, "id" | "providerId" | "saleIds">): ServiceReviewView[] {
  const seed = mockReviews
    .filter((r) => r.subject.kind === "service" && service.saleIds.includes(r.subject.id) && r.recipientId === service.providerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => ({
      id: r.id,
      authorId: r.author.id,
      author: `${r.author.firstName} ${r.author.lastName}`,
      avatar: r.author.avatar,
      rating: r.rating,
      comment: r.comment,
      date: frDate(r.createdAt),
      fromSession: false,
    }));
  const live = sessionServiceReviews(state)
    .filter((r) => r.serviceId === service.id)
    .map((r) => {
      const a = personById(r.authorId);
      return {
        id: r.id,
        authorId: r.authorId,
        author: a ? `${a.firstName} ${a.lastName}` : "Quelqu'un",
        avatar: a?.avatar ?? "",
        rating: r.rating,
        comment: r.comment,
        date: frDate(r.at),
        fromSession: true,
      };
    });
  return [...live, ...seed];
}

/** Note dérivée des avis, ou `null` sans avis (« Nouveau »). */
export function ratingSummary(reviews: readonly { rating: number }[]): { average: number; count: number } | null {
  return reviews.length === 0 ? null : { average: averageRating(reviews), count: reviews.length };
}

/* ── Le devis et le paiement ─────────────────────────────────────────── */

export const quoteTotal = (lines: readonly { amountChf: number }[]) => lines.reduce((s, l) => s + l.amountChf, 0);

/** Les données du devis simulé que le prestataire renvoie à une demande. */
export function simulatedQuote(service: ServiceView, requestId: string): ServiceQuoteData {
  const lines = service.quoteLines.map((l) => ({ ...l }));
  return {
    serviceId: service.id,
    providerId: service.providerId,
    requestId,
    subject: service.title,
    lines,
    totalChf: quoteTotal(lines),
    message: service.quoteMessage,
  };
}

/** Le flux d'argent du paiement d'une prestation — toujours via `quote()`.
    Le client vient de la plateforme : taux « audience E-Dome » du catalogue. */
export function servicePaymentCharge(totalChf: number) {
  return { kind: "commission" as const, pole: "service" as const, gross: chf(totalChf), attribution: "platform" as const };
}

export function servicePaymentQuote(totalChf: number): Quote {
  return quote(servicePaymentCharge(totalChf));
}

/* ── L'état d'une demande, pour un client et un service ──────────────── */

export type DealStage = "none" | "quoted" | "accepted" | "paid" | "completed" | "reviewed";

export interface ServiceDeal {
  stage: DealStage;
  quotedId?: string;
  quote?: ServiceQuoteData;
  review?: { rating: number; comment: string };
}

type Ev<K extends SessionEvent["kind"]> = Extract<SessionEvent, { kind: K }>;

/** Où en est la DERNIÈRE demande de `actorId` pour `serviceId`. */
export function serviceDealOf(state: SessionState, actorId: string, serviceId: string): ServiceDeal {
  const quoted = state.events.filter(
    (e): e is Ev<"service.quoted"> => e.kind === "service.quoted" && e.actorId === actorId && e.data.serviceId === serviceId,
  );
  const last = quoted[quoted.length - 1];
  if (!last) return { stage: "none" };
  const after = state.events.filter((e) => e.actorId === actorId && e.seq > last.seq);
  const has = (kind: SessionEvent["kind"]) =>
    after.some((e) => e.kind === kind && (e.data as { quotedId?: string }).quotedId === last.id);
  const review = after.find((e): e is Ev<"service.reviewed"> => e.kind === "service.reviewed" && e.data.quotedId === last.id);
  const base = { quotedId: last.id, quote: last.data };
  if (review) return { ...base, stage: "reviewed", review: { rating: review.data.rating, comment: review.data.comment } };
  if (has("service.completed")) return { ...base, stage: "completed" };
  if (has("service.paid")) return { ...base, stage: "paid" };
  if (has("service.quote.accepted")) return { ...base, stage: "accepted" };
  return { ...base, stage: "quoted" };
}

/** Les demandes reçues par un prestataire pendant la session (côté prestataire). */
export function requestsReceivedBy(state: SessionState, providerId: string, serviceId?: string) {
  return state.events
    .filter(
      (e): e is Ev<"service.quoted"> =>
        e.kind === "service.quoted" && e.data.providerId === providerId && e.actorId !== providerId && (!serviceId || e.data.serviceId === serviceId),
    )
    .map((e) => ({ id: e.id, clientId: e.actorId, stage: serviceDealOf(state, e.actorId, e.data.serviceId).stage, totalChf: e.data.totalChf, serviceId: e.data.serviceId }));
}
