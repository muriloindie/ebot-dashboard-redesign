"use client";

import { useMemo, useState } from "react";
import { CircleAlert, Info, SearchX, ScrollText, TriangleAlert } from "lucide-react";
import { listSystemLogs } from "@/lib/system/systemService";
import type { SystemLog } from "@/data/systemMock";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { SegmentedTabs, StatusBadge, PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const ALL = "Todos";

const levelMeta: Record<SystemLog["level"], { label: string; tone: "blue" | "orange" | "red"; icon: typeof Info; chip: string }> = {
  info: { label: "Info", tone: "blue", icon: Info, chip: "bg-ebot-primary/[0.08] text-ebot-primaryText" },
  aviso: { label: "Aviso", tone: "orange", icon: TriangleAlert, chip: "bg-ebot-orange/[0.10] text-ebot-orange" },
  erro: { label: "Erro", tone: "red", icon: CircleAlert, chip: "bg-red-500/[0.08] text-red-500" }
};

export function RetaguardaLogsPage() {
  const [logs] = useState<SystemLog[]>(() => listSystemLogs());
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(ALL);
  const [module, setModule] = useState(ALL);

  const modules = useMemo(() => Array.from(new Set(logs.map((log) => log.module))).sort(), [logs]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesQuery = `${log.message} ${log.user} ${log.module} ${log.timestamp}`.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === ALL || log.level === level;
      const matchesModule = module === ALL || log.module === module;
      return matchesQuery && matchesLevel && matchesModule;
    });
  }, [logs, query, level, module]);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Retaguarda / Auditoria"
        title="Logs do sistema"
        description="Registro técnico das ações da plataforma, IA e integrações. Use os filtros para investigar incidentes."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-primary/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-primaryText"><ScrollText className="size-4" />{logs.length} registros retidos</span>}
      />

      <div className="flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar por mensagem, usuário ou módulo" />
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <SegmentedTabs
            tabs={[
              { id: ALL, label: "Todos", count: logs.length },
              { id: "info", label: "Info", count: logs.filter((log) => log.level === "info").length },
              { id: "aviso", label: "Avisos", count: logs.filter((log) => log.level === "aviso").length },
              { id: "erro", label: "Erros", count: logs.filter((log) => log.level === "erro").length }
            ]}
            value={level}
            onChange={setLevel}
          />
          <div className="w-full lg:w-60">
            <Dropdown label="Módulo" value={module} options={[ALL, ...modules]} onChange={setModule} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Nenhum log encontrado"
          description="Ajuste a busca ou os filtros de nível e módulo."
          action={<Button size="sm" variant="secondary" onClick={() => { setQuery(""); setLevel(ALL); setModule(ALL); }}>Limpar filtros</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <ul className="divide-y divide-ebot-border/[0.10]">
            {filtered.map((log) => {
              const meta = levelMeta[log.level];
              const Icon = meta.icon;
              return (
                <li key={log.id} className="flex flex-col gap-2 px-5 py-4 transition hover:bg-ebot-surfaceMuted/25 sm:flex-row sm:items-center sm:gap-4">
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", meta.chip)}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                      <span className="rounded-full bg-ebot-surfaceMuted px-2 py-0.5 text-[10px] font-extrabold text-ebot-muted">{log.module}</span>
                      <span className="text-[11px] font-bold tabular-nums text-ebot-muted">{log.timestamp}</span>
                    </div>
                    <p className="mt-1 text-[13px] font-semibold leading-5 text-ebot-slate">{log.message}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-extrabold text-ebot-muted">{log.user}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
