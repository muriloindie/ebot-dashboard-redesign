"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarRange,
  Check,
  FileText,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  User,
  UsersRound
} from "lucide-react";
import gsap from "gsap";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useDemo } from "@/components/state/DemoProvider";
import { Popover } from "@/components/ui/Popover";
import { readLocalCache } from "@/lib/localCache";
import { initialTasks, type Task } from "@/data/workManagementMock";
import type { MenuItemId } from "@/data/sidebarNavigation";
import { AIStatusMenu } from "./AIStatusMenu";
import { ConnectedChannels } from "./ConnectedChannels";

const recentSearches = ["Ana Paula", "Orçamento #4821", "Marina Costa"];

const priorityDot: Record<Task["priority"], string> = {
  Alta: "#C13E3E",
  Média: "#C97F12",
  Baixa: "#8FA9B4"
};

type TopbarProps = {
  onNavigate?: (itemId: MenuItemId) => void;
  onMenuClick?: () => void;
  company: string;
  companies: string[];
  onCompanyChange: (company: string) => void;
};

export function Topbar({ onNavigate, onMenuClick, company, companies, onCompanyChange }: TopbarProps) {
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead, profile, toast } = useDemo();
  const router = useRouter();
  const [todayLabel, setTodayLabel] = useState("Hoje");
  const [todayTasks] = useState<Task[]>(() =>
    readLocalCache<Task[]>("ebot-week2-kanban-tasks", initialTasks).filter(
      (task) => task.due === "Hoje" || task.due.startsWith("Hoje,")
    )
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchPanelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userPanelRef = useRef<HTMLDivElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);
  const dateMenuRef = useRef<HTMLDivElement>(null);
  const datePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTodayLabel(new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date()).replace(".", ""));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(target)) {
        setNotifMenuOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
        setMobileSearchOpen(false);
      }
      if (dateMenuRef.current && !dateMenuRef.current.contains(target)) {
        setDateMenuOpen(false);
      }
    }

    function handleScroll() {
      setUserMenuOpen(false);
      setNotifMenuOpen(false);
      setMobileSearchOpen(false);
      setDateMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchPanelRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        mobileSearchPanelRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (userMenuOpen && userPanelRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        userPanelRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  }, [userMenuOpen]);

  useEffect(() => {
    if (notifMenuOpen && notifPanelRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        notifPanelRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  }, [notifMenuOpen]);

  useEffect(() => {
    if (dateMenuOpen && datePanelRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        datePanelRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  }, [dateMenuOpen]);

  const userMenuItems = [
    { label: "Meu perfil", icon: User, action: () => onNavigate?.("perfil") },
    { label: "Configurações", icon: Settings, action: () => onNavigate?.("configuracoes") },
    { label: "Trocar empresa", icon: UsersRound, action: () => toast("Use o seletor de empresa no cabeçalho.", "info") },
    { label: "Documentação", icon: FileText, action: () => onNavigate?.("ajuda") }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ebot-border/[0.12] bg-ebot-surface/76 backdrop-blur-2xl">
      <div className="flex min-h-[64px] items-center justify-between gap-2 px-3 py-2.5 sm:px-4 lg:px-5 xl:min-h-[72px] xl:px-6 xl:py-3">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/80 text-ebot-slate transition hover:border-ebot-primary/25 hover:bg-ebot-primary/[0.08] hover:text-ebot-primary focus:outline-none focus:ring-2 focus:ring-ebot-primary/25 xl:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-ebot-primaryText">Central Operacional</p>
            <Popover
              trigger={
                <button type="button" className="group flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-ebot-dark transition hover:text-ebot-primary">
                  {company}
                  <span className="text-[13px] opacity-60 transition group-hover:translate-y-0.5">▾</span>
                </button>
              }
              align="left"
              width="w-72"
            >
              <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-ebot-muted">Empresas</p>
              <div className="space-y-1">
                {companies.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => onCompanyChange(item)}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-bold transition hover:bg-ebot-primary/10"
                  >
                    {item}
                    {company === item ? <Check className="size-4 text-ebot-primary" /> : null}
                  </button>
                ))}
              </div>
            </Popover>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 md:block">
          <Popover
            wrapperClassName="block w-full"
            matchTriggerWidth
            trigger={
              <div
                onClick={() => searchInputRef.current?.focus()}
                    className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/75 px-4 text-sm text-ebot-muted shadow-[0_12px_36px_rgb(var(--ebot-primary)/0.06)] transition focus-within:border-ebot-primary/35 focus-within:bg-ebot-surface"
              >
                <Search className="size-4 shrink-0 text-ebot-primary" />
                <input
                  ref={searchInputRef}
                  className="w-full cursor-pointer bg-transparent font-medium outline-none placeholder:text-ebot-muted/60"
                  placeholder="Buscar cliente, atendimento ou protocolo"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            }
            align="left"
          >
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-ebot-muted">Buscas recentes</p>
                <div className="space-y-1">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearch(item);
                        searchInputRef.current?.focus();
                      }}
                      className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-ebot-slate transition hover:bg-ebot-primary/10"
                    >
                      <Search className="size-3.5 text-ebot-primary" /> {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-ebot-muted">Sugestões rápidas</p>
                <div className="flex flex-wrap gap-2">
                  {["Contatos", "Protocolos", "Agenda", "Campanhas"].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSearch(item)}
                      className="cursor-pointer rounded-full border border-ebot-primary/15 bg-ebot-primary/[0.08] px-3 py-1.5 text-[13px] font-bold text-ebot-primary transition hover:bg-ebot-primary/15"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Popover>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <div ref={mobileSearchRef} className="relative md:hidden">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((current) => !current)}
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/75 text-ebot-slate transition hover:border-ebot-primary/25 hover:bg-ebot-primary/[0.08] hover:text-ebot-primary focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
              aria-label="Buscar"
            >
              <Search className="size-4" />
            </button>

            {mobileSearchOpen ? (
              <div ref={mobileSearchPanelRef} className="fixed left-3 right-3 top-[76px] z-50 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/[0.96] p-3 shadow-[0_24px_70px_rgba(4,27,21,0.16)] backdrop-blur-xl">
                <div className="flex h-11 items-center gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/60 px-3 text-sm text-ebot-muted">
                  <Search className="size-4 shrink-0 text-ebot-primary" />
                  <input
                    className="w-full bg-transparent font-medium outline-none placeholder:text-ebot-muted/60"
                    placeholder="Buscar cliente ou protocolo"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    autoFocus
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        setSearch(item);
                        setMobileSearchOpen(false);
                      }}
                      className="rounded-full border border-ebot-primary/12 bg-ebot-primary/[0.08] px-3 py-1.5 text-[13px] font-bold text-ebot-primaryText"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div ref={dateMenuRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setDateMenuOpen((current) => !current)}
              aria-expanded={dateMenuOpen}
              aria-label="Ver tarefas de hoje"
              className="flex h-11 items-center gap-2 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/75 px-3 text-[13px] font-bold text-ebot-slate transition hover:border-ebot-primary/25 hover:text-ebot-primary focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
            >
              <CalendarRange className="size-4" />
              {todayLabel === "Hoje" ? "Hoje" : `Hoje, ${todayLabel}`}
            </button>

            {dateMenuOpen ? (
              <div
                ref={datePanelRef}
                className="fixed left-3 right-3 top-[76px] z-50 max-h-[calc(100vh-96px)] overflow-y-auto rounded-[26px] border border-ebot-border/[0.14] bg-ebot-surface/[0.96] p-4 shadow-[0_24px_70px_rgba(4,27,21,0.16)] backdrop-blur-2xl dark:border-white/[0.08] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[360px] sm:max-w-[calc(100vw-24px)] sm:origin-top-right sm:overflow-visible"
              >
                <span className="absolute -top-2 right-8 hidden size-4 rotate-45 rounded-sm border-l border-t border-ebot-border/[0.14] bg-ebot-surface/[0.96] dark:border-white/[0.08] sm:block" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ebot-muted">Tarefas de hoje</p>
                    <span className="rounded-full bg-ebot-primary/[0.10] px-2.5 py-1 text-[11px] font-extrabold tabular-nums text-ebot-primaryText">{todayTasks.length}</span>
                  </div>
                  {todayTasks.length === 0 ? (
                    <p className="rounded-2xl bg-ebot-surfaceMuted/50 px-3 py-4 text-center text-[13px] font-semibold text-ebot-muted">Nenhuma tarefa para hoje.</p>
                  ) : (
                    <ul className="space-y-1">
                      {todayTasks.slice(0, 5).map((task) => (
                        <li key={task.id}>
                          <button
                            type="button"
                            onClick={() => { setDateMenuOpen(false); onNavigate?.("tarefas"); }}
                            className="flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-left transition hover:bg-ebot-primary/[0.07]"
                          >
                            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: priorityDot[task.priority] }} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-extrabold text-ebot-dark">{task.title}</span>
                              <span className="block truncate text-[11px] font-semibold text-ebot-muted">{task.responsible} · {task.status}</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => { setDateMenuOpen(false); onNavigate?.("agenda"); }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-ebot-primary/20 bg-ebot-primary/[0.08] px-3 py-2.5 text-[13px] font-extrabold text-ebot-primaryText transition hover:bg-ebot-primary/[0.14]"
                  >
                    <CalendarRange className="size-4" />Ver agenda completa
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="hidden h-8 w-px bg-ebot-primary/10 sm:block" />

          <ConnectedChannels onNavigate={onNavigate} />
          <AIStatusMenu onNavigate={onNavigate} />

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/75 text-ebot-slate transition duration-300 hover:-translate-y-0.5 hover:border-ebot-primary/25 hover:text-ebot-primary hover:shadow-card focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <div className="hidden h-8 w-px bg-ebot-primary/10 sm:block" />

          {/* Notification dropdown */}
          <div ref={notifMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setNotifMenuOpen((current) => !current)}
              aria-label="Abrir notificações"
              aria-expanded={notifMenuOpen}
              aria-haspopup="dialog"
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/70 text-ebot-slate transition duration-300 hover:-translate-y-0.5 hover:border-ebot-primary/25 hover:text-ebot-primary hover:shadow-card focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
            >
              <Bell className="size-4" />
              {unreadNotifications > 0 ? <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-ebot-orange px-1 text-[10px] font-black text-white">{unreadNotifications}</span> : null}
            </button>

            {notifMenuOpen ? (
              <div
                ref={notifPanelRef}
                className="fixed left-3 right-3 top-[76px] z-50 rounded-[26px] border border-ebot-border/[0.14] bg-ebot-surface/[0.96] p-4 shadow-[0_24px_70px_rgba(4,27,21,0.16)] backdrop-blur-xl dark:border-white/[0.08] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[340px] sm:origin-top-right"
              >
                <span className="absolute -top-2 right-6 hidden size-4 rotate-45 rounded-sm border-l border-t border-ebot-border/[0.14] bg-ebot-surface/[0.96] dark:border-white/[0.08] sm:block" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-ebot-dark">Notificações</p>
                    <button type="button" className="text-[13px] font-bold text-ebot-primary hover:underline" onClick={() => { markAllNotificationsRead(); toast("Notificações marcadas como lidas."); }}>Marcar todas</button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => markNotificationRead(notification.id)}
                        className={`w-full rounded-2xl border p-3 text-left transition hover:bg-ebot-surface ${notification.read ? "border-ebot-border/[0.10] bg-ebot-surfaceMuted/35" : "border-ebot-primary/20 bg-ebot-primary/[0.06]"}`}
                      >
                        <p className="text-sm font-bold text-ebot-dark">{notification.title}</p>
                        <p className="mt-1 text-[13px] font-medium text-ebot-muted">{notification.description}</p>
                        <p className="mt-2 text-[13px] font-bold text-ebot-primaryText">{notification.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* User dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((current) => !current)}
              aria-label="Abrir menu da conta"
              aria-expanded={userMenuOpen}
              aria-haspopup="menu"
              className="flex h-11 shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/75 px-2.5 pr-3 transition hover:border-ebot-primary/25 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
            >
                 <div className="flex size-8 items-center justify-center rounded-xl bg-ebot-charcoal text-[13px] font-extrabold text-white">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
              <div className="hidden leading-tight 2xl:block">
                 <p className="text-[13px] font-extrabold text-ebot-dark">{profile.name}</p>
                <p className="flex items-center gap-1 text-[13px] font-bold text-ebot-green">
                  <ShieldCheck className="size-3" /> Operação segura
                </p>
              </div>
            </button>

            {userMenuOpen ? (
              <div
                ref={userPanelRef}
                className="fixed left-3 right-3 top-[76px] z-50 rounded-[26px] border border-ebot-border/[0.14] bg-ebot-surface/[0.96] p-4 shadow-[0_24px_70px_rgba(4,27,21,0.16)] backdrop-blur-xl dark:border-white/[0.08] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[320px] sm:origin-top-right"
              >
                <span className="absolute -top-2 right-8 hidden size-4 rotate-45 rounded-sm border-l border-t border-ebot-border/[0.14] bg-ebot-surface/[0.96] dark:border-white/[0.08] sm:block" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 pb-4">
                     <div className="flex size-12 items-center justify-center rounded-2xl bg-ebot-charcoal text-sm font-extrabold text-white">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
                    <div>
                       <p className="text-base font-extrabold text-ebot-dark">{profile.name}</p>
                       <p className="text-[13px] font-semibold text-ebot-muted">{profile.role}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => { item.action(); setUserMenuOpen(false); }}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-ebot-slate transition hover:bg-ebot-primary/10 hover:text-ebot-primary"
                        >
                          <Icon className="size-4" /> {item.label}
                        </button>
                      );
                    })}
                  </div>
                   <button type="button" onClick={() => router.push("/login")} className="mt-3 flex w-full items-center gap-3 rounded-2xl border-t border-ebot-primary/10 px-3 pt-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10">
                    <LogOut className="size-4" /> Sair
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
