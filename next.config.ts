import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  agentRules: false,
  devIndicators: false,
  poweredByHeader: false,
};

export default nextConfig;
