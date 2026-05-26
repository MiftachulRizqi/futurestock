import type { AiForecastResult } from "./ai-forecast";

export type AiForecastCache = {
  id: string;
  generated_at: string;
  summary: string;
  forecast_data: AiForecastResult;
  total_products: number;
  total_transactions: number;
  ai_model: string;
};