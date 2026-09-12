"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  eyebrow,
  description,
  icon: Icon,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
  description?: string;
  icon?: React.ElementType;
  footer?: React.ReactNode;
}) {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = `${useId().replace(/:/g, "")}-title`;
  const descriptionId = `${useId().replace(/:/g, "")}-description`;

  useEffect(() => {
    if (open) {
      setRendered(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
  }, [open]);

  useEffect(() => {
    if (!rendered) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    const frame = requestAnimationFrame(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      firstFocusable?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus?.();
    };
  }, [rendered]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")).filter((element) => !element.hasAttribute("disabled"));
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
    }
    if (rendered) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKey);
      };
    }
  }, [rendered, onClose]);

  if (!rendered) return null;

  const content = (
    <div
      className={cn(
        "fixed left-0 top-0 z-[100] flex h-[100dvh] min-h-screen w-screen items-center justify-center bg-ebot-charcoal/35 p-3 backdrop-blur-[10px] transition duration-300 ease-out sm:p-4",
        visible ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
      onTransitionEnd={(event) => {
        if (event.currentTarget !== event.target) return;
        if (!visible) setRendered(false);
      }}
    >
      <div
        ref={dialogRef}
        className={cn(
          "max-h-[calc(100vh-24px)] w-full max-w-lg overflow-y-auto rounded-[28px] border border-ebot-border/[0.14] bg-ebot-surface/95 p-5 shadow-[0_30px_90px_rgba(17,23,22,0.22)] backdrop-blur-2xl transition duration-300 ease-out dark:border-white/[0.08] sm:max-h-[calc(100vh-32px)] sm:rounded-[32px] sm:p-6",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0",
          className
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {Icon ? <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primary"><Icon className="size-5" /></span> : null}
            <div className="min-w-0">
              {eyebrow ? <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ebot-primaryText">{eyebrow}</p> : null}
              <h2 id={titleId} className="text-xl font-extrabold tracking-[-0.03em] text-ebot-dark">{title}</h2>
              {description ? <p id={descriptionId} className="mt-1 text-sm leading-5 text-ebot-muted">{description}</p> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="flex size-10 items-center justify-center rounded-2xl bg-ebot-primary/10 text-ebot-primary transition hover:bg-ebot-primary hover:text-ebot-charcoal"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
        {footer ? <div className="mt-6 border-t border-ebot-border/[0.12] pt-4">{footer}</div> : null}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
}
