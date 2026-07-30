import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-clinical-blue/25 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3.5 py-2 text-[13px]" : "px-5 py-3 text-sm",
        variant === "primary" && "bg-clinical-blue text-clinical-charcoal shadow-glow hover:bg-clinical-blueHover",
        variant === "secondary" && "border border-clinical-blue/[0.15] bg-clinical-surface/70 text-clinical-dark hover:border-clinical-blue/30 hover:bg-clinical-surface",
        variant === "ghost" && "text-clinical-slate hover:bg-clinical-blue/10 hover:text-clinical-blue",
        className
      )}
      {...props}
    />
  );
}
