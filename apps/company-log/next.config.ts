import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pickler/ui", "@pickler/db"],
};

export default nextConfig;
