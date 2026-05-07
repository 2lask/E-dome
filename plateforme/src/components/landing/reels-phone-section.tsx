"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { ReelsVideoStack } from "./reels-video-stack";

interface VideoItem {
  src: string;
}

interface ReelsPhoneSectionProps {
  videos: VideoItem[];
  punch: string;
  punchEmphasis: string;
  /** vh allouées par vidéo. Total = videos.length * vhPerVideo + tailVh. Défaut 70. */
  vhPerVideo?: number;
  /** vh de hold après la dernière vidéo avant que la section libère le scroll. Défaut 30. */
  tailVh?: number;
}

/**
 * Section autonome (hors ScrollStage) qui pin l'iPhone au centre du viewport
 * pendant un budget de scroll dédié. Pendant ce budget, les 10 vidéos
 * défilent style Reels à l'intérieur de l'écran. Une fois la dernière vidéo
 * passée + une queue de hold, le sentinel libère le sticky et la section
 * suivante peut prendre le relais.
 */
export function ReelsPhoneSection({
  videos,
  punch,
  punchEmphasis,
  vhPerVideo = 70,
  tailVh = 30,
}: ReelsPhoneSectionProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["start start", "end end"],
  });

  const totalVh = videos.length * vhPerVideo + tailVh;
  const tailFrac = tailVh / totalVh;

  // Progression "cycling" : 0 → 1 sur la portion utile, 1 pendant la queue.
  const cyclingProgress = useTransform(
    scrollYProgress,
    [0, 1 - tailFrac],
    [0, 1],
    { clamp: true },
  );

  // Léger parallax du bloc texte pour qu'il vive pendant le pin.
  const textY = useTransform(scrollYProgress, [0, 1], ["0px", "-32px"]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.92, 1],
    [0, 1, 1, 0.5],
  );

  return (
    <section
      ref={sentinelRef}
      className="relative bg-black"
      style={{ height: `${totalVh}vh` }}
      aria-label="Reels feed"
    >
      <div className="sticky top-0 h-screen flex items-center px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <PunchBlock
            punch={punch}
            punchEmphasis={punchEmphasis}
            y={textY}
            opacity={textOpacity}
          />

          <div className="order-1 lg:order-2 flex justify-center">
            <div style={{ width: 250, height: 526 }}>
              <IPhoneMockup
                model="15-pro"
                color="natural-titanium"
                scale={0.6}
                safeArea={false}
              >
                <ReelsVideoStack videos={videos} progress={cyclingProgress} />
              </IPhoneMockup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PunchBlockProps {
  punch: string;
  punchEmphasis: string;
  y: MotionValue<string>;
  opacity: MotionValue<number>;
}

function PunchBlock({ punch, punchEmphasis, y, opacity }: PunchBlockProps) {
  return (
    <motion.div
      style={{ y, opacity }}
      className="order-2 lg:order-1 max-w-xl mx-auto lg:mx-0"
    >
      <div className="border-l-2 border-red-500/60 pl-6 py-1">
        <p className="text-white text-base md:text-lg leading-relaxed font-light">
          {punch}{" "}
          <strong className="font-semibold text-white">{punchEmphasis}</strong>
        </p>
      </div>
    </motion.div>
  );
}
