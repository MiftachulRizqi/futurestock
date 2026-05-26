"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/services/product-service";
import { productSchema } from "@/lib/validations/product";

const PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function uploadProductImage(file: File) {
  const supabase = await createClient();

  if (!file || file.size === 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }

  const fileExt = file.name.split(".").pop() || "png";
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function createProductAction(formData: FormData) {
  const image = formData.get("image");

  const uploadedImageUrl =
    image instanceof File && image.size > 0
      ? await uploadProductImage(image)
      : null;

  const values = productSchema.parse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    min_stock: formData.get("min_stock"),
    unit: formData.get("unit"),
    supplier: formData.get("supplier"),
    barcode: formData.get("barcode"),
    image_url: uploadedImageUrl ?? "",
    status: formData.get("status"),
  });

  await createProduct(values);

  redirect("/produk");
}

export async function updateProductAction(id: string, formData: FormData) {
  const currentProduct = await getProductById(id);

  if (!currentProduct) {
    throw new Error("Produk tidak ditemukan.");
  }

  const image = formData.get("image");

  const uploadedImageUrl =
    image instanceof File && image.size > 0
      ? await uploadProductImage(image)
      : null;

  const values = productSchema.parse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    min_stock: formData.get("min_stock"),
    unit: formData.get("unit"),
    supplier: formData.get("supplier"),
    barcode: formData.get("barcode"),
    image_url: uploadedImageUrl ?? currentProduct.image_url ?? "",
    status: formData.get("status"),
  });

  await updateProduct(id, values);

  redirect("/produk");
}

export async function deleteProductAction(id: string) {
  await deleteProduct(id);

  redirect("/produk");
}