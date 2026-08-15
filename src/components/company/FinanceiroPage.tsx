"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, CreditCard, Download, Receipt, Sparkles, TrendingUp } from "lucide-react";
import { listInvoices } from "@/lib/company/companyService";
import type { Invoice } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/Week1Primitives";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { cn } from "@/lib/cn";

const PLANS = [
  { id: "essential", name: "Clínica Essential", price: "R$ 490,00", features: ["Até 3 canais", "2.000 conversas/mês", "Automação básica"] },
  { id: "pro", name: "Clínica Pro", price: "R$ 890,00", features: ["Canais ilimitados", "15.000 conversas/mês", "Automação avançada + IA", "API pública"] },
  { id: "enterprise", name: "Clínica Enterprise", price: "R$ 1.490,00", features: ["Tudo do Pro", "Conversas ilimitadas", "Suporte dedicado", "Multi-unidade"] }
] as const;

const statusMeta: Record<Invoice["status"], { label: string; chip: string; icon: typeof CheckCircle2 }> = {
  pago: { label: "Pago", chip: "bg-clinical-green/[0.12] text-clinical-green", icon: CheckCircle2 },
  pendente: { label: "Pendente", chip: "bg-clinical-orange/[0.12] text-clinical-orange", icon: AlertCircle },
  atrasado: { label: "Em atraso", chip: "bg-clinical-red/[0.10] text-clinical-red", icon: AlertCircle }
};

export function FinanceiroPage() {
  const { toast } = useDemo();
  const [invoices] = useState<Invoice[]>(() => listInvoices());
  const [planOpen, setPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  const stats: StatItem[] = useMemo(() => {
    const pending = invoices.filter((invoice) => invoice.status === "pendente");
    const late = invoices.filter((invoice) => invoice.status === "atrasado");
    return [
      { id: "pending", label: "Em aberto", value: pending.length > 0 ? "R$ 890,00" : "R$ 0,00", hint: `${pending.length + late.length} fatura${pending.length + late.length === 1 ? "" : "s"}`, tone: "orange", icon: Receipt },
      { id: "paid", label: "Pago no período", value: "R$ 1.904,00", hint: "julho e agosto/2026", tone: "green", icon: CheckCircle2 },
      { id: "plan", label: "Plano atual", value: "Clínica Pro", hint: "R$ 890,00/mês", tone: "blue", icon: Sparkles }
    ];
  }, [invoices]);

  function changePlan() {
    const plan = PLANS.find((item) => item.id === selectedPlan);
    if (!plan) return;
    setPlanOpen(false);
    toast(`Plano atualizado para ${plan.name} (${plan.price}/mês). A cobrança ajusta no próximo ciclo.`);
  }

  function download(invoice: Invoice) {
    toast(invoice.pdfUrl ? `Download de "${invoice.pdfUrl}" iniciado (demo).` : "A fatura ainda não foi gerada.");
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Cobrança"
        title="Financeiro"
        description="Plano e faturas da unidade. O consumo de conversas e excedentes aparece na fatura do ciclo."
        action={<Button onClick={() => setPlanOpen(true)}><CreditCard className="size-4" />Alterar plano</Button>}
      />

      <StatStrip items={stats} />

      <section className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5 shadow-[0_8px_24px_rgba(38,53,50,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-clinical-blue/[0.10] text-clinical-blue"><Sparkles className="size-6" /></span>
            <div>
              <h2 className="text-sm font-extrabold text-clinical-dark">Clínica Pro</h2>
              <p className="text-[12px] font-bold text-clinical-muted">R$ 890,00/mês · renova em 05/09/2026</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["15.000 conversas/mês", "Canais ilimitados", "API pública", "IA + automação"].map((feature) => (
              <span key={feature} className="rounded-xl bg-clinical-surfaceMuted/60 px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">{feature}</span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-clinical-muted">
            <span>Conversas do ciclo</span>
            <span>7.412 de 15.000</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-clinical-surfaceMuted">
            <div className="h-full rounded-full bg-clinical-blue" style={{ width: "49%" }} />
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5 shadow-[0_8px_24px_rgba(38,53,50,0.04)]">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-clinical-dark"><Receipt className="size-4 text-clinical-teal" />Faturas</h2>
        <div className="mt-4 space-y-3">
          {invoices.map((invoice) => {
            const status = statusMeta[invoice.status];
            const Icon = status.icon;
            return (
              <article key={invoice.id} className="flex flex-wrap items-center gap-4 rounded-[20px] border border-clinical-border/[0.10] bg-clinical-surfaceMuted/25 p-4">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <h3 className="text-[13px] font-extrabold text-clinical-dark">{invoice.description}</h3>
                  <p className="text-[11px] font-bold text-clinical-muted">{invoice.period} · vence em {invoice.dueDate}{invoice.paidAt ? ` · pago em ${invoice.paidAt}${invoice.paymentMethod ? ` via ${invoice.paymentMethod}` : ""}` : ""}</p>
                </div>
                <span className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold", status.chip)}>
                  <Icon className="size-3.5" />{status.label}
                </span>
                <span className="text-[14px] font-extrabold text-clinical-dark">{invoice.amount}</span>
                <Button size="sm" variant="ghost" onClick={() => download(invoice)}><Download className="size-3.5" />PDF</Button>
              </article>
            );
          })}
        </div>
      </section>

      <Modal open={planOpen} onClose={() => setPlanOpen(false)} title="Alterar plano">
        <div className="space-y-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn("flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-left transition", selectedPlan === plan.id ? "border-clinical-blue/50 bg-clinical-blue/[0.06]" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/25 hover:border-clinical-border/25")}
            >
              <span>
                <span className="flex items-center gap-2 text-[13px] font-extrabold text-clinical-dark">
                  {plan.name}
                  {plan.id === "pro" && <span className="rounded-lg bg-clinical-blue/[0.10] px-2 py-0.5 text-[10px] font-extrabold text-clinical-blueText">Plano atual</span>}
                </span>
                <span className="mt-1 block text-[11px] font-bold text-clinical-muted">{plan.features.join(" · ")}</span>
              </span>
              <span className="shrink-0 text-[13px] font-extrabold text-clinical-dark">{plan.price}<span className="text-[10px] font-bold text-clinical-muted">/mês</span></span>
            </button>
          ))}
          <p className="flex items-start gap-1.5 text-[11px] font-bold leading-4 text-clinical-muted">
            <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-clinical-blue" />
            A mudança vale a partir do próximo ciclo. Faturas já emitidas não são recalculadas.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPlanOpen(false)}>Cancelar</Button>
            <Button onClick={changePlan}><CreditCard className="size-4" />Confirmar plano</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}