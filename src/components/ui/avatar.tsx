"use client";

import React from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
  xs: { container: "w-6 h-6", text: "text-[9px]", indicator: "w-1.5 h-1.5 border" },
  sm: { container: "w-8 h-8", text: "text-[10px]", indicator: "w-2 h-2 border" },
  md: { container: "w-10 h-10", text: "text-xs", indicator: "w-2.5 h-2.5 border-2" },
  lg: { container: "w-14 h-14", text: "text-sm", indicator: "w-3 h-3 border-2" },
  xl: { container: "w-20 h-20", text: "text-lg", indicator: "w-4 h-4 border-2" },
};

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  online,
  className,
}: AvatarProps) {
  const s = sizeMap[size];

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className={cn("relative shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={cn(s.container, "rounded-full object-cover")}
        />
      ) : (
        <div
          className={cn(
            s.container,
            s.text,
            "rounded-full flex items-center justify-center font-semibold"
          )}
          style={{ background: "var(--gold)", color: "#000" }}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            s.indicator,
            "absolute bottom-0 right-0 rounded-full"
          )}
          style={{
            borderColor: "var(--card)",
            background: online ? "var(--success)" : "var(--muted-foreground)",
          }}
        />
      )}
    </div>
  );
}
