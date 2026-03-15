"use client";

import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function generateArchitecturalSVG(): string {
  const elements: string[] = [];
  const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min;
  const randInt = (min: number, max: number) =>
    Math.floor(rand(min, max));
  const totalElements = randInt(30, 51);

  for (let i = 0; i < totalElements; i++) {
    const type = randInt(0, 10);
    const x = rand(10, 380);
    const y = rand(10, 380);

    switch (type) {
      case 0: {
        // Grid lines
        const spacing = rand(20, 40);
        const horizontal = Math.random() > 0.5;
        if (horizontal) {
          elements.push(
            `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="white" stroke-width="0.3" opacity="0.4"/>`
          );
        } else {
          elements.push(
            `<line x1="${x}" y1="0" x2="${x}" y2="400" stroke="white" stroke-width="0.3" opacity="0.4"/>`
          );
        }
        break;
      }
      case 1: {
        // Corner bracket marks (L-shapes)
        const size = rand(8, 20);
        const flip = randInt(0, 4);
        const dx = flip < 2 ? size : -size;
        const dy = flip % 2 === 0 ? size : -size;
        elements.push(
          `<polyline points="${x + dx},${y} ${x},${y} ${x},${y + dy}" fill="none" stroke="white" stroke-width="0.5"/>`
        );
        break;
      }
      case 2: {
        // Dimension lines
        const len = rand(40, 120);
        const cap = 4;
        const labels = ["2.40m", "5.80m", "12.0m", "3.60m", "7.20m", "9.50m"];
        const label = labels[randInt(0, labels.length)];
        elements.push(
          `<line x1="${x}" y1="${y}" x2="${x + len}" y2="${y}" stroke="white" stroke-width="0.4"/>` +
          `<line x1="${x}" y1="${y - cap}" x2="${x}" y2="${y + cap}" stroke="white" stroke-width="0.4"/>` +
          `<line x1="${x + len}" y1="${y - cap}" x2="${x + len}" y2="${y + cap}" stroke="white" stroke-width="0.4"/>` +
          `<text x="${x + len / 2}" y="${y - 3}" text-anchor="middle" fill="white" font-size="7" font-family="monospace">${label}</text>`
        );
        break;
      }
      case 3: {
        // Small rectangle outlines (room footprints)
        const w = rand(15, 60);
        const h = rand(15, 60);
        elements.push(
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="white" stroke-width="0.5"/>`
        );
        break;
      }
      case 4: {
        // Door arc symbols
        const radius = rand(10, 25);
        const dir = randInt(0, 4);
        const sweepFlag = dir < 2 ? 1 : 0;
        const horizontal = dir % 2 === 0;
        if (horizontal) {
          elements.push(
            `<line x1="${x}" y1="${y}" x2="${x + radius}" y2="${y}" stroke="white" stroke-width="0.5"/>` +
            `<path d="M ${x + radius} ${y} A ${radius} ${radius} 0 0 ${sweepFlag} ${x} ${y - radius}" fill="none" stroke="white" stroke-width="0.4"/>`
          );
        } else {
          elements.push(
            `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + radius}" stroke="white" stroke-width="0.5"/>` +
            `<path d="M ${x} ${y + radius} A ${radius} ${radius} 0 0 ${sweepFlag} ${x + radius} ${y}" fill="none" stroke="white" stroke-width="0.4"/>`
          );
        }
        break;
      }
      case 5: {
        // Window symbols
        const wLen = rand(12, 30);
        const thickness = 3;
        elements.push(
          `<rect x="${x}" y="${y}" width="${wLen}" height="${thickness}" fill="none" stroke="white" stroke-width="0.4"/>` +
          `<line x1="${x + wLen * 0.33}" y1="${y}" x2="${x + wLen * 0.33}" y2="${y + thickness}" stroke="white" stroke-width="0.3"/>` +
          `<line x1="${x + wLen * 0.66}" y1="${y}" x2="${x + wLen * 0.66}" y2="${y + thickness}" stroke="white" stroke-width="0.3"/>`
        );
        break;
      }
      case 6: {
        // Cross/plus marks
        const arm = rand(3, 7);
        elements.push(
          `<line x1="${x - arm}" y1="${y}" x2="${x + arm}" y2="${y}" stroke="white" stroke-width="0.5"/>` +
          `<line x1="${x}" y1="${y - arm}" x2="${x}" y2="${y + arm}" stroke="white" stroke-width="0.5"/>`
        );
        break;
      }
      case 7: {
        // Dotted construction lines
        const endX = rand(10, 390);
        const endY = rand(10, 390);
        elements.push(
          `<line x1="${x}" y1="${y}" x2="${endX}" y2="${endY}" stroke="white" stroke-width="0.3" stroke-dasharray="2 4"/>`
        );
        break;
      }
      case 8: {
        // Coordinate labels
        const labels = ["A1", "B3", "C2", "D4", "E1", "A2", "B1", "C4", "D2"];
        const label = labels[randInt(0, labels.length)];
        elements.push(
          `<text x="${x}" y="${y}" fill="white" font-size="7" font-family="monospace">${label}</text>`
        );
        break;
      }
      case 9: {
        // Small circles (compass/radius indicators)
        const r = rand(2, 8);
        elements.push(
          `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="white" stroke-width="0.4"/>`
        );
        break;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">${elements.join("")}</svg>`;
}

export function CardPattern() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [svgContent, setSvgContent] = useState(() => generateArchitecturalSVG());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
      setSvgContent(generateArchitecturalSVG());
    },
    []
  );

  const maskStyle: React.CSSProperties = {
    maskImage: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, white 0%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, white 0%, transparent 100%)`,
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 h-full w-full"
    >
      {/* Dim background pattern (always visible) */}
      <div
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* Revealed pattern under mouse with gradient overlay */}
      <div
        className="absolute inset-0 h-full w-full opacity-100"
        style={maskStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 to-yellow-700/60" />
        <div
          className="absolute inset-0 h-full w-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
}

export function EvervaultCard({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-center justify-center overflow-hidden bg-gray-950 p-px transition-all duration-300 hover:bg-gradient-to-br hover:from-amber-900 hover:to-yellow-700",
        className
      )}
      style={{ borderRadius: 16 }}
    >
      <div
        className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden bg-gray-950"
        style={{ borderRadius: 15 }}
      >
        <CardPattern />
        {text && (
          <p className="pointer-events-none relative z-20 text-center text-2xl font-bold text-white sm:text-4xl">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

export default EvervaultCard;
