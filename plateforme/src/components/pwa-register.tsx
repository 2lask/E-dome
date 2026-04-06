"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    // Unregister all service workers and clear caches to fix stale pages
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
      });
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
  }, []);

  return null;
}
