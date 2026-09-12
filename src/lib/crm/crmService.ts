"use client";

import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { crmLeadsSeed, scoreTemperature, type CrmLead, type CrmStage, type CrmTemperature } from "@/data/crmMock";

const KEY = "ebot-crm-leads";

export function listCrmLeads(): CrmLead[] {
  return readLocalCache<CrmLead[]>(KEY, crmLeadsSeed);
}

export function saveCrmLeads(leads: CrmLead[]) {
  writeLocalCache(KEY, leads);
}

export function resetCrmLeads(): CrmLead[] {
  writeLocalCache(KEY, crmLeadsSeed);
  return crmLeadsSeed;
}

export type CrmInsights = {
  activeLeads: number;
  pipelineValue: number;
  qualifiedRate: number;
  staleLeads: number;
  unassignedLeads: number;
  conversionRate: number;
  wonValue: number;
  avgScore: number;
};

export function computeCrmInsights(leads: CrmLead[]): CrmInsights {
  const active = leads.filter((lead) => !isTerminal(lead.stage));
  const won = leads.filter((lead) => lead.stage === "Ganho");
  const lost = leads.filter((lead) => lead.stage === "Perdido");
  const qualified = leads.filter((lead) => lead.score >= 70);
  const closed = won.length + lost.length;

  return {
    activeLeads: active.length,
    pipelineValue: active.reduce((total, lead) => total + lead.value, 0),
    qualifiedRate: leads.length ? Math.round((qualified.length / leads.length) * 100) : 0,
    staleLeads: active.filter((lead) => lead.staleDays >= 3).length,
    unassignedLeads: active.filter((lead) => lead.owner === "Sem responsável").length,
    conversionRate: closed ? Math.round((won.length / closed) * 100) : 0,
    wonValue: won.reduce((total, lead) => total + lead.value, 0),
    avgScore: leads.length ? Math.round(leads.reduce((total, lead) => total + lead.score, 0) / leads.length) : 0
  };
}

export function isTerminal(stage: CrmStage) {
  return stage === "Ganho" || stage === "Perdido";
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function temperatureLabel(temperature: CrmTemperature) {
  return { quente: "Quente", morno: "Morno", frio: "Frio" }[temperature];
}

export function leadTemperature(score: number) {
  return scoreTemperature(score);
}
