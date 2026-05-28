import { Bot, Sparkles, TrendingUp } from "lucide-react";
import type { Product } from "@/types/product";

type AiForecastPanelProps = {
  products: Product[];
};

export function AiForecastPanel({ products }: AiForecastPanelProps) {
  const lowStock = products.filter(
    (product) => Number(product.stock) <= Number(product.min_stock)
  );

  const topProduct = products[0];

  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/[0.07] p-5 shadow-2xl shadow-primary/30 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          <Bot className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            AI Forecast
          </p>
          <h2 className="text-xl font-bold text-foreground">
            Insight Prediksi Stok
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <InsightItem
          icon={Sparkles}
          title="Rekomendasi Pembelian"
          description={
            lowStock.length > 0
              ? `${lowStock.length} produk perlu segera restock agar tidak kehabisan.`
              : "Tidak ada produk yang membutuhkan restock mendesak."
          }
        />

        <InsightItem
          icon={TrendingUp}
          title="Produk Prioritas"
          description={
            topProduct
              ? `${topProduct.name} memiliki stok ${topProduct.stock} ${topProduct.unit} dan perlu dipantau.`
              : "Belum ada produk untuk dianalisis."
          }
        />
      </div>
    </div>
  );
}

function InsightItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-4">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}