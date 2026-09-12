"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Camera,
  Check,
  Download,
  FileDown,
  FileUp,
  Headphones,
  History,
  LayoutGrid,
  List,
  Mail,
  Pencil,
  Phone,
  RadioTower,
  RefreshCw,
  Save,
  SearchX,
  Stethoscope,
  Tags,
  UploadCloud,
  UserPlus,
  UserRound,
  UserRoundCheck,
  X
} from "lucide-react";
import { contactChannels, contactStages, type Contact, type ContactStage } from "@/data/contactsMock";
import { usePageEnter } from "@/lib/usePageEnter";
import { listContacts, saveContacts } from "@/lib/contacts/contactsService";
import type { UnifiedContact } from "@/lib/contacts/types";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalChoice, ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { ChannelIcon } from "@/components/ui/ChannelIcon";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { PageHeader, SearchField, StatePanel, StatusBadge, TableCell, TableHeaderCell, TableHead, TableSurface } from "@/components/ui/Week1Primitives";

const ALL = "Todos";
type ViewMode = "lista" | "cards";

const stageTone: Record<ContactStage, "blue" | "orange" | "green" | "neutral"> = {
  "Novo contato": "blue",
  "Em atendimento": "orange",
  Qualificado: "orange",
  Agendado: "blue",
  Convertido: "green",
  Inativo: "neutral"
};

function statusLabel(contact: UnifiedContact) {
  return contact.isClient ? contact.clientStatus ?? "Cliente" : contact.stage;
}

function statusTone(contact: UnifiedContact): "blue" | "green" | "orange" | "neutral" {
  if (contact.isClient) {
    return contact.clientStatus === "Ativo" ? "green" : contact.clientStatus === "Novo" ? "blue" : "neutral";
  }
  return stageTone[contact.stage];
}

function recordTypeLabel(contact: UnifiedContact) {
  return contact.isClient ? "Cliente" : "Contato";
}

function PhotoPicker({ value, onChange, name }: { value?: string; onChange: (dataUrl: string | undefined) => void; name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-4">
      <span className="relative shrink-0">
        <Avatar name={name} src={value} size="lg" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Escolher foto de perfil"
          className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-ebot-border/[0.12] bg-ebot-surface text-ebot-primary shadow-sm transition hover:bg-ebot-primary hover:text-ebot-charcoal"
        >
          <Camera className="size-3.5" />
        </button>
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-ebot-dark">Foto do contato</span>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>Escolher foto</Button>
          {value ? <Button type="button" size="sm" variant="ghost" onClick={() => onChange(undefined)}>Remover</Button> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(file);
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}

function ContactForm({
  initial,
  agents,
  units,
  onSubmit,
  onCancel,
  submitLabel
}: {
  initial?: UnifiedContact;
  agents: string[];
  units: string[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>, photo?: string) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [photo, setPhoto] = useState(initial?.photo);

  return (
    <form key={initial?.id ?? "new-contact"} onSubmit={(event) => onSubmit(event, photo)} className="space-y-5">
      <PhotoPicker value={photo} name={initial?.name ?? "Novo contato"} onChange={setPhoto} />
      <div className="grid gap-4 sm:grid-cols-2">
        <ModalField name="name" label="Nome completo" icon={UserRound} defaultValue={initial?.name} placeholder="Ex.: Camila Rodrigues" required className="sm:col-span-2" />
        <ModalField name="phone" label="Telefone / WhatsApp" icon={Phone} defaultValue={initial?.phone} placeholder="+55 11 99999-9999" required />
        <ModalField name="email" label="E-mail" icon={Mail} type="email" defaultValue={initial?.email} placeholder="contato@email.com" />
        <ModalField name="cpf" label="CPF" icon={UserRound} defaultValue={initial?.cpf} placeholder="000.000.000-00" />
        <ModalField name="birthDate" label="Data de nascimento" icon={CalendarDays} defaultValue={initial?.birthDate} placeholder="DD/MM/AAAA" />
        <ModalSelect name="gender" label="Gênero" icon={UserRound} defaultValue={initial?.gender ?? "Feminino"}>
          <option>Feminino</option>
          <option>Masculino</option>
        </ModalSelect>
        <ModalSelect name="channel" label="Canal de origem" icon={RadioTower} defaultValue={initial?.channel ?? "WhatsApp"}>
          {contactChannels.map((item) => <option key={item}>{item}</option>)}
        </ModalSelect>
        {!initial?.isClient ? (
          <ModalSelect name="stage" label="Etapa do contato" icon={Tags} defaultValue={initial?.stage ?? "Novo contato"}>
            {contactStages.map((item) => <option key={item}>{item}</option>)}
          </ModalSelect>
        ) : null}
        {initial?.isClient ? (
          <ModalSelect name="clientStatus" label="Status do cliente" icon={UserRoundCheck} defaultValue={initial.clientStatus ?? "Ativo"}>
            <option>Ativo</option>
            <option>Novo</option>
            <option>Inativo</option>
          </ModalSelect>
        ) : null}
        <ModalField name="origin" label="Origem" icon={Tags} defaultValue={initial?.origin} placeholder="Ex.: Campanha de retorno" />
        <ModalField name="responsible" label="Responsável" icon={UserRound} defaultValue={initial?.responsible} placeholder="Ex.: Marina Costa" />
        <ModalSelect name="agent" label="Atendente" icon={Stethoscope} defaultValue={initial?.agent ?? agents[0] ?? ""}>
          <option value="">Não atribuído</option>
          {agents.map((item) => <option key={item}>{item}</option>)}
        </ModalSelect>
        <ModalSelect name="unit" label="Filial" icon={Stethoscope} defaultValue={initial?.unit ?? units[0] ?? ""}>
          <option value="">Não informada</option>
          {units.map((item) => <option key={item}>{item}</option>)}
        </ModalSelect>
        {!initial ? <ModalField name="tag" label="Tag inicial" icon={Tags} placeholder="Ex.: Primeiro contato" /> : null}
        <ModalTextarea name="notes" label="Observações" icon={History} defaultValue={initial?.notes} placeholder="Informações úteis para a equipe." className="sm:col-span-2" />
      </div>
      <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit"><Save className="size-4" />{submitLabel}</Button>
      </div>
    </form>
  );
}

export function ContactsPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const drawerPhotoRef = useRef<HTMLInputElement>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const [rows, setRows] = useState<UnifiedContact[]>([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState(ALL);
  const [channel, setChannel] = useState(ALL);
  const [recordType, setRecordType] = useState(ALL);
  const [unit, setUnit] = useState(ALL);
  const [responsible, setResponsible] = useState(ALL);
  const [tag, setTag] = useState(ALL);
  const [view, setView] = useState<ViewMode>("lista");
  const [selected, setSelected] = useState<UnifiedContact | null>(null);
  const [modal, setModal] = useState<"add" | "import" | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-search-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } },
    { selector: "[data-contact-item]", from: { opacity: 0, x: -12 }, to: { duration: 0.3, ease: "power2.out" } }
  ], { stagger: 0.04, delay: 0.05 });

  useEffect(() => {
    const cachedRows = listContacts();
    setRows(cachedRows);
    const query = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    if (!query) return;
    setSearch(query);
    const normalizedQuery = query.toLowerCase();
    const linked = cachedRows.find((row) => [row.name, row.id, row.phone, row.email, row.cpf].filter(Boolean).some((value) => value?.toLowerCase() === normalizedQuery));
    if (linked) setSelected(linked);
  }, []);

  useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
  }, []);

  const channels = Array.from(new Set(rows.map((row) => row.channel)));
  const units = Array.from(new Set(rows.map((row) => row.unit).filter((value): value is string => Boolean(value)))).sort();
  const responsibles = Array.from(new Set(rows.map((row) => row.responsible).filter((value): value is string => Boolean(value)))).sort();
  const tags = Array.from(new Set(rows.flatMap((row) => row.tags).filter((value) => value.trim()))).sort();
  const hasFilters = stage !== ALL || channel !== ALL || recordType !== ALL || unit !== ALL || responsible !== ALL || tag !== ALL;

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return rows.filter((row) => {
      const searchable = [row.name, row.phone, row.email, row.cpf, row.id, row.channel, row.lastActivity, row.origin, row.responsible, row.agent, row.unit, ...row.tags].filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(query)
        && (stage === ALL || row.stage === stage)
        && (channel === ALL || row.channel === channel)
        && (recordType === ALL || (recordType === "Clientes" ? row.isClient : !row.isClient))
        && (unit === ALL || row.unit === unit)
        && (responsible === ALL || row.responsible === responsible)
        && (tag === ALL || row.tags.includes(tag));
    });
  }, [rows, search, stage, channel, recordType, unit, responsible, tag]);

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 3200);
  }

  function persist(next: UnifiedContact[]) {
    setRows(next);
    saveContacts(next);
  }

  function changeStage(id: string, nextStage: ContactStage) {
    const nextRows = rows.map((row) => row.id === id ? { ...row, stage: nextStage } : row);
    persist(nextRows);
    if (selected?.id === id) setSelected(nextRows.find((row) => row.id === id) ?? null);
    showNotice(`Contato movido para "${nextStage}".`);
  }

  function updatePhoto(id: string, photo: string | undefined) {
    const nextRows = rows.map((row) => row.id === id ? { ...row, photo } : row);
    persist(nextRows);
    if (selected?.id === id) setSelected(nextRows.find((row) => row.id === id) ?? null);
    showNotice(photo ? "Foto de perfil atualizada." : "Foto de perfil removida.");
  }

  function updateContact(event: React.FormEvent<HTMLFormElement>, photo?: string) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!name || !phone) {
      showNotice("Informe o nome e o telefone do contato.");
      return;
    }

    const clientStatus = selected.isClient ? String(form.get("clientStatus") ?? selected.clientStatus ?? "Ativo") as UnifiedContact["clientStatus"] : undefined;
    const next: UnifiedContact = {
      ...selected,
      name,
      phone,
      email: String(form.get("email") ?? "").trim(),
      cpf: String(form.get("cpf") ?? "").trim() || undefined,
      birthDate: String(form.get("birthDate") ?? "").trim() || undefined,
      gender: String(form.get("gender") ?? selected.gender ?? "Feminino") as UnifiedContact["gender"],
      channel: String(form.get("channel") ?? selected.channel) as Contact["channel"],
      stage: selected.isClient
        ? clientStatus === "Ativo" ? "Convertido" : clientStatus === "Inativo" ? "Inativo" : "Novo contato"
        : String(form.get("stage") ?? selected.stage) as ContactStage,
      clientStatus,
      photo,
      origin: String(form.get("origin") ?? "").trim() || undefined,
      responsible: String(form.get("responsible") ?? "").trim() || undefined,
      agent: String(form.get("agent") ?? "").trim() || undefined,
      unit: String(form.get("unit") ?? "").trim() || undefined,
      notes: String(form.get("notes") ?? "").trim() || undefined
    };
    persist(rows.map((row) => row.id === selected.id ? next : row));
    setSelected(next);
    setEditOpen(false);
    showNotice("Dados do contato salvos localmente.");
  }

  function addContact(event: React.FormEvent<HTMLFormElement>, photo?: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!name || !phone) {
      showNotice("Informe o nome e o telefone do contato.");
      return;
    }
    const tagValue = String(form.get("tag") ?? "").trim();
    const next: UnifiedContact = {
      id: `CT-${Date.now().toString().slice(-6)}`,
      name,
      phone,
      email: String(form.get("email") ?? "").trim(),
      cpf: String(form.get("cpf") ?? "").trim() || undefined,
      birthDate: String(form.get("birthDate") ?? "").trim() || undefined,
      gender: String(form.get("gender") ?? "Feminino") as UnifiedContact["gender"],
      channel: String(form.get("channel") ?? "WhatsApp") as Contact["channel"],
      stage: String(form.get("stage") ?? "Novo contato") as ContactStage,
      isClient: false,
      lastActivity: "Agora",
      tags: tagValue ? [tagValue] : [],
      photo,
      origin: String(form.get("origin") ?? "").trim() || undefined,
      responsible: String(form.get("responsible") ?? "").trim() || undefined,
      agent: String(form.get("agent") ?? "").trim() || undefined,
      unit: String(form.get("unit") ?? "").trim() || undefined,
      notes: String(form.get("notes") ?? "").trim() || undefined,
      history: [],
      nextEvents: []
    };
    persist([next, ...rows]);
    setModal(null);
    setSelected(next);
    showNotice("Contato adicionado à base unificada.");
  }

  function addTag(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const tagValue = String(new FormData(event.currentTarget).get("tag") ?? "").trim();
    if (!tagValue) {
      showNotice("Digite uma tag antes de adicionar.");
      return;
    }
    if (selected.tags.includes(tagValue)) {
      showNotice("Essa tag já está no contato.");
      return;
    }
    const next = { ...selected, tags: [...selected.tags, tagValue] };
    persist(rows.map((row) => row.id === selected.id ? next : row));
    setSelected(next);
    event.currentTarget.reset();
    showNotice(`Tag "${tagValue}" adicionada.`);
  }

  function convertToClient() {
    if (!selected || selected.isClient) return;
    const next: UnifiedContact = {
      ...selected,
      isClient: true,
      clientStatus: "Novo",
      stage: "Convertido",
      tags: Array.from(new Set([...selected.tags, "Cliente"])),
      agent: selected.agent ?? selected.responsible ?? "IA + equipe",
      unit: selected.unit ?? "Filial Centro",
      history: [{ id: `h-${Date.now()}`, type: "Atendimento", title: "Contato convertido em cliente", date: "Hoje", detail: "Registro convertido na base unificada de contatos." }, ...selected.history]
    };
    persist(rows.map((row) => row.id === selected.id ? next : row));
    setSelected(next);
    showNotice(`${selected.name} convertido(a) em cliente.`);
  }

  function clearFilters() {
    setSearch("");
    setStage(ALL);
    setChannel(ALL);
    setRecordType(ALL);
    setUnit(ALL);
    setResponsible(ALL);
    setTag(ALL);
  }

  return (
    <div ref={pageRef} data-contacts-page>
      <PageHeader
        eyebrow="Clientes / Base unificada"
        title="Contatos"
        description="Uma única visão para acompanhar contatos, clientes e cada interação com a empresa."
        aside={<Button variant="secondary" size="sm" onClick={() => setModal("import")}><FileUp className="size-4" /><span className="hidden sm:inline">Importar / exportar</span></Button>}
        action={<Button onClick={() => setModal("add")}><UserPlus className="size-4" />Adicionar contato</Button>}
      />

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-search-bar className="mb-4 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <SearchField value={search} onChange={setSearch} placeholder="Pesquisar nome, telefone, CPF, e-mail ou tag" />
          <ViewSwitch
            views={[{ id: "lista", label: "Lista", icon: List }, { id: "cards", label: "Cards", icon: LayoutGrid }]}
            value={view}
            onChange={(id) => setView(id as ViewMode)}
            className="self-end lg:self-auto"
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          <Dropdown label="Etapa" value={stage} options={[ALL, ...contactStages]} onChange={setStage} />
          <Dropdown label="Tipo" value={recordType} options={[ALL, "Clientes", "Contatos"]} onChange={setRecordType} />
          <Dropdown label="Canal" value={channel} options={[ALL, ...channels]} onChange={setChannel} />
          <Dropdown label="Filial" value={unit} options={[ALL, ...units]} onChange={setUnit} />
          <Dropdown label="Responsável" value={responsible} options={[ALL, ...responsibles]} onChange={setResponsible} />
          <Dropdown label="Tags" value={tag} options={[ALL, ...tags]} onChange={setTag} />
        </div>
        {hasFilters || search ? (
          <div className="mt-2 flex justify-end">
            <Button variant="secondary" size="sm" onClick={clearFilters}><X className="size-4" />Limpar filtros</Button>
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={SearchX} title="Nenhum contato encontrado" description="Ajuste a busca ou os filtros de etapa, tipo, canal e tags." action={<Button size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button>} />
      ) : view === "lista" ? (
        <TableSurface caption="Lista unificada de contatos e clientes">
          <TableHead>
            <TableHeaderCell>Contato</TableHeaderCell>
            <TableHeaderCell>Canal</TableHeaderCell>
            <TableHeaderCell>Dados</TableHeaderCell>
            <TableHeaderCell>Última atividade</TableHeaderCell>
            <TableHeaderCell>Tags</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableHead>
          <tbody className="divide-y divide-ebot-border/[0.10]">
            {filtered.map((contact) => (
              <tr key={contact.id} data-contact-item data-contact-id={contact.id} className="animate-list-in transition hover:bg-ebot-primary/[0.035]">
                <TableCell>
                  <button type="button" onClick={() => setSelected(contact)} className="flex items-center gap-3 text-left">
                    <Avatar name={contact.name} src={contact.photo} />
                    <span className="min-w-0">
                      <span className="block truncate font-extrabold text-ebot-dark hover:text-ebot-primary">{contact.name}</span>
                      <span className="block text-xs font-semibold text-ebot-muted">{contact.id} · {recordTypeLabel(contact)}</span>
                    </span>
                  </button>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2 font-semibold text-ebot-slate"><ChannelIcon channel={contact.channel} />{contact.channel}</span>
                  <span className="mt-1 block text-xs font-semibold text-ebot-muted">{contact.phone}</span>
                </TableCell>
                <TableCell>
                  <span className="block font-semibold text-ebot-slate">{contact.email || "E-mail não informado"}</span>
                  <span className="mt-1 block text-xs font-semibold text-ebot-muted">{contact.cpf || "CPF não informado"}</span>
                </TableCell>
                <TableCell><span className="font-semibold text-ebot-slate">{contact.lastActivity}</span></TableCell>
                <TableCell><div className="flex max-w-[180px] flex-wrap gap-1">{contact.tags.slice(0, 3).map((item) => <StatusBadge key={item} label={item} tone="neutral" />)}</div></TableCell>
                <TableCell>
                  {contact.isClient ? <StatusBadge label={statusLabel(contact)} tone={statusTone(contact)} /> : (
                    <label className="sr-only" htmlFor={`stage-${contact.id}`}>Etapa de {contact.name}</label>
                  )}
                  {!contact.isClient ? (
                    <select id={`stage-${contact.id}`} value={contact.stage} onChange={(event) => changeStage(contact.id, event.target.value as ContactStage)} className="cursor-pointer rounded-full border-0 bg-ebot-surfaceMuted/60 py-1.5 pl-2.5 pr-7 text-[12px] font-extrabold text-ebot-dark outline-none focus:ring-2 focus:ring-ebot-primary/25">
                      {contactStages.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  ) : null}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setSelected(contact)} aria-label={`Ver ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-primary transition hover:bg-ebot-primary/10"><UserRound className="size-4" /></button>
                    <button type="button" onClick={() => { setSelected(contact); setEditOpen(true); }} aria-label={`Editar ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-4" /></button>
                    <button type="button" onClick={() => router.push("/atendimentos")} aria-label={`Atender ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Headphones className="size-4" /></button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </TableSurface>
      ) : (
        <div data-contact-list className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((contact) => (
            <article key={contact.id} data-contact-item data-contact-id={contact.id} className="flex min-w-0 flex-col rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-4 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition hover:-translate-y-0.5 hover:border-ebot-primary/30 hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <button type="button" onClick={() => setSelected(contact)} className="flex min-w-0 items-center gap-3 text-left">
                  <Avatar name={contact.name} src={contact.photo} size="lg" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-ebot-dark">{contact.name}</span>
                    <span className="mt-0.5 block text-[11px] font-bold text-ebot-muted">{contact.id} · {recordTypeLabel(contact)}</span>
                  </span>
                </button>
                <StatusBadge label={statusLabel(contact)} tone={statusTone(contact)} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-ebot-border/[0.10] pt-3">
                <ContactDetail label="Canal" value={contact.channel} icon={<ChannelIcon channel={contact.channel} size="sm" className="size-7 [&>svg]:size-3.5" />} />
                <ContactDetail label="Última atividade" value={contact.lastActivity} icon={<History className="size-3.5 text-ebot-primary" />} />
                <ContactDetail label="Telefone" value={contact.phone} icon={<Phone className="size-3.5 text-ebot-green" />} />
                <ContactDetail label="E-mail" value={contact.email || "Não informado"} icon={<Mail className="size-3.5 text-ebot-teal" />} />
                <ContactDetail label="CPF" value={contact.cpf || "Não informado"} icon={<UserRound className="size-3.5 text-ebot-orange" />} />
                <ContactDetail label="Filial" value={contact.unit || "Não informada"} icon={<Stethoscope className="size-3.5 text-ebot-primary" />} />
              </dl>
              <div className="mt-4 flex min-h-7 flex-wrap gap-1">{contact.tags.length ? contact.tags.slice(0, 4).map((item) => <StatusBadge key={item} label={item} tone="neutral" />) : <span className="text-xs font-semibold text-ebot-muted">Sem tags</span>}</div>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-ebot-border/[0.10] pt-3">
                <span className="truncate text-[11px] font-bold text-ebot-muted">{contact.responsible || contact.agent || "Sem responsável"}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setSelected(contact)} aria-label={`Ver ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-primary transition hover:bg-ebot-primary/10"><UserRound className="size-4" /></button>
                  <button type="button" onClick={() => { setSelected(contact); setEditOpen(true); }} aria-label={`Editar ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-4" /></button>
                  <button type="button" onClick={() => router.push("/atendimentos")} aria-label={`Atender ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Headphones className="size-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Drawer open={Boolean(selected)} onClose={() => { setSelected(null); setEditOpen(false); }} title={selected?.name ?? "Contato"} description={selected ? `${selected.id} · ${recordTypeLabel(selected)}` : undefined} width="max-w-xl">
        {selected ? (
          <div>
            <div className="rounded-2xl bg-ebot-primary/[0.07] p-4">
              <div className="flex items-center gap-4">
                <span className="relative shrink-0">
                  <Avatar name={selected.name} src={selected.photo} size="lg" />
                  <button type="button" onClick={() => drawerPhotoRef.current?.click()} aria-label="Escolher foto de perfil" className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-ebot-border/[0.12] bg-ebot-surface text-ebot-primary shadow-sm transition hover:bg-ebot-primary hover:text-ebot-charcoal"><Camera className="size-3.5" /></button>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold text-ebot-dark">{selected.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-ebot-muted">{selected.id} · {recordTypeLabel(selected)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5"><StatusBadge label={statusLabel(selected)} tone={statusTone(selected)} />{selected.tags.map((item) => <StatusBadge key={item} label={item} tone="neutral" />)}</div>
                </div>
              </div>
              <input ref={drawerPhotoRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => updatePhoto(selected.id, String(reader.result)); reader.readAsDataURL(file); event.currentTarget.value = ""; }} />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <ProfileField icon={Phone} label="Telefone / WhatsApp" value={selected.phone} />
              <ProfileField icon={Mail} label="E-mail" value={selected.email || "Não informado"} />
              <ProfileField icon={RadioTower} label="Canal" value={selected.channel} />
              <ProfileField icon={History} label="Última atividade" value={selected.lastActivity} />
              <ProfileField icon={UserRound} label="CPF" value={selected.cpf || "Não informado"} />
              <ProfileField icon={CalendarDays} label="Nascimento" value={selected.birthDate || "Não informado"} />
              <ProfileField icon={Stethoscope} label="Atendente" value={selected.agent || "Não atribuído"} />
              <ProfileField icon={Stethoscope} label="Filial" value={selected.unit || "Não informada"} />
              <ProfileField icon={UserRound} label="Responsável" value={selected.responsible || "Não atribuído"} />
            </dl>

            {selected.isClient ? (
              <div className="mt-7 rounded-2xl border border-ebot-green/15 bg-ebot-green/[0.06] p-4">
                <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-extrabold text-ebot-dark">Registro do cliente</h3><StatusBadge label={selected.clientStatus ?? "Cliente"} tone={statusTone(selected)} /></div>
                <div className="mt-3 grid gap-2 text-xs font-semibold text-ebot-slate sm:grid-cols-2"><span>Último agendamento: {selected.lastAppointment || "—"}</span><span>Próximo agendamento: {selected.nextAppointment || "—"}</span></div>
                {selected.notes ? <p className="mt-3 rounded-xl bg-ebot-surface/70 p-3 text-xs leading-5 text-ebot-slate">{selected.notes}</p> : null}
              </div>
            ) : null}

            {selected.history.length ? (
              <div className="mt-7">
                <h3 className="mb-3 text-sm font-extrabold text-ebot-dark">Histórico recente</h3>
                <div className="space-y-2">{selected.history.slice(0, 5).map((item) => <div key={item.id} className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-extrabold text-ebot-dark">{item.title}</span><span className="shrink-0 text-[11px] font-bold text-ebot-muted">{item.date}</span></div>{item.detail ? <p className="mt-1 text-xs leading-5 text-ebot-muted">{item.detail}</p> : null}</div>)}</div>
              </div>
            ) : null}

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-extrabold text-ebot-dark">Tags</h3><span className="text-xs font-semibold text-ebot-muted">{selected.tags.length} cadastradas</span></div>
              <form onSubmit={addTag} className="flex gap-2"><label className="flex min-w-0 flex-1 items-center rounded-xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/35 px-3 focus-within:border-ebot-primary/45 focus-within:ring-2 focus-within:ring-ebot-primary/10"><span className="sr-only">Nova tag</span><input name="tag" placeholder="Adicionar tag" className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-ebot-dark outline-none placeholder:text-ebot-muted/65" /></label><Button type="submit" size="sm" variant="secondary"><Tags className="size-3.5" />Adicionar</Button></form>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 border-t border-ebot-border/[0.12] pt-5">
              <Button type="button" variant="secondary" onClick={() => setEditOpen(true)}><Pencil className="size-4" />Editar dados</Button>
              <Button type="button" onClick={() => { setSelected(null); router.push("/atendimentos"); }}><Headphones className="size-4" />Iniciar atendimento</Button>
              {!selected.isClient ? <Button type="button" variant="secondary" onClick={convertToClient}><UserRoundCheck className="size-4" />Converter em cliente</Button> : null}
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal open={editOpen && Boolean(selected)} onClose={() => setEditOpen(false)} title="Editar contato" eyebrow="Base unificada" description={selected ? `Atualize os dados de ${selected.name}.` : undefined} icon={Pencil} className="max-w-3xl">
        {selected ? <ContactForm initial={selected} agents={responsibles} units={units} onSubmit={updateContact} onCancel={() => setEditOpen(false)} submitLabel="Salvar contato" /> : null}
      </Modal>

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Adicionar contato" eyebrow="Base unificada" description="Registre um novo contato com os dados de relacionamento e informações empresas disponíveis." icon={UserPlus} className="max-w-3xl">
        <ContactForm agents={responsibles} units={units} onSubmit={addContact} onCancel={() => setModal(null)} submitLabel="Salvar contato" />
      </Modal>

      <Modal open={modal === "import"} onClose={() => setModal(null)} title="Importar ou exportar" eyebrow="Ferramentas da base" description="Escolha uma operação sem sair da visão unificada de contatos." icon={FileUp} className="max-w-xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <ModalChoice label="Importar contatos" description="CSV ou planilha para revisar antes de adicionar." icon={UploadCloud} active={false} onClick={() => { setModal(null); showNotice("Seletor de arquivo pronto para conectar ao importador."); }} />
          <ModalChoice label="Exportar CSV" description="Baixe os registros filtrados desta visão." icon={Download} active={false} onClick={() => { setModal(null); showNotice(`${filtered.length} contatos preparados para exportação.`); }} />
          <ModalChoice label="Modelo de importação" description="Use o modelo com as colunas recomendadas." icon={FileDown} active={false} onClick={() => { setModal(null); showNotice("Modelo de importação preparado localmente."); }} />
          <ModalChoice label="Verificar duplicados" description="Compare nome, telefone e e-mail antes de importar." icon={RefreshCw} active={false} onClick={() => { setModal(null); showNotice("Nenhum duplicado novo encontrado na base unificada."); }} />
        </div>
      </Modal>
    </div>
  );
}

function ContactDetail({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="min-w-0"><dt className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">{icon}{label}</dt><dd className="mt-1 truncate text-xs font-bold text-ebot-dark">{value}</dd></div>;
}

function ProfileField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ebot-surfaceMuted text-ebot-primary"><Icon className="size-4" /></span><div className="min-w-0"><dt className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">{label}</dt><dd className="truncate text-sm font-bold text-ebot-dark">{value}</dd></div></div>;
}
