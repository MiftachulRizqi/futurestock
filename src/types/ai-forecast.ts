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
  holiday_affected: boolean;
  holiday_multiplier?: number;
  holiday_name?: string;
  promo_recommendation?: string;
  promo_type?: "bundling" | "discount" | "tebus_murah" | null;
};

export type PromoBundle = {
  primary_product_id: string;
  primary_product_name: string;
  secondary_product_id?: string;
  secondary_product_name?: string;
  promo_type: "bundling" | "tebus_murah" | "discount";
  promo_description: string;
  suggested_price?: number;
  discount_percentage?: number;
  urgency_level: "high" | "medium" | "low";
  estimated_clearance_days: number;
};

export type HolidayContext = {
  has_upcoming_holiday: boolean;
  upcoming_holiday: string | null;
  days_until_holiday: number | null;
  holiday_category: string | null;
  impact_multiplier: number | null;
  affected_categories: string[];
  recommendation: string | null;
};

export type AiForecastResult = {
  summary: string;
  holiday_context: HolidayContext;
  promo_bundles: PromoBundle[];
  top_selling_predictions: AiForecastProduct[];
  restock_recommendations: AiForecastProduct[];
  overstock_warnings: AiForecastProduct[];
  dead_stock_risks: AiForecastProduct[];
};