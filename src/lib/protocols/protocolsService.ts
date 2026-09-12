"use client";

import { protocols as seedProtocols } from "@/data/protocolsMock";
import type { ProtocolRecord } from "@/data/protocolsMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";

const CACHE_KEY = "ebot-protocols";

export type { ProtocolRecord };
export type { ProtocolMessage } from "@/data/protocolsMock";

export function listProtocols(): ProtocolRecord[] {
  return readLocalCache<ProtocolRecord[]>(CACHE_KEY, seedProtocols);
}

export function getProtocol(id: string): ProtocolRecord | null {
  return listProtocols().find((protocol) => protocol.id === id) ?? null;
}

export function saveProtocol(protocol: ProtocolRecord) {
  const rows = listProtocols();
  const exists = rows.some((row) => row.id === protocol.id);
  const next = exists ? rows.map((row) => (row.id === protocol.id ? protocol : row)) : [protocol, ...rows];
  writeLocalCache(CACHE_KEY, next);
  return protocol;
}

export function deleteProtocol(id: string) {
  writeLocalCache(CACHE_KEY, listProtocols().filter((row) => row.id !== id));
}
