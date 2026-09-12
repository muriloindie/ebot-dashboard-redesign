import { Camera, Globe, Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/cn";

const channels = {
  WhatsApp: { icon: MessageCircle, className: "bg-ebot-whatsapp/10 text-ebot-whatsapp" },
  Instagram: { icon: Camera, className: "bg-ebot-primary/10 text-ebot-primary" },
  "E-mail": { icon: Mail, className: "bg-ebot-teal/10 text-ebot-teal" },
  Telefone: { icon: Phone, className: "bg-ebot-orange/10 text-ebot-orange" },
  Site: { icon: Globe, className: "bg-ebot-green/10 text-ebot-green" },
  Webchat: { icon: MessageSquare, className: "bg-ebot-primary/10 text-ebot-primary" }
} as const;

export function ChannelIcon({ channel, size = "sm", className }: { channel: string; size?: "sm" | "md"; className?: string }) {
  const config = channels[channel as keyof typeof channels] ?? channels.Webchat;
  const Icon = config.icon;
  return (
    <span
      title={channel}
      className={cn("inline-flex shrink-0 items-center justify-center rounded-xl", size === "sm" ? "size-8" : "size-9", config.className, className)}
    >
      <Icon className={size === "sm" ? "size-4" : "size-[18px]"} />
    </span>
  );
}
