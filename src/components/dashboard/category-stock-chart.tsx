"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#22d3ee", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

type CategoryStockChartProps = {
  data: {
    category: string;
    stock: number;
  }[];
};

export function CategoryStockChart({ data }: CategoryStockChartProps) {
  return (
    <div className="rounded-3xl border border-border bg-card/[0.06] p-5 shadow-2xl shadow-primary/20 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          Stock Distribution
        </p>
        <h2 className="mt-2 text-xl font-bold text-foreground">
          Distribusi Stok
        </h2>
      </div>

      <div className="h-[280px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Belum ada data stok.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="stock"
                nameKey="category"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  color: "var(--foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {data.slice(0, 5).map((item, index) => (
          <div
            key={item.category}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.category}</span>
            </div>
            <span className="font-medium text-foreground">{item.stock}</span>
          </div>
        ))}
      </div>
    </div>
  );
}