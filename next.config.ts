import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  transpilePackages: ["next-mdx-remote"],
  outputFileTracingIncludes: {
    "/*": ["./content/posts/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.apple.com", pathname: "/**" },
      { protocol: "https", hostname: "apple.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cloudfront.net", pathname: "/**" },
      { protocol: "https", hostname: "www.estadao.com.br", pathname: "/**" },
      { protocol: "https", hostname: "imagens.estadao.com.br", pathname: "/**" },
      { protocol: "https", hostname: "statics.estadao.com.br", pathname: "/**" },
      { protocol: "https", hostname: "thezero-blue.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "thezero.com.br", pathname: "/**" },
      { protocol: "https", hostname: "www.thezero.com.br", pathname: "/**" },
    ],
  },
};

export default nextConfig;
