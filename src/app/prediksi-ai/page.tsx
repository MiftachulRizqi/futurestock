import {
  Bot,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  PackagePlus,
  ReceiptText,
  Sparkles,
  Target,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { OverstockPromoAlert } from "@/components/dashboard/overstock-promo-alert";
import { GenerateForecastSubmitButton } from "@/components/ai/generate-forecast-submit-button";
import { InventoryEmptyState } from "@/components/states/inventory-empty-state";

import { getProducts } from "@/services/product-service";
import { getSales } from "@/services/sales-service";
import { getSalesSummaryForAi } from "@/lib/helpers/sales-summary";
import { getForecastAccuracy } from "@/lib/helpers/forecast-accuracy";
import { getSmartAiForecastWithMeta } from "@/services/ai-orchestrator";
import { regenerateAiForecastAction } from "./actions";

import type { AiForecastProduct } from "@/types/ai-forecast";
import type { AiForecastSource } from "@/services/ai-orchestrator";

export default async function PrediksiAiPage() {
  const products = await getProducts();
  const sales = await getSales();

  const hasProducts = products.length > 0;
  const hasSales = sales.length > 0;

  if (!hasProducts) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <PrediksiAiHeader showAction={false} />

          <InventoryEmptyState
            title="Belum ada produk untuk diprediksi"
            description="Tambahkan produk terlebih dahulu agar FutureStock dapat membaca stok, kategori, minimum stok, dan mulai membuat forecast inventory."
            icon={<PackagePlus className="h-10 w-10" />}
            actionLabel="Tambah Produk"
            actionHref="/produk/tambah"
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!hasSales) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <PrediksiAiHeader showAction={false} />

          <InventoryEmptyState
            title="Belum ada transaksi untuk dianalisis"
            description="Tambahkan transaksi penjualan terlebih dahulu agar AI dapat membaca pola demand, produk terlaris, risiko overstock, dan rekomendasi restock."
            icon={<ReceiptText className="h-10 w-10" />}
            actionLabel="Tambah Transaksi"
            actionHref="/transaksi/tambah"
          />
        </div>
      </DashboardLayout>
    );
  }

  const salesSummary = getSalesSummaryForAi(products, sales);

  const forecastResult = await getSmartAiForecastWithMeta({
    salesSummary,
    totalProducts: products.length,
    totalTransactions: sales.length,
  });

  const forecast = forecastResult.forecast;
  const forecastAccuracy = getForecastAccuracy(products, sales);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PrediksiAiHeader showAction />

        <ForecastCacheInfo
          source={forecastResult.source}
          generatedAt={forecastResult.generatedAt}
          cacheAgeHours={forecastResult.cacheAgeHours}
          isFreshCache={forecastResult.isFreshCache}
        />

        <ForecastAccuracyCard accuracy={forecastAccuracy} />

        <GlassPanel className="p-5">
          <div className="flex items-start gap-3">
            <BrainCircuit className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                Ringkasan AI
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {forecast.summary}
              </p>
            </div>
          </div>
        </GlassPanel>

        {forecast.promo_bundles && forecast.promo_bundles.length > 0 ? (
          <OverstockPromoAlert promoBundles={forecast.promo_bundles} />
        ) : null}

        <section className="grid grid-cols-1 gap-6">
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

function PrediksiAiHeader({ showAction }: { showAction: boolean }) {
  return (
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
            Forecasting stok berbasis Gemini untuk menganalisis pola penjualan,
            memprediksi demand, memberi rekomendasi stok ideal, warning
            overstock, dan risiko dead stock.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {showAction ? (
            <form action={regenerateAiForecastAction}>
              <GenerateForecastSubmitButton />
            </form>
          ) : null}

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Bot className="h-10 w-10" />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function ForecastCacheInfo({
  source,
  generatedAt,
  cacheAgeHours,
  isFreshCache,
}: {
  source: AiForecastSource;
  generatedAt: string | null;
  cacheAgeHours: number | null;
  isFreshCache: boolean;
}) {
  const sourceLabel =
    source === "cache"
      ? "Cache aktif"
      : source === "gemini"
        ? "Hasil baru dari Gemini"
        : source === "stale-cache"
          ? "Cache lama digunakan"
          : "Fallback lokal";

  const sourceDescription =
    source === "cache"
      ? "Forecast ditampilkan dari cache agar halaman cepat dan hemat API."
      : source === "gemini"
        ? "Forecast baru berhasil dibuat menggunakan Gemini AI."
        : source === "stale-cache"
          ? "Gemini sedang tidak tersedia, sistem memakai cache terakhir."
          : "Sistem memakai analisis lokal karena cache dan Gemini belum tersedia.";

  return (
    <GlassPanel className="p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {source === "cache" ? (
              <Database className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-foreground">{sourceLabel}</h2>

              <span
                className={
                  isFreshCache
                    ? "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    : "rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                }
              >
                {isFreshCache ? "Fresh" : "Updated"}
              </span>
            </div>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {sourceDescription}
            </p>
          </div>
        </div>

        <div className="grid gap-2 text-sm md:text-right">
          <div className="inline-flex items-center gap-2 text-muted-foreground md:justify-end">
            <Clock3 className="h-4 w-4" />
            {generatedAt
              ? new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(generatedAt))
              : "Belum ada waktu generate"}
          </div>

          <p className="text-xs text-muted-foreground">
            {cacheAgeHours !== null
              ? `Usia data: sekitar ${cacheAgeHours} jam`
              : "Belum ada cache tersimpan"}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}

function ForecastAccuracyCard({
  accuracy,
}: {
  accuracy: {
    accuracy: number;
    averageError: number;
    comparedPoints: number;
    actualTotal: number;
    predictedTotal: number;
    status: "excellent" | "good" | "needs-improvement" | "insufficient-data";
    description: string;
  };
}) {
  const isInsufficient = accuracy.status === "insufficient-data";

  const statusLabel =
    accuracy.status === "excellent"
      ? "Sangat Baik"
      : accuracy.status === "good"
        ? "Baik"
        : accuracy.status === "needs-improvement"
          ? "Perlu Data Tambahan"
          : "Histori Forecast Belum Cukup";

  const description = isInsufficient
    ? "Akurasi forecast akan dihitung otomatis setelah FutureStock memiliki minimal 2 periode forecast dan data penjualan aktual yang cukup untuk dibandingkan."
    : accuracy.description;

  return (
    <GlassPanel className="p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Target className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              Forecast Accuracy
            </p>

            <h2 className="mt-1 text-xl font-bold text-foreground">
              Akurasi Prediksi Penjualan
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/40 p-5 text-center md:min-w-[190px]">
          <p className="text-sm text-muted-foreground">Status</p>

          {isInsufficient ? (
            <>
              <p className="mt-2 text-lg font-bold text-amber-500">
                Menunggu Data
              </p>

              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                {statusLabel}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-4xl font-bold text-primary">
                {accuracy.accuracy}%
              </p>

              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                {statusLabel}
              </p>
            </>
          )}
        </div>
      </div>

      {isInsufficient ? (
        <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <div className="space-y-3">
            <p className="font-medium text-foreground">
              Sistem sedang mengumpulkan histori forecast.
            </p>

            <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              <ReadinessItem text="Prediksi AI aktif" />
              <ReadinessItem text="Transaksi penjualan tercatat" />
              <ReadinessItem text="Sistem siap menghitung akurasi" />
              <ReadinessItem text="Akurasi aktif otomatis saat data cukup" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <AccuracyMiniStat label="Aktual" value={`${accuracy.actualTotal} unit`} />

        <AccuracyMiniStat
          label="Prediksi"
          value={`${accuracy.predictedTotal} unit`}
        />

        <AccuracyMiniStat
          label="Rata-rata Error"
          value={`${accuracy.averageError} unit`}
        />
      </div>
    </GlassPanel>
  );
}

function ReadinessItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
      <span>{text}</span>
    </div>
  );
}

function AccuracyMiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
    </div>
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
    <GlassPanel className="overflow-hidden p-5">
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
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead className="border-b border-border bg-muted/20 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama Produk</th>
                  <th className="px-4 py-3 font-semibold">Kategori / SKU</th>
                  <th className="px-4 py-3 text-center font-semibold">Stok</th>
                  <th className="px-4 py-3 text-center font-semibold text-primary">
                    Demand Mingguan
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Saran Restock
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Potensi
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Risiko
                  </th>
                  <th className="px-4 py-3 font-semibold">Catatan AI</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {safeItems.map((item) => (
                  <tr
                    key={`${title}-${item.product_id}`}
                    className="transition-colors hover:bg-muted/10"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {item.name}
                      </div>

                      <div className="mt-1 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {item.confidence_score}% conf
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {item.category}
                      <br />
                      <span className="text-xs opacity-70">{item.sku}</span>
                    </td>

                    <td className="px-4 py-3 text-center text-foreground">
                      {item.current_stock}
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-primary">
                      {item.predicted_demand_next_week}
                    </td>

                    <td className="px-4 py-3 text-center text-foreground">
                      {item.recommended_restock_qty}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                          item.sales_potential === "high"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : item.sales_potential === "medium"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {translatePotential(item.sales_potential)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                          item.dead_stock_risk === "high"
                            ? "bg-red-500/10 text-red-500"
                            : item.dead_stock_risk === "medium"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {translateRisk(item.dead_stock_risk)}
                      </span>
                    </td>

                    <td className="max-w-[250px] whitespace-normal px-4 py-3 text-xs text-muted-foreground">
                      <div className="space-y-1">
                        {item.holiday_affected && (
                          <div className="flex items-center gap-1 font-medium text-primary">
                            <Calendar className="h-3 w-3" /> Event:{" "}
                            {item.holiday_name}
                          </div>
                        )}

                        {item.overstock_warning && (
                          <div className="font-medium text-amber-500">
                            ⚠️ Overstock
                          </div>
                        )}

                        {item.promo_recommendation && (
                          <div className="text-emerald-500">
                            💡 {item.promo_recommendation}
                          </div>
                        )}

                        {!item.holiday_affected &&
                          !item.overstock_warning &&
                          !item.promo_recommendation && <span>Tren normal</span>}
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