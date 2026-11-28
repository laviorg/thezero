# Aprofundar o acervo — fila de 28/11/2026 (P0 AdSense)

Pedido do Nicholas em 28/11/2026. Objetivo: levar as matérias **indexadas** que ainda não cumprem o padrão fundo ao padrão, para fortalecer o próximo pedido de revisão do AdSense. Esta fila **vem antes** de pauta nova (veja "Como trabalhar"). Gerada da `main` em 28/11/2026 (após o PR #687), já sem as que estão em `noindex`.

## Números

- Indexadas: 445. Já no padrão fundo (800–1200 palavras, ângulo BR, 2+ fontes externas, link para guia, capa 1200px+, autor nicholas): 218.
- **Nesta fila: 220** matérias indexadas que falham em pelo menos um critério.
  - Parte A, aprofundar: **160** em **16 lotes** de ~10 (um lote por dia, de 28/11 a 13/12).
  - Parte B, só falta link para guia (corpo já cumpre): **52**, em 2 PRs de lote.
  - Parte C, triagem (notícia velha sem tráfego, difícil de aprofundar): **8**, decidir aprofundar ou `noindex`.
- Sobrepõe a lista antiga `docs/reescrita-2026-11.md`: onde o slug aparece nas duas, vale esta (ordem e status). Não refaça as já marcadas `reescrito` lá se não aparecem aqui.

## Regras (todas obrigatórias, iguais a `docs/reescrita-padrao.md` e `AGENTS.md`)

1. **800 a 1200 palavras** de corpo. Se hoje passa de 1200, enxugue.
2. **Ângulo Brasil real**: preço em R$ lido na página de loja brasileira (KaBuM, Amazon.com.br, Magalu, loja oficial da marca), com loja, link, data da consulta e se é à vista, de tabela ou "a partir de". Produto sem venda no Brasil: diga isso no texto.
3. **2 fontes primárias linkadas**, de domínios diferentes, em `## Fontes`. Confira que o link abre e que a fonte diz o que o texto afirma.
4. **1 link para guia do site com rota existente**: `/vale-a-pena`, `/precos-no-brasil`, `/menor-preco`, `/reviews`, `/tutoriais`, `/ferramentas/<ferramenta>`, `/guias/modelos-ia-precos`, `/guias/consoles-portateis` ou um `/noticia/<slug>` de guia/comparativo/review/tutorial que esteja indexado. **Nunca `/guias`** (a raiz dá 404). O guia tem que ser do mesmo assunto; não force link.
5. **Mantenha o slug e o `date`** da publicação. Atualize `dateModified` se o frontmatter tiver o campo.
6. Autor `nicholas` (assinatura Nicholas Nishimura). Nenhuma menção a IA, Mavi ou Instinct no texto (matéria sobre IA como tema é normal).
7. **Nada inventado**: spec, preço, citação, teste. O que não dá para verificar fica de fora. Sem "já testamos" sem teste real.
8. **Sem caça-clique**. Título em contraste factual (o que mudou x o que fica igual), concreto, sem exagero.
9. **Capa 1200px ou mais, sem texto gravado** (crédito só em `coverCredit`). Se a capa for trocada, só recorte e redimensione a original. Respeite `cover_locked`.
10. Notícia sem CaixaCompra.
11. **Notícia velha que não dá para aprofundar com fato novo e fonte primária: não encha linguiça.** Marque `noindex: true` no frontmatter e registre aqui com o status `noindex; PR #N`.
12. Siga as regras de preço da seção 6 do prompt e o FACT-CHECK no corpo do PR.

## Como trabalhar

- Um lote por dia, de cima para baixo, **um PR por matéria**, branch `instinct/aprofundar-<slug>`, título `[Aprofundar] <slug>`. `npm run check:posts` e `npm run build` verdes, depois merge sozinho (a Mavi não revisa mais PR da Instinct).
- Merge só fora das janelas proibidas (HH:00–HH:50 das horas 07, 09, 11, 14, 16, 18), com pelo menos 5 min desde o último merge na `main`. O limite de 6/dia da seção 6.2 do prompt vale para **matérias novas**; os aprofundamentos desta fila entram até 10/dia.
- Pauta nova de assunto quente (Discover) continua permitida, dentro do limite de 6/dia, mas **o lote do dia vem primeiro**.
- Ao concluir, troque o status da linha para `feito; PR #N` (ou `noindex; PR #N`). Se um lote não fechar no dia, o que sobrou vai para o início do dia seguinte.
- A ordem é: mais critérios falhando primeiro, depois guias, comparativos e reviews (valor evergreen) antes de notícia, depois impressões no Google (28 dias até 11/11), depois a mais recente.
- Dúvida sobre fato: não publique, `needs-review` no PR e siga para a próxima.

## Parte A — aprofundar (160)


### Lote 1 — 28/11/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `sidetrack-tiny-trains-desktop-steam` | noticia | 671 | 1 | não | 0 | 2026-10-22 | 671 palavras (faltam 129+); 1 fonte(s) externa(s) linkada(s) (precisa 2); sem link para guia | pendente |
| 2 | `zeenix-lite-portatil-barato` | review | 686 | 0 | sim | 4 | 2026-09-21 | 686 palavras (faltam 114+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 3 | `switch-2-vs-steam-deck-oled-preco-brasil` | comparativo | 676 | 0 | sim | 2 | 2026-09-23 | 676 palavras (faltam 124+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 4 | `galaxy-a55-vs-edge-50-fusion` | comparativo | 660 | 0 | sim | 1 | 2026-09-20 | 660 palavras (faltam 140+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 5 | `trocar-bateria-iphone-brasil-preco-risco` | guia | 712 | 0 | sim | 1 | 2026-09-11 | 712 palavras (faltam 88+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 6 | `galaxy-a16-ou-a26-entrada-samsung` | guia | 659 | 0 | sim | 1 | 2026-08-04 | 659 palavras (faltam 141+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 7 | `ps5-vs-series-x-exclusivo-game-pass-preco` | comparativo | 676 | 0 | sim | 0 | 2026-09-24 | 676 palavras (faltam 124+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 8 | `fire-tv-stick-vs-chromecast-na-tv` | guia | 674 | 0 | sim | 0 | 2026-09-21 | 674 palavras (faltam 126+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 9 | `airpods-vs-galaxy-buds-ecossistema-misto` | comparativo | 637 | 0 | sim | 0 | 2026-09-20 | 637 palavras (faltam 163+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 10 | `fone-tws-ate-300-audio-e-microfone` | guia | 665 | 0 | sim | 0 | 2026-09-19 | 665 palavras (faltam 135+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |


### Lote 2 — 29/11/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 11 | `undervolt-de-gpu` | guia | 616 | 0 | sim | 0 | 2026-09-17 | 616 palavras (faltam 184+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 12 | `ipad-10-vs-tablet-android-gap-de-apps` | comparativo | 606 | 0 | sim | 0 | 2026-09-16 | 606 palavras (faltam 194+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 13 | `tablet-ate-1500-estudar-e-netflix` | guia | 709 | 0 | sim | 0 | 2026-09-16 | 709 palavras (faltam 91+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 14 | `celular-ate-2-mil-brasil-2026` | guia | 605 | 0 | sim | 0 | 2026-09-15 | 605 palavras (faltam 195+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 15 | `5g-celular-intermediario-o-que-muda` | guia | 605 | 0 | sim | 0 | 2026-09-10 | 605 palavras (faltam 195+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 16 | `carregador-usb-c-rapido-sem-fritar-bateria` | guia | 716 | 0 | sim | 0 | 2026-09-08 | 716 palavras (faltam 84+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 17 | `monitor-144hz-full-hd-vs-1440p` | comparativo | 609 | 0 | sim | 0 | 2026-09-05 | 609 palavras (faltam 191+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 18 | `minecraft-the-sift-quarta-dimensao-2027` | noticia | 750 | 2 | não | 11 | 2026-09-26 | 750 palavras (faltam 50+); sem link para guia | pendente |
| 19 | `apple-homepod-mini-2-chip-s10-siri-ai` | noticia | 763 | 2 | não | 10 | 2026-10-11 | 763 palavras (faltam 37+); sem link para guia | pendente |
| 20 | `whatsapp-chamadas-video-sem-conta` | noticia | 769 | 2 | não | 7 | 2026-10-14 | 769 palavras (faltam 31+); sem link para guia | pendente |


### Lote 3 — 30/11/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 21 | `mac-mini-m6-ssd-soldado` | noticia | 672 | 5 | não | 6 | 2026-09-22 | 672 palavras (faltam 128+); sem link para guia | pendente |
| 22 | `spotify-audiolivros-brasil-12-horas-premium` | noticia | 620 | 2 | não | 4 | 2026-10-07 | 620 palavras (faltam 180+); sem link para guia | pendente |
| 23 | `google-gemini-limite-modelos-gratis-ai-plus` | noticia | 741 | 5 | não | 4 | 2026-10-04 | 741 palavras (faltam 59+); sem link para guia | pendente |
| 24 | `capcom-re-engine-projeto-rex-ia` | noticia | 715 | 4 | não | 3 | 2026-10-03 | 715 palavras (faltam 85+); sem link para guia | pendente |
| 25 | `the-doll-shop-lancamento-steam-atelier-sento` | noticia | 786 | 2 | não | 2 | 2026-10-12 | 786 palavras (faltam 14+); sem link para guia | pendente |
| 26 | `google-beam-uso-20-locais-familias-militares` | noticia | 638 | 0 | sim | 1 | 2026-10-26 | 638 palavras (faltam 162+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 27 | `valor-mortis-lancamento-steam-one-more-level` | noticia | 780 | 5 | não | 1 | 2026-10-13 | 780 palavras (faltam 20+); sem link para guia | pendente |
| 28 | `squadron-42-steam-lancamento-2027` | noticia | 753 | 3 | não | 1 | 2026-10-11 | 753 palavras (faltam 47+); sem link para guia | pendente |
| 29 | `microsoft-testa-xbox-pc-garrison-mais-rapido` | noticia | 787 | 2 | não | 1 | 2026-10-10 | 787 palavras (faltam 13+); sem link para guia | pendente |
| 30 | `gigabyte-ai-top-100-b850-desktop` | noticia | 655 | 2 | não | 1 | 2026-10-04 | 655 palavras (faltam 145+); sem link para guia | pendente |


### Lote 4 — 01/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 31 | `governo-pede-anpd-companheiros-ia` | noticia | 646 | 4 | não | 1 | 2026-09-21 | 646 palavras (faltam 154+); sem link para guia | pendente |
| 32 | `anthropic-s1-ipo-nasdaq-ant-receita-prejuizo` | noticia | 647 | 0 | sim | 0 | 2026-10-27 | 647 palavras (faltam 153+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 33 | `nvidia-amd-investem-us-4-bilhoes-meta-muse` | noticia | 752 | 0 | sim | 0 | 2026-10-27 | 752 palavras (faltam 48+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 34 | `ipad-mini-a20-pro-oled-85-polegadas` | noticia | 692 | 0 | sim | 0 | 2026-10-26 | 692 palavras (faltam 108+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 35 | `meta-oferta-us-35-bilhoes-expansao-ia` | noticia | 648 | 0 | sim | 0 | 2026-10-26 | 648 palavras (faltam 152+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 36 | `mistral-voxtral-3-agentes-de-voz` | noticia | 602 | 0 | sim | 0 | 2026-10-26 | 602 palavras (faltam 198+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 37 | `micron-g11-nand-400-camadas-densidade-dobro` | noticia | 664 | 0 | sim | 0 | 2026-10-25 | 664 palavras (faltam 136+); 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 38 | `samsung-galaxy-f70-5g-india` | noticia | 617 | 1 | sim | 0 | 2026-10-19 | 617 palavras (faltam 183+); 1 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 39 | `meta-anuncia-modelos-muse-wonder-full` | noticia | 779 | 3 | não | 0 | 2026-10-12 | 779 palavras (faltam 21+); sem link para guia | pendente |
| 40 | `next-time-ill-work-from-home-estreia-steam` | noticia | 722 | 2 | não | 0 | 2026-10-11 | 722 palavras (faltam 78+); sem link para guia | pendente |


### Lote 5 — 02/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 41 | `china-restringe-chatbots-namoro-amizade-ia` | noticia | 755 | 2 | não | 0 | 2026-10-10 | 755 palavras (faltam 45+); sem link para guia | pendente |
| 42 | `cloudflare-compra-deno-workers-celld` | noticia | 709 | 2 | não | 0 | 2026-10-10 | 709 palavras (faltam 91+); sem link para guia | pendente |
| 43 | `google-synthid-detector-global-ia` | noticia | 700 | 5 | não | 0 | 2026-10-07 | 700 palavras (faltam 100+); sem link para guia | pendente |
| 44 | `apple-iphone-18-pro-max-troca-falha-rede-att` | noticia | 778 | 6 | não | 0 | 2026-10-04 | 778 palavras (faltam 22+); sem link para guia | pendente |
| 45 | `end-of-abyss-lancamento-hoje` | noticia | 756 | 8 | não | 0 | 2026-10-01 | 756 palavras (faltam 44+); sem link para guia | pendente |
| 46 | `anthropic-501-votos-fundadores-antes-do-ipo` | noticia | 797 | 5 | não | 0 | 2026-09-25 | 797 palavras (faltam 3+); sem link para guia | pendente |
| 47 | `dune-awakening-ps5-xbox-hoje` | noticia | 737 | 6 | não | 0 | 2026-09-22 | 737 palavras (faltam 63+); sem link para guia | pendente |
| 48 | `importar-ayaneo-ou-ayn-brasil` | guia | 905 | 9 | sim | 51 | 2026-09-26 | sem ângulo Brasil/R$ | pendente |
| 49 | `armazenamento-128-ou-256-gb-celular` | guia | 785 | 3 | sim | 10 | 2026-09-14 | 785 palavras (faltam 15+) | pendente |
| 50 | `o-que-nao-colar-no-chat-de-ia` | guia | 729 | 3 | sim | 9 | 2026-09-11 | 729 palavras (faltam 71+) | pendente |


### Lote 6 — 03/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 51 | `rtx-3050-vs-4050-notebook` | comparativo | 901 | 0 | sim | 7 | 2026-09-15 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 52 | `windows-11-pc-fraco-o-que-desligar` | guia | 748 | 3 | sim | 2 | 2026-09-06 | 748 palavras (faltam 52+) | pendente |
| 53 | `antivirus-windows-2026-precisa-pagar` | guia | 744 | 3 | sim | 2 | 2026-09-05 | 744 palavras (faltam 56+) | pendente |
| 54 | `switch-2-vale-a-pena-2026-brasil` | guia | 709 | 2 | sim | 1 | 2026-11-01 | 709 palavras (faltam 91+) | pendente |
| 55 | `mini-pc-quando-substitui-o-desktop` | guia | 921 | 0 | sim | 1 | 2026-09-19 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 56 | `placa-de-video-usada-brasil-checklist` | guia | 905 | 0 | sim | 1 | 2026-09-13 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 57 | `emular-no-steam-deck-expectativa-real` | guia | 789 | 3 | sim | 1 | 2026-08-31 | 789 palavras (faltam 11+) | pendente |
| 58 | `kingston-nv3-1tb-vale-a-pena-2026-brasil` | guia | 719 | 3 | sim | 0 | 2026-11-01 | 719 palavras (faltam 81+) | pendente |
| 59 | `notebook-usado-empresarial-checklist` | guia | 1057 | 11 | sim | 0 | 2026-09-25 | sem ângulo Brasil/R$ | pendente |
| 60 | `all-in-one-escritorio-pequeno` | guia | 930 | 0 | sim | 0 | 2026-09-24 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |


### Lote 7 — 04/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 61 | `pc-trabalho-remoto-configuracao-enxuta` | guia | 969 | 0 | sim | 0 | 2026-09-23 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 62 | `notebook-2-em-1-vale-a-pena` | guia | 892 | 0 | sim | 0 | 2026-09-21 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 63 | `pc-edicao-de-video-ate-6-mil` | guia | 969 | 0 | sim | 0 | 2026-09-20 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 64 | `ultrabook-faculdade-bateria-tela-teclado` | guia | 805 | 0 | sim | 0 | 2026-09-19 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 65 | `notebook-gamer-ate-7-mil-brasil` | guia | 932 | 0 | sim | 0 | 2026-09-18 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 66 | `pc-gamer-ate-4-mil-2026` | guia | 909 | 0 | sim | 0 | 2026-09-18 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 67 | `fonte-rtx-4060-e-4070-quantos-watts` | guia | 908 | 0 | sim | 0 | 2026-09-17 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 68 | `gabinete-fluxo-de-ar-ate-400` | guia | 839 | 0 | sim | 0 | 2026-09-17 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 69 | `celular-melhor-camera-ate-3-mil` | guia | 755 | 7 | sim | 0 | 2026-09-16 | 755 palavras (faltam 45+) | pendente |
| 70 | `rtx-4070-super-usada-vs-5070-nova` | comparativo | 872 | 0 | sim | 0 | 2026-09-13 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |


### Lote 8 — 05/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 71 | `placa-mae-b650-barata-upgrade-ryzen` | guia | 907 | 0 | sim | 0 | 2026-09-12 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 72 | `ram-16-ou-32-gb-2026` | guia | 916 | 0 | sim | 0 | 2026-09-11 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 73 | `ryzen-5-7600-vs-core-i5-custo-brasil` | comparativo | 935 | 0 | sim | 0 | 2026-09-11 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 74 | `rtx-4060-vs-5060-brasil` | comparativo | 922 | 0 | sim | 0 | 2026-09-10 | 0 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 75 | `nuvem-gratis-drive-onedrive-icloud` | guia | 743 | 3 | sim | 0 | 2026-09-08 | 743 palavras (faltam 57+) | pendente |
| 76 | `windows-no-handheld-vs-steamos` | guia | 704 | 2 | sim | 0 | 2026-09-03 | 704 palavras (faltam 96+) | pendente |
| 77 | `agente-ia-permissoes-que-nao-dar` | guia | 762 | 3 | sim | 0 | 2026-08-18 | 762 palavras (faltam 38+) | pendente |
| 78 | `whatsapp-grupos-fixar-historico-status-mencoes` | noticia | 652 | 3 | sim | 23 | 2026-10-30 | 652 palavras (faltam 148+) | pendente |
| 79 | `android-sms-of-death-correcao-distribuicao` | noticia | 767 | 7 | sim | 21 | 2026-10-30 | 767 palavras (faltam 33+) | pendente |
| 80 | `gemini-hackeou-tres-empresas-teste` | noticia | 700 | 5 | sim | 11 | 2026-09-19 | 700 palavras (faltam 100+) | pendente |


### Lote 9 — 06/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 81 | `chatgpt-duas-contas-ios-android` | noticia | 788 | 6 | sim | 9 | 2026-11-01 | 788 palavras (faltam 12+) | pendente |
| 82 | `ibuypower-mini-pc-pro-amd-ai-halo` | noticia | 732 | 2 | sim | 9 | 2026-10-09 | 732 palavras (faltam 68+) | pendente |
| 83 | `castlevania-belmonts-curse-steam-preco` | noticia | 792 | 4 | sim | 8 | 2026-10-16 | 792 palavras (faltam 8+) | pendente |
| 84 | `qubit-leitura-milimetrica-fidelidade` | noticia | 717 | 5 | sim | 4 | 2026-10-31 | 717 palavras (faltam 83+) | pendente |
| 85 | `microsoft-abandona-nscale-essex` | noticia | 602 | 2 | sim | 4 | 2026-10-19 | 602 palavras (faltam 198+) | pendente |
| 86 | `google-universal-cart-carrinho-unico-eua` | noticia | 666 | 3 | sim | 4 | 2026-10-16 | 666 palavras (faltam 134+) | pendente |
| 87 | `rog-xbox-ally-x20-oled-1300-dolares` | noticia | 691 | 4 | sim | 4 | 2026-10-16 | 691 palavras (faltam 109+) | pendente |
| 88 | `apple-alertas-spyware-99-paises` | noticia | 753 | 7 | sim | 3 | 2026-10-30 | 753 palavras (faltam 47+) | pendente |
| 89 | `almalinux-kernel-ipv4-correcao-testing` | noticia | 774 | 6 | sim | 2 | 2026-11-01 | 774 palavras (faltam 26+) | pendente |
| 90 | `deepseek-superagent-prototipo-codigo-aberto` | noticia | 754 | 8 | sim | 2 | 2026-11-01 | 754 palavras (faltam 46+) | pendente |


### Lote 10 — 07/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 91 | `lancamentos-games-2026-11-01` | noticia | 773 | 7 | sim | 2 | 2026-11-01 | 773 palavras (faltam 27+) | pendente |
| 92 | `linux-mint-hibernacao-superlight-previa` | noticia | 765 | 7 | sim | 2 | 2026-11-01 | 765 palavras (faltam 35+) | pendente |
| 93 | `planassist-teste-licenciamento-humano` | noticia | 792 | 5 | sim | 2 | 2026-10-31 | 792 palavras (faltam 8+) | pendente |
| 94 | `amazon-torchneuron-pytorch-trainium` | noticia | 682 | 2 | sim | 2 | 2026-10-19 | 682 palavras (faltam 118+) | pendente |
| 95 | `minisforum-atomman-g1-pro-rx9060xt` | noticia | 740 | 2 | sim | 2 | 2026-09-30 | 740 palavras (faltam 60+) | pendente |
| 96 | `claude-ultra-limite-semanal-conta-verificada` | noticia | 716 | 8 | sim | 1 | 2026-11-01 | 716 palavras (faltam 84+) | pendente |
| 97 | `ivanti-connect-secure-cisa-falhas-exploradas` | noticia | 730 | 9 | sim | 1 | 2026-11-01 | 730 palavras (faltam 70+) | pendente |
| 98 | `aura-autopilot-testes-jogos-benchmark` | noticia | 768 | 6 | sim | 1 | 2026-10-31 | 768 palavras (faltam 32+) | pendente |
| 99 | `cursor-extensao-claude-remediacao` | noticia | 743 | 4 | sim | 1 | 2026-10-31 | 743 palavras (faltam 57+) | pendente |
| 100 | `entire-brasil-codigo-sao-paulo` | noticia | 761 | 8 | sim | 1 | 2026-10-31 | 761 palavras (faltam 39+) | pendente |


### Lote 11 — 08/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 101 | `microscopia-quimica-3d-celulas-velocidade` | noticia | 752 | 6 | sim | 1 | 2026-10-31 | 752 palavras (faltam 48+) | pendente |
| 102 | `seti-agentes-observatorio-sinal-nao-vida` | noticia | 767 | 7 | sim | 1 | 2026-10-31 | 767 palavras (faltam 33+) | pendente |
| 103 | `silver-palace-data-lojas-divergencia` | noticia | 776 | 4 | sim | 1 | 2026-10-31 | 776 palavras (faltam 24+) | pendente |
| 104 | `world-of-horror-update-pc-consoles` | noticia | 762 | 6 | sim | 1 | 2026-10-31 | 762 palavras (faltam 38+) | pendente |
| 105 | `firefox-ia-correcoes-janela-vulnerabilidade` | noticia | 764 | 5 | sim | 1 | 2026-10-30 | 764 palavras (faltam 36+) | pendente |
| 106 | `romero-shooter-nova-editora-equipe-menor` | noticia | 752 | 6 | sim | 1 | 2026-10-30 | 752 palavras (faltam 48+) | pendente |
| 107 | `geely-google-gemini-maps-play-painel-2027` | noticia | 649 | 2 | sim | 1 | 2026-10-24 | 649 palavras (faltam 151+) | pendente |
| 108 | `stripe-treasury-agentes-ia` | noticia | 652 | 3 | sim | 1 | 2026-10-21 | 652 palavras (faltam 148+) | pendente |
| 109 | `xbox-fsr-41-series-ally` | noticia | 670 | 3 | sim | 1 | 2026-10-20 | 670 palavras (faltam 130+) | pendente |
| 110 | `android-protecao-golpes-google` | noticia | 696 | 3 | sim | 1 | 2026-10-17 | 696 palavras (faltam 104+) | pendente |


### Lote 12 — 09/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 111 | `cpu-usada-banimento-anticheat-valorant` | noticia | 739 | 4 | sim | 1 | 2026-10-03 | 739 palavras (faltam 61+) | pendente |
| 112 | `falso-site-tse-golpe-pix-dados-reais` | noticia | 684 | 3 | sim | 1 | 2026-10-03 | 684 palavras (faltam 116+) | pendente |
| 113 | `caixa-vida-previdencia-incidente-dados` | noticia | 910 | 7 | sim | 0 | 2026-11-12 | sem ângulo Brasil/R$ | pendente |
| 114 | `crimson-desert-20403-hotfix-plataformas` | noticia | 787 | 5 | sim | 0 | 2026-11-01 | 787 palavras (faltam 13+) | pendente |
| 115 | `garmin-fenix-9-beta-escalada-alerta` | noticia | 755 | 6 | sim | 0 | 2026-11-01 | 755 palavras (faltam 45+) | pendente |
| 116 | `nasa-chapea-simulacao-marte-378-dias` | noticia | 761 | 7 | sim | 0 | 2026-11-01 | 761 palavras (faltam 39+) | pendente |
| 117 | `nvs-03-primeira-manobra-orbita-navic` | noticia | 753 | 7 | sim | 0 | 2026-11-01 | 753 palavras (faltam 47+) | pendente |
| 118 | `particledb-jepsen-falhas-versoes-testadas` | noticia | 757 | 7 | sim | 0 | 2026-11-01 | 757 palavras (faltam 43+) | pendente |
| 119 | `wine-1121-opengl-jogos-correcao` | noticia | 745 | 7 | sim | 0 | 2026-11-01 | 745 palavras (faltam 55+) | pendente |
| 120 | `apache-mina-3-falha-sem-correcao` | noticia | 756 | 7 | sim | 0 | 2026-10-31 | 756 palavras (faltam 44+) | pendente |


### Lote 13 — 10/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 121 | `apple-intelligence-china-qwen-testes` | noticia | 711 | 6 | sim | 0 | 2026-10-31 | 711 palavras (faltam 89+) | pendente |
| 122 | `applebees-senha-aplicativo-dados-expostos` | noticia | 717 | 5 | sim | 0 | 2026-10-31 | 717 palavras (faltam 83+) | pendente |
| 123 | `chainalysis-incidente-dados-clientes` | noticia | 746 | 5 | sim | 0 | 2026-10-31 | 746 palavras (faltam 54+) | pendente |
| 124 | `gemini-slides-edicao-lote-ingles` | noticia | 758 | 5 | sim | 0 | 2026-10-31 | 758 palavras (faltam 42+) | pendente |
| 125 | `jrc-quantica-maturidade-sinais` | noticia | 731 | 5 | sim | 0 | 2026-10-31 | 731 palavras (faltam 69+) | pendente |
| 126 | `northflank-incidente-rotacao-segredos-cobrancas` | noticia | 742 | 8 | sim | 0 | 2026-10-31 | 742 palavras (faltam 58+) | pendente |
| 127 | `nothing-os-5-android-17-lotes` | noticia | 705 | 7 | sim | 0 | 2026-10-31 | 705 palavras (faltam 95+) | pendente |
| 128 | `pikmin-day-curtas-hello-nintendo` | noticia | 739 | 7 | sim | 0 | 2026-10-31 | 739 palavras (faltam 61+) | pendente |
| 129 | `the-duskbloods-adiado-2027` | noticia | 715 | 6 | sim | 0 | 2026-10-31 | 715 palavras (faltam 85+) | pendente |
| 130 | `windows-search-acoes-teste-android` | noticia | 710 | 5 | sim | 0 | 2026-10-31 | 710 palavras (faltam 90+) | pendente |


### Lote 14 — 11/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 131 | `anatel-infraestrutura-critica-consulta-publica` | noticia | 755 | 5 | sim | 0 | 2026-10-30 | 755 palavras (faltam 45+) | pendente |
| 132 | `binance-incidente-saques-impacto-bilhoes` | noticia | 729 | 5 | sim | 0 | 2026-10-30 | 729 palavras (faltam 71+) | pendente |
| 133 | `chrome-156-corrige-falha-critica-mediastream` | noticia | 753 | 4 | sim | 0 | 2026-10-30 | 753 palavras (faltam 47+) | pendente |
| 134 | `dualsense-prism-transparente-ps5-preco` | noticia | 645 | 4 | sim | 0 | 2026-10-30 | 645 palavras (faltam 155+) | pendente |
| 135 | `edge-abertura-acelerada-processo-ativo` | noticia | 743 | 7 | sim | 0 | 2026-10-30 | 743 palavras (faltam 57+) | pendente |
| 136 | `elevenlabs-sfx-v3-acesso-limitado` | noticia | 759 | 7 | sim | 0 | 2026-10-30 | 759 palavras (faltam 41+) | pendente |
| 137 | `gemini-editar-arquivos-pdf-direto` | noticia | 741 | 4 | sim | 0 | 2026-10-30 | 741 palavras (faltam 59+) | pendente |
| 138 | `google-suncatcher-primeira-resposta-orbita` | noticia | 692 | 7 | sim | 0 | 2026-10-30 | 692 palavras (faltam 108+) | pendente |
| 139 | `hubble-nasa-consulta-manutencao-orbita` | noticia | 750 | 7 | sim | 0 | 2026-10-30 | 750 palavras (faltam 50+) | pendente |
| 140 | `intel-receita-datacenter-pcs-trimestre` | noticia | 768 | 4 | sim | 0 | 2026-10-30 | 768 palavras (faltam 32+) | pendente |


### Lote 15 — 12/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 141 | `mistral-large-4-pesos-abertos-licenca` | noticia | 760 | 5 | sim | 0 | 2026-10-30 | 760 palavras (faltam 40+) | pendente |
| 142 | `openai-google-robots-treinamento-ia` | noticia | 790 | 6 | sim | 0 | 2026-10-30 | 790 palavras (faltam 10+) | pendente |
| 143 | `samsung-foundry-2nm-clientes-nuvem` | noticia | 730 | 6 | sim | 0 | 2026-10-30 | 730 palavras (faltam 70+) | pendente |
| 144 | `toyota-waymo-bz4x-testes-japao-2027` | noticia | 783 | 4 | sim | 0 | 2026-10-30 | 783 palavras (faltam 17+) | pendente |
| 145 | `tracers-reconexao-magnetica-primeiros-resultados` | noticia | 727 | 4 | sim | 0 | 2026-10-30 | 727 palavras (faltam 73+) | pendente |
| 146 | `wolfspeed-carbeto-silicio-transparente-realidade-aumentada` | noticia | 681 | 3 | sim | 0 | 2026-10-30 | 681 palavras (faltam 119+) | pendente |
| 147 | `google-connected-apps-gemini-busca-previa` | noticia | 624 | 4 | sim | 0 | 2026-10-29 | 624 palavras (faltam 176+) | pendente |
| 148 | `nvidia-nemotron-transcribe-audio-gravado-portugues` | noticia | 630 | 6 | sim | 0 | 2026-10-29 | 630 palavras (faltam 170+) | pendente |
| 149 | `canva-craft-modelo-proprio-imagens-2k` | noticia | 620 | 2 | sim | 0 | 2026-10-24 | 620 palavras (faltam 180+) | pendente |
| 150 | `duckdb-2-0-lts-quack-variant-modo-agente` | noticia | 809 | 1 | sim | 0 | 2026-10-24 | 1 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |


### Lote 16 — 13/12/2026

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 151 | `minimax-deepseek-registro-exportacao-ia-codigo-aberto` | noticia | 623 | 2 | sim | 0 | 2026-10-24 | 623 palavras (faltam 177+) | pendente |
| 152 | `claude-duet-agente-anthropic` | noticia | 619 | 3 | sim | 0 | 2026-10-22 | 619 palavras (faltam 181+) | pendente |
| 153 | `anthropic-fundo-beneficio-publico-acoes` | noticia | 713 | 2 | sim | 0 | 2026-10-19 | 713 palavras (faltam 87+) | pendente |
| 154 | `deepseek-v4-1-flash-1017-pesos-abertos` | noticia | 706 | 3 | sim | 0 | 2026-10-18 | 706 palavras (faltam 94+) | pendente |
| 155 | `meta-ai-tse-multa-500-mil-dia` | noticia | 794 | 2 | sim | 0 | 2026-10-17 | 794 palavras (faltam 6+) | pendente |
| 156 | `nvidia-nemotron-3-5-ia-local-pc` | noticia | 679 | 3 | sim | 0 | 2026-10-17 | 679 palavras (faltam 121+) | pendente |
| 157 | `oppo-find-x10-estreia-global-21-outubro` | noticia | 686 | 3 | sim | 0 | 2026-10-17 | 686 palavras (faltam 114+) | pendente |
| 158 | `redmi-k100-bateria-recorde-bose` | noticia | 729 | 4 | sim | 0 | 2026-10-16 | 729 palavras (faltam 71+) | pendente |
| 159 | `xreal-1-pro-plus-1200-nits-mesmo-preco` | noticia | 795 | 4 | sim | 0 | 2026-10-16 | 795 palavras (faltam 5+) | pendente |
| 160 | `ps5-pro-sorteio-japao-60h` | noticia | 756 | 4 | sim | 0 | 2026-09-30 | 756 palavras (faltam 44+) | pendente |


## Parte B — só falta link para guia (52)

O corpo já cumpre o padrão (800+ palavras, 2+ fontes, ângulo BR). Falta um link para guia do mesmo assunto. Faça em **2 PRs** (metade cada, em dois dias seguintes após o lote A de 28/11), uma frase curta antes de `## Fontes`, no formato: `Para <decisão do leitor>, veja o guia [Título do guia](/noticia/<slug-do-guia>).` Se não existe guia do mesmo assunto, deixe a linha em `sem guia do assunto` e não force link (a falta de guia vira pauta de guia novo).

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `on-hold-call-center-simulator-lancamento-steam` | noticia | 822 | 2 | não | 45 | 2026-10-10 | sem link para guia | pendente |
| 2 | `netflix-aumenta-precos-brasil-setenta-reais` | noticia | 1060 | 3 | não | 24 | 2026-10-15 | sem link para guia | pendente |
| 3 | `analogue-super-nt-mega-sg-plus-fpga-retro` | noticia | 1080 | 6 | não | 15 | 2026-10-17 | sem link para guia | pendente |
| 4 | `apple-iphone-duo-pre-venda-brasil-outubro` | noticia | 1159 | 6 | não | 13 | 2026-10-16 | sem link para guia | pendente |
| 5 | `droiddeck-steam-windows-android` | noticia | 1112 | 3 | não | 12 | 2026-10-14 | sem link para guia | pendente |
| 6 | `florida-pede-travar-modelo-novo-openai` | noticia | 1191 | 6 | não | 12 | 2026-09-28 | sem link para guia | pendente |
| 7 | `gta-6-trailer-lancamento-rockstar` | noticia | 805 | 8 | não | 7 | 2026-10-15 | sem link para guia | pendente |
| 8 | `epic-games-launcher-ia-linux` | noticia | 809 | 2 | não | 7 | 2026-10-14 | sem link para guia | pendente |
| 9 | `pinball-fx-vr-chega-steam` | noticia | 812 | 4 | não | 7 | 2026-10-14 | sem link para guia | pendente |
| 10 | `amazon-kindle-2026-tela-plana-aluminio` | noticia | 1038 | 5 | não | 5 | 2026-10-01 | sem link para guia | pendente |
| 11 | `asus-googlebook-14-analise-hardware-software` | noticia | 1355 | 6 | não | 4 | 2026-10-15 | sem link para guia | pendente |
| 12 | `qualcomm-vence-arm-processo-usd-2-indenizacao` | noticia | 817 | 3 | não | 3 | 2026-10-14 | sem link para guia | pendente |
| 13 | `ace-combat-8-hoje` | noticia | 819 | 8 | não | 3 | 2026-10-02 | sem link para guia | pendente |
| 14 | `reddit-encerra-rss-bloqueia-old-reddit` | noticia | 849 | 5 | não | 3 | 2026-09-30 | sem link para guia | pendente |
| 15 | `openai-dots-pro-sem-custo-extra` | noticia | 921 | 5 | não | 3 | 2026-09-29 | sem link para guia | pendente |
| 16 | `apple-taction-57-bi-taptic-iphone-watch` | noticia | 1057 | 6 | não | 3 | 2026-09-26 | sem link para guia | pendente |
| 17 | `google-play-cria-apps-ia-studio-android-sem-conta-dev` | noticia | 830 | 5 | não | 2 | 2026-10-13 | sem link para guia | pendente |
| 18 | `adobe-photoshop-lightroom-gemini-so-ingles` | noticia | 938 | 4 | não | 2 | 2026-09-25 | sem link para guia | pendente |
| 19 | `copilot-home-code-autopilot-previa` | noticia | 832 | 3 | não | 2 | 2026-09-25 | sem link para guia | pendente |
| 20 | `firecrawl-75-mi-alexandria-brasil-2027` | noticia | 954 | 6 | não | 2 | 2026-09-22 | sem link para guia | pendente |
| 21 | `discord-tira-apps-bloqueio-video-anpd` | noticia | 966 | 6 | não | 2 | 2026-09-21 | sem link para guia | pendente |
| 22 | `no-mans-sky-iphone-ipad-lancamento-outubro` | noticia | 900 | 8 | não | 1 | 2026-10-12 | sem link para guia | pendente |
| 23 | `rtx-spark-superchip-laptops-desktops` | noticia | 1129 | 6 | não | 1 | 2026-10-02 | sem link para guia | pendente |
| 24 | `strands-decider-2b-aws` | noticia | 925 | 6 | não | 1 | 2026-10-02 | sem link para guia | pendente |
| 25 | `keep-driving-ps5-xbox-hoje` | noticia | 934 | 7 | não | 1 | 2026-09-28 | sem link para guia | pendente |
| 26 | `gemini-flipkart-botao-comprar-india` | noticia | 895 | 6 | não | 1 | 2026-09-27 | sem link para guia | pendente |
| 27 | `nomori-stick-it-to-the-stickman-hoje` | noticia | 1035 | 14 | não | 1 | 2026-09-23 | sem link para guia | pendente |
| 28 | `openai-anthropic-brasil-fora-mythos-daybreak` | noticia | 1519 | 11 | não | 1 | 2026-09-23 | sem link para guia | pendente |
| 29 | `googlebook-pre-venda-899-sem-brasil` | noticia | 1408 | 7 | não | 1 | 2026-09-21 | sem link para guia | pendente |
| 30 | `adobe-google-acrobat-gmail-drive-anuncio` | noticia | 969 | 8 | não | 0 | 2026-11-11 | sem link para guia | pendente |
| 31 | `gired-leilao-190-localidades-limites` | noticia | 998 | 8 | não | 0 | 2026-11-11 | sem link para guia | pendente |
| 32 | `novo-app-caixa-previa-caixa-tem` | noticia | 1084 | 8 | não | 0 | 2026-11-11 | sem link para guia | pendente |
| 33 | `call-of-duty-modern-warfare-4-acesso-antecipado` | noticia | 862 | 5 | não | 0 | 2026-10-17 | sem link para guia | pendente |
| 34 | `tales-of-eternia-remastered-lancamento-steam` | noticia | 1076 | 5 | não | 0 | 2026-10-16 | sem link para guia | pendente |
| 35 | `tse-aprova-regras-whatsapp-campanhas` | noticia | 958 | 3 | não | 0 | 2026-10-16 | sem link para guia | pendente |
| 36 | `amazon-lanca-gravadores-ia-bee` | noticia | 944 | 6 | não | 0 | 2026-10-15 | sem link para guia | pendente |
| 37 | `funcionario-openai-preso-escuta-sala-reuniao` | noticia | 901 | 4 | não | 0 | 2026-10-13 | sem link para guia | pendente |
| 38 | `apple-homeview-hub-casa-inteligente-a18` | noticia | 826 | 2 | não | 0 | 2026-10-11 | sem link para guia | pendente |
| 39 | `satya-nadella-microsoft-modelos-ia-comprometidos-freio-emergencia` | noticia | 836 | 3 | não | 0 | 2026-10-11 | sem link para guia | pendente |
| 40 | `dynasty-warriors-3-remastered-hoje` | noticia | 927 | 9 | não | 0 | 2026-09-30 | sem link para guia | pendente |
| 41 | `ftc-investiga-openai-anthropic-seguranca` | noticia | 859 | 7 | não | 0 | 2026-09-30 | sem link para guia | pendente |
| 42 | `minecraft-dungeons-ii-hoje` | noticia | 1644 | 21 | não | 0 | 2026-09-29 | sem link para guia | pendente |
| 43 | `amd-world-labs-82-bi-acoes` | noticia | 1296 | 7 | não | 0 | 2026-09-28 | sem link para guia | pendente |
| 44 | `meta-enterprise-platform-desai-mongodb` | noticia | 1053 | 5 | não | 0 | 2026-09-28 | sem link para guia | pendente |
| 45 | `bill-gates-acordo-ia-nuclear-kill-switch` | noticia | 1368 | 5 | não | 0 | 2026-09-27 | sem link para guia | pendente |
| 46 | `china-rtx-pro-5500-alibaba-bytedance` | noticia | 974 | 4 | não | 0 | 2026-09-27 | sem link para guia | pendente |
| 47 | `muse-charm-5g-sem-preco-v0` | noticia | 1306 | 6 | não | 0 | 2026-09-24 | sem link para guia | pendente |
| 48 | `ray-ban-meta-audio-sem-camera-us-349` | noticia | 929 | 5 | não | 0 | 2026-09-24 | sem link para guia | pendente |
| 49 | `tiktok-tira-79-mi-videos-eca-digital` | noticia | 1354 | 8 | não | 0 | 2026-09-23 | sem link para guia | pendente |
| 50 | `microsoft-desmonta-eviltokens` | noticia | 1142 | 6 | não | 0 | 2026-09-22 | sem link para guia | pendente |
| 51 | `google-multa-403-milhoes-localizacao` | noticia | 1035 | 5 | não | 0 | 2026-09-21 | sem link para guia | pendente |
| 52 | `morgan-stanley-brasil-hub-data-center` | noticia | 1085 | 6 | não | 0 | 2026-09-21 | sem link para guia | pendente |

## Parte C — triagem (8)

Notícia com mais de 45 dias, 0 impressões no Google em 28 dias e corpo curto ou sem fonte/guia. Tente aprofundar só se achar fato novo e 2 fontes primárias em 15 minutos; caso contrário `noindex: true` (um único PR com todas as que forem para noindex).

| # | slug | formato | palavras | fontes ext. | guia | impr. 28d | data | o que falta | status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `kaist-microsoft-ia-ondas-cerebrais-nva` | noticia | 662 | 1 | não | 0 | 2026-10-04 | 662 palavras (faltam 138+); 1 fonte(s) externa(s) linkada(s) (precisa 2); sem link para guia | pendente |
| 2 | `google-docs-drive-suporte-nativo-markdown` | noticia | 654 | 3 | não | 0 | 2026-10-06 | 654 palavras (faltam 146+); sem link para guia | pendente |
| 3 | `google-gemini-calling-ligacoes-recados` | noticia | 648 | 2 | não | 0 | 2026-10-06 | 648 palavras (faltam 152+); sem link para guia | pendente |
| 4 | `agentes-ia-mensagens-texto-imessage-whatsapp` | noticia | 689 | 1 | sim | 0 | 2026-10-03 | 689 palavras (faltam 111+); 1 fonte(s) externa(s) linkada(s) (precisa 2) | pendente |
| 5 | `wpg-ravelin-hoje-steam` | noticia | 698 | 7 | não | 0 | 2026-09-27 | 698 palavras (faltam 102+); sem link para guia | pendente |
| 6 | `kartboard-dash-gratis-na-steam-hoje` | noticia | 652 | 8 | não | 0 | 2026-09-26 | 652 palavras (faltam 148+); sem link para guia | pendente |
| 7 | `graveyard-keeper-2-well-dweller-hoje` | noticia | 637 | 9 | não | 0 | 2026-09-22 | 637 palavras (faltam 163+); sem link para guia | pendente |
| 8 | `motorola-signature-27-hoje` | noticia | 640 | 6 | sim | 0 | 2026-09-22 | 640 palavras (faltam 160+) | pendente |
