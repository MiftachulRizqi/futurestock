import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Package,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryValueChart } from "@/components/dashboard/inventory-value-chart";
import { CategoryStockChart } from "@/components/dashboard/category-stock-chart";
import { AiForecastPanel } from "@/components/dashboard/ai-forecast-panel";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { InventoryHealth } from "@/components/dashboard/inventory-health";
import { RecentProducts } from "@/components/dashboard/recent-products";
import { getProducts } from "@/services/product-service";
import { getDashboardMetrics } from "@/lib/helpers/dashboard-metrics";
import {
  getCategoryStockChartData,
  getInventoryValueChartData,
} from "@/lib/helpers/chart-data";
import { formatCurrency } from "@/lib/helpers/format";

export default async function DashboardPage() {
  const products = await getProducts();

  const metrics = getDashboardMetrics(products);
  const categoryStockData = getCategoryStockChartData(products);
  const inventoryValueData = getInventoryValueChartData(products);

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
            delay={0.05}
          />

          <StatCard
            title="Total Stok"
            value={String(metrics.totalStock)}
            description="Akumulasi semua unit"
            icon={Boxes}
            tone="violet"
            delay={0.1}
          />

          <StatCard
            title="Nilai Inventaris"
            value={formatCurrency(metrics.inventoryValue)}
            description="Estimasi nilai stok saat ini"
            icon={CircleDollarSign}
            tone="emerald"
            delay={0.15}
          />

          <StatCard
            title="Stok Menipis"
            value={String(metrics.lowStockProducts.length)}
            description="Produk di bawah minimum stok"
            icon={AlertTriangle}
            tone="amber"
            delay={0.2}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <InventoryValueChart data={inventoryValueData} />
          <CategoryStockChart data={categoryStockData} />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <AiForecastPanel products={products} />
          <LowStockAlert products={products} />
          <InventoryHealth
            value={metrics.inventoryHealth}
            totalProducts={metrics.totalProducts}
            lowStockCount={metrics.lowStockProducts.length}
            inactiveCount={metrics.inactiveProducts.length}
          />
        </section>

        <RecentProducts products={products} />
      </div>
    </DashboardLayout>
  );
}