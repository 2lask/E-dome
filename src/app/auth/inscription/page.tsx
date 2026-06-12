import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
