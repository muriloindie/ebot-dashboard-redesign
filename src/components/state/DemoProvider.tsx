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
  clinic: string;
  unit: string;
  status: "Ativo" | "Ausente";
};

type DemoContextValue = {
  clinics: string[];
  clinic: string;
  setClinic: (clinic: string) => void;
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
  toast: (message: string, tone?: ToastTone) => void;
  notifications: NotificationItem[];
  unreadNotifications: number;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
};

const clinics = ["Clínica São Lucas", "Clínica Santa Maria", "Centro Médico Norte"];

const initialNotifications: NotificationItem[] = [
  { id: 1, category: "atendimento", title: "Consulta confirmada", description: "Ana Paula confirmou o horário das 09:00.", time: "há 2 min", read: false },
  { id: 2, category: "atendimento", title: "IA transferiu conversa", description: "Marcos Silva solicitou atendimento humano.", time: "há 6 min", read: false },
  { id: 3, category: "agenda", title: "Encaixe liberado", description: "O horário das 11:15 está disponível para a fila de espera.", time: "há 12 min", read: false },
  { id: 4, category: "tarefa", title: "Tarefa próxima do prazo", description: "Priorizar encaixe da Beatriz vence hoje.", time: "há 18 min", read: true },
  { id: 5, category: "sistema", title: "Novo número conectado", description: "WhatsApp Agendamentos voltou a sincronizar.", time: "há 26 min", read: true }
];

const initialProfile: Profile = {
  name: "Dr. Ruan",
  email: "ruan@ebotclinical.com.br",
  role: "Diretor Clínico",
  clinic: clinics[0],
  unit: "Unidade Centro",
  status: "Ativo"
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [clinic, setClinic] = useState(clinics[0]);
  const [profile, setProfile] = useState(initialProfile);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3400);
  }, []);

  const value = useMemo<DemoContextValue>(() => ({
    clinics,
    clinic,
    setClinic: (nextClinic) => {
      setClinic(nextClinic);
      setProfile((current) => ({ ...current, clinic: nextClinic }));
    },
    profile,
    updateProfile: (nextProfile) => setProfile((current) => ({ ...current, ...nextProfile })),
    toast,
    notifications,
    unreadNotifications: notifications.filter((item) => !item.read).length,
    markNotificationRead: (id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item)),
    markAllNotificationsRead: () => setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }), [clinic, notifications, profile, toast]);

  return (
    <DemoContext.Provider value={value}>
      {children}
      <div role="region" className="pointer-events-none fixed bottom-4 right-4 z-[140] flex w-[min(390px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-label="Avisos do sistema">
        {toasts.map((item) => (
          <div key={item.id} role={item.tone === "error" ? "alert" : "status"} className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm font-bold shadow-clinical ${item.tone === "success" ? "border-clinical-green/25 bg-clinical-surface text-clinical-green" : item.tone === "error" ? "border-red-500/25 bg-clinical-surface text-red-500" : item.tone === "warning" ? "border-clinical-orange/25 bg-clinical-surface text-clinical-orange" : "border-clinical-blue/25 bg-clinical-surface text-clinical-blueText"}`}>
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
