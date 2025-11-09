"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  Ellipsis,
  Mail,
  Phone,
  User
} from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import type { DataTableRowAction } from "@/types/data-table";
import { Customer } from "@/types/supabase-utils";

type Props = {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Customer> | null>>;
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "Active":
      return "bg-success text-success-foreground";
    case "Banned":
      return "bg-destructive text-destructive-foreground";
    case "Suspended":
      return "bg-warning text-warning-foreground";
    case "Inactive":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function useCustomersTableColumns({ setRowAction }: Props) {
  return React.useMemo<ColumnDef<Customer>[]>(() => [
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
      id: "customer",
      accessorKey: "first_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
      cell: ({ row }) => {
        const firstName = row.original.first_name;
        const lastName = row.original.last_name;
        const fullName = `${firstName} ${lastName}`;
        const avatarUrl = row.original.avatar_url;
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback>
                {firstName?.[0]}{lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{fullName}</p>
              {row.original.country && (
                <p className="text-sm text-muted-foreground">{row.original.country}</p>
              )}
            </div>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.getValue("email")}</span>
        </div>
      ),
      meta: {
        label: "Email",
        variant: "text",
        icon: Mail,
      },
      enableColumnFilter: true,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string | null;
        if (!phone) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{phone}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "verification",
      accessorKey: "is_verified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Verification" />
      ),
      cell: ({ row }) => {
        const isVerified = row.getValue("verification") as boolean;
        return isVerified ? (
          <Badge variant="default" className="bg-success text-success-foreground">
            Verified
          </Badge>
        ) : (
          <Badge variant="secondary">
            Unverified
          </Badge>
        );
      },
      meta: {
        label: "Verification",
        variant: "select",
        options: [
          { label: "Verified", value: "true" },
          { label: "Unverified", value: "false" },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: "total_trips",
      accessorKey: "total_trips",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trips" />
      ),
      cell: ({ row }) => {
        const trips = row.getValue("total_trips") as number | null;
        return <div className="font-medium">{trips || 0}</div>;
      },
      enableSorting: true,
    },
    {
      id: "total_cancellations",
      accessorKey: "total_cancellations",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cancellations" />
      ),
      cell: ({ row }) => {
        const cancellations = row.getValue("total_cancellations") as number | null;
        return cancellations && cancellations > 0 ? (
          <Badge variant="destructive">{cancellations}</Badge>
        ) : (
          <span className="text-muted-foreground">0</span>
        );
      },
      enableSorting: true,
    },
    {
      id: "lifetime_spend_eur",
      accessorKey: "lifetime_spend_eur",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lifetime Spend" />
      ),
      cell: ({ row }) => {
        const spend = row.getValue("lifetime_spend_eur") as number | null;
        return (
          <div className="font-medium">
            €{(spend || 0).toFixed(2)}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string | null;
        return (
          <Badge className={getStatusColor(status)}>
            {status || "Unknown"}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          { label: "Active", value: "Active" },
          { label: "Banned", value: "Banned" },
          { label: "Suspended", value: "Suspended" },
          { label: "Inactive", value: "Inactive" },
        ],
        icon: User,
      },
      enableColumnFilter: true,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<string | null>();
        return date ? formatDate(new Date(date)) : "-";
      },
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
  ], [setRowAction])
}
