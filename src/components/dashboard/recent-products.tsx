import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/helpers/format";

type RecentProductsProps = {
  products: Product[];
};

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <div className="rounded-3xl border border-border bg-card/[0.06] p-5 shadow-2xl shadow-primary/20 backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Recent Products
          </p>
          <h2 className="mt-2 text-xl font-bold text-foreground">Produk Terbaru</h2>
        </div>

        <Link href="/produk" className="text-sm font-medium text-primary">
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada produk.</p>
        ) : (
          products.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              href={`/produk/${product.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-3 transition hover:bg-card/5"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-card/5">
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
                  <div className="flex h-12 w-12 items-center justify-center text-[10px] text-muted-foreground">
                    IMG
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {product.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {product.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(Number(product.price))}
                </p>
                <p className="text-xs text-muted-foreground">
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