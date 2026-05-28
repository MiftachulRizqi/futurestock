import { Leaf, TrendingDown, PackageCheck } from "lucide-react";

interface Props {
  totalProducts: number;
  lowStockCount: number;
}

export function EcoImpactIndicator({
  totalProducts,
  lowStockCount,
}: Props) {
  const safeProducts = totalProducts - lowStockCount;

  const efficiency =
    totalProducts > 0
      ? ((safeProducts / totalProducts) * 100).toFixed(1)
      : "0";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Leaf className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Eco Impact Indicator
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-destructive/10 p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-sm text-foreground">
              Potensi Pengurangan Dead Stock
            </span>
          </div>

          <span className="font-bold text-destructive">
            {safeProducts} Produk
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              Efisiensi Stok
            </span>
          </div>

          <span className="font-bold text-primary">
            {efficiency}%
          </span>
        </div>

        <div className="rounded-xl bg-primary/10 p-4 text-sm text-foreground">
          Sistem membantu mengurangi penumpukan stok dan meningkatkan
          efisiensi inventaris secara berkelanjutan.
        </div>
      </div>
    </div>
  );
}