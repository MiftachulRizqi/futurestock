import { Settings } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";

export default function PengaturanLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Settings className="h-7 w-7" />
            </div>

            <div>
              <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
              <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="h-6 w-52 animate-pulse rounded-full bg-muted" />

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            ))}
          </div>

          <div className="mt-6 h-11 w-36 animate-pulse rounded-xl bg-muted" />
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}