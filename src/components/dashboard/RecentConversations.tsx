"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { recentConversations } from "@/data/dashboardMock";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";

type Conversation = (typeof recentConversations)[number];

export function RecentConversations() {
  const [selected, setSelected] = useState<Conversation | null>(null);

  return (
    <>
      <GlassCard className="p-5 lg:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold tracking-[-0.03em] text-clinical-dark">Conversas recentes</h3>
            <p className="mt-2 text-sm leading-6 text-clinical-muted">Últimos atendimentos com contexto de canal e resolução.</p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-clinical-whatsapp/10 text-clinical-whatsapp">
            <MessageCircle className="size-5" />
          </div>
        </div>
        <div className="space-y-2">
          {recentConversations.map((conversation) => (
            <button
              key={`${conversation.patient}-${conversation.time}`}
              onClick={() => setSelected(conversation)}
              className="grid w-full grid-cols-[44px_1fr] gap-3 rounded-[20px] border border-transparent bg-white/55 p-3 text-left transition hover:-translate-y-0.5 hover:border-clinical-blue/20 hover:bg-white sm:grid-cols-[44px_1fr_auto]"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-clinical-blue/10 text-xs font-extrabold text-clinical-blue">{conversation.initials}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold text-clinical-dark">{conversation.patient}</span>
                <span className="mt-1 flex items-center gap-2 text-xs font-semibold text-clinical-muted">
                  <Send className="size-3 text-clinical-whatsapp" /> {conversation.summary}
                </span>
              </span>
              <span className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                <StatusPill tone={conversation.tone}>{conversation.status}</StatusPill>
                <span className="text-[11px] font-bold text-clinical-muted/70">{conversation.time}</span>
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {selected ? (
        <div className="fixed inset-0 z-[80] bg-clinical-charcoal/30 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <aside
            className="absolute bottom-0 right-0 top-auto w-full rounded-t-[32px] bg-white p-6 shadow-2xl sm:top-0 sm:max-w-md sm:rounded-l-[32px] sm:rounded-tr-none"
            onClick={(event) => event.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="mb-6 flex size-10 items-center justify-center rounded-2xl bg-clinical-blue/10 text-clinical-blue transition hover:bg-clinical-blue hover:text-white">
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-3xl bg-clinical-blue/10 text-sm font-extrabold text-clinical-blue">{selected.initials}</div>
              <div>
                <h4 className="text-2xl font-extrabold tracking-[-0.04em] text-clinical-dark">{selected.patient}</h4>
                <p className="text-sm font-semibold text-clinical-muted">{selected.summary}</p>
              </div>
            </div>
            <div className="mt-8 rounded-[24px] border border-clinical-blue/10 bg-clinical-snow p-5">
              <p className="text-sm font-extrabold text-clinical-dark">Prévia da conversa em desenvolvimento</p>
              <p className="mt-2 text-sm leading-6 text-clinical-muted">
                Este drawer já representa o comportamento de abertura. Na integração, ele receberá histórico, resumo da IA, anexos e ações de handoff.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
