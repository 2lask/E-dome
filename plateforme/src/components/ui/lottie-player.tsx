"use client";
import { useEffect, useRef } from "react";

interface LottiePlayerProps {
  src: string;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function LottiePlayer({ src, width = 100, height = 100, loop = true, autoplay = true, className }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !containerRef.current) return;
      const L = (window as any).lottie;
      if (!L) return;
      if (animRef.current) animRef.current.destroy();
      animRef.current = L.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        path: src,
      });
    };

    if ((window as any).lottie) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
      script.onload = init;
      document.head.appendChild(script);
    }

    return () => { cancelled = true; if (animRef.current) animRef.current.destroy(); };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} style={{ width, height }} />;
}
