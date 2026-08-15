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
import type { MenuItemId } from "@/data/sidebarNavigation";
import { AIStatusMenu } from "./AIStatusMenu";
import { ConnectedChannels } from "./ConnectedChannels";

const recentSearches = ["Ana Paula", "Protocolo de preparo", "Dr. Ricardo Lima"];

type TopbarProps = {
  onNavigate?: (itemId: MenuItemId) => void;
  onMenuClick?: () => void;
  clinic: string;
  clinics: string[];
  onClinicChange: (clinic: string) => void;
};

export function Topbar({ onNavigate, onMenuClick, clinic, clinics, onClinicChange }: TopbarProps) {
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead, profile, toast } = useDemo();
  const router = useRouter();
  const [todayLabel, setTodayLabel] = useState("Hoje");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchPanelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userPanelRef = useRef<HTMLDivElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);

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
    }

    function handleScroll() {
      setUserMenuOpen(false);
      setNotifMenuOpen(false);
      setMobileSearchOpen(false);
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

  const userMenuItems = [
    { label: "Meu perfil", icon: User, action: () => onNavigate?.("perfil") },
    { label: "Configurações", icon: Settings, action: () => onNavigate?.("configuracoes") },
    { label: "Trocar unidade", icon: UsersRound, action: () => toast("Use o seletor de unidade no cabeçalho.", "info") },
    { label: "Documentação", icon: FileText, action: () => onNavigate?.("ajuda") }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-clinical-border/[0.12] bg-clinical-surface/76 backdrop-blur-2xl">
      <div className="flex min-h-[64px] items-center justify-between gap-2 px-3 py-2.5 sm:px-4 lg:px-5 xl:min-h-[72px] xl:px-6 xl:py-3">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/80 text-clinical-slate transition hover:border-clinical-blue/25 hover:bg-clinical-blue/[0.08] hover:text-clinical-blue focus:outline-none focus:ring-2 focus:ring-clinical-blue/25 xl:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-clinical-blueText">Central Operacional</p>
            <Popover
              trigger={
                <button type="button" className="group flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-clinical-dark transition hover:text-clinical-blue">
                  {clinic}
                  <span className="text-[13px] opacity-60 transition group-hover:translate-y-0.5">▾</span>
                </button>
              }
              align="left"
              width="w-72"
            >
              <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-clinical-muted">Unidades</p>
              <div className="space-y-1">
                {clinics.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => onClinicChange(item)}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-bold transition hover:bg-clinical-blue/10"
                  >
                    {item}
                    {clinic === item ? <Check className="size-4 text-clinical-blue" /> : null}
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
                    className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/75 px-4 text-sm text-clinical-muted shadow-[0_12px_36px_rgb(var(--clinical-blue)/0.06)] transition focus-within:border-clinical-blue/35 focus-within:bg-clinical-surface"
              >
                <Search className="size-4 shrink-0 text-clinical-blue" />
                <input
                  ref={searchInputRef}
                  className="w-full cursor-pointer bg-transparent font-medium outline-none placeholder:text-clinical-muted/60"
                  placeholder="Buscar paciente, atendimento ou protocolo"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            }
            align="left"
          >
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-clinical-muted">Buscas recentes</p>
                <div className="space-y-1">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearch(item);
                        searchInputRef.current?.focus();
                      }}
                      className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-clinical-slate transition hover:bg-clinical-blue/10"
                    >
                      <Search className="size-3.5 text-clinical-blue" /> {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-clinical-muted">Sugestões rápidas</p>
                <div className="flex flex-wrap gap-2">
                  {["Pacientes", "Protocolos", "Agenda", "Campanhas"].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSearch(item)}
                      className="cursor-pointer rounded-full border border-clinical-blue/15 bg-clinical-blue/[0.08] px-3 py-1.5 text-[13px] font-bold text-clinical-blue transition hover:bg-clinical-blue/15"
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
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/75 text-clinical-slate transition hover:border-clinical-blue/25 hover:bg-clinical-blue/[0.08] hover:text-clinical-blue focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
              aria-label="Buscar"
            >
              <Search className="size-4" />
            </button>

            {mobileSearchOpen ? (
              <div ref={mobileSearchPanelRef} className="fixed left-3 right-3 top-[76px] z-50 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/[0.96] p-3 shadow-[0_24px_70px_rgba(38,53,50,0.16)] backdrop-blur-xl">
                <div className="flex h-11 items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/60 px-3 text-sm text-clinical-muted">
                  <Search className="size-4 shrink-0 text-clinical-blue" />
                  <input
                    className="w-full bg-transparent font-medium outline-none placeholder:text-clinical-muted/60"
                    placeholder="Buscar paciente ou protocolo"
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
                      className="rounded-full border border-clinical-blue/12 bg-clinical-blue/[0.08] px-3 py-1.5 text-[13px] font-bold text-clinical-blueText"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button type="button" className="hidden h-11 items-center gap-2 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/75 px-3 text-[13px] font-bold text-clinical-slate transition hover:border-clinical-blue/25 hover:text-clinical-blue lg:flex">
            <CalendarRange className="size-4" />
            {todayLabel === "Hoje" ? "Hoje" : `Hoje, ${todayLabel}`}
          </button>

          <div className="hidden h-8 w-px bg-clinical-blue/10 sm:block" />

          <ConnectedChannels onNavigate={onNavigate} />
          <AIStatusMenu onNavigate={onNavigate} />

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/75 text-clinical-slate transition duration-300 hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:text-clinical-blue hover:shadow-card focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <div className="hidden h-8 w-px bg-clinical-blue/10 sm:block" />

          {/* Notification dropdown */}
          <div ref={notifMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setNotifMenuOpen((current) => !current)}
              aria-label="Abrir notificações"
              aria-expanded={notifMenuOpen}
              aria-haspopup="dialog"
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/70 text-clinical-slate transition duration-300 hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:text-clinical-blue hover:shadow-card focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
            >
              <Bell className="size-4" />
              {unreadNotifications > 0 ? <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-clinical-orange px-1 text-[10px] font-black text-white">{unreadNotifications}</span> : null}
            </button>

            {notifMenuOpen ? (
              <div
                ref={notifPanelRef}
                className="fixed left-3 right-3 top-[76px] z-50 rounded-[26px] border border-clinical-border/[0.14] bg-clinical-surface/[0.96] p-4 shadow-[0_24px_70px_rgba(38,53,50,0.16)] backdrop-blur-xl dark:border-white/[0.08] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[340px] sm:origin-top-right"
              >
                <span className="absolute -top-2 right-6 hidden size-4 rotate-45 rounded-sm border-l border-t border-clinical-border/[0.14] bg-clinical-surface/[0.96] dark:border-white/[0.08] sm:block" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-clinical-dark">Notificações</p>
                    <button type="button" className="text-[13px] font-bold text-clinical-blue hover:underline" onClick={() => { markAllNotificationsRead(); toast("Notificações marcadas como lidas."); }}>Marcar todas</button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => markNotificationRead(notification.id)}
                        className={`w-full rounded-2xl border p-3 text-left transition hover:bg-clinical-surface ${notification.read ? "border-clinical-border/[0.10] bg-clinical-surfaceMuted/35" : "border-clinical-blue/20 bg-clinical-blue/[0.06]"}`}
                      >
                        <p className="text-sm font-bold text-clinical-dark">{notification.title}</p>
                        <p className="mt-1 text-[13px] font-medium text-clinical-muted">{notification.description}</p>
                        <p className="mt-2 text-[13px] font-bold text-clinical-blueText">{notification.time}</p>
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
              className="flex h-11 shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/75 px-2.5 pr-3 transition hover:border-clinical-blue/25 focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
            >
                 <div className="flex size-8 items-center justify-center rounded-xl bg-clinical-charcoal text-[13px] font-extrabold text-white">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
              <div className="hidden leading-tight 2xl:block">
                 <p className="text-[13px] font-extrabold text-clinical-dark">{profile.name}</p>
                <p className="flex items-center gap-1 text-[13px] font-bold text-clinical-green">
                  <ShieldCheck className="size-3" /> Operação segura
                </p>
              </div>
            </button>

            {userMenuOpen ? (
              <div
                ref={userPanelRef}
                className="fixed left-3 right-3 top-[76px] z-50 rounded-[26px] border border-clinical-border/[0.14] bg-clinical-surface/[0.96] p-4 shadow-[0_24px_70px_rgba(38,53,50,0.16)] backdrop-blur-xl dark:border-white/[0.08] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[320px] sm:origin-top-right"
              >
                <span className="absolute -top-2 right-8 hidden size-4 rotate-45 rounded-sm border-l border-t border-clinical-border/[0.14] bg-clinical-surface/[0.96] dark:border-white/[0.08] sm:block" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 pb-4">
                     <div className="flex size-12 items-center justify-center rounded-2xl bg-clinical-charcoal text-sm font-extrabold text-white">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
                    <div>
                       <p className="text-base font-extrabold text-clinical-dark">{profile.name}</p>
                       <p className="text-[13px] font-semibold text-clinical-muted">{profile.role}</p>
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
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-clinical-slate transition hover:bg-clinical-blue/10 hover:text-clinical-blue"
                        >
                          <Icon className="size-4" /> {item.label}
                        </button>
                      );
                    })}
                  </div>
                   <button type="button" onClick={() => router.push("/login")} className="mt-3 flex w-full items-center gap-3 rounded-2xl border-t border-clinical-blue/10 px-3 pt-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10">
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
