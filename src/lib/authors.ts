export const AUTHOR_SLUGS = ["nicholas"] as const;

export type AuthorSlug = (typeof AUTHOR_SLUGS)[number];

export function isAuthorSlug(value: string): value is AuthorSlug {
  return (AUTHOR_SLUGS as readonly string[]).includes(value);
}

export type AuthorProfile = {
  slug: AuthorSlug;
  name: string;
  role: string;
  href: string;
  avatar: string;
  avatarAlt: string;
  shortBio: string;
  bio: string;
};

export const AUTHORS: Record<AuthorSlug, AuthorProfile> = {
  nicholas: {
    slug: "nicholas",
    name: "Nicholas Nishimura",
    role: "Fundador e editor do The Zero",
    href: "/autores/nicholas",
    avatar: "/brand/authors/nicholas.svg",
    avatarAlt:
      "Iniciais NH em um círculo, placeholder do autor Nicholas Nishimura",
    shortBio:
      "Nicholas Nishimura, fundador e editor do The Zero. Ver perfil",
    bio: "Nicholas Nishimura é fundador e editor do The Zero, em São Paulo–SP. Assina todas as matérias do site e faz a revisão editorial de cada texto antes de publicar. Contato: hello@thezero.com.br.",
  },
};

export function getAuthorBySlug(slug?: string): AuthorProfile | undefined {
  if (!slug || !isAuthorSlug(slug)) return undefined;
  return AUTHORS[slug];
}

export function getAuthorByName(name: string): AuthorProfile | undefined {
  const trimmed = name.trim();
  return Object.values(AUTHORS).find((author) => author.name === trimmed);
}

export function resolveAuthor(slugOrName?: string): AuthorProfile | undefined {
  if (!slugOrName) return undefined;
  return getAuthorBySlug(slugOrName) ?? getAuthorByName(slugOrName);
}
