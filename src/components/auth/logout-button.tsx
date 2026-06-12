"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/* LogoutButton : bouton de deconnexion.
   - Avec Supabase : signOut + refresh + redirect /
   - Sans Supabase : juste redirect / (mode demo, pas de session a tuer) */

interface LogoutButtonProps {
  variant?: "default" | "danger";
  className?: string;
}

export function LogoutButton({ variant = "default", className }: LogoutButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    if (supabase && isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  const base =
    "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const tone =
    variant === "danger"
      ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
      : "border border-border bg-background hover:bg-muted";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`${base} ${tone} ${className ?? ""}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Se déconnecter
    </button>
  );
}
