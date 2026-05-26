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
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center">
        <p className="font-medium text-white">Belum ada transaksi</p>

        <p className="mt-1 text-sm text-slate-400">
          Tambahkan transaksi pertama agar AI bisa membaca pola penjualan.
        </p>

        <Link
          href="/transaksi/tambah"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-cyan-400 px-4 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
        >
          Tambah Transaksi
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.06]">
      <table className="w-full min-w-[1050px] text-sm">
        <thead className="bg-white/5 text-slate-400">
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
                className="border-t border-white/10 transition hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3 font-medium text-white">
                  {sale.invoice_number}
                </td>

                <td className="px-4 py-3 text-slate-400">
                  {sale.customer_name || "Pelanggan Umum"}
                </td>

                <td className="px-4 py-3 text-slate-400">
                  <div>
                    <p className="font-medium text-white">
                      {sale.sales_items.length} item
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
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
                  <div className="inline-flex min-w-[70px] items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300">
                    {totalQty} qty
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
                    {sale.payment_method}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-400">
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(sale.sale_date))}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-white">
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/20"
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