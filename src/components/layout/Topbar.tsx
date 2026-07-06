"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Bot,
  CalendarRange,
  Check,
  FileText,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  User,
  UsersRound
} from "lucide-react";
import gsap from "gsap";
import { Badge } from "@/components/ui/Badge";
import { Popover } from "@/components/ui/Popover";
import { cn } from "@/lib/cn";

const notifications = [
  { id: 1, title: "Consulta confirmada", description: "Ana Paula confirmou o horário das 09:00", time: "2 min" },
  { id: 2, title: "IA transferiu conversa", description: "Marcos Silva solicitou atendimento humano", time: "6 min" },
  { id: 3, title: "Encaixe liberado", description: "Horário das 11:15 foi disponibilizado", time: "12 min" }
];

const recentSearches = ["Ana Paula", "Protocolo de preparo", "Dr. Ricardo Lima"];
const clinics = ["Clínica São Lucas", "Clínica Santa Maria", "Centro Médico Norte"];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function Topbar() {
  const [clinic, setClinic] = useState(clinics[0]);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
    }

    function handleScroll() {
      setUserMenuOpen(false);
      setNotifMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

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
    <header className="sticky top-0 z-40 border-b border-clinical-blue/10 bg-white/72 backdrop-blur-2xl">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden md:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinical-blue">Central Operacional</p>
            <Popover
              trigger={
                <button className="group flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-clinical-dark transition hover:text-clinical-blue">
                  {clinic}
                  <span className="text-xs opacity-60 transition group-hover:translate-y-0.5">▾</span>
                </button>
              }
              align="left"
              width="w-72"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-clinical-muted">Unidades</p>
              <div className="space-y-1">
                {clinics.map((item) => (
                  <button
                    key={item}
                    onClick={() => setClinic(item)}
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
                className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border border-clinical-blue/10 bg-white/75 px-4 text-sm text-clinical-muted shadow-[0_12px_36px_rgba(43,159,232,0.06)] transition focus-within:border-clinical-blue/35 focus-within:bg-white"
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
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-clinical-muted">Buscas recentes</p>
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
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-clinical-muted">Sugestões rápidas</p>
                <div className="flex flex-wrap gap-2">
                  {["Pacientes", "Protocolos", "Agenda", "Campanhas"].map((item) => (
                    <span
                      key={item}
                      onClick={() => setSearch(item)}
                      className="cursor-pointer rounded-full border border-clinical-blue/15 bg-clinical-blue/8 px-3 py-1.5 text-xs font-bold text-clinical-blue transition hover:bg-clinical-blue/15"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Popover>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <button className="hidden h-11 items-center gap-2 rounded-2xl border border-clinical-blue/10 bg-white/75 px-3 text-xs font-bold text-clinical-slate transition hover:border-clinical-blue/25 hover:text-clinical-blue lg:flex">
            <CalendarRange className="size-4" />
            Hoje, 14 Jul
          </button>

          <div className="hidden h-8 w-px bg-clinical-blue/10 sm:block" />

          <div className="flex items-center gap-2">
            <Badge tone="whatsapp" className={cn("h-10 shrink-0 gap-2")}>
              <WhatsAppIcon className="size-4" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clinical-dark/85 px-2 py-0.5 text-[10px] font-extrabold text-white">
                <span className="relative flex size-2 items-center justify-center">
                  <span className="absolute size-full animate-signal-ring rounded-full bg-clinical-green" />
                  <span className="relative size-2 animate-signal-pulse rounded-full bg-clinical-green" />
                </span>
                online
              </span>
            </Badge>

            <Badge tone="blue" className="h-10 shrink-0 gap-2">
              <Bot className="size-3.5" />
              <span className="hidden sm:inline">IA</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clinical-dark/85 px-2 py-0.5 text-[10px] font-extrabold text-white">
                <span className="relative flex size-2 items-center justify-center">
                  <span className="absolute size-full animate-signal-ring rounded-full bg-clinical-green" />
                  <span className="relative size-2 animate-signal-pulse rounded-full bg-clinical-green" />
                </span>
                online
              </span>
            </Badge>
          </div>

          <div className="hidden h-8 w-px bg-clinical-blue/10 sm:block" />

          {/* Notification dropdown */}
          <div ref={notifMenuRef} className="relative">
            <button
              onClick={() => setNotifMenuOpen((current) => !current)}
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-clinical-blue/10 bg-white/70 text-clinical-slate transition duration-300 hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:text-clinical-blue hover:shadow-card focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
            >
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-clinical-orange">
                <span className="absolute -inset-1 animate-pulse-ring rounded-full bg-clinical-orange" />
              </span>
            </button>

            {notifMenuOpen ? (
              <div
                ref={notifPanelRef}
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-[340px] origin-top-right rounded-[28px] border border-white/60 bg-white/85 p-4 shadow-[0_24px_70px_rgba(38,53,50,0.16)] backdrop-blur-xl"
              >
                <span className="absolute -top-2 right-6 size-4 rotate-45 rounded-sm border-l border-t border-white/60 bg-white/85" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-clinical-dark">Notificações</p>
                    <button className="text-xs font-bold text-clinical-blue hover:underline">Marcar todas</button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-2xl border border-clinical-blue/10 bg-white/60 p-3 transition hover:bg-white"
                      >
                        <p className="text-sm font-bold text-clinical-dark">{notification.title}</p>
                        <p className="mt-1 text-xs font-medium text-clinical-muted">{notification.description}</p>
                        <p className="mt-2 text-[11px] font-bold text-clinical-blue">{notification.time}</p>
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
              className="flex h-11 shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-clinical-blue/10 bg-white/75 px-2.5 pr-3 transition hover:border-clinical-blue/25"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-clinical-dark text-xs font-extrabold text-white">DR</div>
              <div className="hidden leading-tight xl:block">
                <p className="text-xs font-extrabold text-clinical-dark">Dr. Ruan</p>
                <p className="flex items-center gap-1 text-[10px] font-bold text-clinical-green">
                  <ShieldCheck className="size-3" /> Operação segura
                </p>
              </div>
            </button>

            {userMenuOpen ? (
              <div
                ref={userPanelRef}
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-[320px] origin-top-right rounded-[28px] border border-white/60 bg-white/85 p-4 shadow-[0_24px_70px_rgba(38,53,50,0.16)] backdrop-blur-xl"
              >
                <span className="absolute -top-2 right-8 size-4 rotate-45 rounded-sm border-l border-t border-white/60 bg-white/85" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 pb-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-clinical-dark text-sm font-extrabold text-white">DR</div>
                    <div>
                      <p className="text-base font-extrabold text-clinical-dark">Dr. Ruan</p>
                      <p className="text-xs font-semibold text-clinical-muted">Diretor Clínico</p>
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
