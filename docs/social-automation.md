# Publicação no Instagram e no Threads

Depois do squash na `main`, `.github/workflows/social-post.yml` publica a matéria nova. O volume e o texto continuam os do bloco `SOCIAL PACKAGE` do PR. X não entra: o campo `threads_x` vai só para o Threads.

O workflow também aceita **Run workflow** com o input `slug`, para repetir uma matéria que já está na `main`.

## O que acontece

1. O push na `main` lista os `content/posts/*.mdx` adicionados no intervalo do push. `workflow_dispatch` usa o slug informado.
2. O commit é ligado ao PR mergeado. O corpo é lido à prova de negrito, heading e bloco `|`. Sem `SOCIAL PACKAGE`, a matéria é ignorada. Pacote incompleto falha o job.
3. `draft: true` não é publicado: a URL não existe em produção.
4. `scripts/social/compose_ig_post.py` gera a arte **1080×1080** com a capa, o hook, o summary e o logo em `scripts/social/assets/`. O `compose_cmd` do PR não é executado.
5. A arte vai para a branch `social-assets` (`<slug>.png` e `<slug>.jpg`) e também para o artifact `ig-art-<run_id>`.
6. O job espera a imagem responder 200 (até 3 min) e `https://www.thezero.com.br/noticia/<slug>` responder 200 (até 15 min).
7. Confere o ledger e os posts recentes. Se o slug já saiu, não publica de novo.
8. Publica no Instagram (`caption_ig`) e depois no Threads (`threads_x` + a mesma imagem). O token do Threads é renovado no início da execução.
9. O resumo do job e um comentário no PR mergeado trazem os permalinks:

```markdown
## SOCIAL POSTED
slug: meu-slug
ig: https://www.instagram.com/p/...
threads: https://www.threads.net/...
```

Um push sem matéria nova (documentação, por exemplo) termina sem chamar a Meta.

## Onde a imagem fica

A arte **não** entra em `public/social/` na `main`. Um commit desse tipo dispararia o mesmo workflow de novo.

A opção usada é a branch **`social-assets`**, com URL pública:

`https://raw.githubusercontent.com/laviorg/thezero/social-assets/<slug>.jpg`

Por que esta, e não gerar a imagem no build do site:

- Hook e summary estão no corpo do PR, não no MDX. O build da Vercel não tem esses campos, a menos que a `main` ganhe outro commit — e esse commit reabriria o workflow.
- A URL fica pronta assim que o job empurra a branch, sem esperar o deploy da matéria. O job ainda espera a matéria em si, porque a legenda aponta para ela.
- O workflow só escuta a `main` e `workflow_dispatch`. Push em `social-assets` não o dispara. Push feito com `GITHUB_TOKEN` também não abre workflow novo.
- O repositório é público, então a Meta baixa o arquivo sem autenticação.
- O Instagram só aceita JPEG nessa API. O PNG é a arte original (o mesmo desenho do script). O JPG quality 92, 4:4:4, é o `image_url`. Os dois arquivos também sobem como artifact da execução.

Antes de publicar, o job baixa o JPEG (inclusive com o user-agent do crawler da Meta) e só segue se o corpo for JPEG.

O ledger fica na branch **`social-ledger`**, arquivo `ledger.json`. Além disso, o job olha as últimas publicações do Instagram e do Threads. Se a legenda já contém `/noticia/<slug>`, o slug conta como publicado e o permalink entra no ledger. As duas checagens cobrem reexecução do workflow e falha entre o post e a gravação do ledger.

## Secrets

Em **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Obrigatório para publicar | Valor |
| --- | --- | --- |
| `META_PAGE_TOKEN` | sim | Token de Página da Meta, de longa duração, com `instagram_basic`, `instagram_content_publish` e `pages_read_engagement`. Não é o token de usuário. |
| `IG_USER_ID` | sim | `17841405924071818` |
| `THREADS_TOKEN` | sim | Token de longa duração do Threads (vale 60 dias; o workflow semanal estende). |
| `THREADS_USER_ID` | sim | `28456331817354582` |
| `GH_PAT_SECRETS` | sim, para o token do Threads não vencer | PAT do dono. Clássico com escopo `repo`, ou fine-grained neste repositório com **Secrets: Read and write**. O `GITHUB_TOKEN` da Action não pode reescrever secrets. |

Nenhum workflow imprime esses valores. Erro de API passa por redação antes do log.

### META_PAGE_TOKEN e os IDs

1. No [Meta for Developers](https://developers.facebook.com/), use o app que já publica no `@hello.the.zero`.
2. Gere um token de **Página** (não de usuário) com as permissões acima e troque por um token de longa duração. Cole em `META_PAGE_TOKEN`.
3. `IG_USER_ID` é o id da conta profissional ligada à Página: `17841405924071818`.
4. No produto Threads, gere o token de longa duração do usuário `28456331817354582` e cole em `THREADS_TOKEN`.

### GH_PAT_SECRETS

1. GitHub → Settings do usuário → Developer settings → Personal access tokens.
2. Fine-grained: acesso só a `laviorg/thezero`, permissão **Secrets** Read and write. Clássico: escopo `repo`.
3. Crie o secret `GH_PAT_SECRETS` com esse PAT.
4. Rode **Actions → threads-token-refresh → Run workflow** uma vez, para gravar o token renovado.

O job semanal (segunda, 12:00 UTC) chama `GET https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token`. Se `GH_PAT_SECRETS` existe, cifra o token novo com a chave pública de secrets do repositório (sealed box libsodium, via PyNaCl) e faz `PUT /repos/laviorg/thezero/actions/secrets/THREADS_TOKEN`. Se o PAT não existe, o job falha de propósito, com aviso e sem mostrar o token: a renovação ficou só na memória e o secret guardado não foi estendido.

Cada publicação também renova o token para aquela execução. Quem persiste o valor no GitHub é o workflow semanal.

## O que o dono precisa fazer

- Criar os cinco secrets da tabela. Sem `GH_PAT_SECRETS`, o token do Threads deixa de ser gravado de volta e vence em até 60 dias.
- Manter o repositório **público**. Repositório privado faz o `raw.githubusercontent.com` pedir login, e a Meta não baixa a imagem.
- Não proteger `social-assets` nem `social-ledger` com review obrigatório. O `github-actions[bot]` precisa conseguir push nessas duas branches. A `main` pode continuar protegida.
- Não esperar post no X. Essa etapa foi cancelada.

O cron de renovação só passa a existir depois que este workflow estiver na `main`.

## Testes locais

```bash
pip install -r scripts/social/requirements.txt
npm run test:social
python3 scripts/social/compose_ig_post.py --cover public/images/posts/<slug>/cover.jpg --hook "..." --summary "..." --out /tmp/arte.png --size 1x1
```
