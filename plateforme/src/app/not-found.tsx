import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <h1 className="text-6xl font-bold" style={{ color: "var(--gold)" }}>
        404
      </h1>
      <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
        Page introuvable
      </p>
      <p style={{ color: "var(--text-muted)" }}>
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-4 flex gap-4">
        <Link
          href="/feed"
          className="px-6 py-3 rounded-xl font-medium transition-colors"
          style={{
            background: "var(--gold)",
            color: "#000",
          }}
        >
          Retour au feed
        </Link>
        <Link
          href="/explorer"
          className="px-6 py-3 rounded-xl font-medium transition-colors border"
          style={{
            borderColor: "var(--gold)",
            color: "var(--gold)",
          }}
        >
          Explorer
        </Link>
      </div>
    </div>
  );
}
