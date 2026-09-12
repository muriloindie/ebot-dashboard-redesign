"use client";

import type { ContactEntry } from "@/lib/company/types";

export type ExportFormat = "excel" | "csv" | "md" | "pdf";

export const EXPORT_FORMATS: { id: ExportFormat; label: string; hint: string }[] = [
  { id: "excel", label: "Excel (.xls)", hint: "Abre direto no Excel" },
  { id: "csv", label: "CSV (.csv)", hint: "nome;telefone;canal;consentimento" },
  { id: "md", label: "Markdown (.md)", hint: "Tabela Markdown" },
  { id: "pdf", label: "PDF (impressão)", hint: "Abre a impressão do navegador" }
];

export const CSV_FORMAT_HINT = "nome;telefone;canal;consentimento — uma linha por contato. Canal: WhatsApp, Instagram ou E-mail. Consentimento: sim ou não.";

function slug(name: string) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "lista";
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

function toCsv(entries: ContactEntry[]): string {
  const lines = ["nome;telefone;canal;consentimento"];
  entries.forEach((entry) => {
    lines.push([entry.name, entry.phone, entry.channel, entry.consent ? "sim" : "não"].map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"));
  });
  return `﻿${lines.join("\r\n")}`;
}

function toMarkdown(listName: string, entries: ContactEntry[]): string {
  const lines = [`# ${listName}`, "", `Total: ${entries.length} contatos`, "", "| Nome | Telefone | Canal | Consentimento |", "| --- | --- | --- | --- |"];
  entries.forEach((entry) => {
    lines.push(`| ${entry.name} | ${entry.phone} | ${entry.channel} | ${entry.consent ? "sim" : "não"} |`);
  });
  return `${lines.join("\n")}\n`;
}

function toExcelHtml(listName: string, entries: ContactEntry[]): string {
  const rows = entries.map((entry) => `<tr><td>${entry.name}</td><td>${entry.phone}</td><td>${entry.channel}</td><td>${entry.consent ? "sim" : "não"}</td></tr>`).join("");
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1"><thead><tr><th>Nome</th><th>Telefone</th><th>Canal</th><th>Consentimento</th></tr></thead><tbody>${rows}</tbody></table><p>${listName} — ${entries.length} contatos</p></body></html>`;
}

function printPdf(listName: string, entries: ContactEntry[]) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return false;
  const rows = entries.map((entry) => `<tr><td>${entry.name}</td><td>${entry.phone}</td><td>${entry.channel}</td><td>${entry.consent ? "sim" : "não"}</td></tr>`).join("");
  win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${listName}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#041B15}h1{font-size:20px}p{color:#5b6b62}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #d8e0dd;padding:8px;font-size:13px;text-align:left}th{background:#eef4f1}</style></head><body><h1>${listName}</h1><p>Total: ${entries.length} contatos</p><table><thead><tr><th>Nome</th><th>Telefone</th><th>Canal</th><th>Consentimento</th></tr></thead><tbody>${rows}</tbody></table><script>window.onload=function(){window.print()}<\/script></body></html>`);
  win.document.close();
  return true;
}

export function exportContactList(listName: string, entries: ContactEntry[], format: ExportFormat): boolean {
  const base = slug(listName);
  if (format === "csv") {
    download(new Blob([toCsv(entries)], { type: "text/csv;charset=utf-8" }), `${base}.csv`);
    return true;
  }
  if (format === "md") {
    download(new Blob([toMarkdown(base, entries)], { type: "text/markdown;charset=utf-8" }), `${base}.md`);
    return true;
  }
  if (format === "excel") {
    download(new Blob([toExcelHtml(listName, entries)], { type: "application/vnd.ms-excel;charset=utf-8" }), `${base}.xls`);
    return true;
  }
  return printPdf(listName, entries);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export type ParsedImport = {
  name: string;
  phone: string;
  channel: ContactEntry["channel"];
  valid: boolean;
};

export function parseContactCsv(text: string): ParsedImport[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index) => !(index === 0 && /^nome[;,]/i.test(line)))
    .map((line) => {
      const parts = line.split(/[;,]/).map((part) => part.replace(/^"|"$/g, "").trim());
      const [name = "", phone = "", rawChannel = "", rawConsent = ""] = parts;
      const channel = /instagram/i.test(rawChannel) ? "Instagram" : /e-?mail/i.test(rawChannel) ? "E-mail" : "WhatsApp";
      void rawConsent;
      return { name: name || phone, phone, channel, valid: Boolean(phone) && isValidPhone(phone) };
    });
}
