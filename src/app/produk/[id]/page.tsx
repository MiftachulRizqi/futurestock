import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/services/product-service";
import { formatCurrency } from "@/lib/helpers/format";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-sm text-slate-400">
              Detail informasi produk FutureStock.
            </p>
          </div>

          <Button asChild>
            <Link href={`/produk/${product.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Produk
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {product.image_url ? (
                <Image
                  src={product.image_url.trim()}
                  alt={product.name}
                  width={320}
                  height={320}
                  unoptimized
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Belum ada foto
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem label="SKU" value={product.sku} />
            <DetailItem label="Kategori" value={product.category} />
            <DetailItem
              label="Harga"
              value={formatCurrency(Number(product.price))}
            />
            <DetailItem
              label="Stok"
              value={`${product.stock} ${product.unit}`}
            />
            <DetailItem
              label="Minimal Stok"
              value={`${product.min_stock} ${product.unit}`}
            />
            <DetailItem label="Supplier" value={product.supplier ?? "-"} />
            <DetailItem label="Barcode" value={product.barcode ?? "-"} />
            <DetailItem
              label="Status"
              value={product.status === "active" ? "Aktif" : "Nonaktif"}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}