import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProductForm } from "@/components/products/product-form";
import { getProductById } from "@/services/product-service";
import { updateProductAction } from "../../actions";

type EditProdukPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProdukPage({ params }: EditProdukPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  async function action(formData: FormData) {
    "use server";

    await updateProductAction(id, formData);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Produk</h1>
          <p className="text-sm text-slate-400">
            Perbarui informasi produk dan foto produk.
          </p>
        </div>

        <ProductForm
          action={action}
          product={product}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </DashboardLayout>
  );
}