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
        <h2 className="text-xl font-bold text-white">Revenue 7 Hari</h2>

        <p className="mt-1 text-sm text-slate-400">
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
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                color: "#fff",
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
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}