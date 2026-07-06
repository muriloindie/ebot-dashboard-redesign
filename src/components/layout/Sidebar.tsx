"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Archive,
  Bot,
  CalendarDays,
  CheckSquare,
  ContactRound,
  FileText,
  Gauge,
  GitBranch,
  KanbanSquare,
  Megaphone,
  MessageSquareText,
  PanelLeft,
  PanelRight,
  PlugZap,
  Settings,
  UsersRound,
  Zap
} from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/ui/Tooltip";
import logo from "@/assets/icon.png";

export type MenuItemId =
  | "dashboard"
  | "atendimentos"
  | "contatos"
  | "agendamentos"
  | "protocolos"
  | "templates"
  | "respostas"
  | "openai"
  | "integracoes"
  | "kanban"
  | "tarefas"
  | "campanhas"
  | "arquivos"
  | "configuracoes";

type SidebarProps = {
  activeItem: MenuItemId;
  onChange: (item: MenuItemId) => void;
};

const groups: { label: string; items: { id: MenuItemId; label: string; icon: React.ElementType }[] }[] = [
  {
    label: "Operação",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Gauge },
      { id: "atendimentos", label: "Atendimentos", icon: MessageSquareText },
      { id: "contatos", label: "Contatos", icon: ContactRound },
      { id: "agendamentos", label: "Agendamentos", icon: CalendarDays },
      { id: "protocolos", label: "Protocolos", icon: FileText }
    ]
  },
  {
    label: "Automação",
    items: [
      { id: "templates", label: "Templates", icon: GitBranch },
      { id: "respostas", label: "Respostas rápidas", icon: Zap },
      { id: "openai", label: "Open.AI", icon: Bot },
      { id: "integracoes", label: "Integrações", icon: PlugZap }
    ]
  },
  {
    label: "Gestão",
    items: [
      { id: "kanban", label: "Kanban", icon: KanbanSquare },
      { id: "tarefas", label: "Tarefas", icon: CheckSquare },
      { id: "campanhas", label: "Campanhas", icon: Megaphone },
      { id: "arquivos", label: "Arquivos", icon: Archive }
    ]
  },
  {
    label: "Sistema",
    items: [{ id: "configuracoes", label: "Configurações", icon: Settings }]
  }
];

export function Sidebar({ activeItem, onChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = navRef.current?.querySelectorAll("[data-sidebar-item]");
    if (!items?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      items,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", stagger: 0.035 }
    );
  }, [collapsed]);

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 p-4 transition-all duration-300 ease-out md:block",
          collapsed ? "w-[104px]" : "w-[278px]"
        )}
      >
        <div className="sticky top-4 flex h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#263532_0%,#111716_100%)] shadow-2xl shadow-clinical-charcoal/20">
          <div className={cn("flex items-center gap-3 px-5 py-6", collapsed && "justify-center px-3")}>
            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-glow">
              <Image src={logo} alt="Ê-Bot Clinical" className="size-8 object-contain" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-clinical-dark bg-clinical-green" />
            </div>
            {!collapsed ? (
              <div className="overflow-hidden">
                <p className="text-base font-extrabold tracking-tight text-white">Ê-Bot</p>
                <p className="text-xs font-medium text-white/55">Clinical Command</p>
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setCollapsed((current) => !current)}
            className={cn(
              "mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-bold text-white/60 transition hover:bg-white/[0.1] hover:text-white",
              collapsed && "mx-3 justify-center px-2"
            )}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <PanelRight className="size-4" /> : <PanelLeft className="size-4" />}
            {!collapsed ? <span>Recolher menu</span> : null}
          </button>

          <div ref={navRef} className="clinical-scrollbar flex-1 overflow-y-auto px-3 pb-5">
            {groups.map((group) => (
              <div key={group.label} className={cn("mb-5", collapsed && "mb-3")}>
                {!collapsed ? (
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/32">{group.label}</p>
                ) : null}
                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeItem === item.id;

                    return (
                      collapsed ? (
                        <Tooltip key={item.id} content={item.label} side="right">
                          <button
                            data-sidebar-item
                            onClick={() => onChange(item.id)}
                            className={cn(
                              "group flex w-full items-center justify-center rounded-[14px] border px-2 py-3 text-left text-sm font-semibold transition duration-300 ease-out hover:translate-x-0",
                              active
                                ? "border-clinical-blue/25 bg-clinical-blue/[0.16] text-white shadow-[0_14px_34px_rgba(43,159,232,0.12)]"
                                : "border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white"
                            )}
                          >
                            <Icon
                              className={cn(
                                "size-[18px] shrink-0 transition duration-300 group-hover:scale-110",
                                active ? "text-clinical-blue" : "text-white/45 group-hover:text-clinical-blue"
                              )}
                            />
                          </button>
                        </Tooltip>
                      ) : (
                        <button
                          key={item.id}
                          data-sidebar-item
                          onClick={() => onChange(item.id)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left text-sm font-semibold transition duration-300 ease-out",
                            active
                              ? "border-clinical-blue/25 bg-clinical-blue/[0.16] text-white shadow-[0_14px_34px_rgba(43,159,232,0.12)]"
                              : "border-transparent text-white/60 hover:translate-x-1 hover:bg-white/[0.06] hover:text-white"
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-[18px] shrink-0 transition duration-300 group-hover:scale-110",
                              active ? "text-clinical-blue" : "text-white/45 group-hover:text-clinical-blue"
                            )}
                          />
                          <span>{item.label}</span>
                        </button>
                      )
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!collapsed ? (
            <div className="m-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white">
                <UsersRound className="size-4 text-clinical-green" />
                Clínica São Lucas
              </div>
              <p className="text-xs leading-5 text-white/50">IA operando 24/7 com handoff humano e regras clínicas monitoradas.</p>
            </div>
          ) : (
            <div className="m-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
              <UsersRound className="mx-auto size-5 text-clinical-green" />
            </div>
          )}
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-2 rounded-[24px] border border-white/50 bg-white/85 p-2 shadow-clinical backdrop-blur-xl md:hidden">
        {groups[0].items.map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-bold transition",
                active ? "bg-clinical-blue text-white" : "text-clinical-muted hover:bg-clinical-blue/10 hover:text-clinical-blue"
              )}
            >
              <Icon className="size-4" />
              <span className="max-w-full truncate">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
