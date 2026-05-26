import { differenceInHours } from "date-fns";
import { generateAiForecast } from "@/services/ai-forecast-service";
import {
  getLatestAiForecast,
  saveAiForecast,
} from "@/services/ai-cache-service";
import type { AiForecastResult } from "@/types/ai-forecast";

type SalesSummaryItem = {
  product_id: string;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock: number;
  price: number;
  status: string;
  sold_last_7_days: number;
  sold_last_30_days: number;
  average_daily_sales_30d: number;
  total_sold: number;
  total_revenue: number;
  last_sold_at: string | null;
};

function createFallbackForecast(
  salesSummary: SalesSummaryItem[]
): AiForecastResult {
  const restockItems = salesSummary
    .filter((item) => item.current_stock <= item.min_stock)
    .map((item) => ({
      product_id: item.product_id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      current_stock: item.current_stock,
      min_stock: item.min_stock,
      predicted_demand_next_week: Math.ceil(item.average_daily_sales_30d * 7),
      recommended_stock: Math.max(item.min_stock * 2, 1),
      recommended_restock_qty: Math.max(
        item.min_stock * 2 - item.current_stock,
        0
      ),
      overstock_warning: false,
      dead_stock_risk: "low" as const,
      sales_potential: item.sold_last_7_days > 0 ? ("medium" as const) : ("low" as const),
      confidence_score: 55,
      reason:
        "Analisis fallback digunakan karena Gemini sedang terkena limit quota. Rekomendasi dihitung dari stok minimum dan histori penjualan lokal.",
    }));

  const overstockItems = salesSummary
    .filter(
      (item) =>
        item.current_stock > item.min_stock * 5 &&
        item.sold_last_30_days <= item.min_stock
    )
    .map((item) => ({
      product_id: item.product_id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      current_stock: item.current_stock,
      min_stock: item.min_stock,
      predicted_demand_next_week: Math.ceil(item.average_daily_sales_30d * 7),
      recommended_stock: Math.max(item.min_stock * 2, 1),
      recommended_restock_qty: 0,
      overstock_warning: true,
      dead_stock_risk: "medium" as const,
      sales_potential: "low" as const,
      confidence_score: 50,
      reason:
        "Stok jauh lebih tinggi dari minimum, sementara histori penjualan masih rendah. Produk perlu dipantau agar tidak menjadi overstock.",
    }));

  const deadStockItems = salesSummary
    .filter((item) => item.total_sold === 0 || item.status === "inactive")
    .map((item) => ({
      product_id: item.product_id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      current_stock: item.current_stock,
      min_stock: item.min_stock,
      predicted_demand_next_week: 0,
      recommended_stock: item.min_stock,
      recommended_restock_qty: 0,
      overstock_warning: item.current_stock > item.min_stock * 3,
      dead_stock_risk: "high" as const,
      sales_potential: "low" as const,
      confidence_score: 50,
      reason:
        "Produk belum memiliki penjualan tercatat atau statusnya nonaktif. Risiko dead stock perlu diperiksa manual.",
    }));

  const topSellingItems = [...salesSummary]
    .sort((a, b) => b.sold_last_7_days - a.sold_last_7_days)
    .slice(0, 5)
    .map((item) => ({
      product_id: item.product_id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      current_stock: item.current_stock,
      min_stock: item.min_stock,
      predicted_demand_next_week: Math.ceil(item.average_daily_sales_30d * 7),
      recommended_stock: Math.max(
        Math.ceil(item.average_daily_sales_30d * 14),
        item.min_stock
      ),
      recommended_restock_qty: Math.max(
        Math.ceil(item.average_daily_sales_30d * 14) - item.current_stock,
        0
      ),
      overstock_warning: false,
      dead_stock_risk: "low" as const,
      sales_potential:
        item.sold_last_7_days > 5 ? ("high" as const) : ("medium" as const),
      confidence_score: 60,
      reason:
        "Produk memiliki histori penjualan relatif lebih tinggi dibanding produk lain.",
    }));

  return {
    summary:
      "Gemini sedang terkena limit quota, jadi FutureStock menampilkan analisis fallback berbasis data transaksi lokal.",
    top_selling_predictions: topSellingItems,
    restock_recommendations: restockItems,
    overstock_warnings: overstockItems,
    dead_stock_risks: deadStockItems,
  };
}

export async function getSmartAiForecast(params: {
  salesSummary: SalesSummaryItem[];
  totalProducts: number;
  totalTransactions: number;
}): Promise<AiForecastResult> {
  const latest = await getLatestAiForecast();

  if (latest) {
    const ageInHours = differenceInHours(
      new Date(),
      new Date(latest.generated_at)
    );

    const stillFresh =
      ageInHours < 6 &&
      latest.total_transactions === params.totalTransactions;

    if (stillFresh) {
      return latest.forecast_data;
    }
  }

  try {
    const forecast = await generateAiForecast(params.salesSummary);

    await saveAiForecast({
      summary: forecast.summary,
      forecast,
      totalProducts: params.totalProducts,
      totalTransactions: params.totalTransactions,
    });

    return forecast;
  } catch {
    if (latest) {
      return latest.forecast_data;
    }

    return createFallbackForecast(params.salesSummary);
  }
}