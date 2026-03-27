"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setX((e.clientX - centerX) * 0.15);
    setY((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    setX(0);
    setY(0);
  };

  const Tag = href ? "a" : "div";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.div animate={{ x, y }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
        <Tag
          href={href}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-4 rounded-full",
            "bg-[#C4956A] text-[#080808] font-bold text-lg",
            "transition-shadow duration-300",
            "hover:shadow-[0_0_50px_rgba(196,149,106,0.5)]",
            "active:scale-95",
            className
          )}
        >
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}
