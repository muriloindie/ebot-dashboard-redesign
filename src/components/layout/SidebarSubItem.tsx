"use client";

import type { SidebarItemConfig } from "@/data/sidebarNavigation";
import { cn } from "@/lib/cn";

type SidebarSubItemProps = {
  item: SidebarItemConfig;
  active: boolean;
  onSelect: (itemId: string) => void;
  onPrefetch?: (itemId: string) => void;
};

export function SidebarSubItem({ item, active, onSelect, onPrefetch }: SidebarSubItemProps) {
  const Icon = item.icon;
  const disabled = !item.enabled;

  return (
    <button
      data-sidebar-item
      onClick={() => { if (!disabled) onSelect(item.id); }}
      onMouseEnter={() => onPrefetch?.(item.id)}
      onFocus={() => onPrefetch?.(item.id)}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      title={disabled ? "Disponível em breve" : undefined}
      className={cn(
        "group flex w-full items-center gap-3 rounded-[15px] border px-3 py-2.5 text-left text-[13px] font-semibold transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
        active
          ? "border-ebot-primary/20 bg-[#EAF3DA] text-ebot-primaryText shadow-[0_8px_18px_rgba(4,27,21,0.07)] dark:bg-ebot-primary/[0.12]"
          : disabled ? "border-transparent text-ebot-muted/50" : "border-transparent text-ebot-muted hover:translate-x-[3px] hover:bg-[#EDF0F6] hover:text-ebot-dark dark:hover:bg-white/[0.06]"
      )}
    >
      <Icon className={cn("size-4 shrink-0 stroke-2 transition", active ? "text-ebot-primary" : "text-ebot-muted group-hover:text-ebot-primary")} />
      <span className="min-w-0 truncate">{item.label}</span>
    </button>
  );
}
