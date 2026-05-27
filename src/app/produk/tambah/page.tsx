import { redirect } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getCurrentUser } from "@/services/auth-service";
import { createProductAction } from "../actions";

export default async function TambahProdukPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Tambah Produk</h1>
          <p className="text-sm text-slate-400">
            Tambahkan produk baru ke database FutureStock.
          </p>
        </div>

        <ProductForm
          action={createProductAction}
          submitLabel="Simpan Produk"
        />
      </div>
    </DashboardLayout>
  );
}
