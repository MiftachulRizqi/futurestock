import type { Product } from "@/types/product";
import type { SaleWithItems } from "@/types/sales";
import { getActualVsPredictionChartData } from "@/lib/helpers/forecast-chart-data";

export type ForecastAccuracyResult = {
  accuracy: number;
  averageError: number;
  comparedPoints: number;
  actualTotal: number;
  predictedTotal: number;
  status: "excellent" | "good" | "needs-improvement" | "insufficient-data";
  description: string;
};

export function getForecastAccuracy(
  products: Product[],
  sales: SaleWithItems[]
): ForecastAccuracyResult {
  const chartData = getActualVsPredictionChartData(products, sales);
  const weeklyPoints = chartData.weekly;

  const comparablePoints = weeklyPoints.filter((point) => {
    return (
      typeof point.actual === "number" &&
      typeof point.prediction === "number" &&
      point.prediction > 0
    );
  });

  if (comparablePoints.length === 0) {
    return {
      accuracy: 0,
      averageError: 0,
      comparedPoints: 0,
      actualTotal: 0,
      predictedTotal: 0,
      status: "insufficient-data",
      description:
        "Belum cukup data historis untuk menghitung akurasi forecast.",
    };
  }

  const actualTotal = comparablePoints.reduce((total, point) => {
    return total + Number(point.actual || 0);
  }, 0);

  const predictedTotal = comparablePoints.reduce((total, point) => {
    return total + Number(point.prediction || 0);
  }, 0);

  const absoluteError = Math.abs(actualTotal - predictedTotal);

  const accuracy =
    actualTotal === 0
      ? 0
      : Math.max(0, Math.round((1 - absoluteError / actualTotal) * 100));

  const averageError = Math.round(absoluteError / comparablePoints.length);

  const status =
    accuracy >= 85
      ? "excellent"
      : accuracy >= 70
        ? "good"
        : "needs-improvement";

  const description =
    status === "excellent"
      ? "Akurasi forecast sangat baik berdasarkan histori penjualan."
      : status === "good"
        ? "Akurasi forecast cukup baik, tetapi masih bisa ditingkatkan dengan data transaksi tambahan."
        : "Akurasi forecast masih perlu ditingkatkan. Tambahkan lebih banyak data transaksi agar pola penjualan lebih stabil.";

  return {
    accuracy,
    averageError,
    comparedPoints: comparablePoints.length,
    actualTotal,
    predictedTotal,
    status,
    description,
  };
}