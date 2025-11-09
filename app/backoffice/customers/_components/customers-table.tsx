"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useFeatureFlags } from "@/components/feature-flags-provider";
import { Customer } from "@/types/supabase-utils";
import type { DataTableRowAction } from "@/types/data-table";
import { createClient } from "@/lib/supabase/client";
import { CustomersTableActionBar } from "./customers-table-action-bar";
import { useCustomersTableColumns } from "./customers-table-columns";
import { useDataTable } from "@/hooks/use-data-table";

export default function CustomersTable() {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();
  const supabase = createClient();

  const { data, isLoading, error } = useQuery<Customer[]>({
    queryKey: ["customers"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*");
      if (error) throw error;
      return data as Customer[];
    },
  });

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Customer> | null>(null);

  const columns = useCustomersTableColumns({
    setRowAction,
  });

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: data || [],
    columns,
    pageCount: -1,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table} actionBar={<CustomersTableActionBar table={table} />}>
      {enableAdvancedFilter ? (
        <DataTableAdvancedToolbar table={table}>
          <DataTableSortList table={table} align="start" />
          {filterFlag === "advancedFilters" ? (
            <DataTableFilterList
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
              align="start"
            />
          ) : (
            <DataTableFilterMenu
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
            />
          )}
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      )}
    </DataTable>
  );
}
