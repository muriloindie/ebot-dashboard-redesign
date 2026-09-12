import { contactReasons } from "@/data/dashboardMock";
import { GlassCard } from "@/components/ui/GlassCard";

export function ContactReasons() {
  return (
    <GlassCard className="p-4 sm:p-5 lg:p-6">
      <h3 className="text-[22px] font-extrabold tracking-[-0.03em] text-ebot-dark">Motivos de contato</h3>
      <p className="mt-2 text-[15px] leading-7 text-ebot-muted">Ranking dos principais motivos de demanda operacional.</p>
      <div className="mt-6 space-y-4">
        {contactReasons.map((reason, index) => (
          <div key={reason.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-[15px]">
              <div className="flex min-w-0 items-center gap-2 font-bold text-ebot-dark">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ebot-primary/10 text-[13px] text-ebot-primaryText">{index + 1}</span>
                <span className="truncate">{reason.label}</span>
              </div>
              <span className="font-extrabold text-ebot-dark">{reason.value}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ebot-primary/10">
              <div className="h-full rounded-full" style={{ width: `${reason.value}%`, background: `linear-gradient(90deg, ${reason.color}, rgba(43,159,232,0.45))` }} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
