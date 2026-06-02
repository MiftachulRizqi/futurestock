import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStore } from "@/services/store-service";
import type { Product } from "@/types/product";
import type { ProductFormValues } from "@/lib/validations/product";

async function requireCurrentStoreId() {
  const currentStore = await getCurrentStore();

  if (!currentStore?.store?.id) {
    return null;
  }

  return currentStore.store.id;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  if (!storeId) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPaginatedProducts(
  page = 1,
  pageSize = 10,
  search = "",
  category = ""
) {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  if (!storeId) {
    return {
      products: [],
      total: 0,
    };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", {
      count: "exact",
    })
    .eq("store_id", storeId);

  if (search.trim()) {
    query = query.or(
      [
        `name.ilike.%${search}%`,
        `sku.ilike.%${search}%`,
        `category.ilike.%${search}%`,
        `supplier.ilike.%${search}%`,
      ].join(",")
    );
  }

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const {
    data,
    count,
    error,
  } = await query
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    products: (data ?? []) as Product[],
    total: count ?? 0,
  };
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  if (!storeId) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("store_id", storeId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createProduct(
  values: ProductFormValues
) {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  if (!storeId) {
    throw new Error("Silakan login ulang.");
  }

  const { error } = await supabase
    .from("products")
    .insert({
      store_id: storeId,
      name: values.name,
      sku: values.sku,
      category: values.category,
      price: values.price,
      stock: values.stock,
      min_stock: values.min_stock,
      unit: values.unit,
      supplier: values.supplier || null,
      barcode: values.barcode || null,
      image_url: values.image_url || null,
      status: values.status,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/produk");
  revalidatePath("/dashboard");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
}

export async function updateProduct(
  id: string,
  values: ProductFormValues
) {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  if (!storeId) {
    throw new Error("Silakan login ulang.");
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: values.name,
      sku: values.sku,
      category: values.category,
      price: values.price,
      stock: values.stock,
      min_stock: values.min_stock,
      unit: values.unit,
      supplier: values.supplier || null,
      barcode: values.barcode || null,
      image_url: values.image_url || null,
      status: values.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("store_id", storeId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/produk");
  revalidatePath(`/produk/${id}`);
  revalidatePath(`/produk/${id}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
}

export async function deleteProduct(
  id: string
) {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  if (!storeId) {
    throw new Error("Silakan login ulang.");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("store_id", storeId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/produk");
  revalidatePath("/dashboard");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
}