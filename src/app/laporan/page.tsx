import {
  FileText,
  Package,
  TriangleAlert,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryValueChart } from "@/components/dashboard/inventory-value-chart";

import { getProducts } from "@/services/product-service";
import { getDashboardMetrics } from "@/lib/helpers/dashboard-metrics";
import { getInventoryValueChartData } from "@/lib/helpers/chart-data";
import { formatCurrency } from "@/lib/helpers/format";
import { ExportButtons } from "./commponents/export-buttons";

export default async function LaporanPage() {
  const products = await getProducts();
  const metrics = getDashboardMetrics(products);

  return (
    <DashboardLayout products={products}>
      <div className="space-y-6">

        {/* HEADER */}
        <GlassPanel className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
                Reports Center
              </p>

              <h1 className="mt-2 text-3xl font-bold text-foreground">
                Laporan
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Ringkasan inventaris FutureStock
              </p>
            </div>

            {/* CLIENT COMPONENT */}
            <ExportButtons
              products={products}
              metrics={metrics}
            />
          </div>
        </GlassPanel>

        {/* STATS */}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Produk"
            value={String(metrics.totalProducts)}
            description="Jumlah produk tercatat"
            icon={Package}
            tone="cyan"
          />

          <StatCard
            title="Nilai Inventaris"
            value={formatCurrency(metrics.inventoryValue)}
            description="Estimasi nilai stok"
            icon={FileText}
            tone="emerald"
          />

          <StatCard
            title="Stok Menipis"
            value={String(metrics.lowStockProducts.length)}
            description="Produk perlu restock"
            icon={TriangleAlert}
            tone="amber"
          />
        </section>

        {/* CHART */}
        <InventoryValueChart
          data={getInventoryValueChartData(products)}
        />

        {/* SUMMARY */}
        <GlassPanel className="p-5">
          <h2 className="text-xl font-bold text-foreground">
            Ringkasan Laporan
          </h2>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}