import type React from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { cn } from "@/lib/utils";

function SkeletonBlock({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-white/[0.08]",
        className
      )}
      {...props}
    />
  );
}

function PageHeaderSkeleton({
  withAction = true,
}: {
  withAction?: boolean;
}) {
  return (
    <GlassPanel className="p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-9 w-56" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>

        {withAction ? <SkeletonBlock className="h-11 w-40" /> : null}
      </div>
    </GlassPanel>
  );
}

function StatCardsSkeleton({
  count = 4,
}: {
  count?: number;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <GlassPanel key={index} className="p-5">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />

          <SkeletonBlock className="mt-5 h-4 w-28" />

          <SkeletonBlock className="mt-3 h-8 w-24" />

          <SkeletonBlock className="mt-4 h-3 w-36" />
        </GlassPanel>
      ))}
    </section>
  );
}

function TableSkeleton({
  rows = 7,
}: {
  rows?: number;
}) {
  return (
    <GlassPanel className="overflow-hidden p-0">
      <div className="border-b border-white/10 p-5">
        <SkeletonBlock className="h-6 w-44" />
        <SkeletonBlock className="mt-3 h-4 w-72 max-w-full" />
      </div>

      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 border-b border-white/10 p-5 last:border-b-0"
          >
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-8 w-20 justify-self-end rounded-xl" />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function ChartSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-5 w-44" />
          <SkeletonBlock className="mt-3 h-4 w-64 max-w-full" />
        </div>

        <SkeletonBlock className="h-9 w-24" />
      </div>

      <div className="flex h-64 items-end gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className="w-full rounded-t-2xl"
            style={{
              height: `${35 + ((index * 13) % 55)}%`,
            }}
          />
        ))}
      </div>
    </GlassPanel>
  );
}

function FormSkeleton({
  fields = 5,
}: {
  fields?: number;
}) {
  return (
    <GlassPanel className="p-6">
      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index}>
            <SkeletonBlock className="mb-3 h-4 w-32" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <SkeletonBlock className="h-11 w-28" />
          <SkeletonBlock className="h-11 w-36" />
        </div>
      </div>
    </GlassPanel>
  );
}

export function DashboardPageSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SkeletonBlock className="h-72 rounded-3xl border border-white/10 bg-white/[0.06]" />

        <StatCardsSkeleton count={4} />

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <ChartSkeleton className="min-h-[420px]" />

          <ChartSkeleton className="min-h-[420px]" />
        </div>
      </div>
    </DashboardLayout>
  );
}

export function TablePageSkeleton({
  stats = 0,
  rows = 7,
  withAction = true,
}: {
  stats?: number;
  rows?: number;
  withAction?: boolean;
}) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton withAction={withAction} />

        {stats > 0 ? <StatCardsSkeleton count={stats} /> : null}

        <TableSkeleton rows={rows} />
      </div>
    </DashboardLayout>
  );
}

export function FormPageSkeleton({
  fields = 5,
}: {
  fields?: number;
}) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton withAction={false} />

        <FormSkeleton fields={fields} />
      </div>
    </DashboardLayout>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton withAction={false} />

        <StatCardsSkeleton count={3} />

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <ChartSkeleton className="min-h-[420px]" />

          <TableSkeleton rows={6} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export function PredictionPageSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton withAction />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassPanel className="p-6">
            <SkeletonBlock className="h-5 w-44" />

            <SkeletonBlock className="mt-4 h-24 w-full" />

            <SkeletonBlock className="mt-4 h-24 w-full" />

            <SkeletonBlock className="mt-4 h-12 w-40" />
          </GlassPanel>

          <ChartSkeleton className="min-h-[430px]" />
        </div>

        <TableSkeleton rows={5} />
      </div>
    </DashboardLayout>
  );
}

export function SettingsPageSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton withAction={false} />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassPanel className="p-6">
            <SkeletonBlock className="h-16 w-16 rounded-full" />

            <SkeletonBlock className="mt-5 h-6 w-48" />

            <SkeletonBlock className="mt-3 h-4 w-72" />

            <SkeletonBlock className="mt-6 h-11 w-36" />
          </GlassPanel>

          <FormSkeleton fields={4} />
        </div>
      </div>
    </DashboardLayout>
  );
}