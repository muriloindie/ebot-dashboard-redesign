"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CirclePlay,
  HelpCircle,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import {
  deleteHelpTopic,
  deleteHelpVideo,
  listHelpTopics,
  listHelpVideos,
  saveHelpTopic,
  saveHelpVideo
} from "@/lib/company/companyService";
import type { HelpTopic, HelpVideo } from "@/lib/company/types";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { SearchField } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const VIDEO_ICONS = ["MessageCircle", "Megaphone", "Sparkles", "CalendarDays", "ListOrdered", "ShieldCheck"];

const AI_SUGGESTIONS = [
  { id: "ai-1", question: "Como reagendar sem perder o histórico do protocolo?", hint: "38 atendimentos sobre reagendamento nos últimos 30 dias", category: "Agenda", answer: "Abra o protocolo do atendimento, confirme a nova data na agenda do atendente e registre a troca no relatório. O número do protocolo é mantido." },
  { id: "ai-2", question: "O que fazer quando o pedido atrasa no ERP?", hint: "21 menções em atendimentos + 4 reclamações", category: "Pedidos", answer: "Verifique o status na fila de Pedidos, avise o cliente pelo canal de origem com nova previsão e marque retorno automático do bot em 48h." },
  { id: "ai-3", question: "Como funciona a pausa de campanhas em feriados?", hint: "12 dúvidas recorrentes da equipe", category: "Campanhas", answer: "Em Campanhas, pause o disparo e ajuste a janela de envio nas configurações. Listas com opt-in vigente retomam sozinhas no próximo dia útil." }
];

const emptyVideo: Omit<HelpVideo, "id" | "views" | "createdAt"> = {
  title: "",
  description: "",
  category: "Canais",
  videoUrl: "",
  thumbnailUrl: "",
  duration: "00:00",
  icon: "MessageCircle",
  featured: false
};

export function AjudaConfigPanel() {
  const [videos, setVideos] = useState<HelpVideo[]>(() => listHelpVideos());
  const [topics, setTopics] = useState<HelpTopic[]>(() => listHelpTopics());
  const [tab, setTab] = useState<"videos" | "topics" | "ai">("videos");
  const [query, setQuery] = useState("");
  const [videoDraft, setVideoDraft] = useState<(typeof emptyVideo & { id: string }) | null>(null);
  const [videoEditing, setVideoEditing] = useState(false);
  const [videoDeleting, setVideoDeleting] = useState<HelpVideo | null>(null);
  const [topicDraft, setTopicDraft] = useState<(Omit<HelpTopic, "id"> & { id: string }) | null>(null);
  const [topicEditing, setTopicEditing] = useState(false);
  const [topicDeleting, setTopicDeleting] = useState<HelpTopic | null>(null);
  const [usedSuggestions, setUsedSuggestions] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setVideos(listHelpVideos());
    setTopics(listHelpTopics());
  }, []);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  const q = query.toLowerCase();
  const filteredVideos = videos.filter((video) => `${video.title} ${video.description} ${video.category}`.toLowerCase().includes(q));
  const filteredTopics = topics.filter((topic) => `${topic.question} ${topic.answer} ${topic.category}`.toLowerCase().includes(q));

  function saveVideo() {
    if (!videoDraft) return;
    if (!videoDraft.title.trim()) return showNotice("Informe o título do vídeo.");
    if (!videoDraft.videoUrl.trim()) return showNotice("Informe a URL do vídeo.");
    const base = videos.find((row) => row.id === videoDraft.id);
    const next: HelpVideo = {
      id: videoEditing ? videoDraft.id : `hv-${Date.now().toString(36)}`,
      title: videoDraft.title.trim(),
      description: videoDraft.description.trim(),
      category: videoDraft.category,
      videoUrl: videoDraft.videoUrl.trim(),
      thumbnailUrl: videoDraft.thumbnailUrl?.trim() || undefined,
      duration: videoDraft.duration.trim() || "00:00",
      icon: videoDraft.icon,
      views: base?.views ?? 0,
      featured: videoDraft.featured,
      createdAt: base?.createdAt ?? "agora"
    };
    saveHelpVideo(next);
    setVideos(listHelpVideos());
    setVideoDraft(null);
    showNotice(videoEditing ? `Vídeo "${next.title}" atualizado.` : `Vídeo "${next.title}" criado.`);
  }

  function saveTopic() {
    if (!topicDraft) return;
    if (!topicDraft.question.trim()) return showNotice("Informe a pergunta.");
    if (!topicDraft.answer.trim()) return showNotice("Informe a resposta em texto.");
    const next: HelpTopic = {
      id: topicEditing ? topicDraft.id : `help-${Date.now().toString(36)}`,
      question: topicDraft.question.trim(),
      answer: topicDraft.answer.trim(),
      category: topicDraft.category
    };
    saveHelpTopic(next);
    setTopics(listHelpTopics());
    setTopicDraft(null);
    showNotice(topicEditing ? "Pergunta atualizada." : "Pergunta criada.");
  }

  function applySuggestion(suggestion: (typeof AI_SUGGESTIONS)[number]) {
    saveHelpTopic({ id: `help-${Date.now().toString(36)}`, question: suggestion.question, answer: suggestion.answer, category: suggestion.category });
    setTopics(listHelpTopics());
    setUsedSuggestions((current) => [...current, suggestion.id]);
    showNotice(`Sugestão da IA publicada em "${suggestion.category}".`);
  }

  return (
    <section className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-extrabold text-ebot-dark">Conteúdo da ajuda</h2>
          <p className="text-[12px] font-bold text-ebot-muted">Vídeos, textos e perguntas exibidos no Centro de ajuda.</p>
        </div>
        <div className="flex gap-2">
          {tab === "videos" ? <Button size="sm" onClick={() => { setVideoEditing(false); setVideoDraft({ ...emptyVideo, id: "" }); }}><Plus className="size-3.5" />Novo vídeo</Button> : null}
          {tab === "topics" ? <Button size="sm" onClick={() => { setTopicEditing(false); setTopicDraft({ id: "", question: "", answer: "", category: "Canais" }); }}><Plus className="size-3.5" />Nova pergunta</Button> : null}
        </div>
      </div>

      {notice ? (
        <div role="status" className="mt-3 flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-2.5 text-sm font-bold text-ebot-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div className="mb-3 mt-4 flex gap-1 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/40 p-1">
        {([{ id: "videos", label: `Vídeos (${videos.length})` }, { id: "topics", label: `Perguntas (${topics.length})` }, { id: "ai", label: "Sugestões da IA" }] as const).map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-pressed={tab === item.id} className={cn("flex-1 rounded-xl px-3 py-2 text-[13px] font-extrabold transition", tab === item.id ? "bg-ebot-surface text-ebot-primary shadow-sm" : "text-ebot-muted hover:text-ebot-dark")}>
            {item.label}
          </button>
        ))}
      </div>

      {tab !== "ai" ? <div className="mb-3 max-w-xs"><SearchField value={query} onChange={setQuery} placeholder={tab === "videos" ? "Buscar vídeos…" : "Buscar perguntas…"} /></div> : null}

      {tab === "videos" ? (
        <ul className="space-y-2">
          {filteredVideos.map((video) => (
            <li key={video.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/25 px-3 py-2.5 sm:flex-nowrap">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ebot-primary/[0.10] text-ebot-primaryText"><CirclePlay className="size-4" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-ebot-dark">{video.title}</span>
                <span className="block truncate text-[11px] font-bold text-ebot-muted">{video.category} · {video.duration} · {video.featured ? "destaque" : "grade"}</span>
              </span>
              <span className="flex shrink-0 items-center gap-0.5">
                <button type="button" onClick={() => { setVideoEditing(true); setVideoDraft({ title: video.title, description: video.description, category: video.category, videoUrl: video.videoUrl, thumbnailUrl: video.thumbnailUrl ?? "", duration: video.duration, icon: video.icon, featured: video.featured, id: video.id }); }} aria-label={`Editar ${video.title}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
                <button type="button" onClick={() => setVideoDeleting(video)} aria-label={`Remover ${video.title}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 className="size-3.5" /></button>
              </span>
            </li>
          ))}
          {filteredVideos.length === 0 ? <li className="rounded-2xl border border-dashed border-ebot-border/[0.18] p-6 text-center text-sm font-semibold text-ebot-muted">Nenhum vídeo encontrado.</li> : null}
        </ul>
      ) : null}

      {tab === "topics" ? (
        <ul className="space-y-2">
          {filteredTopics.map((topic) => (
            <li key={topic.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/25 px-3 py-2.5 sm:flex-nowrap">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ebot-teal/[0.10] text-ebot-teal"><HelpCircle className="size-4" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-ebot-dark">{topic.question}</span>
                <span className="block truncate text-[11px] font-bold text-ebot-muted">{topic.category}</span>
              </span>
              <span className="flex shrink-0 items-center gap-0.5">
                <button type="button" onClick={() => { setTopicEditing(true); setTopicDraft({ id: topic.id, question: topic.question, answer: topic.answer, category: topic.category }); }} aria-label="Editar pergunta" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
                <button type="button" onClick={() => setTopicDeleting(topic)} aria-label="Remover pergunta" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 className="size-3.5" /></button>
              </span>
            </li>
          ))}
          {filteredTopics.length === 0 ? <li className="rounded-2xl border border-dashed border-ebot-border/[0.18] p-6 text-center text-sm font-semibold text-ebot-muted">Nenhuma pergunta encontrada.</li> : null}
        </ul>
      ) : null}

      {tab === "ai" ? (
        <div className="space-y-2">
          <p className="flex items-start gap-1.5 rounded-2xl border border-ebot-teal/[0.18] bg-ebot-teal/[0.06] p-3 text-[12px] font-semibold leading-5 text-ebot-slate">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-ebot-teal" />
            Recomendações geradas pela IA a partir dos temas mais atendidos e das reclamações recentes. Publique as que fizerem sentido.
          </p>
          {AI_SUGGESTIONS.map((suggestion) => {
            const used = usedSuggestions.includes(suggestion.id);
            return (
              <div key={suggestion.id} className="rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/25 p-3.5">
                <p className="text-sm font-extrabold text-ebot-dark">{suggestion.question}</p>
                <p className="mt-1 text-[11px] font-bold text-ebot-muted">{suggestion.hint} · {suggestion.category}</p>
                <div className="mt-2.5 flex justify-end">
                  <Button size="sm" variant={used ? "ghost" : "secondary"} disabled={used} onClick={() => applySuggestion(suggestion)}>
                    {used ? <><Check className="size-3.5" />Publicada</> : <><Sparkles className="size-3.5" />Usar sugestão</>}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <Modal
        open={Boolean(videoDraft)}
        onClose={() => setVideoDraft(null)}
        title={videoEditing ? "Editar vídeo" : "Novo vídeo"}
        eyebrow="Configurações / Ajuda"
        description="O vídeo entra na grade do Centro de ajuda."
        icon={CirclePlay}
        className="max-w-xl"
      >
        {videoDraft ? (
          <form onSubmit={(event) => { event.preventDefault(); saveVideo(); }} className="space-y-4">
            <ModalField label="Título" value={videoDraft.title} onChange={(event) => setVideoDraft({ ...videoDraft, title: event.target.value })} placeholder="Ex.: Como conectar o WhatsApp" required />
            <ModalTextarea label="Descrição" value={videoDraft.description} onChange={(event) => setVideoDraft({ ...videoDraft, description: event.target.value })} placeholder="Resumo exibido abaixo do player…" />
            <div className="grid gap-4 sm:grid-cols-2">
              <ModalField label="URL do vídeo" value={videoDraft.videoUrl} onChange={(event) => setVideoDraft({ ...videoDraft, videoUrl: event.target.value })} placeholder="https://…" required />
              <ModalField label="Duração" value={videoDraft.duration} onChange={(event) => setVideoDraft({ ...videoDraft, duration: event.target.value })} placeholder="04:32" />
              <ModalSelect label="Categoria" value={videoDraft.category} onChange={(event) => setVideoDraft({ ...videoDraft, category: event.target.value })}>
                {["Canais", "Campanhas", "Automação", "Agenda", "Filas", "LGPD", "Atendimento", "Sistema"].map((item) => <option key={item}>{item}</option>)}
              </ModalSelect>
              <ModalSelect label="Ícone" value={videoDraft.icon} onChange={(event) => setVideoDraft({ ...videoDraft, icon: event.target.value })}>
                {VIDEO_ICONS.map((item) => <option key={item}>{item}</option>)}
              </ModalSelect>
            </div>
            <label className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark">
              <input type="checkbox" checked={videoDraft.featured} onChange={(event) => setVideoDraft({ ...videoDraft, featured: event.target.checked })} className="size-4 accent-ebot-primary" />
              Destaque na grade
            </label>
            <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
              <Button type="button" variant="ghost" onClick={() => setVideoDraft(null)}>Cancelar</Button>
              <Button type="submit"><Check className="size-4" />{videoEditing ? "Salvar alterações" : "Criar vídeo"}</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(topicDraft)}
        onClose={() => setTopicDraft(null)}
        title={topicEditing ? "Editar pergunta" : "Nova pergunta"}
        eyebrow="Configurações / Ajuda"
        description="O texto aparece abaixo do player, como descrição do vídeo."
        icon={HelpCircle}
        className="max-w-xl"
      >
        {topicDraft ? (
          <form onSubmit={(event) => { event.preventDefault(); saveTopic(); }} className="space-y-4">
            <ModalField label="Pergunta / título" value={topicDraft.question} onChange={(event) => setTopicDraft({ ...topicDraft, question: event.target.value })} required />
            <ModalTextarea label="Resposta (texto)" value={topicDraft.answer} onChange={(event) => setTopicDraft({ ...topicDraft, answer: event.target.value })} required />
            <ModalSelect label="Categoria" value={topicDraft.category} onChange={(event) => setTopicDraft({ ...topicDraft, category: event.target.value })}>
              {["Canais", "Campanhas", "Automação", "Agenda", "Filas", "LGPD", "Atendimento", "Sistema"].map((item) => <option key={item}>{item}</option>)}
            </ModalSelect>
            <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
              <Button type="button" variant="ghost" onClick={() => setTopicDraft(null)}>Cancelar</Button>
              <Button type="submit"><Check className="size-4" />{topicEditing ? "Salvar alterações" : "Criar pergunta"}</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <ConfirmationDialog
        open={Boolean(videoDeleting)}
        onClose={() => setVideoDeleting(null)}
        onConfirm={() => { if (videoDeleting) { deleteHelpVideo(videoDeleting.id); setVideos(listHelpVideos()); showNotice(`Vídeo "${videoDeleting.title}" removido.`); setVideoDeleting(null); } }}
        title="Remover vídeo?"
        description="O vídeo sairá da grade do Centro de ajuda."
        confirmLabel="Remover vídeo"
      />

      <ConfirmationDialog
        open={Boolean(topicDeleting)}
        onClose={() => setTopicDeleting(null)}
        onConfirm={() => { if (topicDeleting) { deleteHelpTopic(topicDeleting.id); setTopics(listHelpTopics()); showNotice("Pergunta removida."); setTopicDeleting(null); } }}
        title="Remover pergunta?"
        description="O texto sairá das respostas do Centro de ajuda."
        confirmLabel="Remover pergunta"
      />
    </section>
  );
}
