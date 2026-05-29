import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { Product } from "@/types/product";

type LowStockAlertProps = {
  products: Product[];
};

export function LowStockAlert({ products }: LowStockAlertProps) {
  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= Number(product.min_stock)
  );

  const visibleProducts = lowStockProducts.slice(0, 5);

  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/[0.07] p-5 shadow-2xl shadow-primary/20 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              Low Stock
            </p>
            <h2 className="text-xl font-bold text-foreground">
              Alert Stok Menipis
            </h2>
          </div>
        </div>

        <Link href="/inventaris" className="text-sm font-medium text-primary">
          Lihat Semua
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {visibleProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Semua stok masih berada di atas minimum.
          </p>
        ) : (
          visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={`/produk/${product.id}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-3 transition hover:bg-card/5"
            >
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-primary">
                  {product.stock} {product.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  Min: {product.min_stock}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}