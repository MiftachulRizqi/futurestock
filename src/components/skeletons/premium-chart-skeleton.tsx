import { BarChart3 } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { cn } from "@/lib/utils";

type PremiumChartSkeletonProps = {
  title?: string;
  description?: string;
  className?: string;
};

const bars = [44, 72, 58, 86, 64, 78, 92, 55, 70, 83];

export function PremiumChartSkeleton({
  title = "Memuat grafik",
  description = "FutureStock sedang menyiapkan visualisasi data.",
  className,
}: PremiumChartSkeletonProps) {
  return (
    <GlassPanel className={cn("overflow-hidden p-6", className)}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-foreground">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-muted md:block" />
      </div>

      <div className="relative flex h-72 items-end gap-3 overflow-hidden rounded-3xl border border-border bg-card/40 p-5">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {bars.map((height, index) => (
          <div key={index} className="relative flex flex-1 items-end">
            <div
              className="w-full animate-pulse rounded-t-2xl bg-primary/25"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}