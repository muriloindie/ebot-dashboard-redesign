import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "blue" | "green" | "orange" | "teal" | "dark" | "whatsapp";
};

const tones = {
  blue: "border-ebot-primary/20 bg-ebot-primary/10 text-ebot-primaryText",
  green: "border-ebot-green/25 bg-ebot-green/10 text-ebot-green",
  orange: "border-ebot-orange/25 bg-ebot-orange/10 text-ebot-orange",
  teal: "border-ebot-teal/25 bg-ebot-teal/10 text-ebot-teal",
  dark: "border-ebot-border/[0.15] bg-ebot-surfaceMuted text-ebot-dark",
  whatsapp: "border-ebot-whatsapp/25 bg-ebot-whatsapp/10 text-ebot-whatsapp"
};

export function Badge({ className, tone = "blue", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold leading-none",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
