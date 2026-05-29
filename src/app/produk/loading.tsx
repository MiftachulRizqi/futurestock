import { Package, Plus } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";

export default function ProdukLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="h-6 w-44 animate-pulse rounded-full bg-muted" />
              <div className="mt-4 h-9 w-40 animate-pulse rounded-full bg-muted" />
              <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
            </div>

            <div className="flex h-10 w-36 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Produk" value="..." description="Memuat data" icon={Package} tone="cyan" />
          <StatCard title="Produk Aktif" value="..." description="Memuat data" icon={Package} tone="emerald" />
          <StatCard title="Stok Rendah" value="..." description="Memuat data" icon={Package} tone="amber" />
        </section>

        <TableSkeleton />
      </div>
    </DashboardLayout>
  );
}

function TableSkeleton() {
  return (
    <GlassPanel className="p-5">
      <div className="mb-5 h-12 w-full animate-pulse rounded-2xl bg-muted" />

      <div className="overflow-hidden rounded-3xl border border-border">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="grid gap-4 border-b border-border p-5 last:border-b-0 md:grid-cols-[1.3fr_0.7fr_0.8fr_0.7fr_0.7fr]"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
              </div>
            </div>

            <div className="h-4 animate-pulse rounded-full bg-muted" />
            <div className="h-4 animate-pulse rounded-full bg-muted" />
            <div className="h-4 animate-pulse rounded-full bg-muted" />
            <div className="h-4 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}