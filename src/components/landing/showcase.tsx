"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { number: "01", title: "Feed unifié", description: "Annonces, vidéos, analyses, formations, événements — un seul flux." },
  { number: "02", title: "Calculateur intégré", description: "Rendement net, ROI et fiscalité cantonale préchargés sur chaque bien." },
  { number: "03", title: "Réseau d'apporteurs", description: "Accès aux deals avant publication via 850+ apporteurs actifs." },
  { number: "04", title: "Visios intégrées", description: "Visites en direct, réunions, formations — pas de Zoom à installer." },
];

/* Showcase démo — preview du /feed dans un cadre laptop minimaliste
   + 4 features list à droite. Pattern : Product Demo + Features. */
export function Showcase() {
  const [openVideo, setOpenVideo] = useState(false);

  return (
    <section id="demo" style={{ background: "var(--background)", padding: "112px 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 720, marginBottom: 64 }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                background: "currentColor",
                opacity: 0.5,
              }}
            />
            La plateforme
          </div>
          <h2
            className="page-heading"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.022em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 16,
              color: "var(--foreground)",
            }}
          >
            Un feed pensé pour{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--ed-accent, #0F766E)",
                fontWeight: 500,
              }}
            >
              l'immobilier
            </em>
            .
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--muted-foreground)",
              maxWidth: 580,
              margin: 0,
            }}
          >
            Pas un portail de plus. Un seul flux où circulent annonces,
            analyses financières, formations et événements professionnels.
          </p>
        </motion.div>

        {/* Showcase split */}
        <div
          className="ed-showcase-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .ed-showcase-grid {
                grid-template-columns: 1.4fr 1fr !important;
                gap: 64px !important;
              }
            }
          `}</style>

          {/* Laptop mockup with thumbnail + play */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative" }}
          >
            {/* Browser chrome */}
            <div
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--muted)",
                }}
              >
                <div style={{ display: "flex", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: "#dadada" }} />
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: "#dadada" }} />
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: "#dadada" }} />
                </div>
                <div
                  style={{
                    flex: 1,
                    margin: "0 auto",
                    maxWidth: 280,
                    padding: "4px 10px",
                    background: "var(--background)",
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted-foreground)",
                    textAlign: "center",
                  }}
                >
                  e-dome.ch/feed
                </div>
              </div>

              {/* Screenshot placeholder — single image with play overlay */}
              <button
                type="button"
                onClick={() => setOpenVideo(true)}
                aria-label="Lancer la vidéo de démonstration"
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 10",
                  background:
                    "linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=875&fit=crop&auto=format&q=80"
                  alt="Aperçu du feed E-Dome"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                  className="ed-showcase-img"
                />
                {/* Veil */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35))",
                  }}
                />
                {/* Play badge */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 22px 14px 18px",
                    background: "rgba(255,255,255,0.96)",
                    color: "#0a0a0a",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 500,
                    boxShadow: "0 12px 40px -10px rgba(0,0,0,0.4)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: "var(--ed-accent, #0F766E)",
                      color: "#ffffff",
                    }}
                  >
                    <Play size={11} strokeWidth={2} fill="currentColor" />
                  </span>
                  Voir la démo · 2 min
                </span>
              </button>
            </div>

            {/* Caption underneath */}
            <p
              style={{
                marginTop: 14,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "var(--muted-foreground)",
                letterSpacing: "0.04em",
              }}
            >
              Démo interactive disponible sur{" "}
              <Link
                href="/feed"
                style={{
                  color: "var(--foreground)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                /feed
              </Link>
            </p>

            <style>{`
              .ed-showcase-img:hover { transform: scale(1.025); }
              @media (prefers-reduced-motion: reduce) {
                .ed-showcase-img:hover { transform: none; }
              }
            `}</style>
          </motion.div>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.12 }}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.number}
                style={{
                  display: "flex",
                  gap: 20,
                  padding: "22px 0",
                  borderBottom:
                    i < FEATURES.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    color: "var(--ed-accent, #0F766E)",
                    paddingTop: 4,
                  }}
                >
                  {f.number}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      color: "var(--foreground)",
                      margin: 0,
                      marginBottom: 6,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "var(--muted-foreground)",
                      margin: 0,
                    }}
                  >
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {openVideo && <VideoModal onClose={() => setOpenVideo(false)} />}
    </section>
  );
}

/* Modal vidéo simple — Esc + click veil ferme. Pas de lib externe. */
function VideoModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Démonstration vidéo E-Dome"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "ed-fade-in 220ms ease-out",
      }}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fermer la vidéo"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          width: 40,
          height: 40,
          borderRadius: 999,
          background: "rgba(255,255,255,0.1)",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={18} strokeWidth={2} />
      </button>

      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1100,
          aspectRatio: "16 / 9",
          background: "#000",
          overflow: "hidden",
          position: "relative",
          animation: "ed-scale-in 280ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Vidéo locale du repo — mode démo, pas de YouTube */}
        <video
          src="/videos/commissions.mp4"
          autoPlay
          controls
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          aria-label="Vidéo de démonstration E-Dome"
        />
      </div>

      <style>{`
        @keyframes ed-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ed-scale-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Showcase;
