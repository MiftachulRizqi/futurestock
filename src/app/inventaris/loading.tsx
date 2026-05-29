import { Boxes, PackageCheck, TriangleAlert } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";

export default function InventarisLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="h-4 w-44 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-9 w-44 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-muted" />
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Stok" value="..." description="Memuat stok" icon={Boxes} tone="cyan" />
          <StatCard title="Produk Sehat" value="..." description="Memuat produk" icon={PackageCheck} tone="emerald" />
          <StatCard title="Stok Menipis" value="..." description="Memuat risiko" icon={TriangleAlert} tone="amber" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassPanel className="p-5">
            <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />
            <div className="mx-auto mt-8 h-44 w-44 animate-pulse rounded-full bg-muted" />
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="h-6 w-44 animate-pulse rounded-full bg-muted" />
            <div className="mt-5 space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          </GlassPanel>
        </section>

        <GlassPanel className="p-5">
          <div className="mb-5 h-12 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-2xl border border-border bg-muted/40" />
            ))}
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}