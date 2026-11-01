import { PageShell } from "@/components/layout/page-shell";
import { getIndexablePosts } from "@/lib/posts";
import { AUTHOR_SLUGS, getAuthorBySlug } from "@/lib/authors";
import { buildPageMetadata } from "@/lib/metadata";
import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return AUTHOR_SLUGS.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return buildPageMetadata({
    title: `${author.name}, autor do The Zero`,
    description: author.bio,
    path: author.href,
    brand: "never",
    imagePath: "/opengraph-image",
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();
  const recent = getIndexablePosts()
    .filter((p) => p.authorSlug === author.slug && p.format !== "noticia")
    .slice(0, 8);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(author.href),
    mainEntity: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      url: absoluteUrl(author.href),
      description: author.bio,
      knowsAbout: author.beats,
      worksFor: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    },
  };
  return (
    <PageShell width="narrow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <p className="eyebrow page-kicker">
        <Link href="/autores">Autores</Link>
      </p>
      <h1 className="font-display mt-4 text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight text-balance">
        {author.name}
      </h1>
      <p className="mt-6 text-lg leading-8 text-fg/90">{author.role}</p>
      <div className="prose-zero mt-8 space-y-5 text-base leading-7">
        {author.longBio.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
        <h2 className="font-display mt-10 text-2xl font-bold">Cobertura</h2>
        <ul className="list-disc pl-6">
          {author.beats.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p>
          Método: <Link href="/como-testamos">Como testamos</Link> ·{" "}
          <Link href="/politica-editorial">Política editorial</Link> ·{" "}
          <Link href="/contato">Contato</Link>
        </p>
        {recent.length > 0 ? (
          <>
            <h2 className="font-display mt-10 text-2xl font-bold">Reviews e guias recentes</h2>
            <ul className="list-disc pl-6">
              {recent.map((p) => (
                <li key={p.slug}>
                  <Link href={`/noticia/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
