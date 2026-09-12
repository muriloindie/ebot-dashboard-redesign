"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CirclePlay,
  Eye,
  FlaskConical,
  LayoutGrid,
  LifeBuoy,
  List,
  ListOrdered,
  Mail,
  Megaphone,
  MessageCircle,
  SearchX,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  type LucideIcon
} from "lucide-react";
import { listHelpTopics, listHelpVideos } from "@/lib/company/companyService";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { PageHeader, SearchField } from "@/components/ui/Week1Primitives";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { cn } from "@/lib/cn";

const ALL = "Todas";

const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  Megaphone,
  Sparkles,
  CalendarDays,
  ListOrdered,
  ShieldCheck
};

const categoryColor: Record<string, string> = {
  Canais: "#A9D16C",
  Campanhas: "#6B942E",
  Automação: "#8FA9B4",
  Agenda: "#C13E3E",
  Filas: "#C97F12",
  LGPD: "#5D737E"
};

export function AjudaPage() {
  const { toast } = useDemo();
  const [videos] = useState(() => listHelpVideos());
  const [topics] = useState(() => listHelpTopics());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [view, setView] = useState<"cards" | "lista">("cards");
  const [watchingId, setWatchingId] = useState<string | null>(null);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(videos.map((video) => video.category)))], [videos]);

  const filtered = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory = category === ALL || video.category === category;
      const matchesQuery = `${video.title} ${video.description} ${video.category}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [videos, query, category]);

  const watching = videos.find((video) => video.id === watchingId) ?? null;
  const recommended = useMemo(() => {
    if (!watching) return [];
    const same = filtered.filter((video) => video.id !== watching.id && video.category === watching.category);
    const others = filtered.filter((video) => video.id !== watching.id && video.category !== watching.category);
    return [...same, ...others].slice(0, 6);
  }, [filtered, watching]);

  const watchingAnswers = useMemo(() => {
    if (!watching) return [];
    return topics.filter((topic) => topic.category === watching.category).slice(0, 3);
  }, [topics, watching]);

  function contact(kind: "email" | "whatsapp") {
    toast(kind === "email" ? "Abrindo suporte por e-mail… (demo)" : "Abrindo conversa com a central… (demo)");
  }

  function watch(id: string) {
    setWatchingId(id);
    document.getElementById("ajuda-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Suporte"
        title="Centro de ajuda"
        description="Tutoriais em vídeo e respostas em texto: escolha um vídeo para assistir com os recomendados ao lado, como no YouTube."
        action={<Button variant="secondary" onClick={() => contact("whatsapp")}><MessageCircle className="size-4" />Falar com suporte</Button>}
      />

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="w-full max-w-md"><SearchField value={query} onChange={setQuery} placeholder="Buscar vídeos e respostas…" /></div>
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] font-extrabold transition",
                category === item ? "border-ebot-primary/40 bg-ebot-primary/[0.10] text-ebot-primaryText" : "border-ebot-border/[0.14] bg-ebot-surface/70 text-ebot-slate hover:border-ebot-border/25"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <ViewSwitch
          views={[{ id: "cards", label: "Cards", icon: LayoutGrid }, { id: "lista", label: "Lista", icon: List }]}
          value={view}
          onChange={(id) => setView(id as "cards" | "lista")}
          className="self-end lg:ml-auto lg:self-auto"
        />
      </div>

      {watching ? (
        <div id="ajuda-player" className="grid scroll-mt-4 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-charcoal shadow-[0_8px_24px_rgba(4,27,21,0.08)]">
              <div className="aspect-video w-full">
                <iframe
                  key={watching.id}
                  src={watching.videoUrl}
                  title={watching.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
            <div className="mt-3 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold tracking-tight text-ebot-dark">{watching.title}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] font-bold text-ebot-muted">
                    <span className="inline-flex items-center gap-1"><Eye className="size-3.5" />{watching.views.toLocaleString("pt-BR")} visualizações</span>
                    <span>·</span><span>{watching.duration}</span>
                    <span>·</span><span>{watching.createdAt}</span>
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => toast("Obrigado pelo feedback! (demo)")}><ThumbsUp className="size-3.5" />Ajudou</Button>
              </div>
              <div className="mt-3 rounded-2xl bg-ebot-surfaceMuted/40 p-3.5">
                <p className="text-[13px] font-semibold leading-6 text-ebot-slate">{watching.description}</p>
                {watchingAnswers.length ? (
                  <div className="mt-3 space-y-2 border-t border-ebot-border/[0.10] pt-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted"><BookOpen className="size-3.5" />Resposta em texto</p>
                    {watchingAnswers.map((topic) => (
                      <details key={topic.id} className="rounded-xl bg-ebot-surface px-3 py-2.5">
                        <summary className="cursor-pointer text-[13px] font-extrabold text-ebot-dark">{topic.question}</summary>
                        <p className="mt-1.5 text-[13px] leading-6 text-ebot-slate">{topic.answer}</p>
                      </details>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <aside className="min-w-0 space-y-2.5" aria-label="Recomendados">
            <h3 className="px-1 text-[12px] font-black uppercase tracking-wider text-ebot-muted">Recomendados</h3>
            {recommended.map((video) => {
              const Icon = iconMap[video.icon] ?? CirclePlay;
              const color = categoryColor[video.category] ?? "#6B942E";
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => watch(video.id)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/80 p-2.5 text-left transition hover:border-ebot-primary/25 hover:shadow-card"
                >
                  <span className="relative flex aspect-video w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${color}, #041B15)` }}>
                    <Icon className="size-6 opacity-90" />
                    <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums">{video.duration}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-[13px] font-extrabold leading-5 text-ebot-dark">{video.title}</span>
                    <span className="mt-1 block text-[11px] font-bold text-ebot-muted">{video.category} · {video.views.toLocaleString("pt-BR")} views</span>
                  </span>
                </button>
              );
            })}
            {recommended.length === 0 ? <p className="rounded-2xl border border-dashed border-ebot-border/[0.18] p-4 text-center text-xs font-semibold text-ebot-muted">Nenhum recomendado nesta categoria.</p> : null}
          </aside>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-10 text-center text-sm font-bold text-ebot-muted">
          <SearchX className="mx-auto mb-2 size-6" />Nenhum vídeo encontrado. Tente outro termo ou fale com o suporte.
        </div>
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((video) => {
            const Icon = iconMap[video.icon] ?? CirclePlay;
            const color = categoryColor[video.category] ?? "#6B942E";
            return (
              <article
                key={video.id}
                data-help-video
                data-video-id={video.id}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-card"
                onClick={() => watch(video.id)}
              >
                <span className="relative flex aspect-video items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${color}, #041B15)` }}>
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" aria-hidden="true" />
                  <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-ebot-dark shadow-[0_18px_42px_rgba(0,0,0,0.35)] transition group-hover:scale-105"><CirclePlay className="size-8" /></span>
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums">{video.duration}</span>
                  {video.featured ? <span className="absolute left-2 top-2 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide backdrop-blur">Destaque</span> : null}
                </span>
                <span className="flex flex-1 flex-col p-4">
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" style={{ color }} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color }}>{video.category}</span>
                  </span>
                  <span className="mt-1.5 line-clamp-2 text-[14px] font-extrabold leading-5 text-ebot-dark">{video.title}</span>
                  <span className="mt-1 line-clamp-2 text-[12px] leading-5 text-ebot-muted">{video.description}</span>
                  <span className="mt-2.5 flex items-center gap-1 border-t border-ebot-border/[0.10] pt-2.5 text-[11px] font-bold text-ebot-muted">
                    <Eye className="size-3.5" />{video.views.toLocaleString("pt-BR")} views · {video.createdAt}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
          <ul className="divide-y divide-ebot-border/[0.10]" aria-label="Lista de vídeos">
            {filtered.map((video) => {
              const Icon = iconMap[video.icon] ?? CirclePlay;
              const color = categoryColor[video.category] ?? "#6B942E";
              return (
                <li key={video.id} data-help-video data-video-id={video.id}>
                  <button type="button" onClick={() => watch(video.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left transition hover:bg-ebot-primary/[0.035] sm:flex-nowrap">
                    <span className="relative flex aspect-video w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${color}, #041B15)` }}>
                      <Icon className="size-5 opacity-90" />
                      <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums">{video.duration}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-ebot-dark">{video.title}</span>
                      <span className="block truncate text-xs font-semibold text-ebot-muted">{video.category} · {video.views.toLocaleString("pt-BR")} views · {video.createdAt}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-ebot-primary/[0.08] px-3 py-1.5 text-[11px] font-extrabold text-ebot-primaryText">Assistir</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="flex items-start gap-3 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-teal/[0.10] text-ebot-teal"><Mail className="size-5" /></span>
          <div>
            <h2 className="text-sm font-extrabold text-ebot-dark">Suporte por e-mail</h2>
            <p className="mt-1 text-[12px] font-bold text-ebot-muted">Docs, contratos e configs avançadas: suporte@ebot.com.br</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => contact("email")}>Escrever e-mail</Button>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-green/[0.12] text-ebot-green"><LifeBuoy className="size-5" /></span>
          <div>
            <h2 className="text-sm font-extrabold text-ebot-dark">Central de atendimento</h2>
            <p className="mt-1 text-[12px] font-bold text-ebot-muted">(46) 99913-0505 · seg–sex, 08h às 20h. Prioridade para filas críticas.</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => contact("whatsapp")}>Chamar no WhatsApp</Button>
          </div>
        </div>
      </section>

      <p className="flex items-start gap-1.5 rounded-[20px] border border-ebot-border/[0.12] bg-ebot-surface/70 px-4 py-3 text-[11px] font-bold leading-4 text-ebot-muted">
        <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-ebot-teal" />
        O conteúdo desta página (vídeos, textos e perguntas) é gerenciado em Configurações → Ajuda, incluindo sugestões da IA com base nos atendimentos.
      </p>
    </div>
  );
}
