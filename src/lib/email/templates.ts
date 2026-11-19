/* ── E-mails de notification — modèles (fonctions pures) ─────────────────────
   Le but : faire REVENIR la personne au bon endroit (Demandes, Gagner), pas
   lui raconter l'histoire. Donc : un sujet qui dit l'essentiel, deux lignes,
   un bouton. Aucune coordonnée d'un tiers dans un e-mail : elles restent
   derrière la connexion (RLS). Tout texte fourni par un membre est échappé. */

export type Notice =
  | { kind: "demande"; propertyTitle: string; senderName: string; visit: boolean }
  | { kind: "mise-en-relation"; propertyTitle: string; amountChf: number }
  | { kind: "proposition"; searchTitle: string; rewardChf: number }
  | { kind: "decision-relation"; propertyTitle: string; accepted: boolean; netChf: number }
  | { kind: "decision-proposition"; searchTitle: string; accepted: boolean; netChf: number };

export interface Email {
  subject: string;
  text: string;
  html: string;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** « 1'500 » — même convention que l'application, sans dépendance. */
function chf(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

/** Coupe un titre trop long pour un sujet d'e-mail. */
function short(s: string, max = 60): string {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

export function buildEmail(n: Notice, siteUrl: string): Email {
  const base = siteUrl.replace(/\/+$/, "");
  let subject: string, lines: string[], cta: string, path: string;

  switch (n.kind) {
    case "demande":
      subject = `${n.visit ? "Demande de visite" : "Nouvelle demande"} · ${short(n.propertyTitle)}`;
      lines = [`${n.senderName} ${n.visit ? "souhaite visiter" : "s'intéresse à"} « ${n.propertyTitle} ».`, "Répondez vite : les premiers contacts sont les plus chauds."];
      cta = "Voir la demande"; path = "/demandes";
      break;
    case "mise-en-relation":
      subject = `Un contact vous est présenté · ${short(n.propertyTitle)}`;
      lines = [`Un apporteur vous présente une personne intéressée par « ${n.propertyTitle} ».`, `Si vous acceptez, ses coordonnées s'ouvrent et la prime de ${chf(n.amountChf)} CHF est due. Sinon, rien n'est dû.`];
      cta = "Décider"; path = "/demandes";
      break;
    case "proposition":
      subject = `Nouvelle proposition · ${short(n.searchTitle)}`;
      lines = [`Quelqu'un répond à votre recherche « ${n.searchTitle} ».`, `Si vous acceptez, la récompense de ${chf(n.rewardChf)} CHF est due. Sinon, rien n'est dû.`];
      cta = "Voir la proposition"; path = "/demandes";
      break;
    case "decision-relation":
      subject = n.accepted ? `Accepté : ${chf(n.netChf)} CHF pour vous` : `Mise en relation refusée · ${short(n.propertyTitle)}`;
      lines = n.accepted
        ? [`Le vendeur de « ${n.propertyTitle} » a accepté votre contact.`, `Votre prime nette : ${chf(n.netChf)} CHF.`]
        : [`Le vendeur de « ${n.propertyTitle} » n'a pas retenu ce contact. Rien n'est dû.`, "D'autres biens ont une prime : votre réseau peut encore rapporter."];
      cta = n.accepted ? "Voir mes gains" : "Voir les biens à prime"; path = "/apporteurs";
      break;
    case "decision-proposition":
      subject = n.accepted ? `Accepté : ${chf(n.netChf)} CHF pour vous` : `Proposition non retenue · ${short(n.searchTitle)}`;
      lines = n.accepted
        ? [`Votre proposition pour « ${n.searchTitle} » a été acceptée.`, `Votre récompense nette : ${chf(n.netChf)} CHF.`]
        : [`Votre proposition pour « ${n.searchTitle} » n'a pas été retenue. Rien n'est dû.`, "D'autres recherches attendent une proposition."];
      cta = n.accepted ? "Voir mes gains" : "Voir les recherches"; path = n.accepted ? "/apporteurs" : "/recherches";
      break;
  }

  const url = `${base}${path}`;
  const settings = `${base}/parametres/notifications`;
  const text = `${lines.join("\n\n")}\n\n${cta} : ${url}\n\n—\nE-Dome · Ne plus recevoir ces e-mails : ${settings}`;
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#faf9f6;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#15130f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border:1px solid #e7e4dc;border-radius:16px" cellpadding="0" cellspacing="0"><tr><td style="padding:28px">
<p style="margin:0 0 18px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#0b5d57">E-Dome</p>
${lines.map((l) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.55">${escapeHtml(l)}</p>`).join("\n")}
<p style="margin:22px 0 0"><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b5d57;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:10px">${escapeHtml(cta)}</a></p>
</td></tr></table>
<p style="margin:16px 0 0;font-size:12px;color:#6b665c">Vous recevez cet e-mail car vous avez un compte E-Dome. <a href="${escapeHtml(settings)}" style="color:#6b665c">Ne plus recevoir ces e-mails</a></p>
</td></tr></table></body></html>`;
  return { subject, text, html };
}
