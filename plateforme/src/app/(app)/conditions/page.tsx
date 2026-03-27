"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronUp } from "lucide-react";

// ─── Table of Contents ──────────────────────────────────

const sections = [
  { id: "objet", number: "1", title: "Objet et champ d'application" },
  { id: "inscription", number: "2", title: "Inscription et compte utilisateur" },
  { id: "services", number: "3", title: "Services proposés" },
  { id: "commissions", number: "4", title: "Commissions et tarification" },
  { id: "obligations", number: "5", title: "Obligations des utilisateurs" },
  { id: "propriete", number: "6", title: "Propriété intellectuelle" },
  { id: "responsabilite", number: "7", title: "Responsabilité et garanties" },
  { id: "donnees", number: "8", title: "Protection des données personnelles" },
  { id: "resiliation", number: "9", title: "Résiliation" },
  { id: "droit", number: "10", title: "Droit applicable et juridiction" },
];

// ─── Page ───────────────────────────────────────────────

export default function ConditionsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[800px] pb-16"
    >
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4956A]/10">
            <FileText className="h-5 w-5 text-[#C4956A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Dernière mise à jour : 21 mars 2026
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Les présentes Conditions Générales d&apos;Utilisation (ci-après &laquo; CGU &raquo;)
          régissent l&apos;accès et l&apos;utilisation de la plateforme E-Dome. En accédant à la
          plateforme, vous acceptez sans réserve les présentes CGU.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-10 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#C4956A]">
          Table des matières
        </h2>
        <nav className="space-y-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">
                {s.number}
              </span>
              {s.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {/* 1 */}
        <section id="objet">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">1</span>
            Objet et champ d&apos;application
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Les présentes CGU ont pour objet de définir les conditions dans lesquelles la société
              E-Dome (ci-après &laquo; la Société &raquo;), dont le siège est à Neuchâtel, Suisse,
              met à disposition des utilisateurs sa plateforme numérique accessible via le site web
              et les applications mobiles.
            </p>
            <p>
              La plateforme E-Dome est un écosystème immobilier intégré proposant des services de
              marketplace, de réseau social professionnel, d&apos;apport d&apos;affaires, de formations et de
              services annexes. Les présentes CGU s&apos;appliquent à tout utilisateur, qu&apos;il soit
              particulier ou professionnel, accédant à la plateforme sous quelque statut que ce soit.
            </p>
            <p>
              La Société se réserve le droit de modifier les présentes CGU à tout moment. Les
              utilisateurs seront informés de toute modification substantielle par notification sur la
              plateforme. L&apos;utilisation continue de la plateforme après notification vaut acceptation
              des CGU modifiées.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 2 */}
        <section id="inscription">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">2</span>
            Inscription et compte utilisateur
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              L&apos;accès à certaines fonctionnalités de la plateforme nécessite la création d&apos;un compte
              utilisateur. L&apos;inscription est ouverte à toute personne physique majeure ou personne
              morale disposant de la capacité juridique nécessaire.
            </p>
            <p>
              L&apos;utilisateur s&apos;engage à fournir des informations exactes, complètes et à jour lors de
              son inscription. Il est responsable de la confidentialité de ses identifiants de connexion
              et de toute activité effectuée depuis son compte.
            </p>
            <p>
              La Société peut procéder à une vérification d&apos;identité (KYC) pour certains services,
              notamment les transactions financières, la publication d&apos;annonces et l&apos;activité
              d&apos;apporteur d&apos;affaires. Le refus de se soumettre à cette vérification peut entraîner
              la limitation ou la suspension des services concernés.
            </p>
            <p>
              Chaque utilisateur peut disposer de plusieurs rôles sur la plateforme (client, hôte,
              propriétaire, agence, promoteur, apporteur, investisseur, formateur), chacun étant soumis
              à des conditions spécifiques détaillées ci-après.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 3 */}
        <section id="services">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">3</span>
            Services proposés
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              La plateforme E-Dome propose les services suivants :
            </p>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Marketplace immobilière :</strong> publication et
                recherche d&apos;annonces immobilières pour la location courte durée, la location longue
                durée et la vente de biens immobiliers.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Réseau social professionnel :</strong> création de
                profils, publication de contenus, interactions entre professionnels et particuliers du
                secteur immobilier.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Programme d&apos;apporteurs d&apos;affaires :</strong>{" "}
                système de parrainage et de recommandation permettant aux utilisateurs de générer des
                commissions sur les transactions réalisées via leurs liens de recommandation.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Formations :</strong> accès à des cours en ligne,
                des webinaires et des certifications dans le domaine immobilier.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Services annexes :</strong> messagerie intégrée,
                système de réservation, gestion de favoris, tableau de bord analytique et système de
                notifications.
              </li>
            </ul>
            <p>
              La Société se réserve le droit de faire évoluer, d&apos;ajouter ou de supprimer des services
              à tout moment, sous réserve d&apos;en informer les utilisateurs dans un délai raisonnable.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 4 */}
        <section id="commissions">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">4</span>
            Commissions et tarification
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              L&apos;utilisation de base de la plateforme est gratuite. Des commissions sont prélevées
              sur les transactions réalisées via la plateforme selon la grille suivante :
            </p>
            <div className="my-4 overflow-hidden rounded-lg border border-[var(--card-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--card-border)] bg-[var(--card)]">
                    <th className="px-4 py-3 text-left font-medium text-[var(--foreground)]">Type de transaction</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--foreground)]">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Location courte durée</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">10 – 15 %</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Location longue durée</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">10 – 15 %</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Vente immobilière</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">2 – 4 %</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Le taux exact de commission est déterminé en fonction du type de bien, du volume de
              transactions de l&apos;utilisateur et de son statut sur la plateforme. La commission est
              prélevée automatiquement lors du paiement de la transaction.
            </p>
            <p>
              Les commissions des apporteurs d&apos;affaires sont calculées sur la base de la commission
              plateforme selon un système de paliers (Bronze, Argent, Or, Platine, Diamant). Les
              détails de chaque palier sont disponibles dans la section Apporteurs de la plateforme.
            </p>
            <p>
              La Société se réserve le droit de modifier sa grille tarifaire sous réserve d&apos;un préavis
              de 30 jours notifié aux utilisateurs concernés.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 5 */}
        <section id="obligations">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">5</span>
            Obligations des utilisateurs
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>L&apos;utilisateur s&apos;engage à :</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>Respecter les lois et règlements en vigueur, notamment en matière immobilière, fiscale et de protection des consommateurs.</li>
              <li>Fournir des informations véridiques et non trompeuses dans ses annonces et communications.</li>
              <li>Ne pas utiliser la plateforme à des fins frauduleuses, illicites ou contraires aux bonnes moeurs.</li>
              <li>Ne pas publier de contenu diffamatoire, discriminatoire, haineux ou portant atteinte aux droits de tiers.</li>
              <li>Ne pas contourner le système de paiement de la plateforme pour éviter le paiement des commissions.</li>
              <li>Respecter les droits de propriété intellectuelle de la Société et des autres utilisateurs.</li>
              <li>Signaler tout contenu ou comportement contraire aux présentes CGU.</li>
            </ul>
            <p>
              Tout manquement à ces obligations peut entraîner la suspension temporaire ou définitive
              du compte utilisateur, sans préjudice de toute action en réparation que la Société
              pourrait engager.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 6 */}
        <section id="propriete">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">6</span>
            Propriété intellectuelle
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              L&apos;ensemble des éléments de la plateforme (design, logo, textes, logiciels, bases de
              données, algorithmes) sont protégés par le droit de la propriété intellectuelle et
              demeurent la propriété exclusive de la Société.
            </p>
            <p>
              L&apos;utilisateur conserve la propriété intellectuelle des contenus qu&apos;il publie sur la
              plateforme. Toutefois, en publiant du contenu, il concède à la Société une licence
              non exclusive, mondiale, gratuite et cessible pour utiliser, reproduire et afficher
              ledit contenu dans le cadre du fonctionnement et de la promotion de la plateforme.
            </p>
            <p>
              Toute reproduction, représentation ou exploitation non autorisée des éléments de la
              plateforme constitue une contrefaçon pouvant donner lieu à des poursuites.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 7 */}
        <section id="responsabilite">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">7</span>
            Responsabilité et garanties
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              La Société agit en qualité d&apos;intermédiaire technique et ne saurait être tenue
              responsable des transactions conclues entre utilisateurs. Elle ne garantit pas la
              qualité, la légalité ou la conformité des biens proposés sur la plateforme.
            </p>
            <p>
              La Société met en oeuvre les moyens raisonnables pour assurer la disponibilité et le bon
              fonctionnement de la plateforme, sans toutefois garantir un accès ininterrompu. La
              Société ne saurait être tenue responsable des dommages indirects résultant de
              l&apos;utilisation ou de l&apos;impossibilité d&apos;utilisation de la plateforme.
            </p>
            <p>
              En cas de litige entre utilisateurs, la Société peut proposer un service de médiation
              mais n&apos;est en aucun cas tenue de s&apos;y substituer.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 8 */}
        <section id="donnees">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">8</span>
            Protection des données personnelles
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              La Société s&apos;engage à protéger les données personnelles de ses utilisateurs
              conformément à la Loi fédérale sur la protection des données (LPD) et au Règlement
              général sur la protection des données (RGPD) pour les utilisateurs situés dans
              l&apos;Espace économique européen.
            </p>
            <p>
              Pour plus d&apos;informations sur le traitement de vos données personnelles, veuillez
              consulter notre{" "}
              <a
                href="/confidentialite"
                className="text-[#C4956A] underline hover:text-[#D4A574] transition-colors"
              >
                Politique de Confidentialité
              </a>
              .
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 9 */}
        <section id="resiliation">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">9</span>
            Résiliation
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              L&apos;utilisateur peut résilier son compte à tout moment depuis les paramètres de son
              profil ou en adressant une demande à contact@edome.world. La résiliation prend effet
              dans un délai de 30 jours, sous réserve de l&apos;achèvement de toute transaction en cours.
            </p>
            <p>
              La Société peut suspendre ou résilier un compte utilisateur en cas de violation des
              présentes CGU, de fraude avérée ou suspectée, ou sur demande d&apos;une autorité
              compétente. En cas de résiliation pour faute, l&apos;utilisateur ne peut prétendre à aucun
              remboursement des commissions déjà prélevées.
            </p>
            <p>
              Après résiliation, les données personnelles de l&apos;utilisateur sont traitées conformément
              à notre Politique de Confidentialité et aux obligations légales de conservation.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 10 */}
        <section id="droit">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">10</span>
            Droit applicable et juridiction
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Les présentes CGU sont régies par le droit suisse. Tout litige relatif à
              l&apos;interprétation ou à l&apos;exécution des présentes CGU sera soumis à la compétence
              exclusive des tribunaux du Canton de Neuchâtel, Suisse, sous réserve des dispositions
              impératives de protection du consommateur applicables.
            </p>
            <p>
              En cas de divergence entre les différentes versions linguistiques des présentes CGU,
              la version française prévaudra.
            </p>
            <p>
              Si une disposition des présentes CGU est déclarée nulle ou inapplicable, les autres
              dispositions demeureront pleinement en vigueur et de plein effet.
            </p>
          </div>
        </section>
      </div>

      {/* Back to top */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[#C4956A]/30 hover:text-[var(--foreground)]"
        >
          <ChevronUp className="h-4 w-4" />
          Retour en haut
        </button>
      </div>
    </motion.div>
  );
}
