"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarRange, Check, ChevronDown, Clock3, PanelLeft, PanelRight, UsersRound, X } from "lucide-react";
import gsap from "gsap";
import { findSidebarGroupByItem, sidebarNavigation, type MenuItemId, type SidebarItemConfig } from "@/data/sidebarNavigation";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/ui/Tooltip";
import logo from "@/assets/icon.png";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarItem } from "./SidebarItem";

type SidebarProps = {
  activeItem: MenuItemId;
  onChange: (item: MenuItemId) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  clinic: string;
  clinics: string[];
  onClinicChange: (clinic: string) => void;
};

function getDefaultOpenGroups(activeItem: string) {
  const activeGroup = findSidebarGroupByItem(activeItem);
  return new Set(
    sidebarNavigation
      .filter((group) => group.defaultOpen || group.id === activeGroup?.id)
      .map((group) => group.id)
  );
}

export function Sidebar({ activeItem, onChange, mobileOpen = false, onMobileClose, clinic, clinics, onClinicChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => getDefaultOpenGroups(activeItem));
  const [openCollapsedGroup, setOpenCollapsedGroup] = useState<string | null>(null);
  const [renderedCollapsedGroup, setRenderedCollapsedGroup] = useState<string | null>(null);
  const [renderedMobileOpen, setRenderedMobileOpen] = useState(mobileOpen);
  const [mobilePanelVisible, setMobilePanelVisible] = useState(false);
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const [clinicNotice, setClinicNotice] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const collapsedMenuRef = useRef<HTMLDivElement>(null);

  const operationalGroup = sidebarNavigation[0];
  const adminGroups = sidebarNavigation.slice(1);

  useEffect(() => {
    if (mobileOpen) {
      setRenderedMobileOpen(true);
      const timeout = window.setTimeout(() => setMobilePanelVisible(true), 24);
      return () => window.clearTimeout(timeout);
    }

    setMobilePanelVisible(false);
  }, [mobileOpen]);

  useEffect(() => {
    if (!clinicNotice) return;
    const timeout = window.setTimeout(() => setClinicNotice(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [clinicNotice]);

  useEffect(() => {
    function updateTime() {
      setCurrentTime(new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    }

    updateTime();
    const interval = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(interval);
  }, []);

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

  function handleSelect(itemId: string) {
    onChange(itemId);
    onMobileClose?.();
  }

  function handleClinicChange(item: string) {
    onClinicChange(item);
    setClinicMenuOpen(false);
    setClinicNotice(true);
  }

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 p-4 transition-all duration-300 ease-out xl:block",
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
                {operationalGroup.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeItem === item.id;
                  return (
                    <Tooltip key={item.id} content={item.label} side="right">
                      <button
                        data-sidebar-item
                        onClick={() => handleSelect(item.id)}
                        className={cn(
                          "flex h-12 w-full items-center justify-center rounded-[16px] border p-2.5 transition focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
                          active
                            ? "border-clinical-blue/20 bg-[#EAF6FB] text-clinical-blueText dark:bg-clinical-blue/[0.14] dark:text-clinical-blue"
                            : "border-[#E2EEF3] bg-white/70 text-clinical-muted hover:bg-[#EEF8FC] hover:text-clinical-blueText dark:border-transparent dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:hover:text-clinical-blue"
                        )}
                      >
                        <Icon className="size-5 shrink-0 stroke-[2.1]" />
                      </button>
                    </Tooltip>
                  );
                })}
                <div className="mx-auto h-px w-8 bg-clinical-blue/10" />
                {adminGroups.map((group) => {
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
                                  onClick={() => handleSelect(item.id)}
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
                <section data-sidebar-group className="rounded-[20px]">
                  <div className="mb-1.5 px-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-clinical-muted/80">
                    Acesso rápido
                  </div>
                  <div className="space-y-1 rounded-[18px] border border-[#E0EDF2] bg-white/58 p-1.5 dark:border-white/[0.06] dark:bg-white/[0.035]">
                    {operationalGroup.items.map((item) => (
                      <SidebarItem key={item.id} item={item} activeItem={activeItem} onSelect={handleSelect} />
                    ))}
                  </div>
                </section>
                {adminGroups.map((group) => (
                  <SidebarGroup
                    key={group.id}
                    group={group}
                    open={openGroups.has(group.id)}
                    activeItem={activeItem}
                    onToggle={toggleGroup}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {!collapsed ? (
            <div className="m-3 rounded-[24px] border border-[#D8EAF1] bg-white/72 p-4 shadow-[0_10px_28px_rgba(38,53,50,0.04)] dark:border-white/[0.08] dark:bg-white/[0.05]">
              <div className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-clinical-dark">
                <UsersRound className="size-4 text-clinical-green" />
                {clinic}
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

      {renderedMobileOpen ? (
        <div
          className={cn(
            "fixed inset-0 z-[70] bg-clinical-charcoal/32 backdrop-blur-sm transition duration-300 ease-out xl:hidden",
            mobilePanelVisible ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={onMobileClose}
          onTransitionEnd={(event) => {
            if (event.currentTarget !== event.target) return;
            if (!mobilePanelVisible) setRenderedMobileOpen(false);
          }}
        >
          <aside
            className={cn(
              "h-full w-[min(88vw,348px)] overflow-hidden rounded-r-[30px] border-r border-clinical-border/[0.14] bg-clinical-surface p-3 shadow-2xl transition duration-300 ease-out dark:border-white/[0.08]",
              mobilePanelVisible ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 px-2 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#DCECF2] bg-white dark:border-white/10 dark:bg-white/[0.05]">
                    <Image src={logo} alt="Ê-Bot Clinical" className="size-7 object-contain" />
                    <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-white bg-clinical-green dark:border-[#18211F]" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold tracking-tight text-clinical-dark">Ê-Bot</p>
                    <p className="text-[13px] font-semibold text-clinical-muted">Clinical Command</p>
                  </div>
                </div>
                <button
                  onClick={onMobileClose}
                  className="flex size-10 items-center justify-center rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/70 text-clinical-slate transition hover:bg-clinical-blue/[0.08] hover:text-clinical-blue focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
                  aria-label="Fechar menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="clinical-scrollbar flex-1 overflow-y-auto px-1 pb-4">
                <div className="space-y-2 py-1">
                  <section className="rounded-[20px] border border-clinical-border/[0.10] bg-clinical-surface/72 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-[13px] font-bold text-clinical-muted">
                        <CalendarRange className="size-3.5 text-clinical-blue" /> Hoje, 14 Jul
                      </p>
                      <p className="flex items-center gap-1.5 text-[13px] font-extrabold tabular-nums text-clinical-dark">
                        <Clock3 className="size-3.5 text-clinical-blue" /> {currentTime || "--:--"}
                      </p>
                    </div>
                  </section>

                  <section className="relative rounded-[24px] border border-clinical-blue/[0.14] bg-[linear-gradient(145deg,rgb(var(--clinical-surface)/0.96),rgb(var(--clinical-blue-soft)/0.56))] p-3 shadow-[0_12px_34px_rgba(58,157,202,0.08)]">
                    <button
                      onClick={() => setClinicMenuOpen((current) => !current)}
                      className="flex w-full items-center justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
                      aria-expanded={clinicMenuOpen}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-clinical-surface text-clinical-green shadow-[inset_0_0_0_1px_rgba(58,157,202,0.10)]">
                          <UsersRound className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[12px] font-extrabold uppercase tracking-[0.10em] text-clinical-muted">Central operacional</span>
                          <span className="block truncate text-sm font-extrabold text-clinical-dark">{clinic}</span>
                        </span>
                      </span>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-clinical-surface/80 text-clinical-blueText">
                        <ChevronDown className={cn("size-4 transition duration-200", clinicMenuOpen && "rotate-180")} />
                      </span>
                    </button>

                    <div className={cn("grid transition-all duration-200 ease-out", clinicMenuOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                      <div className="overflow-hidden">
                        <div className="space-y-1 rounded-[20px] border border-clinical-border/[0.10] bg-clinical-surface/78 p-1.5">
                          {clinics.map((item) => (
                            <button
                              key={item}
                              onClick={() => handleClinicChange(item)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition",
                                clinic === item
                                  ? "bg-clinical-blue/[0.10] text-clinical-blueText"
                                  : "text-clinical-slate hover:bg-clinical-blue/[0.07] hover:text-clinical-dark"
                              )}
                            >
                              <span className="min-w-0 truncate">{item}</span>
                              {clinic === item ? <Check className="size-4 shrink-0 text-clinical-blue" /> : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={cn("mt-3 rounded-2xl border border-clinical-green/15 bg-clinical-green/[0.10] px-3 py-2 text-[13px] font-bold text-clinical-green transition duration-200", clinicNotice ? "opacity-100" : "pointer-events-none hidden opacity-0")}>
                      Unidade alterada. Dados atualizados para {clinic}.
                    </div>
                  </section>

                  <section className="rounded-[20px]">
                    <div className="mb-1.5 px-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-clinical-muted/80">
                      Acesso rápido
                    </div>
                    <div className="space-y-1 rounded-[18px] border border-[#E0EDF2] bg-clinical-surfaceMuted/50 p-1.5 dark:border-white/[0.06] dark:bg-white/[0.035]">
                      {operationalGroup.items.map((item) => (
                        <SidebarItem key={item.id} item={item} activeItem={activeItem} onSelect={handleSelect} />
                      ))}
                    </div>
                  </section>
                  {adminGroups.map((group) => (
                    <SidebarGroup
                      key={group.id}
                      group={group}
                      open={openGroups.has(group.id)}
                      activeItem={activeItem}
                      onToggle={toggleGroup}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
