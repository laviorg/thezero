import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  transpilePackages: ["next-mdx-remote"],
  async redirects() {
    return [
      {
        source: "/hardware",
        destination: "/computadores",
        permanent: true,
      },
      {
        source: "/gadgets",
        destination: "/dispositivos",
        permanent: true,
      },
      {
        source: "/apps",
        destination: "/aplicativos",
        permanent: true,
      },
      {
        source: "/games",
        destination: "/jogos",
        permanent: true,
      },
      {
        source: "/consoles",
        destination: "/jogos/consoles",
        permanent: true,
      },
    ];
  },
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
      { protocol: "https", hostname: "i.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "media.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "www.hacktron.ai", pathname: "/**" },
      { protocol: "https", hostname: "hacktron.ai", pathname: "/**" },
      { protocol: "https", hostname: "mercadoeconsumo.com.br", pathname: "/**" },
      { protocol: "https", hostname: "www.mercadoeconsumo.com.br", pathname: "/**" },
    ],
  },
};

export default nextConfig;
