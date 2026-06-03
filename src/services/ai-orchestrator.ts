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

export type AiForecastSource = "cache" | "gemini" | "fallback" | "stale-cache";

export type AiForecastWithMeta = {
  forecast: AiForecastResult;
  source: AiForecastSource;
  generatedAt: string | null;
  cacheAgeHours: number | null;
  isFreshCache: boolean;
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
      promo_description: `Diskon ${
        Math.floor(Math.random() * 20) + 10
      }% untuk ${item.name}`,
      suggested_price: Math.floor(item.price * 0.8),
      discount_percentage: Math.floor(Math.random() * 20) + 10,
      urgency_level: (item.current_stock > item.min_stock * 10
        ? "high"
        : "medium") as "high" | "medium" | "low",
      estimated_clearance_days: Math.ceil(
        item.current_stock / Math.max(item.average_daily_sales_30d, 1)
      ),
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
      sales_potential:
        item.sold_last_7_days > 0 ? ("medium" as const) : ("low" as const),
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
      promo_recommendation: "Diskon 15-20% untuk menghabiskan stok berlebih.",
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

  const allPredictions = salesSummary.map((item) => ({
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
    summary:
      "Sistem menampilkan analisis fallback berbasis data transaksi lokal karena API sedang tidak tersedia.",
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
    all_product_predictions: allPredictions,
    restock_recommendations: restockItems,
    overstock_warnings: overstockItems,
    dead_stock_risks: deadStockItems,
  };
}

export async function getSmartAiForecastWithMeta(params: {
  salesSummary: SalesSummaryItem[];
  totalProducts: number;
  totalTransactions: number;
  forceRefresh?: boolean;
}): Promise<AiForecastWithMeta> {

  console.log(
    "========== AI ORCHESTRATOR START =========="
  );

  console.log(
    "TOTAL PRODUCTS:",
    params.totalProducts
  );

  console.log(
    "TOTAL TRANSACTIONS:",
    params.totalTransactions
  );

  console.log(
    "SALES SUMMARY COUNT:",
    params.salesSummary.length
  );

  const latest =
    await getLatestAiForecast();

  console.log(
    "LATEST FORECAST:",
    latest?.id ?? "NONE"
  );

  const cacheAgeHours = latest
    ? differenceInHours(
        new Date(),
        new Date(latest.generated_at)
      )
    : null;

  const isFreshCache = Boolean(
    latest &&
      cacheAgeHours !== null &&
      cacheAgeHours < 1
  );

  console.log(
    "CACHE AGE:",
    cacheAgeHours
  );

  console.log(
    "IS FRESH CACHE:",
    isFreshCache
  );

  if (
    latest &&
    isFreshCache &&
    !params.forceRefresh
  ) {
    console.log(
      "RETURN CACHE"
    );

    return {
      forecast:
        latest.forecast_data,

      source: "cache",

      generatedAt:
        latest.generated_at,

      cacheAgeHours,

      isFreshCache: true,
    };
  }

  try {
    console.log(
      "STEP 1 -> GENERATE FORECAST"
    );

    const forecast =
      await generateForecastWithRetry(
        params.salesSummary,
        3
      );

    console.log(
      "STEP 2 -> GENERATE SUCCESS"
    );

    console.log(
      "SUMMARY:",
      forecast.summary
    );

    console.log(
      "PREDICTIONS:",
      forecast
        .all_product_predictions
        ?.length
    );

    console.log(
      "STEP 3 -> SAVE FORECAST"
    );

    await saveAiForecast({
      summary:
        forecast.summary,

      forecast,

      totalProducts:
        params.totalProducts,

      totalTransactions:
        params.totalTransactions,
    });

    console.log(
      "STEP 4 -> SAVE SUCCESS"
    );

    return {
      forecast,

      source: "gemini",

      generatedAt:
        new Date().toISOString(),

      cacheAgeHours: 0,

      isFreshCache: false,
    };
  } 
  
  catch (error) {
    console.error(
      "========== AI ORCHESTRATOR ERROR =========="
    );

    console.error(error);

    if (latest) {
      console.log(
        "RETURN STALE CACHE"
      );

      return {
        forecast:
          latest.forecast_data,

        source:
          "stale-cache",

        generatedAt:
          latest.generated_at,

        cacheAgeHours,

        isFreshCache: false,
      };
    }

    console.log(
      "CREATE FALLBACK FORECAST"
    );

    const fallbackForecast =
      createFallbackForecast(
        params.salesSummary
      );

    try {
      console.log(
        "SAVE FALLBACK FORECAST"
      );

      await saveAiForecast({
        summary:
          fallbackForecast.summary,

        forecast:
          fallbackForecast,

        totalProducts:
          params.totalProducts,

        totalTransactions:
          params.totalTransactions,
      });

      console.log(
        "FALLBACK SAVED"
      );
    } catch (saveError) {
      console.error(
        "FALLBACK SAVE ERROR"
      );

      console.error(saveError);
    }

    return {
      forecast:
        fallbackForecast,

      source:
        "fallback",

      generatedAt:
        new Date().toISOString(),

      cacheAgeHours: null,

      isFreshCache: false,
    };
  }
}

async function generateForecastWithRetry(
  salesSummary: SalesSummaryItem[],
  maxRetries = 3
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `GEMINI ATTEMPT ${attempt}/${maxRetries}`
      );

      const result =
        await generateAiForecast(
          salesSummary
        );

      return result;
    } catch (error: any) {
      lastError = error;

      const status =
        error?.status ||
        error?.error?.code;

      console.error(
        `GEMINI FAILED ATTEMPT ${attempt}`,
        status
      );

      const retryable =
        status === 429 ||
        status === 503;

      if (
        !retryable ||
        attempt === maxRetries
      ) {
        throw error;
      }

      const delay =
        Math.pow(2, attempt) *
        2000;

      console.log(
        `WAIT ${delay}ms BEFORE RETRY`
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            delay
          )
      );
    }
  }

  throw lastError;
}

export async function getSmartAiForecast(params: {
  salesSummary: SalesSummaryItem[];
  totalProducts: number;
  totalTransactions: number;
}): Promise<AiForecastResult> {
  const result =
    await getSmartAiForecastWithMeta(
      params
    );

  return result.forecast;
}