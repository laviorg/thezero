# AdSense — prontidão do site e o que falta na UI do Google

O The Zero está preparado para a **revisão de site** do Google AdSense.
Não há unidade de anúncio no ar e **não inventamos** um `ca-pub` / `pub-`.

Conta prevista (passo manual, fora deste repo): `nicholasharuo@gmail.com`.
O site público continua usando `redacao@thezero.com.br`.

## O que o código já faz

| Item | Onde |
| --- | --- |
| Política de Privacidade em pt-BR, alinhada à LGPD e às *Google Publisher Policies* (cookies, terceiros, direitos, [How Google uses data](https://policies.google.com/technologies/partner-sites)) | `/privacidade` |
| Contato visível (mailto + página) | `/contato`, rodapé, e-mail `redacao@thezero.com.br` |
| Sobre com dono editorial, propósito e independência de pauta | `/sobre` |
| Termos de uso | `/termos` |
| Aviso leve de cookies (necessários vs publicidade); recusa não esconde o newsroom | banner + “Cookies” no rodapé |
| `ads.txt` na raiz, sem seller inventado | `/ads.txt` |
| Meta `google-adsense-account` e script oficial **só** se existir publisher ID válido **e** o leitor aceitar publicidade | `NEXT_PUBLIC_ADSENSE_PUB_ID` |
| Crawlers de anúncio liberados; 404; nav; HTTPS (Vercel); sem cloaking | `robots.ts`, `not-found`, header/footer |
| Sitemap e titles únicos das páginas novas | `sitemap.ts`, `title-audit.ts` |

Unidades visuais de anúncio **não** foram colocadas nas matérias de propósito: caixa vazia “Publicidade” antes da aprovação parece site feito para ad, e a revisão costuma rejeitar isso.

## O que Nicholas faz na UI do AdSense

1. Entrar em [adsense.google.com](https://www.google.com/adsense/) com `nicholasharuo@gmail.com` (criar a conta se ainda não existir). País: Brasil. Fuso e moeda conforme o painel.
2. Adicionar o site **`https://thezero.com.br`** (Sites → Adicionar site). URL certa, HTTPS, sem path.
3. Copiar o **publisher ID** (`pub-` + 16 dígitos) em Conta → Informações da conta. Não usar o prefixo de produto (`ca-`) no `ads.txt`; o código aceita os dois e normaliza.
4. No projeto Vercel do The Zero, criar a env **`NEXT_PUBLIC_ADSENSE_PUB_ID=pub-xxxxxxxxxxxxxxxx`** (Production; Preview se quiser testar). Redeploy. Sem esse valor o `/ads.txt` só declara `OWNERDOMAIN` / `CONTACT` e um comentário — correto enquanto o anúncio não está no ar.
5. Conferir no ar:
   - `https://thezero.com.br/ads.txt` tem a linha  
     `google.com, pub-SEU_ID, DIRECT, f08c47fec0942fa0`
   - o HTML tem `<meta name="google-adsense-account" content="ca-pub-SEU_ID">`
6. No AdSense, **verificar** o site. O arquivo `ads.txt` costuma bastar. Alternativas oficiais: snippet no `<head>` (o loader deste repo só dispara com ID + aceite de cookie) ou propriedade verificada no [Search Console](https://search.google.com/search-console).
7. **Pedir a revisão** do site. Leva alguns dias; às vezes 2–4 semanas. Status no card Sites da home do AdSense.
8. **Não clicar** nos próprios anúncios, nem pedir clique, nem colocar seta em cima de unidade — *AdSense Program policies*.
9. Depois do status **Ready**:
   - ligar Auto ads no painel **ou** criar unidades e colá-las no layout (aí sim um PR de *placement*);
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

Quando o ID estiver na Vercel, o `ads.txt` e o meta passam a declarar o Google. O script `adsbygoogle.js` só carrega se o leitor aceitou publicidade. Placement de unidade (in-article, sidebar) fica para um PR seguinte — não misturar com esta prontidão.
