import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listMyThreads } from "@/lib/supabase/link-message-actions";
import { LinkInbox } from "@/components/messages/link-inbox";
import { MemberHero, type HeroStat } from "@/components/demandes/member-hero";

export const metadata: Metadata = { title: "Messages", robots: { index: false } };

/* ── /messages — vendeurs et apporteurs ──────────────────────────────────────
   Une conversation par lien d'apporteur (migration 012). Les demandes des
   acheteurs restent dans « Demandes ». `?l=<lien>` ouvre une conversation.
   En-tête : l'en-tête membre partagé, avec des compteurs réels. */
export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ l?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Fmessages");
  const [{ ready, threads }, sp] = await Promise.all([listMyThreads(), searchParams]);
  const unread = threads.reduce((n, t) => n + t.unread, 0);
  const stats: HeroStat[] | undefined = ready && threads.length > 0
    ? [
      { label: "Conversations", value: String(threads.length) },
      { label: "Non lus", value: String(unread), prime: unread > 0 },
      { label: "Avec mes apporteurs", value: String(threads.filter((t) => t.role === "vendeur").length) },
      { label: "Avec des propriétaires", value: String(threads.filter((t) => t.role === "apporteur").length) },
    ]
    : undefined;
  return (
    <div className="mx-auto max-w-6xl">
      <MemberHero
        eyebrow="Vendeurs et apporteurs"
        icon={MessagesSquare}
        title="Messages"
        description="Une conversation par lien : disponibilités, visites, questions sur le bien. Les demandes des acheteurs restent dans Demandes."
        stats={stats}
      />
      <LinkInbox threads={threads} ready={ready} initial={sp.l ?? null} userId={user.id} />
    </div>
  );
}
