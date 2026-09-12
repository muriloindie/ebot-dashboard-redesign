"use client";

import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import {
  seedAppearance,
  seedBugReports,
  seedSystemLogs,
  seedSystemUsers
} from "@/data/systemMock";
import type {
  AppearanceSettings,
  BugReport,
  SystemLog,
  SystemUser
} from "@/data/systemMock";

const KEYS = {
  users: "ebot-system-users",
  logs: "ebot-system-logs",
  bugs: "ebot-system-bugs",
  appearance: "ebot-system-appearance"
};

export function listSystemUsers(): SystemUser[] {
  return readLocalCache<SystemUser[]>(KEYS.users, seedSystemUsers);
}

export function saveSystemUser(user: SystemUser) {
  const rows = listSystemUsers();
  const exists = rows.some((row) => row.id === user.id);
  writeLocalCache(KEYS.users, exists ? rows.map((row) => (row.id === user.id ? user : row)) : [user, ...rows]);
}

export function deleteSystemUser(id: string) {
  writeLocalCache(KEYS.users, listSystemUsers().filter((row) => row.id !== id));
}

export function listSystemLogs(): SystemLog[] {
  return readLocalCache<SystemLog[]>(KEYS.logs, seedSystemLogs);
}

export function listBugReports(): BugReport[] {
  return readLocalCache<BugReport[]>(KEYS.bugs, seedBugReports);
}

export function saveBugReport(bug: BugReport) {
  const rows = listBugReports();
  const exists = rows.some((row) => row.id === bug.id);
  writeLocalCache(KEYS.bugs, exists ? rows.map((row) => (row.id === bug.id ? bug : row)) : [bug, ...rows]);
}

export function getAppearance(): AppearanceSettings {
  return readLocalCache<AppearanceSettings>(KEYS.appearance, seedAppearance);
}

export function saveAppearance(settings: AppearanceSettings) {
  writeLocalCache(KEYS.appearance, settings);
}
