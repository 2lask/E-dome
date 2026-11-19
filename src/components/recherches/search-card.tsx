import Link from "next/link";
import { CalendarDays, Wallet, BedDouble, Building2, Home } from "lucide-react";
import { initialsAvatar } from "@/lib/current-user-profile";
import { frDay } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";
import { KIND_LABEL, searchTitle, type Search } from "@/lib/recherches";

/* ── Carte d'une recherche à récompense ──────────────────────────────────────
   La récompense d'abord, en laiton : c'est ce qui fait agir. Puis ce qui est
   cherché, en une ligne, et les critères. Sans état : serveur ou client. */

export function SearchCard({ s }: { s: Search }) {
  const [first, ...rest] = s.author.name.split(" ");
  const avatar = s.author.avatar || initialsAvatar(first ?? "", rest.join(" "));
  const Icon = s.kind === "vendeurs" ? Building2 : Home;
  return (
    <Link
      href={`/recherches/${s.id}`}
      className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-xs transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-subtle px-2 py-0.5 text-[11.5px] font-medium">
          <Icon className="h-3.5 w-3.5" aria-hidden /> {KIND_LABEL[s.kind]}
        </span>
        <span className="chip-prime rounded-lg px-2.5 py-1 text-[13px] font-semibold tabular-nums">
          {formatNumber(s.rewardChf)} CHF
        </span>
      </div>
      <h3 className="mt-3 text-[16px] font-semibold leading-snug tracking-[-0.01em] group-hover:underline">{searchTitle(s)}</h3>
      {s.area && <p className="text-[13px] text-muted-foreground">{s.area}</p>}
      <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-foreground/80">{s.description}</p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground">
        {s.budgetMax ? (
          <li className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" aria-hidden />
            {s.kind === "vendeurs" ? "" : "max "}CHF {formatNumber(s.budgetMax)}{s.transaction === "location" && s.kind === "logement" ? " / mois" : ""}
          </li>
        ) : null}
        {s.roomsMin ? <li className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" aria-hidden />{s.roomsMin} pièces et +</li> : null}
        {s.neededBy ? <li className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden />avant le {frDay(s.neededBy)}</li> : null}
      </ul>
      <div className="mt-4 flex items-center gap-2 border-t pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
        <span className="truncate text-[12.5px] text-muted-foreground">{s.author.name}</span>
        <span className="ml-auto text-[12.5px] font-medium text-leman">Proposer →</span>
      </div>
    </Link>
  );
}
