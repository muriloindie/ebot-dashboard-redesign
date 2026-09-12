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
  attendanceChannels,
  attendanceResponsibles,
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
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Timeline } from "@/components/ui/Timeline";
import { PageHeader, StatePanel } from "@/components/ui/Week1Primitives";
import { ChatComposer, type ComposerMessage } from "@/components/operations/ChatComposer";
import { AiSuggestion, QuickReplies } from "@/components/operations/QuickReplies";
import { cn } from "@/lib/cn";

type StoredMessage = ComposerMessage & { id: string; from: AttendanceMessage["from"]; time: string };
type StoredAttendance = Attendance & { dateOffset?: number; notes?: string[] };
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

function getInitialMessages(source: StoredAttendance[] = attendances) {
  return Object.fromEntries(
    source.map((attendance) => [
      attendance.id,
      attendance.messages.map((message) => ({ id: message.id, kind: "text" as const, text: message.text, from: message.from, time: message.time }))
    ])
  ) as Record<string, StoredMessage[]>;
}

function attendanceDateOffset(attendance: StoredAttendance) {
  return typeof attendance.dateOffset === "number" ? attendance.dateOffset : 0;
}

function messagePreview(message: ComposerMessage) {
  if (message.kind === "text") return message.text?.trim() || "Mensagem enviada.";
  if (message.kind === "image") return `Imagem${message.fileName ? `: ${message.fileName}` : " enviada."}`;
  if (message.kind === "document") return `Documento${message.fileName ? `: ${message.fileName}` : " enviado."}`;
  return "Mensagem de áudio enviada.";
}

export function AttendancesPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const [rows, setRows] = useState<StoredAttendance[]>(attendances);
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

  const [mobileChat, setMobileChat] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const rowsRef = useRef<StoredAttendance[]>(attendances);
  const messagesRef = useRef<Record<string, StoredMessage[]>>({});

  usePageEnter(pageRef, [
    { selector: "[data-filter-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } },
    { selector: "[data-chat-panel]", from: { opacity: 0, x: 24 }, to: { duration: 0.5, ease: "power3.out" } },
    { selector: "[data-queue-panel]", from: { opacity: 0, x: -24 }, to: { duration: 0.5, ease: "power3.out" } }
  ], { stagger: 0.05, delay: 0.05 });

  useEffect(() => {
    const cachedRows = readLocalCache<StoredAttendance[]>(CACHE_ROWS, attendances);
    const seededMessages = getInitialMessages(cachedRows);
    const cachedMessages = readLocalCache<Record<string, StoredMessage[]>>(CACHE_MESSAGES, {});
    const nextMessages = Object.fromEntries(
      cachedRows.map((attendance) => [attendance.id, cachedMessages[attendance.id] ?? seededMessages[attendance.id] ?? []])
    ) as Record<string, StoredMessage[]>;
    rowsRef.current = cachedRows;
    messagesRef.current = nextMessages;
    setRows(cachedRows);
    setMessages(nextMessages);
  }, []);

  const selected = rows.find((attendance) => attendance.id === selectedId) ?? rows[0];
  const responsibles = useMemo(() => [ALL, ...Array.from(new Set([...attendanceResponsibles, ...rows.map((row) => row.responsible)]))], [rows]);
  const periods = ["Hoje", "Ontem", "Últimos 7 dias"];
  const statusOptions = ["Todos", "Aguardando", "Em atendimento humano", "Resolvido pela IA", "Encerrado"];
  const priorityOptions = ["Todos", "Alta", "Média", "Baixa"];

  const hasFilters = channel !== ALL || status !== ALL || responsible !== ALL || priority !== ALL || unit !== ALL || period !== "Hoje";

  const filtered = useMemo(() => {
    return rows.filter((attendance) => {
      const conversationText = (messages[attendance.id] ?? []).map((message) => message.text).join(" ").toLowerCase();
      const matchesSearch = `${attendance.clientName} ${attendance.lastMessage} ${attendance.phone} ${attendance.id} ${conversationText}`.toLowerCase().includes(search.toLowerCase());
      const matchesChannel = channel === ALL || attendance.channel === channel;
      const matchesStatus = status === ALL || attendance.status === status;
      const matchesResponsible = responsible === ALL || attendance.responsible === responsible;
      const matchesPriority = priority === ALL || attendance.priority === priority;
      const matchesUnit = unit === ALL || attendance.unit === unit;
      const offset = attendanceDateOffset(attendance);
      const matchesPeriod = period === "Hoje" ? offset === 0 : period === "Ontem" ? offset === -1 : offset >= -6 && offset <= 0;
      return matchesSearch && matchesChannel && matchesStatus && matchesResponsible && matchesPriority && matchesUnit && matchesPeriod;
    });
  }, [rows, messages, search, channel, status, responsible, priority, unit, period]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const order = { Alta: 0, Média: 1, Baixa: 2 };
    list.sort((a, b) => order[a.priority] - order[b.priority] || b.unread - a.unread);
    return list;
  }, [filtered]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function persistRows(next: StoredAttendance[]) {
    rowsRef.current = next;
    setRows(next);
    writeLocalCache(CACHE_ROWS, next);
  }

  function persistMessage(id: string, message: StoredMessage) {
    const nextMessages = { ...messagesRef.current, [id]: [...(messagesRef.current[id] ?? []), message] };
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    writeLocalCache(CACHE_MESSAGES, nextMessages);

    const currentRow = rowsRef.current.find((row) => row.id === id);
    if (!currentRow) return;
    const unread = message.from === "client" ? currentRow.unread + 1 : 0;
    persistRows(rowsRef.current.map((row) => row.id === id ? { ...row, lastMessage: messagePreview(message), time: message.time, unread } : row));
  }

  function patchAttendance(id: string, patch: Partial<StoredAttendance>, extraMessage?: AttendanceMessage) {
    persistRows(rowsRef.current.map((row) => row.id === id ? { ...row, ...patch } : row));
    if (extraMessage) {
      persistMessage(id, { id: extraMessage.id, kind: "text", text: extraMessage.text, from: extraMessage.from, time: extraMessage.time });
    }
  }

  function sendMessage(message: ComposerMessage) {
    if (!selected) return;
    if (selected.status === "Encerrado") {
      showNotice("Reabra o atendimento para enviar uma mensagem.");
      return;
    }
    persistMessage(selected.id, { ...message, id: `${selected.id}-${Date.now()}`, from: "me", time: "agora" });
    if (selected.source !== "Humano") {
      const attendanceId = selected.id;
      window.setTimeout(() => {
        const current = rowsRef.current.find((row) => row.id === attendanceId);
        if (!current || current.status === "Encerrado") return;
        persistMessage(attendanceId, {
          kind: "text",
          text: "Recebi sua mensagem. Vou confirmar com a equipe e retorno em instantes.",
          id: `${attendanceId}-ai-${Date.now()}`,
          from: "ai",
          time: "agora"
        });
      }, 1100);
    }
  }

  function assumeAttendance() {
    if (!selected || selected.status === "Encerrado") return;
    patchAttendance(
      selected.id,
      { status: "Em atendimento humano", responsible: "Marina Costa", source: "Humano" },
      { id: `sys-${Date.now()}`, from: "human", text: "Atendimento assumido por Marina Costa. A partir de agora o acompanhamento é humano.", time: "agora" }
    );
    showNotice(`Atendimento ${selected.id} assumido por Marina Costa.`);
  }

  function transferAttendance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || selected.status === "Encerrado") return;
    const target = String(new FormData(event.currentTarget).get("responsible") ?? "").trim();
    if (!target || target === selected.responsible) {
      showNotice("Escolha um responsável diferente do atual.");
      return;
    }
    patchAttendance(
      selected.id,
      { responsible: target, source: "IA + humano" },
      { id: `sys-${Date.now()}`, from: "human", text: `Atendimento transferido para ${target}.`, time: "agora" }
    );
    setTransferOpen(false);
    showNotice(`Atendimento transferido para ${target}.`);
  }

  function closeAttendance() {
    if (!selected || selected.status === "Encerrado") return;
    patchAttendance(selected.id, { status: "Encerrado" }, {
      id: `sys-${Date.now()}`,
      from: "human",
      text: "Atendimento encerrado pela equipe. O histórico permanece disponível para agendamento.",
      time: "agora"
    });
    setCloseOpen(false);
    showNotice(`Atendimento ${selected.id} encerrado.`);
  }

  function reopenAttendance() {
    if (!selected || selected.status !== "Encerrado") return;
    const nextStatus = selected.source === "Humano" || selected.source === "IA + humano" ? "Em atendimento humano" : "Aguardando";
    patchAttendance(selected.id, { status: nextStatus }, {
      id: `sys-${Date.now()}`,
      from: "human",
      text: `Atendimento reaberto pela equipe e movido para ${nextStatus === "Aguardando" ? "a fila de atendimento" : "o atendimento humano"}.`,
      time: "agora"
    });
    showNotice(`Atendimento ${selected.id} reaberto.`);
  }

  function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const note = String(new FormData(event.currentTarget).get("note") ?? "").trim();
    if (!note) {
      showNotice("Escreva uma observação antes de registrar.");
      return;
    }
    persistRows(rowsRef.current.map((row) => row.id === selected.id ? { ...row, notes: [...(row.notes ?? []), note] } : row));
    setNoteOpen(false);
    showNotice("Observação registrada no histórico do atendimento.");
  }

  function createAttendance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!name || !phone) {
      showNotice("Informe o nome e o telefone do cliente.");
      return;
    }
    const highestId = rowsRef.current.reduce((highest, row) => {
      const value = Number(row.id.match(/(\d+)$/)?.[1] ?? 0);
      return Math.max(highest, value);
    }, 1100);
    const initialMessage: AttendanceMessage = { id: `init-${Date.now()}`, from: "human", text: "Atendimento criado pela central. A IA assumirá o primeiro contato.", time: "agora" };
    const next: StoredAttendance = {
      id: `AT-${String(highestId + 1)}`,
      clientName: name,
      phone,
      channel: String(form.get("channel") ?? "WhatsApp") as Attendance["channel"],
      status: "Aguardando",
      priority: String(form.get("priority") ?? "Média") as Attendance["priority"],
      responsible: "IA",
      source: "IA" as AttendanceSource,
      unit: String(form.get("unit") ?? "Filial Centro") as Attendance["unit"],
      sector: String(form.get("sector") ?? "Atendimento"),
      queue: String(form.get("queue") ?? "Primeiro contato"),
      lastMessage: "Atendimento iniciado pela equipe.",
      time: "agora",
      unread: 0,
      startedAt: "agora",
      duration: "0 min",
      dateOffset: 0,
      notes: [],
      messages: [initialMessage]
    };
    const nextRows = [next, ...rowsRef.current];
    persistRows(nextRows);
    persistMessage(next.id, { ...initialMessage, kind: "text" });
    setSelectedId(next.id);
    setMobileChat(true);
    setNewOpen(false);
    showNotice(`Atendimento criado para ${name}.`);
  }

  function selectAttendance(id: string) {
    setSelectedId(id);
    setMobileChat(true);
    const row = rowsRef.current.find((attendance) => attendance.id === id);
    if (row?.unread) persistRows(rowsRef.current.map((attendance) => attendance.id === id ? { ...attendance, unread: 0 } : attendance));
  }

  function markSelectedUnread() {
    if (!selected) return;
    persistRows(rowsRef.current.map((row) => row.id === selected.id ? { ...row, unread: Math.max(1, row.unread) } : row));
    showNotice(`Atendimento ${selected.id} marcado como não lido.`);
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
    <div ref={pageRef} className="md:flex md:h-[calc(100dvh-97px)] md:flex-col md:overflow-hidden lg:h-[calc(100dvh-113px)] xl:h-[calc(100dvh-129px)]">
      <PageHeader
        eyebrow="Operação / Central de atendimento"
        title="Atendimentos"
        description="Gerencie conversas, clientes e atendimentos em tempo real."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-orange/[0.10] px-3 py-2 text-xs font-extrabold text-ebot-orange"><Clock3 className="size-4" />{unreadTotal} não lidos na fila</span>}
        action={<Button onClick={() => setNewOpen(true)}><UserPlus className="size-4" />Novo atendimento</Button>}
      />

      <div data-filter-bar className="mb-3 flex shrink-0 flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ebot-muted">Filtros da fila</p>
          <div className="flex shrink-0 items-center gap-2">
            <ViewSwitch views={[{ id: "lista", label: "Lista", icon: List }, { id: "cards", label: "Cards", icon: LayoutGrid }]} value={view} onChange={(id) => setView(id as ViewMode)} />
            {hasFilters ? (
              <button type="button" onClick={clearFilters} className="flex h-9 shrink-0 items-center gap-2 rounded-2xl border border-ebot-orange/25 bg-ebot-orange/[0.08] px-3 text-xs font-extrabold text-ebot-orange transition hover:bg-ebot-orange/[0.14]">
                <X className="size-3.5" />Limpar filtros
              </button>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          <Dropdown label="Canal" value={channel} options={[ALL, ...attendanceChannels]} onChange={setChannel} />
          <Dropdown label="Status" value={status} options={statusOptions} onChange={setStatus} />
          <Dropdown label="Prioridade" value={priority} options={priorityOptions} onChange={setPriority} />
          <Dropdown label="Atendente" value={responsible} options={responsibles} onChange={setResponsible} />
          <Dropdown label="Filial" value={unit} options={[ALL, ...attendanceUnits]} onChange={setUnit} />
          <Dropdown label="Período" value={period} options={periods} onChange={setPeriod} />
        </div>
      </div>

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
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
        <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(240px,0.66fr)_minmax(0,1.34fr)] md:items-stretch">
          <section data-queue-panel className={cn("min-h-0 min-w-0 flex-col overflow-hidden rounded-[24px] border border-ebot-border/[0.14] border-t-[3px] border-t-ebot-slate/60 bg-ebot-surface/75 md:flex md:h-full", mobileChat ? "hidden" : "flex")}>
            <div className="border-b border-ebot-border/[0.12] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-extrabold text-ebot-dark">Fila de atendimento</h2>
                <span className="text-xs font-bold text-ebot-muted">{filtered.length} registros</span>
              </div>
              <div className="mt-2.5">
                <label className="flex h-9 min-w-0 w-full items-center gap-2 rounded-xl border border-ebot-border/[0.14] bg-ebot-surface/80 px-3 text-xs text-ebot-muted transition focus-within:border-ebot-primary/45 focus-within:ring-2 focus-within:ring-ebot-primary/10">
                  <Search className="size-3.5 shrink-0 text-ebot-primary" aria-hidden="true" />
                  <span className="sr-only">Buscar na fila</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome ou texto da conversa" className="min-w-0 flex-1 bg-transparent font-medium text-ebot-dark outline-none placeholder:text-ebot-muted/70" />
                </label>
              </div>
            </div>
            <div className="ebot-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
              {view === "lista" ? (
                <div className="space-y-1">
                  {sorted.map((attendance) => (
                    <AttendanceRow key={attendance.id} attendance={attendance} active={attendance.id === selected?.id} onSelect={() => selectAttendance(attendance.id)} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {sorted.map((attendance) => (
                    <AttendanceCard key={attendance.id} attendance={attendance} active={attendance.id === selected?.id} onSelect={() => selectAttendance(attendance.id)} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section data-chat-panel className={cn("min-h-0 min-w-0 flex-col overflow-hidden rounded-[24px] border border-ebot-primary/15 border-t-[3px] border-t-ebot-primary/70 bg-ebot-surface shadow-[0_18px_44px_rgba(4,27,21,0.10)] md:flex md:h-full", mobileChat ? "flex" : "hidden")}>
            <div className="flex items-center gap-2 border-b border-ebot-border/[0.12] px-2 py-1.5 md:hidden">
              <button type="button" onClick={() => setMobileChat(false)} className="flex h-9 items-center gap-1.5 rounded-xl px-2 text-xs font-extrabold text-ebot-primary transition hover:bg-ebot-primary/10" aria-label="Voltar para a fila de atendimento">
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
              onReopen={reopenAttendance}
              onPhone={() => showNotice(`Ligação local preparada para ${selected?.clientName ?? "o cliente"}.`)}
              onVideo={() => showNotice(`Videochamada local preparada para ${selected?.clientName ?? "o cliente"}.`)}
              onMenuAction={(action) => {
                if (action === "unread") markSelectedUnread();
                if (action === "profile") setProfileDrawerOpen(true);
                if (action === "id") showNotice(`Identificação do atendimento: ${selected?.id ?? "indisponível"}.`);
              }}
              onOpenProfile={() => setProfileDrawerOpen(true)}
              quickOpen={quickOpen}
              setQuickOpen={setQuickOpen}
            />
          </section>
        </div>
      )}

      <Drawer open={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} title="Perfil do cliente" description={selected?.clientName} width="max-w-lg">
        {selected ? <ClientProfilePane attendance={selected} onOpenProfile={() => { setProfileDrawerOpen(false); router.push(`/contatos?q=${encodeURIComponent(selected.clientName)}`); }} onAddNote={() => setNoteOpen(true)} /> : null}
      </Drawer>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Novo atendimento" eyebrow="Central de atendimento" description="Crie um atendimento manualmente e deixe a IA assumir o primeiro contato." icon={UserPlus} className="max-w-2xl">
        <form onSubmit={createAttendance} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="name" label="Nome do cliente" icon={UserPlus} placeholder="Ex.: Camila Rodrigues" required />
            <ModalField name="phone" label="Telefone" icon={PhoneCall} placeholder="+55 11 99999-9999" required />
            <ModalSelect name="channel" label="Canal" icon={MessageSquareText} defaultValue="WhatsApp">
              <option>WhatsApp</option><option>Instagram</option><option>E-mail</option><option>Telefone</option>
            </ModalSelect>
            <ModalSelect name="priority" label="Prioridade" icon={Flag} defaultValue="Média">
              <option>Alta</option><option>Média</option><option>Baixa</option>
            </ModalSelect>
            <ModalSelect name="unit" label="Filial" icon={Headphones} defaultValue="Filial Centro">
              <option>Filial Centro</option><option>Filial Norte</option><option>Filial Sul</option>
            </ModalSelect>
            <ModalSelect name="sector" label="Setor" icon={StickyNote} defaultValue="Atendimento">
              <option>Atendimento</option><option>Frota</option><option>Corporativo</option><option>Varejo</option><option>Suporte</option><option>Pedidos</option>
            </ModalSelect>
            <ModalField name="queue" label="Fila" icon={List} placeholder="Ex.: Primeiro contato" className="sm:col-span-2" />
          </div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button type="submit"><Plus className="size-4" />Criar atendimento</Button>
          </div>
        </form>
      </Modal>

      <Modal open={transferOpen} onClose={() => setTransferOpen(false)} title="Transferir atendimento" eyebrow="Central de atendimento" description={selected ? `Transferir ${selected.id} para outro responsável.` : undefined} icon={UserRoundCheck} className="max-w-xl">
        <form onSubmit={transferAttendance} className="space-y-4">
          <ModalSelect name="responsible" label="Responsável" icon={UserRoundCheck} defaultValue={selected?.responsible === "Marina Costa" ? "Julia Alves" : "Marina Costa"}>
            {Array.from(new Set([...attendanceResponsibles.filter((responsible) => responsible !== "IA" && responsible !== "IA + humano"), ...rows.map((row) => row.responsible)]))
              .filter((responsible) => responsible !== "IA" && responsible !== "IA + humano" && responsible !== selected?.responsible)
              .map((responsible) => <option key={responsible}>{responsible}</option>)}
          </ModalSelect>
          <div className="rounded-2xl border border-ebot-primary/15 bg-ebot-primary/[0.06] p-3 text-xs font-semibold leading-5 text-ebot-slate">O cliente será informado sobre a transferência e o histórico completo acompanha a conversa.</div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setTransferOpen(false)}>Cancelar</Button>
            <Button type="submit"><Send className="size-4" />Transferir</Button>
          </div>
        </form>
      </Modal>

      <Modal open={closeOpen} onClose={() => setCloseOpen(false)} title="Encerrar atendimento" eyebrow="Central de atendimento" description={selected ? `Encerrar o atendimento ${selected.id} de ${selected.clientName}?` : undefined} icon={Check} className="max-w-xl">
        <div className="space-y-4">
          <div className="rounded-2xl border border-ebot-orange/20 bg-ebot-orange/[0.07] p-3 text-xs font-semibold leading-5 text-ebot-slate">O atendimento sairá da fila ativa e o histórico continuará disponível no perfil do cliente.</div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setCloseOpen(false)}>Cancelar</Button>
            <Button type="button" onClick={closeAttendance}><Check className="size-4" />Encerrar atendimento</Button>
          </div>
        </div>
      </Modal>

      <Modal open={noteOpen} onClose={() => setNoteOpen(false)} title="Adicionar observação" eyebrow="Perfil do cliente" description={selected ? `Observação interna sobre ${selected.clientName}.` : undefined} icon={StickyNote} className="max-w-xl">
        <form onSubmit={addNote} className="space-y-4">
          <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3 text-sm leading-6 text-ebot-muted">A observação fica visível apenas para a equipe e entra no histórico do cliente.</div>
          <ModalField name="note" label="Observação" icon={StickyNote} placeholder="Ex.: Cliente prefere contato por e-mail." required />
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
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
      data-attendance-item
      data-attendance-status={attendance.status}
      onClick={onSelect}
      className={cn(
        "animate-list-in w-full rounded-2xl border p-3 text-left transition duration-200",
        active ? "border-ebot-primary/30 bg-ebot-primary/[0.09] shadow-[0_8px_22px_rgba(4,27,21,0.10)]" : "border-transparent hover:bg-ebot-surfaceMuted/70"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={attendance.clientName} status={attendance.status === "Aguardando" ? "busy" : "online"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-extrabold text-ebot-dark">{attendance.clientName}</p>
            <span className="shrink-0 text-[11px] font-bold text-ebot-muted">{attendance.time}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <ChannelIcon channel={attendance.channel} />
            <span className="text-[11px] font-bold text-ebot-muted">{attendance.id}</span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-ebot-slate">{attendance.lastMessage}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
            <PriorityBadge priority={attendance.priority} />
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold", attendance.source === "Humano" ? "bg-ebot-teal/10 text-ebot-teal" : "bg-ebot-primary/10 text-ebot-primaryText")}>
              <Bot className="size-3" />
              {attendance.source === "Humano" ? "Humano" : "IA"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-ebot-surfaceMuted px-2 py-1 text-[11px] font-extrabold text-ebot-slate">
              <UserRound className="size-3" />
              {attendance.responsible}
            </span>
            {attendance.unread > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-ebot-primary text-[10px] font-black text-ebot-charcoal">{attendance.unread}</span>
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
      data-attendance-item
      data-attendance-status={attendance.status}
      onClick={onSelect}
      className={cn(
        "animate-list-in rounded-2xl border p-4 text-left transition duration-200",
        active ? "border-ebot-primary/30 bg-ebot-primary/[0.09]" : "border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 hover:border-ebot-primary/25 hover:bg-ebot-surface"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar name={attendance.clientName} size="lg" status={attendance.status === "Aguardando" ? "busy" : "online"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-ebot-dark">{attendance.clientName}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <ChannelIcon channel={attendance.channel} />
            <span className="text-[11px] font-bold text-ebot-muted">{attendance.id} · {attendance.time}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 min-h-10 text-[13px] leading-5 text-ebot-slate">{attendance.lastMessage}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
        <PriorityBadge priority={attendance.priority} withChip />
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold", attendance.source === "Humano" ? "bg-ebot-teal/10 text-ebot-teal" : "bg-ebot-primary/10 text-ebot-primaryText")}>
          <Bot className="size-3" />
          {attendance.source === "Humano" ? "Humano" : "IA"}
        </span>
        {attendance.unread > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-ebot-primary text-[10px] font-black text-ebot-charcoal">{attendance.unread}</span>
        ) : null}
      </div>
    </button>
  );
}

function StatusChip({ label, tone }: { label: string; tone: "blue" | "orange" | "green" | "neutral" }) {
  const styles = {
    blue: "bg-ebot-primary/10 text-ebot-primaryText",
    orange: "bg-ebot-orange/12 text-ebot-orange",
    green: "bg-ebot-green/12 text-ebot-green",
    neutral: "bg-ebot-surfaceMuted text-ebot-muted"
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
  onReopen,
  onPhone,
  onVideo,
  onMenuAction,
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
  onReopen: () => void;
  onPhone: () => void;
  onVideo: () => void;
  onMenuAction: (action: "unread" | "profile" | "id") => void;
  onOpenProfile: () => void;
  quickOpen: boolean;
  setQuickOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && (last.from === "ai" || last.from === "human")) setTyping(false);
  }, [messages]);

  const lastClient = [...messages].reverse().find((message) => message.from === "client");
  const lastReply = messages[messages.length - 1];
  const closed = attendance.status === "Encerrado";
  const showSuggestion = !closed && Boolean(lastClient && lastReply && lastReply.from !== "client");
  const online = attendance.status === "Em atendimento humano" || attendance.status === "Resolvido pela IA";

  function handleSend(message: ComposerMessage) {
    if (closed) return;
    onSend(message);
    if (attendance.source !== "Humano") setTyping(true);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-ebot-border/[0.12] bg-ebot-surfaceMuted/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onOpenProfile} className="flex min-w-0 items-center gap-3 rounded-2xl text-left focus:outline-none focus:ring-2 focus:ring-ebot-primary/25" aria-label={`Abrir perfil de ${attendance.clientName}`}>
            <Avatar name={attendance.clientName} status={online ? "online" : "offline"} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-ebot-dark">{attendance.clientName}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-ebot-muted">
                <ChannelIcon channel={attendance.channel} />
                <span className={cn(online && "text-ebot-green")}>{online ? "online" : "na fila"}</span>
                <span aria-hidden="true">·</span>
                <span>{attendance.id}</span>
              </span>
            </span>
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={onPhone} disabled={closed} className="hidden size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-surfaceMuted/70 hover:text-ebot-primary disabled:cursor-not-allowed disabled:opacity-40 sm:flex" aria-label="Ligar para o cliente" title={closed ? "Ação indisponível em atendimento encerrado" : "Ligar para o cliente"}><Phone className="size-4" /></button>
          <button type="button" onClick={onVideo} disabled={closed} className="hidden size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-surfaceMuted/70 hover:text-ebot-primary disabled:cursor-not-allowed disabled:opacity-40 sm:flex" aria-label="Iniciar videochamada" title={closed ? "Ação indisponível em atendimento encerrado" : "Iniciar videochamada"}><Video className="size-4" /></button>
          <div className="relative">
            <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-haspopup="menu" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-surfaceMuted/70 hover:text-ebot-primary" aria-label="Mais opções"><MoreVertical className="size-4" /></button>
            {menuOpen ? (
              <div role="menu" className="absolute right-0 top-11 z-30 w-52 rounded-2xl border border-ebot-border/[0.14] bg-ebot-surface p-2 shadow-ebot">
                <button type="button" role="menuitem" onClick={() => { onMenuAction("unread"); setMenuOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-xs font-bold text-ebot-slate transition hover:bg-ebot-primary/[0.08] hover:text-ebot-primary">Marcar como não lido</button>
                <button type="button" role="menuitem" onClick={() => { onMenuAction("profile"); setMenuOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-xs font-bold text-ebot-slate transition hover:bg-ebot-primary/[0.08] hover:text-ebot-primary">Abrir perfil do cliente</button>
                <button type="button" role="menuitem" onClick={() => { onMenuAction("id"); setMenuOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-xs font-bold text-ebot-slate transition hover:bg-ebot-primary/[0.08] hover:text-ebot-primary">Ver identificação do atendimento</button>
              </div>
            ) : null}
          </div>
          {closed ? (
            <Button type="button" size="sm" onClick={onReopen}><UserRoundCheck className="size-4" />Reabrir</Button>
          ) : attendance.source !== "Humano" ? (
            <Button type="button" size="sm" onClick={onAssume}><UserRoundCheck className="size-4" />Assumir</Button>
          ) : null}
          <button type="button" onClick={onTransfer} disabled={closed} className="flex size-9 items-center justify-center rounded-xl border border-ebot-border/[0.12] text-ebot-muted transition hover:border-ebot-primary/25 hover:text-ebot-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="Transferir atendimento" title={closed ? "Ação indisponível em atendimento encerrado" : "Transferir atendimento"}>
            <Send className="size-4" />
          </button>
          <button type="button" onClick={onClose} disabled={closed} className="flex size-9 items-center justify-center rounded-xl border border-ebot-border/[0.12] text-ebot-muted transition hover:border-red-500/40 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Encerrar atendimento" title={closed ? "Atendimento já encerrado" : "Encerrar atendimento"}>
            <Check className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-ebot-border/[0.10] bg-ebot-surfaceMuted/25 px-4 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
          <PriorityBadge priority={attendance.priority} />
          <span className="truncate text-[11px] font-bold text-ebot-muted">{attendance.queue}</span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-ebot-muted">
          <Timer className="size-3.5 text-ebot-primary" />{attendance.duration}
        </span>
      </div>

      <div ref={scrollRef} className="chat-dots ebot-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto p-4 max-h-[calc(100dvh-250px)] md:max-h-none">
        <div className="flex justify-center"><span className="rounded-full bg-ebot-surfaceMuted/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Hoje</span></div>
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

       <div className="relative border-t border-ebot-border/[0.12]">
         {closed ? (
           <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs font-bold text-ebot-muted">
             <span>Este atendimento está encerrado e não aceita novas mensagens.</span>
             <Button type="button" size="sm" variant="secondary" onClick={onReopen}>Reabrir atendimento</Button>
           </div>
         ) : (
           <>
             <QuickReplies open={quickOpen} onPick={(text) => { handleSend({ kind: "text", text }); setQuickOpen(false); }} />
             <div className="flex items-center gap-2 px-3 pt-2.5">
               <button
                 type="button"
                 aria-label="Respostas rápidas"
                 aria-expanded={quickOpen}
                 onClick={() => setQuickOpen((current) => !current)}
                 className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border transition", quickOpen ? "border-ebot-orange/30 bg-ebot-orange/10 text-ebot-orange" : "border-ebot-border/[0.12] text-ebot-muted hover:border-ebot-primary/25 hover:text-ebot-primary")}
               >
                 <MessageSquareText className="size-4" />
               </button>
               <ChatComposer onSend={handleSend} />
             </div>
           </>
         )}
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
          "relative max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-sm leading-6 shadow-[0_1px_1px_rgba(4,27,21,0.06)]",
          mine
            ? "rounded-tr-[4px] bg-ebot-whatsapp/15 text-ebot-dark"
            : isAi
              ? "rounded-tl-[4px] border border-ebot-primary/20 bg-ebot-primary/[0.07] text-ebot-slate"
              : isHuman
                ? "rounded-tl-[4px] border border-ebot-teal/20 bg-ebot-teal/[0.08] text-ebot-slate"
                : "rounded-tl-[4px] border border-ebot-border/[0.10] bg-ebot-surface text-ebot-slate"
        )}
      >
        {mine ? (
          <span aria-hidden="true" className="absolute -bottom-px -right-[6px] size-0 border-b-[10px] border-l-[10px] border-b-ebot-whatsapp/15 border-l-transparent" />
        ) : null}
        {!mine && !isAi && !isHuman ? (
          <span aria-hidden="true" className="absolute -bottom-px -left-[6px] size-0 border-b-[10px] border-r-[10px] border-b-ebot-surface border-r-transparent" />
        ) : null}
        {(isAi || isHuman) ? (
          <p className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em]">
            {isAi ? <><Bot className="size-3.5 text-ebot-primary" /><span className="text-ebot-primaryText">IA</span></> : <><UserRoundCheck className="size-3.5 text-ebot-teal" /><span className="text-ebot-teal">Equipe</span></>}
          </p>
        ) : null}
        <p className="break-words">{message.text}</p>
        <span className="mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold opacity-60">
          {message.time}
          {mine ? <CheckCheck className="size-3.5 text-ebot-primary" /> : null}
        </span>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end">
      <div className="relative rounded-[14px] rounded-tl-[4px] border border-ebot-border/[0.10] bg-ebot-surface px-4 py-3.5 shadow-[0_1px_1px_rgba(4,27,21,0.06)]">
        <span className="flex items-center gap-1" role="status" aria-label="A IA está digitando">
          <span className="size-1.5 animate-bounce rounded-full bg-ebot-muted" style={{ animationDelay: "0ms" }} />
          <span className="size-1.5 animate-bounce rounded-full bg-ebot-muted" style={{ animationDelay: "120ms" }} />
          <span className="size-1.5 animate-bounce rounded-full bg-ebot-muted" style={{ animationDelay: "240ms" }} />
        </span>
      </div>
    </div>
  );
}

function ClientProfilePane({ attendance, onOpenProfile, onAddNote }: { attendance: StoredAttendance; onOpenProfile: () => void; onAddNote: () => void }) {
  return (
    <div className="ebot-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
      <div className="flex flex-col items-center rounded-2xl bg-ebot-primary/[0.07] p-4 text-center">
        <Avatar name={attendance.clientName} size="xl" />
        <p className="mt-3 text-base font-extrabold text-ebot-dark">{attendance.clientName}</p>
        <p className="mt-0.5 text-xs font-bold text-ebot-muted">{attendance.phone}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          <StatusChip label={attendance.status} tone={statusTone[attendance.status]} />
          <PriorityBadge priority={attendance.priority} withChip />
        </div>
        <Button type="button" size="sm" variant="secondary" className="mt-4" onClick={onOpenProfile}>
          <UserRoundCheck className="size-4" />Ver cliente
        </Button>
      </div>

      <dl className="mt-5 space-y-4">
        <ProfileField icon={Headphones} label="Filial" value={attendance.unit} />
        <ProfileField icon={List} label="Fila" value={attendance.queue} />
        <ProfileField icon={UserRoundCheck} label="Responsável" value={attendance.responsible} />
        <ProfileField icon={Bot} label="Automação" value={attendance.source} />
      </dl>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-ebot-dark">Observações</h3>
          <button type="button" onClick={onAddNote} className="flex items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-extrabold text-ebot-primary transition hover:bg-ebot-primary/10" aria-label="Adicionar observação">
            <StickyNote className="size-3.5" />Adicionar
          </button>
        </div>
        <div className="space-y-2">
          <p className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3 text-[13px] leading-5 text-ebot-slate">
            Cliente recorrente da empresa. Prefere contato pelo WhatsApp e horários pela manhã.
          </p>
          {(attendance.notes ?? []).map((note, index) => (
            <p key={`${attendance.id}-note-${index}`} className="rounded-2xl border border-ebot-orange/15 bg-ebot-orange/[0.06] p-3 text-[13px] leading-5 text-ebot-slate">
              {note}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-sm font-extrabold text-ebot-dark">Histórico resumido</h3>
        <Timeline
          items={[
            { id: "h1", icon: MessageSquareText, title: attendance.lastMessage, subtitle: attendance.channel, date: attendance.time, tone: "blue" },
            { id: "h2", icon: UserRoundCheck, title: "Atendimento em fila de retorno", subtitle: "Atendimento acompanhou o caso", date: "Ontem", tone: "green" },
            { id: "h3", icon: Bot, title: "Primeiro contato resolvido pela IA", subtitle: "Agendamento via WhatsApp", date: "12 jul", tone: "neutral" }
          ]}
        />
      </div>

      <button type="button" onClick={onAddNote} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ebot-primary/30 py-3 text-[13px] font-extrabold text-ebot-primaryText transition hover:bg-ebot-primary/[0.07]">
        <StickyNote className="size-4" />Adicionar observação interna
      </button>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ebot-surfaceMuted text-ebot-primary"><Icon className="size-4" /></span>
      <div className="min-w-0">
        <dt className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">{label}</dt>
        <dd className="truncate text-sm font-bold text-ebot-dark">{value}</dd>
      </div>
    </div>
  );
}
