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
  cyan: "from-primary/20 to-primary/10 text-primary",
  violet: "from-primary/20 to-primary/10 text-primary",
  emerald: "from-primary/20 to-primary/10 text-primary",
  amber: "from-primary/20 to-primary/10 text-primary",
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
      <GlassPanel className="group p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
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