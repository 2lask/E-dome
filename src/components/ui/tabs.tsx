"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* Tabs minimaliste (sans Radix) : state interne, API compatible avec
   les habitudes shadcn (Tabs / TabsList / TabsTrigger / TabsContent).
   Suffit pour le dashboard, evite d'ajouter @radix-ui/react-tabs. */

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsCtx(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* must be used within <Tabs>");
  return ctx;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
}

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const value = controlled ?? internal;
  const setValue = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1 rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  className,
  children,
  disabled,
  ...props
}: TabsTriggerProps) {
  const ctx = useTabsCtx();
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      disabled={disabled}
      onClick={() => !disabled && ctx.setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const ctx = useTabsCtx();
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      data-state="active"
      className={cn(
        "mt-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
