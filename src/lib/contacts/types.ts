import type { ContactChannel, ContactStage } from "@/data/contactsMock";
import type { ClientHistoryItem, ClientNextEvent, ClientStatus } from "@/data/clientsMock";

export type UnifiedContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf?: string;
  birthDate?: string;
  gender?: "Feminino" | "Masculino";
  channel: ContactChannel;
  stage: ContactStage;
  clientStatus?: ClientStatus;
  isClient: boolean;
  lastActivity: string;
  tags: string[];
  photo?: string;
  origin?: string;
  responsible?: string;
  agent?: string;
  unit?: string;
  lastAppointment?: string;
  nextAppointment?: string;
  notes?: string;
  history: ClientHistoryItem[];
  nextEvents: ClientNextEvent[];
  legacyIds?: string[];
};
