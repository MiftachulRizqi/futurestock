import { Trophy } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { formatCurrency } from "@/lib/helpers/format";

type TopSellingProductsProps = {
  products: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
};

export function TopSellingProducts({
  products,
}: TopSellingProductsProps) {
  return (
    <GlassPanel className="p-5">
      <div className="mb-5 flex items-center gap-3">
        <Trophy className="h-5 w-5 text-amber-300" />

        <div>
          <h2 className="text-xl font-bold text-white">
            Top Selling Products
          </h2>

          <p className="text-sm text-slate-400">
            Produk dengan penjualan tertinggi.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-slate-400">
            Belum ada data penjualan.
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 text-sm font-bold text-amber-300">
                  #{index + 1}
                </div>

                <div>
                  <p className="font-medium text-white">
                    {product.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {product.quantity} unit terjual
                  </p>
                </div>
              </div>

              <p className="font-semibold text-white">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  );
}