/* ── Textes de la fiche d'un bien (chantier P6b) ────────────────────────────

   Trois parcours selon la transaction :
   - vente : visite + offre (avec le panneau « qui paie quoi ») ;
   - location longue durée : demande de visite sur créneaux → fil avec le
     propriétaire. Jamais de « nuit », jamais de réservation ;
   - courte durée : réservation, avec le flux d'argent d'une nuit.

   Les montants ne vivent pas ici : ils se calculent (`src/lib/explore`). */

export const propertyPage = {
  perMonth: "/ mois",
  perNight: "/ nuit",
  rent: {
    title: "Loyer mensuel",
    net: "Loyer net",
    charges: "Acompte de charges",
    total: "Total par mois",
    chargesUnknown: "Charges non précisées dans l'annonce : demandez le détail au propriétaire.",
    deposit: "Garantie de loyer : trois mois de loyer net au maximum, sur un compte bloqué à votre nom.",
  },
  ltAside: {
    cta: "Demander une visite",
    write: (name: string) => `Écrire à ${name}`,
    hint: "Pas de réservation pour une location à l'année : on visite d'abord, le bail se signe ensuite avec le propriétaire.",
  },
  saleAside: {
    visit: "Planifier une visite",
    offer: "Faire une offre",
    write: (name: string) => `Écrire à ${name}`,
    sheet: "Télécharger la fiche PDF",
  },
  visitModal: {
    titleLt: "Demander une visite",
    titleSale: "Planifier une visite",
    slotsLabel: "Choisissez un créneau proposé",
    slotsHint: (name: string) => `${name} confirmera le créneau dans votre messagerie.`,
    otherDate: "Proposer une autre date",
    message: "Message (optionnel)",
    messagePlaceholderLt: "Présentez-vous en deux lignes : composition du ménage, date d'entrée souhaitée…",
    messagePlaceholderSale: "Précisez vos disponibilités ou vos questions…",
    submit: "Envoyer la demande",
    pickSlot: "Choisissez un créneau.",
    sent: (name: string) => `Demande de visite envoyée à ${name}. La conversation est ouverte dans vos messages.`,
  },
  offerModal: {
    title: "Faire une offre",
    asked: "Prix demandé",
    amount: (cur: string) => `Montant de votre offre (${cur})`,
    conditions: "Conditions (optionnel)",
    conditionsPlaceholder: "Ex. : sous réserve de financement, date de remise souhaitée…",
    submit: "Soumettre l'offre",
    flowTitle: "Qui paie quoi",
    buyerPays: "Vous payez au vendeur",
    sellerGets: "Le vendeur reçoit",
    edome: "E-Dome sur le prix de vente",
    edomeZero: "0 CHF",
    direct: "Le prix se règle directement entre acheteur et vendeur, chez le notaire. E-Dome ne prend rien sur le prix de vente et ne négocie pour personne.",
    primeTitle: (amount: string) => `Prime de mise en relation : ${amount}`,
    primeText: "Ce vendeur a activé une prime. Elle est payée par le vendeur seul, et seulement s'il accepte une mise en relation proposée par un apporteur. Vous ne payez rien de plus.",
    primeFlowLabel: "Prime payée par le vendeur",
    primeBeneficiary: "L'apporteur reçoit",
    invalid: "Saisissez un montant valide.",
    sent: (name: string) => `Offre transmise à ${name}. Retrouvez-la dans vos messages.`,
  },
  similar: {
    title: "Biens similaires",
    subtitle: {
      vente: "À vendre, près d'ici et dans la même gamme de prix",
      "location-lt": "À louer à l'année, près d'ici",
      "location-ct": "Séjours à la nuit, dans la région",
    },
  },
  yield: {
    badge: (pct: string) => `${pct} brut estimé`,
    title: "Rendement brut estimé",
    basis: (n: number, perM2: string) => `Sur ${n} loyer${n > 1 ? "s" : ""} comparable${n > 1 ? "s" : ""} du catalogue · ${perM2} CHF/m²/mois`,
    rent: "Loyer mensuel estimé",
    note: "Estimation E-Dome : loyer médian au m² des locations à l'année voisines × surface × 12, rapporté au prix. Ce n'est pas une promesse de rendement.",
    priceM2: "Prix au m²",
  },
  sold: "Ce bien a été vendu. Il reste consultable, mais n'est plus proposé.",
  own: "C'est votre propre annonce : les demandes des autres arrivent dans votre messagerie.",
  report: {
    sent: "Signalement envoyé. L'équipe de modération le traite sous 24 h.",
  },
  qr: {
    title: "Lien de recommandation",
    copied: "Lien copié : collez-le dans un générateur de QR code ou partagez-le tel quel.",
  },
  boost: {
    done: (days: number) => `Mise en avant de ${days} jours enregistrée pour ce bien.`,
  },
  contactSubmit: (name: string) => `Contacter ${name}`,
  referral: {
    leadPrime: (amount: string) =>
      `Une prime de ${amount} est active sur ce bien. Présentez un contact sérieux : si le propriétaire accepte la mise en relation, la prime vous est versée, que l'affaire se conclue ou non.`,
    leadNoPrime: "Partagez ce bien avec votre réseau. Si le propriétaire active une prime, elle est due quand il accepte le contact que vous lui présentez — jamais un pourcentage du prix.",
    leadMarketplace: "Partagez ce séjour : une part du prix vous revient, prélevée sur la marge de l'hôte, jamais ajoutée au prix payé par le voyageur.",
  },
} as const;
