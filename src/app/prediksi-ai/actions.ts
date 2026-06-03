"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { getProducts } from "@/services/product-service";
import { getSales } from "@/services/sales-service";
import { getCurrentStore } from "@/services/store-service";
import { logActivity } from "@/services/activity-log-service";
import { saveForecastHistory } from "@/services/forecast-history-service";

import { getSalesSummaryForAi } from "@/lib/helpers/sales-summary";
import { getSmartAiForecastWithMeta } from "@/services/ai-orchestrator";

export async function regenerateAiForecastAction() {
  const products = await getProducts();
  const sales = await getSales();

  console.log(
    "TOTAL SALES SAAT GENERATE:",
    sales.length
  );

  const salesSummary = getSalesSummaryForAi(
    products,
    sales
  );

  const forecastResult =
    await getSmartAiForecastWithMeta({
      salesSummary,
      totalProducts: products.length,
      totalTransactions: sales.length,
      forceRefresh: true,
    });

  const currentStore =
    await getCurrentStore();

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (currentStore?.store?.id) {
    // simpan histori forecast
    await saveForecastHistory({
      storeId:
        currentStore.store.id,
      forecast:
        forecastResult.forecast,
    });

    // activity log
    await logActivity({
      storeId:
        currentStore.store.id,

      userId:
        user?.id,

      action: "generate",

      entityType:
        "ai_forecast",

      title:
        "Forecast AI diperbarui",

      description:
        "Prediksi AI berhasil dibuat ulang menggunakan data terbaru.",

      metadata: {
        total_products:
          products.length,

        total_transactions:
          sales.length,

        source:
          forecastResult.source,
      },
    });
  }

  revalidatePath("/prediksi-ai");
  revalidatePath("/dashboard");
  revalidatePath("/analitik");
  revalidatePath("/dead-stock");
  revalidatePath("/laporan");

  redirect(
    "/prediksi-ai?toast=ai-forecast-generated"
  );
}