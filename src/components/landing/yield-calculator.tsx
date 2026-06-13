"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { TrendingUp, Calculator, Check, BarChart3 } from "lucide-react";
import { SectionHeading } from "./personas";

interface YieldInputs {
  price: number;
  monthlyRent: number;
}

const CHARGES_PCT = 0.18; // Charges + provisions + vacance estimées 18%
const TAX_PCT = 0.12; // Impôt estimé moyen 12% (varie cantons)

function computeYield(inputs: YieldInputs) {
  const annualRent = inputs.monthlyRent * 12;
  const gross = (annualRent / inputs.price) * 100;
  const net = (annualRent * (1 - CHARGES_PCT) * (1 - TAX_PCT) / inputs.price) * 100;
  // ROI 10 ans estimé via composition annuelle 1.8% appréciation + rendement net
  const roi10 = ((net / 100 + 0.018) * 10) * 100;
  return {
    grossPct: gross,
    netPct: net,
    roi10Pct: roi10,
    annualNetCHF: annualRent * (1 - CHARGES_PCT) * (1 - TAX_PCT),
  };
}

export function YieldCalculator() {
  const [inputs, setInputs] = useState<YieldInputs>({
    price: 1_250_000,
    monthlyRent: 4_200,
  });

  const result = useMemo(() => computeYield(inputs), [inputs]);

  // Animations spring sur les chiffres
  const netSpring = useSpring(result.netPct, { stiffness: 80, damping: 18 });
  const annualSpring = useSpring(result.annualNetCHF, { stiffness: 80, damping: 18 });
  const roiSpring = useSpring(result.roi10Pct, { stiffness: 80, damping: 18 });

  useEffect(() => {
    netSpring.set(result.netPct);
    annualSpring.set(result.annualNetCHF);
    roiSpring.set(result.roi10Pct);
  }, [result, netSpring, annualSpring, roiSpring]);

  const [netDisplay, setNetDisplay] = useState(result.netPct.toFixed(1));
  const [annualDisplay, setAnnualDisplay] = useState(Math.round(result.annualNetCHF).toLocaleString("fr-CH"));
  const [roiDisplay, setRoiDisplay] = useState(result.roi10Pct.toFixed(0));

  useEffect(() => {
    const u1 = netSpring.on("change", (v) => setNetDisplay(v.toFixed(1)));
    const u2 = annualSpring.on("change", (v) => setAnnualDisplay(Math.round(v).toLocaleString("fr-CH")));
    const u3 = roiSpring.on("change", (v) => setRoiDisplay(v.toFixed(0)));
    return () => { u1(); u2(); u3(); };
  }, [netSpring, annualSpring, roiSpring]);

  return (
    <section id="produit" className="ld-section" style={{ position: "relative" }}>
      {/* Glow background */}
      <div
        className="ld-glow-spot ld-glow-gold"
        style={{ width: 700, height: 700, top: "30%", left: "-200px", opacity: 0.5 }}
      />

      <div className="ld-container">
        <SectionHeading
          eyebrow="Fonctionnalité phare · 01"
          title={
            <>
              Combien ça rapporte{" "}
              <span className="ld-display-italic ld-grad-aurora-text">vraiment</span> ?
            </>
          }
          description="Le seul portail qui répond à la question. Rendement net après charges et impôts, ROI 10 ans, simulation d'occupation — préchargés sur chaque bien."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 48,
            alignItems: "center",
            marginTop: 64,
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .ld-yield-grid {
                grid-template-columns: 1fr 1.15fr !important;
                gap: 80px !important;
              }
            }
          `}</style>
          <div className="ld-yield-grid" style={{ display: "contents" }}>
            {/* Left : copy + bullets */}
            <div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Rendement net (après charges, vacance et impôts)",
                  "ROI projeté à 5 et 10 ans avec appréciation",
                  "Taux d'occupation simulé selon saisonnalité",
                  "Prix m² benchmarké par quartier et canton",
                ].map((b) => (
                  <li
                    key={b}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      fontSize: 15.5,
                      lineHeight: 1.5,
                      color: "var(--ld-fg-1)",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: 999,
                        background: "rgba(233,198,101,0.18)",
                        color: "var(--ld-gold-400)",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <Check size={13} strokeWidth={2.4} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  fontSize: 12.5,
                  color: "var(--ld-fg-2)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--ld-border-subtle)",
                  borderRadius: 999,
                  fontFamily: "var(--ld-font-mono)",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--ld-success)" }} />
                Données fiscales cantonales mises à jour 2026
              </div>
            </div>

            {/* Right : interactive calculator */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="ld-glass"
              style={{ padding: 32, position: "relative" }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(233,198,101,0.18)",
                    color: "var(--ld-gold-400)",
                  }}
                >
                  <Calculator size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="ld-eyebrow" style={{ marginBottom: 2 }}>Simulateur live</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ld-fg-0)" }}>
                    Rendement net projeté
                  </div>
                </div>
              </div>

              {/* Slider Prix */}
              <SliderRow
                label="Prix d'achat"
                value={inputs.price}
                onChange={(v) => setInputs((s) => ({ ...s, price: v }))}
                min={500_000}
                max={3_500_000}
                step={25_000}
                format={(v) => `CHF ${(v / 1000).toFixed(0)} K`}
              />

              {/* Slider Loyer */}
              <SliderRow
                label="Loyer mensuel net"
                value={inputs.monthlyRent}
                onChange={(v) => setInputs((s) => ({ ...s, monthlyRent: v }))}
                min={1_500}
                max={10_000}
                step={100}
                format={(v) => `CHF ${v.toLocaleString("fr-CH")}`}
              />

              {/* Results */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 16,
                  marginTop: 32,
                  paddingTop: 28,
                  borderTop: "1px solid var(--ld-border)",
                }}
              >
                {/* Main metric : rendement net */}
                <div
                  style={{
                    padding: 24,
                    background: "rgba(233,198,101,0.06)",
                    border: "1px solid rgba(233,198,101,0.25)",
                    borderRadius: 16,
                  }}
                >
                  <div className="ld-eyebrow" style={{ marginBottom: 12 }}>
                    Rendement net annuel
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span
                      className="ld-mono ld-grad-aurora-text"
                      style={{
                        fontSize: 56,
                        fontWeight: 500,
                        lineHeight: 0.95,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {netDisplay}
                    </span>
                    <span style={{ fontSize: 24, color: "var(--ld-gold-400)", fontWeight: 500 }}>%</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ld-fg-2)", marginTop: 12 }}>
                    Soit <span className="ld-mono" style={{ color: "var(--ld-fg-0)" }}>CHF&nbsp;{annualDisplay}</span> par an,
                    après charges et impôts.
                  </div>
                </div>

                {/* Secondary : ROI 10y */}
                <div
                  style={{
                    padding: 24,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--ld-border-subtle)",
                    borderRadius: 16,
                  }}
                >
                  <div className="ld-eyebrow" style={{ marginBottom: 12, color: "var(--ld-success)" }}>
                    ROI 10 ans
                  </div>
                  <div className="ld-mono" style={{ fontSize: 32, fontWeight: 500, color: "var(--ld-fg-0)" }}>
                    +{roiDisplay}<span style={{ fontSize: 18, opacity: 0.7 }}>%</span>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 8,
                      fontSize: 11,
                      color: "var(--ld-success)",
                    }}
                  >
                    <TrendingUp size={11} strokeWidth={2} />
                    +1.8% appréciation/an
                  </div>
                </div>
              </div>

              {/* Sparkline live */}
              <div style={{ marginTop: 24, position: "relative", height: 80 }}>
                <YieldSparkline netPct={result.netPct} />
              </div>

              {/* Footnote */}
              <p
                style={{
                  marginTop: 20,
                  marginBottom: 0,
                  fontSize: 11.5,
                  color: "var(--ld-fg-3)",
                  fontStyle: "italic",
                }}
              >
                Estimation : charges {Math.round(CHARGES_PCT * 100)}&nbsp;% + impôts {Math.round(TAX_PCT * 100)}&nbsp;% (moyenne romande).
                Les valeurs réelles dépendent du canton et du bien.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const inputId = `ld-slider-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <label htmlFor={inputId} style={{ fontSize: 13, color: "var(--ld-fg-2)" }}>{label}</label>
        <span className="ld-mono" style={{ fontSize: 16, fontWeight: 500, color: "var(--ld-fg-0)" }}>
          {format(value)}
        </span>
      </div>
      <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
        {/* Track */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 4,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 999,
          }}
        />
        {/* Fill */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            width: `${pct}%`,
            height: 4,
            background: "var(--ld-grad-aurora)",
            borderRadius: 999,
            boxShadow: "0 0 12px rgba(233,198,101,0.4)",
          }}
        />
        {/* Native range (transparent over) for a11y */}
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={format(value)}
          style={{
            position: "relative",
            width: "100%",
            appearance: "none",
            background: "transparent",
            cursor: "pointer",
            height: 28,
            margin: 0,
          }}
          className="ld-range-input"
        />
      </div>
      <style>{`
        .ld-range-input::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: var(--ld-gold-400);
          border: 2px solid #0a0a0a;
          box-shadow: 0 4px 14px rgba(233,198,101,0.5);
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .ld-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .ld-range-input::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        .ld-range-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: var(--ld-gold-400);
          border: 2px solid #0a0a0a;
          box-shadow: 0 4px 14px rgba(233,198,101,0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function YieldSparkline({ netPct }: { netPct: number }) {
  // Sparkline qui se construit basée sur netPct — illustre la projection
  const points = useMemo(() => {
    const arr: number[] = [];
    let v = 0.5;
    for (let i = 0; i < 24; i++) {
      v = Math.max(0.15, Math.min(0.95, v + ((Math.sin(i * 0.7 + netPct) + 0.3) - 0.2) * 0.15));
      arr.push(v);
    }
    // Tendance globale up : map last value to netPct/8
    const trend = Math.min(0.85, 0.3 + netPct / 12);
    arr[arr.length - 1] = trend;
    arr[arr.length - 2] = (arr[arr.length - 3] + trend) / 2;
    return arr;
  }, [netPct]);
  const width = 320, height = 72;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - v * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="yield-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9c665" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#e9c665" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#yield-grad)" />
      <motion.path
        d={path}
        fill="none"
        stroke="#e9c665"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

export default YieldCalculator;
