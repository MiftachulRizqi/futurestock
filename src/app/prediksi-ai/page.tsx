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

        <section className="grid gap-6 grid-cols-1">
          <ForecastSection
            title="Prediksi Demand Semua Produk Minggu Depan"
            description="Perkiraan permintaan untuk seluruh inventaris Anda berdasarkan tren dan event mendatang."
            items={forecast.all_product_predictions}
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
  items = [], 
}: {
  title: string;
  description: string;
  items?: AiForecastProduct[];
}) {
  const safeItems = items || [];

  return (
    <GlassPanel className="p-5 overflow-hidden">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mt-5 w-full overflow-x-auto">
        {safeItems.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/50 p-5 text-sm text-muted-foreground">
            Tidak ada data untuk kategori ini.
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card/30">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-border bg-muted/20 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama Produk</th>
                  <th className="px-4 py-3 font-semibold">Kategori / SKU</th>
                  <th className="px-4 py-3 font-semibold text-center">Stok</th>
                  <th className="px-4 py-3 font-semibold text-center text-primary">Demand Mingguan</th>
                  <th className="px-4 py-3 font-semibold text-center">Saran Restock</th>
                  <th className="px-4 py-3 font-semibold text-center">Potensi</th>
                  <th className="px-4 py-3 font-semibold text-center">Risiko</th>
                  <th className="px-4 py-3 font-semibold">Catatan AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {safeItems.map((item) => (
                  <tr key={`${title}-${item.product_id}`} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="mt-1 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {item.confidence_score}% conf
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.category}
                      <br />
                      <span className="text-xs opacity-70">{item.sku}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-foreground">{item.current_stock}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary">{item.predicted_demand_next_week}</td>
                    <td className="px-4 py-3 text-center text-foreground">{item.recommended_restock_qty}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                        item.sales_potential === 'high' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.sales_potential === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {translatePotential(item.sales_potential)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                        item.dead_stock_risk === 'high' ? 'bg-red-500/10 text-red-500' :
                        item.dead_stock_risk === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {translateRisk(item.dead_stock_risk)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[250px] whitespace-normal text-muted-foreground">
                      <div className="space-y-1">
                        {item.holiday_affected && (
                          <div className="text-primary font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Event: {item.holiday_name}
                          </div>
                        )}
                        {item.overstock_warning && (
                          <div className="text-amber-500 font-medium">⚠️ Overstock</div>
                        )}
                        {item.promo_recommendation && (
                          <div className="text-emerald-500">
                            💡 {typeof item.promo_recommendation === "string" ? item.promo_recommendation : (item.promo_recommendation as any).promo_description}
                          </div>
                        )}
                        {!item.holiday_affected && !item.overstock_warning && !item.promo_recommendation && (
                          <span>Tren normal</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GlassPanel>
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