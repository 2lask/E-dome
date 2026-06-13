"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface WordRotateProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

export function WordRotate({ words, intervalMs = 2400, className }: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [words.length, intervalMs]);

  // Largeur stable : on calque sur le mot le plus long via inline-grid stack
  return (
    <span
      className={className}
      style={{
        display: "inline-grid",
        gridTemplateAreas: '"slot"',
        verticalAlign: "baseline",
      }}
    >
      {/* Ghost stack pour réserver la largeur du mot le plus long */}
      {words.map((w) => (
        <span
          key={`ghost-${w}`}
          aria-hidden
          style={{
            gridArea: "slot",
            visibility: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {w}
        </span>
      ))}

      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            gridArea: "slot",
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default WordRotate;
