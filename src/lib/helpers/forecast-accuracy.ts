import { createClient } from "@/lib/supabase/server";

export async function evaluateForecastAccuracy() {
  const supabase = await createClient();

  const { data: forecasts } = await supabase
    .from("ai_forecasts")
    .select("*")
    .order("generated_at", {
      ascending: false,
    });

  if (!forecasts || forecasts.length === 0) {
    return;
  }

  for (const forecast of forecasts) {
    const forecastEndDate =
      forecast.forecast_end_date;

    if (!forecastEndDate) {
      continue;
    }

    // forecast belum selesai
    if (
      new Date(forecastEndDate) >
      new Date()
    ) {
      continue;
    }

    const predictions =
      forecast.forecast_data
        ?.all_product_predictions || [];

    for (const item of predictions) {
      // cek apakah sudah pernah dihitung
      const { data: existing } =
        await supabase
          .from("ai_forecast_accuracy")
          .select("id")
          .eq("forecast_id", forecast.id)
          .eq("product_id", item.product_id)
          .maybeSingle();

      if (existing) {
        continue;
      }

      // ambil sales item
      const { data: salesItems } =
        await supabase
          .from("sales_items")
          .select(`
            quantity,
            sale_id
          `)
          .eq("product_id", item.product_id);

      let actualSales = 0;

      if (salesItems && salesItems.length > 0) {
        for (const saleItem of salesItems) {
          const { data: sale } =
            await supabase
              .from("sales")
              .select("created_at")
              .eq("id", saleItem.sale_id)
              .single();

          if (!sale?.created_at) {
            continue;
          }

          const saleDate = new Date(
            sale.created_at
          );

          if (
            saleDate >=
              new Date(
                forecast.generated_at
              ) &&
            saleDate <=
              new Date(
                forecastEndDate
              )
          ) {
            actualSales +=
              saleItem.quantity;
          }
        }
      }

      const predicted =
        item.predicted_demand_next_week || 0;

      const errorValue = Math.abs(
        predicted - actualSales
      );

      const accuracy =
        predicted === 0 &&
        actualSales === 0
          ? 100
          : predicted === 0
            ? 0
            : Math.max(
                0,
                100 -
                  (errorValue /
                    predicted) *
                    100
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
          accuracy_percentage:
            Number(
              accuracy.toFixed(2)
            ),
          forecast_start_date:
            forecast.generated_at,
          forecast_end_date:
            forecastEndDate,
        });
    }
  }
}

export async function getForecastAccuracy() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("ai_forecast_accuracy")
    .select("*");

  if (!data || data.length === 0) {
    return {
      accuracy: 0,
      averageError: 0,
      comparedPoints: 0,
      actualTotal: 0,
      predictedTotal: 0,
      status:
        "insufficient-data" as const,
      description:
        "Belum ada histori forecast yang bisa dibandingkan.",
    };
  }

  const predictedTotal = data.reduce(
    (sum, item) =>
      sum + item.predicted_demand,
    0
  );

  const actualTotal = data.reduce(
    (sum, item) =>
      sum + item.actual_sales,
    0
  );

  const averageAccuracy =
    data.reduce(
      (sum, item) =>
        sum +
        Number(
          item.accuracy_percentage
        ),
      0
    ) / data.length;

  const averageError =
    data.reduce(
      (sum, item) =>
        sum +
        Number(item.error_value),
      0
    ) / data.length;

  let status:
    | "excellent"
    | "good"
    | "needs-improvement"
    | "insufficient-data";

  if (averageAccuracy >= 85) {
    status = "excellent";
  } else if (
    averageAccuracy >= 70
  ) {
    status = "good";
  } else {
    status = "needs-improvement";
  }

  return {
    accuracy: Number(
      averageAccuracy.toFixed(1)
    ),
    averageError: Number(
      averageError.toFixed(1)
    ),
    comparedPoints: data.length,
    actualTotal,
    predictedTotal,
    status,
    description:
      averageAccuracy >= 85
        ? "Forecast AI sangat akurat terhadap penjualan aktual."
        : averageAccuracy >= 70
          ? "Forecast AI cukup baik dan stabil."
          : "Forecast masih membutuhkan lebih banyak histori transaksi.",
  };
}