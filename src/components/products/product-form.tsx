import Image from "next/image";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProductFormProps = {
  action: (formData: FormData) => void;
  product?: Product;
  submitLabel: string;
};

export function ProductForm({
  action,
  product,
  submitLabel,
}: ProductFormProps) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border border-white/10 bg-slate-950/70 p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-slate-200">Nama Produk</Label>
          <Input
            name="name"
            defaultValue={product?.name}
            placeholder="Contoh: Beras Ramos 5kg"
            required
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">SKU</Label>
          <Input
            name="sku"
            defaultValue={product?.sku}
            placeholder="BR-RAMOS-5KG"
            required
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Kategori</Label>
          <Input
            name="category"
            defaultValue={product?.category}
            placeholder="Sembako"
            required
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Harga</Label>
          <Input
            name="price"
            type="number"
            defaultValue={product?.price}
            placeholder="68000"
            required
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Stok</Label>
          <Input
            name="stock"
            type="number"
            defaultValue={product?.stock}
            placeholder="100"
            required
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Minimal Stok</Label>
          <Input
            name="min_stock"
            type="number"
            defaultValue={product?.min_stock}
            placeholder="10"
            required
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Satuan</Label>
          <Input
            name="unit"
            defaultValue={product?.unit ?? "pcs"}
            placeholder="pcs / dus / kg"
            required
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Supplier</Label>
          <Input
            name="supplier"
            defaultValue={product?.supplier ?? ""}
            placeholder="Nama supplier"
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Barcode</Label>
          <Input
            name="barcode"
            defaultValue={product?.barcode ?? ""}
            placeholder="899xxxxxxxxxx"
            className="bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-200">Status</Label>
          <select
            name="status"
            defaultValue={product?.status ?? "active"}
            className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div className="space-y-3 md:col-span-2">
          <Label className="text-slate-200">Foto Produk</Label>

          {product?.image_url ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image
                src={product.image_url.trim()}
                alt={product.name}
                width={160}
                height={160}
                unoptimized
                className="h-40 w-40 object-cover"
              />
            </div>
          ) : null}

          <Input
            name="image"
            type="file"
            accept="image/*"
            className="cursor-pointer bg-white/5 text-white file:text-white"
          />

          <p className="text-xs text-slate-500">
            Kosongkan jika tidak ingin mengganti foto. Upload JPG, PNG, atau
            WEBP maksimal 5MB.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}