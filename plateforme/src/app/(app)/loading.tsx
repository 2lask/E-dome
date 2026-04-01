export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}
      />
    </div>
  );
}
