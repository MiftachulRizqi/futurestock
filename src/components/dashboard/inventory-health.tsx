type InventoryHealthProps = {
  value: number;
  totalProducts: number;
  lowStockCount: number;
  inactiveCount: number;
};

export function InventoryHealth({
  value,
  totalProducts,
  lowStockCount,
  inactiveCount,
}: InventoryHealthProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
          Inventory Health
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">
          Kesehatan Inventaris
        </h2>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <p className="text-5xl font-bold text-white">{value}%</p>
          <p className="text-sm text-slate-400">{totalProducts} produk</p>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-2xl font-bold text-amber-300">
            {lowStockCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">Stok menipis</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-2xl font-bold text-rose-300">{inactiveCount}</p>
          <p className="mt-1 text-xs text-slate-400">Produk nonaktif</p>
        </div>
      </div>
    </div>
  );
}