# Deploy na Cloudflare Pages

O `npm run build` continua sendo o build da Vercel. A Cloudflare usa outro comando, `npm run build:cloudflare`, que gera um site estático em `out/` e publica na Pages. A Action [`.github/workflows/deploy-cloudflare.yml`](../.github/workflows/deploy-cloudflare.yml) faz isso a cada push na `main`. Sem os secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`, a Action termina com sucesso e não publica.

Não ligue o repositório em “Connect to Git” no painel da Pages. Esse modo rodaria `npm run build` (o build da Vercel) e publicaria o output errado. O projeto tem de ser **Direct Upload**: a Action envia a pasta `out/`.

## Por que estático

A home, as matérias, os hubs, o sitemap, o RSS, os ícones e as imagens OG já são gerados no build. O plano Workers Free cobra CPU só quando uma função roda (10 ms por pedido) e limita essa função a 100.000 pedidos por dia. Arquivo estático não entra nessa conta.

A exceção é `/news-sitemap.xml`. O Google News só aceita matéria das últimas 48 horas, e a rota hoje revalida a cada 300 segundos. Um export congelaria essa janela até o próximo deploy. A função em `functions/news-sitemap.xml.ts` refaz o XML na hora, em cima de `out/news-manifest.json`. O resto do pedido não passa por ela.

`/busca?q=` no export não tem servidor. No build da Cloudflare a página baixa `/search-index.json` e filtra com a mesma função da busca do servidor (`postMatchesQuery`). Na Vercel a busca continua renderizada no servidor. Sem JavaScript, a página da Cloudflare mostra o formulário e não os resultados.

`next/image` no export sai sem o otimizador (`images.unoptimized`). As fotos do repo são arquivos locais; o browser pede o arquivo original. Não há Image Resizing no plano grátis.

## Limites do plano grátis

Conferido na documentação da Cloudflare em 1º de outubro de 2026:

- Assets estáticos: pedidos ilimitados, sem CPU. Até 20.000 arquivos por versão e 25 MiB por arquivo.
- A função do news sitemap: 100.000 pedidos/dia na conta e 10 ms de CPU. O script só lê um JSON e monta XML.
- Worker de 64 MiB: não se aplica ao HTML. A função é o único script.
- O plano free serve HTML e imagem. Não serve vídeo como produto de hospedagem. Este site não hospeda vídeo.

O build imprime a contagem de arquivos e o maior arquivo, e falha se passar de 20.000 ou de 25 MiB.

## O que você faz na Cloudflare

1. Crie a conta em [dash.cloudflare.com](https://dash.cloudflare.com). O plano Workers/Pages Free basta. Não precisa mudar os nameservers do Registro.br para publicar o `www`.
2. Anote o **Account ID** (Workers & Pages → à direita, ou na URL da conta).
3. Crie um API token em My Profile → API Tokens → Create Token → Custom token:
   - Permissão: **Account → Cloudflare Pages → Edit** (no catálogo novo isso aparece como Pages Write).
   - Escopo: a conta desse site.
   - Não precisa de permissão de DNS nem de Workers. O token só publica o projeto.
4. No GitHub, em Settings → Secrets and variables → Actions, crie:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - Opcionais, os mesmos da Vercel, se quiser anúncio e GA4 no HTML: `NEXT_PUBLIC_GA_MEASUREMENT_ID` e `NEXT_PUBLIC_ADSENSE_PUB_ID`. Sem eles o site sobe, só não carrega esses scripts.
5. Faça um push na `main` (ou rode a Action `deploy-cloudflare` no próximo push). O primeiro deploy cria o projeto Direct Upload `thezero-com-br`. A URL de conferência fica `https://thezero-com-br.pages.dev`.
6. No painel: Workers & Pages → `thezero-com-br` → Custom domains → Set up a custom domain → `www.thezero.com.br`. A Pages mostra o CNAME. Não troque o DNS antes desse passo: um CNAME solto, sem o domínio cadastrado no projeto, responde 522.
7. Se `thezero-com-br.pages.dev` já existir na conta de outra pessoa, o deploy falha com nome ocupado. Troque `name` em `wrangler.jsonc` e publique de novo. O domínio `www` não depende desse nome.

## O que você faz no Registro.br

Os nameservers continuam `a.sec.dns.br` e `b.sec.dns.br`. Edite a zona no **modo avançado**. Não use o modo básico de redirecionamento: ele é HTTP 302, só vale para o apex e apaga CNAME, MX e TXT.

Estado conferido em 1º de outubro de 2026:

| Nome | Tipo | Valor hoje | Trocar para |
| --- | --- | --- | --- |
| `www` | CNAME | `e89fb4d2f4258769.vercel-dns-017.com` | `thezero-com-br.pages.dev` |
| apex (nome vazio) | A | `216.198.79.1` (Vercel) | apagar |

Não mexa em MX, TXT ou CAA.

O Registro.br não aceita CNAME no apex. A Pages não publica um IP fixo para um registro A. Com os NS no Registro.br, o apex não chega na Cloudflare, então o 308 do `next.config` (e o de `out/_redirects`) não roda para `https://thezero.com.br`.

Apague o A do apex no corte. Se ele continuar apontando para `216.198.79.1`, o apex segue na Vercel e responde 402 enquanto a conta estiver bloqueada. Sem o A, `thezero.com.br` deixa de resolver. O canônico, o sitemap, o RSS e o JSON-LD já usam `https://www.thezero.com.br`.

Para voltar a ter redirect do apex para www, a zona precisa estar na Cloudflare (aí os NS do Registro.br passam a ser os que a Cloudflare mostrar ao adicionar o site). No DNS da Cloudflare:

- `www` CNAME `thezero-com-br.pages.dev`, proxied (a custom domain da Pages cria esse registro).
- Apex: registro A `@` → `192.0.2.1`, proxied. Esse IP é placeholder; o pedido não chega nele.
- Redirect Rule: se o hostname é `thezero.com.br`, redirecionar para `https://www.thezero.com.br` preservando caminho e query, status 301 ou 308.

Confira, depois do certificado da Pages ficar ativo:

- `https://www.thezero.com.br/` → 200
- `https://www.thezero.com.br/sitemap.xml` → 200, sem redirect
- `https://www.thezero.com.br/news-sitemap.xml` → 200, sem redirect
- `https://thezero-com-br.pages.dev` pode continuar no ar. O canônico das páginas é www.

## Preview local

```bash
npm run build:cloudflare
npm run preview:cloudflare
```

O preview sobe em `http://127.0.0.1:8788`. O build devolve os arquivos de `src/app` ao estado do Git mesmo se o `next build` falhar.
