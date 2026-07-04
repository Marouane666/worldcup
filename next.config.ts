import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Flags are served from flagcdn.com. We mostly use plain <img> tags for
    // pixel-parity with the original design, but allow the domain in case
    // next/image is ever used.
    remotePatterns: [{ protocol: "https", hostname: "flagcdn.com" }],
  },
};

export default nextConfig;
