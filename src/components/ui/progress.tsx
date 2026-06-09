import * as React from "react";
import { cn } from "@/lib/utils";

/* Progress bar — sans Radix, simple div animee.
   Pattern : rail bg-primary/20 + thumb bg-primary, hauteur ajustable. */

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0..100. Clampe automatiquement. */
  value?: number;
  /** Hauteur du rail. Defaut h-2. */
  className?: string;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </div>
  );
}
