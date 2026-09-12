"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastTone = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

export type NotificationItem = {
  id: number;
  category: "atendimento" | "agenda" | "sistema" | "alerta" | "tarefa";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

type Profile = {
  name: string;
  email: string;
  role: string;
  company: string;
  unit: string;
  status: "Ativo" | "Ausente";
};

type DemoContextValue = {
  companies: string[];
  company: string;
  setCompany: (company: string) => void;
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
  toast: (message: string, tone?: ToastTone) => void;
  notifications: NotificationItem[];
  unreadNotifications: number;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
};

const companies = ["Mecânica São Lucas", "Auto Center Vale", "Distribuidora Norte"];

const initialNotifications: NotificationItem[] = [
  { id: 1, category: "atendimento", title: "Orçamento aprovado", description: "Ana Paula aprovou o orçamento #4821.", time: "há 2 min", read: false },
  { id: 2, category: "atendimento", title: "IA transferiu conversa", description: "Marcos Silva solicitou atendimento humano.", time: "há 6 min", read: false },
  { id: 3, category: "agenda", title: "Lead qualificado pela IA", description: "Novo lead quente entrou no funil comercial.", time: "há 12 min", read: false },
  { id: 4, category: "tarefa", title: "Tarefa próxima do prazo", description: "Follow-up da Beatriz vence hoje.", time: "há 18 min", read: true },
  { id: 5, category: "sistema", title: "Novo número conectado", description: "WhatsApp Vendas voltou a sincronizar.", time: "há 26 min", read: true }
];

const initialProfile: Profile = {
  name: "Ruan Viana",
  email: "ruan@ebot.com.br",
  role: "Gestor de operações",
  company: companies[0],
  unit: "Matriz",
  status: "Ativo"
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState(companies[0]);
  const [profile, setProfile] = useState(initialProfile);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3400);
  }, []);

  const value = useMemo<DemoContextValue>(() => ({
    companies,
    company,
    setCompany: (nextCompany) => {
      setCompany(nextCompany);
      setProfile((current) => ({ ...current, company: nextCompany }));
    },
    profile,
    updateProfile: (nextProfile) => setProfile((current) => ({ ...current, ...nextProfile })),
    toast,
    notifications,
    unreadNotifications: notifications.filter((item) => !item.read).length,
    markNotificationRead: (id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item)),
    markAllNotificationsRead: () => setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }), [company, notifications, profile, toast]);

  return (
    <DemoContext.Provider value={value}>
      {children}
      <div role="region" className="pointer-events-none fixed bottom-4 right-4 z-[140] flex w-[min(390px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-label="Avisos do sistema">
        {toasts.map((item) => (
          <div key={item.id} role={item.tone === "error" ? "alert" : "status"} className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm font-bold shadow-ebot ${item.tone === "success" ? "border-ebot-green/25 bg-ebot-surface text-ebot-green" : item.tone === "error" ? "border-red-500/25 bg-ebot-surface text-red-500" : item.tone === "warning" ? "border-ebot-orange/25 bg-ebot-surface text-ebot-orange" : "border-ebot-primary/25 bg-ebot-surface text-ebot-primaryText"}`}>
            {item.message}
          </div>
        ))}
      </div>
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used within DemoProvider");
  return value;
}
