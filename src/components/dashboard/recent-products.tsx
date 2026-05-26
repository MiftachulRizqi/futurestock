import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/helpers/format";

type RecentProductsProps = {
  products: Product[];
};

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
            Recent Products
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">Produk Terbaru</h2>
        </div>

        <Link href="/produk" className="text-sm font-medium text-cyan-300">
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada produk.</p>
        ) : (
          products.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              href={`/produk/${product.id}`}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 transition hover:bg-white/5"
            >
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {product.image_url ? (
                  <Image
                    src={product.image_url.trim()}
                    alt={product.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center text-[10px] text-slate-500">
                    IMG
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {product.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {product.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {formatCurrency(Number(product.price))}
                </p>
                <p className="text-xs text-slate-500">
                  {product.stock} {product.unit}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}