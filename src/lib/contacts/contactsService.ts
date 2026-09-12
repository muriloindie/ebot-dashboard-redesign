"use client";

import { contacts, type Contact, type ContactChannel } from "@/data/contactsMock";
import { clients, type Client } from "@/data/clientsMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import type { UnifiedContact } from "./types";

export const CONTACTS_CACHE_KEY = "ebot-contacts";
const LEGACY_CONTACTS_CACHE_KEY = "ebot-week2-contacts";
const LEGACY_CLIENTS_CACHE_KEY = "ebot-week2-clients";

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function identityValues(record: Pick<UnifiedContact, "phone" | "email">) {
  return [normalizePhone(record.phone), normalizeEmail(record.email)].filter(Boolean);
}

function inferChannel(tags: string[]): ContactChannel {
  if (tags.includes("Instagram")) return "Instagram";
  if (tags.includes("E-mail")) return "E-mail";
  if (tags.includes("Telefone")) return "Telefone";
  if (tags.includes("Site")) return "Site";
  return "WhatsApp";
}

function clientStage(status: Client["status"]): UnifiedContact["stage"] {
  if (status === "Ativo") return "Convertido";
  if (status === "Inativo") return "Inativo";
  return "Novo contato";
}

function contactToUnified(contact: Contact): UnifiedContact {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.whatsapp,
    email: contact.email,
    channel: contact.channel,
    stage: contact.stage,
    isClient: contact.tags.includes("Cliente") || contact.stage === "Convertido",
    lastActivity: contact.lastSeen,
    tags: [...contact.tags],
    photo: contact.photo,
    origin: contact.origin,
    responsible: contact.responsible,
    history: [],
    nextEvents: []
  };
}

function clientToUnified(client: Client): UnifiedContact {
  const latestInteraction = client.history.find((item) => item.type === "Atendimento" || item.type === "Interação com IA");
  return {
    id: client.id,
    name: client.name,
    phone: client.phone,
    email: client.email,
    cpf: client.cpf,
    birthDate: client.birthDate,
    gender: client.gender,
    channel: inferChannel(client.tags),
    stage: clientStage(client.status),
    clientStatus: client.status,
    isClient: true,
    lastActivity: latestInteraction?.date ?? client.history[0]?.date ?? client.lastAppointment ?? "—",
    tags: [...client.tags],
    responsible: client.agent,
    agent: client.agent,
    unit: client.unit,
    lastAppointment: client.lastAppointment,
    nextAppointment: client.nextAppointment,
    notes: client.notes,
    history: [...client.history],
    nextEvents: [...client.nextEvents],
    legacyIds: [client.id]
  };
}

function mergeClient(current: UnifiedContact, client: Client): UnifiedContact {
  const clientRecord = clientToUnified(client);
  return {
    ...current,
    name: clientRecord.name || current.name,
    phone: clientRecord.phone || current.phone,
    email: clientRecord.email || current.email,
    cpf: clientRecord.cpf,
    birthDate: clientRecord.birthDate,
    gender: clientRecord.gender,
    stage: clientRecord.stage,
    clientStatus: clientRecord.clientStatus,
    isClient: true,
    lastActivity: current.lastActivity || clientRecord.lastActivity,
    tags: Array.from(new Set([...current.tags, ...clientRecord.tags])),
    responsible: current.responsible ?? clientRecord.responsible,
    agent: clientRecord.agent,
    unit: clientRecord.unit,
    lastAppointment: clientRecord.lastAppointment,
    nextAppointment: clientRecord.nextAppointment,
    notes: clientRecord.notes ?? current.notes,
    history: clientRecord.history.length ? clientRecord.history : current.history,
    nextEvents: clientRecord.nextEvents,
    legacyIds: Array.from(new Set([...(current.legacyIds ?? []), client.id]))
  };
}

function mergeLegacyData(legacyContacts: Contact[], legacyClients: Client[]) {
  const merged = legacyContacts.map(contactToUnified);

  for (const client of legacyClients) {
    const clientIdentity = identityValues({ phone: client.phone, email: client.email });
    const matchIndex = merged.findIndex((contact) => identityValues(contact).some((value) => clientIdentity.includes(value)));
    if (matchIndex === -1) {
      merged.push(clientToUnified(client));
    } else {
      merged[matchIndex] = mergeClient(merged[matchIndex], client);
    }
  }

  return merged;
}

function readCanonicalContacts() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CONTACTS_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed as UnifiedContact[] : null;
  } catch {
    return null;
  }
}

export function listContacts() {
  const canonical = readCanonicalContacts();
  if (canonical) return canonical;

  const legacyContacts = readLocalCache<Contact[]>(LEGACY_CONTACTS_CACHE_KEY, contacts);
  const legacyClients = readLocalCache<Client[]>(LEGACY_CLIENTS_CACHE_KEY, clients);
  const migrated = mergeLegacyData(legacyContacts, legacyClients);
  writeLocalCache(CONTACTS_CACHE_KEY, migrated);
  return migrated;
}

export function saveContacts(rows: UnifiedContact[]) {
  writeLocalCache(CONTACTS_CACHE_KEY, rows);
}

export function clearContactCache() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONTACTS_CACHE_KEY);
  window.localStorage.removeItem(LEGACY_CONTACTS_CACHE_KEY);
  window.localStorage.removeItem(LEGACY_CLIENTS_CACHE_KEY);
}
