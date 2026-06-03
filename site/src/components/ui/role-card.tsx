"use client";

import type React from "react";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface RoleCardProps {
  icon: LucideIcon;
  name: string;
  color: string;
  desc: string;
}

export function RoleCard({ icon: Icon, name, color, desc }: RoleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isHovered;
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-50, 50], [6, -6]);
  const rotateY = useTransform(mouseX, [-50, 50], [-6, 6]);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer select-none"
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e0e]"
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
        animate={{ height: isExpanded ? 220 : 120 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        {/* Barre couleur en haut */}
        <motion.div
          className="absolute top-0 left-0 right-0"
          animate={{ height: isHovered || isExpanded ? 4 : 2 }}
          style={{ backgroundColor: color }}
          transition={{ duration: 0.3 }}
        />

        {/* Glow au hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}12, transparent 70%)` }}
        />

        {/* Grille pattern quand fermé */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isExpanded ? 0 : 0.02 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id={`grid-${name}`} width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${name})`} />
          </svg>
        </motion.div>

        {/* Expanded: lignes de connexion animées */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="absolute inset-0 h-full w-full">
                {[25, 50, 75].map((y, i) => (
                  <motion.line
                    key={`h-${i}`}
                    x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke={color} strokeWidth="0.5" opacity={0.08}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                  />
                ))}
                {[33, 66].map((x, i) => (
                  <motion.line
                    key={`v-${i}`}
                    x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    stroke={color} strokeWidth="0.5" opacity={0.06}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  />
                ))}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu */}
        <div className="relative z-10 flex flex-col h-full p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
                animate={{
                  boxShadow: isHovered ? `0 0 16px ${color}30` : `0 0 0px ${color}00`,
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </motion.div>
              <motion.h4
                className="text-sm font-bold text-white"
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {name}
              </motion.h4>
            </div>

            {/* Status pill */}
            <motion.div
              className="flex items-center gap-1.5 rounded-full px-2 py-1"
              style={{ backgroundColor: `${color}10` }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color }}>{isExpanded ? "Actif" : "Rôle"}</span>
            </motion.div>
          </div>

          {/* Barre animée */}
          <motion.div
            className="h-px mt-3"
            style={{ background: `linear-gradient(to right, ${color}50, ${color}20, transparent)` }}
            animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3, originX: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Description (expand) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="mt-4 flex-1"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
                <motion.a
                  href="#rejoindre"
                  className="mt-4 flex items-center gap-2 text-xs font-semibold hover:gap-3 transition-all"
                  style={{ color }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span>Rejoindre</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Texte court quand fermé */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.p
                className="text-xs text-white/30 mt-3 line-clamp-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {desc}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
