import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    // Force Rebuild Triggered at 2026-01-13 00:30 (Build Stuck Fix)
  },
};

export default nextConfig;
