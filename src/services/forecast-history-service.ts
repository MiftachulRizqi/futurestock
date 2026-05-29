import { createClient } from "@/lib/supabase/server";
import type { AiForecastResult } from "@/types/ai-forecast";

type SaveForecastHistoryParams = {
  storeId: string;
  forecastId?: string | null;
  forecast: AiForecastResult;
};

export async function saveForecastHistory({
  storeId,
  forecastId = null,
  forecast,
}: SaveForecastHistoryParams) {
  const supabase = await createClient();

  const predictedTotalDemand =
    forecast.all_product_predictions?.reduce((total, item) => {
      return total + Number(item.predicted_demand_next_week || 0);
    }, 0) ?? 0;

  const predictedRestockQty =
    forecast.restock_recommendations?.reduce((total, item) => {
      return total + Number(item.recommended_restock_qty || 0);
    }, 0) ?? 0;

  const overstockCount = forecast.overstock_warnings?.length ?? 0;
  const deadStockCount = forecast.dead_stock_risks?.length ?? 0;

  const { error } = await supabase.from("forecast_history").insert({
    store_id: storeId,
    forecast_id: forecastId,
    predicted_total_demand: predictedTotalDemand,
    predicted_restock_qty: predictedRestockQty,
    overstock_count: overstockCount,
    dead_stock_count: deadStockCount,
    forecast_data: forecast,
  });

  if (error) {
    console.error("Failed to save forecast history:", error.message);
  }
}

export async function getForecastHistory(limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forecast_history")
    .select("*")
    .order("generated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load forecast history:", error.message);
    return [];
  }

  return data ?? [];
}