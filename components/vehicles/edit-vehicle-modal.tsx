"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Vehicle {
  id: string
  plate: string
  vin: string
  make: string
  model: string
  year: number
  class: string
  color: string
  seats: number
  transmission: string
  fuelType: string
  avgConsumption: number
  odometerKm: number
  status: string
  baseDailyRateEur: number
  weekendMultiplier: number
  includedKmPerDay: number
  overageFee: number
  location: string
  documents: Array<{
    type: string
    expiry: string
    status: string
  }>
}

interface EditVehicleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: Vehicle
  onVehicleUpdate: (updatedVehicle: Vehicle) => void
}

export function EditVehicleModal({ open, onOpenChange, vehicle, onVehicleUpdate }: EditVehicleModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    plate: vehicle?.plate || "",
    vin: vehicle?.vin || "",
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year ? vehicle.year.toString() : "",
    class: vehicle?.class || "",
    color: vehicle?.color || "",
    seats: vehicle?.seats ? vehicle.seats.toString() : "",
    transmission: vehicle?.transmission || "",
    fuelType: vehicle?.fuelType || "",
    avgConsumption: vehicle?.avgConsumption ? vehicle.avgConsumption.toString() : "",
    odometer: vehicle?.odometerKm ? vehicle.odometerKm.toString() : "",
    status: vehicle?.status || "",
    baseDailyRate: vehicle?.baseDailyRateEur ? vehicle.baseDailyRateEur.toString() : "",
    weekendMultiplier: vehicle?.weekendMultiplier ? vehicle.weekendMultiplier.toString() : "",
    includedKmPerDay: vehicle?.includedKmPerDay ? vehicle.includedKmPerDay.toString() : "",
    overageFee: vehicle?.overageFee ? vehicle.overageFee.toString() : "",
    registrationExpiry: vehicle?.documents?.find((d) => d.type === "Registration")?.expiry || "",
    insuranceExpiry: vehicle?.documents?.find((d) => d.type === "Insurance")?.expiry || "",
    inspectionExpiry: vehicle?.documents?.find((d) => d.type === "Inspection")?.expiry || "",
    location: vehicle?.location || "",
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock form submission with delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create updated vehicle object
      const updatedVehicle: Vehicle = {
        ...vehicle,
        plate: formData.plate,
        vin: formData.vin,
        make: formData.make,
        model: formData.model,
        year: Number.parseInt(formData.year) || vehicle.year || 2020,
        class: formData.class,
        color: formData.color,
        seats: Number.parseInt(formData.seats) || vehicle.seats || 5,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        avgConsumption: Number.parseFloat(formData.avgConsumption) || vehicle.avgConsumption || 0,
        odometerKm: Number.parseInt(formData.odometer) || vehicle.odometerKm || 0,
        status: formData.status,
        baseDailyRateEur: Number.parseFloat(formData.baseDailyRate) || vehicle.baseDailyRateEur || 0,
        weekendMultiplier: Number.parseFloat(formData.weekendMultiplier) || vehicle.weekendMultiplier || 1,
        includedKmPerDay: Number.parseInt(formData.includedKmPerDay) || vehicle.includedKmPerDay || 200,
        overageFee: Number.parseFloat(formData.overageFee) || vehicle.overageFee || 0,
        location: formData.location,
        documents: (vehicle.documents || []).map((doc) => {
          if (doc.type === "Registration" && formData.registrationExpiry) {
            return { ...doc, expiry: formData.registrationExpiry }
          }
          if (doc.type === "Insurance" && formData.insuranceExpiry) {
            return { ...doc, expiry: formData.insuranceExpiry }
          }
          if (doc.type === "Inspection" && formData.inspectionExpiry) {
            return { ...doc, expiry: formData.inspectionExpiry }
          }
          return doc
        }),
      }

      // Update the vehicle data
      onVehicleUpdate(updatedVehicle)

      toast({
        title: "Vehicle updated",
        description: "Vehicle details have been successfully updated.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">Edit Vehicle</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Update the details for {vehicle?.make || "Unknown"} {vehicle?.model || "Vehicle"} (
                {vehicle?.plate || "N/A"})
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* A. Vehicle Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vehicle Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">License Plate *</Label>
                  <Input
                    id="plate"
                    value={formData.plate}
                    onChange={(e) => updateFormData("plate", e.target.value)}
                    placeholder="123 ABC"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN Number *</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => updateFormData("vin", e.target.value)}
                    placeholder="WVWZZZ1JZXW000001"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => updateFormData("make", e.target.value)}
                    placeholder="Toyota"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => updateFormData("model", e.target.value)}
                    placeholder="Corolla"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => updateFormData("year", e.target.value)}
                    placeholder="2023"
                    min="2000"
                    max="2025"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Vehicle Class *</Label>
                  <Select value={formData.class} onValueChange={(value) => updateFormData("class", value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Economy">Economy</SelectItem>
                      <SelectItem value="Compact">Compact</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => updateFormData("color", e.target.value)}
                    placeholder="Silver"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => updateFormData("seats", e.target.value)}
                    placeholder="5"
                    min="2"
                    max="9"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => updateFormData("transmission", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => updateFormData("fuelType", value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* B. Technical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Technical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avgConsumption">Average Consumption (L/100km)</Label>
                  <Input
                    id="avgConsumption"
                    type="number"
                    step="0.1"
                    value={formData.avgConsumption}
                    onChange={(e) => updateFormData("avgConsumption", e.target.value)}
                    placeholder="6.5"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odometer">Odometer (km)</Label>
                  <Input
                    id="odometer"
                    type="number"
                    value={formData.odometer}
                    onChange={(e) => updateFormData("odometer", e.target.value)}
                    placeholder="50000"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Trip">On Trip</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* C. Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseDailyRate">Base Daily Rate (€) *</Label>
                  <Input
                    id="baseDailyRate"
                    type="number"
                    value={formData.baseDailyRate}
                    onChange={(e) => updateFormData("baseDailyRate", e.target.value)}
                    placeholder="35"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekendMultiplier">Weekend Multiplier</Label>
                  <Input
                    id="weekendMultiplier"
                    type="number"
                    step="0.1"
                    value={formData.weekendMultiplier}
                    onChange={(e) => updateFormData("weekendMultiplier", e.target.value)}
                    placeholder="1.2"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="includedKmPerDay">Included km/day</Label>
                  <Input
                    id="includedKmPerDay"
                    type="number"
                    value={formData.includedKmPerDay}
                    onChange={(e) => updateFormData("includedKmPerDay", e.target.value)}
                    placeholder="200"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overageFee">Overage Fee (€/km)</Label>
                  <Input
                    id="overageFee"
                    type="number"
                    step="0.01"
                    value={formData.overageFee}
                    onChange={(e) => updateFormData("overageFee", e.target.value)}
                    placeholder="0.25"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* D. Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationExpiry">Registration Expiry</Label>
                  <Input
                    id="registrationExpiry"
                    type="date"
                    value={formData.registrationExpiry}
                    onChange={(e) => updateFormData("registrationExpiry", e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                  <Input
                    id="insuranceExpiry"
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={(e) => updateFormData("insuranceExpiry", e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="inspectionExpiry">Inspection Expiry</Label>
                  <Input
                    id="inspectionExpiry"
                    type="date"
                    value={formData.inspectionExpiry}
                    onChange={(e) => updateFormData("inspectionExpiry", e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* E. Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">City *</Label>
                  <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tallinn">Tallinn</SelectItem>
                      <SelectItem value="Riga">Riga</SelectItem>
                      <SelectItem value="Vilnius">Vilnius</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address/Location Notes</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Optional address or location details"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4 flex-shrink-0">
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
