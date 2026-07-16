"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, ServerCog } from "lucide-react";
import gsap from "gsap";
import { whatsappChannels } from "@/data/dashboardMock";
import { cn } from "@/lib/cn";

type ConnectedChannelsProps = {
  onNavigate?: (itemId: string) => void;
};

const statusClasses = {
  online: {
    pill: "border-[#25D366]/35 bg-[#25D366]/[0.14] text-[#148D43] dark:text-[#6AF199]",
    dot: "bg-[#25D366]"
  },
  warning: {
    pill: "border-clinical-orange/35 bg-clinical-orange/[0.14] text-[#A86500] dark:text-[#FFC66D]",
    dot: "bg-clinical-orange"
  },
  offline: {
    pill: "border-slate-300 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300",
    dot: "bg-slate-400"
  }
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function ConnectedChannels({ onNavigate }: ConnectedChannelsProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(() => {
    const online = whatsappChannels.filter((channel) => channel.health === "online").length;
    const total = whatsappChannels.length;
    if (online === total) return { label: "WhatsApp online", detail: `${total} números`, tone: "online" as const };
    if (online === 0) return { label: "WhatsApp offline", detail: "verificar", tone: "offline" as const };
    return { label: "WhatsApp", detail: `${online}/${total} online`, tone: "warning" as const };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    if (!open || !panelRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(panelRef.current, { opacity: 0, y: -8, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.26, ease: "power3.out" });
  }, [open]);

  function navigateToChannels() {
    onNavigate?.("canais");
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="relative flex size-11 items-center justify-center gap-2 rounded-2xl border border-[#2EAD68]/35 bg-[#2EAD68] text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(46,173,104,0.14)] transition hover:bg-[#278F58] hover:shadow-[0_10px_24px_rgba(46,173,104,0.18)] focus:outline-none focus:ring-2 focus:ring-[#2EAD68]/25 sm:w-auto sm:px-3"
      >
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#54E36F]">
          <span className="absolute -inset-1 animate-pulse-ring rounded-full bg-[#54E36F]" />
        </span>
        <WhatsAppIcon className="size-4 text-white" />
        <span className="hidden sm:inline">WhatsApp</span>
        <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[13px] text-white lg:inline">{summary.detail}</span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="fixed left-3 right-3 top-[76px] z-50 max-h-[calc(100vh-96px)] overflow-y-auto rounded-[26px] border border-clinical-border/[0.14] bg-clinical-surface/[0.96] p-4 shadow-[0_24px_70px_rgba(38,53,50,0.16)] backdrop-blur-2xl dark:border-white/[0.08] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[400px] sm:max-w-[calc(100vw-24px)] sm:origin-top-right sm:overflow-visible"
        >
          <span className="absolute -top-2 right-8 hidden size-4 rotate-45 rounded-sm border-l border-t border-clinical-border/[0.14] bg-clinical-surface/[0.96] dark:border-white/[0.08] sm:block" />
          <div className="relative z-10">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-extrabold text-clinical-dark">Canais WhatsApp</p>
                <p className="mt-1 text-[13px] font-semibold text-clinical-muted">Números conectados e tipo de API.</p>
              </div>
              <span className="rounded-full border border-clinical-whatsapp/20 bg-clinical-whatsapp/[0.10] px-2.5 py-1 text-[13px] font-extrabold text-clinical-whatsapp">
                {summary.detail}
              </span>
            </div>

            <div className="space-y-2">
              {whatsappChannels.map((channel) => (
                <div key={channel.id} className={cn("rounded-2xl border border-clinical-border/[0.10] p-3 transition hover:bg-clinical-surface", channel.health === "offline" ? "bg-slate-50/80 opacity-90 dark:bg-white/[0.035]" : "bg-clinical-surfaceMuted/55")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl shadow-[inset_4px_4px_10px_rgba(38,53,50,0.04),inset_-4px_-4px_10px_rgba(255,255,255,0.45)] dark:shadow-none", channel.health === "offline" ? "bg-slate-200/70 text-slate-500 dark:bg-white/[0.06] dark:text-slate-300" : "bg-clinical-whatsapp/[0.10] text-clinical-whatsapp")}>
                      <WhatsAppIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-clinical-dark">{channel.name}</p>
                      <p className="mt-0.5 text-[13px] font-bold text-clinical-slate">{channel.number}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-clinical-muted">
                        <ServerCog className="size-3.5" /> {channel.api}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-extrabold", statusClasses[channel.health].pill)}>
                        <span className={cn("size-2 rounded-full", statusClasses[channel.health].dot)} />
                        {channel.status}
                      </span>
                      <span className="text-[12px] font-bold text-clinical-muted">sync {channel.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={navigateToChannels}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2EAD68]/25 bg-[#2EAD68] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(46,173,104,0.16)] transition hover:bg-[#278F58] focus:outline-none focus:ring-2 focus:ring-[#2EAD68]/25"
            >
              <BadgeCheck className="size-4" /> Configurar canais <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
