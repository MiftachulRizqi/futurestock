"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log-service";
import { uploadProductImage, deleteProductImage } from "@/lib/storage/image-upload";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getNumber(formData: FormData, key: string) {
  return Number(formData.get(key) || 0);
}

async function getCurrentStoreId() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const { data: member, error: memberError } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (memberError || !member?.store_id) {
    throw new Error("Workspace toko tidak ditemukan untuk akun ini.");
  }

  return {
    supabase,
    user,
    storeId: member.store_id as string,
  };
}

function revalidateProductRelatedPaths() {
  revalidatePath("/produk");
  revalidatePath("/dashboard");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
  revalidatePath("/dead-stock");
  revalidatePath("/laporan");
}

export async function createProductAction(formData: FormData) {
  const { supabase, user, storeId } = await getCurrentStoreId();

  const name = getString(formData, "name");
  const sku = getString(formData, "sku");
  const category = getString(formData, "category");
  const supplier = getString(formData, "supplier");
  const barcode = getString(formData, "barcode");
  const unit = getString(formData, "unit") || "pcs";
  const imageUrl = getString(formData, "image_url");
  const status = getString(formData, "status") || "active";

  const stock = getNumber(formData, "stock");
  const minStock = getNumber(formData, "min_stock");
  const price = getNumber(formData, "price");

  const imageFile = formData.get("image") as File | null;

  if (!name || !sku || !category) {
    throw new Error("Nama produk, SKU, dan kategori wajib diisi.");
  }

  if (stock < 0 || minStock < 0 || price < 0) {
    throw new Error("Stok, minimum stok, dan harga tidak boleh negatif.");
  }

  // Handle image upload
  let finalImageUrl = imageUrl || null;
  if (imageFile && imageFile.size > 0) {
    try {
      finalImageUrl = await uploadProductImage(imageFile);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Gagal mengupload gambar.");
    }
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      store_id: storeId,
      name,
      sku,
      category,
      supplier: supplier || null,
      barcode: barcode || null,
      unit,
      image_url: finalImageUrl,
      stock,
      min_stock: minStock,
      price,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !product) {
    throw new Error(error?.message || "Produk gagal ditambahkan.");
  }

  await logActivity({
    storeId,
    userId: user.id,
    action: "create",
    entityType: "product",
    entityId: product.id,
    title: "Produk baru ditambahkan",
    description: `Produk ${name} berhasil ditambahkan ke inventaris.`,
    metadata: {
      product_id: product.id,
      name,
      sku,
      category,
      stock,
      min_stock: minStock,
      price,
      status,
    },
  });

  revalidateProductRelatedPaths();

  redirect("/produk?toast=product-created");
}

export async function updateProductAction(formData: FormData) {
  const { supabase, user, storeId } = await getCurrentStoreId();

  const productId = getString(formData, "product_id");

  const name = getString(formData, "name");
  const sku = getString(formData, "sku");
  const category = getString(formData, "category");
  const supplier = getString(formData, "supplier");
  const barcode = getString(formData, "barcode");
  const unit = getString(formData, "unit") || "pcs";
  const imageUrl = getString(formData, "image_url");
  const status = getString(formData, "status") || "active";

  const stock = getNumber(formData, "stock");
  const minStock = getNumber(formData, "min_stock");
  const price = getNumber(formData, "price");

  const page =
    getString(formData, "page") || "1";

  const search =
    getString(formData, "search");

  const currentCategory =
    getString(formData, "current_category");

  const imageFile = formData.get("image") as File | null;

  if (!productId) {
    throw new Error("ID produk tidak ditemukan.");
  }

  if (!name || !sku || !category) {
    throw new Error("Nama produk, SKU, dan kategori wajib diisi.");
  }

  if (stock < 0 || minStock < 0 || price < 0) {
    throw new Error("Stok, minimum stok, dan harga tidak boleh negatif.");
  }

  const { data: oldProduct } = await supabase
    .from("products")
    .select("id, name, sku, category, stock, min_stock, price, status, image_url")
    .eq("id", productId)
    .eq("store_id", storeId)
    .single();

  // Handle image upload
  let finalImageUrl = imageUrl || null;
  if (imageFile && imageFile.size > 0) {
    try {
      // Delete old image if exists
      if (oldProduct?.image_url) {
        await deleteProductImage(oldProduct.image_url);
      }
      // Upload new image
      finalImageUrl = await uploadProductImage(imageFile);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Gagal mengupload gambar.");
    }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      sku,
      category,
      supplier: supplier || null,
      barcode: barcode || null,
      unit,
      image_url: finalImageUrl,
      stock,
      min_stock: minStock,
      price,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .eq("store_id", storeId);

  if (error) {
    throw new Error(error.message || "Produk gagal diperbarui.");
  }

  await logActivity({
    storeId,
    userId: user.id,
    action: "update",
    entityType: "product",
    entityId: productId,
    title: "Produk diperbarui",
    description: `Produk ${name} berhasil diperbarui.`,
    metadata: {
      product_id: productId,
      before: oldProduct ?? null,
      after: {
        name,
        sku,
        category,
        stock,
        min_stock: minStock,
        price,
        status,
      },
    },
  });

  revalidateProductRelatedPaths();
  revalidatePath(`/produk/${productId}`);
  revalidatePath(`/produk/${productId}/edit`);

  const params = new URLSearchParams();

  params.set("page", page);

  if (search) {
    params.set("search", search);
  }

  if (currentCategory) {
    params.set("category", currentCategory);
  }

  params.set("toast", "product-updated");

  redirect(`/produk?${params.toString()}`);
}

export async function deleteProductWithResultAction(formData: FormData) {
  try {
    const { supabase, user, storeId } = await getCurrentStoreId();

    const productId = getString(formData, "product_id");

    if (!productId) {
      return {
        success: false,
        message: "ID produk tidak ditemukan.",
      };
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, store_id, name, sku, category, stock, price, status")
      .eq("id", productId)
      .eq("store_id", storeId)
      .single();

    if (productError || !product) {
      return {
        success: false,
        message: "Produk tidak ditemukan di workspace toko ini.",
      };
    }

    const { count, error: usageError } = await supabase
      .from("sales_items")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("product_id", productId);

    if (usageError) {
      return {
        success: false,
        message:
          usageError.message || "Gagal memeriksa riwayat transaksi produk.",
      };
    }

    if ((count ?? 0) > 0) {
      return {
        success: false,
        message:
          "Produk ini sudah digunakan dalam transaksi, sehingga tidak bisa dihapus permanen. Ubah status produk menjadi Nonaktif agar riwayat transaksi, laporan, analytics, dan prediksi AI tetap aman.",
      };
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("store_id", storeId);

    if (error) {
      return {
        success: false,
        message: error.message || "Produk gagal dihapus.",
      };
    }

    await logActivity({
      storeId,
      userId: user.id,
      action: "delete",
      entityType: "product",
      entityId: productId,
      title: "Produk dihapus",
      description: `Produk ${product.name} berhasil dihapus dari inventaris.`,
      metadata: {
        product,
      },
    });

    revalidateProductRelatedPaths();

    return {
      success: true,
      message: "Produk berhasil dihapus.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus produk.",
    };
  }
}