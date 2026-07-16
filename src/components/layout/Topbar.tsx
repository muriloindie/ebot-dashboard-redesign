"use client";

import { useEffect, useRef, useState } from "react";
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
import { Popover } from "@/components/ui/Popover";
import type { MenuItemId } from "@/data/sidebarNavigation";
import { AIStatusMenu } from "./AIStatusMenu";
import { ConnectedChannels } from "./ConnectedChannels";

const notifications = [
  { id: 1, title: "Consulta confirmada", description: "Ana Paula confirmou o horário das 09:00", time: "2 min" },
  { id: 2, title: "IA transferiu conversa", description: "Marcos Silva solicitou atendimento humano", time: "6 min" },
  { id: 3, title: "Encaixe liberado", description: "Horário das 11:15 foi disponibilizado", time: "12 min" }
];

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchPanelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userPanelRef = useRef<HTMLDivElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);

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
    if (mobileSearchOpen && mobileSearchPanelRef.current) {
      gsap.fromTo(
        mobileSearchPanelRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (userMenuOpen && userPanelRef.current) {
      gsap.fromTo(
        userPanelRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  }, [userMenuOpen]);

  useEffect(() => {
    if (notifMenuOpen && notifPanelRef.current) {
      gsap.fromTo(
        notifPanelRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  }, [notifMenuOpen]);

  const userMenuItems = [
    { label: "Meu perfil", icon: User },
    { label: "Configurações", icon: Settings },
    { label: "Trocar unidade", icon: UsersRound },
    { label: "Documentação", icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-clinical-border/[0.12] bg-clinical-surface/76 backdrop-blur-2xl">
      <div className="flex min-h-[64px] items-center justify-between gap-2 px-3 py-2.5 sm:px-4 lg:px-5 xl:min-h-[72px] xl:px-6 xl:py-3">
        <div className="flex shrink-0 items-center gap-3">
          <button
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
                <button className="group flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-clinical-dark transition hover:text-clinical-blue">
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
                    <span
                      key={item}
                      onClick={() => setSearch(item)}
                      className="cursor-pointer rounded-full border border-clinical-blue/15 bg-clinical-blue/[0.08] px-3 py-1.5 text-[13px] font-bold text-clinical-blue transition hover:bg-clinical-blue/15"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Popover>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <div ref={mobileSearchRef} className="relative md:hidden">
            <button
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

          <button className="hidden h-11 items-center gap-2 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/75 px-3 text-[13px] font-bold text-clinical-slate transition hover:border-clinical-blue/25 hover:text-clinical-blue lg:flex">
            <CalendarRange className="size-4" />
            Hoje, 14 Jul
          </button>

          <div className="hidden h-8 w-px bg-clinical-blue/10 sm:block" />

          <ConnectedChannels onNavigate={onNavigate} />
          <AIStatusMenu onNavigate={onNavigate} />

          <button
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
              onClick={() => setNotifMenuOpen((current) => !current)}
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/70 text-clinical-slate transition duration-300 hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:text-clinical-blue hover:shadow-card focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
            >
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-clinical-orange">
                <span className="absolute -inset-1 animate-pulse-ring rounded-full bg-clinical-orange" />
              </span>
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
                    <button className="text-[13px] font-bold text-clinical-blue hover:underline">Marcar todas</button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                          className="rounded-2xl border border-clinical-border/[0.10] bg-clinical-surfaceMuted/60 p-3 transition hover:bg-clinical-surface"
                      >
                        <p className="text-sm font-bold text-clinical-dark">{notification.title}</p>
                        <p className="mt-1 text-[13px] font-medium text-clinical-muted">{notification.description}</p>
                        <p className="mt-2 text-[13px] font-bold text-clinical-blueText">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* User dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen((current) => !current)}
              className="flex h-11 shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/75 px-2.5 pr-3 transition hover:border-clinical-blue/25 focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-clinical-charcoal text-[13px] font-extrabold text-white">DR</div>
              <div className="hidden leading-tight xl:block">
                <p className="text-[13px] font-extrabold text-clinical-dark">Dr. Ruan</p>
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
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-clinical-charcoal text-sm font-extrabold text-white">DR</div>
                    <div>
                      <p className="text-base font-extrabold text-clinical-dark">Dr. Ruan</p>
                      <p className="text-[13px] font-semibold text-clinical-muted">Diretor Clínico</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-clinical-slate transition hover:bg-clinical-blue/10 hover:text-clinical-blue"
                        >
                          <Icon className="size-4" /> {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <button className="mt-3 flex w-full items-center gap-3 rounded-2xl border-t border-clinical-blue/10 px-3 pt-3 text-sm font-semibold text-red-500 transition hover:bg-red-50">
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
