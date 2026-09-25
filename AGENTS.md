# Instruções para agentes

## Agente de matéria

Antes de abrir o PR de uma matéria nova ou alterada em `content/posts/*.mdx`, rode:

```bash
npm run check:posts
```

O comando confere os posts alterados neste branch (capa, `coverAlt`, alts, links para `www.thezero.com.br`, frontmatter e data). Para varrer o arquivo inteiro: `npm run check:posts -- --all`.

Só abra o PR se `npm run check:posts` passar. O workflow `.github/workflows/check-posts.yml` repete a checagem em todo pull request que mexe em `content/posts/**` ou `public/images/posts/**`.
