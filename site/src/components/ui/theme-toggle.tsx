"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative w-14 h-7 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center px-1 transition-colors hover:border-[#C4956A]/30"
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-[#C4956A] flex items-center justify-center"
        animate={{ x: dark ? 0 : 24 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {dark ? <Moon className="w-3 h-3 text-[#080808]" /> : <Sun className="w-3 h-3 text-[#080808]" />}
      </motion.div>
    </button>
  );
}
