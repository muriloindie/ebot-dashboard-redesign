"use client";

import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { kanbanColumns } from "@/data/workManagementMock";

export type KanbanStage = "Entrada" | "Ação" | "Entrega";

export type KanbanColumnConfig = {
  id: string;
  label: string;
  description: string;
  color: string;
  stage: KanbanStage;
  wip: number | null;
  active: boolean;
};

const KEY = "ebot-kanban-columns";

const defaultTone: Record<string, string> = {
  "Novo": "#6B942E",
  "Em atendimento": "#C97F12",
  "Aguardando": "#8FA9B4",
  "Agendado": "#5D737E",
  "Em acompanhamento": "#A9D16C",
  "Concluído": "#041B15"
};

export function defaultKanbanColumns(): KanbanColumnConfig[] {
  return kanbanColumns.map((column, index) => ({
    id: column.id,
    label: column.label,
    description: column.description,
    color: defaultTone[column.id] ?? "#6B942E",
    stage: index === 0 ? "Entrada" : index >= kanbanColumns.length - 2 ? "Entrega" : "Ação",
    wip: null,
    active: true
  }));
}

export function listKanbanColumns(): KanbanColumnConfig[] {
  return readLocalCache<KanbanColumnConfig[]>(KEY, defaultKanbanColumns());
}

export function saveKanbanColumns(columns: KanbanColumnConfig[]) {
  writeLocalCache(KEY, columns);
}

export function resetKanbanColumns() {
  writeLocalCache(KEY, defaultKanbanColumns());
}
