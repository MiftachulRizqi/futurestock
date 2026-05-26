"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/helpers/format";

type SaleFormProps = {
  products: Product[];
  action: (formData: FormData) => void;
};

type SaleRow = {
  id: string;
  productId: string;
  quantity: number;
};

export function SaleForm({ products, action }: SaleFormProps) {
  const [rows, setRows] = useState<SaleRow[]>([
    {
      id: crypto.randomUUID(),
      productId: products[0]?.id ?? "",
      quantity: 1,
    },
  ]);

  const totalAmount = useMemo(() => {
    return rows.reduce((total, row) => {
      const product = products.find((item) => item.id === row.productId);
      return total + Number(product?.price ?? 0) * row.quantity;
    }, 0);
  }, [rows, products]);

  function addRow() {
    setRows((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        productId: products[0]?.id ?? "",
        quantity: 1,
      },
    ]);
  }

  function removeRow(id: string) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  function updateRow(id: string, values: Partial<SaleRow>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...values } : row))
    );
  }

  return (
    <form
      action={action}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Nama Customer</label>
          <input
            name="customer_name"
            placeholder="Contoh: Pelanggan Umum"
            className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-cyan-400/40"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Metode Pembayaran</label>
          <select
            name="payment_method"
            defaultValue="cash"
            className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-cyan-400/40"
          >
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Transfer</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Item Penjualan</h2>

          <button
            type="button"
            onClick={addRow}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-cyan-400 px-3 text-sm font-medium text-slate-950 hover:bg-cyan-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Item
          </button>
        </div>

        {rows.map((row) => {
          const product = products.find((item) => item.id === row.productId);
          const price = Number(product?.price ?? 0);
          const subtotal = price * row.quantity;

          return (
            <div
              key={row.id}
              className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:grid-cols-[1fr_120px_150px_44px]"
            >
              <div>
                <label className="text-xs text-slate-500">Produk</label>
                <select
                  name="product_id"
                  value={row.productId}
                  onChange={(event) =>
                    updateRow(row.id, { productId: event.target.value })
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} — Stok {product.stock}
                    </option>
                  ))}
                </select>

                <input type="hidden" name="unit_price" value={price} />
              </div>

              <div>
                <label className="text-xs text-slate-500">Qty</label>
                <input
                  name="quantity"
                  type="number"
                  min={1}
                  max={product?.stock ?? 999999}
                  value={row.quantity}
                  onChange={(event) =>
                    updateRow(row.id, {
                      quantity: Number(event.target.value),
                    })
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Subtotal</label>
                <div className="mt-2 flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white">
                  {formatCurrency(subtotal)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                className="mt-6 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Total Penjualan</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Simpan Transaksi
        </button>
      </div>
    </form>
  );
}