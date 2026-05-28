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

function buildForecastPrompt(salesSummary: SalesSummaryItem[], currentDate: string) {
  return `
Kamu adalah AI inventory forecasting analyst senior untuk aplikasi FutureStock di Indonesia.

TANGGAL HARI INI: ${currentDate}

Tugas AI:
1. Analisis apakah ada hari besar keagamaan, nasional, atau event musiman di Indonesia dalam 30 hari ke depan dari tanggal hari ini.
2. Jika ADA HARI BESAR: Tentukan nama, prediksi multiplier demand, dan kategori produk yang terdampak. Kalikan hasil prediksi demand produk tersebut dengan multiplier. Set holiday_affected menjadi true.
3. Jika TIDAK ADA HARI BESAR: Set has_upcoming_holiday menjadi false, set semua multiplier menjadi null, dan pastikan holiday_affected pada semua produk diset false.
4. Analisis tren penjualan untuk memprediksi demand SEMUA PRODUK tanpa terkecuali untuk minggu depan ke dalam array "all_product_predictions".
5. Berikan rekomendasi stok ideal dan warning overstock.
6. Berikan rekomendasi promo kreatif khusus untuk produk overstock di bagian "promo_bundles".

Aturan Ketat:
- Jawab HANYA menggunakan format JSON valid tanpa format markdown.
- Gunakan Bahasa Indonesia.
- promo_recommendation: HARUS BERUPA TEKS SINGKAT STRING BUKAN OBJEK.

Data sales summary (JSON):
${JSON.stringify(salesSummary, null, 2)}

Format Output JSON:
{
  "summary": "string",
  "holiday_context": {
    "has_upcoming_holiday": boolean,
    "upcoming_holiday": "string atau null",
    "days_until_holiday": "number atau null",
    "holiday_category": "string atau null",
    "impact_multiplier": "number atau null",
    "affected_categories": [],
    "recommendation": "string atau null"
  },
  "promo_bundles": [
    {
      "primary_product_id": "string",
      "primary_product_name": "string",
      "secondary_product_id": "string atau null",
      "secondary_product_name": "string atau null",
      "promo_type": "bundling|tebus_murah|discount",
      "promo_description": "string",
      "suggested_price": "number atau null",
      "discount_percentage": "number atau null",
      "urgency_level": "high|medium|low",
      "estimated_clearance_days": "number"
    }
  ],
  "all_product_predictions": [ "ISI DENGAN SEMUA DATA PRODUK MENGGUNAKAN FORMAT PRODUK AI DI BAWAH" ],
  "restock_recommendations": [ "ISI DENGAN FORMAT PRODUK AI DI BAWAH" ],
  "overstock_warnings": [ "ISI DENGAN FORMAT PRODUK AI DI BAWAH" ],
  "dead_stock_risks": [ "ISI DENGAN FORMAT PRODUK AI DI BAWAH" ]
}

Format Produk AI:
{
  "product_id": "string",
  "name": "string",
  "sku": "string",
  "category": "string",
  "current_stock": 0,
  "min_stock": 0,
  "predicted_demand_next_week": 0,
  "recommended_stock": 0,
  "recommended_restock_qty": 0,
  "overstock_warning": false,
  "dead_stock_risk": "low|medium|high",
  "sales_potential": "low|medium|high",
  "confidence_score": 0,
  "reason": "string",
  "holiday_affected": false,
  "holiday_multiplier": null,
  "holiday_name": null,
  "promo_recommendation": "string",
  "promo_type": "bundling|tebus_murah|discount|null"
}
`;
}

export async function generateAiForecast(
  salesSummary: SalesSummaryItem[]
): Promise<AiForecastResult> {
  if (salesSummary.length === 0) {
    return {
      summary: "Belum ada data penjualan untuk dianalisis oleh AI.",
      holiday_context: {
        has_upcoming_holiday: false,
        upcoming_holiday: null,
        days_until_holiday: null,
        holiday_category: null,
        impact_multiplier: null,
        affected_categories: [],
        recommendation: null,
      },
      promo_bundles: [],
      all_product_predictions: [],
      restock_recommendations: [],
      overstock_warnings: [],
      dead_stock_risks: [],
    };
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildForecastPrompt(salesSummary, currentDate),
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini gagal mengembalikan hasil analisis JSON.");
  }

  return JSON.parse(text) as AiForecastResult;
}