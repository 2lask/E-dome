"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { PlayCircle } from "lucide-react";

const crmFeatures = [
  {
    title: "Suivi des opportunit\u00e9s",
    subtitle: "Suivez chaque lead depuis le premier contact jusqu'\u00e0 la cl\u00f4ture avec un pipeline visuel clair."
  },
  {
    title: "Relances automatis\u00e9es",
    subtitle: "Envoyez des messages personnalis\u00e9s au bon moment pour ne perdre aucune opportunit\u00e9."
  },
  {
    title: "Rapports personnalis\u00e9s",
    subtitle: "G\u00e9n\u00e9rez des rapports sur mesure pour guider vos d\u00e9cisions avec pr\u00e9cision."
  },
  {
    title: "Collaboration d'\u00e9quipe",
    subtitle: "Partagez les mises \u00e0 jour, assignez les t\u00e2ches et alignez vos efforts."
  }
];

export default function FeaturedCrmDemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-7xl mx-auto bg-[#111111] text-white">
      <header className="text-left py-12">
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Des outils puissants{" "}
          <br />
          <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
            pour l&apos;immobilier.
          </span>
        </h2>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
        <Card className="lg:col-span-2 bg-[#191919] border-[#201e18] p-2 overflow-hidden relative mb-4 lg:mb-0 flex flex-col min-h-[500px]">
          <CardContent className="p-0 relative flex-grow group">
            {isPlaying ? (
              <video
                src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/crm(1)(1)(1).mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <>
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#ffe0c2]/10 via-[#191919] to-[#ffdfb5]/10 flex items-center justify-center min-h-[400px]">
                  <span className="text-white/20 text-lg">Aper\u00e7u vid\u00e9o</span>
                </div>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#ffe0c2] drop-shadow-lg" />
                </button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 h-full">
          {crmFeatures.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col border border-[#201e18] rounded-xl p-2 hover:border-[#ffe0c2]/20 cursor-pointer transition-colors"
            >
              <Card className="bg-[#191919] border-[#201e18] flex-grow rounded-lg p-0" />
              <div className="mt-2">
                <h3 className="text-sm font-medium text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
