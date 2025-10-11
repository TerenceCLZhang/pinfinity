import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-0e78bebd2fc84679af2cae379aa81278.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
