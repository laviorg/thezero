# Instruções para agentes

## Agente de matéria

Cada matéria nova entra como pull request: `content/posts/<slug>.mdx` e a capa em `public/images/posts/`. O corpo do PR leva dois blocos, nesta ordem: `FACT-CHECK` e `SOCIAL PACKAGE`.

Antes de abrir o PR, grave o corpo num arquivo e rode:

```bash
npm run check:posts -- --pr-body-file corpo-do-pr.md
```

O comando confere os posts alterados neste branch (capa, `coverAlt`, alts, links para `www.thezero.com.br`, frontmatter e data) e, quando a branch adiciona matéria, o bloco `FACT-CHECK`. Para varrer o arquivo inteiro: `npm run check:posts -- --all`.

Só abra o PR se esse comando passar com o mesmo corpo que vai no PR. O workflow `.github/workflows/check-posts.yml` repete a checagem em todo pull request que mexe em `content/posts/**`, `public/images/posts/**` ou no verificador. Editar o corpo do PR dispara a checagem de novo.

### FACT-CHECK

Abra a fonte primária de cada afirmação antes de marcar `ok`. Fonte primária é o documento original: página da empresa, nota oficial, filing, página da loja, transcrição, paper. Número, data, nome e citação entram cada um na própria linha. Não marque `ok` num dado que você não abriu. Se o original está público, não use como fonte um texto que só republica a notícia.

```markdown
## FACT-CHECK
- claim: A ficha lista 84 GB | source: https://www.nvidia.com/... | ok
- claim: A Reuters publicou em 27 de setembro de 2026 e não verificou o relato | source: https://www.reuters.com/... | ok
```

Uma linha por afirmação. Cada linha tem a afirmação, a URL `https://` da fonte primária e o status `ok` no fim. O verificador falha se o bloco não existir, se não houver nenhuma linha, ou se alguma linha não tiver URL ou não terminar em `ok`.

### SOCIAL PACKAGE

O workflow `.github/workflows/social-post.yml` lê este bloco depois do squash na `main`, monta a arte 1:1 e publica no Instagram e no Threads. X está cancelado: `threads_x` é só o texto do Threads. O `compose_cmd` pode continuar no bloco; a Action não executa esse comando. Ela chama `scripts/social/compose_ig_post.py`.

Limites das APIs: `caption_ig` até 2200 caracteres, `threads_x` até 500. Os dois levam a URL da matéria.

```markdown
## SOCIAL PACKAGE
- slug: meu-slug
- url: https://www.thezero.com.br/noticia/meu-slug
- cover_path: public/images/posts/meu-slug/cover.jpg
- hook: Uma frase curta para a arte
- summary: Uma ou duas frases sob o título da arte
- caption_ig: |
  Legenda do Instagram.

  https://www.thezero.com.br/noticia/meu-slug
- threads_x: |
  Texto do Threads.

  https://www.thezero.com.br/noticia/meu-slug
- compose_cmd: |
  python3 scripts/social/compose_ig_post.py --cover public/images/posts/meu-slug/cover.jpg --hook "Uma frase curta para a arte" --summary "Uma ou duas frases sob o título da arte" --out social-out/meu-slug.png --size 1x1
```

Campos de várias linhas usam `|` e ficam indentados, como no exemplo. Não coloque token, senha ou secret no corpo do PR.

A publicação automática está em [`docs/social-automation.md`](docs/social-automation.md).
