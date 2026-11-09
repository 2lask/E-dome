import type { Profile, ProfileVisibility, PersonSummary, Experience, Education, ProfileLanguage, LanguageLevel } from "./profile-types";
import { CURRENT_USER } from "./demo/identity";
import { DIRECTORY, personById, requirePerson } from "./demo/directory";
import { followersOf, followingOf } from "./demo/social";
import { roleLabel } from "./model/role-labels";

/* ─── Données de profil (démo) ────────────────────────────────────────────
   - DEFAULT_PROFILE : mon profil (Léo), source initiale du contexte, ensuite
     persisté dans localStorage et éditable.
   - getMockProfile(id) : profil public d'une personne de l'annuaire
     (/profil/[id]). Les seize sont enrichies à la main (chantier P1, « le
     casting des seize ») : titre, « À propos » écrit dans LEUR registre,
     parcours aux dates cohérentes avec leur âge, langues plausibles. */

const DEFAULT_VISIBILITY: ProfileVisibility = {
  isPublic: true,
  showEmail: false,
  showPhone: false,
  showStats: true,
  hiddenSections: [],
};

/* ── Petits constructeurs, pour que chaque fiche se relise d'un coup d'œil ── */

function exp(
  id: string,
  title: string,
  company: string,
  location: string,
  start: [month: number, year: number],
  end: [month: number, year: number] | null,
  description: string,
  employmentType: Experience["employmentType"] = "temps-plein",
): Experience {
  return {
    id,
    title,
    company,
    employmentType,
    location,
    current: end === null,
    startMonth: start[0],
    startYear: start[1],
    ...(end ? { endMonth: end[0], endYear: end[1] } : {}),
    description,
  };
}

function edu(id: string, school: string, degree: string, field: string, startYear: number, endYear: number): Education {
  return { id, school, degree, field, startYear, endYear };
}

function langs(prefix: string, items: [name: string, level: LanguageLevel][]): ProfileLanguage[] {
  return items.map(([name, level], i) => ({ id: `lg-${prefix}-${i}`, name, level }));
}

/* L'identité vient de demo/identity ; les compteurs (abonnés, suivis, avis,
   note) de l'annuaire, où ils sont DÉRIVÉS du graphe FOLLOWS et des avis
   réellement reçus. Le profil courant ne recopie aucun nombre. */
const ME = requirePerson(CURRENT_USER.id);

export const DEFAULT_PROFILE: Profile = {
  id: CURRENT_USER.id,
  firstName: CURRENT_USER.firstName,
  lastName: CURRENT_USER.lastName,
  email: CURRENT_USER.email,
  phone: CURRENT_USER.phone,
  avatar: CURRENT_USER.avatar,
  banner: CURRENT_USER.banner,
  headline: CURRENT_USER.headline,
  location: { city: CURRENT_USER.city, country: CURRENT_USER.country },
  roles: [...CURRENT_USER.roles],
  about: CURRENT_USER.about,
  experiences: [
    exp("exp-2", "Propriétaire bailleur et hôte", "Portefeuille privé", "Suisse romande", [6, 2015], null,
      "Trois logements en courte durée (Verbier, Genève, Lausanne) et un appartement loué à l'année à Renens, gérés en direct : annonces, accueil, ménage, comptabilité.",
      "independant"),
    exp("exp-3", "Conseiller en gestion de patrimoine", "Banque cantonale", "Genève, Suisse", [9, 2011], [5, 2015],
      "Conseil en placement et en financement immobilier pour une clientèle privée."),
  ],
  education: [
    edu("edu-1", "HEC Lausanne (UNIL)", "Master en finance", "Finance & immobilier", 2008, 2010),
    edu("edu-2", "Sandrine Monnier (formation en ligne)", "Fiscalité immobilière en Suisse romande", "Fiscalité du bailleur", 2026, 2026),
  ],
  skills: [
    { id: "sk-1", name: "Location courte durée" },
    { id: "sk-2", name: "Gestion locative" },
    { id: "sk-3", name: "Rendement net" },
    { id: "sk-4", name: "Fiscalité du bailleur" },
    { id: "sk-5", name: "Accueil voyageurs" },
  ],
  languages: langs("me", [["Français", "natif"], ["Anglais", "courant"], ["Allemand", "intermediaire"]]),
  certifications: [],
  links: [{ id: "ln-2", type: "linkedin", url: "https://linkedin.com/in/leomartin", label: "LinkedIn" }],
  visibility: DEFAULT_VISIBILITY,
  meta: { verified: true, membreFondateur: false, memberSince: CURRENT_USER.memberSince },
  stats: {
    followers: ME.stats.followers,
    following: ME.stats.following,
    rating: ME.stats.rating,
    reviewsCount: ME.stats.reviews,
  },
};

// ─── Profils publics (les quinze autres) ──────────────────────────────────

/* Un profil public dérive de l'ANNUAIRE (demo/directory) : prénom, nom, avatar,
   ville, pays, rôles, abonnés, avis, note viennent de la personne de `users[]`.
   `PUBLIC_SEEDS` ne porte que les ENRICHISSEMENTS « façon LinkedIn » : titre,
   présentation longue (dans la voix de la personne), bannière, parcours,
   compétences, langues, liens, date d'arrivée sur la plateforme.

   Les dates de parcours suivent l'âge du casting (2026) : un CFC à 16-19 ans,
   un diplôme universitaire vers 23-25 ans, des carrières qui tiennent. Aucun
   texte ne nomme le rôle retiré par D16 : on dit agent, agente, agence. */
type PublicSeed = {
  headline: string;
  about: string;
  banner: string;
  memberSince: string;
  experiences: Profile["experiences"];
  education: Profile["education"];
  skills: string[];
  languages: Profile["languages"];
  links?: Profile["links"];
};

const BANNER = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&h=400&fit=crop`;

const PUBLIC_SEEDS: Record<string, PublicSeed> = {
  /* Céline Bovard, 46 ans — chaleureuse, précise, parle des biens comme des
     lieux de vie. */
  "user-002": {
    banner: BANNER("1564013799919-ab600027ffc6"),
    headline: "Agente immobilière indépendante · Lavaux et Lutry",
    about:
      "Je vends des maisons et des appartements entre Lutry et Chexbres depuis bientôt vingt ans, dont dix à mon compte. Une maison vigneronne ne se vend pas comme un attique : il faut savoir raconter la cave, la lumière du soir sur les terrasses, le passage du bateau en contrebas. Je travaille avec une petite équipe de confiance — Nikola Ristić pour les photos, Elena Currat pour le home staging — et je suis chaque vente moi-même, de l'estimation à la signature chez le notaire. Un café à Lutry vaut souvent mieux qu'un long message : n'hésitez pas.",
    memberSince: "2025-09-20",
    experiences: [
      exp("exp-ce-1", "Agente immobilière indépendante", "Céline Bovard Immobilier", "Lutry, Suisse", [3, 2015], null,
        "Vente de maisons vigneronnes, de villas et d'appartements vue lac dans le Lavaux et à Lutry. Estimation, mise en valeur, accompagnement des vendeurs et des acquéreurs jusqu'à l'acte.",
        "independant"),
      exp("exp-ce-2", "Conseillère en vente immobilière", "Régie lausannoise", "Lausanne, Suisse", [9, 2007], [2, 2015],
        "Vente de résidences principales sur Lausanne et l'Est lausannois."),
      exp("exp-ce-3", "Assistante de gérance", "Gérance de la Riviera", "Vevey, Suisse", [8, 2002], [8, 2007],
        "Baux, états des lieux, relation avec les locataires."),
    ],
    education: [
      edu("edu-ce-1", "USPI Formation", "Brevet fédéral d'agente immobilière", "Transaction immobilière", 2009, 2011),
      edu("edu-ce-2", "École professionnelle commerciale de Lausanne", "CFC d'employée de commerce", "Branche immobilière", 1996, 1999),
    ],
    skills: ["Biens de caractère", "Estimation", "Lavaux", "Mise en valeur", "Négociation", "Accompagnement des acquéreurs"],
    languages: langs("ce", [["Français", "natif"], ["Allemand", "courant"], ["Anglais", "intermediaire"]]),
  },
  /* Ennio Bordoni, 61 ans — froid, chiffré, phrases courtes, aucune émotion. */
  "user-003": {
    banner: BANNER("1454165804606-c3d57bc86b40"),
    headline: "Investisseur · ancien banquier privé · Genève",
    about:
      "Banquier privé pendant dix-sept ans. Investisseur depuis 2016. Six appartements entre Genève et Vevey : deux en courte durée, deux en longue durée, un en vente, un acheté cette année à Lutry. Critère unique : le rendement net après charges, impôts et vacance. Je ne commente pas les tendances. Je ne réponds pas aux messages sans chiffres.",
    memberSince: "2025-11-04",
    experiences: [
      exp("exp-en-1", "Investisseur privé", "Indépendant", "Genève, Suisse", [1, 2016], null,
        "Portefeuille locatif résidentiel, Vaud et Genève. Sélection au rendement net. Gestion déléguée pour la longue durée, directe pour la courte durée.",
        "independant"),
      exp("exp-en-2", "Directeur, gestion de fortune", "Banque privée genevoise", "Genève, Suisse", [4, 1998], [12, 2015],
        "Gestion de fortune pour une clientèle privée italienne et suisse. Financements hypothécaires."),
      exp("exp-en-3", "Analyste crédit", "Banque commerciale", "Milan, Italie", [10, 1990], [3, 1998],
        "Analyse de crédits aux entreprises et de financements immobiliers."),
    ],
    education: [
      edu("edu-en-1", "Università Bocconi", "Laurea in Economia aziendale", "Finance", 1984, 1989),
    ],
    skills: ["Rendement net", "Financement hypothécaire", "Analyse de portefeuille", "Fiscalité du bailleur"],
    languages: langs("en", [["Italien", "natif"], ["Français", "bilingue"], ["Anglais", "courant"], ["Allemand", "intermediaire"]]),
  },
  /* Aline Tschanz, 33 ans — jeune pro dynamique, organisée. */
  "user-004": {
    banner: BANNER("1560518883-ce09059eeffa"),
    headline: "Agente immobilière · Hartmann Immobilier SA · Neuchâtel",
    about:
      "Chez Hartmann Immobilier depuis 2021, je m'occupe des ventes et des locations entre Neuchâtel, La Gruyère et le Nord vaudois. Ma méthode : un dossier complet dès la première visite, des visites groupées le samedi matin, et une réponse dans la journée. En ce moment : un 3,5 pièces rénové Minergie rue des Parcs, une maison à Bulle, et deux appartements à louer (Neuchâtel, Yverdon). Écrivez-moi, je vous rappelle.",
    memberSince: "2025-09-12",
    experiences: [
      exp("exp-al-1", "Agente immobilière", "Hartmann Immobilier SA", "Neuchâtel, Suisse", [4, 2021], null,
        "Vente et location : estimation avec la direction, dossiers de vente, visites, suivi des acquéreurs et des locataires."),
      exp("exp-al-2", "Assistante de gérance", "Gérance des Montagnes neuchâteloises", "La Chaux-de-Fonds, Suisse", [8, 2016], [3, 2021],
        "Baux, états des lieux, décomptes de charges."),
    ],
    education: [
      edu("edu-al-1", "USPI Formation", "Brevet fédéral de gérante d'immeubles", "Gestion immobilière", 2022, 2024),
      edu("edu-al-2", "CPLN, Neuchâtel", "CFC d'employée de commerce", "Branche fiduciaire et immobilière", 2009, 2012),
    ],
    skills: ["Visites", "Dossiers de vente", "Location", "Relation propriétaires", "Organisation"],
    languages: langs("al", [["Français", "natif"], ["Allemand", "courant"], ["Anglais", "courant"]]),
  },
  /* Nikola Ristić, 29 ans — écrit court et mal : pas d'accents, abréviations. */
  "user-005": {
    banner: BANNER("1600585154340-be6161a56a0c"),
    headline: "photographe immo · drone · visite 3d · yverdon",
    about:
      "salut, nikola, photographe immo depuis 2020. photos, drone, visite 3d, plans 2d. je bouge sur vaud + neuchatel + fribourg. livraison en 48h en general. pr un devis envoie moi l adresse, la surface et tes dispos, je reponds vite. dispo sam aussi",
    memberSince: "2025-10-01",
    experiences: [
      exp("exp-ni-1", "Photographe immobilier", "Indépendant", "Yverdon-les-Bains, Suisse", [2, 2020], null,
        "photos, drone, visites 3d, plans pr agences, particuliers et hotes", "independant"),
      exp("exp-ni-2", "Assistant photographe", "Studio photo lausannois", "Lausanne, Suisse", [9, 2017], [1, 2020],
        "shootings produits et mariages, retouche"),
    ],
    education: [
      edu("edu-ni-1", "CEPV, Vevey", "CFC de photographe", "Photographie", 2013, 2017),
      edu("edu-ni-2", "OFAC", "Permis de pilote de drone (catégorie ouverte)", "Drone", 2023, 2023),
    ],
    skills: ["Photo immobiliere", "Drone", "Visite 3D", "Plans 2D", "Retouche"],
    languages: langs("ni", [["Serbe", "natif"], ["Français", "bilingue"], ["Anglais", "intermediaire"]]),
  },
  /* Ana Ferreira, 34 ans — débutante, questions simples, polie. */
  "user-006": {
    banner: BANNER("1560448204-e02f11c3d0e2"),
    headline: "Cherche un 4 pièces à Renens ou Prilly",
    about:
      "Bonjour, je m'appelle Ana. Nous sommes arrivés de Porto l'année dernière avec mon mari et nos deux enfants. Nous habitons pour l'instant un 2 pièces à Renens, c'est trop petit. Nous cherchons un 4 pièces à Renens ou à Prilly, près des écoles. Je ne connais pas encore bien comment ça marche ici (la garantie, le dossier, l'attestation de poursuites…), alors je pose des questions. Merci beaucoup pour votre aide !",
    memberSince: "2026-07-18",
    experiences: [
      exp("exp-an-1", "Aide-soignante", "EMS de l'Ouest lausannois", "Renens, Suisse", [3, 2025], null,
        "Soins de base et accompagnement des résidents."),
      exp("exp-an-2", "Auxiliar de enfermagem", "Hôpital public", "Porto, Portugal", [9, 2013], [12, 2024],
        "Auxiliaire de soins en médecine interne."),
    ],
    education: [
      edu("edu-an-1", "Croix-Rouge vaudoise", "Certificat d'auxiliaire de santé", "Soins", 2025, 2025),
      edu("edu-an-2", "Escola profissional, Porto", "Cours professionnel d'auxiliaire de santé", "Soins", 2010, 2013),
    ],
    skills: ["Soins à la personne", "Accompagnement"],
    languages: langs("an", [["Portugais", "natif"], ["Français", "intermediaire"]]),
  },
  /* Bernard Chappuis, 72 ans — formules datées, quelques fautes. */
  "user-007": {
    banner: BANNER("1583608205776-bfd35f0d9f83"),
    headline: "Particulier · vend sa maison de Pully",
    about:
      "Ingénieur civil à la retraite depuis 2019. Mon épouse et moi avons habité notre maison de Pully pendant 41 ans, nos trois enfants y ont grandit. Elle est maintenant trop grande pour nous deux. J'ai décidé de la vendre moi même, sans agence, comme on faisait autrefois. Je réponds aux messages le matin, je ne suis pas trés rapide avec l'ordinateur. Avec mes meilleures salutations, Bernard Chappuis",
    memberSince: "2026-06-22",
    experiences: [
      exp("exp-be-1", "Ingénieur civil", "Bureau d'ingénieurs lausannois", "Lausanne, Suisse", [4, 1979], [6, 2019],
        "Ouvrages d'art et bâtiments. Chef de projet puis associé."),
    ],
    education: [
      edu("edu-be-1", "EPFL", "Diplôme d'ingénieur civil", "Génie civil", 1973, 1978),
    ],
    skills: ["Génie civil"],
    languages: langs("be", [["Français", "natif"], ["Allemand", "intermediaire"]]),
  },
  /* Clémence Jaquet, 27 ans — doute, pèse le pour et le contre. */
  "user-008": {
    banner: BANNER("1560185127-6ed189bf02f4"),
    headline: "Premier achat… ou pas encore ? · Morges",
    about:
      "Infirmière à Morges, 27 ans. Avec mon compagnon, on loue un 3 pièces et on se demande s'il faut acheter. D'un côté, le loyer part chaque mois ; de l'autre, les prix à Morges… et les taux, est-ce qu'ils vont remonter ? On a les 10 % de fonds propres, pas encore les 20. Je lis les avis de tout le monde ici avant de me décider. Si vous avez fait un premier achat récemment, je veux bien votre retour, même (surtout ?) s'il est négatif.",
    memberSince: "2026-03-08",
    experiences: [
      exp("exp-cl-1", "Infirmière", "Hôpital de Morges", "Morges, Suisse", [9, 2021], null,
        "Soins aigus, médecine interne."),
    ],
    education: [
      edu("edu-cl-1", "Haute école de santé (HES-SO)", "Bachelor en soins infirmiers", "Soins infirmiers", 2018, 2021),
      edu("edu-cl-2", "Gymnase de Morges", "Maturité gymnasiale", "Biologie et chimie", 2014, 2017),
    ],
    skills: ["Soins aigus"],
    languages: langs("cl", [["Français", "natif"], ["Anglais", "courant"]]),
  },
  /* Reto Jungo, 49 ans — technique, précis, bilingue. */
  "user-009": {
    banner: BANNER("1545324418-cc1a3fa10c00"),
    headline: "Architecte EPF SIA · rénovation énergétique · CECB · Fribourg",
    about:
      "Architecte EPF/SIA, bureau à Fribourg depuis 2010. Spécialité : la rénovation énergétique d'immeubles d'habitation des années 1950 à 1980 — enveloppe, fenêtres, production de chaleur, ventilation. J'établis le CECB Plus, le concept de travaux par étapes, les demandes de subventions (Programme Bâtiments, cantons) et je dirige le chantier. En cours : un immeuble de la rue des Parcs, à Neuchâtel, avec Hartmann Immobilier — CECB F → B. Je travaille indifféremment en français et en allemand. Gerne auch auf Deutsch.",
    memberSince: "2025-10-06",
    experiences: [
      exp("exp-re-1", "Architecte, associé fondateur", "Atelier Jungo Architectes", "Fribourg, Suisse", [3, 2010], null,
        "Rénovation et transformation de bâtiments d'habitation. Expertise CECB Plus, concepts énergétiques, direction des travaux.",
        "independant"),
      exp("exp-re-2", "Architecte de projet", "Bureau d'architectes bernois", "Berne, Suisse", [9, 2002], [2, 2010],
        "Logements collectifs, concours, exécution."),
    ],
    education: [
      edu("edu-re-1", "ETH Zürich", "Diplôme d'architecte EPF", "Architecture", 1996, 2002),
      edu("edu-re-2", "HEIA Fribourg", "CAS Énergie et bâtiment", "Rénovation énergétique", 2014, 2015),
    ],
    skills: ["Rénovation énergétique", "CECB Plus", "Minergie", "Direction de travaux", "Subventions"],
    languages: langs("re", [["Allemand", "natif"], ["Suisse allemand", "natif"], ["Français", "bilingue"], ["Anglais", "intermediaire"]]),
  },
  /* Elena Currat, 38 ans — enthousiaste, visuelle, sobre. */
  "user-010": {
    banner: BANNER("1600210491892-03d54c0aaf87"),
    headline: "Home staging · Riviera et Lavaux",
    about:
      "J'aime le moment où l'on ouvre une porte et où une pièce donne envie d'y rester. Depuis 2018, je prépare des appartements et des maisons pour la vente ou la location, sur la Riviera et dans le Lavaux : désencombrer, rééclairer, trois meubles bien placés, du linge, des fleurs. Rien de spectaculaire — tout est dans la justesse. Je travaille souvent avec Céline Bovard et Nikola Ristić : une maison bien préparée et bien photographiée se vend plus vite.",
    memberSince: "2025-10-14",
    experiences: [
      exp("exp-el-1", "Home stager", "Elena Currat Home Staging", "Vevey, Suisse", [5, 2018], null,
        "Préparation de biens à la vente et à la location : conseil, mise en scène, mobilier de location.",
        "independant"),
      exp("exp-el-2", "Décoratrice d'intérieur", "Magasin de mobilier", "Lausanne, Suisse", [9, 2010], [4, 2018],
        "Conseil en aménagement et en décoration."),
    ],
    education: [
      edu("edu-el-1", "HEAD – Genève", "Bachelor en architecture d'intérieur", "Architecture d'intérieur", 2007, 2010),
      edu("edu-el-2", "Formation continue", "Certificat de home staging", "Home staging", 2017, 2017),
    ],
    skills: ["Home staging", "Mise en scène photo", "Couleurs et lumière", "Mobilier de location"],
    languages: langs("el", [["Français", "natif"], ["Italien", "courant"], ["Anglais", "courant"]]),
  },
  /* Sandrine Monnier, 53 ans — pédagogue, structurée. */
  "user-011": {
    banner: BANNER("1554224155-6726b3ff858f"),
    headline: "Formatrice · fiscalité immobilière · ex-fiduciaire",
    about:
      "Pendant vingt ans en fiduciaire, j'ai vu les mêmes erreurs revenir dans les déclarations des propriétaires. J'ai donc décidé de les expliquer, une bonne fois, en trois temps : 1. ce que dit la loi ; 2. comment on le calcule ; 3. un cas réel, pas à pas. Mes formations couvrent la fiscalité du propriétaire et du bailleur en Suisse romande, et la préparation d'un premier achat. Je réponds aux questions des élèves dans la semaine. Précision : je ne remplis pas de déclarations pour des tiers — pour cela, adressez-vous à une fiduciaire.",
    memberSince: "2025-09-08",
    experiences: [
      exp("exp-sa-1", "Formatrice indépendante", "Indépendante", "Neuchâtel, Suisse", [1, 2022], null,
        "Formations en ligne sur la fiscalité immobilière romande et le premier achat.", "independant"),
      exp("exp-sa-2", "Responsable fiscalité des particuliers", "Fiduciaire neuchâteloise", "Neuchâtel, Suisse", [3, 2002], [12, 2021],
        "Déclarations d'impôt de propriétaires et de bailleurs, conseil lors d'achats et de ventes."),
      exp("exp-sa-3", "Taxatrice", "Administration fiscale cantonale", "Neuchâtel, Suisse", [9, 1996], [2, 2002],
        "Taxation des personnes physiques."),
    ],
    education: [
      edu("edu-sa-1", "Examen professionnel fédéral", "Brevet fédéral de spécialiste en finance et comptabilité", "Finance et comptabilité", 2002, 2004),
      edu("edu-sa-2", "Université de Neuchâtel", "Licence en sciences économiques", "Économie", 1992, 1996),
    ],
    skills: ["Fiscalité immobilière", "Valeur locative", "Gain immobilier", "Pédagogie", "Premier achat"],
    languages: langs("sa", [["Français", "natif"], ["Allemand", "courant"]]),
  },
  /* Yves Mottiez, 67 ans — formel, à l'ancienne, signe « Meilleures
     salutations, Y. Mottiez ». */
  "user-012": {
    banner: BANNER("1600585154526-990dced4db0d"),
    headline: "Apporteur d'affaires · La Gruyère",
    about:
      "Après plus de trente ans à la tête d'une succursale bancaire à Bulle, je connais La Gruyère, ses communes et ses familles. Il arrive qu'un voisin, un ancien client, souhaite vendre et ne sache pas à qui s'adresser. Je le mets alors en relation avec une agence sérieuse, comme ce fut le cas cette année pour une maison à Bulle confiée à Hartmann Immobilier SA. Je ne suis pas agent immobilier et ne me prononce pas sur les prix. Meilleures salutations, Y. Mottiez",
    memberSince: "2026-04-27",
    experiences: [
      exp("exp-yv-1", "Apporteur d'affaires", "Indépendant", "Bulle, Suisse", [2, 2024], null,
        "Mise en relation de vendeurs de la région avec des agences immobilières.", "independant"),
      exp("exp-yv-2", "Gérant de succursale", "Banque régionale", "Bulle, Suisse", [1, 1990], [12, 2023],
        "Direction de la succursale, crédits hypothécaires aux particuliers."),
      exp("exp-yv-3", "Employé de banque", "Banque régionale", "Fribourg, Suisse", [8, 1978], [12, 1989],
        "Guichet, puis crédits."),
    ],
    education: [
      edu("edu-yv-1", "École professionnelle de Fribourg", "CFC d'employé de banque", "Banque", 1975, 1978),
    ],
    skills: ["Réseau local", "La Gruyère", "Mise en relation"],
    languages: langs("yv", [["Français", "natif"], ["Allemand", "intermediaire"]]),
  },
  /* Mirjana Kovač, 45 ans — pragmatique : taux d'occupation et saisons. */
  "user-013": {
    banner: BANNER("1502672260266-1c1ef2d93688"),
    headline: "Hôte à Montreux · deux appartements en courte durée",
    about:
      "Treize ans à la réception d'un hôtel de Montreux m'ont appris une chose : le prix d'une nuit change tous les jours. Depuis 2017, je loue deux appartements en courte durée, à Montreux et à Clarens. Juillet est presque complet (le Jazz), décembre tient grâce au marché de Noël, janvier et novembre se travaillent. Ménage par une équipe fixe, arrivée autonome, réponse en moins d'une heure. J'ai suivi la formation d'Amina sur le pricing dynamique l'hiver dernier : ma basse saison a changé. Je partage volontiers mes chiffres avec d'autres hôtes de la Riviera.",
    memberSince: "2025-09-25",
    experiences: [
      exp("exp-mi-1", "Hôte courte durée", "Indépendante", "Montreux, Suisse", [6, 2017], null,
        "Deux appartements meublés : tarification, accueil, ménage, relations avec la copropriété.", "independant"),
      exp("exp-mi-2", "Cheffe de réception", "Hôtel de la Riviera", "Montreux, Suisse", [4, 2004], [5, 2017],
        "Réception, réservations, gestion des tarifs."),
    ],
    education: [
      edu("edu-mi-1", "École hôtelière et touristique de Split", "Diplôme de technicienne en tourisme", "Hôtellerie", 1996, 2000),
      edu("edu-mi-2", "Amina El Idrissi (formation en ligne)", "Pricing dynamique pour la location courte durée", "Tarification", 2026, 2026),
    ],
    skills: ["Tarification", "Taux d'occupation", "Accueil voyageurs", "Organisation du ménage"],
    languages: langs("mi", [["Croate", "natif"], ["Français", "courant"], ["Allemand", "courant"], ["Anglais", "courant"]]),
  },
  /* Hélène Marchal, 52 ans — commerciale, réseau transfrontalier. Profil en
     France : aucune prime sur les biens, et sa fiche le dit (D7). */
  "user-014": {
    banner: BANNER("1505373877841-8d25f7d46678"),
    headline: "Apporteuse · formations et événements · Évian ↔ Lausanne",
    about:
      "Seize ans à vendre des séminaires et des événements de part et d'autre du Léman : mon carnet d'adresses va de Thonon à Lausanne. Sur E-Dome, je recommande les formations et les événements que je connais et qui servent vraiment — en ce moment, la formation fiscalité de Sandrine Monnier, pour les frontaliers qui achètent côté suisse. Je vis en France : mon affiliation porte sur la marketplace uniquement. Je ne touche aucune prime sur les biens immobiliers — l'affiliation biens n'est pas ouverte depuis la France.",
    memberSince: "2026-05-30",
    experiences: [
      exp("exp-he-1", "Apporteuse d'affaires (marketplace)", "Indépendante", "Évian-les-Bains, France", [1, 2025], null,
        "Recommandation de formations et d'événements à un réseau transfrontalier.", "independant"),
      exp("exp-he-2", "Responsable commerciale", "Groupe hôtelier", "Évian-les-Bains, France", [3, 2008], [12, 2024],
        "Séminaires et événements d'entreprise, clientèle suisse et française."),
      exp("exp-he-3", "Commerciale", "Agence événementielle", "Annecy, France", [9, 1998], [2, 2008],
        "Organisation d'événements d'entreprise."),
    ],
    education: [
      edu("edu-he-1", "Lycée Gabriel-Fauré, Annecy", "BTS Négociation et relation client", "Commerce", 1994, 1996),
    ],
    skills: ["Développement commercial", "Événementiel", "Réseau transfrontalier"],
    languages: langs("he", [["Français", "natif"], ["Anglais", "courant"], ["Italien", "courant"]]),
  },
  /* Jean-Luc Hartmann, 58 ans — institutionnel, posé. */
  "user-015": {
    banner: BANNER("1560518883-ce09059eeffa"),
    headline: "Directeur · Hartmann Immobilier SA · Neuchâtel",
    about:
      "Directeur de Hartmann Immobilier SA, que j'ai fondée à Neuchâtel en 2006. Vingt-cinq ans dans l'immobilier neuchâtelois, membre USPI. L'agence couvre la vente, l'estimation et la gestion locative, du littoral au Val-de-Ruz, jusqu'à La Gruyère et au Nord vaudois. Nous sommes une équipe de proximité : Aline Tschanz suit les ventes et les locations, je conduis les estimations et les mandats. En cours : la rénovation énergétique d'un immeuble de la rue des Parcs, menée avec l'architecte Reto Jungo.",
    memberSince: "2025-09-05",
    experiences: [
      exp("exp-jl-1", "Directeur et fondateur", "Hartmann Immobilier SA", "Neuchâtel, Suisse", [1, 2006], null,
        "Direction de l'agence : vente, estimation, gestion locative. Mandats de vente et relation avec les propriétaires."),
      exp("exp-jl-2", "Agent immobilier", "Agence du littoral neuchâtelois", "Neuchâtel, Suisse", [4, 2001], [12, 2005],
        "Vente et estimation de biens résidentiels."),
      exp("exp-jl-3", "Gestionnaire immobilier", "Caisse de pension", "Neuchâtel, Suisse", [9, 1993], [3, 2001],
        "Gestion d'un parc d'immeubles locatifs."),
    ],
    education: [
      edu("edu-jl-1", "USPI Suisse", "Brevet fédéral de gérant d'immeubles", "Gestion immobilière", 2001, 2003),
      edu("edu-jl-2", "SVIT School", "Expert en estimations immobilières", "Estimation", 2010, 2012),
      edu("edu-jl-3", "Université de Neuchâtel", "Licence en droit", "Droit", 1988, 1992),
    ],
    skills: ["Estimation", "Vente", "Gestion locative", "Direction d'agence", "Droit du bail"],
    languages: langs("jl", [["Français", "natif"], ["Allemand", "courant"], ["Anglais", "intermediaire"]]),
    links: [
      { id: "ln-jl-1", type: "website", url: "/agence/hartmann-immobilier", label: "Hartmann Immobilier SA" },
    ],
  },
  /* Amina El Idrissi, 44 ans — bienveillante, concrète. */
  "user-016": {
    banner: BANNER("1539020140153-e479b8c22e70"),
    headline: "Formatrice · gestion locative et pricing dynamique · Marrakech",
    about:
      "J'ai ouvert mon riad en 2016, après dix ans dans la réservation hôtelière. Les premières années, j'ai tout appris à mes dépens : les photos sombres, les prix fixes toute l'année, les avis qu'on ne sait pas gérer. Depuis 2020, je transmets ce qui marche à d'autres hôtes, au Maroc comme en Suisse. Mes formations sont courtes, concrètes, avec des fiches à imprimer. Si vous hésitez, écrivez-moi : je vous dis honnêtement si elles vous serviront.",
    memberSince: "2025-09-10",
    experiences: [
      exp("exp-am-1", "Formatrice", "Indépendante", "Marrakech, Maroc", [9, 2020], null,
        "Formations en gestion locative touristique et en pricing dynamique.", "independant"),
      exp("exp-am-2", "Hôte", "Riad en médina", "Marrakech, Maroc", [3, 2016], null,
        "Exploitation d'un riad de quatre suites.", "independant"),
      exp("exp-am-3", "Responsable des réservations", "Hôtel, Guéliz", "Marrakech, Maroc", [6, 2006], [2, 2016],
        "Réservations, tarifs, relations avec les agences."),
    ],
    education: [
      edu("edu-am-1", "École de commerce, Marrakech", "Master en management hôtelier", "Hôtellerie", 2003, 2005),
    ],
    skills: ["Gestion locative touristique", "Pricing dynamique", "Accueil", "Formation d'adultes"],
    languages: langs("am", [["Arabe", "natif"], ["Français", "bilingue"], ["Anglais", "courant"]]),
  },
};

/** Les ids qui portent un enrichissement de profil. Chacun DOIT exister à
    l'annuaire (garde-fou dans demo/invariants.ts). */
export const PUBLIC_SEED_IDS = Object.keys(PUBLIC_SEEDS);

const GENERIC_BANNER = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=400&fit=crop";

/* Construit le profil public d'une personne de l'annuaire. Renvoie null
   uniquement si l'id n'existe PAS à l'annuaire (la page affiche alors
   « profil introuvable »). */
export function getMockProfile(id: string): Profile | null {
  /* Le profil public de l'utilisateur courant EST son profil canonique. */
  if (id === CURRENT_USER.id) return DEFAULT_PROFILE;

  const person = personById(id);
  if (!person) return null;
  const seed = PUBLIC_SEEDS[id];

  return {
    id: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    email: person.email,
    avatar: person.avatar,
    banner: seed?.banner ?? GENERIC_BANNER,
    headline: seed?.headline ?? `${roleLabel(person.activeRole, person.trades)} · ${person.city}`,
    location: { city: person.city, country: person.country },
    roles: person.roles,
    trades: person.trades,
    interests: person.interests,
    about: seed?.about ?? person.bio,
    experiences: seed?.experiences ?? [],
    education: seed?.education ?? [],
    skills: (seed?.skills ?? []).map((name, i) => ({ id: `sk-${id}-${i}`, name })),
    languages:
      seed?.languages ??
      (person.languages ?? []).map((name, i) => ({ id: `lg-${id}-${i}`, name, level: "courant" as const })),
    certifications: [],
    links: seed?.links ?? [],
    visibility: DEFAULT_VISIBILITY,
    meta: { verified: true, membreFondateur: false, memberSince: seed?.memberSince ?? "2026-01-01" },
    stats: {
      followers: person.stats.followers,
      following: person.stats.following,
      rating: person.stats.rating,
      reviewsCount: person.stats.reviews,
    },
  };
}

/** Tous les identifiants de profil public : l'annuaire entier. */
export const PUBLIC_PROFILE_IDS = DIRECTORY.map((p) => p.id);

function summary(id: string): PersonSummary {
  const p = requirePerson(id);
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    avatar: p.avatar,
    headline: PUBLIC_SEEDS[p.id]?.headline ?? (p.id === CURRENT_USER.id ? CURRENT_USER.headline : `${roleLabel(p.activeRole, p.trades)} · ${p.city}`),
    city: p.city,
    country: p.country,
    roles: p.roles,
    trades: p.trades,
  };
}

/* Liste des personnes (hors moi) pour les pages réseau / contacts. Source
   unique : l'annuaire. Chaque personne ouvre une vraie fiche /profil/[id]. */
export function listPeople(): PersonSummary[] {
  return DIRECTORY.filter((p) => p.id !== CURRENT_USER.id).map((p) => summary(p.id));
}

/** Les abonnés d'une personne — le graphe FOLLOWS, relations entrantes. */
export function listFollowers(id: string): PersonSummary[] {
  return followersOf(id).map(summary);
}

/** Les personnes suivies par une personne — relations sortantes. */
export function listFollowing(id: string): PersonSummary[] {
  return followingOf(id).map(summary);
}
