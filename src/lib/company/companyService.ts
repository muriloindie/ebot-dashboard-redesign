"use client";

import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import {
  seedApiEndpoints,
  seedCampaigns,
  seedCampaignSettings,
  seedConfig,
  seedContactEntries,
  seedContactLists,
  seedHelpTopics,
  seedHelpVideos,
  seedInvoices,
  seedIntegrations,
  seedPermissionMatrix,
  seedQueues,
  seedSectors,
  seedTypebotIntegrations,
  seedUsers
} from "@/data/companyMock";
import type {
  ApiEndpoint,
  AppConfigSection,
  Campaign,
  CampaignSettings,
  ContactEntry,
  ContactList,
  HelpTopic,
  HelpVideo,
  Integration,
  Invoice,
  PermissionMatrix,
  Queue,
  Sector,
  StaffUser,
  TypebotIntegration
} from "./types";

const KEYS = {
  campaigns: "ebot-com-campaigns",
  contactLists: "ebot-com-contact-lists",
  contactEntries: "ebot-com-contact-entries",
  campaignSettings: "ebot-com-campaign-settings",
  sectors: "ebot-com-sectors",
  queues: "ebot-com-queues",
  users: "ebot-com-users",
  permissions: "ebot-com-permissions",
  integrations: "ebot-com-integrations",
  typebot: "ebot-com-typebot",
  endpoints: "ebot-com-endpoints",
  invoices: "ebot-com-invoices",
  help: "ebot-com-help",
  helpVideos: "ebot-com-help-videos",
  config: "ebot-com-config"
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const newCompanyId = uid;

// ---- Campaigns ----

export function listCampaigns(): Campaign[] {
  return readLocalCache<Campaign[]>(KEYS.campaigns, seedCampaigns);
}

export function getCampaign(id: string): Campaign | null {
  return listCampaigns().find((campaign) => campaign.id === id) ?? null;
}

export function saveCampaign(campaign: Campaign) {
  const campaigns = listCampaigns();
  const exists = campaigns.some((item) => item.id === campaign.id);
  writeLocalCache(KEYS.campaigns, exists ? campaigns.map((item) => (item.id === campaign.id ? campaign : item)) : [campaign, ...campaigns]);
  return campaign;
}

export function deleteCampaign(id: string) {
  writeLocalCache(KEYS.campaigns, listCampaigns().filter((campaign) => campaign.id !== id));
}

export function listContactLists(): ContactList[] {
  return readLocalCache<ContactList[]>(KEYS.contactLists, seedContactLists);
}

export function saveContactList(list: ContactList) {
  const lists = listContactLists();
  const exists = lists.some((item) => item.id === list.id);
  writeLocalCache(KEYS.contactLists, exists ? lists.map((item) => (item.id === list.id ? list : item)) : [list, ...lists]);
}

export function deleteContactList(id: string) {
  writeLocalCache(KEYS.contactLists, listContactLists().filter((list) => list.id !== id));
}

export function listContactEntries(listId?: string): ContactEntry[] {
  const all = readLocalCache<ContactEntry[]>(KEYS.contactEntries, seedContactEntries);
  return listId ? all.filter((entry) => entry.listId === listId) : all;
}

export function saveContactEntry(entry: ContactEntry) {
  const all = readLocalCache<ContactEntry[]>(KEYS.contactEntries, seedContactEntries);
  const exists = all.some((item) => item.id === entry.id);
  writeLocalCache(KEYS.contactEntries, exists ? all.map((item) => (item.id === entry.id ? entry : item)) : [entry, ...all]);
}

export function deleteContactEntry(id: string) {
  const all = readLocalCache<ContactEntry[]>(KEYS.contactEntries, seedContactEntries);
  writeLocalCache(KEYS.contactEntries, all.filter((entry) => entry.id !== id));
}

export function getCampaignSettings(): CampaignSettings {
  return readLocalCache<CampaignSettings>(KEYS.campaignSettings, seedCampaignSettings);
}

export function saveCampaignSettings(settings: CampaignSettings) {
  writeLocalCache(KEYS.campaignSettings, settings);
}

// ---- Sectors & queues ----

export function listSectors(): Sector[] {
  return readLocalCache<Sector[]>(KEYS.sectors, seedSectors);
}

export function saveSector(sector: Sector) {
  const sectors = listSectors();
  const exists = sectors.some((item) => item.id === sector.id);
  writeLocalCache(KEYS.sectors, exists ? sectors.map((item) => (item.id === sector.id ? sector : item)) : [sector, ...sectors]);
}

export function deleteSector(id: string) {
  writeLocalCache(KEYS.sectors, listSectors().filter((sector) => sector.id !== id));
}

export function listQueues(): Queue[] {
  return readLocalCache<Queue[]>(KEYS.queues, seedQueues);
}

export function saveQueue(queue: Queue) {
  const queues = listQueues();
  const exists = queues.some((item) => item.id === queue.id);
  writeLocalCache(KEYS.queues, exists ? queues.map((item) => (item.id === queue.id ? queue : item)) : [queue, ...queues]);
}

export function deleteQueue(id: string) {
  writeLocalCache(KEYS.queues, listQueues().filter((queue) => queue.id !== id));
}

// ---- Users ----

export function listUsers(): StaffUser[] {
  return readLocalCache<StaffUser[]>(KEYS.users, seedUsers);
}

export function saveUser(user: StaffUser) {
  const users = listUsers();
  const exists = users.some((item) => item.id === user.id);
  writeLocalCache(KEYS.users, exists ? users.map((item) => (item.id === user.id ? user : item)) : [user, ...users]);
}

export function deleteUser(id: string) {
  writeLocalCache(KEYS.users, listUsers().filter((user) => user.id !== id));
}

// ---- Permissions ----

export function listPermissionMatrix(): PermissionMatrix[] {
  return readLocalCache<PermissionMatrix[]>(KEYS.permissions, seedPermissionMatrix);
}

export function savePermissionMatrix(matrix: PermissionMatrix) {
  const rows = listPermissionMatrix();
  const exists = rows.some((item) => item.roleId === matrix.roleId);
  writeLocalCache(KEYS.permissions, exists ? rows.map((item) => (item.roleId === matrix.roleId ? matrix : item)) : [...rows, matrix]);
}

export function deletePermissionMatrix(roleId: string) {
  writeLocalCache(KEYS.permissions, listPermissionMatrix().filter((row) => row.roleId !== roleId));
}

// ---- Integrations ----

export function listIntegrations(): Integration[] {
  return readLocalCache<Integration[]>(KEYS.integrations, seedIntegrations);
}

export function saveIntegration(integration: Integration) {
  const integrations = listIntegrations();
  const exists = integrations.some((item) => item.id === integration.id);
  writeLocalCache(KEYS.integrations, exists ? integrations.map((item) => (item.id === integration.id ? integration : item)) : [...integrations, integration]);
}

export function listApiEndpoints(): ApiEndpoint[] {
  return readLocalCache<ApiEndpoint[]>(KEYS.endpoints, seedApiEndpoints);
}

export function saveApiEndpoint(endpoint: ApiEndpoint) {
  const endpoints = listApiEndpoints();
  const exists = endpoints.some((item) => item.id === endpoint.id);
  writeLocalCache(KEYS.endpoints, exists ? endpoints.map((item) => (item.id === endpoint.id ? endpoint : item)) : [...endpoints, endpoint]);
}

export function deleteApiEndpoint(id: string) {
  writeLocalCache(KEYS.endpoints, listApiEndpoints().filter((endpoint) => endpoint.id !== id));
}

// ---- Finance ----

export function listInvoices(): Invoice[] {
  return readLocalCache<Invoice[]>(KEYS.invoices, seedInvoices);
}

export function saveInvoice(invoice: Invoice) {
  const invoices = listInvoices();
  const exists = invoices.some((item) => item.id === invoice.id);
  writeLocalCache(KEYS.invoices, exists ? invoices.map((item) => (item.id === invoice.id ? invoice : item)) : [...invoices, invoice]);
}

// ---- Help ----

export function listHelpTopics(): HelpTopic[] {
  return readLocalCache<HelpTopic[]>(KEYS.help, seedHelpTopics);
}

export function saveHelpTopic(topic: HelpTopic) {
  const rows = listHelpTopics();
  const exists = rows.some((row) => row.id === topic.id);
  writeLocalCache(KEYS.help, exists ? rows.map((row) => (row.id === topic.id ? topic : row)) : [topic, ...rows]);
}

export function deleteHelpTopic(id: string) {
  writeLocalCache(KEYS.help, listHelpTopics().filter((row) => row.id !== id));
}

export function listHelpVideos(): HelpVideo[] {
  return readLocalCache<HelpVideo[]>(KEYS.helpVideos, seedHelpVideos);
}

export function saveHelpVideo(video: HelpVideo) {
  const rows = listHelpVideos();
  const exists = rows.some((row) => row.id === video.id);
  writeLocalCache(KEYS.helpVideos, exists ? rows.map((row) => (row.id === video.id ? video : row)) : [video, ...rows]);
}

export function deleteHelpVideo(id: string) {
  writeLocalCache(KEYS.helpVideos, listHelpVideos().filter((row) => row.id !== id));
}

// ---- Typebot integrations ----

export function listTypebotIntegrations(): TypebotIntegration[] {
  return readLocalCache<TypebotIntegration[]>(KEYS.typebot, seedTypebotIntegrations);
}

export function saveTypebotIntegration(integration: TypebotIntegration) {
  const rows = listTypebotIntegrations();
  const exists = rows.some((row) => row.id === integration.id);
  writeLocalCache(KEYS.typebot, exists ? rows.map((row) => (row.id === integration.id ? integration : row)) : [integration, ...rows]);
}

export function deleteTypebotIntegration(id: string) {
  writeLocalCache(KEYS.typebot, listTypebotIntegrations().filter((row) => row.id !== id));
}

// ---- Config ----

export function getConfig(section: AppConfigSection): Record<string, string | boolean | number> {
  return readLocalCache<Record<AppConfigSection, Record<string, string | boolean | number>>>(KEYS.config, seedConfig)[section];
}

export function saveConfig(section: AppConfigSection, values: Record<string, string | boolean | number>) {
  const all = readLocalCache<Record<AppConfigSection, Record<string, string | boolean | number>>>(KEYS.config, seedConfig);
  writeLocalCache(KEYS.config, { ...all, [section]: values });
}