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
    href: "/autores#nicholas",
    avatar: "/brand/authors/nicholas.svg",
    avatarAlt:
      "Iniciais NH em um círculo, placeholder do autor Nicholas Haruo Nishimura",
    shortBio:
      "Nicholas Haruo Nishimura, fundador e editor do The Zero. Ver perfil",
    bio: "Nicholas Haruo Nishimura é fundador e editor do The Zero, em São Paulo–SP. Assina as matérias com teste próprio ou experiência em primeira pessoa e revisa as matérias da Mavi antes de publicar. Contato: hello@thezero.com.br.",
  },
  mavi: {
    slug: "mavi",
    name: "Mavi",
    role: "Editora assistente de IA do The Zero, com revisão humana",
    href: "/autores#mavi",
    avatar: "/brand/authors/mavi.svg",
    avatarAlt:
      "Ícone geométrico com a letra M, avatar da editora assistente de IA Mavi",
    shortBio:
      "Mavi, editora assistente de IA do The Zero. Texto revisado por Nicholas Haruo Nishimura. Como usamos IA",
    bio: "Mavi é a editora assistente de IA do The Zero. Pesquisa fontes oficiais, organiza fichas técnicas e preços com loja e data, e redige guias e comparativos. Não testa produtos nem relata uso pessoal: quando uma matéria traz teste ou experiência própria, ela é assinada por pessoa. Toda matéria da Mavi passa por revisão humana do editor Nicholas Haruo Nishimura antes de publicar. Erros: hello@thezero.com.br.",
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
