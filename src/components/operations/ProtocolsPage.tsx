"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Download,
  Eye,
  FileDown,
  Hash,
  LayoutGrid,
  LayoutList,
  List,
  SearchX,
  UsersRound,
  X
} from "lucide-react";
import { protocolCategories, protocolStatuses, type ProtocolRecord } from "@/data/protocolsMock";
import { listProtocols } from "@/lib/protocols/protocolsService";
import { PROTOCOL_EXPORT_FORMATS, PROTOCOL_EXPORT_SECTIONS, exportProtocol, type ProtocolExportFormat, type ProtocolExportSection } from "@/lib/protocols/protocolExport";
import { categoryMeta, ProtocolField, statusBadgeTone } from "@/components/operations/ProtocolReport";
import { usePageEnter } from "@/lib/usePageEnter";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import { PageHeader, SearchField, StatePanel, StatusBadge } from "@/components/ui/Week1Primitives";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { cn } from "@/lib/cn";

const ALL = "Todos";

export function ProtocolsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [rows, setRows] = useState<ProtocolRecord[]>(() => listProtocols());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [sector, setSector] = useState(ALL);
  const [queue, setQueue] = useState(ALL);
  const [responsible, setResponsible] = useState(ALL);
  const [view, setView] = useState<"lista" | "cards">("lista");
  const [downloading, setDownloading] = useState<ProtocolRecord | null>(null);
  const [sections, setSections] = useState<ProtocolExportSection[]>(["resumo", "dados", "mensagens"]);
  const [format, setFormat] = useState<ProtocolExportFormat>("excel");

  usePageEnter(pageRef, [
    { selector: "[data-protocol-card]", from: { opacity: 0, y: 18 } },
    { selector: "[data-search-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } }
  ], { stagger: 0.06, delay: 0.05 });

  const sectors = useMemo(() => Array.from(new Set(rows.map((row) => row.sector))).sort(), [rows]);
  const queues = useMemo(() => Array.from(new Set(rows.map((row) => row.queue))).sort(), [rows]);
  const responsibles = useMemo(() => Array.from(new Set(rows.map((row) => row.responsible))).sort(), [rows]);
  const hasFilters = category !== ALL || status !== ALL || sector !== ALL || queue !== ALL || responsible !== ALL;

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return rows.filter((row) => {
      const searchable = [row.id, row.number, row.title, row.clientName, row.clientId, row.phone, row.user, row.sector, row.queue, row.responsible, row.channel, row.summary].join(" ").toLowerCase();
      return searchable.includes(query)
        && (category === ALL || row.category === category)
        && (status === ALL || row.status === status)
        && (sector === ALL || row.sector === sector)
        && (queue === ALL || row.queue === queue)
        && (responsible === ALL || row.responsible === responsible);
    });
  }, [rows, search, category, status, sector, queue, responsible]);

  function clearFilters() {
    setSearch("");
    setCategory(ALL);
    setStatus(ALL);
    setSector(ALL);
    setQueue(ALL);
    setResponsible(ALL);
  }

  function openContact(protocol: ProtocolRecord) {
    router.push(`/contatos?q=${encodeURIComponent(protocol.phone || protocol.clientName)}`);
  }

  function openProtocol(protocol: ProtocolRecord) {
    router.push(`/protocolos/${protocol.id}`);
  }

  function toggleSection(section: ProtocolExportSection) {
    setSections((current) => (current.includes(section) ? current.filter((item) => item !== section) : [...current, section]));
  }

  function openDownload(protocol: ProtocolRecord) {
    setSections(["resumo", "dados", "mensagens"]);
    setFormat("excel");
    setDownloading(protocol);
  }

  function confirmDownload() {
    if (!downloading) return;
    if (!sections.length) return;
    const ok = exportProtocol(downloading, sections, format);
    const name = downloading.number;
    setDownloading(null);
    if (!ok) window.alert(`Não foi possível gerar o arquivo do protocolo ${name}.`);
  }

  return (
    <div ref={pageRef} data-protocols-page>
      <PageHeader
        eyebrow="Clientes / Histórico operacional"
        title="Protocolos"
        description="Cada protocolo é um atendimento específico com número único, cliente vinculado e logs completos da conversa."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-primary/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-primaryText"><LayoutList className="size-4" />{rows.length} atendimentos registrados</span>}
      />

      <div data-search-bar className="mb-4 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <SearchField value={search} onChange={(value) => { setSearch(value); setRows(listProtocols()); }} placeholder="Buscar por nº, cliente, usuário, setor ou fila" />
          <ViewSwitch
            views={[{ id: "lista", label: "Lista", icon: List }, { id: "cards", label: "Cards", icon: LayoutGrid }]}
            value={view}
            onChange={(id) => setView(id as "lista" | "cards")}
            className="self-end lg:self-auto"
          />
          {hasFilters || search ? <Button variant="secondary" size="sm" onClick={clearFilters} className="self-end lg:self-auto"><X className="size-4" />Limpar filtros</Button> : null}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          <Dropdown label="Tipo" value={category} options={[ALL, ...protocolCategories]} onChange={setCategory} />
          <Dropdown label="Status" value={status} options={[ALL, ...protocolStatuses]} onChange={setStatus} />
          <Dropdown label="Setor" value={sector} options={[ALL, ...sectors]} onChange={setSector} />
          <Dropdown label="Fila" value={queue} options={[ALL, ...queues]} onChange={setQueue} />
          <Dropdown label="Responsável" value={responsible} options={[ALL, ...responsibles]} onChange={setResponsible} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={SearchX} title="Nenhum atendimento encontrado" description="Ajuste a busca ou os filtros de tipo, status, setor e fila." action={<Button size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button>} />
      ) : view === "lista" ? (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
          <ul className="divide-y divide-ebot-border/[0.08]" aria-label="Lista de protocolos">
            {filtered.map((protocol) => (
              <li key={protocol.id} data-protocol-row data-protocol-id={protocol.id} className="flex items-center gap-3 px-3 py-2 transition hover:bg-ebot-primary/[0.035] sm:gap-4 sm:px-4">
                <span className="hidden w-36 shrink-0 font-mono text-[11px] font-extrabold text-ebot-primaryText md:block" title={protocol.number}>{protocol.number}</span>
                <span className="flex min-w-0 flex-1 items-center gap-2.5">
                  <Avatar name={protocol.clientName} size="sm" className="shrink-0" />
                  <span className="min-w-0">
                    <button type="button" onClick={() => openContact(protocol)} title="Abrir contato" className="block max-w-full truncate text-left text-[13px] font-extrabold text-ebot-dark underline-offset-2 transition hover:text-ebot-primary hover:underline">
                      {protocol.clientName}
                    </button>
                    <span className="block truncate text-[11px] font-bold text-ebot-muted">{protocol.clientId} · {protocol.user}</span>
                  </span>
                </span>
                <span className="hidden w-44 shrink-0 truncate text-[12px] font-semibold text-ebot-muted lg:block" title={`${protocol.sector} · ${protocol.queue}`}>{protocol.sector} · {protocol.queue}</span>
                <span className="hidden shrink-0 text-[12px] font-bold tabular-nums text-ebot-muted sm:block">{protocol.date}</span>
                <StatusBadge label={protocol.status} tone={statusBadgeTone(protocol.status)} />
                <span className="flex shrink-0 items-center gap-1.5">
                  <Button size="sm" variant="secondary" onClick={() => openProtocol(protocol)} aria-label={`Ver relatório do protocolo ${protocol.number}`}><Eye className="size-3.5" />Relatório</Button>
                  <button type="button" onClick={() => openDownload(protocol)} aria-label={`Baixar protocolo ${protocol.number}`} title="Baixar protocolo" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Download className="size-4" /></button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((protocol) => {
            const meta = categoryMeta[protocol.category];
            const Icon = meta.icon;
            return (
              <article key={protocol.id} data-protocol-card data-protocol-id={protocol.id} className="animate-list-in flex min-h-[278px] min-w-0 flex-col rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-ebot-primary/30 hover:shadow-card dark:shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", meta.iconClass)}><Icon className="size-5" /></span>
                  <div className="flex flex-col items-end gap-1.5"><StatusBadge label={protocol.status} tone={statusBadgeTone(protocol.status)} /><StatusBadge label={protocol.category} tone={meta.tone} /></div>
                </div>
                <p className="mt-3 flex items-center gap-1.5 font-mono text-[12px] font-extrabold text-ebot-primaryText"><Hash className="size-3.5" />{protocol.number.replace(/^#/, "")}</p>
                <div className="mt-2 flex min-w-0 items-center gap-3">
                  <Avatar name={protocol.clientName} size="md" />
                  <div className="min-w-0">
                    <button type="button" onClick={() => openContact(protocol)} title="Abrir contato" className="block max-w-full truncate text-left text-base font-extrabold tracking-tight text-ebot-dark underline-offset-2 transition hover:text-ebot-primary hover:underline">
                      {protocol.clientName}
                    </button>
                    <p className="truncate text-xs font-bold text-ebot-muted">{protocol.clientId} · {protocol.date}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 flex-1 text-[13px] leading-5 text-ebot-muted">{protocol.summary}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-ebot-border/[0.10] pt-3.5">
                  <ProtocolField label="Usuário" value={protocol.user} />
                  <ProtocolField label="Setor / Fila" value={`${protocol.sector} · ${protocol.queue}`} />
                  <ProtocolField label="Canal" value={protocol.channel} />
                  <ProtocolField label="Duração" value={protocol.duration} />
                </dl>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-ebot-muted"><UsersRound className="size-3.5 shrink-0" /><span className="truncate">{protocol.responsible}</span></span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => openProtocol(protocol)} aria-label={`Ver relatório do protocolo ${protocol.number}`}><Eye className="size-3.5" />Relatório</Button>
                    <button type="button" onClick={() => openDownload(protocol)} aria-label={`Baixar protocolo ${protocol.number}`} title="Baixar protocolo" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Download className="size-4" /></button>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={Boolean(downloading)}
        onClose={() => setDownloading(null)}
        title={downloading ? `Baixar ${downloading.number}` : "Baixar protocolo"}
        eyebrow="Protocolos / Exportação"
        description="Selecione as informações anexadas ao arquivo e o tipo de arquivo."
        icon={FileDown}
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
          <Button type="button" variant="ghost" onClick={() => setDownloading(null)}>Cancelar</Button>
          <Button onClick={confirmDownload} disabled={!sections.length}><Download className="size-4" />Baixar arquivo</Button>
        </div>
      </Modal>
    </div>
  );
}
