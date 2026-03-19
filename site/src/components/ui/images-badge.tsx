"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ImagesBadgeProps {
  text: string;
  images: string[];
  className?: string;
}

export function ImagesBadge({ text, images, className }: ImagesBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2",
        className
      )}
    >
      <div className="flex -space-x-2">
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt=""
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
            className="w-7 h-7 rounded-full border-2 border-[#080808] object-cover"
          />
        ))}
      </div>
      <span className="text-sm text-white/70 font-medium">{text}</span>
    </motion.div>
  );
}
