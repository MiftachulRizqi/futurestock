import { createClient } from "@/lib/supabase/server";

export async function evaluateForecastAccuracy() {
  console.log("=== START EVALUATE ACCURACY ===");

  const supabase = await createClient();

  const now = new Date().toISOString();

  console.log("NOW:", now);

  const { data: forecasts, error: forecastError } =
    await supabase
      .from("ai_forecasts")
      .select("*")
      .not("forecast_end_date", "is", null)
      .lte("forecast_end_date", now);

  console.log("FORECAST ERROR:", forecastError);

  console.log("FORECASTS FOUND:", forecasts?.length);

  if (!forecasts || forecasts.length === 0) {
    console.log("NO FINISHED FORECAST");
    return;
  }

  for (const forecast of forecasts) {
    console.log("PROCESS FORECAST:", forecast.id);

    const predictions =
      forecast.forecast_data?.all_product_predictions || [];

    console.log("PREDICTIONS:", predictions.length);

    for (const item of predictions) {
      console.log("CHECK PRODUCT:", item.product_id);

      const { data: saleItems, error: saleItemError } =
        await supabase
          .from("sale_items")
          .select("*")
          .eq("product_id", item.product_id);

      console.log("SALE ITEM ERROR:", saleItemError);

      console.log(
        "SALE ITEMS FOUND:",
        saleItems?.length
      );

      if (!saleItems || saleItems.length === 0) {
        continue;
      }

      let actualSales = 0;

      for (const saleItem of saleItems) {
        const { data: sale, error: saleError } =
          await supabase
            .from("sales")
            .select("sale_date")
            .eq("id", saleItem.sale_id)
            .single();

        console.log("SALE ERROR:", saleError);

        console.log("SALE:", sale);

        if (!sale?.sale_date) {
          continue;
        }

        const saleDate = new Date(sale.sale_date);
        const startDate = new Date(
          forecast.forecast_start_date
        );
        const endDate = new Date(
          forecast.forecast_end_date
        );

        console.log("SALE DATE:", saleDate);
        console.log("START DATE:", startDate);
        console.log("END DATE:", endDate);

        if (
          saleDate >= startDate &&
          saleDate <= endDate
        ) {
          actualSales += saleItem.quantity || 0;
        }
      }

      console.log("ACTUAL SALES:", actualSales);

      const predictedDemand =
        item.predicted_demand_next_week || 0;

      const errorValue = Math.abs(
        predictedDemand - actualSales
      );

      const accuracyPercentage =
        predictedDemand === 0
          ? 0
          : Math.max(
              0,
              100 -
                (errorValue / predictedDemand) * 100
            );

      console.log("INSERTING ACCURACY");

      const { error: insertError } = await supabase
        .from("ai_forecast_accuracy")
        .insert({
          forecast_id: forecast.id,
          product_id: item.product_id,
          predicted_demand: predictedDemand,
          actual_sales: actualSales,
          error_value: errorValue,
          accuracy_percentage:
            accuracyPercentage.toFixed(2),
        });

      console.log("INSERT ERROR:", insertError);
    }
  }

  console.log("=== END EVALUATE ACCURACY ===");
}