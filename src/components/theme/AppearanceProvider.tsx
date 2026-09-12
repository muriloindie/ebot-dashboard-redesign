"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedAppearance, type AppearanceSettings } from "@/data/systemMock";
import { getAppearance, saveAppearance } from "@/lib/system/systemService";

const ACCENT_IDS: Record<AppearanceSettings["accent"], string> = {
  "Verde Ê-Bot": "verde-ebot",
  "Verde profundo": "verde-profundo",
  "Grafite": "grafite",
  "Névoa": "nevoa"
};

function applyAppearance(settings: AppearanceSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.sidebar = settings.sidebarStyle === "escuro" ? "escuro" : "claro";
  root.dataset.accent = ACCENT_IDS[settings.accent] ?? "verde-ebot";
  root.dataset.density = settings.density === "Compacta" ? "compacta" : "confortavel";
  root.dataset.corners = settings.roundedCorners ? "rounded" : "square";
  root.dataset.motion = settings.animations ? "on" : "off";
  root.dataset.badges = settings.showBadges ? "on" : "off";
}

type AppearanceContextValue = {
  appearance: AppearanceSettings;
  updateAppearance: (patch: Partial<AppearanceSettings>) => void;
  persistAppearance: () => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => (typeof window === "undefined" ? seedAppearance : getAppearance()));

  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);

  const updateAppearance = useCallback((patch: Partial<AppearanceSettings>) => {
    setAppearance((current) => {
      const next = { ...current, ...patch };
      applyAppearance(next);
      return next;
    });
  }, []);

  const persistAppearance = useCallback(() => {
    saveAppearance(appearance);
  }, [appearance]);

  const value = useMemo<AppearanceContextValue>(
    () => ({ appearance, updateAppearance, persistAppearance }),
    [appearance, updateAppearance, persistAppearance]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const value = useContext(AppearanceContext);
  if (!value) throw new Error("useAppearance must be used within AppearanceProvider");
  return value;
}
