import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "charcoal" | "blue" | "green" | "teal" | "orange" | "whatsapp" | "muted";
  status?: "online" | "busy" | "offline";
  className?: string;
};

const sizes = {
  sm: "size-8 text-[10px] rounded-lg",
  md: "size-10 text-[11px] rounded-xl",
  lg: "size-12 text-sm rounded-xl",
  xl: "size-14 text-base rounded-2xl"
};

const tones = {
  charcoal: "bg-ebot-charcoal text-white",
  blue: "bg-ebot-primary text-ebot-charcoal",
  green: "bg-ebot-green text-white",
  teal: "bg-ebot-teal text-white",
  orange: "bg-ebot-orange text-white",
  whatsapp: "bg-ebot-whatsapp text-white",
  muted: "bg-ebot-surfaceMuted text-ebot-muted"
};

const statusStyles = {
  online: "bg-ebot-green",
  busy: "bg-ebot-orange",
  offline: "bg-ebot-muted/45"
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, src, size = "md", tone = "charcoal", status, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden font-extrabold", sizes[size], !showPhoto && tones[tone], className)} aria-label={name} role="img">
      {showPhoto ? (
        <Image src={src ?? ""} alt={name} width={64} height={64} unoptimized onError={() => setFailed(true)} className="size-full object-cover" />
      ) : (
        getInitials(name)
      )}
      {status ? (
        <span className={cn("absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-ebot-surface", statusStyles[status])} />
      ) : null}
    </span>
  );
}
