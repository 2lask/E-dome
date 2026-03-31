"use client";

import { cn } from "@/lib/utils";

export function AuroraBackground({
  children,
  className,
  id,
}: {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("relative overflow-hidden", className)}>
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-[#C4956A]/[0.07] blur-[120px] animate-aurora-1" />
        <div className="absolute -bottom-[30%] -right-[15%] w-[60%] h-[60%] rounded-full bg-[#D4A574]/[0.05] blur-[100px] animate-aurora-2" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#C4956A]/[0.04] blur-[80px] animate-aurora-3" />
      </div>
      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
