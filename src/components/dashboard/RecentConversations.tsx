"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
import { recentConversations } from "@/data/dashboardMock";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";

type Conversation = (typeof recentConversations)[number];

export function RecentConversations() {
  const [selected, setSelected] = useState<Conversation | null>(null);
  const router = useRouter();

  return (
    <>
      <GlassCard className="p-4 sm:p-5 lg:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[22px] font-extrabold tracking-[-0.03em] text-ebot-dark">Conversas recentes</h3>
            <p className="mt-2 text-[15px] leading-7 text-ebot-muted">Últimos atendimentos com contexto de canal e resolução.</p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-ebot-whatsapp/10 text-ebot-whatsapp">
            <MessageCircle className="size-5" />
          </div>
        </div>
        <div className="space-y-2">
          {recentConversations.map((conversation) => (
            <button
              key={`${conversation.client}-${conversation.time}`}
              type="button"
              onClick={() => setSelected(conversation)}
              className="grid w-full grid-cols-[44px_1fr] gap-3 rounded-[22px] border border-transparent bg-ebot-surface/55 p-3 text-left transition hover:-translate-y-0.5 hover:border-ebot-primary/20 hover:bg-ebot-surface focus:outline-none focus:ring-2 focus:ring-ebot-primary/25 sm:grid-cols-[44px_1fr_auto]"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-ebot-primary/10 text-[13px] font-extrabold text-ebot-primaryText">{conversation.initials}</span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-extrabold text-ebot-dark">{conversation.client}</span>
                <span className="mt-1 flex items-center gap-2 text-[14px] font-semibold text-ebot-muted">
                  <Send className="size-3 text-ebot-whatsapp" /> {conversation.summary}
                </span>
              </span>
              <span className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                <StatusPill tone={conversation.tone}>{conversation.status}</StatusPill>
                <span className="text-[13px] font-bold text-ebot-muted/75">{conversation.time}</span>
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {selected ? (
        <div className="fixed inset-0 z-[80] bg-ebot-charcoal/30 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <aside
            className="absolute bottom-0 right-0 top-auto w-full rounded-t-[32px] bg-ebot-surface p-6 shadow-2xl sm:top-0 sm:max-w-md sm:rounded-l-[32px] sm:rounded-tr-none"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={() => setSelected(null)} aria-label="Fechar conversa" className="mb-6 flex size-10 items-center justify-center rounded-2xl bg-ebot-primary/10 text-ebot-primary transition hover:bg-ebot-primary hover:text-ebot-charcoal">
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-3xl bg-ebot-primary/10 text-sm font-extrabold text-ebot-primary">{selected.initials}</div>
              <div>
                <h4 className="text-2xl font-extrabold tracking-[-0.04em] text-ebot-dark">{selected.client}</h4>
                <p className="text-sm font-semibold text-ebot-muted">{selected.summary}</p>
              </div>
            </div>
            <div className="mt-8 rounded-[24px] border border-ebot-border/[0.10] bg-ebot-surfaceMuted p-5">
              <p className="text-sm font-extrabold text-ebot-dark">Resumo da conversa</p>
              <p className="mt-2 text-sm leading-6 text-ebot-muted">
                A IA identificou <span className="font-extrabold text-ebot-primaryText">{selected.summary}</span> e classificou este contato como <span className="font-extrabold text-ebot-primaryText">{selected.status.toLowerCase()}</span>.
              </p>
            </div>
            <button type="button" onClick={() => router.push("/atendimentos")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-ebot-primary px-4 py-3 text-sm font-extrabold text-ebot-charcoal transition hover:bg-ebot-primaryHover">Abrir na central de atendimentos <Send className="size-4" /></button>
          </aside>
        </div>
      ) : null}
    </>
  );
}
