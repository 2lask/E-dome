import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listMyThreads } from "@/lib/supabase/link-message-actions";
import { LinkInbox } from "@/components/messages/link-inbox";

export const metadata: Metadata = { title: "Messages", robots: { index: false } };

/* ── /messages — vendeurs et apporteurs ──────────────────────────────────────
   Une conversation par lien d'apporteur (migration 012). Les demandes des
   acheteurs restent dans « Demandes ». `?l=<lien>` ouvre une conversation. */
export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ l?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Fmessages");
  const [{ ready, threads }, sp] = await Promise.all([listMyThreads(), searchParams]);
  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Vendeurs et apporteurs</p>
      <h1 className="page-heading mt-1.5 text-[30px]">Messages</h1>
      <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground">
        Une conversation par lien : disponibilités, visites, questions sur le bien. Les demandes des acheteurs restent dans
        Demandes.
      </p>
      <LinkInbox threads={threads} ready={ready} initial={sp.l ?? null} userId={user.id} />
    </div>
  );
}
