# /precos-no-brasil: atualização semanal

Página: `src/app/precos-no-brasil/page.tsx`. Dados: `src/data/precos-brasil.json`. Tipos e grupos: `src/lib/precos-brasil.ts`. Capa: `public/images/pages/precos-no-brasil.png`. Está no sitemap (data do último commit do JSON) e no rodapé.

## Regra

Só entra preço lido de verdade na página de uma loja brasileira no dia da checagem: site oficial da marca no Brasil, Amazon.com.br, KaBuM, Magalu ou loja oficial no Mercado Livre. Nada de estimativa, conversão de dólar ou preço copiado de matéria. Se não deu para ler o preço com segurança, a linha sai da tabela até a próxima semana.

## Toda semana (sugestão: domingo à noite)

1. Escolha os aparelhos: os mais citados nas matérias indexadas (conte nomes em `content/posts/*.mdx` sem `noindex: true`). Troque modelo que saiu de linha pelo sucessor que a loja oficial vende.
2. Abra cada página de produto e leia:
   - KaBuM: JSON-LD `Product.offers.price` (é o preço à vista no Pix) e `sellerName` no HTML. Se o vendedor não for `KaBuM!`, escreva `Nome (marketplace KaBuM)`.
   - Apple: página `apple.com/br/shop/buy-...`; preço por capacidade ("R$ X em até 12x") ou "A partir de" na página `buy-iphone`.
   - Samsung: `https://shop.samsung.com/br/api/catalog_system/pub/products/search?ft=<modelo>` (`commertialOffer.Price`, `ListPrice`, `IsAvailable`); confira na página `/p`.
   - Amazon.com.br: preço em `priceToPay` e vendedor em "Vendido por".
3. Atualize `src/data/precos-brasil.json`: `checkedAt` (ISO com `-03:00`) no topo e em cada item, `price`, `priceNote` (à vista no Pix, preço de tabela, "a partir de", promoção com preço de tabela), `store`, `seller`, `url`.
4. Revise a seção "O que chama atenção nesta semana" na página: só observações que a tabela mostra.
5. PR `precos/AAAA-MM-DD` só com o JSON (e a página, se mudou o texto). Merge depois do build verde.

Sem venda oficial no Brasil (ex.: aparelho só importado): fora da tabela.
