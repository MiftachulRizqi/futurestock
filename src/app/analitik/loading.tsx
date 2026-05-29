import { CircleDollarSign, ReceiptText, ShoppingBag } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { GlassPanel } from "@/components/shared/glass-panel";
import { PremiumChartSkeleton } from "@/components/skeletons/premium-chart-skeleton";

export default function AnalitikLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Real Sales Analytics
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Analitik Penjualan
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Menyiapkan analytics penjualan.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Monthly Revenue"
            value="..."
            description="Memuat revenue"
            icon={CircleDollarSign}
            tone="emerald"
          />
          <StatCard
            title="Total Transaksi"
            value="..."
            description="Memuat transaksi"
            icon={ReceiptText}
            tone="cyan"
          />
          <StatCard
            title="Inventory Turnover"
            value="..."
            description="Memuat unit terjual"
            icon={ShoppingBag}
            tone="violet"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <PremiumChartSkeleton
            title="Memuat revenue"
            description="Menyiapkan grafik penjualan 7 hari."
          />

          <GlassPanel className="p-5">
            <div className="mb-5 h-6 w-48 animate-pulse rounded-full bg-muted" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl border border-border bg-muted/40"
                />
              ))}
            </div>
          </GlassPanel>
        </section>

        <GlassPanel className="p-5">
          <div className="h-6 w-56 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-muted" />
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}