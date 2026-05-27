import { differenceInHours } from "date-fns";
import { generateAiForecast } from "./ai-forecast-service";
import { getLatestAiForecast, saveAiForecast } from "./ai-cache-service";
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
  const promoBundles = salesSummary
    .filter(
      (item) =>
        item.current_stock > item.min_stock * 5 &&
        item.sold_last_30_days <= item.min_stock
    )
    .slice(0, 3)
    .map((item) => ({
      primary_product_id: item.product_id,
      primary_product_name: item.name,
      secondary_product_id: undefined,
      secondary_product_name: undefined,
      promo_type: "discount" as const,
      promo_description: `Diskon ${Math.floor(Math.random() * 20) + 10}% untuk ${item.name}`,
      suggested_price: Math.floor(item.price * 0.8),
      discount_percentage: Math.floor(Math.random() * 20) + 10,
      urgency_level: (item.current_stock > item.min_stock * 10 ? "high" : "medium") as "high" | "medium" | "low",
      estimated_clearance_days: Math.ceil(item.current_stock / Math.max(item.average_daily_sales_30d, 1)),
    }));

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
      holiday_affected: false,
      reason: "Analisis fallback berbasis data transaksi lokal tanpa API AI.",
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
      holiday_affected: false,
      promo_recommendation: `Diskon 15-20% untuk menghabiskan stok berlebih.`,
      promo_type: "discount" as const,
      reason: "Stok jauh lebih tinggi dari minimum.",
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
      holiday_affected: false,
      reason: "Produk belum memiliki penjualan tercatat.",
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
      holiday_affected: false,
      reason: "Produk memiliki histori penjualan tinggi berdasarkan fallback data.",
    }));

  return {
    summary: "Sistem menampilkan analisis fallback berbasis data transaksi lokal karena API sedang tidak tersedia.",
    holiday_context: {
      has_upcoming_holiday: false,
      upcoming_holiday: null,
      days_until_holiday: null,
      holiday_category: null,
      impact_multiplier: null,
      affected_categories: [],
      recommendation: null,
    },
    promo_bundles: promoBundles,
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