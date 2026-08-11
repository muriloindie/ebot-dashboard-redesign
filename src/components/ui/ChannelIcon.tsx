import { Camera, Globe, Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/cn";

const channels = {
  WhatsApp: { icon: MessageCircle, className: "bg-clinical-whatsapp/10 text-clinical-whatsapp" },
  Instagram: { icon: Camera, className: "bg-clinical-blue/10 text-clinical-blue" },
  "E-mail": { icon: Mail, className: "bg-clinical-teal/10 text-clinical-teal" },
  Telefone: { icon: Phone, className: "bg-clinical-orange/10 text-clinical-orange" },
  Site: { icon: Globe, className: "bg-clinical-green/10 text-clinical-green" },
  Webchat: { icon: MessageSquare, className: "bg-clinical-blue/10 text-clinical-blue" }
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
