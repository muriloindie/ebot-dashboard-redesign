"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { sidebarNavigation, type MenuItemId } from "@/data/sidebarNavigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const clinics = ["Clínica São Lucas", "Clínica Santa Maria", "Centro Médico Norte"];

function getMenuItemId(pathname: string) {
  const items = sidebarNavigation.flatMap((group) => group.items.flatMap((item) => [item, ...(item.children ?? [])]));
  return items.find((item) => item.path === pathname)?.id ?? "dashboard";
}

function getItemById(itemId: string) {
  return sidebarNavigation.flatMap((group) => group.items.flatMap((item) => [item, ...(item.children ?? [])])).find((item) => item.id === itemId);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeItem = getMenuItemId(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clinic, setClinic] = useState(clinics[0]);

  function navigate(itemId: MenuItemId) {
    const item = getItemById(itemId);
    if (item?.enabled) router.push(item.path);
  }

  return (
    <main className="clinical-canvas min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar
          activeItem={activeItem}
          onChange={navigate}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
          clinic={clinic}
          clinics={clinics}
          onClinicChange={setClinic}
        />
        <section className="min-w-0 flex-1">
          <Topbar
            onNavigate={navigate}
            onMenuClick={() => setSidebarOpen(true)}
            clinic={clinic}
            clinics={clinics}
            onClinicChange={setClinic}
          />
          <div className="mx-auto max-w-[1800px] px-3 py-4 sm:px-4 lg:px-5 lg:py-6 xl:px-6 xl:py-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
