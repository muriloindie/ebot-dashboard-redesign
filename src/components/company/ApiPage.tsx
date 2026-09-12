"use client";

import { useMemo, useState } from "react";
import { Activity, Copy, Globe, KeyRound, ShieldCheck, Webhook } from "lucide-react";
import { listApiEndpoints } from "@/lib/company/companyService";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { PageHeader, SegmentedTabs, TableCell, TableHead, TableHeaderCell, TableSurface } from "@/components/ui/Week1Primitives";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { cn } from "@/lib/cn";

const ALL = "Todos";
type Method = typeof ALL | "GET" | "POST" | "PUT" | "DELETE";

const methodMeta: Record<Exclude<Method, typeof ALL>, { chip: string }> = {
  GET: { chip: "bg-ebot-primary/[0.10] text-ebot-primaryText" },
  POST: { chip: "bg-ebot-teal/[0.10] text-ebot-teal" },
  PUT: { chip: "bg-ebot-orange/[0.12] text-ebot-orange" },
  DELETE: { chip: "bg-ebot-red/[0.10] text-ebot-red" }
};

export function ApiPage() {
  const { toast } = useDemo();
  const [endpoints] = useState(() => listApiEndpoints());
  const [method, setMethod] = useState<Method>(ALL);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return method === ALL ? endpoints : endpoints.filter((endpoint) => endpoint.method === method);
  }, [endpoints, method]);

  const stats: StatItem[] = useMemo(() => [
    { id: "calls", label: "Chamadas (7 dias)", value: endpoints.reduce((total, endpoint) => total + endpoint.usage7d, 0).toLocaleString("pt-BR"), hint: "entre todos os endpoints", tone: "blue", icon: Activity },
    { id: "endpoints", label: "Endpoints", value: String(endpoints.length), hint: "v1 público + webhooks", tone: "teal", icon: Globe },
    { id: "webhooks", label: "Webhooks ativos", value: String(endpoints.filter((endpoint) => endpoint.auth === "Interno").length), hint: "ERP e WhatsApp", tone: "green", icon: Webhook }
  ], [endpoints]);

  function copyPath(path: string) {
    void navigator.clipboard?.writeText(path).catch(() => undefined);
    setCopied(path);
    window.setTimeout(() => setCopied(null), 1600);
    toast(`Caminho ${path} copiado.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Desenvolvedores"
        title="API"
        description="Interface pública para o Ê-Bot: chame fluxos, mensagens e agendamentos com Bearer token de escopo definido."
        action={<Button onClick={() => copyPath("sk-live-••••••••••d3k9")}><KeyRound className="size-4" />Copiar chave da API</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs
          tabs={[
            { id: ALL, label: "Todos", count: endpoints.length },
            { id: "GET", label: "GET", count: endpoints.filter((endpoint) => endpoint.method === "GET").length },
            { id: "POST", label: "POST", count: endpoints.filter((endpoint) => endpoint.method === "POST").length },
            { id: "PUT", label: "PUT", count: endpoints.filter((endpoint) => endpoint.method === "PUT").length },
            { id: "DELETE", label: "DELETE", count: endpoints.filter((endpoint) => endpoint.method === "DELETE").length }
          ]}
          value={method}
          onChange={(id) => setMethod(id as Method)}
        />
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-ebot-muted">
          <ShieldCheck className="size-3.5 text-ebot-green" />Auth por Bearer token com escopo
        </span>
      </div>

      <TableSurface caption="Endpoints da API v1 e webhooks internos">
        <TableHead>
          <TableHeaderCell>Método</TableHeaderCell>
          <TableHeaderCell>Caminho</TableHeaderCell>
          <TableHeaderCell className="hidden md:table-cell">Módulo</TableHeaderCell>
          <TableHeaderCell className="hidden lg:table-cell">Descrição</TableHeaderCell>
          <TableHeaderCell>Auth</TableHeaderCell>
          <TableHeaderCell className="text-right">Uso 7d</TableHeaderCell>
        </TableHead>
        <tbody>
          {filtered.map((endpoint) => (
            <tr key={endpoint.id} className="border-b border-ebot-border/[0.08] transition last:border-0 hover:bg-ebot-surfaceMuted/40">
              <TableCell>
                <span className={cn("inline-block rounded-lg px-2 py-1 text-[11px] font-extrabold", methodMeta[endpoint.method].chip)}>{endpoint.method}</span>
              </TableCell>
              <TableCell>
                <button onClick={() => copyPath(endpoint.path)} className="group flex items-center gap-2 text-left font-mono text-[13px] font-bold text-ebot-dark transition hover:text-ebot-primary" title="Copiar caminho">
                  {endpoint.path}
                  {copied === endpoint.path ? <CheckIcon /> : <Copy className="size-3.5 text-ebot-muted opacity-0 transition group-hover:opacity-100" />}
                </button>
              </TableCell>
              <TableCell className="hidden md:table-cell"><span className="text-[12px] font-extrabold text-ebot-slate">{endpoint.module}</span></TableCell>
              <TableCell className="hidden lg:table-cell"><span className="text-[12px] font-semibold text-ebot-muted">{endpoint.description}</span></TableCell>
              <TableCell>
                <span className={cn("rounded-lg px-2 py-1 text-[11px] font-extrabold", endpoint.auth === "Interno" ? "bg-ebot-surfaceMuted text-ebot-slate" : "bg-ebot-green/[0.12] text-ebot-green")}>
                  {endpoint.auth === "Interno" ? "Webhook" : "Bearer"}
                </span>
              </TableCell>
              <TableCell className="text-right"><span className="font-mono text-[13px] font-bold text-ebot-dark">{endpoint.usage7d.toLocaleString("pt-BR")}</span></TableCell>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><TableCell className="py-10 text-center text-ebot-muted">Nenhum endpoint para este método.</TableCell></tr>
          )}
        </tbody>
      </TableSurface>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="size-3.5 rounded-full bg-ebot-green/[0.12] text-ebot-green">
      <svg viewBox="0 0 14 14" fill="none" className="h-full w-full p-0.5"><path d="M3.5 7.2 6 9.7l4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}