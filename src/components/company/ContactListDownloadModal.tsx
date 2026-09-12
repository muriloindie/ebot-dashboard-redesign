"use client";

import { useState } from "react";
import { Check, Download, FileDown } from "lucide-react";
import { listContactEntries } from "@/lib/company/companyService";
import type { ContactList } from "@/lib/company/types";
import { EXPORT_FORMATS, exportContactList, type ExportFormat } from "@/lib/company/contactListExport";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

export function ContactListDownloadModal({ list, open, onClose, onDone }: { list: ContactList | null; open: boolean; onClose: () => void; onDone: (message: string) => void }) {
  const [format, setFormat] = useState<ExportFormat>("excel");

  function download() {
    if (!list) return;
    const entries = listContactEntries(list.id);
    const ok = exportContactList(list.name, entries, format);
    onClose();
    onDone(ok ? `Lista "${list.name}" baixada (${entries.length} contatos).` : `Não foi possível abrir a exportação de "${list.name}".`);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={list ? `Baixar "${list.name}"` : "Baixar lista"}
      eyebrow="Comunicação / Listas"
      description="Escolha o tipo de arquivo para baixar os contatos da lista."
      icon={FileDown}
      className="max-w-md"
    >
      <div className="space-y-2" role="radiogroup" aria-label="Tipo de arquivo">
        {EXPORT_FORMATS.map((item) => {
          const active = format === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFormat(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
                active ? "border-ebot-primary/40 bg-ebot-primary/[0.08]" : "border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 hover:border-ebot-primary/25"
              )}
            >
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", active ? "bg-ebot-primary text-ebot-charcoal" : "bg-ebot-surfaceMuted text-ebot-muted")}>
                <Download className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-ebot-dark">{item.label}</span>
                <span className="block truncate text-[11px] font-bold text-ebot-muted">{item.hint}</span>
              </span>
              <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", active ? "border-ebot-primary bg-ebot-primary text-ebot-charcoal" : "border-ebot-border/[0.20]")}>
                {active ? <Check className="size-3.5" /> : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={download}><Download className="size-4" />Baixar arquivo</Button>
      </div>
    </Modal>
  );
}
