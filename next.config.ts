import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "10.122.220.216",
        port: "5000",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  // Performance optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  // Enable SWR caching
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['react-icons', 'lottie-react'],
  },
};

export default nextConfig;
