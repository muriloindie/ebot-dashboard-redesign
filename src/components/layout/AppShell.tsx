"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";
import { sidebarNavigation, type MenuItemId } from "@/data/sidebarNavigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useDemo } from "@/components/state/DemoProvider";

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
  const { clinic, clinics, setClinic } = useDemo();
  const activeItem = getMenuItemId(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const curtainRef = useRef<HTMLDivElement>(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const curtain = curtainRef.current;
    if (!curtain || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(curtain, { yPercent: -100 }, {
      yPercent: 0,
      duration: 0.22,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(curtain, { yPercent: -100, duration: 0.34, ease: "power3.inOut", delay: 0.08 });
      }
    });
  }, [pathname]);

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
      <div ref={curtainRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110] -translate-y-full bg-clinical-charcoal">
        <div className="flex h-full items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-clinical-blue/15">
            <Sparkles className="size-7 text-clinical-blue" />
          </span>
        </div>
      </div>
    </main>
  );
}
