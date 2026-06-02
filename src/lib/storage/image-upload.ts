import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "product-images";

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = await createClient();

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Tipe file tidak didukung. Gunakan JPG, PNG, atau WEBP.");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error("Gagal mengupload gambar: " + error.message);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const supabase = await createClient();

  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error("Delete error:", error);
    }
  } catch (error) {
    console.error("Error parsing image URL:", error);
  }
}
