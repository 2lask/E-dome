import * as React from "react";
import { cn } from "@/lib/utils";

/* Input shadcn + slots icon left/right.
   Avant : 4+ pages recopiaient
     <SearchIcon className="absolute left-2.5 top-1/2 ..." />
     <Input className="pl-8" />
   Maintenant : <Input leadingIcon={SearchIcon} />. */

interface InputBaseProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Icone lucide a gauche. */
  leadingIcon?: React.ComponentType<{ className?: string }>;
  /** Icone lucide a droite. */
  trailingIcon?: React.ComponentType<{ className?: string }>;
  /** Element React custom a droite (button, etc.). */
  trailing?: React.ReactNode;
  /** Classes du CONTENEUR quand il y a une icône ou un suffixe : c'est lui
      qu'il faut limiter en largeur, sinon le suffixe s'éloigne du champ. */
  containerClassName?: string;
}

export type InputProps = InputBaseProps;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, leadingIcon: Leading, trailingIcon: Trailing, trailing, ...props }, ref) => {
    const hasLeading = !!Leading;
    const hasTrailing = !!Trailing || !!trailing;
    const inputCls = cn(
      "flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-[border-color,box-shadow]",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "hover:border-foreground/25",
      "focus-visible:outline-none focus-visible:border-leman focus-visible:ring-3 focus-visible:ring-leman/15",
      "disabled:cursor-not-allowed disabled:opacity-50",
      hasLeading && "pl-9",
      hasTrailing && "pr-9",
      className,
    );

    if (!hasLeading && !hasTrailing) {
      return <input type={type} ref={ref} className={inputCls} {...props} />;
    }
    return (
      <div className={cn("relative w-full", containerClassName)}>
        {Leading && (
          <Leading className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input type={type} ref={ref} className={inputCls} {...props} />
        {Trailing && (
          <Trailing className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        {trailing && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
