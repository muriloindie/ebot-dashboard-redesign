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
    badge: "5",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", enabled: true },
      { id: "atendimentos", label: "Atendimentos", icon: Headphones, path: "/atendimentos" },
      { id: "agenda", label: "Agenda", icon: CalendarDays, path: "/agenda" },
      { id: "kanban", label: "Kanban", icon: Columns3, path: "/kanban" },
      { id: "tarefas", label: "Tarefas", icon: CheckSquare, path: "/tarefas" }
    ]
  },
  {
    id: "pacientes-contatos",
    label: "Pacientes",
    icon: UsersRound,
    items: [
      { id: "contatos", label: "Contatos", icon: ContactRound, path: "/contatos" },
      { id: "relacionamentos", label: "Relacionamentos", icon: Link2, path: "/relacionamentos" },
      { id: "tags", label: "Tags", icon: Tags, path: "/tags" },
      { id: "protocolos", label: "Protocolos", icon: ClipboardList, path: "/protocolos" },
      { id: "arquivos", label: "Arquivos", icon: FileText, path: "/arquivos" }
    ]
  },
  {
    id: "automacao-ia",
    label: "Automação",
    icon: Bot,
    items: [
      { id: "templates", label: "Templates", icon: MessageSquareText, path: "/templates" },
      { id: "respostas-rapidas", label: "Respostas rápidas", icon: Zap, path: "/respostas-rapidas" },
      { id: "openai", label: "Open.AI", icon: Bot, path: "/openai" },
      { id: "fluxos-atendimento", label: "Fluxos de atendimento", icon: Workflow, path: "/fluxos-atendimento" },
      { id: "base-conhecimento", label: "Base de conhecimento", icon: BookOpen, path: "/base-conhecimento" }
    ]
  },
  {
    id: "comunicacao",
    label: "Comunicação",
    icon: MessageCircle,
    badge: "8",
    items: [
      { id: "canais", label: "Canais", icon: RadioTower, path: "/canais" },
      { id: "chat-interno", label: "Chat interno", icon: MessagesSquare, path: "/chat-interno" },
      {
        id: "campanhas",
        label: "Campanhas",
        icon: Megaphone,
        path: "/campanhas",
        children: [
          { id: "campanhas-listagem", label: "Listagem", icon: Megaphone, path: "/campanhas" },
          { id: "campanhas-listas", label: "Listas de contatos", icon: UsersRound, path: "/campanhas/listas" },
          { id: "campanhas-configuracoes", label: "Configurações", icon: Settings, path: "/campanhas/configuracoes" }
        ]
      }
    ]
  },
  {
    id: "organizacao-clinica",
    label: "Clínica",
    icon: Building2,
    items: [
      { id: "setores", label: "Setores", icon: GitBranch, path: "/setores" },
      { id: "filas", label: "Filas", icon: ListOrdered, path: "/filas" },
      { id: "usuarios", label: "Usuários", icon: UserRound, path: "/usuarios" },
      { id: "permissoes", label: "Permissões", icon: ShieldCheck, path: "/permissoes" }
    ]
  },
  {
    id: "integracoes-sistema",
    label: "Sistema",
    icon: Settings2,
    items: [
      { id: "integracoes", label: "Integrações", icon: Plug, path: "/integracoes" },
      { id: "api", label: "API", icon: Code2, path: "/api" },
      { id: "financeiro", label: "Financeiro", icon: WalletCards, path: "/financeiro" },
      { id: "configuracoes", label: "Configurações", icon: Settings, path: "/configuracoes" },
      { id: "ajuda", label: "Ajuda", icon: CircleHelp, path: "/ajuda" }
    ]
  }
];

export function findSidebarGroupByItem(itemId: string) {
  return sidebarNavigation.find((group) =>
    group.items.some((item) => item.id === itemId || item.children?.some((child) => child.id === itemId))
  );
}
