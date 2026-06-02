import { notFound } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProductForm } from "@/components/products/product-form";

import { getProductById } from "@/services/product-service";

import { updateProductAction } from "../../actions";

type EditProdukPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
  }>;
};

export default async function EditProdukPage({
  params,
  searchParams,
}: EditProdukPageProps) {

  const { id } = await params;

  const query = await searchParams;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Edit Produk
          </h1>

          <p className="text-sm text-muted-foreground">
            Perbarui informasi produk dan foto produk.
          </p>
        </div>

        <ProductForm
          action={updateProductAction}
          product={product}
          submitLabel="Simpan Perubahan"
          currentPage={Number(query.page ?? 1)}
          currentSearch={query.search ?? ""}
          currentCategory={query.category ?? ""}
        />
      </div>
    </DashboardLayout>
  );
}