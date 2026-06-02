import { createClient } from "@/lib/supabase/server";

export async function evaluateForecastAccuracy() {
  const supabase = await createClient();

  const { data: forecasts } = await supabase
    .from("ai_forecasts")
    .select("*")
    .lte("forecast_end_date", new Date().toISOString());

  if (!forecasts) return;

  for (const forecast of forecasts) {
    const predictions =
      forecast.forecast_data?.all_product_predictions || [];

    for (const item of predictions) {
      const { data: salesItems } = await supabase
        .from("sales_items")
        .select(`
          quantity,
          sales!inner(created_at)
        `)
        .eq("product_id", item.product_id)
        .gte(
          "sales.created_at",
          forecast.forecast_start_date
        )
        .lte(
          "sales.created_at",
          forecast.forecast_end_date
        );

      const actualSales =
        salesItems?.reduce(
          (sum, row) => sum + row.quantity,
          0
        ) || 0;

      const predicted =
        item.predicted_demand_next_week || 0;

      const errorValue = Math.abs(
        predicted - actualSales
      );

      const accuracy =
        predicted === 0
          ? 0
          : Math.max(
              0,
              100 - (errorValue / predicted) * 100
            );

      await supabase
        .from("ai_forecast_accuracy")
        .insert({
          forecast_id: forecast.id,
          product_id: item.product_id,
          product_name: item.name,
          predicted_demand: predicted,
          actual_sales: actualSales,
          error_value: errorValue,
          accuracy_percentage: Number(
            accuracy.toFixed(2)
          ),
        });
    }
  }
}