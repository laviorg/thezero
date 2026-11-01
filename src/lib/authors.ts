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
  longBio: string[];
  beats: string[];
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
    longBio: [
      "Nicholas Nishimura fundou o The Zero em São Paulo–SP para responder a pergunta que vem antes de qualquer compra de tecnologia no Brasil: vale o preço daqui, com imposto, garantia e loja brasileira na conta?",
      "Como editor, Nicholas escolhe as pautas, define o ângulo de cada texto, confere números, datas e citações na fonte primária e assina o que vai ao ar. Nenhuma matéria é publicada sem essa revisão. Quando há erro, a correção entra no próprio texto, com a data de atualização no topo.",
      "A cobertura gira em torno de hardware de PC (placas de vídeo, SSD, processadores), celulares, consoles e portáteis de jogo, e aplicativos do dia a dia. Reviews, comparativos e guias seguem o método descrito em Como testamos; notícias seguem a Política editorial.",
    ],
    beats: ["Placas de vídeo e hardware de PC", "Celulares e preço no Brasil", "Consoles e portáteis de jogo", "Aplicativos e segurança digital"],
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
