"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("E-Dome SW registered:", registration.scope);
        })
        .catch((err) => {
          console.log("E-Dome SW registration failed:", err);
        });
    }
  }, []);

  return null;
}
