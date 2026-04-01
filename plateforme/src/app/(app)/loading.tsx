export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}
        />
        <p style={{ color: "var(--text-secondary)" }}>Chargement...</p>
      </div>
    </div>
  );
}
