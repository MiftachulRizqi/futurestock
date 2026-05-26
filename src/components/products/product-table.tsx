import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/helpers/format";
import { DeleteProductButton } from "./delete-product-button";

type ProductTableProps = {
  products: Product[];
};

export function ProductTable({ products }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Belum ada produk</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tambahkan produk pertama untuk mulai mengelola inventaris.
        </p>

        <Link
          href="/produk/tambah"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tambah Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
      <table className="w-full min-w-[980px] text-sm">
        <thead className="bg-white/5 text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Produk</th>
            <th className="px-4 py-3 text-left">SKU</th>
            <th className="px-4 py-3 text-left">Kategori</th>
            <th className="px-4 py-3 text-left">Stok</th>
            <th className="px-4 py-3 text-left">Harga</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-white/10 transition hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {product.image_url ? (
                      <Image
                        src={product.image_url.trim()}
                        alt={product.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                        IMG
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {product.supplier || "Tanpa supplier"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-slate-400">{product.sku}</td>
              <td className="px-4 py-3 text-slate-400">{product.category}</td>
              <td className="px-4 py-3 text-slate-400">
                {product.stock} {product.unit}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {formatCurrency(Number(product.price))}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  {product.status === "active" ? "Aktif" : "Nonaktif"}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/produk/${product.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Detail
                  </Link>

                  <Link
                    href={`/produk/${product.id}/edit`}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Link>

                  <DeleteProductButton productId={product.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}