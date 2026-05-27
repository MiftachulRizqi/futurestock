"use client";

import { Download, FileText } from "lucide-react";
import {
  exportLaporanPDF,
  exportLaporanExcel,
} from "@/lib/export/laporan-export";

export function ExportButtons({
  products,
  metrics,
}: {
  products: any[];
  metrics: any;
}) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() =>
          exportLaporanPDF(products, metrics)
        }
        className="inline-flex h-10 items-center justify-center rounded-xl bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-400"
      >
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </button>

      <button
        onClick={() =>
          exportLaporanExcel(products)
        }
        className="inline-flex h-10 items-center justify-center rounded-xl bg-green-500 px-4 text-sm font-medium text-white hover:bg-green-400"
      >
        <FileText className="mr-2 h-4 w-4" />
        Export Excel
      </button>
    </div>
  );
}