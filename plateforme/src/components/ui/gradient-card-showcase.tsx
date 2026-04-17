import React from 'react';

interface SkewCardProps {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function SkewCards({ cards }: { cards?: SkewCardProps[] }) {
  const defaultCards = cards || [];

  return (
    <>
      <div className="flex justify-center items-center flex-wrap py-10">
        {defaultCards.map(({ title, desc, gradientFrom, gradientTo, ctaText, ctaHref }, idx) => (
          <div
            key={idx}
            className="group relative w-[320px] h-[400px] m-[40px_30px] transition-all duration-500"
          >
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{ background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})` }}
            />
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{ background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})` }}
            />
            <span className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] transition-all duration-100 group-hover:top-[-50px] group-hover:left-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
              <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] transition-all duration-500 group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
            </span>
            <div className="relative z-20 left-0 p-[20px_40px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] shadow-lg rounded-lg text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[60px_40px]">
              <h2 className="text-2xl mb-2 font-semibold">{title}</h2>
              <p className="text-base leading-relaxed mb-4 text-white/80">{desc}</p>
              {ctaText && (
                <a href={ctaHref || "#"} className="inline-block text-sm font-bold text-black bg-white px-4 py-2 rounded-lg hover:bg-[#C4956A] hover:text-white transition-colors">
                  {ctaText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
