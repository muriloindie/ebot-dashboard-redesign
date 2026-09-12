"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  side?: "right" | "top" | "bottom" | "left";
  className?: string;
};

export function Tooltip({ content, children, side = "right", className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  function handleMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.top + rect.height / 2;
    let left = rect.right + 8;

    if (side === "top") {
      top = rect.top - 8;
      left = rect.left + rect.width / 2;
    } else if (side === "bottom") {
      top = rect.bottom + 8;
      left = rect.left + rect.width / 2;
    } else if (side === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - 8;
    }

    setCoords({ top, left });
    setVisible(true);
  }

  function handleMouseLeave() {
    setVisible(false);
  }

  const transform =
    side === "right" || side === "left"
      ? "translateY(-50%)"
      : side === "top"
        ? "translate(-50%, -100%)"
        : "translate(-50%, 0)";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("block w-full", className)}
    >
      {children}
      {visible && typeof document !== "undefined"
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
                transform
              }}
              className="pointer-events-none whitespace-nowrap rounded-xl border border-white/10 bg-ebot-charcoal px-3 py-2 text-[13px] font-bold text-white shadow-ebot backdrop-blur-xl"
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
