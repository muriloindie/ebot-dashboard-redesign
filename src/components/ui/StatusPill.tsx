import type { StatusTone } from "@/data/dashboardMock";
import { cn } from "@/lib/cn";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  success: "border-ebot-green/20 bg-ebot-green/10 text-ebot-green",
  warning: "border-ebot-orange/25 bg-ebot-orange/10 text-ebot-orange",
  info: "border-ebot-primary/20 bg-ebot-primary/10 text-ebot-primaryText",
  danger: "border-red-400/25 bg-red-500/[0.10] text-red-500",
  neutral: "border-ebot-border/[0.10] bg-ebot-surfaceMuted text-ebot-muted",
  whatsapp: "border-ebot-whatsapp/20 bg-ebot-whatsapp/10 text-ebot-whatsapp"
};

export function StatusPill({ children, tone = "neutral", className }: StatusPillProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1.5 text-[13px] font-extrabold leading-none", toneClasses[tone], className)}>
      {children}
    </span>
  );
}
