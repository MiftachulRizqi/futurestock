"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/app/produk/actions";

type DeleteProductButtonProps = {
  productId: string;
};

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Yakin ingin menghapus produk ini? Data tidak bisa dikembalikan."
    );

    if (!confirmed) return;

    startTransition(async () => {
      await deleteProductAction(productId);
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      disabled={isPending}
      onClick={handleDelete}
    >
      <Trash2 className="mr-1 h-4 w-4" />
      {isPending ? "Menghapus..." : "Hapus"}
    </Button>
  );
}