/* ── Catalogue produits — SOURCE UNIQUE DE VÉRITÉ ────────────────────────────

   Avant ce module, le catalogue existait en deux exemplaires divergents :
   - `app/(app)/boutique/page.tsx` listait 16 produits (b1→b16) ;
   - `app/(app)/boutique/[id]/page.tsx` n'en définissait que 6 (b1→b6) et
     exportait son tableau, que la page liste et `/apporteurs` importaient
     à l'envers depuis un module de route.

   Conséquence directe : les 10 fiches b7→b16 renvoyaient `notFound()`. Plus
   de six produits sur dix affichés dans la boutique menaient à une erreur, et
   le catalogue d'annonces de `/apporteurs` était tronqué au même endroit.

   Ce module réunit les deux jeux, complète les 10 fiches manquantes et
   devient le seul point d'entrée. Les pages n'importent plus rien l'une de
   l'autre.

   ── Normalisation des vendeurs ──
   Les champs vendeur étaient répétés sur chaque produit, ce qui laissait
   dériver un même vendeur d'une fiche à l'autre (ElectroMax apparaît sur 3
   produits, Bois & Co. sur 2, Maison Léman sur 2, Atelier Argile sur 2).
   Ils sont désormais déclarés une fois dans `VENDORS` puis aplatis sur le
   produit à la construction — la forme consommée par les pages reste plate,
   donc leur rendu n'a pas eu à changer.

   ── Migration Supabase ──
   Les accesseurs du bas de fichier sont la couture. Ils sont synchrones
   aujourd'hui parce que les pages boutique sont encore des Client Components.
   Quand ces pages passeront en Server Components, ajouter ici des variantes
   `async` lisant Supabase : les appelants changent d'`await`, pas de forme.
   Cible : tables `products`, `product_media`, `profiles` (vendeur).

   ── Affiliation (Mission 2, P4b — `DECISIONS-2.md` §D5) ──
   La boutique n'est PAS un marketplace. E-Dome référence ces produits et
   redirige vers le marchand, qui garde le contrat de vente, la livraison, la
   garantie et la TVA (motif : art. 20a LTVA, `DECISIONS.md` §1.8). Le prix
   affiché est le prix indicatif du marchand ; la rémunération d'E-Dome est
   payée par le marchand, jamais ajoutée à l'acheteur. D'où l'absence de toute
   note ou de tout avis produit dans ce catalogue. Les URLs d'images mortes
   relevées par l'audit (8 identifiants Unsplash en 404) ont été remplacées. */

export type Condition = "Neuf" | "Reconditionné" | "Occasion";

export interface ProductSpec {
  label: string;
  value: string;
}

/** Marchand partenaire — une ENTREPRISE, déclarée une seule fois.

    Ni note, ni nombre d'avis, ni « membre depuis », ni taux de réponse : ce
    sont des signaux de marketplace. En affiliation, E-Dome ne voit aucune
    transaction du marchand et ne peut donc rien attester à son sujet
    (`DECISIONS-2.md` §D5 — un avis exige une transaction). */
export interface Vendor {
  name: string;
  /** Vignette de l'enseigne : une photo de produit, jamais un visage. */
  avatar: string;
  city: string;
  /** Délai d'expédition annoncé PAR LE MARCHAND, ex. "< 24 h". */
  shipsIn: string;
}

/** Produit tel que consommé par les pages : vendeur aplati, `cover` dérivé. */
export interface Product {
  id: string;
  title: string;
  category: string;
  /** Première image de la galerie — évite de stocker deux fois la même URL. */
  cover: string;
  gallery: string[];
  price: number;
  oldPrice?: number;
  /** Suffixe de prix quand le produit est vendu au lot, ex. "/ 18 m²". */
  unit?: string;
  condition: Condition;
  /** Disponibilité indicative déclarée par le marchand (E-Dome ne tient aucun stock). */
  stock: number;
  /* Aucune note, aucun nombre d'avis, aucun compteur « vendus » : l'achat se
     fait chez le marchand, E-Dome n'a aucune transaction à laquelle rattacher
     un avis (`ReviewCompliance`, transactionId obligatoire). */
  /** Frais de port en CHF annoncés par le marchand. 0 = gratuit. */
  shipping: number;
  shippingDays: string;
  /** Jours de rétractation. 0 = non repris (sur mesure). */
  returnDays: number;
  description: string;
  specs: ProductSpec[];
  /** Identifiant du marchand : le SEUL à qui un revenu de ce produit peut revenir. */
  vendorId: VendorId;
  vendor: string;
  vendorAvatar: string;
  vendorCity: string;
  vendorShipsIn: string;
}

/* ── Vendeurs ────────────────────────────────────────────────────────────── */

/* Les vendeurs de la boutique sont des enseignes, pas des personnes : leur
   vignette est une photo de produit, jamais un portrait (D16 — aucun visage
   réel ; tout visage de personne vient de l'annuaire). */
const VENDORS = {
  "maison-leman": {
    name: "Maison Léman",
    avatar: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&h=60&fit=crop",
    city: "Lausanne",
    shipsIn: "< 12 h",
  },
  "studio-verbier": {
    name: "Studio Verbier",
    avatar: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=60&h=60&fit=crop",
    city: "Verbier",
    shipsIn: "< 24 h",
  },
  "bois-et-co": {
    name: "Bois & Co.",
    avatar: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=60&h=60&fit=crop",
    city: "Bulle",
    shipsIn: "< 12 h",
  },
  "cuisinea-geneva": {
    name: "Cuisinea Geneva",
    avatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=60&h=60&fit=crop",
    city: "Genève",
    shipsIn: "< 48 h",
  },
  "plumbing-pro": {
    name: "Plumbing Pro",
    avatar: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=60&h=60&fit=crop",
    city: "Zurich",
    shipsIn: "< 24 h",
  },
  electromax: {
    name: "ElectroMax",
    avatar: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop",
    city: "Bâle",
    shipsIn: "< 24 h",
  },
  "deco-studio": {
    name: "Deco Studio",
    avatar: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=60&h=60&fit=crop",
    city: "Neuchâtel",
    shipsIn: "< 24 h",
  },
  tilemaster: {
    name: "TileMaster",
    avatar: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=60&h=60&fit=crop",
    city: "Sion",
    shipsIn: "< 24 h",
  },
  "atelier-argile": {
    name: "Atelier Argile",
    avatar: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=60&h=60&fit=crop",
    city: "Fribourg",
    shipsIn: "< 12 h",
  },
  "linen-house": {
    name: "Linen House",
    avatar: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=60&h=60&fit=crop",
    city: "Vevey",
    shipsIn: "< 24 h",
  },
  "outils-repares": {
    name: "OutilsRéparés",
    avatar: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=60&h=60&fit=crop",
    city: "Genève",
    shipsIn: "< 48 h",
  },
} as const satisfies Record<string, Vendor>;

export type VendorId = keyof typeof VENDORS;

/* ── Produits (graine) ───────────────────────────────────────────────────── */

const U = "https://images.unsplash.com/photo-";

/** Forme stockée : référence le vendeur, ne duplique pas son profil. */
type ProductSeed = Omit<
  Product,
  | "cover"
  | "vendorId"
  | "vendor"
  | "vendorAvatar"
  | "vendorCity"
  | "vendorShipsIn"
> & { vendorId: VendorId };

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    id: "b1",
    title: "Canapé d'angle modulable lin naturel",
    category: "Meubles",
    vendorId: "maison-leman",
    price: 2490,
    oldPrice: 2890,
    stock: 4,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "3-5 j",
    returnDays: 30,
    description:
      "Canapé d'angle 5 places modulable, recouvert en lin naturel hypoallergénique. Mousse haute densité, structure en hêtre massif. Livraison incluse en Suisse romande, montage sur demande.",
    specs: [
      { label: "Dimensions", value: "320 × 215 × 84 cm" },
      { label: "Tissu", value: "Lin naturel, déhoussable" },
      { label: "Structure", value: "Hêtre massif" },
      { label: "Garantie", value: "5 ans" },
    ],
    gallery: [
      `${U}1555041469-a586c61ea9bc?w=1000`,
      `${U}1567538096630-e0c55bd6374c?w=1000`,
      `${U}1540574163026-643ea20ade25?w=1000`,
    ],
  },
  {
    id: "b2",
    title: "Lampadaire design laiton noir",
    category: "Décoration",
    vendorId: "studio-verbier",
    price: 389,
    stock: 12,
    condition: "Neuf",
    shipping: 12,
    shippingDays: "2-4 j",
    returnDays: 14,
    description:
      "Lampadaire industriel en laiton noir mat, bras articulé, abat-jour orientable. Pour salon, bureau ou coin lecture. Ampoule E27 LED chaude incluse.",
    specs: [
      { label: "Hauteur max.", value: "175 cm" },
      { label: "Matériau", value: "Laiton noir mat" },
      { label: "Ampoule", value: "E27 LED 9 W incluse" },
      { label: "Garantie", value: "2 ans" },
    ],
    gallery: [
      `${U}1565538810643-b5bdb714032a?w=1000`,
      `${U}1513506003901-1e6a229e2d15?w=1000`,
      `${U}1513475382585-d06e58bcb0e0?w=1000`,
    ],
  },
  {
    id: "b3",
    title: "Parquet chêne massif huilé — 18 m²",
    category: "Matériaux",
    vendorId: "bois-et-co",
    price: 1480,
    unit: "/ 18 m²",
    stock: 22,
    condition: "Neuf",
    shipping: 89,
    shippingDays: "7-10 j",
    returnDays: 14,
    description:
      "Parquet en chêne massif huilé à chaud, lames de 20 cm de large. Origine France, certifié PEFC. Prix pour 18 m² couvrant une pièce standard.",
    specs: [
      { label: "Essence", value: "Chêne massif" },
      { label: "Finition", value: "Huilé à chaud" },
      { label: "Largeur lame", value: "20 cm" },
      { label: "Surface couverte", value: "18 m²" },
    ],
    gallery: [
      `${U}1583847268964-b28dc8f51f92?w=1000`,
      `${U}1505691938895-1758d7feb511?w=1000`,
    ],
  },
  {
    id: "b4",
    title: "Cuisine sur mesure noyer + îlot quartz",
    category: "Cuisines",
    vendorId: "cuisinea-geneva",
    price: 18900,
    stock: 1,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "Sur RDV",
    returnDays: 0,
    description:
      "Cuisine sur mesure linéaire 4,2 m + îlot central 1,8 m. Façades en placage noyer, plan de travail quartz blanc 30 mm. Devis et plans inclus, pose réalisée par notre équipe en 3 semaines.",
    specs: [
      { label: "Linéaire", value: "4,2 m + îlot 1,8 m" },
      { label: "Façades", value: "Placage noyer huilé" },
      { label: "Plan de travail", value: "Quartz 30 mm" },
      { label: "Pose", value: "Incluse — 3 semaines" },
    ],
    gallery: [
      `${U}1556909114-f6e7ad7d3136?w=1000`,
      `${U}1556910103-1c02745aae4d?w=1000`,
    ],
  },
  {
    id: "b5",
    title: "Robinet mitigeur cuivre brossé",
    category: "Équipements",
    vendorId: "plumbing-pro",
    price: 245,
    stock: 35,
    condition: "Neuf",
    shipping: 9,
    shippingDays: "2-3 j",
    returnDays: 30,
    description:
      "Mitigeur d'évier cuivre brossé, bec haut orientable 360°. Cartouche céramique, économiseur d'eau intégré. Compatible avec toutes installations standards.",
    specs: [
      { label: "Hauteur", value: "32 cm" },
      { label: "Finition", value: "Cuivre brossé" },
      { label: "Cartouche", value: "Céramique 25 mm" },
      { label: "Garantie", value: "10 ans" },
    ],
    gallery: [
      `${U}1620626011761-996317b8d101?w=1000`,
      `${U}1584622650111-993a426fbf0a?w=1000`,
    ],
  },
  {
    id: "b6",
    title: "Lave-vaisselle encastrable A+++",
    category: "Électroménager",
    vendorId: "electromax",
    price: 1290,
    oldPrice: 1490,
    stock: 8,
    condition: "Reconditionné",
    shipping: 49,
    shippingDays: "5-7 j",
    returnDays: 30,
    description:
      "Lave-vaisselle 60 cm encastrable totalement intégrable, classe A+++. 14 couverts, 6 programmes, fonction silence (38 dB). Installation par notre équipe en option.",
    specs: [
      { label: "Largeur", value: "60 cm" },
      { label: "Capacité", value: "14 couverts" },
      { label: "Classe énergie", value: "A+++" },
      { label: "Bruit", value: "38 dB" },
    ],
    gallery: [
      `${U}1610557892470-55d9e80c0bce?w=1000`,
      `${U}1556911220-bff31c812dba?w=1000`,
    ],
  },

  /* ── Fiches complétées : ces 10 produits étaient listés dans la boutique
        mais absents du détail, et renvoyaient donc `notFound()`. ── */

  {
    id: "b7",
    title: "Table basse marbre travertin",
    category: "Meubles",
    vendorId: "maison-leman",
    price: 690,
    stock: 6,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "3-5 j",
    returnDays: 30,
    description:
      "Table basse ronde en travertin naturel, piètement central massif. Chaque pièce présente un veinage unique. Traitement hydrofuge appliqué en atelier, livraison en Suisse romande incluse.",
    specs: [
      { label: "Diamètre", value: "90 cm" },
      { label: "Hauteur", value: "32 cm" },
      { label: "Matériau", value: "Travertin naturel" },
      { label: "Poids", value: "48 kg" },
    ],
    gallery: [
      `${U}1554995207-c18c203602cb?w=1000`,
      `${U}1540574163026-643ea20ade25?w=1000`,
    ],
  },
  {
    id: "b8",
    title: "Set de 4 chaises bouclette écru",
    category: "Meubles",
    vendorId: "deco-studio",
    price: 980,
    unit: "/ lot de 4",
    stock: 14,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "3-5 j",
    returnDays: 30,
    description:
      "Lot de 4 chaises de salle à manger en tissu bouclette écru, piètement chêne clair. Assise rembourrée haute densité, housses déhoussables et lavables à 30 °C.",
    specs: [
      { label: "Dimensions", value: "48 × 55 × 82 cm" },
      { label: "Tissu", value: "Bouclette polyester recyclé" },
      { label: "Piètement", value: "Chêne massif clair" },
      { label: "Garantie", value: "3 ans" },
    ],
    gallery: [
      `${U}1592078615290-033ee584e267?w=1000`,
      `${U}1567538096630-e0c55bd6374c?w=1000`,
    ],
  },
  {
    id: "b9",
    title: "Carrelage grès cérame XXL — 24 m²",
    category: "Matériaux",
    vendorId: "tilemaster",
    price: 2160,
    unit: "/ 24 m²",
    stock: 18,
    condition: "Neuf",
    shipping: 120,
    shippingDays: "7-12 j",
    returnDays: 14,
    description:
      "Grès cérame rectifié grand format effet pierre, pose intérieure et terrasse. Antidérapant R10, résistant au gel. Prix pour 24 m², soit une pièce de séjour standard.",
    specs: [
      { label: "Format", value: "120 × 120 cm" },
      { label: "Épaisseur", value: "9 mm" },
      { label: "Adhérence", value: "R10 — A+B" },
      { label: "Surface couverte", value: "24 m²" },
    ],
    gallery: [
      `${U}1615875605825-5eb9bb5d52ac?w=1000`,
      `${U}1505691938895-1758d7feb511?w=1000`,
    ],
  },
  {
    id: "b10",
    title: "Vase grès noir mat — 35 cm",
    category: "Décoration",
    vendorId: "atelier-argile",
    price: 65,
    stock: 22,
    condition: "Neuf",
    shipping: 7,
    shippingDays: "2-3 j",
    returnDays: 14,
    description:
      "Vase tourné à la main en grès noir, émail mat intérieur étanche. Pièce d'atelier : les variations de teinte et de galbe sont propres à chaque exemplaire.",
    specs: [
      { label: "Hauteur", value: "35 cm" },
      { label: "Diamètre", value: "18 cm" },
      { label: "Matériau", value: "Grès émaillé noir mat" },
      { label: "Fabrication", value: "Tourné main, Fribourg" },
    ],
    gallery: [
      `${U}1578500494198-246f612d3b3d?w=1000`,
      `${U}1513475382585-d06e58bcb0e0?w=1000`,
    ],
  },
  {
    id: "b11",
    title: "Plaid lin lavé bleu nuit",
    category: "Décoration",
    vendorId: "linen-house",
    price: 89,
    stock: 14,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "2-4 j",
    returnDays: 30,
    description:
      "Plaid en lin lavé pur, tissé en Europe, finition ourlet main. Le lin lavé s'assouplit à chaque lavage sans perdre sa tenue. Lavable en machine à 40 °C.",
    specs: [
      { label: "Dimensions", value: "140 × 200 cm" },
      { label: "Matière", value: "100 % lin lavé" },
      { label: "Grammage", value: "270 g/m²" },
      { label: "Entretien", value: "Machine 40 °C" },
    ],
    gallery: [
      `${U}1576020799627-aeac74d58064?w=1000`,
      `${U}1578500494198-246f612d3b3d?w=1000`,
    ],
  },
  {
    id: "b12",
    title: "Four pyrolyse encastrable 71 L",
    category: "Électroménager",
    vendorId: "electromax",
    price: 749,
    oldPrice: 899,
    stock: 11,
    condition: "Neuf",
    shipping: 35,
    shippingDays: "5-7 j",
    returnDays: 30,
    description:
      "Four multifonction 71 L à nettoyage pyrolyse, 9 modes de cuisson dont chaleur tournante et sole pulsée. Porte froide 3 vitrages, rails télescopiques inclus.",
    specs: [
      { label: "Volume", value: "71 L" },
      { label: "Nettoyage", value: "Pyrolyse 3 cycles" },
      { label: "Classe énergie", value: "A+" },
      { label: "Garantie", value: "2 ans" },
    ],
    gallery: [
      `${U}1556911220-bff31c812dba?w=1000`,
      `${U}1610557892470-55d9e80c0bce?w=1000`,
    ],
  },
  {
    id: "b13",
    title: "Plan de travail bois massif chêne",
    category: "Cuisines",
    vendorId: "bois-et-co",
    price: 540,
    stock: 9,
    condition: "Neuf",
    shipping: 65,
    shippingDays: "5-8 j",
    returnDays: 14,
    description:
      "Plan de travail en chêne massif lamellé-collé, chants prêts à poncer. Livré brut huilé, découpe évier et plaque réalisable sur demande à l'atelier.",
    specs: [
      { label: "Dimensions", value: "300 × 65 cm" },
      { label: "Épaisseur", value: "38 mm" },
      { label: "Essence", value: "Chêne massif lamellé" },
      { label: "Finition", value: "Huilé, à entretenir" },
    ],
    gallery: [
      `${U}1556910103-1c02745aae4d?w=1000`,
    ],
  },
  {
    id: "b14",
    title: "Perceuse visseuse 18 V (occasion testée)",
    category: "Équipements",
    vendorId: "outils-repares",
    price: 89,
    oldPrice: 159,
    stock: 3,
    condition: "Occasion",
    shipping: 12,
    shippingDays: "3-5 j",
    returnDays: 14,
    description:
      "Perceuse visseuse 18 V révisée en atelier : moteur contrôlé, mandrin remplacé, batterie testée à plus de 85 % de sa capacité d'origine. Livrée avec chargeur et coffret.",
    specs: [
      { label: "Tension", value: "18 V" },
      { label: "Couple max.", value: "54 Nm" },
      { label: "Batterie", value: "2 Ah — capacité > 85 %" },
      { label: "Garantie", value: "6 mois atelier" },
    ],
    gallery: [
      `${U}1504148455328-c376907d081c?w=1000`,
      `${U}1572981779307-38b8cabb2407?w=1000`,
    ],
  },
  {
    id: "b15",
    title: "Suspension cuivre artisanale",
    category: "Décoration",
    vendorId: "atelier-argile",
    price: 215,
    stock: 8,
    condition: "Neuf",
    shipping: 15,
    shippingDays: "2-3 j",
    returnDays: 14,
    description:
      "Suspension en cuivre martelé à la main, intérieur poli qui diffuse une lumière chaude. Câble textile tressé de 150 cm, rosace assortie. Douille E27.",
    specs: [
      { label: "Diamètre", value: "28 cm" },
      { label: "Matériau", value: "Cuivre martelé main" },
      { label: "Câble", value: "Textile tressé 150 cm" },
      { label: "Douille", value: "E27 — ampoule non incluse" },
    ],
    gallery: [
      `${U}1513506003901-1e6a229e2d15?w=1000`,
      `${U}1565538810643-b5bdb714032a?w=1000`,
    ],
  },
  {
    id: "b16",
    title: "Hotte aspirante îlot inox",
    category: "Électroménager",
    vendorId: "electromax",
    price: 1190,
    stock: 4,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "7-10 j",
    returnDays: 30,
    description:
      "Hotte îlot suspendue en inox brossé, débit 700 m³/h, 4 vitesses avec temporisation. Éclairage LED périmétrique, filtres métalliques lavables au lave-vaisselle.",
    specs: [
      { label: "Dimensions", value: "90 × 60 cm" },
      { label: "Débit max.", value: "700 m³/h" },
      { label: "Bruit", value: "52 dB en vitesse 3" },
      { label: "Filtration", value: "Métal lavable + charbon" },
    ],
    gallery: [
      `${U}1556912173-3bb406ef7e77?w=1000`,
      `${U}1556909114-f6e7ad7d3136?w=1000`,
    ],
  },
];

/* ── Construction ────────────────────────────────────────────────────────── */

function hydrate(seed: ProductSeed): Product {
  const { vendorId, ...rest } = seed;
  const v = VENDORS[vendorId];
  return {
    ...rest,
    vendorId,
    /* `cover` n'est pas stocké : c'est toujours la première image. Évite le
       cas où la vignette de liste et la galerie de fiche divergent. */
    cover: seed.gallery[0],
    vendor: v.name,
    vendorAvatar: v.avatar,
    vendorCity: v.city,
    vendorShipsIn: v.shipsIn,
  };
}

/** Les 16 produits du catalogue, vendeur aplati. */
export const PRODUCTS: Product[] = PRODUCT_SEEDS.map(hydrate);

/* ── Accesseurs (la couture vers Supabase) ───────────────────────────────── */

export function listProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function listProductIds(): string[] {
  return PRODUCTS.map((p) => p.id);
}

export function listProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** Catégories réellement présentes, avec leur volume. */
export function listProductCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of PRODUCTS) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts].map(([category, count]) => ({ category, count }));
}

/** Suggestions pour une fiche : même catégorie d'abord, complété si besoin. */
export function listRelatedProducts(id: string, limit = 4): Product[] {
  const ref = getProductById(id);
  if (!ref) return [];
  const sameCategory = PRODUCTS.filter((p) => p.id !== id && p.category === ref.category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = PRODUCTS.filter((p) => p.id !== id && p.category !== ref.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function getVendor(id: VendorId): Vendor {
  return VENDORS[id];
}
