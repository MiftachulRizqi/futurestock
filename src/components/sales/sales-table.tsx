import Link from "next/link";
import { Trash2 } from "lucide-react";

import type { SaleWithItems } from "@/types/sales";
import { formatCurrency } from "@/lib/helpers/format";
import { deleteSaleAction } from "@/app/transaksi/actions";

type SalesTableProps = {
  sales: SaleWithItems[];
};

export function SalesTable({ sales }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/[0.06] p-8 text-center">
        <p className="font-medium text-foreground">Belum ada transaksi</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Tambahkan transaksi pertama agar AI bisa membaca pola penjualan.
        </p>

        <Link
          href="/transaksi/tambah"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Tambah Transaksi
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-border bg-card/[0.06]">
      <table className="w-full min-w-[1050px] text-sm">
        <thead className="bg-card/5 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Invoice</th>

            <th className="px-4 py-3 text-left">Customer</th>

            <th className="px-4 py-3 text-left">Item</th>

            <th className="px-4 py-3 text-left">Total Qty</th>

            <th className="px-4 py-3 text-left">Pembayaran</th>

            <th className="px-4 py-3 text-left">Tanggal</th>

            <th className="px-4 py-3 text-right">Total</th>

            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((sale) => {
            const totalQty = sale.sales_items.reduce((total, item) => {
              return total + Number(item.quantity);
            }, 0);

            return (
              <tr
                key={sale.id}
                className="border-t border-border transition hover:bg-card/[0.03]"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {sale.invoice_number}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {sale.customer_name || "Pelanggan Umum"}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">
                      {sale.sales_items.length} item
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {sale.sales_items
                        .map((item) => item.products?.name)
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(", ")}

                      {sale.sales_items.length > 2 ? " ..." : ""}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="inline-flex min-w-[70px] items-center justify-center rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                    {totalQty} qty
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-xl border border-border bg-card/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground">
                    {sale.payment_method}
                  </span>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(sale.sale_date))}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {formatCurrency(Number(sale.total_amount))}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <form action={deleteSaleAction}>
                      <input
                        type="hidden"
                        name="sale_id"
                        value={sale.id}
                      />

                      <button
                        type="submit"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}