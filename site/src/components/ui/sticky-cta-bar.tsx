"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  const [hiddenByFooter, setHiddenByFooter] = useState(false);
  const { scrollY } = useScroll();

  // Show after 400px scroll
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setVisible(latest > 400);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Hide near the footer
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHiddenByFooter(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const show = visible && !hiddenByFooter;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#191919] border-t border-[#ffe0c2]/20"
        >
          <div className="max-w-screen-xl mx-auto h-full px-4 flex items-center justify-between gap-4">
            {/* Left text */}
            <p className="text-[#ffe0c2] text-sm md:text-base font-medium hidden sm:block">
              Programme Membres Fondateurs — Places limit&eacute;es
            </p>
            <p className="text-[#ffe0c2] text-sm font-medium sm:hidden">
              Places limit&eacute;es
            </p>

            {/* Right CTA button */}
            <a
              href="#qualification"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] px-5 py-2.5 text-sm font-semibold text-[#111111] hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-[#ffe0c2]/10"
            >
              Manifester mon int&eacute;r&ecirc;t &rarr;
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
