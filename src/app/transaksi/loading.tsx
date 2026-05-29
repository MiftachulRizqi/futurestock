import { ReceiptText, ShoppingCart, TrendingUp } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";

export default function TransaksiLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="h-6 w-52 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-9 w-44 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Transaksi" value="..." description="Memuat data" icon={ReceiptText} tone="cyan" />
          <StatCard title="Total Revenue" value="..." description="Memuat data" icon={TrendingUp} tone="emerald" />
          <StatCard title="Produk Terjual" value="..." description="Memuat data" icon={ShoppingCart} tone="violet" />
        </section>

        <GlassPanel className="p-5">
          <div className="mb-5 h-12 w-full animate-pulse rounded-2xl bg-muted" />

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="grid gap-4 rounded-2xl border border-border bg-card/40 p-5 md:grid-cols-[1fr_1fr_0.6fr_0.8fr_0.8fr]"
              >
                <div className="h-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}