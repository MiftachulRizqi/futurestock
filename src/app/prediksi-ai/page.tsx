import { Bot, BrainCircuit, Calendar, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { OverstockPromoAlert } from "@/components/dashboard/overstock-promo-alert";
import { getProducts } from "@/services/product-service";
import { getSales } from "@/services/sales-service";
import { getSalesSummaryForAi } from "@/lib/helpers/sales-summary";
import { getSmartAiForecast } from "@/services/ai-orchestrator";
import type { AiForecastProduct } from "@/types/ai-forecast";

export default async function PrediksiAiPage() {
  const products = await getProducts();
  const sales = await getSales();

  const salesSummary = getSalesSummaryForAi(products, sales);
  const forecast = await getSmartAiForecast({
    salesSummary,
    totalProducts: products.length,
    totalTransactions: sales.length,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
                Gemini AI Forecast Engine
              </p>

              <h1 className="mt-2 text-3xl font-bold text-foreground">
                Prediksi AI
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Forecasting stok berbasis Gemini untuk menganalisis pola
                penjualan, memprediksi potensi demand, memberi rekomendasi stok
                ideal, warning overstock, dan risiko dead stock.
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Bot className="h-10 w-10" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex items-start gap-3">
            <BrainCircuit className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Ringkasan AI</h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {forecast.summary}
              </p>
            </div>
          </div>
        </GlassPanel>

        {forecast.promo_bundles && forecast.promo_bundles.length > 0 && (
          <OverstockPromoAlert promoBundles={forecast.promo_bundles} />
        )}

        <section className="grid gap-6 xl:grid-cols-2">
          <ForecastSection
            title="Produk Berpotensi Laku Minggu Depan"
            description="Produk dengan potensi demand tertinggi berdasarkan tren penjualan."
            items={forecast.top_selling_predictions}
          />

          <ForecastSection
            title="Rekomendasi Restock"
            description="Produk yang perlu ditambah stoknya agar tidak kehabisan."
            items={forecast.restock_recommendations}
          />

          <ForecastSection
            title="Warning Overstock"
            description="Produk dengan stok berlebih dibandingkan pola demand."
            items={forecast.overstock_warnings}
          />

          <ForecastSection
            title="Risiko Dead Stock"
            description="Produk yang berisiko tidak bergerak atau sulit terjual."
            items={forecast.dead_stock_risks}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}

function ForecastSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: AiForecastProduct[];
}) {
  return (
    <GlassPanel className="p-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/50 p-5 text-sm text-muted-foreground">
            Tidak ada data untuk kategori ini.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={`${title}-${item.product_id}`}
              className="rounded-2xl border border-border bg-card/50 p-4"
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.category} · {item.sku}
                  </p>
                </div>

                <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                  {item.confidence_score}% confidence
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                <MiniMetric
                  label="Stok Saat Ini"
                  value={item.current_stock}
                />

                <MiniMetric
                  label="Prediksi Demand"
                  value={item.predicted_demand_next_week}
                />

                <MiniMetric
                  label="Saran Restock"
                  value={item.recommended_restock_qty}
                />
              </div>

              <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                <MiniMetric
                  label="Stok Ideal"
                  value={item.recommended_stock}
                />

                <MiniMetric
                  label="Potensi Laku"
                  value={translatePotential(item.sales_potential)}
                />

                <MiniMetric
                  label="Risiko Dead Stock"
                  value={translateRisk(item.dead_stock_risk)}
                />
              </div>

              {item.holiday_affected ? (
                <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">
                      Terdampak {item.holiday_name}
                    </span>
                  </div>
                  <p className="text-primary">
                    Demand ditingkatkan {item.holiday_multiplier}x karena hari besar
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-border bg-card/30 p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-muted-foreground">
                      Tidak ada hari besar terdekat
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Prediksi demand berjalan normal berdasarkan histori tren penjualan.
                  </p>
                </div>
              )}

              {item.overstock_warning ? (
                <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
                  Produk ini terindikasi overstock. Pertimbangkan promo,
                  bundling, atau kurangi pembelian berikutnya.
                </div>
              ) : null}

              {/* SABUK PENGAMAN: Jika AI malah kirim object, kita ekstrak stringnya */}
              {item.promo_recommendation ? (
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
                  <span className="font-medium">💡 Saran Promo:</span>{" "}
                  {typeof item.promo_recommendation === "string" 
                    ? item.promo_recommendation 
                    : (item.promo_recommendation as any).promo_description || "Lihat rekomendasi promo di atas"}
                </div>
              ) : null}

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {typeof item.reason === "string" ? item.reason : "Analisis AI."}
              </p>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/[0.03] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function translateRisk(value: AiForecastProduct["dead_stock_risk"]) {
  const map = {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
  };

  return map[value] || "Tidak diketahui";
}

function translatePotential(value: AiForecastProduct["sales_potential"]) {
  const map = {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
  };

  return map[value] || "Tidak diketahui";
}