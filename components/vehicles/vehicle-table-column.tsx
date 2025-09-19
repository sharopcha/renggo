import React from "react";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Edit, Eye, LucideIcon, MoreHorizontal, Power } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";

export type ColumnMeta = {
  label: string;
  placeholder?: string;
  variant?: "text" | "select" | "date";
  icon?: LucideIcon;
};

export type TypedColumnDef<T> = ColumnDef<T, any> & {
  meta?: ColumnMeta;
};

export type Vehicle = {
  photoUrl: string;
  make: string;
  model: string;
  plate: string;
  year: number;
  class: string;
  status: string;
  location: string;
  odometerKm: number;
  utilizationPct: number;
  lifetimeRevenue: number;
  id: string;
};

export const getVehicleColumns = (): TypedColumnDef<Vehicle>[] => {
  return [
    {
      id: "photoUrl",
      accessorKey: "photoUrl",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="relative h-12 w-20 rounded-md overflow-hidden bg-muted">
            <Image
              src={row.getValue("photoUrl") || "/placeholder.svg"}
              alt={`${row.original.make} ${row.original.model}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      ),
      enableColumnFilter: true
    },
    {
      id: "plate",
      accessorKey: "plate",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Plate" />
      ),
      cell: ({ row }) => <div>{row.getValue("plate")}</div>,
      enableColumnFilter: true,
      enableSorting: true
    },
    {
      id: "modelYear",
      accessorKey: "modelYear",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model/Year" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.make} {row.original.model}
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.year}
          </p>
        </div>
      ),
      enableColumnFilter: true
    },
    {
      id: "class",
      accessorKey: "class",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("class")}</Badge>
      ),
      enableColumnFilter: true
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("status")}</Badge>
      ),
      enableColumnFilter: true
    },
    {
      id: "location",
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
      enableColumnFilter: true
    },
    {
      id: "odometerKm",
      accessorKey: "odometerKm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Odometer (km)" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("odometerKm")?.toLocaleString()} km</div>
      ),
      enableColumnFilter: true
    },
    {
      id: "utilizationPct",
      accessorKey: "utilizationPct",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Utilization (%)" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${row.getValue("utilizationPct")}%` }}
            />
          </div>
          <span className="text-sm">{row.getValue("utilizationPct")}%</span>
        </div>
      ),
      enableColumnFilter: true
    },
    {
      id: "lifetimeRevenue",
      accessorKey: "lifetimeRevenue",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lifetime Revenue" />
      ),
      cell: ({ row }) => (
        <div>€{row.getValue("lifetimeRevenue")?.toLocaleString()}</div>
      ),
      enableColumnFilter: true
    },
    {
      id: "more",
      accessorKey: "more",
      header: ({ column }) => <div className="w-[50px]"></div>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/backoffice/vehicles/${row.original.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Vehicle
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Power className="h-4 w-4 mr-2" />
              {row.getValue("status") === "Inactive"
                ? "Activate"
                : "Deactivate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableColumnFilter: true
    },
  ];
}
