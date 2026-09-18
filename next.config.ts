import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  transpilePackages: ["next-mdx-remote"],
  outputFileTracingIncludes: {
    "/*": ["./content/posts/**/*"],
  },
};

export default nextConfig;
