import { AlertTriangle, PackageX, Skull } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";

export default function DeadStockLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="h-4 w-52 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-9 w-44 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Produk Berisiko" value="..." description="Memuat data" icon={PackageX} tone="amber" />
          <StatCard title="Nilai Terkunci" value="..." description="Memuat data" icon={AlertTriangle} tone="violet" />
          <StatCard title="Total Produk" value="..." description="Memuat data" icon={Skull} tone="cyan" />
        </section>

        <GlassPanel className="p-5">
          <div className="h-6 w-56 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-muted" />

          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 p-4"
              >
                <div className="h-16 w-16 animate-pulse rounded-2xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-44 animate-pulse rounded-full bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="hidden h-8 w-28 animate-pulse rounded-full bg-muted md:block" />
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}