"use client";

import { useMemo, useRef, useState } from "react";
import { Bug, CircleCheck, CircleDot, CirclePause, SearchX } from "lucide-react";
import { listBugReports, saveBugReport } from "@/lib/system/systemService";
import type { BugReport } from "@/data/systemMock";
import { Button } from "@/components/ui/Button";
import { SegmentedTabs, StatusBadge, PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { usePageEnter } from "@/lib/usePageEnter";
import { useDemo } from "@/components/state/DemoProvider";
import { cn } from "@/lib/cn";

const ALL = "Todos";

const severityTone: Record<BugReport["severity"], "red" | "orange" | "neutral"> = {
  "crítico": "red",
  alto: "red",
  "médio": "orange",
  baixo: "neutral"
};

const statusFlow: BugReport["status"][] = ["aberto", "em análise", "resolvido"];

const statusMeta: Record<BugReport["status"], { label: string; tone: "red" | "orange" | "green"; icon: typeof CircleDot }> = {
  aberto: { label: "Aberto", tone: "red", icon: CircleDot },
  "em análise": { label: "Em análise", tone: "orange", icon: CirclePause },
  resolvido: { label: "Resolvido", tone: "green", icon: CircleCheck }
};

export function RetaguardaBugsPage() {
  const { toast } = useDemo();
  const pageRef = useRef<HTMLDivElement>(null);
  const [bugs, setBugs] = useState<BugReport[]>(() => listBugReports());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL);

  usePageEnter(pageRef, [
    { selector: "[data-bug-card]", from: { opacity: 0, y: 18 } }
  ], { stagger: 0.06, delay: 0.05 });

  const filtered = useMemo(() => {
    return bugs.filter((bug) => {
      const matchesQuery = `${bug.title} ${bug.description} ${bug.screen} ${bug.reportedBy}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === ALL || bug.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [bugs, query, status]);

  function advance(bug: BugReport) {
    const next = statusFlow[Math.min(statusFlow.indexOf(bug.status) + 1, statusFlow.length - 1)];
    saveBugReport({ ...bug, status: next });
    setBugs(listBugReports());
    toast(`"${bug.title}" movido para ${next}.`);
  }

  return (
    <div ref={pageRef} className="space-y-4">
      <PageHeader
        eyebrow="Retaguarda / Qualidade"
        title="Bugs reportados"
        description="Relatos da equipe sobre falhas de comportamento. Avance o status conforme o tratamento no pipeline de correção."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-red-500/[0.08] px-3 py-2 text-xs font-extrabold text-red-500"><Bug className="size-4" />{bugs.filter((bug) => bug.status !== "resolvido").length} em aberto</span>}
      />

      <div className="flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar por título, tela ou relator" />
        <SegmentedTabs
          tabs={[
            { id: ALL, label: "Todos", count: bugs.length },
            { id: "aberto", label: "Abertos", count: bugs.filter((bug) => bug.status === "aberto").length },
            { id: "em análise", label: "Em análise", count: bugs.filter((bug) => bug.status === "em análise").length },
            { id: "resolvido", label: "Resolvidos", count: bugs.filter((bug) => bug.status === "resolvido").length }
          ]}
          value={status}
          onChange={setStatus}
        />
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Nenhum bug encontrado"
          description="Ajuste a busca ou o filtro de status."
          action={<Button size="sm" variant="secondary" onClick={() => { setQuery(""); setStatus(ALL); }}>Limpar filtros</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((bug) => {
            const meta = statusMeta[bug.status];
            const Icon = meta.icon;
            return (
              <article key={bug.id} data-bug-card className={cn("flex flex-col rounded-[24px] border bg-ebot-surface/80 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition hover:-translate-y-0.5 hover:shadow-card", bug.status === "resolvido" ? "border-ebot-green/20" : "border-ebot-border/[0.14]")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", meta.tone === "green" ? "bg-ebot-green/[0.10] text-ebot-green" : meta.tone === "orange" ? "bg-ebot-orange/[0.10] text-ebot-orange" : "bg-red-500/[0.08] text-red-500")}>
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-sm font-extrabold leading-5 text-ebot-dark">{bug.title}</h2>
                      <p className="text-[11px] font-bold text-ebot-muted">{bug.screen}</p>
                    </div>
                  </div>
                  <StatusBadge label={bug.severity} tone={severityTone[bug.severity]} />
                </div>

                <p className="mt-3 flex-1 text-[13px] leading-5 text-ebot-muted">{bug.description}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ebot-border/[0.10] pt-3.5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-ebot-muted">
                    <StatusBadge label={meta.label} tone={meta.tone} />
                    <span>por {bug.reportedBy}</span>
                    <span>· {bug.reportedAt}</span>
                  </div>
                  {bug.status !== "resolvido" ? (
                    <Button size="sm" variant="secondary" onClick={() => advance(bug)}>
                      {bug.status === "aberto" ? "Iniciar análise" : "Marcar resolvido"}
                    </Button>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-ebot-green"><CircleCheck className="size-3.5" />Encerrado</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
