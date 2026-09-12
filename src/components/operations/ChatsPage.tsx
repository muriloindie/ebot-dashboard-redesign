"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, DoorOpen, MessageCircle, Pin, PinOff, Search, SearchX, UserPlus, Users, UsersRound } from "lucide-react";
import { chatThreads } from "@/data/operationsMock";
import { listUsers } from "@/lib/company/companyService";
import { useDemo } from "@/components/state/DemoProvider";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ModalChoice, ModalField } from "@/components/ui/ModalField";
import { ChatComposer, MessageBubble, type ComposerMessage } from "@/components/operations/ChatComposer";
import { PageHeader, SegmentedTabs, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

type ChatStatus = "online" | "busy" | "offline";
type ChatThread = {
  id: string;
  name: string;
  initials: string;
  team: string;
  status: ChatStatus;
  preview: string;
  time: string;
  unread: number;
  kind?: "dm" | "group";
  pinned?: boolean;
  color?: string;
  members?: string[];
};
type StoredMessage = ComposerMessage & { id: string; from: "me" | "them"; time: string; status?: "sent" | "delivered" | "read" };
type ComposerState = "idle" | "sending" | "sent" | "error";

const THREADS_CACHE_KEY = "ebot-week1-chat-threads";
const MESSAGES_CACHE_KEY = "ebot-week1-chat-messages";
const threadSeed: ChatThread[] = [
  {
    id: "CH-20",
    name: "Plantão do atendimento",
    initials: "PR",
    team: "Canal interno",
    status: "online",
    preview: "Mariana: confirmo o horário das 14h.",
    time: "09:12",
    unread: 3,
    kind: "group",
    pinned: true,
    color: "#6B942E",
    members: ["Mariana Duarte", "Rafael Lima", "Camila Rodrigues", "Lucas Ferreira"]
  },
  ...chatThreads.map((chat) => ({
    id: chat.id,
    name: chat.name,
    initials: chat.initials,
    team: chat.team,
    status: chat.status as ChatStatus,
    preview: chat.preview,
    time: chat.time,
    unread: chat.unread,
    kind: "dm" as const,
    pinned: false,
    members: [chat.name]
  }))
];
const messageSeed = Object.fromEntries(chatThreads.map((chat) => [
  chat.id,
  chat.messages.map((message, index) => ({
    id: `${chat.id}-${index}`,
    kind: "text" as const,
    text: message.text,
    from: message.from === "me" ? "me" as const : "them" as const,
    time: message.time,
    status: message.from === "me" ? "read" as const : undefined
  }))
])) as Record<string, StoredMessage[]>;

function messageSummary(message: ComposerMessage) {
  if (message.kind === "text") return message.text || "Mensagem de texto";
  if (message.kind === "audio") return "Áudio";
  return message.fileName || (message.kind === "image" ? "Imagem" : "Documento");
}

function initialsFromName(name: string) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return initials || "NC";
}

function nextThreadId(threads: ChatThread[]) {
  const numbers = threads.map((thread) => Number(thread.id.replace("CH-", ""))).filter((value) => Number.isFinite(value));
  return `CH-${String(Math.max(0, ...numbers) + 1).padStart(2, "0")}`;
}

export function ChatsPage() {
  const { toast } = useDemo();
  const [threads, setThreads] = useState<ChatThread[]>(threadSeed);
  const [selectedId, setSelectedId] = useState(threadSeed[0]?.id ?? "");
  const [tab, setTab] = useState("Todas");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Record<string, StoredMessage[]>>(messageSeed);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatType, setNewChatType] = useState<"individual" | "team">("individual");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [composerState, setComposerState] = useState<ComposerState>("idle");
  const [composerError, setComposerError] = useState("");
  const [lastFailedMessage, setLastFailedMessage] = useState<ComposerMessage | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [membersOpen, setMembersOpen] = useState(false);
  const [candidates] = useState(() => listUsers());
  const [inviteDraft, setInviteDraft] = useState("");

  useEffect(() => {
    const cachedThreads = readLocalCache(THREADS_CACHE_KEY, threadSeed);
    setThreads(cachedThreads);
    setMessages(readLocalCache(MESSAGES_CACHE_KEY, messageSeed));
    setSelectedId(cachedThreads[0]?.id ?? "");
  }, []);

  useEffect(() => {
    if (threads.length && !threads.some((thread) => thread.id === selectedId)) setSelectedId(threads[0].id);
  }, [selectedId, threads]);

  useEffect(() => {
    if (!playingId) return;
    const timer = window.setTimeout(() => setPlayingId(null), 1800);
    return () => window.clearTimeout(timer);
  }, [playingId]);

  useEffect(() => {
    if (composerState !== "sent") return;
    const timer = window.setTimeout(() => setComposerState("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [composerState]);

  const selected = threads.find((thread) => thread.id === selectedId) ?? null;
  const selectedMessages = selected ? messages[selected.id] ?? [] : [];
  const unreadTotal = threads.reduce((total, thread) => total + thread.unread, 0);
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = threads.filter((thread) => {
      const matchesTab = tab === "Todas" || (tab === "Não lidas" && thread.unread > 0);
      const matchesQuery = !normalizedQuery || `${thread.name} ${thread.team} ${thread.preview}`.toLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
    return [...matches.filter((thread) => thread.pinned), ...matches.filter((thread) => !thread.pinned)];
  }, [query, tab, threads]);

  function persistThreads(next: ChatThread[]) {
    setThreads(next);
    writeLocalCache(THREADS_CACHE_KEY, next);
  }

  function announce(message: string) {
    setAnnouncement(message);
  }

  function selectThread(id: string) {
    const thread = threads.find((item) => item.id === id);
    if (!thread) return;
    setSelectedId(id);
    setMobileView("chat");
    if (thread.unread > 0) {
      persistThreads(threads.map((item) => item.id === id ? { ...item, unread: 0 } : item));
      announce(`${thread.name} marcada como lida.`);
    }
  }

  function toggleSelectedRead() {
    if (!selected) return;
    const nextUnread = selected.unread > 0 ? 0 : 1;
    persistThreads(threads.map((thread) => thread.id === selected.id ? { ...thread, unread: nextUnread } : thread));
    announce(nextUnread ? `${selected.name} marcada como não lida.` : `${selected.name} marcada como lida.`);
  }

  function sendMessage(message: ComposerMessage) {
    if (!selected) {
      setComposerState("error");
      setComposerError("Selecione uma conversa antes de enviar.");
      setLastFailedMessage(message);
      return;
    }

    const threadId = selected.id;
    const next: StoredMessage = { ...message, id: `${threadId}-${Date.now()}`, from: "me", time: "agora", status: "sent" };
    try {
      const nextMessages = { ...messages, [threadId]: [...(messages[threadId] ?? []), next] };
      setMessages(nextMessages);
      writeLocalCache(MESSAGES_CACHE_KEY, nextMessages);
      persistThreads(threads.map((thread) => thread.id === threadId ? { ...thread, preview: messageSummary(message), time: "agora", unread: 0 } : thread));
      setComposerState("sending");
      setComposerError("");
      setLastFailedMessage(null);
      announce(`Nova mensagem enviada para ${selected.name}.`);
      window.setTimeout(() => {
        setMessages((current) => {
          const updatedMessages = {
            ...current,
            [threadId]: (current[threadId] ?? []).map((item) => item.id === next.id ? { ...item, status: "read" as const } : item)
          };
          writeLocalCache(MESSAGES_CACHE_KEY, updatedMessages);
          return updatedMessages;
        });
        setComposerState("sent");
      }, 550);
    } catch {
      setComposerState("error");
      setComposerError("Não foi possível registrar a mensagem localmente.");
      setLastFailedMessage(message);
    }
  }

  function createChat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const memberNames = form.getAll("member").map(String);
    if (!name) return;
    if (newChatType === "team" && memberNames.length === 0) {
      toast("Adicione pelo menos um membro ao canal de equipe.", "warning");
      return;
    }
    const id = nextThreadId(threads);
    const newThread: ChatThread = {
      id,
      name,
      initials: initialsFromName(name),
      team: newChatType === "team" ? "Canal interno" : "Equipe empresa",
      status: "online",
      preview: newChatType === "team" ? `Canal com ${memberNames.length} membro${memberNames.length === 1 ? "" : "s"}.` : "Novo chat criado localmente.",
      time: "agora",
      unread: 0,
      kind: newChatType === "team" ? "group" : "dm",
      pinned: false,
      color: newChatType === "team" ? "#6B942E" : undefined,
      members: newChatType === "team" ? memberNames : [name]
    };
    const nextThreads = [newThread, ...threads];
    persistThreads(nextThreads);
    const nextMessages = { ...messages, [id]: [] };
    setMessages(nextMessages);
    writeLocalCache(MESSAGES_CACHE_KEY, nextMessages);
    setSelectedId(id);
    setMobileView("chat");
    setNewChatOpen(false);
    setNewChatType("individual");
    announce(newChatType === "team" ? `Canal ${name} criado com ${memberNames.length} membros.` : `Chat com ${name} criado localmente.`);
  }

  function togglePin() {
    if (!selected) return;
    const pinned = !selected.pinned;
    persistThreads(threads.map((thread) => thread.id === selected.id ? { ...thread, pinned } : thread));
    announce(pinned ? `${selected.name} fixada na lista.` : `${selected.name} deixou de ser fixada.`);
  }

  function addMember(name: string) {
    if (!selected || !inviteDraft) return;
    const members = [...(selected.members ?? []), name];
    persistThreads(threads.map((thread) => thread.id === selected.id ? { ...thread, members } : thread));
    setInviteDraft("");
    announce(`${name} entrou em ${selected.name}.`);
  }

  function leaveGroup() {
    if (!selected) return;
    const nextThreads = threads.filter((thread) => thread.id !== selected.id);
    persistThreads(nextThreads);
    setMessages((current) => {
      const rest: Record<string, StoredMessage[]> = {};
      for (const [key, value] of Object.entries(current)) if (key !== selected.id) rest[key] = value;
      writeLocalCache(MESSAGES_CACHE_KEY, rest);
      return rest;
    });
    setSelectedId(nextThreads[0]?.id ?? "");
    setMembersOpen(false);
    setMobileView("list");
    announce(`Você saiu de ${selected.name}.`);
  }

  function clearSearch() {
    setQuery("");
    setTab("Todas");
  }

  return (
    <div>
      <PageHeader
        eyebrow="Comunicação / Equipe"
        title="Chats"
        description="Converse com sua equipe com anexos, emojis e mensagens persistidas nesta sessão."
        action={<Button onClick={() => setNewChatOpen(true)}><UserPlus className="size-4" />Novo chat</Button>}
      />

      <div className="grid min-h-[620px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <section className={cn("min-w-0 flex-col overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75", mobileView === "list" ? "flex" : "hidden", "lg:flex")} aria-label="Lista de conversas">
          <div className="border-b border-ebot-border/[0.12] p-3">
            <SegmentedTabs tabs={[{ id: "Todas", label: "Todas", count: threads.length }, { id: "Não lidas", label: "Não lidas", count: unreadTotal }]} value={tab} onChange={setTab} />
            <label className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/45 px-3"><Search className="size-4 text-ebot-muted" /><span className="sr-only">Buscar chats</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar conversa" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
          </div>
          <div className="ebot-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
            {visible.length ? visible.map((thread) => (
              <button type="button" key={thread.id} onClick={() => selectThread(thread.id)} aria-current={thread.id === selected?.id ? "page" : undefined} className={cn("animate-list-in mb-1 w-full rounded-2xl p-3 text-left transition", thread.id === selected?.id ? "bg-ebot-primary/[0.10]" : "hover:bg-ebot-surfaceMuted/70")}>
                <span className="flex gap-3">
                  <span className={cn("relative flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold", thread.color ? "text-white" : "bg-ebot-charcoal text-white")} style={thread.color ? { backgroundColor: thread.color } : undefined}>
                    {thread.initials}
                    {thread.kind === "group" ? <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-ebot-surface text-ebot-slate"><UsersRound className="size-2.5" /></span> : <span className={cn("absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-ebot-surface", thread.status === "online" ? "bg-ebot-green" : thread.status === "busy" ? "bg-ebot-orange" : "bg-ebot-muted")} />}
                  </span>
                  <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-1.5"><span className="truncate text-sm font-extrabold text-ebot-dark">{thread.name}</span>{thread.pinned ? <Pin className="size-3 shrink-0 text-ebot-primary" /> : null}</span><span className="shrink-0 text-[11px] text-ebot-muted">{thread.time}</span></span><span className="mt-0.5 block truncate text-[11px] font-semibold text-ebot-muted">{thread.kind === "group" ? `Canal · ${(thread.members ?? []).length} membros` : thread.team}</span><span className="mt-1 flex items-center justify-between gap-2"><span className="truncate text-xs text-ebot-slate">{thread.preview}</span>{thread.unread > 0 ? <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ebot-primary text-[10px] font-black text-ebot-charcoal">{thread.unread}</span> : null}</span></span>
                </span>
              </button>
            )) : (
              <div className="flex min-h-52 flex-col items-center justify-center p-6 text-center"><span className="flex size-11 items-center justify-center rounded-2xl bg-ebot-surfaceMuted text-ebot-muted"><SearchX className="size-5" /></span><p className="mt-3 text-sm font-extrabold text-ebot-dark">Nenhuma conversa encontrada</p><p className="mt-1 text-xs leading-5 text-ebot-muted">Tente outro nome, equipe ou termo de busca.</p><Button size="sm" variant="secondary" className="mt-4" onClick={clearSearch}>Limpar busca</Button></div>
            )}
          </div>
        </section>

        <section className={cn("min-w-0 flex-col overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75", mobileView === "chat" ? "flex" : "hidden", "lg:flex")} aria-label="Conversa selecionada">
          {selected ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center gap-3 border-b border-ebot-border/[0.12] px-3 py-3 sm:px-4">
                <button type="button" onClick={() => setMobileView("list")} className="flex size-9 items-center justify-center rounded-xl text-ebot-primary transition hover:bg-ebot-primary/10 lg:hidden" aria-label="Voltar para a lista de conversas"><ArrowLeft className="size-4" /></button>
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white", !selected.color && "bg-ebot-charcoal")} style={selected.color ? { backgroundColor: selected.color } : undefined}>{selected.initials}</span>
                <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-extrabold text-ebot-dark">{selected.name}</h2><p className="truncate text-xs font-semibold text-ebot-muted">{selected.kind === "group" ? `Canal interno · ${(selected.members ?? []).length} membros` : `${selected.team} · ${selected.status === "online" ? "online" : selected.status === "busy" ? "ocupado" : "offline"}`}</p></div>
                {selected.kind === "group" ? <button type="button" onClick={() => setMembersOpen((open) => !open)} className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-extrabold text-ebot-primary transition hover:bg-ebot-primary/10" aria-expanded={membersOpen}><Users className="size-4" />Membros</button> : null}
                <button type="button" onClick={togglePin} className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-surfaceMuted" aria-label={selected.pinned ? "Desafixar conversa" : "Fixar conversa"} title={selected.pinned ? "Desafixar" : "Fixar"}>{selected.pinned ? <PinOff className="size-4 text-ebot-primary" /> : <Pin className="size-4" />}</button>
                <button type="button" onClick={toggleSelectedRead} className="rounded-xl px-2.5 py-2 text-[11px] font-extrabold text-ebot-primary transition hover:bg-ebot-primary/10" aria-label={selected.unread > 0 ? "Marcar conversa como lida" : "Marcar conversa como não lida"}>{selected.unread > 0 ? "Marcar lida" : "Não lida"}</button>
              </div>

              {membersOpen && selected.kind === "group" ? (
                <aside className="border-b border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-4" aria-label={`Membros de ${selected.name}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-extrabold text-ebot-dark"><Users className="mr-1.5 inline size-4 text-ebot-primary" />Membros · {(selected.members ?? []).length}</p>
                    <button type="button" onClick={() => setMembersOpen(false)} className="rounded-lg px-2 py-1 text-[11px] font-extrabold text-ebot-muted transition hover:text-ebot-dark">Fechar</button>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {(selected.members ?? []).map((member) => {
                      const user = candidates.find((candidate) => candidate.name === member);
                      return (
                        <div key={member} className="flex items-center gap-2.5 rounded-xl bg-ebot-surface/80 px-3 py-2">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold text-white" style={{ backgroundColor: user?.avatarColor ?? "#6B942E" }}>{initialsFromName(member)}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-extrabold text-ebot-dark">{member}</p>
                            <p className="truncate text-[10px] font-bold text-ebot-muted">{user?.role ?? "Membro do time"}</p>
                          </div>
                          <span className={cn("size-2 rounded-full", user?.status === "online" ? "bg-ebot-green" : user?.status === "ausente" ? "bg-ebot-orange" : "bg-ebot-muted")} title={user?.status ?? "offline"} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <select value={inviteDraft} onChange={(event) => setInviteDraft(event.target.value)} aria-label="Adicionar membro ao grupo" className="h-9 min-w-0 flex-1 rounded-xl border border-ebot-border/[0.14] bg-ebot-surface/80 px-2.5 text-[12px] font-bold text-ebot-dark outline-none focus:border-ebot-primary/45">
                      <option value="">Convidar membro…</option>
                      {candidates.filter((candidate) => !(selected.members ?? []).includes(candidate.name)).map((candidate) => <option key={candidate.id} value={candidate.name}>{candidate.name} · {candidate.role}</option>)}
                    </select>
                    <Button size="sm" onClick={() => addMember(inviteDraft)} disabled={!inviteDraft}><UserPlus className="size-3.5" />Adicionar</Button>
                  </div>
                  <button type="button" onClick={leaveGroup} className="mt-3 flex items-center gap-1.5 text-[11px] font-extrabold text-ebot-red transition hover:opacity-80"><DoorOpen className="size-3.5" />Sair do grupo</button>
                </aside>
              ) : null}

              <div className="chat-dots ebot-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                {selectedMessages.length ? <div role="log" aria-live="polite" aria-relevant="additions text" aria-label={`Mensagens com ${selected.name}`} className="space-y-3">{selectedMessages.map((message) => <MessageBubble key={message.id} message={message} mine={message.from === "me"} playing={playingId === message.id} onPlay={() => setPlayingId((current) => current === message.id ? null : message.id)} />)}</div> : <StatePanel icon={MessageCircle} title="Comece a conversa" description={`Envie uma mensagem para ${selected.name}. Este chat será mantido localmente nesta sessão.`} />}
              </div>

              <div aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>
              <div className="border-t border-ebot-border/[0.12]" aria-busy={composerState === "sending"}>
                {composerState === "sending" ? <div role="status" className="flex items-center gap-2 px-4 pt-3 text-xs font-bold text-ebot-primary"><span className="size-2 animate-pulse rounded-full bg-ebot-primary" />Enviando mensagem localmente...</div> : null}
                {composerState === "sent" ? <div role="status" className="flex items-center gap-2 px-4 pt-3 text-xs font-bold text-ebot-green"><Check className="size-4" />Mensagem enviada</div> : null}
                {composerState === "error" ? <div role="alert" className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3 text-xs font-bold text-red-500"><span>{composerError}</span>{lastFailedMessage ? <Button size="sm" variant="secondary" onClick={() => sendMessage(lastFailedMessage)}>Tentar novamente</Button> : null}</div> : null}
                <ChatComposer onSend={sendMessage} placeholder={`Mensagem para ${selected.name}`} />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6"><StatePanel icon={MessageCircle} title="Nenhuma conversa selecionada" description="Crie um novo chat ou escolha uma conversa na lista." action={<Button size="sm" onClick={() => setNewChatOpen(true)}><UserPlus className="size-4" />Novo chat</Button>} /></div>
          )}
        </section>
      </div>

      <Modal open={newChatOpen} onClose={() => setNewChatOpen(false)} title="Novo chat" eyebrow="Comunicação interna" description="Crie uma conversa local com uma pessoa ou canal da equipe." icon={UserPlus} className="max-w-xl">
        <form onSubmit={createChat} className="space-y-4">
          <ModalField name="name" label="Nome da conversa" icon={MessageCircle} placeholder={newChatType === "team" ? "Ex.: Equipe Atendimento" : "Ex.: Camila Rodrigues"} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <ModalChoice label="Conversa individual" description="Fale com uma pessoa da equipe empresa." icon={UserPlus} active={newChatType === "individual"} onClick={() => setNewChatType("individual")} />
            <ModalChoice label="Canal da equipe" description="Espaço compartilhado com membros selecionados." icon={UsersRound} active={newChatType === "team"} onClick={() => setNewChatType("team")} />
          </div>
          {newChatType === "team" ? (
            <fieldset>
              <legend className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Membros do canal</legend>
              <div className="ebot-scrollbar max-h-44 space-y-1 overflow-y-auto rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-2">
                {candidates.map((candidate) => (
                  <label key={candidate.id} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-ebot-surfaceMuted/70">
                    <input type="checkbox" name="member" value={candidate.name} className="size-4 accent-ebot-primary" />
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold text-white" style={{ backgroundColor: candidate.avatarColor }}>{initialsFromName(candidate.name)}</span>
                    <span className="min-w-0 flex-1 truncate text-[12px] font-extrabold text-ebot-dark">{candidate.name}</span>
                    <span className="text-[10px] font-bold text-ebot-muted">{candidate.role}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4"><Button type="button" variant="ghost" onClick={() => setNewChatOpen(false)}>Cancelar</Button><Button type="submit">{newChatType === "team" ? <UsersRound className="size-4" /> : <UserPlus className="size-4" />}{newChatType === "team" ? "Criar canal" : "Criar chat"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
