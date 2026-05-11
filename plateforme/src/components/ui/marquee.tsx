"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right" | "up" | "down";
  fade?: boolean;
  fadeAmount?: number;
}

export function Marquee({
  children,
  className,
  duration = 20,
  pauseOnHover = false,
  direction = "left",
  fade = true,
  fadeAmount = 10,
  ...props
}: MarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  /* useId yields ":r0:" — colons are illegal in CSS class names, strip them.
     Each Marquee instance gets a unique scope class so multiple marquees on
     the same page don't collide on a shared `.marquee-scroller` selector
     (otherwise only the last `<style>` block wins and every row scrolls the
     same direction). */
  const reactId = React.useId();
  const scopeClass = `m-${reactId.replace(/[:]/g, "")}`;

  const items = React.Children.toArray(children);
  const isVertical = direction === "up" || direction === "down";

  return (
    <>
      <style>
        {`
        @keyframes ${scopeClass}-fwd {
          from { transform: ${isVertical ? "translateY(0)" : "translateX(0)"}; }
          to { transform: ${isVertical ? "translateY(-50%)" : "translateX(-50%)"}; }
        }
        @keyframes ${scopeClass}-rev {
          from { transform: ${isVertical ? "translateY(-50%)" : "translateX(-50%)"}; }
          to { transform: ${isVertical ? "translateY(0)" : "translateX(0)"}; }
        }
        .${scopeClass} {
          display: flex;
          animation: ${
            (direction === "left" || direction === "up")
              ? `${scopeClass}-fwd`
              : `${scopeClass}-rev`
          } ${duration}s linear infinite;
        }
        .${scopeClass}.paused {
          animation-play-state: paused;
        }
      `}
      </style>
      <div
        ref={containerRef}
        className={cn(
          "flex w-full overflow-hidden",
          isVertical && "flex-col",
          className,
        )}
        style={{
          ...(fade && {
            maskImage: isVertical
              ? `linear-gradient(to bottom, transparent 0%, black ${fadeAmount}%, black ${
                100 - fadeAmount
              }%, transparent 100%)`
              : `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${
                100 - fadeAmount
              }%, transparent 100%)`,
            WebkitMaskImage: isVertical
              ? `linear-gradient(to bottom, transparent 0%, black ${fadeAmount}%, black ${
                100 - fadeAmount
              }%, transparent 100%)`
              : `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${
                100 - fadeAmount
              }%, transparent 100%)`,
          }),
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        {...props}
      >
        <div
          className={cn(
            "flex shrink-0",
            scopeClass,
            isVertical && "flex-col",
            isPaused && "paused",
          )}
        >
          {items.map((item, index) => (
            <div
              key={`first-${index}`}
              className={cn("flex shrink-0", isVertical && "w-full")}
            >
              {item}
            </div>
          ))}
          {items.map((item, index) => (
            <div
              key={`second-${index}`}
              className={cn("flex shrink-0", isVertical && "w-full")}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
