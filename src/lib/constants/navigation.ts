import {
  BarChart3,
  Bot,
  Boxes,
  Clock3,
  FileText,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  Skull,
} from "lucide-react";

export const dashboardNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produk",
    href: "/produk",
    icon: Package,
  },
  {
    title: "Transaksi",
    href: "/transaksi",
    icon: ReceiptText,
  },
  {
    title: "Inventaris",
    href: "/inventaris",
    icon: Boxes,
  },
  {
    title: "Analitik",
    href: "/analitik",
    icon: BarChart3,
  },
  {
    title: "Prediksi AI",
    href: "/prediksi-ai",
    icon: Bot,
  },
  {
    title: "Dead Stock",
    href: "/dead-stock",
    icon: Skull,
  },
  {
    title: "Aktivitas",
    href: "/aktivitas",
    icon: Clock3,
  },
  {
    title: "Laporan",
    href: "/laporan",
    icon: FileText,
  },
  {
    title: "Pengaturan",
    href: "/pengaturan",
    icon: Settings,
  },
];