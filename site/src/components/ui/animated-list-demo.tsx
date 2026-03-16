"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications: Item[] = [
  {
    name: "R\u00e9servation confirm\u00e9e",
    description: "Chalet Verbier \u2014 12-17 mars",
    time: "2 min",
    icon: "\u{1F3E0}",
    color: "#8B6F47",
  },
  {
    name: "Commission re\u00e7ue",
    description: "Apport Pierre Morel \u2014 CHF 3\u2019200",
    time: "5 min",
    icon: "\u{1F4B0}",
    color: "#C4956A",
  },
  {
    name: "Nouveau membre",
    description: "Sophie Durand \u2014 Agence Gen\u00e8ve",
    time: "8 min",
    icon: "\u{1F464}",
    color: "#6B8E6B",
  },
  {
    name: "Bien publi\u00e9",
    description: "Villa M\u00e9diterran\u00e9e \u2014 Marrakech",
    time: "12 min",
    icon: "\u{1F4CD}",
    color: "#7A8BA5",
  },
  {
    name: "Formation termin\u00e9e",
    description: "March\u00e9 suisse \u2014 Certificat obtenu",
    time: "18 min",
    icon: "\u{1F393}",
    color: "#9B7DB8",
  },
  {
    name: "Partenariat cr\u00e9\u00e9",
    description: "Studio Photo Z\u00fcrich",
    time: "25 min",
    icon: "\u{1F91D}",
    color: "#B8860B",
  },
];

notifications = Array.from({ length: 4 }, () => notifications).flat();

function Notification({ name, description, icon, color, time }: Item) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(139,111,71,.06),0_2px_4px_rgba(139,111,71,.04),0_12px_24px_rgba(139,111,71,.06)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre text-[#1A1A1A]">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">\u00b7</span>
            <span className="text-xs text-[#888888]">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-[#555555]">{description}</p>
        </div>
      </div>
    </figure>
  );
}

export function AnimatedListDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#FAF8F5]" />
    </div>
  );
}
