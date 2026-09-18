import { Wordmark } from "@/components/brand/logo";
import { categoryList } from "@/lib/categories";
import { site } from "@/lib/site";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-bg">
      <div className="shell-frame grid gap-8 py-9 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex text-fg" aria-label="The Zero">
            <Wordmark className="h-8 w-auto" />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {site.bio} Newsroom em pt-BR. Se não dá pra testar, medir ou
            discordar, não entra.
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
              <Link href="/sobre" className="hover:text-accent">
                Sobre
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
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell-frame flex flex-col gap-2 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} The Zero · {site.domain}
          </p>
          <p>The Zero.</p>
        </div>
      </div>
    </footer>
  );
}
