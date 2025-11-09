"use client";

import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { Ban, CheckCircle2, Download, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/types/supabase-utils";

const actions = [
  "update-status",
  "verify",
  "export",
  "delete",
] as const;

type Action = (typeof actions)[number];

interface CustomersTableActionBarProps {
  table: Table<Customer>;
}

const customerStatuses = ["Active", "Banned", "Suspended", "Inactive"] as const;

export function CustomersTableActionBar({ table }: CustomersTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onCustomerStatusUpdate = React.useCallback(
    (status: string) => {
      setCurrentAction("update-status");
      startTransition(async () => {
        // TODO: Implement status update
        toast.success(`Status updated to ${status}`);
      });
    },
    [rows],
  );

  const onCustomerVerify = React.useCallback(() => {
    setCurrentAction("verify");
    startTransition(async () => {
      // TODO: Implement verification
      toast.success("Customers verified");
    });
  }, [rows]);

  const onCustomerExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      // TODO: Implement export
      toast.success("Export started");
    });
  }, [table]);

  const onCustomerDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      // TODO: Implement delete
      toast.success("Customers deleted");
      table.toggleAllRowsSelected(false);
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <Select onValueChange={onCustomerStatusUpdate}>
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={getIsActionPending("update-status")}
            >
              <Ban />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {customerStatuses.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip="Verify customers"
          isPending={getIsActionPending("verify")}
          onClick={onCustomerVerify}
        >
          <CheckCircle2 />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Export customers"
          isPending={getIsActionPending("export")}
          onClick={onCustomerExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete customers"
          isPending={getIsActionPending("delete")}
          onClick={onCustomerDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
