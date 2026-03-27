"use client";

import { motion } from "framer-motion";
import { Shield, ChevronUp } from "lucide-react";

// ─── Table of Contents ──────────────────────────────────

const sections = [
  { id: "responsable", number: "1", title: "Responsable du traitement" },
  { id: "donnees-collectees", number: "2", title: "Données collectées" },
  { id: "finalites", number: "3", title: "Finalités du traitement" },
  { id: "base-juridique", number: "4", title: "Base juridique" },
  { id: "destinataires", number: "5", title: "Destinataires des données" },
  { id: "transferts", number: "6", title: "Transferts internationaux" },
  { id: "conservation", number: "7", title: "Durée de conservation" },
  { id: "droits", number: "8", title: "Vos droits" },
  { id: "cookies", number: "9", title: "Cookies et technologies similaires" },
  { id: "securite", number: "10", title: "Sécurité des données" },
  { id: "modifications", number: "11", title: "Modifications de la politique" },
  { id: "contact-dpo", number: "12", title: "Contact DPO" },
];

// ─── Page ───────────────────────────────────────────────

export default function ConfidentialitePage() {
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
            <Shield className="h-5 w-5 text-[#C4956A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Politique de Confidentialité
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Dernière mise à jour : 21 mars 2026
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          La présente Politique de Confidentialité décrit la manière dont E-Dome collecte,
          utilise, stocke et protège vos données personnelles conformément à la Loi fédérale
          sur la protection des données (LPD) et au Règlement général sur la protection des
          données (RGPD).
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
        <section id="responsable">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">1</span>
            Responsable du traitement
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Le responsable du traitement de vos données personnelles est :</p>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
              <p className="font-medium text-[var(--foreground)]">E-Dome</p>
              <p>Neuchâtel, Suisse</p>
              <p>
                Email :{" "}
                <a href="mailto:contact@edome.world" className="text-[#C4956A] hover:text-[#D4A574] transition-colors">
                  contact@edome.world
                </a>
              </p>
            </div>
            <p>
              E-Dome est responsable de la détermination des finalités et des moyens du traitement
              de vos données personnelles dans le cadre de l&apos;utilisation de la plateforme.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 2 */}
        <section id="donnees-collectees">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">2</span>
            Données collectées
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Nous collectons les catégories de données suivantes :</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Données d&apos;identité :</strong> nom, prénom, date de
                naissance, photo de profil, pièce d&apos;identité (dans le cadre du KYC).
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Données de contact :</strong> adresse email, numéro
                de téléphone, adresse postale.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Données financières :</strong> coordonnées bancaires,
                historique des transactions, commissions, factures.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Données de navigation :</strong> adresse IP,
                type de navigateur, pages consultées, durée des sessions, données de géolocalisation.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Contenus utilisateur :</strong> annonces publiées,
                messages, avis, publications sur le réseau social, fichiers téléversés.
              </li>
            </ul>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 3 */}
        <section id="finalites">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">3</span>
            Finalités du traitement
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>Création et gestion de votre compte utilisateur.</li>
              <li>Fourniture des services de la plateforme (marketplace, réseau social, formations, apporteurs).</li>
              <li>Traitement des transactions et versement des commissions.</li>
              <li>Vérification d&apos;identité et lutte contre la fraude (KYC/AML).</li>
              <li>Communication relative à votre compte et aux services (notifications, alertes).</li>
              <li>Amélioration et personnalisation de l&apos;expérience utilisateur.</li>
              <li>Analyses statistiques et reporting anonymisé.</li>
              <li>Respect des obligations légales et réglementaires.</li>
            </ul>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 4 */}
        <section id="base-juridique">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">4</span>
            Base juridique
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Le traitement de vos données repose sur les bases juridiques suivantes :</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Exécution du contrat :</strong> le traitement est
                nécessaire à l&apos;exécution des services souscrits via la plateforme.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Consentement :</strong> pour certains traitements
                spécifiques (cookies non essentiels, communications marketing), votre consentement
                préalable est recueilli.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Intérêt légitime :</strong> amélioration des services,
                prévention de la fraude, sécurité de la plateforme.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Obligation légale :</strong> conformité aux exigences
                légales en matière de lutte contre le blanchiment, obligations fiscales et comptables.
              </li>
            </ul>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 5 */}
        <section id="destinataires">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">5</span>
            Destinataires des données
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Vos données personnelles peuvent être communiquées aux catégories de destinataires
              suivantes :
            </p>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Prestataires de paiement :</strong> pour le
                traitement des transactions financières et le versement des commissions.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Hébergeur :</strong> nos données sont hébergées sur
                des serveurs sécurisés conformes aux normes applicables.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Prestataires KYC :</strong> pour la vérification
                d&apos;identité dans le cadre de la réglementation applicable.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Autorités compétentes :</strong> en cas d&apos;obligation
                légale ou de réquisition judiciaire.
              </li>
            </ul>
            <p>
              Nous ne vendons jamais vos données personnelles à des tiers. Nos prestataires sont
              contractuellement tenus de traiter vos données uniquement selon nos instructions et
              de garantir un niveau de protection adéquat.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 6 */}
        <section id="transferts">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">6</span>
            Transferts internationaux
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Vos données personnelles sont principalement traitées en Suisse et dans l&apos;Espace
              économique européen. Dans le cas où un transfert vers un pays tiers serait nécessaire,
              nous nous assurons que des garanties appropriées sont mises en place, notamment :
            </p>
            <ul className="ml-4 list-disc space-y-2">
              <li>Clauses contractuelles types approuvées par la Commission européenne.</li>
              <li>Décision d&apos;adéquation du pays destinataire.</li>
              <li>Consentement explicite de l&apos;utilisateur pour des transferts spécifiques.</li>
            </ul>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 7 */}
        <section id="conservation">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">7</span>
            Durée de conservation
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Vos données personnelles sont conservées pendant la durée strictement nécessaire aux
              finalités pour lesquelles elles sont traitées :
            </p>
            <div className="my-4 overflow-hidden rounded-lg border border-[var(--card-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--card-border)] bg-[var(--card)]">
                    <th className="px-4 py-3 text-left font-medium text-[var(--foreground)]">Type de données</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--foreground)]">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Données de compte</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">Durée du compte + 3 ans</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Données de transaction</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">10 ans (obligation légale)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Données KYC</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">5 ans après la fin de la relation</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Données de navigation</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">13 mois</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">Cookies</td>
                    <td className="px-4 py-3 text-[#C4956A] font-medium">13 mois maximum</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 8 */}
        <section id="droits">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">8</span>
            Vos droits
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Conformément à la législation applicable, vous disposez des droits suivants :
            </p>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Droit d&apos;accès :</strong> obtenir la confirmation
                que vos données sont traitées et en recevoir une copie.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Droit de rectification :</strong> corriger vos
                données inexactes ou incomplètes.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Droit à l&apos;effacement :</strong> demander la
                suppression de vos données, sous réserve des obligations légales de conservation.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Droit à la portabilité :</strong> recevoir vos
                données dans un format structuré et couramment utilisé.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Droit d&apos;opposition :</strong> vous opposer au
                traitement de vos données pour des motifs légitimes.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Droit de limitation :</strong> demander la limitation
                du traitement dans certains cas prévus par la loi.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Retrait du consentement :</strong> retirer votre
                consentement à tout moment pour les traitements fondés sur celui-ci.
              </li>
            </ul>
            <p>
              Pour exercer vos droits, contactez notre Délégué à la Protection des Données (DPO)
              à l&apos;adresse{" "}
              <a href="mailto:dpo@edome.world" className="text-[#C4956A] hover:text-[#D4A574] transition-colors">
                dpo@edome.world
              </a>
              . Nous répondrons à votre demande dans un délai de 30 jours.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 9 */}
        <section id="cookies">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">9</span>
            Cookies et technologies similaires
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              La plateforme utilise des cookies et technologies similaires pour assurer son bon
              fonctionnement et améliorer votre expérience :
            </p>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Cookies essentiels :</strong> nécessaires au
                fonctionnement de la plateforme (authentification, sécurité, préférences de session).
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Cookies analytiques :</strong> permettent de mesurer
                l&apos;audience et d&apos;analyser le comportement des utilisateurs pour améliorer nos
                services.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Cookies fonctionnels :</strong> permettent de
                mémoriser vos préférences (langue, thème, paramètres d&apos;affichage).
              </li>
            </ul>
            <p>
              Vous pouvez gérer vos préférences en matière de cookies à tout moment via les
              paramètres de votre navigateur ou depuis les paramètres de votre compte E-Dome.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 10 */}
        <section id="securite">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">10</span>
            Sécurité des données
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Nous mettons en oeuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données personnelles contre tout accès non autorisé, perte, altération
              ou divulgation :
            </p>
            <ul className="ml-4 list-disc space-y-2">
              <li>Chiffrement des données en transit (TLS/SSL) et au repos.</li>
              <li>Contrôle strict des accès et authentification multi-facteurs pour les systèmes internes.</li>
              <li>Audits de sécurité réguliers et tests de pénétration.</li>
              <li>Formation du personnel aux enjeux de protection des données.</li>
              <li>Procédures de notification en cas de violation de données conformes à la réglementation.</li>
            </ul>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 11 */}
        <section id="modifications">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">11</span>
            Modifications de la politique
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Nous nous réservons le droit de modifier la présente Politique de Confidentialité à
              tout moment. En cas de modification substantielle, nous vous informerons par email
              et/ou par notification sur la plateforme au moins 30 jours avant l&apos;entrée en vigueur
              des modifications.
            </p>
            <p>
              La date de dernière mise à jour est indiquée en haut de ce document. Nous vous
              encourageons à consulter régulièrement cette page pour rester informé de nos
              pratiques en matière de protection des données.
            </p>
          </div>
          <div className="mt-4 border-b border-[var(--card-border)]" />
        </section>

        {/* 12 */}
        <section id="contact-dpo">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--foreground)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C4956A]/10 text-xs font-bold text-[#C4956A]">12</span>
            Contact DPO
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Pour toute question relative à la protection de vos données personnelles ou pour
              exercer vos droits, vous pouvez contacter notre Délégué à la Protection des Données :
            </p>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-1">
              <p className="font-medium text-[var(--foreground)]">Délégué à la Protection des Données (DPO)</p>
              <p>E-Dome</p>
              <p>Neuchâtel, Suisse</p>
              <p>
                Email :{" "}
                <a href="mailto:dpo@edome.world" className="text-[#C4956A] hover:text-[#D4A574] transition-colors">
                  dpo@edome.world
                </a>
              </p>
            </div>
            <p>
              Vous avez également le droit d&apos;introduire une réclamation auprès de l&apos;autorité de
              contrôle compétente, notamment le Préposé fédéral à la protection des données et
              à la transparence (PFPDT) en Suisse.
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
