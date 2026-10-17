# Capa travada (`cover_locked`)

Capa com foto real de produto não pode ser trocada por script.

## Como travar

No frontmatter do post:

```yaml
cover: "/images/posts/<slug>/cover.webp"
coverCredit: "Marca / Divulgação"
cover_locked: true
cover_source: real
```

Ao lado da capa fica o original sem marca: `public/images/posts/<slug>/cover.src.<ext>`.

## O que respeita a trava

- `scripts/generate-review-covers.ts` (`npm run covers`, inclusive com `--force`): pula o post.
- `scripts/derive-covers.mjs`: não gera derivado público do `cover.src.*`.
- `scripts/social/compose_ig_post.py` e, no box, `/workspace/ig-thezero/compose_ig_post.py` e `make_video.py`: se existir `cover.src.*` ao lado da capa, a arte usa esse arquivo e aplica a marca por cima dele. Nunca derivam de uma imagem já gerada.
- No site, a marca do The Zero é aplicada por CSS (`WatermarkedPhoto`), não gravada no arquivo.

## Checagem no CI

O `check-posts.mjs` (job `check-posts` no CI e `npm run check:posts` local) chama `scripts/check-cover-locks.mjs`. Ele falha se o PR altera ou apaga um arquivo `public/images/posts/<slug>/cover*` (inclusive o `.src`), ou muda `cover`, `coverCredit`, `cover_locked` ou `cover_source`, num post que está travado na `main`.

Para liberar uma troca intencional, use uma das opções:

- coloque o rótulo `allow-cover-change` no PR e rode o job de novo (ou edite o corpo do PR, que dispara a checagem);
- ou adicione a um commit do PR o trailer `Allow-Cover-Change: <slug>` (ou `Allow-Cover-Change: all`).

## Por que existe

Em 26/09/2026 o PR #73 (`ba4a468`) pôs fotos reais nas capas dos reviews de portáteis, mas deixou os arquivos em `public/covers/reviews/<slug>.webp`, a pasta dos cartazes gerados. O script `generate-review-covers.ts` trata tudo que está em `/covers/` como cartaz dele. Nos PRs de logo de 15/10/2026 (#263 `3586eb2`, depois #265, #266, #267 e #268), o script rodou com `--force` para redesenhar a marca e sobrescreveu as fotos com cartazes. O frontmatter não mudou (o `coverCredit` continuou dizendo "Divulgação"), então ninguém viu.
