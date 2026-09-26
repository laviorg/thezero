import { ArticleCard } from "@/components/news/article-card";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/news/json-ld";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { getPostsByFormat } from "@/lib/posts";
import { HOME_CRUMB_LABEL } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { groupTutorialPosts } from "@/lib/tutorial-groups";
import { TUTORIALS_HUB_CORE, tutorialsPageTitle } from "@/lib/titles";
import type { Metadata } from "next";

const DESCRIPTION =
  "Passo a passo em pt-BR: requisito, ordem e o que fazer quando a tela não bate com o texto. iPhone, Android, jogos e serviços.";

export function generateMetadata(): Metadata {
  const hasPosts = getPostsByFormat("tutorial").length > 0;
  const title = tutorialsPageTitle();

  return buildPageMetadata({
    title: TUTORIALS_HUB_CORE,
    description: DESCRIPTION,
    path: "/tutoriais",
    brand: "always",
    imagePath: "/opengraph-image",
    imageAlt: title,
    noIndex: !hasPosts,
  });
}

export default function TutoriaisPage() {
  const posts = getPostsByFormat("tutorial");
  const groups = groupTutorialPosts(posts);
  const groupedSlugs = new Set(
    groups.flatMap((group) => group.posts.map((post) => post.slug)),
  );
  const rest = posts.filter((post) => !groupedSlugs.has(post.slug));
  const pageUrl = absoluteUrl("/tutoriais");

  return (
    <PageShell>
      <CollectionPageJsonLd
        name="Tutoriais"
        description={DESCRIPTION}
        url={pageUrl}
        items={posts.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: HOME_CRUMB_LABEL, url: site.url },
          { name: "Tutoriais", url: pageUrl },
        ]}
      />

      <header className="newsroom-masthead max-w-4xl border-b border-border border-l border-l-accent/40 pb-5 pl-4 sm:pl-5">
        <Breadcrumbs
          items={[
            { href: "/", label: HOME_CRUMB_LABEL },
            { label: "Tutoriais" },
          ]}
        />
        <p className="eyebrow page-kicker">Passo a passo</p>
        <h1 className="page-title mt-2 font-extrabold text-balance">
          Tutoriais
        </h1>
        <p className="lede mt-3 text-pretty">{DESCRIPTION}</p>
        <nav aria-label="Plataformas" className="mt-5 flex flex-wrap gap-2">
          {groups.map(({ group }) => (
            <a key={group.slug} href={`#${group.slug}`} className="chip-link">
              {group.label}
            </a>
          ))}
        </nav>
        <p className="mt-4 text-[0.72rem] tracking-[0.14em] text-muted uppercase">
          {posts.length === 1 ? "1 matéria" : `${posts.length} matérias`}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-8 max-w-xl text-muted">
          Ainda não há tutorial nesta página.
        </p>
      ) : (
        <>
          {groups.map(({ group, posts: items }) => (
            <section
              key={group.slug}
              id={group.slug}
              className="mt-10 scroll-mt-24"
              aria-labelledby={`tutorial-${group.slug}`}
            >
              <SectionHeading
                id={`tutorial-${group.slug}`}
                title={group.label}
              />
              <p className="mt-3 max-w-2xl text-sm text-muted">
                {group.description}
              </p>
              <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    layout="standard"
                    headingLevel="h3"
                  />
                ))}
              </div>
            </section>
          ))}
          {rest.length > 0 ? (
            <section className="mt-10" aria-labelledby="tutoriais-resto">
              <SectionHeading id="tutoriais-resto" title="Também no arquivo" />
              <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    layout="standard"
                    headingLevel="h3"
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
