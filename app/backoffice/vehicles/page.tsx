'use client';
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  getVehicleColumns,
  TypedColumnDef,
  Vehicle,
} from "@/components/vehicles/vehicle-table-column";
import { VehiclesContent } from "@/components/vehicles/vehicles-content";
import { useDataTable } from "@/hooks/use-data-table";
import { mockVehicles } from "@/lib/mock-data";
import React from "react";

export default function VehiclesPage() {
  const columns = React.useMemo<TypedColumnDef<Vehicle>[]>(
    () => getVehicleColumns(),
    []
  );

  const { table } = useDataTable({
    data: mockVehicles,
    columns: columns,
    // Pass the total number of pages for the table
    pageCount: 10,
    initialState: {
      sorting: [{ id: "id", desc: true }],
      pagination: { pageSize: 10, pageIndex: 0 },
    },
    // Unique identifier for rows, can be used for unique row selection
    getRowId: (row) => row.id,
  });

  return (
    <main className="flex-1 overflow-auto p-6">
      {/* <VehiclesContent /> */}
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} />
        </DataTableToolbar>
      </DataTable>
    </main>
  );
}
