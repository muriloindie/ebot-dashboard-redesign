"use client";

import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, HelpCircle, LifeBuoy, Mail, MessageCircle } from "lucide-react";
import { listHelpTopics } from "@/lib/company/companyService";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { PageHeader, SearchField } from "@/components/ui/Week1Primitives";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { cn } from "@/lib/cn";

const ALL = "Todas";

export function AjudaPage() {
  const { toast } = useDemo();
  const [topics] = useState(() => listHelpTopics());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [open, setOpen] = useState<string | null>("help-1");

  const categories = useMemo(() => {
    return [ALL, ...Array.from(new Set(topics.map((topic) => topic.category)))];
  }, [topics]);

  const filtered = useMemo(() => {
    return topics.filter((topic) => {
      const matchesCategory = category === ALL || topic.category === category;
      const matchesQuery = `${topic.question} ${topic.answer}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [topics, query, category]);

  const stats: StatItem[] = useMemo(() => [
    { id: "topics", label: "Artigos", value: String(topics.length), hint: "no centro de ajuda", tone: "blue", icon: BookOpen },
    { id: "categories", label: "Categorias", value: String(new Set(topics.map((topic) => topic.category)).size), hint: "padrões de uso", tone: "teal", icon: HelpCircle },
    { id: "channel", label: "Suporte", value: "WhatsApp", hint: "resposta em horário comercial", tone: "green", icon: MessageCircle }
  ], [topics]);

  function contact(kind: "email" | "whatsapp") {
    toast(kind === "email" ? "Abrindo suporte por e-mail… (demo)" : "Abrindo conversa com a central… (demo)");
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Suporte"
        title="Centro de ajuda"
        description="Perguntas frequentes sobre canais, automação, campanhas, LGPD e API. Não encontrou? Fale com a central."
        action={<Button variant="secondary" onClick={() => contact("whatsapp")}><MessageCircle className="size-4" />Falar com suporte</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[12px] font-extrabold transition",
              category === item ? "border-clinical-blue/40 bg-clinical-blue/[0.10] text-clinical-blueText" : "border-clinical-border/[0.14] bg-clinical-surface/70 text-clinical-slate hover:border-clinical-border/25"
            )}
          >
            {item}
            {item !== ALL && <span className="ml-1.5 text-[10px] text-clinical-muted">{topics.filter((topic) => topic.category === item).length}</span>}
          </button>
        ))}
        <div className="ml-auto">
          <SearchField value={query} onChange={setQuery} placeholder="Buscar na ajuda…" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-10 text-center text-sm font-bold text-clinical-muted">Nenhum artigo encontrado. Tente outro termo ou fale com o suporte.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((topic) => {
            const expanded = open === topic.id;
            return (
              <article key={topic.id} className="overflow-hidden rounded-[20px] border border-clinical-border/[0.12] bg-clinical-surface/80">
                <button
                  onClick={() => setOpen(expanded ? null : topic.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={expanded}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-clinical-blue/[0.08] text-clinical-blue">
                      <HelpCircle className="size-4" />
                    </span>
                    <span>
                      <span className="block text-[14px] font-extrabold text-clinical-dark">{topic.question}</span>
                      <span className="mt-0.5 block text-[11px] font-extrabold text-clinical-muted">{topic.category}</span>
                    </span>
                  </span>
                  <ChevronDown className={cn("size-4 shrink-0 text-clinical-muted transition-transform", expanded && "rotate-180")} />
                </button>
                {expanded && (
                  <div className="border-t border-clinical-border/[0.10] bg-clinical-surfaceMuted/25 px-5 py-4">
                    <p className="text-[13px] font-semibold leading-6 text-clinical-slate">{topic.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="flex items-start gap-3 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-clinical-teal/[0.10] text-clinical-teal"><Mail className="size-5" /></span>
          <div>
            <h2 className="text-sm font-extrabold text-clinical-dark">Suporte por e-mail</h2>
            <p className="mt-1 text-[12px] font-bold text-clinical-muted">Docs, contratos e configs avançadas: suporte@ebotclinical.com.br</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => contact("email")}>Escrever e-mail</Button>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-clinical-green/[0.12] text-clinical-green"><LifeBuoy className="size-5" /></span>
          <div>
            <h2 className="text-sm font-extrabold text-clinical-dark">Central de atendimento</h2>
            <p className="mt-1 text-[12px] font-bold text-clinical-muted">(46) 99913-0505 · seg–sex, 08h às 20h. Prioridade para filas críticas.</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => contact("whatsapp")}>Chamar no WhatsApp</Button>
          </div>
        </div>
      </section>
    </div>
  );
}