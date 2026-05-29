import Link from "next/link";
import { Package, Plus } from "lucide-react";

import { getProducts } from "@/services/product-service";

import { ProductTable } from "@/components/products/product-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";

import { Button } from "@/components/ui/button";

export default async function ProdukPage() {
  const products = await getProducts();

  const totalProducts = products.length;
  const activeProducts = products.filter(
    (product) => product.status === "active"
  ).length;
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.min_stock
  ).length;

  return (
    <DashboardLayout products={products}>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Package className="h-3.5 w-3.5" />
                Manajemen Produk
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Produk
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Kelola daftar produk, stok, harga, status, dan supplier agar
                data inventaris tetap sinkron dengan transaksi, analitik, dan
                prediksi AI.
              </p>
            </div>

            <Button asChild>
              <Link href="/produk/tambah">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Link>
            </Button>
          </div>
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <ProductStatCard label="Total Produk" value={totalProducts} />
          <ProductStatCard label="Produk Aktif" value={activeProducts} />
          <ProductStatCard label="Stok Rendah" value={lowStockProducts} />
        </section>

        <ProductTable products={products} />
      </div>
    </DashboardLayout>
  );
}

function ProductStatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <GlassPanel className="p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
    </GlassPanel>
  );
}