# AdSense — prontidão do site e o que falta na UI do Google

O The Zero está preparado para a **revisão de site** do Google AdSense.
O `/ads.txt` declara o publisher `pub-3679376723096233`. O script e as unidades só carregam com `NEXT_PUBLIC_ADSENSE_PUB_ID`, o aceite de publicidade no aviso de cookies e os slots criados na UI do AdSense (envs abaixo). Sem slot configurado, nenhuma caixa de anúncio aparece no ar.

Conta prevista (passo manual, fora deste repo): `nicholasharuo@gmail.com`.
O site público usa `hello@thezero.com.br` (`site.email`).

## O que o código já faz

| Item | Onde |
| --- | --- |
| Política de Privacidade em pt-BR, alinhada à LGPD e às *Google Publisher Policies* (cookies, terceiros, direitos, [How Google uses data](https://policies.google.com/technologies/partner-sites)) | `/privacidade` |
| Contato visível (mailto + página) | `/contato`, rodapé, e-mail `hello@thezero.com.br` |
| Sobre com dono editorial, propósito e independência de pauta | `/sobre` (`#quem-publica`) |
| Como o site avalia produto, preço em R$ e o que não testa | `/como-testamos` |
| Independência, correções, fontes e política de IA | `/politica-editorial` |
| Termos de uso | `/termos` |
| Aviso leve de cookies (necessários vs publicidade / estatística); recusa não esconde o newsroom. O mesmo aceite libera Analytics quando `NEXT_PUBLIC_GA_MEASUREMENT_ID` está setado — [`docs/ANALYTICS.md`](./ANALYTICS.md) | banner + “Cookies” no rodapé |
| `ads.txt` na raiz, com o vendedor Google e o contato | `/ads.txt` |
| Meta `google-adsense-account` e script oficial **só** se existir publisher ID válido **e** o leitor aceitar publicidade | `NEXT_PUBLIC_ADSENSE_PUB_ID` |
| Crawlers de anúncio liberados; 404; nav; HTTPS (Vercel); sem cloaking | `robots.ts`, `not-found`, header/footer |
| Sitemap e titles únicos das páginas novas | `sitemap.ts`, `title-audit.ts` |

As unidades visuais ficam escondidas até existir slot real: o componente (`src/components/ads/ad-unit.tsx`) só renderiza com publisher ID + slot + aceite de publicidade. Caixa vazia “Publicidade” antes da aprovação parece site feito para ad, e a revisão costuma rejeitar isso — por isso o slot nunca é inventado no código.

Placements atuais:

| Placement | Onde | Formato | Env do slot |
| --- | --- | --- | --- |
| `in-article` | Matérias com 600+ palavras, após o 3º parágrafo (guias longos: após o 7º, para não empilhar com a newsletter) | fluid / in-article | `NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE` |
| `home` | Home, entre “Últimas” e as editorias | display responsivo | `NEXT_PUBLIC_ADSENSE_SLOT_HOME` |

## O que Nicholas faz na UI do AdSense

1. Entrar em [adsense.google.com](https://www.google.com/adsense/) com `nicholasharuo@gmail.com` (criar a conta se ainda não existir). País: Brasil. Fuso e moeda conforme o painel.
2. Adicionar o site **`https://www.thezero.com.br`** (Sites → Adicionar site). É o host que responde 200. O apex redireciona. HTTPS, sem path.
3. Copiar o **publisher ID** (`pub-` + 16 dígitos) em Conta → Informações da conta. Não usar o prefixo de produto (`ca-`) no `ads.txt`; o código aceita os dois e normaliza.
4. No projeto Vercel do The Zero, criar a env **`NEXT_PUBLIC_ADSENSE_PUB_ID=pub-3679376723096233`** (Production; Preview se quiser testar). Redeploy. Sem esse valor o script de anúncio não carrega. O `/ads.txt` já declara `google.com, pub-3679376723096233, DIRECT, f08c47fec0942fa0` e `CONTACT=mailto:hello@thezero.com.br`.
5. Conferir no ar:
   - `https://www.thezero.com.br/ads.txt` tem a linha  
     `google.com, pub-SEU_ID, DIRECT, f08c47fec0942fa0`
   - o HTML tem `<meta name="google-adsense-account" content="ca-pub-SEU_ID">`
6. No AdSense, **verificar** o site. O arquivo `ads.txt` costuma bastar. Alternativas oficiais: snippet no `<head>` (o loader deste repo só dispara com ID + aceite de cookie) ou propriedade verificada no [Search Console](https://search.google.com/search-console).
7. **Pedir a revisão** do site. Leva alguns dias; às vezes 2–4 semanas. Status no card Sites da home do AdSense.
8. **Não clicar** nos próprios anúncios, nem pedir clique, nem colocar seta em cima de unidade — *AdSense Program policies*.
9. Depois do status **Ready**:
   - criar as duas unidades no painel (Anúncios → Por unidade de anúncio): uma **In-article** e uma **Display** responsiva. Copiar o `data-ad-slot` (só dígitos) de cada uma para os secrets `NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE` e `NEXT_PUBLIC_ADSENSE_SLOT_HOME` no GitHub e redesployar (workflow `deploy-cloudflare`). Alternativa: ligar **Auto ads** no painel — aí os slots manuais ficam opcionais;
   - em Privacidade e mensagens, configurar CMP se houver tráfego no EEE / UK (o banner da casa cobre o aviso LGPD no Brasil; não substitui o CMP europeu do Google);
   - para pedidos LGPD, o Google restringe a [provedores de tecnologia de anúncio certificados](https://support.google.com/adsense/answer/9931967).
10. Dados de pagamento, PIN e identidade: só no AdSense. Não vão neste repositório.

## Variável de ambiente

```bash
# .env.local ou Vercel — só depois da aprovação. Nunca invente o ID.
NEXT_PUBLIC_ADSENSE_PUB_ID=pub-xxxxxxxxxxxxxxxx
```

`ca-pub-…` também vale; o helper tira o `ca-` para o `ads.txt` e recoloca no script.

## Políticas que o revisor olha (e o site já tenta cobrir)

- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938) — privacidade, declaração honesta, `ads.txt` autorizado.
- [AdSense Program policies](https://support.google.com/adsense/answer/48182) — clique inválido, navegação, não colocar anúncio em página sem conteúdo.
- [Site not ready](https://support.google.com/adsense/answer/12176698) — site no ar, HTTPS, conteúdo original, crawler (`Mediapartners-Google`) sem bloqueio.
- Conteúdo: o newsroom já tem matérias MDX originais nas seis editorias. Não inventamos texto só para “encher volume”.

## Depois de aprovado (código)

Quando o ID estiver setado, o `ads.txt` e o meta declaram o Google. O script `adsbygoogle.js` e as unidades só carregam se o leitor aceitou publicidade no aviso de cookies (escolha separada da de estatística). Sem os secrets de slot, as unidades não renderizam — Auto ads no painel continua funcionando como caminho alternativo.

## CSP e anúncios

O `_headers` gerado no build da Cloudflare leva uma CSP. O Google só dá suporte a **strict CSP com nonce** para o AdSense ([documentação](https://support.google.com/adsense/answer/16283098)) porque os domínios do adsbygoogle mudam com o tempo; nonce por request não existe em hosting estático. Por isso o `script-src`/`frame-src`/`connect-src` da CSP são amplos (`https:`) de propósito — apertar para uma lista fixa de domínios quebra anúncio sem aviso.
