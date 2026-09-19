import { buildAdsTxt } from "@/lib/adsense";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(buildAdsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
