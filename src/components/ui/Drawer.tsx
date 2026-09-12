"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Drawer({ open, onClose, title, description, children, width = "max-w-xl" }: { open: boolean; onClose: () => void; title: string; description?: string; children: React.ReactNode; width?: string }) {
  const [rendered, setRendered] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = `${useId().replace(/:/g, "")}-title`;
  const descriptionId = `${useId().replace(/:/g, "")}-description`;

  useEffect(() => {
    if (open) {
      setRendered(true);
    } else if (rendered) {
      const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !panelRef.current || !backdropRef.current) {
        setRendered(false);
        return;
      }
      gsap.timeline({ onComplete: () => setRendered(false) })
        .to(panelRef.current, { x: 72, opacity: 0, duration: 0.28, ease: "power2.in" }, 0)
        .to(backdropRef.current, { opacity: 0, duration: 0.24, ease: "power2.in" }, 0);
    }
  }, [open, rendered]);

  useEffect(() => {
    if (!rendered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(panelRef.current, { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power3.out" });
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: "power2.out" });
  }, [rendered]);

  useEffect(() => {
    if (!rendered) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    const frame = requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      firstFocusable?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")).filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previous; previousFocusRef.current?.focus?.(); };
  }, [rendered, onClose]);

  if (!rendered || typeof document === "undefined") return null;
  return createPortal(
    <div ref={backdropRef} className="fixed inset-0 z-[90] flex justify-end bg-ebot-charcoal/30 backdrop-blur-[3px] opacity-0" role="presentation" onMouseDown={onClose}>
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className={cn("flex h-full w-full flex-col border-l border-ebot-border/[0.14] bg-ebot-surface shadow-2xl", width)} onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-ebot-border/[0.12] px-5 py-5 sm:px-6">
          <div><h2 id={titleId} className="text-lg font-extrabold tracking-tight text-ebot-dark">{title}</h2>{description ? <p id={descriptionId} className="mt-1 text-sm leading-5 text-ebot-muted">{description}</p> : null}</div>
          <button type="button" onClick={onClose} aria-label="Fechar painel" className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-ebot-border/[0.12] text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"><X className="size-4" /></button>
        </div>
        <div className="ebot-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </aside>
    </div>,
    document.body
  );
}
