# SEO — The Zero

Checklist do que o site faz para a busca do Google e o que continua manual
no Search Console / Publisher Center. Títulos e a voz da SERP estão em
[`SEO_TITLES.md`](./SEO_TITLES.md). Editorias e redirects antigos estão em
[`TAXONOMY.md`](./TAXONOMY.md).

Referências usadas nesta revisão (documentação vigente em setembro de 2026):

- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) — atualizado em 2026-09-08. Google lê `author` (com `name` e `url`), `datePublished`, `dateModified`, `headline` e `image`. Não há propriedade obrigatória; o que estiver errado é pior do que omitir.
- [Author markup](https://developers.google.com/search/docs/appearance/structured-data/article#author-bp) — organização aponta para a home; pessoa só ganha URL se existir página dela.
- [BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — o `name` é o texto que o leitor vê.
- [News sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap) — só matérias das últimas 48 horas; `news:title` é a manchete da página; `news:language` é `pt`.
- [Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) — `lastmod` só entra se for a data real da página. Google ignora `changefreq` e `priority`.
- [Title links](https://developers.google.com/search/docs/appearance/title-link) — implementado em `src/lib/titles.ts`.
- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) — hreflang é para versões equivalentes. O site tem uma só.
- Caixa de pesquisa nos sitelinks (`SearchAction`) foi descontinuada. Não está no JSON-LD de propósito.

Não há meta de ranking, posição ou “score”. Isso aqui é a parte técnica que a
redação controla. O resto é conteúdo e o que o Google decide mostrar.

## O que cada URL indexável entrega

| Superfície | Onde |
| --- | --- |
| `<title>`, description, canonical, `pt-BR` + `x-default`, RSS, `max-image-preview:large` | `src/lib/metadata.ts` |
| H1 da matéria = `title` do MDX; document title = `seoTitle` quando a manchete não cabe | `src/lib/titles.ts`, `docs/SEO_TITLES.md` |
| `NewsArticle` + `BreadcrumbList` | `src/components/news/json-ld.tsx`, matéria |
| `NewsMediaOrganization` + `WebSite` | layout |
| `CollectionPage` + trilha nos hubs | `src/app/[category]` |
| Sitemap com imagem da capa e do cartaz OG | `src/app/sitemap.ts` |
| News sitemap (48 h) com a mesma imagem | `src/app/news-sitemap.xml/route.ts` |
| `robots.txt` aponta os dois sitemaps | `src/app/robots.ts` |
| RSS | `src/app/rss.xml/route.ts` |
| Redirect 301 das editorias antigas e de `www` → apex | `next.config.ts` |
| Hub sem matéria fica `noindex` e fora do sitemap | editoria vazia |

`/busca` e o 404 são `noindex, follow`. O 404 não declara canonical: a URL
pedida não é `/404`, e apontar tudo para um caminho que não existe não ajuda
o Google. A busca canônica continua `/busca`, sem a query.

## Structured data

`NewsArticle` leva:

- `headline` = H1 (a manchete editorial, não o recorte da SERP);
- `datePublished` e `dateModified` em ISO 8601 com fuso `-03:00` (`toIsoDate` usa 08:00 quando o MDX só tem o dia);
- `author` com `name` e, no caso da redação, `url` da home;
- `image`: a capa (com largura e altura reais se o arquivo está em `public/`) e, em seguida, o cartaz `/noticia/[slug]/opengraph-image` (1200×630, sempre neste domínio);
- `isAccessibleForFree: true` — não há paywall.

A capa entra primeiro porque é a foto da matéria. O cartaz é a rede de
segurança: muita capa vem de outro host (Apple, por exemplo) e o Google pode
não conseguir buscá-la. Não geramos recortes 16:9, 4:3 e 1:1 que não existem
como arquivo. Inventar URL de crop seria pior do que entregar a foto e o
cartaz que o site realmente serve.

A trilha visível começa em “Newsroom”. O `BreadcrumbList` usa o mesmo nome.
Antes dizia “The Zero” no JSON-LD e “Newsroom” na página.

`author.url` da casa é `https://thezero.com.br`. O byline continua linkando
`/sobre`, que é a página sobre a redação. Um autor pessoa, se aparecer,
não ganha URL até existir perfil — `/sobre` não é a bio dessa pessoa.

JSON-LD escapa `<` para não quebrar o `<script>`.

## Sitemap e notícias

- Home: `lastmod` = matéria mais recentemente atualizada, porque a home muda quando o arquivo muda.
- Editoria e subeditoria: `lastmod` = `updated` mais recente daquela coleção. Hub sem matéria não entra.
- Matéria: `lastmod` = `updated` (ou `date`, se nunca foi atualizada).
- Sobre, contato, privacidade e termos: sem `lastmod`. A data da última matéria não é a data dessas páginas, e um `lastmod` mentiroso faz o Google desconfiar do arquivo inteiro.
- `changefreq` e `priority` saíram. O Google ignora os dois.
- Cada matéria lista a capa e o cartaz OG em `image:image`.
- O news sitemap só tem matéria publicada nas últimas 48 horas, com `news:name` = `The Zero`, `news:language` = `pt`, `news:publication_date` = data original (não a data em que entrou no sitemap) e `news:title` = H1. Sem `news:keywords`.
- O news sitemap revalida a cada 5 minutos para a matéria cair da janela de 48 h mesmo sem um deploy novo. Matéria nova continua dependendo de deploy, porque o MDX vai no build.

hreflang `pt-BR` e `x-default` apontam para a mesma URL em todas as páginas
indexáveis e no sitemap. É um site só, em português do Brasil. Não há versão
em outra língua. O par existe para o idioma ficar explícito e consistente;
não descreve um cluster internacional. Se um dia houver `/en`, cada URL tem
de listar a outra e a si mesma. Até lá, não inventar locale.

## Página

- Hubs: H1 curto (`IA`, `Celulares`), `<title>` com o ângulo de `seoTitle`, texto único da editoria, links para subeditorias com matéria e para as outras editorias.
- Matéria: canonical da própria URL, Open Graph `article` com data, Twitter com `alt`, capa com `alt` (`coverAlt` ou, na falta, a manchete), autor e `<time datetime>`.
- No fim do texto, “Nesta editoria” linka a subeditoria e a editoria com o rótulo visível e a descrição que já existe no hub. O trilho lateral continua com matérias relacionadas (mesma subeditoria, depois a editoria, depois o resto do arquivo).
- Capas que já tinham `alt` no corpo e não tinham `coverAlt` no frontmatter passaram a repetir essa mesma frase no hero. Não foi escrita descrição nova.

## Core Web Vitals (só o que mexe com busca)

- `next/font` com `display: swap` e fallback métrico (padrão do Next). Geist Mono não entra no preload: é código, quase nunca é o LCP.
- Hero e cards reservam caixa (`aspect-square` / `aspect-video`) e a imagem principal usa `priority`.
- Imagem dentro do MDX, quando o arquivo está em `public/`, usa a largura e a altura de verdade. Remota continua com a reserva 1600×900 até alguém medir o arquivo.
- Scripts de anúncio e Analytics só depois do aceite de cookies. Não competem com a primeira pintura.

## Redirects

| De | Para |
| --- | --- |
| `www.thezero.com.br` | `https://thezero.com.br` |
| `/hardware` | `/computadores` |
| `/gadgets` | `/dispositivos` |
| `/apps` | `/aplicativos` |
| `/games` | `/jogos` |
| `/consoles` | `/jogos/consoles` |

Todos permanentes. Query string é preservada. Não há redirect de matéria:
o slug não mudou. Não criar redirect para texto apagado sem uma URL antiga
conhecida.

`robots.txt` libera a raiz, inclusive `Mediapartners-Google`. `/busca` não
está em `Disallow`: a página precisa ser rastreada para o `noindex` valer.
A diretiva `Host` é do Yandex; o Google ignora.

## O que o dono faz no Search Console

Isto não entra no repositório.

1. Confirmar a propriedade `https://thezero.com.br` (prefixo de URL, não só o domínio solto se os dois existirem). Preferir a versão sem `www`.
2. Em Configurações → robots.txt e em Sitemaps, enviar:
   - `https://thezero.com.br/sitemap.xml`
   - `https://thezero.com.br/news-sitemap.xml`
3. Inspeção de URL na home, numa editoria (`/ia`) e numa matéria nova. Pedir indexação das que estiverem “URL is not on Google” e o HTML renderizado mostrar título, canonical e a capa.
4. Relatório de breadcrumbs e de artigos: o esperado é zero erro crítico. Aviso de headline longa pode aparecer. A manchete editorial pode passar de 110 caracteres; o `<title>` é que é cortado no código. Não encurtar o H1 só para calar o aviso se a frase for a da casa. O Publisher Center ainda recomenda manchete de até 110 caracteres para o Google Notícias — isso é decisão de redação, matéria a matéria, via `title` / `seoTitle`.
5. Confirmar que `NEXT_PUBLIC_SITE_URL` em Production é `https://thezero.com.br`, sem barra no fim e sem `www`. Canonical, sitemap e JSON-LD saem daí.
6. No [Publisher Center](https://publishercenter.google.com/), se a publicação for criada, o nome tem de ser exatamente `The Zero` — é o `news:name` do sitemap. Idioma `pt`. Site `https://thezero.com.br`.
7. Não marcar a caixa de sitelinks search box: o Google não usa mais `SearchAction`.
8. Performance: filtrar Brasil e as queries das editorias (tecnologia, IA, computadores, dispositivos, aplicativos, jogos, mais o nome do produto da matéria). Isso mostra impressão e clique reais. Não dá para prometer posição.
9. Quando uma editoria antiga ainda aparecer com URL morta, usar a inspeção. Os 301 acima cobrem os slugs de editoria que existiram. Slug de matéria apagada só ganha redirect se houver URL indexada conhecida.
10. Core Web Vitals no relatório de experiência: o lab daqui não substitui o campo. Se LCP estourar, o candidato usual é a capa do destaque.

## Como publicar sem quebrar isso

1. `title` com a tese e a entidade. `seoTitle` só se o document title cortar nome, preço ou a marca. Ver [`SEO_TITLES.md`](./SEO_TITLES.md).
2. `excerpt` que funciona sozinho na description e no card.
3. `category` / `subcategory` válidas. A subeditoria só vira URL quando tem pelo menos uma matéria.
4. `date` no dia de publicação. `updated` só quando o texto mudou de verdade — não para “refrescar” a SERP.
5. `cover` + `coverAlt` descrevendo a imagem, não repetindo a manchete se der para ser mais específico. `coverCredit` quando a foto não é nossa.
6. O build falha se dois document titles indexáveis coincidirem ou passarem de 70 caracteres (`src/lib/title-audit.ts`, chamado pelo sitemap).
