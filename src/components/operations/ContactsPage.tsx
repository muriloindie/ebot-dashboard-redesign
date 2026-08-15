"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Camera, Check, Download, FileDown, FileUp, Headphones, Mail, Pencil, Phone, RadioTower, RefreshCw, Save, SearchX, Star, Tags, UploadCloud, UserPlus, UserRound, UserRoundCheck, UserX, X } from "lucide-react";
import { contacts, contactChannels, contactStages, type Contact, type ContactStage } from "@/data/contactsMock";
import { patients, type Patient } from "@/data/patientsMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalChoice } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { ChannelIcon } from "@/components/ui/ChannelIcon";
import { PageHeader, SearchField, StatePanel, StatusBadge, TableCell, TableHeaderCell, TableHead, TableSurface } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const CACHE_KEY = "ebot-week2-contacts";
const PATIENTS_CACHE_KEY = "ebot-week2-patients";
const ALL = "Todos";

type ContactRecord = Contact & {
  origin?: string;
  responsible?: string;
};

const stageTone: Record<ContactStage, "blue" | "orange" | "green" | "neutral"> = {
  "Novo contato": "blue",
  "Em atendimento": "orange",
  Qualificado: "orange",
  Agendado: "blue",
  Convertido: "green",
  Inativo: "neutral"
};

const stageBar: Record<ContactStage, string> = {
  "Novo contato": "bg-clinical-blue",
  "Em atendimento": "bg-clinical-teal",
  Qualificado: "bg-clinical-orange",
  Agendado: "bg-clinical-blue",
  Convertido: "bg-clinical-green",
  Inativo: "bg-clinical-muted/40"
};

const stageIcon: Record<ContactStage, { icon: React.ElementType; tile: string }> = {
  "Novo contato": { icon: UserPlus, tile: "bg-clinical-blue/10 text-clinical-blue" },
  "Em atendimento": { icon: Headphones, tile: "bg-clinical-teal/12 text-clinical-teal" },
  Qualificado: { icon: Star, tile: "bg-clinical-orange/12 text-clinical-orange" },
  Agendado: { icon: CalendarClock, tile: "bg-clinical-blue/10 text-clinical-blue" },
  Convertido: { icon: UserRoundCheck, tile: "bg-clinical-green/12 text-clinical-green" },
  Inativo: { icon: UserX, tile: "bg-clinical-surfaceMuted text-clinical-muted" }
};

function PhotoPicker({ value, onChange, name }: { value?: string; onChange: (dataUrl: string | undefined) => void; name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-4">
      <span className="relative shrink-0">
        <Avatar name={name ?? "Contato"} src={value} size="lg" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Escolher foto de perfil"
          className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-clinical-border/[0.12] bg-clinical-surface text-clinical-blue shadow-sm transition hover:bg-clinical-blue hover:text-white"
        >
          <Camera className="size-3.5" />
        </button>
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-clinical-dark">Foto de perfil</span>
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

export function ContactsPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const drawerPhotoRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ContactRecord[]>(contacts);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState(ALL);
  const [origin, setOrigin] = useState(ALL);
  const [responsible, setResponsible] = useState(ALL);
  const [channel, setChannel] = useState(ALL);
  const [tag, setTag] = useState(ALL);
  const [selected, setSelected] = useState<ContactRecord | null>(null);
  const [modal, setModal] = useState<"add" | "import" | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState<string | undefined>(undefined);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-funnel-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } },
    { selector: "[data-search-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } },
    { selector: "[data-contact-row]", from: { opacity: 0, x: -12 }, to: { duration: 0.3, ease: "power2.out" } }
  ], { stagger: 0.04, delay: 0.05 });

  useEffect(() => setRows(readLocalCache<ContactRecord[]>(CACHE_KEY, contacts)), []);

  const channels = Array.from(new Set(rows.map((row) => row.channel)));
  const origins = Array.from(new Set(rows.map((row) => row.origin).filter((value): value is string => Boolean(value)))).sort();
  const responsibles = Array.from(new Set(rows.map((row) => row.responsible).filter((value): value is string => Boolean(value)))).sort();
  const tags = Array.from(new Set(rows.flatMap((row) => row.tags).filter((value) => value.trim()))).sort();
  const hasFilters = stage !== ALL || origin !== ALL || responsible !== ALL || channel !== ALL || tag !== ALL;

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = `${row.name} ${row.email} ${row.whatsapp} ${row.id} ${row.origin ?? ""} ${row.responsible ?? ""} ${row.tags.join(" ")}`.toLowerCase().includes(query);
      const matchesStage = stage === ALL || row.stage === stage;
      const matchesOrigin = origin === ALL || row.origin === origin;
      const matchesResponsible = responsible === ALL || row.responsible === responsible;
      const matchesChannel = channel === ALL || row.channel === channel;
      const matchesTag = tag === ALL || row.tags.includes(tag);
      return matchesSearch && matchesStage && matchesOrigin && matchesResponsible && matchesChannel && matchesTag;
    });
  }, [rows, search, stage, origin, responsible, channel, tag]);

  const counts = useMemo(() => {
    const map = new Map<ContactStage, number>();
    for (const row of rows) map.set(row.stage, (map.get(row.stage) ?? 0) + 1);
    return map;
  }, [rows]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function persist(next: ContactRecord[]) {
    setRows(next);
    writeLocalCache(CACHE_KEY, next);
  }

  function changeStage(id: string, nextStage: ContactStage) {
    persist(rows.map((row) => (row.id === id ? { ...row, stage: nextStage } : row)));
    if (selected?.id === id) setSelected({ ...selected, stage: nextStage });
    showNotice(`Contato movido para "${nextStage}".`);
  }

  function updatePhoto(id: string, photo: string | undefined) {
    persist(rows.map((row) => (row.id === id ? { ...row, photo } : row)));
    if (selected?.id === id) setSelected({ ...selected, photo });
    showNotice(photo ? "Foto de perfil atualizada." : "Foto de perfil removida.");
  }

  function updateContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const whatsapp = String(form.get("whatsapp") ?? "").trim();
    if (!name || !whatsapp) {
      showNotice("Informe o nome e o WhatsApp do contato.");
      return;
    }

    const nextContact: ContactRecord = {
      ...selected,
      name,
      whatsapp,
      email: String(form.get("email") ?? "").trim(),
      channel: String(form.get("channel") ?? selected.channel) as Contact["channel"],
      stage: String(form.get("stage") ?? selected.stage) as ContactStage,
      origin: String(form.get("origin") ?? "").trim() || undefined,
      responsible: String(form.get("responsible") ?? "").trim() || undefined
    };
    const nextRows = rows.map((row) => row.id === selected.id ? nextContact : row);
    persist(nextRows);
    setSelected(nextContact);
    setEditOpen(false);
    showNotice("Dados do contato salvos localmente.");
  }

  function addContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const whatsapp = String(form.get("whatsapp") ?? "").trim();
    if (!name || !whatsapp) {
      showNotice("Informe o nome e o WhatsApp do contato.");
      return;
    }
    const tagValue = String(form.get("tag") ?? "").trim();
    const next: ContactRecord = {
      id: `CT-${String(rows.length + 212)}`,
      name,
      whatsapp,
      email: String(form.get("email") ?? "").trim(),
      channel: String(form.get("channel") ?? "WhatsApp") as Contact["channel"],
      stage: String(form.get("stage") ?? "Novo contato") as ContactStage,
      lastSeen: "Agora",
      tags: tagValue ? [tagValue] : [],
      photo: newPhoto,
      origin: String(form.get("origin") ?? "").trim() || undefined,
      responsible: String(form.get("responsible") ?? "").trim() || undefined
    };
    persist([next, ...rows]);
    setModal(null);
    setNewPhoto(undefined);
    showNotice("Contato adicionado à base local.");
  }

  function addTag(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    const tagValue = String(new FormData(event.currentTarget).get("tag") ?? "").trim();
    if (!tagValue) {
      showNotice("Digite uma etiqueta antes de adicionar.");
      return;
    }
    if (selected.tags.includes(tagValue)) {
      showNotice("Essa etiqueta já está no contato.");
      return;
    }

    const nextContact = { ...selected, tags: [...selected.tags, tagValue] };
    persist(rows.map((row) => row.id === selected.id ? nextContact : row));
    setSelected(nextContact);
    event.currentTarget.reset();
    showNotice(`Etiqueta "${tagValue}" adicionada.`);
  }

  function convertToPatient(id: string) {
    const contact = rows.find((row) => row.id === id);
    if (!contact) return;

    const currentPatients = readLocalCache<Patient[]>(PATIENTS_CACHE_KEY, patients);
    const existingPatient = currentPatients.find((patient) => (contact.whatsapp && patient.phone === contact.whatsapp) || (contact.email && patient.email === contact.email));
    if (!existingPatient) {
      const highestId = currentPatients.reduce((highest, patient) => Math.max(highest, Number(patient.id.match(/(\d+)$/)?.[1] ?? 0)), 0);
      const patient: Patient = {
        id: `PAC-${String(highestId + 1).padStart(4, "0")}`,
        name: contact.name,
        phone: contact.whatsapp,
        email: contact.email,
        cpf: "",
        birthDate: "",
        gender: "Feminino",
        tags: Array.from(new Set(["Paciente", ...contact.tags.filter((item) => item.trim() && item !== "Lead")])),
        professional: contact.responsible ?? "IA + equipe",
        unit: "Unidade Centro",
        status: "Novo",
        lastAppointment: "—",
        nextAppointment: "—",
        notes: `Convertido a partir do contato ${contact.id}.`,
        history: [{ id: `h-${Date.now()}`, type: "Atendimento", title: "Contato convertido em paciente", date: "Hoje", detail: "Registro criado localmente a partir da base de contatos." }],
        nextEvents: []
      };
      writeLocalCache(PATIENTS_CACHE_KEY, [patient, ...currentPatients]);
    }

    const nextContact: ContactRecord = { ...contact, stage: "Convertido", tags: Array.from(new Set([...contact.tags.filter((item) => item.trim()), "Paciente"])) };
    persist(rows.map((row) => row.id === id ? nextContact : row));
    if (selected?.id === id) setSelected(nextContact);
    showNotice(existingPatient ? `${contact.name} já estava na base de pacientes.` : `${contact.name} convertido(a) em paciente.`);
  }

  function clearFilters() {
    setSearch("");
    setStage(ALL);
    setOrigin(ALL);
    setResponsible(ALL);
    setChannel(ALL);
    setTag(ALL);
  }

  const converted = rows.filter((row) => row.stage === "Convertido").length;
  const conversionRate = rows.length ? Math.round((converted / rows.length) * 100) : 0;

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Pacientes / Relacionamento"
        title="Contatos"
        description="Pessoas que chegaram à clínica e ainda não são pacientes: acompanhe cada etapa até a conversão."
        action={<Button onClick={() => setModal("add")}><UserPlus className="size-4" />Adicionar contato</Button>}
      />

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-funnel-bar className="mb-4 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
          {contactStages.map((item) => {
            const Icon = stageIcon[item].icon;
            const count = counts.get(item) ?? 0;
            const share = rows.length ? Math.round((count / rows.length) * 100) : 0;
            const active = stage === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setStage(active ? ALL : item)}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-[20px] border p-3.5 text-left transition duration-200",
                  active
                    ? "border-clinical-blue/35 bg-clinical-blue/[0.08] shadow-[0_8px_22px_rgba(58,157,202,0.10)]"
                    : "border-clinical-border/[0.12] bg-clinical-surface/80 hover:border-clinical-blue/25 hover:bg-clinical-surface"
                )}
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", stageIcon[item].tile)}><Icon className="size-4" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-extrabold text-clinical-dark">{item}</span>
                  <span className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-base font-black tabular-nums text-clinical-dark">{count}</span>
                    <span className="text-[11px] font-bold text-clinical-muted">{share}%</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-clinical-surfaceMuted" aria-hidden="true">
            {contactStages.map((item) => {
              const count = counts.get(item) ?? 0;
              if (!count) return null;
              return <span key={item} title={item} className={cn("h-full", stageBar[item])} style={{ width: `${(count / Math.max(1, rows.length)) * 100}%` }} />;
            })}
          </div>
          <span className="flex shrink-0 items-center gap-2 text-xs font-extrabold text-clinical-muted">
            <UserRoundCheck className="size-4 text-clinical-green" />
            {conversionRate}% de conversão na base
          </span>
        </div>
      </div>

      <div data-search-bar className="mb-4 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5 lg:flex-row lg:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Pesquisar por nome, telefone, e-mail ou etiqueta" />
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          <Dropdown label="Status" value={stage} options={[ALL, ...contactStages]} onChange={setStage} />
          {origins.length ? <Dropdown label="Origem" value={origin} options={[ALL, ...origins]} onChange={setOrigin} /> : null}
          {responsibles.length ? <Dropdown label="Responsável" value={responsible} options={[ALL, ...responsibles]} onChange={setResponsible} /> : null}
          <Dropdown label="Canal" value={channel} options={[ALL, ...channels]} onChange={setChannel} />
          <Dropdown label="Tags" value={tag} options={[ALL, ...tags]} onChange={setTag} />
        </div>
        {hasFilters ? (
          <Button variant="secondary" size="sm" onClick={clearFilters} className="shrink-0"><X className="size-4" />Limpar</Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Nenhum contato encontrado"
          description="Ajuste a busca ou os filtros de estado, canal e etiqueta."
          action={<Button size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button>}
        />
      ) : (
        <TableSurface caption="Lista de contatos">
           <TableHead>
             <TableHeaderCell>Contato</TableHeaderCell>
             <TableHeaderCell>Canal</TableHeaderCell>
             <TableHeaderCell>Origem</TableHeaderCell>
             <TableHeaderCell>Responsável</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Última atividade</TableHeaderCell>
            <TableHeaderCell>Tags</TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableHead>
          <tbody className="divide-y divide-clinical-border/[0.10]">
            {filtered.map((contact) => (
              <tr key={contact.id} data-contact-row className="animate-list-in transition hover:bg-clinical-blue/[0.035]">
                <TableCell>
                  <button type="button" onClick={() => setSelected(contact)} className="flex items-center gap-3 text-left">
                    <Avatar name={contact.name} src={contact.photo} />
                    <span>
                      <span className="block font-extrabold text-clinical-dark hover:text-clinical-blue">{contact.name}</span>
                      <span className="block text-xs font-semibold text-clinical-muted">{contact.id}</span>
                    </span>
                  </button>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2 font-semibold text-clinical-slate"><ChannelIcon channel={contact.channel} />{contact.channel}</span>
                  <span className="mt-1 block text-xs font-semibold text-clinical-muted">{contact.whatsapp}</span>
                </TableCell>
                <TableCell><span className={cn("font-semibold", contact.origin ? "text-clinical-slate" : "text-clinical-muted")}>{contact.origin ?? "—"}</span></TableCell>
                <TableCell><span className={cn("font-semibold", contact.responsible ? "text-clinical-slate" : "text-clinical-muted")}>{contact.responsible ?? "—"}</span></TableCell>
                <TableCell>
                  <label className="sr-only" htmlFor={`stage-${contact.id}`}>Status de {contact.name}</label>
                  <select
                    id={`stage-${contact.id}`}
                    value={contact.stage}
                    onChange={(event) => changeStage(contact.id, event.target.value as ContactStage)}
                    className="cursor-pointer rounded-full border-0 bg-clinical-surfaceMuted/60 py-1.5 pl-2.5 pr-7 text-[12px] font-extrabold text-clinical-dark outline-none transition focus:ring-2 focus:ring-clinical-blue/25"
                    style={{ color: "inherit" }}
                  >
                    {contactStages.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </TableCell>
                <TableCell><span className="font-semibold text-clinical-slate">{contact.lastSeen}</span></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">{contact.tags.slice(0, 3).map((item) => <StatusBadge key={item} label={item} tone="neutral" />)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setSelected(contact)} aria-label={`Ver ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-clinical-blue transition hover:bg-clinical-blue/10"><UserRound className="size-4" /></button>
                    <button type="button" onClick={() => { setSelected(contact); setEditOpen(true); }} aria-label={`Editar ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-clinical-blue/10 hover:text-clinical-blue"><Pencil className="size-4" /></button>
                    <button type="button" onClick={() => router.push("/atendimentos")} aria-label={`Atender ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-clinical-blue/10 hover:text-clinical-blue"><Headphones className="size-4" /></button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </TableSurface>
      )}

      <Drawer open={Boolean(selected)} onClose={() => { setSelected(null); setEditOpen(false); }} title={selected?.name ?? "Contato"} description={selected ? `${selected.id} · ${selected.stage}` : undefined}>
        {selected ? (
          <div>
            {notice ? <div role="status" className="mb-4 flex items-center gap-2 rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-3 py-2.5 text-xs font-bold text-clinical-green"><Check className="size-4" />{notice}</div> : null}
            <div className="rounded-2xl bg-clinical-blue/[0.07] p-4">
              <div className="flex items-center gap-4">
                <span className="relative shrink-0">
                  <Avatar name={selected.name} src={selected.photo} size="lg" />
                  <button
                    type="button"
                    onClick={() => drawerPhotoRef.current?.click()}
                    aria-label="Escolher foto de perfil"
                    className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-clinical-border/[0.12] bg-clinical-surface text-clinical-blue shadow-sm transition hover:bg-clinical-blue hover:text-white"
                  >
                    <Camera className="size-3.5" />
                  </button>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold text-clinical-dark">{selected.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <StatusBadge label={selected.stage} tone={stageTone[selected.stage]} />
                    {selected.tags.map((tag) => <StatusBadge key={tag} label={tag} tone="neutral" />)}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-clinical-blue/10 pt-3">
                <span className="text-sm font-bold text-clinical-dark">Foto de perfil</span>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => drawerPhotoRef.current?.click()}>Escolher foto</Button>
                  {selected.photo ? <Button type="button" size="sm" variant="ghost" onClick={() => updatePhoto(selected.id, undefined)}>Remover</Button> : null}
                </div>
              </div>
              <input
                ref={drawerPhotoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => updatePhoto(selected.id, String(reader.result));
                  reader.readAsDataURL(file);
                  event.currentTarget.value = "";
                }}
              />
            </div>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-surfaceMuted text-clinical-green"><Phone className="size-4" /></span><div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">WhatsApp</dt><dd className="text-sm font-bold text-clinical-dark">{selected.whatsapp}</dd></div></div>
              <div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-surfaceMuted text-clinical-blue"><Mail className="size-4" /></span><div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">E-mail</dt><dd className="text-sm font-bold text-clinical-dark">{selected.email}</dd></div></div>
              <div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-surfaceMuted text-clinical-teal"><ChannelIcon channel={selected.channel} /></span><div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Canal de origem</dt><dd className="text-sm font-bold text-clinical-dark">{selected.channel}</dd></div></div>
              <div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-surfaceMuted text-clinical-blue"><Tags className="size-4" /></span><div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Origem</dt><dd className="text-sm font-bold text-clinical-dark">{selected.origin ?? "Não informada"}</dd></div></div>
              <div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-surfaceMuted text-clinical-orange"><UserRound className="size-4" /></span><div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Responsável</dt><dd className="text-sm font-bold text-clinical-dark">{selected.responsible ?? "Não atribuído"}</dd></div></div>
            </dl>

            <div className="mt-7">
              <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Mover para</h3>
              <div className="flex flex-wrap gap-1.5">
                {contactStages.filter((item) => item !== selected.stage).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeStage(selected.id, item)}
                    className="rounded-full border border-clinical-border/[0.14] px-3 py-1.5 text-[12px] font-extrabold text-clinical-slate transition hover:border-clinical-blue/30 hover:bg-clinical-blue/[0.07] hover:text-clinical-blue"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-clinical-dark">Etiquetas</h3>
                <span className="text-xs font-semibold text-clinical-muted">{selected.tags.length} cadastradas</span>
              </div>
              <div className="flex flex-wrap gap-1.5">{selected.tags.length ? selected.tags.map((item) => <StatusBadge key={item} label={item} tone="neutral" />) : <span className="text-xs font-semibold text-clinical-muted">Nenhuma etiqueta cadastrada.</span>}</div>
              <form onSubmit={addTag} className="mt-3 flex gap-2">
                <label className="flex min-w-0 flex-1 items-center rounded-xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/35 px-3 focus-within:border-clinical-blue/45 focus-within:ring-2 focus-within:ring-clinical-blue/10">
                  <span className="sr-only">Nova etiqueta</span>
                  <input name="tag" placeholder="Adicionar etiqueta" className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-clinical-dark outline-none placeholder:text-clinical-muted/65" />
                </label>
                <Button type="submit" size="sm" variant="secondary"><Tags className="size-3.5" />Adicionar</Button>
              </form>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 border-t border-clinical-border/[0.12] pt-5">
              <Button type="button" variant="secondary" onClick={() => setEditOpen(true)}><Pencil className="size-4" />Editar contato</Button>
              <Button type="button" onClick={() => { setSelected(null); router.push("/atendimentos"); }}><Headphones className="size-4" />Iniciar atendimento</Button>
              {selected.stage !== "Convertido" ? (
                <Button type="button" variant="secondary" onClick={() => convertToPatient(selected.id)}><UserRoundCheck className="size-4" />Converter em paciente</Button>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-clinical-green/[0.10] px-3.5 py-2 text-[13px] font-extrabold text-clinical-green"><Check className="size-4" />Paciente convertido</span>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal open={editOpen && Boolean(selected)} onClose={() => setEditOpen(false)} title="Editar contato" eyebrow="Base de relacionamento" description={selected ? `Atualize os dados de ${selected.name}.` : undefined} icon={Pencil} className="max-w-2xl">
        {selected ? (
          <form key={selected.id} onSubmit={updateContact} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ModalField name="name" label="Nome completo" icon={UserRound} defaultValue={selected.name} required />
              <ModalSelect name="stage" label="Status" icon={Tags} defaultValue={selected.stage}>{contactStages.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
              <ModalField name="whatsapp" label="WhatsApp" icon={Phone} defaultValue={selected.whatsapp} required />
              <ModalField name="email" label="E-mail" icon={Mail} type="email" defaultValue={selected.email} />
              <ModalSelect name="channel" label="Canal de origem" icon={RadioTower} defaultValue={selected.channel}>{contactChannels.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
              <ModalField name="origin" label="Origem" icon={Tags} defaultValue={selected.origin ?? ""} placeholder="Ex.: Campanha de retorno" />
              <ModalField name="responsible" label="Responsável" icon={UserRound} defaultValue={selected.responsible ?? ""} placeholder="Ex.: Marina Costa" />
            </div>
            <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancelar</Button>
              <Button type="submit"><Save className="size-4" />Salvar contato</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Adicionar contato" eyebrow="Base de relacionamento" description="Registre um novo contato, com foto opcional, e escolha a etapa do funil em que ele entra." icon={UserPlus} className="max-w-2xl">
        <form onSubmit={addContact} className="space-y-4">
          <PhotoPicker value={newPhoto} name="Novo contato" onChange={setNewPhoto} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="name" label="Nome completo" icon={UserRound} placeholder="Ex.: Camila Rodrigues" required />
            <ModalSelect name="stage" label="Status inicial" icon={Tags} defaultValue="Novo contato">{contactStages.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalSelect name="channel" label="Canal de origem" icon={RadioTower} defaultValue="WhatsApp">{contactChannels.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalField name="whatsapp" label="WhatsApp" icon={Phone} placeholder="+55 11 99999-9999" required />
            <ModalField name="email" label="E-mail" icon={Mail} type="email" placeholder="contato@email.com" required />
            <ModalField name="tag" label="Etiqueta" icon={Tags} placeholder="Ex.: Convênio, Retorno" />
            <ModalField name="origin" label="Origem" icon={Tags} placeholder="Ex.: Campanha de retorno" />
            <ModalField name="responsible" label="Responsável" icon={UserRound} placeholder="Ex.: Marina Costa" />
          </div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setModal(null)}>Cancelar</Button>
            <Button type="submit"><UserPlus className="size-4" />Salvar contato</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === "import"} onClose={() => setModal(null)} title="Importar ou exportar" eyebrow="Ferramentas da base" description="Escolha o formato e a operação sem sair da tela." icon={FileUp} className="max-w-xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <ModalChoice label="Importar contatos" description="CSV ou planilha para revisar antes de adicionar." icon={UploadCloud} active={false} onClick={() => { setModal(null); showNotice("Seletor de arquivo pronto para conectar ao importador."); }} />
          <ModalChoice label="Exportar CSV" description="Baixe os registros filtrados desta visão." icon={Download} active={false} onClick={() => { setModal(null); showNotice(`${filtered.length} contatos preparados para exportação.`); }} />
          <ModalChoice label="Modelo de importação" description="Use o modelo com colunas recomendadas." icon={FileDown} active={false} onClick={() => { setModal(null); showNotice("Modelo de importação preparado localmente."); }} />
          <ModalChoice label="Verificar duplicados" description="Compare nome, telefone e e-mail antes de importar." icon={RefreshCw} active={false} onClick={() => { setModal(null); showNotice("Nenhum duplicado novo encontrado na base local."); }} />
        </div>
      </Modal>
    </div>
  );
}
