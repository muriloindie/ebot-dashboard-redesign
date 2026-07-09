"use client";

import type { SidebarItemConfig } from "@/data/sidebarNavigation";
import { cn } from "@/lib/cn";

type SidebarSubItemProps = {
  item: SidebarItemConfig;
  active: boolean;
  onSelect: (itemId: string) => void;
};

export function SidebarSubItem({ item, active, onSelect }: SidebarSubItemProps) {
  const Icon = item.icon;

  return (
    <button
      data-sidebar-item
      onClick={() => onSelect(item.id)}
      className={cn(
        "group flex w-full items-center gap-3 rounded-[15px] border px-3 py-2.5 text-left text-[13px] font-semibold transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
        active
          ? "border-clinical-blue/20 bg-[#EAF6FB] text-clinical-blueText shadow-[0_8px_18px_rgba(58,157,202,0.07)] dark:bg-clinical-blue/[0.12]"
          : "border-transparent text-clinical-muted hover:translate-x-[3px] hover:bg-[#F1F8FB] hover:text-clinical-dark dark:hover:bg-white/[0.06]"
      )}
    >
      <Icon className={cn("size-4 shrink-0 stroke-2 transition", active ? "text-clinical-blue" : "text-clinical-muted group-hover:text-clinical-blue")} />
      <span className="min-w-0 truncate">{item.label}</span>
    </button>
  );
}
