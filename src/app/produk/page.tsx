import Link from "next/link";
import { Plus } from "lucide-react";

import { getProducts } from "@/services/product-service";

import { ProductTable } from "@/components/products/product-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

import { Button } from "@/components/ui/button";

export default async function ProdukPage() {
  const products = await getProducts();

  return (
    <DashboardLayout products={products}>
      <div className="space-y-6">

        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Produk
            </h1>
            <p className="text-muted-foreground">
              Kelola semua produk
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