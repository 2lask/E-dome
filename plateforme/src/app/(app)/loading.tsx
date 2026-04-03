"use client";

import { LottiePlayer } from "@/components/ui/lottie-player";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <LottiePlayer src="/lottie/lottieflow-loading-03-000000-easey.json" width={60} height={60} />
    </div>
  );
}
