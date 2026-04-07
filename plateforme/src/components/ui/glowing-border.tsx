import React from "react";

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
}

const GlowingBorder = ({ children, className = "" }: GlowingBorderProps) => {
  return (
    <div className={`relative flex items-center justify-center group ${className}`}>
      {/* Outer glow layers */}
      <div className="absolute z-0 overflow-hidden h-full w-full rounded-3xl blur-[3px]
                      before:absolute before:content-[''] before:z-[-1] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60
                      before:bg-[conic-gradient(#000,#0a6b2e_5%,#000_38%,#000_50%,#0d9444_60%,#000_87%)] before:transition-all before:duration-2000
                      group-hover:before:rotate-[-120deg]">
      </div>
      <div className="absolute z-0 overflow-hidden h-full w-full rounded-3xl blur-[3px]
                      before:absolute before:content-[''] before:z-[-1] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                      before:bg-[conic-gradient(rgba(0,0,0,0),#064e20,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#0a7535,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                      group-hover:before:rotate-[-98deg]">
      </div>

      {/* Inner glow */}
      <div className="absolute z-0 overflow-hidden h-full w-full rounded-3xl blur-[2px]
                      before:absolute before:content-[''] before:z-[-1] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                      before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#34d399,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#6ee7b7,rgba(0,0,0,0)_58%)] before:brightness-140
                      before:transition-all before:duration-2000 group-hover:before:rotate-[-97deg]">
      </div>

      {/* Border glow */}
      <div className="absolute z-0 overflow-hidden h-full w-full rounded-3xl blur-[0.5px]
                      before:absolute before:content-[''] before:z-[-1] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-70
                      before:bg-[conic-gradient(#0a0a0a,#0a6b2e_5%,#0a0a0a_14%,#0a0a0a_50%,#0d9444_60%,#0a0a0a_64%)] before:brightness-130
                      before:transition-all before:duration-2000 group-hover:before:rotate-[-110deg]">
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full rounded-3xl" style={{ background: "rgba(10, 15, 10, 0.95)" }}>
        {children}
      </div>
    </div>
  );
};

export default GlowingBorder;
