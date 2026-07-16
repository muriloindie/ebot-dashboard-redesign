"use client";

import { useState } from "react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import type { MenuItemId } from "@/data/sidebarNavigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const clinics = ["Clínica São Lucas", "Clínica Santa Maria", "Centro Médico Norte"];

export function AppShell() {
  const [activeItem, setActiveItem] = useState<MenuItemId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clinic, setClinic] = useState(clinics[0]);

  return (
    <ThemeProvider>
      <main className="clinical-canvas min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar
            activeItem={activeItem}
            onChange={setActiveItem}
            mobileOpen={sidebarOpen}
            onMobileClose={() => setSidebarOpen(false)}
            clinic={clinic}
            clinics={clinics}
            onClinicChange={setClinic}
          />
          <section className="min-w-0 flex-1">
            <Topbar
              onNavigate={setActiveItem}
              onMenuClick={() => setSidebarOpen(true)}
              clinic={clinic}
              clinics={clinics}
              onClinicChange={setClinic}
            />
            <div className="mx-auto max-w-[1800px] px-3 py-4 sm:px-4 lg:px-5 lg:py-6 xl:px-6 xl:py-7">
              {activeItem === "dashboard" ? <DashboardPage /> : <EmptyState />}
            </div>
          </section>
        </div>
      </main>
    </ThemeProvider>
  );
}
