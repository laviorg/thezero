/**
 * Introdução editorial das páginas de editoria, subeditoria e review (150–300 palavras, contexto Brasil).
 * Só texto e links para guias que já existem; sem preço inventado. A regra de noindex
 * (`isIndexableHub`, menos de 3 matérias) continua valendo e não depende deste arquivo.
 */
export type HubIntro = { paragraphs: string[]; guides: string[] };

export const HUB_INTROS: Record<string, HubIntro> = {
  "/reviews/consoles-portateis": {
    paragraphs: [
      "PC portátil e console de bolso viraram a compra de tecnologia mais difícil de fazer no Brasil. Quase nenhum modelo tem venda oficial no país, então a conta real inclui frete, imposto de importação, ICMS e o risco de ficar sem assistência técnica. O Steam Deck, por exemplo, nunca foi vendido oficialmente aqui pela Valve; ROG Ally, Legion Go e a linha Xbox Ally têm caminhos de compra diferentes, e os chineses como Ayaneo, AYN, GPD e Retroid chegam quase sempre por loja estrangeira.",
      "Nos reviews desta seção, a pergunta é sempre a mesma: para quem esse aparelho faz sentido aqui, com o preço em reais e o suporte que existem de verdade. Olhamos tela, bateria em jogo, desempenho em títulos reais, emulação, Windows contra SteamOS e o que muda quando a garantia é de outro país. Não há nota inventada nem teste que não foi feito: quando um número vem do fabricante ou de outro veículo, a matéria diz de onde ele veio.",
      "Se você está começando a pesquisa, os guias abaixo comparam os principais modelos e explicam como importar sem surpresa na alfândega.",
    ],
    guides: ["qual-console-portatil-comprar-2026-brasil", "importar-ayaneo-ou-ayn-brasil", "rog-xbox-ally-vale-a-pena-brasil", "windows-no-handheld-vs-steamos", "steam-deck-oled-ainda-vale-a-pena-2026", "switch-2-vs-steam-deck-oled-preco-brasil"],
  },
  "/computadores/pcs-portateis": {
    paragraphs: [
      "PCs portáteis são computadores Windows ou SteamOS no formato de console: Steam Deck, ROG Ally, Legion Go, MSI Claw e a leva de modelos chineses. Para o leitor brasileiro, a escolha passa menos pela ficha técnica e mais pelo pacote completo: quanto o aparelho custa depois de imposto e frete, se existe assistência no país, quanto a bateria aguenta em jogo pesado e se a loja de jogos que você já usa funciona bem nele.",
      "Aqui reunimos notícias de lançamento, mudanças de preço, atualizações de sistema e configurações que fazem diferença no dia a dia, como TDP, resolução e limite de quadros. Também acompanhamos o que chega oficialmente ao Brasil e o que só se compra importado, porque isso muda garantia, tomada, carregador e até o idioma do sistema.",
      "Também acompanhamos o lado do software: atualizações do SteamOS e do Windows para portáteis, drivers de vídeo e compatibilidade de jogos, que muitas vezes pesam mais na experiência do que o processador.",
      "Para decidir entre os principais modelos, comece pelos guias abaixo, que comparam desempenho, bateria e custo total no Brasil.",
    ],
    guides: ["qual-console-portatil-comprar-2026-brasil", "rog-xbox-ally-vs-steam-deck-oled", "rog-ally-tdp-bateria-configs", "steam-deck-oled-ainda-vale-a-pena-2026"],
  },
  "/dispositivos/celulares": {
    paragraphs: [
      "Celular é a compra de tecnologia mais comum no Brasil, e também a que mais sofre com preço. Lançamentos chegam aqui com atraso ou nem chegam, a mesma versão custa bem diferente em cada loja, e homologação na Anatel não significa que o aparelho será vendido oficialmente. Por isso, nesta seção a notícia de lançamento sempre vem acompanhada do que se sabe sobre preço e data no Brasil, e quando não há dado oficial a matéria diz isso com clareza.",
      "Cobrimos Samsung, Motorola, Apple, Xiaomi, Google e as marcas que entram no país por importação, além de atualizações de sistema como One UI e iOS, que definem por quanto tempo um aparelho continua seguro. Também explicamos o que pesa na escolha: bateria, câmera, armazenamento, eSIM e assistência técnica.",
      "Nas comparações, usamos o preço publicado pela loja oficial ou por varejistas brasileiros, com a data da consulta, porque o valor muda rápido.",
      "Se você está escolhendo um aparelho agora, os guias abaixo comparam faixas de preço e marcas com foco no uso real no Brasil.",
    ],
    guides: ["celular-ate-2-mil-brasil-2026", "motorola-vs-samsung-intermediario", "celular-melhor-camera-ate-3-mil", "iphone-eua-vs-loja-br-conta-total"],
  },
  "/computadores/componentes": {
    paragraphs: [
      "Montar ou atualizar um PC no Brasil exige atenção dupla: além da escolha técnica, o preço de placa de vídeo, processador, memória e SSD oscila com o dólar e com a oferta das lojas daqui. Uma peça que faz sentido nos Estados Unidos pode não fazer sentido em reais, e o mercado de usados tem armadilhas próprias, como placas de mineração e garantia que não passa para o segundo dono.",
      "Nesta seção acompanhamos lançamentos de GPU e CPU, drivers, mudanças de preço e comparativos de custo-benefício pensados para o mercado brasileiro. Explicamos quando vale gastar mais e quando a peça mais barata resolve, sempre com a fonte dos números de desempenho e sem preço inventado.",
      "Também cobrimos o lado prático do upgrade: compatibilidade entre placa-mãe e processador, quantos watts a fonte precisa, refrigeração e o que checar antes de comprar uma peça usada. São detalhes que evitam gastar duas vezes, num mercado em que devolver um componente importado raramente é simples.",
      "Os guias abaixo são o ponto de partida para quem vai montar, trocar a placa de vídeo ou decidir quanta memória comprar em 2026.",
    ],
    guides: ["pc-gamer-ate-4-mil-2026", "rtx-4060-vs-5060-brasil", "ram-16-ou-32-gb-2026", "placa-de-video-usada-brasil-checklist"],
  },
  "/jogos/consoles": {
    paragraphs: [
      "PlayStation, Xbox e Nintendo vendem consoles oficialmente no Brasil, mas o preço sugerido daqui costuma ficar bem acima do de outros mercados, e reajustes acontecem sem aviso longo. Nesta seção acompanhamos preço oficial, modelos novos, revisões de hardware, assinaturas e mudanças de política que afetam quem joga no país.",
      "Também respondemos à pergunta que mais aparece na busca: vale a pena comprar agora? A resposta depende do catálogo que você quer jogar, de usar ou não mídia física, de assinar Game Pass ou PS Plus e de quanto tempo o console ainda deve receber jogos. Quando comparamos modelos, usamos preço em reais publicado por loja oficial e dizemos a data da consulta.",
      "Além de PlayStation 5, Xbox Series e Nintendo Switch 2, cobrimos acessórios, armazenamento e mercado de usados, que no Brasil costuma ser a porta de entrada para muita gente. Explicamos o que checar num console usado, quando trocar o SSD compensa e quais controles valem o preço, para que a compra dure a geração inteira.",
      "Para decidir entre os consoles atuais, comece pelos guias e comparativos abaixo.",
    ],
    guides: ["ps5-slim-vale-a-pena-2026-brasil", "ps5-vs-series-x-exclusivo-game-pass-preco", "switch-2-vs-steam-deck-oled-preco-brasil", "xbox-series-s-game-pass-e-netflix"],
  },
  "/jogos/lancamentos": {
    paragraphs: [
      "Lançamentos de jogos chegam ao Brasil no mesmo dia que no resto do mundo, mas o preço em reais, o horário de liberação e o suporte a português variam bastante entre plataformas. Nesta seção cobrimos os lançamentos que importam para quem joga no PC, no PlayStation, no Xbox, no Switch e nos portáteis, com o preço publicado nas lojas brasileiras quando ele existe.",
      "Para cada jogo, procuramos responder o que o jogador realmente quer saber: quando libera, quanto custa em cada loja, se tem legenda ou dublagem em português, se roda no Steam Deck e quais são os requisitos de PC. Quando a informação ainda não foi confirmada pela publicadora, a matéria deixa isso claro.",
      "Também olhamos lançamentos menores e independentes que fazem sucesso na Steam e nos consoles, porque muitos deles chegam com preço regional baixo e tradução feita pela comunidade. Quando há demo, acesso antecipado ou edição mais cara com dias de vantagem, explicamos o que cada versão entrega.",
      "Antes de comprar na pré-venda ou pagar o preço cheio, vale ler os guias abaixo sobre lojas, assinaturas e descontos.",
    ],
    guides: ["pre-venda-de-jogo-desconto-depois", "steam-vs-epic-vs-xbox-pc-preco", "game-pass-ultimate-vs-comprar-jogo", "key-de-jogo-barata-risco-de-conta", "ps5-slim-vale-a-pena-2026-brasil", "ea-sports-fc-27-vale-a-pena"],
  },
  "/tecnologia": {
    paragraphs: [
      "Tecnologia, no The Zero, é o que acontece por trás dos produtos: fábricas de chips, data centers, internet, energia, regulação e os negócios das grandes empresas do setor. São assuntos que parecem distantes, mas chegam ao bolso do brasileiro na forma de preço de eletrônicos, qualidade da conexão, regras da Anatel e serviços que mudam de uma hora para outra.",
      "Nesta editoria explicamos esses movimentos com número e fonte, sem futurologia. Quando uma decisão tomada nos Estados Unidos, na China ou em Taiwan afeta o mercado daqui, a matéria mostra como. Quando não afeta, também dizemos.",
      "Os temas daqui incluem cadeia de semicondutores, satélites e telecomunicações, investimento em data centers, energia, padrões técnicos e regulação. Nas matérias sobre o Brasil, olhamos decisões da Anatel, do governo e das operadoras, e o efeito delas em preço, cobertura e oferta de serviço.",
      "Para entender o lado prático da infraestrutura que você usa todo dia, os guias abaixo tratam de internet em casa, roteador e cabos.",
    ],
    guides: ["fibra-500-mb-vs-1-gb", "roteador-wifi-6-barato-modem-operadora", "usb-c-cabo-errado-2026"],
  },
  "/ia": {
    paragraphs: [
      "Inteligência artificial mudou de assunto de laboratório para ferramenta de uso diário em pouco tempo, e a cobertura também precisa ser prática. Nesta editoria acompanhamos os modelos e agentes da OpenAI, Google, Anthropic, Meta e outras empresas, com foco no que eles realmente fazem, quanto custam, o que está disponível no Brasil e em português e quais são os riscos de segurança e privacidade.",
      "Também cobrimos regulação e negócios de IA, porque decisões sobre dados, direitos autorais e uso de modelos afetam empresas e usuários brasileiros. Evitamos opinião genérica: cada matéria parte de um anúncio, relatório ou dado verificável, com o link da fonte.",
      "No dia a dia, a cobertura também separa o que é recurso disponível para todos do que ainda é teste restrito a alguns países ou a planos pagos. Muitas novidades anunciadas nos Estados Unidos demoram a chegar ao Brasil ou chegam sem suporte completo ao português, e a matéria deixa isso claro.",
      "Se você quer usar IA no trabalho ou no celular sem cair em armadilhas, comece pelos guias abaixo.",
    ],
    guides: ["ia-gratis-para-trabalho-2026", "chatgpt-vs-gemini-no-celular", "o-que-nao-colar-no-chat-de-ia", "agente-ia-permissoes-que-nao-dar"],
  },
  "/computadores": {
    paragraphs: [
      "Computadores continuam sendo a compra mais pesada de tecnologia para muita gente no Brasil, seja para trabalhar, estudar ou jogar. Nesta editoria cobrimos notebooks, PCs de mesa, componentes, periféricos, PCs portáteis e o espaço de trabalho, sempre com a pergunta de quanto aquilo custa por aqui e se a escolha faz sentido no mercado brasileiro.",
      "Acompanhamos lançamentos de processadores e placas de vídeo, drivers, notebooks que chegam ao país e mudanças de preço. Nos guias, comparamos configurações por faixa de orçamento e explicamos o que não vale economizar, como fonte, armazenamento e memória.",
      "Também cobrimos o espaço de trabalho, com monitor, teclado, mouse, cadeira e dock, porque o conforto e a produtividade dependem tanto deles quanto do processador. E acompanhamos os PCs portáteis, categoria que cresceu rápido e ainda depende de importação, com o custo total no Brasil sempre na conta.",
      "Para começar, os guias abaixo cobrem notebook gamer, PC montado e as escolhas mais comuns de upgrade.",
    ],
    guides: ["notebook-gamer-ate-7-mil-brasil", "pc-gamer-ate-4-mil-2026", "qual-console-portatil-comprar-2026-brasil", "ssd-nvme-1tb-brasil-o-que-olhar", "importar-ayaneo-ou-ayn-brasil", "adrenalin-26-9-2-seis-jogos-recuo-rx-5000"],
  },
  "/dispositivos": {
    paragraphs: [
      "Dispositivos são os aparelhos do dia a dia: celulares, tablets, relógios, fones, TVs, câmeras e casa conectada. No Brasil, a diferença entre um bom e um mau negócio costuma estar menos no aparelho e mais no contexto: venda oficial ou importação, assistência técnica, atualização de software e compatibilidade com as operadoras e serviços daqui.",
      "Nesta editoria acompanhamos lançamentos e preços no Brasil, homologações na Anatel e atualizações de sistema, além de guias de compra por faixa de uso. Quando um produto ainda não tem preço oficial em reais, a matéria diz isso em vez de converter o dólar e chamar de preço.",
      "Também cobrimos tablets, relógios e pulseiras, câmeras de ação, drones, TVs e aparelhos de streaming e a casa conectada, com atenção ao que realmente funciona com serviços e padrões brasileiros, como canais abertos, apps de banco e assistentes em português.",
      "Os guias abaixo ajudam a escolher celular, fone e TV sem cair em armadilha de especificação.",
    ],
    guides: ["celular-ate-2-mil-brasil-2026", "fone-cancelamento-ruido-ate-800", "tv-55-4k-ate-2500-o-que-nao-cair", "smartwatch-barato-o-que-medir"],
  },
  "/aplicativos": {
    paragraphs: [
      "Aplicativos e serviços digitais são onde a tecnologia mais encosta na rotina brasileira: WhatsApp, Pix, bancos digitais, streaming, sistemas operacionais e ferramentas de trabalho. Mudanças de regra, preço ou segurança nesses serviços afetam milhões de pessoas de uma vez, e golpes adaptados ao Brasil aparecem rápido.",
      "Nesta editoria cobrimos atualizações de Android, iOS e Windows, mudanças em apps de mensagem e redes sociais, serviços de assinatura e segurança digital do dia a dia. O foco é dizer o que muda para você, como se proteger e onde ajustar.",
      "Também tratamos de produtividade e criação, com apps de notas, edição de vídeo e ferramentas de trabalho, e de desenvolvimento para quem está começando a programar. Em segurança, explicamos golpes com Pix, WhatsApp, bancos e gov.br, que são específicos do Brasil, e como reconhecer cada um antes de cair.",
      "Para começar, os guias abaixo tratam de senhas, nuvem e uso do WhatsApp no trabalho.",
    ],
    guides: ["gerenciador-de-senhas-gratis-vs-pago", "nuvem-gratis-drive-onedrive-icloud", "whatsapp-business-vs-app-pessoal", "windows-11-pc-fraco-o-que-desligar"],
  },
  "/jogos": {
    paragraphs: [
      "Jogos, no The Zero, é cobertura para quem joga no Brasil: lançamentos com preço em reais, consoles, PC, portáteis, assinaturas e a indústria por trás de tudo isso. O mercado brasileiro tem particularidades que outros sites ignoram, como preço regional na Steam, diferença de valor entre lojas de console, suporte a português e o peso das assinaturas no bolso.",
      "Acompanhamos anúncios de estúdios e publicadoras, mudanças em Game Pass e PS Plus, novos consoles e revisões de hardware, além de guias que ajudam a decidir onde e quando comprar. Quando falamos de preço, usamos o valor publicado na loja brasileira e a data da consulta.",
      "A editoria inclui ainda lojas e assinaturas, indústria e esports, com atenção a demissões, aquisições e mudanças de preço que afetam o catálogo disponível por aqui. Para quem joga em portátil ou em PC fraco, explicamos requisitos e compatibilidade antes da compra.",
      "Os guias abaixo respondem às dúvidas mais comuns de quem vai comprar console, assinatura ou jogo agora.",
    ],
    guides: ["ps5-slim-vale-a-pena-2026-brasil", "game-pass-ultimate-vs-comprar-jogo", "ps-plus-extra-quem-joga-pouco", "steam-vs-epic-vs-xbox-pc-preco"],
  },
  "/tecnologia/infraestrutura": {
    paragraphs: [
      "Infraestrutura é a parte da tecnologia que só aparece quando falha: redes de internet, cabos submarinos, nuvem, data centers e energia. No Brasil, essas decisões têm efeito direto na velocidade da conexão, no preço dos planos e na estabilidade dos serviços que você usa, de banco a streaming.",
      "Nesta seção cobrimos investimentos em data centers e nuvem, mudanças em operadoras e redes, apagões e incidentes que derrubam serviços, além do consumo de energia da computação. Explicamos o que mudou, quem é afetado e se há impacto para quem está no Brasil, sempre com a fonte.",
      "No Brasil, acompanhamos a expansão da fibra e do 5G, a chegada de novos data centers e cabos, e as regras da Anatel que mexem com operadoras e consumidores. Quando um incidente fora do país derruba serviços usados aqui, como nuvem, redes sociais ou apps de pagamento, explicamos a causa e o que foi feito para evitar que se repita.",
      "Para o lado prático da sua conexão em casa, veja os guias abaixo.",
    ],
    guides: ["fibra-500-mb-vs-1-gb", "roteador-wifi-6-barato-modem-operadora"],
  },
  "/tecnologia/industria": {
    paragraphs: [
      "A indústria de tecnologia decide, muito antes do lançamento, quanto um celular, uma placa de vídeo ou um notebook vai custar. Fábricas de chips, memória, telas e baterias formam uma cadeia global em que uma falta de componente em Taiwan ou na Coreia aparece meses depois no preço das lojas brasileiras.",
      "Nesta seção acompanhamos fabricantes de semicondutores, memória e componentes, padrões técnicos e os bastidores da produção. Quando um movimento da indústria afeta o preço ou a oferta no Brasil, mostramos como; quando o efeito ainda é especulação, dizemos isso.",
      "Acompanhamos empresas como TSMC, Samsung, Intel, Micron e SK Hynix, além das fabricantes de celulares e PCs que compram desses fornecedores. Também olhamos a produção no Brasil, como montagem local e incentivos fiscais, que ajudam a explicar por que alguns aparelhos custam menos aqui do que outros.",
      "Para ver como isso chega ao consumidor, os guias abaixo tratam de memória e placa de vídeo no mercado brasileiro.",
    ],
    guides: ["ram-16-ou-32-gb-2026", "ddr4-vs-ddr5-ainda-vale-montar", "rtx-4060-vs-5060-brasil"],
  },
  "/ia/modelos": {
    paragraphs: [
      "Modelos de IA mudam a cada poucas semanas, e acompanhar nomes e versões cansa. Nesta seção cobrimos os lançamentos de modelos da OpenAI, Google, Anthropic, Meta e outros laboratórios com uma pergunta simples: o que esse modelo faz de diferente na prática, e ele está disponível no Brasil e em português?",
      "Olhamos capacidade concreta, limites, preço de uso e disponibilidade em apps e APIs, sem repetir slide de lançamento. Benchmarks aparecem com a fonte e o contexto, e quando um resultado ainda não foi verificado de forma independente, a matéria diz.",
      "Também comparamos versões menores e maiores do mesmo modelo, porque nem sempre a mais cara é a melhor para a tarefa, e explicamos quando faz sentido pagar plano em vez de usar a versão gratuita. Mudanças de limite de uso e de preço de API entram aqui, já que afetam diretamente quem usa IA no trabalho.",
      "Para escolher qual modelo usar no dia a dia, comece pelos guias abaixo.",
    ],
    guides: ["modelo-menor-ou-pro", "chatgpt-vs-gemini-no-celular", "ia-gratis-para-trabalho-2026"],
  },
  "/ia/negocios-e-politica": {
    paragraphs: [
      "A inteligência artificial virou assunto de tribunal, de parlamento e de balanço de empresa. Nesta seção acompanhamos regulação, processos de direitos autorais, acordos bilionários, disputas entre empresas e decisões de governo que definem como a IA pode ser usada, inclusive no Brasil, onde o tema avança no Congresso e nos órgãos de proteção de dados.",
      "Explicamos o que foi decidido, quem é afetado e o que muda para empresas e usuários brasileiros, com link para o documento ou a fonte original. Evitamos o tom de torcida: o foco é o fato e a consequência.",
      "Entram aqui também os grandes investimentos em infraestrutura de IA, as parcerias entre laboratórios e empresas de nuvem, as demissões atribuídas à automação e os incidentes de segurança que levam a mudanças de regra. Quando há relatório oficial ou decisão judicial, citamos e linkamos o documento.",
      "Para o lado prático de segurança e privacidade, veja os guias abaixo.",
    ],
    guides: ["o-que-nao-colar-no-chat-de-ia", "agente-ia-permissoes-que-nao-dar"],
  },
  "/dispositivos/audio-pessoal": {
    paragraphs: [
      "Fones de ouvido, headsets e caixas de som são das compras de tecnologia mais frequentes no Brasil, e também das mais confusas: o mesmo modelo aparece com preço muito diferente entre lojas, há muita cópia e a ficha técnica nem sempre diz o que importa. Nesta seção cobrimos lançamentos de Apple, Samsung, Sony, JBL, Beats e outras marcas, com o preço oficial no Brasil quando ele existe.",
      "Nos guias, explicamos o que pesa de verdade: cancelamento de ruído, microfone para chamadas, bateria, conforto, codec e compatibilidade entre iPhone e Android. Quando um preço em reais ainda não foi publicado pela marca, a matéria diz isso em vez de converter o dólar.",
      "Também acompanhamos atualizações de firmware, que às vezes melhoram cancelamento de ruído e bateria depois da compra, e programas de troca de peças, como almofadas e baterias, que podem estender bastante a vida útil de um fone caro.",
      "Para escolher seu próximo fone, comece pelos guias abaixo.",
    ],
    guides: ["fone-cancelamento-ruido-ate-800", "fone-tws-ate-300-audio-e-microfone", "airpods-vs-galaxy-buds-ecossistema-misto", "fone-com-fio-ainda-faz-sentido-2026"],
  },
  "/aplicativos/servicos-digitais": {
    paragraphs: [
      "Serviços digitais são os apps que movem a rotina: bancos, Pix, streaming, lojas, transporte e entregas. No Brasil, uma mudança de preço de assinatura, de regra do Pix ou de política de um app grande atinge milhões de pessoas de uma vez, e por isso essas notícias precisam explicar o que muda no seu bolso e no seu uso.",
      "Nesta seção acompanhamos reajustes de streaming, novos recursos de bancos digitais e do Pix, mudanças em lojas de apps e de jogos e serviços que chegam ou saem do país. Também mostramos como se proteger quando uma novidade abre espaço para golpe.",
      "Quando um serviço muda os termos de uso ou a forma de cobrança, mostramos onde conferir a mudança no app e como cancelar se não fizer mais sentido. Golpes que exploram essas mudanças, como mensagens falsas de reajuste ou de bloqueio de conta, também entram aqui.",
      "Os guias abaixo ajudam a decidir entre assinaturas e organizar seus serviços.",
    ],
    guides: ["nuvem-gratis-drive-onedrive-icloud", "game-pass-ultimate-vs-comprar-jogo", "whatsapp-business-vs-app-pessoal"],
  },
};
