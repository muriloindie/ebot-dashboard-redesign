import { Star } from "lucide-react";
import { teamPerformance } from "@/data/dashboardMock";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";

export function TeamPerformanceTable() {
  return (
    <GlassCard className="overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="mb-5">
        <h3 className="text-[22px] font-extrabold tracking-[-0.03em] text-ebot-dark">Equipe e SLA</h3>
        <p className="mt-2 text-[15px] leading-7 text-ebot-muted">Performance do atendimento e responsáveis por atendimento humano.</p>
      </div>
      <div className="ebot-scrollbar overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-[13px] font-extrabold uppercase tracking-[0.10em] text-ebot-muted/75">
              <th className="border-b border-ebot-primary/10 pb-3">Atendente</th>
              <th className="border-b border-ebot-primary/10 pb-3">Status</th>
              <th className="border-b border-ebot-primary/10 pb-3">Atendimentos assumidos</th>
              <th className="border-b border-ebot-primary/10 pb-3">Tempo médio</th>
              <th className="border-b border-ebot-primary/10 pb-3">Avaliação</th>
              <th className="border-b border-ebot-primary/10 pb-3 text-right">SLA</th>
            </tr>
          </thead>
          <tbody>
            {teamPerformance.map((member) => (
              <tr key={member.name} className="text-[14px] font-semibold text-ebot-slate">
                <td className="border-b border-ebot-primary/10 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-ebot-primary/10 text-[13px] font-extrabold text-ebot-primaryText">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-extrabold text-ebot-dark">{member.name}</span>
                  </div>
                </td>
                <td className="border-b border-ebot-primary/10 py-4"><StatusPill tone={member.tone}>{member.status}</StatusPill></td>
                <td className="border-b border-ebot-primary/10 py-4 font-extrabold text-ebot-dark">{member.assumed}</td>
                <td className="border-b border-ebot-primary/10 py-4">{member.response}</td>
                <td className="border-b border-ebot-primary/10 py-4">
                  <span className="inline-flex items-center gap-1 font-extrabold text-ebot-dark">
                    <Star className="size-4 fill-ebot-orange text-ebot-orange" /> {member.rating}
                  </span>
                </td>
                <td className="border-b border-ebot-primary/10 py-4 text-right">
                  <span className="rounded-full bg-ebot-green/10 px-3 py-1.5 text-[13px] font-extrabold text-ebot-green">{member.sla}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
