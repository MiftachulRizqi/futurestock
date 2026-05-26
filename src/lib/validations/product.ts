import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  sku: z.string().min(2, "SKU wajib diisi"),
  category: z.string().min(2, "Kategori wajib diisi"),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
  min_stock: z.coerce.number().int().min(0, "Minimum stok tidak boleh negatif"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  supplier: z.string().optional(),
  barcode: z.string().optional(),
  image_url: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;