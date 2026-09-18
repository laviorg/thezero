# The Zero

Newsroom de tech do Brasil — IA, software, hardware, consoles e gadgets. Tom direto, irônico, sem hype de lançamento.

Site: [thezero.com.br](https://thezero.com.br) · Instagram [@hello.the.zero](https://www.instagram.com/hello.the.zero/) · YouTube [@TheZero_Media](https://www.youtube.com/@TheZero_Media)

Stack: **Next.js App Router**, TypeScript, Tailwind CSS v4, conteúdo MDX no repositório (sem CMS no v1).

## Rodar local

Requisitos: Node.js 20+.

```bash
npm install
cp .env.example .env.local   # opcional; o default já é https://thezero.com.br
npm run dev
```

Abre [http://127.0.0.1:43127](http://127.0.0.1:43127).

```bash
npm run build    # produção
npm run start    # serve o build na mesma porta
npm run lint
```

`NEXT_PUBLIC_SITE_URL` entra em canonical, Open Graph, sitemap, robots e JSON-LD. Em local podes apontar para `http://127.0.0.1:43127`.

## Páginas

| Rota | O quê |
| --- | --- |
| `/` | Newsroom (destaque + editorias) |
| `/ia` `/hardware` `/consoles` `/gadgets` `/apps` | Editorias |
| `/noticia/[slug]` | Matéria |
| `/sobre` | Manifesto e regras de voz |
| `/busca?q=` | Busca no título, trecho e corpo |
| `/rss.xml` `/sitemap.xml` `/robots.txt` | Syndication e SEO |

O footer tem um link **Loja** para `https://loja.thezero.com.br` (placeholder). Isto não é e-commerce.

## Como publicar uma matéria

1. Cria um ficheiro MDX em `content/posts/`. O nome do ficheiro é o slug: `meu-titulo-viral.mdx` → `/noticia/meu-titulo-viral`.
2. Frontmatter obrigatório:

```mdx
---
title: "Headline viral, opinião na primeira frase."
excerpt: "Uma linha que funciona sozinha no card e no OG."
category: ia
date: "2026-09-18"
featured: false
kicker: "IA · dock"
author: "The Zero"
cover: "https://www.apple.com/newsroom/images/.../foto.jpg"
coverCredit: "Apple / Divulgação"
---
```

`category` tem de ser um de: `ia` · `hardware` · `consoles` · `gadgets` · `apps`.

Opcionais: `updated`, `featured`, `kicker`, `author`, `draft` (`true` some em produção), **`cover`** (URL da foto de capa) e **`coverCredit`** (crédito sob a imagem, ex. `Apple / Divulgação`).

Sem `cover`, o card e a matéria seguem só com tipografia — o layout não quebra.

A capa entra na página da matéria e nos cards (`next/image`). No corpo, Markdown padrão:

```mdx
![iPhone 18 Pro nas quatro cores](https://www.apple.com/newsroom/images/.../lineup.jpg)

*Apple / Divulgação*
```

A imagem fica full-width, com cantos arredondados. A linha em itálico logo abaixo vira legenda/crédito **da fonte** (ex. Apple / Divulgação) — separado do selo da casa.

**Marca em toda foto publicada:** capa, imagens no corpo e assets OG gerados levam no canto inferior direito um selo translúcido com o wordmark **THE / ZERO** (O partido, SVGs em `public/brand`) e o handle `@hello.the.zero`. Componente: `src/components/brand/photo-watermark.tsx` (`WatermarkedPhoto` / `PhotoWatermark`). Não cobrir o assunto: o selo é pequeno, canto, `pointer-events-none`. Crédito da assessoria continua na figcaption, não no selo.

**Instagram:** cada post do [@hello.the.zero](https://www.instagram.com/hello.the.zero/) precisa de uma matéria MDX correspondente, **com fotos de verdade** (capa e/ou imagens no corpo). Texto solto não vale. Preferir fotos oficiais de imprensa (Apple Newsroom, etc.) e creditá-las na legenda.

3. No corpo, Markdown + MDX. Componentes de marca:

```mdx
<Verdict overrated="prompt mágico" underrated="brief de 8 linhas" />

<Rule>
Prompt é pedido. Contexto é brief.
</Rule>
```

4. Grava. O `npm run dev` relê a pasta. Não há painel admin.

Arquitetura: `content/posts` → `src/lib/posts.ts` (gray-matter) → páginas em `src/app`. Componentes de UI em `src/components/ui` (padrão shadcn). Tokens da marca em `src/app/globals.css`.

## SEO

- `metadata` + `metadataBase` no layout
- Open Graph / Twitter por página; imagem OG gerada (`opengraph-image`)
- `sitemap.ts`, `robots.ts`, RSS em `/rss.xml`
- JSON-LD `NewsMediaOrganization` + `WebSite` no layout; `NewsArticle` em cada matéria

## Deploy (Vercel + Origin) para thezero.com.br

1. Cria o repositório Origin com o nome **thezero** (Create repo no fluxo New Project, ou `origin repo create thezero` na tua máquina). Liga o mirror GitHub se quiseres CI extra.
2. Importa o repo na [Vercel](https://vercel.com): framework Next.js, comando `npm run build`, output default.
3. Environment variable: `NEXT_PUBLIC_SITE_URL=https://thezero.com.br`.
4. Domínio: adiciona `thezero.com.br` e `www.thezero.com.br` na Vercel. No DNS (Registro.br / Cloudflare):
   - `A` / `CNAME` conforme o painel da Vercel (geralmente CNAME `www` → `cname.vercel-dns.com` e apex com os IPs que a Vercel mostrar).
   - Redirect `www` → apex, ou o contrário — escolhe um canónico e mantém.
5. SSL a Vercel emite sozinha. Confirma `https://thezero.com.br/sitemap.xml` e o Rich Results da Google no JSON-LD da home e de uma matéria.
6. Cada `git push` na branch de produção dispara o deploy. Preview deployments nas outras branches.

Loja (quando existir) fica em `https://loja.thezero.com.br`, fora desta app.

## Marca

Wordmark oficial **THE / ZERO** (O partido ao meio em duas semicircunferências):

- Header, rodapé e Sobre: SVG em `src/components/brand/logo.tsx` (`currentColor`, inverte no dark)
- Ficheiros: `public/brand/logo.svg` (currentColor), `logo-on-light.svg`, `logo-on-dark.svg`, `mark.svg` (só o O)
- Favicon: o O partido, adaptado a 32px
- OG default: wordmark centrado no fundo `#0A0A0B`, com selo de marca (wordmark + `@hello.the.zero`) no canto
- Fotos de matéria: o mesmo selo no canto inferior direito; ver secção **Como publicar uma matéria**

Não usar quadrado preto sólido como logo.

## Paleta

| Token | Hex |
| --- | --- |
| Fundo | `#0A0A0B` |
| Superfície | `#141416` |
| Texto | `#F4F4F5` |
| Acento | `#7CFFB2` |
| Alerta | `#FF6B6B` |
| Muted | `#8B8B93` |

The Zero.
