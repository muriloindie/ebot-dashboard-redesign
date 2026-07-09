import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "blue" | "green" | "orange" | "teal" | "dark" | "whatsapp";
};

const tones = {
  blue: "border-clinical-blue/20 bg-clinical-blue/10 text-clinical-blueText",
  green: "border-clinical-green/25 bg-clinical-green/10 text-clinical-green",
  orange: "border-clinical-orange/25 bg-clinical-orange/10 text-clinical-orange",
  teal: "border-clinical-teal/25 bg-clinical-teal/10 text-clinical-teal",
  dark: "border-clinical-border/[0.15] bg-clinical-surfaceMuted text-clinical-dark",
  whatsapp: "border-clinical-whatsapp/25 bg-clinical-whatsapp/10 text-clinical-whatsapp"
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
