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
    <div className="rounded-3xl border border-border bg-card/[0.06] p-5 shadow-2xl shadow-primary/20 backdrop-blur">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          Inventory Health
        </p>
        <h2 className="mt-2 text-xl font-bold text-foreground">
          Kesehatan Inventaris
        </h2>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <p className="text-5xl font-bold text-foreground">{value}%</p>
          <p className="text-sm text-muted-foreground">{totalProducts} produk</p>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-2xl font-bold text-primary">
            {lowStockCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Stok menipis</p>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-2xl font-bold text-primary">{inactiveCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Produk nonaktif</p>
        </div>
      </div>
    </div>
  );
}