# Transcrição - ideias_reuniao.mp3

Duração aproximada: 00:57:12

> Transcrição automática local. Pode conter pequenos erros de pontuação, nomes próprios ou trechos inaudíveis.

## Transcrição

**00:00:00 - 00:00:28**

A galera não tinha a mínima possibilidade de trabalhar essas interfaces inteligentes, mas a gente é um sistema web, a gente tem boas práticas de desenvolvimento e também estamos bem atualizados ali, quanto às bibliotecas que a gente utiliza. Então, acho que já passou da hora da gente fazer esse movimento. Só que a gente pretende fazer igual a Jack, né? Ele é para o Part, para o Modus, que você e a Estelane consigam

**00:00:28 - 00:00:56**

Não dá fluidez, ali não é pra ser uma coisa atropelada, mas sim uma coisa muito bem pensável. E você, Murilão, uma coisa que eu sempre falei que eu te admiro é quanto a sua, não sua perspicácia, né, mas em que são ali, quanto as pedras? Até pra, eu acho que você não teve acesso a essas telas ainda, estelar, mas eu na também, trabalhando com o Murilo ali no Explorer.

**00:00:56 - 00:01:24**

Muito do que a gente tem hoje de regras de negócio vieram ali de sugestões que o Murilo deixou dentro do projeto de Y-O-X dele. Na verdade, foi um... - É sempre um projeto. - É, gente, dá nem pra chamar de só o X. Deixou o negócio com o Dano. Isso é extraordinário, porque juntou uma ideia inicial, ela já foi aprimorada logo,

**00:01:24 - 00:01:52**

ali no designer, a gente fez mais um apanhado ali de informações para uma terceira versão e o resultado disso é extraordinário. Por uma MVP é pra outra tá começando, é muito bom. E eu conto com você novamente, Murilo, para nos ajudar em enxergar um pouquinho mais. Mas cara, eu falo pra caralho então, deixa eu falar um pouco minha boca. Estelane, se você puder

**00:01:52 - 00:02:20**

a gente iria até o sistema posteriormente, eu não sei se você já tem um acesso, mas a gente vai liberar um acesso pra você da plataforma, mas a ideia de hoje é te mostrar ela na íntegra, falar um pouquinho das nossas séries de negócio e estipular ali, nem que seja em um mapa mental agora, por onde a gente vai começar. - Pechado? - Combinado. Estela, nessa é a redação atual

**00:02:20 - 00:02:48**

Essa é a versão atualizada, essa é a Brand que a Tefa está trabalhando, que eu comecei a pegar agora cedo, que vai ter a tela de agendamentos de exame. Então, não vai ter aquela última atualização que eu fiz, mas eu posso trocar. E a Brand? Essa daí já tem os gráficos? Tem. O que que acontece? Eu fiz aquela alteração...

**00:02:48 - 00:03:16**

aquela alteração lá do dashboard para ficar parecendo gráfico o tempo todo, só que o Natan ainda não fez merge daquelas últimas alterações minhas. -Você consegue abrir ela aí para mostrar para a gente? Então acho que já é... já mostra um pouquinho mais avançado. -Eu consigo buscar aqui. Deixa eu só carregar aqui o backend para... -Perfecto.

**00:03:16 - 00:03:44**

- Eu, Murilo, como que a gente já começou a fazer um retrabalho, né? Pensar em extrair melhor as informações que a gente tem acesso, pensar em tutrágio, essa questão dos gráficos que a Estela vai carregar e para a gente, já é algo nesse sentido. Mas ainda de forma, de certa forma, não amadora, mas entende que falta uma inteligência visual por trás? - O perdão, meu pai entrou no...

**00:03:44 - 00:04:12**

Eu estou perguntando do negócio da minha mãe. Eu escutei que você já fez um demo filtrado na Front-Inge. E isso, vamos começar aqui pelo Dashboard então. Então, o teste do Dashboard, o trabalho que a gente vê fazendo é trabalhar um pouco melhor as informações que a gente tem. Porque de fato tem que ser um Dashboard que entrega informações que sejam importantes a quem está jazendo o Bokeh Lonely. Então, já veio essa ideia.

**00:04:12 - 00:04:40**

como a Stephanie demonstrou, já tem alguns gráficos ali que mostra algumas informações em nível percentual, mas o que eu proponho para você nessa tela quando você for desenvolver o dashboard em si é que se você tiver alguma sugestão, por exemplo, alguns dados que a gente tem, poder cruzar e trazer alguma informação mais relativa ou mesmo, por exemplo, aqui a gente não colocou os agendamentos

**00:04:40 - 00:05:08**

pelo bot, né? Ainda está lá, não, né? - Sim, tem também, eu estou tentando carregar aqui. Aqui são os agendamentos inteligentes e aqui são os agendamentos pelo bot. Tá aqui agendados por bot e agendados por usuário. Ele vai aparecer aqui. - Ah, legal. - É aqui do lado tem o gráfico que é igual a esse, que é os agendamentos por médico. Aí aparece todos os médicos e os agendamentos por eles. Aqui, consultas realizadas.

**00:05:08 - 00:05:36**

no caso, consultas realizadas esse aqui, agendamentos inteligentes e todos os agendamentos aparecem aqui como opção. Aí aqui nesse consulta realizadas você consegue pegar a lista. No caso aqui, eu acho que é meu banco de dados que ainda não carregou completo, ele aparece o nome dos médicos e aqui todos os exames, aí aqui no caso tem opções de exames somente. Então ele aparece exames de consulta

**00:05:36 - 00:06:04**

consultas aqui, porque aí no caso todos que eu tenho aqui está aparecendo de exames. E aí você consegue filtrar, entendeu? -Mhm. -Mas sabe essa parte, né? -Fica nela mesmo. -Fica aqui, quando eu seleciono aqui ele só muda esse filtro, ele muda aqui, quantidade de consultas e muda esse filtro. -Certo. -A esse filtro aqui ele aparece as informações do período e aqui embaixo, quando a gente

**00:06:04 - 00:06:32**

ele mostra o filtro aqui, você pode filtrar por data ou por período e aqui seleciona as datas, o filtro que a gente já tinha antes, só que aí agora como a gente mostra essas informações aqui, aqui no tempo todo, então a gente esconde o filtro, quando a pessoa quer alterar a data do filtro, aparece, senão normalmente ele aparece os últimos 30 dias, eu não me engano.

**00:06:32 - 00:07:00**

E a gente mudou um pouco esse visual. Antes eram card separados. O dashboard da... Sensei da Clínica, o clássico, que é verde laranja, ele ainda continua no formato antigo. Que são os cards separados. Como a gente aumentou o número de cards aqui, então a gente colocou ele menorzinho com o visual mais lista, digamos assim.

**00:07:00 - 00:07:28**

Aqui essa parte continua igual, deixa eu dar um recarregar aqui para ver se aparece. É, ó, é para estar... - No caso, essa seria a parte da qual eu me desbordei. - Agora é que arregou, ó. "Ajuntamentos de consultas por profissional" Aqui é a lista dos profissionais. "Ajuntamentos de consulta inteligente" Que aparece quando é

**00:07:28 - 00:07:56**

bot ou pro usuário, né, é aqui embaixo aqui o gráfico de atendimento conforme horários que estão as digamos que seriam as últimas 24 horas não, né, atendimento hoje, no caso eu aceitei um ticket agora as duas horas, tá aí aparece aqui, né, um mil não aparece alimentado porque eu não aceito o ticket então fica assim. Aqui embaixo a gente tem o avaliações, né, então aqui a gente pode selecionar todas as

**00:07:56 - 00:08:24**

avaliações ou a lista dos médicos. Como eu não tenho avaliação nenhuma cadastrada aqui nesse banco, então fica assim. Aqui apareceriam a lista das avaliações e aqui nas estrelinhas você consegue clicar e aparecer somente as de cinco estrelas e por diante. Aí aqui aparece todos os tipos de avaliações, aqui só consulta, só exames ou só renovações de receitas. E essa parte

**00:08:24 - 00:08:52**

de renovações de receitas, na verdade, a gente ainda não usa, mas ficou ali o botão já para essa parte visual. - E aqui embaixo... - E essas avaliações são feitas no... desde o WhatsApp mesmo? Como funciona? - Isso é um tipo de avaliação que, após o atendimento, é enviado uma mensagem solicitando uma avaliação, um comentário em relação à consulta que foi feita. - Vamos observar...

**00:08:52 - 00:09:20**

importante ali dentro dessa parte, que é o seguinte, dentro dessa mensagem ela pode ser respondida de modo anônimo ou não. Então ela tem uma classificação numérica tal qual o mercado livre inclusive em base anos por lá, mas a pessoa também pode dar sugestões por escrito ou fazer isso de forma anônima. - Sem pressão, né? - Um, sei e tal. Beleza. Aí é a sua

**00:09:20 - 00:09:48**

As informações são obrigatoriamente importantes de aparecer no dashboard, na home ali ou eu gosto de falar, eu posso construir melhor essas suas finalidades? Cara, eu gosto de utilizar seu potencial, que aí a gente vai discutindo no meio do projeto, mas eu não gosto de limitar, não, eu gosto de deixar ser livre pra voar.

**00:09:48 - 00:10:16**

para de melhorar a vontade. Essa parte aqui de baixo seria a avaliação dos atendentes. Essa construção aqui é uma construção antiga, a gente também não mexeu. Essa aqui já tinha, desde o visual antigo, que é o atendimento, a avaliação, o tempo de avaliação, o status, então, online ou offline. Então essa parte aqui também

**00:10:16 - 00:10:44**

a gente falou de melhorar, Pedro. Isso. É, porque como você pode observar, Moira, as informações e a forma que ela está disposta ainda é muito simplista quando a gente compare com outros players do mercado e são as mesmas informações que eles trazem, né? Mas eles trabalham melhor esse retorno dessas informações. Então, a gente queria sair dessa visão simplista e realmente entregar algo agregado, que é a pessoa vai dar uma olhada

**00:10:44 - 00:11:12**

A gente pode ver que a gente tem um parâmetro de comparação entre períodos, por exemplo, essa que a Estéla Nperdon passou, você faz a filtragem por períodos, mas você, por exemplo, não tem comparação entre períodos, você tem? É esse tipo de... Exato. Que a gente quer melhorar.

**00:11:12 - 00:11:40**

e o que é que é que ponto é vocês estão aplicando como recomendações de aças ou vocês não querem trazer somente as funcionalidades que tem agora não pode fazer coisa alta também esse tipo de informação pessoal no dashboard estão usando muito recomendação com esses dados através das

**00:11:40 - 00:12:08**

avaliações, pode dar um feedback ali, um feedback resumo, sabe tipo... Seria mais na pegada de sistema inteligente, né? Isso, só que ao mesmo tempo consome muito IATAM. Não, não, com isso não tem problema que a gente consegue trabalhar, consegue trazer períodos, consegue trabalhar internas e dependendo a gente coloca para rodar até um modelo em espécie. Não, um

**00:12:08 - 00:12:36**

porque essa é uma das coisas que eu quero trazer para o sistema. Eu entendo que o formato que o SAS trabalhava ele mudou totalmente no último ano. E essas automações são extremamente importantes para falar, por exemplo, tem de fato um sistema moderno com as características que o mercado busca hoje.

**00:12:36 - 00:13:04**

Ah, não, fechou, então. É porque isso aí é... isso me tem uma noção de que que eu devo construir. Fechou. Pode continuar, este, né? Podemos ir para a próxima tela. Esse aqui é a nossa tela de atendimentos. Aqui na tela de atendimentos, eu fiz uma mudança agora nessa última

**00:13:04 - 00:13:32**

semana, a gente tinha aqui um campo de busca, eu passei esse campo aqui pra cima, somente no botão, aqui a gente tem um campo de flag pra marcar agrupamento de setores, mostrar todos, no caso dos administradores, né, e agrupamento por setores que é a gente separar as listas, aqui no caso eu tenho a lista de testes, mas a gente tem outras opções de listas, seria nesse campo visual assim, e quando eu tiro o agrupamento

**00:13:32 - 00:14:00**

os setores ficam somente lista. Aqui eu tenho o campo buscar, que aí eu fiz dessa forma, ele aparece aqui um select de tipo de filtro e aqui embaixo o input ou um outro filtro que daí eu coloco para aparecer os atendimentos e tudo mais. Esse aqui é um campo de busca simples, e a gente volta.

**00:14:00 - 00:14:28**

continuou aqui na lista de atendimentos. Essa parte aqui seria a parte do nosso chat em si, todas essas mudanças visuais aqui foram ideias da nossa cabeça, teve bastante coisa que a gente mudou daquele plano inicial que tinha. Dá para melhorar essa parte aqui também. Aí temos os modais, que também dá para dar uma transformação nesses modais, a gente utiliza esses

**00:14:28 - 00:14:56**

Esses modais, assim, com sempre o título aqui em cima, o input, select e os botões, é um padrão total, né? São todos os modais dessa madeira. Mostra as conexões para ele, para mostrar o único que foge disso. Isso. Olha, aqui em Canais, que foi um redesenho que o Natan fez com as vozes da cabeça dele,

**00:14:56 - 00:15:24**

e a ajuda do Code ficou nesse formato aqui, que é um formato de card, e daí já tem os campos aqui com descrição, iconizinho, que já deu uma mudança do padrão que a gente tinha, porque antes eram assim, listas. A gente trabalhava com listas. Todas as outras telas a gente trabalha com esse mesmo visual de listas aqui. E aí o Natá veio com essa ideia

**00:15:24 - 00:15:52**

card que aí ele traz essas informações, fica um negócio mais visual, quando está conectado, que gera o QR Code. Ele fica assim, amarelinho para disponível para conexão, aí você gera o QR Code Connect, ele fica verdinho com os dados, entendeu? Então isso tem essa pegada aqui, dos ícones, dessa leitura visual, essa comunicação mais rápida.

**00:15:52 - 00:16:20**

Então, a gente gostou bastante dessa ideia dele, tanto que eu também coloquei em tarefas. Antes, a gente estava assim, não tinha nada, era bem sem nada mesmo. E aí, eu já fiz uma transformação visual e deixei parecido com esse, um pouco mais simples, né? Pra ter os cards das tarefas em si. Eu também fiz esse jogo de cores em si. Então, o que a gente pensa é fazer

**00:16:20 - 00:16:48**

algo parecido para essas outras telas, algo que fique com um visual mais fluido, que entrega essas informações sem ser essa pegada de lista, muita lista. Eu até falei com o Pedro o seguinte, dá para a gente fazer os cards, que entrega essas informações, e dá para deixar no cantinho aquela pegada de você seleciona se você quer ver cards ou se você quer ver lista. Então, às vezes, a pessoa quer ver lista, quer colocar

**00:16:48 - 00:17:16**

em ordem alfabético, que é colocar, entendeu? E aí ela consegue mudar. - Aham. - É, fica bom essa opção, né? - A pessoa viluliza. - Então, porque a gente tem muitas telas de listas, né? A gente tem que melhorar esse chat aqui também, né, Pedro? - É, a sua observação ali, enquanto ela estava passando os menus, é... Até para você entender.

**00:17:16 - 00:17:44**

Quando você seleciona o clínico, qualquer um dos nossos sistemas, muda o tema, Muriel. Mas, por enquanto, a gente vai focar só no clínico mesmo. Mas uma outra experiência que a gente teve, que tentamos organizar, é esse menu lateral. Tentamos separar ali, como você pode ver, os submenus, já para tentar trazer um ar mais clínico, e que muitas dessas funções

**00:17:44 - 00:18:12**

principalmente no ano de configurações, quais não são usadas? Ou vai ser usada ali uma vez por mês, entende? Mas é de quando, caramba, o cara tem que escrolar um monte, tem um corredo de informação. Então, você tem liberdade total, para, por exemplo, se falar, Pedro, cara, é assim que funciona, é o melhor formato, é a sua experiência que compra. Aí, se você conseguir pensar em alguma coisa ali, também seria bacana. Tá fechando.

**00:18:12 - 00:18:40**

Algumas ferramentas, né? E aí aqui embaixo tem muito de cadastros, né? São todos cadastros aqui. E aí a pessoa quer chegar aqui em configuração para pegar alguma coisa, ela tem que escrolar tudo. Então... Eu costumo colocar tudo dentro de configurações, né? Quando é, por exemplo, questão de API, o próprio... Evolution também, ou o API do WhatsApp, no caso, é...

**00:18:40 - 00:19:08**

do caso a peridora já como tem vários números pode ter deixado a separada. A gente tem a estrutura também, não utilizamos a Evolution. A Evolution é baseada na... Você usa o oficial mesmo, né? Não, a gente usa o oficial e a não oficial, a gente utiliza... A Evolution também é feita em cima dela. Infugiu. É, mas é uma livre e tal. A Evolution pode ter

**00:19:08 - 00:19:36**

A gente tem que ter feito em cima dela, só que na época que a gente começou a desenvolver, não tinha Evolution ainda, entendeu? Então a gente desenvolveu em cima dessa outra, mas a gente também utiliza Evolution em algumas aplicações, porque é pronto, é utilizada... Bem fácil. Bem fácil. Mas aí você falou, da prioridade a gente juntar muitas páginas ali. A partir de cada ápita eu acredito que dá para fazer

**00:19:36 - 00:20:04**

uma tela de cadastros, cadastros de setores, cadastros de filas, cadastros de usuários profissionais, covenhas, vai ter as exames que também dá para colocar, porque as exames novas que eu entendi de cadastro, de exames, então já dá a lista de arquivos, tudo isso dá para colocar em uma tela de cadastros registros, algo assim, continuando aqui das telas que a gente tem que são diferentes,

**00:20:04 - 00:20:32**

diferente, né? A gente tem essa tela de chat interno. É uma tela bem simples, é só o balãozinho, né? Aí tem aqui o jogo de cores e tudo mais que eu fiz de cá, parecido com a tela ali do atendimento. Aí tem essa questão, né? Aqui no branco. É só o input aqui de texto e o balãozinho. Não tem mais nada, né? Então, pra gente redesenhar essa

**00:20:32 - 00:21:00**

a usabilidade dessa tela em relação aos clientes. Eles gostam, eles utilizam bastante, né, Pedro? Dá pra gente gastar bastante tempo mexendo nela agora ou não. É que sim. Atualmente, eles não utilizam muito, porque ela acaba sendo muito ciclista. Ela é importante, Murilo, porque no setor puro você não pode utilizar o WhatsApp oficial, ou WhatsApp oficial, não. O WhatsApp pessoal. Então, você tendo a opção chat interno, mesmo que o Murilo utiliza o pessoal dele,

**00:21:00 - 00:21:28**

depois vai processar a feitura, o proprietor fala "você tinha um chat interno, você não usou porque não queria". Mas se tiver alguma ideia de tornar ele mais completo funcional, de fato, seria uma oportunidade de trazer ele com um valor mais agregado. E ele tem a notificação aqui em cima, então ele avisa, quando cai mensagem, a pessoa está trabalhando aqui, fazendo os atentamentos, ele consegue

**00:21:28 - 00:21:56**

Vê uma mensagem, consegue ver as coisas aqui dentro. Essa tela aqui, Pedro. Essa aqui, a gente queria muito essa transformação, né? Agenda Nantes. Mas eu acho que essa daí, a do Kamban e as tarefas, a gente vai passar desenhar, porque a gente vai implementar novas regras de negócio. Ah, sim. Até porque?

**00:21:56 - 00:22:24**

pegar alguma coisa mais desenhada, ele tem o potencial de melhorar. Se a gente não tem alguma coisa muito vaga, ele vai jogar o potencial dele em cima de criação. Então, a tela de Kamban... Entendeu? Essa é a nossa tela de Kamban, até bugou aqui agora o negócio. Cara, a gente tem que criar uma automação em cima desse Kamban, que ele atualmente, não sei se você já se que farou com esse modelo de...

**00:22:24 - 00:22:52**

de trabalho, ele é só para relacionar ali dentro de um funil em qual etapa, tarde, ele funciona basicamente em cima de tags. Mas a gente queria trazer um câmbado funcional ali, no sentido de automação, entende? Por exemplo, eu tenho o Pedro aqui, que é o usuário, que tem relação com relacionamento com conversa. Mas ao mesmo tempo, existe um negócio ali, um serviço atribuído a ele.

**00:22:52 - 00:23:20**

E dentro desse serviço, eu tenho a etapa, por exemplo, de cobrança. Ah, o Pedro não fez o pagamento, beleza. Então, passa para o segundo step ali, dentro do segundo step ele vai estar a uma função, mesmo que seja, por exemplo, enviar o Pedro, me pague aí só para o Silão, entendeu? - Eu vou falar o ópsico. - É, então, a gente ainda está formulando essa ideia, então ela ficaria para um segundo momento, para a gente trabalhar em conjunto, não jogar só para cima de você, entende?

**00:23:20 - 00:23:48**

Então, tipo, a página de Camban, o de da mesma ou qualquer outra que você falou aqui? - Tarefas. Tarefas a gente já... Já remodelou, né? - É, já remodelamos. É que tá na outra... outra brain. Mas a de tarefas a gente colocou parecida com a de Canais. Que ela tem esses cardzinhos com as informações da tarefa. Usuários responsáveis, setor e tudo mais. - A gente trouxe a metodologia do Camban para essas tarefas também, igual.

**00:23:48 - 00:24:16**

Então, dentro do backlog, tarefa está sendo realizada. Porque a tarefa também está funcionando como um bloco de notas. Mais ou menos a ideia é que talvez ali no chat tenha alguma coisa que possa fazer mais sentido para a utilização. Porque as tarefas antes eram um bloco de notas. Eu não relacionava quem era responsável por ela, não tinha um gestor, por exemplo, que podia atribuir tarefas

**00:24:16 - 00:24:44**

sobre alguém. Você só escrevia e adicionava. E aí, através dessa estruturação da Estela, a gente conseguiu dar uma funcionalidade maior para ela. E aí ela vai começar a ser mais utilizada. As demais telas aqui em Google agenda, ela segue, ele vai seguir aqui o agenda do Google, então, pessoal, também, no caso

**00:24:44 - 00:25:12**

daria para transformar se queremos mudar essa parte de botões, né, Pedro? É. E é um padrão de todas as telas, né? Tito... Pesquisar botão. Tito... Pesquisar botão. Podemos também transformar essa questão aqui, tanto o formato dos botões que dá para melhorar, porque a gente está com esses botões, eu, assim, não acho feio, mas esse tipo de botão aqui grande, ele entrega um visual um pouco mais antigo.

**00:25:12 - 00:25:40**

Então, se você tiver uma ideia mais... - Mais clín... - Mais clín, mais atualizado, porque a gente tem aqui, ó, o menu ele é como se fosse vários botões grandes, então a gente está com muita essa pegada de quadrados e listas, então dá pra melhorar essa parte aqui em cima pra gente ter um padrão mais bonito, às vezes aproveitar mais espaço de tela com as informações, né?

**00:25:40 - 00:26:08**

Aqui, respostas rápidas, é lista. Lista de arquivos, tem todos a mesma estruturação das páginas. Então dá pra gente ter ideias individualizadas conforme ferramenta, mas a maioria delas é nessa pegada de cadastro. Aí você abre, tem um modal. Você abre, tem uma lista.

**00:26:08 - 00:26:36**

Configurações. Essa aqui temos as questões do Select. A gente trabalha com esse Select aqui do MIUI nessa pegada. Quadrado, borda colorida conforme o tema e essas listas. Dá pra gente trabalhar um tipo de listagem ou tipo de Select um pouco mais clínio, um pouco mais limpo também. Porque esse aqui dá pra ver que ele ocupa bastante espaço, a largura dele.

**00:26:36 - 00:27:04**

ele não vai dar bem em informação, não entrega, mas ele ocupa bastante espaço quando a gente pega, por exemplo, aqui em Canais, deixa eu ver. Essa aqui é uma tela que o Natan restruturou, eu estou vendo até aqui esse scroll aqui que tem que mudar. - Um dos dois mil aí no meio. - Aí aqui, a gente tem aqui um campo de Tolkien, ele é grandão,

**00:27:04 - 00:27:32**

nós temos os... mas que esse é até o nome desse negócio aqui. Aqui tem os campos de mensagem, né? Aqui, todos eles ocupam um grande espaço na tela para uma informação que às vezes poderia ser menor, conforme o tipo de select, o tipo visual que a gente colocaria aqui. Então, se tiver alguma ideia que deixe clean, que mostra a informação, mas que deixe esses

**00:27:32 - 00:28:00**

com um visual mais bonito, mais limpo, seria legal. Tá certinho. E é isso. Mais alguma tela em específico, Pedro? Aqui configurações, nós temos abas, né? Também dá pra melhorar essa questão dessas configurações.

**00:28:00 - 00:28:28**

deções aqui. A gente pode também trabalhar com a parte de Cards aqui dentro, porque aqui em cima, por exemplo, eu quero a empresa 1, aí aqui preencho os campos, que é aqueles campos grandes, que eu falei, né? Aqui tem os botões e aí a gente tem aqui embaixo vai aparecer uma lista de empresas, então aqui se a gente seria só esse pequenininho aqui, essa área pequena aqui só, que teria essa apresentação dos dados da empresa.

**00:28:28 - 00:28:56**

que a gente tiver 15, 20 empresas aqui dentro do cadastro, vai escrolar nesse espaço pequenininho. Então, a gente pode trabalhar pra utilizar um pouco mais aqui da tela pra ter esses campos aqui e o restante de cards aqui, entendeu? Ops, são as configurações básicas, né? Aí nós temos aqui mais um modal com bastante

**00:28:56 - 00:29:24**

A pesquisa de satisfação a gente configura daí as mensagens de pesquisa, essas partes aqui são configurações da empresa principal, os planos, tudo a gente trabalha com essa questão de listas e os campos que são editáveis. E aqui é a partir da aparência que a gente faz a troca pro clínico e pro clássico.

**00:29:24 - 00:29:52**

mas a princípio a única diferença dele seria o dashboard, que aqui o dashboard dele está no modelo antigo. Era isso e a gente transformou. Aí no caso vai manter só um? O plano principal primário agora do Pedro é essa mudança no clinical, porque todo o sistema

**00:29:52 - 00:30:20**

se ele segue o mesmo padrão menos o dashboard. Então o dashboard do clássico ele ainda vai ser mantido e depois a gente pode melhorar, pode atribuir. Eles são parecidos algumas coisas então a hora que quiser passar essa transformação para o dashboard do clássico é mais fácil. Combinado, galera.

**00:30:20 - 00:30:48**

São quantas partes então, mas ou menos? É, eu deixo contatos... Então... Então... Quais aqui? Os modais, etc. Até para você entender a forma que a gente quer desenvolver. A gente vai fazer na teoria do Jack, separar ali por partes. Até para a gente poder te dar o respaldo que você precisa, não jogar isso de forma

**00:30:48 - 00:31:16**

na sua responsabilidade e também à medida que a gente consiga ir desenvolvendo em paralelo. A ideia é entrega um, desenvolve, entrega outro, desenvolve para a gente ter uma sequência ali organizada sobre esse desenvolvimento. A única observação que, inclusive, eu queria trazer esse debate para você, Murilo, é que a gente está testando novas tecnologias,

**00:31:16 - 00:31:44**

não só o Codex junto com o Ovisilla e etc., mas entendendo um pouco mais como funcionam esses conceitos novos de desenvolvimento low-code, na verdade, no-code, né, agora. E a gente queria, enfim, fazer essa reestruturação do nosso front-end utilizando essas ferramentas. Em um estudo prévio,

**00:31:44 - 00:32:12**

Eu entendi que o próprio... Meu Deus, muito de novo. O plano que a gente usa para o I/O X é Figma. Ele tem a estrutura onde você monta as telas, ele te gera um próprio HTML e muitas vezes ele consegue gerar parte do sistema também. E também tem o Codex, tem um milhão de coisas que a gente pode utilizar essas intras. Eu queria que quando você desenvolvesse

**00:32:12 - 00:32:40**

desenvolver-se pensando nesse sentido, que a gente vai utilizar uma... uma automação, não, né? Mas a gente vai utilizar uma gente para ajudar a gente a construir essas telas dentro do nosso sistema. Não sei se essa informação muda alguma coisa também, porque do formato que você tem... A gente estrae também, mas enfim, eu acho que... que nos ajudaria. Agora, só para a gente dar continuidade,

**00:32:40 - 00:33:08**

"Ah, de pessoal, eu vou adicionar dentro daquele grupo designer que a gente tem, Muriel, a Estelane, ela vai ficar responsável junto com você para essas mudanças, então ela que vai reforçar tudo pro time, quando tiver alguma dúvida, ela que vai continuar pra poder te ajudar." E aí eu não sei, primeiro, por onde você gostaria de começar pensando em critérios da de página,

**00:33:08 - 00:33:36**

E o outro também, que não sei se você quer acesso a plataforma, se é interessante, ou só um print das telas. É importante você tiver um git para me organizar. E aí, a princípio, eu faria uma análise do estilo de design que vou fazer, as personalidades ali.

**00:33:36 - 00:34:04**

para poder organizar tudo, né? Tanto questão de menus, as categorias e depois as funcionalidades ali, né? Aí, fazer um generalzão primeiro, e aí, no caso, vocês gostariam que fizessem pagina por pagina? Ou... Como é que vocês... Ou posso entregar tudo de uma vez? A sua produção, ela é independente, você achar melhor.

**00:34:04 - 00:34:32**

É, eu prefiro integrar tudo uma vez já, porque eu vou corrigindo. Sim, mas para a gente desenvolvendo e editando feedback vai ter que ser por partes, se isso não for um problema para você. É ruim só o fato de que às vezes eu estou fazendo uma tela e eu vejo que outra não ficou interessante a conexão, às vezes uma coisa vai mudar, vai ficar meio

**00:34:32 - 00:35:00**

quebrado, sabe? É porque a maioria das telas, Pedro, elas têm um visual parecido em si, né? Quando fala de tela de listas e modais e tudo mais, o visual de botões vai ser uma coisa que vai abrangir todas as telas. Então, se for pra pegar algo pra fazer específico, pra gente já começar, dá pra pegar essas telas que têm visuais diferentes, que você queira às vezes, você quer a tela de

**00:35:00 - 00:35:28**

para poder trabalhar nela, para fazer alguma transformação específica nela. Então, daria para ele começar por uma tela assim, entregando alguma ideia já e depois fazer alguma alteração do geral dos botões ou modais e coisas do tipo. Ou ele fazer tudo e entregar tudo, porque é uma coisa que vai relacionar tudo, né? Se a gente muda o botão, muda todo o estilo de todos os botões, todos os estilos...

**00:35:28 - 00:35:56**

Isso, isso é tudo. A gente pode fazer, eu entendi, vocês têm razão, mas até para a Estelar e tem sumo já, a gente pode fazer um misto no sentido de eu precisaria que você, por exemplo, iniciasse pelo dashboard, que eu acho que é algo que vai impactar bastante a gente agora, e a gente pode implementar esse modelo dentro do nosso antigo, e depois você tem ali a

**00:35:56 - 00:36:24**

pra trabalhar no sistema como um todo. Acho que ficaria bom pra você, de forma. Então fazer o dashboard primeiro e depois eu finalizo o restante. Poderia ser? Se não, eu vou te acompanhar, claro. Dá pra fazer. Aí... Às vezes eu tenho alguma coisa, mas eu vou te... vou te... vou... tô me contando no grupo lá, confirmando. Não, perfeito.

**00:36:24 - 00:36:52**

E aí eu vou correr internamente, nós vamos correr internamente, para te trazer em uma versão atualizada sobre o Kamban, as tarefas, a Estedane já consegue te liberar uma doição que tenha ela, e a parte de... Não era isso que a gente vai alterar. - No caso, acho que nem preciso do Git, não, é tipo... - Assim, assim.

**00:36:52 - 00:37:20**

- É um acesso do site mesmo. - É qualquer coisa, Pedro, dá pra passar um acesso pra ele daquele do mecânica que a gente tava usando pra testes, que ali tá teoricamente atualizado. Não tem a minha alteração de tarefa, faz alguma coisa assim, mas ele tava bem atualizado, que ele consegue ver o visual assim mais "groff" em si do sistema. - Não, perfeito, qualquer coisa, essas telas você pode compartilhar com ele através de

**00:37:20 - 00:37:48**

dentro do grupo também. Então pessoal, primeiramente, obrigado Stellane, obrigado Muriel pela disponibilidade aqui de estar conversando e pensando nessas melhorias em conjunto. Eu já vou criar um grupo em seguida da nossa reunião e aí Stellane já vai, assim que possível, liberar esse acesso pra você.

**00:37:48 - 00:38:16**

- Eu vou passar nos prazos, os... - Não, eu não sei o que eu desparço assim. E aí a gente vai trabalhando aí. É, até pra você ter uma ideia de praça, primeiro precisa ver o sistema, né? Mas enfim, conto com todos vocês e vamos pra cima, galera. - Bom, é pra cima. Vai ficar massa esse... esse fronteiro de... - Vai aí. - Vai ficar foda, você é foda, Brilão.

**00:38:16 - 00:38:44**

- Boa, valeu gente. - E, Murilão, pode ficar mais uns 5 minutinhos aí comigo? - Posso, posso. - Faleu então, pessoal. Boa tarde, até mais. - Tchau, Tariq. - Tchau, Tariq. - Tchau, Tariq. - Tchau, Tariq. Até mais. - Deus, tchau, tchau. - E, Murilão, como que andam as coisas? O Maurição estava aí enchendo as paciência? - É, eu fui levar Marcinho no hospital. Aí eu... A gente tá de mudança, que tem um pedido de lá. Aí o pessoal falou pra ficar atento aqui. - De mudança?

**00:38:44 - 00:39:12**

- É, foi a muda... a outra casa. - Ah, tá reformando a casa. - É, tá reformando só. - Ah, cara, que legal. - Mas pô, vocês nunca pararam de reformar também, né? - Não, aqui, essa casa aqui é reforma infinita. - Mas toda vez que eu vou ir, tem um trem diferente aí. - É reforma infinita. - Oi? - Reforma infinita, essa casa aqui não cá. - E é um casão, não vai errosão, né, velho? Então, vale a pena investir. - Não, vale, vale.

**00:39:12 - 00:39:40**

Mas da hora cara, e quando tá sua mãe é brilhão? Vai tá... assim, tipo, é de um mesmo jeito, sabe? Nem melhor, nem pior. Pra tomar no sermerde, né? A vermelha de eu deixa só estáguinho. E como você tá, irmão? Ah, tipo, não tem... não tem muito que fazer não, inclusive, cuidado da minha saúde, menina. É... se não for que eu...

**00:39:40 - 00:40:08**

- E os nossos avós aí, os dois tiveram? - Tudo isso nós, né? - Isso aí é pra... - Cuidado, saúde. Mas em relação a tudo isso não, tá tranquilo, né? O que acontece, normal. - Na vida... - É, na vida às vezes basta a gente tomar as formas que a gente não imagina. - É, é muito nova, né? - É muito nova. - Pra até isso. - Não é muito nova mesmo.

**00:40:08 - 00:40:36**

A minha tia sempre foi ativa, sempre foi... - É... -...egetica, né? - É igual a vó mesmo, né? - Vó, vó, meu... - Oh, porra, vó, meu Deus, cara! Você não pegou essa época, mas ela levava eu e sua irmã para os bairros da Velha Guard, irmão. - Não, ela ativa para casa, em tudo... -...em quantas coisas. - Ela batia... batia cartão lá, cara. - Ela aí, no CES,

**00:40:36 - 00:41:04**

também na academia, a atividade da todos. Isso é da hora. E você cuida bem da sua cabeça, do seu corpo na casa, isso aí é virtuoso. É uma parada da hora. Tem que matar isso não. Tá, fechado. Murilão, primeiro, mano, queria trocar uma ideia contigo, eu te peço desculpa por passar ali um período sem conversar com você.

**00:41:04 - 00:41:32**

Então, no meu tempo, é isso que eu quis explicar lá no início. Você é fundamental, cara, ali dentro da nossa estrutura, mas é diferente, por exemplo, da Estelã, da Estetra, da William, enfim, tá, galera? Porque os seus trabalhos vão ser pontuais, entende? Às vezes, porque a demanda ainda vai surgir, e às vezes, porque a gente precisa de um

**00:41:32 - 00:42:00**

até colocar isso para causar... Enfim, a sua parte parece ser mais ágil. Parece não, né? Ela é mais ágil do que o que a gente consegue acompanhar. Até porque tem toda uma estrutura de processos ali dentro, que de certa forma acaba ingessando tudo. Mas, claro, queria uma percepção de você, nada a hora, nesse formato, a gente fez uma recombinação ali.

**00:42:00 - 00:42:28**

Eu quero um feedback seu. Não, é para focando na parte de sites, assim, para mim faz mais sentido. E pelo valor é mais... faz mais sentido nesse valor, só no site. É, eu entendi que é para a gente não misturar as coisas, né? Quando você estiver trabalhando de y ou x,

**00:42:28 - 00:42:56**

é de IUEX, ah porra, acabou as demandas aqui, a gente senta de novo conversa seria nesse sentido, né? É, não, não caso o contrato mais pra IUEX mesmo, né? Se quiser acrescentar outro serviço em ti, foi... Não, não, beleza, vou... vou manter você só nessa linha. Não, nessa linha mesmo. É, se... ah, eu preciso de alguma coisa, eu te chamo de enxagoucer por favor.

**00:42:56 - 00:43:24**

Mas, quase, isso só vai levar um pouco mais de tempo, né? Que são muitas telas ali, no caso, né? E muitos modais ali. Eu entendo. É, inclusive, queria entender um pouco mais justamente por isso. Porque assim, vão ter momentos que você vai estar ansioso, porque a base da base do nosso acordo são minores, né? Aí, caralho, se eu mais termine 15 minutos, será que não pagou essa porra?

**00:43:24 - 00:43:52**

Todo ano calote no Google. É isso, Mítia é bugado. Inclusive nem tá carregando aqui para fazer o pagamento. Então deve ter dado uma bugada mesmo. Tá, mas enfim, voltando ali ao off do da ameada. Então vão ter momentos, ouciou os momentos que você vai ter que colocar uma carga maior de energia ali.

**00:43:52 - 00:44:20**

É flexível e, enfim, te dá uma dinâmica boa de trabalho também, né? Só queria que você entendesse que vai ter esses dois momentos ali. Às vezes fica uma semana parada e na outra semana você tá feito coisa pra fazer. É, normal. Estamos acertados para contar isso e vamos fazer essa parceria funcionar. Eu acredito em ganhar o seu potencial. Quero ter você ao meu lado. E a gente vai negociando isso.

**00:44:20 - 00:44:48**

Outra coisa sobre essa questão, mano, você está bem equalizado sobre outras plataformas e tudo, inclusive, a sua própria sugestão de trazer um sistema mais inteligente, automações internas, feedbacks, puriá, pode usar tudo isso como potencial. E não tiver de filtro ali, a gente achar que é interessante a gente desenvolver. Seria muito bom poder contar com essas informações

**00:44:48 - 00:45:16**

se você tem que ter uma bagagem a mais do teu trabalho, que é um conhecimento de fato. E outra coisa que eu queria ver com você, como eu te expliquei lá no início do nosso acordo, o teu trabalho está atrelado a outros trabalhos, outros contratos, como por exemplo, o do Anderson, você viu quando o dinheiro chegou em você, a outra parte dele foi direcionada para o Anderson, a parte dele do serviço, que eu tive que engloberar tudo em um

**00:45:16 - 00:45:44**

para dar só, entendeu? E aí cara, eu tenho um próximo pagamento para realizar agora. Tudo bem se eu adiantar, porque eu adiantei para eu falar, eu estou com o pagamento agora, que seria agora no dia 10, né? Isso. Tudo bem se eu adiantar o próximo também, ou você acha que isso complica, porque eu posso organizar esses pagamentos em duas fases, entende? Uma para acertar com os meninos, a

**00:45:44 - 00:46:12**

para acertar com você, queria entender o que funciona melhor para ti. Não pode ser, até porque... no momento agora, você faz sentido também. É, tipo... Estou de mudança. A gente pode fazer essas jogadas, entende? Eu só não quero... Porque, tipo, você está sempre adiantando. É... Eu tenho conta ali no dia 10, mas o pedrairo me pagou no dia 15 do mês passado.

**00:46:12 - 00:46:40**

Ah, porra, me fudeu. Então, quero deixar também aberto pra você isso daí, tá? Você fala, "Pô, Pedro, olha, esse mês eu preciso receber tal, esse mês, enfim, a gente vai trampando essa dinâmica, tá de lá?" Não, fechou. Pode, pode, aí você me avisa quando precisar de adiantar, aí eu te falo se... É, se tudo bem por você, eu vou mandar a fatura dos meninas nos hoje, e eu já junto com a sua. Tá, fechou.

**00:46:40 - 00:47:08**

pode ser? aí eu acredito que entre amanhã ou depois já cai na sua conta. -Tá. -Como não. -Embro, mais uma vez, obrigado, bora pra cima, conto com você. -Certo, irmão, com Deus. -Mandou um abraço por favor, Valinho. -Pode deixar, mandou um abraço também a sua família. -Pechado, eu vou estar em... em Franca. Acho que acredito que nas próximas semanas, vamos dar um rolê

**00:47:08 - 00:47:36**

Vou dar uma passeada aqui. Vou dar uma passeada aí. Sai de jantar. É rolê de casado, então não vamos pra balada não, mas... Com meu Bapiz, trocar uma ideia, jogar um basquete... Boa, boa. Tô com ideia, acho que é uma... A gente pode fazer uma ódvio também. Exato, mano, a gente precisa unir a nossa família. Uma ódiva que eu vi aqui semana passada, né? Ficou jogando aqui. Não faz mais sua obrigação, a gente... Mano, vai ter a ver que eu não...

**00:47:36 - 00:48:04**

- É, eu mando mensagem para eles arrombar de vez em quando, o Ruan, eu estou bem próximo dele, então a gente sai, faz nossos negócios. - Ele está mandando numa região próxima do Paraguai, que fica perto da casa mesmo. - E mora no Paraguai, mas eu estou direto lá. Inclusive se você quiser alguma parada do Paraguai, provavelmente eu vá antes de ir para a Franca, tá? - Quando você vai lá? - Mano, nas próximas semanas, é só uma próxima. - Você tem noção de

**00:48:04 - 00:48:32**

Quanto que é... Eu acho que você vai precisar de trocar um celular, mas que é... Mano, eu comprei um... Só que aí, pra você passar, você tem que passar como se fosse eu, né? Parado assim, né? Não, eu só coloco meu e-mail lá e depois você farmata ele. Eu comprei um 14 Pro. Assim, eu não ligo muito pra ser o atual ou não, tá ligado? Não sei, não sei. Mas eu paguei três e aqui tá sim.

**00:48:32 - 00:49:00**

14 Pro Max, né? Não, meu é só o próprio, porque o Pro Max era grandão, mano, é uma bosta no gosto. É dependendo da tominha da tela ficando um índice. Não, ele é grandão, ele é grandão mesmo. O Pro já tem as 30 da mesma coisa, só tem a tela mesma. Então, eu ia ver o último mesmo, o 17 por conta da câmera mesmo,

**00:49:00 - 00:49:28**

eu precisaria de uma câmera boa mas eu não sei também, você acha que muda muito por 16, do 15, do 17, qualidade? Mano, na moral a linha Pro, a terceira câmera, além dos sensores ela tem a gente soque profundo, sei que trampa com vídeo, isso é do caralho, os cara compra os Pro justamente por ela, então qualquer um dos Pro tem, mas os S/E e os outros não tem, não? Não tem, não.

**00:49:28 - 00:49:56**

Então vai fazer diferença, mano. - Na moral, tem que ser... - Você acha que faz sentido sair do 16x17 ou o 16 ainda com a pensão? Ah, Murilão, o Boanzin vai saber mais, é porque ele conta tudo. Mas... Eu vou dar uma pesquisada aqui, porque eu não sei... Lá não tem mercado de usado assim, que dá para comprar, né?

**00:49:56 - 00:50:24**

Tem isso quando eu comprei, eu tomei pal. - Visuado? - Não, mano. Vendê-lo um que tava com uma das câmeras sem funcionar. E aí, como que eu descobri isso? Quando eu fui usar esse jeito que eu te falei. - Nossa. - Porque você abre, a câmera é normal, é bom pra caralho, a imagem... - As caras peçam na hora, ela nem... - É. Aí eu vou lembrar de colocar meu dedo próximo da câmera pra focar nele e desfocar o resto. Não, meu velho. Eu falei no cu. Mas assim...

**00:50:24 - 00:50:52**

o Juan aplica dessas. Então você se chama lá bom, mas mano, é sem garantia, porque inclusive foi esse que foi ele que o pegou. Sem garantia. Sem garantia. Assim, existe, mas tem esse disco, mas agora você precisa valor, mano, entra lá no Shopping China, lá tem todos os valores, você só fala o que você quer, e eu pego pra você. Então, eu fecho

**00:50:52 - 00:51:20**

eu te mando mensagem aqui, mas eu comprei um 14 pro max até explicando isso porque a configuração câmera em mais uns parados dele é equivalente ao 16 ela é melhor do que a do 15 e aí por isso que a tanta diferença dos dois, né, 50, 60, é muita pouca diferença, só que os dois são o 14 é equivalente ao 16, porque na

**00:51:20 - 00:51:48**

no 15 fez era uma parada lá, mudaram o chip, sei lá das quantas? Tem estado nos engaços de origem, né? É, tem esse bagulho, você pesquisar na internet, você vai ver os cara falando isso, que entre o 14 Pro e o 15 Pro, eu penso que o 14 Pro, porque ele é um pouco mais barato e entrega igual a 16. É, dependendo, eu acabo pegando um menos mais barato também. É, ele eu paguei 3 mil, mano, mas no shopping china, você vai encontrar não só a relação do nome, mas a loja que tem ele.

**00:51:48 - 00:52:16**

e a MCM pass que eu vou direto na loja. - Pessoal. Obrigado, Almané. - Almané, e a motinha? Estou esperando o resto do orçamento, que demora pra caralho, cada vez que a gente pede há 15 dias para retornar a informação. Mas eu mandei aqueles modelos, tem uns modelinhos mais baratinhos que chegou, que vai estar saindo ali na casa de R$ 1500 a R$ 2000, que é essas motinhas de R$ 4000, R$ 5000 que os caras estão vendendo.

**00:52:16 - 00:52:44**

Aí o Ruans também vai comprar, mano. Aí talvez dê pra você pegar na cota dele. - Ah, pega junto. - Não, falei errado. Roger. - É o Vick que está vendo, né? - Ele tem um paraguai? - Ele está pegando um Paraguai, agora vai começar a pegar um Paraguai comigo. Porque é mais barato que um Paraguai. Por isso que eu entrego aqui no Brasil. Você tem no, você tem 29. Tudo certinho. - Isso aí é bem bem...

**00:52:44 - 00:53:12**

melhor, uma margem maior que um nosso. É, saem mais baratos por decedor, porque eu que importo para vocês, entende? Se eu fosse vender como importador eu venderia outro valor, mas eu importo direto para vocês, aí você tem que pegar na cota de alguém e dá para você pegar na do board. Eu acho que eu vou criar até um grupo, mano, porque esses é muito arrombado, a gente quase não se conversa, velho. A gente é para isso, mano. Tem que trocar ideia, mas com os caras.

**00:53:12 - 00:53:40**

O Roger... Não, não, vai tempo, não vou falar que foi esse dia. Uma vez eu conversei com ele no Instagram, nem lembro quem na curso. Mas eu sempre estou acompanhando, ele acompanha as coisas também, acompanhando lá. Só que não falo, né? É, é, é, mano, é todo mundo mais engraçado. Isso aí, véi. O Juan é porque os caras são mais velhos também, né? É. Não, não zoando, mas tipo...

**00:53:40 - 00:54:08**

Porque a minha idade conversava mais corruando, né? É, não, é que o Rafael é a minha exclusão mesmo, que é o mais velho de nós, né? Com o David, eu não tenho muito assunto. É, o David... O David a gente pôr pra caralho, só que não convivo, né? Mas a gente precisa pro V, mano, porque é fórdio vergonhar na cara mesmo, gente, a família, pô. Pelo menos ali, sei lá, relembrar a infância, falar mal dos outros. Então não vale brigar por política.

**00:54:08 - 00:54:36**

né porque eu vou querer o pau aí a porra vou criar um grupo agora na época das eleições da merda vai ter um esperar isso aí pro ano de eu vou explicar que nós é de direita mano aí põe um pausa temporário na eleição no grupo é a manha ele tem esquerda tem direito tem cento tem a patifaria toda eu sou de bom mas até é até amigo sim até a mina

**00:54:36 - 00:55:04**

- Não, principalmente, meninas, estou nem... - É, sabe por que? O bagulho da realidade é o seguinte, mano, eu ouvi isso da inclusão política. Você tem que torcer para quem te favoreça. Se você é ruralista, mano, você tem que torcer para quem vai lá e resolver problemas de ruralista, não é, pô? - De fato é. - Se você, sei lá, enfim, numa base que precisa de ajuda social, mano,

**00:55:04 - 00:55:32**

vai lá e mete o petezão, está tudo certo, mano. Pra mim é isso. Eu fico ali do centro porque eu gosto da direita mas eu defendo algumas coisas sociais, mas diferente. Então, no final não sou porra nenhuma, é igual que sexual, né? Sem ganhar, bem é. Que isso? Então ali não vira nada, eu gosto. Mas... Pesso, mas sou assim, não posso habitar ao lado, não.

**00:55:32 - 00:56:00**

Esse mundo é muito polarizado, né? É, filho, dá pra saber quem é quem também, tipo, os caras falam um bagulho, não... os botidores têm muita coisa. É, ele é tudo... e essa é a verdade, os policiais são tudo filha da puta, então... - Dá pra confiar, não? -...difo roubado. - É foda. - Fechado, meu querido, tô entrando. - Fechou, eu te mando o topo lá. - Em outro rei, ó, aqui.

**00:56:00 - 00:56:28**

- O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? - O que é isso? O que é isso? O que é isso? O que

**00:56:28 - 00:56:56**

[Som de porta]

**00:56:56 - 00:57:12**

[Som de porta]

