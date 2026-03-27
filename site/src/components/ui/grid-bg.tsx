"use client";

import { cn } from "@/lib/utils";

export function GridBackground({
  children,
  className,
  id,
}: {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(196,149,106,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,149,106,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080808_80%)]" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

export function DotBackground({
  children,
  className,
  id,
}: {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(196,149,106,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#080808_85%)]" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
