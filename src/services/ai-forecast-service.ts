import { gemini } from "@/lib/ai/gemini";
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

function buildForecastPrompt(salesSummary: SalesSummaryItem[]) {
  return `
Kamu adalah AI inventory forecasting analyst untuk aplikasi FutureStock.

Tugas AI:
1. Menganalisis pola penjualan produk.
2. Memprediksi barang yang berpotensi laku minggu depan.
3. Memberikan rekomendasi jumlah stok ideal.
4. Memberikan warning overstock.
5. Mendeteksi produk yang berisiko menjadi dead stock.

Gunakan data berikut:
- sold_last_7_days untuk tren jangka pendek.
- sold_last_30_days untuk tren bulanan.
- average_daily_sales_30d untuk estimasi demand.
- current_stock dan min_stock untuk rekomendasi restock.
- last_sold_at untuk risiko dead stock.

Aturan:
- Jawab hanya JSON valid.
- Jangan gunakan markdown.
- Gunakan Bahasa Indonesia.
- predicted_demand_next_week sebaiknya mendekati average_daily_sales_30d * 7, disesuaikan tren 7 hari terakhir.
- recommended_stock minimal cukup untuk 2 minggu demand.
- recommended_restock_qty = max(recommended_stock - current_stock, 0).
- overstock_warning true jika stok jauh lebih besar dari demand 30 hari.
- dead_stock_risk high jika tidak ada penjualan lama atau total_sold sangat rendah.
- confidence_score 0 sampai 100.

Data sales summary:
${JSON.stringify(salesSummary, null, 2)}

Format JSON:
{
  "summary": "string",
  "top_selling_predictions": [],
  "restock_recommendations": [],
  "overstock_warnings": [],
  "dead_stock_risks": []
}
`;
}

export async function generateAiForecast(
  salesSummary: SalesSummaryItem[]
): Promise<AiForecastResult> {
  if (salesSummary.length === 0) {
    return {
      summary: "Belum ada data untuk dianalisis.",
      top_selling_predictions: [],
      restock_recommendations: [],
      overstock_warnings: [],
      dead_stock_risks: [],
    };
  }

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildForecastPrompt(salesSummary),
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini tidak mengembalikan hasil analisis.");
  }

  return JSON.parse(text) as AiForecastResult;
}