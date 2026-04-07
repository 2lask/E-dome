"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const images = {
  villa: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=60",
  wireframe3d: "https://images.unsplash.com/photo-1545873786-5df72ac09e3e?w=1400&q=60",
  blueprint: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1400&q=60",
  building3d: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1400&q=60",
  sketch: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=1400&q=60",
};

interface ArchBackgroundProps {
  variant: "villa" | "floorplan" | "building" | "mixed";
  className?: string;
}

export function ArchBackground({ variant, className = "" }: ArchBackgroundProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["5%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.1, 1.15]);

  const getImages = () => {
    switch (variant) {
      case "villa":
        return [
          { src: images.villa, position: "right-[-10%] top-[5%]", size: "w-[70%] md:w-[50%]", y: y1 },
        ];
      case "floorplan":
        return [
          { src: images.blueprint, position: "left-[-8%] bottom-[5%]", size: "w-[65%] md:w-[45%]", y: y2 },
          { src: images.wireframe3d, position: "right-[-5%] top-[10%]", size: "w-[55%] md:w-[40%]", y: y1 },
        ];
      case "building":
        return [
          { src: images.building3d, position: "right-[0%] top-[0%]", size: "w-[70%] md:w-[55%]", y: y1 },
        ];
      case "mixed":
        return [
          { src: images.sketch, position: "left-[-10%] top-[5%]", size: "w-[60%] md:w-[45%]", y: y2 },
          { src: images.building3d, position: "right-[-8%] bottom-[0%]", size: "w-[65%] md:w-[50%]", y: y1 },
        ];
    }
  };

  const imgs = getImages();

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {imgs.map((img, i) => (
        <motion.div
          key={i}
          className={`absolute ${img.position} ${img.size}`}
          style={{ y: img.y, opacity, scale }}
        >
          <img
            src={img.src}
            alt=""
            className="w-full h-auto opacity-[0.15]"
            style={{ filter: "grayscale(100%) brightness(0.6) contrast(1.3)" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
