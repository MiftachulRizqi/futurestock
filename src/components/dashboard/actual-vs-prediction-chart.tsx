"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Filter,
  Gauge,
  Percent,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";

import {
  forecastCategories,
  salesRangeLabels,
  type ForecastRange,
  type SalesForecastPoint,
} from "@/data/dashboard-insights";
import { cn } from "@/lib/utils";

type ActualVsPredictionChartProps = {
  data?: Record<ForecastRange, SalesForecastPoint[]>;
  defaultRange?: ForecastRange;
  isLoading?: boolean;
  className?: string;
};

type AggregatedForecastPoint = {
  date: string;
  label: string;
  period: string;
  actual: number;
  prediction: number;
  error: number;
};

const allCategoriesLabel = "Semua";
const rangeOptions: ForecastRange[] = ["daily", "weekly", "monthly"];
const emptyForecastData: Record<ForecastRange, SalesForecastPoint[]> = {
  daily: [],
  weekly: [],
  monthly: [],
};

const chartColors = {
  actual: "#22c55e",
  prediction: "#8b5cf6",
  error: "#f97316",
};

export function ActualVsPredictionChart({
  data = emptyForecastData,
  defaultRange = "weekly",
  isLoading = false,
  className,
}: ActualVsPredictionChartProps) {
  const [range, setRange] = useState<ForecastRange>(defaultRange);
  const [category, setCategory] = useState(allCategoriesLabel);

  const categoryOptions = useMemo(() => getCategoryOptions(data), [data]);
  const rangeData = useMemo(() => data[range] ?? [], [data, range]);

  const filteredSourceData = useMemo(() => {
    if (category === allCategoriesLabel) {
      return rangeData;
    }

    return rangeData.filter((item) => item.category === category);
  }, [category, rangeData]);

  const chartData = useMemo(
    () => aggregateForecastPoints(filteredSourceData),
    [filteredSourceData]
  );
  const stats = useMemo(() => getSalesStats(chartData), [chartData]);
  const insights = useMemo(
    () =>
      getForecastInsights({
        chartData,
        range,
        sourceData: filteredSourceData,
        stats,
      }),
    [chartData, filteredSourceData, range, stats]
  );

  if (isLoading) {
    return <ActualVsPredictionChartSkeleton className={className} />;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-300">
                AI/ML Forecast
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Grafik Aktual vs Prediksi
              </h2>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Pantau akurasi prediksi penjualan per kategori agar keputusan
            restock lebih cepat dan presisi.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] xl:min-w-[470px]">
          <div className="min-w-0">
            <label
              htmlFor="forecast-category"
              className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"
            >
              <Filter className="h-3.5 w-3.5" />
              Filter kategori
            </label>

            <select
              id="forecast-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-medium text-white outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Periode</p>
            <div className="grid grid-cols-3 rounded-xl border border-white/10 bg-slate-950/70 p-1">
              {rangeOptions.map((option) => {
                const active = option === range;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRange(option)}
                    className={cn(
                      "h-9 rounded-lg px-3 text-xs font-semibold transition sm:text-sm",
                      active
                        ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {salesRangeLabels[option]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ForecastMetric
          icon={Activity}
          label="Total aktual"
          value={formatCompactNumber(stats.totalActual)}
          tone="emerald"
        />
        <ForecastMetric
          icon={TrendingUp}
          label="Total prediksi"
          value={formatCompactNumber(stats.totalPrediction)}
          tone="violet"
        />
        <ForecastMetric
          icon={Percent}
          label="Akurasi prediksi"
          value={`${stats.accuracy}%`}
          tone="blue"
        />
        <ForecastMetric
          icon={Gauge}
          label="Rata-rata error"
          value={formatCompactNumber(stats.averageError)}
          tone="amber"
        />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <div
            key={insight}
            className="rounded-xl border border-white/10 bg-slate-950/45 p-4"
          >
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                {index === 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : index === 1 ? (
                  <Activity className="h-4 w-4" />
                ) : (
                  <Percent className="h-4 w-4" />
                )}
              </div>
              <p className="text-sm leading-6 text-slate-300">{insight}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 h-[320px] min-w-0 md:h-[390px]">
        {chartData.length === 0 ? (
          <ForecastEmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart
              data={chartData}
              margin={{ top: 14, right: 18, bottom: 8, left: -10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
                fontSize={12}
                tickMargin={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={formatCompactNumber}
              />
              <Tooltip
                content={ChartTooltip}
                cursor={{ stroke: "#22c55e", strokeOpacity: 0.18 }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  color: "#cbd5e1",
                  fontSize: "12px",
                  paddingTop: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                name="Aktual"
                stroke={chartColors.actual}
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2, fill: "#020617" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#4ade80" }}
                isAnimationActive
                animationDuration={900}
              />
              <Line
                type="monotone"
                dataKey="prediction"
                name="Prediksi"
                stroke={chartColors.prediction}
                strokeWidth={3}
                strokeDasharray="7 7"
                dot={{ r: 3, strokeWidth: 2, fill: "#020617" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#a78bfa" }}
                isAnimationActive
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.section>
  );
}

function ForecastMetric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "emerald" | "violet" | "blue" | "amber";
}) {
  const toneClass = {
    emerald: "bg-emerald-400/15 text-emerald-300",
    violet: "bg-violet-400/15 text-violet-300",
    blue: "bg-blue-400/15 text-blue-300",
    amber: "bg-amber-400/15 text-amber-300",
  }[tone];

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            toneClass
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const period = payload[0]?.payload as AggregatedForecastPoint | undefined;
  const actual = Number(period?.actual ?? 0);
  const prediction = Number(period?.prediction ?? 0);
  const error = actual - prediction;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-3 text-sm shadow-2xl shadow-black/30">
      <p className="font-semibold text-white">{period?.period ?? label}</p>
      <div className="mt-3 space-y-2">
        {payload.map((entry) => (
          <div
            key={`${entry.name}-${String(entry.value)}`}
            className="flex min-w-44 items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-400">{entry.name}</span>
            </div>
            <span className="font-semibold text-white">
              {formatCompactNumber(Number(entry.value))}
            </span>
          </div>
        ))}

        <div className="flex min-w-44 items-center justify-between gap-6 border-t border-white/10 pt-2">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: chartColors.error }}
            />
            <span className="text-slate-400">Selisih error</span>
          </div>
          <span className="font-semibold text-white">
            {error >= 0 ? "+" : ""}
            {formatCompactNumber(error)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ForecastEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30 p-6 text-center">
      <TriangleAlert className="h-10 w-10 text-slate-600" />
      <p className="mt-3 text-sm font-medium text-white">
        Belum ada data grafik
      </p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        Data aktual dan prediksi akan muncul setelah tersedia dari sumber data.
      </p>
    </div>
  );
}

function ActualVsPredictionChartSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur",
        className
      )}
    >
      <div className="flex animate-pulse flex-col gap-5">
        <div className="h-12 w-64 rounded-2xl bg-white/10" />
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-xl bg-white/10" />
          ))}
        </div>
        <div className="h-[340px] rounded-2xl bg-white/10" />
      </div>
    </section>
  );
}

function getCategoryOptions(data: Record<ForecastRange, SalesForecastPoint[]>) {
  const categories = new Set<string>(
    forecastCategories.filter((category) => category !== allCategoriesLabel)
  );

  Object.values(data).forEach((points) => {
    points.forEach((point) => categories.add(point.category));
  });

  return [allCategoriesLabel, ...Array.from(categories)];
}

function aggregateForecastPoints(data: SalesForecastPoint[]) {
  const grouped = new Map<string, AggregatedForecastPoint>();

  data.forEach((point) => {
    const existing = grouped.get(point.date);

    if (existing) {
      existing.actual += point.actual;
      existing.prediction += point.prediction;
      existing.error = existing.actual - existing.prediction;
      return;
    }

    grouped.set(point.date, {
      date: point.date,
      label: point.label,
      period: point.period,
      actual: point.actual,
      prediction: point.prediction,
      error: point.error,
    });
  });

  return Array.from(grouped.values()).sort((first, second) =>
    first.date.localeCompare(second.date)
  );
}

function getSalesStats(data: AggregatedForecastPoint[]) {
  const totalActual = data.reduce((total, item) => total + item.actual, 0);
  const totalPrediction = data.reduce(
    (total, item) => total + item.prediction,
    0
  );
  const averageError =
    data.reduce((total, item) => total + Math.abs(item.error), 0) /
    Math.max(data.length, 1);

  const errorRates = data
    .filter((item) => item.actual > 0)
    .map((item) => Math.abs(item.error) / item.actual);

  const averageErrorRate =
    errorRates.reduce((total, value) => total + value, 0) /
    Math.max(errorRates.length, 1);

  const accuracy = Math.max(0, Math.min(100, 100 - averageErrorRate * 100));

  return {
    totalActual,
    totalPrediction,
    averageError: Math.round(averageError),
    accuracy: Number(accuracy.toFixed(1)),
  };
}

function getForecastInsights({
  chartData,
  range,
  sourceData,
  stats,
}: {
  chartData: AggregatedForecastPoint[];
  range: ForecastRange;
  sourceData: SalesForecastPoint[];
  stats: ReturnType<typeof getSalesStats>;
}) {
  if (chartData.length === 0) {
    return [
      "Belum ada data penjualan untuk menghasilkan insight otomatis.",
      "Tambahkan transaksi agar tren produk dapat dianalisis.",
      "Akurasi prediksi akan dihitung setelah data aktual tersedia.",
    ];
  }

  const last = chartData[chartData.length - 1];
  const previous = chartData[Math.max(chartData.length - 2, 0)];
  const predictionChange =
    previous.prediction > 0
      ? ((last.prediction - previous.prediction) / previous.prediction) * 100
      : 0;
  const direction = predictionChange >= 0 ? "meningkat" : "menurun";
  const nextPeriodLabel = getNextPeriodLabel(range);
  const trendingProduct = getTopTrendingProduct(sourceData);

  return [
    `Prediksi penjualan ${nextPeriodLabel} ${direction} ${Math.abs(
      predictionChange
    ).toFixed(0)}% dibanding periode terakhir.`,
    trendingProduct
      ? `${trendingProduct.productName} memiliki tren kenaikan tertinggi di kategori ${trendingProduct.category}.`
      : "Belum ada produk dengan tren kenaikan yang cukup kuat.",
    `Akurasi prediksi mencapai ${stats.accuracy}% dengan rata-rata error ${formatCompactNumber(
      stats.averageError
    )} unit.`,
  ];
}

function getNextPeriodLabel(range: ForecastRange) {
  const labels: Record<ForecastRange, string> = {
    daily: "besok",
    weekly: "minggu depan",
    monthly: "bulan depan",
  };

  return labels[range];
}

function getTopTrendingProduct(sourceData: SalesForecastPoint[]) {
  const grouped = new Map<
    string,
    {
      productName: string;
      category: string;
      points: SalesForecastPoint[];
    }
  >();

  sourceData.forEach((point) => {
    const existing = grouped.get(point.productName);

    if (existing) {
      existing.points.push(point);
      return;
    }

    grouped.set(point.productName, {
      productName: point.productName,
      category: point.category,
      points: [point],
    });
  });

  return Array.from(grouped.values())
    .map((item) => {
      const sortedPoints = [...item.points].sort((first, second) =>
        first.date.localeCompare(second.date)
      );
      const first = sortedPoints[0];
      const last = sortedPoints[sortedPoints.length - 1];
      const growth =
        first.actual > 0
          ? ((last.actual - first.actual) / first.actual) * 100
          : 0;

      return {
        productName: item.productName,
        category: item.category,
        growth,
      };
    })
    .sort((first, second) => second.growth - first.growth)[0];
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: Math.abs(value) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(value) >= 1000 ? 1 : 0,
  }).format(value);
}
