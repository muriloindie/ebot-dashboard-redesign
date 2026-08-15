"use client";

import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import {
  automationTemplates,
  seedAssistants,
  seedExecutions,
  seedFiles,
  seedKnowledgeBases,
  seedQuickReplies,
  seedWorkflows
} from "@/data/automationMock";
import type {
  AppliedTemplateOptions,
  Assistant,
  AutomationTemplate,
  DriveFile,
  FlowExecution,
  FlowNode,
  FlowStatus,
  KnowledgeBase,
  QuickReply,
  Workflow
} from "./types";

const KEYS = {
  workflows: "ebot-aut-workflows",
  executions: "ebot-aut-executions",
  quickReplies: "ebot-aut-quick-replies",
  knowledgeBases: "ebot-aut-knowledge-bases",
  files: "ebot-aut-files",
  assistants: "ebot-aut-assistants"
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---- Workflows (n8n: GET/POST/PUT/DELETE /api/v1/workflows, activate/deactivate) ----

export function listWorkflows(): Workflow[] {
  return readLocalCache<Workflow[]>(KEYS.workflows, seedWorkflows);
}

export function getWorkflow(id: string): Workflow | null {
  return listWorkflows().find((workflow) => workflow.id === id) ?? null;
}

export function saveWorkflow(workflow: Workflow) {
  const workflows = listWorkflows();
  const exists = workflows.some((item) => item.id === workflow.id);
  const next = exists ? workflows.map((item) => (item.id === workflow.id ? workflow : item)) : [workflow, ...workflows];
  writeLocalCache(KEYS.workflows, next);
  return workflow;
}

export function deleteWorkflow(id: string) {
  writeLocalCache(KEYS.workflows, listWorkflows().filter((workflow) => workflow.id !== id));
  writeLocalCache(KEYS.executions, listExecutions().filter((execution) => execution.workflowId !== id));
}

export function duplicateWorkflow(id: string): Workflow | null {
  const source = getWorkflow(id);
  if (!source) return null;
  const copy: Workflow = {
    ...source,
    id: uid("wf"),
    name: `${source.name} (cópia)`,
    status: "draft",
    executions7d: 0,
    successRate: 0,
    lastRun: "nunca",
    updatedAt: "agora",
    nodes: source.nodes.map((node) => ({ ...node, id: uid("node") })),
    connections: source.connections.map((connection) => ({ ...connection, id: uid("conn") }))
  };
  saveWorkflow(copy);
  return copy;
}

export function setWorkflowStatus(id: string, status: FlowStatus) {
  const workflows = listWorkflows().map((workflow) =>
    workflow.id === id ? { ...workflow, status, updatedAt: "agora" } : workflow
  );
  writeLocalCache(KEYS.workflows, workflows);
}

export function createWorkflowFromTemplate(template: AutomationTemplate, options: AppliedTemplateOptions): Workflow {
  const nodeIds: string[] = template.nodes.map(() => uid("node"));
  const nodes: FlowNode[] = template.nodes.map((node, index) => ({ ...node, id: nodeIds[index] }));
  const connections = template.connections.map((connection) => ({
    ...connection,
    id: uid("conn"),
    source: nodeIds[Number(connection.source)] ?? connection.source,
    target: nodeIds[Number(connection.target)] ?? connection.target
  }));
  const workflow: Workflow = {
    id: uid("wf"),
    name: options.name,
    description: template.tagline,
    status: "draft",
    channel: options.channel,
    protocolId: options.protocolId,
    protocolName: options.protocolName,
    templateId: template.id,
    knowledgeBaseId: options.knowledgeBaseId,
    nodes,
    connections,
    settings: { timezone: "America/Sao_Paulo", saveExecutions: true, onError: "continuar" },
    tags: [template.category.toLowerCase()],
    executions7d: 0,
    successRate: 0,
    lastRun: "nunca",
    updatedAt: "agora"
  };
  saveWorkflow(workflow);
  return workflow;
}

export function getTemplate(id: string): AutomationTemplate | null {
  return automationTemplates.find((template) => template.id === id) ?? null;
}

// ---- Executions (n8n: GET /api/v1/executions?workflowId=..., GET /executions/{id}) ----

export function listExecutions(workflowId?: string): FlowExecution[] {
  const executions = readLocalCache<FlowExecution[]>(KEYS.executions, seedExecutions);
  return workflowId ? executions.filter((execution) => execution.workflowId === workflowId) : executions;
}

export function addExecution(execution: FlowExecution) {
  const next = [execution, ...listExecutions()];
  writeLocalCache(KEYS.executions, next.slice(0, 60));
}

export function simulateExecution(workflow: Workflow): FlowExecution {
  const ordered: FlowNode[] = [];
  const visited = new Set<string>();
  const startNodes = workflow.nodes.filter(
    (node) => !workflow.connections.some((connection) => connection.target === node.id)
  );
  const queue = [...(startNodes.length ? startNodes : workflow.nodes.slice(0, 1))];
  while (queue.length && ordered.length < workflow.nodes.length) {
    const current = queue.shift();
    if (!current || visited.has(current.id)) continue;
    visited.add(current.id);
    ordered.push(current);
    workflow.connections.filter((connection) => connection.source === current.id).forEach((connection) => {
      const next = workflow.nodes.find((node) => node.id === connection.target);
      if (next) queue.push(next);
    });
  }
  workflow.nodes.forEach((node) => {
    if (!visited.has(node.id)) ordered.push(node);
  });

  const nodeResults: FlowExecution["nodeResults"] = {};
  let total = 0;
  ordered.forEach((node, index) => {
    const failed = index === ordered.length - 2 && ordered.length > 3 && Math.random() < 0.12;
    const durationMs = 80 + Math.round(Math.random() * 900);
    total += failed ? durationMs : durationMs;
    nodeResults[node.id] = failed
      ? { status: "error", durationMs, error: "Tempo de resposta esgotado ao chamar a integração.", output: "" }
      : { status: "success", durationMs, output: `Nó "${node.name}" executado com sucesso.` };
  });
  const hasError = Object.values(nodeResults).some((result) => result.status === "error");
  return {
    id: uid("exec"),
    workflowId: workflow.id,
    status: hasError ? "error" : "success",
    startedAt: "agora",
    durationMs: total,
    trigger: "Execução de teste manual",
    nodeResults
  };
}

// ---- Quick replies ----

export function listQuickReplies(): QuickReply[] {
  return readLocalCache<QuickReply[]>(KEYS.quickReplies, seedQuickReplies);
}

export function saveQuickReply(reply: QuickReply) {
  const replies = listQuickReplies();
  const exists = replies.some((item) => item.id === reply.id);
  writeLocalCache(KEYS.quickReplies, exists ? replies.map((item) => (item.id === reply.id ? reply : item)) : [reply, ...replies]);
}

export function deleteQuickReply(id: string) {
  writeLocalCache(KEYS.quickReplies, listQuickReplies().filter((reply) => reply.id !== id));
}

export function newQuickReplyId() {
  return uid("qr");
}

// ---- Knowledge bases ----

export function listKnowledgeBases(): KnowledgeBase[] {
  return readLocalCache<KnowledgeBase[]>(KEYS.knowledgeBases, seedKnowledgeBases);
}

export function saveKnowledgeBase(base: KnowledgeBase) {
  const bases = listKnowledgeBases();
  const exists = bases.some((item) => item.id === base.id);
  writeLocalCache(KEYS.knowledgeBases, exists ? bases.map((item) => (item.id === base.id ? base : item)) : [base, ...bases]);
}

export function deleteKnowledgeBase(id: string) {
  writeLocalCache(KEYS.knowledgeBases, listKnowledgeBases().filter((base) => base.id !== id));
}

export function newKnowledgeBaseId() {
  return uid("kb");
}

// ---- Files (central drive) ----

export function listFiles(): DriveFile[] {
  return readLocalCache<DriveFile[]>(KEYS.files, seedFiles);
}

export function saveFile(file: DriveFile) {
  const files = listFiles();
  const exists = files.some((item) => item.id === file.id);
  writeLocalCache(KEYS.files, exists ? files.map((item) => (item.id === file.id ? file : item)) : [file, ...files]);
}

export function deleteFile(id: string) {
  writeLocalCache(KEYS.files, listFiles().filter((file) => file.id !== id));
}

export function newFileId() {
  return uid("file");
}

export function logFileAccess(id: string, user: string, action: DriveFile["audit"][number]["action"]) {
  const file = listFiles().find((item) => item.id === id);
  if (!file) return;
  saveFile({
    ...file,
    audit: [{ id: uid("aud"), user, action, at: "agora" }, ...file.audit]
  });
}

// ---- Assistants (OpenIA) ----

export function listAssistants(): Assistant[] {
  return readLocalCache<Assistant[]>(KEYS.assistants, seedAssistants);
}

export function saveAssistant(assistant: Assistant) {
  const assistants = listAssistants();
  const exists = assistants.some((item) => item.id === assistant.id);
  writeLocalCache(KEYS.assistants, exists ? assistants.map((item) => (item.id === assistant.id ? assistant : item)) : [assistant, ...assistants]);
}
