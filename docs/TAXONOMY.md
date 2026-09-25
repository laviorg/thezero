# Taxonomia editorial do The Zero

Decisão registrada em 18 de setembro de 2026. Esta taxonomia separa editorias
estáveis de assuntos mais específicos sem transformar o cabeçalho em um índice
de loja.

## Resumo da decisão

O The Zero passa a ter seis editorias:

| Slug | Rótulo | Regra editorial |
| --- | --- | --- |
| `tecnologia` | Tecnologia | A tese é o setor de tecnologia, uma aplicação científica, infraestrutura geral ou uma mudança transversal que não pertence com clareza às outras editorias. |
| `ia` | IA | A capacidade, o limite ou o efeito da inteligência artificial é a tese da matéria. |
| `computadores` | Computadores | PCs, notebooks, peças e periféricos são o objeto principal do teste. |
| `dispositivos` | Dispositivos | Tecnologia pessoal ou doméstica fora do universo de PC: celular, relógio, fone, TV e casa conectada. |
| `aplicativos` | Aplicativos | Um programa, sistema ou serviço digital resolve — ou atrapalha — a tarefa central. |
| `jogos` | Jogos | Jogos, consoles dedicados, lojas e a indústria de videogames. |

Cada matéria tem uma editoria primária e pode ter uma subcategoria pertencente
a ela. A taxonomia não usa categorias secundárias: assuntos transversais
continuam no `kicker` e no texto até existir uma necessidade comprovada de
tags.

Formato (`noticia`, `review`, `guia`, `comparativo`) é um campo de
frontmatter, não uma sétima editoria. Sem `format`, a matéria é `noticia`.
Reviews, guias e comparativos continuam na editoria do assunto e saem do
fluxo de notícias da home, do RSS e do Google News sitemap.

**Tecnologia é a rede de segurança, não o guarda-chuva padrão.** Ela recebe
cobertura mais ampla de indústria, ciência aplicada, infraestrutura geral,
tendências e pautas transversais quando a tese é “tech”, mas não especificamente
IA, PCs, tecnologia pessoal/doméstica, aplicativos ou jogos. Se uma das cinco
editorias específicas resolver a pauta, ela tem prioridade.

## Método e referências

A decisão combina:

1. inventário dos 19 MDX publicados;
2. teste de exclusividade: dois editores devem chegar à mesma editoria olhando
   para a tese, não apenas para as marcas citadas;
3. teste de escala: uma editoria deve continuar compreensível com centenas de
   matérias;
4. intenção de navegação em pt-BR: nomes reconhecíveis antes de nomes internos
   da indústria;
5. benchmark de veículos que mantêm poucos destinos globais e aprofundam a
   descoberta em páginas temáticas, como
   [The Verge Tech](https://www.theverge.com/tech),
   [The Verge AI](https://www.theverge.com/ai-artificial-intelligence),
   [Engadget Computing](https://www.engadget.com/category/computing/),
   [Engadget Mobile](https://www.engadget.com/category/mobile/) e
   [Engadget Gaming](https://www.engadget.com/category/gaming/). A segmentação
   brasileira de produtos também foi contrastada com as categorias técnicas do
   [Prêmio Canaltech 2026](https://canaltech.com.br/canaltech/9o-premio-canaltech-conheca-as-categorias-e-os-jurados-de-2026/).

O padrão aproveitado é hierárquico; os nomes e as fronteiras são próprios do
The Zero. Formatos como análise, guia ou notícia não viram editoria porque
descrevem como a pauta foi feita, não sobre o que ela trata.

## Diagnóstico do conjunto anterior

O conjunto plano era `ia`, `hardware`, `consoles`, `gadgets`, `apps` e `games`.
No arquivo anterior havia 5 matérias em IA, 2 em Hardware, 1 em Consoles, 3 em
Gadgets, 3 em Apps e 5 em Games.

Problemas:

- misturava tecnologia (`ia`), classe física (`hardware`/`gadgets`), plataforma
  (`consoles`) e software/conteúdo (`apps`/`games`) na mesma camada;
- usava quatro rótulos em inglês ou genéricos na navegação de um veículo
  brasileiro;
- `hardware` absorvia teclado e Steam Deck, mas deixava celular em `gadgets` e
  console em outra editoria sem uma regra de arquitetura clara;
- `consoles` e `games` separavam aparelho e jogo, porém uma matéria de Switch
  podia caber nos dois; o mesmo ocorria entre `ia` e um app com IA;
- não havia lugar explícito para componentes, periféricos, vestíveis, áudio,
  casa conectada ou sistemas operacionais;
- a camada plana forçaria novos itens no cabeçalho a cada expansão do arquivo;
- os slugs ingleses tinham pouco alinhamento com os rótulos que leitores
  brasileiros procuram e criavam dívida de URL.

## Subcategorias e escopo

### Tecnologia (`/tecnologia`)

| Slug | Rótulo | Escopo |
| --- | --- | --- |
| `industria` | Indústria | Fabricação, cadeias produtivas, padrões e bastidores do setor. |
| `ciencia-aplicada` | Ciência aplicada | Pesquisa e protótipos quando chegam ao uso real. |
| `infraestrutura` | Infraestrutura | Internet, redes, nuvem, data centers e energia fora de uma tese de IA. |
| `tendencias` | Tendências | Mudanças transversais de uso apoiadas por adoção ou dados. |
| `negocios` | Negócios | Empresas, aquisições, regulação, trabalho e modelos de negócio. |

### IA (`/ia`)

| Slug | Rótulo | Escopo |
| --- | --- | --- |
| `ferramentas` | Ferramentas | Assistentes, busca e automações avaliados no trabalho real. |
| `agentes` | Agentes | Sistemas que executam tarefas, permissões e autonomia. |
| `modelos` | Modelos | Capacidades, limites, benchmarks e custo dos modelos. |
| `infraestrutura` | Infraestrutura | Chips, nuvem, borda, data centers e operação. |
| `seguranca` | Segurança | Falhas, abuso, privacidade e proteção em sistemas de IA. |
| `negocios-e-politica` | Negócios e política | Empresas, regulação, trabalho e poder econômico. |

### Computadores (`/computadores`)

| Slug | Rótulo | Escopo |
| --- | --- | --- |
| `notebooks-e-pcs` | Notebooks e PCs | Máquinas prontas para trabalho, estudo, criação ou jogo. |
| `componentes` | Componentes | Processadores, GPUs, memória, armazenamento e refrigeração. |
| `perifericos` | Periféricos | Teclados, mouses, monitores, webcams, docks e acessórios. |
| `pcs-portateis` | PCs portáteis | Steam Deck e computadores de mão com ecossistema de PC. |
| `espaco-de-trabalho` | Espaço de trabalho | Ergonomia, mesas, múltiplas telas e escolhas físicas. |

### Dispositivos (`/dispositivos`)

| Slug | Rótulo | Escopo |
| --- | --- | --- |
| `celulares` | Celulares | Smartphones, câmera, bateria, acessórios e preço no Brasil. |
| `tablets` | Tablets | Tablets, canetas, teclados e usos da tela extra. |
| `vestiveis` | Vestíveis | Relógios, anéis, óculos e sensores usados no corpo. |
| `audio-pessoal` | Áudio pessoal | Fones, caixas portáteis e áudio que acompanha o usuário. |
| `casa-conectada` | Casa conectada | Automação, segurança e aparelhos domésticos conectados. |
| `tv-e-streaming` | TV e streaming | TVs, projetores, aparelhos de streaming e sala audiovisual. |
| `cameras-e-drones` | Câmeras e drones | Imagem dedicada, captação aérea e acessórios fora do celular. |

### Aplicativos (`/aplicativos`)

| Slug | Rótulo | Escopo |
| --- | --- | --- |
| `produtividade` | Produtividade | Organização, foco, notas e fluxos de trabalho. |
| `desenvolvimento` | Desenvolvimento | Editores, código, repositórios e operação de software. |
| `comunicacao` | Comunicação | Mensagens, reuniões, e-mail e redes. |
| `criacao` | Criação | Foto, vídeo, áudio, design e produção de conteúdo. |
| `sistemas-operacionais` | Sistemas operacionais | Windows, macOS, Linux, Android e iOS. |
| `servicos-digitais` | Serviços digitais | Comércio, bancos, mobilidade, nuvem e serviços na tela. |
| `seguranca-digital` | Segurança digital | Privacidade, autenticação, golpes e proteção cotidiana. |

### Jogos (`/jogos`)

| Slug | Rótulo | Escopo |
| --- | --- | --- |
| `lancamentos` | Lançamentos | Jogos novos, atualizações e o estado real do que chegou. |
| `consoles` | Consoles e portáteis | Aparelhos dedicados, sistema, desempenho e acessórios. |
| `industria` | Indústria | Estúdios, publicadoras, negócios, trabalho e decisões. |
| `lojas-e-assinaturas` | Lojas e assinaturas | Lojas, catálogos, assinaturas, preços e acesso. |
| `esports` | Esports | Competição, equipes e audiência com jogo ou número concreto. |

## Regras de fronteira

Use a tese da manchete e aplique a primeira regra específica que resolver a
pauta:

1. É sobre jogar, um título, um console dedicado, uma loja ou a indústria de
   videogames? **Jogos**.
2. É sobre PC, notebook, componente ou periférico? **Computadores**. Um PC de
   mão aberto, como Steam Deck, fica em `computadores/pcs-portateis`; um console
   dedicado, como Switch, fica em `jogos/consoles`.
3. É sobre celular, tablet, vestível, áudio, TV ou casa conectada?
   **Dispositivos**.
4. É sobre um programa, sistema operacional ou serviço digital?
   **Aplicativos**.
5. A tese só existe por causa da capacidade, limitação, segurança ou política
   de IA? **IA**. Se IA for apenas um recurso dentro de um fluxo de software, a
   matéria continua em **Aplicativos**.
6. A tese continua sendo tecnologia, mas atravessa essas divisões ou trata de
   indústria, ciência aplicada, infraestrutura geral, negócios ou uma tendência
   multissetorial? **Tecnologia**.

Marca não define editoria. Apple pode aparecer em Dispositivos, Aplicativos ou
IA. “Setup” também não define editoria: compra física vai para Computadores;
mudança de fluxo vai para Aplicativos.

Dois limites evitam que a nova editoria absorva tudo: desempenho de um chip ou
peça fica em `computadores/componentes`, enquanto fabricação e cadeia de
semicondutores ficam em `tecnologia/industria`; infraestrutura criada
especificamente para modelos de IA fica em `ia/infraestrutura`, enquanto
conectividade, nuvem, energia e data centers em geral ficam em
`tecnologia/infraestrutura`.

## Migração do arquivo

| Arquivo | Categoria anterior | Nova classificação |
| --- | --- | --- |
| `twd-streets-of-survival-day-one.mdx` | Games | Jogos / Lançamentos |
| `xbox-tgs-sale-re4-49.mdx` | Games | Jogos / Lojas e assinaturas |
| `iphone-18-pro-brasil-hoje-preco.mdx` | Gadgets | Dispositivos / Celulares |
| `s25-ultra-200mp-ninguem-usa.mdx` | Gadgets | Dispositivos / Celulares |
| `iphone-18-pro-abertura-variavel-nao-e-megapixel.mdx` | Gadgets | Dispositivos / Celulares |
| `lego-batman-switch-2-hoje-pt-br.mdx` | Games | Jogos / Lançamentos |
| `teclado-caro-atalhos-baratos.mdx` | Hardware | Computadores / Periféricos |
| `setup-produtividade-overrated.mdx` | Apps | Aplicativos / Produtividade |
| `fire-emblem-fortunes-weave-switch-2.mdx` | Games | Jogos / Lançamentos |
| `claude-ajudou-a-entrar-na-openai-bounty.mdx` | IA | IA / Segurança |
| `steam-deck-oled-brasil-preco-doi.mdx` | Hardware | Computadores / PCs portáteis |
| `kabum-ninja-whatsapp-ia-commerce.mdx` | Apps | Aplicativos / Serviços digitais |
| `nokia-ia-carajas-sem-internet.mdx` | IA | IA / Infraestrutura |
| `contexto-maior-que-prompt.mdx` | IA | IA / Ferramentas |
| `meta-muse-mac-agente-no-computador.mdx` | IA | IA / Agentes |
| `cursor-nao-e-ia-que-escreve-codigo.mdx` | Apps | Aplicativos / Desenvolvimento |
| `tres-ias-que-uso-duas-que-parei.mdx` | IA | IA / Ferramentas |
| `switch-2-hype-vs-frame-rate.mdx` | Consoles | Jogos / Consoles e portáteis |

Todos os 19 posts recebem `subcategory`. Só frontmatter e kickers que
funcionavam como rótulo editorial foram alterados; o corpo das matérias foi
preservado.

A inclusão de Tecnologia não remapeia o arquivo atual. As pautas potencialmente
transversais ainda têm uma tese específica: Nokia/Carajás trata de IA na borda,
Claude/OpenAI trata de segurança de IA e KaBuM/WhatsApp trata de um serviço
digital. Mover qualquer uma apenas para preencher o novo hub reduziria a
precisão da classificação.

## URLs, navegação e SEO

Editorias continuam em uma rota curta, `/{editoria}`. Subcategorias ativas usam
`/{editoria}/{subcategoria}`. Apenas subcategorias com pelo menos uma matéria
entram nos parâmetros estáticos, nos links do hub e no sitemap; isso evita
páginas vazias e indexação de coleções sem conteúdo.

Redirecionamentos permanentes:

| URL anterior | Destino |
| --- | --- |
| `/hardware` | `/computadores` |
| `/gadgets` | `/dispositivos` |
| `/apps` | `/aplicativos` |
| `/games` | `/jogos` |
| `/consoles` | `/jogos/consoles` |

Os destinos emitem redirect permanente do Next.js. Parâmetros de consulta são
preservados. Não há redirecionamento de matérias porque seus slugs não mudam.

Os hubs pai e filho têm canonical próprio, metadados Open Graph, imagem social,
`CollectionPage` e `BreadcrumbList`. Os padrões de `<title>` (home, editoria,
subeditoria, matéria, busca, sobre) estão em [`docs/SEO_TITLES.md`](./SEO_TITLES.md).
Matérias incluem a subcategoria na trilha, nas palavras-chave e nas tags Open Graph. O sitemap lista apenas URLs canônicas;
o RSS publica editoria e subcategoria. Cabeçalho, menu móvel, chips e rodapé
mostram as seis editorias; a home só abre um trilho quando a editoria já tem
matérias.

## Alternativas rejeitadas

- **Só traduzir os seis nomes antigos:** preservaria a mistura entre assunto,
  aparelho e plataforma e não criaria lugar para componentes ou vestíveis.
- **Celulares, Vestíveis e Casa como editorias globais:** é claro em portais
  grandes, mas fragmenta uma mesma família de produtos e alonga o cabeçalho.
  `Dispositivos` mantém essas palavras explícitas um nível abaixo.
- **Produtos como editoria guarda-chuva:** junta PC, celular, TV e console
  novamente e torna a decisão editorial dependente do formato da pauta.
- **Notícias, Análises e Guias no topo:** formato é um eixo ortogonal. Se o
  volume justificar, deve virar um campo `format`, não competir com `category`.
- **Mobile ou Tecnologia pessoal:** o primeiro volta ao inglês; o segundo é
  menos direto para busca e não acomoda bem TV e casa conectada.
- **Tags livres desde já:** com 19 textos, aumentariam sinônimos e erros sem
  melhorar navegação. O modelo tipado pode ganhar tags controladas quando
  houver volume e uma regra de uso.
