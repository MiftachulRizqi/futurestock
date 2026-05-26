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

  return (
    <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.07] p-5 shadow-2xl shadow-amber-950/20 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
            Low Stock
          </p>
          <h2 className="text-xl font-bold text-white">
            Alert Stok Menipis
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-slate-400">
            Semua stok masih berada di atas minimum.
          </p>
        ) : (
          lowStockProducts.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              href={`/produk/${product.id}`}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-3 transition hover:bg-white/5"
            >
              <div>
                <p className="font-medium text-white">{product.name}</p>
                <p className="text-xs text-slate-500">{product.category}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-amber-300">
                  {product.stock} {product.unit}
                </p>
                <p className="text-xs text-slate-500">
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