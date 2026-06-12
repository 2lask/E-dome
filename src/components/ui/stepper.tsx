import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* Stepper horizontal : step active = ring foreground, completed = fond foreground,
   pending = muted. Utilisable dans publier/creer-post/creer-reel/services/proposer. */

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  current: number;
  className?: string;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, current, className, onStepClick }: StepperProps) {
  return (
    <ol
      data-slot="stepper"
      className={cn("flex w-full items-start gap-2", className)}
    >
      {steps.map((step, idx) => {
        const completed = idx < current;
        const active = idx === current;
        const interactive = onStepClick && idx <= current;
        return (
          <li key={step.id} className="flex flex-1 items-start gap-2">
            <button
              type="button"
              onClick={interactive ? () => onStepClick(idx) : undefined}
              disabled={!interactive}
              className={cn(
                "flex flex-col items-start gap-1.5 text-left w-full",
                interactive && "cursor-pointer",
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono tabular-nums transition-colors",
                    completed && "border-foreground bg-foreground text-background",
                    active && "border-foreground bg-background text-foreground ring-2 ring-foreground/20",
                    !completed && !active && "border-border text-muted-foreground",
                  )}
                >
                  {completed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </span>
                {idx < steps.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1 transition-colors",
                      completed ? "bg-foreground" : "bg-border",
                    )}
                  />
                )}
              </div>
              <div className="pl-0">
                <p
                  className={cn(
                    "text-xs font-medium",
                    active || completed ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[11px] text-muted-foreground">{step.description}</p>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
