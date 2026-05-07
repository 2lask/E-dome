"use client";

import React, { type MouseEvent, useEffect, useRef, useState } from "react";

/**
 * FounderBadge — adaptation du AwardBadge (Product Hunt golden kitty)
 * pour le statut "Membre Fondateur" d'E-Dome. Conserve le tilt 3D
 * matrix3d sur mouvement souris + le reflet holographique multicolore
 * (10 polygones tournants en mix-blend-mode overlay).
 *
 * Background gold pâle, accents gris foncé, icône dôme en signature.
 */

interface FounderBadgeProps {
  brand?: string;
  title?: string;
  className?: string;
  link?: string;
}

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.25;
const minRotate = -0.25;
const maxScale = 1;
const minScale = 0.97;

export const FounderBadge = ({
  brand = "E-DOME",
  title = "MEMBRE FONDATEUR",
  className,
  link,
}: FounderBadgeProps) => {
  const ref = useRef<HTMLAnchorElement | HTMLDivElement | null>(null);
  const [firstOverlayPosition, setFirstOverlayPosition] = useState<number>(0);
  const [matrix, setMatrix] = useState<string>(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState<string>(identityMatrix);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] = useState<boolean>(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState<boolean>(false);
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDimensions = () => {
    const el = ref.current as HTMLElement | null;
    const left = el?.getBoundingClientRect()?.left || 0;
    const right = el?.getBoundingClientRect()?.right || 0;
    const top = el?.getBoundingClientRect()?.top || 0;
    const bottom = el?.getBoundingClientRect()?.bottom || 0;
    return { left, right, top, bottom };
  };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    const scale = [
      maxScale - ((maxScale - minScale) * Math.abs(xCenter - clientX)) / (xCenter - left),
      maxScale - ((maxScale - minScale) * Math.abs(yCenter - clientY)) / (yCenter - top),
      maxScale -
        ((maxScale - minScale) * (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
          (xCenter - left + yCenter - top),
    ];
    const rotate = {
      x1: 0.25 * ((yCenter - clientY) / yCenter - (xCenter - clientX) / xCenter),
      x2: maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left),
      x3: 0,
      y0: 0,
      y2: maxRotate - ((maxRotate - minRotate) * (top - clientY)) / (top - bottom),
      y3: 0,
      z0: -(maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left)),
      z1: 0.2 - ((0.2 + 0.6) * (top - clientY)) / (top - bottom),
      z3: 0,
    };
    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    );
  };

  const getOppositeMatrix = (_matrix: string, clientY: number, onMouseEnter?: boolean) => {
    const { top, bottom } = getDimensions();
    const oppositeY = bottom - clientY + top;
    const weakening = onMouseEnter ? 0.7 : 4;
    const multiplier = onMouseEnter ? -1 : 1;

    return _matrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return ((-parseFloat(item) * multiplier) / weakening).toString();
        } else if (index === 0 || index === 5 || index === 10) {
          return "1";
        } else if (index === 6) {
          return (
            (multiplier *
              (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom))) /
            weakening
          ).toString();
        } else if (index === 9) {
          return (
            (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom)) /
            weakening
          ).toString();
        }
        return item;
      })
      .join(", ");
  };

  const onMouseEnter = (e: MouseEvent<HTMLElement>) => {
    if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
    if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
    if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);
    setDisableOverlayAnimation(true);

    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    setDisableInOutOverlayAnimation(false);
    enterTimeout.current = setTimeout(() => setDisableInOutOverlayAnimation(true), 350);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition(
          (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5
        );
      });
    });

    const m = getMatrix(e.clientX, e.clientY);
    const opp = getOppositeMatrix(m, e.clientY, true);
    setMatrix(opp);
    setIsTimeoutFinished(false);
    setTimeout(() => setIsTimeoutFinished(true), 200);
  };

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    setTimeout(
      () =>
        setFirstOverlayPosition(
          (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5
        ),
      150
    );
    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(e.clientX, e.clientY));
    }
  };

  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    const opp = getOppositeMatrix(matrix, e.clientY);
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    setCurrentMatrix(opp);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(
          () => setFirstOverlayPosition(-firstOverlayPosition / 4),
          150
        );
        leaveTimeout2.current = setTimeout(() => setFirstOverlayPosition(0), 300);
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false);
          setDisableInOutOverlayAnimation(true);
        }, 500);
      });
    });
  };

  useEffect(() => {
    if (isTimeoutFinished) setMatrix(currentMatrix);
  }, [currentMatrix, isTimeoutFinished]);

  const overlayAnimations = [...Array(10).keys()]
    .map(
      (e) => `
      @keyframes founderOverlay${e + 1} {
        0% { transform: rotate(${e * 10}deg); }
        50% { transform: rotate(${(e + 1) * 10}deg); }
        100% { transform: rotate(${e * 10}deg); }
      }`
    )
    .join(" ");

  const Wrapper: React.ElementType = link ? "a" : "div";
  const wrapperProps = link
    ? { href: link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      ref={ref as never}
      className={`block w-[200px] sm:w-[240px] h-auto cursor-pointer ${className ?? ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      {...wrapperProps}
    >
      <style>{overlayAnimations}</style>
      <div
        style={{
          transform: `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 54" className="w-full h-auto">
          <defs>
            <filter id="founderBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <mask id="founderMask">
              <rect width="260" height="54" fill="white" rx="10" />
            </mask>
            <linearGradient id="founderBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1cfa6" />
              <stop offset="100%" stopColor="#e0b885" />
            </linearGradient>
          </defs>

          {/* Fond gold gradient */}
          <rect width="260" height="54" rx="10" fill="url(#founderBg)" />
          {/* Bordure intérieure */}
          <rect
            x="4"
            y="4"
            width="252"
            height="46"
            rx="8"
            fill="transparent"
            stroke="#8a6a4a"
            strokeWidth="1"
            opacity="0.55"
          />

          {/* Brand "E-DOME" */}
          <text
            fontFamily="Helvetica-Bold, Helvetica, Arial"
            fontSize="9"
            fontWeight="bold"
            fill="#5d4630"
            x="48"
            y="20"
            letterSpacing="1.6"
          >
            {brand}
          </text>

          {/* Title "MEMBRE FONDATEUR" */}
          <text
            fontFamily="Helvetica-Bold, Helvetica, Arial"
            fontSize="14"
            fontWeight="bold"
            fill="#3d2c1c"
            x="47"
            y="40"
          >
            {title}
          </text>

          {/* Icône dôme + base + sommet (signature E-Dome) */}
          <g transform="translate(8, 12)" stroke="#3d2c1c" strokeWidth="1.6" fill="none" strokeLinecap="round">
            {/* Arc du dôme */}
            <path d="M 2 28 A 14 14 0 0 1 30 28" />
            {/* Base */}
            <line x1="0" y1="28" x2="32" y2="28" />
            {/* Pilier vertical au sommet */}
            <line x1="16" y1="14" x2="16" y2="6" />
            {/* Petite étoile au sommet */}
            <circle cx="16" cy="4" r="1.4" fill="#3d2c1c" />
            {/* Détail intérieur (3 lignes verticales = colonnes) */}
            <line x1="8" y1="20" x2="8" y2="28" />
            <line x1="16" y1="18" x2="16" y2="28" />
            <line x1="24" y1="20" x2="24" y2="28" />
          </g>

          {/* ── Reflet holographique multicolore (10 polygones tournants) ── */}
          <g style={{ mixBlendMode: "overlay" }} mask="url(#founderMask)">
            {[
              "hsl(358, 100%, 62%)",
              "hsl(30, 100%, 50%)",
              "hsl(60, 100%, 50%)",
              "hsl(96, 100%, 50%)",
              "hsl(233, 85%, 47%)",
              "hsl(271, 85%, 47%)",
              "hsl(300, 20%, 35%)",
              "transparent",
              "transparent",
              "white",
            ].map((color, i) => (
              <g
                key={i}
                style={{
                  transform: `rotate(${firstOverlayPosition + i * 10}deg)`,
                  transformOrigin: "center center",
                  transition: !disableInOutOverlayAnimation
                    ? "transform 200ms ease-out"
                    : "none",
                  animation: disableOverlayAnimation
                    ? "none"
                    : `founderOverlay${i + 1} 5s infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points="0,0 260,54 260,0 0,54"
                  fill={color}
                  filter="url(#founderBlur)"
                  opacity="0.5"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </Wrapper>
  );
};

export default FounderBadge;
