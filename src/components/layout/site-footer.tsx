import { SplitOMark, Wordmark } from "@/components/brand/logo";
import { FooterCookiesLink } from "@/components/consent/footer-cookies-link";
import { categoryList } from "@/lib/categories";
import { getNewsPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import Link from "next/link";

export function SiteFooter() {
  const latestPosts = getNewsPosts().slice(0, 4);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-bg">
      <SplitOMark
        className="pointer-events-none absolute -top-16 -right-16 size-72 text-fg/[0.045]"
        aria-hidden
      />
      <div className="shell-frame relative grid gap-8 py-10 md:grid-cols-12 lg:gap-10 lg:py-12">
        <div className="md:col-span-5">
          <Link
            href="/"
            className="inline-flex text-fg transition-colors hover:text-accent"
            aria-label="The Zero"
          >
            <Wordmark className="h-8 w-auto" />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {site.bio} Newsroom em pt-BR. Se não dá pra testar, medir ou
            discordar, não entra.
          </p>
          <p className="mt-4 text-[0.7rem] tracking-[0.14em] text-muted/80 uppercase">
            Brasil
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Editorias
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {categoryList.map((category) => (
              <li key={category.slug}>
                <Link
                  href={category.href}
                  className="text-fg/90 transition-colors hover:text-accent"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Casa
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link href="/" className="hover:text-accent">
                Newsroom
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:text-accent">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-accent">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="hover:text-accent">
                Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos" className="hover:text-accent">
                Termos
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-accent">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/vale-a-pena" className="hover:text-accent">
                Vale a pena?
              </Link>
            </li>
            <li>
              <Link href="/tutoriais" className="hover:text-accent">
                Tutoriais
              </Link>
            </li>
            <li>
              <Link href="/como-testamos" className="hover:text-accent">
                Como testamos
              </Link>
            </li>
            <li>
              <Link href="/politica-editorial" className="hover:text-accent">
                Política editorial
              </Link>
            </li>
            <li>
              <Link href="/busca" className="hover:text-accent">
                Busca
              </Link>
            </li>
            <li>
              <a href="/rss.xml" className="hover:text-accent">
                RSS
              </a>
            </li>
            <li>
              <a
                href={site.storeUrl}
                className="hover:text-accent"
                rel="noopener noreferrer"
              >
                Loja
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Redes
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                Instagram {site.social.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={site.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                YouTube {site.social.youtubeHandle}
              </a>
            </li>
            <li>
              <a
                href={site.social.threads}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                Threads {site.social.threadsHandle}
              </a>
            </li>
            <li>
              <a
                href={site.social.x}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                X {site.social.xHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      {latestPosts.length > 0 ? (
        <nav
          aria-label="Últimas matérias"
          className="shell-frame relative border-t border-border py-6"
        >
          <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Últimas
          </p>
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {latestPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={post.href}
                  className="line-clamp-3 text-sm leading-snug text-fg/90 transition-colors hover:text-accent"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <div className="border-t border-border">
        <div className="shell-frame flex flex-col gap-3 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} The Zero · {site.domain}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/como-testamos" className="hover:text-accent">
              Como testamos
            </Link>
            <Link href="/politica-editorial" className="hover:text-accent">
              Política editorial
            </Link>
            <Link href="/privacidade" className="hover:text-accent">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-accent">
              Termos
            </Link>
            <FooterCookiesLink />
            <a href={`mailto:${site.email}`} className="hover:text-accent">
              {site.email}
            </a>
            <a
              href="#conteudo"
              className="inline-flex items-center gap-1.5 tracking-wide hover:text-accent"
            >
              Voltar ao topo
              <span aria-hidden>↑</span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
