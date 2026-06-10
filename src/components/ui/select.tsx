"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* Select primitive — wrap d'un <select> natif stylise comme shadcn.
   API : <Select value onValueChange><SelectTrigger><SelectValue/>
   </SelectTrigger><SelectContent><SelectItem value>label</SelectItem>
   </SelectContent></Select>. Pas de Radix : on rend juste un select
   natif + Composer compose les SelectItem en <option>. */

interface SelectContextValue {
  value?: string;
  onValueChange?: (v: string) => void;
  registerOption: (value: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
}: SelectProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = value ?? internal;
  const setCurrent = React.useCallback(
    (v: string) => {
      if (value === undefined) setInternal(v);
      onValueChange?.(v);
    },
    [value, onValueChange],
  );

  /* Les SelectItem s'enregistrent dans un Map pour qu'on puisse rendre
     les options du select natif depuis le wrapper. */
  const [options, setOptions] = React.useState<
    { value: string; label: React.ReactNode }[]
  >([]);
  const registerOption = React.useCallback((v: string, label: React.ReactNode) => {
    setOptions((prev) => {
      if (prev.some((o) => o.value === v)) return prev;
      return [...prev, { value: v, label }];
    });
  }, []);

  return (
    <SelectContext.Provider
      value={{ value: current, onValueChange: setCurrent, registerOption }}
    >
      {/* On rend les SelectItem juste pour les enregistrer (mounted=false). */}
      <div className="hidden">{children}</div>
      {/* Et on rend le vrai select natif a partir des options collectees. */}
      <SelectNative options={options} value={current} onChange={setCurrent}>
        {children}
      </SelectNative>
    </SelectContext.Provider>
  );
}

function SelectNative({
  options,
  value,
  onChange,
  children,
}: {
  options: { value: string; label: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  /* On cherche le SelectTrigger parmi les enfants pour appliquer ses
     className/props au wrapper visuel. */
  let triggerClass = "";
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === "SelectTrigger"
    ) {
      triggerClass = (child.props as { className?: string }).className ?? "";
    }
  });

  const labelForValue = options.find((o) => o.value === value)?.label;

  return (
    <div
      className={cn(
        "relative inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        triggerClass,
      )}
    >
      <span className="truncate flex-1 text-left">
        {labelForValue ?? <span className="text-muted-foreground">Choisir...</span>}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Select"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {/* Le navigateur ne peut afficher que du texte dans <option>. */}
            {typeof o.label === "string" ? o.label : String(o.value)}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
(SelectTrigger as { displayName?: string }).displayName = "SelectTrigger";

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <>{placeholder ?? ""}</>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}
export function SelectItem({ value, children }: SelectItemProps) {
  const ctx = React.useContext(SelectContext);
  React.useEffect(() => {
    ctx?.registerOption(value, children);
  }, [ctx, value, children]);
  return null;
}
