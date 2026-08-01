"use client";

import React from "react";
import Link from "next/link";
import {
  Lock, Pencil, Users, ShieldCheck, Wallet, LayoutDashboard, ArrowRight,
} from "lucide-react";
import type { OpenEditor } from "./editor-types";

/* Espace privé (owner uniquement) : regroupe et range les actions de gestion
   — éditer le profil, réseau, confidentialité, compte & sécurité,
   portefeuille, tableau de bord. Visible par soi seul. */

function Tile({
  icon: Icon,
  label,
  desc,
  href,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  desc: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="w-9 h-9 rounded-lg bg-[var(--hover-bg)] flex items-center justify-center text-[var(--foreground)] shrink-0">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[var(--foreground)] truncate">{label}</span>
        <span className="block text-xs text-[var(--text-muted)] truncate">{desc}</span>
      </span>
    </>
  );
  const cls =
    "flex items-center gap-3 p-3 rounded-xl border border-[var(--card-border)] hover:border-[var(--primary)]/50 hover:bg-[var(--hover-bg)] transition-colors text-left w-full";
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}

export function PrivateSpace({ open }: { open: OpenEditor }) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="text-lg font-semibold text-[var(--foreground)] inline-flex items-center gap-2">
          <Lock size={16} className="text-[var(--text-muted)]" /> Espace privé
        </h2>
        <Link
          href="/parametres"
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Tous les paramètres <ArrowRight size={13} />
        </Link>
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-4">Visible par vous uniquement.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <Tile icon={Pencil} label="Modifier le profil" desc="Infos, titre, à propos" onClick={() => open({ type: "intro" })} />
        <Tile icon={Users} label="Mon réseau" desc="Abonnés & abonnements" href="/reseau" />
        <Tile icon={Lock} label="Confidentialité" desc="Qui voit quoi" href="/parametres?section=confidentialite" />
        <Tile icon={ShieldCheck} label="Compte & sécurité" desc="Mot de passe, 2FA" href="/parametres?section=securite" />
        <Tile icon={Wallet} label="Portefeuille" desc="Solde & facturation" href="/parametres?section=facturation" />
        <Tile icon={LayoutDashboard} label="Tableau de bord" desc="Activité & stats" href="/dashboard" />
      </div>
    </section>
  );
}
