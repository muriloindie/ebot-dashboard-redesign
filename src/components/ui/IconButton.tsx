import { cn } from "@/lib/cn";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/70 text-ebot-slate transition duration-300 hover:-translate-y-0.5 hover:border-ebot-primary/25 hover:text-ebot-primary hover:shadow-card focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
        className
      )}
      {...props}
    />
  );
}
