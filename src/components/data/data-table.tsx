import type { ReactNode } from "react";
import { EmptyState } from "@/components/states/empty-state";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T) => string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: ReactNode;
  className?: string;
};

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyTitle,
  emptyDescription,
  emptyAction,
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card/80 shadow-sm",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={getRowKey(item)}
                className="border-b border-border transition hover:bg-muted/40 last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-5 py-4 text-sm text-foreground",
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}