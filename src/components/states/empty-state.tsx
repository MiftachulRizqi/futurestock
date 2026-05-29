import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-border bg-card/80 p-8 text-center shadow-sm",
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon ?? <PackageSearch className="h-8 w-8" />}
      </div>

      <h3 className="text-xl font-bold text-foreground">{title}</h3>

      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}