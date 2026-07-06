"use client";

import { useState } from "react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sidebar, type MenuItemId } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const [activeItem, setActiveItem] = useState<MenuItemId>("dashboard");

  return (
    <main className="clinical-canvas clinical-grid min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar activeItem={activeItem} onChange={setActiveItem} />
        <section className="min-w-0 flex-1 pb-24 md:pb-0">
          <Topbar />
          <div className="mx-auto max-w-[1740px] px-4 py-5 lg:px-6 lg:py-7">
            {activeItem === "dashboard" ? <DashboardPage /> : <EmptyState />}
          </div>
        </section>
      </div>
    </main>
  );
}
