"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Mail, UserPlus, Check, Users } from "lucide-react";
import { useApp } from "@/lib/context";
import { listPeople } from "@/lib/profile-data";
import { roleLabels } from "@/lib/types";
import type { PersonSummary } from "@/lib/profile-types";
import { BackButton } from "@/components/ui/back-button";

/* /reseau — mon réseau : Abonnés · Abonnements · Découvrir.
   Le suivi est piloté par le contexte (followedUsers). Chaque contact ouvre
   sa fiche /profil/[id]. Recherche par nom / titre / ville. */

type Tab = "abonnes" | "abonnements" | "decouvrir";

const TABS: { key: Tab; label: string }[] = [
  { key: "abonnes", label: "Abonnés" },
  { key: "abonnements", label: "Abonnements" },
  { key: "decouvrir", label: "Découvrir" },
];

function PersonCard({ person }: { person: PersonSummary }) {
  const router = useRouter();
  const { isFollowing, toggleFollow } = useApp();
  const following = isFollowing(person.id);
  return (
    <li className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
      <Link href={`/profil/${person.id}`} className="shrink-0">
        <img src={person.avatar} alt="" className="w-14 h-14 rounded-full object-cover hover:opacity-90 transition-opacity" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/profil/${person.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:underline truncate block leading-tight">
          {person.firstName} {person.lastName}
        </Link>
        <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{person.headline}</p>
        <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
          {person.city}, {person.country} · {roleLabels[person.roles[0]]}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-1.5 shrink-0">
        <button
          onClick={() => toggleFollow(person.id)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          style={
            following
              ? { border: "1px solid var(--card-border)", color: "var(--foreground)", background: "var(--card)" }
              : { background: "var(--foreground)", color: "var(--background)" }
          }
        >
          {following ? <><Check size={13} /> Suivi</> : <><UserPlus size={13} /> Suivre</>}
        </button>
        <button
          onClick={() => router.push(`/messages?to=${person.id}`)}
          aria-label="Envoyer un message"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
        >
          <Mail size={13} /> <span className="hidden sm:inline">Message</span>
        </button>
      </div>
    </li>
  );
}

export default function ReseauPage() {
  const { isFollowing } = useApp();
  const [tab, setTab] = useState<Tab>("abonnes");
  const [query, setQuery] = useState("");
  const people = useMemo(() => listPeople(), []);

  const followingIds = people.filter((p) => isFollowing(p.id));
  const notFollowing = people.filter((p) => !isFollowing(p.id));

  const base: PersonSummary[] =
    tab === "abonnements" ? followingIds : tab === "decouvrir" ? notFollowing : people;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q),
    );
  }, [base, query]);

  const counts = { abonnes: people.length, abonnements: followingIds.length, decouvrir: notFollowing.length };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="md:hidden mb-2 -mt-2">
        <BackButton fallbackHref="/profil" />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <Users size={22} className="text-[var(--primary)]" />
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Mon réseau</h1>
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-5">
        Gérez vos abonnés, vos abonnements et découvrez des professionnels.
      </p>

      {/* Recherche */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une personne, un titre, une ville…"
          className="w-full pl-10 pr-3 py-2.5 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>

      {/* Onglets */}
      <div className="flex items-center gap-1 border-b border-[var(--card-border)] mb-4">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="relative px-3 py-2.5 text-sm transition-colors"
              style={{ color: active ? "var(--foreground)" : "var(--text-secondary)", fontWeight: active ? 600 : 500 }}
            >
              {t.label}
              <span className="ml-1.5 text-xs tabular-nums text-[var(--text-muted)]">{counts[t.key]}</span>
              {active && <span aria-hidden className="absolute left-2 right-2 -bottom-px h-[2px] rounded-full bg-[var(--primary)]" />}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--text-muted)]">
          {tab === "abonnements"
            ? "Vous ne suivez encore personne. Passez à « Découvrir »."
            : query
              ? "Aucun résultat."
              : "Personne pour l'instant."}
        </div>
      ) : (
        <ul className="space-y-2.5">
          {list.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
