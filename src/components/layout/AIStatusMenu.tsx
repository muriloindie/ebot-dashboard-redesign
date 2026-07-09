"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, BrainCircuit, Clock3, DatabaseZap, Settings, Sparkles } from "lucide-react";
import gsap from "gsap";
import { aiConnection } from "@/data/dashboardMock";

type AIStatusMenuProps = {
  onNavigate?: (itemId: string) => void;
};

export function AIStatusMenu({ onNavigate }: AIStatusMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  function navigateToSettings() {
    onNavigate?.("configuracoes");
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex h-11 items-center gap-2 rounded-2xl border border-[#53B2FF]/70 bg-[#087DFF] px-3 text-[13px] font-extrabold text-white shadow-[0_14px_34px_rgba(8,125,255,0.26)] transition hover:-translate-y-0.5 hover:bg-[#066FE4] hover:shadow-[0_18px_42px_rgba(8,125,255,0.34)] focus:outline-none focus:ring-2 focus:ring-[#087DFF]/30"
      >
        <span className="relative flex size-2.5 items-center justify-center">
          <span className="absolute size-full animate-signal-ring rounded-full bg-white/80" />
          <span className="relative size-2.5 animate-signal-pulse rounded-full bg-white" />
        </span>
        <Bot className="size-4" />
        <span className="hidden sm:inline">IA</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[13px] text-white">online</span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-[390px] max-w-[calc(100vw-24px)] origin-top-right rounded-[28px] border border-clinical-border/[0.14] bg-clinical-surface/[0.9] p-4 shadow-[0_24px_70px_rgba(38,53,50,0.16)] backdrop-blur-2xl dark:border-white/[0.08] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
        >
          <span className="absolute -top-2 right-8 size-4 rotate-45 rounded-sm border-l border-t border-clinical-border/[0.14] bg-clinical-surface/[0.9] dark:border-white/[0.08]" />
          <div className="relative z-10">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-extrabold text-clinical-dark">IA conectada</p>
                <p className="mt-1 text-[13px] font-semibold text-clinical-muted">Provider, modelo e contexto operacional.</p>
              </div>
              <span className="rounded-full border border-[#087DFF]/20 bg-[#087DFF]/[0.10] px-2.5 py-1 text-[13px] font-extrabold text-[#087DFF] dark:text-[#7BC1FF]">
                {aiConnection.status}
              </span>
            </div>

            <div className="rounded-[24px] border border-[#087DFF]/15 bg-[radial-gradient(circle_at_10%_0%,rgba(8,125,255,0.18),transparent_38%),rgb(var(--clinical-surface-muted)/0.58)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#087DFF]/[0.12] text-[#087DFF] shadow-[inset_5px_5px_12px_rgba(38,53,50,0.05),inset_-5px_-5px_12px_rgba(255,255,255,0.55)] dark:text-[#7BC1FF] dark:shadow-none">
                  <BrainCircuit className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-black text-clinical-dark">{aiConnection.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] font-bold text-clinical-slate">
                    <Sparkles className="size-3.5 text-[#087DFF]" /> {aiConnection.provider} · {aiConnection.model}
                  </p>
                  <p className="mt-2 text-[13px] font-semibold leading-5 text-clinical-muted">{aiConnection.context}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-[#087DFF]/10 bg-clinical-surface/70 p-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-clinical-muted">Precisão</p>
                  <p className="mt-1 text-base font-black text-[#087DFF] dark:text-[#7BC1FF]">{aiConnection.accuracy}</p>
                </div>
                <div className="rounded-2xl border border-[#087DFF]/10 bg-clinical-surface/70 p-3">
                  <p className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.08em] text-clinical-muted"><Clock3 className="size-3" /> Latência</p>
                  <p className="mt-1 text-base font-black text-clinical-dark">{aiConnection.latency}</p>
                </div>
                <div className="rounded-2xl border border-[#087DFF]/10 bg-clinical-surface/70 p-3">
                  <p className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.08em] text-clinical-muted"><DatabaseZap className="size-3" /> Status</p>
                  <p className="mt-1 text-base font-black text-clinical-green">{aiConnection.status}</p>
                </div>
              </div>
              <p className="mt-3 rounded-2xl bg-clinical-surface/70 px-3 py-2 text-[13px] font-semibold text-clinical-muted">Última ação: <span className="font-extrabold text-clinical-dark">{aiConnection.lastAction}</span></p>
            </div>

            <button
              onClick={navigateToSettings}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#087DFF]/20 bg-[#087DFF] px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(8,125,255,0.24)] transition hover:-translate-y-0.5 hover:bg-[#066FE4] focus:outline-none focus:ring-2 focus:ring-[#087DFF]/30"
            >
              <Settings className="size-4" /> Configurar IA <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
