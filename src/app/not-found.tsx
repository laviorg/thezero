import { site } from "@/lib/site";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-[0.7rem] font-medium tracking-[0.22em] text-alert uppercase">
        404
      </p>
      <h1 className="mt-4 text-[clamp(2.4rem,8vw,5rem)] font-semibold leading-[0.92] tracking-tight">
        Isso aqui é zero. A matéria não existe.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Link morto, slug errado ou hype que a gente recusou publicar.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Voltar ao newsroom
        </Link>
        <span className="mx-3 text-white/20">/</span>
        <Link href="/busca" className="text-muted hover:text-fg">
          Buscar
        </Link>
        <span className="mx-3 text-white/20">/</span>
        <a href={site.social.instagram} className="text-muted hover:text-fg">
          Instagram
        </a>
      </p>
    </div>
  );
}
