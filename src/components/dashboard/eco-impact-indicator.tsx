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
    <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Leaf className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Eco Impact Indicator
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-700">
              Potensi Pengurangan Dead Stock
            </span>
          </div>

          <span className="font-bold text-red-600">
            {safeProducts} Produk
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700">
              Efisiensi Stok
            </span>
          </div>

          <span className="font-bold text-green-700">
            {efficiency}%
          </span>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          Sistem membantu mengurangi penumpukan stok dan meningkatkan
          efisiensi inventaris secara berkelanjutan.
        </div>
      </div>
    </div>
  );
}