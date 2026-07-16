import { cn } from "@/lib/cn";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return <div className={cn("glass-card w-full max-w-full rounded-[28px]", className)} {...props} />;
}
