import type { StatusTone } from "@/data/dashboardMock";
import { cn } from "@/lib/cn";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  success: "border-clinical-green/20 bg-clinical-green/10 text-clinical-green",
  warning: "border-clinical-orange/25 bg-clinical-orange/10 text-clinical-orange",
  info: "border-clinical-blue/20 bg-clinical-blue/10 text-clinical-blue",
  danger: "border-red-400/20 bg-red-50 text-red-500",
  neutral: "border-clinical-dark/10 bg-clinical-dark/5 text-clinical-muted",
  whatsapp: "border-clinical-whatsapp/20 bg-clinical-whatsapp/10 text-clinical-whatsapp"
};

export function StatusPill({ children, tone = "neutral", className }: StatusPillProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold", toneClasses[tone], className)}>
      {children}
    </span>
  );
}
