import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Hiérarchie (REBUILD.md §4) : `default` = Encre (l'action principale, une par
   écran) · `accent` = Léman (action de confiance : contacter, valider) ·
   `prime` = Laiton (uniquement quand l'action rapporte de l'argent) ·
   `outline` / `ghost` = secondaires. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium tracking-[-0.005em] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/88",
        accent: "bg-leman text-white shadow-xs hover:bg-leman-hover dark:text-[#0d1513]",
        prime:
          "border border-laiton-border bg-laiton-soft text-laiton hover:bg-laiton-soft/70",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/75",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "h-auto px-0 text-leman underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8.5 rounded-md px-3 text-[13px]",
        lg: "h-11 px-6 text-[15px]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
