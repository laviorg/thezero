import Link from "next/link";
import { HUB_INTROS } from "@/lib/hub-intros";
import { getPostBySlug } from "@/lib/posts";

/** Texto de introdução da editoria/subeditoria/linha de review + links para guias (só posts indexáveis). */
export function HubIntro({ path }: { path: string }) {
  const intro = HUB_INTROS[path];
  if (!intro) return null;
  const guides = intro.guides
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p && !p.noindex));
  return (
    <section className="mt-6 max-w-3xl space-y-3 text-pretty" aria-label="Sobre esta seção">
      {intro.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {guides.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link href={`/noticia/${g.slug}`} className="underline underline-offset-2">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
