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
        <Trophy className="h-5 w-5 text-primary" />

        <div>
          <h2 className="text-xl font-bold text-foreground">
            Top Selling Products
          </h2>

          <p className="text-sm text-muted-foreground">
            Produk dengan penjualan tertinggi.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada data penjualan.
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                  #{index + 1}
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    {product.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {product.quantity} unit terjual
                  </p>
                </div>
              </div>

              <p className="font-semibold text-foreground">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  );
}