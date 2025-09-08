"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockVehicles, type Vehicle } from "@/lib/mock-data"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Power } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AddVehicleModal } from "./add-vehicle-modal"

const getStatusColor = (status: Vehicle["status"]) => {
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

export function VehiclesContent() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesClass = classFilter === "all" || vehicle.class === classFilter

    return matchesSearch && matchesStatus && matchesClass
  })

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your fleet vehicles and their details</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by plate, model, or make..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="On Trip">On Trip</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="Economy">Economy</SelectItem>
            <SelectItem value="Compact">Compact</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Vehicles Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Plate</TableHead>
              <TableHead>Model/Year</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Odometer</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-20 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={vehicle.photoUrl || "/placeholder.svg"}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{vehicle.plate}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{vehicle.class}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                </TableCell>
                <TableCell>{vehicle.location}</TableCell>
                <TableCell>{vehicle.odometerKm.toLocaleString()} km</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${vehicle.utilizationPct}%` }} />
                    </div>
                    <span className="text-sm">{vehicle.utilizationPct}%</span>
                  </div>
                </TableCell>
                <TableCell>€{vehicle.lifetimeRevenue.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/backoffice/vehicles/${vehicle.id}`}>
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
                        {vehicle.status === "Inactive" ? "Activate" : "Deactivate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
