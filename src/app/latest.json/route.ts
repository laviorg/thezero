import { getNewsPosts } from "@/lib/posts";

export const dynamic = "force-static";

// Gerado a cada build: o rodapé carrega este JSON no cliente, então páginas
// estáticas antigas (contato, política editorial…) sempre mostram as últimas.
export function GET() {
  const posts = getNewsPosts()
    .slice(0, 4)
    .map((post) => ({ title: post.title, href: post.href }));
  return Response.json(
    { generatedAt: new Date().toISOString(), posts },
    { headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
  );
}
