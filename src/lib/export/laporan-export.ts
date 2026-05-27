import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type Product = {
  id: string;
  name: string;
  stock: number;
  price: number;
};

export function exportLaporanPDF(products: Product[], metrics: any) {
  const doc = new jsPDF();

  doc.text("Laporan FutureStock", 14, 15);

  doc.text(
    `Total Produk: ${metrics.totalProducts}`,
    14,
    25
  );

  doc.text(
    `Nilai Inventaris: ${metrics.inventoryValue}`,
    14,
    32
  );

  doc.text(
    `Stok Menipis: ${metrics.lowStockProducts.length}`,
    14,
    39
  );

  autoTable(doc, {
    startY: 50,
    head: [["ID", "Nama", "Stok", "Harga"]],
    body: products.map((p) => [
      p.id,
      p.name,
      p.stock,
      p.price,
    ]),
  });

  doc.save("laporan-futurestock.pdf");
}

export function exportLaporanExcel(products: Product[]) {
  const ws = XLSX.utils.json_to_sheet(products);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan");

  XLSX.writeFile(wb, "laporan-futurestock.xlsx");
}