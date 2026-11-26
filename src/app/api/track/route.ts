import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { REF_COOKIE, REF_DAYS, VISITOR_COOKIE, isRefCode, isTrackKind, isUuid, normalizeSource, parseRefCookie, withRef } from "@/lib/tracking";

/* ── POST /api/track — un événement sur une annonce ──────────────────────────
   Corps : { p: <id du bien>, k: "vue"|"partage"|"video"|"contact", ref?: <code>,
   s?: <source déclarée>, r?: <nom d'hôte précédent> }.
   · visiteur identifié par un cookie aléatoire (jamais l'adresse IP) ;
   · une vue n'est comptée qu'une fois par visiteur et par bien en 30 minutes ;
   · `ref` (ou le cookie d'attribution) rattache l'événement au lien de
     l'apporteur, et le cookie garde l'attribution 60 jours.
   Écriture par clé de service : la table n'a aucune politique d'insertion.
   Tolérant : base non migrée ou erreur → 204, la page n'en souffre jamais. */

export async function POST(req: NextRequest) {
  let body: { p?: unknown; k?: unknown; ref?: unknown; s?: unknown; r?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!isUuid(body.p) || !isTrackKind(body.k)) return new NextResponse(null, { status: 400 });
  const propertyId = body.p;
  const kind = body.k;

  const res = new NextResponse(null, { status: 204 });
  const secure = process.env.NODE_ENV === "production";

  let visitor = req.cookies.get(VISITOR_COOKIE)?.value ?? "";
  if (!/^[0-9a-f-]{36}$/.test(visitor)) {
    visitor = crypto.randomUUID();
    res.cookies.set(VISITOR_COOKIE, visitor, { httpOnly: true, sameSite: "lax", secure, maxAge: 365 * 86400, path: "/" });
  }

  const admin = createAdminClient();
  if (!admin) return res;

  /* Le propriétaire qui regarde sa propre annonce ne gonfle pas ses statistiques.
     Ses partages, eux, comptent : il est le premier diffuseur de son bien. */
  const session = kind === "partage" ? null : await createClient();
  const { data: { user } } = session ? await session.auth.getUser() : { data: { user: null } };
  if (user) {
    const { data: prop } = await admin.from("properties").select("host_id").eq("id", propertyId).maybeSingle();
    if (prop?.host_id === user.id) return res;
  }

  /* Attribution : le code de l'URL prime sur le cookie (dernier lien suivi). */
  const refs = parseRefCookie(req.cookies.get(REF_COOKIE)?.value);
  const code = isRefCode(body.ref) ? body.ref : refs[propertyId];
  let linkId: string | null = null;
  if (code) {
    const { data: link } = await admin.from("apport_links").select("id, property_id").eq("code", code).maybeSingle();
    if (link && link.property_id === propertyId) {
      linkId = link.id as string;
      if (isRefCode(body.ref)) {
        res.cookies.set(REF_COOKIE, withRef(refs, propertyId, code), { httpOnly: true, sameSite: "lax", secure, maxAge: REF_DAYS * 86400, path: "/" });
      }
    }
  }

  if (kind === "vue") {
    const since = new Date(Date.now() - 30 * 60_000).toISOString();
    const { count } = await admin
      .from("property_events")
      .select("id", { count: "exact", head: true })
      .eq("property_id", propertyId)
      .eq("visitor", visitor)
      .eq("kind", "vue")
      .gte("created_at", since);
    if ((count ?? 0) > 0) return res;
  }

  /* La source n'a de sens que pour une vue ; base sans la colonne (migration
     011 pas encore appliquée) → on réessaie sans elle. */
  const row = { property_id: propertyId, kind, link_id: linkId, visitor };
  if (kind === "vue") {
    const source = normalizeSource(body.s, body.r, req.nextUrl.hostname);
    const { error } = await admin.from("property_events").insert({ ...row, source });
    if (!error) return res;
  }
  await admin.from("property_events").insert(row);
  return res;
}
