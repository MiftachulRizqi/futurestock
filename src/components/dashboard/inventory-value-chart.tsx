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
    <div className="rounded-3xl border border-border bg-card/[0.06] p-5 shadow-2xl shadow-primary/20 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          Inventory Value
        </p>
        <h2 className="mt-2 text-xl font-bold text-foreground">
          Nilai Inventaris per Kategori
        </h2>
      </div>

      <div className="h-[320px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Belum ada data produk.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="category" stroke="var(--border)" fontSize={12} />
              <YAxis
                stroke="var(--border)"
                fontSize={12}
                tickFormatter={(value) => `${Number(value) / 1000000}jt`}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  color: "var(--foreground)",
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
                fill="var(--primary)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}