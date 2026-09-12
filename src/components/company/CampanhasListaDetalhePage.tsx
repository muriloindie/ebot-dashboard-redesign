"use client";

import { useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ClipboardPaste,
  Download,
  FileUp,
  Filter,
  ListPlus,
  SearchX,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Trash2,
  UserPlus,
  Users
} from "lucide-react";
import { deleteContactEntry, listContactEntries, listContactLists, newCompanyId, saveContactEntry, saveContactList } from "@/lib/company/companyService";
import type { ContactEntry, ContactList } from "@/lib/company/types";
import { listContacts, saveContacts } from "@/lib/contacts/contactsService";
import { CSV_FORMAT_HINT, isValidPhone, parseContactCsv, type ParsedImport } from "@/lib/company/contactListExport";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { ContactListDownloadModal } from "@/components/company/ContactListDownloadModal";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect } from "@/components/ui/ModalField";
import { SegmentedTabs, StatusBadge, PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const statusMeta: Record<ContactList["status"], { label: string; chip: string }> = {
  ready: { label: "Pronta", chip: "bg-ebot-green/[0.12] text-ebot-green" },
  syncing: { label: "Sincronizando", chip: "bg-ebot-primary/[0.10] text-ebot-primaryText" },
  error: { label: "Erro de sincronização", chip: "bg-ebot-red/[0.12] text-ebot-red" }
};

const emptyEntry = { name: "", phone: "", channel: "WhatsApp" as ContactEntry["channel"] };

export function CampanhasListaDetalhePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast, profile } = useDemo();
  const list = useMemo(() => listContactLists().find((item) => item.id === params?.id) ?? null, [params?.id]);
  const [entries, setEntries] = useState<ContactEntry[]>(() => listContactEntries(params?.id));
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "invalid">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<ParsedImport[] | null>(null);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [entry, setEntry] = useState(emptyEntry);
  const [bulkText, setBulkText] = useState("");
  const [deleting, setDeleting] = useState<ContactEntry | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const consented = entries.filter((item) => item.consent).length;
  const invalidEntries = useMemo(() => entries.filter((item) => !item.consent || !isValidPhone(item.phone)), [entries]);

  const filtered = useMemo(() => {
    const base = tab === "invalid" ? invalidEntries : entries;
    return base.filter((item) => `${item.name} ${item.phone} ${item.channel}`.toLowerCase().includes(query.toLowerCase()));
  }, [entries, invalidEntries, query, tab]);

  if (!list) {
    return (
      <StatePanel
        icon={SearchX}
        title="Lista não encontrada"
        description="A lista que você procura pode ter sido excluída."
        action={<Button onClick={() => router.push("/campanhas/listas")}>Voltar para listas</Button>}
      />
    );
  }

  function reload() {
    if (!list) return;
    setEntries(listContactEntries(list.id));
  }

  function bumpSize(delta: number) {
    if (!list) return;
    saveContactList({ ...list, size: list.size + delta, lastSync: "agora", updatedAt: "agora" });
  }

  function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!list) return;
    if (!entry.name.trim() || !entry.phone.trim()) {
      toast("Informe nome e telefone do contato.", "warning");
      return;
    }
    saveContactEntry({
      id: newCompanyId("ent"),
      listId: list.id,
      name: entry.name.trim(),
      phone: entry.phone.trim(),
      channel: entry.channel,
      consent: true,
      addedAt: "agora",
      addedBy: profile.name
    });
    bumpSize(1);
    reload();
    setAddOpen(false);
    setEntry(emptyEntry);
    toast(`"${entry.name}" adicionado à lista ${list.name}.`);
  }

  function handleCsvFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseContactCsv(String(reader.result ?? ""));
      if (!parsed.length) {
        toast("Nenhum contato encontrado no arquivo.", "warning");
        return;
      }
      setImportPreview(parsed);
    };
    reader.readAsText(file, "utf-8");
  }

  function confirmImport(saveToClients: boolean) {
    if (!list || !importPreview) return;
    const valid = importPreview.filter((item) => item.valid);
    valid.forEach((item) => {
      saveContactEntry({
        id: newCompanyId("ent"),
        listId: list.id,
        name: item.name,
        phone: item.phone,
        channel: item.channel,
        consent: false,
        addedAt: "agora",
        addedBy: profile.name
      });
    });
    if (saveToClients) {
      const existing = new Set(listContacts().map((contact) => contact.phone.replace(/\D/g, "")));
      const fresh = valid.filter((item) => !existing.has(item.phone.replace(/\D/g, "")));
      if (fresh.length) {
        saveContacts([
          ...fresh.map((item, index) => ({
            id: `ctc-import-${Date.now().toString(36)}-${index}`,
            name: item.name,
            phone: item.phone,
            email: "",
            channel: (item.channel === "E-mail" ? "E-mail" : item.channel === "Instagram" ? "Instagram" : "WhatsApp") as "WhatsApp" | "Instagram" | "E-mail",
            stage: "Novo contato" as const,
            isClient: false,
            lastActivity: "agora",
            tags: [] as string[],
            history: [],
            nextEvents: []
          })),
          ...listContacts()
        ]);
      }
    }
    bumpSize(valid.length);
    reload();
    setDestinationOpen(false);
    setImportOpen(false);
    setImportPreview(null);
    const invalid = importPreview.length - valid.length;
    toast(
      saveToClients
        ? `${valid.length} contato(s) na lista e novos salvos nos contatos da empresa${invalid ? ` · ${invalid} inválido(s) ignorado(s)` : ""}.`
        : `${valid.length} contato(s) adicionados somente a esta lista${invalid ? ` · ${invalid} inválido(s) ignorado(s)` : ""}.`
    );
  }

  function addBulk() {
    if (!list) return;
    const lines = bulkText.split(/[\n,;]+/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) {
      toast("Cole pelo menos um telefone (um por linha).", "warning");
      return;
    }
    lines.forEach((phone, index) => {
      saveContactEntry({
        id: newCompanyId("ent"),
        listId: list.id,
        name: `Contato importado ${index + 1}`,
        phone,
        channel: "WhatsApp",
        consent: false,
        addedAt: "agora",
        addedBy: profile.name
      });
    });
    bumpSize(lines.length);
    reload();
    setBulkOpen(false);
    setBulkText("");
    toast(`${lines.length} contato(s) importado(s). Confirme o consentimento antes de enviar campanhas.`);
  }

  function remove() {
    if (!deleting) return;
    deleteContactEntry(deleting.id);
    bumpSize(-1);
    reload();
    setDeleting(null);
    toast(`"${deleting.name}" removido da lista.`);
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => router.push("/campanhas/listas")} className="flex items-center gap-1.5 text-[13px] font-extrabold text-ebot-primary transition hover:text-ebot-primaryHover">
        <ArrowLeft className="size-4" />Listas de contatos
      </button>

      <PageHeader
        eyebrow="Comunicação / Listas de contatos"
        title={list.name}
        description={list.description}
        aside={
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold", statusMeta[list.status].chip)}>
            {statusMeta[list.status].label}
          </span>
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => { setImportPreview(null); setImportOpen(true); }}><FileUp className="size-4" />Importar</Button>
            <Button variant="secondary" onClick={() => setDownloading(true)}><Download className="size-4" />Baixar</Button>
            <Button onClick={() => setAddOpen(true)}><UserPlus className="size-4" />Novo</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-[20px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-4">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primary"><Users className="size-5" /></span>
          <div><p className="text-lg font-extrabold leading-5 text-ebot-dark">{entries.length}</p><p className="text-[11px] font-bold text-ebot-muted">contatos nesta tela (amostra)</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-[20px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-4">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-ebot-green/[0.12] text-ebot-green"><ShieldCheck className="size-5" /></span>
          <div><p className="text-lg font-extrabold leading-5 text-ebot-dark">{consented}</p><p className="text-[11px] font-bold text-ebot-muted">com opt-in vigente</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-[20px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-4">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-ebot-teal/[0.10] text-ebot-teal"><Filter className="size-5" /></span>
          <div className="min-w-0"><p className="text-[11px] font-bold text-ebot-muted">Segmentação:</p><p className="truncate text-[12px] font-extrabold text-ebot-dark">{list.filters.join(" · ") || "Sem filtros combinados"}</p></div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md flex-1"><SearchField value={query} onChange={setQuery} placeholder="Buscar contato por nome ou telefone" /></div>
        <SegmentedTabs
          tabs={[
            { id: "all", label: "Todos", count: entries.length },
            { id: "invalid", label: "Inválidos", count: invalidEntries.length }
          ]}
          value={tab}
          onChange={(id) => setTab(id as "all" | "invalid")}
        />
      </div>
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-ebot-muted"><ShieldAlert className="size-3.5" />Inválidos: sem opt-in vigente ou telefone fora do padrão · Última sincronização: {list.lastSync} · criada por {list.createdBy}</p>

      {filtered.length === 0 ? (
        <StatePanel
          icon={ListPlus}
          title="Nenhum contato nesta lista ainda"
          description="Adicione contatos manualmente ou importe em lote colando a lista de telefones."
          action={<Button size="sm" onClick={() => setAddOpen(true)}><UserPlus className="size-4" />Adicionar contato</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <div className="ebot-scrollbar overflow-x-auto" tabIndex={0} aria-label="Contatos da lista">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">Contatos da lista {list.name}</caption>
              <thead className="border-b border-ebot-border/[0.12] bg-ebot-surfaceMuted/60 text-[11px] font-extrabold uppercase tracking-[0.09em] text-ebot-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Contato</th>
                  <th scope="col" className="px-4 py-3.5">Canal</th>
                  <th scope="col" className="px-4 py-3.5">Consentimento</th>
                  <th scope="col" className="px-4 py-3.5">Adicionado</th>
                  <th scope="col" className="px-4 py-3.5">Por</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ebot-border/[0.10]">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition hover:bg-ebot-primary/[0.035]">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-extrabold text-ebot-dark">{item.name}</p>
                      <p className="text-[11px] font-bold text-ebot-muted">{item.phone}</p>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge label={item.channel} tone={item.channel === "WhatsApp" ? "green" : item.channel === "Instagram" ? "neutral" : "orange"} /></td>
                    <td className="px-4 py-3.5">
                      {item.consent ? (
                        <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-ebot-green"><ShieldCheck className="size-3.5" />Opt-in vigente</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-ebot-orange"><ShieldX className="size-3.5" />Pendente</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-ebot-slate">{item.addedAt}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-ebot-slate">{item.addedBy}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end">
                        <button onClick={() => setDeleting(item)} title={`Remover ${item.name}`} aria-label={`Remover ${item.name}`} className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-red/10 hover:text-ebot-red"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Adicionar contato à lista"
        eyebrow={list.name}
        description="O contato entra na listagem e pode receber campanhas quando o opt-in estiver vigente."
        icon={UserPlus}
      >
        <form onSubmit={addEntry} className="space-y-4">
          <ModalField label="Nome" value={entry.name} onChange={(event) => setEntry({ ...entry, name: event.target.value })} placeholder="Ex.: Maria Oliveira" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField label="Telefone / usuário" value={entry.phone} onChange={(event) => setEntry({ ...entry, phone: event.target.value })} placeholder="+55 46 99999-0000" required />
            <ModalSelect label="Canal" value={entry.channel} onChange={(event) => setEntry({ ...entry, channel: event.target.value as ContactEntry["channel"] })}>
              <option>WhatsApp</option><option>Instagram</option><option>E-mail</option>
            </ModalSelect>
          </div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button type="submit"><Check className="size-4" />Adicionar à lista</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Importar contatos em lote"
        eyebrow={list.name}
        description="Cole os telefones (um por linha) para adicionar vários contatos de uma vez."
        icon={ClipboardPaste}
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Telefones</span>
            <textarea
              rows={6}
              value={bulkText}
              onChange={(event) => setBulkText(event.target.value)}
              placeholder={"+55 46 99999-0001\n+55 46 99999-0002\n+55 46 99999-0003"}
              className="w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 p-3 font-mono text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10"
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setBulkOpen(false)}>Cancelar</Button>
            <Button onClick={addBulk}><ListPlus className="size-4" />Importar contatos</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={importOpen}
        onClose={() => { setImportOpen(false); setImportPreview(null); }}
        title="Importar contatos (.csv)"
        eyebrow={list.name}
        description="Selecione o arquivo e confira a prévia antes de concluir."
        icon={FileUp}
        className="max-w-xl"
      >
        <div className="space-y-4">
          <p className="rounded-2xl border border-ebot-primary/[0.18] bg-ebot-primary/[0.06] p-3 font-mono text-[12px] font-bold leading-5 text-ebot-primaryText">{CSV_FORMAT_HINT}</p>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" aria-label="Arquivo CSV" onChange={(event) => handleCsvFile(event.target.files?.[0])} />
          <Button variant="secondary" onClick={() => fileRef.current?.click()}><FileUp className="size-4" />Selecionar arquivo .csv</Button>
          {importPreview ? (
            <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-3">
              <p className="text-[13px] font-extrabold text-ebot-dark">
                {importPreview.filter((item) => item.valid).length} válido(s) · {importPreview.filter((item) => !item.valid).length} inválido(s)
              </p>
              <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto">
                {importPreview.slice(0, 20).map((item, index) => (
                  <li key={`${item.phone}-${index}`} className={cn("flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-[12px] font-bold", item.valid ? "bg-ebot-surface text-ebot-slate" : "bg-ebot-red/[0.07] text-ebot-red")}>
                    <span className="truncate">{item.name} · {item.phone}</span>
                    <span>{item.valid ? item.channel : "inválido"}</span>
                  </li>
                ))}
              </ul>
              {importPreview.length > 20 ? <p className="mt-1.5 text-[11px] font-bold text-ebot-muted">+ {importPreview.length - 20} outros…</p> : null}
            </div>
          ) : null}
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => { setImportOpen(false); setImportPreview(null); }}>Cancelar</Button>
            <Button onClick={() => setDestinationOpen(true)} disabled={!importPreview?.some((item) => item.valid)}><Check className="size-4" />Concluir importação</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={destinationOpen}
        onClose={() => setDestinationOpen(false)}
        title="Onde salvar os contatos?"
        eyebrow={list.name}
        description="Escolha se os contatos importados ficam só nesta lista ou se os novos também entram nos contatos da empresa."
        icon={Users}
        className="max-w-md"
      >
        <div className="space-y-2">
          <Button className="w-full" onClick={() => confirmImport(false)}>Somente nesta lista</Button>
          <Button variant="secondary" className="w-full" onClick={() => confirmImport(true)}>Salvar novos também nos contatos da empresa</Button>
          <Button variant="ghost" className="w-full" onClick={() => setDestinationOpen(false)}>Voltar</Button>
        </div>
      </Modal>

      <ContactListDownloadModal list={list} open={downloading} onClose={() => setDownloading(false)} onDone={(message) => toast(message)} />

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Remover contato da lista?"
        description={deleting ? `"${deleting.name}" deixará de receber campanhas desta lista.` : ""}
        confirmLabel="Remover"
      />
    </div>
  );
}
