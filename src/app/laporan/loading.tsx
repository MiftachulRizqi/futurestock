import { TablePageSkeleton } from "@/components/skeletons/dashboard-skeletons";

export default function LaporanLoading() {
  return <TablePageSkeleton stats={3} rows={7} withAction />;
}