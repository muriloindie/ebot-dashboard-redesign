"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  className
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
  }, [open]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
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
        "fixed left-0 top-0 z-[100] flex h-[100dvh] min-h-screen w-screen items-center justify-center bg-clinical-charcoal/35 p-3 backdrop-blur-[10px] transition duration-300 ease-out sm:p-4",
        visible ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
      onTransitionEnd={() => {
        if (!visible) setRendered(false);
      }}
    >
      <div
        className={cn(
          "max-h-[calc(100vh-24px)] w-full max-w-lg overflow-y-auto rounded-[28px] border border-clinical-border/[0.14] bg-clinical-surface/95 p-5 shadow-[0_30px_90px_rgba(17,23,22,0.22)] backdrop-blur-2xl transition duration-300 ease-out dark:border-white/[0.08] sm:max-h-[calc(100vh-32px)] sm:rounded-[32px] sm:p-6",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-clinical-dark">{title}</h3>
          <button
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-2xl bg-clinical-blue/10 text-clinical-blue transition hover:bg-clinical-blue hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
}
