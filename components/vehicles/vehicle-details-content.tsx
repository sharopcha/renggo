"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockVehicles, mockRentals } from "@/lib/mock-data"
import { ArrowLeft, Edit, Power, Star, Calendar, MapPin, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { EditVehicleModal } from "./edit-vehicle-modal"

interface VehicleDetailsContentProps {
  vehicleId: string
}

export function VehicleDetailsContent({ vehicleId }: VehicleDetailsContentProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState<any>(() => mockVehicles.find((v) => v.id === vehicleId))

  const vehicleRentals = mockRentals.filter((r) => r.vehicleId === vehicleId)

  const handleVehicleUpdate = (updatedVehicle: any) => {
    setCurrentVehicle(updatedVehicle)
    const vehicleIndex = mockVehicles.findIndex((v) => v.id === vehicleId)
    if (vehicleIndex !== -1) {
      mockVehicles[vehicleIndex] = updatedVehicle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-success text-success-foreground"
      case "On Trip":
        return "bg-primary text-primary-foreground"
      case "Maintenance":
        return "bg-warning text-warning-foreground"
      case "Inactive":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const maintenanceTasks = [
    { date: "2025-02-15", task: "Oil Change", status: "Scheduled", priority: "Medium" },
    { date: "2025-03-01", task: "Tire Rotation", status: "Pending", priority: "Low" },
    { date: "2025-04-10", task: "Annual Inspection", status: "Due Soon", priority: "High" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/vehicles">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentVehicle.make} {currentVehicle.model}
            </h1>
            <p className="text-muted-foreground">
              {currentVehicle.plate} • {currentVehicle.year}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Vehicle
          </Button>
          <Button variant="outline">
            <Power className="h-4 w-4 mr-2" />
            {currentVehicle.status === "Inactive" ? "Activate" : "Deactivate"}
          </Button>
        </div>
      </div>

      {/* Vehicle Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative h-48 w-80 rounded-lg overflow-hidden bg-muted">
              <Image
                src={currentVehicle.photoUrl || "/placeholder.svg"}
                alt={`${currentVehicle.make} ${currentVehicle.model}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={getStatusColor(currentVehicle.status)}>{currentVehicle.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm font-medium">{currentVehicle.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Class</span>
                    <Badge variant="outline">{currentVehicle.class}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="text-sm font-medium">{currentVehicle.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lifetime Revenue</span>
                    <span className="text-sm font-medium">€{currentVehicle.lifetimeRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Trips</span>
                    <span className="text-sm font-medium">{currentVehicle.totalTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Utilization</span>
                    <span className="text-sm font-medium">{currentVehicle.utilizationPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Odometer</span>
                    <span className="text-sm font-medium">{currentVehicle.odometerKm.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VIN</span>
                  <span className="font-mono text-sm">{currentVehicle.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Make & Model</span>
                  <span>
                    {currentVehicle.make} {currentVehicle.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year</span>
                  <span>{currentVehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span>{currentVehicle.class}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Rate</span>
                  <span>€{currentVehicle.baseDailyRateEur}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Revenue</span>
                  <span>€{Math.round(currentVehicle.lifetimeRevenue / 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Trip Duration</span>
                  <span>2.3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span>{currentVehicle.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>Scheduled maintenance tasks for this vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceTasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task.date}</TableCell>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>
                        <Badge variant={task.status === "Due Soon" ? "destructive" : "secondary"}>{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.priority === "High"
                              ? "destructive"
                              : task.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Documents</CardTitle>
              <CardDescription>Legal documents and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentVehicle.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.type}</p>
                        <p className="text-sm text-muted-foreground">Expires: {doc.expiry}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        doc.status === "Valid" ? "default" : doc.status === "Expiring" ? "destructive" : "secondary"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>Daily rates and pricing rules for this vehicle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Daily Rate</span>
                    <span className="font-medium">€{currentVehicle.baseDailyRateEur}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weekend Multiplier</span>
                    <span className="font-medium">{currentVehicle.weekendMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included KM/Day</span>
                    <span className="font-medium">{currentVehicle.includedKmPerDay} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overage Fee</span>
                    <span className="font-medium">€{currentVehicle.overageFee}/km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>Recent rentals for this vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              {vehicleRentals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rental ID</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicleRentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell className="font-mono">{rental.id}</TableCell>
                        <TableCell>
                          {new Date(rental.start).toLocaleDateString()} - {new Date(rental.end).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={rental.status === "Completed" ? "default" : "secondary"}>
                            {rental.status}
                          </Badge>
                        </TableCell>
                        <TableCell>€{rental.priceEur}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No rental history available for this vehicle</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* EditVehicleModal component */}
      <EditVehicleModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        vehicle={currentVehicle}
        onVehicleUpdate={handleVehicleUpdate}
      />
    </div>
  )
}
