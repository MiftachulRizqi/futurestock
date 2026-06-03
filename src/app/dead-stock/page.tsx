// src/app/dead-stock/page.tsx
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryEmptyState } from "@/components/states/inventory-empty-state";
import { PackageCheck, PackagePlus, AlertTriangle, PackageX, Skull } from "lucide-react";

import { getProducts } from "@/services/product-service";
import { formatCurrency } from "@/lib/helpers/format";
import DeadStockTable from "./dead-stock-table"; // Client Component

export default async function DeadStockPage() {
  const products = await getProducts();

  const deadStockProducts = products.filter(p => p.stock > 0 && p.stock >= 100);

  const deadStockValue = deadStockProducts.reduce(
    (total, p) => total + Number(p.price) * Number(p.stock),
    0
  );

  const hasProducts = products.length > 0;
  const hasDeadStock = deadStockProducts.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <GlassPanel className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-destructive">
                Dead Stock Intelligence
              </p>
              <h1 className="mt-2 text-3xl font-bold text-foreground">Dead Stock</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Produk aktif yang perlu dipromosikan, dikurangi pembeliannya, atau berisiko stok berlebih.
              </p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
              <Skull className="h-10 w-10" />
            </div>
          </div>
        </GlassPanel>

        {!hasProducts ? (
          <InventoryEmptyState
            title="Belum ada produk untuk dianalisis"
            description="Tambahkan produk agar FutureStock dapat mendeteksi risiko dead stock."
            icon={<PackagePlus className="h-10 w-10" />}
            actionLabel="Tambah Produk"
            actionHref="/produk/tambah"
          />
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard
                title="Produk Berisiko"
                value={String(deadStockProducts.length)}
                description="Produk dead stock atau perlu dipantau"
                icon={PackageX}
                tone="amber"
              />
              <StatCard
                title="Nilai Terkunci"
                value={formatCurrency(deadStockValue)}
                description="Estimasi modal tertahan"
                icon={AlertTriangle}
                tone="violet"
              />
              <StatCard
                title="Total Produk"
                value={String(products.length)}
                description="Basis data produk real"
                icon={Skull}
                tone="cyan"
              />
            </section>

            {!hasDeadStock ? (
              <InventoryEmptyState
                title="Tidak ada dead stock terdeteksi"
                description="Kondisi inventaris masih sehat."
                icon={<PackageCheck className="h-10 w-10" />}
                actionLabel="Lihat Produk"
                actionHref="/produk"
              />
            ) : (
              <DeadStockTable products={deadStockProducts ?? []} />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}