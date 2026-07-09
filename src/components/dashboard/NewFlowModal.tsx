"use client";

import { useState } from "react";
import { Bot, Check, ChevronDown, Loader2, MessageSquareText, UserRoundCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

const triggers = [
  { id: "whatsapp", label: "Mensagem no WhatsApp", icon: MessageSquareText },
  { id: "ia", label: "Intenção detectada pela IA", icon: Bot },
  { id: "human", label: "Transferência humana", icon: UserRoundCheck }
];

const actions = [
  { id: "message", label: "Enviar mensagem" },
  { id: "question", label: "Fazer pergunta" },
  { id: "openai", label: "Gerar resposta com Open.AI" },
  { id: "handoff", label: "Transferir para humano" }
];

export function NewFlowModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("whatsapp");
  const [channel, setChannel] = useState("whatsapp");
  const [selectedActions, setSelectedActions] = useState<string[]>(["message"]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleAction(actionId: string) {
    setSelectedActions((current) =>
      current.includes(actionId) ? current.filter((id) => id !== actionId) : [...current, actionId]
    );
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setName("");
        setSelectedActions(["message"]);
        onClose();
      }, 1200);
    }, 1200);
  }

  return (
    <Modal open={open} onClose={onClose} title="Criar novo fluxo" className="max-w-lg">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.10em] text-clinical-muted">Nome do fluxo</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex: Confirmação de consulta"
            className="w-full rounded-2xl border border-clinical-blue/15 bg-clinical-surface/70 px-4 py-3 text-sm font-semibold text-clinical-dark outline-none placeholder:text-clinical-muted/60 focus:border-clinical-blue/35 focus:bg-clinical-surface"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.10em] text-clinical-muted">Gatilho</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {triggers.map((item) => {
              const Icon = item.icon;
              const active = trigger === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTrigger(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition",
                    active ? "border-clinical-blue bg-clinical-blue/[0.08]" : "border-clinical-border/[0.10] bg-clinical-surface/60 hover:bg-clinical-surface"
                  )}
                >
                  <Icon className={cn("size-5", active ? "text-clinical-blue" : "text-clinical-muted")} />
                  <span className={cn("text-[13px] font-bold", active ? "text-clinical-blueText" : "text-clinical-slate")}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.10em] text-clinical-muted">Canal</label>
          <div className="relative">
            <select
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-clinical-blue/15 bg-clinical-surface/70 px-4 py-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/35 focus:bg-clinical-surface"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="webchat">Webchat</option>
              <option value="todos">Todos os canais</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-clinical-muted" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.10em] text-clinical-muted">Ações do fluxo</label>
          <div className="space-y-2">
            {actions.map((action) => {
              const active = selectedActions.includes(action.id);
              return (
                <button
                  key={action.id}
                  onClick={() => toggleAction(action.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                    active ? "border-clinical-blue bg-clinical-blue/[0.08] text-clinical-blueText" : "border-clinical-border/[0.10] bg-clinical-surface/60 text-clinical-slate hover:bg-clinical-surface"
                  )}
                >
                  {action.label}
                  {active ? <Check className="size-4" /> : <span className="size-4 rounded-full border border-clinical-blue/30" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={onClose}
          disabled={saving || saved}
          className="flex-1 rounded-2xl border border-clinical-blue/15 bg-clinical-surface px-4 py-3 text-sm font-bold text-clinical-slate transition hover:bg-clinical-blue/10 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving || saved || !name.trim()}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-clinical-blue px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-clinical-blueHover disabled:opacity-80"
        >
          {saved ? <Check className="size-4" /> : saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saved ? "Salvo!" : saving ? "Salvando..." : "Criar fluxo"}
        </button>
      </div>
    </Modal>
  );
}
