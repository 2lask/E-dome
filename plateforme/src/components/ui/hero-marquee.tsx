"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  images: string[];
  className?: string;
  children?: React.ReactNode;
}

const FADE_IN = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline, title, description, ctaText, ctaHref = "#", secondaryCtaText, secondaryCtaHref = "#",
  images, className, children,
}) => {
  const duplicatedImages = [...images, ...images];

  return (
    <section className={cn("relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-24", className)}>
      <div className="z-10 flex flex-col items-center">
        <motion.div initial="hidden" animate="show" variants={FADE_IN}
          className="mb-4 inline-block rounded-full border border-[#1e9df1]/30 bg-[#1e9df1]/5 px-4 py-1.5 text-sm font-medium text-[#1e9df1] backdrop-blur-sm">
          {tagline}
        </motion.div>

        <motion.h1 initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
          {typeof title === 'string' ? (
            title.split(" ").map((word, i) => (
              <motion.span key={i} variants={FADE_IN} className="inline-block">{word}&nbsp;</motion.span>
            ))
          ) : title}
        </motion.h1>

        <motion.p initial="hidden" animate="show" variants={FADE_IN} transition={{ delay: 0.5 }}
          className="mt-6 max-w-xl text-lg text-gray-400">
          {description}
        </motion.p>

        <motion.div initial="hidden" animate="show" variants={FADE_IN} transition={{ delay: 0.6 }}
          className="flex items-center gap-4 mt-8">
          <a href={ctaHref}
            className="px-8 py-3 rounded-full bg-[#1e9df1] text-white font-semibold shadow-lg transition-all hover:bg-[#1a8fd9] hover:shadow-xl hover:scale-[1.02]">
            {ctaText}
          </a>
          {secondaryCtaText && (
            <a href={secondaryCtaHref}
              className="px-8 py-3 rounded-full border border-neutral-700 text-gray-300 font-medium hover:bg-neutral-900 transition-all">
              {secondaryCtaText}
            </a>
          )}
        </motion.div>

        {children}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-2/5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <motion.div className="flex gap-4"
          animate={{ x: ["-50%", "0%"], transition: { ease: "linear", duration: 40, repeat: Infinity } }}>
          {duplicatedImages.map((src, index) => (
            <div key={index} className="relative aspect-[3/4] h-48 md:h-64 flex-shrink-0"
              style={{ rotate: `${index % 2 === 0 ? -2 : 5}deg` }}>
              <img src={src} alt="" className="w-full h-full object-cover rounded-2xl shadow-md" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
