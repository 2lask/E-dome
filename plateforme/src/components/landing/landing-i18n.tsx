"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type LandingLang = "fr" | "en" | "th";

type TranslationMap = Record<string, string>;

interface LandingLangContextValue {
  lang: LandingLang;
  setLang: (lang: LandingLang) => void;
  t: (key: string) => string;
}

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------
export const translations: Record<LandingLang, TranslationMap> = {
  fr: {
    // ── Hero ──────────────────────────────────────────────────────────────
    "hero.label": "L'ecosysteme immobilier",
    "hero.title1": "L'immobilier",
    "hero.title2": "sous un meme toit.",
    "hero.subtitle":
      "Soutenez le projet en manifestant votre interet. Un simple questionnaire, gratuit et sans engagement, qui prouve une vraie demande sur le marche et nous aide a construire la plateforme qui vous correspond.",
    "hero.cta": "Manifester mon interet",
    "hero.learn": "En savoir plus",
    "hero.demo": "Voir la demo",
    "hero.mockup": "Voir la maquette",

    // ── Navbar ────────────────────────────────────────────────────────────
    "nav.vision": "Vision",
    "nav.features": "Fonctionnalites",
    "nav.founders": "Fondateurs",
    "nav.roadmap": "Roadmap",

    // ── About ─────────────────────────────────────────────────────────────
    "about.label": "Notre vision",
    "about.title1": "Pense pour chaque",
    "about.title2": "acteur de l'immobilier.",
    "about.p1":
      "E-Dome n'est pas une plateforme de plus. C'est un ecosysteme ou chaque professionnel \u2014 hote, agent, promoteur, photographe, courtier, notaire, architecte, formateur \u2014 dispose d'un espace pense pour son metier. Un compte unique, un profil configurable qui s'adapte a votre activite du moment.",
    "about.p2":
      "Au coeur du modele : un systeme de commissions transparent qui remunere chaque maillon de la chaine. L'apporteur d'affaires touche sa part, le formateur monetise son expertise, l'hote gere ses reservations, le prestataire propose ses services \u2014 tout depuis un seul endroit, sans dispersion.",
    "about.roles_label":
      "Des profils interchangeables qui s'adaptent a chaque metier de l'immobilier \u2014 un seul compte pour toutes vos activites.",
    "about.more": "et plus encore\u2026",
    "about.role_hote": "Hote",
    "about.role_agence": "Agence",
    "about.role_agent": "Agent",
    "about.role_investisseur": "Investisseur",
    "about.role_formateur": "Formateur",
    "about.role_apporteur": "Apporteur",
    "about.role_photographe": "Photographe",
    "about.role_courtier": "Courtier",
    "about.role_notaire": "Notaire",
    "about.role_architecte": "Architecte",
    "about.role_promoteur": "Promoteur",
    "about.role_client": "Client",

    // ── Featured video ────────────────────────────────────────────────────
    "featured.label": "La plateforme",
    "featured.desc":
      "Plus de 30 pages fonctionnelles : feed social avec stories et reels, marketplace avec carte interactive et calcul de rendement, messagerie, dashboard adaptatif selon votre role, formations video par modules, systeme de commissions en temps reel, reservations avec options personnalisables (conciergerie, petit-dejeuner, transport, decoration) et gestion de paiements.",
    "featured.disclaimer":
      "Maquette de visualisation \u2014 les donnees presentees sont fictives et servent uniquement a illustrer les fonctionnalites prevues",
    "featured.cta": "Entrer dans la demo",
    "featured.mobile_desc":
      "Plus de 30 pages fonctionnelles : feed social, marketplace avec carte interactive, messagerie, dashboard multi-role, formations video, systeme de commissions, reservations avec options personnalisables et gestion de paiements.",
    "featured.mobile_disclaimer": "Maquette de visualisation \u2014 donnees fictives",

    // ── Problem ───────────────────────────────────────────────────────────
    "problem.label": "Le constat",
    "problem.title1": "Un marche",
    "problem.title2": "qui fuit.",
    "problem.desc":
      "Pour chercher un bien, un site. Pour reserver, un autre. Pour se former, encore un autre. Pour trouver un prestataire, un annuaire. Pour suivre ses commissions, un tableur. Chaque etape renvoie vers un outil different \u2014 et a chaque transition, on perd du temps, de la concentration et des opportunites. Le parcours immobilier actuel est une succession de ruptures qui coute cher a tous les acteurs.",

    "problem.stat1_value": "12",
    "problem.stat1_unit": "outils en moyenne",
    "problem.stat1_desc":
      "Un professionnel de l'immobilier utilise en moyenne une douzaine d'outils differents pour gerer son activite : annonces, reservations, comptabilite, communication, formation, prospection.",
    "problem.stat1_source": "McKinsey Global Institute \u2014 Real Estate Technology Adoption, 2024",

    "problem.stat2_value": "40%",
    "problem.stat2_unit": "du temps en friction",
    "problem.stat2_desc":
      "Pres de la moitie du temps de travail des agents et gestionnaires immobiliers est consacre a des taches administratives et a la navigation entre plateformes deconnectees.",
    "problem.stat2_source": "National Association of Realtors \u2014 Technology Report, 2024",

    "problem.stat3_value": "23 min",
    "problem.stat3_unit": "pour se reconcentrer",
    "problem.stat3_desc":
      "Chaque interruption ou changement d'application necessite en moyenne 23 minutes et 15 secondes pour retrouver un niveau de concentration equivalent.",
    "problem.stat3_source": "University of California, Irvine \u2014 Gloria Mark et al., 2023",

    "problem.stat4_value": "67%",
    "problem.stat4_unit": "d'abandons en ligne",
    "problem.stat4_desc":
      "Deux tiers des parcours d'achat ou de reservation immobiliere en ligne sont abandonnes lorsque l'utilisateur doit quitter la plateforme en cours de route pour completer une etape ailleurs.",
    "problem.stat4_source": "JLL \u2014 Digital Buyer Journey Report, 2024",

    "problem.pill": "E-Dome rassemble tout en un seul endroit.",
    "problem.pill_bold": "Zero friction, zero dispersion.",

    // ── Services ──────────────────────────────────────────────────────────
    "services.label": "Fonctionnalites",
    "services.title1": "Tout-en-un,",
    "services.title2": "sans compromis",
    "services.subtitle":
      "Des profils interchangeables qui s'adaptent a chaque metier de l'immobilier \u2014 un seul compte pour toutes vos activites.",

    "services.f1_tag": "Reseau social immobilier",
    "services.f1_title": "Feed, Stories & Reels",
    "services.f1_desc":
      "Un fil d'actualite pense pour l'immobilier : partagez vos biens, vos visites, vos analyses de marche. Stories ephemeres, reels de proprietes, mentions, hashtags \u2014 l'interaction sociale orientee vers le professionnel.",

    "services.f2_tag": "Marketplace & Reservations",
    "services.f2_title": "Explorer, comparer, reserver",
    "services.f2_desc":
      "Carte interactive, filtres avances par type, pays et budget. Rendement brut et net, prix au m\u00B2, note energetique, projection ROI a 5 et 10 ans. Reservation integree avec calendrier et paiements securises. L'hote peut aussi proposer des options a la reservation \u2014 decoration romantique, petit-dejeuner, carte des menus en chambre, transport, conciergerie \u2014 en gratuit ou en payant.",

    "services.f3_tag": "Formation & Certification",
    "services.f3_title": "Se former avec les meilleurs",
    "services.f3_desc":
      "Catalogue de formations video par des experts du terrain : investissement locatif, gestion de biens, analyse financiere, fiscalite internationale. Modules structures et certifications.",

    "services.f4_tag": "Systeme de commissions",
    "services.f4_title": "Apporter, recommander, gagner",
    "services.f4_desc":
      "Le coeur economique d'E-Dome : chaque utilisateur peut devenir apporteur d'affaires. Commissions sur les locations, les ventes, les formations \u2014 liens tracables, dashboard de suivi, paiements automatiques.",

    "services.f5_tag": "Live & Evenements",
    "services.f5_title": "Webinaires et conferences",
    "services.f5_desc":
      "Programmez des lives de visites virtuelles, des webinaires d'analyse de marche, des sessions Q&A. Replays disponibles, inscriptions avec notifications, evenements physiques et virtuels.",

    "services.f6_tag": "Services professionnels",
    "services.f6_title": "Marketplace de prestataires",
    "services.f6_desc":
      "Photographes, home stagers, gestionnaires de cles, renovateurs, notaires, courtiers \u2014 trouvez et sollicitez des prestataires qualifies depuis la plateforme. Demandes de devis integrees.",

    // ── Philosophy ────────────────────────────────────────────────────────
    "philosophy.label": "Notre approche",
    "philosophy.title1": "Pourquoi",
    "philosophy.title2": "ca change tout",
    "philosophy.desc":
      "E-Dome ne se contente pas de regrouper des outils. La plateforme repense la facon dont les acteurs de l'immobilier travaillent, collaborent et se remunerent \u2014 en placant la connexion humaine et la transparence au centre de chaque interaction.",

    "philosophy.p1_title": "Un ecosysteme, pas un outil",
    "philosophy.p1_desc":
      "Aujourd'hui, un agent publie ses biens sur un portail, communique via un autre, gere ses reservations ailleurs et suit ses revenus sur un tableur. E-Dome supprime ces frontieres : tout est connecte, tout communique, tout se gere depuis un seul tableau de bord.",

    "philosophy.p2_title": "Des profils qui evoluent avec vous",
    "philosophy.p2_desc":
      "Vous demarrez comme apporteur d'affaires, puis vous devenez hote, puis formateur. Sur E-Dome, votre profil s'adapte. Pas besoin de creer un nouveau compte ou de recommencer. Activez un role, desactivez-le \u2014 votre historique, vos contacts et vos donnees restent.",

    "philosophy.p3_title": "Commissions transparentes",
    "philosophy.p3_desc":
      "Chaque acteur remunere dispose de son propre dashboard revenus. L'apporteur suit ses commissions en temps reel, l'hote visualise ses reservations et gains, le formateur controle ses ventes. Tout est tracable, documente et transparent \u2014 plus de zones d'ombre.",

    "philosophy.p4_title": "Le social au service du business",
    "philosophy.p4_desc":
      "L'immobilier est un metier de reseau. Pourtant, aucune plateforme ne propose un vrai espace social dedie au secteur. E-Dome integre un feed, des stories, des reels et de la messagerie \u2014 penses pour generer des leads, pas juste des likes.",

    "philosophy.video_label": "E-Dome",
    "philosophy.video_title1": "Un seul espace",
    "philosophy.video_title2": "pour tout l'immobilier.",

    "philosophy.video_desktop_p1":
      "Chercher un bien, publier une annonce, reserver une visite, suivre une formation, recommander un contact et toucher sa commission.",
    "philosophy.video_desktop_p2":
      "Sans jamais quitter la plateforme \u2014 E-Dome centralise chaque etape du parcours pour que chaque acteur gagne en temps, en visibilite et en revenus.",

    "philosophy.video_mobile_desc":
      "Chercher, publier, reserver, se former, recommander et etre remunere \u2014 sans jamais quitter la plateforme.",
    "philosophy.video_cta": "Voir la maquette",

    "philosophy.tag_recherche": "Recherche",
    "philosophy.tag_publication": "Publication",
    "philosophy.tag_reservation": "Reservation",
    "philosophy.tag_formation": "Formation",
    "philosophy.tag_recommandation": "Recommandation",
    "philosophy.tag_remuneration": "Remuneration",

    // ── Founders ──────────────────────────────────────────────────────────
    "founders.label_leo": "Fondateur et CEO",
    "founders.label_jp": "Co-fondateur et COO",

    "founders.leo_p1":
      "L'idee d'E-Dome m'est venue en vivant le quotidien de l'immobilier de l'interieur. En tant qu'apporteur d'affaires, je passais mes journees a naviguer entre des dizaines d'outils differents, a chercher les bons contacts sur une plateforme, les bons biens sur une autre, a suivre mes commissions sur des fichiers manuels. Je perdais un temps considerable \u2014 et je savais que tous les acteurs du secteur vivaient la meme chose.",
    "founders.leo_p2":
      "Un soir, j'ai ouvert une page blanche et j'ai commence a dessiner ce que serait la plateforme ideale. Pas un outil de plus \u2014 un endroit unique ou chaque professionnel de l'immobilier retrouve tout ce dont il a besoin. Le reseau, les annonces, la formation, les commissions, la visibilite. Page apres page, fonctionnalite apres fonctionnalite, E-Dome a pris forme. Aujourd'hui, cette vision est devenue une maquette de plus de 30 pages \u2014 et bientot, une realite.",

    "founders.jp_p1":
      "Quand Leonard m'a montre ce qu'il avait en tete, j'ai tout de suite compris que ce n'etait pas juste une idee d'application. C'etait une reponse a un vrai probleme \u2014 un secteur ou les gens creent de la valeur chaque jour mais n'ont aucun espace commun pour se retrouver, collaborer et etre reconnus.",
    "founders.jp_p2":
      "Titulaire d'un CFC d'employe de commerce avec maturite professionnelle, j'ai appris qu'un bon produit ne suffit jamais \u2014 il faut une execution rigoureuse et des fondations solides. Mon role, c'est de structurer le modele, trouver les bons partenaires et m'assurer que chaque decision sert la croissance durable du projet. C'est ce que je construis chaque jour pour E-Dome.",

    "founders.quote":
      "On ne veut pas juste creer une application. On veut changer la maniere dont l'immobilier connecte les gens.",

    "founders.conviction_label": "Notre conviction",
    "founders.conviction_title":
      "L'immobilier ne changera pas grace a un outil de plus. Il changera quand ses acteurs seront enfin connectes.",
    "founders.conviction_desc":
      "Des milliers de professionnels competents restent dans l'ombre faute d'un espace qui les met en lumiere. Des opportunites se perdent chaque jour entre des outils qui ne se parlent pas. Des commissions sont versees sans que personne ne sache vraiment a qui ni pourquoi. Ce n'est pas une fatalite \u2014 c'est un probleme qu'on a decide de resoudre.",

    "founders.engagement_label": "Notre engagement",
    "founders.engagement_title":
      "On ne cherche pas des utilisateurs. On cherche des pionniers.",
    "founders.engagement_desc":
      "E-Dome grandit grace a ceux qui le vivent au quotidien. Chaque retour terrain, chaque idee partagee, chaque besoin exprime rend la plateforme plus forte. Les premiers a nous faire confiance ne rejoignent pas un projet \u2014 ils en ecrivent les premieres pages.",

    "founders.whatsapp": "WhatsApp",
    "founders.email_label": "contact@edome.world",

    // ── Roadmap ───────────────────────────────────────────────────────────
    "roadmap.label": "Roadmap",
    "roadmap.title1": "De l'idee",
    "roadmap.title2": "au lancement.",
    "roadmap.desc":
      "Le concept est prouve. La maquette est en ligne. Maintenant, chaque manifestation d'interet que nous recoltons renforce la preuve que le marche a besoin d'E-Dome \u2014 et c'est cette traction qui nous permettra de convaincre des investisseurs, lever les fonds necessaires et constituer l'equipe technique qui donnera vie a la plateforme finale.",
    "roadmap.desc2":
      "Chaque personne qui manifeste son interet aujourd'hui pose une pierre de ce qui deviendra demain la reference de l'immobilier connecte.",

    "roadmap.status_done": "Termine",
    "roadmap.status_current": "En cours",
    "roadmap.status_upcoming": "A venir",

    "roadmap.phase1_title": "Concevoir & prouver le concept",
    "roadmap.phase1_item1": "Maquette interactive complete (30+ pages)",
    "roadmap.phase1_item2": "Reseau social immobilier (feed, stories, reels)",
    "roadmap.phase1_item3": "Marketplace avec carte, filtres et calcul de rendement",
    "roadmap.phase1_item4": "Dashboard adaptatif selon le profil metier",
    "roadmap.phase1_item5": "Systeme de commissions pour apporteurs d'affaires",
    "roadmap.phase1_item6": "Formations video avec modules et certifications",
    "roadmap.phase1_item7": "Messagerie, reservations, evenements et services",

    "roadmap.phase2_title": "Valider le besoin & convaincre",
    "roadmap.phase2_item1": "Recolte de manifestations d'interet aupres des acteurs du secteur",
    "roadmap.phase2_item2": "Demonstrations et retours terrain",
    "roadmap.phase2_item3": "Recherche d'investisseurs et preparation de la levee de fonds",
    "roadmap.phase2_item4": "Structuration juridique de la societe",
    "roadmap.phase2_item5": "Premiers partenariats strategiques avec des agences et prestataires",

    "roadmap.phase3_title": "Lever les fonds & recruter",
    "roadmap.phase3_item1": "Levee de fonds pour financer le developpement",
    "roadmap.phase3_item2": "Recrutement d'une equipe de developpeurs",
    "roadmap.phase3_item3": "Developpement du site web et de l'application mobile (iOS & Android)",
    "roadmap.phase3_item4": "Paiements securises et systeme d'escrow",
    "roadmap.phase3_item5": "Commissions automatisees et tracables",
    "roadmap.phase3_item6": "Beta privee Suisse + Thailande",

    "roadmap.phase4_title": "Lancer & s'etendre",
    "roadmap.phase4_item1": "Lancement public Suisse & Thailande",
    "roadmap.phase4_item2": "Publication de l'app mobile sur les stores",
    "roadmap.phase4_item3": "Expansion vers la France, le Maroc et les EAU",
    "roadmap.phase4_item4": "Ouverture de l'API pour les integrations tierces",
    "roadmap.phase4_item5": "Programme ambassadeurs et apporteurs certifies",

    "roadmap.inscriptions_label": "Inscriptions ouvertes",
    "roadmap.cta_title1": "Rejoignez les premiers membres.",
    "roadmap.cta_title2": "Recoltez les premiers avantages.",
    "roadmap.cta_subtitle":
      "Les premiers a manifester leur interet ne rejoignent pas simplement un projet \u2014 ils obtiennent une place privilegiee dans l'ecosysteme E-Dome, avec des avantages exclusifs reserves aux membres fondateurs.",
    "roadmap.cta_disclaimer":
      "La manifestation d'interet est libre, gratuite et sans aucun engagement. Elle nous aide a prouver le besoin du marche.",

    "roadmap.benefit1_title": "Badge Membre Fondateur",
    "roadmap.benefit1_desc":
      "Un badge permanent sur votre profil qui prouve que vous etiez la des le debut. Reconnaissance a vie dans l'ecosysteme.",
    "roadmap.benefit2_title": "Acces anticipe",
    "roadmap.benefit2_desc":
      "Configurez votre compte, votre profil et vos preferences avant le lancement public. Soyez operationnel des le jour J.",
    "roadmap.benefit3_title": "Visibilite prioritaire",
    "roadmap.benefit3_desc":
      "Votre profil mis en avant dans les resultats de recherche et les recommandations pendant les premiers mois.",
    "roadmap.benefit4_title": "Conferences exclusives",
    "roadmap.benefit4_desc":
      "Acces a des sessions privees pour decouvrir les fonctionnalites, donner votre avis et influencer les priorites de developpement.",
    "roadmap.benefit5_title": "Reseau fondateur",
    "roadmap.benefit5_desc":
      "Integrez un groupe prive avec les autres premiers membres et les fondateurs. Echangez, collaborez, construisez ensemble.",
    "roadmap.benefit6_title": "Avantages exclusifs",
    "roadmap.benefit6_desc":
      "Des conditions preferentielles sur les futures fonctionnalites premium, les formations et les outils de la plateforme.",

    "roadmap.cta1": "Je manifeste mon interet",
    "roadmap.cta2": "Explorer la demo d'abord",

    // ── Footer ────────────────────────────────────────────────────────────
    "footer.desc": "L'ecosysteme immobilier international. De la Suisse au monde entier.",
    "footer.demo_label": "Explorer la demo",
    "footer.platform_label": "Plateforme",
    "footer.about_label": "A propos",
    "footer.copyright":
      "\u00A9 2026 E-Dome \u2014 Maquette de visualisation. Toutes les donnees sont fictives et servent a illustrer les fonctionnalites.",
    "footer.access": "Acceder a la demo",

    "footer.link_feed": "Feed social",
    "footer.link_marketplace": "Marketplace",
    "footer.link_dashboard": "Dashboard",
    "footer.link_formations": "Formations",
    "footer.link_live": "Live & Replays",
    "footer.link_messages": "Messages",
    "footer.link_apporteurs": "Apporteurs",
    "footer.link_reservations": "Reservations",
    "footer.link_statistiques": "Statistiques",
    "footer.link_evenements": "Evenements",
    "footer.link_services": "Services",
    "footer.link_investisseurs": "Investisseurs",
    "footer.link_vision": "Notre vision",
    "footer.link_features": "Fonctionnalites",
    "footer.link_founders": "Fondateurs",
    "footer.link_roadmap": "Roadmap",
    "footer.link_conditions": "Conditions",
    "footer.link_privacy": "Confidentialite",

    // ── Form ──────────────────────────────────────────────────────────────
    "form.step1_title": "Faisons connaissance.",
    "form.step1_desc":
      "Ces informations nous permettent de vous contacter et de personnaliser votre experience.",
    "form.step1_disclaimer":
      "Ce formulaire est une manifestation d'interet sans engagement ni obligation. La maquette que vous allez explorer est un modele de visualisation \u2014 toutes les donnees presentees sont fictives.",

    "form.step2_title": "Parlez-nous de vous.",
    "form.step2_desc": "Votre profil nous aide a adapter E-Dome aux vrais besoins du terrain.",

    "form.step3_title": "Derniere etape.",
    "form.step3_desc": "Dites-nous comment vous voyez votre place dans l'ecosysteme E-Dome.",

    "form.label_prenom": "Prenom *",
    "form.label_nom": "Nom *",
    "form.label_email": "Email *",
    "form.label_telephone": "Telephone",
    "form.label_activites": "Vos activites *",
    "form.label_activites_multi": "(plusieurs choix possibles)",
    "form.label_activite_autre": "Precisez votre activite",
    "form.label_ville": "Ville",
    "form.label_pays": "Pays *",
    "form.label_experience": "Annees d'experience dans l'immobilier",
    "form.label_premier_membre": "Souhaitez-vous faire partie des premiers membres au lancement ?",
    "form.label_source": "Comment avez-vous entendu parler d'E-Dome ?",
    "form.label_message": "Un message, une question, une idee ? (optionnel)",
    "form.label_newsletter":
      "Je souhaite recevoir les actualites d'E-Dome et etre informe(e) des prochaines etapes du projet.",

    "form.placeholder_prenom": "Votre prenom",
    "form.placeholder_nom": "Votre nom",
    "form.placeholder_email": "votre@email.com",
    "form.placeholder_telephone": "+41 79 000 00 00",
    "form.placeholder_ville": "Votre ville",
    "form.placeholder_pays": "Suisse, France...",
    "form.placeholder_message": "Partagez-nous ce que vous pensez du projet...",

    "form.activity_agent": "Agent immobilier",
    "form.activity_hote": "Hote / Proprietaire",
    "form.activity_investisseur": "Investisseur",
    "form.activity_apporteur": "Apporteur d'affaires",
    "form.activity_formateur": "Formateur",
    "form.activity_photographe": "Photographe immobilier",
    "form.activity_courtier": "Courtier / Financement",
    "form.activity_notaire": "Notaire",
    "form.activity_architecte": "Architecte",
    "form.activity_promoteur": "Promoteur",
    "form.activity_home_stager": "Home stager",
    "form.activity_gestionnaire": "Gestionnaire de biens",
    "form.activity_autre": "Autre",

    "form.experience_beginner": "Debutant",
    "form.experience_1_3": "1-3 ans",
    "form.experience_3_10": "3-10 ans",
    "form.experience_10_plus": "10+ ans",

    "form.source_social": "Reseaux sociaux",
    "form.source_word_of_mouth": "Bouche a oreille",
    "form.source_google": "Recherche Google",
    "form.source_recommendation": "Recommandation professionnelle",
    "form.source_event": "Evenement / Conference",
    "form.source_other": "Autre",

    "form.member_yes": "Oui, je veux etre parmi les premiers",
    "form.member_yes_sub": "Acces anticipe, badge fondateur, visibilite prioritaire",
    "form.member_maybe": "Peut-etre, je veux d'abord en savoir plus",
    "form.member_maybe_sub": "Recevez les actualites et decidez plus tard",
    "form.member_no": "Non, je souhaite juste explorer la maquette",
    "form.member_no_sub": "Acces libre a la demonstration",

    "form.success_title": "Merci, {name} !",
    "form.success_desc":
      "Votre manifestation d'interet a bien ete enregistree.",
    "form.success_founder": "Vous faites partie des premiers membres fondateurs.",
    "form.success_desktop_desc":
      "Vous pouvez maintenant explorer la maquette interactive d'E-Dome avec toutes ses fonctionnalites.",
    "form.success_desktop_disclaimer":
      "Rappel : cette maquette est un modele de visualisation avec des donnees fictives. Elle permet de decouvrir les fonctionnalites prevues pour la plateforme finale.",
    "form.success_desktop_cta": "Acceder a la maquette",
    "form.success_mobile_title": "Maquette disponible sur ordinateur",
    "form.success_mobile_desc":
      "La maquette interactive d'E-Dome est optimisee pour un affichage sur ordinateur (PC ou Mac). Rendez-vous sur votre navigateur desktop pour explorer toutes les fonctionnalites.",

    "form.nav_back": "Retour",
    "form.nav_back_site": "Retour au site",
    "form.nav_continue": "Continuer",
    "form.nav_submit": "Acceder a la maquette",
    "form.step_of": "Etape {current} / {total}",
  },

  en: {
    // ── Hero ──────────────────────────────────────────────────────────────
    "hero.label": "The real estate ecosystem",
    "hero.title1": "Real estate",
    "hero.title2": "under one roof.",
    "hero.subtitle":
      "Support the project by expressing your interest. A simple questionnaire, free and with no commitment, that proves real market demand and helps us build the platform that suits you.",
    "hero.cta": "Express my interest",
    "hero.learn": "Learn more",
    "hero.demo": "View the demo",
    "hero.mockup": "View the mockup",

    // ── Navbar ────────────────────────────────────────────────────────────
    "nav.vision": "Vision",
    "nav.features": "Features",
    "nav.founders": "Founders",
    "nav.roadmap": "Roadmap",

    // ── About ─────────────────────────────────────────────────────────────
    "about.label": "Our vision",
    "about.title1": "Designed for every",
    "about.title2": "real estate professional.",
    "about.p1":
      "E-Dome is not just another platform. It is an ecosystem where every professional \u2014 host, agent, developer, photographer, broker, notary, architect, trainer \u2014 has a space designed for their trade. One account, one configurable profile that adapts to your current activity.",
    "about.p2":
      "At the heart of the model: a transparent commission system that rewards every link in the chain. The business referrer earns their share, the trainer monetizes their expertise, the host manages their bookings, the service provider offers their services \u2014 all from a single place, with no fragmentation.",
    "about.roles_label":
      "Interchangeable profiles that adapt to every real estate profession \u2014 one account for all your activities.",
    "about.more": "and more\u2026",
    "about.role_hote": "Host",
    "about.role_agence": "Agency",
    "about.role_agent": "Agent",
    "about.role_investisseur": "Investor",
    "about.role_formateur": "Trainer",
    "about.role_apporteur": "Referrer",
    "about.role_photographe": "Photographer",
    "about.role_courtier": "Broker",
    "about.role_notaire": "Notary",
    "about.role_architecte": "Architect",
    "about.role_promoteur": "Developer",
    "about.role_client": "Client",

    // ── Featured video ────────────────────────────────────────────────────
    "featured.label": "The platform",
    "featured.desc":
      "Over 30 functional pages: social feed with stories and reels, marketplace with interactive map and yield calculation, messaging, adaptive dashboard based on your role, video training modules, real-time commission system, bookings with customizable options (concierge, breakfast, transport, decoration) and payment management.",
    "featured.disclaimer":
      "Visualization mockup \u2014 the data shown is fictitious and serves only to illustrate the planned features",
    "featured.cta": "Enter the demo",
    "featured.mobile_desc":
      "Over 30 functional pages: social feed, marketplace with interactive map, messaging, multi-role dashboard, video training, commission system, bookings with customizable options and payment management.",
    "featured.mobile_disclaimer": "Visualization mockup \u2014 fictitious data",

    // ── Problem ───────────────────────────────────────────────────────────
    "problem.label": "The problem",
    "problem.title1": "A market",
    "problem.title2": "that leaks.",
    "problem.desc":
      "To search for a property, one website. To book, another. To get trained, yet another. To find a service provider, a directory. To track commissions, a spreadsheet. Every step redirects to a different tool \u2014 and with each transition, you lose time, focus and opportunities. The current real estate journey is a series of breakpoints that costs every player dearly.",

    "problem.stat1_value": "12",
    "problem.stat1_unit": "tools on average",
    "problem.stat1_desc":
      "A real estate professional uses on average a dozen different tools to manage their business: listings, bookings, accounting, communication, training, prospecting.",
    "problem.stat1_source": "McKinsey Global Institute \u2014 Real Estate Technology Adoption, 2024",

    "problem.stat2_value": "40%",
    "problem.stat2_unit": "of time in friction",
    "problem.stat2_desc":
      "Nearly half of real estate agents' and managers' working time is spent on administrative tasks and navigating between disconnected platforms.",
    "problem.stat2_source": "National Association of Realtors \u2014 Technology Report, 2024",

    "problem.stat3_value": "23 min",
    "problem.stat3_unit": "to refocus",
    "problem.stat3_desc":
      "Each interruption or application switch requires an average of 23 minutes and 15 seconds to regain an equivalent level of focus.",
    "problem.stat3_source": "University of California, Irvine \u2014 Gloria Mark et al., 2023",

    "problem.stat4_value": "67%",
    "problem.stat4_unit": "of online drop-offs",
    "problem.stat4_desc":
      "Two-thirds of online property purchase or booking journeys are abandoned when the user has to leave the platform mid-way to complete a step elsewhere.",
    "problem.stat4_source": "JLL \u2014 Digital Buyer Journey Report, 2024",

    "problem.pill": "E-Dome brings everything together in one place.",
    "problem.pill_bold": "Zero friction, zero fragmentation.",

    // ── Services ──────────────────────────────────────────────────────────
    "services.label": "Features",
    "services.title1": "All-in-one,",
    "services.title2": "no compromise",
    "services.subtitle":
      "Interchangeable profiles that adapt to every real estate profession \u2014 one account for all your activities.",

    "services.f1_tag": "Real estate social network",
    "services.f1_title": "Feed, Stories & Reels",
    "services.f1_desc":
      "A news feed designed for real estate: share your properties, visits, market analyses. Ephemeral stories, property reels, mentions, hashtags \u2014 social interaction geared toward professionals.",

    "services.f2_tag": "Marketplace & Bookings",
    "services.f2_title": "Browse, compare, book",
    "services.f2_desc":
      "Interactive map, advanced filters by type, country and budget. Gross and net yield, price per m\u00B2, energy rating, ROI projection at 5 and 10 years. Integrated booking with calendar and secure payments. Hosts can also offer booking add-ons \u2014 romantic decoration, breakfast, in-room menu card, transport, concierge \u2014 free or paid.",

    "services.f3_tag": "Training & Certification",
    "services.f3_title": "Learn from the best",
    "services.f3_desc":
      "Video training catalog by field experts: rental investment, property management, financial analysis, international taxation. Structured modules and certifications.",

    "services.f4_tag": "Commission system",
    "services.f4_title": "Refer, recommend, earn",
    "services.f4_desc":
      "The economic engine of E-Dome: every user can become a business referrer. Commissions on rentals, sales, training \u2014 trackable links, monitoring dashboard, automatic payments.",

    "services.f5_tag": "Live & Events",
    "services.f5_title": "Webinars and conferences",
    "services.f5_desc":
      "Schedule live virtual tours, market analysis webinars, Q&A sessions. Replays available, registrations with notifications, in-person and virtual events.",

    "services.f6_tag": "Professional services",
    "services.f6_title": "Service provider marketplace",
    "services.f6_desc":
      "Photographers, home stagers, key managers, renovators, notaries, brokers \u2014 find and engage qualified service providers from the platform. Integrated quote requests.",

    // ── Philosophy ────────────────────────────────────────────────────────
    "philosophy.label": "Our approach",
    "philosophy.title1": "Why",
    "philosophy.title2": "this changes everything",
    "philosophy.desc":
      "E-Dome does not merely bundle tools. The platform rethinks how real estate professionals work, collaborate and get paid \u2014 placing human connection and transparency at the heart of every interaction.",

    "philosophy.p1_title": "An ecosystem, not a tool",
    "philosophy.p1_desc":
      "Today, an agent lists properties on one portal, communicates via another, manages bookings elsewhere and tracks revenue in a spreadsheet. E-Dome removes these barriers: everything is connected, everything communicates, everything is managed from a single dashboard.",

    "philosophy.p2_title": "Profiles that evolve with you",
    "philosophy.p2_desc":
      "You start as a business referrer, then become a host, then a trainer. On E-Dome, your profile adapts. No need to create a new account or start over. Activate a role, deactivate it \u2014 your history, contacts and data remain.",

    "philosophy.p3_title": "Transparent commissions",
    "philosophy.p3_desc":
      "Every compensated professional has their own revenue dashboard. The referrer tracks commissions in real time, the host sees bookings and earnings, the trainer monitors sales. Everything is traceable, documented and transparent \u2014 no more gray areas.",

    "philosophy.p4_title": "Social media at the service of business",
    "philosophy.p4_desc":
      "Real estate is a networking business. Yet no platform offers a true social space dedicated to the sector. E-Dome integrates a feed, stories, reels and messaging \u2014 designed to generate leads, not just likes.",

    "philosophy.video_label": "E-Dome",
    "philosophy.video_title1": "One single space",
    "philosophy.video_title2": "for all real estate.",

    "philosophy.video_desktop_p1":
      "Search for a property, publish a listing, book a visit, take a training course, recommend a contact and earn your commission.",
    "philosophy.video_desktop_p2":
      "Without ever leaving the platform \u2014 E-Dome centralizes every step of the journey so every professional saves time, gains visibility and increases revenue.",

    "philosophy.video_mobile_desc":
      "Search, publish, book, learn, recommend and get paid \u2014 without ever leaving the platform.",
    "philosophy.video_cta": "View the mockup",

    "philosophy.tag_recherche": "Search",
    "philosophy.tag_publication": "Publishing",
    "philosophy.tag_reservation": "Booking",
    "philosophy.tag_formation": "Training",
    "philosophy.tag_recommandation": "Referral",
    "philosophy.tag_remuneration": "Earnings",

    // ── Founders ──────────────────────────────────────────────────────────
    "founders.label_leo": "Founder & CEO",
    "founders.label_jp": "Co-founder & COO",

    "founders.leo_p1":
      "The idea for E-Dome came to me while living the daily reality of real estate from the inside. As a business referrer, I spent my days navigating between dozens of different tools, looking for the right contacts on one platform, the right properties on another, tracking my commissions in manual spreadsheets. I was losing considerable time \u2014 and I knew every player in the industry was going through the same thing.",
    "founders.leo_p2":
      "One evening, I opened a blank page and started sketching what the ideal platform would look like. Not another tool \u2014 a single place where every real estate professional finds everything they need. The network, the listings, the training, the commissions, the visibility. Page after page, feature after feature, E-Dome took shape. Today, that vision has become a mockup of over 30 pages \u2014 and soon, a reality.",

    "founders.jp_p1":
      "When Leonard showed me what he had in mind, I immediately understood it wasn't just an app idea. It was an answer to a real problem \u2014 a sector where people create value every day but have no shared space to connect, collaborate and be recognized.",
    "founders.jp_p2":
      "Holding a Swiss Federal VET Diploma in business with a professional baccalaureate, I learned that a good product is never enough \u2014 you need rigorous execution and solid foundations. My role is to structure the model, find the right partners and ensure every decision serves the project's sustainable growth. That is what I build every day for E-Dome.",

    "founders.quote":
      "We don't just want to create an app. We want to change the way real estate connects people.",

    "founders.conviction_label": "Our conviction",
    "founders.conviction_title":
      "Real estate won't change because of another tool. It will change when its professionals are finally connected.",
    "founders.conviction_desc":
      "Thousands of skilled professionals remain in the shadows for lack of a space that highlights them. Opportunities are lost every day between tools that don't communicate. Commissions are paid without anyone really knowing to whom or why. This is not inevitable \u2014 it is a problem we decided to solve.",

    "founders.engagement_label": "Our commitment",
    "founders.engagement_title":
      "We're not looking for users. We're looking for pioneers.",
    "founders.engagement_desc":
      "E-Dome grows thanks to those who live it every day. Every field feedback, every shared idea, every expressed need makes the platform stronger. The first to trust us don't just join a project \u2014 they write its first pages.",

    "founders.whatsapp": "WhatsApp",
    "founders.email_label": "contact@edome.world",

    // ── Roadmap ───────────────────────────────────────────────────────────
    "roadmap.label": "Roadmap",
    "roadmap.title1": "From idea",
    "roadmap.title2": "to launch.",
    "roadmap.desc":
      "The concept is proven. The mockup is online. Now, every expression of interest we collect strengthens the proof that the market needs E-Dome \u2014 and this traction will allow us to convince investors, raise the necessary funds and build the technical team that will bring the final platform to life.",
    "roadmap.desc2":
      "Every person who expresses their interest today lays a stone of what will become tomorrow's benchmark for connected real estate.",

    "roadmap.status_done": "Completed",
    "roadmap.status_current": "In progress",
    "roadmap.status_upcoming": "Coming soon",

    "roadmap.phase1_title": "Design & prove the concept",
    "roadmap.phase1_item1": "Complete interactive mockup (30+ pages)",
    "roadmap.phase1_item2": "Real estate social network (feed, stories, reels)",
    "roadmap.phase1_item3": "Marketplace with map, filters and yield calculation",
    "roadmap.phase1_item4": "Adaptive dashboard based on professional profile",
    "roadmap.phase1_item5": "Commission system for business referrers",
    "roadmap.phase1_item6": "Video training with modules and certifications",
    "roadmap.phase1_item7": "Messaging, bookings, events and services",

    "roadmap.phase2_title": "Validate the need & convince",
    "roadmap.phase2_item1": "Collecting expressions of interest from industry professionals",
    "roadmap.phase2_item2": "Demonstrations and field feedback",
    "roadmap.phase2_item3": "Investor search and fundraising preparation",
    "roadmap.phase2_item4": "Legal structuring of the company",
    "roadmap.phase2_item5": "First strategic partnerships with agencies and service providers",

    "roadmap.phase3_title": "Raise funds & recruit",
    "roadmap.phase3_item1": "Fundraising to finance development",
    "roadmap.phase3_item2": "Recruiting a development team",
    "roadmap.phase3_item3": "Development of the website and mobile app (iOS & Android)",
    "roadmap.phase3_item4": "Secure payments and escrow system",
    "roadmap.phase3_item5": "Automated and traceable commissions",
    "roadmap.phase3_item6": "Private beta Switzerland + Thailand",

    "roadmap.phase4_title": "Launch & expand",
    "roadmap.phase4_item1": "Public launch Switzerland & Thailand",
    "roadmap.phase4_item2": "Mobile app publication on app stores",
    "roadmap.phase4_item3": "Expansion to France, Morocco and the UAE",
    "roadmap.phase4_item4": "API opening for third-party integrations",
    "roadmap.phase4_item5": "Ambassador and certified referrer program",

    "roadmap.inscriptions_label": "Registration open",
    "roadmap.cta_title1": "Join the first members.",
    "roadmap.cta_title2": "Reap the first benefits.",
    "roadmap.cta_subtitle":
      "The first to express their interest don't just join a project \u2014 they earn a privileged place in the E-Dome ecosystem, with exclusive benefits reserved for founding members.",
    "roadmap.cta_disclaimer":
      "The expression of interest is free, with no cost and no commitment. It helps us prove the market need.",

    "roadmap.benefit1_title": "Founding Member Badge",
    "roadmap.benefit1_desc":
      "A permanent badge on your profile proving you were there from the start. Lifetime recognition in the ecosystem.",
    "roadmap.benefit2_title": "Early access",
    "roadmap.benefit2_desc":
      "Set up your account, profile and preferences before the public launch. Be operational from day one.",
    "roadmap.benefit3_title": "Priority visibility",
    "roadmap.benefit3_desc":
      "Your profile highlighted in search results and recommendations during the first months.",
    "roadmap.benefit4_title": "Exclusive conferences",
    "roadmap.benefit4_desc":
      "Access to private sessions to discover features, share your feedback and influence development priorities.",
    "roadmap.benefit5_title": "Founding network",
    "roadmap.benefit5_desc":
      "Join a private group with other early members and the founders. Exchange, collaborate, build together.",
    "roadmap.benefit6_title": "Exclusive benefits",
    "roadmap.benefit6_desc":
      "Preferential terms on future premium features, training and platform tools.",

    "roadmap.cta1": "Express my interest",
    "roadmap.cta2": "Explore the demo first",

    // ── Footer ────────────────────────────────────────────────────────────
    "footer.desc": "The international real estate ecosystem. From Switzerland to the world.",
    "footer.demo_label": "Explore the demo",
    "footer.platform_label": "Platform",
    "footer.about_label": "About",
    "footer.copyright":
      "\u00A9 2026 E-Dome \u2014 Visualization mockup. All data is fictitious and serves to illustrate the features.",
    "footer.access": "Access the demo",

    "footer.link_feed": "Social feed",
    "footer.link_marketplace": "Marketplace",
    "footer.link_dashboard": "Dashboard",
    "footer.link_formations": "Training",
    "footer.link_live": "Live & Replays",
    "footer.link_messages": "Messages",
    "footer.link_apporteurs": "Referrers",
    "footer.link_reservations": "Bookings",
    "footer.link_statistiques": "Statistics",
    "footer.link_evenements": "Events",
    "footer.link_services": "Services",
    "footer.link_investisseurs": "Investors",
    "footer.link_vision": "Our vision",
    "footer.link_features": "Features",
    "footer.link_founders": "Founders",
    "footer.link_roadmap": "Roadmap",
    "footer.link_conditions": "Terms",
    "footer.link_privacy": "Privacy",

    // ── Form ──────────────────────────────────────────────────────────────
    "form.step1_title": "Let's get acquainted.",
    "form.step1_desc":
      "This information allows us to contact you and personalize your experience.",
    "form.step1_disclaimer":
      "This form is an expression of interest with no commitment or obligation. The mockup you are about to explore is a visualization model \u2014 all data presented is fictitious.",

    "form.step2_title": "Tell us about yourself.",
    "form.step2_desc": "Your profile helps us tailor E-Dome to real field needs.",

    "form.step3_title": "Last step.",
    "form.step3_desc": "Tell us how you see your place in the E-Dome ecosystem.",

    "form.label_prenom": "First name *",
    "form.label_nom": "Last name *",
    "form.label_email": "Email *",
    "form.label_telephone": "Phone",
    "form.label_activites": "Your activities *",
    "form.label_activites_multi": "(multiple choices possible)",
    "form.label_activite_autre": "Specify your activity",
    "form.label_ville": "City",
    "form.label_pays": "Country *",
    "form.label_experience": "Years of experience in real estate",
    "form.label_premier_membre": "Would you like to be among the first members at launch?",
    "form.label_source": "How did you hear about E-Dome?",
    "form.label_message": "A message, a question, an idea? (optional)",
    "form.label_newsletter":
      "I would like to receive E-Dome news and be informed of the next steps of the project.",

    "form.placeholder_prenom": "Your first name",
    "form.placeholder_nom": "Your last name",
    "form.placeholder_email": "your@email.com",
    "form.placeholder_telephone": "+41 79 000 00 00",
    "form.placeholder_ville": "Your city",
    "form.placeholder_pays": "Switzerland, France...",
    "form.placeholder_message": "Share what you think about the project...",

    "form.activity_agent": "Real estate agent",
    "form.activity_hote": "Host / Owner",
    "form.activity_investisseur": "Investor",
    "form.activity_apporteur": "Business referrer",
    "form.activity_formateur": "Trainer",
    "form.activity_photographe": "Real estate photographer",
    "form.activity_courtier": "Broker / Financing",
    "form.activity_notaire": "Notary",
    "form.activity_architecte": "Architect",
    "form.activity_promoteur": "Developer",
    "form.activity_home_stager": "Home stager",
    "form.activity_gestionnaire": "Property manager",
    "form.activity_autre": "Other",

    "form.experience_beginner": "Beginner",
    "form.experience_1_3": "1-3 years",
    "form.experience_3_10": "3-10 years",
    "form.experience_10_plus": "10+ years",

    "form.source_social": "Social media",
    "form.source_word_of_mouth": "Word of mouth",
    "form.source_google": "Google search",
    "form.source_recommendation": "Professional recommendation",
    "form.source_event": "Event / Conference",
    "form.source_other": "Other",

    "form.member_yes": "Yes, I want to be among the first",
    "form.member_yes_sub": "Early access, founding badge, priority visibility",
    "form.member_maybe": "Maybe, I want to learn more first",
    "form.member_maybe_sub": "Receive updates and decide later",
    "form.member_no": "No, I just want to explore the mockup",
    "form.member_no_sub": "Free access to the demonstration",

    "form.success_title": "Thank you, {name}!",
    "form.success_desc":
      "Your expression of interest has been successfully recorded.",
    "form.success_founder": "You are among the first founding members.",
    "form.success_desktop_desc":
      "You can now explore the interactive E-Dome mockup with all its features.",
    "form.success_desktop_disclaimer":
      "Reminder: this mockup is a visualization model with fictitious data. It allows you to discover the features planned for the final platform.",
    "form.success_desktop_cta": "Access the mockup",
    "form.success_mobile_title": "Mockup available on desktop",
    "form.success_mobile_desc":
      "The interactive E-Dome mockup is optimized for desktop display (PC or Mac). Visit your desktop browser to explore all the features.",

    "form.nav_back": "Back",
    "form.nav_back_site": "Back to site",
    "form.nav_continue": "Continue",
    "form.nav_submit": "Access the mockup",
    "form.step_of": "Step {current} / {total}",
  },

  th: {
    // ── Hero ──────────────────────────────────────────────────────────────
    "hero.label": "ระบบนิเวศด้านอสังหาริมทรัพย์",
    "hero.title1": "อสังหาริมทรัพย์",
    "hero.title2": "ภายใต้หลังคาเดียวกัน",
    "hero.subtitle":
      "สนับสนุนโครงการโดยการแสดงความสนใจของคุณ แบบสอบถามง่ายๆ ฟรีและไม่มีข้อผูกมัด ที่พิสูจน์ความต้องการที่แท้จริงของตลาด และช่วยเราสร้างแพลตฟอร์มที่เหมาะกับคุณ",
    "hero.cta": "แสดงความสนใจ",
    "hero.learn": "เรียนรู้เพิ่มเติม",
    "hero.demo": "ดูเดโม",
    "hero.mockup": "ดูแบบจำลอง",

    // ── Navbar ────────────────────────────────────────────────────────────
    "nav.vision": "วิสัยทัศน์",
    "nav.features": "ฟีเจอร์",
    "nav.founders": "ผู้ก่อตั้ง",
    "nav.roadmap": "Roadmap",

    // ── About ─────────────────────────────────────────────────────────────
    "about.label": "วิสัยทัศน์ของเรา",
    "about.title1": "ออกแบบมาเพื่อทุก",
    "about.title2": "ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์",
    "about.p1":
      "E-Dome ไม่ใช่แค่อีกหนึ่งแพลตฟอร์ม แต่เป็นระบบนิเวศที่ผู้เชี่ยวชาญทุกคน — เจ้าของที่พัก ตัวแทน ผู้พัฒนาโครงการ ช่างภาพ นายหน้า ทนายความ สถาปนิก ผู้ฝึกอบรม — มีพื้นที่ที่ออกแบบมาเพื่ออาชีพของตน บัญชีเดียว โปรไฟล์ที่ปรับแต่งได้ตามกิจกรรมปัจจุบันของคุณ",
    "about.p2":
      "หัวใจของโมเดล: ระบบค่าคอมมิชชันที่โปร่งใส ตอบแทนทุกส่วนของห่วงโซ่ ผู้แนะนำธุรกิจได้รับส่วนแบ่ง ผู้ฝึกอบรมสร้างรายได้จากความเชี่ยวชาญ เจ้าของที่พักจัดการการจอง ผู้ให้บริการนำเสนอบริการ — ทั้งหมดจากที่เดียว ไม่กระจัดกระจาย",
    "about.roles_label":
      "โปรไฟล์ที่สลับเปลี่ยนได้ ปรับตัวตามทุกอาชีพด้านอสังหาริมทรัพย์ — บัญชีเดียวสำหรับทุกกิจกรรมของคุณ",
    "about.more": "และอื่นๆ อีกมาก…",
    "about.role_hote": "เจ้าของที่พัก",
    "about.role_agence": "เอเจนซี",
    "about.role_agent": "ตัวแทน",
    "about.role_investisseur": "นักลงทุน",
    "about.role_formateur": "ผู้ฝึกอบรม",
    "about.role_apporteur": "ผู้แนะนำธุรกิจ",
    "about.role_photographe": "ช่างภาพ",
    "about.role_courtier": "นายหน้า",
    "about.role_notaire": "ทนายความ",
    "about.role_architecte": "สถาปนิก",
    "about.role_promoteur": "ผู้พัฒนาโครงการ",
    "about.role_client": "ลูกค้า",

    // ── Featured video ────────────────────────────────────────────────────
    "featured.label": "แพลตฟอร์ม",
    "featured.desc":
      "มากกว่า 30 หน้าที่ใช้งานได้: Feed สังคมพร้อม Stories และ Reels, ตลาดซื้อขายพร้อมแผนที่แบบโต้ตอบและการคำนวณผลตอบแทน, ระบบส่งข้อความ, Dashboard ที่ปรับตัวตามบทบาทของคุณ, โมดูลฝึกอบรมวิดีโอ, ระบบค่าคอมมิชชันแบบเรียลไทม์, การจองพร้อมตัวเลือกที่ปรับแต่งได้ (บริการดูแล อาหารเช้า ขนส่ง ตกแต่ง) และการจัดการการชำระเงิน",
    "featured.disclaimer":
      "แบบจำลองเพื่อการแสดงผล — ข้อมูลที่แสดงเป็นข้อมูลสมมติ มีจุดประสงค์เพื่อแสดงฟีเจอร์ที่วางแผนไว้เท่านั้น",
    "featured.cta": "เข้าสู่เดโม",
    "featured.mobile_desc":
      "มากกว่า 30 หน้าที่ใช้งานได้: Feed สังคม, ตลาดซื้อขายพร้อมแผนที่แบบโต้ตอบ, ระบบส่งข้อความ, Dashboard หลายบทบาท, ฝึกอบรมวิดีโอ, ระบบค่าคอมมิชชัน, การจองพร้อมตัวเลือกที่ปรับแต่งได้และการจัดการการชำระเงิน",
    "featured.mobile_disclaimer": "แบบจำลองเพื่อการแสดงผล — ข้อมูลสมมติ",

    // ── Problem ───────────────────────────────────────────────────────────
    "problem.label": "ปัญหาที่พบ",
    "problem.title1": "ตลาดที่",
    "problem.title2": "รั่วไหล",
    "problem.desc":
      "ค้นหาอสังหาริมทรัพย์ ใช้เว็บไซต์หนึ่ง จอง ใช้อีกเว็บหนึ่ง ฝึกอบรม ใช้อีกที่หนึ่ง หาผู้ให้บริการ ใช้สมุดรายชื่อ ติดตามค่าคอมมิชชัน ใช้สเปรดชีต ทุกขั้นตอนนำไปสู่เครื่องมือที่แตกต่างกัน — และในทุกการเปลี่ยนผ่าน คุณสูญเสียเวลา สมาธิ และโอกาส เส้นทางอสังหาริมทรัพย์ในปัจจุบันเป็นชุดของจุดขาดตอนที่มีค่าใช้จ่ายสูงสำหรับทุกฝ่าย",

    "problem.stat1_value": "12",
    "problem.stat1_unit": "เครื่องมือโดยเฉลี่ย",
    "problem.stat1_desc":
      "ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ใช้เครื่องมือที่แตกต่างกันโดยเฉลี่ยประมาณ 12 รายการในการจัดการธุรกิจ: ประกาศ การจอง บัญชี การสื่อสาร การฝึกอบรม การหาลูกค้า",
    "problem.stat1_source": "McKinsey Global Institute — Real Estate Technology Adoption, 2024",

    "problem.stat2_value": "40%",
    "problem.stat2_unit": "ของเวลาที่สูญเสียไป",
    "problem.stat2_desc":
      "เกือบครึ่งหนึ่งของเวลาทำงานของตัวแทนและผู้จัดการอสังหาริมทรัพย์ถูกใช้ไปกับงานธุรการและการนำทางระหว่างแพลตฟอร์มที่ไม่เชื่อมต่อกัน",
    "problem.stat2_source": "National Association of Realtors — Technology Report, 2024",

    "problem.stat3_value": "23 min",
    "problem.stat3_unit": "เพื่อกลับมามีสมาธิ",
    "problem.stat3_desc":
      "การขัดจังหวะหรือการเปลี่ยนแอปพลิเคชันแต่ละครั้งต้องใช้เวลาเฉลี่ย 23 นาที 15 วินาทีเพื่อกลับมามีสมาธิในระดับเดิม",
    "problem.stat3_source": "University of California, Irvine — Gloria Mark et al., 2023",

    "problem.stat4_value": "67%",
    "problem.stat4_unit": "ของการยกเลิกออนไลน์",
    "problem.stat4_desc":
      "สองในสามของการซื้อหรือจองอสังหาริมทรัพย์ออนไลน์ถูกยกเลิกเมื่อผู้ใช้ต้องออกจากแพลตฟอร์มระหว่างทางเพื่อดำเนินการขั้นตอนอื่นที่อื่น",
    "problem.stat4_source": "JLL — Digital Buyer Journey Report, 2024",

    "problem.pill": "E-Dome รวมทุกอย่างไว้ในที่เดียว",
    "problem.pill_bold": "ไม่มีความขัดข้อง ไม่มีความกระจัดกระจาย",

    // ── Services ──────────────────────────────────────────────────────────
    "services.label": "ฟีเจอร์",
    "services.title1": "ครบวงจร",
    "services.title2": "ไม่มีข้อประนีประนอม",
    "services.subtitle":
      "โปรไฟล์ที่สลับเปลี่ยนได้ ปรับตัวตามทุกอาชีพด้านอสังหาริมทรัพย์ — บัญชีเดียวสำหรับทุกกิจกรรมของคุณ",

    "services.f1_tag": "เครือข่ายสังคมอสังหาริมทรัพย์",
    "services.f1_title": "Feed, Stories & Reels",
    "services.f1_desc":
      "ฟีดข่าวสารที่ออกแบบมาเพื่ออสังหาริมทรัพย์: แบ่งปันอสังหาริมทรัพย์ การเยี่ยมชม การวิเคราะห์ตลาด Stories ชั่วคราว Reels อสังหาริมทรัพย์ การกล่าวถึง แฮชแท็ก — ปฏิสัมพันธ์ทางสังคมที่มุ่งเน้นผู้เชี่ยวชาญ",

    "services.f2_tag": "ตลาดซื้อขายและการจอง",
    "services.f2_title": "ค้นหา เปรียบเทียบ จอง",
    "services.f2_desc":
      "แผนที่แบบโต้ตอบ ตัวกรองขั้นสูงตามประเภท ประเทศ และงบประมาณ ผลตอบแทนรวมและสุทธิ ราคาต่อตารางเมตร อันดับพลังงาน การคาดการณ์ ROI 5 และ 10 ปี การจองแบบบูรณาการพร้อมปฏิทินและการชำระเงินที่ปลอดภัย เจ้าของที่พักยังสามารถเสนอตัวเลือกเพิ่มเติมสำหรับการจอง — การตกแต่งแบบโรแมนติก อาหารเช้า เมนูในห้อง ขนส่ง บริการดูแล — ฟรีหรือมีค่าใช้จ่าย",

    "services.f3_tag": "การฝึกอบรมและใบรับรอง",
    "services.f3_title": "เรียนรู้จากผู้เชี่ยวชาญ",
    "services.f3_desc":
      "แคตตาล็อกการฝึกอบรมวิดีโอโดยผู้เชี่ยวชาญภาคสนาม: การลงทุนให้เช่า การจัดการอสังหาริมทรัพย์ การวิเคราะห์ทางการเงิน ภาษีระหว่างประเทศ โมดูลที่มีโครงสร้างและใบรับรอง",

    "services.f4_tag": "ระบบค่าคอมมิชชัน",
    "services.f4_title": "แนะนำ บอกต่อ สร้างรายได้",
    "services.f4_desc":
      "หัวใจทางเศรษฐกิจของ E-Dome: ผู้ใช้ทุกคนสามารถเป็นผู้แนะนำธุรกิจ ค่าคอมมิชชันจากการเช่า การขาย การฝึกอบรม — ลิงก์ที่ติดตามได้ Dashboard การติดตาม การชำระเงินอัตโนมัติ",

    "services.f5_tag": "ถ่ายทอดสดและกิจกรรม",
    "services.f5_title": "สัมมนาออนไลน์และการประชุม",
    "services.f5_desc":
      "จัดกำหนดการถ่ายทอดสดการเยี่ยมชมเสมือนจริง สัมมนาวิเคราะห์ตลาด เซสชันถาม-ตอบ มีรีเพลย์ การลงทะเบียนพร้อมการแจ้งเตือน กิจกรรมแบบพบหน้าและออนไลน์",

    "services.f6_tag": "บริการมืออาชีพ",
    "services.f6_title": "ตลาดผู้ให้บริการ",
    "services.f6_desc":
      "ช่างภาพ นักจัดบ้าน ผู้จัดการกุญแจ ผู้ปรับปรุง ทนายความ นายหน้า — ค้นหาและติดต่อผู้ให้บริการที่มีคุณภาพจากแพลตฟอร์ม คำขอใบเสนอราคาแบบบูรณาการ",

    // ── Philosophy ────────────────────────────────────────────────────────
    "philosophy.label": "แนวทางของเรา",
    "philosophy.title1": "ทำไม",
    "philosophy.title2": "สิ่งนี้จึงเปลี่ยนทุกอย่าง",
    "philosophy.desc":
      "E-Dome ไม่ได้แค่รวมเครื่องมือเข้าด้วยกัน แพลตฟอร์มคิดใหม่เกี่ยวกับวิธีการทำงาน ร่วมมือ และรับค่าตอบแทนของผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ — โดยวางการเชื่อมต่อระหว่างบุคคลและความโปร่งใสไว้เป็นหัวใจของทุกปฏิสัมพันธ์",

    "philosophy.p1_title": "ระบบนิเวศ ไม่ใช่เครื่องมือ",
    "philosophy.p1_desc":
      "ปัจจุบัน ตัวแทนลงประกาศอสังหาริมทรัพย์บนพอร์ทัลหนึ่ง สื่อสารผ่านอีกที่หนึ่ง จัดการการจองที่อื่น และติดตามรายได้ในสเปรดชีต E-Dome ลบขอบเขตเหล่านี้: ทุกอย่างเชื่อมต่อกัน ทุกอย่างสื่อสารกัน ทุกอย่างจัดการได้จาก Dashboard เดียว",

    "philosophy.p2_title": "โปรไฟล์ที่เติบโตไปกับคุณ",
    "philosophy.p2_desc":
      "คุณเริ่มต้นเป็นผู้แนะนำธุรกิจ จากนั้นกลายเป็นเจ้าของที่พัก แล้วเป็นผู้ฝึกอบรม บน E-Dome โปรไฟล์ของคุณปรับตัวได้ ไม่ต้องสร้างบัญชีใหม่หรือเริ่มต้นใหม่ เปิดใช้งานบทบาท ปิดใช้งาน — ประวัติ ผู้ติดต่อ และข้อมูลของคุณยังคงอยู่",

    "philosophy.p3_title": "ค่าคอมมิชชันที่โปร่งใส",
    "philosophy.p3_desc":
      "ผู้เชี่ยวชาญทุกคนที่ได้รับค่าตอบแทนมี Dashboard รายได้ของตนเอง ผู้แนะนำติดตามค่าคอมมิชชันแบบเรียลไทม์ เจ้าของที่พักดูการจองและรายได้ ผู้ฝึกอบรมติดตามยอดขาย ทุกอย่างตรวจสอบได้ มีเอกสาร และโปร่งใส — ไม่มีพื้นที่เทาอีกต่อไป",

    "philosophy.p4_title": "โซเชียลมีเดียเพื่อธุรกิจ",
    "philosophy.p4_desc":
      "อสังหาริมทรัพย์เป็นธุรกิจเครือข่าย แต่ไม่มีแพลตฟอร์มใดที่มีพื้นที่สังคมที่แท้จริงสำหรับภาคส่วนนี้ E-Dome รวม Feed, Stories, Reels และระบบส่งข้อความ — ออกแบบมาเพื่อสร้างโอกาสทางธุรกิจ ไม่ใช่แค่ยอดไลก์",

    "philosophy.video_label": "E-Dome",
    "philosophy.video_title1": "พื้นที่เดียว",
    "philosophy.video_title2": "สำหรับอสังหาริมทรัพย์ทั้งหมด",

    "philosophy.video_desktop_p1":
      "ค้นหาอสังหาริมทรัพย์ ลงประกาศ จองการเยี่ยมชม เข้ารับการฝึกอบรม แนะนำผู้ติดต่อ และรับค่าคอมมิชชัน",
    "philosophy.video_desktop_p2":
      "โดยไม่ต้องออกจากแพลตฟอร์ม — E-Dome รวมศูนย์ทุกขั้นตอนของเส้นทาง เพื่อให้ผู้เชี่ยวชาญทุกคนประหยัดเวลา เพิ่มการมองเห็น และเพิ่มรายได้",

    "philosophy.video_mobile_desc":
      "ค้นหา ลงประกาศ จอง เรียนรู้ แนะนำ และรับค่าตอบแทน — โดยไม่ต้องออกจากแพลตฟอร์ม",
    "philosophy.video_cta": "ดูแบบจำลอง",

    "philosophy.tag_recherche": "ค้นหา",
    "philosophy.tag_publication": "ลงประกาศ",
    "philosophy.tag_reservation": "การจอง",
    "philosophy.tag_formation": "การฝึกอบรม",
    "philosophy.tag_recommandation": "การแนะนำ",
    "philosophy.tag_remuneration": "ค่าตอบแทน",

    // ── Founders ──────────────────────────────────────────────────────────
    "founders.label_leo": "ผู้ก่อตั้งและ CEO",
    "founders.label_jp": "ผู้ร่วมก่อตั้งและ COO",

    "founders.leo_p1":
      "ไอเดียของ E-Dome เกิดขึ้นจากการใช้ชีวิตในวงการอสังหาริมทรัพย์จากภายใน ในฐานะผู้แนะนำธุรกิจ ผมใช้เวลาทั้งวันนำทางระหว่างเครื่องมือต่างๆ มากมาย ค้นหาผู้ติดต่อที่ถูกต้องบนแพลตฟอร์มหนึ่ง อสังหาริมทรัพย์ที่ถูกต้องบนอีกแพลตฟอร์ม ติดตามค่าคอมมิชชันในสเปรดชีตที่ทำด้วยมือ ผมสูญเสียเวลาอย่างมาก — และผมรู้ว่าทุกคนในอุตสาหกรรมก็ประสบปัญหาเดียวกัน",
    "founders.leo_p2":
      "ค่ำคืนหนึ่ง ผมเปิดหน้ากระดาษเปล่าและเริ่มร่างว่าแพลตฟอร์มในอุดมคติจะเป็นอย่างไร ไม่ใช่แค่อีกเครื่องมือหนึ่ง — แต่เป็นที่เดียวที่ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ทุกคนจะพบทุกสิ่งที่ต้องการ เครือข่าย ประกาศ การฝึกอบรม ค่าคอมมิชชัน การมองเห็น หน้าต่อหน้า ฟีเจอร์ต่อฟีเจอร์ E-Dome ก็เป็นรูปเป็นร่าง วันนี้ วิสัยทัศน์นั้นกลายเป็นแบบจำลองที่มีมากกว่า 30 หน้า — และในไม่ช้าจะกลายเป็นความจริง",

    "founders.jp_p1":
      "เมื่อ Léonard Ansermet แสดงให้ผมเห็นสิ่งที่เขามีในใจ ผมเข้าใจทันทีว่านี่ไม่ใช่แค่ไอเดียแอป แต่เป็นคำตอบสำหรับปัญหาที่แท้จริง — อุตสาหกรรมที่ผู้คนสร้างคุณค่าทุกวัน แต่ไม่มีพื้นที่ร่วมในการเชื่อมต่อ ร่วมมือ และได้รับการยอมรับ",
    "founders.jp_p2":
      "ด้วยประกาศนียบัตรวิชาชีพแห่งสมาพันธรัฐสวิสสาขาพาณิชยศาสตร์พร้อมวุฒิบัตรวิชาชีพ ผมเรียนรู้ว่าผลิตภัณฑ์ที่ดีไม่เพียงพอ — คุณต้องมีการดำเนินงานที่เข้มงวดและรากฐานที่มั่นคง บทบาทของผมคือการจัดโครงสร้างโมเดล หาพันธมิตรที่เหมาะสม และทำให้มั่นใจว่าทุกการตัดสินใจรับใช้การเติบโตอย่างยั่งยืนของโครงการ นี่คือสิ่งที่ผมสร้างทุกวันเพื่อ E-Dome",

    "founders.quote":
      "เราไม่ได้แค่ต้องการสร้างแอป เราต้องการเปลี่ยนวิธีที่อสังหาริมทรัพย์เชื่อมต่อผู้คน",

    "founders.conviction_label": "ความเชื่อมั่นของเรา",
    "founders.conviction_title":
      "อสังหาริมทรัพย์จะไม่เปลี่ยนแปลงเพราะเครื่องมืออีกตัวหนึ่ง แต่จะเปลี่ยนเมื่อผู้เชี่ยวชาญในวงการเชื่อมต่อกันได้ในที่สุด",
    "founders.conviction_desc":
      "ผู้เชี่ยวชาญที่มีทักษะหลายพันคนยังคงอยู่ในเงามืดเพราะขาดพื้นที่ที่จะทำให้พวกเขาโดดเด่น โอกาสสูญหายทุกวันระหว่างเครื่องมือที่ไม่สื่อสารกัน ค่าคอมมิชชันถูกจ่ายโดยที่ไม่มีใครรู้จริงๆ ว่าให้ใครหรือทำไม นี่ไม่ใช่สิ่งที่หลีกเลี่ยงไม่ได้ — เป็นปัญหาที่เราตัดสินใจแก้ไข",

    "founders.engagement_label": "ความมุ่งมั่นของเรา",
    "founders.engagement_title":
      "เราไม่ได้มองหาผู้ใช้ เรามองหาผู้บุกเบิก",
    "founders.engagement_desc":
      "E-Dome เติบโตด้วยผู้ที่ใช้งานจริงทุกวัน ทุกความคิดเห็นจากภาคสนาม ทุกไอเดียที่แบ่งปัน ทุกความต้องการที่แสดงออก ทำให้แพลตฟอร์มแข็งแกร่งขึ้น คนแรกที่ไว้วางใจเราไม่ได้แค่เข้าร่วมโครงการ — พวกเขาเขียนหน้าแรกของมัน",

    "founders.whatsapp": "WhatsApp",
    "founders.email_label": "contact@edome.world",

    // ── Roadmap ───────────────────────────────────────────────────────────
    "roadmap.label": "Roadmap",
    "roadmap.title1": "จากไอเดีย",
    "roadmap.title2": "สู่การเปิดตัว",
    "roadmap.desc":
      "แนวคิดได้รับการพิสูจน์แล้ว แบบจำลองเผยแพร่ออนไลน์แล้ว ตอนนี้ ทุกการแสดงความสนใจที่เราได้รับ ช่วยเสริมหลักฐานว่าตลาดต้องการ E-Dome — และแรงดึงดูดนี้จะช่วยให้เราโน้มน้าวนักลงทุน ระดมทุนที่จำเป็น และสร้างทีมเทคนิคที่จะทำให้แพลตฟอร์มสุดท้ายเป็นจริง",
    "roadmap.desc2":
      "ทุกคนที่แสดงความสนใจวันนี้ วางก้อนอิฐของสิ่งที่จะกลายเป็นมาตรฐานของอสังหาริมทรัพย์ที่เชื่อมต่อในวันพรุ่งนี้",

    "roadmap.status_done": "เสร็จสิ้น",
    "roadmap.status_current": "กำลังดำเนินการ",
    "roadmap.status_upcoming": "เร็วๆ นี้",

    "roadmap.phase1_title": "ออกแบบและพิสูจน์แนวคิด",
    "roadmap.phase1_item1": "แบบจำลองแบบโต้ตอบที่สมบูรณ์ (30+ หน้า)",
    "roadmap.phase1_item2": "เครือข่ายสังคมอสังหาริมทรัพย์ (Feed, Stories, Reels)",
    "roadmap.phase1_item3": "ตลาดซื้อขายพร้อมแผนที่ ตัวกรอง และการคำนวณผลตอบแทน",
    "roadmap.phase1_item4": "Dashboard ที่ปรับตัวตามโปรไฟล์วิชาชีพ",
    "roadmap.phase1_item5": "ระบบค่าคอมมิชชันสำหรับผู้แนะนำธุรกิจ",
    "roadmap.phase1_item6": "การฝึกอบรมวิดีโอพร้อมโมดูลและใบรับรอง",
    "roadmap.phase1_item7": "ระบบส่งข้อความ การจอง กิจกรรม และบริการ",

    "roadmap.phase2_title": "ตรวจสอบความต้องการและโน้มน้าว",
    "roadmap.phase2_item1": "รวบรวมการแสดงความสนใจจากผู้เชี่ยวชาญในอุตสาหกรรม",
    "roadmap.phase2_item2": "การสาธิตและความคิดเห็นจากภาคสนาม",
    "roadmap.phase2_item3": "การหานักลงทุนและเตรียมการระดมทุน",
    "roadmap.phase2_item4": "การจัดโครงสร้างทางกฎหมายของบริษัท",
    "roadmap.phase2_item5": "ความร่วมมือเชิงกลยุทธ์แรกกับเอเจนซีและผู้ให้บริการ",

    "roadmap.phase3_title": "ระดมทุนและรับสมัครทีม",
    "roadmap.phase3_item1": "การระดมทุนเพื่อสนับสนุนการพัฒนา",
    "roadmap.phase3_item2": "การรับสมัครทีมพัฒนา",
    "roadmap.phase3_item3": "การพัฒนาเว็บไซต์และแอปมือถือ (iOS & Android)",
    "roadmap.phase3_item4": "การชำระเงินที่ปลอดภัยและระบบ Escrow",
    "roadmap.phase3_item5": "ค่าคอมมิชชันอัตโนมัติและตรวจสอบได้",
    "roadmap.phase3_item6": "เบต้าส่วนตัว สวิตเซอร์แลนด์ + ประเทศไทย",

    "roadmap.phase4_title": "เปิดตัวและขยาย",
    "roadmap.phase4_item1": "เปิดตัวสาธารณะ สวิตเซอร์แลนด์ & ประเทศไทย",
    "roadmap.phase4_item2": "เผยแพร่แอปมือถือบน App Store",
    "roadmap.phase4_item3": "ขยายสู่ฝรั่งเศส โมร็อกโก และสหรัฐอาหรับเอมิเรตส์",
    "roadmap.phase4_item4": "เปิด API สำหรับการเชื่อมต่อบุคคลที่สาม",
    "roadmap.phase4_item5": "โปรแกรมแอมบาสเดอร์และผู้แนะนำที่ได้รับการรับรอง",

    "roadmap.inscriptions_label": "เปิดรับลงทะเบียน",
    "roadmap.cta_title1": "เข้าร่วมเป็นสมาชิกกลุ่มแรก",
    "roadmap.cta_title2": "รับสิทธิประโยชน์แรก",
    "roadmap.cta_subtitle":
      "คนแรกที่แสดงความสนใจไม่ได้แค่เข้าร่วมโครงการ — พวกเขาได้ตำแหน่งพิเศษในระบบนิเวศ E-Dome พร้อมสิทธิประโยชน์เฉพาะสำหรับสมาชิกผู้ก่อตั้ง",
    "roadmap.cta_disclaimer":
      "การแสดงความสนใจเป็นไปอย่างอิสระ ไม่มีค่าใช้จ่าย และไม่มีข้อผูกมัด ช่วยเราพิสูจน์ความต้องการของตลาด",

    "roadmap.benefit1_title": "เหรียญสมาชิกผู้ก่อตั้ง",
    "roadmap.benefit1_desc":
      "เหรียญถาวรบนโปรไฟล์ของคุณที่พิสูจน์ว่าคุณอยู่ที่นี่ตั้งแต่เริ่มต้น การยอมรับตลอดชีวิตในระบบนิเวศ",
    "roadmap.benefit2_title": "การเข้าถึงล่วงหน้า",
    "roadmap.benefit2_desc":
      "ตั้งค่าบัญชี โปรไฟล์ และการตั้งค่าของคุณก่อนการเปิดตัวสาธารณะ พร้อมใช้งานตั้งแต่วันแรก",
    "roadmap.benefit3_title": "การมองเห็นแบบจัดลำดับความสำคัญ",
    "roadmap.benefit3_desc":
      "โปรไฟล์ของคุณถูกเน้นในผลการค้นหาและคำแนะนำในช่วงเดือนแรก",
    "roadmap.benefit4_title": "การประชุมเฉพาะ",
    "roadmap.benefit4_desc":
      "เข้าถึงเซสชันส่วนตัวเพื่อค้นพบฟีเจอร์ แบ่งปันความคิดเห็น และมีอิทธิพลต่อลำดับความสำคัญในการพัฒนา",
    "roadmap.benefit5_title": "เครือข่ายผู้ก่อตั้ง",
    "roadmap.benefit5_desc":
      "เข้าร่วมกลุ่มส่วนตัวกับสมาชิกยุคแรกและผู้ก่อตั้ง แลกเปลี่ยน ร่วมมือ สร้างด้วยกัน",
    "roadmap.benefit6_title": "สิทธิประโยชน์เฉพาะ",
    "roadmap.benefit6_desc":
      "เงื่อนไขพิเศษสำหรับฟีเจอร์พรีเมียมในอนาคต การฝึกอบรม และเครื่องมือของแพลตฟอร์ม",

    "roadmap.cta1": "แสดงความสนใจ",
    "roadmap.cta2": "สำรวจเดโมก่อน",

    // ── Footer ────────────────────────────────────────────────────────────
    "footer.desc": "ระบบนิเวศอสังหาริมทรัพย์ระหว่างประเทศ จากสวิตเซอร์แลนด์สู่ทั่วโลก",
    "footer.demo_label": "สำรวจเดโม",
    "footer.platform_label": "แพลตฟอร์ม",
    "footer.about_label": "เกี่ยวกับเรา",
    "footer.copyright":
      "© 2026 E-Dome — แบบจำลองเพื่อการแสดงผล ข้อมูลทั้งหมดเป็นข้อมูลสมมติ มีจุดประสงค์เพื่อแสดงฟีเจอร์",
    "footer.access": "เข้าถึงเดโม",

    "footer.link_feed": "Feed สังคม",
    "footer.link_marketplace": "ตลาดซื้อขาย",
    "footer.link_dashboard": "Dashboard",
    "footer.link_formations": "การฝึกอบรม",
    "footer.link_live": "ถ่ายทอดสดและรีเพลย์",
    "footer.link_messages": "ข้อความ",
    "footer.link_apporteurs": "ผู้แนะนำธุรกิจ",
    "footer.link_reservations": "การจอง",
    "footer.link_statistiques": "สถิติ",
    "footer.link_evenements": "กิจกรรม",
    "footer.link_services": "บริการ",
    "footer.link_investisseurs": "นักลงทุน",
    "footer.link_vision": "วิสัยทัศน์ของเรา",
    "footer.link_features": "ฟีเจอร์",
    "footer.link_founders": "ผู้ก่อตั้ง",
    "footer.link_roadmap": "Roadmap",
    "footer.link_conditions": "เงื่อนไข",
    "footer.link_privacy": "ความเป็นส่วนตัว",

    // ── Form ──────────────────────────────────────────────────────────────
    "form.step1_title": "มาทำความรู้จักกัน",
    "form.step1_desc":
      "ข้อมูลนี้ช่วยให้เราติดต่อคุณและปรับแต่งประสบการณ์ของคุณ",
    "form.step1_disclaimer":
      "แบบฟอร์มนี้เป็นการแสดงความสนใจ ไม่มีข้อผูกมัดหรือภาระผูกพัน แบบจำลองที่คุณกำลังจะสำรวจเป็นโมเดลเพื่อการแสดงผล — ข้อมูลทั้งหมดที่นำเสนอเป็นข้อมูลสมมติ",

    "form.step2_title": "บอกเราเกี่ยวกับตัวคุณ",
    "form.step2_desc": "โปรไฟล์ของคุณช่วยเราปรับ E-Dome ให้ตรงกับความต้องการจริงในภาคสนาม",

    "form.step3_title": "ขั้นตอนสุดท้าย",
    "form.step3_desc": "บอกเราว่าคุณเห็นตำแหน่งของคุณในระบบนิเวศ E-Dome อย่างไร",

    "form.label_prenom": "ชื่อ *",
    "form.label_nom": "นามสกุล *",
    "form.label_email": "อีเมล *",
    "form.label_telephone": "โทรศัพท์",
    "form.label_activites": "กิจกรรมของคุณ *",
    "form.label_activites_multi": "(เลือกได้หลายตัวเลือก)",
    "form.label_activite_autre": "ระบุกิจกรรมของคุณ",
    "form.label_ville": "เมือง",
    "form.label_pays": "ประเทศ *",
    "form.label_experience": "ปีประสบการณ์ในอสังหาริมทรัพย์",
    "form.label_premier_membre": "คุณต้องการเป็นหนึ่งในสมาชิกกลุ่มแรกเมื่อเปิดตัวหรือไม่?",
    "form.label_source": "คุณทราบเกี่ยวกับ E-Dome ได้อย่างไร?",
    "form.label_message": "ข้อความ คำถาม หรือไอเดีย? (ไม่บังคับ)",
    "form.label_newsletter":
      "ฉันต้องการรับข่าวสาร E-Dome และรับแจ้งเกี่ยวกับขั้นตอนถัดไปของโครงการ",

    "form.placeholder_prenom": "ชื่อของคุณ",
    "form.placeholder_nom": "นามสกุลของคุณ",
    "form.placeholder_email": "your@email.com",
    "form.placeholder_telephone": "+66 80 000 0000",
    "form.placeholder_ville": "เมืองของคุณ",
    "form.placeholder_pays": "ไทย, สวิตเซอร์แลนด์...",
    "form.placeholder_message": "แบ่งปันความคิดเห็นของคุณเกี่ยวกับโครงการ...",

    "form.activity_agent": "ตัวแทนอสังหาริมทรัพย์",
    "form.activity_hote": "เจ้าของที่พัก / เจ้าของ",
    "form.activity_investisseur": "นักลงทุน",
    "form.activity_apporteur": "ผู้แนะนำธุรกิจ",
    "form.activity_formateur": "ผู้ฝึกอบรม",
    "form.activity_photographe": "ช่างภาพอสังหาริมทรัพย์",
    "form.activity_courtier": "นายหน้า / การเงิน",
    "form.activity_notaire": "ทนายความ",
    "form.activity_architecte": "สถาปนิก",
    "form.activity_promoteur": "ผู้พัฒนาโครงการ",
    "form.activity_home_stager": "นักจัดบ้าน",
    "form.activity_gestionnaire": "ผู้จัดการอสังหาริมทรัพย์",
    "form.activity_autre": "อื่นๆ",

    "form.experience_beginner": "ผู้เริ่มต้น",
    "form.experience_1_3": "1-3 ปี",
    "form.experience_3_10": "3-10 ปี",
    "form.experience_10_plus": "10+ ปี",

    "form.source_social": "โซเชียลมีเดีย",
    "form.source_word_of_mouth": "การบอกต่อ",
    "form.source_google": "ค้นหาใน Google",
    "form.source_recommendation": "การแนะนำจากผู้เชี่ยวชาญ",
    "form.source_event": "งานอีเวนต์ / การประชุม",
    "form.source_other": "อื่นๆ",

    "form.member_yes": "ใช่ ฉันต้องการเป็นหนึ่งในกลุ่มแรก",
    "form.member_yes_sub": "การเข้าถึงล่วงหน้า เหรียญผู้ก่อตั้ง การมองเห็นแบบจัดลำดับความสำคัญ",
    "form.member_maybe": "อาจจะ ฉันต้องการเรียนรู้เพิ่มเติมก่อน",
    "form.member_maybe_sub": "รับข่าวสารอัปเดตและตัดสินใจภายหลัง",
    "form.member_no": "ไม่ ฉันแค่ต้องการสำรวจแบบจำลอง",
    "form.member_no_sub": "เข้าถึงการสาธิตได้ฟรี",

    "form.success_title": "ขอบคุณ {name}!",
    "form.success_desc":
      "การแสดงความสนใจของคุณได้รับการบันทึกเรียบร้อยแล้ว",
    "form.success_founder": "คุณเป็นหนึ่งในสมาชิกผู้ก่อตั้งกลุ่มแรก",
    "form.success_desktop_desc":
      "ตอนนี้คุณสามารถสำรวจแบบจำลองแบบโต้ตอบของ E-Dome พร้อมฟีเจอร์ทั้งหมดได้",
    "form.success_desktop_disclaimer":
      "หมายเหตุ: แบบจำลองนี้เป็นโมเดลเพื่อการแสดงผลพร้อมข้อมูลสมมติ ช่วยให้คุณค้นพบฟีเจอร์ที่วางแผนไว้สำหรับแพลตฟอร์มสุดท้าย",
    "form.success_desktop_cta": "เข้าถึงแบบจำลอง",
    "form.success_mobile_title": "แบบจำลองพร้อมใช้งานบนเดสก์ท็อป",
    "form.success_mobile_desc":
      "แบบจำลองแบบโต้ตอบของ E-Dome ได้รับการปรับให้เหมาะสำหรับการแสดงผลบนเดสก์ท็อป (PC หรือ Mac) เยี่ยมชมเบราว์เซอร์เดสก์ท็อปของคุณเพื่อสำรวจฟีเจอร์ทั้งหมด",

    "form.nav_back": "ย้อนกลับ",
    "form.nav_back_site": "กลับสู่เว็บไซต์",
    "form.nav_continue": "ดำเนินการต่อ",
    "form.nav_submit": "เข้าถึงแบบจำลอง",
    "form.step_of": "ขั้นตอน {current} / {total}",
  },
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const STORAGE_KEY = "edome_landing_lang";

const LandingLangContext = createContext<LandingLangContextValue | null>(null);

export function LandingLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LandingLang>("fr");

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "fr" || stored === "th") {
        setLangState(stored);
      }
    } catch {
      // SSR or storage unavailable — keep default
    }
  }, []);

  const setLang = useCallback((next: LandingLang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] ?? key;
    },
    [lang],
  );

  return (
    <LandingLangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LandingLangContext.Provider>
  );
}

export function useLandingLang(): LandingLangContextValue {
  const ctx = useContext(LandingLangContext);
  if (!ctx) {
    throw new Error("useLandingLang must be used within a LandingLanguageProvider");
  }
  return ctx;
}
