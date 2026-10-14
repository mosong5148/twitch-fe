import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Define production-grade asynchronous URL rewriting gateways [1]
  async rewrites() {
    return [
      {
        // 1. Match any local relative endpoint format inside our project code
        source: "/:path*",
        // 2. Silently proxy and forward traffic directly to the active live production cloud server
        destination: "https://twitch-614092140035.us-west1.run.app/:path*",
      },
    ];
  },
};

export default nextConfig;
