import { AlertTriangle, Gift, Tag, Sparkles } from "lucide-react";
import type { PromoBundle } from "@/types/ai-forecast";
import { GlassPanel } from "@/components/shared/glass-panel";

type OverstockPromoAlertProps = {
  promoBundles: PromoBundle[];
};

export function OverstockPromoAlert({ promoBundles }: OverstockPromoAlertProps) {
  if (!promoBundles || promoBundles.length === 0) {
    return null;
  }

  return (
    <GlassPanel className="border-primary/30 bg-linear-to-br from-primary/20 to-primary/20 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
          <Gift className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Rekomendasi Promo Pintar
          </h2>
          <p className="text-sm text-muted-foreground">
            Saran AI untuk menghabiskan stok berlebih
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {promoBundles.map((bundle, index) => (
          <PromoBundleCard key={index} bundle={bundle} />
        ))}
      </div>
    </GlassPanel>
  );
}

function PromoBundleCard({ bundle }: { bundle: PromoBundle }) {
  const getPromoIcon = () => {
    switch (bundle.promo_type) {
      case "bundling":
        return <Sparkles className="h-4 w-4" />;
      case "tebus_murah":
        return <Tag className="h-4 w-4" />;
      case "discount":
        return <Gift className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPromoTypeLabel = () => {
    switch (bundle.promo_type) {
      case "bundling":
        return "Bundling";
      case "tebus_murah":
        return "Tebus Murah";
      case "discount":
        return "Diskon";
      default:
        return "Promo";
    }
  };

  const getUrgencyColor = () => {
    switch (bundle.urgency_level) {
      case "high":
        return "bg-red-400/20 text-red-300 border-red-400/30";
      case "medium":
        return "bg-amber-400/20 text-amber-300 border-amber-400/30";
      case "low":
        return "bg-emerald-400/20 text-emerald-300 border-emerald-400/30";
      default:
        return "bg-slate-400/20 text-slate-300 border-slate-400/30";
    }
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
              {getPromoIcon()}
            </div>
            <span className="text-sm font-semibold text-primary">
              {getPromoTypeLabel()}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs ${getUrgencyColor()}`}
            >
              {bundle.urgency_level === "high"
                ? "Urgent"
                : bundle.urgency_level === "medium"
                ? "Sedang"
                : "Normal"}
            </span>
          </div>

          <p className="text-sm font-medium text-foreground mb-2">
            {bundle.primary_product_name}
            {bundle.secondary_product_name && (
              <span className="text-muted-foreground"> + {bundle.secondary_product_name}</span>
            )}
          </p>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {bundle.promo_description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {bundle.suggested_price && (
              <span className="rounded-full border border-border bg-card/5 px-2 py-1 text-muted-foreground">
                Harga Promo: Rp{bundle.suggested_price.toLocaleString()}
              </span>
            )}
            {bundle.discount_percentage && (
              <span className="rounded-full border border-border bg-card/5 px-2 py-1 text-muted-foreground">
                Diskon: {bundle.discount_percentage}%
              </span>
            )}
            <span className="rounded-full border border-border bg-card/5 px-2 py-1 text-muted-foreground">
              Estimasi Clearance: {bundle.estimated_clearance_days} hari
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}