import { getIndexablePosts } from "@/lib/posts";
import { specTags } from "@/lib/spec-tags";

export const dynamic = "force-static";

/** Índice estático da paleta Ctrl+K, gerado a cada build. */
export function GET() {
  const posts = getIndexablePosts().map((post) => ({
    t: post.title,
    h: post.href,
    c: post.subcategoryLabel ?? post.categoryLabel,
    s: specTags(`${post.title}\n${post.content}`),
    v: post.veredito?.decisao ?? null,
  }));
  return Response.json({ generatedAt: new Date().toISOString(), posts });
}
