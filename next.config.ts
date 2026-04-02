import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint key is removed in Next 16; use scripts in package.json instead
};

export default nextConfig;