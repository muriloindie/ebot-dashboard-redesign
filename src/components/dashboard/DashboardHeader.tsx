"use client";

import { useEffect, useRef } from "react";
import { Download, Radio } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";

export function DashboardHeader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-header-reveal]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <div data-header-reveal className="operation-live-pill mb-4 inline-flex items-center gap-2.5 rounded-full border border-clinical-teal/35 bg-[linear-gradient(135deg,#216E70_0%,#30A3A4_52%,#87A630_130%)] px-4 py-2.5 text-[14px] font-extrabold text-white shadow-[0_14px_38px_rgba(48,163,164,0.28)] backdrop-blur-xl dark:border-clinical-teal/45 dark:bg-[linear-gradient(135deg,#1F787A_0%,#30A3A4_55%,#87A630_135%)]">
          <span className="relative flex size-3 items-center justify-center">
            <span className="absolute size-full animate-signal-ring rounded-full bg-white/75" />
            <span className="relative size-2.5 animate-signal-pulse rounded-full bg-white" />
          </span>
          <Radio className="size-4" /> Operação em tempo real
        </div>
        <h2 data-header-reveal className="text-[32px] font-extrabold tracking-[-0.04em] text-clinical-dark sm:text-4xl lg:text-[40px]">
          Bom dia, Dr. Ruan
        </h2>
        <p data-header-reveal className="mt-3 max-w-2xl text-base leading-7 text-clinical-muted">
          Veja como está a operação da clínica hoje: atendimentos, agenda, IA e recepção em tempo real.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button data-header-reveal id="export-report-trigger" variant="secondary">
          <Download className="size-4" /> Exportar relatório
        </Button>
      </div>
    </div>
  );
}
