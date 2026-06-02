import {
  Boxes,
  PackageCheck,
  PackagePlus,
  TriangleAlert,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryHealth } from "@/components/dashboard/inventory-health";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryEmptyState } from "@/components/states/inventory-empty-state";

import {
  getProducts,
  getPaginatedProducts,
} from "@/services/product-service";

import { getDashboardMetrics } from "@/lib/helpers/dashboard-metrics";

type InventarisPageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function InventarisPage({
  searchParams,
}: InventarisPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number(params?.page ?? "1")
  );

  const search = params?.search ?? "";

  const pageSize = 5;

  const [allProducts, paginatedResult] =
    await Promise.all([
      getProducts(),
      getPaginatedProducts(
        currentPage,
        pageSize,
        search
      ),
    ]);

  const metrics =
    getDashboardMetrics(allProducts);

  const hasProducts =
    allProducts.length > 0;

  const {
    products: paginatedProducts,
    total,
  } = paginatedResult;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

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
            icon={
              <PackagePlus className="h-10 w-10" />
            }
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
                value={String(
                  metrics.healthyProducts.length
                )}
                description="Stok di atas minimum"
                icon={PackageCheck}
                tone="emerald"
              />

              <StatCard
                title="Stok Menipis"
                value={String(
                  metrics.lowStockProducts.length
                )}
                description="Butuh restock"
                icon={TriangleAlert}
                tone="amber"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <InventoryHealth
                value={metrics.inventoryHealth}
                totalProducts={
                  metrics.totalProducts
                }
                lowStockCount={
                  metrics.lowStockProducts.length
                }
                inactiveCount={
                  metrics.inactiveProducts.length
                }
              />

              <LowStockAlert
                products={allProducts}
              />
            </section>

            <InventoryTable
              products={paginatedProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={total}
              search={search ?? ""}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}