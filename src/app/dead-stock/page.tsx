import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, PackageX, Skull } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { getProducts } from "@/services/product-service";
import {
  getDeadStockProducts,
  getDeadStockRisk,
} from "@/lib/helpers/dead-stock";
import { formatCurrency } from "@/lib/helpers/format";

export default async function DeadStockPage() {
  const products = await getProducts();
  const deadStockProducts = getDeadStockProducts(products);

  const deadStockValue = deadStockProducts.reduce((total, product) => {
    return total + Number(product.price) * Number(product.stock);
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-300">
                Dead Stock Intelligence
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Dead Stock
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Identifikasi produk nonaktif, stok kosong, atau stok berlebih
                yang berpotensi mengunci modal usaha.
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-400/10 text-rose-300">
              <Skull className="h-10 w-10" />
            </div>
          </div>
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Produk Berisiko"
            value={String(deadStockProducts.length)}
            description="Produk dead stock atau perlu dipantau"
            icon={PackageX}
            tone="amber"
          />

          <StatCard
            title="Nilai Terkunci"
            value={formatCurrency(deadStockValue)}
            description="Estimasi modal tertahan"
            icon={AlertTriangle}
            tone="violet"
          />

          <StatCard
            title="Total Produk"
            value={String(products.length)}
            description="Basis data produk real"
            icon={Skull}
            tone="cyan"
          />
        </section>

        <GlassPanel className="p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">
              Daftar Produk Dead Stock
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Produk yang masuk daftar ini perlu dipromosikan, dikurangi
              pembeliannya, atau dinonaktifkan.
            </p>
          </div>

          <div className="space-y-3">
            {deadStockProducts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 text-center">
                <p className="font-medium text-white">
                  Tidak ada dead stock terdeteksi
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Kondisi inventaris saat ini masih sehat.
                </p>
              </div>
            ) : (
              deadStockProducts.map((product) => {
                const risk = getDeadStockRisk(product);

                return (
                  <Link
                    key={product.id}
                    href={`/produk/${product.id}`}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:bg-white/5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        {product.image_url ? (
                          <Image
                            src={product.image_url.trim()}
                            alt={product.name}
                            width={64}
                            height={64}
                            unoptimized
                            className="h-16 w-16 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center text-xs text-slate-500">
                            IMG
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {product.category} · {product.sku}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${risk.className}`}
                      >
                        {risk.label}
                      </span>

                      <span className="text-sm text-slate-400">
                        Stok: {product.stock} {product.unit}
                      </span>

                      <span className="text-sm font-medium text-white">
                        {formatCurrency(
                          Number(product.price) * Number(product.stock)
                        )}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}