export type ForecastRange = "daily" | "weekly" | "monthly";

export type SalesForecastPoint = {
  id: string;
  date: string;
  label: string;
  period: string;
  category: string;
  productName: string;
  actual: number | null;
  prediction: number | null;
  error: number | null;
};

export const salesRangeLabels: Record<ForecastRange, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
};

export const forecastCategories = ["Semua"] as const;
