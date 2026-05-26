import { BrainCircuit } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";

type AnalyticsInsightProps = {
  insight: string;
};

export function AnalyticsInsight({
  insight,
}: AnalyticsInsightProps) {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <BrainCircuit className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            AI Business Insight
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            {insight}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}