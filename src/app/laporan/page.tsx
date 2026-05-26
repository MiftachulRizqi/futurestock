import { Download, FileText, Package, TriangleAlert } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryValueChart } from "@/components/dashboard/inventory-value-chart";
import { getProducts } from "@/services/product-service";
import { getDashboardMetrics } from "@/lib/helpers/dashboard-metrics";
import { getInventoryValueChartData } from "@/lib/helpers/chart-data";
import { formatCurrency } from "@/lib/helpers/format";

export default async function LaporanPage() {
  const products = await getProducts();
  const metrics = getDashboardMetrics(products);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Reports Center
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">Laporan</h1>
              <p className="mt-2 text-sm text-slate-400">
                Ringkasan inventaris, nilai stok, dan produk prioritas dari
                database FutureStock.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-400 px-4 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Laporan
            </button>
          </div>
        </GlassPanel>

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

        <InventoryValueChart data={getInventoryValueChartData(products)} />

        <GlassPanel className="p-5">
          <h2 className="text-xl font-bold text-white">Ringkasan Laporan</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ReportItem
              label="Kondisi inventaris"
              value={`${metrics.inventoryHealth}% sehat`}
            />
            <ReportItem
              label="Total stok tersedia"
              value={`${metrics.totalStock} unit`}
            />
            <ReportItem
              label="Produk nonaktif"
              value={`${metrics.inactiveProducts.length} produk`}
            />
            <ReportItem
              label="Produk perlu restock"
              value={`${metrics.lowStockProducts.length} produk`}
            />
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}

function ReportItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}