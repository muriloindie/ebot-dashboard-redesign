"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCheck,
  CircleAlert,
  Clock3,
  Flag,
  Headphones,
  LayoutGrid,
  List,
  MessageSquareText,
  MoreVertical,
  Phone,
  PhoneCall,
  Plus,
  Search,
  Send,
  StickyNote,
  Timer,
  UserPlus,
  UserRound,
  UserRoundCheck,
  Video,
  X
} from "lucide-react";
import {
  attendances,
  attendanceIndicators,
  attendanceChannels,
  attendanceUnits,
  type Attendance,
  type AttendanceMessage,
  type AttendanceSource,
  type AttendanceStatus
} from "@/data/attendanceMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { ChannelIcon } from "@/components/ui/ChannelIcon";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Timeline } from "@/components/ui/Timeline";
import { PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { ChatComposer, type ComposerMessage } from "@/components/operations/ChatComposer";
import { AiSuggestion, QuickReplies } from "@/components/operations/QuickReplies";
import { cn } from "@/lib/cn";

type StoredMessage = ComposerMessage & { id: string; from: AttendanceMessage["from"]; time: string };
type ViewMode = "lista" | "cards";

const CACHE_MESSAGES = "ebot-week2-attendance-messages";
const CACHE_ROWS = "ebot-week2-attendances";
const ALL = "Todos";

const statusTone: Record<AttendanceStatus, "blue" | "orange" | "green" | "neutral"> = {
  Aguardando: "orange",
  "Em atendimento humano": "blue",
  "Resolvido pela IA": "green",
  Encerrado: "neutral"
};

const indicators: StatItem[] = [
  { id: "active", label: "Atendimentos ativos", value: String(attendanceIndicators.active), hint: "agora", tone: "blue", icon: Headphones },
  { id: "waiting", label: "Aguardando atendimento", value: String(attendanceIndicators.waiting), hint: "na fila", tone: "orange", icon: Clock3 },
  { id: "human", label: "Em atendimento humano", value: String(attendanceIndicators.inHuman), hint: "com a equipe", tone: "teal", icon: UserRoundCheck },
  { id: "ai", label: "Resolvidos pela IA", value: String(attendanceIndicators.resolvedByAi), hint: "hoje", tone: "green", icon: Bot },
  { id: "wait-time", label: "Tempo médio de espera", value: attendanceIndicators.avgWait, hint: "última hora", tone: "neutral", icon: Timer },
  { id: "sla", label: "SLA de resposta", value: attendanceIndicators.sla, hint: "meta 90%", tone: "green", icon: Flag }
];

function getInitialMessages() {
  return Object.fromEntries(
    attendances.map((attendance) => [
      attendance.id,
      attendance.messages.map((message) => ({ id: message.id, kind: "text" as const, text: message.text, from: message.from, time: message.time }))
    ])
  ) as Record<string, StoredMessage[]>;
}

export function AttendancesPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const [rows, setRows] = useState<Attendance[]>(attendances);
  const [messages, setMessages] = useState<Record<string, StoredMessage[]>>({});
  const [selectedId, setSelectedId] = useState(attendances[0].id);
  const [view, setView] = useState<ViewMode>("lista");
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [responsible, setResponsible] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [unit, setUnit] = useState(ALL);
  const [period, setPeriod] = useState("Hoje");
  const [sort, setSort] = useState("prioridade");

  const [mobileChat, setMobileChat] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-stat-card]", from: { opacity: 0, y: 18 } },
    { selector: "[data-filter-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } },
    { selector: "[data-chat-panel]", from: { opacity: 0, x: 24 }, to: { duration: 0.5, ease: "power3.out" } },
    { selector: "[data-profile-panel]", from: { opacity: 0, x: 28 }, to: { duration: 0.5, ease: "power3.out" } }
  ], { stagger: 0.05, delay: 0.05 });

  useEffect(() => {
    setRows(readLocalCache(CACHE_ROWS, attendances));
    setMessages(readLocalCache(CACHE_MESSAGES, getInitialMessages()));
  }, []);

  const selected = rows.find((attendance) => attendance.id === selectedId) ?? rows[0];
  const responsibles = useMemo(() => ["Todos", ...Array.from(new Set(rows.map((row) => row.responsible)))], [rows]);
  const periods = ["Hoje", "Ontem", "Últimos 7 dias"];
  const statusOptions = ["Todos", "Aguardando", "Em atendimento humano", "Resolvido pela IA", "Encerrado"];
  const priorityOptions = ["Todos", "Alta", "Média", "Baixa"];

  const hasFilters = channel !== ALL || status !== ALL || responsible !== ALL || priority !== ALL || unit !== ALL || period !== "Hoje";

  const filtered = useMemo(() => {
    return rows.filter((attendance) => {
      const conversationText = (messages[attendance.id] ?? []).map((message) => message.text).join(" ").toLowerCase();
      const matchesSearch = `${attendance.patientName} ${attendance.lastMessage} ${attendance.phone} ${attendance.id} ${conversationText}`.toLowerCase().includes(search.toLowerCase());
      const matchesChannel = channel === ALL || attendance.channel === channel;
      const matchesStatus = status === ALL || attendance.status === status;
      const matchesResponsible = responsible === ALL || attendance.responsible === responsible;
      const matchesPriority = priority === ALL || attendance.priority === priority;
      const matchesUnit = unit === ALL || attendance.unit === unit;
      const matchesPeriod = period === "Hoje";
      return matchesSearch && matchesChannel && matchesStatus && matchesResponsible && matchesPriority && matchesUnit && matchesPeriod;
    });
  }, [rows, messages, search, channel, status, responsible, priority, unit, period]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const order = { Alta: 0, Média: 1, Baixa: 2 };
    if (sort === "prioridade") list.sort((a, b) => order[a.priority] - order[b.priority] || b.unread - a.unread);
    else if (sort === "recente") list.sort((a, b) => b.time.localeCompare(a.time));
    else list.sort((a, b) => a.time.localeCompare(b.time));
    return list;
  }, [filtered, sort]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function persistRows(next: Attendance[]) {
    setRows(next);
    writeLocalCache(CACHE_ROWS, next);
  }

  function patchAttendance(id: string, patch: Partial<Attendance>, extraMessage?: AttendanceMessage) {
    const next = rows.map((row) => {
      if (row.id !== id) return row;
      const messagesNext = extraMessage ? [...(messages[id] ?? []), { id: extraMessage.id, kind: "text" as const, text: extraMessage.text, from: extraMessage.from, time: extraMessage.time }] : messages[id];
      if (extraMessage) setMessages((current) => ({ ...current, [id]: messagesNext }));
      return { ...row, ...patch };
    });
    persistRows(next);
  }

  function persistMessage(id: string, message: StoredMessage) {
    const nextMessages = { ...messages, [id]: [...(messages[id] ?? []), message] };
    setMessages(nextMessages);
    writeLocalCache(CACHE_MESSAGES, nextMessages);
  }

  function sendMessage(message: ComposerMessage) {
    if (!selected) return;
    persistMessage(selected.id, { ...message, id: `${selected.id}-${Date.now()}`, from: "me", time: "agora" });
    if (selected.source !== "Humano") {
      window.setTimeout(() => {
        persistMessage(selected.id, {
          kind: "text",
          text: "Recebi sua mensagem. Vou confirmar com a equipe e retorno em instantes.",
          id: `${selected.id}-ai-${Date.now()}`,
          from: "ai",
          time: "agora"
        });
      }, 1100);
    }
  }

  function assumeAttendance() {
    if (!selected) return;
    patchAttendance(
      selected.id,
      { status: "Em atendimento humano", responsible: "Marina Costa", source: "Humano" },
      { id: `sys-${Date.now()}`, from: "human", text: "Atendimento assumido por Marina Costa. A partir de agora o acompanhamento é humano.", time: "agora" }
    );
    showNotice(`Atendimento ${selected.id} assumido por Marina Costa.`);
  }

  function transferAttendance() {
    if (!selected) return;
    const target = selected.responsible === "Marina Costa" ? "Julia Alves" : "Marina Costa";
    patchAttendance(
      selected.id,
      { responsible: target, source: "IA + humano" },
      { id: `sys-${Date.now()}`, from: "human", text: `Atendimento transferido para ${target}.`, time: "agora" }
    );
    setTransferOpen(false);
    showNotice(`Atendimento transferido para ${target}.`);
  }

  function closeAttendance() {
    if (!selected) return;
    patchAttendance(selected.id, { status: "Encerrado" });
    setCloseOpen(false);
    showNotice(`Atendimento ${selected.id} encerrado.`);
  }

  function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNoteOpen(false);
    showNotice("Observação registrada no histórico do atendimento.");
  }

  function createAttendance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const next: Attendance = {
      id: `AT-${String(rows.length + 1101)}`,
      patientName: name,
      phone: String(form.get("phone") ?? ""),
      channel: String(form.get("channel") ?? "WhatsApp") as Attendance["channel"],
      status: "Aguardando",
      priority: String(form.get("priority") ?? "Média") as Attendance["priority"],
      responsible: "IA",
      source: "IA" as AttendanceSource,
      unit: String(form.get("unit") ?? "Unidade Centro") as Attendance["unit"],
      sector: String(form.get("sector") ?? "Recepção"),
      queue: String(form.get("queue") ?? "Primeiro contato"),
      lastMessage: "Atendimento iniciado pela equipe.",
      time: "agora",
      unread: 0,
      startedAt: "agora",
      duration: "0 min",
      messages: [{ id: `init-${Date.now()}`, from: "human", text: "Atendimento criado pela central. A IA assumirá o primeiro contato.", time: "agora" }]
    };
    const nextRows = [next, ...rows];
    persistRows(nextRows);
    setSelectedId(next.id);
    setNewOpen(false);
    showNotice(`Atendimento criado para ${name}.`);
  }

  function clearFilters() {
    setSearch("");
    setChannel(ALL);
    setStatus(ALL);
    setResponsible(ALL);
    setPriority(ALL);
    setUnit(ALL);
    setPeriod("Hoje");
  }

  const unreadTotal = rows.reduce((sum, row) => sum + row.unread, 0);

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Operação / Central de atendimento"
        title="Atendimentos"
        description="Gerencie conversas, pacientes e atendimentos em tempo real."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-clinical-orange/[0.10] px-3 py-2 text-xs font-extrabold text-clinical-orange"><Clock3 className="size-4" />{unreadTotal} não lidos na fila</span>}
        action={<Button onClick={() => setNewOpen(true)}><UserPlus className="size-4" />Novo atendimento</Button>}
      />

      <StatStrip items={indicators} className="mb-4" />

      <div data-filter-bar className="mb-4 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchField value={search} onChange={setSearch} placeholder="Buscar por paciente, mensagem ou nº do atendimento" />
          <div className="flex shrink-0 items-center gap-2">
            <ViewSwitch views={[{ id: "lista", label: "Lista", icon: List }, { id: "cards", label: "Cards", icon: LayoutGrid }]} value={view} onChange={(id) => setView(id as ViewMode)} />
            {hasFilters ? (
              <button type="button" onClick={clearFilters} className="flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-clinical-orange/25 bg-clinical-orange/[0.08] px-3 text-sm font-extrabold text-clinical-orange transition hover:bg-clinical-orange/[0.14]">
                <X className="size-4" />Limpar filtros
              </button>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          <Dropdown label="Canal" value={channel} options={[ALL, ...attendanceChannels]} onChange={setChannel} />
          <Dropdown label="Status" value={status} options={statusOptions} onChange={setStatus} />
          <Dropdown label="Prioridade" value={priority} options={priorityOptions} onChange={setPriority} />
          <Dropdown label="Atendente" value={responsible} options={responsibles} onChange={setResponsible} />
          <Dropdown label="Unidade" value={unit} options={[ALL, ...attendanceUnits]} onChange={setUnit} />
          <Dropdown label="Período" value={period} options={periods} onChange={setPeriod} />
        </div>
      </div>

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <StatePanel
          icon={CircleAlert}
          title="Nenhum atendimento encontrado"
          description="Ajuste a busca ou os filtros para encontrar o que procura."
          action={<Button size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] xl:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.3fr)_minmax(220px,0.55fr)] md:items-stretch">
          <section className={cn("min-w-0 flex-col overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/75 md:flex md:h-[calc(100dvh-300px)] md:min-h-[440px]", mobileChat ? "hidden" : "flex")}>
            <div className="border-b border-clinical-border/[0.12] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-extrabold text-clinical-dark">Fila de atendimento</h2>
                <span className="text-xs font-bold text-clinical-muted">{filtered.length} registros</span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border border-clinical-border/[0.14] bg-clinical-surface/80 px-3 text-xs text-clinical-muted transition focus-within:border-clinical-blue/45 focus-within:ring-2 focus-within:ring-clinical-blue/10">
                  <Search className="size-3.5 shrink-0 text-clinical-blue" aria-hidden="true" />
                  <span className="sr-only">Buscar na fila</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome ou texto da conversa" className="min-w-0 flex-1 bg-transparent font-medium text-clinical-dark outline-none placeholder:text-clinical-muted/70" />
                </label>
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar fila" className="h-9 shrink-0 cursor-pointer rounded-xl border border-clinical-border/[0.14] bg-clinical-surface/80 px-2.5 text-xs font-extrabold text-clinical-muted outline-none transition focus:border-clinical-blue/45">
                  <option value="prioridade">Prioridade</option>
                  <option value="recente">Mais recentes</option>
                  <option value="antigo">Mais antigos</option>
                </select>
              </div>
            </div>
            <div className="clinical-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
              {view === "lista" ? (
                <div className="space-y-1">
                  {sorted.map((attendance) => (
                    <AttendanceRow key={attendance.id} attendance={attendance} active={attendance.id === selected?.id} onSelect={() => { setSelectedId(attendance.id); setMobileChat(true); }} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {sorted.map((attendance) => (
                    <AttendanceCard key={attendance.id} attendance={attendance} active={attendance.id === selected?.id} onSelect={() => { setSelectedId(attendance.id); setMobileChat(true); }} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section data-chat-panel className={cn("min-w-0 flex-col overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/75 md:flex md:h-[calc(100dvh-300px)] md:min-h-[440px]", mobileChat ? "flex" : "hidden")}>
            <div className="flex items-center gap-2 border-b border-clinical-border/[0.12] px-2 py-1.5 md:hidden">
              <button type="button" onClick={() => setMobileChat(false)} className="flex h-9 items-center gap-1.5 rounded-xl px-2 text-xs font-extrabold text-clinical-blue transition hover:bg-clinical-blue/10" aria-label="Voltar para a fila de atendimento">
                <ArrowLeft className="size-4" />Fila
              </button>
            </div>
            <ChatPane
              attendance={selected}
              messages={messages[selected?.id ?? ""] ?? []}
              onSend={sendMessage}
              onAssume={assumeAttendance}
              onTransfer={() => setTransferOpen(true)}
              onClose={() => setCloseOpen(true)}
              onOpenProfile={() => setProfileDrawerOpen(true)}
              quickOpen={quickOpen}
              setQuickOpen={setQuickOpen}
            />
          </section>

          <section data-profile-panel className="hidden min-w-0 flex-col overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/75 xl:flex xl:h-[calc(100dvh-300px)] xl:min-h-[440px]">
            <PatientProfilePane attendance={selected} onOpenProfile={() => router.push(`/pacientes?q=${encodeURIComponent(selected?.patientName ?? "")}`)} onAddNote={() => setNoteOpen(true)} />
          </section>
        </div>
      )}

      <Drawer open={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} title="Perfil do paciente" description={selected?.patientName} width="max-w-lg">
        {selected ? <PatientProfilePane attendance={selected} onOpenProfile={() => { setProfileDrawerOpen(false); router.push(`/pacientes?q=${encodeURIComponent(selected.patientName)}`); }} onAddNote={() => setNoteOpen(true)} /> : null}
      </Drawer>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Novo atendimento" eyebrow="Central de atendimento" description="Crie um atendimento manualmente e deixe a IA assumir o primeiro contato." icon={UserPlus} className="max-w-2xl">
        <form onSubmit={createAttendance} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="name" label="Nome do paciente" icon={UserPlus} placeholder="Ex.: Camila Rodrigues" required />
            <ModalField name="phone" label="Telefone" icon={PhoneCall} placeholder="+55 11 99999-9999" required />
            <ModalSelect name="channel" label="Canal" icon={MessageSquareText} defaultValue="WhatsApp">
              <option>WhatsApp</option><option>Instagram</option><option>E-mail</option><option>Telefone</option>
            </ModalSelect>
            <ModalSelect name="priority" label="Prioridade" icon={Flag} defaultValue="Média">
              <option>Alta</option><option>Média</option><option>Baixa</option>
            </ModalSelect>
            <ModalSelect name="unit" label="Unidade" icon={Headphones} defaultValue="Unidade Centro">
              <option>Unidade Centro</option><option>Unidade Norte</option><option>Unidade Sul</option>
            </ModalSelect>
            <ModalSelect name="sector" label="Setor" icon={StickyNote} defaultValue="Recepção">
              <option>Recepção</option><option>Cardiologia</option><option>Ortopedia</option><option>Dermatologia</option><option>Pediatria</option><option>Exames</option>
            </ModalSelect>
            <ModalField name="queue" label="Fila" icon={List} placeholder="Ex.: Primeiro contato" className="sm:col-span-2" />
          </div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button type="submit"><Plus className="size-4" />Criar atendimento</Button>
          </div>
        </form>
      </Modal>

      <Modal open={transferOpen} onClose={() => setTransferOpen(false)} title="Transferir atendimento" eyebrow="Central de atendimento" description={selected ? `Transferir ${selected.id} para outro responsável.` : undefined} icon={UserRoundCheck} className="max-w-xl">
        <div className="space-y-4">
          <ModalSelect label="Responsável" icon={UserRoundCheck} defaultValue={selected?.responsible === "Marina Costa" ? "Julia Alves" : "Marina Costa"}>
            <option>Marina Costa</option><option>Julia Alves</option><option>Dr. Ruan</option><option>Dra. Fernanda Rocha</option>
          </ModalSelect>
          <div className="rounded-2xl border border-clinical-blue/15 bg-clinical-blue/[0.06] p-3 text-xs font-semibold leading-5 text-clinical-slate">O paciente será informado sobre a transferência e o histórico completo acompanha a conversa.</div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setTransferOpen(false)}>Cancelar</Button>
            <Button onClick={transferAttendance}><Send className="size-4" />Transferir</Button>
          </div>
        </div>
      </Modal>

      <Modal open={closeOpen} onClose={() => setCloseOpen(false)} title="Encerrar atendimento" eyebrow="Central de atendimento" description={selected ? `Encerrar o atendimento ${selected.id} de ${selected.patientName}?` : undefined} icon={Check} className="max-w-xl">
        <div className="space-y-4">
          <div className="rounded-2xl border border-clinical-orange/20 bg-clinical-orange/[0.07] p-3 text-xs font-semibold leading-5 text-clinical-slate">O atendimento sairá da fila ativa e o histórico continuará disponível no perfil do paciente.</div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setCloseOpen(false)}>Cancelar</Button>
            <Button onClick={closeAttendance}><Check className="size-4" />Encerrar atendimento</Button>
          </div>
        </div>
      </Modal>

      <Modal open={noteOpen} onClose={() => setNoteOpen(false)} title="Adicionar observação" eyebrow="Perfil do paciente" description={selected ? `Observação interna sobre ${selected.patientName}.` : undefined} icon={StickyNote} className="max-w-xl">
        <form onSubmit={addNote} className="space-y-4">
          <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 text-sm leading-6 text-clinical-muted">A observação fica visível apenas para a equipe e entra no histórico do paciente.</div>
          <ModalField name="note" label="Observação" icon={StickyNote} placeholder="Ex.: Paciente prefere contato por e-mail." required />
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setNoteOpen(false)}>Cancelar</Button>
            <Button type="submit"><Check className="size-4" />Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function AttendanceRow({ attendance, active, onSelect }: { attendance: Attendance; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "animate-list-in w-full rounded-2xl border p-3 text-left transition duration-200",
        active ? "border-clinical-blue/30 bg-clinical-blue/[0.09] shadow-[0_8px_22px_rgba(58,157,202,0.10)]" : "border-transparent hover:bg-clinical-surfaceMuted/70"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={attendance.patientName} status={attendance.status === "Aguardando" ? "busy" : "online"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-extrabold text-clinical-dark">{attendance.patientName}</p>
            <span className="shrink-0 text-[11px] font-bold text-clinical-muted">{attendance.time}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <ChannelIcon channel={attendance.channel} />
            <span className="text-[11px] font-bold text-clinical-muted">{attendance.id}</span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-clinical-slate">{attendance.lastMessage}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
            <PriorityBadge priority={attendance.priority} />
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold", attendance.source === "Humano" ? "bg-clinical-teal/10 text-clinical-teal" : "bg-clinical-blue/10 text-clinical-blueText")}>
              <Bot className="size-3" />
              {attendance.source === "Humano" ? "Humano" : "IA"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2 py-1 text-[11px] font-extrabold text-clinical-slate">
              <UserRound className="size-3" />
              {attendance.responsible}
            </span>
            {attendance.unread > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-clinical-blue text-[10px] font-black text-clinical-charcoal">{attendance.unread}</span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function AttendanceCard({ attendance, active, onSelect }: { attendance: Attendance; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "animate-list-in rounded-2xl border p-4 text-left transition duration-200",
        active ? "border-clinical-blue/30 bg-clinical-blue/[0.09]" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/30 hover:border-clinical-blue/25 hover:bg-clinical-surface"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar name={attendance.patientName} size="lg" status={attendance.status === "Aguardando" ? "busy" : "online"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-clinical-dark">{attendance.patientName}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <ChannelIcon channel={attendance.channel} />
            <span className="text-[11px] font-bold text-clinical-muted">{attendance.id} · {attendance.time}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 min-h-10 text-[13px] leading-5 text-clinical-slate">{attendance.lastMessage}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
        <PriorityBadge priority={attendance.priority} withChip />
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold", attendance.source === "Humano" ? "bg-clinical-teal/10 text-clinical-teal" : "bg-clinical-blue/10 text-clinical-blueText")}>
          <Bot className="size-3" />
          {attendance.source === "Humano" ? "Humano" : "IA"}
        </span>
        {attendance.unread > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-clinical-blue text-[10px] font-black text-clinical-charcoal">{attendance.unread}</span>
        ) : null}
      </div>
    </button>
  );
}

function StatusChip({ label, tone }: { label: string; tone: "blue" | "orange" | "green" | "neutral" }) {
  const styles = {
    blue: "bg-clinical-blue/10 text-clinical-blueText",
    orange: "bg-clinical-orange/12 text-clinical-orange",
    green: "bg-clinical-green/12 text-clinical-green",
    neutral: "bg-clinical-surfaceMuted text-clinical-muted"
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold", styles)}>{label}</span>;
}

function ChatPane({
  attendance,
  messages,
  onSend,
  onAssume,
  onTransfer,
  onClose,
  onOpenProfile,
  quickOpen,
  setQuickOpen
}: {
  attendance: Attendance;
  messages: StoredMessage[];
  onSend: (message: ComposerMessage) => void;
  onAssume: () => void;
  onTransfer: () => void;
  onClose: () => void;
  onOpenProfile: () => void;
  quickOpen: boolean;
  setQuickOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && (last.from === "ai" || last.from === "human")) setTyping(false);
  }, [messages]);

  const lastPatient = [...messages].reverse().find((message) => message.from === "patient");
  const lastReply = messages[messages.length - 1];
  const showSuggestion = Boolean(lastPatient && lastReply && lastReply.from !== "patient");
  const online = attendance.status === "Em atendimento humano" || attendance.status === "Resolvido pela IA";

  function handleSend(message: ComposerMessage) {
    onSend(message);
    if (attendance.source !== "Humano") setTyping(true);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-clinical-border/[0.12] bg-clinical-surfaceMuted/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onOpenProfile} className="flex min-w-0 items-center gap-3 rounded-2xl text-left focus:outline-none focus:ring-2 focus:ring-clinical-blue/25" aria-label={`Abrir perfil de ${attendance.patientName}`}>
            <Avatar name={attendance.patientName} status={online ? "online" : "offline"} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-clinical-dark">{attendance.patientName}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-clinical-muted">
                <ChannelIcon channel={attendance.channel} />
                <span className={cn(online && "text-clinical-green")}>{online ? "online" : "na fila"}</span>
                <span aria-hidden="true">·</span>
                <span>{attendance.id}</span>
              </span>
            </span>
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" className="hidden size-9 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-clinical-surfaceMuted/70 hover:text-clinical-blue sm:flex" aria-label="Ligar para o paciente"><Phone className="size-4" /></button>
          <button type="button" className="hidden size-9 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-clinical-surfaceMuted/70 hover:text-clinical-blue sm:flex" aria-label="Iniciar videochamada"><Video className="size-4" /></button>
          <button type="button" className="flex size-9 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-clinical-surfaceMuted/70 hover:text-clinical-blue" aria-label="Mais opções"><MoreVertical className="size-4" /></button>
          {attendance.source !== "Humano" ? (
            <Button size="sm" onClick={onAssume}><UserRoundCheck className="size-4" />Assumir</Button>
          ) : null}
          <button type="button" onClick={onTransfer} className="flex size-9 items-center justify-center rounded-xl border border-clinical-border/[0.12] text-clinical-muted transition hover:border-clinical-blue/25 hover:text-clinical-blue" aria-label="Transferir atendimento">
            <Send className="size-4" />
          </button>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-xl border border-clinical-border/[0.12] text-clinical-muted transition hover:border-red-500/40 hover:text-red-500" aria-label="Encerrar atendimento">
            <Check className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-clinical-border/[0.10] bg-clinical-surfaceMuted/25 px-4 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
          <PriorityBadge priority={attendance.priority} />
          <span className="truncate text-[11px] font-bold text-clinical-muted">{attendance.queue}</span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-clinical-muted">
          <Timer className="size-3.5 text-clinical-blue" />{attendance.duration}
        </span>
      </div>

      <div ref={scrollRef} className="chat-dots clinical-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto p-4 max-h-[calc(100dvh-250px)] md:max-h-none">
        <div className="flex justify-center"><span className="rounded-full bg-clinical-surfaceMuted/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">Hoje</span></div>
        {messages.map((message) => (
          <AttendanceBubble key={message.id} message={message} />
        ))}
        {typing ? <TypingBubble /> : null}
        {showSuggestion ? (
          <AiSuggestion
            text="Confirmado! Qualquer dúvida, estou por aqui."
            onApply={() => handleSend({ kind: "text", text: "Confirmado! Qualquer dúvida, estou por aqui." })}
          />
        ) : null}
      </div>

      <div className="relative border-t border-clinical-border/[0.12]">
        <QuickReplies open={quickOpen} onPick={(text) => { handleSend({ kind: "text", text }); setQuickOpen(false); }} />
        <div className="flex items-center gap-2 px-3 pt-2.5">
          <button
            type="button"
            aria-label="Respostas rápidas"
            aria-expanded={quickOpen}
            onClick={() => setQuickOpen((current) => !current)}
            className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border transition", quickOpen ? "border-clinical-orange/30 bg-clinical-orange/10 text-clinical-orange" : "border-clinical-border/[0.12] text-clinical-muted hover:border-clinical-blue/25 hover:text-clinical-blue")}
          >
            <MessageSquareText className="size-4" />
          </button>
          <ChatComposer onSend={handleSend} />
        </div>
      </div>
    </>
  );
}

function AttendanceBubble({ message }: { message: StoredMessage }) {
  const mine = message.from === "me";
  const isAi = message.from === "ai";
  const isHuman = message.from === "human";
  return (
    <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "relative max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-sm leading-6 shadow-[0_1px_1px_rgba(38,53,50,0.06)]",
          mine
            ? "rounded-tr-[4px] bg-clinical-whatsapp/15 text-clinical-dark"
            : isAi
              ? "rounded-tl-[4px] border border-clinical-blue/20 bg-clinical-blue/[0.07] text-clinical-slate"
              : isHuman
                ? "rounded-tl-[4px] border border-clinical-teal/20 bg-clinical-teal/[0.08] text-clinical-slate"
                : "rounded-tl-[4px] border border-clinical-border/[0.10] bg-clinical-surface text-clinical-slate"
        )}
      >
        {mine ? (
          <span aria-hidden="true" className="absolute -bottom-px -right-[6px] size-0 border-b-[10px] border-l-[10px] border-b-clinical-whatsapp/15 border-l-transparent" />
        ) : null}
        {!mine && !isAi && !isHuman ? (
          <span aria-hidden="true" className="absolute -bottom-px -left-[6px] size-0 border-b-[10px] border-r-[10px] border-b-clinical-surface border-r-transparent" />
        ) : null}
        {(isAi || isHuman) ? (
          <p className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em]">
            {isAi ? <><Bot className="size-3.5 text-clinical-blue" /><span className="text-clinical-blueText">IA</span></> : <><UserRoundCheck className="size-3.5 text-clinical-teal" /><span className="text-clinical-teal">Equipe</span></>}
          </p>
        ) : null}
        <p className="break-words">{message.text}</p>
        <span className="mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold opacity-60">
          {message.time}
          {mine ? <CheckCheck className="size-3.5 text-clinical-blue" /> : null}
        </span>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end">
      <div className="relative rounded-[14px] rounded-tl-[4px] border border-clinical-border/[0.10] bg-clinical-surface px-4 py-3.5 shadow-[0_1px_1px_rgba(38,53,50,0.06)]">
        <span className="flex items-center gap-1" role="status" aria-label="A IA está digitando">
          <span className="size-1.5 animate-bounce rounded-full bg-clinical-muted" style={{ animationDelay: "0ms" }} />
          <span className="size-1.5 animate-bounce rounded-full bg-clinical-muted" style={{ animationDelay: "120ms" }} />
          <span className="size-1.5 animate-bounce rounded-full bg-clinical-muted" style={{ animationDelay: "240ms" }} />
        </span>
      </div>
    </div>
  );
}

function PatientProfilePane({ attendance, onOpenProfile, onAddNote }: { attendance: Attendance; onOpenProfile: () => void; onAddNote: () => void }) {
  return (
    <div className="clinical-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
      <div className="flex flex-col items-center rounded-2xl bg-clinical-blue/[0.07] p-4 text-center">
        <Avatar name={attendance.patientName} size="xl" />
        <p className="mt-3 text-base font-extrabold text-clinical-dark">{attendance.patientName}</p>
        <p className="mt-0.5 text-xs font-bold text-clinical-muted">{attendance.phone}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
          <PriorityBadge priority={attendance.priority} withChip />
        </div>
        <Button size="sm" variant="secondary" className="mt-4" onClick={onOpenProfile}>
          <UserRoundCheck className="size-4" />Ver paciente
        </Button>
      </div>

      <dl className="mt-5 space-y-4">
        <ProfileField icon={Headphones} label="Unidade" value={attendance.unit} />
        <ProfileField icon={List} label="Fila" value={attendance.queue} />
        <ProfileField icon={UserRoundCheck} label="Responsável" value={attendance.responsible} />
        <ProfileField icon={Bot} label="Automação" value={attendance.source} />
      </dl>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-clinical-dark">Observações</h3>
          <button type="button" onClick={onAddNote} className="flex items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-extrabold text-clinical-blue transition hover:bg-clinical-blue/10" aria-label="Adicionar observação">
            <StickyNote className="size-3.5" />Adicionar
          </button>
        </div>
        <p className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 text-[13px] leading-5 text-clinical-slate">
          Paciente recorrente da clínica. Prefere contato pelo WhatsApp e horários pela manhã.
        </p>
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-sm font-extrabold text-clinical-dark">Histórico resumido</h3>
        <Timeline
          items={[
            { id: "h1", icon: MessageSquareText, title: attendance.lastMessage, subtitle: attendance.channel, date: attendance.time, tone: "blue" },
            { id: "h2", icon: UserRoundCheck, title: "Atendimento em fila de retorno", subtitle: "Recepção acompanhou o caso", date: "Ontem", tone: "green" },
            { id: "h3", icon: Bot, title: "Primeiro contato resolvido pela IA", subtitle: "Agendamento via WhatsApp", date: "12 jul", tone: "neutral" }
          ]}
        />
      </div>

      <button type="button" onClick={onAddNote} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-clinical-blue/30 py-3 text-[13px] font-extrabold text-clinical-blueText transition hover:bg-clinical-blue/[0.07]">
        <StickyNote className="size-4" />Adicionar observação interna
      </button>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-surfaceMuted text-clinical-blue"><Icon className="size-4" /></span>
      <div className="min-w-0">
        <dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">{label}</dt>
        <dd className="truncate text-sm font-bold text-clinical-dark">{value}</dd>
      </div>
    </div>
  );
}
