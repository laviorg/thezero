import { resolveAuthor } from "@/lib/authors";
import Link from "next/link";

export function AuthorBio({
  author,
  authorSlug,
}: {
  author: string;
  authorSlug?: string;
}) {
  const profile = resolveAuthor(authorSlug) ?? resolveAuthor(author);
  if (!profile) return null;

  return (
    <aside className="author-bio mt-12 border-t border-border pt-8">
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.avatarAlt}
          width={72}
          height={72}
          className="size-[4.5rem] shrink-0 rounded-full border border-border bg-surface"
        />
        <div className="min-w-0">
          <p className="font-display text-lg font-bold tracking-tight text-fg">
            {profile.name}
          </p>
          <p className="mt-0.5 text-sm text-muted">{profile.role}</p>
          <p className="mt-3 text-[0.95rem] leading-6 text-fg/90">
            {profile.slug === "mavi" ? (
              <>
                Mavi, editora assistente de IA do The Zero. Texto revisado por
                Nicholas Haruo Nishimura.{" "}
                <Link href="/politica-editorial#uso-de-ia" className="text-accent">
                  Como usamos IA
                </Link>
                .
              </>
            ) : (
              profile.shortBio
            )}
          </p>
          <p className="mt-3">
            <Link href={profile.href} className="text-sm text-accent">
              Ver perfil
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
