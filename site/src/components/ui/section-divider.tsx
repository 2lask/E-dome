"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionDividerVariant = "gradient-line" | "architectural" | "dots";

interface SectionDividerProps {
  variant?: SectionDividerVariant;
  className?: string;
}

export function SectionDivider({
  variant = "gradient-line",
  className,
}: SectionDividerProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center py-6",
        className
      )}
    >
      {variant === "gradient-line" && <GradientLine />}
      {variant === "architectural" && <ArchitecturalLine />}
      {variant === "dots" && <Dots />}
    </div>
  );
}

function GradientLine() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#ffe0c2] to-transparent"
      style={{ originX: 0.5 }}
    />
  );
}

function ArchitecturalLine() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex w-full max-w-2xl items-center gap-0"
      style={{ originX: 0.5 }}
    >
      {/* Left section marker */}
      <div className="flex items-center">
        <div className="h-3 w-px bg-gradient-to-b from-[#ffe0c2] to-[#ffdfb5]" />
        <div className="h-px w-2 bg-[#ffe0c2]" />
      </div>

      {/* Main line */}
      <div className="h-px flex-1 bg-gradient-to-r from-[#ffe0c2]/60 via-[#ffdfb5]/40 to-[#ffe0c2]/60" />

      {/* Center marker */}
      <div className="flex items-center">
        <div className="h-px w-3 bg-[#ffdfb5]/60" />
        <div className="h-2 w-px bg-gradient-to-b from-[#ffe0c2] to-[#ffdfb5]" />
        <div className="h-px w-3 bg-[#ffdfb5]/60" />
      </div>

      {/* Main line */}
      <div className="h-px flex-1 bg-gradient-to-r from-[#ffe0c2]/60 via-[#ffdfb5]/40 to-[#ffe0c2]/60" />

      {/* Right section marker */}
      <div className="flex items-center">
        <div className="h-px w-2 bg-[#ffdfb5]" />
        <div className="h-3 w-px bg-gradient-to-b from-[#ffe0c2] to-[#ffdfb5]" />
      </div>
    </motion.div>
  );
}

function Dots() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-3"
      style={{ originX: 0.5 }}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-[#ffe0c2]" />
      <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5]" />
      <div className="h-1.5 w-1.5 rounded-full bg-[#ffdfb5]" />
    </motion.div>
  );
}

export default SectionDivider;
