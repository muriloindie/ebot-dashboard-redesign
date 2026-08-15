import {
  Activity,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  CheckSquare,
  CircleHelp,
  ClipboardList,
  Code2,
  Columns3,
  ContactRound,
  FileText,
  GitBranch,
  Headphones,
  LayoutDashboard,
  Link2,
  ListOrdered,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  MessagesSquare,
  Plug,
  RadioTower,
  Settings,
  Settings2,
  ShieldCheck,
  Tags,
  UserRound,
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
      { id: "agenda", label: "Agenda", icon: CalendarDays, path: "/agenda", enabled: true },
      { id: "kanban", label: "Kanban", icon: Columns3, path: "/kanban", enabled: true },
      { id: "tarefas", label: "Tarefas", icon: CheckSquare, path: "/tarefas", enabled: true }
    ]
  },
  {
    id: "pacientes-contatos",
    label: "Pacientes",
    icon: UsersRound,
    items: [
      { id: "pacientes", label: "Pacientes", icon: UserRound, path: "/pacientes", enabled: true },
      { id: "contatos", label: "Contatos", icon: ContactRound, path: "/contatos", enabled: true },
      { id: "relacionamentos", label: "Relacionamentos", icon: Link2, path: "/relacionamentos", enabled: true },
      { id: "tags", label: "Tags", icon: Tags, path: "/tags", enabled: true },
      { id: "protocolos", label: "Protocolos", icon: ClipboardList, path: "/protocolos", enabled: true },
      { id: "arquivos", label: "Arquivos", icon: FileText, path: "/arquivos", enabled: true }
    ]
  },
  {
    id: "automacao-ia",
    label: "Automação",
    icon: Bot,
    items: [
      { id: "templates", label: "Templates", icon: MessageSquareText, path: "/templates", enabled: true },
      { id: "respostas-rapidas", label: "Respostas rápidas", icon: Zap, path: "/respostas-rapidas", enabled: true },
      { id: "openai", label: "Open.AI", icon: Bot, path: "/openai", enabled: true },
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
    id: "organizacao-clinica",
    label: "Clínica",
    icon: Building2,
    items: [
      { id: "setores", label: "Setores", icon: GitBranch, path: "/setores", enabled: true },
      { id: "filas", label: "Filas", icon: ListOrdered, path: "/filas", enabled: true },
      { id: "usuarios", label: "Usuários", icon: UserRound, path: "/usuarios", enabled: true },
      { id: "permissoes", label: "Permissões", icon: ShieldCheck, path: "/permissoes", enabled: true }
    ]
  },
  {
    id: "integracoes-sistema",
    label: "Sistema",
    icon: Settings2,
    items: [
      { id: "integracoes", label: "Integrações", icon: Plug, path: "/integracoes", enabled: true },
      { id: "api", label: "API", icon: Code2, path: "/api", enabled: true },
      { id: "financeiro", label: "Financeiro", icon: WalletCards, path: "/financeiro", enabled: true },
      { id: "configuracoes", label: "Configurações", icon: Settings, path: "/configuracoes", enabled: true },
      { id: "ajuda", label: "Ajuda", icon: CircleHelp, path: "/ajuda", enabled: true }
    ]
  }
];

export function findSidebarGroupByItem(itemId: string) {
  return sidebarNavigation.find((group) =>
    group.items.some((item) => item.id === itemId || item.children?.some((child) => child.id === itemId))
  );
}
