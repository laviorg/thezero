# Regra permanente: CaixaCompra em notícia com intenção de compra

Toda **notícia** com intenção de compra — hardware, preço, estoque, produto à venda no Brasil, ou lançamento que o leitor possa comprar já (ou uma alternativa editorialmente ligada) — **deve** ter 1–2 blocos `<CaixaCompra>` e disclosure **antes** do primeiro link afiliado.

## Obrigatório

1. **Disclosure antes do 1º link** — Amazon (`AMAZON_DISCLOSURE` / texto do Programa de Associados) e/ou KaBuM (`KABUM_DISCLOSURE`). O componente já marca “Publicidade”.
2. **Produto editorialmente ligado** — o leitor precisa ver a ligação com a matéria. Sem “também veja notebook genérico”.
3. **Máximo 2 caixas em notícia diária** — guias podem empilhar; notícia que vira vitrine dispara thin/affiliate spam.
4. **Href real** — Amazon `?tag=thezero04-20` (helper `amazonAffiliateUrl`); KaBuM **só** via Awin (`kabumAffiliateUrl`). Sem preço inventado; children só com nota de estoque/garantia/CEP.
5. **Posição típica** — após a seção “O que isso significa no Brasil” (bloco `## Onde olhar preço`), antes de Rule/Fontes quando couber.
6. **Sem fingir estoque** — se o produto da manchete não tem loja BR, afiliar **alternativa** alinhada ao texto (ex.: microfone USB-C na matéria do ECM-AX10), nunca o SKU inexistente.

## Stack no repo

- Componente: `src/components/mdx/caixa-compra.tsx`
- Helpers: `src/lib/affiliate.ts`
- Registro MDX: `src/components/mdx/mdx-components.tsx` (`CaixaCompra`)
- Catálogo KaBuM verificado: `src/data/kabum-catalog.json` — não inventar `kabumId`/URL
- ASINs Amazon: só ids já abertos na amazon.com.br e presentes no repo (guias, `deals.ts` amazonPicks) ou conferidos no Associates antes do merge

## Snippet

```mdx
## Onde olhar preço

**Publicidade.** Como participante do Programa de Associados da Amazon, sou remunerado pelas compras qualificadas efetuadas. Os links abaixo são de afiliado: não mudam o veredito nem a ordem das opções desta matéria, e o preço muda com loja, CEP e data.

<CaixaCompra loja="Amazon" href="https://www.amazon.com.br/dp/ASIN?tag=thezero04-20" produto="Nome">
Confira vendedor e garantia no checkout. Sujeito a estoque.
</CaixaCompra>
```

KaBuM: colar disclosure `KABUM_DISCLOSURE` e `href` gerado por `kabumAffiliateUrl(urlDoCatalogo)`.
