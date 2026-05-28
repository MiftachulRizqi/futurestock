"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { GlassPanel } from "@/components/shared/glass-panel";
import { formatCurrency } from "@/lib/helpers/format";

type SalesRevenueChartProps = {
  data: {
    day: string;
    revenue: number;
    transactions: number;
  }[];
};

export function SalesRevenueChart({ data }: SalesRevenueChartProps) {
  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground">Revenue 7 Hari</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Grafik penjualan real dari transaksi database.
        </p>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="salesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                color: "var(--foreground)",
              }}
              formatter={(value) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value ?? 0);

                return formatCurrency(numericValue);
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={3}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}