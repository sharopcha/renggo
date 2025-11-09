"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { AddCustomerModal } from "./add-customer-modal";

export default function AddCustomer() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} variant="default" size="sm">
        <Plus /> Add Customer
      </Button>
      <AddCustomerModal open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
