import { Construction } from "lucide-react";
import { GlassCard } from "./GlassCard";

export function EmptyState({ title = "Nenhum registro encontrado", description = "Ajuste os filtros ou adicione o primeiro registro para começar.", action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return (
    <GlassCard className="flex min-h-[460px] flex-col items-center justify-center p-10 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-clinical-blue/10 text-clinical-blue">
        <Construction className="size-7" />
      </div>
      <h2 className="text-2xl font-bold text-clinical-dark">{title}</h2>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-clinical-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </GlassCard>
  );
}
