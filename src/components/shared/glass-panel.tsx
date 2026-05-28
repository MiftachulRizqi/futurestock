import { cn } from "@/lib/utils";

type GlassPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card/[0.06] shadow-2xl shadow-primary/20 backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-card/10 before:via-transparent before:to-primary/5",
        className
      )}
    >
      <div className="relative">{children}</div>
    </div>
  );
}