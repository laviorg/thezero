import type { NextConfig } from "next";
import { APEX_HOST, PATH_REDIRECTS } from "./src/lib/redirects";

const cloudflareExport = process.env.CF_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  transpilePackages: ["next-mdx-remote"],
  ...(cloudflareExport ? { output: "export" as const } : {}),
  // Static export does not apply next.config redirects. The Cloudflare build
  // writes the same rules to out/_redirects. The Vercel build keeps them here.
  ...(!cloudflareExport
    ? {
        async redirects() {
          return [
            {
              source: "/:path*",
              has: [{ type: "host", value: APEX_HOST }],
              destination: `https://www.${APEX_HOST}/:path*`,
              permanent: true,
            },
            ...PATH_REDIRECTS.map((rule) => ({
              source: rule.source,
              destination: rule.destination,
              permanent: true,
            })),
          ];
        },
      }
    : {}),
  outputFileTracingIncludes: {
    "/*": ["./content/posts/**/*"],
  },
  images: {
    ...(cloudflareExport ? { unoptimized: true } : {}),
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
