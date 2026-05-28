import type { NextConfig } from "next";

const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  output: "export",
  basePath: isVercel ? "" : "/E-dome",
  images: { unoptimized: true },
};

export default nextConfig;
