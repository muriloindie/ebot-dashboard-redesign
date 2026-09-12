"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import type { SidebarItemConfig } from "@/data/sidebarNavigation";
import { cn } from "@/lib/cn";
import { SidebarSubItem } from "./SidebarSubItem";

type SidebarItemProps = {
  item: SidebarItemConfig;
  activeItem: string;
  onSelect: (itemId: string) => void;
  onPrefetch?: (itemId: string) => void;
  showBadge?: boolean;
};

export function SidebarItem({ item, activeItem, onSelect, onPrefetch, showBadge = true }: SidebarItemProps) {
  const [open, setOpen] = useState(item.children?.some((child) => child.id === activeItem) ?? false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);
  const childActive = item.children?.some((child) => child.id === activeItem) ?? false;
  const active = activeItem === item.id;
  const highlighted = active || childActive;
  const disabled = !hasChildren && !item.enabled;

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  useEffect(() => {
    if (!submenuRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off") return;
    gsap.to(submenuRef.current, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: 0.24,
      ease: "power2.out"
    });
  }, [open]);

  function handleClick() {
    if (disabled) return;
    if (hasChildren) {
      setOpen((current) => !current);
      return;
    }
    onSelect(item.id);
  }

  return (
    <div data-sidebar-item>
      <button
        onClick={handleClick}
        onMouseEnter={() => onPrefetch?.(item.id)}
        onFocus={() => onPrefetch?.(item.id)}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        title={disabled ? "Disponível em breve" : undefined}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-[16px] border px-3 py-2.5 text-left text-[14px] font-bold transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
          highlighted
            ? "border-ebot-primary/20 bg-[#EAF3DA] text-ebot-primaryText shadow-[0_10px_22px_rgba(4,27,21,0.08)] dark:bg-ebot-primary/[0.12]"
            : disabled ? "border-transparent text-ebot-muted/50" : "border-transparent text-ebot-slate hover:translate-x-[3px] hover:bg-[#EDF0F6] hover:text-ebot-dark dark:hover:bg-white/[0.06]"
        )}
      >
        <Icon className={cn("size-[18px] shrink-0 stroke-[2.05] transition", highlighted ? "text-ebot-primary" : "text-ebot-muted group-hover:text-ebot-primary")} />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {showBadge && item.badge ? (
          <span className="shrink-0 rounded-full border border-ebot-primary/15 bg-ebot-primary/[0.10] px-2 py-0.5 text-[12px] font-extrabold tabular-nums text-ebot-primaryText">
            {item.badge}
          </span>
        ) : null}
        {hasChildren ? (
          <ChevronRight className={cn("size-4 shrink-0 text-ebot-muted transition duration-200", open && "rotate-90 text-ebot-primary")} />
        ) : null}
      </button>

      {hasChildren ? (
        <div ref={submenuRef} className={cn("overflow-hidden", open ? "h-auto opacity-100" : "h-0 opacity-0")}>
          <div className="ml-5 mt-1.5 space-y-1 border-l border-ebot-primary/[0.12] pl-2.5">
            {item.children?.map((child) => (
              <SidebarSubItem key={child.id} item={child} active={activeItem === child.id} onSelect={onSelect} onPrefetch={onPrefetch} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
