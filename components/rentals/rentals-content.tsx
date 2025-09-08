"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockRentals, mockVehicles, mockCustomers, type Rental } from "@/lib/mock-data"
import { Search, Filter, MoreHorizontal, Eye, Download, Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { CreateRentalWizard } from "./create-rental-wizard"

const getStatusColor = (status: Rental["status"]) => {
  switch (status) {
    case "Upcoming":
      return "bg-chart-2 text-white"
    case "Active":
      return "bg-primary text-primary-foreground"
    case "Completed":
      return "bg-success text-success-foreground"
    case "Cancelled":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
}

export function RentalsContent() {
  const [rentals] = useState<Rental[]>(mockRentals)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [showCreateWizard, setShowCreateWizard] = useState(false)

  const filteredRentals = rentals.filter((rental) => {
    const vehicle = mockVehicles.find((v) => v.id === rental.vehicleId)
    const customer = mockCustomers.find((c) => c.id === rental.customerId)

    const matchesSearch =
      rental.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || rental.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: rentals.length,
    upcoming: rentals.filter((r) => r.status === "Upcoming").length,
    active: rentals.filter((r) => r.status === "Active").length,
    completed: rentals.filter((r) => r.status === "Completed").length,
    cancelled: rentals.filter((r) => r.status === "Cancelled").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rentals</h1>
          <p className="text-muted-foreground">Manage and track all vehicle rentals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/backoffice/rentals/new">
              <Plus className="h-4 w-4 mr-2" />
              New Rental
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center space-x-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All ({statusCounts.all})
        </Button>
        <Button
          variant={statusFilter === "Upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Upcoming")}
        >
          Upcoming ({statusCounts.upcoming})
        </Button>
        <Button
          variant={statusFilter === "Active" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Active")}
        >
          Active ({statusCounts.active})
        </Button>
        <Button
          variant={statusFilter === "Completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Completed")}
        >
          Completed ({statusCounts.completed})
        </Button>
        <Button
          variant={statusFilter === "Cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Cancelled")}
        >
          Cancelled ({statusCounts.cancelled})
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by rental ID, vehicle, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Rentals Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pickup/Return</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals.map((rental) => {
              const vehicle = mockVehicles.find((v) => v.id === rental.vehicleId)
              const customer = mockCustomers.find((c) => c.id === rental.customerId)

              return (
                <TableRow key={rental.id}>
                  <TableCell className="font-mono text-sm">{rental.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{formatDateRange(rental.start, rental.end)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(rental.start)} → {formatDate(rental.end)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vehicle?.plate}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle?.make} {vehicle?.model}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer?.name}</p>
                      <p className="text-sm text-muted-foreground">{customer?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(rental.status)}>{rental.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{rental.pickupLocation}</p>
                      <p className="text-xs text-muted-foreground">→ {rental.returnLocation}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">€{rental.priceEur.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/backoffice/rentals/${rental.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredRentals.length} of {rentals.length} rentals
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

      {/* Create Rental Wizard */}
      <CreateRentalWizard open={showCreateWizard} onOpenChange={setShowCreateWizard} />
    </div>
  )
}
