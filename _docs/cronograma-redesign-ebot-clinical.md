# CRONOGRAMA DE REDESIGN — Ê-BOT CLINICAL

**Período: 20/07/2026 a 08/08/2026**

O Dashboard, o Header, a Navbar, a Primary Sidebar, a Contextual Secondary Sidebar, o App Shell e a base do Design System já estão estruturados. Esta próxima etapa será dedicada às demais páginas da plataforma, usando a auditoria atual como base para priorizar operação, clareza e consistência.

Também vou manter um olhar criativo durante o desenvolvimento para sugerir novas funcionalidades pensando na operação das clínicas, sem ficar limitado ao formato atual do sistema. Essas sugestões serão apresentadas separadamente e não serão tratadas como entregas confirmadas quando dependerem de backend ou de novas regras de negócio.

## SEMANA 1 — 20/07 a 25/07

### Prioridade da semana

Estabelecer o principal padrão de operação do Ê-Bot Clinical: leitura rápida, tabelas, busca, filtros, estados, conversas e ações relacionadas ao atendimento. O foco será reduzir a carga visual das páginas mais utilizadas e aplicar os componentes já definidos no novo Design System.

### PÁGINAS / LINKS

- **Login** — revisão de integração, estados e continuidade do fluxo existente, sem criação de uma nova experiência de autenticação.
- **Atendimentos** — `/tickets`
- **Contatos** — `/contacts`
- **Protocolos** — `/protocols`
- **Origens de contato / Relacionamentos** — `/ticket-contact-origins`
- **Chat interno** — `/chats`
- **Tarefas** — `/todolist`
- **Kanban** — `/kanban`

### ESCOPO DO REDESIGN

**Atendimentos — redesign completo da experiência operacional**

- Reorganizar a leitura da lista de atendimentos, conversas e informações do contato.
- Melhorar a hierarquia entre atendimento, setor, fila, status e ações.
- Estruturar busca, filtros, agrupamentos e estados de atendimento.
- Revisar chat, detalhes, modais e drawers relacionados ao fluxo.
- Criar uma leitura responsiva para tabelas e listas em tablet e mobile.
- Aplicar estados de carregamento, vazio, erro, atenção e sem resultados.

**Contatos — redesign completo da consulta e dos fluxos de tabela**

- Reorganizar a tabela, busca, ações e informações principais do contato.
- Padronizar estados, paginação quando aplicável e comportamento responsivo.
- Revisar acessibilidade de botões, cabeçalhos de tabela, labels e regiões roláveis.

**Protocolos — redesign completo da consulta operacional**

- Melhorar a leitura dos dados de protocolo, cliente, setor, fila, status e data.
- Corrigir a hierarquia da busca e organizar ações relacionadas ao relatório.
- Definir uma solução responsiva para a tabela extensa.

**Origens de contato / Relacionamentos — redesign completo da tabela**

- Organizar relações entre ticket, contato, origem, WhatsApp e data.
- Melhorar a identificação das ações por linha e a leitura em telas menores.
- Preservar a rota atual e a lógica existente.

**Chat interno — adaptação visual com melhoria de hierarquia**

- Organizar conversas, tabs, disponibilidade e notificações.
- Tornar mais clara a utilidade da ferramenta no fluxo interno da equipe.
- Preservar as funções atuais e deixar novas capacidades como propostas futuras.

**Tarefas — adaptação visual e integração ao novo Design System**

- Integrar a versão já remodelada ao padrão visual geral da plataforma.
- Padronizar campo de nova tarefa, estados, ações e espaçamento.
- Não tratar esta frente como uma reconstrução completa da lógica.

**Kanban — adaptação visual nesta etapa**

- Preservar a lógica atual e aplicar o novo Design System.
- Melhorar leitura das colunas, cartões, estados e responsividade.
- A evolução para automações e novas regras de negócio será aprofundada posteriormente, após alinhamento com a equipe.

### MELHORIAS E SUGESTÕES

- **Sugestão de evolução: resumo inteligente da conversa.** Pode reduzir o tempo de leitura de históricos longos em Atendimentos. Depende de backend, integração com IA, regras de privacidade e revisão humana; não faz parte da entrega garantida desta etapa.
- **Oportunidade de UX: filtros persistidos por contexto.** Pode reduzir cliques repetitivos em listas e tabelas. A complexidade estimada é baixa e a implementação pode ou não depender de backend, conforme a regra definida.
- **Padronização transversal: estados operacionais.** Loading, vazio, erro, sucesso, atenção, sem resultados e sem permissão serão tratados como componentes compartilhados.
- **Padronização transversal: tabelas responsivas.** Serão definidas colunas prioritárias, scroll horizontal indicado ou alternativa em cards quando fizer sentido.

---

## SEMANA 2 — 27/07 a 01/08

### Prioridade da semana

Aplicar os padrões definidos na operação às áreas de comunicação, conteúdo, agenda e IA. A semana também contempla a evolução visual de Conexões/Canais, preservando a boa direção de cards para leitura rápida dos estados de conexão.

### PÁGINAS / LINKS

- **Conexões / Canais** — `/connections`
- **Templates** — `/templates`
- **Respostas rápidas** — `/quick-messages`
- **Arquivos** — `/files`
- **Prompts** — `/prompts`
- **Google Calendar** — `/google-calendar`
- **Agendas** — `/schedules`
- **Tags** — `/tags`

### ESCOPO DO REDESIGN

**Conexões / Canais — redesign visual com foco em cards**

- Evoluir a apresentação para cards de conexão, preservando a rota atual.
- Destacar estados online, offline, aguardando conexão e canal padrão.
- Organizar número identificado, última atualização, fila configurada e QR Code quando aplicável.
- Avaliar alternância entre cards e lista como proposta de experiência, sem tratá-la como função existente.
- Manter as regras de conexão e desconexão fora do escopo de execução desta etapa.

**Templates — redesign da tabela e dos estados**

- Melhorar busca, colunas, status, canal, idioma e ações.
- Corrigir problemas de acessibilidade identificados em botões, contraste, headings e atributos ARIA.
- Padronizar vazio, carregamento, erro e confirmação visual sem alterar o envio de templates.

**Respostas rápidas — padronização de tabela e busca**

- Organizar atalho, nome do arquivo e ações.
- Aplicar busca, estados e responsividade de forma consistente.
- Preservar a lógica de cadastro e uso atual.

**Arquivos — padronização de tabela e consulta**

- Melhorar leitura de nome, ação, busca e estados.
- Preparar o layout para diferentes volumes de arquivos sem alterar uploads nesta etapa.

**Prompts — adaptação visual e organização da área de IA**

- Organizar nome, setor/fila, limite de resposta e ações.
- Melhorar percepção de contexto e segurança das configurações.
- Preservar a lógica atual e não alterar integrações ou regras de IA.

**Google Calendar — adaptação visual ao novo Design System**

- Preservar a estrutura e a integração atual.
- Padronizar header, controles, estados e espaçamento.
- Não prometer alterações profundas na integração.

**Agendas — redesign da experiência de agenda**

- Tratar a tela separadamente de Google Calendar.
- Organizar modos Mês, Semana, Dia e Agenda, navegação de período e busca.
- Redesenhar os fluxos de novo agendamento, seleção de tipo, drawers e modais observados.
- Manter evoluções profundas de regras de agendamento condicionadas à validação com a equipe.

**Tags — padronização de tabela e busca**

- Reorganizar nome, registros relacionados, ação de adicionar e estados.
- Avaliar sua entrada na área visual de Cadastros sem fundir a rota atual.

### MELHORIAS E SUGESTÕES

- **Proposta sujeita à validação: alternância cards/lista em Conexões.** A direção de cards favorece a leitura dos estados de canal; a lista pode ser útil quando o número de conexões crescer.
- **Sugestão de evolução: saúde dos canais.** Pode consolidar conexão, última atualização e pendências em uma leitura operacional. Depende de dados e regras de monitoramento que não foram confirmados na auditoria.
- **Padronização transversal:** aplicar Page Header, busca, tabela, badges de status, modais, drawers e estados compartilhados nas páginas da semana.

---

## SEMANA 3 — 03/08 a 08/08

### Prioridade da semana

Concluir cadastros, administração, informações técnicas e financeiro, além de reorganizar Configurações e realizar a revisão transversal de consistência, acessibilidade, responsividade e integração com a estrutura principal já concluída.

### PÁGINAS / LINKS

- **Setores** — `/sectors`
- **Filas** — `/queues`
- **Usuários** — `/users`
- **Profissionais** — `/professionals`
- **Convênios** — `/covenant`
- **Integração de filas** — `/queue-integration`
- **API de mensagens** — `/messages-api`
- **Financeiro** — `/financeiro`
- **Configurações** — `/settings`
- **Ajuda** — `/helps`

### ESCOPO DO REDESIGN

**Área de Cadastros — padronização visual com rotas preservadas**

- Organizar visualmente Setores, Filas, Usuários, Profissionais, Convênios e Integração de filas em uma área de Cadastros com secondary sidebar.
- Aplicar o mesmo padrão de tabela, busca, ações, badges, estados e responsividade.
- Preservar as rotas individuais atuais.
- Não afirmar fusão técnica das entidades, pois permissões, regras e ciclos de vida ainda precisam ser validados.

**Setores — redesign de tabela e relacionamento**

- Padronizar identificação, nome, cor, filas relacionadas e ações.
- Melhorar leitura e edição visual sem executar alterações de dados.

**Filas — redesign de tabela e contexto operacional**

- Organizar nome, cor, ordenação do bot, mensagem de saudação e ações.
- Destacar a relação entre fila, setor e operação sem alterar regras de encaminhamento.

**Usuários — estrutura a validar e adaptação ao padrão de Cadastros**

- Integrar a rota ao shell de Cadastros.
- Definir o detalhamento visual após validação de permissões, campos e ações disponíveis.

**Profissionais — estrutura a validar e adaptação ao padrão de Cadastros**

- Integrar a rota ao shell de Cadastros.
- Definir o detalhamento visual após validação do fluxo e das regras específicas da clínica.

**Convênios — padronização de tabela e ações**

- Organizar identificação, nome, busca quando aplicável, estados e ações.
- Preservar a rota e o comportamento funcional existente.

**Integração de filas — padronização de tabela e cadastro**

- Melhorar leitura de ID, nome, busca e ações.
- Manter a lógica de integração atual e não executar criação ou alteração.

**API de mensagens — adaptação visual e organização técnica**

- Reorganizar a credencial de integração, Número, Mensagem e mídia.
- Corrigir labels e hierarquia do campo de upload.
- Não alterar a estrutura funcional da API, integrações ou regras de envio.
- A ação `ENVIAR` será apenas representada visualmente; não será executada.

**Financeiro — redesign da leitura de faturas**

- Organizar detalhes, valor, vencimento, status e ação.
- Priorizar legibilidade e comportamento responsivo em tabelas.
- Não incluir alterações de cobrança, plano ou ações financeiras.

**Configurações — reorganização visual das seções existentes**

- Organizar abas de Opções, Empresas, Planos, Ajuda e Aparência.
- Melhorar agrupamento de selects, formulários, pesquisa de satisfação e lembretes de agendamento.
- Aproveitar melhor o espaço e reduzir listas longas e campos excessivamente largos.
- Destacar campos sensíveis, como a chave de API, sem salvar ou alterar valores.

**Ajuda — adaptação visual ao novo padrão**

- Melhorar navegação, legibilidade, hierarquia e organização do conteúdo existente.
- Não criar uma documentação técnica completa nesta etapa.

### REVISÃO GERAL DA SEMANA

- Validar a integração de todas as páginas com Dashboard, Header, Navbar, Primary Sidebar, Contextual Secondary Sidebar e App Shell já concluídos.
- Revisar estados ativos, foco, contraste, labels, headings, regiões roláveis e nomes acessíveis.
- Revisar tabelas em desktop, tablet e mobile, priorizando colunas e alternativas de leitura.
- Confirmar consistência entre cards, tabelas, listas, inputs, selects, badges, modais, drawers e paginação.
- Revisar tema claro e escuro e a responsividade da navegação.
- Consolidar pendências que dependam de backend, permissões ou regras de negócio.

### MELHORIAS E SUGESTÕES

- **Sugestão de evolução:** validar se o sistema compartilhado de estados deve ser expandido para estados offline, conectando, sem permissão e saúde de canal.
- **Proposta sujeita à validação:** revisar a arquitetura visual de Cadastros antes de qualquer decisão técnica de unificação.
- **Fora da entrega garantida:** novas automações de Kanban, regras de funil, ações disparadas por movimentação, alterações de API, novas integrações e funcionalidades financeiras.

## OBSERVAÇÃO DE ESCOPO

Este cronograma cobre redesign, adaptação visual, padronização de componentes e propostas de UX para as páginas identificadas na auditoria. As regras funcionais existentes serão preservadas. Funcionalidades dependentes de backend, IA, permissões ou regras ainda em definição serão apresentadas como sugestões, representações visuais ou pontos de validação, e não como entregas garantidas desta etapa.

A estrutura principal já concluída será integrada e revisada, mas não será recriada como uma nova frente de trabalho. As rotas atuais serão preservadas, inclusive quando houver uma proposta de agrupamento visual pela secondary sidebar.

O cronograma pode receber pequenos ajustes após a validação das telas com a equipe, sem alterar o período geral definido.

**Previsão de conclusão desta etapa: 08/08/2026.**
