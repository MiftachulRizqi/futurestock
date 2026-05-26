"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type InventoryValueChartProps = {
  data: {
    category: string;
    value: number;
  }[];
};

export function InventoryValueChart({ data }: InventoryValueChartProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
          Inventory Value
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">
          Nilai Inventaris per Kategori
        </h2>
      </div>

      <div className="h-[320px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Belum ada data produk.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(value) => `${Number(value) / 1000000}jt`}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
                formatter={(value) =>
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(Number(value))
                }
              />
              <Bar
                dataKey="value"
                radius={[12, 12, 0, 0]}
                fill="#22d3ee"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}