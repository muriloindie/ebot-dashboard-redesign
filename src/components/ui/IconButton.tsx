import { cn } from "@/lib/cn";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-2xl border border-clinical-blue/10 bg-white/70 text-clinical-slate transition duration-300 hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:text-clinical-blue hover:shadow-card focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
        className
      )}
      {...props}
    />
  );
}
