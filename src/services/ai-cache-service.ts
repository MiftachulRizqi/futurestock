import { createClient } from "@/lib/supabase/server";
import type { AiForecastResult } from "@/types/ai-forecast";
import type { AiForecastCache } from "@/types/ai-forecast-cache";

export async function getLatestAiForecast(): Promise<AiForecastCache | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_forecasts")
    .select("*")
    .order("generated_at", {
      ascending: false,
    })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function saveAiForecast(params: {
  summary: string;
  forecast: AiForecastResult;
  totalProducts: number;
  totalTransactions: number;
}) {
  const supabase = await createClient();

  const now = new Date();

  // TESTING CEPAT 30 DETIK
  const end = new Date(now.getTime() + 30 * 1000);

  const { error } = await supabase
    .from("ai_forecasts")
    .insert({
      summary: params.summary,
      forecast_data: params.forecast,
      total_products: params.totalProducts,
      total_transactions: params.totalTransactions,

      forecast_start_date: now.toISOString(),
      forecast_end_date: end.toISOString(),
    });

  if (error) {
    throw new Error(error.message);
  }
}