"use client";

import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

const defaultReplies = [
  "Posso ajudar em mais alguma coisa?",
  "Vou verificar e já te retorno em instantes.",
  "Segue o endereço e horário de funcionamento da unidade.",
  "Seu horário está confirmado. Até lá!"
];

export function QuickReplies({
  open,
  onPick,
  options = defaultReplies
}: {
  open: boolean;
  onPick: (text: string) => void;
  options?: string[];
}) {
  if (!open) return null;
  return (
    <div className="absolute bottom-full left-3 right-3 z-20 mb-2 rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface p-2 shadow-clinical backdrop-blur-xl">
      <div className="mb-1.5 flex items-center gap-2 px-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-clinical-muted">
        <Zap className="size-3.5 text-clinical-orange" /> Respostas rápidas
      </div>
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className={cn(
              "rounded-xl px-3 py-2 text-left text-[13px] font-semibold leading-5 text-clinical-slate transition",
              "hover:bg-clinical-blue/[0.08] hover:text-clinical-blueText"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AiSuggestion({ text, onApply }: { text: string; onApply: () => void }) {
  return (
    <button
      type="button"
      onClick={onApply}
      className="group flex w-full items-start gap-2.5 rounded-xl border border-clinical-blue/15 bg-clinical-blue/[0.06] px-3 py-2.5 text-left transition hover:border-clinical-blue/30 hover:bg-clinical-blue/[0.10]"
    >
      <Sparkles className="mt-0.5 size-4 shrink-0 text-clinical-blue" />
      <span className="min-w-0">
        <span className="block text-[11px] font-extrabold uppercase tracking-[0.10em] text-clinical-blueText">Sugestão da IA</span>
        <span className="mt-0.5 block text-[13px] font-semibold leading-5 text-clinical-slate group-hover:text-clinical-dark">{text}</span>
      </span>
    </button>
  );
}
