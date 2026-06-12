import * as React from "react";
import { cn } from "@/lib/utils";

/* StatusBadge : badge avec tone sémantique (success/warning/danger/info/neutral).
   Utilise les tokens chip-*-soft de globals.css (WCAG-safe sur fond clair). */

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASS: Record<StatusTone, string> = {
  success: "chip-success-soft",
  warning: "chip-warning-soft",
  danger: "chip-danger-soft",
  info: "chip-info-soft",
  neutral: "bg-muted text-foreground/80",
};

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  dot?: boolean;
  icon?: React.ReactNode;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ tone = "neutral", dot, icon, className, children, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="status-badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        TONE_CLASS[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-emerald-500",
            tone === "warning" && "bg-amber-500",
            tone === "danger" && "bg-rose-500",
            tone === "info" && "bg-sky-500",
            tone === "neutral" && "bg-muted-foreground",
          )}
        />
      )}
      {icon}
      {children}
    </span>
  ),
);
StatusBadge.displayName = "StatusBadge";
