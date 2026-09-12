export type FlowChannel = "WhatsApp" | "Instagram" | "Webchat" | "Todos os canais";

export type NodeKind = "trigger" | "communication" | "ai" | "logic" | "data";

export type NodeParamField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "toggle";
  options?: string[];
  placeholder?: string;
  hint?: string;
};

export type NodeTypeDefinition = {
  type: string;
  label: string;
  kind: NodeKind;
  description: string;
  fields: NodeParamField[];
  defaults: Record<string, string | boolean>;
};

export type FlowNode = {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  parameters: Record<string, string | boolean>;
  disabled?: boolean;
};

export type FlowConnection = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
};

export type FlowStatus = "active" | "paused" | "draft";

export type WorkflowSettings = {
  timezone: string;
  saveExecutions: boolean;
  onError: "continuar" | "parar";
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  status: FlowStatus;
  channel: FlowChannel;
  protocolId: string | null;
  protocolName: string | null;
  templateId: string | null;
  knowledgeBaseId: string | null;
  nodes: FlowNode[];
  connections: FlowConnection[];
  settings: WorkflowSettings;
  tags: string[];
  executions7d: number;
  successRate: number;
  lastRun: string;
  updatedAt: string;
};

export type ExecutionNodeResult = {
  status: "success" | "error" | "skipped";
  durationMs: number;
  output?: string;
  error?: string;
};

export type FlowExecution = {
  id: string;
  workflowId: string;
  status: "success" | "error" | "running" | "waiting";
  startedAt: string;
  durationMs: number;
  trigger: string;
  nodeResults: Record<string, ExecutionNodeResult>;
};

export type CredentialRequirement = {
  id: string;
  name: string;
  provider: string;
  connected: boolean;
};

export type TemplateCategory = "Agendamento" | "Pedidos" | "Pós-venda" | "Triagem" | "Relacionamento";

export type AutomationTemplate = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: TemplateCategory;
  channel: FlowChannel;
  installs: number;
  rating: number;
  requiresKnowledgeBase: boolean;
  requiresProtocol: boolean;
  credentials: CredentialRequirement[];
  nodes: Omit<FlowNode, "id">[];
  connections: Omit<FlowConnection, "id">[];
};

export type QuickReplyScope = "clientes" | "interno";

export type QuickReply = {
  id: string;
  title: string;
  text: string;
  scopes: QuickReplyScope[];
  category: string;
  usage7d: number;
  updatedAt: string;
};

export type KbCategory = "Protocolos" | "Parcerias" | "Pedidos" | "Políticas" | "Geral";

export type KbFileKind = "pdf" | "docx" | "md" | "image" | "xlsx" | "url" | "text";

export type KbFile = {
  id: string;
  name: string;
  kind: KbFileKind;
  size: string;
  chunks: number;
  status: "indexed" | "processing" | "error";
  updatedAt: string;
  uploadedBy: string;
};

export type KbGraphNode = { id: string; label: string; kind: "entidade" | "conceito" | "regra" };
export type KbGraphEdge = { id: string; source: string; target: string; label: string };

export type KbAccess = {
  roles: string[];
  users: string[];
  classification: "interna" | "sensivel";
};

export type KnowledgeBase = {
  id: string;
  name: string;
  description: string;
  category: KbCategory;
  status: "indexed" | "syncing" | "error";
  files: KbFile[];
  queries30d: number;
  agents: string[];
  access: KbAccess;
  graph: { nodes: KbGraphNode[]; edges: KbGraphEdge[] };
  chunking: { strategy: string; size: number; overlap: number };
  updatedAt: string;
};

export type DriveFileKind = "pdf" | "docx" | "xlsx" | "image" | "md";

export type AccessGrant = {
  id: string;
  granteeType: "user" | "role";
  grantee: string;
  level: "view" | "edit";
};

export type AuditEntry = {
  id: string;
  user: string;
  action: "visualizou" | "baixou" | "editou" | "compartilhou" | "enviou";
  at: string;
};

export type DriveFile = {
  id: string;
  name: string;
  kind: DriveFileKind;
  size: string;
  scope: "client" | "kb";
  clientId?: string;
  clientName?: string;
  kbId?: string;
  folder: string;
  sensitivity: "sensivel" | "geral";
  consent: { granted: boolean; date: string; purpose: string } | null;
  retention: string;
  starred: boolean;
  uploadedBy: string;
  updatedAt: string;
  permissions: AccessGrant[];
  audit: AuditEntry[];
};

export type Assistant = {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  persona: string;
  knowledgeBaseIds: string[];
  handoff: {
    conditions: string[];
    confidenceThreshold: number;
    targetQueue: string;
  };
  guardrails: string[];
  status: "active" | "paused";
  metrics: {
    resolutionRate: number;
    handoffRate: number;
    conversations7d: number;
    tokens7d: string;
    cost7d: string;
    csat: number;
  };
};

export type AppliedTemplateOptions = {
  name: string;
  channel: FlowChannel;
  protocolId: string | null;
  protocolName: string | null;
  knowledgeBaseId: string | null;
};

export type PromptVoiceMode = "texto" | "voz";

export const OPENAI_VOICES = ["alloy", "ash", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer"] as const;

export type OpenAIVoice = (typeof OPENAI_VOICES)[number];

export type Prompt = {
  id: string;
  name: string;
  apiKey: string;
  prompt: string;
  queueId: string;
  queueName: string;
  voiceMode: PromptVoiceMode;
  voice?: OpenAIVoice;
  voiceApiKey?: string;
  voiceRegion?: string;
  temperature: number;
  maxTokens: number;
  maxHistoryMessages: number;
  active: boolean;
  updatedAt: string;
};
