"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarRange, Check, ChevronDown, Clock3, PanelLeft, PanelRight, UsersRound, X } from "lucide-react";
import gsap from "gsap";
import { findSidebarGroupByItem, sidebarNavigation, type MenuItemId, type SidebarItemConfig } from "@/data/sidebarNavigation";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/ui/Tooltip";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAppearance } from "@/components/theme/AppearanceProvider";
import { animationsEnabled } from "@/lib/usePageEnter";
import iconBlack from "@/assets/icon_black.webp";
import iconWhite from "@/assets/icon_white.webp";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarItem } from "./SidebarItem";

type SidebarProps = {
  activeItem: MenuItemId;
  onChange: (item: MenuItemId) => void;
  onPrefetch?: (item: MenuItemId) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  company: string;
  companies: string[];
  onCompanyChange: (company: string) => void;
};

function getDefaultOpenGroups(activeItem: string) {
  const activeGroup = findSidebarGroupByItem(activeItem);
  return new Set(
    sidebarNavigation
      .filter((group) => group.defaultOpen || group.id === activeGroup?.id)
      .map((group) => group.id)
  );
}

export function Sidebar({ activeItem, onChange, onPrefetch, mobileOpen = false, onMobileClose, company, companies, onCompanyChange }: SidebarProps) {
  const { theme } = useTheme();
  const { appearance } = useAppearance();
  const logoSrc = theme === "dark" ? iconWhite : iconBlack;
  const darkShell = appearance.sidebarStyle === "escuro" && "ebot-sidebar-dark";
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => getDefaultOpenGroups(activeItem));
  const [openCollapsedGroup, setOpenCollapsedGroup] = useState<string | null>(null);
  const [renderedCollapsedGroup, setRenderedCollapsedGroup] = useState<string | null>(null);
  const [renderedMobileOpen, setRenderedMobileOpen] = useState(mobileOpen);
  const [mobilePanelVisible, setMobilePanelVisible] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [companyNotice, setCompanyNotice] = useState(false);
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
    if (!companyNotice) return;
    const timeout = window.setTimeout(() => setCompanyNotice(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [companyNotice]);

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
    if (!groups?.length || !animationsEnabled()) return;

    gsap.fromTo(
      groups,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.48, ease: "power3.out", stagger: 0.045, clearProps: "opacity,transform" }
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

    if (!animationsEnabled()) {
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
    if (!renderedCollapsedGroup || !collapsedMenuRef.current || !animationsEnabled()) return;

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

  function handleCompanyChange(item: string) {
    onCompanyChange(item);
    setCompanyMenuOpen(false);
    setCompanyNotice(true);
  }

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 p-4 transition-all duration-300 ease-out xl:block",
          collapsed ? "w-[104px]" : "w-[304px]"
        )}
      >
        <div className={cn("sticky top-4 flex h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[32px] border border-ebot-border/[0.12] bg-ebot-surface/85 shadow-ebot backdrop-blur-2xl dark:border-white/[0.08] dark:bg-ebot-surface/95 dark:shadow-ebot", darkShell)}>
          <div className={cn("flex items-center gap-3 px-5 py-5", collapsed && "justify-center px-3")}> 
            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ebot-border/[0.12] bg-white shadow-ebot dark:border-white/10 dark:shadow-glow">
              <Image src={logoSrc} alt="Ê-Bot" className="size-8 object-contain" />
            </div>
            {!collapsed ? (
              <div className="overflow-hidden">
                <p className="text-base font-extrabold tracking-tight text-ebot-dark">{appearance.logoText}</p>
                <p className="text-[13px] font-semibold text-ebot-muted">Painel operacional</p>
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setCollapsed((current) => !current)}
            className={cn(
              "mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/75 px-3 py-2.5 text-[13px] font-bold text-ebot-muted shadow-ebot transition hover:border-ebot-primary/20 hover:bg-ebot-primary/[0.08] hover:text-ebot-primaryText focus:outline-none focus:ring-2 focus:ring-ebot-primary/25 dark:border-white/[0.08] dark:bg-white/[0.05] dark:hover:bg-white/[0.08]",
              collapsed && "mx-3 justify-center px-2"
            )}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <PanelRight className="size-4" /> : <PanelLeft className="size-4" />}
            {!collapsed ? <span>Recolher menu</span> : null}
          </button>

          <div ref={navRef} className={cn("ebot-scrollbar flex-1 overflow-y-auto pb-4", collapsed ? "px-2" : "px-3")}>
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
                         onMouseEnter={() => onPrefetch?.(item.id)}
                         onFocus={() => onPrefetch?.(item.id)}
                         disabled={!item.enabled}
                         aria-disabled={!item.enabled || undefined}
                         title={!item.enabled ? "Disponível em breve" : item.label}
                        className={cn(
                          "flex h-12 w-full items-center justify-center rounded-[16px] border p-2.5 transition focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
                          active
                            ? "border-ebot-primary/20 bg-ebot-primary/[0.14] text-ebot-primaryText dark:bg-ebot-primary/[0.14] dark:text-ebot-primary"
                             : !item.enabled ? "border-transparent bg-white/45 text-ebot-muted/45" : "border-ebot-border/[0.12] bg-ebot-surface/70 text-ebot-muted hover:bg-ebot-primary/[0.08] hover:text-ebot-primaryText dark:border-transparent dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:hover:text-ebot-primary"
                        )}
                      >
                        <Icon className="size-5 shrink-0 stroke-[2.1]" />
                      </button>
                    </Tooltip>
                  );
                })}
                <div className="mx-auto h-px w-8 bg-ebot-primary/10" />
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
                          "flex h-12 w-full items-center justify-center rounded-[16px] border p-2.5 transition focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
                          active
                            ? "border-ebot-primary/20 bg-ebot-primary/[0.14] text-ebot-primaryText dark:bg-ebot-primary/[0.14] dark:text-ebot-primary"
                            : "border-ebot-border/[0.12] bg-ebot-surface/70 text-ebot-muted hover:bg-ebot-primary/[0.08] hover:text-ebot-primaryText dark:border-transparent dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:hover:text-ebot-primary"
                        )}
                      >
                        <Icon className="size-6 shrink-0 stroke-[2.15]" />
                      </button>
                      {renderedCollapsedGroup === group.id ? (
                        <div ref={collapsedMenuRef} className="mt-1.5 h-0 overflow-hidden rounded-[18px] border border-ebot-border/[0.12] bg-ebot-surface/70 p-1 opacity-0 shadow-ebot dark:border-white/[0.08] dark:bg-white/[0.05]">
                          <div className="space-y-1.5">
                          {getCollapsedItems(group.items).map((item) => {
                            const ItemIcon = item.icon;
                            const active = activeItem === item.id;
                            return (
                              <Tooltip key={item.id} content={item.label} side="right">
                                <button
                                  data-sidebar-item
                                   onClick={() => handleSelect(item.id)}
                                   onMouseEnter={() => onPrefetch?.(item.id)}
                                   onFocus={() => onPrefetch?.(item.id)}
                                   disabled={!item.enabled}
                                   aria-disabled={!item.enabled || undefined}
                                   title={!item.enabled ? "Disponível em breve" : item.label}
                                  className={cn(
                                    "flex h-11 w-full items-center justify-center rounded-[16px] border p-2 transition focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
                                    active
                                      ? "border-ebot-primary/20 bg-ebot-primary/[0.14] text-ebot-primaryText dark:bg-ebot-primary/[0.14] dark:text-ebot-primary"
                                       : !item.enabled ? "border-transparent text-ebot-muted/45" : "border-transparent text-ebot-muted hover:bg-ebot-primary/[0.08] hover:text-ebot-primaryText dark:hover:bg-white/[0.08] dark:hover:text-ebot-primary"
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
                  <div className="mb-1.5 px-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ebot-muted/80">
                    Acesso rápido
                  </div>
                  <div className="space-y-1 rounded-[18px] border border-ebot-border/[0.10] bg-ebot-surface/60 p-1.5 dark:border-white/[0.06] dark:bg-white/[0.035]">
                    {operationalGroup.items.map((item) => (
                      <SidebarItem key={item.id} item={item} activeItem={activeItem} onSelect={handleSelect} onPrefetch={onPrefetch} showBadge={appearance.showBadges} />
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
                    onPrefetch={onPrefetch}
                    showBadges={appearance.showBadges}
                  />
                ))}
              </div>
            )}
          </div>

          {!collapsed ? (
            <div className="m-3 rounded-[24px] border border-ebot-border/[0.12] bg-ebot-surface/75 p-4 shadow-ebot dark:border-white/[0.08] dark:bg-white/[0.05]">
              <div className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-ebot-dark">
                <UsersRound className="size-4 text-ebot-green" />
                {company}
              </div>
              <p className="text-[13px] leading-5 text-ebot-muted">IA operando 24/7 com handoff humano e réguas de atendimento monitoradas.</p>
            </div>
          ) : (
            <div className="m-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/75 p-3 dark:border-white/[0.08] dark:bg-white/[0.05]">
              <UsersRound className="mx-auto size-5 text-ebot-green" />
            </div>
          )}
        </div>
      </aside>

      {renderedMobileOpen ? (
        <div
          className={cn(
            "fixed inset-0 z-[70] bg-ebot-charcoal/32 backdrop-blur-sm transition duration-300 ease-out xl:hidden",
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
              "h-full w-[min(88vw,348px)] overflow-hidden rounded-r-[30px] border-r border-ebot-border/[0.14] bg-ebot-surface p-3 shadow-2xl transition duration-300 ease-out dark:border-white/[0.08]",
              mobilePanelVisible ? "translate-x-0" : "-translate-x-full",
              darkShell
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 px-2 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ebot-border/[0.12] bg-white dark:border-white/10 dark:bg-white/[0.05]">
                    <Image src={logoSrc} alt="Ê-Bot" className="size-7 object-contain" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold tracking-tight text-ebot-dark">{appearance.logoText}</p>
                    <p className="text-[13px] font-semibold text-ebot-muted">Painel operacional</p>
                  </div>
                </div>
                <button
                  onClick={onMobileClose}
                  className="flex size-10 items-center justify-center rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/70 text-ebot-slate transition hover:bg-ebot-primary/[0.08] hover:text-ebot-primary focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
                  aria-label="Fechar menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="ebot-scrollbar flex-1 overflow-y-auto px-1 pb-4">
                <div className="space-y-2 py-1">
                  <section className="rounded-[20px] border border-ebot-border/[0.10] bg-ebot-surface/72 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-[13px] font-bold text-ebot-muted">
                        <CalendarRange className="size-3.5 text-ebot-primary" /> Hoje, 14 Jul
                      </p>
                      <p className="flex items-center gap-1.5 text-[13px] font-extrabold tabular-nums text-ebot-dark">
                        <Clock3 className="size-3.5 text-ebot-primary" /> {currentTime || "--:--"}
                      </p>
                    </div>
                  </section>

                  <section className="relative rounded-[24px] border border-ebot-primary/[0.14] bg-[linear-gradient(145deg,rgb(var(--ebot-surface)/0.96),rgb(var(--ebot-primary-soft)/0.56))] p-3 shadow-ebot">
                    <button
                      onClick={() => setCompanyMenuOpen((current) => !current)}
                      className="flex w-full items-center justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
                      aria-expanded={companyMenuOpen}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-surface text-ebot-green shadow-[inset_0_0_0_1px_rgba(93,115,126,0.14)]">
                          <UsersRound className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[12px] font-extrabold uppercase tracking-[0.10em] text-ebot-muted">Central operacional</span>
                          <span className="block truncate text-sm font-extrabold text-ebot-dark">{company}</span>
                        </span>
                      </span>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-ebot-surface/80 text-ebot-primaryText">
                        <ChevronDown className={cn("size-4 transition duration-200", companyMenuOpen && "rotate-180")} />
                      </span>
                    </button>

                    <div className={cn("grid transition-all duration-200 ease-out", companyMenuOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                      <div className="overflow-hidden">
                        <div className="space-y-1 rounded-[20px] border border-ebot-border/[0.10] bg-ebot-surface/78 p-1.5">
                          {companies.map((item) => (
                            <button
                              key={item}
                              onClick={() => handleCompanyChange(item)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition",
                                company === item
                                  ? "bg-ebot-primary/[0.10] text-ebot-primaryText"
                                  : "text-ebot-slate hover:bg-ebot-primary/[0.07] hover:text-ebot-dark"
                              )}
                            >
                              <span className="min-w-0 truncate">{item}</span>
                              {company === item ? <Check className="size-4 shrink-0 text-ebot-primary" /> : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={cn("mt-3 rounded-2xl border border-ebot-green/15 bg-ebot-green/[0.10] px-3 py-2 text-[13px] font-bold text-ebot-green transition duration-200", companyNotice ? "opacity-100" : "pointer-events-none hidden opacity-0")}>
                      Empresa alterada. Dados atualizados para {company}.
                    </div>
                  </section>

                  <section className="rounded-[20px]">
                    <div className="mb-1.5 px-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ebot-muted/80">
                      Acesso rápido
                    </div>
                    <div className="space-y-1 rounded-[18px] border border-ebot-border/[0.10] bg-ebot-surfaceMuted/50 p-1.5 dark:border-white/[0.06] dark:bg-white/[0.035]">
                      {operationalGroup.items.map((item) => (
                        <SidebarItem key={item.id} item={item} activeItem={activeItem} onSelect={handleSelect} onPrefetch={onPrefetch} showBadge={appearance.showBadges} />
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
                      onPrefetch={onPrefetch}
                      showBadges={appearance.showBadges}
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
