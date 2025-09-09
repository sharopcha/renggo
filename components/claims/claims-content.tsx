"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar, Car, User, DollarSign, FileText, MessageSquare, History, X } from "lucide-react"

const mockClaims = [
  {
    id: "CLM-001",
    vehicle: { plate: "ABC-123", model: "Toyota Corolla" },
    renter: "John Smith",
    incidentDate: "2024-01-15",
    estimatedCost: 1200,
    assignee: "Sarah Wilson",
    status: "new",
    description: "Minor fender bender in parking lot. Rear bumper damage.",
    photos: ["damage1.jpg", "damage2.jpg"],
    costBreakdown: { parts: 800, labor: 300, other: 100 },
    notes: "Customer reported incident immediately. Photos uploaded.",
    history: [
      { date: "2024-01-15", action: "Claim submitted", user: "System" },
      { date: "2024-01-15", action: "Assigned to Sarah Wilson", user: "Admin" },
    ],
  },
  {
    id: "CLM-002",
    vehicle: { plate: "XYZ-789", model: "Honda Civic" },
    renter: "Emma Davis",
    incidentDate: "2024-01-12",
    estimatedCost: 2500,
    assignee: "Mike Johnson",
    status: "assessing",
    description: "Windshield crack from road debris on highway.",
    photos: ["windshield1.jpg"],
    costBreakdown: { parts: 400, labor: 150, other: 50 },
    notes: "Waiting for mechanic assessment.",
    history: [
      { date: "2024-01-12", action: "Claim submitted", user: "System" },
      { date: "2024-01-13", action: "Moved to assessing", user: "Mike Johnson" },
    ],
  },
  {
    id: "CLM-003",
    vehicle: { plate: "DEF-456", model: "BMW X3" },
    renter: "Robert Chen",
    incidentDate: "2024-01-10",
    estimatedCost: 3200,
    assignee: "Lisa Park",
    status: "awaiting-docs",
    description: "Side mirror damaged in tight parking space.",
    photos: ["mirror1.jpg", "mirror2.jpg"],
    costBreakdown: { parts: 250, labor: 100, other: 25 },
    notes: "Waiting for police report and additional documentation.",
    history: [
      { date: "2024-01-10", action: "Claim submitted", user: "System" },
      { date: "2024-01-11", action: "Assessment completed", user: "Lisa Park" },
      { date: "2024-01-12", action: "Moved to awaiting docs", user: "Lisa Park" },
    ],
  },
  {
    id: "CLM-004",
    vehicle: { plate: "GHI-789", model: "Volkswagen Golf" },
    renter: "Maria Garcia",
    incidentDate: "2024-01-08",
    estimatedCost: 800,
    assignee: "Tom Wilson",
    status: "approved",
    description: "Scratches on driver side door from shopping cart.",
    photos: ["scratch1.jpg"],
    costBreakdown: { parts: 200, labor: 150, other: 50 },
    notes: "Approved for repair. Customer satisfied with resolution.",
    history: [
      { date: "2024-01-08", action: "Claim submitted", user: "System" },
      { date: "2024-01-09", action: "Assessment completed", user: "Tom Wilson" },
      { date: "2024-01-10", action: "Approved", user: "Tom Wilson" },
    ],
  },
  {
    id: "CLM-005",
    vehicle: { plate: "JKL-012", model: "Ford Focus" },
    renter: "David Brown",
    incidentDate: "2024-01-05",
    estimatedCost: 150,
    assignee: "Sarah Wilson",
    status: "rejected",
    description: "Tire puncture claimed as vehicle defect.",
    photos: ["tire1.jpg"],
    costBreakdown: { parts: 120, labor: 30, other: 0 },
    notes: "Rejected - normal wear and tear, not covered by insurance.",
    history: [
      { date: "2024-01-05", action: "Claim submitted", user: "System" },
      { date: "2024-01-06", action: "Assessment completed", user: "Sarah Wilson" },
      { date: "2024-01-07", action: "Rejected", user: "Sarah Wilson" },
    ],
  },
]

const statusColumns = [
  { id: "new", title: "New", color: "bg-blue-100 text-blue-800" },
  { id: "assessing", title: "Assessing", color: "bg-yellow-100 text-yellow-800" },
  { id: "awaiting-docs", title: "Awaiting Docs", color: "bg-orange-100 text-orange-800" },
  { id: "approved", title: "Approved", color: "bg-green-100 text-green-800" },
  { id: "rejected", title: "Rejected", color: "bg-red-100 text-red-800" },
]

export function ClaimsContent() {
  const [claims, setClaims] = useState(mockClaims)
  const [selectedClaim, setSelectedClaim] = useState<(typeof mockClaims)[0] | null>(null)
  const [filters, setFilters] = useState({
    status: "all",
    vehicle: "",
    renter: "",
    dateRange: "",
  })

  const handleDragStart = (e: React.DragEvent, claimId: string) => {
    e.dataTransfer.setData("text/plain", claimId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const claimId = e.dataTransfer.getData("text/plain")

    setClaims((prevClaims) =>
      prevClaims.map((claim) => (claim.id === claimId ? { ...claim, status: newStatus } : claim)),
    )
  }

  const filteredClaims = claims.filter((claim) => {
    if (filters.status !== "all" && claim.status !== filters.status) return false
    if (
      filters.vehicle &&
      !claim.vehicle.plate.toLowerCase().includes(filters.vehicle.toLowerCase()) &&
      !claim.vehicle.model.toLowerCase().includes(filters.vehicle.toLowerCase())
    )
      return false
    if (filters.renter && !claim.renter.toLowerCase().includes(filters.renter.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header with Filters */}
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-foreground">Insurance & Claims</h1>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusColumns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search vehicle..."
            value={filters.vehicle}
            onChange={(e) => setFilters((prev) => ({ ...prev, vehicle: e.target.value }))}
            className="w-40"
          />

          <Input
            placeholder="Search renter..."
            value={filters.renter}
            onChange={(e) => setFilters((prev) => ({ ...prev, renter: e.target.value }))}
            className="w-40"
          />

          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-5 gap-4 h-full">
          {statusColumns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col bg-muted/30 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {filteredClaims.filter((claim) => claim.status === column.id).length}
                </Badge>
              </div>

              <div className="space-y-3 flex-1">
                {filteredClaims
                  .filter((claim) => claim.status === column.id)
                  .map((claim) => (
                    <Card
                      key={claim.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, claim.id)}
                      onClick={() => setSelectedClaim(claim)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">{claim.id}</CardTitle>
                          <Badge className={column.color}>{column.title}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Car className="h-3 w-3 mr-1" />
                          {claim.vehicle.plate} • {claim.vehicle.model}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          {claim.renter}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {claim.incidentDate}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs font-medium">
                            <DollarSign className="h-3 w-3 mr-1" />${claim.estimatedCost.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">{claim.assignee}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Detail Drawer */}
      <Sheet open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] flex flex-col p-0">
          {selectedClaim && (
            <>
              <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SheetTitle className="text-lg font-semibold">Claim {selectedClaim.id}</SheetTitle>
                    <Badge className={statusColumns.find((col) => col.id === selectedClaim.status)?.color}>
                      {statusColumns.find((col) => col.id === selectedClaim.status)?.title}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClaim(null)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Assigned to {selectedClaim.assignee} • Last updated {selectedClaim.incidentDate}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center text-foreground">
                      <FileText className="h-4 w-4 mr-2" />
                      Summary / Meta
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Incident Date</div>
                          <div className="text-sm">{selectedClaim.incidentDate}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Vehicle</div>
                          <div className="text-sm">
                            {selectedClaim.vehicle.plate} • {selectedClaim.vehicle.model}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Assignee</div>
                          <div className="text-sm">{selectedClaim.assignee}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Location</div>
                          <div className="text-sm">Parking lot</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Renter</div>
                          <div className="text-sm">{selectedClaim.renter}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Source</div>
                          <div className="text-sm">Customer Report</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm mb-3 text-foreground">Incident Details</h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedClaim.description}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm mb-3 text-foreground">Photos & Evidence</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedClaim.photos.map((photo, index) => (
                        <div key={index} className="space-y-2">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                            <span className="text-xs text-muted-foreground">{photo}</span>
                          </div>
                          <div className="text-xs text-muted-foreground text-left">Evidence photo {index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center text-foreground">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Cost Breakdown
                    </h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Estimated cost</span>
                          <span className="font-medium">${selectedClaim.costBreakdown.parts.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Approved amount</span>
                          <span className="font-medium">${selectedClaim.costBreakdown.labor.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Deductible</span>
                          <span className="font-medium">$250</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Fees</span>
                          <span className="font-medium">${selectedClaim.costBreakdown.other.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-medium">$0</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-medium">
                          <span>Total</span>
                          <span>${selectedClaim.estimatedCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center text-foreground">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Notes / Internal
                    </h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedClaim.notes}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center text-foreground">
                      <History className="h-4 w-4 mr-2" />
                      Status History / Timeline
                    </h4>
                    <div className="space-y-4">
                      {selectedClaim.history.map((entry, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{entry.action}</p>
                              <div className="text-xs text-muted-foreground text-right">
                                <div>{entry.user}</div>
                                <div>{entry.date}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-background border-t px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Request Docs
                  </Button>
                  <Button size="sm">Move Status</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
