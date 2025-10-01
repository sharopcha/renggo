"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  CircleDashed, Ellipsis,
  Text
} from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import type { DataTableRowAction } from "@/types/data-table";

import { Vehicle } from "@/types/supabase-utils";
import { vehicleCalssIcons } from "../_lib/utils";

interface GetVehiclesTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Vehicle> | null>
  >;
  vehicleClassEnum: Record<string, string>;
}

export function getVehiclesTableColumns({
  setRowAction,
  vehicleClassEnum,
}: GetVehiclesTableColumnsProps): ColumnDef<Vehicle>[] {

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "plate",
      accessorKey: "plate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Plate" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("plate")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "modelYear",
      accessorKey: "modelYear",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model/Year" />
      ),
      accessorFn: (row) => `${row.model ?? ""} ${row.year ?? ""}`.trim(),
      cell: ({ row }) => {
          return (
          <div className="flex items-center gap-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("modelYear")}
            </span>
          </div>
        );
      },
      meta: {
        label: "Model/Year",
        placeholder: "Search model/year...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: "vehicle_class",
      accessorKey: "vehicle_class",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle Class" />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <span className="capitalize">{row.getValue('vehicle_class')}</span>
          </Badge>
        );
      },
      meta: {
        label: "Vehicle Class",
        variant: "multiSelect",
        options: Object.entries(vehicleClassEnum).map(([key, value]) => {
          return {
            label: value,
            value: key,
            icon: vehicleCalssIcons[key],
          }
        }),
        icon: CircleDashed,
      },
      enableColumnFilter: true,
    },
    {
      id: "location",
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("location")}</div>,
      enableSorting: true,
      enableHiding: true,
      enableGlobalFilter: true,
    },
    {
      id: "odometer_km",
      accessorKey: "odometer_km",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Odometer" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("odometer_km")} km</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "lifetime_revenue_eur",
      accessorKey: "lifetime_revenue_eur",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lifetime Revenue" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("lifetime_revenue_eur")} €</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "total_trips",
      accessorKey: "total_trips",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Trips" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("total_trips")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    // {
    //   id: "priority",
    //   accessorKey: "priority",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Priority" />
    //   ),
    //   cell: ({ cell }) => {
    //     const priority = tasks.priority.enumValues.find(
    //       (priority) => priority === cell.getValue<Vehicle["priority"]>(),
    //     );

    //     if (!priority) return null;

    //     const Icon = getPriorityIcon(priority);

    //     return (
    //       <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
    //         <Icon />
    //         <span className="capitalize">{priority}</span>
    //       </Badge>
    //     );
    //   },
    //   meta: {
    //     label: "Priority",
    //     variant: "multiSelect",
    //     options: tasks.priority.enumValues.map((priority) => ({
    //       label: priority.charAt(0).toUpperCase() + priority.slice(1),
    //       value: priority,
    //       count: priorityCounts[priority],
    //       icon: getPriorityIcon(priority),
    //     })),
    //     icon: ArrowUpDown,
    //   },
    //   enableColumnFilter: true,
    // },
    // {
    //   id: "estimatedHours",
    //   accessorKey: "estimatedHours",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Est. Hours" />
    //   ),
    //   cell: ({ cell }) => {
    //     const estimatedHours = cell.getValue<number>();
    //     return <div className="w-20 text-right">{estimatedHours}</div>;
    //   },
    //   meta: {
    //     label: "Est. Hours",
    //     variant: "range",
    //     range: [estimatedHoursRange.min, estimatedHoursRange.max],
    //     unit: "hr",
    //     icon: Clock,
    //   },
    //   enableColumnFilter: true,
    // },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
