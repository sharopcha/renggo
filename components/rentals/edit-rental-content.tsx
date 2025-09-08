"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { mockRentals, mockCustomers, mockVehicles } from "@/lib/mock-data"
import { ArrowLeft, Save, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface EditRentalContentProps {
  rentalId: string
}

export function EditRentalContent({ rentalId }: EditRentalContentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const rental = mockRentals.find((r) => r.id === rentalId)
  const vehicle = rental ? mockVehicles.find((v) => v.id === rental.vehicleId) : null
  const customer = rental ? mockCustomers.find((c) => c.id === rental.customerId) : null

  const [formData, setFormData] = useState({
    customerId: rental?.customerId || "",
    vehicleId: rental?.vehicleId || "",
    startDate: rental?.start.split("T")[0] || "",
    startTime: rental?.start.split("T")[1]?.substring(0, 5) || "10:00",
    endDate: rental?.end.split("T")[0] || "",
    endTime: rental?.end.split("T")[1]?.substring(0, 5) || "10:00",
    pickupLocation: rental?.pickupLocation || "",
    returnLocation: rental?.returnLocation || "",
    coverageTier: "standard",
    extras: [] as string[],
    notes: "",
  })

  if (!rental || !vehicle || !customer) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Rental Not Found</h1>
          <p className="text-muted-foreground">The rental you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/rentals">Back to Rentals</Link>
          </Button>
        </div>
      </div>
    )
  }

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    setIsDirty(true)
  }

  const canEdit = (field: string) => {
    switch (rental.status) {
      case "Upcoming":
        return true
      case "Active":
        return ["endDate", "endTime", "extras", "notes"].includes(field)
      case "Completed":
      case "Cancelled":
        return false
      default:
        return false
    }
  }

  const getFieldTooltip = (field: string) => {
    if (canEdit(field)) return ""

    switch (rental.status) {
      case "Active":
        return "Only end time, extras, and notes can be modified for active rentals"
      case "Completed":
        return "Completed rentals cannot be modified"
      case "Cancelled":
        return "Cancelled rentals cannot be modified"
      default:
        return "This field cannot be modified"
    }
  }

  const handleSave = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Navigate back to rental details
    router.push(`/rentals/${rentalId}`)
    toast({
      title: "Rental updated",
      description: "The rental has been successfully updated.",
    })

    setIsLoading(false)
    setIsDirty(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/rentals/${rentalId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <nav className="text-sm text-muted-foreground mb-1">
              <Link href="/rentals" className="hover:text-foreground">
                Rentals
              </Link>
              <span className="mx-2">/</span>
              <Link href={`/rentals/${rentalId}`} className="hover:text-foreground">
                {rentalId}
              </Link>
              <span className="mx-2">/</span>
              <span>Edit</span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight">Update Rental Details</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            className={
              rental.status === "Upcoming"
                ? "bg-chart-2"
                : rental.status === "Active"
                  ? "bg-primary"
                  : rental.status === "Completed"
                    ? "bg-success"
                    : "bg-destructive"
            }
          >
            {rental.status}
          </Badge>
          <Button onClick={handleSave} disabled={!isDirty || isLoading} className="min-w-[100px]">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Warning */}
      {rental.status !== "Upcoming" && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Limited Editing</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {rental.status === "Active"
                    ? "This rental is active. Only end time, extras, and notes can be modified."
                    : "This rental cannot be modified due to its current status."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer & Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Customer & Drivers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Primary Renter</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => updateFormData({ customerId: value })}
                disabled={!canEdit("customerId")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!canEdit("customerId") && (
                <p className="text-xs text-muted-foreground mt-1">{getFieldTooltip("customerId")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle & Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle & Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Vehicle</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => updateFormData({ vehicleId: value })}
                disabled={!canEdit("vehicleId")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!canEdit("vehicleId") && (
                <p className="text-xs text-muted-foreground mt-1">{getFieldTooltip("vehicleId")}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData({ startDate: e.target.value })}
                  disabled={!canEdit("startDate")}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => updateFormData({ startTime: e.target.value })}
                  disabled={!canEdit("startTime")}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateFormData({ endDate: e.target.value })}
                  disabled={!canEdit("endDate")}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => updateFormData({ endTime: e.target.value })}
                  disabled={!canEdit("endTime")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Extras */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Extras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Coverage Tier</Label>
              <Select
                value={formData.coverageTier}
                onValueChange={(value) => updateFormData({ coverageTier: value })}
                disabled={!canEdit("coverageTier")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Extras</Label>
              <div className="space-y-2 mt-2">
                {[
                  { id: "gps", name: "GPS Navigation" },
                  { id: "child-seat", name: "Child Seat" },
                  { id: "additional-driver", name: "Additional Driver" },
                  { id: "wifi", name: "Mobile WiFi" },
                ].map((extra) => (
                  <div key={extra.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={extra.id}
                      checked={formData.extras.includes(extra.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData({ extras: [...formData.extras, extra.id] })
                        } else {
                          updateFormData({ extras: formData.extras.filter((e) => e !== extra.id) })
                        }
                      }}
                      disabled={!canEdit("extras")}
                    />
                    <Label htmlFor={extra.id} className="text-sm">
                      {extra.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes">Internal Notes</Label>
              <textarea
                id="notes"
                className="w-full mt-1 p-2 border rounded-md resize-none"
                rows={4}
                value={formData.notes}
                onChange={(e) => updateFormData({ notes: e.target.value })}
                disabled={!canEdit("notes")}
                placeholder="Add any internal notes about this rental..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
