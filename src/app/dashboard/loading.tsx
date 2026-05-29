import {
  AlertOctagon,
  AlertTriangle,
  Package,
  TrendingUp,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { PremiumChartSkeleton } from "@/components/skeletons/premium-chart-skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="relative overflow-hidden p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.7fr]">
            <div>
              <div className="h-9 w-72 animate-pulse rounded-full bg-muted" />
              <div className="mt-6 h-12 w-full max-w-3xl animate-pulse rounded-2xl bg-muted" />
              <div className="mt-4 h-12 w-4/5 animate-pulse rounded-2xl bg-muted" />
              <div className="mt-6 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
              <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="rounded-3xl border border-border bg-card/60 p-5">
              <div className="h-16 w-16 animate-pulse rounded-3xl bg-muted" />
              <div className="mt-5 h-6 w-48 animate-pulse rounded-full bg-muted" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-muted" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Produk"
            value="..."
            description="Memuat data"
            icon={Package}
            tone="cyan"
          />

          <StatCard
            title="Produk Hampir Habis"
            value="..."
            description="Memuat data"
            icon={AlertTriangle}
            tone="amber"
          />

          <StatCard
            title="Produk Habis"
            value="..."
            description="Memuat data"
            icon={AlertOctagon}
            tone="violet"
          />

          <StatCard
            title="Prediksi Periode Depan"
            value="..."
            description="Memuat data"
            icon={TrendingUp}
            tone="emerald"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <PremiumChartSkeleton
            title="Actual vs Prediction"
            description="Menyiapkan data forecast."
          />

          <GlassPanel className="p-5">
            <div className="h-6 w-44 animate-pulse rounded-full bg-muted" />

            <div className="mt-5 space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl border border-border bg-muted/40"
                />
              ))}
            </div>
          </GlassPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <PremiumChartSkeleton
            title="Inventory Value"
            description="Menghitung nilai inventaris."
          />

          <GlassPanel className="p-5">
            <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />

            <div className="mt-6 flex justify-center">
              <div className="h-64 w-64 animate-pulse rounded-full bg-muted" />
            </div>
          </GlassPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <GlassPanel className="p-5">
            <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />

            <div className="mt-5 space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card/40 p-4"
                >
                  <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-muted" />
                  <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-8 w-64 animate-pulse rounded-full bg-muted" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-muted" />

            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card/40 p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />

                    <div className="flex-1">
                      <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
                      <div className="mt-2 h-4 w-full animate-pulse rounded-full bg-muted" />
                      <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="h-6 w-44 animate-pulse rounded-full bg-muted" />

            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl bg-muted/40"
                />
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="h-6 w-44 animate-pulse rounded-full bg-muted" />

            <div className="mt-8 flex justify-center">
              <div className="h-40 w-40 animate-pulse rounded-full bg-muted" />
            </div>
          </GlassPanel>

          <GlassPanel className="p-5 xl:col-span-2">
            <div className="h-6 w-52 animate-pulse rounded-full bg-muted" />

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl bg-muted/40"
                />
              ))}
            </div>
          </GlassPanel>
        </section>

        <GlassPanel className="p-5">
          <div className="h-4 w-44 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-7 w-56 animate-pulse rounded-full bg-muted" />

          <div className="mt-5 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-border bg-card/40 p-4"
              >
                <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />

                <div className="flex-1">
                  <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
                  <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-muted" />
                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />

          <div className="mt-5 space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 p-4"
              >
                <div className="h-14 w-14 animate-pulse rounded-2xl bg-muted" />

                <div className="flex-1">
                  <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
                  <div className="mt-2 h-3 w-32 animate-pulse rounded-full bg-muted" />
                </div>

                <div className="hidden h-8 w-24 animate-pulse rounded-full bg-muted sm:block" />
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}