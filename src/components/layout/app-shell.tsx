import { useEffect, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CommandPalette } from "./command-palette";
import { DetailDrawer } from "@/components/ops/detail-drawer";
import { useOpsStore } from "@/store/ops-store";

export function AppShell({ children }: { children: ReactNode }) {
  const step = useOpsStore((s) => s.step);

  useEffect(() => {
    const id = window.setInterval(() => step(), 2500);
    return () => window.clearInterval(id);
  }, [step]);

  return (
    <div className="flex min-h-dvh bg-bg text-fg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="relative flex-1 overflow-auto">
          <div className="grid-fade pointer-events-none absolute inset-x-0 top-0 h-40" />
          <div className="relative mx-auto w-full max-w-[1280px] p-4 md:p-6">{children}</div>
        </main>
      </div>
      <CommandPalette />
      <DetailDrawer />
    </div>
  );
}
