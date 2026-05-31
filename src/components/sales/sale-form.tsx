"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/helpers/format";
import { Button } from "@/components/ui/button";

type SaleFormProps = {
  products: Product[];
  action: (formData: FormData) => void;
  aiDiscounts?: {
    productId: string;
    discountPercentage: number;
    reason?: string | null;
  }[];
};

type SaleRow = {
  id: string;
  productId: string;
  quantity: number;
  discountPercentage: number;
  discountSource: "ai" | "manual";
};

export function SaleForm({
  products,
  action,
  aiDiscounts = [],
}: SaleFormProps) {
  const aiDiscountMap = useMemo(() => {
    return new Map(aiDiscounts.map((item) => [item.productId, item]));
  }, [aiDiscounts]);

  const firstProductId = products[0]?.id ?? "";
  const firstAiDiscount = aiDiscountMap.get(firstProductId);

  const [rows, setRows] = useState<SaleRow[]>([
    {
      id: crypto.randomUUID(),
      productId: firstProductId,
      quantity: 1,
      discountPercentage: clampDiscount(
        Number(firstAiDiscount?.discountPercentage || 0)
      ),
      discountSource: firstAiDiscount ? "ai" : "manual",
    },
  ]);

  const totalAmount = useMemo(() => {
    return rows.reduce((total, row) => {
      const product = products.find((item) => item.id === row.productId);
      const price = Number(product?.price ?? 0);
      const discountPercentage = clampDiscount(row.discountPercentage);
      const discountAmount = (price * discountPercentage) / 100;
      const finalUnitPrice = Math.max(price - discountAmount, 0);

      return total + finalUnitPrice * row.quantity;
    }, 0);
  }, [rows, products]);

  const totalBeforeDiscount = useMemo(() => {
    return rows.reduce((total, row) => {
      const product = products.find((item) => item.id === row.productId);
      return total + Number(product?.price ?? 0) * row.quantity;
    }, 0);
  }, [rows, products]);

  const totalDiscount = Math.max(totalBeforeDiscount - totalAmount, 0);

  function getAiDiscount(productId: string) {
    return aiDiscountMap.get(productId);
  }

  function addRow() {
    const productId = products[0]?.id ?? "";
    const aiDiscount = getAiDiscount(productId);

    setRows((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        productId,
        quantity: 1,
        discountPercentage: clampDiscount(
          Number(aiDiscount?.discountPercentage || 0)
        ),
        discountSource: aiDiscount ? "ai" : "manual",
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

  function handleProductChange(rowId: string, productId: string) {
    const aiDiscount = getAiDiscount(productId);

    updateRow(rowId, {
      productId,
      discountPercentage: clampDiscount(
        Number(aiDiscount?.discountPercentage || 0)
      ),
      discountSource: aiDiscount ? "ai" : "manual",
    });
  }

  return (
    <form
      action={action}
      className="space-y-6 rounded-3xl border border-border bg-card/[0.06] p-6 shadow-2xl shadow-primary/20 backdrop-blur-xl"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-foreground">Nama Customer</label>
          <input
            name="customer_name"
            placeholder="Contoh: Pelanggan Umum"
            className="mt-2 h-11 w-full rounded-2xl border border-border bg-card/60 px-4 text-sm text-foreground outline-none transition focus:border-primary/40"
          />
        </div>

        <div>
          <label className="text-sm text-foreground">Metode Pembayaran</label>
          <select
            name="payment_method"
            defaultValue="cash"
            className="mt-2 h-11 w-full rounded-2xl border border-border bg-card/60 px-4 text-sm text-foreground outline-none transition focus:border-primary/40"
          >
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Transfer</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      {aiDiscounts.length > 0 ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">
                Diskon AI tersedia
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Beberapa produk overstock memiliki rekomendasi diskon dari AI.
                Saat produk dipilih, diskon otomatis terisi dan tetap bisa
                diubah manual oleh kasir.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Item Penjualan
          </h2>

          <button
            type="button"
            onClick={addRow}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Item
          </button>
        </div>

        {rows.map((row) => {
          const product = products.find((item) => item.id === row.productId);
          const price = Number(product?.price ?? 0);
          const aiDiscount = getAiDiscount(row.productId);

          const discountPercentage = clampDiscount(row.discountPercentage);
          const discountAmount = (price * discountPercentage) / 100;
          const finalUnitPrice = Math.max(price - discountAmount, 0);
          const subtotalBeforeDiscount = price * row.quantity;
          const subtotal = finalUnitPrice * row.quantity;
          const rowTotalDiscount = discountAmount * row.quantity;

          return (
            <div
              key={row.id}
              className="grid gap-3 rounded-2xl border border-border bg-card/50 p-4 md:grid-cols-[1fr_100px_120px_170px_44px]"
            >
              <div>
                <label className="text-xs text-muted-foreground">Produk</label>

                <select
                  name="product_id"
                  value={row.productId}
                  onChange={(event) =>
                    handleProductChange(row.id, event.target.value)
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                >
                  {products.map((product) => {
                    const discount = getAiDiscount(product.id);

                    return (
                      <option key={product.id} value={product.id}>
                        {product.name} — Stok {product.stock}
                        {discount
                          ? ` — AI Diskon ${discount.discountPercentage}%`
                          : ""}
                      </option>
                    );
                  })}
                </select>

                <input type="hidden" name="unit_price" value={price} />

                {aiDiscount ? (
                  <div className="mt-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs leading-5 text-primary">
                    <div className="flex items-center gap-1 font-semibold">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI menyarankan diskon{" "}
                      {aiDiscount.discountPercentage}%
                    </div>
                    {aiDiscount.reason ? (
                      <p className="mt-1 text-primary/80">
                        {aiDiscount.reason}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Qty</label>

                <input
                  name="quantity"
                  type="number"
                  min={1}
                  max={product?.stock ?? 999999}
                  value={row.quantity}
                  onInput={(event) => {
                    event.currentTarget.value = normalizeNumberInput(
                      event.currentTarget.value
                    );
                  }}
                  onChange={(event) =>
                    updateRow(row.id, {
                      quantity: Math.max(Number(event.target.value || 1), 1),
                    })
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">
                  Diskon %
                </label>

                <input
                  name="discount_percentage"
                  type="number"
                  min={0}
                  max={100}
                  value={row.discountPercentage}
                  onInput={(event) => {
                    event.currentTarget.value = normalizeNumberInput(
                      event.currentTarget.value
                    );
                  }}
                  onChange={(event) =>
                    updateRow(row.id, {
                      discountPercentage: clampDiscount(
                        Number(event.target.value || 0)
                      ),
                      discountSource: "manual",
                    })
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                />

                {row.discountSource === "ai" && discountPercentage > 0 ? (
                  <p className="mt-1 text-[11px] font-medium text-primary">
                    Terisi otomatis dari AI
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-xs text-muted-foreground">
                  Subtotal
                </label>

                <div className="mt-2 rounded-xl border border-border bg-card/[0.03] px-3 py-2 text-sm text-foreground">
                  <p className="font-semibold">{formatCurrency(subtotal)}</p>

                  {discountPercentage > 0 ? (
                    <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      <p className="line-through">
                        {formatCurrency(subtotalBeforeDiscount)}
                      </p>
                      <p className="text-primary">
                        Hemat {formatCurrency(rowTotalDiscount)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                className="mt-6 flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Total Penjualan Setelah Diskon
          </p>

          <p className="mt-1 text-3xl font-bold text-foreground">
            {formatCurrency(totalAmount)}
          </p>

          {totalDiscount > 0 ? (
            <p className="mt-1 text-sm text-primary">
              Total hemat {formatCurrency(totalDiscount)}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/transaksi">
            <Button
              type="button"
              variant="destructive"
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Simpan Transaksi
          </Button>
        </div>
      </div>
    </form>
  );
}

function normalizeNumberInput(value: string) {
  if (value === "") return value;
  return value.replace(/^0+(?=\d)/, "");
}

function clampDiscount(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}