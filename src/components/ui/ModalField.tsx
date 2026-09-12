"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { ElementType } from "react";
import { cn } from "@/lib/cn";

const fieldClass = "h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none transition placeholder:text-ebot-muted/65 focus:border-ebot-primary/45 focus:bg-ebot-surface focus:ring-2 focus:ring-ebot-primary/10";

export function ModalField({ label, icon: Icon, hint, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: ElementType; hint?: string }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-ebot-dark">{Icon ? <Icon className="size-4 text-ebot-primary" /> : null}{label}</span><input className={cn(fieldClass, className)} {...props} />{hint ? <span className="mt-1.5 block text-xs font-semibold text-ebot-muted">{hint}</span> : null}</label>;
}

export function ModalSelect({ label, icon: Icon, children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; icon?: ElementType }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-ebot-dark">{Icon ? <Icon className="size-4 text-ebot-primary" /> : null}{label}</span><select className={cn(fieldClass, className)} {...props}>{children}</select></label>;
}

export function ModalTextarea({ label, icon: Icon, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; icon?: ElementType }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-ebot-dark">{Icon ? <Icon className="size-4 text-ebot-primary" /> : null}{label}</span><textarea className={cn("min-h-[96px] w-full resize-y rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 p-3 text-sm font-semibold text-ebot-dark outline-none transition placeholder:text-ebot-muted/65 focus:border-ebot-primary/45 focus:bg-ebot-surface focus:ring-2 focus:ring-ebot-primary/10", className)} {...props} /></label>;
}

export function ModalChoice({ label, icon: Icon, active, onClick, description }: { label: string; icon: ElementType; active: boolean; onClick: () => void; description: string }) {
  return <button type="button" onClick={onClick} className={cn("flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition", active ? "border-ebot-primary/30 bg-ebot-primary/[0.09]" : "border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 hover:border-ebot-primary/20 hover:bg-ebot-primary/[0.05]")}><span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", active ? "bg-ebot-primary text-ebot-charcoal" : "bg-ebot-surface text-ebot-muted")}><Icon className="size-4" /></span><span><span className="block text-sm font-extrabold text-ebot-dark">{label}</span><span className="mt-0.5 block text-xs leading-5 text-ebot-muted">{description}</span></span></button>;
}
