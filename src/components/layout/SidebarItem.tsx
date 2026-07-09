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
};

export function SidebarItem({ item, activeItem, onSelect }: SidebarItemProps) {
  const [open, setOpen] = useState(item.children?.some((child) => child.id === activeItem) ?? false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);
  const childActive = item.children?.some((child) => child.id === activeItem) ?? false;
  const active = activeItem === item.id;
  const highlighted = active || childActive;

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  useEffect(() => {
    if (!submenuRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(submenuRef.current, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: 0.24,
      ease: "power2.out"
    });
  }, [open]);

  function handleClick() {
    onSelect(item.id);
    if (hasChildren) setOpen((current) => !current);
  }

  return (
    <div data-sidebar-item>
      <button
        onClick={handleClick}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-[16px] border px-3 py-2.5 text-left text-[14px] font-bold transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
          highlighted
            ? "border-clinical-blue/20 bg-[#EAF6FB] text-clinical-blueText shadow-[0_10px_22px_rgba(58,157,202,0.08)] dark:bg-clinical-blue/[0.12]"
            : "border-transparent text-clinical-slate hover:translate-x-[3px] hover:bg-[#F1F8FB] hover:text-clinical-dark dark:hover:bg-white/[0.06]"
        )}
      >
        <Icon className={cn("size-[18px] shrink-0 stroke-[2.05] transition", highlighted ? "text-clinical-blue" : "text-clinical-muted group-hover:text-clinical-blue")} />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {hasChildren ? (
          <ChevronRight className={cn("size-4 shrink-0 text-clinical-muted transition duration-200", open && "rotate-90 text-clinical-blue")} />
        ) : null}
      </button>

      {hasChildren ? (
        <div ref={submenuRef} className="h-0 overflow-hidden opacity-0">
          <div className="ml-5 mt-1.5 space-y-1 border-l border-clinical-blue/[0.12] pl-2.5">
            {item.children?.map((child) => (
              <SidebarSubItem key={child.id} item={child} active={activeItem === child.id} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
