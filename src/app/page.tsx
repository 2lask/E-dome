/* Landing page — base vide.
   À construire selon brief design. Pour accéder à la démo : /feed. */

export const metadata = {
  title: "E-Dome",
  description: "L'écosystème immobilier suisse.",
};

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: 16,
          }}
        >
          E-Dome
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--muted-foreground)",
            margin: 0,
            marginBottom: 32,
          }}
        >
          Landing à construire — accédez à la démo via{" "}
          <a
            href="/feed"
            style={{
              color: "var(--foreground)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            /feed
          </a>
          .
        </p>
      </div>
    </main>
  );
}
