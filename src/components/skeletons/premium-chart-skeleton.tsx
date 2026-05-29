import { GlassPanel } from "@/components/shared/glass-panel";

const bars = [46, 68, 52, 82, 61, 74, 88, 57, 70, 94];

export function PremiumChartSkeleton() {
  return (
    <GlassPanel className="overflow-hidden p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-5 w-44 animate-pulse rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="h-10 w-28 animate-pulse rounded-xl bg-white/10" />
      </div>

      <div className="relative flex h-72 items-end gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

        {bars.map((height, index) => (
          <div key={index} className="relative flex flex-1 items-end">
            <div
              className="w-full rounded-t-2xl bg-primary/30"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}