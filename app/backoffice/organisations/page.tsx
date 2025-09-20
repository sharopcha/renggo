"use client";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableActionBar } from "@/components/data-table/data-table-action-bar";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDataTable } from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { TypedColumnDef } from "@/types/data-table";
import { Download, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { createOrganisationAndInvite } from "./actions";

interface Organisation {
  id: string;
  name: string;
  location: string;
  createdAt: Date;
}

const columns: TypedColumnDef<Organisation>[] = [];

export default function OrganisationsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    organisationName: "",
    taxRegisterNumber: "",
    inviteEmail: "",
    firstName: "",
    lastName: "",
  });

  const { table } = useDataTable({
    data: [],
    columns: columns,
    // Pass the total number of pages for the table
    pageCount: 10,
    initialState: {
      sorting: [{ id: "id", desc: true }],
      pagination: { pageSize: 10, pageIndex: 0 },
    },
    getRowId: (row) => row.id,
  });

  const onFormValueChange = (event: React.FormEvent<HTMLFormElement>) => {
    const { id, value } = event.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const createOrganisation = async () => {
    startTransition(async () => {
      try {
        await createOrganisationAndInvite({
          organisationName: formData.organisationName,
          taxRegisterNumber: formData.taxRegisterNumber,
          inviteEmail: formData.inviteEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        setIsDrawerOpen(false);
        // toast.success('Organisation created and invite sent');
      } catch (e: any) {
        console.error(e);
        // toast.error(e.message ?? 'Failed');
      }
    });
  };

  return (
    <Drawer
      direction="right"
      dismissible={false}
      modal={true}
      onOpenChange={setIsDrawerOpen}
      open={isDrawerOpen}
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organisations</h1>
            <p className="text-muted-foreground">
              Manage organisations and their details
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <DrawerTrigger asChild>
              <Button asChild>
                <span>
                  <Plus className="h-4 w-4 mr-1" />
                  New Organisation
                </span>
              </Button>
            </DrawerTrigger>
          </div>
        </div>

        <div className="mt-8">
          <DataTable
            table={table}
            actionBar={<DataTableActionBar table={table} />}
          >
            <DataTableAdvancedToolbar table={table}>
              <DataTableFilterMenu table={table} />
            </DataTableAdvancedToolbar>
          </DataTable>
        </div>
      </main>

      <DrawerContent>
        <div className="mx-auto w-full max-w-xl h-dvh flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Organisation Details</DrawerTitle>
            <DrawerDescription>
              View and edit organisation details.
            </DrawerDescription>
          </DrawerHeader>
          <form
            className="p-4 flex flex-col gap-3"
            onChange={onFormValueChange}
          >
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="organisationName">Organisation Name</Label>
              <Input id="organisationName" type="text" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="taxRegisterNumber">Tax Register Number</Label>
              <Input id="taxRegisterNumber" type="text" />
            </div>
            <Separator className="my-4" />
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="inviteEmail">Invite Email</Label>
              <Input id="inviteEmail" type="email" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" type="text" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" type="text" />
            </div>
          </form>
          <div className="flex-1"></div>
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2 md:flex-row">
              <Button onClick={() => setIsDrawerOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={createOrganisation}>Save</Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
