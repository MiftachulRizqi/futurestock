import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SaleForm } from "@/components/sales/sale-form";
import { getProducts } from "@/services/product-service";
import { createSaleAction } from "../actions";

export default async function TambahTransaksiPage() {
  const products = await getProducts();

  const activeProducts = products.filter(
    (product) => product.status === "active" && Number(product.stock) > 0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Sales Transaction
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Tambah Transaksi
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Input penjualan real agar stok otomatis berkurang dan AI dapat
            membaca pola demand.
          </p>
        </div>

        {activeProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/[0.06] p-6 text-center">
            <p className="font-medium text-foreground">
              Tidak ada produk aktif dengan stok tersedia.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan produk atau perbarui stok terlebih dahulu.
            </p>
          </div>
        ) : (
          <SaleForm products={activeProducts} action={createSaleAction} />
        )}
      </div>
    </DashboardLayout>
  );
}