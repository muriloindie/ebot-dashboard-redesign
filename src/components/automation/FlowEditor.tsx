"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  GripVertical,
  History,
  Pause,
  Play,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  Workflow as WorkflowIcon,
  X,
  Zap
} from "lucide-react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeProps
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getNodeDefinition, getNodeVisual, nodeCatalog, nodeKindLabels, nodeKindOrder } from "@/lib/automation/nodeCatalog";
import { addExecution, getWorkflow, listKnowledgeBases, saveWorkflow, setWorkflowStatus, simulateExecution } from "@/lib/automation/n8nService";
import type { FlowExecution, FlowNode, Workflow } from "@/lib/automation/types";
import { useDemo } from "@/components/state/DemoProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { ExecutionLogs } from "./FlowsPage";
import { cn } from "@/lib/cn";

type EbotNodeData = { node: FlowNode; executionStatus?: "success" | "error" | "skipped" };
type EbotRfNode = Node<EbotNodeData, "ebot">;

const toneStyles = {
  blue: "bg-clinical-blue/[0.10] text-clinical-blue",
  green: "bg-clinical-green/[0.12] text-clinical-green",
  orange: "bg-clinical-orange/[0.12] text-clinical-orange",
  teal: "bg-clinical-teal/[0.12] text-clinical-teal",
  red: "bg-clinical-red/[0.12] text-clinical-red"
} as const;

const minimapColors: Record<string, string> = {
  blue: "#3a9dca",
  green: "#87a630",
  orange: "#f19d18",
  teal: "#30a3a4",
  red: "#cd4c4c"
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function EbotNode({ data, selected }: NodeProps<EbotRfNode>) {
  const flowNode = data.node;
  const definition = getNodeDefinition(flowNode.type);
  const visual = getNodeVisual(flowNode.type);
  const Icon = visual.icon;
  const isCondition = flowNode.type === "ebot.condition";
  const execution = data.executionStatus;

  return (
    <div
      className={cn(
        "w-56 rounded-2xl border bg-clinical-surface shadow-[0_10px_28px_rgba(38,53,50,0.10)] transition",
        selected ? "border-clinical-blue ring-2 ring-clinical-blue/25" : "border-clinical-border/[0.18]",
        execution === "success" && "border-clinical-green/60 ring-2 ring-clinical-green/20",
        execution === "error" && "border-clinical-red/60 ring-2 ring-clinical-red/20",
        execution === "skipped" && "opacity-55",
        flowNode.disabled && "opacity-50"
      )}
    >
      <Handle type="target" position={Position.Left} className="!size-3 !border-2 !border-clinical-surface !bg-clinical-blue" />
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", toneStyles[visual.tone])}>
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-extrabold leading-4 text-clinical-dark">{flowNode.name}</span>
          <span className="mt-0.5 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">
            {visual.label}
            {execution === "success" ? <span className="text-clinical-green">· ok</span> : null}
            {execution === "error" ? <span className="text-clinical-red">· erro</span> : null}
          </span>
        </span>
      </div>
      {flowNode.parameters && typeof flowNode.parameters.text === "string" && flowNode.parameters.text ? (
        <p className="line-clamp-2 border-t border-clinical-border/[0.10] px-3 py-2 text-[11px] font-semibold leading-4 text-clinical-muted">{String(flowNode.parameters.text)}</p>
      ) : null}
      {definition && isCondition ? (
        <>
          <Handle id="true" type="source" position={Position.Right} style={{ top: "32%" }} className="!size-3 !border-2 !border-clinical-surface !bg-clinical-green" />
          <Handle id="false" type="source" position={Position.Right} style={{ top: "68%" }} className="!size-3 !border-2 !border-clinical-surface !bg-clinical-red" />
          <span className="absolute -right-8 top-[26%] text-[10px] font-extrabold text-clinical-green">sim</span>
          <span className="absolute -right-7 top-[62%] text-[10px] font-extrabold text-clinical-red">não</span>
        </>
      ) : (
        <Handle type="source" position={Position.Right} className="!size-3 !border-2 !border-clinical-surface !bg-clinical-blue" />
      )}
    </div>
  );
}

const nodeTypes = { ebot: EbotNode };

export function FlowEditor({ id }: { id: string }) {
  return (
    <ReactFlowProvider>
      <EditorInner id={id} />
    </ReactFlowProvider>
  );
}

function EditorInner({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useDemo();
  const { theme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [missing, setMissing] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Workflow["status"]>("draft");
  const [channel, setChannel] = useState<Workflow["channel"]>("WhatsApp");
  const [description, setDescription] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<EbotRfNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [dirty, setDirty] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [execution, setExecution] = useState<FlowExecution | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const knowledgeBases = useMemo(() => listKnowledgeBases(), []);

  useEffect(() => {
    const loaded = getWorkflow(id);
    if (!loaded) {
      setMissing(true);
      return;
    }
    setWorkflow(loaded);
    setName(loaded.name);
    setStatus(loaded.status);
    setChannel(loaded.channel);
    setDescription(loaded.description);
    setKnowledgeBaseId(loaded.knowledgeBaseId);
    setNodes(toRfNodes(loaded.nodes));
    setEdges(toRfEdges(loaded.connections, loaded.status === "active"));
  }, [id]);

  function toRfNodes(flowNodes: FlowNode[], exec?: FlowExecution | null): EbotRfNode[] {
    return flowNodes.map((node) => ({
      id: node.id,
      type: "ebot" as const,
      position: node.position,
      data: { node, executionStatus: exec?.nodeResults[node.id]?.status }
    }));
  }

  function toRfEdges(connections: Workflow["connections"], animated: boolean): Edge[] {
    return connections.map((connection) => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? undefined,
      animated,
      style: { stroke: "rgb(58 157 202)", strokeWidth: 2 },
      markerEnd: { type: "arrowclosed" as const, color: "rgb(58 157 202)", width: 16, height: 16 }
    }));
  }

  const onNodesChange = useCallback((changes: NodeChange<EbotRfNode>[]) => {
    setNodes((current) => applyNodeChanges(changes, current));
    setDirty(true);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
    setEdges((current) => applyEdgeChanges(changes, current));
    setDirty(true);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((current) =>
      addEdge(
        {
          ...connection,
          id: uid("conn"),
          style: { stroke: "rgb(58 157 202)", strokeWidth: 2 },
          markerEnd: { type: "arrowclosed" as const, color: "rgb(58 157 202)", width: 16, height: 16 }
        },
        current
      )
    );
    setDirty(true);
  }, []);

  function addNode(type: string, position?: { x: number; y: number }) {
    const definition = getNodeDefinition(type);
    if (!definition) return;
    const count = nodes.filter((node) => node.data.node.type === type).length;
    const flowNode: FlowNode = {
      id: uid("node"),
      type,
      name: count > 0 ? `${definition.label} ${count + 1}` : definition.label,
      position: position ?? { x: 160 + (nodes.length % 4) * 240, y: 120 + Math.floor(nodes.length / 4) * 140 },
      parameters: { ...definition.defaults }
    };
    setNodes((current) => [...current, { id: flowNode.id, type: "ebot" as const, position: flowNode.position, data: { node: flowNode } }]);
    setSelectedNodeId(flowNode.id);
    setPaletteOpen(false);
    setDirty(true);
  }

  function updateSelectedNode(patch: Partial<FlowNode>) {
    if (!selectedNodeId) return;
    setNodes((current) =>
      current.map((item) => (item.id === selectedNodeId ? { ...item, data: { ...item.data, node: { ...item.data.node, ...patch } } } : item))
    );
    setDirty(true);
  }

  function deleteSelectedNode() {
    if (!selectedNodeId) return;
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
    setDirty(true);
  }

  function duplicateSelectedNode() {
    if (!selectedNodeId) return;
    const source = nodes.find((node) => node.id === selectedNodeId);
    if (!source) return;
    const copy: FlowNode = {
      ...source.data.node,
      id: uid("node"),
      name: `${source.data.node.name} (cópia)`,
      position: { x: source.data.node.position.x + 60, y: source.data.node.position.y + 80 }
    };
    setNodes((current) => [...current, { id: copy.id, type: "ebot" as const, position: copy.position, data: { node: copy } }]);
    setSelectedNodeId(copy.id);
    setDirty(true);
  }

  function buildWorkflow(): Workflow | null {
    if (!workflow) return null;
    return {
      ...workflow,
      name: name.trim() || workflow.name,
      description,
      status,
      channel,
      knowledgeBaseId,
      nodes: nodes.map((item) => ({ ...item.data.node, position: item.position })),
      connections: edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle ?? null })),
      updatedAt: "agora"
    };
  }

  function persist(next: Workflow, silent = false) {
    saveWorkflow(next);
    setWorkflow(next);
    setDirty(false);
    if (!silent) toast("Fluxo salvo localmente. Pronto para sincronizar com o n8n.");
  }

  function handleSave() {
    const next = buildWorkflow();
    if (!next) return;
    persist(next);
  }

  function handleToggleStatus() {
    const next = buildWorkflow();
    if (!next) return;
    const nextStatus: Workflow["status"] = status === "active" ? "paused" : "active";
    const updated = { ...next, status: nextStatus };
    persist(updated, true);
    setStatus(nextStatus);
    setWorkflowStatus(updated.id, nextStatus);
    setEdges((current) => current.map((edge) => ({ ...edge, animated: nextStatus === "active" })));
    toast(nextStatus === "active" ? "Fluxo ativado. O motor n8n começará a executá-lo." : "Fluxo pausado.", nextStatus === "active" ? "success" : "info");
  }

  function handleTest() {
    const next = buildWorkflow();
    if (!next) return;
    persist(next, true);
    const exec = simulateExecution(next);
    addExecution(exec);
    setExecution(exec);
    setNodes(() => toRfNodes(next.nodes, exec));
    setLogsOpen(true);
    toast(exec.status === "success" ? "Teste concluído com sucesso." : "Teste concluído com erro em um dos nós.", exec.status === "success" ? "success" : "warning");
  }

  function clearExecution() {
    setExecution(null);
    setNodes((current) => current.map((node) => ({ ...node, data: { node: node.data.node, executionStatus: undefined } })));
  }

  function handleBack() {
    if (dirty) {
      const next = buildWorkflow();
      if (next) {
        persist(next, true);
        toast("Alterações salvas automaticamente.", "info");
      }
    }
    router.push("/fluxos-automacao");
  }

  if (missing) {
    return (
      <StatePanel
        icon={WorkflowIcon}
        title="Fluxo não encontrado"
        description="Este fluxo pode ter sido excluído. Volte para a lista de fluxos de automação."
        action={<Button size="sm" onClick={() => router.push("/fluxos-automacao")}><ArrowLeft className="size-4" />Voltar para fluxos</Button>}
      />
    );
  }

  if (!workflow) return null;

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedDefinition = selectedNode ? getNodeDefinition(selectedNode.data.node.type) : null;

  const paletteKinds = nodeKindOrder
    .map((kind) => ({
      kind,
      items: Object.values(nodeCatalog)
        .filter((definition) => definition.kind === kind)
        .filter((definition) => `${definition.label} ${definition.description}`.toLowerCase().includes(paletteQuery.toLowerCase()))
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={handleBack} aria-label="Voltar para fluxos de automação" className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-clinical-border/[0.12] text-clinical-muted transition hover:border-clinical-blue/30 hover:text-clinical-blue">
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0">
            <input
              value={name}
              onChange={(event) => { setName(event.target.value); setDirty(true); }}
              aria-label="Nome do fluxo"
              className="w-full min-w-[200px] truncate rounded-xl bg-transparent text-lg font-extrabold tracking-tight text-clinical-dark outline-none focus:bg-clinical-surfaceMuted/60 focus:px-2"
            />
            <p className="flex items-center gap-2 px-0.5 text-[11px] font-extrabold text-clinical-muted">
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5", status === "active" ? "bg-clinical-green/[0.12] text-clinical-green" : status === "paused" ? "bg-clinical-orange/[0.12] text-clinical-orange" : "bg-clinical-blue/[0.10] text-clinical-blueText")}>
                <span className={cn("size-1.5 rounded-full", status === "active" ? "bg-clinical-green" : status === "paused" ? "bg-clinical-orange" : "bg-clinical-blue")} />
                {status === "active" ? "Ativo" : status === "paused" ? "Pausado" : "Rascunho"}
              </span>
              {workflow.protocolName ? <span>· {workflow.protocolName}</span> : null}
              <span>· {channel}</span>
              {dirty ? <span className="text-clinical-orange">· alterações não salvas</span> : null}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPaletteOpen(true)} className="md:hidden"><Plus className="size-4" />Nó</Button>
          <Button size="sm" variant="secondary" onClick={() => { setLogsOpen(true); }}><History className="size-4" />Logs{execution ? <span className="ml-1 rounded-full bg-clinical-blue/20 px-1.5 text-[10px]">1 novo</span> : null}</Button>
          <Button size="sm" variant="secondary" onClick={() => setSettingsOpen(true)}><Settings2 className="size-4" />Configurações</Button>
          {execution ? <Button size="sm" variant="ghost" onClick={clearExecution}><X className="size-4" />Limpar teste</Button> : null}
          <Button size="sm" variant="secondary" onClick={handleTest}><Zap className="size-4" />Testar fluxo</Button>
          <Button size="sm" variant={status === "active" ? "secondary" : "primary"} onClick={handleToggleStatus}>
            {status === "active" ? <><Pause className="size-4" />Pausar</> : <><Play className="size-4" />Ativar</>}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!dirty}><Save className="size-4" />Salvar</Button>
        </div>
      </div>

      <div ref={wrapperRef} className="flex h-[calc(100dvh-210px)] min-h-[480px] gap-3">
        <aside className="hidden w-60 shrink-0 flex-col overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 md:flex">
          <div className="border-b border-clinical-border/[0.12] px-3 py-3">
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-clinical-muted"><Sparkles className="size-3.5 text-clinical-blue" />Paleta de nós</p>
            <p className="mt-1 text-[11px] font-semibold text-clinical-muted">Arraste para o canvas ou clique para adicionar.</p>
          </div>
          <div className="clinical-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
            {paletteKinds.map((group) => (
              <div key={group.kind} className="mb-3">
                <p className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-clinical-muted">{nodeKindLabels[group.kind]}</p>
                <div className="space-y-1">
                  {group.items.map((definition) => {
                    const visual = getNodeVisual(definition.type);
                    const Icon = visual.icon;
                    return (
                      <button
                        key={definition.type}
                        type="button"
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("application/ebot-node", definition.type)}
                        onClick={() => addNode(definition.type)}
                        className="flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-left transition hover:border-clinical-blue/25 hover:bg-clinical-blue/[0.06]"
                        title={definition.description}
                      >
                        <GripVertical className="size-3.5 shrink-0 text-clinical-muted/50" />
                        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", toneStyles[visual.tone])}><Icon className="size-4" /></span>
                        <span className="truncate text-[12px] font-extrabold text-clinical-dark">{definition.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="relative min-w-0 flex-1 overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/60">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
            onDrop={(event) => {
              event.preventDefault();
              const type = event.dataTransfer.getData("application/ebot-node");
              if (!type) return;
              addNode(type, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
            }}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            deleteKeyCode={["Backspace", "Delete"]}
            colorMode={theme}
            proOptions={{ hideAttribution: false }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1.6} color="rgb(58 157 202 / 0.18)" />
            <Controls position="bottom-left" />
            <MiniMap
              position="bottom-right"
              nodeColor={(node) => {
                const visual = getNodeVisual((node.data as EbotNodeData).node.type);
                return minimapColors[visual.tone] ?? "#3a9dca";
              }}
              className="!bg-clinical-surface/90"
            />
          </ReactFlow>

          {selectedNode && selectedDefinition ? (
            <div className="absolute bottom-3 right-3 top-3 z-10 flex w-[320px] max-w-[calc(100%-24px)] flex-col overflow-hidden rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface shadow-clinical">
              <div className="flex items-start justify-between gap-2 border-b border-clinical-border/[0.12] px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-clinical-blueText">{selectedDefinition.label}</p>
                  <input
                    value={selectedNode.data.node.name}
                    onChange={(event) => updateSelectedNode({ name: event.target.value })}
                    aria-label="Nome do nó"
                    className="mt-0.5 w-full rounded-lg bg-transparent text-sm font-extrabold text-clinical-dark outline-none focus:bg-clinical-surfaceMuted/60 focus:px-1.5"
                  />
                </div>
                <button type="button" onClick={() => setSelectedNodeId(null)} aria-label="Fechar painel do nó" className="flex size-8 shrink-0 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-clinical-surfaceMuted hover:text-clinical-dark"><X className="size-4" /></button>
              </div>
              <div className="clinical-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
                <p className="text-xs font-semibold leading-5 text-clinical-muted">{selectedDefinition.description}</p>
                {selectedDefinition.fields.map((field) => {
                  const value = selectedNode.data.node.parameters[field.key];
                  if (field.type === "toggle") {
                    const active = Boolean(value);
                    return (
                      <button key={field.key} type="button" onClick={() => updateSelectedNode({ parameters: { ...selectedNode.data.node.parameters, [field.key]: !active } })} className="flex w-full items-center justify-between gap-3 rounded-xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3 py-2.5 text-left">
                        <span className="text-[13px] font-extrabold text-clinical-dark">{field.label}</span>
                        <span className={cn("flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition", active ? "justify-end bg-clinical-blue" : "justify-start bg-clinical-border/[0.25]")}><span className="size-4 rounded-full bg-white shadow-sm" /></span>
                      </button>
                    );
                  }
                  if (field.type === "select") {
                    return (
                      <label key={field.key} className="block">
                        <span className="mb-1 block text-xs font-extrabold text-clinical-dark">{field.label}</span>
                        <select value={String(value ?? "")} onChange={(event) => updateSelectedNode({ parameters: { ...selectedNode.data.node.parameters, [field.key]: event.target.value } })} className="h-10 w-full rounded-xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-2.5 text-[13px] font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                          {(field.options ?? []).map((option) => <option key={option}>{option}</option>)}
                        </select>
                      </label>
                    );
                  }
                  if (field.type === "textarea") {
                    return (
                      <label key={field.key} className="block">
                        <span className="mb-1 block text-xs font-extrabold text-clinical-dark">{field.label}</span>
                        <textarea value={String(value ?? "")} onChange={(event) => updateSelectedNode({ parameters: { ...selectedNode.data.node.parameters, [field.key]: event.target.value } })} placeholder={field.placeholder} rows={4} className="w-full resize-y rounded-xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 p-2.5 text-[13px] font-semibold text-clinical-dark outline-none placeholder:text-clinical-muted/60 focus:border-clinical-blue/45" />
                      </label>
                    );
                  }
                  return (
                    <label key={field.key} className="block">
                      <span className="mb-1 block text-xs font-extrabold text-clinical-dark">{field.label}</span>
                      <input value={String(value ?? "")} onChange={(event) => updateSelectedNode({ parameters: { ...selectedNode.data.node.parameters, [field.key]: event.target.value } })} placeholder={field.placeholder} className="h-10 w-full rounded-xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-2.5 text-[13px] font-semibold text-clinical-dark outline-none placeholder:text-clinical-muted/60 focus:border-clinical-blue/45" />
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-2 border-t border-clinical-border/[0.12] px-4 py-3">
                <Button size="sm" variant="secondary" className="flex-1" onClick={duplicateSelectedNode}><Copy className="size-3.5" />Duplicar</Button>
                <Button size="sm" variant="secondary" className="flex-1 text-clinical-red" onClick={deleteSelectedNode}><Trash2 className="size-3.5" />Excluir</Button>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <Drawer open={paletteOpen} onClose={() => setPaletteOpen(false)} title="Adicionar nó" description="Toque em um nó para adicioná-lo ao canvas." width="max-w-md">
        <div className="space-y-3">
          <SearchField value={paletteQuery} onChange={setPaletteQuery} placeholder="Buscar nó" />
          {paletteKinds.map((group) => (
            <div key={group.kind}>
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-clinical-muted">{nodeKindLabels[group.kind]}</p>
              <div className="space-y-1">
                {group.items.map((definition) => {
                  const visual = getNodeVisual(definition.type);
                  const Icon = visual.icon;
                  return (
                    <button key={definition.type} type="button" onClick={() => addNode(definition.type)} className="flex w-full items-center gap-2.5 rounded-xl border border-clinical-border/[0.10] bg-clinical-surfaceMuted/35 px-3 py-2.5 text-left transition hover:border-clinical-blue/25 hover:bg-clinical-blue/[0.06]">
                      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", toneStyles[visual.tone])}><Icon className="size-4" /></span>
                      <span className="min-w-0"><span className="block truncate text-[13px] font-extrabold text-clinical-dark">{definition.label}</span><span className="block truncate text-[11px] font-semibold text-clinical-muted">{definition.description}</span></span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      <Drawer open={logsOpen} onClose={() => setLogsOpen(false)} title="Logs de execução" description={`${name} · histórico recente`} width="max-w-xl">
        <div className="space-y-3">
          {execution ? (
            <button type="button" onClick={() => { setLogsOpen(false); }} className="flex w-full items-center justify-between rounded-2xl border border-clinical-blue/30 bg-clinical-blue/[0.07] px-4 py-3 text-left text-sm font-bold text-clinical-blueText">
              <span className="flex items-center gap-2"><Check className="size-4" />Último teste destacado no canvas</span>
              <span className="text-[11px] font-extrabold">{execution.status === "success" ? "sucesso" : "erro"}</span>
            </button>
          ) : null}
          <ExecutionLogs workflow={workflow} />
        </div>
      </Drawer>

      <Drawer open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Configurações do fluxo" description="Canal, base de conhecimento e comportamento de execução." width="max-w-lg">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-clinical-dark">Descrição</span>
            <textarea value={description} onChange={(event) => { setDescription(event.target.value); setDirty(true); }} rows={3} className="w-full resize-y rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 p-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-clinical-dark">Canal</span>
            <select value={channel} onChange={(event) => { setChannel(event.target.value as Workflow["channel"]); setDirty(true); }} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
              <option>WhatsApp</option><option>Instagram</option><option>Webchat</option><option>Todos os canais</option>
            </select>
          </label>
          <div>
            <span className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-clinical-dark"><BookOpen className="size-4 text-clinical-teal" />Base de conhecimento do agente</span>
            <div className="space-y-2">
              <button type="button" onClick={() => { setKnowledgeBaseId(null); setDirty(true); }} className={cn("flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition", knowledgeBaseId === null ? "border-clinical-blue/40 bg-clinical-blue/[0.08] text-clinical-blueText" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 text-clinical-slate")}>
                Sem base de conhecimento
                {knowledgeBaseId === null ? <Check className="size-4" /> : null}
              </button>
              {knowledgeBases.map((base) => (
                <button key={base.id} type="button" onClick={() => { setKnowledgeBaseId(base.id); setDirty(true); }} className={cn("flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition", knowledgeBaseId === base.id ? "border-clinical-blue/40 bg-clinical-blue/[0.08]" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 hover:border-clinical-blue/25")}>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-clinical-dark">{base.name}</span>
                    <span className="block text-xs font-semibold text-clinical-muted">{base.files.length} arquivos</span>
                  </span>
                  {knowledgeBaseId === base.id ? <Check className="size-4 shrink-0 text-clinical-blue" /> : null}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-clinical-dark">Em caso de erro</span>
            <select value={workflow.settings.onError} onChange={(event) => { setWorkflow({ ...workflow, settings: { ...workflow.settings, onError: event.target.value as Workflow["settings"]["onError"] } }); setDirty(true); }} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
              <option value="continuar">Continuar fluxo</option><option value="parar">Parar execução</option>
            </select>
          </label>
          <div className="rounded-2xl border border-clinical-blue/15 bg-clinical-blue/[0.06] p-3.5 text-xs font-semibold leading-5 text-clinical-slate">
            Estes parâmetros correspondem ao objeto <strong>settings</strong> do workflow na API do n8n (timezone, errorWorkflow, saveData). Na integração com o backend, eles são enviados no <strong>PUT /api/v1/workflows/{"{id}"}</strong>.
          </div>
          <Button className="w-full" onClick={() => { handleSave(); setSettingsOpen(false); }}><Save className="size-4" />Salvar configurações</Button>
        </div>
      </Drawer>
    </div>
  );
}
