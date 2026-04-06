"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function FeaturedVideoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="max-w-6xl mx-auto rounded-3xl overflow-hidden aspect-video relative"
      >
        <video
          className="w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Info card */}
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">
                Our Approach
              </p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                We believe in the power of curiosity-driven exploration. Every
                project starts with a question, and every answer opens a new door
                to innovation.
              </p>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors self-start md:self-auto"
            >
              Explore more
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
