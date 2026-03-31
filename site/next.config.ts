import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/E-dome",
  images: { unoptimized: true },
};

export default nextConfig;
