"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { RefObject, useRef } from "react";

interface MediaItem {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Up to 7 media items get distinct positions; extras cycle through. */
  images?: MediaItem[];
  /** Same as images but rendered as <video>. */
  videos?: MediaItem[];
  /**
   * Optional external scroll target. When provided, the component renders in
   * "embedded" mode (absolute fill of its parent, % positioning) so it can
   * sit inside something like a phone screen while reading scroll progress
   * from a 300vh+ section above.
   */
  targetRef?: RefObject<HTMLElement | null>;
}

export function ZoomParallax({ images, videos, targetRef }: ZoomParallaxProps) {
  const internal = useRef<HTMLDivElement | null>(null);
  const isEmbedded = !!targetRef;
  const items = videos ?? images ?? [];
  const isVideo = !!videos;

  const { scrollYProgress } = useScroll({
    target: targetRef ?? internal,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Position presets — viewport units when standalone, % of parent when embedded.
  const positionClass = (index: number) => {
    if (isEmbedded) {
      switch (index) {
        case 1:
          return "[&>div]:!-top-[30%] [&>div]:!left-[5%] [&>div]:!h-[30%] [&>div]:!w-[35%]";
        case 2:
          return "[&>div]:!-top-[10%] [&>div]:!-left-[25%] [&>div]:!h-[45%] [&>div]:!w-[20%]";
        case 3:
          return "[&>div]:!left-[27.5%] [&>div]:!h-[25%] [&>div]:!w-[25%]";
        case 4:
          return "[&>div]:!top-[27.5%] [&>div]:!left-[5%] [&>div]:!h-[25%] [&>div]:!w-[20%]";
        case 5:
          return "[&>div]:!top-[27.5%] [&>div]:!-left-[22.5%] [&>div]:!h-[25%] [&>div]:!w-[30%]";
        case 6:
          return "[&>div]:!top-[22.5%] [&>div]:!left-[25%] [&>div]:!h-[15%] [&>div]:!w-[15%]";
        default:
          return "";
      }
    }
    switch (index) {
      case 1:
        return "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]";
      case 2:
        return "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]";
      case 3:
        return "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]";
      case 4:
        return "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]";
      case 5:
        return "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]";
      case 6:
        return "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]";
      default:
        return "";
    }
  };

  const innerSize = isEmbedded ? "h-[25%] w-[25%]" : "h-[25vh] w-[25vw]";

  const tiles = items.map(({ src, alt }, index) => {
    const scale = scales[index % scales.length];
    return (
      <motion.div
        key={index}
        style={{ scale }}
        className={`absolute top-0 flex h-full w-full items-center justify-center ${positionClass(index)}`}
      >
        <div className={`relative ${innerSize}`}>
          {isVideo ? (
            <video
              src={src}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={src || "/placeholder.svg"}
              alt={alt || `Parallax image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </motion.div>
    );
  });

  if (isEmbedded) {
    return <div className="absolute inset-0 overflow-hidden">{tiles}</div>;
  }

  return (
    <div ref={internal} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">{tiles}</div>
    </div>
  );
}
