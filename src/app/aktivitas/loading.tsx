import { Clock3 } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";

export default function AktivitasLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Clock3 className="h-7 w-7" />
            </div>

            <div className="flex-1">
              <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
              <div className="mt-4 h-8 w-64 animate-pulse rounded-full bg-muted" />
              <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-border bg-card/40 p-4"
              >
                <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />

                <div className="flex-1">
                  <div className="h-4 w-52 animate-pulse rounded-full bg-muted" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-muted" />
                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}