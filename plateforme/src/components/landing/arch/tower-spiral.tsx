"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

const enterDraw = (delay = 0, duration = 1.8) => ({
  initial: { strokeDashoffset: 1 },
  whileInView: { strokeDashoffset: 0 },
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const MAIN = "rgba(255,255,255,0.55)";
const FAINT = "rgba(255,255,255,0.28)";
const ACCENT = "rgba(255,255,255,0.78)";
const TEXT = "rgba(255,255,255,0.45)";
const TEXT_STRONG = "rgba(255,255,255,0.7)";

/* ------------------------------------------------------------------ */
/*  COMPONENT 1 — ArchTower (scroll-driven, fills the hero zone)        */
/* ------------------------------------------------------------------ */
/**
 * ArchTower — gratte-ciel modern blueprint qui remplit toute la zone
 * latérale du hero. Le dessin est ENTIÈREMENT VISIBLE par défaut, et
 * disparaît trait par trait au fur et à mesure du scroll.
 *   • 0     → 0.55  : tenu plein (rendu final dès le départ)
 *   • 0.55  → 0.95  : sortie trait par trait (stagger selon l'ordre des paths)
 *   • > 0.95        : tout disparu
 *
 * Implémentation : une seule MotionValue déclenche un useMotionValueEvent
 * qui parcourt en DOM tous les éléments [data-stg] et leur applique le
 * strokeDashoffset selon leur ordre dans la liste (stagger). Ainsi : un
 * seul listener pour des centaines de paths, pas N useTransform en boucle.
 */
export function ArchTower({
  className,
  scrollProgress,
}: {
  className?: string;
  scrollProgress: MotionValue<number>;
}) {
  const groupRef = useRef<SVGGElement>(null);

  // Calcul du strokeDashoffset par trait — uniquement la phase de
  // disparition (pas d'entrée animée : le dessin est plein dès le départ).
  // Fenêtre compressée pour une réactivité forte au scroll.
  const computeOffset = (sp: number, stagger: number) => {
    // stagger ∈ [0,1] : 0 = premier trait à disparaître, 1 = dernier
    const exitStart = 0.20 + stagger * 0.45; // étalé sur 0.20..0.65
    const exitEnd = exitStart + 0.025;        // chaque trait part vite (2.5% du progress)
    if (sp <= exitStart) return 0;            // plein
    if (sp <= exitEnd) return (sp - exitStart) / (exitEnd - exitStart);
    return 1;                                  // disparu
  };

  const applyAll = (sp: number) => {
    if (!groupRef.current) return;
    const paths = Array.from(
      groupRef.current.querySelectorAll<SVGPathElement>("[data-stg]"),
    );
    const N = Math.max(paths.length - 1, 1);
    paths.forEach((p, i) => {
      const off = computeOffset(sp, i / N);
      p.style.strokeDashoffset = String(off);
    });
  };

  useMotionValueEvent(scrollProgress, "change", applyAll);

  // Au mount : applique la valeur courante. Les paths démarrent
  // strokeDashoffset = 0 par défaut donc le dessin est plein dès le rendu.
  useEffect(() => {
    applyAll(scrollProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Niveaux du gratte-ciel (top → bottom). 4 setbacks marqués.
  // Chaque palier : leftX..rightX du noyau de la tour à cette hauteur.
  type Floor = { y: number; lx: number; rx: number; label: string; alt: string };
  const floors: Floor[] = [
    { y: 100, lx: 200, rx: 280, label: "TOIT",  alt: "+62.00" },
    { y: 138, lx: 196, rx: 284, label: "R+12",  alt: "+58.40" },
    { y: 174, lx: 196, rx: 284, label: "R+11",  alt: "+54.80" },
    { y: 210, lx: 196, rx: 284, label: "R+10",  alt: "+51.20" },
    { y: 246, lx: 188, rx: 292, label: "R+9",   alt: "+47.60" },
    { y: 282, lx: 188, rx: 292, label: "R+8",   alt: "+44.00" },
    { y: 318, lx: 188, rx: 292, label: "R+7",   alt: "+40.40" },
    { y: 358, lx: 178, rx: 302, label: "R+6",   alt: "+36.80" },
    { y: 398, lx: 178, rx: 302, label: "R+5",   alt: "+33.20" },
    { y: 438, lx: 178, rx: 302, label: "R+4",   alt: "+29.60" },
    { y: 478, lx: 168, rx: 312, label: "R+3",   alt: "+24.50" },
    { y: 522, lx: 168, rx: 312, label: "R+2",   alt: "+18.30" },
    { y: 568, lx: 156, rx: 324, label: "R+1",   alt: "+12.10" },
    { y: 616, lx: 156, rx: 324, label: "R+0",   alt: "+6.40"  },
    { y: 660, lx: 144, rx: 336, label: "RDC",   alt: "+3.20"  },
    { y: 704, lx: 144, rx: 336, label: "SOL",   alt: "+0.00"  },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 480 1000"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <g
          ref={groupRef}
          stroke={MAIN}
          strokeWidth={1.2}
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {/* ───── Grille de construction très faible ───── */}
          <g stroke={FAINT} strokeWidth={0.4} opacity={0.5}>
            {Array.from({ length: 13 }).map((_, i) => (
              <path
                key={`gv-${i}`}
                data-stg
                pathLength={1}
                strokeDasharray={1}
                d={`M ${i * 40} -20 L ${i * 40} 1020`}
              />
            ))}
            {Array.from({ length: 26 }).map((_, i) => (
              <path
                key={`gh-${i}`}
                data-stg
                pathLength={1}
                strokeDasharray={1}
                d={`M -20 ${i * 40} L 500 ${i * 40}`}
              />
            ))}
          </g>

          {/* ───── Axes principaux (centerline + ground) ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={ACCENT}
            strokeWidth={0.8}
            d="M 240 -30 L 240 1030"
          />
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={ACCENT}
            strokeWidth={0.8}
            d="M -30 720 L 510 720"
          />

          {/* ───── Sol + niveau d'altitude 0.00 ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={MAIN}
            strokeWidth={1.4}
            d="M -30 720 L 510 720"
          />
          {/* Hachures de fondation 45° sous le sol */}
          {Array.from({ length: 32 }).map((_, i) => (
            <path
              key={`fh-${i}`}
              data-stg
              pathLength={1}
              strokeDasharray={1}
              stroke={FAINT}
              strokeWidth={0.6}
              d={`M ${50 + i * 12} 720 L ${30 + i * 12} 745`}
            />
          ))}
          {/* Ligne basse de fondation */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={MAIN}
            strokeWidth={1.0}
            d="M 50 745 L 430 745"
          />

          {/* ───── Plinth / podium au sol ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={MAIN}
            strokeWidth={1.2}
            d="M 130 720 L 130 696 L 350 696 L 350 720"
          />
          {/* Marches du parvis */}
          {[702, 706, 710, 714, 718].map((y, i) => (
            <path
              key={`step-${i}`}
              data-stg
              pathLength={1}
              strokeDasharray={1}
              stroke={FAINT}
              strokeWidth={0.7}
              d={`M ${130 + i * 6} ${y} L ${350 - i * 6} ${y}`}
            />
          ))}

          {/* ───── Silhouette principale du gratte-ciel ─────
              Trait épais qui dessine le contour avec les 4 setbacks. */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={ACCENT}
            strokeWidth={1.6}
            d="M 144 696
               L 144 660 L 156 660 L 156 616
               L 168 616 L 168 568 L 178 568
               L 178 478 L 188 478
               L 188 358 L 196 358
               L 196 138 L 220 138
               L 220 110 L 260 110
               L 260 138 L 284 138
               L 284 358 L 292 358
               L 292 478 L 302 478
               L 302 568 L 312 568
               L 312 616 L 324 616
               L 324 660 L 336 660
               L 336 696 Z"
          />

          {/* ───── Antenne / mât broadcast ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={ACCENT}
            strokeWidth={1.4}
            d="M 240 110 L 240 30"
          />
          {/* Échelle de l'antenne (8 barreaux) */}
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={`ladder-${i}`}
              data-stg
              pathLength={1}
              strokeDasharray={1}
              stroke={ACCENT}
              strokeWidth={0.7}
              d={`M 234 ${40 + i * 8} L 246 ${40 + i * 8}`}
            />
          ))}
          {/* Pointe de paratonnerre */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={ACCENT}
            strokeWidth={1}
            d="M 240 30 L 240 8"
          />
          {/* Cercle au sommet */}
          <circle
            cx={240}
            cy={4}
            r={2.5}
            stroke={ACCENT}
            strokeWidth={0.8}
            fill="none"
          />

          {/* ───── Haubans depuis le sommet de l'antenne ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={FAINT}
            strokeWidth={0.6}
            d="M 240 38 L 196 138"
          />
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={FAINT}
            strokeWidth={0.6}
            d="M 240 38 L 284 138"
          />

          {/* ───── Plancher de chaque étage (fines lignes horizontales) ───── */}
          {floors.map((f, i) => (
            <path
              key={`floor-${i}`}
              data-stg
              pathLength={1}
              strokeDasharray={1}
              stroke={MAIN}
              strokeWidth={i === 0 || f.label === "RDC" ? 1.2 : 0.8}
              d={`M ${f.lx} ${f.y} L ${f.rx} ${f.y}`}
            />
          ))}

          {/* ───── Mullions verticaux par étage (8 par étage) ───── */}
          {floors.slice(0, -1).map((f, i) => {
            const next = floors[i + 1];
            const width = f.rx - f.lx;
            const yTop = f.y + 4;
            const yBot = next.y - 2;
            return Array.from({ length: 7 }).map((_, k) => {
              const t = (k + 1) / 8;
              const x = f.lx + width * t;
              return (
                <path
                  key={`mul-${i}-${k}`}
                  data-stg
                  pathLength={1}
                  strokeDasharray={1}
                  stroke={FAINT}
                  strokeWidth={0.6}
                  d={`M ${x} ${yTop} L ${x} ${yBot}`}
                />
              );
            });
          })}

          {/* ───── Bandes vitrées (strip windows) au milieu de chaque étage ───── */}
          {floors.slice(0, -1).map((f, i) => {
            const next = floors[i + 1];
            const yMid = (f.y + next.y) / 2 - 4;
            return (
              <path
                key={`strip-${i}`}
                data-stg
                pathLength={1}
                strokeDasharray={1}
                stroke={FAINT}
                strokeWidth={0.7}
                d={`M ${f.lx + 4} ${yMid} L ${f.rx - 4} ${yMid}`}
              />
            );
          })}

          {/* ───── Setbacks marqués : trait diagonal de transition ───── */}
          {[
            { y: 138, lx: 196, rx: 284 },
            { y: 358, lx: 188, rx: 292 },
            { y: 478, lx: 178, rx: 302 },
            { y: 568, lx: 168, rx: 312 },
            { y: 616, lx: 156, rx: 324 },
            { y: 660, lx: 144, rx: 336 },
          ].map((s, i) => (
            <g key={`sb-${i}`}>
              {/* Tick gauche du setback */}
              <path
                data-stg
                pathLength={1}
                strokeDasharray={1}
                stroke={ACCENT}
                strokeWidth={0.9}
                d={`M ${s.lx - 4} ${s.y - 6} L ${s.lx + 4} ${s.y + 6}`}
              />
              {/* Tick droit du setback */}
              <path
                data-stg
                pathLength={1}
                strokeDasharray={1}
                stroke={ACCENT}
                strokeWidth={0.9}
                d={`M ${s.rx - 4} ${s.y - 6} L ${s.rx + 4} ${s.y + 6}`}
              />
            </g>
          ))}

          {/* ───── Entrée principale (porte) ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={MAIN}
            strokeWidth={1.2}
            d="M 224 696 L 224 666 L 256 666 L 256 696"
          />
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={FAINT}
            strokeWidth={0.6}
            d="M 240 696 L 240 666"
          />

          {/* ───── Côté gauche : lignes de niveau étendues + cotes ───── */}
          {floors.map((f, i) => (
            <g key={`dim-${i}`}>
              <path
                data-stg
                pathLength={1}
                strokeDasharray={1}
                stroke={FAINT}
                strokeWidth={0.5}
                d={`M 60 ${f.y} L ${f.lx} ${f.y}`}
              />
              {/* Tick + cote */}
              <path
                data-stg
                pathLength={1}
                strokeDasharray={1}
                stroke={MAIN}
                strokeWidth={0.7}
                d={`M 60 ${f.y - 4} L 60 ${f.y + 4}`}
              />
            </g>
          ))}

          {/* ───── Côté droit : lignes de niveau étendues ───── */}
          {floors.map((f, i) => (
            <path
              key={`right-tick-${i}`}
              data-stg
              pathLength={1}
              strokeDasharray={1}
              stroke={FAINT}
              strokeWidth={0.5}
              d={`M ${f.rx} ${f.y} L 420 ${f.y}`}
            />
          ))}

          {/* ───── Chaîne de cotation verticale (gauche, dim chain) ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={MAIN}
            strokeWidth={0.7}
            d="M 60 100 L 60 720"
          />
          {/* Flèches sur la chaîne */}
          {floors.map((f, i) => (
            <path
              key={`arrow-${i}`}
              data-stg
              pathLength={1}
              strokeDasharray={1}
              stroke={MAIN}
              strokeWidth={0.6}
              d={`M 56 ${f.y - 3} L 60 ${f.y} L 56 ${f.y + 3}`}
            />
          ))}

          {/* ───── Cercle de référence section "A" (haut-droite) ───── */}
          <circle
            cx={400}
            cy={140}
            r={9}
            stroke={ACCENT}
            strokeWidth={0.8}
            fill="none"
          />
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={ACCENT}
            strokeWidth={0.7}
            d="M 391 140 L 409 140"
          />

          {/* ───── Cartouche bas-droite (bloc d'identification) ───── */}
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={MAIN}
            strokeWidth={0.7}
            d="M 360 770 L 460 770 L 460 800 L 360 800 Z"
          />
          <path
            data-stg
            pathLength={1}
            strokeDasharray={1}
            stroke={FAINT}
            strokeWidth={0.5}
            d="M 360 785 L 460 785"
          />

          {/* ───── Quelques fenêtres allumées (vie nocturne) ─────
              Ces rectangles ne participent pas au stagger : leur opacité est
              animée en boucle indépendante. */}
          <motion.rect
            x={210} y={264} width={9} height={14}
            fill={ACCENT} fillOpacity={0.35}
            animate={{ opacity: [0.2, 0.85, 0.3, 0.7, 0.2] }}
            transition={{ duration: 3.4, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
          />
          <motion.rect
            x={262} y={342} width={9} height={14}
            fill={ACCENT} fillOpacity={0.35}
            animate={{ opacity: [0.15, 0.8, 0.2, 0.6, 0.15] }}
            transition={{ duration: 4.1, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
          />
          <motion.rect
            x={228} y={420} width={9} height={14}
            fill={ACCENT} fillOpacity={0.35}
            animate={{ opacity: [0.2, 0.9, 0.3, 0.7, 0.2] }}
            transition={{ duration: 3.7, repeat: Infinity, delay: 2.0, ease: "easeInOut" }}
          />
          <motion.rect
            x={250} y={500} width={9} height={14}
            fill={ACCENT} fillOpacity={0.35}
            animate={{ opacity: [0.15, 0.85, 0.25, 0.7, 0.15] }}
            transition={{ duration: 4.6, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
          />
        </g>

        {/* Texte (mono) — labels des étages, cotes, cercle "A" */}
        <g
          fontFamily="ui-monospace, 'JetBrains Mono', monospace"
          fontSize="6"
          fill={TEXT}
        >
          {floors.map((f, i) => (
            <g key={`txt-${i}`}>
              <text x={32} y={f.y + 2}>{f.label}</text>
              <text x={66} y={f.y - 2} fill={TEXT_STRONG}>{f.alt}</text>
              <text x={426} y={f.y + 2}>{f.alt}</text>
            </g>
          ))}
          <text x={397} y={143} fontSize="9" fill={TEXT_STRONG}>A</text>
          <text x={365} y={780}>EDOME · TOWER</text>
          <text x={365} y={794}>BP-001 · 1:200</text>
          <text x={130} y={690}>ENTREE PRINCIPALE</text>
          <text x={48} y={48} fill={TEXT_STRONG} fontSize="7">PL-001</text>
        </g>
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPONENT 2 — ArchDraftingTable                                     */
/* ------------------------------------------------------------------ */
/**
 * ArchDraftingTable — table à dessin d'architecte vue en élévation.
 * Plan incliné avec esquisse architecturale dessus, T-square + équerre +
 * compas qui tourne, lampe gooseneck dont le cône de lumière pulse,
 * rouleaux de plans, pile de livres, tasse de café qui fume.
 * Trait blanc (cohérent avec ArchAngularVolume dans la même section).
 * Forme horizontale — pensée pour le bas de section.
 */
export function ArchDraftingTable({ className }: { className?: string }) {
  const W = "rgba(30,157,241,0.50)";   // main strokes (E-Dome blue)
  const F = "rgba(30,157,241,0.26)";   // faint
  const A = "rgba(30,157,241,0.78)";   // accent
  const T = "rgba(30,157,241,0.55)";   // text

  return (
    <svg
      viewBox="0 0 720 280"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ───── Sol + hachures fondation ───── */}
        <motion.path
          stroke={W} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0, 1.0)}
          d="M -20 250 L 740 250"
        />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.path
            key={`fnd-${i}`}
            stroke={F} strokeWidth={0.4}
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.05 + i * 0.005, 0.4)}
            d={`M ${10 + i * 14} 250 L ${0 + i * 14} 268`}
          />
        ))}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TABLE PRINCIPALE — plan de travail incliné + piétement      */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* Plateau incliné (perspective) */}
        <motion.path
          stroke={A} strokeWidth={1.3}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.3, 1.6)}
          d="M 130 200 L 175 90 L 510 90 L 555 200 Z"
        />
        {/* Bordure haute du plateau (relief) */}
        <motion.path
          stroke={W} strokeWidth={0.6}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.5, 1.0)}
          d="M 175 90 L 510 90 L 510 86 L 175 86 Z"
        />

        {/* Mécanisme d'inclinaison à droite (axes + manivelle) */}
        <motion.path
          stroke={W} strokeWidth={0.7}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.6, 0.9)}
          d="M 555 200 L 580 220 L 555 240 L 530 220 Z"
        />
        <motion.circle
          cx={555} cy={220} r={3}
          stroke={A} strokeWidth={0.8} fill="none"
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.8, 0.5)}
        />

        {/* Pied gauche en lambda */}
        <motion.path
          stroke={A} strokeWidth={1.2}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.6, 1.2)}
          d="M 160 200 L 130 250 M 200 200 L 230 250"
        />
        {/* Traverse horizontale du piétement gauche */}
        <motion.path
          stroke={W} strokeWidth={0.7}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.9, 0.6)}
          d="M 145 225 L 215 225"
        />
        {/* Patin gauche */}
        <motion.path
          stroke={W} strokeWidth={0.6}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.0, 0.4)}
          d="M 122 250 L 142 250 M 220 250 L 240 250"
        />

        {/* Pied droit en lambda */}
        <motion.path
          stroke={A} strokeWidth={1.2}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.7, 1.2)}
          d="M 485 200 L 460 250 M 525 200 L 550 250"
        />
        <motion.path
          stroke={W} strokeWidth={0.7}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.0, 0.6)}
          d="M 472 225 L 540 225"
        />
        <motion.path
          stroke={W} strokeWidth={0.6}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.1, 0.4)}
          d="M 452 250 L 472 250 M 540 250 L 560 250"
        />

        {/* Tiroir / casier sous le plateau */}
        <motion.path
          stroke={F} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.0, 0.8)}
          d="M 230 205 L 460 205 L 470 218 L 220 218 Z"
        />
        <motion.path
          stroke={F} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.2, 0.4)}
          d="M 340 207 L 350 216"
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SUR LE PLATEAU — esquisse en cours, T-square, équerre, etc. */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* Grille de coordonnées sur la planche */}
        <g stroke={F} strokeWidth={0.3} opacity={0.8}>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.path
              key={`pg-h-${i}`}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(0.7 + i * 0.02, 0.4)}
              d={`M ${180 + i * 4.5} ${100 + i * 0} L ${500 - i * 4.5} ${100 + i * 0}`}
            />
          ))}
          {Array.from({ length: 18 }).map((_, i) => {
            // Lignes verticales suivant l'inclinaison
            const x = 175 + i * 19;
            return (
              <motion.path
                key={`pg-v-${i}`}
                pathLength={1} strokeDasharray={1}
                {...enterDraw(0.8 + i * 0.015, 0.4)}
                d={`M ${x} 95 L ${x - 2} 200`}
              />
            );
          })}
        </g>

        {/* Esquisse architecturale dessinée sur le plateau (silhouette de villa) */}
        <g stroke={A} strokeWidth={0.7}>
          {/* Sol esquissé */}
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.4, 0.9)}
            d="M 220 175 L 460 175"
          />
          {/* Volume villa (bloc bas) */}
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.6, 1.2)}
            d="M 250 175 L 250 145 L 380 145 L 380 175"
          />
          {/* Toit */}
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(2.0, 0.8)}
            d="M 240 145 L 315 115 L 390 145"
          />
          {/* Cheminée */}
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(2.2, 0.5)}
            d="M 360 130 L 360 118 L 372 118 L 372 138"
          />
          {/* Volume secondaire (extension droite) */}
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(2.0, 1.0)}
            d="M 380 175 L 380 158 L 432 158 L 432 175"
          />
          {/* Porte centrale */}
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(2.4, 0.5)}
            d="M 308 175 L 308 162 L 322 162 L 322 175"
          />
          {/* Fenêtres */}
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(2.5, 0.5)}
            d="M 262 154 L 274 154 L 274 164 L 262 164 Z"
          />
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(2.55, 0.5)}
            d="M 340 154 L 352 154 L 352 164 L 340 164 Z"
          />
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(2.6, 0.5)}
            d="M 400 165 L 412 165 L 412 173 L 400 173 Z"
          />
        </g>

        {/* T-square (règle horizontale) — partie sur la planche + dépassement */}
        <motion.path
          stroke={A} strokeWidth={0.9}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.2, 1.4)}
          d="M 100 188 L 540 188 L 540 192 L 100 192 Z"
        />
        {/* Tête du T-square (à gauche, qui s'accroche au bord) */}
        <motion.path
          stroke={A} strokeWidth={0.8}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.4, 0.7)}
          d="M 88 174 L 88 206 L 100 206 L 100 174 Z"
        />
        {/* Graduations sur le T-square */}
        {Array.from({ length: 36 }).map((_, i) => (
          <motion.path
            key={`grad-${i}`}
            stroke={F} strokeWidth={0.3}
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.5 + i * 0.005, 0.3)}
            d={`M ${110 + i * 12} 188 L ${110 + i * 12} ${i % 5 === 0 ? 184 : 186}`}
          />
        ))}

        {/* Équerre (set square) — triangle posé sur le plateau */}
        <motion.path
          stroke={A} strokeWidth={0.8}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.8, 1.0)}
          d="M 410 192 L 480 192 L 410 130 Z"
        />
        {/* Graduations sur l'hypoténuse */}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = i / 8;
          const x1 = 410 + t * 70;
          const y1 = 192 - t * 62;
          return (
            <motion.path
              key={`eq-grad-${i}`}
              stroke={F} strokeWidth={0.3}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(2.0 + i * 0.03, 0.3)}
              d={`M ${x1} ${y1} L ${x1 - 3} ${y1 - 3}`}
            />
          );
        })}

        {/* Compas — qui tourne lentement */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "210px 130px" }}
        >
          {/* Branche A */}
          <motion.path
            stroke={A} strokeWidth={1.0}
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.6, 1.0)}
            d="M 210 130 L 195 175"
          />
          {/* Branche B */}
          <motion.path
            stroke={A} strokeWidth={1.0}
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.7, 1.0)}
            d="M 210 130 L 225 175"
          />
          {/* Tête du compas */}
          <circle cx={210} cy={130} r={3.5} stroke={A} strokeWidth={0.8} fill="none" />
          <circle cx={210} cy={130} r={1.5} fill={A} />
          {/* Pointes */}
          <circle cx={195} cy={175} r={1.2} fill={A} />
          <circle cx={225} cy={175} r={1.2} fill={A} />
          {/* Articulation pivotante */}
          <motion.path
            stroke={F} strokeWidth={0.5}
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.9, 0.4)}
            d="M 207 137 L 213 137"
          />
        </motion.g>
        {/* Cercle qu'il dessine (faint) */}
        <motion.circle
          cx={210} cy={130} r={45}
          stroke={F} strokeWidth={0.3}
          strokeDasharray="2 3"
          fill="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.5, delay: 2.2 }}
        />

        {/* Crayon posé en biais */}
        <motion.path
          stroke={A} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.0, 1.0)}
          d="M 290 200 L 350 175"
        />
        <motion.path
          stroke={W} strokeWidth={0.6}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.1, 0.5)}
          d="M 290 200 L 285 203"
        />
        {/* Pointe (mine) */}
        <circle cx={350} cy={175} r={1.4} fill={A} />

        {/* Gomme à effacer */}
        <motion.path
          stroke={W} strokeWidth={0.6}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.2, 0.5)}
          d="M 364 196 L 384 196 L 384 204 L 364 204 Z"
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LAMPE GOOSENECK À GAUCHE — articulée + cône de lumière      */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* Socle */}
        <motion.path
          stroke={A} strokeWidth={0.9}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.5, 0.7)}
          d="M 30 210 L 70 210 L 70 215 L 30 215 Z"
        />
        <motion.path
          stroke={W} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.6, 0.4)}
          d="M 50 210 L 50 200 L 56 198 L 56 195"
        />
        {/* Bras articulé inférieur */}
        <motion.path
          stroke={A} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.7, 1.0)}
          d="M 56 195 L 80 130"
        />
        {/* Articulation 1 */}
        <circle cx={80} cy={130} r={2.5} stroke={A} strokeWidth={0.7} fill="none" />
        <circle cx={80} cy={130} r={0.8} fill={A} />
        {/* Bras articulé supérieur */}
        <motion.path
          stroke={A} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.8, 1.0)}
          d="M 80 130 L 130 80"
        />
        {/* Articulation 2 */}
        <circle cx={130} cy={80} r={2.5} stroke={A} strokeWidth={0.7} fill="none" />
        <circle cx={130} cy={80} r={0.8} fill={A} />
        {/* Tête de lampe */}
        <motion.path
          stroke={A} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.95, 0.7)}
          d="M 130 80 L 158 60 L 178 76 L 150 96 Z"
        />
        {/* Cône de lumière (faint) — pulse */}
        <motion.path
          fill="rgba(30,157,241,0.12)"
          stroke={F}
          strokeWidth={0.4}
          d="M 158 76 L 230 188 L 130 196 Z"
          animate={{ opacity: [0.22, 0.55, 0.22] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Petites lignes de lumière à l'intérieur du cône */}
        <g stroke={F} strokeWidth={0.3}>
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.4, 0.9)}
            d="M 160 78 L 172 192"
            opacity={0.5}
          />
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.5, 0.9)}
            d="M 168 80 L 200 190"
            opacity={0.4}
          />
        </g>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* À DROITE — pile de livres + rouleaux + tasse de café         */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* Pile de livres (3 niveaux) */}
        <g stroke={A} strokeWidth={0.8}>
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.6, 0.8)}
            d="M 600 230 L 695 230 L 695 244 L 600 244 Z"
          />
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.75, 0.8)}
            d="M 612 218 L 705 218 L 705 230 L 612 230 Z"
          />
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.9, 0.8)}
            d="M 605 206 L 690 206 L 690 218 L 605 218 Z"
          />
        </g>
        {/* Tranche des livres (lignes) */}
        <g stroke={F} strokeWidth={0.4}>
          {[210, 222, 234].map((y, i) => (
            <motion.path
              key={`bk-${i}`}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.1 + i * 0.05, 0.5)}
              d={`M 605 ${y} L 700 ${y}`}
              opacity={0.7}
            />
          ))}
        </g>
        {/* Reliure (3 petits rectangles sur la tranche du livre du dessus) */}
        <motion.path
          stroke={A} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.3, 0.5)}
          d="M 615 209 L 620 209 L 620 215 L 615 215 Z"
        />

        {/* Rouleaux de plans (2 cylindres) */}
        <g stroke={A} strokeWidth={0.8}>
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.65, 0.9)}
            d="M 600 198 L 705 198"
          />
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.7, 0.9)}
            d="M 600 188 L 705 188"
          />
          <motion.ellipse
            cx={600} cy={193} rx={4} ry={5}
            stroke={A} strokeWidth={0.7}
            fill="none"
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.85, 0.5)}
          />
          <motion.ellipse
            cx={705} cy={193} rx={4} ry={5}
            stroke={A} strokeWidth={0.7}
            fill="none"
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.9, 0.5)}
          />
        </g>
        {/* Spirales aux extrémités (suggérant le rouleau) */}
        <g stroke={F} strokeWidth={0.5}>
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.0, 0.6)}
            d="M 597 191 Q 599 188, 601 191 Q 603 194, 601 195"
          />
          <motion.path
            pathLength={1} strokeDasharray={1}
            {...enterDraw(1.05, 0.6)}
            d="M 702 191 Q 704 188, 706 191 Q 708 194, 706 195"
          />
        </g>

        {/* Tasse de café — sur le plateau */}
        <motion.path
          stroke={A} strokeWidth={0.9}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.7, 1.0)}
          d="M 568 175 L 568 200 Q 568 208, 580 208 L 600 208 Q 612 208, 612 200 L 612 175 Z"
        />
        {/* Anse */}
        <motion.path
          stroke={A} strokeWidth={0.8}
          fill="none"
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.95, 0.8)}
          d="M 612 184 Q 624 184, 624 192 Q 624 200, 612 200"
        />
        {/* Niveau du café */}
        <motion.path
          stroke={F} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.2, 0.5)}
          d="M 570 180 L 610 180"
        />
        {/* Soucoupe */}
        <motion.path
          stroke={W} strokeWidth={0.6}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.0, 0.6)}
          d="M 558 208 L 622 208"
        />
        {/* Vapeur de café — 3 wisps qui montent en boucle */}
        {[
          { x: 575, dur: 3.4, delay: 0 },
          { x: 588, dur: 3.8, delay: 0.8 },
          { x: 601, dur: 3.2, delay: 1.6 },
        ].map((s, i) => (
          <motion.path
            key={`steam-${i}`}
            stroke={F}
            strokeWidth={0.5}
            fill="none"
            d={`M ${s.x} 175 Q ${s.x - 4} 165, ${s.x} 155 Q ${s.x + 4} 145, ${s.x} 135 Q ${s.x - 4} 125, ${s.x} 115`}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.55, 0],
              y: [0, -20, -40],
            }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COTATION + RÉFÉRENCES                                        */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* Cercle de référence section "F" */}
        <motion.circle
          cx={680} cy={50} r={9}
          stroke={A} strokeWidth={0.7}
          fill="none"
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.3, 0.9)}
        />
        <motion.path
          stroke={A} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.4, 0.5)}
          d="M 671 50 L 689 50"
        />
        <text x={676} y={48} fontSize="6" fill={T} fontFamily="monospace">F</text>
        <text x={675} y={56} fontSize="3.6" fill={T} fontFamily="monospace">04</text>

        {/* Cartouche bas-droite */}
        <motion.path
          stroke={F} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.6, 0.9)}
          d="M 580 270 L 700 270 L 700 290 L 580 290 Z"
        />
        <motion.path
          stroke={F} strokeWidth={0.3}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.7, 0.6)}
          d="M 580 280 L 700 280"
        />
        <text x={584} y={278} fontSize="4.8" fill={T} fontFamily="monospace">DRAFTING TABLE</text>
        <text x={584} y={287} fontSize="3.5" fill={T} fontFamily="monospace">BP-004 · 1:20</text>

        {/* Cotation horizontale au-dessus de la table */}
        <motion.path
          stroke={F} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.4, 1.0)}
          d="M 130 70 L 555 70"
        />
        <motion.path
          stroke={F} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.5, 0.4)}
          d="M 126 66 L 134 74 M 551 66 L 559 74"
        />
        <text x={325} y={66} fontSize="5" fill={T} fontFamily="monospace">L = 1.50</text>

        {/* Inscription centrale sur le plan dessiné */}
        <text x={295} y={112} fontSize="5" fill={T} fontFamily="monospace">VILLA · ESQ.</text>
      </motion.g>
    </svg>
  );
}
