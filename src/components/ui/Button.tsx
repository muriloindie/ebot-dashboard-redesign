import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3.5 py-2 text-[13px]" : "px-5 py-3 text-sm",
        variant === "primary" && "bg-ebot-primary text-ebot-charcoal shadow-glow hover:bg-ebot-primaryHover",
        variant === "secondary" && "border border-ebot-primary/[0.15] bg-ebot-surface/70 text-ebot-dark hover:border-ebot-primary/30 hover:bg-ebot-surface",
        variant === "ghost" && "text-ebot-slate hover:bg-ebot-primary/10 hover:text-ebot-primary",
        className
      )}
      type={type}
      {...props}
    />
  );
}
