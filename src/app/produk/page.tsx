import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/services/product-service";
import { ProductTable } from "@/components/products/product-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";

export default async function ProdukPage() {
  const products = await getProducts();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Produk</h1>
            <p className="text-sm text-slate-400">
              Kelola produk real dari database FutureStock.
            </p>
          </div>

          <Button asChild>
            <Link href="/produk/tambah">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>

        <ProductTable products={products} />
      </div>
    </DashboardLayout>
  );
}