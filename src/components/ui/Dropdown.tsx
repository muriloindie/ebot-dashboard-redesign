"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
};

export function Dropdown({ label, value, options, onChange, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  }, [open]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        !ref.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleScroll() {
      if (open) setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClick);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-2xl border px-3.5 text-[14px] font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
          open
            ? "border-ebot-primary/30 bg-ebot-primary/10 text-ebot-primary"
            : "border-ebot-border/[0.12] bg-ebot-surface/65 text-ebot-slate hover:border-ebot-primary/25 hover:text-ebot-primary"
        )}
      >
        <span className="min-w-0 truncate text-[13px] font-bold uppercase tracking-[0.08em] text-ebot-muted/80">{label}</span>
        <span className="min-w-0 truncate text-ebot-dark">{value}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 transition", open ? "rotate-180 text-ebot-primary" : "text-ebot-muted")} />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              aria-label={label}
              onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
              style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 }}
              className="min-w-[190px] origin-top rounded-2xl border border-ebot-border/[0.14] bg-ebot-surface/95 p-2 shadow-ebot backdrop-blur-xl dark:border-white/[0.08]"
            >
              {options.map((option) => {
                const active = value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                      active ? "bg-ebot-primary/10 text-ebot-primaryText" : "text-ebot-slate hover:bg-ebot-primary/[0.08] hover:text-ebot-primary"
                    )}
                  >
                    {option}
                    {active ? <Check className="size-3.5" /> : null}
                  </button>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
