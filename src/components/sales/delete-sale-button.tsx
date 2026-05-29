"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { deleteSaleWithResultAction } from "@/app/transaksi/actions";

type DeleteSaleButtonProps = {
  saleId: string;
  invoiceNumber?: string | null;
};

type DialogState = "confirm" | "success" | "error";

export function DeleteSaleButton({
  saleId,
  invoiceNumber,
}: DeleteSaleButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [dialogState, setDialogState] =
    useState<DialogState>("confirm");

  const [errorMessage, setErrorMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  function openDialog() {
    setDialogState("confirm");
    setErrorMessage("");
    setOpen(true);
  }

  function closeDialog() {
    if (isPending) return;

    setOpen(false);
    setDialogState("confirm");
    setErrorMessage("");
  }

  function closeSuccessDialog() {
    setOpen(false);
    setDialogState("confirm");
    setErrorMessage("");

    router.refresh();
  }

  function handleDelete() {
    startTransition(async () => {
      setErrorMessage("");

      const formData = new FormData();
      formData.append("sale_id", saleId);

      const result =
        await deleteSaleWithResultAction(formData);

      if (!result.success) {
        setErrorMessage(
          result.message ||
            "Transaksi gagal dihapus. Silakan coba lagi."
        );

        setDialogState("error");
        return;
      }

      setDialogState("success");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        disabled={isPending}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Hapus transaksi"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={
              dialogState === "confirm"
                ? closeDialog
                : undefined
            }
          />

          <div className="relative z-10 w-full max-w-[430px] overflow-hidden rounded-md bg-white shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            {dialogState === "confirm" ? (
              <>
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isPending}
                  className="absolute right-3 top-3 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Tutup dialog"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-300 bg-white">
                    <AlertTriangle className="h-11 w-11 text-amber-400" />
                  </div>

                  <h2 className="mt-7 text-[36px] font-semibold tracking-tight text-slate-700">
                    Are you sure?
                  </h2>

                  <p className="mt-3 text-[16px] text-slate-500">
                    You won&apos;t be able to revert this!
                  </p>

                  {invoiceNumber ? (
                    <p className="mt-3 text-sm text-slate-400">
                      Invoice:{" "}
                      <span className="font-semibold text-slate-600">
                        {invoiceNumber}
                      </span>
                    </p>
                  ) : null}

                  <div className="mt-9 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-md bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Yes, delete it!
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={closeDialog}
                      disabled={isPending}
                      className="inline-flex min-w-[110px] items-center justify-center rounded-md bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {dialogState === "success" ? (
              <div className="flex flex-col items-center px-8 pb-10 pt-10 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-100 bg-white">
                  <Check
                    className="h-16 w-16 text-emerald-400"
                    strokeWidth={2}
                  />
                </div>

                <h2 className="mt-8 text-[30px] font-semibold tracking-tight text-slate-700">
                  Berhasil!
                </h2>

                <p className="mt-5 text-[18px] text-slate-500">
                  Data berhasil dihapus!
                </p>

                <button
                  type="button"
                  onClick={closeSuccessDialog}
                  className="mt-10 inline-flex h-14 min-w-[72px] items-center justify-center rounded-md bg-emerald-500 px-7 text-base font-semibold text-white transition hover:bg-emerald-600"
                >
                  OK
                </button>
              </div>
            ) : null}

            {dialogState === "error" ? (
              <div className="flex flex-col items-center px-8 pb-10 pt-10 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-red-100 bg-white">
                  <X
                    className="h-14 w-14 text-red-500"
                    strokeWidth={2}
                  />
                </div>

                <h2 className="mt-8 text-[30px] font-semibold tracking-tight text-slate-700">
                  Gagal!
                </h2>

                <p className="mt-5 text-[16px] leading-7 text-slate-500">
                  {errorMessage ||
                    "Data gagal dihapus."}
                </p>

                <button
                  type="button"
                  onClick={closeDialog}
                  className="mt-10 inline-flex h-14 min-w-[92px] items-center justify-center rounded-md bg-red-500 px-7 text-base font-semibold text-white transition hover:bg-red-600"
                >
                  Tutup
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}