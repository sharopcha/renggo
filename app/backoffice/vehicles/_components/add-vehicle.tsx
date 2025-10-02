"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { AddVehicleModal } from "./add-vehicle-modal";

export default function AddVehicle() {

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} variant="default" size="sm">
        <Plus /> Add Vehicle
      </Button>
      <AddVehicleModal open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
