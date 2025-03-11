import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    sassOptions: {
        silenceDeprecations: ["legacy-js-api"], 
     },
	 distDir: '.next',
};

export default nextConfig;
