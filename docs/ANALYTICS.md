# Google Analytics 4

O The Zero carrega o gtag / GA4 **só** quando há um measurement ID válido **e** o leitor aceitou cookies de publicidade / estatística (o mesmo aceite do AdSense). “Só o necessário” não dispara o script.

Conta: `hello.shimenawa` — propriedade **The Zero**, stream `www.thezero.com.br`.

Measurement ID de produção: **`G-3H0Z0NNQ1J`**. Não invente outro `G-`.

## Variável de ambiente

```bash
# Vercel → Production. Omitir em Preview para não misturar tráfego de preview
# na propriedade ao vivo.
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-3H0Z0NNQ1J
```

Sem esse valor o site não injeta `gtag.js`. O ID não vai hardcoded no source — Preview e local ficam sem Analytics até alguém setar a env.

## O que o código faz

| Item | Onde |
| --- | --- |
| Normaliza `G-` + alfanuméricos; recusa `UA-`, `GTM-`, vazio | `src/lib/analytics.ts` |
| Script oficial (`googletagmanager.com/gtag/js`) via `next/script` | `src/components/analytics/ga-script.tsx` |
| Gate de consentimento = `advertisingAllowed` (banner / “Cookies” no rodapé) | `ConsentProvider` |
| Política atualizada (LGPD + Analytics) | `/privacidade` |

Pageviews em navegação client-side: o GA4 Enhanced Measurement (histórico do browser) cobre as trocas de rota do App Router. Confirme no Admin da propriedade que “Page changes based on browser history events” está ligado (padrão).

## O que Nicholas faz na Vercel

1. Projeto The Zero → Settings → Environment Variables.
2. Criar `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-3H0Z0NNQ1J`.
3. Scope: **Production**. Não marcar Preview / Development, a menos que queira ver hits de preview na propriedade live.
4. Redeploy de Production.

No ar, depois de aceitar o aviso de cookies: o HTML tem `gtag/js?id=G-3H0Z0NNQ1J` e o `gtag('config', 'G-3H0Z0NNQ1J')`. Com “Só o necessário”, esses scripts não entram.
