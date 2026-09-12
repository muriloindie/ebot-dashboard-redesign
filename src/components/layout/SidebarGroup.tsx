"use client";

import { ChevronRight } from "lucide-react";
import type { SidebarGroupConfig } from "@/data/sidebarNavigation";
import { cn } from "@/lib/cn";
import { SidebarItem } from "./SidebarItem";

type SidebarGroupProps = {
  group: SidebarGroupConfig;
  open: boolean;
  activeItem: string;
  onToggle: (groupId: string) => void;
  onSelect: (itemId: string) => void;
  onPrefetch?: (itemId: string) => void;
  showBadges?: boolean;
};

export function SidebarGroup({ group, open, activeItem, onToggle, onSelect, onPrefetch, showBadges = true }: SidebarGroupProps) {
  const Icon = group.icon;
  const hasActiveItem = group.items.some((item) => item.id === activeItem || item.children?.some((child) => child.id === activeItem));

  return (
    <section data-sidebar-group className="rounded-[20px]">
      <button
        onClick={() => onToggle(group.id)}
        aria-expanded={open}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-[18px] border px-3 py-2.5 text-left transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
          hasActiveItem
            ? "border-ebot-primary/[0.20] bg-[#EAF3DA] text-ebot-primaryText shadow-[0_8px_22px_rgba(4,27,21,0.08)] dark:bg-ebot-primary/[0.10]"
            : "border-transparent text-ebot-dark hover:bg-white/82 dark:hover:bg-white/[0.06]"
        )}
      >
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-2xl transition", hasActiveItem ? "bg-ebot-primary/[0.13] text-ebot-primary" : "bg-white text-ebot-muted shadow-[inset_0_0_0_1px_rgba(4,27,21,0.10)] group-hover:text-ebot-primaryText dark:bg-white/[0.06] dark:shadow-none dark:group-hover:text-ebot-primary")}>
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-extrabold uppercase leading-5 tracking-[0.04em]">{group.label}</span>
        </span>
        {showBadges && group.badge ? (
          <span className="rounded-full border border-ebot-primary/15 bg-ebot-primary/[0.10] px-2 py-0.5 text-[13px] font-extrabold text-ebot-primaryText">
            {group.badge}
          </span>
        ) : null}
        <ChevronRight className={cn("size-4 shrink-0 text-ebot-muted transition duration-200", open && "rotate-90 text-ebot-primary")} />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1.5 space-y-1 rounded-[18px] border border-[#C7CCDB] bg-white/58 p-1.5 dark:border-white/[0.06] dark:bg-white/[0.035]">
            {group.items.map((item) => (
              <SidebarItem key={item.id} item={item} activeItem={activeItem} onSelect={onSelect} onPrefetch={onPrefetch} showBadge={showBadges} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
