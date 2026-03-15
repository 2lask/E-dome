"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FramedTextProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function FramedText({ children, className, glow = false }: FramedTextProps) {
  const cornerSize = 16;

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Optional glow effect behind content */}
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-lg opacity-40 blur-xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,224,194,0.3) 0%, rgba(255,223,181,0.15) 50%, transparent 80%)",
          }}
        />
      )}

      {/* Glass morphism container with gradient border */}
      <div className="relative rounded-lg bg-white/5 p-6 backdrop-blur-md">
        {/* Gradient border overlay (1px) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            padding: "1px",
            background: "linear-gradient(135deg, #ffe0c2, #ffdfb5)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Corner marks — Top Left */}
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={cornerSize}
          height={cornerSize}
          viewBox={`0 0 ${cornerSize} ${cornerSize}`}
          fill="none"
        >
          <path
            d={`M0 ${cornerSize}V0H${cornerSize}`}
            stroke="url(#corner-grad-tl)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="corner-grad-tl" x1="0" y1={cornerSize} x2={cornerSize} y2="0">
              <stop stopColor="#ffe0c2" />
              <stop offset="1" stopColor="#ffdfb5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Corner marks — Top Right */}
        <svg
          className="pointer-events-none absolute right-0 top-0"
          width={cornerSize}
          height={cornerSize}
          viewBox={`0 0 ${cornerSize} ${cornerSize}`}
          fill="none"
        >
          <path
            d={`M0 0H${cornerSize}V${cornerSize}`}
            stroke="url(#corner-grad-tr)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="corner-grad-tr" x1="0" y1="0" x2={cornerSize} y2={cornerSize}>
              <stop stopColor="#ffe0c2" />
              <stop offset="1" stopColor="#ffdfb5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Corner marks — Bottom Left */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0"
          width={cornerSize}
          height={cornerSize}
          viewBox={`0 0 ${cornerSize} ${cornerSize}`}
          fill="none"
        >
          <path
            d={`M${cornerSize} ${cornerSize}H0V0`}
            stroke="url(#corner-grad-bl)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="corner-grad-bl" x1={cornerSize} y1={cornerSize} x2="0" y2="0">
              <stop stopColor="#ffdfb5" />
              <stop offset="1" stopColor="#ffe0c2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Corner marks — Bottom Right */}
        <svg
          className="pointer-events-none absolute bottom-0 right-0"
          width={cornerSize}
          height={cornerSize}
          viewBox={`0 0 ${cornerSize} ${cornerSize}`}
          fill="none"
        >
          <path
            d={`M0 ${cornerSize}H${cornerSize}V0`}
            stroke="url(#corner-grad-br)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="corner-grad-br" x1="0" y1={cornerSize} x2={cornerSize} y2="0">
              <stop stopColor="#ffdfb5" />
              <stop offset="1" stopColor="#ffe0c2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

export default FramedText;
