import type { LucideIcon } from "lucide-react";
import { AnimatedContainer } from "@/components/shared/animated-container";
import { GlassPanel } from "@/components/shared/glass-panel";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  tone?: "cyan" | "violet" | "emerald" | "amber";
};

const toneMap = {
  cyan: "from-cyan-400/20 to-blue-500/10 text-cyan-300",
  violet: "from-violet-400/20 to-fuchsia-500/10 text-violet-300",
  emerald: "from-emerald-400/20 to-cyan-500/10 text-emerald-300",
  amber: "from-amber-400/20 to-orange-500/10 text-amber-300",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  delay = 0,
  tone = "cyan",
}: StatCardProps) {
  return (
    <AnimatedContainer delay={delay}>
      <GlassPanel className="group p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-cyan-500/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white">
              {value}
            </p>
            <p className="mt-2 text-xs text-slate-500">{description}</p>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneMap[tone]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </GlassPanel>
    </AnimatedContainer>
  );
}