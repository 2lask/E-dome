import { redirect } from "next/navigation";

// La maquette est l'unique surface : la racine redirige vers l'app shell.
export default function RootPage() {
  redirect("/feed");
}
