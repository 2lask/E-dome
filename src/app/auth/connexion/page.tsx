import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

/* /auth/connexion : page login. useSearchParams dans AuthForm
   exige un Suspense boundary en App Router. */

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
