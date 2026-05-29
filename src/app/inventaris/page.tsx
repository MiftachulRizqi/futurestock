import { Boxes, PackageCheck, PackagePlus, TriangleAlert } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryHealth } from "@/components/dashboard/inventory-health";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { ProductTable } from "@/components/products/product-table";
import { InventoryEmptyState } from "@/components/states/inventory-empty-state";

import { getProducts } from "@/services/product-service";
import { getDashboardMetrics } from "@/lib/helpers/dashboard-metrics";

export default async function InventarisPage() {
  const products = await getProducts();
  const metrics = getDashboardMetrics(products);

  const hasProducts = products.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Inventory Control
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Inventaris
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Pantau stok, status produk, dan kesehatan inventaris toko.
          </p>
        </div>

        {!hasProducts ? (
          <InventoryEmptyState
            title="Belum ada produk di inventaris"
            description="Tambahkan produk pertama agar FutureStock dapat memantau stok, status produk, kesehatan inventaris, dan memberi insight bisnis."
            icon={<PackagePlus className="h-10 w-10" />}
            actionLabel="Tambah Produk"
            actionHref="/produk/tambah"
          />
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard
                title="Total Stok"
                value={String(metrics.totalStock)}
                description="Semua unit tersedia"
                icon={Boxes}
                tone="cyan"
              />

              <StatCard
                title="Produk Sehat"
                value={String(metrics.healthyProducts.length)}
                description="Stok di atas minimum"
                icon={PackageCheck}
                tone="emerald"
              />

              <StatCard
                title="Stok Menipis"
                value={String(metrics.lowStockProducts.length)}
                description="Butuh restock"
                icon={TriangleAlert}
                tone="amber"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <InventoryHealth
                value={metrics.inventoryHealth}
                totalProducts={metrics.totalProducts}
                lowStockCount={metrics.lowStockProducts.length}
                inactiveCount={metrics.inactiveProducts.length}
              />

              <LowStockAlert products={products} />
            </section>

            <ProductTable products={products} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}