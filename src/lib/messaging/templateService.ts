"use client";

import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { whatsappTemplates } from "@/data/whatsappTemplatesMock";
import type { WhatsAppTemplate } from "@/data/whatsappTemplatesMock";

const KEY = "ebot-msg-whatsapp-templates";

export function listTemplates(): WhatsAppTemplate[] {
  return readLocalCache<WhatsAppTemplate[]>(KEY, whatsappTemplates);
}

export function saveTemplate(template: WhatsAppTemplate) {
  const rows = listTemplates();
  const exists = rows.some((row) => row.id === template.id);
  writeLocalCache(KEY, exists ? rows.map((row) => (row.id === template.id ? template : row)) : [template, ...rows]);
}

export function deleteTemplate(id: string) {
  writeLocalCache(KEY, listTemplates().filter((row) => row.id !== id));
}
