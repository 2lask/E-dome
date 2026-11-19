import "server-only";
import { randomBytes } from "node:crypto";
import { createAdminClient } from "./admin";

/* ── Partage de dossier : création du jeton (INTERNE au serveur) ─────────────
   Volontairement hors d'un module « use server » : exportée d'un tel module,
   cette fonction serait appelable depuis n'importe quel navigateur, et
   permettrait de fabriquer un jeton pour le dossier d'autrui. Elle n'est
   appelée que par `createInquiry`, pour la personne CONNECTÉE elle-même. */

export async function createDossierShareFor(userId: string, propertyId: string): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const { data: d } = await admin.from("rental_dossiers").select("user_id").eq("user_id", userId).maybeSingle();
  if (!d) return null;
  const token = randomBytes(24).toString("base64url");
  const { error } = await admin.from("dossier_shares").insert({ token, user_id: userId, property_id: propertyId });
  return error ? null : token;
}
