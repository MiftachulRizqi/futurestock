import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-3xl border border-border bg-card/80 p-4">
      <p className="text-sm text-muted-foreground">
        Halaman {currentPage} dari {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
        >
          <Link href={`${basePath}?page=${currentPage - 1}`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Sebelumnya
          </Link>
        </Button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <Button
            key={page}
            asChild
            size="sm"
            variant={
              page === currentPage
                ? "default"
                : "outline"
            }
          >
            <Link href={`${basePath}?page=${page}`}>
              {page}
            </Link>
          </Button>
        ))}

        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
        >
          <Link href={`${basePath}?page=${currentPage + 1}`}>
            Berikutnya
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}