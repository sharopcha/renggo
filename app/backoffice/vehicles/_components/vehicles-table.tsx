"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useMessages } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useFeatureFlags } from "@/components/feature-flags-provider";
import { Vehicle } from "@/types/supabase-utils";
import type { DataTableRowAction } from "@/types/data-table";
import { createClient } from "@/lib/supabase/client";
import { TasksTableActionBar } from "./vehicles-table-action-bar";
import {
  useVehiclesTableColumns
} from "./vehicles-table-columns";
import { useDataTable } from "@/hooks/use-data-table";
import { getVehiles } from "../_lib/queries";

interface VehiclesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getVehiles>>
      // Awaited<ReturnType<typeof getTaskStatusCounts>>,
      // Awaited<ReturnType<typeof getTaskPriorityCounts>>,
      // Awaited<ReturnType<typeof getEstimatedHoursRange>>,
    ]
  >;
}

export default function VehiclesTable() {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();
  const supabase = createClient();
  const messages = useMessages();

  const { data, isLoading, error } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*");
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Vehicle> | null>(null);

  const columns = useVehiclesTableColumns({
    setRowAction,
    vehicleClassEnum: (messages as any).enums?.vehicleClass as Record<
      string,
      string
    >,
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
    <DataTable table={table} actionBar={<TasksTableActionBar table={table} />}>
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
