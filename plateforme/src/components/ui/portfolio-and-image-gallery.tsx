"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };

    handleResize();

    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);

  return value;
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: (hoveredIndex: number | null) => ReactNode[];
  scrollDuration?: number;
  visiblePercentage?: number;
  baseRadius?: number;
  mobileRadius?: number;
  startTrigger?: string;
  onItemSelect?: (index: number) => void;
  direction?: "ltr" | "rtl";
  disabled?: boolean;
  /**
   * Optional MotionValue [0,1] driving the wheel's rotation. When provided,
   * the component bypasses its own GSAP ScrollTrigger pin/scrub — useful
   * when the gallery sits inside another sticky-pinned context (e.g. a
   * ScrollStage slide) where GSAP's pin would fight the parent.
   */
  progress?: MotionValue<number>;
  /** Number of full 360° turns when `progress` goes 0→1. Default 1. */
  rotations?: number;
}

export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = "",
      startTrigger = "center center",
      onItemSelect,
      direction = "ltr",
      disabled = false,
      progress,
      rotations = 1,
      ...rest
    },
    ref,
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);

    const mergedRef = useMergeRefs(ref, pinRef);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(
      null,
    );
    const [isMounted, setIsMounted] = useState(false);

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;

    // Rotation pilotée par une MotionValue externe (mode embedded).
    // Quand `progress` est absent, on garde un fallback à 0 et c'est GSAP
    // qui anime imperatively containerRef.style.rotate via gsap.to.
    const fallbackProgress = useMotionValue(0);
    const externalRotation = useTransform(
      progress ?? fallbackProgress,
      [0, 1],
      [0, 360 * rotations],
    );
    const useExternalProgress = progress !== undefined;

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex],
    );
    const childrenCount = childrenNodes.length;

    useEffect(() => {
      setIsMounted(true);

      if (!childRef.current) return;

      const observer = new ResizeObserver((entries) => {
        let hasChanged = false;
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
          hasChanged = true;
        }
        if (hasChanged) {
          ScrollTrigger.refresh();
        }
      });

      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount]);

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0)
          return;
        // Mode embedded : un parent pilote la rotation via la prop progress.
        // On laisse tomber les ScrollTrigger GSAP (pin + scrub + entrance)
        // pour éviter le conflit avec le sticky parent.
        if (useExternalProgress) return;

        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!prefersReducedMotion) {
          gsap.fromTo(
            containerRef.current.children,
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "back.out(1.2)",
              stagger: 0.05,
              scrollTrigger: {
                trigger: pinRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );

          gsap.to(containerRef.current, {
            rotation: 360,
            ease: "none",
            scrollTrigger: {
              trigger: pinRef.current,
              pin: true,
              start: startTrigger,
              end: `+=${scrollDuration}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      },
      {
        scope: pinRef,
        dependencies: [
          scrollDuration,
          currentRadius,
          startTrigger,
          childrenCount,
          useExternalProgress,
        ],
      },
    );

    if (childrenCount === 0) return null;

    const scaleFactor = 1.25;
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 60
      : 150;

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    return (
      <div
        ref={mergedRef}
        className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden ${className}`}
        {...rest}
      >
        <div
          className="relative w-full overflow-hidden"
          style={
            useExternalProgress
              ? {
                  // Embedded : la roue occupe toute la hauteur du parent et
                  // le masque dégradé est neutralisé pour que la roue tienne
                  // visuellement centrée (pas ancrée en bas).
                  height: "100%",
                }
              : {
                  height: `${visibleAreaHeight}px`,
                  maskImage:
                    "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
                }
          }
        >
          <motion.ul
            ref={containerRef}
            className={`
              absolute left-1/2 -translate-x-1/2 will-change-transform m-0 p-0 list-none
              transition-opacity duration-500 ease-out
              ${disabled ? "opacity-50 pointer-events-none grayscale" : ""}
              ${isMounted ? "opacity-100" : "opacity-0"}
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              // Embedded : on centre verticalement la roue dans son parent
              // (top:50% + translateY -50%) plutôt que de l'ancrer en bas.
              // Standalone : ancrage en bas + masque dégradé (comportement
              // d'origine, "roue à demi enterrée").
              ...(useExternalProgress
                ? {
                    top: "50%",
                    bottom: "auto",
                    x: "-50%",
                    y: "-50%",
                    rotate: externalRotation,
                  }
                : {
                    bottom: -(circleDiameter * hiddenDecimal),
                  }),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);

              if (direction === "rtl") {
                x = -x;
              }

              const rotationAngle = (angle * 180) / Math.PI;
              const isHovered = hoveredIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${
                      rotationAngle + 90
                    }deg)`,
                  }}
                >
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && onItemSelect?.(index)}
                    onKeyDown={(e) => {
                      if (disabled) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onItemSelect?.(index);
                      }
                    }}
                    onMouseEnter={() => !disabled && setHoveredIndex(index)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    onFocus={() => !disabled && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    className={`
                      block cursor-pointer outline-none text-left
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      rounded-xl transition-all duration-500 ease-out will-change-transform
                      ${isHovered ? "scale-125 -translate-y-8" : "scale-100"}
                      ${
                        isAnyHovered && !isHovered
                          ? "blur-[2px] opacity-40 grayscale"
                          : "blur-0 opacity-100"
                      }
                    `}
                  >
                    {child}
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    );
  },
);

RadialScrollGallery.displayName = "RadialScrollGallery";
