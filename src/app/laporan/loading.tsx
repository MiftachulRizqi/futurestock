import { FileText, Package, TriangleAlert } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { PremiumChartSkeleton } from "@/components/skeletons/premium-chart-skeleton";

export default function LaporanLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-8 w-52 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-muted" />
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Produk"
            value="..."
            description="Memuat produk"
            icon={Package}
            tone="cyan"
          />
          <StatCard
            title="Nilai Inventaris"
            value="..."
            description="Memuat nilai stok"
            icon={FileText}
            tone="emerald"
          />
          <StatCard
            title="Stok Menipis"
            value="..."
            description="Memuat stok"
            icon={TriangleAlert}
            tone="amber"
          />
        </section>

        <PremiumChartSkeleton
          title="Memuat laporan inventaris"
          description="Menyiapkan grafik nilai inventaris."
        />

        <GlassPanel className="p-5">
          <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-muted" />
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}