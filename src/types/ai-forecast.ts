export type AiForecastProduct = {
  product_id: string;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock: number;
  predicted_demand_next_week: number;
  recommended_stock: number;
  recommended_restock_qty: number;
  overstock_warning: boolean;
  dead_stock_risk: "low" | "medium" | "high";
  sales_potential: "low" | "medium" | "high";
  confidence_score: number;
  reason: string;
};

export type AiForecastResult = {
  summary: string;
  top_selling_predictions: AiForecastProduct[];
  restock_recommendations: AiForecastProduct[];
  overstock_warnings: AiForecastProduct[];
  dead_stock_risks: AiForecastProduct[];
};