"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
        >
          !
        </div>
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Une erreur est survenue
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          {error.message || "Quelque chose s'est mal passé. Veuillez réessayer."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
