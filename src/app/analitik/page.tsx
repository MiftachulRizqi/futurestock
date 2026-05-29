import {
  BarChart3,
  CircleDollarSign,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryEmptyState } from "@/components/states/inventory-empty-state";

import { SalesRevenueChart } from "@/components/analytics/sales-revenue-chart";
import { TopSellingProducts } from "@/components/analytics/top-selling-products";
import { AnalyticsInsight } from "@/components/analytics/analytics-insight";

import { getSales } from "@/services/sales-service";

import {
  getAiBusinessInsight,
  getDailySalesChartData,
  getInventoryTurnover,
  getMonthlyRevenue,
  getTopSellingProducts,
} from "@/lib/helpers/sales-analytics";

import { formatCurrency } from "@/lib/helpers/format";

export default async function AnalitikPage() {
  const sales = await getSales();

  const revenueChartData = getDailySalesChartData(sales);
  const monthlyRevenue = getMonthlyRevenue(sales);
  const topSellingProducts = getTopSellingProducts(sales);
  const inventoryTurnover = getInventoryTurnover(sales);

  const insight = getAiBusinessInsight({
    monthlyRevenue,
    totalTransactions: sales.length,
    topSellingName: topSellingProducts[0]?.name,
  });

  const hasSalesData = sales.length > 0;

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
            Dashboard analytics berbasis transaksi real dan data penjualan
            aktual.
          </p>
        </div>

        {!hasSalesData ? (
          <InventoryEmptyState
            title="Belum ada data analitik"
            description="Tambahkan transaksi penjualan terlebih dahulu agar FutureStock dapat menampilkan grafik revenue, produk terlaris, inventory turnover, dan insight bisnis."
            icon={<BarChart3 className="h-10 w-10" />}
            actionLabel="Tambah Transaksi"
            actionHref="/transaksi/tambah"
          />
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard
                title="Monthly Revenue"
                value={formatCurrency(monthlyRevenue)}
                description="Total revenue transaksi"
                icon={CircleDollarSign}
                tone="emerald"
              />

              <StatCard
                title="Total Transaksi"
                value={String(sales.length)}
                description="Jumlah transaksi tercatat"
                icon={ReceiptText}
                tone="cyan"
              />

              <StatCard
                title="Inventory Turnover"
                value={String(inventoryTurnover)}
                description="Total unit terjual"
                icon={ShoppingBag}
                tone="violet"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <SalesRevenueChart data={revenueChartData} />

              <TopSellingProducts products={topSellingProducts} />
            </section>

            <AnalyticsInsight insight={insight} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}