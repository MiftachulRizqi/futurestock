import {
  AlertOctagon,
  AlertTriangle,
  Package,
  TrendingUp,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { StatCard } from "@/components/dashboard/stat-card";

import { ActualVsPredictionChart } from "@/components/dashboard/actual-vs-prediction-chart";
import { StockNotifications } from "@/components/dashboard/stock-notifications";
import { InventoryValueChart } from "@/components/dashboard/inventory-value-chart";
import { CategoryStockChart } from "@/components/dashboard/category-stock-chart";
import { AiForecastPanel } from "@/components/dashboard/ai-forecast-panel";
import { BusinessSummary } from "@/components/dashboard/business-summary";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { InventoryHealth } from "@/components/dashboard/inventory-health";
import { RecentProducts } from "@/components/dashboard/recent-products";
import { EcoImpactIndicator } from "@/components/dashboard/eco-impact-indicator";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

import { getProducts } from "@/services/product-service";
import { getSales } from "@/services/sales-service";
import { getRecentActivityLogs } from "@/services/activity-log-service";

import { getDashboardMetrics } from "@/lib/helpers/dashboard-metrics";
import { getAutomaticStockNotifications } from "@/lib/helpers/stock-notifications";

import {
  getCategoryStockChartData,
  getInventoryValueChartData,
} from "@/lib/helpers/chart-data";

import {
  getActualVsPredictionChartData,
  getLatestPredictionTotal,
} from "@/lib/helpers/forecast-chart-data";

export default async function DashboardPage() {
  const products = await getProducts();
  const sales = await getSales();
  const recentActivities = await getRecentActivityLogs(5);

  const metrics = getDashboardMetrics(products);
  const categoryStockData = getCategoryStockChartData(products);
  const inventoryValueData = getInventoryValueChartData(products);
  const forecastChartData = getActualVsPredictionChartData(products, sales);
  const stockNotifications = getAutomaticStockNotifications(products, sales);

  const almostEmptyProducts = products.filter((product) => {
    return Number(product.stock) > 0 && Number(product.stock) <= 5;
  });

  const emptyProducts = products.filter((product) => {
    return Number(product.stock) <= 0;
  });

  const weeklyPrediction = getLatestPredictionTotal(forecastChartData.weekly);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHero />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Produk"
            value={String(metrics.totalProducts)}
            description="Produk aktif dan nonaktif"
            icon={Package}
            tone="cyan"
          />

          <StatCard
            title="Produk Hampir Habis"
            value={String(almostEmptyProducts.length)}
            description="Stok berada di angka 1 sampai 5"
            icon={AlertTriangle}
            tone="amber"
          />

          <StatCard
            title="Produk Habis"
            value={String(emptyProducts.length)}
            description="Stok sudah 0 atau kurang"
            icon={AlertOctagon}
            tone="violet"
          />

          <StatCard
            title="Prediksi Periode Depan"
            value={formatCompactNumber(weeklyPrediction)}
            description="Estimasi unit terjual berikutnya"
            icon={TrendingUp}
            tone="emerald"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <ActualVsPredictionChart data={forecastChartData} />

          <StockNotifications notifications={stockNotifications} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <InventoryValueChart data={inventoryValueData} />

          <CategoryStockChart data={categoryStockData} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <AiForecastPanel products={products} />

          <BusinessSummary
            inventoryHealth={metrics.inventoryHealth}
            inventoryValue={metrics.inventoryValue}
            totalProducts={metrics.totalProducts}
            healthyProducts={metrics.healthyProducts.length}
            lowStockProducts={metrics.lowStockProducts.length}
          />

          <LowStockAlert products={products} />

          <InventoryHealth
            value={metrics.inventoryHealth}
            totalProducts={metrics.totalProducts}
            lowStockCount={metrics.lowStockProducts.length}
            inactiveCount={metrics.inactiveProducts.length}
          />

          <EcoImpactIndicator
            totalProducts={metrics.totalProducts}
            lowStockCount={metrics.lowStockProducts.length}
          />
        </section>

        <ActivityTimeline activities={recentActivities} />

        <RecentProducts products={products} />
      </div>
    </DashboardLayout>
  );
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}