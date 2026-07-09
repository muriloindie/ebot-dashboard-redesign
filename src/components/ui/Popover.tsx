"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  align?: "left" | "right" | "center";
  width?: string;
  matchTriggerWidth?: boolean;
};

export function Popover({
  trigger,
  children,
  className,
  wrapperClassName,
  align = "center",
  width = "w-80",
  matchTriggerWidth = false
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, arrowLeft: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculateCoords = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const triggerWidth = rect.width;
    const menuWidth = matchTriggerWidth
      ? triggerWidth
      : Math.min(420, typeof window !== "undefined" ? window.innerWidth - 32 : 320);

    let left = rect.left;
    let arrowLeft = rect.width / 2;

    if (align === "right") {
      left = rect.right - menuWidth;
      arrowLeft = menuWidth - rect.width / 2;
    } else if (align === "center") {
      left = rect.left + rect.width / 2 - menuWidth / 2;
      arrowLeft = menuWidth / 2;
    }

    left = Math.max(16, Math.min(left, (typeof window !== "undefined" ? window.innerWidth : 9999) - menuWidth - 16));

    setCoords({
      top: rect.bottom + 6,
      left,
      arrowLeft,
      width: menuWidth
    });
  }, [align, matchTriggerWidth]);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(calculateCoords);
      return () => cancelAnimationFrame(frame);
    }
    return;
  }, [open, calculateCoords]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleScroll() {
      if (open) setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
    return;
  }, [open]);

  const menuStyle: React.CSSProperties = matchTriggerWidth
    ? { position: "fixed", top: coords.top, left: coords.left, zIndex: 9999, width: coords.width }
    : { position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 };

  return (
    <div
      ref={ref}
      onClick={() => setOpen((current) => !current)}
      className={cn("relative cursor-pointer", wrapperClassName ?? "inline-block")}
    >
      {trigger}
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              onClick={(event) => event.stopPropagation()}
              style={menuStyle}
              className={cn(
                "rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/95 p-4 shadow-clinical backdrop-blur-xl dark:border-white/[0.08]",
                !matchTriggerWidth && width,
                className
              )}
            >
              <span
                className="absolute -top-1 size-2.5 -translate-x-1/2 rotate-45 border-l border-t border-clinical-border/[0.14] bg-clinical-surface/95 dark:border-white/[0.08]"
                style={{ left: coords.arrowLeft }}
              />
              <div className="relative z-10">{children}</div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
