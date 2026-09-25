# The Zero

Newsroom de tech do Brasil — tecnologia, IA, computadores, dispositivos, aplicativos e jogos. Tom direto, irônico, sem hype de lançamento.

Site: [www.thezero.com.br](https://www.thezero.com.br) · Instagram [@hello.the.zero](https://www.instagram.com/hello.the.zero/) · YouTube [@TheZero_Media](https://www.youtube.com/@TheZero_Media) · Threads [@hello.the.zero](https://www.threads.com/@hello.the.zero) · X [@hello_the_zero](https://x.com/hello_the_zero)

Stack: **Next.js App Router**, TypeScript, Tailwind CSS v4, conteúdo MDX no repositório (sem CMS no v1).

## Rodar local

Requisitos: Node.js 20+.

```bash
npm install
cp .env.example .env.local   # opcional; o default já é https://www.thezero.com.br
npm run dev
```

Abre [http://127.0.0.1:43127](http://127.0.0.1:43127).

```bash
npm run build    # produção
npm run start    # serve o build na mesma porta
npm run lint
```

`NEXT_PUBLIC_SITE_URL` entra em canonical, Open Graph, sitemap, robots e JSON-LD. Em produção o host público é `https://www.thezero.com.br` — `https://thezero.com.br` é reescrito para www, porque o apex só redireciona. Em local podes apontar para `http://127.0.0.1:43127`.

`NEXT_PUBLIC_ADSENSE_PUB_ID` é opcional e **só** se preenche depois da aprovação no AdSense (`pub-` + 16 dígitos). Sem ela o site não carrega script de anúncio e o `/ads.txt` não declara vendedor Google. Checklist: [`docs/ADSENSE.md`](docs/ADSENSE.md).

`NEXT_PUBLIC_GA_MEASUREMENT_ID` é o measurement ID do GA4. Em **Production** no Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-3H0Z0NNQ1J` (conta hello.shimenawa, propriedade The Zero, stream www.thezero.com.br). Sem ela — o caso de Preview e local — o site não carrega `gtag`. O script só entra depois do aceite de cookies de publicidade / estatística. Checklist: [`docs/ANALYTICS.md`](docs/ANALYTICS.md).

## Páginas

| Rota | O quê |
| --- | --- |
| `/` | Newsroom (destaque + editorias + reviews, se houver) |
| `/reviews` | Análises, guias e comparativos (não é editoria) |
| `/tecnologia` `/ia` `/computadores` `/dispositivos` `/aplicativos` `/jogos` | Editorias |
| `/[editoria]/[subcategoria]` | Assuntos ativos dentro de uma editoria |
| `/noticia/[slug]` | Matéria |
| `/sobre` | Manifesto, quem publica e regras de voz |
| `/contato` | E-mail da redação e canais |
| `/privacidade` | Política de Privacidade (LGPD + cookies / Analytics / AdSense) |
| `/termos` | Termos de uso |
| `/busca?q=` | Busca no título, trecho e corpo |
| `/ads.txt` | Vendedores autorizados (vazio de Google até existir publisher ID) |
| `/rss.xml` `/sitemap.xml` `/news-sitemap.xml` `/robots.txt` | Syndication e SEO |

O footer tem um link **Loja** para `https://loja.thezero.com.br` (placeholder). Isto não é e-commerce.

## Como publicar uma matéria

1. Cria um ficheiro MDX em `content/posts/`. O nome do ficheiro é o slug: `meu-titulo-viral.mdx` → `/noticia/meu-titulo-viral`.
2. Frontmatter obrigatório:

```mdx
---
title: "Headline viral, opinião na primeira frase."
seoTitle: "Entidade: tese curta para a SERP"
excerpt: "Uma linha que funciona sozinha no card e no OG."
category: ia
subcategory: ferramentas
date: "2026-09-18"
featured: false
featuredPriority: 1
kicker: "IA · dock"
author: "The Zero"
cover: "https://www.apple.com/newsroom/images/.../foto.jpg"
coverAlt: "iPhone 18 Pro em quatro cores, visto pela traseira"
coverCredit: "Apple / Divulgação"
---
```

`title` é a manchete (H1, cards, RSS, Google News). `seoTitle` é opcional: entra no `<title>` e no Open Graph só quando a manchete é longa demais para a SERP. A marca ` · The Zero` é sufixo do código, não se escreve no frontmatter. Regras em [`docs/SEO_TITLES.md`](docs/SEO_TITLES.md). Checklist de indexação, sitemap e Search Console: [`docs/SEO.md`](docs/SEO.md).

`category` tem de ser um de: `tecnologia` · `ia` · `computadores` · `dispositivos` · `aplicativos` · `jogos`.

`format` é opcional: `noticia` (padrão), `review`, `guia` ou `comparativo`. Não vira item do menu. Review, guia e comparativo aparecem em `/reviews` e na editoria do assunto; ficam fora do destaque, das Últimas, do RSS e do news sitemap.

`subcategory` é opcional, mas recomendada quando houver encaixe. Ela precisa pertencer à editoria escolhida; a lista e as regras de fronteira ficam em [`docs/TAXONOMY.md`](docs/TAXONOMY.md). Subcategorias com matérias ganham hub próprio em `/[editoria]/[subcategoria]`.

Opcionais: `seoTitle` (recorte do `<title>` quando a manchete não cabe na SERP), `updated`, `featured`, `featuredPriority` (desempata vários destaques; maior vence), `kicker`, `author`, `draft` (`true` some em produção), **`cover`** (URL da foto de capa), **`coverAlt`** (descrição objetiva da imagem) e **`coverCredit`** (crédito sob a imagem, ex. `Apple / Divulgação`).

Sem `cover`, o card e a matéria seguem só com tipografia — o layout não quebra.

Evergreen (`review`, `guia`, `comparativo`) sem foto ganha cartaz em `public/covers/reviews/[slug].webp` (1200×675). `npm run covers` desenha o arquivo com a paleta do cartaz OG (`next/og` + sharp) e grava `cover` e `coverAlt`. Capa que já é foto não é trocada. O bloco “Leia também” sai de `scripts/link-evergreen.ts` (`npm run link-evergreen`) e só aponta slug que existe.

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

- Regras de `<title>` / OG / H1 em [`docs/SEO_TITLES.md`](docs/SEO_TITLES.md)
- `metadata` + `metadataBase` no layout
- Open Graph / Twitter por página; imagem OG gerada (`opengraph-image`)
- `sitemap.ts`, Google News sitemap em `/news-sitemap.xml`, `robots.ts` e RSS em `/rss.xml`
- JSON-LD `NewsMediaOrganization` + `WebSite` no layout; `NewsArticle` em cada matéria

## Deploy (Vercel + Origin) para thezero.com.br

1. Cria o repositório Origin com o nome **thezero** (Create repo no fluxo New Project, ou `origin repo create thezero` na tua máquina). Liga o mirror GitHub se quiseres CI extra.
2. Importa o repo na [Vercel](https://vercel.com): framework Next.js, comando `npm run build`, output default.
3. Environment variables: `NEXT_PUBLIC_SITE_URL=https://www.thezero.com.br`. Em Production, `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-3H0Z0NNQ1J` (ver [`docs/ANALYTICS.md`](docs/ANALYTICS.md)). Depois da aprovação no AdSense, `NEXT_PUBLIC_ADSENSE_PUB_ID=pub-…` (ver [`docs/ADSENSE.md`](docs/ADSENSE.md)).
4. Domínio: adiciona `thezero.com.br` e `www.thezero.com.br` na Vercel. No DNS (Registro.br / Cloudflare):
   - `A` / `CNAME` conforme o painel da Vercel (geralmente CNAME `www` → `cname.vercel-dns.com` e apex com os IPs que a Vercel mostrar).
   - Redirect permanente do apex para `https://www.thezero.com.br`. O código também faz esse 308 se o pedido chegar na app. Não inverter.
5. SSL a Vercel emite sozinha. Confirma `https://www.thezero.com.br/sitemap.xml` e `https://www.thezero.com.br/news-sitemap.xml` (os dois têm de responder 200, sem redirect) e o Rich Results da Google no JSON-LD da home e de uma matéria.
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

## Tipografia

Open fonts via `next/font` (self-hosted no build — sem faces proprietárias tipo Tiempos / GT America). Emparelhamento da matéria:

| Papel | Face | Uso |
| --- | --- | --- |
| Display | **Geist** ExtraBold (Vercel) | Headline, headings, drop cap |
| Corpo | **Source Serif 4** (Adobe) | Coluna de leitura |
| UI / meta | **Source Sans 3** (Adobe) | Kickers, byline, créditos, nav |
| Código | **Geist Mono** | Blocos e inline code |

Geist no display (não Fraunces/serif) é o grotesk pesado e apertado das headlines; Source Serif fica só no texto corrido. Definição: `src/lib/fonts.ts`.

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
