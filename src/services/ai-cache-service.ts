import { createClient } from "@/lib/supabase/server";
import type { AiForecastResult } from "@/types/ai-forecast";
import type { AiForecastCache } from "@/types/ai-forecast-cache";

export async function getLatestAiForecast(): Promise<AiForecastCache | null> {
  const supabase = await createClient();

  console.log(
    "========== GET LATEST FORECAST =========="
  );

  const { data, error } = await supabase
    .from("ai_forecasts")
    .select("*")
    .order("generated_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  console.log("CACHE DATA:", data);

  console.log("CACHE ERROR:", error);

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
  console.log(
    "========== SAVE FORECAST START =========="
  );

  const supabase = await createClient();

  const start = new Date();

  // TESTING
  const end = new Date(start);
  end.setDate(
    end.getDate() + 2
  );

  console.log("START:", start);

  console.log("END:", end);

  console.log(
    "TOTAL PRODUCTS:",
    params.totalProducts
  );

  console.log(
    "TOTAL TRANSACTIONS:",
    params.totalTransactions
  );

  console.log(
    "SUMMARY LENGTH:",
    params.summary?.length
  );

  console.log(
    "FORECAST EXISTS:",
    !!params.forecast
  );

  const payload = {
    summary: params.summary,

    forecast_data: params.forecast,

    total_products:
      params.totalProducts,

    total_transactions:
      params.totalTransactions,

    forecast_start_date:
      start.toISOString(),

    forecast_end_date:
      end.toISOString(),

    is_evaluated: false,
  };

  console.log(
    "INSERT PAYLOAD:",
    payload
  );

  const { data, error } =
    await supabase
      .from("ai_forecasts")
      .insert(payload)
      .select();

  console.log(
    "INSERT RESULT DATA:",
    data
  );

  console.log(
    "INSERT RESULT ERROR:",
    error
  );

  if (error) {
    throw new Error(
      `SAVE FORECAST ERROR: ${error.message}`
    );
  }

  console.log(
    "========== SAVE FORECAST SUCCESS =========="
  );
}