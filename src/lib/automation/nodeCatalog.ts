import {
  Bot,
  CalendarClock,
  FileOutput,
  GitBranch,
  HandMetal,
  MessageSquareText,
  Network,
  NotebookPen,
  ScanText,
  Sparkles,
  Timer,
  UserRoundCheck,
  UserRoundSearch,
  Webhook,
  Zap,
  type LucideIcon
} from "lucide-react";
import type { NodeKind, NodeTypeDefinition } from "./types";

export type NodeVisual = {
  icon: LucideIcon;
  tone: "blue" | "green" | "orange" | "teal" | "red";
  label: string;
};

export const nodeCatalog: Record<string, NodeTypeDefinition> = {
  "ebot.chatTrigger": {
    type: "ebot.chatTrigger",
    label: "Mensagem recebida",
    kind: "trigger",
    description: "Inicia o fluxo quando o cliente envia uma mensagem no canal.",
    fields: [
      { key: "channel", label: "Canal", type: "select", options: ["Todos", "WhatsApp", "Instagram", "Webchat"] },
      { key: "keyword", label: "Palavra-chave (opcional)", type: "text", placeholder: "Ex.: agendar" }
    ],
    defaults: { channel: "Todos", keyword: "" }
  },
  "ebot.scheduleTrigger": {
    type: "ebot.scheduleTrigger",
    label: "Agendamento / horário",
    kind: "trigger",
    description: "Dispara em um horário programado, como D-1 de um agendamento.",
    fields: [
      { key: "moment", label: "Momento", type: "select", options: ["D-1 do agendamento", "D-2 do agendamento", "48h após agendamento", "Personalizado"] },
      { key: "time", label: "Horário do envio", type: "text", placeholder: "09:00" }
    ],
    defaults: { moment: "D-1 do agendamento", time: "09:00" }
  },
  "ebot.intentTrigger": {
    type: "ebot.intentTrigger",
    label: "Intenção detectada pela IA",
    kind: "trigger",
    description: "Inicia quando a IA identifica uma intenção específica na conversa.",
    fields: [
      { key: "intent", label: "Intenção", type: "select", options: ["Agendar agendamento", "Resultado de pedido", "Dúvida de parceria", "Reagendar", "Cancelar"] }
    ],
    defaults: { intent: "Agendar agendamento" }
  },
  "ebot.webhookTrigger": {
    type: "ebot.webhookTrigger",
    label: "Webhook",
    kind: "trigger",
    description: "Recebe eventos de sistemas externos (API do Ê-Bot, ERP, histórico).",
    fields: [
      { key: "event", label: "Evento esperado", type: "text", placeholder: "Ex.: agenda.criada" }
    ],
    defaults: { event: "agenda.criada" }
  },
  "ebot.sendMessage": {
    type: "ebot.sendMessage",
    label: "Enviar mensagem",
    kind: "communication",
    description: "Envia uma mensagem ao cliente no canal ativo da conversa.",
    fields: [
      { key: "text", label: "Mensagem", type: "textarea", placeholder: "Use variáveis como {nome_cliente} e {proximo_agendamento}." },
      { key: "quickReplyId", label: "Resposta rápida (opcional)", type: "text", placeholder: "ID da resposta rápida" }
    ],
    defaults: { text: "", quickReplyId: "" }
  },
  "ebot.askQuestion": {
    type: "ebot.askQuestion",
    label: "Fazer pergunta",
    kind: "communication",
    description: "Envia uma pergunta e aguarda a resposta do cliente.",
    fields: [
      { key: "question", label: "Pergunta", type: "textarea", placeholder: "Ex.: Você confirma a agendamento de amanhã?" },
      { key: "options", label: "Opções de resposta", type: "text", placeholder: "Confirmo; Reagendar; Cancelar" }
    ],
    defaults: { question: "", options: "Confirmo; Reagendar" }
  },
  "ebot.sendDocument": {
    type: "ebot.sendDocument",
    label: "Enviar documento",
    kind: "communication",
    description: "Envia um documento da central de arquivos ao cliente.",
    fields: [
      { key: "document", label: "Documento", type: "text", placeholder: "Ex.: preparo-pedidos.pdf" }
    ],
    defaults: { document: "" }
  },
  "ebot.aiAgent": {
    type: "ebot.aiAgent",
    label: "Agente IA",
    kind: "ai",
    description: "Assistente Ê-Bot responde usando base de conhecimento e protocolo.",
    fields: [
      { key: "assistant", label: "Assistente", type: "select", options: ["Atendimento geral", "Triagem inicial", "Pedidos e resultados"] },
      { key: "fallback", label: "Se não souber responder", type: "select", options: ["Transferir para humano", "Pedir reformulação"] }
    ],
    defaults: { assistant: "Atendimento geral", fallback: "Transferir para humano" }
  },
  "ebot.aiReply": {
    type: "ebot.aiReply",
    label: "Gerar resposta com IA",
    kind: "ai",
    description: "Gera uma resposta pontual com IA a partir do contexto da conversa.",
    fields: [
      { key: "instruction", label: "Instrução", type: "textarea", placeholder: "Ex.: Resuma o pedido do cliente em 1 frase." }
    ],
    defaults: { instruction: "" }
  },
  "ebot.classifyIntent": {
    type: "ebot.classifyIntent",
    label: "Classificar intenção",
    kind: "ai",
    description: "Classifica a mensagem em categorias para direcionar o fluxo.",
    fields: [
      { key: "categories", label: "Categorias", type: "text", placeholder: "Agendamento; Dúvida; Urgência" }
    ],
    defaults: { categories: "Agendamento; Dúvida; Urgência" }
  },
  "ebot.sentiment": {
    type: "ebot.sentiment",
    label: "Análise de sentimento",
    kind: "ai",
    description: "Avalia o tom da conversa para priorizar atendimento humano.",
    fields: [
      { key: "threshold", label: "Priorizar quando", type: "select", options: ["Insatisfeito", "Neutro", "Qualquer negativo"] }
    ],
    defaults: { threshold: "Insatisfeito" }
  },
  "ebot.condition": {
    type: "ebot.condition",
    label: "Condição",
    kind: "logic",
    description: "Divide o fluxo em dois caminhos com base em uma regra.",
    fields: [
      { key: "field", label: "Campo avaliado", type: "text", placeholder: "Ex.: resposta_cliente" },
      { key: "operator", label: "Operador", type: "select", options: ["é igual a", "contém", "é diferente de", "está vazio"] },
      { key: "value", label: "Valor", type: "text", placeholder: "Ex.: Confirmo" }
    ],
    defaults: { field: "resposta_cliente", operator: "é igual a", value: "Confirmo" }
  },
  "ebot.wait": {
    type: "ebot.wait",
    label: "Espera / delay",
    kind: "logic",
    description: "Aguarda um intervalo antes de continuar o fluxo.",
    fields: [
      { key: "duration", label: "Tempo", type: "text", placeholder: "Ex.: 2 horas" }
    ],
    defaults: { duration: "2 horas" }
  },
  "ebot.humanHandoff": {
    type: "ebot.humanHandoff",
    label: "Transferir para humano",
    kind: "logic",
    description: "Move a conversa para a fila humana com resumo do contexto.",
    fields: [
      { key: "queue", label: "Fila de destino", type: "select", options: ["Atendimento", "Pedidos", "Frota", "Prioridade"] },
      { key: "summary", label: "Enviar resumo da conversa", type: "toggle" }
    ],
    defaults: { queue: "Atendimento", summary: true }
  },
  "ebot.end": {
    type: "ebot.end",
    label: "Encerrar conversa",
    kind: "logic",
    description: "Finaliza o atendimento e registra o resultado.",
    fields: [
      { key: "resolution", label: "Resultado", type: "select", options: ["Resolvido", "Cancelado", "Transferido"] }
    ],
    defaults: { resolution: "Resolvido" }
  },
  "ebot.lookupClient": {
    type: "ebot.lookupClient",
    label: "Buscar cliente",
    kind: "data",
    description: "Carrega dados do cliente (agenda, parceria, histórico).",
    fields: [
      { key: "fields", label: "Dados a carregar", type: "text", placeholder: "agenda, parceria, ultimo_atendimento" }
    ],
    defaults: { fields: "agenda, parceria, ultimo_atendimento" }
  },
  "ebot.updateAgenda": {
    type: "ebot.updateAgenda",
    label: "Atualizar agenda",
    kind: "data",
    description: "Cria, confirma ou move um compromisso na agenda.",
    fields: [
      { key: "operation", label: "Operação", type: "select", options: ["Confirmar agendamento", "Agendar", "Reagendar", "Cancelar"] }
    ],
    defaults: { operation: "Confirmar agendamento" }
  },
  "ebot.writeRecord": {
    type: "ebot.writeRecord",
    label: "Registrar no histórico",
    kind: "data",
    description: "Escreve um registro estruturado no histórico do cliente.",
    fields: [
      { key: "note", label: "Registro", type: "textarea", placeholder: "Ex.: Cliente confirmou agendamento via WhatsApp." }
    ],
    defaults: { note: "" }
  }
};

export const nodeVisuals: Record<string, NodeVisual> = {
  "ebot.chatTrigger": { icon: MessageSquareText, tone: "blue", label: "Gatilho" },
  "ebot.scheduleTrigger": { icon: CalendarClock, tone: "blue", label: "Gatilho" },
  "ebot.intentTrigger": { icon: Sparkles, tone: "blue", label: "Gatilho" },
  "ebot.webhookTrigger": { icon: Webhook, tone: "blue", label: "Gatilho" },
  "ebot.sendMessage": { icon: Zap, tone: "green", label: "Comunicação" },
  "ebot.askQuestion": { icon: MessageSquareText, tone: "green", label: "Comunicação" },
  "ebot.sendDocument": { icon: FileOutput, tone: "green", label: "Comunicação" },
  "ebot.aiAgent": { icon: Bot, tone: "teal", label: "IA" },
  "ebot.aiReply": { icon: Sparkles, tone: "teal", label: "IA" },
  "ebot.classifyIntent": { icon: ScanText, tone: "teal", label: "IA" },
  "ebot.sentiment": { icon: NotebookPen, tone: "teal", label: "IA" },
  "ebot.condition": { icon: GitBranch, tone: "orange", label: "Lógica" },
  "ebot.wait": { icon: Timer, tone: "orange", label: "Lógica" },
  "ebot.humanHandoff": { icon: UserRoundCheck, tone: "orange", label: "Lógica" },
  "ebot.end": { icon: HandMetal, tone: "orange", label: "Lógica" },
  "ebot.lookupClient": { icon: UserRoundSearch, tone: "red", label: "Dados" },
  "ebot.updateAgenda": { icon: CalendarClock, tone: "red", label: "Dados" },
  "ebot.writeRecord": { icon: Network, tone: "red", label: "Dados" }
};

export const nodeKindLabels: Record<NodeKind, string> = {
  trigger: "Gatilhos",
  communication: "Comunicação",
  ai: "Inteligência artificial",
  logic: "Lógica e controle",
  data: "Dados comerciais"
};

export const nodeKindOrder: NodeKind[] = ["trigger", "communication", "ai", "logic", "data"];

export function getNodeDefinition(type: string): NodeTypeDefinition | null {
  return nodeCatalog[type] ?? null;
}

export function getNodeVisual(type: string): NodeVisual {
  return nodeVisuals[type] ?? { icon: Zap, tone: "blue", label: "Nó" };
}
