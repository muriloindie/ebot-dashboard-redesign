import { Construction } from "lucide-react";
import { GlassCard } from "./GlassCard";

export function EmptyState({ title = "Conteúdo em desenvolvimento" }: { title?: string }) {
  return (
    <GlassCard className="flex min-h-[460px] flex-col items-center justify-center p-10 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-clinical-blue/10 text-clinical-blue">
        <Construction className="size-7" />
      </div>
      <h2 className="text-2xl font-bold text-clinical-dark">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-clinical-muted">
        Este módulo já tem navegação, estados visuais e shell preparados. A experiência completa será conectada em uma próxima fase.
      </p>
    </GlassCard>
  );
}
