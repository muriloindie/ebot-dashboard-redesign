"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Drawer({ open, onClose, title, description, children, width = "max-w-xl" }: { open: boolean; onClose: () => void; title: string; description?: string; children: React.ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previous; };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex justify-end bg-clinical-charcoal/30 backdrop-blur-[3px]" role="presentation" onMouseDown={onClose}>
      <aside role="dialog" aria-modal="true" aria-labelledby="drawer-title" className={cn("flex h-full w-full flex-col border-l border-clinical-border/[0.14] bg-clinical-surface shadow-2xl", width)} onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-clinical-border/[0.12] px-5 py-5 sm:px-6">
          <div><h2 id="drawer-title" className="text-lg font-extrabold tracking-tight text-clinical-dark">{title}</h2>{description ? <p className="mt-1 text-sm leading-5 text-clinical-muted">{description}</p> : null}</div>
          <button type="button" onClick={onClose} aria-label="Fechar painel" className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-clinical-border/[0.12] text-clinical-muted transition hover:bg-clinical-blue/10 hover:text-clinical-blue focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"><X className="size-4" /></button>
        </div>
        <div className="clinical-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </aside>
    </div>,
    document.body
  );
}
