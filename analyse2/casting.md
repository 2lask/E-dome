# Casting — les seize personnes de la démonstration

*Brief du CEO pour l'étape 4 (D16). C'est la direction : noms, générations,
voix, lieux. Le fondateur peut réécrire ce fichier ; l'implémentation le suit.
Les identifiants sont ceux de l'annuaire (`users[]`) — on RÉAFFECTE les ids
existants, on n'en crée pas, pour que tous les liens restent valides.*

## Règles

- **Diversité réelle de la Suisse romande** : noms romands, alémaniques,
  italiens, portugais, balkaniques, français ; générations de 26 à 72 ans.
- **Registres distincts** : chacun écrit à sa façon. Au moins une personne qui
  écrit **court et mal**, une qui pose des **questions de débutant**, une qui
  **doute**. Tout le monde n'est pas expert.
- **Lieux réels, marché plausible** (repères ci-dessous). Aucun quartier inventé.
- **Photos** : visages **synthétiques** (personne réelle représentée), cohérents
  avec l'âge et le registre, servis depuis `public/avatars/<id>.jpg`.
- **Chiffres** : tout ce qui est compteur est **dérivé** — abonnés = relations
  de suivi réelles entre les seize (graphe `FOLLOWS`), avis = avis réellement
  reçus, biens = biens réellement hébergés, revenu = journal commissionnable,
  volume de transactions = GMV non commissionnable. Un réseau qui se lance :
  des dizaines, pas des milliers — et chaque nombre se vérifie en cliquant.
- **Jamais « courtier / courtière »** dans un texte de profil (D16) : on dit
  « agent immobilier », « agente », « agence ».
- **International assumé, et restreint** : un profil en France ne touche jamais
  de prime sur un bien (volet biens exclu en France — JURIDIQUE §0.5) ; sa fiche
  le dit.

## Les seize

| id | Nom | Âge | Ville (quartier) | Rôle(s) | Voix |
|---|---|---|---|---|---|
| user-001 | **Léo Martin** (garde) | 41 | Lausanne (Sous-Gare) | propriétaire bailleur, hôte courte durée, apporteur, auteur d'une formation | réfléchi, partage ce qu'il apprend |
| user-002 | **Céline Bovard** (ex-Sophie Durand) | 46 | Lutry (Lavaux) | agente immobilière indépendante | chaleureuse, précise, parle des biens comme des lieux de vie |
| user-003 | **Paolo Bernasconi** (ex-Marc Favre) | 61 | Genève (Champel) | investisseur, ancien banquier privé | froid, chiffré, phrases courtes, aucune émotion |
| user-015 | **Jean-Luc Hartmann** (garde) | 58 | Neuchâtel | directeur, Hartmann Immobilier SA | institutionnel, posé |
| user-004 | **Aline Tschanz** | 33 | Neuchâtel | agente salariée chez Hartmann Immobilier SA | jeune pro dynamique, organisée |
| user-005 | **Nikola Jović** | 29 | Yverdon-les-Bains | prestataire — photographe immobilier (drone, visite 3D) | **écrit court et mal** : pas d'accents, abréviations (« dispo sam pr shooting, msg moi ») |
| user-006 | **Ana Ferreira** | 34 | Renens | particulière, cherche à louer (famille, deux enfants) | **débutante** : questions simples, polie (« c'est normal qu'on demande 3 mois de garantie ? ») |
| user-007 | **Bernard Chappuis** | 72 | Pully | particulier, vend seul la maison familiale | peu à l'aise avec le numérique, formules un peu datées, quelques fautes |
| user-008 | **Clémence Jaquet** | 27 | Morges | particulière, premier achat | **doute** : pèse le pour et le contre, demande l'avis des autres (« est-ce vraiment le moment ? ») |
| user-009 | **Reto Aebischer** | 49 | Fribourg | prestataire — architecte (rénovation, Minergie, CECB) | technique, précis, bilingue |
| user-010 | **Elena Currat** | 38 | Vevey | prestataire — home staging | enthousiaste, visuelle, sobre |
| user-011 | **Sandrine Monnier** | 53 | Neuchâtel | créatrice de formations (fiscalité immobilière, ex-fiduciaire) | pédagogue, structurée |
| user-012 | **Yves Sottas** | 67 | Bulle (La Gruyère) | apporteur (retraité, connaît toute la région) | formel, à l'ancienne, signe « Meilleures salutations, Y. Sottas » |
| user-013 | **Mirjana Kovač** | 45 | Montreux | hôte courte durée (deux appartements) | pragmatique, parle taux d'occupation et saison |
| user-014 | **Hélène Marchal** | 52 | Évian-les-Bains (France) | apporteuse — marketplace uniquement (formations, événements) | commerciale, réseau transfrontalier |
| user-016 | **Amina El Idrissi** | 44 | Marrakech (Guéliz), Maroc | créatrice de formations (gestion locative touristique, pricing dynamique) | bienveillante, concrète |

Couverture : particulier vendeur (Bernard), particulier locataire (Ana),
premier achat (Clémence), agent indépendant (Céline), agent salarié (Aline),
patron d'agence (Jean-Luc), prestataires (Nikola, Reto, Elena), créateurs
(Sandrine, Amina, Léo), hôtes courte durée (Mirjana, Léo), apporteurs (Yves
en Suisse — prime biens autorisée ; Hélène en France — marketplace seulement),
investisseur (Paolo), bailleur (Léo). International assumé : Hélène (France),
Amina (Maroc).

## Relations (réciproques, visibles)

- **Hartmann Immobilier SA** = Jean-Luc (directeur) + Aline (agente) : l'équipe
  de l'agence, ce sont de vraies personnes de l'annuaire.
- **Céline ↔ Paolo** : Paolo a acheté un appartement via Céline ; il lui a
  laissé un avis (sec, factuel), elle l'a remercié.
- **Céline + Nikola + Elena** : ils travaillent ensemble sur ses mises en vente
  (photos de Nikola, home staging d'Elena) — avis croisés.
- **Bernard** vend seul à Pully ; il a pris Nikola pour les photos ; Céline lui
  a proposé son aide en commentaire (il hésite).
- **Ana** cherche à Renens ; elle est candidate pour l'appartement que **Léo**
  loue en longue durée (formule officielle du loyer initial, Vaud).
- **Clémence** doute en public ; Paolo répond avec des chiffres, Sandrine avec
  pédagogie, Céline propose un café — trois registres dans un même fil.
- **Reto ↔ Jean-Luc** : un projet de rénovation énergétique d'un immeuble
  neuchâtelois.
- **Mirjana** a suivi la formation d'**Amina** sur le pricing dynamique et
  l'évalue (avis rattaché à l'achat).
- **Yves** a amené un bien de La Gruyère à Hartmann Immobilier (prime biens,
  Suisse) ; **Hélène** recommande la formation de **Sandrine** (affiliation
  marketplace — la seule qui lui est ouverte).
- **Léo** a suivi la formation fiscalité de **Sandrine**.

## Repères de marché (réalistes, 2026)

- Lausanne Sous-Gare : vente 4,5 p. 1,3–1,7 M CHF ; loyer 4,5 p. 2 900–3 400 CHF/mois.
- Renens / Prilly : loyer 3,5 p. 1 900–2 250 ; 4,5 p. 2 300–2 700 CHF/mois.
- Lutry / Lavaux : maison vigneronne 1,8–3 M ; appartement vue lac 1,4–2,2 M.
- Pully : villa familiale 2,4–3,8 M.
- Morges : vente 3,5 p. 850 000–1,1 M.
- Vevey / Montreux : courte durée studio 110–180 CHF/nuit, 2 p. 160–260 (pic en juillet, Montreux Jazz).
- Genève Champel : vente 5 p. 2,6–3,6 M ; Nyon 3,5 p. 1,1–1,3 M.
- Neuchâtel : vente 4,5 p. 750 000–950 000 ; loyer 3,5 p. 1 500–1 850 ; Hauterive villa 1,2–1,5 M.
- Fribourg : vente 4,5 p. 800 000–1 M ; Bulle 700 000–900 000.
- Yverdon : loyer 3,5 p. 1 450–1 700.
- Évian (France) : appartement 5 000–7 000 €/m².
- Marrakech, médina : riad 2–4 M MAD.
