"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Search, Plus, Sparkles, User, Settings, Heart, HelpCircle, LogIn, UserPlus,
  BookOpen, Tag, CornerDownLeft, type LucideIcon,
} from "lucide-react";
import { navFor, COMMAND_OPEN_EVENT, AI_OPEN_EVENT } from "@/lib/nav";
import { cn } from "@/lib/utils";

/* ── Menu de commande ⌘K (REBUILD.md §3.2) ───────────────────────────────────

   Tout E-Dome à une commande, au clavier : aller quelque part, publier, ouvrir
   le copilote, chercher un bien. C'est le raccourci des pros (Linear, Vercel,
   Raycast) — et le remplaçant des 15 entrées de l'ancienne barre latérale.

   Ouverture : ⌘K / Ctrl+K partout, ou l'événement `edome:command-open`. */

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  group: "Aller à" | "Actions" | "Compte" | "Recherche";
  keywords?: string;
  run: () => void;
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function CommandMenu({ member }: { member: boolean }) {
  const router = useRouter();
  const [open, setOpenRaw] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  /* Toute ouverture/fermeture repart d'une saisie vide. */
  const setOpen = useCallback((v: boolean) => {
    setOpenRaw(v);
    setQuery("");
    setActive(0);
  }, []);

  /* Ouverture clavier + événement global. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenRaw((o) => !o);
        setQuery("");
        setActive(0);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(COMMAND_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(COMMAND_OPEN_EVENT, onOpen);
    };
  }, [setOpen]);

  const go = useCallback(
    (href: string) => () => {
      setOpen(false);
      router.push(href);
    },
    [router, setOpen],
  );

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = navFor(member).map((e) => ({
      id: `nav-${e.key}`,
      label: e.label,
      hint: e.description,
      icon: e.icon,
      group: "Aller à",
      run: go(e.href),
    }));
    const actions: Command[] = [
      { id: "publier", label: "Publier un bien", hint: "Gratuit, sans commission", icon: Plus, group: "Actions", keywords: "annonce vendre louer ajouter", run: go("/publier") },
      {
        id: "copilote", label: "Demander au copilote IA", hint: "Estimer, rédiger, qualifier", icon: Sparkles, group: "Actions", keywords: "ia assistant estimation",
        run: () => { setOpen(false); window.dispatchEvent(new CustomEvent(AI_OPEN_EVENT)); },
      },
      { id: "vendre", label: "Vendre sans agence", hint: "Seul ou accompagné, 0 CHF à E-Dome", icon: Tag, group: "Actions", keywords: "vente proprietaire commission", run: go("/vendre") },
      { id: "apropos", label: "Comment fonctionne E-Dome", icon: BookOpen, group: "Actions", keywords: "aide fonctionnement regles prime", run: go("/a-propos") },
    ];
    const account: Command[] = member
      ? [
          { id: "profil", label: "Mon profil public", icon: User, group: "Compte", run: go("/profil") },
          { id: "favoris", label: "Mes favoris", icon: Heart, group: "Compte", run: go("/favoris") },
          { id: "reglages", label: "Réglages du compte", icon: Settings, group: "Compte", keywords: "parametres", run: go("/parametres") },
          { id: "aide", label: "Aide", icon: HelpCircle, group: "Compte", run: go("/aide") },
        ]
      : [
          { id: "connexion", label: "Se connecter", icon: LogIn, group: "Compte", keywords: "login", run: go("/auth/connexion") },
          { id: "inscription", label: "Créer un compte", hint: "Gratuit", icon: UserPlus, group: "Compte", keywords: "inscription signup", run: go("/auth/inscription") },
          { id: "aide", label: "Aide", icon: HelpCircle, group: "Compte", run: go("/aide") },
        ];
    return [...nav, ...actions, ...account];
  }, [member, go, setOpen]);

  const results = useMemo<Command[]>(() => {
    const q = normalize(query);
    const matched = q
      ? commands.filter((c) => normalize(`${c.label} ${c.hint ?? ""} ${c.keywords ?? ""}`).includes(q))
      : commands;
    if (!q) return matched;
    /* Toute saisie propose aussi la recherche de biens, en tête. */
    const search: Command = {
      id: "search",
      label: `Rechercher « ${query.trim()} » dans les biens`,
      icon: Search,
      group: "Recherche",
      run: go(`/recherche?q=${encodeURIComponent(query.trim())}`),
    };
    return [search, ...matched];
  }, [commands, query, go]);

  /* Garde l'élément actif visible pendant la navigation au clavier. */
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); results[active]?.run(); }
  };

  /* Regroupement à l'affichage, en conservant l'index global (clavier). */
  const groups = useMemo(() => {
    const order: Command["group"][] = ["Recherche", "Aller à", "Actions", "Compte"];
    return order
      .map((g) => ({ g, items: results.map((c, i) => ({ c, i })).filter(({ c }) => c.group === g) }))
      .filter((x) => x.items.length > 0);
  }, [results]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px] animate-fade-in dark:bg-black/50" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[12vh] z-[61] w-[min(620px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-2xl border bg-card shadow-2xl animate-scale-in"
          onKeyDown={onKeyDown}
        >
          <DialogPrimitive.Title className="sr-only">Menu de commande</DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              data-focus-ring="none"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              placeholder="Rechercher un bien, une page, une action…"
              aria-label="Commande ou recherche"
              role="combobox"
              aria-expanded
              aria-controls="command-list"
              aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
              className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded-md border px-1.5 py-0.5 text-[11px] text-muted-foreground sm:block">Échap</kbd>
          </div>

          <div ref={listRef} id="command-list" role="listbox" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">Aucun résultat.</p>
            ) : (
              groups.map(({ g, items }) => (
                <div key={g} className="mb-1 last:mb-0">
                  <p className="eyebrow px-2.5 pb-1 pt-2">{g}</p>
                  {items.map(({ c, i }) => {
                    const Icon = c.icon;
                    const isActive = i === active;
                    return (
                      <div
                        key={c.id}
                        id={`cmd-${c.id}`}
                        role="option"
                        aria-selected={isActive}
                        data-index={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => c.run()}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
                          isActive ? "bg-accent" : "",
                        )}
                      >
                        <span className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background",
                          isActive && "border-leman/30 text-leman",
                        )}>
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium">{c.label}</span>
                          {c.hint && <span className="block truncate text-[12px] text-muted-foreground">{c.hint}</span>}
                        </span>
                        {isActive && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-4 border-t bg-subtle/60 px-4 py-2 text-[11.5px] text-muted-foreground">
            <span><kbd className="font-mono">↑↓</kbd> naviguer</span>
            <span><kbd className="font-mono">↵</kbd> ouvrir</span>
            <span className="ml-auto"><kbd className="font-mono">⌘K</kbd> / <kbd className="font-mono">Ctrl K</kbd></span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
