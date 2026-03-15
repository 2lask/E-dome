"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { PlayCircle } from "lucide-react";

export default function FeaturedCrmDemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const crmFeatures = [
    {
      title: "Sales Pipeline Tracking",
      subtitle:
        "Easily monitor every lead from first contact to final closure with a simple, visual pipeline that keeps your entire sales process clear and on track."
    },
    {
      title: "Automated Follow-ups",
      subtitle:
        "Use AI-powered reminders to send timely, personalized messages, helping you maintain momentum with leads and ensure no opportunity is ever lost."
    },
    {
      title: "Custom Reports",
      subtitle:
        "Quickly generate tailored, data-rich reports to measure results, uncover new opportunities, and guide your business decisions with precision and clarity."
    },
    {
      title: "Team Collaboration",
      subtitle:
        "Share updates instantly, assign tasks efficiently, and align your entire team's efforts so you can close deals faster and deliver consistent results."
    }
  ];


  return (
    <div className="max-w-7xl mx-auto bg-[#111111] text-white">
      {/* Header */}
      <header className="text-left py-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Empowering developers  <br />
          <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
            with AI-driven solutions.
          </span>
        </h2>
      </header>

      {/* Templates Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
        {/* Main video/image card */}
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
                <Image
                  width={500}
                  height={500}
                  src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/crm-featured.png"
                  alt="CRM Thumbnail"
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Play button overlay */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#ffe0c2] drop-shadow-lg" />
                </button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 h-full">
          {crmFeatures.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col border border-[#201e18] rounded-xl p-2 hover:border-[#ffe0c2]/20 cursor-pointer transition-colors duration-300"
            >
              {/* Card */}
              <Card className="bg-[#191919] border-[#201e18] flex-grow rounded-lg p-0" />

              {/* Title + Subtitle */}
              <div className="mt-2">
                <h3 className="text-sm font-medium text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-1 text-sm">
        {[
          { name: "Salesforce", subtitle: "Enterprise CRM platform", domain: "salesforce.com" },
          { name: "HubSpot CRM", subtitle: "Inbound marketing & sales", domain: "hubspot.com" },
          { name: "Zoho CRM", subtitle: "Affordable CRM solution", domain: "zoho.com" },
          { name: "Pipedrive", subtitle: "Sales pipeline management", domain: "pipedrive.com" },
          { name: "Freshsales", subtitle: "Freshworks sales CRM", domain: "freshworks.com" },
          { name: "Microsoft Dynamics 365", subtitle: "Microsoft business suite", domain: "dynamics.com" },
          { name: "Copper CRM", subtitle: "Google Workspace CRM", domain: "copper.com" },
          { name: "Insightly", subtitle: "Project & CRM management", domain: "insightly.com" },
        ].map((integration) => (
          <div
            key={integration.name}
            className="p-3 flex items-center gap-3 hover:bg-[#191919] rounded-xl transition-colors duration-300"
          >
            <Image
              src={`https://logo.clearbit.com/${integration.domain}`}
              alt={integration.name}
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-xl bg-white p-1"
            />
            <div>
              <div className="font-normal text-white">{integration.name}</div>
              <div className="text-xs text-white/40">{integration.subtitle}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
