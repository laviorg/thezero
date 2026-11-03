# Padrão de reescrita do acervo — 2026-11 (P0 AdSense "conteúdo de baixo valor")

Lista priorizada (mais fraco primeiro): `docs/reescrita-2026-11.md`. Trabalhe de cima para baixo, em lotes de ~10, e atualize a coluna status.

## Regras
1. **Mantenha slug/URL e os fatos.** Não troque o nome do arquivo nem o `date`.
2. **700–1100 palavras** de corpo. Corte enrolação, reescrita de release, clickbait e repetição.
3. **Ângulo brasileiro real**: preço em R$, disponibilidade no Brasil, Anatel/Procon/CDC/LGPD/ANAC quando couber, e o que aquilo muda para o leitor daqui.
4. **Seção de análise própria**: `## O que isso significa` (notícia) ou `## Nossa leitura` (guia), com opinião da casa.
5. **2+ fontes citadas** com link externo real (linha `Fontes:` no fim, antes da navegação). Confira se o link abre.
6. **1+ link interno** para um guia relevante (`/noticia/...`, `/black-friday`, `/menor-preco`).
7. **Nunca invente** spec, preço, citação ou teste. Se não dá para verificar no texto existente ou na fonte, fica de fora.
8. **Byline só `author: "nicholas"`** (Nicholas Nishimura). Nenhuma menção a IA/Mavi/Instinct no texto.
9. **Sem CaixaCompra em notícia.**
10. **Fino demais para salvar?** Marque `noindex: true` no frontmatter e registre no doc de reescrita (ou 301 para peça de fundo do mesmo assunto em `src/lib/redirects.ts`).
11. Cada lote: branch → `npm run check:posts` + `npm run build` passam → PR → merge squash. Excerpt ≤160 caracteres.

## Modelo de seções (lote 1 como referência)
Ex.: `content/posts/antivirus-windows-2026-precisa-pagar.mdx` — corpo original + `## No Brasil` + `## Nossa leitura` + `## Veredito` + `Fontes:`.
