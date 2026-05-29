import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { cn } from "@/lib/utils";

type InventoryEmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  secondaryAction?: ReactNode;
  className?: string;
};

export function InventoryEmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  secondaryAction,
  className,
}: InventoryEmptyStateProps) {
  return (
    <GlassPanel
      className={cn(
        "relative overflow-hidden p-8 text-center md:p-10",
        className
      )}
    >
      <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/15 bg-primary/10 text-primary">
        {icon ?? <PackageSearch className="h-10 w-10" />}
      </div>

      <h3 className="relative mt-6 text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="relative mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {(actionLabel && actionHref) || secondaryAction ? (
        <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {actionLabel && actionHref ? (
            <Button asChild>
              <Link href={actionHref}>
                {actionLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}

          {secondaryAction}
        </div>
      ) : null}

      <div className="relative mt-8 grid gap-3 md:grid-cols-3">
        <MiniEmptyPoint label="Produk" />
        <MiniEmptyPoint label="Transaksi" />
        <MiniEmptyPoint label="Insight" icon={<BarChart3 className="h-4 w-4" />} />
      </div>
    </GlassPanel>
  );
}

function MiniEmptyPoint({
  label,
  icon,
}: {
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 px-4 py-3">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon ?? <PackageSearch className="h-4 w-4" />}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}