import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "E-Dome",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return <main />;
}
