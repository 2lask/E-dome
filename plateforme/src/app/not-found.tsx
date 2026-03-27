import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="text-center max-w-md px-6">
        <h1 className="text-8xl font-bold text-[#C4956A] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">Page introuvable</h2>
        <p className="text-[var(--text-secondary)] mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link href="/feed" className="inline-block px-8 py-3 rounded-full bg-[#C4956A] text-black font-semibold hover:bg-[#D4A574] transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
