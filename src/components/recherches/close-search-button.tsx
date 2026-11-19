"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { closeMySearch } from "@/lib/supabase/search-actions";

/** Clore sa recherche (trouvé, ou plus d'actualité) — en deux temps. */
export function CloseSearchButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  if (!confirm) {
    return <Button size="sm" variant="ghost" onClick={() => setConfirm(true)}>Clore</Button>;
  }
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(async () => { await closeMySearch(id); router.refresh(); })}
    >
      Confirmer la clôture
    </Button>
  );
}
