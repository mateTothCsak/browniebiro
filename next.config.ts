import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the WSL host IP to load dev resources (only affects `next dev`).
  allowedDevOrigins: ['172.21.96.1'],
};

export default nextConfig;
