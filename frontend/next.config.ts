import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    sassOptions: {
        silenceDeprecations: ["legacy-js-api"], // 👈 HERE
      }
};

export default nextConfig;
