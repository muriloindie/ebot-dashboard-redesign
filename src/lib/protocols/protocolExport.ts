"use client";

import type { ProtocolRecord } from "@/data/protocolsMock";

export type ProtocolExportSection = "resumo" | "dados" | "mensagens";

export const PROTOCOL_EXPORT_SECTIONS: { id: ProtocolExportSection; label: string; hint: string }[] = [
  { id: "resumo", label: "Resumo", hint: "Título, número, status e resumo do atendimento" },
  { id: "dados", label: "Dados do atendimento", hint: "Contato, usuário, setor, fila, canal, datas e duração" },
  { id: "mensagens", label: "Mensagens da conversa", hint: "Logs com origem, horário, aparelho e leitura" }
];

export type ProtocolExportFormat = "excel" | "csv" | "md" | "pdf";

export const PROTOCOL_EXPORT_FORMATS: { id: ProtocolExportFormat; label: string; hint: string }[] = [
  { id: "excel", label: "Excel (.xls)", hint: "Abre direto no Excel" },
  { id: "csv", label: "CSV (.csv)", hint: "Texto separado por ponto e vírgula" },
  { id: "md", label: "Markdown (.md)", hint: "Texto formatado" },
  { id: "pdf", label: "PDF (impressão)", hint: "Abre a impressão do navegador" }
];

function slug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "protocolo";
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function senderLabel(message: ProtocolRecord["messages"][number]): string {
  if (message.senderKind === "attendant") return `Atendente${message.attendant ? ` (${message.attendant})` : ""}`;
  if (message.senderKind === "robot") return "Robô";
  if (message.senderKind === "system") return "Sistema";
  return "Cliente";
}

function messageLine(message: ProtocolRecord["messages"][number]): string {
  const attachment = message.attachmentName ? ` [anexo: ${message.attachmentName}]` : "";
  const meta = [
    message.device ?? "",
    message.kind === "audio" ? (message.listened ? "ouvido" : "não ouvido") : "",
    message.direction === "outgoing" && message.kind !== "audio" ? (message.read ? "visualizado" : "enviado") : ""
  ].filter(Boolean).join(" · ");
  return `${message.sentAt} · ${senderLabel(message)} (${message.sender})${meta ? ` · ${meta}` : ""}: ${message.text}${attachment}`;
}

function sectionText(protocol: ProtocolRecord, section: ProtocolExportSection): string[] {
  if (section === "resumo") {
    return [
      `Protocolo ${protocol.number}`,
      `Título: ${protocol.title}`,
      `Categoria: ${protocol.category}`,
      `Status: ${protocol.status}`,
      `Resumo: ${protocol.summary}`
    ];
  }
  if (section === "dados") {
    return [
      `Cliente: ${protocol.clientName} (${protocol.clientId})`,
      `Telefone: ${protocol.phone}`,
      `Usuário: ${protocol.user}`,
      `Responsável: ${protocol.responsible}`,
      `Setor: ${protocol.sector}`,
      `Fila: ${protocol.queue}`,
      `Canal: ${protocol.channel}`,
      `Data: ${protocol.date}`,
      `Primeira mensagem: ${protocol.firstMessageAt}`,
      `Atendimento iniciado: ${protocol.attendedAt}`,
      `Última atividade: ${protocol.updatedAt}`,
      `Duração: ${protocol.duration}`
    ];
  }
  return [`Mensagens (${protocol.messages.length}):`, ...protocol.messages.map((message) => `- ${messageLine(message)}`)];
}

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function exportProtocol(protocol: ProtocolRecord, sections: ProtocolExportSection[], format: ProtocolExportFormat): boolean {
  const picked = PROTOCOL_EXPORT_SECTIONS.filter((item) => sections.includes(item.id));
  const base = `protocolo-${slug(protocol.number.replace(/^#/, ""))}`;
  if (!picked.length) return false;

  if (format === "csv") {
    const lines = [`Protocolo;${protocol.number}`];
    picked.forEach((item) => {
      lines.push(`[${item.label}]`);
      sectionText(protocol, item.id).forEach((line) => lines.push(`"${line.replace(/"/g, '""')}"`));
    });
    download(new Blob([`﻿${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" }), `${base}.csv`);
    return true;
  }
  if (format === "md") {
    const lines = [`# Protocolo ${protocol.number}`, ""];
    picked.forEach((item) => {
      lines.push(`## ${item.label}`, "");
      sectionText(protocol, item.id).forEach((line) => lines.push(line.startsWith("- ") ? line : `- ${line}`));
      lines.push("");
    });
    download(new Blob([`${lines.join("\n")}\n`], { type: "text/markdown;charset=utf-8" }), `${base}.md`);
    return true;
  }
  if (format === "excel") {
    const blocks = picked.map((item) => {
      const rows = sectionText(protocol, item.id).map((line) => `<tr><td>${esc(line)}</td></tr>`).join("");
      return `<h3>${esc(item.label)}</h3><table border="1">${rows}</table>`;
    }).join("");
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><h2>Protocolo ${esc(protocol.number)} — ${esc(protocol.title)}</h2>${blocks}</body></html>`;
    download(new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" }), `${base}.xls`);
    return true;
  }
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return false;
  const blocks = picked.map((item) => {
    const rows = sectionText(protocol, item.id).map((line) => `<p>${esc(line)}</p>`).join("");
    return `<h3>${esc(item.label)}</h3>${rows}`;
  }).join("");
  win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Protocolo ${esc(protocol.number)}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#041B15}h2{font-size:20px}h3{font-size:15px;margin-top:18px;color:#4F7323}p{font-size:13px;margin:4px 0}</style></head><body><h2>Protocolo ${esc(protocol.number)} — ${esc(protocol.title)}</h2><p>${esc(protocol.clientName)} · ${esc(protocol.date)} · ${esc(protocol.status)}</p>${blocks}<script>window.onload=function(){window.print()}<\/script></body></html>`);
  win.document.close();
  return true;
}
