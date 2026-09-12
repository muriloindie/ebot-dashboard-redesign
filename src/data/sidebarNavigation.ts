import {
  Activity,
  BookOpen,
  Bug,
  Building2,
  CalendarDays,
  CheckSquare,
  CircleHelp,
  ClipboardList,
  Code2,
  Columns3,
  ContactRound,
  FileText,
  Headphones,
  LayoutDashboard,
  ListOrdered,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  MessagesSquare,
  Palette,
  Plug,
  RadioTower,
  ScrollText,
  Settings,
  Settings2,
  ShieldHalf,
  Tags,
  Target,
  UsersRound,
  WalletCards,
  Workflow,
  Zap
} from "lucide-react";
import type { ElementType } from "react";

export type SidebarItemConfig = {
  id: string;
  label: string;
  icon: ElementType;
  path: string;
  enabled?: boolean;
  badge?: string;
  children?: SidebarItemConfig[];
};

export type SidebarGroupConfig = {
  id: string;
  label: string;
  icon: ElementType;
  defaultOpen?: boolean;
  badge?: string;
  items: SidebarItemConfig[];
};

export type MenuItemId = string;

export const sidebarNavigation: SidebarGroupConfig[] = [
  {
    id: "operacao",
    label: "Operação",
    icon: Activity,
    defaultOpen: true,
    badge: "6",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/", enabled: true },
      { id: "atendimentos", label: "Atendimentos", icon: Headphones, path: "/atendimentos", enabled: true, badge: "9" },
      { id: "crm", label: "CRM", icon: Target, path: "/crm", enabled: true },
      { id: "agenda", label: "Agenda", icon: CalendarDays, path: "/agenda", enabled: true },
      { id: "kanban", label: "Kanban", icon: Columns3, path: "/kanban", enabled: true },
      { id: "tarefas", label: "Tarefas", icon: CheckSquare, path: "/tarefas", enabled: true }
    ]
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: UsersRound,
    items: [
      { id: "contatos", label: "Contatos", icon: ContactRound, path: "/contatos", enabled: true },
      { id: "tags", label: "Tags", icon: Tags, path: "/tags", enabled: true },
      { id: "protocolos", label: "Protocolos", icon: ClipboardList, path: "/protocolos", enabled: true },
      { id: "arquivos", label: "Arquivos", icon: FileText, path: "/arquivos", enabled: true }
    ]
  },
  {
    id: "automacao-ia",
    label: "Automação",
    icon: Workflow,
    items: [
      { id: "templates", label: "Templates", icon: MessageSquareText, path: "/templates", enabled: true },
      { id: "respostas-rapidas", label: "Respostas rápidas", icon: Zap, path: "/respostas-rapidas", enabled: true },
      { id: "fluxos-automacao", label: "Fluxos de automação", icon: Workflow, path: "/fluxos-automacao", enabled: true },
      { id: "base-conhecimento", label: "Base de conhecimento", icon: BookOpen, path: "/base-conhecimento", enabled: true }
    ]
  },
  {
    id: "comunicacao",
    label: "Comunicação",
    icon: MessageCircle,
    badge: "8",
    items: [
      { id: "canais", label: "Canais", icon: RadioTower, path: "/canais", enabled: true },
      { id: "chat-interno", label: "Chat interno", icon: MessagesSquare, path: "/chat-interno", enabled: true },
      {
        id: "campanhas",
        label: "Campanhas",
        icon: Megaphone,
        path: "/campanhas",
        enabled: true,
        children: [
          { id: "campanhas-listagem", label: "Listagem", icon: Megaphone, path: "/campanhas", enabled: true },
          { id: "campanhas-listas", label: "Listas de contatos", icon: UsersRound, path: "/campanhas/listas", enabled: true },
          { id: "campanhas-configuracoes", label: "Configurações", icon: Settings, path: "/campanhas/configuracoes", enabled: true }
        ]
      }
    ]
  },
  {
    id: "integracoes-sistema",
    label: "Sistema",
    icon: Settings2,
    items: [
      { id: "filas", label: "Filas", icon: ListOrdered, path: "/filas", enabled: true },
      { id: "setores", label: "Setores", icon: Building2, path: "/setores", enabled: true },
      { id: "usuarios", label: "Usuários", icon: UsersRound, path: "/usuarios", enabled: true },
      { id: "integracoes", label: "Integrações", icon: Plug, path: "/integracoes", enabled: true },
      { id: "openai", label: "Open.AI", icon: Workflow, path: "/openai", enabled: true },
      { id: "api", label: "API", icon: Code2, path: "/api", enabled: true },
      { id: "financeiro", label: "Financeiro", icon: WalletCards, path: "/financeiro", enabled: true },
      { id: "configuracoes", label: "Configurações", icon: Settings, path: "/configuracoes", enabled: true },
      { id: "ajuda", label: "Ajuda", icon: CircleHelp, path: "/ajuda", enabled: true }
    ]
  },
  {
    id: "retaguarda",
    label: "Retaguarda",
    icon: ShieldHalf,
    items: [
      { id: "retaguarda-logs", label: "Logs", icon: ScrollText, path: "/retaguarda/logs", enabled: true },
      { id: "retaguarda-bugs", label: "Bugs", icon: Bug, path: "/retaguarda/bugs", enabled: true },
      { id: "retaguarda-aparencia", label: "Aparência", icon: Palette, path: "/retaguarda/aparencia", enabled: true }
    ]
  }
];

export function findSidebarGroupByItem(itemId: string) {
  return sidebarNavigation.find((group) =>
    group.items.some((item) => item.id === itemId || item.children?.some((child) => child.id === itemId))
  );
}
