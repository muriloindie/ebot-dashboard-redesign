"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKey);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-clinical-charcoal/40 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-[32px] border border-clinical-border/[0.14] bg-clinical-surface/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/[0.08]",
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
}
