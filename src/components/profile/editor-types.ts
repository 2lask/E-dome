import type { Experience, Education } from "@/lib/profile-types";

/* Descripteur d'éditeur ouvert. Toutes les modales sont montées par
   l'orchestrateur ProfileView ; les sections, l'en-tête et la carte de
   complétion se contentent d'appeler openEditor(...) — ce qui permet à la
   complétion de router vers n'importe quelle section. */
export type ProfileEditor =
  | { type: "intro" }
  | { type: "avatar" }
  | { type: "banner" }
  | { type: "about" }
  | { type: "experience"; item?: Experience }
  | { type: "education"; item?: Education }
  | { type: "skills" }
  | { type: "links" };

export type OpenEditor = (editor: ProfileEditor) => void;

/** Mappe une action de complétion vers l'éditeur correspondant. */
export function editorForAction(action: string): ProfileEditor {
  switch (action) {
    case "avatar": return { type: "avatar" };
    case "banner": return { type: "banner" };
    case "about": return { type: "about" };
    case "experiences": return { type: "experience" };
    case "education": return { type: "education" };
    case "skills": return { type: "skills" };
    case "links": return { type: "links" };
    default: return { type: "intro" };
  }
}
