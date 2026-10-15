export const AUTHOR_SLUGS = ["nicholas", "mavi"] as const;

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
    name: "Nicholas Haruo Nishimura",
    role: "Fundador e editor do The Zero",
    href: "/autores/nicholas",
    avatar: "/brand/authors/nicholas.svg",
    avatarAlt:
      "Iniciais NH em um círculo, placeholder do autor Nicholas Haruo Nishimura",
    shortBio:
      "Nicholas Haruo Nishimura, fundador e editor do The Zero. Ver perfil",
    bio: "Nicholas Haruo Nishimura é fundador e editor do The Zero, em São Paulo–SP. Assina todas as matérias do site e faz a revisão editorial de cada texto antes de publicar. Contato: hello@thezero.com.br.",
  },
  mavi: {
    slug: "mavi",
    name: "Mavi",
    role: "Assistente de IA do The Zero",
    href: "/autores/mavi",
    avatar: "/brand/authors/mavi.svg",
    avatarAlt:
      "Ícone geométrico com a letra M, avatar da editora assistente de IA Mavi",
    shortBio:
      "Mavi, assistente de IA do The Zero. Ajuda na pesquisa e no rascunho; o texto passa por revisão editorial humana.",
    bio: "Mavi é a assistente de IA do The Zero. Ajuda a pesquisar fontes oficiais, organizar fichas técnicas e preços com loja e data e rascunhar textos. Não testa produtos nem relata uso pessoal e não assina matérias: todas saem assinadas por Nicholas Haruo Nishimura, que revisa e edita cada texto antes de publicar. Erros: hello@thezero.com.br.",
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
