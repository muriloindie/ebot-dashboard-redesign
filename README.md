# Ê-Bot Clinical Dashboard Prototype

Protótipo local em Next.js para validar a experiência do dashboard operacional do Ê-Bot Clinical antes da integração com backend.

## Como Rodar

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Stack

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- GSAP
- Lucide React
- Recharts
- Mock data local

## Estrutura Principal

- `src/app/page.tsx`: entrada do protótipo.
- `src/components/layout/AppShell.tsx`: shell principal com sidebar, topbar e roteamento local.
- `src/components/layout/Sidebar.tsx`: navegação lateral redesenhada.
- `src/components/layout/Topbar.tsx`: topbar glass com busca, status e perfil.
- `src/components/dashboard/*`: widgets do dashboard.
- `src/components/ui/*`: componentes reutilizáveis.
- `src/data/dashboardMock.ts`: todos os dados mockados do dashboard.
- `src/lib/format.ts`: helpers de formatação.
- `src/lib/cn.ts`: helper de classes Tailwind.

## Mock Data

Todos os dados visíveis do dashboard estão centralizados em:

```txt
src/data/dashboardMock.ts
```

Edite esse arquivo para alterar KPIs, agenda, motivos de contato, conversas recentes, insights da IA e performance da equipe.

## Onde Conectar Backend Depois

Pontos naturais de integração futura:

- `DashboardPage.tsx`: substituir imports de mock por hooks/data fetching.
- `SmartFilters.tsx`: transformar estado local em query params e chamadas ao backend.
- `WaveLineChart.tsx`: trocar `hourlyFlow` por dados agregados de atendimento.
- `RecentConversations.tsx`: conectar histórico real, resumo da IA, anexos e handoff.
- `AppointmentTimeline.tsx`: conectar agenda e encaixes liberados.

## Como Adicionar Novos Widgets

1. Crie um componente em `src/components/dashboard/NomeDoWidget.tsx`.
2. Adicione os dados mockados em `src/data/dashboardMock.ts`.
3. Importe o widget em `src/components/dashboard/DashboardPage.tsx`.
4. Use `GlassCard` e os tokens existentes para manter consistência visual.
5. Se o widget tiver entrada visual importante, use GSAP com `prefers-reduced-motion` respeitado.

## Escopo Atual

- O menu `Dashboard` exibe a experiência completa.
- Os demais menus são interativos, mas mostram `Conteúdo em desenvolvimento`.
- Não há autenticação, banco de dados ou integração backend nesta fase.
