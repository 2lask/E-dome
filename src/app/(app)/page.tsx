import { countMySettlementTodos } from "@/lib/supabase/settlement-actions";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listMyProperties, listPublicProperties } from "@/lib/supabase/property-actions";
import { listMyPrimes } from "@/lib/supabase/prime-actions";
import { listMyDemandes } from "@/lib/supabase/demande-actions";
import { listMyIntroductions } from "@/lib/supabase/introduction-actions";
import { listAnswersToMe } from "@/lib/supabase/search-actions";
import { VisitorHome } from "@/components/home/visitor-home";
import { MemberHome } from "@/components/home/member-home";

/* ── `/` — l'accueil (REBUILD.md §3.2–3.3) ───────────────────────────────────
   Composant serveur. Visiteur : la promesse, les portes d'entrée, les vrais
   derniers biens. Membre : ce qui demande son attention, calculé sur SES
   données réelles. Jamais de compte fictif. */
export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    const biens = await listPublicProperties(6);
    return <VisitorHome biens={biens} />;
  }

  const [biens, primes, inbox, intros, answers, settlementTodos] = await Promise.all([
    listMyProperties(),
    listMyPrimes(),
    listMyDemandes(),
    listMyIntroductions(),
    listAnswersToMe(),
    countMySettlementTodos(),
  ]);

  return (
    <MemberHome
      user={user}
      biens={biens}
      primes={primes}
      demandes={inbox.demandes}
      pending={inbox.pending}
      intros={intros}
      pendingAnswers={answers.filter((a) => a.status === "proposee").length}
      settlementTodos={settlementTodos}
    />
  );
}
