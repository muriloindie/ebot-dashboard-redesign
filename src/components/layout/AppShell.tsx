"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sidebarNavigation, type MenuItemId } from "@/data/sidebarNavigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useDemo } from "@/components/state/DemoProvider";

const PREFETCH_ROUTES = ["/", "/atendimentos", "/crm", "/contatos", "/agenda", "/tarefas", "/kanban", "/protocolos", "/campanhas", "/configuracoes"];

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
  const { company, companies, setCompany } = useDemo();
  const activeItem = getMenuItemId(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    PREFETCH_ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  function navigate(itemId: MenuItemId) {
    const item = getItemById(itemId);
    if (item?.enabled) router.push(item.path);
  }

  function prefetch(itemId: MenuItemId) {
    const item = getItemById(itemId);
    if (item?.enabled) router.prefetch(item.path);
  }

  return (
    <main className="ebot-canvas min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar
          activeItem={activeItem}
          onChange={navigate}
          onPrefetch={prefetch}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
          company={company}
          companies={companies}
          onCompanyChange={setCompany}
        />
        <section className="min-w-0 flex-1">
          <Topbar
            onNavigate={navigate}
            onMenuClick={() => setSidebarOpen(true)}
            company={company}
            companies={companies}
            onCompanyChange={setCompany}
          />
          <div className="mx-auto max-w-[1800px] px-3 py-4 sm:px-4 lg:px-5 lg:py-6 xl:px-6 xl:py-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
