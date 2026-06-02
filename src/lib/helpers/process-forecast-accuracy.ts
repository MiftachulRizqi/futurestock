import { createClient } from "@/lib/supabase/server";

export async function processForecastAccuracy() {
  const supabase = await createClient();

  // ambil forecast yang sudah lewat
  const { data: forecasts } = await supabase
    .from("ai_forecasts")
    .select("*")
    .lte("forecast_end_date", new Date().toISOString());

  if (!forecasts || forecasts.length === 0) {
    return;
  }

  for (const forecast of forecasts) {
    const predictions =
      forecast.forecast_data?.all_product_predictions || [];

    for (const item of predictions) {
      // cek apakah sudah pernah dihitung
      const { data: existing } = await supabase
        .from("ai_forecast_accuracy")
        .select("id")
        .eq("forecast_id", forecast.id)
        .eq("product_id", item.product_id)
        .maybeSingle();

      if (existing) {
        continue;
      }

      // hitung actual sales
      const { data: salesItems } = await supabase
        .from("sales_items")
        .select(`
          quantity,
          sales:sale_id (
            created_at
          )
        `)
        .eq("product_id", item.product_id);

      const actualSales =
        salesItems?.reduce((sum, sale: any) => {
          return sum + Number(sale.quantity || 0);
        }, 0) || 0;

      const predicted = Number(
        item.predicted_demand_next_week || 0
      );

      const errorValue = Math.abs(predicted - actualSales);

      const accuracy =
        predicted === 0 && actualSales === 0
          ? 100
          : Math.max(
              0,
              100 - (errorValue / Math.max(actualSales, 1)) * 100
            );

      await supabase
        .from("ai_forecast_accuracy")
        .insert({
          forecast_id: forecast.id,
          product_id: item.product_id,
          product_name: item.name,
          predicted_demand: predicted,
          actual_sales: actualSales,
          accuracy_percentage: Number(
            accuracy.toFixed(2)
          ),
          error_value: Number(
            errorValue.toFixed(2)
          ),
        });
    }
  }
}