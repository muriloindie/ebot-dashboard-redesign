"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { PanelLeft, PanelRight, UsersRound } from "lucide-react";
import gsap from "gsap";
import { findSidebarGroupByItem, sidebarNavigation, type MenuItemId, type SidebarItemConfig } from "@/data/sidebarNavigation";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/ui/Tooltip";
import logo from "@/assets/icon.png";
import { SidebarGroup } from "./SidebarGroup";

type SidebarProps = {
  activeItem: MenuItemId;
  onChange: (item: MenuItemId) => void;
};

function getDefaultOpenGroups(activeItem: string) {
  const activeGroup = findSidebarGroupByItem(activeItem);
  return new Set(
    sidebarNavigation
      .filter((group) => group.defaultOpen || group.id === activeGroup?.id)
      .map((group) => group.id)
  );
}

export function Sidebar({ activeItem, onChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => getDefaultOpenGroups(activeItem));
  const [openCollapsedGroup, setOpenCollapsedGroup] = useState<string | null>(null);
  const [renderedCollapsedGroup, setRenderedCollapsedGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const collapsedMenuRef = useRef<HTMLDivElement>(null);

  const mobileItems = useMemo(() => sidebarNavigation[0].items, []);

  useEffect(() => {
    const activeGroup = findSidebarGroupByItem(activeItem);
    if (!activeGroup) return;
    setOpenGroups((current) => new Set(current).add(activeGroup.id));
  }, [activeItem]);

  useEffect(() => {
    const groups = navRef.current?.querySelectorAll("[data-sidebar-group]");
    if (!groups?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      groups,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.48, ease: "power3.out", stagger: 0.045 }
    );
  }, [collapsed]);

  useEffect(() => {
    if (openCollapsedGroup) {
      setRenderedCollapsedGroup(openCollapsedGroup);
      return;
    }

    if (!collapsedMenuRef.current) {
      setRenderedCollapsedGroup(null);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRenderedCollapsedGroup(null);
      return;
    }

    gsap.to(collapsedMenuRef.current, {
      height: 0,
      opacity: 0,
      y: -6,
      scale: 0.96,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => setRenderedCollapsedGroup(null)
    });
  }, [openCollapsedGroup]);

  useEffect(() => {
    if (!renderedCollapsedGroup || !collapsedMenuRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      collapsedMenuRef.current,
      { height: 0, opacity: 0, y: -6, scale: 0.96 },
      { height: "auto", opacity: 1, y: 0, scale: 1, duration: 0.24, ease: "power3.out" }
    );
  }, [renderedCollapsedGroup]);

  function toggleGroup(groupId: string) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  function getCollapsedItems(items: SidebarItemConfig[]) {
    return items.flatMap((item) => (item.children?.length ? [item, ...item.children] : [item]));
  }

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 p-4 transition-all duration-300 ease-out md:block",
          collapsed ? "w-[104px]" : "w-[304px]"
        )}
      >
        <div className="sticky top-4 flex h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[32px] border border-[#D8EAF1] bg-[#F7FBFD]/95 shadow-[0_18px_48px_rgba(38,53,50,0.07)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#18211F]/95 dark:shadow-clinical">
          <div className={cn("flex items-center gap-3 px-5 py-5", collapsed && "justify-center px-3")}> 
            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#DCECF2] bg-white shadow-[0_12px_30px_rgba(58,157,202,0.12)] dark:border-white/10 dark:shadow-glow">
              <Image src={logo} alt="Ê-Bot Clinical" className="size-8 object-contain" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-white bg-clinical-green dark:border-[#18211F]" />
            </div>
            {!collapsed ? (
              <div className="overflow-hidden">
                <p className="text-base font-extrabold tracking-tight text-clinical-dark">Ê-Bot</p>
                <p className="text-[13px] font-semibold text-clinical-muted">Clinical Command</p>
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setCollapsed((current) => !current)}
            className={cn(
              "mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-[#D8EAF1] bg-white/72 px-3 py-2.5 text-[13px] font-bold text-clinical-muted shadow-[0_8px_22px_rgba(38,53,50,0.035)] transition hover:border-clinical-blue/20 hover:bg-[#EEF8FC] hover:text-clinical-blueText focus:outline-none focus:ring-2 focus:ring-clinical-blue/25 dark:border-white/[0.08] dark:bg-white/[0.05] dark:hover:bg-white/[0.08]",
              collapsed && "mx-3 justify-center px-2"
            )}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <PanelRight className="size-4" /> : <PanelLeft className="size-4" />}
            {!collapsed ? <span>Recolher menu</span> : null}
          </button>

          <div ref={navRef} className={cn("clinical-scrollbar flex-1 overflow-y-auto pb-4", collapsed ? "px-2" : "px-3")}>
            {collapsed ? (
              <div className="space-y-2 py-1">
                {sidebarNavigation.map((group) => {
                  const Icon = group.icon;
                  const active = group.items.some((item) => item.id === activeItem || item.children?.some((child) => child.id === activeItem));
                  return (
                    <Tooltip key={group.id} content={group.label} side="right">
                      <button
                        data-sidebar-group
                        onClick={() => {
                          setOpenCollapsedGroup((current) => (current === group.id ? null : group.id));
                        }}
                        className={cn(
                          "flex h-12 w-full items-center justify-center rounded-[16px] border p-2.5 transition focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
                          active
                            ? "border-clinical-blue/20 bg-[#EAF6FB] text-clinical-blueText dark:bg-clinical-blue/[0.14] dark:text-clinical-blue"
                            : "border-[#E2EEF3] bg-white/70 text-clinical-muted hover:bg-[#EEF8FC] hover:text-clinical-blueText dark:border-transparent dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:hover:text-clinical-blue"
                        )}
                      >
                        <Icon className="size-6 shrink-0 stroke-[2.15]" />
                      </button>
                      {renderedCollapsedGroup === group.id ? (
                        <div ref={collapsedMenuRef} className="mt-1.5 h-0 overflow-hidden rounded-[18px] border border-[#D8EAF1] bg-white/70 p-1 opacity-0 shadow-[0_10px_26px_rgba(38,53,50,0.06)] dark:border-white/[0.08] dark:bg-white/[0.05]">
                          <div className="space-y-1.5">
                          {getCollapsedItems(group.items).map((item) => {
                            const ItemIcon = item.icon;
                            const active = activeItem === item.id;
                            return (
                              <Tooltip key={item.id} content={item.label} side="right">
                                <button
                                  data-sidebar-item
                                  onClick={() => onChange(item.id)}
                                  className={cn(
                                    "flex h-11 w-full items-center justify-center rounded-[16px] border p-2 transition focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
                                    active
                                      ? "border-clinical-blue/20 bg-[#EAF6FB] text-clinical-blueText dark:bg-clinical-blue/[0.14] dark:text-clinical-blue"
                                      : "border-transparent text-clinical-muted hover:bg-[#F1F8FB] hover:text-clinical-blueText dark:hover:bg-white/[0.08] dark:hover:text-clinical-blue"
                                  )}
                                >
                                  <ItemIcon className="size-5 shrink-0 stroke-[2.1]" />
                                </button>
                              </Tooltip>
                            );
                          })}
                          </div>
                        </div>
                      ) : null}
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 py-1">
                {sidebarNavigation.map((group) => (
                  <SidebarGroup
                    key={group.id}
                    group={group}
                    open={openGroups.has(group.id)}
                    activeItem={activeItem}
                    onToggle={toggleGroup}
                    onSelect={onChange}
                  />
                ))}
              </div>
            )}
          </div>

          {!collapsed ? (
            <div className="m-3 rounded-[24px] border border-[#D8EAF1] bg-white/72 p-4 shadow-[0_10px_28px_rgba(38,53,50,0.04)] dark:border-white/[0.08] dark:bg-white/[0.05]">
              <div className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-clinical-dark">
                <UsersRound className="size-4 text-clinical-green" />
                Clínica São Lucas
              </div>
              <p className="text-[13px] leading-5 text-clinical-muted">IA operando 24/7 com handoff humano e regras clínicas monitoradas.</p>
            </div>
          ) : (
            <div className="m-3 rounded-2xl border border-[#D8EAF1] bg-white/72 p-3 dark:border-white/[0.08] dark:bg-white/[0.05]">
              <UsersRound className="mx-auto size-5 text-clinical-green" />
            </div>
          )}
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-2 rounded-[24px] border border-clinical-border/[0.12] bg-clinical-surface/90 p-2 shadow-clinical backdrop-blur-xl md:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[12px] font-bold transition focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
                active ? "bg-clinical-blue text-white" : "text-clinical-muted hover:bg-clinical-blue/[0.10] hover:text-clinical-blue"
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
