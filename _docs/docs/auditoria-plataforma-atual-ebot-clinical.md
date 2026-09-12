# Auditoria da plataforma atual - Ê-Bot Clinical

## 1. Informações da auditoria

- Plataforma auditada: https://mecanicasa.enviae-bot.com.br
- Data de início: 2026-07-21T15:48:05.297Z
- Data de conclusão: 2026-07-21T15:52:40.270Z
- Modo do navegador: headless
- Viewports: 1440 x 1000, 1280 x 800, 1024 x 768, 390 x 844
- Política: somente leitura após autenticação; requisições mutáveis foram bloqueadas.
- Credenciais, cookies, tokens, headers de autorização, bodies e respostas completas não foram registrados.

## 2. Resumo executivo

A auditoria encontrou 24 página(s) validada(s), 26 rota(s) registrada(s), 28 item(ns) de menu, 0 card(s), 15 tabela(s), 13 formulário(s), 8 conjunto(s) de filtro, 4 modal(is) e 4 drawer(s). A classificação de funcionalidade considera somente comportamento observado em leitura; a existência de um botão não foi tratada como prova de execução bem-sucedida.

## 3. Escopo analisado

- Login e confirmação da rota inicial.
- Navegação interna acessível por links e controles seguros.
- DOM visível, headings, landmarks, links, botões, tabs, cards, tabelas, listas, campos, filtros, modais e drawers.
- Requisições XHR/fetch sanitizadas.
- Axe por página e viewport validado.
- Responsividade nos quatro viewports obrigatórios.
- Evidências visuais sanitizadas.

## 4. Limitações da auditoria

- Ações com risco de mutação não foram executadas.
- Dados pessoais e conteúdo clínico foram deliberadamente omitidos ou mascarados.
- Rotas que exigem permissões adicionais, fluxos de criação, edição, upload, envio ou confirmação permanecem não validadas.
- Contraste foi coberto pelo axe quando detectável e por inspeção heurística; não substitui teste com usuários e leitor de tela.
- Nomes pessoais que não aparecem em elementos semanticamente marcados podem exigir revisão humana sobre screenshots sanitizados.

## 5. Mapa completo de navegação

- tickets - `/tickets` - origem: initial DOM
- Início - `/` - origem: initial DOM
- contacts - `/contacts` - origem: initial DOM
- protocols - `/protocols` - origem: initial DOM
- ticket-contact-origins - `/ticket-contact-origins` - origem: initial DOM
- templates - `/templates` - origem: initial DOM
- google-calendar - `/google-calendar` - origem: initial DOM
- schedules - `/schedules` - origem: initial DOM
- tags - `/tags` - origem: initial DOM
- kanban - `/kanban` - origem: initial DOM
- todolist - `/todolist` - origem: initial DOM
- chats - `/chats` - origem: initial DOM
- quick-messages - `/quick-messages` - origem: initial DOM
- files - `/files` - origem: initial DOM
- prompts - `/prompts` - origem: initial DOM
- queue-integration - `/queue-integration` - origem: initial DOM
- connections - `/connections` - origem: initial DOM
- sectors - `/sectors` - origem: initial DOM
- queues - `/queues` - origem: initial DOM
- users - `/users` - origem: initial DOM
- professionals - `/professionals` - origem: initial DOM
- covenant - `/covenant` - origem: initial DOM
- messages-api - `/messages-api` - origem: initial DOM
- financeiro - `/financeiro` - origem: initial DOM
- settings - `/settings` - origem: initial DOM
- helps - `/helps` - origem: initial DOM

## 6. Estrutura atual do menu

- Open Notifications - região: notifications; tipo: button; caminho observado: `/tickets`; abre página: não; modal: não; drawer: sim; dropdown: sim
- account of current user - região: profile; tipo: button; caminho observado: `/tickets`; abre página: não; modal: não; drawer: sim; dropdown: sim
- Atendimentos - região: navigation-unknown; tipo: link; caminho observado: `/tickets`; abre página: sim; modal: não; drawer: não; dropdown: não
- Dashboard - região: navigation-unknown; tipo: link; caminho observado: `/`; abre página: sim; modal: não; drawer: não; dropdown: não
- Contatos - região: navigation-unknown; tipo: link; caminho observado: `/contacts`; abre página: sim; modal: não; drawer: não; dropdown: não
- Protocolos - região: navigation-unknown; tipo: link; caminho observado: `/protocols`; abre página: sim; modal: não; drawer: não; dropdown: não
- Origens de contato - região: navigation-unknown; tipo: link; caminho observado: `/ticket-contact-origins`; abre página: sim; modal: não; drawer: não; dropdown: não
- Templates - região: navigation-unknown; tipo: link; caminho observado: `/templates`; abre página: sim; modal: não; drawer: não; dropdown: não
- Google Calendar - região: navigation-unknown; tipo: link; caminho observado: `/google-calendar`; abre página: sim; modal: não; drawer: não; dropdown: não
- Agendas - região: navigation-unknown; tipo: link; caminho observado: `/schedules`; abre página: sim; modal: não; drawer: não; dropdown: não
- Tags - região: navigation-unknown; tipo: link; caminho observado: `/tags`; abre página: sim; modal: não; drawer: não; dropdown: não
- Kanban - região: navigation-unknown; tipo: link; caminho observado: `/kanban`; abre página: sim; modal: não; drawer: não; dropdown: não
- Lista de tarefas - região: navigation-unknown; tipo: link; caminho observado: `/todolist`; abre página: sim; modal: não; drawer: não; dropdown: não
- Chat interno - região: navigation-unknown; tipo: link; caminho observado: `/chats`; abre página: sim; modal: não; drawer: não; dropdown: não
- Respostas rápidas - região: navigation-unknown; tipo: link; caminho observado: `/quick-messages`; abre página: sim; modal: não; drawer: não; dropdown: não
- Arquivos - região: navigation-unknown; tipo: link; caminho observado: `/files`; abre página: sim; modal: não; drawer: não; dropdown: não
- Prompts - região: navigation-unknown; tipo: link; caminho observado: `/prompts`; abre página: sim; modal: não; drawer: não; dropdown: não
- Integração de filas - região: navigation-unknown; tipo: link; caminho observado: `/queue-integration`; abre página: sim; modal: não; drawer: não; dropdown: não
- Conexões - região: navigation-unknown; tipo: link; caminho observado: `/connections`; abre página: sim; modal: não; drawer: não; dropdown: não
- Setores - região: navigation-unknown; tipo: link; caminho observado: `/sectors`; abre página: sim; modal: não; drawer: não; dropdown: não
- Filas - região: navigation-unknown; tipo: link; caminho observado: `/queues`; abre página: sim; modal: não; drawer: não; dropdown: não
- Usuários - região: navigation-unknown; tipo: link; caminho observado: `/users`; abre página: sim; modal: não; drawer: não; dropdown: não
- Profissionais - região: navigation-unknown; tipo: link; caminho observado: `/professionals`; abre página: sim; modal: não; drawer: não; dropdown: não
- Convênios - região: navigation-unknown; tipo: link; caminho observado: `/covenant`; abre página: sim; modal: não; drawer: não; dropdown: não
- API de mensagens - região: navigation-unknown; tipo: link; caminho observado: `/messages-api`; abre página: sim; modal: não; drawer: não; dropdown: não
- Financeiro - região: navigation-unknown; tipo: link; caminho observado: `/financeiro`; abre página: sim; modal: não; drawer: não; dropdown: não
- Configurações - região: navigation-unknown; tipo: link; caminho observado: `/settings`; abre página: sim; modal: não; drawer: não; dropdown: não
- Ajuda - região: navigation-unknown; tipo: link; caminho observado: `/helps`; abre página: sim; modal: não; drawer: não; dropdown: não

Itens novos não são apresentados nesta seção. Propostas ficam separadas em “Novas funcionalidades sugeridas” e “Proposta de reorganização”.

## 7. Inventário de páginas e rotas

- **Atendimentos** - `/tickets` - Operação - Estrutura visual
- **Dashboard** - `/` - Não classificada - Funcional
- **Contatos** - `/contacts` - Operação - Funcional
- **Protocolos** - `/protocols` - Operação - Funcional
- **Origens de contato** - `/ticket-contact-origins` - Operação - Funcional
- **Templates** - `/templates` - Comunicação - Funcional
- **Google Calendar** - `/google-calendar` - Planejamento - Estrutura visual
- **Agendas** - `/schedules` - Planejamento - Funcional
- **Tags** - `/tags` - Não classificada - Funcional
- **Kanban** - `/kanban` - Planejamento - Estrutura visual
- **Lista de tarefas** - `/todolist` - Planejamento - Estrutura visual
- **Chat interno** - `/chats` - Operação - Estrutura visual
- **Respostas rápidas** - `/quick-messages` - Comunicação - Funcional
- **Arquivos** - `/files` - Comunicação - Funcional
- **Prompts** - `/prompts` - Sistema e IA - Funcional
- **Integração de filas** - `/queue-integration` - Administração - Funcional
- **Conexões** - `/connections` - Comunicação - Estrutura visual
- **Setores** - `/sectors` - Administração - Funcional
- **Filas** - `/queues` - Administração - Funcional
- **Convênios** - `/covenant` - Administração - Funcional
- **API de mensagens** - `/messages-api` - Sistema e IA - Funcional
- **Financeiro** - `/financeiro` - Financeiro - Funcional
- **Configurações** - `/settings` - Administração - Estrutura visual
- **Ajuda** - `/helps` - Ajuda - Estrutura visual

## 8. Matriz consolidada de páginas

| Página | Rota | Categoria | Status atual | Redesign | Prioridade | Complexidade | Funcionalidade nova |
|---|---|---|---|---|---|---|---|
| Atendimentos | `/tickets` | Operação | Estrutura visual | Adaptação visual | Alta | Baixa | Sim |
| Dashboard | `/` | Não classificada | Funcional | Completo | Média | Baixa | Não |
| Contatos | `/contacts` | Operação | Funcional | Completo | Alta | Baixa | Sim |
| Protocolos | `/protocols` | Operação | Funcional | Completo | Alta | Baixa | Sim |
| Origens de contato | `/ticket-contact-origins` | Operação | Funcional | Completo | Alta | Baixa | Sim |
| Templates | `/templates` | Comunicação | Funcional | Completo | Média | Baixa | Não |
| Google Calendar | `/google-calendar` | Planejamento | Estrutura visual | Adaptação visual | Média | Baixa | Não |
| Agendas | `/schedules` | Planejamento | Funcional | Completo | Média | Baixa | Não |
| Tags | `/tags` | Não classificada | Funcional | Completo | Média | Baixa | Não |
| Kanban | `/kanban` | Planejamento | Estrutura visual | Adaptação visual | Média | Baixa | Não |
| Lista de tarefas | `/todolist` | Planejamento | Estrutura visual | Adaptação visual | Média | Baixa | Não |
| Chat interno | `/chats` | Operação | Estrutura visual | Adaptação visual | Alta | Baixa | Sim |
| Respostas rápidas | `/quick-messages` | Comunicação | Funcional | Completo | Média | Baixa | Não |
| Arquivos | `/files` | Comunicação | Funcional | Completo | Média | Baixa | Não |
| Prompts | `/prompts` | Sistema e IA | Funcional | Completo | Média | Baixa | Não |
| Integração de filas | `/queue-integration` | Administração | Funcional | Completo | Média | Baixa | Não |
| Conexões | `/connections` | Comunicação | Estrutura visual | Adaptação visual | Média | Baixa | Não |
| Setores | `/sectors` | Administração | Funcional | Completo | Média | Baixa | Não |
| Filas | `/queues` | Administração | Funcional | Completo | Média | Baixa | Não |
| Convênios | `/covenant` | Administração | Funcional | Completo | Média | Baixa | Não |
| API de mensagens | `/messages-api` | Sistema e IA | Funcional | Adaptação visual | Média | Média | Não |
| Financeiro | `/financeiro` | Financeiro | Funcional | Completo | Média | Baixa | Não |
| Configurações | `/settings` | Administração | Estrutura visual | Adaptação visual | Média | Baixa | Não |
| Ajuda | `/helps` | Ajuda | Estrutura visual | Adaptação visual | Média | Baixa | Não |

## 9. Análise detalhada por página

### 9.1 Login

- Rota de entrada: /tickets
- Resultado: login confirmado
- Campos observados: usuário e senha; valores não foram registrados.
- Submissão de login: executada somente para autenticação; nenhum dado de negócio foi alterado.

### 9.2 Dashboard

Página encontrada: **Dashboard** - `/`. O detalhamento completo está na seção 9.4.

### 9.3 Atendimentos

Página encontrada: **Atendimentos** - `/tickets`. O detalhamento completo está na seção 9.4.

### 9.4 Demais páginas

### 1. Atendimentos

**Rota:** `/tickets`

**Categoria:** Operação

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Consultar e operar atendimentos ou conversas.

#### Estrutura atual

- Header: Painel Ebot
- Ações: Não identificadas
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 0 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 0
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Nenhuma funcionalidade comprovada além da estrutura visual.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Nenhuma ação nomeada identificada.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- landmark-one-main: Document should have one main landmark; impacto: moderate; elementos afetados: 1
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Resumo inteligente da conversa:
   - Classificação: NOVA FUNCIONALIDADE COM BACKEND
   - Benefício: Reduzir tempo de entendimento do atendimento.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: sim, histórico e modelo de IA; regras: sim, regras de privacidade e revisão humana
2. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 2. Dashboard

**Rota:** `/`

**Categoria:** Não classificada

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Atendimentos hoje: 0
- Ações: Open Notifications, account of current user, Choose date, selected date is Jul 1, 2026, Choose date, selected date is Jul 21, 2026, Filtrar, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- input; tipo: input; obrigatório aparente: não identificado
- Data Inicial; tipo: text; obrigatório aparente: não identificado
- Data Final; tipo: text; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- Choose date, selected date is Jul 1, 2026 - observado; não validado se implicar mutação.
- Choose date, selected date is Jul 21, 2026 - observado; não validado se implicar mutação.
- Filtrar - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 6
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15
- scrollable-region-focusable: Scrollable region must have keyboard access; impacto: serious; elementos afetados: 1

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 3. Contatos

**Rota:** `/contacts`

**Categoria:** Operação

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Contatos
- Ações: Open Notifications, account of current user, ADICIONAR CONTATOS, VERIFICAR DUPLICADOS, IMPORTAR / EXPORTAR, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Pesquisar...
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Pesquisar...; tipo: search; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR CONTATOS - observado; não validado se implicar mutação.
- VERIFICAR DUPLICADOS - observado; não validado se implicar mutação.
- IMPORTAR / EXPORTAR - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 14
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 8
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- empty-table-header: Table header text should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Resumo inteligente da conversa:
   - Classificação: NOVA FUNCIONALIDADE COM BACKEND
   - Benefício: Reduzir tempo de entendimento do atendimento.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: sim, histórico e modelo de IA; regras: sim, regras de privacidade e revisão humana
2. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 4. Protocolos

**Rota:** `/protocols`

**Categoria:** Operação

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Protocolos
- Ações: Open Notifications, account of current user, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Perquisar por nome ou telefone
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Perquisar por nome ou telefone; tipo: search; obrigatório aparente: não identificado
- input; tipo: input; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 14
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 4
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Resumo inteligente da conversa:
   - Classificação: NOVA FUNCIONALIDADE COM BACKEND
   - Benefício: Reduzir tempo de entendimento do atendimento.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: sim, histórico e modelo de IA; regras: sim, regras de privacidade e revisão humana
2. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 5. Origens de contato

**Rota:** `/ticket-contact-origins`

**Categoria:** Operação

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Consultar e operar atendimentos ou conversas.

#### Estrutura atual

- Header: Relacionamentos de Contatos
- Ações: Open Notifications, account of current user, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15
- scrollable-region-focusable: Scrollable region must have keyboard access; impacto: serious; elementos afetados: 1

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Resumo inteligente da conversa:
   - Classificação: NOVA FUNCIONALIDADE COM BACKEND
   - Benefício: Reduzir tempo de entendimento do atendimento.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: sim, histórico e modelo de IA; regras: sim, regras de privacidade e revisão humana
2. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 6. Templates

**Rota:** `/templates`

**Categoria:** Comunicação

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Templates
- Ações: Open Notifications, account of current user, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Buscar templates...
- Busca: Buscar templates...
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Buscar templates...; tipo: search; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- aria-prohibited-attr: Elements must only use permitted ARIA attributes; impacto: serious; elementos afetados: 1
- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 5
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 7. Google Calendar

**Rota:** `/google-calendar`

**Categoria:** Planejamento

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Google Agenda
- Ações: Open Notifications, account of current user, EDITAR EVENTOS, NOVO EVENTO, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- input; tipo: input; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- EDITAR EVENTOS - observado; não validado se implicar mutação.
- NOVO EVENTO - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 7
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 8. Agendas

**Rota:** `/schedules`

**Categoria:** Planejamento

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Agendamentos (8)
- Ações: Open Notifications, account of current user, NOVO AGENDAMENTO, Hoje, Anterior, Próximo, Mês, Semana, Dia, Agenda, 28, 29, 30, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 31, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Pesquisar...
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Pesquisar...; tipo: search; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- NOVO AGENDAMENTO - observado; não validado se implicar mutação.
- Hoje - observado; não validado se implicar mutação.
- Anterior - observado; não validado se implicar mutação.
- Próximo - observado; não validado se implicar mutação.
- Mês - observado; não validado se implicar mutação.
- Semana - observado; não validado se implicar mutação.
- Dia - observado; não validado se implicar mutação.
- Agenda - observado; não validado se implicar mutação.
- 28 - observado; não validado se implicar mutação.
- 29 - observado; não validado se implicar mutação.
- 30 - observado; não validado se implicar mutação.
- 01 - observado; não validado se implicar mutação.
- 02 - observado; não validado se implicar mutação.
- 03 - observado; não validado se implicar mutação.
- 04 - observado; não validado se implicar mutação.
- 05 - observado; não validado se implicar mutação.
- 06 - observado; não validado se implicar mutação.
- 07 - observado; não validado se implicar mutação.
- 08 - observado; não validado se implicar mutação.
- 09 - observado; não validado se implicar mutação.
- 10 - observado; não validado se implicar mutação.
- 11 - observado; não validado se implicar mutação.
- 12 - observado; não validado se implicar mutação.
- 13 - observado; não validado se implicar mutação.
- 14 - observado; não validado se implicar mutação.
- 15 - observado; não validado se implicar mutação.
- 16 - observado; não validado se implicar mutação.
- 17 - observado; não validado se implicar mutação.
- 18 - observado; não validado se implicar mutação.
- 19 - observado; não validado se implicar mutação.
- 20 - observado; não validado se implicar mutação.
- 21 - observado; não validado se implicar mutação.
- 22 - observado; não validado se implicar mutação.
- 23 - observado; não validado se implicar mutação.
- 24 - observado; não validado se implicar mutação.
- 25 - observado; não validado se implicar mutação.
- 26 - observado; não validado se implicar mutação.
- 27 - observado; não validado se implicar mutação.
- 31 - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 17
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 9. Tags

**Rota:** `/tags`

**Categoria:** Não classificada

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Tags
- Ações: Open Notifications, account of current user, NOVA TAG, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Pesquisar...
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Pesquisar...; tipo: search; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- NOVA TAG - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 10
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 7
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 10. Kanban

**Rota:** `/kanban`

**Categoria:** Planejamento

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Painel Ebot
- Ações: Não identificadas
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 0 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 0
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Nenhuma funcionalidade comprovada além da estrutura visual.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Nenhuma ação nomeada identificada.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- landmark-one-main: Document should have one main landmark; impacto: moderate; elementos afetados: 1
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 11. Lista de tarefas

**Rota:** `/todolist`

**Categoria:** Planejamento

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Painel Ebot
- Ações: Open Notifications, account of current user, ADICIONAR, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 2 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nova tarefa; tipo: textarea; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 12. Chat interno

**Rota:** `/chats`

**Categoria:** Operação

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Consultar e operar atendimentos ou conversas.

#### Estrutura atual

- Header: Painel Ebot
- Ações: Open Notifications, account of current user, NOVO, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 2 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabs observadas - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- NOVO - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Resumo inteligente da conversa:
   - Classificação: NOVA FUNCIONALIDADE COM BACKEND
   - Benefício: Reduzir tempo de entendimento do atendimento.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: sim, histórico e modelo de IA; regras: sim, regras de privacidade e revisão humana
2. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 13. Respostas rápidas

**Rota:** `/quick-messages`

**Categoria:** Comunicação

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Respostas Rápidas
- Ações: Open Notifications, account of current user, ADICIONAR, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Pesquisar...
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Pesquisar...; tipo: search; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 6
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 16

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 14. Arquivos

**Rota:** `/files`

**Categoria:** Comunicação

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Lista de arquivos (0)
- Ações: Open Notifications, account of current user, ADICIONAR, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Pesquisar...
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Pesquisar...; tipo: search; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 15. Prompts

**Rota:** `/prompts`

**Categoria:** Sistema e IA

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Prompts
- Ações: Open Notifications, account of current user, ADICIONAR PROMPT
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR PROMPT - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 14

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 16. Integração de filas

**Rota:** `/queue-integration`

**Categoria:** Administração

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Integrações (1)
- Ações: Open Notifications, account of current user, ADICIONAR PROJETO, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Pesquisar...
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Busca ou filtro observado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Pesquisar...; tipo: search; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR PROJETO - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 6
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 17. Conexões

**Rota:** `/connections`

**Categoria:** Comunicação

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Canais
- Ações: Open Notifications, account of current user, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.
2. Há texto visual abaixo de 12px.
   - Impacto: Pode prejudicar legibilidade e uso em telas pequenas.
   - Prioridade: Alta
   - Recomendação: Revisar escala tipográfica e reservar tamanhos menores para metadados.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 8
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 18. Setores

**Rota:** `/sectors`

**Categoria:** Administração

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Setores
- Ações: Open Notifications, account of current user, ADICIONAR SETOR, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR SETOR - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 6
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 19. Filas

**Rota:** `/queues`

**Categoria:** Administração

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Filas & Chatbot
- Ações: Open Notifications, account of current user, ADICIONAR FILA, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR FILA - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 8
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 20. Convênios

**Rota:** `/covenant`

**Categoria:** Administração

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Convênios
- Ações: Open Notifications, account of current user, ADICIONAR CONVÊNIO, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ADICIONAR CONVÊNIO - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 8
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 5
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 21. API de mensagens

**Rota:** `/messages-api`

**Categoria:** Sistema e IA

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Documentação para envio de mensagens
- Ações: Open Notifications, account of current user, ENVIAR, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 5 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 2
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Token cadastrado *; tipo: text; obrigatório aparente: sim
- Número *; tipo: text; obrigatório aparente: sim
- Mensagem *; tipo: text; obrigatório aparente: sim
- medias; tipo: file; obrigatório aparente: sim

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- ENVIAR - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 9
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- label: Form elements must have labels; impacto: critical; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 22. Financeiro

**Rota:** `/financeiro`

**Categoria:** Financeiro

**Submenu:** Não identificado

**Status atual:** Funcional

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Faturas
- Ações: Open Notifications, account of current user, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 1 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Funcional

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 4
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15
- scrollable-region-focusable: Scrollable region must have keyboard access; impacto: serious; elementos afetados: 1

#### Redesign recomendado

- Revisar a leitura e o comportamento responsivo das tabelas.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 23. Configurações

**Rota:** `/settings`

**Categoria:** Administração

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Configurações
- Ações: Open Notifications, account of current user, OPÇÕES, EMPRESAS, PLANOS, AJUDA, APARÊNCIA, SALVAR, LEMBRETES DE AGENDAMENTO, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: OPÇÕES, EMPRESAS, PLANOS, AJUDA, APARÊNCIA
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Tabs observadas - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- input; tipo: input; obrigatório aparente: não identificado
- Chave API-OPENAI; tipo: text; obrigatório aparente: não identificado

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- OPÇÕES - observado; não validado se implicar mutação.
- EMPRESAS - observado; não validado se implicar mutação.
- PLANOS - observado; não validado se implicar mutação.
- AJUDA - observado; não validado se implicar mutação.
- APARÊNCIA - observado; não validado se implicar mutação.
- SALVAR - observado; não validado se implicar mutação.
- LEMBRETES DE AGENDAMENTO - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 6
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.

### 24. Ajuda

**Rota:** `/helps`

**Categoria:** Ajuda

**Submenu:** Não identificado

**Status atual:** Estrutura visual

**Objetivo atual:**

Objetivo inferido a partir do título e da estrutura visível.

#### Estrutura atual

- Header: Central de Ajuda (1)
- Ações: Open Notifications, account of current user, close
- Cards: 0
- KPIs: 0
- Tabela ou lista: 0 tabela(s), 1 lista(s)
- Filtros: Não identificados
- Busca: Não identificada
- Tabs: Não identificadas
- Formulários: 0
- Modais: 0
- Drawers: 2
- Paginação: Não observada
- Estados: Estrutura visual

#### Funcionalidades existentes

- Navegação por links observada - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.
- Controles e ações visíveis observados - EXISTENTE E FUNCIONAL somente no nível de presença/consulta; ações de mutação não foram validadas.

#### Campos e informações

- Nenhum campo identificado.

#### Ações disponíveis

- Open Notifications - observado; não validado se implicar mutação.
- account of current user - observado; não validado se implicar mutação.
- close - observado; não validado se implicar mutação.

#### Problemas de UI/UX

1. A página não apresenta heading H1 identificável.
   - Impacto: Reduz contexto e orientação do usuário.
   - Prioridade: Média
   - Recomendação: Adicionar um título de página único e semanticamente marcado.

#### Problemas de acessibilidade

- button-name: Buttons must have discernible text; impacto: critical; elementos afetados: 4
- color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; elementos afetados: 4
- empty-heading: Headings should not be empty; impacto: minor; elementos afetados: 1
- heading-order: Heading levels should only increase by one; impacto: moderate; elementos afetados: 1
- list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; elementos afetados: 1
- listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; elementos afetados: 13
- page-has-heading-one: Page should contain a level-one heading; impacto: moderate; elementos afetados: 1
- region: All page content should be contained by landmarks; impacto: moderate; elementos afetados: 15

#### Redesign recomendado

- Revisar hierarquia, espaçamento e estados da página conforme o uso real.
- Padronizar ações, foco visível, estados de carregamento, vazio e erro.
- Reutilizar os componentes identificados no inventário global.

#### Novas funcionalidades sugeridas

1. Sistema compartilhado de estados:
   - Classificação: PADRONIZAÇÃO
   - Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
   - Complexidade: média
   - Prioridade: Alta
   - Dependências: backend: não; regras: não

#### Evidências visuais

- Nenhuma evidência visual associada.

#### Observações

- Inventário baseado no DOM, comportamento observado e requisições sanitizadas.
- Formulários, ações destrutivas e mutações não foram enviados.


## 10. Funcionalidades existentes

- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabs observadas - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Painel Ebot: Tabs observadas - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Dashboard: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Dashboard: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Dashboard: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Dashboard: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Contatos: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Contatos: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Contatos: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Contatos: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Contatos: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Protocolos: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Protocolos: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Protocolos: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Protocolos: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Protocolos: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Origens de contato: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Origens de contato: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Origens de contato: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Templates: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Templates: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Templates: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Templates: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Templates: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Google Calendar: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Google Calendar: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Google Calendar: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Agendas: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Agendas: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Agendas: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Agendas: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Agendas: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Tags: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Tags: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Tags: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Tags: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Tags: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Lista de tarefas: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Lista de tarefas: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Lista de tarefas: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Chat interno: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Chat interno: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Chat interno: Tabs observadas - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Respostas rápidas: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Respostas rápidas: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Respostas rápidas: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Respostas rápidas: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Respostas rápidas: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Arquivos: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Arquivos: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Arquivos: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Arquivos: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Arquivos: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Prompts: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Prompts: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Prompts: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Integração de filas: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Integração de filas: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Integração de filas: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Integração de filas: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Integração de filas: Busca ou filtro observado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Conexões: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Conexões: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Setores: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Setores: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Setores: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Filas: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Filas: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Filas: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Convênios: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Convênios: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Convênios: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- API de mensagens: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- API de mensagens: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- API de mensagens: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Financeiro: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Financeiro: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Financeiro: Tabela ou estrutura tabular observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Configurações: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Configurações: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Configurações: Campos de entrada observados; nenhum formulário foi enviado - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Configurações: Tabs observadas - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Ajuda: Navegação por links observada - EXISTENTE E FUNCIONAL no escopo de consulta/observação.
- Ajuda: Controles e ações visíveis observados - EXISTENTE E FUNCIONAL no escopo de consulta/observação.

## 11. Funcionalidades existentes parcialmente

- Dashboard: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Contatos: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Protocolos: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Origens de contato: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Templates: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Agendas: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Tags: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Respostas rápidas: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Arquivos: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Prompts: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Integração de filas: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Setores: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Filas: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Convênios: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- API de mensagens: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.
- Financeiro: estrutura de formulário, tabela ou filtro presente; execução de mutação não validada por segurança.

## 12. Funcionalidades não validadas

- Atendimentos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Dashboard: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Contatos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Protocolos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Origens de contato: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Templates: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Google Calendar: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Agendas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Tags: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Kanban: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Lista de tarefas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Chat interno: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Respostas rápidas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Arquivos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Integração de filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Conexões: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Setores: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Usuários: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Profissionais: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Convênios: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- API de mensagens: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Financeiro: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Ajuda: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Atendimentos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Dashboard: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Dashboard: Ação observada e não clicada: Choose date, selected date is Jul 1, 2026; endpoint/contexto: /
- Dashboard: Ação observada e não clicada: Choose date, selected date is Jul 21, 2026; endpoint/contexto: /
- Dashboard: Ação observada e não clicada: Filtrar; endpoint/contexto: /
- Dashboard: Ação observada e não clicada: close; endpoint/contexto: /
- Contatos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Contatos: Ação observada e não clicada: ADICIONAR CONTATOS; endpoint/contexto: /contacts
- Contatos: Ação observada e não clicada: VERIFICAR DUPLICADOS; endpoint/contexto: /contacts
- Contatos: Ação observada e não clicada: IMPORTAR / EXPORTAR; endpoint/contexto: /contacts
- Contatos: Ação observada e não clicada: close; endpoint/contexto: /contacts
- Protocolos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Protocolos: Ação observada e não clicada: close; endpoint/contexto: /protocols
- Origens de contato: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Origens de contato: Ação observada e não clicada: close; endpoint/contexto: /ticket-contact-origins
- Templates: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Templates: Ação observada e não clicada: close; endpoint/contexto: /templates
- Google Calendar: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Google Calendar: Ação observada e não clicada: EDITAR EVENTOS; endpoint/contexto: /google-calendar
- Google Calendar: Ação observada e não clicada: NOVO EVENTO; endpoint/contexto: /google-calendar
- Google Calendar: Ação observada e não clicada: close; endpoint/contexto: /google-calendar
- Agendas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Agendas: Ação observada e não clicada: Hoje; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: Anterior; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: Próximo; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: Mês; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: Semana; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: Dia; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 28; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 29; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 30; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 01; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 02; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 03; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 04; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 05; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 06; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 07; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 08; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 09; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 10; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 11; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 12; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 13; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 14; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 15; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 16; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 17; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 18; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 19; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 20; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 21; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 22; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 23; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 24; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 25; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 26; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 27; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 28; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 29; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 30; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 31; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: 01; endpoint/contexto: /schedules
- Agendas: Ação observada e não clicada: close; endpoint/contexto: /schedules
- Tags: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Tags: Ação observada e não clicada: NOVA TAG; endpoint/contexto: /tags
- Tags: Ação observada e não clicada: close; endpoint/contexto: /tags
- Kanban: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Lista de tarefas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Lista de tarefas: Ação observada e não clicada: ADICIONAR; endpoint/contexto: /todolist
- Lista de tarefas: Ação observada e não clicada: close; endpoint/contexto: /todolist
- Chat interno: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Chat interno: Ação observada e não clicada: NOVO; endpoint/contexto: /chats
- Chat interno: Ação observada e não clicada: close; endpoint/contexto: /chats
- Respostas rápidas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Respostas rápidas: Ação observada e não clicada: ADICIONAR; endpoint/contexto: /quick-messages
- Respostas rápidas: Ação observada e não clicada: close; endpoint/contexto: /quick-messages
- Respostas rápidas: Ação observada e não clicada: close; endpoint/contexto: /quick-messages
- Arquivos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Arquivos: Ação observada e não clicada: ADICIONAR; endpoint/contexto: /files
- Arquivos: Ação observada e não clicada: close; endpoint/contexto: /files
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Ação observada e não clicada: ADICIONAR PROMPT; endpoint/contexto: /prompts
- Integração de filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Integração de filas: Ação observada e não clicada: ADICIONAR PROJETO; endpoint/contexto: /queue-integration
- Integração de filas: Ação observada e não clicada: close; endpoint/contexto: /queue-integration
- Conexões: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Conexões: Ação observada e não clicada: close; endpoint/contexto: /connections
- Setores: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Setores: Ação observada e não clicada: ADICIONAR SETOR; endpoint/contexto: /sectors
- Setores: Ação observada e não clicada: close; endpoint/contexto: /sectors
- Filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Filas: Ação observada e não clicada: ADICIONAR FILA; endpoint/contexto: /queues
- Filas: Ação observada e não clicada: close; endpoint/contexto: /queues
- Usuários: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Profissionais: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Convênios: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Convênios: Ação observada e não clicada: ADICIONAR CONVÊNIO; endpoint/contexto: /covenant
- Convênios: Ação observada e não clicada: close; endpoint/contexto: /covenant
- API de mensagens: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- API de mensagens: Ação observada e não clicada: ENVIAR; endpoint/contexto: /messages-api
- API de mensagens: Ação observada e não clicada: ENVIAR; endpoint/contexto: /messages-api
- API de mensagens: Ação observada e não clicada: close; endpoint/contexto: /messages-api
- Financeiro: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Financeiro: Ação observada e não clicada: close; endpoint/contexto: /financeiro
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Ação observada e não clicada: EMPRESAS; endpoint/contexto: /settings
- Configurações: Ação observada e não clicada: PLANOS; endpoint/contexto: /settings
- Configurações: Ação observada e não clicada: APARÊNCIA; endpoint/contexto: /settings
- Configurações: Ação observada e não clicada: SALVAR; endpoint/contexto: /settings
- Configurações: Ação observada e não clicada: close; endpoint/contexto: /settings
- Ajuda: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Ajuda: Ação observada e não clicada: close; endpoint/contexto: /helps
- Atendimentos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Dashboard: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Contatos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Protocolos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Origens de contato: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Templates: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Google Calendar: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Agendas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Tags: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Kanban: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Lista de tarefas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Chat interno: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Respostas rápidas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Arquivos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Integração de filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Conexões: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Setores: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Usuários: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Profissionais: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Convênios: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- API de mensagens: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Financeiro: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Ajuda: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Atendimentos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Dashboard: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Contatos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Protocolos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Origens de contato: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Templates: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Google Calendar: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Agendas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Tags: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Kanban: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Lista de tarefas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Chat interno: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Respostas rápidas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Arquivos: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Prompts: Mutating request blocked by read-only policy; endpoint/contexto: /socket.io/
- Integração de filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Conexões: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Setores: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Filas: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Usuários: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Profissionais: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Convênios: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- API de mensagens: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Financeiro: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Configurações: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token
- Ajuda: Mutating request blocked by read-only policy; endpoint/contexto: /auth/refresh_token

## 13. Cards encontrados

| Página | Título | Descrição/métrica | Clicável | Ação perigosa |
|---|---|---|---|---|
| Nenhum card identificado | - | - | - | - |

## 14. Tabelas e listas encontradas

- **Painel Ebot** - página: Painel Ebot; colunas: Nome, Avaliações, SLA de Atendimento, Status; busca: não observada; filtros: não observados; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Nome, WhatsApp, Email, Ações; busca: não observada; filtros: Pesquisar...; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Nº Protocolo, Cliente, Usuário, Setor, Fila, Status, Data, Relatório do Protocolo; busca: não observada; filtros: Perquisar por nome ou telefone; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Ticket, Contato, Contato de Origem, WhatsApp, Data de Criação, Ações; busca: não observada; filtros: não observados; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Nome, Idioma, Canal, Status, Ações; busca: sim; filtros: Buscar templates...; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: domingo, segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira, sábado; busca: não observada; filtros: Pesquisar...; paginação: observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Nome, Registros Tagdos, Ações; busca: não observada; filtros: Pesquisar...; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Atalho, Nome do Arquivo, Ações; busca: não observada; filtros: Pesquisar...; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Nome, Ação; busca: não observada; filtros: Pesquisar...; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Nome, Setor/Fila, Máximo Tokens Resposta, Ações; busca: não observada; filtros: não observados; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: ID, Nome, Ações; busca: não observada; filtros: Pesquisar...; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: ID, Nome, Cor, Filas relacionadas, Ações; busca: não observada; filtros: não observados; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: ID, Nome, Cor, Ordenação da fila (bot), Mensagem de saudação, Ações; busca: não observada; filtros: não observados; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: ID, Nome, Ações; busca: não observada; filtros: não observados; paginação: não observada; responsividade: validada por viewport.
- **Painel Ebot** - página: Painel Ebot; colunas: Id, Detalhes, Valor, Data Venc., Status, Ação; busca: não observada; filtros: não observados; paginação: não observada; responsividade: validada por viewport.

## 15. Formulários e campos encontrados

- **Painel Ebot** - página: Painel Ebot; campos: input (input), Data Inicial (text), Data Final (text); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Pesquisar... (search); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Perquisar por nome ou telefone (search), input (input); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Buscar templates... (search); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: input (input); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Pesquisar... (search); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Pesquisar... (search); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Nova tarefa (textarea); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Pesquisar... (search); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Pesquisar... (search); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Pesquisar... (search); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: Token cadastrado * (text), Número * (text), Mensagem * (text), Token cadastrado * (text), Número * (text), medias (file); enviado: não.
- **Painel Ebot** - página: Painel Ebot; campos: input (input), input (input), input (input), input (input), input (input), input (input), input (input), input (input), input (input), Chave API-OPENAI (text); enviado: não.

## 16. Filtros encontrados

- Painel Ebot: busca textual não observada; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.
- Painel Ebot: busca textual não observada; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.
- Painel Ebot: busca textual Buscar templates...; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.
- Painel Ebot: busca textual não observada; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.
- Painel Ebot: busca textual não observada; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.
- Painel Ebot: busca textual não observada; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.
- Painel Ebot: busca textual não observada; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.
- Painel Ebot: busca textual não observada; data não observada; status não observado; aplicação/limpeza: não validadas quando implicavam submissão.

## 17. Modais, drawers e fluxos secundários

- visualização/detalhes: Selecione um tipo de agendamento:; origem: Agendas; gatilho: NOVO AGENDAMENTO; campos: Pesquisar...; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/12-modal-selecione-um-tipo-de-agendamento-desktop.png`
- visualização/detalhes: sem título; origem: Agendas; gatilho: NOVO AGENDAMENTO; campos: Pesquisar...; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/13-modal-novo-agendamento-desktop.png`
- visualização/detalhes: Selecione um tipo de agendamento:; origem: Agendas; gatilho: Agenda; campos: Pesquisar...; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/17-modal-selecione-um-tipo-de-agendamento-desktop.png`
- visualização/detalhes: sem título; origem: Agendas; gatilho: Agenda; campos: Pesquisar...; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/18-modal-agenda-desktop.png`
- visualização/detalhes: sem título; origem: Agendas; gatilho: NOVO AGENDAMENTO; campos: Pesquisar...; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/10-drawer-novo-agendamento-desktop.png`
- visualização/detalhes: sem título; origem: Agendas; gatilho: Agenda; campos: Pesquisar...; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/15-drawer-agenda-desktop.png`
- visualização/detalhes: sem título; origem: Configurações; gatilho: OPÇÕES; campos: Chave API-OPENAI; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/37-drawer-opcoes-desktop.png`
- visualização/detalhes: sem título; origem: Configurações; gatilho: AJUDA; campos: Título, Código do Vídeo, Descrição; risco: baixo após bloqueio de mutações; validado: não, somente aberto em leitura; screenshot: `docs/auditoria-ebot-assets/39-drawer-ajuda-desktop.png`

## 18. Estados de interface

- Preenchido: páginas com cards, listas, tabelas ou conteúdo foram classificadas como preenchidas.
- Vazio/sem resultados: somente quando texto ou estrutura indicou explicitamente o estado.
- Loading: não foi forçado artificialmente; estados transitórios podem não ter sido capturados.
- Erro: 0 ocorrência(s) de erro/falha registrada(s).
- Desabilitado: campos e controles disabled foram extraídos quando visíveis.
- Sucesso, offline, conectando e sem permissão: não classificados sem evidência direta.

## 19. Componentes reutilizáveis

| Componente | Onde aparece | Variações | Inconsistências | Design System |
|---|---|---|---|---|
| Page Header | / | Não diferenciadas | A validar visualmente | Sim |
| Data Table | / | Não diferenciadas | A validar visualmente | Sim |
| Drawer | / | Não diferenciadas | A validar visualmente | Sim |
| Input | / | Não diferenciadas | A validar visualmente | Sim |
| Filter Bar | /contacts | Não diferenciadas | A validar visualmente | Sim |
| Search Bar | /templates | Não diferenciadas | A validar visualmente | Sim |
| Tabs | /settings | Não diferenciadas | A validar visualmente | Sim |

## 20. Problemas de UI/UX

- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há texto visual abaixo de 12px.** - Página: Painel Ebot; elemento/evidência: 11.2px foi o menor tamanho observado; impacto: Pode prejudicar legibilidade e uso em telas pequenas.; prioridade: Alta; recomendação: Revisar escala tipográfica e reservar tamanhos menores para metadados.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **A página não apresenta heading H1 identificável.** - Página: Painel Ebot; elemento/evidência: Estrutura DOM observada; impacto: Reduz contexto e orientação do usuário.; prioridade: Média; recomendação: Adicionar um título de página único e semanticamente marcado.
- **Há botão sem nome acessível evidente.** - Página: Painel Ebot; elemento/evidência: Botão sem texto, aria-label ou title no DOM visível; impacto: Usuários de tecnologia assistiva podem não identificar a ação.; prioridade: Alta; recomendação: Adicionar nome acessível e foco visível.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.
- **Tabela presente no viewport móvel.** - Página: Painel Ebot; elemento/evidência: 1 tabela(s) observada(s); impacto: Pode exigir scroll horizontal ou cortar colunas.; prioridade: Alta; recomendação: Validar tabela responsiva com colunas prioritárias, cards ou scroll controlado.

## 21. Problemas de acessibilidade

- Resumo axe: {"moderate":67,"critical":23,"serious":70,"minor":23}.
- Violações e elementos afetados:
  - landmark-one-main: Document should have one main landmark; impacto: moderate; 1 elemento(s); alvo(s): html
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 6 elemento(s); alvo(s): .jss136 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): .MuiTypography-noWrap
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss116, .jss136 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 14 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-sizeMedium[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 8 elemento(s); alvo(s): .jss128 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .jss126 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - empty-table-header: Table header text should not be empty; impacto: minor; 1 elemento(s); alvo(s): .MuiTableCell-paddingCheckbox
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss108, .jss128 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 14 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-sizeMedium[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 4 elemento(s); alvo(s): .jss125 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss105, .jss125 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiButtonBase-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss122 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiListItemText-primary.css-bxmwoh.MuiTypography-body2, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .jss120 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiListItemText-primary.css-bxmwoh.MuiTypography-body2
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss102, .jss122 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - aria-prohibited-attr: Elements must only use permitted ARIA attributes; impacto: serious; 1 elemento(s); alvo(s): span[aria-label="Sincronizar templates meta"]
  - button-name: Buttons must have discernible text; impacto: critical; 5 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiButtonBase-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss131 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .jss129 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss111, .jss131 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 7 elemento(s); alvo(s): .jss149 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .jss147 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss129, .jss149 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 17 elemento(s); alvo(s): .jss138 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .jss136 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss118, .jss138 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 10 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-sizeMedium[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 7 elemento(s); alvo(s): .jss124 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .jss122 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss104, .jss124 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - landmark-one-main: Document should have one main landmark; impacto: moderate; 1 elemento(s); alvo(s): html
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss116 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): .jss107
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss96, .jss116 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss121 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): .jss112
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss101, .jss121 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 6 elemento(s); alvo(s): .jss124 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 16 elemento(s); alvo(s): .jss104, .jss124 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss127 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss107, .jss127 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss125 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 14 elemento(s); alvo(s): .jss105, .jss125 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 6 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-sizeMedium[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss135 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss115, .jss135 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiButtonBase-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 8 elemento(s); alvo(s): .jss128 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiListItemText-primary.css-bxmwoh.MuiTypography-body2, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss108, .jss128 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 6 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-sizeMedium[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss128 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiListItemText-primary.MuiTypography-body2.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss108, .jss128 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 8 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-sizeMedium[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss127 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiListItemText-primary.css-bxmwoh.MuiTypography-body2, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss107, .jss127 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 8 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-sizeMedium[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 5 elemento(s); alvo(s): .jss126 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss106, .jss126 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 9 elemento(s); alvo(s): .jss120 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - label: Form elements must have labels; impacto: critical; 1 elemento(s); alvo(s): #medias
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): .MuiList-root
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss100, .jss120 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiButtonBase-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 4 elemento(s); alvo(s): .jss121 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss101, .jss121 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiIconButton-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 6 elemento(s); alvo(s): .jss140 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss120, .jss140 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - button-name: Buttons must have discernible text; impacto: critical; 4 elemento(s); alvo(s): .css-ybbuvj, .MuiIconButton-edgeStart, div:nth-child(5) > .css-mfslm7.MuiButtonBase-root[variant="contained"]
  - color-contrast: Elements must meet minimum color contrast ratio thresholds; impacto: serious; 4 elemento(s); alvo(s): .jss125 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3 > .MuiTypography-body2.MuiListItemText-primary.css-bxmwoh, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(10)
  - empty-heading: Headings should not be empty; impacto: minor; 1 elemento(s); alvo(s): h2
  - heading-order: Heading levels should only increase by one; impacto: moderate; 1 elemento(s); alvo(s): h5
  - list: <ul> and <ol> must only directly contain <li>, <script> or <template> elements; impacto: serious; 1 elemento(s); alvo(s): ul
  - listitem: <li> elements must be contained in a <ul> or <ol>; impacto: serious; 13 elemento(s); alvo(s): #tickets > li, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2), #contacts > li
  - page-has-heading-one: Page should contain a level-one heading; impacto: moderate; 1 elemento(s); alvo(s): html
  - region: All page content should be contained by landmarks; impacto: moderate; 15 elemento(s); alvo(s): .jss105, .jss125 > .MuiListItemText-root.MuiListItemText-dense.css-gdetl3, .MuiListSubheader-root.MuiListSubheader-gutters.MuiListSubheader-inset:nth-child(2)
  - scrollable-region-focusable: Scrollable region must have keyboard access; impacto: serious; 1 elemento(s); alvo(s): .MuiTableContainer-root
  - scrollable-region-focusable: Scrollable region must have keyboard access; impacto: serious; 1 elemento(s); alvo(s): .MuiPaper-outlined
  - scrollable-region-focusable: Scrollable region must have keyboard access; impacto: serious; 1 elemento(s); alvo(s): .MuiPaper-outlined
- Análise manual: headings, labels, nomes acessíveis, foco e área de clique foram inspecionados quando presentes no DOM visível.

## 22. Problemas de responsividade

- Nenhum overflow ou modal fora do viewport foi detectado automaticamente.

## 23. Proposta de reorganização da navegação

### Estrutura atual

- A estrutura real observada está listada nas seções 5 e 6.
- Categorias não foram inventadas quando o DOM não forneceu contexto.

### Proposta

- **Primary Sidebar:** Operação, Comunicação, Cadastros, Administração, Relatórios e Sistema, usando somente rotas existentes identificadas.
- **Contextual Secondary Sidebar:** exibir subitens apenas para o grupo ativo, reduzindo scroll e repetição.
- **Itens novos:** nenhum item de rota nova é considerado existente; propostas de novos fluxos estão na seção 28.
- Justificativa: separar operação diária, comunicação, cadastros e administração reduz carga cognitiva sem prometer backend inexistente.

## 24. Páginas que podem ser unificadas

- Setores, filas, usuários, profissionais, convênios, exames, empresas, unidades, permissões, tags e arquivos devem ser avaliados como grupos de cadastros relacionados.
- Unificação sugerida somente no shell e na navegação contextual; rotas individuais devem ser mantidas até validação de permissões, regras e URLs legadas.
- Benefício: descoberta mais simples. Risco: misturar entidades com permissões e ciclos de vida diferentes.

## 25. Páginas que devem permanecer separadas

- Atendimento/chat deve permanecer separado de configurações e cadastros por frequência, criticidade e contexto operacional.
- Canais e integrações devem permanecer separados de campanhas até validação das regras de conexão e disparo.
- Financeiro, permissões e configurações sensíveis devem permanecer em áreas administrativas próprias.

## 26. Redesign recomendado por página

- Atendimentos: adaptação visual e padronização de shell, hierarquia e estados; prioridade Alta.
- Dashboard: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Contatos: redesign completo da leitura de dados e comportamento responsivo; prioridade Alta.
- Protocolos: redesign completo da leitura de dados e comportamento responsivo; prioridade Alta.
- Origens de contato: redesign completo da leitura de dados e comportamento responsivo; prioridade Alta.
- Templates: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Google Calendar: adaptação visual e padronização de shell, hierarquia e estados; prioridade Média.
- Agendas: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Tags: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Kanban: adaptação visual e padronização de shell, hierarquia e estados; prioridade Média.
- Lista de tarefas: adaptação visual e padronização de shell, hierarquia e estados; prioridade Média.
- Chat interno: adaptação visual e padronização de shell, hierarquia e estados; prioridade Alta.
- Respostas rápidas: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Arquivos: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Prompts: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Integração de filas: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Conexões: adaptação visual e padronização de shell, hierarquia e estados; prioridade Média.
- Setores: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Filas: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Convênios: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- API de mensagens: adaptação visual e padronização de shell, hierarquia e estados; prioridade Média.
- Financeiro: redesign completo da leitura de dados e comportamento responsivo; prioridade Média.
- Configurações: adaptação visual e padronização de shell, hierarquia e estados; prioridade Média.
- Ajuda: adaptação visual e padronização de shell, hierarquia e estados; prioridade Média.

## 27. Oportunidades de melhoria de UX

- Filtros persistidos por contexto: Persistir filtros por usuário e permitir limpar todos em um passo.; benefício: Reduzir cliques repetitivos..
- Visualização responsiva de tabelas: Oferecer colunas prioritárias, cards ou scroll horizontal explicitamente indicado.; benefício: Melhorar operação em tablet e mobile..
- Resumo inteligente da conversa: Gerar resumo contextual da conversa com fonte e atualização visíveis.; benefício: Reduzir tempo de entendimento do atendimento..
- Sistema compartilhado de estados: Padronizar componentes e mensagens para estados operacionais.; benefício: Aumentar previsibilidade e reduzir carga cognitiva..

## 28. Novas funcionalidades sugeridas

### Filtros persistidos por contexto

- Página: Páginas com listas
- Classificação: MELHORIA DE UX
- Problema observado: Filtros exigem repetição em rotinas recorrentes.
- Proposta: Persistir filtros por usuário e permitir limpar todos em um passo.
- Benefício: Reduzir cliques repetitivos.
- Complexidade: baixa
- Prioridade: Média
- Dependência de backend: não necessariamente
- Dependência de regra de negócio: não

### Visualização responsiva de tabelas

- Página: Páginas com tabelas
- Classificação: REDESIGN VISUAL
- Problema observado: Tabelas podem exigir overflow em mobile.
- Proposta: Oferecer colunas prioritárias, cards ou scroll horizontal explicitamente indicado.
- Benefício: Melhorar operação em tablet e mobile.
- Complexidade: média
- Prioridade: Alta
- Dependência de backend: não
- Dependência de regra de negócio: não

### Resumo inteligente da conversa

- Página: Operação
- Classificação: NOVA FUNCIONALIDADE COM BACKEND
- Problema observado: Históricos extensos aumentam o tempo de leitura e transferência.
- Proposta: Gerar resumo contextual da conversa com fonte e atualização visíveis.
- Benefício: Reduzir tempo de entendimento do atendimento.
- Complexidade: média
- Prioridade: Alta
- Dependência de backend: sim, histórico e modelo de IA
- Dependência de regra de negócio: sim, regras de privacidade e revisão humana

### Sistema compartilhado de estados

- Página: Plataforma
- Classificação: PADRONIZAÇÃO
- Problema observado: Estados de loading, vazio, erro e sucesso podem variar entre páginas.
- Proposta: Padronizar componentes e mensagens para estados operacionais.
- Benefício: Aumentar previsibilidade e reduzir carga cognitiva.
- Complexidade: média
- Prioridade: Alta
- Dependência de backend: não
- Dependência de regra de negócio: não

## 29. Dependências de backend

- Filtros persistidos por contexto: não necessariamente.
- Resumo inteligente da conversa: sim, histórico e modelo de IA.

## 30. Dependências de regras de negócio

- Resumo inteligente da conversa: sim, regras de privacidade e revisão humana.

## 31. Priorização recomendada

1. **Crítica:** operação de atendimentos, caso a plataforma seja usada diariamente para atendimento.
2. **Alta:** tabelas, filtros, responsividade e acessibilidade, por afetarem eficiência e número amplo de usuários.
3. **Média:** cadastros e padronização de componentes, após estabilizar o shell.
4. **Futura:** IA e automações novas, condicionadas a backend, privacidade e regras de negócio.

## 32. Complexidade estimada por página

- Atendimentos: Baixa/Média - predominantemente shell e conteúdo visual.
- Dashboard: Média/Alta - envolve dados, estados e responsividade.
- Contatos: Média/Alta - envolve dados, estados e responsividade.
- Protocolos: Média/Alta - envolve dados, estados e responsividade.
- Origens de contato: Média/Alta - envolve dados, estados e responsividade.
- Templates: Média/Alta - envolve dados, estados e responsividade.
- Google Calendar: Baixa/Média - predominantemente shell e conteúdo visual.
- Agendas: Média/Alta - envolve dados, estados e responsividade.
- Tags: Média/Alta - envolve dados, estados e responsividade.
- Kanban: Baixa/Média - predominantemente shell e conteúdo visual.
- Lista de tarefas: Baixa/Média - predominantemente shell e conteúdo visual.
- Chat interno: Baixa/Média - predominantemente shell e conteúdo visual.
- Respostas rápidas: Média/Alta - envolve dados, estados e responsividade.
- Arquivos: Média/Alta - envolve dados, estados e responsividade.
- Prompts: Média/Alta - envolve dados, estados e responsividade.
- Integração de filas: Média/Alta - envolve dados, estados e responsividade.
- Conexões: Baixa/Média - predominantemente shell e conteúdo visual.
- Setores: Média/Alta - envolve dados, estados e responsividade.
- Filas: Média/Alta - envolve dados, estados e responsividade.
- Convênios: Média/Alta - envolve dados, estados e responsividade.
- API de mensagens: Média/Alta - envolve dados, estados e responsividade.
- Financeiro: Média/Alta - envolve dados, estados e responsividade.
- Configurações: Baixa/Média - predominantemente shell e conteúdo visual.
- Ajuda: Baixa/Média - predominantemente shell e conteúdo visual.

## 33. Cronograma preliminar

### Semana 1 - Operação principal

- Consolidar shell, login e navegação.
- Priorizar atendimentos, chat, busca, filtros e contatos encontrados.
- Separar redesign completo de regras novas.

### Semana 2 - Comunicação e cadastros

- Revisar canais, chat interno, campanhas, templates, respostas rápidas, arquivos e cadastros somente se encontrados e validados.
- Padronizar tabelas, formulários, filtros e estados.

### Semana 3 - Administração e finalização

- Revisar configurações, integrações, API, financeiro, perfil, notificações, ajuda, agenda, tarefas e kanban somente quando presentes.
- Executar revisão responsiva, acessibilidade e consistência visual.

Cronograma preliminar sujeito à validação após revisão da auditoria e confirmação de escopo com a equipe.

## 34. Endpoints observados

| Página | Método | Endpoint | Status | Finalidade aparente |
|---|---|---|---:|---|
| Nenhuma requisição XHR/fetch registrada | - | - | - | - |

## 35. Evidências visuais

| Página | Arquivo | Viewport | Observação |
|---|---|---|---|
| Login | `docs/auditoria-ebot-assets/01-login-desktop.png` | desktop | Tela de autenticação mascarada; credenciais não são gravadas. |
| Atendimentos | `docs/auditoria-ebot-assets/02-atendimentos-desktop.png` | desktop | Estado principal da página. |
| Dashboard | `docs/auditoria-ebot-assets/03-dashboard-desktop.png` | desktop | Estado principal da página. |
| Contatos | `docs/auditoria-ebot-assets/04-contatos-desktop.png` | desktop | Estado principal da página. |
| Protocolos | `docs/auditoria-ebot-assets/05-protocolos-desktop.png` | desktop | Estado principal da página. |
| Origens de contato | `docs/auditoria-ebot-assets/06-origens-de-contato-desktop.png` | desktop | Estado principal da página. |
| Templates | `docs/auditoria-ebot-assets/07-templates-desktop.png` | desktop | Estado principal da página. |
| Google Calendar | `docs/auditoria-ebot-assets/08-google-calendar-desktop.png` | desktop | Estado principal da página. |
| Agendas | `docs/auditoria-ebot-assets/09-agendas-desktop.png` | desktop | Estado principal da página. |
| Agendas | `docs/auditoria-ebot-assets/10-drawer-novo-agendamento-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/11-drawer-novo-agendamento-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/12-modal-selecione-um-tipo-de-agendamento-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/13-modal-novo-agendamento-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/14-modal-selecione-um-tipo-de-agendamento-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/15-drawer-agenda-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/16-drawer-agenda-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/17-modal-selecione-um-tipo-de-agendamento-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/18-modal-agenda-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Agendas | `docs/auditoria-ebot-assets/19-modal-selecione-um-tipo-de-agendamento-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Tags | `docs/auditoria-ebot-assets/20-tags-desktop.png` | desktop | Estado principal da página. |
| Kanban | `docs/auditoria-ebot-assets/21-kanban-desktop.png` | desktop | Estado principal da página. |
| Lista de tarefas | `docs/auditoria-ebot-assets/22-lista-de-tarefas-desktop.png` | desktop | Estado principal da página. |
| Chat interno | `docs/auditoria-ebot-assets/23-chat-interno-desktop.png` | desktop | Estado principal da página. |
| Respostas rápidas | `docs/auditoria-ebot-assets/24-respostas-rapidas-desktop.png` | desktop | Estado principal da página. |
| Arquivos | `docs/auditoria-ebot-assets/25-arquivos-desktop.png` | desktop | Estado principal da página. |
| Prompts | `docs/auditoria-ebot-assets/26-prompts-desktop.png` | desktop | Estado principal da página. |
| Integração de filas | `docs/auditoria-ebot-assets/27-integracao-de-filas-desktop.png` | desktop | Estado principal da página. |
| Conexões | `docs/auditoria-ebot-assets/28-conexoes-desktop.png` | desktop | Estado principal da página. |
| Setores | `docs/auditoria-ebot-assets/29-setores-desktop.png` | desktop | Estado principal da página. |
| Filas | `docs/auditoria-ebot-assets/30-filas-desktop.png` | desktop | Estado principal da página. |
| Atendimentos | `docs/auditoria-ebot-assets/31-atendimentos-desktop.png` | desktop | Estado principal da página. |
| Atendimentos | `docs/auditoria-ebot-assets/32-atendimentos-desktop.png` | desktop | Estado principal da página. |
| Convênios | `docs/auditoria-ebot-assets/33-convenios-desktop.png` | desktop | Estado principal da página. |
| API de mensagens | `docs/auditoria-ebot-assets/34-api-de-mensagens-desktop.png` | desktop | Estado principal da página. |
| Financeiro | `docs/auditoria-ebot-assets/35-financeiro-desktop.png` | desktop | Estado principal da página. |
| Configurações | `docs/auditoria-ebot-assets/36-configuracoes-desktop.png` | desktop | Estado principal da página. |
| Configurações | `docs/auditoria-ebot-assets/37-drawer-opcoes-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Configurações | `docs/auditoria-ebot-assets/38-drawer-opcoes-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Configurações | `docs/auditoria-ebot-assets/39-drawer-ajuda-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Configurações | `docs/auditoria-ebot-assets/40-drawer-ajuda-desktop.png` | desktop | Interação segura aberta sem submissão. |
| Ajuda | `docs/auditoria-ebot-assets/41-ajuda-desktop.png` | desktop | Estado principal da página. |

## 36. Pendências para validação com a equipe

- Atendimentos - network: net::ERR_ABORTED; impacto: Requisição de rede não concluída.

## 37. Checklist final

- [ ] sidebarAnalyzed
- [x] submenusOpened
- [ ] navbarAnalyzed
- [x] profileAnalyzed
- [x] notificationsAnalyzed
- [ ] clickableCardsChecked
- [x] tabsAnalyzed
- [x] filtersRecorded
- [x] safeModalsOpened
- [x] drawersOpened
- [x] formsDocumented
- [x] formsSubmitted
- [x] routesRecorded
- [x] screenshotsAssociated
- [x] sensitiveDataMasked
- [x] existingAndSuggestedSeparated
- [x] persistentChangesMade
- [x] credentialsRecorded
- [x] accessibilityExecuted
- [x] requiredViewportsTested
- [x] markdownGenerated
- [x] jsonGenerated

## 38. Conclusão

A auditoria separa evidências observadas de sugestões de redesign. O maior ganho esperado está em tornar a operação diária mais previsível, legível e responsiva, mantendo ações sensíveis protegidas por validação posterior com produto, engenharia, clínica e compliance.
