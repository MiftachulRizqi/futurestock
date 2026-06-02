import Image from "next/image";
import Link from "next/link";
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
      className="space-y-6 rounded-2xl border border-border bg-card/70 p-6"
    >
      {product ? (
        <input type="hidden" name="product_id" value={product.id} />
      ) : null}

      <input
        type="hidden"
        name="image_url"
        value={product?.image_url ?? ""}
      />

      <input
        type="hidden"
        name="existing_image_url"
        value={product?.image_url ?? ""}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">Nama Produk</Label>
          <Input
            name="name"
            defaultValue={product?.name}
            placeholder="Contoh: Beras Ramos 5kg"
            required
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">SKU</Label>
          <Input
            name="sku"
            defaultValue={product?.sku}
            placeholder="BR-RAMOS-5KG"
            required
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Kategori</Label>
          <select
            name="category"
            defaultValue={product?.category ?? ""}
            required
            className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="">Pilih kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Sembako">Sembako</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Fashion">Fashion</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Rumah Tangga">Rumah Tangga</option>
            <option value="ATK">ATK</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Harga</Label>
          <Input
            name="price"
            type="number"
            defaultValue={product?.price}
            placeholder="68000"
            required
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Stok</Label>
          <Input
            name="stock"
            type="number"
            defaultValue={product?.stock}
            placeholder="100"
            required
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Minimal Stok</Label>
          <Input
            name="min_stock"
            type="number"
            defaultValue={product?.min_stock}
            placeholder="10"
            required
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Satuan</Label>
          <Input
            name="unit"
            defaultValue={product?.unit ?? "pcs"}
            placeholder="pcs / dus / kg"
            required
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Supplier</Label>
          <Input
            name="supplier"
            defaultValue={product?.supplier ?? ""}
            placeholder="Nama supplier"
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Barcode</Label>
          <Input
            name="barcode"
            defaultValue={product?.barcode ?? ""}
            placeholder="899xxxxxxxxxx"
            className="bg-card/5 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Status</Label>
          <select
            name="status"
            defaultValue={product?.status ?? "active"}
            className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div className="space-y-3 md:col-span-2">
          <Label className="text-foreground">Foto Produk</Label>

          {product?.image_url ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-border bg-card/5">
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
            className="cursor-pointer bg-card/5 text-foreground file:text-foreground"
          />

          <p className="text-xs text-muted-foreground">
            Kosongkan jika tidak ingin mengganti foto. Upload JPG, PNG, atau
            WEBP maksimal 5MB.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/produk">
          <Button
            type="button"
            variant="destructive"
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Batal
          </Button>
        </Link>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}