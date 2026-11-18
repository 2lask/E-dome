import { redirect } from "next/navigation";

/* `/demo` n'existe plus comme écran : la racine `/` est l'accueil de la vraie
   plateforme (chantier B4). On redirige pour ne pas casser d'anciens liens
   (la landing figée y renvoyait). */
export default function DemoRedirect() {
  redirect("/");
}
