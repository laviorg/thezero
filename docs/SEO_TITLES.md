# Títulos de página — The Zero

Regras editoriais e técnicas para o elemento `<title>`, Open Graph, Twitter e
a manchete visível (H1). A taxonomia de editorias continua em
[`TAXONOMY.md`](./TAXONOMY.md); este documento cobre só o **nome da página**
que o Google, o Discord e a aba do navegador mostram.

Decisão registrada em 19 de setembro de 2026, a partir do guia de
[title links da Google](https://developers.google.com/search/docs/appearance/title-link),
do hábito de veículos BR (Tecnoblog, Canaltech, Olhar Digital) e da voz do
próprio The Zero: direta, opinativa, sem hype vazio.

Implementação: `src/lib/titles.ts` (composição) → `src/lib/metadata.ts`
(`buildPageMetadata`) → `generateMetadata` de cada rota. A unicidade é
conferida no build por `src/lib/title-audit.ts`, chamado a partir do sitemap.

## O que o Google realmente usa

O link azul da SERP **não é** a tag `<title>` copiada à força. A Google lê,
entre outras coisas:

1. o elemento `<title>`;
2. a manchete visível (H1 / texto maior da página);
3. `og:title`;
4. `headline` no JSON-LD de `NewsArticle`;
5. âncoras internas e o nome do site.

Se esses sinais discordam demais, a Google reescreve. Por isso o The Zero
aceita H1 e `<title>` **diferentes**, mas só quando a diferença é de
**comprimento ou ênfase**, nunca de tese. Mentir no title tag (“guia completo
2026”) com H1 opinativo é o caminho mais curto para o rewrite.

## Comprimento

| Régua | Uso |
| --- | --- |
| ~50–60 caracteres | Alvo de redação. Cabe no desktop (~580–600 px) e ainda deixa a marca. |
| 70 caracteres | Teto rígido no código (`TITLE_HARD_MAX`). Acima disso `fitTitle` corta. |
| Pixel, não char | “iPhone” e “W” comem mais px que “l”. 60 chars em pt-BR já é apertado. |

Regras de corte (`fitTitle`):

- nunca no meio da palavra;
- prefere a primeira frase se ela já nomeia a entidade e cabe no teto;
- depois corta em `—`, `:`, `,` ou espaço;
- **não** coloca `...` no fim — a SERP adiciona a reticência dela;
- ponto final no último caractere é lixo visual na SERP e é removido na
  composição (o H1 pode manter o ponto).

Não encurtar um title bom só para “fazer 52 caracteres”. Encurtar quando o
fim seria cortado no meio de um nome próprio, de um preço ou de “The Zero”.

## Marca: quando vai `| The Zero`, `· The Zero` ou some

Separador canónico: **` · `** (middle dot). Já era o template do layout, já
aparece nos kickers, e diferencia a casa dos portais que usam `|`. Não
misturar `|`, `-` e `·` no mesmo title.

| Página | Marca | Porquê |
| --- | --- | --- |
| Home | **dentro** do title, sem sufixo extra | Google pede marca + o que o site é. `The Zero · The Zero` é o erro a evitar. |
| Editoria / subeditoria / busca / 404 | sempre ` · The Zero` | O núcleo é curto; a marca cabe e desambigua “IA” ou “Celulares” na SERP. |
| Sobre | **dentro** do title | “Sobre o The Zero — …” já contém a marca. Sufixo dobraria. |
| Matéria | sufixo **só se** o composto ficar ≤ 60 chars | Title longo + ` · The Zero` vira corte no meio de “The Z…”. A Google já mostra o nome do site ao lado. |

`composePageTitle(core, "auto" | "always" | "never")` aplica isso. Se o núcleo
já contém “The Zero”, o sufixo nunca entra.

Não usar `The Zero | The Zero`, `The Zero - The Zero`, nem prefixos tipo
`The Zero News:`. Não começar matéria com a marca (`The Zero: iPhone 18…`).

## Padrões por tipo de página

Núcleo = texto **sem** o sufixo. Document title = o que sai em `<title>`,
`og:title` e `twitter:title` (os três devem ser o mesmo string).

### Home (`/`)

```
The Zero — o que funciona de verdade em tech
```

- Title **absoluto** (marca + promessa). Sem ` · The Zero` extra.
- Não usar “Home”, “Início”, “Newsroom” nem só “The Zero”.
- O H1 visual da home é a manchete do destaque. Isso é decisão de layout
  de newsroom, não de SEO: não inventar um H1 escondido “The Zero” para
  “alinhar”. A Google pode escolher a lead story como title link; o
  document title continua sendo a identidade da casa.

### Editoria (`/ia`, `/jogos`, …)

```
{Editoria}: {ângulo em 3–6 palavras} · The Zero
```

Exemplos:

| Hub | Document title |
| --- | --- |
| `/tecnologia` | Tecnologia: indústria e tendências · The Zero |
| `/ia` | IA: ferramentas, modelos e limites · The Zero |
| `/computadores` | Computadores: PCs, peças e periféricos · The Zero |
| `/dispositivos` | Dispositivos: celular, TV e casa · The Zero |
| `/aplicativos` | Aplicativos: o que resolve a tarefa · The Zero |
| `/jogos` | Jogos: patch, console e preço no Brasil · The Zero |

H1 da página = rótulo curto (`IA`, `Jogos`). O title tag carrega o ângulo.
Não prefixar “Notícias de”, “Tudo sobre”, “Melhores”. Não listar as seis
subcategorias no title.

O campo `seoTitle` em `src/lib/categories.ts` é o **núcleo** (sem marca).

### Subeditoria (`/dispositivos/celulares`)

```
{Assunto inequívoco} · The Zero
```

O núcleo precisa ser único **no site inteiro**. Rótulos que se repetem entre
editorias (`Indústria`, `Infraestrutura`) levam o recorte no próprio núcleo:

- `Indústria de tecnologia` vs `Indústria de jogos`
- `Infraestrutura de internet e nuvem` vs `Infraestrutura de IA`

Não usar o padrão antigo `Celulares em Dispositivos` — “em” é navegação, não
busca, e gasta caracteres que deveriam nomear o assunto.

H1 = rótulo da subcategoria (`Celulares`). Title tag pode ser um pouco mais
explícito (`Celulares e smartphones`).

### Matéria (`/noticia/[slug]`)

```
{tese com entidade na frente}[ · The Zero]
```

1. Frontmatter `title` = manchete editorial = H1 = cards = RSS = `news:title`
   = JSON-LD `headline`. Pode passar de 70 chars. É a frase da casa.
2. Frontmatter opcional `seoTitle` = núcleo do `<title>` / OG / Twitter quando
   a manchete é longa, trunca feio, ou tem caractere hostil à SERP (`>`).
3. Sem `seoTitle`, o núcleo é o próprio `title` (ponto final de fecho some).
4. ` · The Zero` só entra se o composto couber no alvo de 60 chars.

`seoTitle` **não é** um segundo ângulo. É a mesma tese, comprimida, com a
entidade (produto, empresa, jogo) no começo. Se a manchete já cabe e já
nomeia a entidade, não inventar `seoTitle`.

### Busca (`/busca`, noindex)

```
Busca no newsroom · The Zero
Busca: {consulta encaixada} · The Zero
```

A consulta entra na aba do navegador; a página continua `noindex`. Consulta
enorme é cortada com `fitTitle`, nunca vaza um title de 200 chars.

### Sobre (`/sobre`)

```
Sobre o The Zero — newsroom de tech sem hype
```

Absoluto. H1 continua sendo a frase de manifesto (“Se não dá pra testar…”).
“Sobre · The Zero” é o tipo de title vago que a Google cita para *não* fazer.

### Privacidade, contato, termos

Absolutos (a marca já está no núcleo):

```
Privacidade no The Zero — dados, cookies e LGPD
Fale com a redação do The Zero
Termos de uso do The Zero
```

H1 pode ser mais direto (“O que a gente coleta”, “A redação responde aqui”).
O title tag nomeia o documento legal, não o gancho.

### 404

```
Página não encontrada · The Zero
```

H1 pode ser opinativo (“Isso aqui é zero…”). O title tag precisa ser
literal para quem caiu de um link morto. `noindex`.

## Voz em pt-BR (The Zero)

Escrever o title como se fosse uma linha de kicker, não um anúncio de
marketplace.

Fazer:

- entidade primeiro quando a SERP depende dela (`iPhone 18 Pro`, `Cursor`,
  `KaBuM`, `Steam Deck OLED`);
- número, preço, plataforma (`R$ 49`, `PT-BR`, `Switch 2`);
- opinião numa cláusula (`o preço dói`, `ninguém usa`, `Ryzen escapou`);
- segunda pessoa quando a matéria já fala assim (`Sua extensão…`);
- pt-BR. Marca, produto e sigla em inglês ficam em inglês (`Steam Deck`,
  `IA`, `PT-BR`).

Não fazer:

- hype vazio: “incrível”, “revolucionário”, “imperdível”, “tudo que você
  precisa saber”, “guia completo”, “confira”, “saiba mais”;
- keyword stuffing: `iPhone 18 Pro preço Brasil câmera ficha 2026 The Zero`;
- prefixo inútil: `Notícia:`, `Review:`, `BREAKING:` no `<title>` (kicker
  na página é outra coisa);
- clickbait que a matéria não paga (`X está morto` sem argumento — já é
  regra de voz do Sobre);
- `>` `<` `&` no title (viram `&gt;` na SERP; foi o caso de
  “Contexto > prompt”);
- repetir a editoria e a marca (`IA: … IA … · The Zero`);
- data permanente em matéria que vai envelhecer, salvo se a data *é* a notícia
  (“venda começa hoje”).

Artigo definido no H1 (`O KaBuM enfiou…`) pode cair no `seoTitle`
(`KaBuM enfiou…`) para a entidade abrir o snippet.

## `title` MDX vs `<title>` vs OG vs H1

| Superfície | Fonte | Pode diferir do H1? |
| --- | --- | --- |
| H1 da matéria, cards, trilho, breadcrumb, RSS `<title>`, `news:title`, JSON-LD `headline` | `title` | — (é a manchete) |
| `<title>`, `og:title`, `twitter:title` | `seoTitle` ?? `title`, depois `composePageTitle` | Sim, se for a **mesma tese** mais curta |
| Imagem OG gerada | `title` (manchete completa cabe em 1200×630) | Não: o cartaz leva a manchete, não o recorte SERP |

OG e Twitter **não** ganham um terceiro texto. Eles copiam o document title
para o card e o browser não mentirem um para o outro. A arte OG continua com
a manchete longa — ali há espaço.

JSON-LD `headline` fica com a manchete porque no Google Notícias / Top
Stories esse campo e o H1 pesam mais que a title tag. A title tag é o recorte
para a busca web clássica, que trunca mais cedo.

## Unicidade

Cada URL indexável precisa de um document title distinto. Colisões típicas
que o audit barra:

- duas matérias cujo `seoTitle` colapsou na mesma primeira frase;
- subeditorias homónimas sem o recorte da editoria-mãe;
- hub `IA · The Zero` se alguém apagar o ângulo e deixar só o rótulo,
  chocando com um futuro post chamado “IA”.

Páginas `noindex` (busca com query, 404) também não devem copiar um title
indexável — a aba do navegador fica ambígua.

## Como escrever uma matéria nova

1. Manchete (`title`) com opinião na primeira frase, entidade nomeada, voz
   da casa. Pode ser longa. É o H1.
2. Lê o document title gerado (manchete + regra de marca) em voz alta como
   snippet de Google. Se truncar no meio de um nome, de um preço ou de uma
   piada, escreve `seoTitle`.
3. `seoTitle` sem marca e sem ponto final de fecho. A marca é sufixo do
   código, quando couber.
4. Não reciclar o kicker (`BREAKING · Apple`) no title tag.

Frontmatter:

```mdx
---
title: "Manchete editorial, opinião na primeira frase."
seoTitle: "Entidade: tese comprimida para a SERP"
excerpt: "Uma linha que funciona sozinha no card e no OG."
category: ia
subcategory: ferramentas
date: "2026-09-19"
---
```

`seoTitle` é opcional. Ver também o README, secção “Como publicar”.

## Auditoria do que estava errado

Leitura de `buildPageMetadata`, `layout.tsx` (`title.template = "%s · The Zero"`),
metadados de editoria/matéria e titles ao vivo em thezero.com.br (19/09/2026).

### Sistema

1. **Sufixo cego.** Qualquer `title` string passava pelo template. Matéria de
   70–90 chars virava 81–100 chars. A SERP cortava no meio da tese ou no
   meio de “The Zero”.
2. **Home pobre.** `<title>` = `The Zero`. A Google pede, na home, marca + o
   que o site é. Identidade da casa ia só para a meta description.
3. **Hubs preguiçosos.** Editoria = rótulo (`IA · The Zero`, 13 chars).
   Desperdiça a SERP e compete com qualquer outro site cujo title seja “IA”.
4. **Subhubs de navegação.** `Celulares em Dispositivos · The Zero` —
   “em Dispositivos” não é query. `Infraestrutura em IA` vs futura
   `Infraestrutura em Tecnologia` era o único desambiguador, e ainda assim
   soava a miolo de breadcrumb.
5. **Sobre sem OG próprio.** Document title `Sobre · The Zero`; `og:title`
   caía no default do layout (`The Zero`). Aba e card discordavam.
6. **`absoluteTitle` só na home.** O helper montava `socialTitle` com marca
   sempre que `absoluteTitle` era falso, **mesmo** quando o `<title>` já
   levaria a marca via template — coerente por acidente, frágil se alguém
   passasse um núcleo que já tinha “The Zero”.
7. **Busca.** `Busca: {q} · The Zero` sem teto. Query longa = title longo.
   Página já era `noindex`, mas a aba ficava feia.

### Amostra ao vivo (antes)

| URL | `<title>` ao vivo | Problema |
| --- | --- | --- |
| `/` | The Zero | Sem promessa, sem recorte. |
| `/ia` | IA · The Zero | Curto demais, genérico. |
| `/dispositivos/celulares` | Celulares em Dispositivos · The Zero | Padrão de pão-rálado. |
| `/sobre` | Sobre · The Zero | Vago; OG era só “The Zero”. |
| `/noticia/cursor-nao-e-ia-que-escreve-codigo` | Cursor não é IA que escreve código. É autocomplete que entende o repo. · The Zero (81) | Corta no autocomplete / na marca. |
| `/noticia/twd-streets-of-survival-day-one` | …porrada pixelada de R$ 67 · The Zero (100) | Corta o nome do jogo ou o preço. |
| `/noticia/contexto-maior-que-prompt` | Contexto &gt; prompt. … · The Zero | `>` vira entidade HTML na SERP. |
| `/noticia/setup-produtividade-overrated` | Seu setup não é lento porque falta monitor. · The Zero | Tese incompleta; parece conselho genérico. |

### Manchetes (H1) que mereciam recorte, não esterilização

A voz das matérias está correta. O erro era mandar a manchete crua + marca
para a SERP. Recortes (`seoTitle`) comprimem; não traduzem para “Galaxy S25
Ultra ficha técnica preço Brasil”.

## Depois desta mudança (exemplos)

| URL | Antes | Depois |
| --- | --- | --- |
| `/` | The Zero | The Zero — o que funciona de verdade em tech |
| `/ia` | IA · The Zero | IA: ferramentas, modelos e limites · The Zero |
| `/dispositivos/celulares` | Celulares em Dispositivos · The Zero | Celulares e smartphones · The Zero |
| `/sobre` | Sobre · The Zero (OG: The Zero) | Sobre o The Zero — newsroom de tech sem hype |
| `/noticia/cursor-nao-e-ia-que-escreve-codigo` | Cursor não é IA que escreve código. É autocomplete que entende o repo. · The Zero (81) | Cursor: autocomplete que entende o repo · The Zero (51) |
| `/noticia/twd-streets-of-survival-day-one` | …porrada pixelada de R$ 67 · The Zero (100) | The Walking Dead: Streets of Survival a R$ 67 · The Zero |
| `/noticia/contexto-maior-que-prompt` | Contexto &gt; prompt. … · The Zero | Contexto pesa mais que prompt — o truque de IA · The Zero |

O H1 das matérias longas **não** muda para o recorte: a manchete editorial
continua no cartaz, no RSS e no JSON-LD. A unicidade de todos os titles
indexáveis (e dos hubs ainda vazios) é assertada no `sitemap` em build.
