import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              Product Detail
            </span>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Detail informasi produk FutureStock.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/produk">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>

            <Button asChild>
              <Link href={`/produk/${product.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Produk
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Foto Produk */}
          <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-lg">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card/5">
              {product.image_url ? (
                <Image
                  src={product.image_url.trim()}
                  alt={product.name}
                  width={320}
                  height={320}
                  unoptimized
                  className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Belum ada foto
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <QuickInfo
                label="Status"
                value={
                  product.status === "active"
                    ? "Aktif"
                    : "Nonaktif"
                }
              />

              <QuickInfo
                label="Kategori"
                value={product.category}
              />
            </div>
          </div>

          {/* Detail Produk */}
          <div className="grid gap-5 md:grid-cols-2">
            <DetailItem label="SKU" value={product.sku} />

            <DetailItem
              label="Kategori"
              value={product.category}
            />

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

            <DetailItem
              label="Supplier"
              value={product.supplier ?? "-"}
            />

            <DetailItem
              label="Barcode"
              value={product.barcode ?? "-"}
            />

            <DetailItem
              label="Status"
              value={
                product.status === "active"
                  ? "Aktif"
                  : "Nonaktif"
              }
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-3xl border border-border bg-card/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold text-foreground break-words">
        {value}
      </p>
    </div>
  );
}

function QuickInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}