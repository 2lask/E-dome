import Link from "next/link";
import { LottiePlayer } from "@/components/ui/lottie-player";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">E-<span className="text-[#C4956A]">DOME</span></h1>
          <p className="text-[var(--text-secondary)] mt-2">L&apos;écosystème immobilier international</p>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl border border-[#C4956A]/20 bg-[#C4956A]/5 p-6 mb-12 text-center">
          <p className="text-sm font-semibold text-[#C4956A] mb-2">🛠️ Maquette de démonstration</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Vous consultez une maquette interactive fictive de la plateforme E-Dome.
            Toutes les données, profils, biens et transactions présentés ici sont
            entièrement fictifs et ont pour seul but d&apos;illustrer les fonctionnalités
            de la plateforme. Aucune information réelle n&apos;est collectée ou traitée.
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-3">Pour en savoir plus : contact@edome.world</p>
        </div>

        {/* Entry title */}
        <h2 className="text-2xl font-bold text-center mb-2">Explorez la maquette E-Dome</h2>
        <p className="text-center text-[var(--text-secondary)] text-sm mb-10">
          Naviguez librement dans toutes les fonctionnalités. Chaque section est interactive.
        </p>

        {/* 4 Entry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <Link href="/feed" className="group p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[#C4956A]/30 transition-all">
            <div className="text-2xl mb-3">🏠</div>
            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">Réseau social & Feed</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Découvrez le fil social immobilier, les stories, les posts, les interactions.</p>
          </Link>
          <Link href="/explorer" className="group p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[#C4956A]/30 transition-all">
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">Marketplace & Explorer</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Parcourez les annonces, les fiches biens, les cartes, les filtres avancés.</p>
          </Link>
          <Link href="/dashboard" className="group p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[#C4956A]/30 transition-all">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">Dashboard & Statistiques</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Visualisez les tableaux de bord hôte, apporteur, formateur et investisseur.</p>
          </Link>
          <Link href="/formations" className="group p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[#C4956A]/30 transition-all">
            <div className="text-2xl mb-3">📚</div>
            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">Formations & Lives</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Consultez le catalogue de formations, les replays et les événements.</p>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center my-6">
          <LottiePlayer src="/lottie/lottieflow-scroll-down-04-1-000000-easey.json" width={40} height={40} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[var(--text-muted)] space-y-2">
          <p>E-Dome — Maquette fictive · contact@edome.world · © 2026</p>
          <p>Toutes les données présentées sont fictives et à titre illustratif uniquement.</p>
          <p>
            Explorer :{" "}
            <Link href="/feed" className="underline hover:text-[#C4956A] transition-colors">Feed</Link> ·{" "}
            <Link href="/explorer" className="underline hover:text-[#C4956A] transition-colors">Marketplace</Link> ·{" "}
            <Link href="/dashboard" className="underline hover:text-[#C4956A] transition-colors">Dashboard</Link> ·{" "}
            <Link href="/formations" className="underline hover:text-[#C4956A] transition-colors">Formations</Link> ·{" "}
            <Link href="/live" className="underline hover:text-[#C4956A] transition-colors">Live</Link> ·{" "}
            <Link href="/apporteurs" className="underline hover:text-[#C4956A] transition-colors">Apporteurs</Link> ·{" "}
            <Link href="/reservations" className="underline hover:text-[#C4956A] transition-colors">Réservations</Link> ·{" "}
            <Link href="/dashboard" className="underline hover:text-[#C4956A] transition-colors">Statistiques</Link>
          </p>
        </div>
      </div>
    </div>
  );
}