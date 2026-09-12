"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Eye, SearchX } from "lucide-react";
import { getProtocol } from "@/lib/protocols/protocolsService";
import { PROTOCOL_EXPORT_FORMATS, PROTOCOL_EXPORT_SECTIONS, exportProtocol, type ProtocolExportFormat, type ProtocolExportSection } from "@/lib/protocols/protocolExport";
import { ProtocolReport, categoryMeta, statusBadgeTone } from "@/components/operations/ProtocolReport";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageHeader, StatePanel, StatusBadge } from "@/components/ui/Week1Primitives";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function ProtocolDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const protocol = useMemo(() => getProtocol(params?.id ?? ""), [params?.id]);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [sections, setSections] = useState<ProtocolExportSection[]>(["resumo", "dados", "mensagens"]);
  const [format, setFormat] = useState<ProtocolExportFormat>("excel");

  if (!protocol) {
    return (
      <StatePanel
        icon={SearchX}
        title="Protocolo não encontrado"
        description="O atendimento que você procura pode ter sido removido."
        action={<Button onClick={() => router.push("/protocolos")}>Voltar para protocolos</Button>}
      />
    );
  }

  const meta = categoryMeta[protocol.category];

  const openContact = () => {
    router.push(`/contatos?q=${encodeURIComponent(protocol.phone || protocol.clientName)}`);
  };

  const toggleSection = (section: ProtocolExportSection) => {
    setSections((current) => (current.includes(section) ? current.filter((item) => item !== section) : [...current, section]));
  };

  const confirmDownload = () => {
    if (!sections.length) return;
    const ok = exportProtocol(protocol, sections, format);
    setDownloadOpen(false);
    if (!ok) window.alert(`Não foi possível gerar o arquivo do protocolo ${protocol.number}.`);
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => router.push("/protocolos")} className="flex items-center gap-1.5 text-[13px] font-extrabold text-ebot-primary transition hover:text-ebot-primaryHover">
        <ArrowLeft className="size-4" />Protocolos
      </button>

      <PageHeader
        eyebrow={`Atendimento · ${protocol.title}`}
        title={`Relatório ${protocol.number}`}
        description={`${protocol.clientName} · ${protocol.date} · visualização somente leitura`}
        aside={<StatusBadge label={protocol.status} tone={statusBadgeTone(protocol.status)} />}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => { setSections(["resumo", "dados", "mensagens"]); setFormat("excel"); setDownloadOpen(true); }}><Download className="size-4" />Baixar</Button>
          </div>
        }
      />

      <div className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
        <div className="mb-4 flex items-center gap-3">
          <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", meta.iconClass)}><Eye className="size-5" /></span>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">{protocol.category} · {protocol.channel}</p>
            <p className="font-mono text-[13px] font-extrabold text-ebot-primaryText">{protocol.number}</p>
          </div>
        </div>
        <ProtocolReport protocol={protocol} onOpenContact={openContact} />
      </div>

      <Modal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        title={`Baixar ${protocol.number}`}
        eyebrow="Protocolos / Exportação"
        description="Selecione as informações anexadas ao arquivo e o tipo de arquivo."
        icon={Download}
        className="max-w-md"
      >
        <p className="mb-2 text-sm font-extrabold text-ebot-dark">Informações anexadas</p>
        <div className="space-y-2" role="group" aria-label="Informações anexadas">
          {PROTOCOL_EXPORT_SECTIONS.map((item) => {
            const active = sections.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggleSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
                  active ? "border-ebot-primary/40 bg-ebot-primary/[0.08]" : "border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 hover:border-ebot-primary/25"
                )}
              >
                <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-md border", active ? "border-ebot-primary bg-ebot-primary text-ebot-charcoal" : "border-ebot-border/[0.20] bg-ebot-surface")}>
                  {active ? <Check className="size-3.5" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold text-ebot-dark">{item.label}</span>
                  <span className="block truncate text-[11px] font-bold text-ebot-muted">{item.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mb-2 mt-4 text-sm font-extrabold text-ebot-dark">Tipo de arquivo</p>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de arquivo">
          {PROTOCOL_EXPORT_FORMATS.map((item) => {
            const active = format === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFormat(item.id)}
                className={cn(
                  "rounded-2xl border p-3 text-left transition",
                  active ? "border-ebot-primary/40 bg-ebot-primary/[0.08]" : "border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 hover:border-ebot-primary/25"
                )}
              >
                <span className="block text-sm font-extrabold text-ebot-dark">{item.label}</span>
                <span className="block truncate text-[11px] font-bold text-ebot-muted">{item.hint}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
          <Button type="button" variant="ghost" onClick={() => setDownloadOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDownload} disabled={!sections.length}><Download className="size-4" />Baixar arquivo</Button>
        </div>
      </Modal>
    </div>
  );
}
