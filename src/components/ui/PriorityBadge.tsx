import { cn } from "@/lib/cn";

const priorities = {
  Alta: { dot: "bg-red-500", label: "text-red-600 dark:text-red-400", chip: "bg-red-500/[0.09] border-red-500/20" },
  Média: { dot: "bg-clinical-orange", label: "text-clinical-orange", chip: "bg-clinical-orange/[0.10] border-clinical-orange/25" },
  Baixa: { dot: "bg-clinical-teal", label: "text-clinical-teal", chip: "bg-clinical-teal/[0.10] border-clinical-teal/25" }
} as const;

export function PriorityBadge({ priority, withChip = false }: { priority: "Alta" | "Média" | "Baixa"; withChip?: boolean }) {
  const config = priorities[priority];
  if (withChip) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold", config.chip, config.label)}>
        <span className={cn("size-1.5 rounded-full", config.dot)} />
        {priority}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-clinical-muted">
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {priority}
    </span>
  );
}
