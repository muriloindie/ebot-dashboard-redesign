# Ê-Bot Dashboard — Protótipo

Protótipo local em Next.js para validar a experiência do painel operacional do **Ê-Bot**: atendimento no WhatsApp, CRM comercial, automações com IA e API, antes da integração com backend.

## Como Rodar

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Stack

- Next.js App Router + React + TypeScript
- TailwindCSS com tokens de tema (`--ebot-*` em `src/app/globals.css`)
- GSAP (animações com `prefers-reduced-motion` respeitado)
- Lucide React (ícones)
- Recharts (gráficos do dashboard)
- React Flow (editor de fluxos de automação)
- Playwright + axe-core (testes e2e e acessibilidade)
- Dados mockados locais + persistência em `localStorage`

## Estrutura Principal

- `src/app/(app)/layout.tsx`: shell autenticado com AppShell.
- `src/components/layout/*`: sidebar, topbar (com dropdown de tarefas do dia na data), seletor de empresa e canais. Acesso rápido: Dashboard, Atendimentos, CRM, Agenda, Kanban e Tarefas (o quadro de tarefas também vive em Tarefas → visão quadro, com navegação por arrasto igual ao CRM e ao Kanban).
- `src/components/dashboard/*`: dashboard em visão CRM única (KPIs de pipeline e ganhos, gráficos unificados com menu, funil do CRM, próximas ações/origens, insights da IA).
- `src/components/crm/CrmPage.tsx`: funil comercial com drag & drop, drawer do lead e criação rápida.
- `src/components/theme/AppearanceProvider.tsx`: aplica em tempo real logo, estilo da sidebar, cor de destaque, densidade, cantos e animações (editável em Retaguarda → Aparência).
- `src/components/operations/*`: atendimentos (com filtro rápido de status na fila), agenda, contatos, protocolos, chats e tags.
- `src/components/automation/*`: fluxos, templates, respostas rápidas, base de conhecimento, arquivos e prompts.
- `src/components/company/*`: setores, filas, usuários, permissões, integrações, campanhas, financeiro e configurações.
- `src/data/*`: dados mockados por domínio (dashboard, CRM, clientes, atendimentos, automações etc.).
- `src/lib/*`: serviços, cache local e helpers de formatação.

## Dados Mockados

Os principais pontos de edição:

```txt
src/data/dashboardMock.ts   # KPIs, filtros, insights da IA e contatos
src/data/crmMock.ts         # estágios do funil e leads do CRM
src/data/attendanceMock.ts  # atendimentos e conversas
src/data/clientsMock.ts     # base de clientes (perfil, histórico e eventos)
src/data/companyMock.ts     # setores, filas, usuários, campanhas e planos
```

Alterações feitas na interface são persistidas em `localStorage` com chaves `ebot-*`. Use o botão **Restaurar demo** nas telas de Kanban e CRM para voltar ao estado original.

## Identidade Visual

- Paleta oficial em `src/app/globals.css` (`:root` e `:root[data-theme="dark"]`):
  - `#041B15` (verde profundo — tema escuro), `#A9D16C` (verde Ê-Bot), `#5D737E` (slate), `#C7CCDB` e `#E1E5EE` (superfícies claras).
- Tokens Tailwind expostos em `ebot.*` (`bg-ebot-primary`, `text-ebot-dark`, `border-ebot-border` etc.).
- Logos em `src/assets/icon_black.webp` (tema claro) e `src/assets/icon_white.webp` (tema escuro), selecionadas automaticamente por tema.
- Favicon em `src/app/icon.webp`.

## Onde Conectar Backend Depois

Pontos naturais de integração futura:

- `DashboardPage.tsx`: substituir imports de mock por hooks/data fetching.
- `SmartFilters.tsx`: transformar estado local em query params e chamadas ao backend.
- `WaveLineChart.tsx`: trocar `hourlyFlow` por dados agregados de atendimento.
- `CrmFunnelWidget.tsx` e `CrmPage.tsx`: consumir pipeline real (`src/lib/crm/crmService.ts`).
- `RecentConversations.tsx`: conectar histórico real, resumo da IA, anexos e handoff.

## Testes

```bash
npm run lint       # ESLint
npm run test:e2e   # Playwright (sobe o dev server em http://127.0.0.1:3002)
```

## Escopo Atual

- Protótipo 100% front-end: sem autenticação real, banco de dados ou backend.
- Todas as telas do menu são navegáveis com dados de demonstração.
- O bloco clínico (pacientes, convênios, exames e agenda Google) foi removido deste produto; o vocabulário do painel é comercial (`clientes`, `leads`, `orçamentos`, `pedidos`).
