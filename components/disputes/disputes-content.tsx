"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, Clock, AlertTriangle, CheckCircle, FileText, Camera, MessageCircle } from "lucide-react"

// Mock data for disputes
const mockDisputes = [
  {
    id: "DSP-001",
    rentalId: "RNT-2024-001",
    parties: "John Smith vs Sarah Johnson",
    reason: "Vehicle damage claim",
    status: "Open" as const,
    slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    description: "Dispute regarding scratches on vehicle bumper after rental period",
    evidence: {
      documents: ["Insurance Report", "Rental Agreement"],
      photos: ["damage_front.jpg", "damage_side.jpg"],
    },
    messages: [
      {
        sender: "John Smith",
        message: "I did not cause this damage",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        sender: "Support Team",
        message: "We are reviewing the evidence",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "DSP-002",
    rentalId: "RNT-2024-015",
    parties: "Mike Wilson vs David Chen",
    reason: "Late return fee dispute",
    status: "Investigating" as const,
    slaDeadline: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    description: "Customer disputes late return charges due to traffic delays",
    evidence: {
      documents: ["Traffic Report", "GPS Log"],
      photos: ["traffic_jam.jpg"],
    },
    messages: [
      {
        sender: "Mike Wilson",
        message: "Traffic was beyond my control",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        sender: "David Chen",
        message: "Policy clearly states return time",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        sender: "Support Team",
        message: "Reviewing GPS data and traffic reports",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
  },
  {
    id: "DSP-003",
    rentalId: "RNT-2024-008",
    parties: "Emma Davis vs Lisa Brown",
    reason: "Fuel charge dispute",
    status: "Resolved" as const,
    slaDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago (resolved)
    lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    description: "Dispute over fuel level at return vs pickup",
    evidence: {
      documents: ["Fuel Receipt", "Vehicle Inspection"],
      photos: ["fuel_gauge_pickup.jpg", "fuel_gauge_return.jpg"],
    },
    messages: [
      {
        sender: "Emma Davis",
        message: "Fuel gauge was already low at pickup",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "Support Team",
        message: "Refund processed for fuel charges",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
    resolution: "Refund issued to customer after reviewing pickup photos",
  },
  {
    id: "DSP-004",
    rentalId: "RNT-2024-022",
    parties: "Alex Johnson vs Tom Wilson",
    reason: "Cleaning fee dispute",
    status: "Open" as const,
    slaDeadline: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now (urgent)
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000),
    description: "Customer disputes excessive cleaning charges",
    evidence: {
      documents: ["Cleaning Invoice"],
      photos: ["interior_before.jpg", "interior_after.jpg"],
    },
    messages: [
      {
        sender: "Alex Johnson",
        message: "Vehicle was clean when returned",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        sender: "Tom Wilson",
        message: "Photos show significant mess",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "DSP-005",
    rentalId: "RNT-2024-031",
    parties: "Rachel Green vs Mark Taylor",
    reason: "Mileage overage dispute",
    status: "Investigating" as const,
    slaDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    description: "Dispute over recorded mileage vs actual usage",
    evidence: {
      documents: ["Odometer Reading", "Route History"],
      photos: ["odometer_start.jpg", "odometer_end.jpg"],
    },
    messages: [
      {
        sender: "Rachel Green",
        message: "Odometer readings don't match my usage",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        sender: "Support Team",
        message: "Investigating GPS tracking data",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
]

type DisputeStatus = "Open" | "Investigating" | "Resolved"

function getSLAStatus(deadline: Date, status: DisputeStatus) {
  if (status === "Resolved") return "resolved"

  const now = new Date()
  const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursLeft < 0) return "overdue"
  if (hoursLeft < 2) return "urgent"
  if (hoursLeft < 24) return "warning"
  return "normal"
}

function getSLABadge(deadline: Date, status: DisputeStatus) {
  const slaStatus = getSLAStatus(deadline, status)
  const now = new Date()
  const hoursLeft = Math.max(0, (deadline.getTime() - now.getTime()) / (1000 * 60 * 60))

  if (status === "Resolved") {
    return (
      <Badge variant="outline" className="text-green-600 border-green-600">
        Resolved
      </Badge>
    )
  }

  if (slaStatus === "overdue") {
    return (
      <Badge variant="destructive" className="bg-red-600">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Overdue
      </Badge>
    )
  }

  if (slaStatus === "urgent") {
    return (
      <Badge variant="destructive" className="bg-orange-600">
        <Clock className="w-3 h-3 mr-1" />
        {Math.round(hoursLeft)}h left
      </Badge>
    )
  }

  if (slaStatus === "warning") {
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        <Clock className="w-3 h-3 mr-1" />
        {Math.round(hoursLeft)}h left
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-green-600 border-green-600">
      <Clock className="w-3 h-3 mr-1" />
      {Math.round(hoursLeft)}h left
    </Badge>
  )
}

function getStatusBadge(status: DisputeStatus) {
  switch (status) {
    case "Open":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          Open
        </Badge>
      )
    case "Investigating":
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          Investigating
        </Badge>
      )
    case "Resolved":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolved
        </Badge>
      )
  }
}

export function DisputesContent() {
  const [selectedDispute, setSelectedDispute] = useState<(typeof mockDisputes)[0] | null>(null)
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | "All">("All")
  const [slaFilter, setSlaFilter] = useState<"All" | "Urgent" | "Due Soon">("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesStatus = statusFilter === "All" || dispute.status === statusFilter
    const matchesSLA =
      slaFilter === "All" ||
      (slaFilter === "Urgent" && getSLAStatus(dispute.slaDeadline, dispute.status) === "urgent") ||
      (slaFilter === "Due Soon" && ["urgent", "warning"].includes(getSLAStatus(dispute.slaDeadline, dispute.status)))
    const matchesSearch =
      searchQuery === "" ||
      dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.rentalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.parties.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSLA && matchesSearch
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Disputes</h1>
          <p className="text-sm text-muted-foreground">Manage and resolve customer disputes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-6 border-b bg-muted/30">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search disputes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Status:</span>
          {(["All", "Open", "Investigating", "Resolved"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">SLA:</span>
          {(["All", "Urgent", "Due Soon"] as const).map((sla) => (
            <Button
              key={sla}
              variant={slaFilter === sla ? "default" : "outline"}
              size="sm"
              onClick={() => setSlaFilter(sla)}
            >
              {sla}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispute ID</TableHead>
              <TableHead>Rental ID</TableHead>
              <TableHead>Parties</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDisputes.map((dispute) => (
              <TableRow
                key={dispute.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedDispute(dispute)}
              >
                <TableCell className="font-medium">{dispute.id}</TableCell>
                <TableCell>{dispute.rentalId}</TableCell>
                <TableCell>{dispute.parties}</TableCell>
                <TableCell>{dispute.reason}</TableCell>
                <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                <TableCell>{getSLABadge(dispute.slaDeadline, dispute.status)}</TableCell>
                <TableCell>{dispute.lastUpdate.toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
        <SheetContent className="w-[600px] sm:w-[600px]">
          {selectedDispute && (
            <>
              <SheetHeader>
                <SheetTitle>Dispute Details - {selectedDispute.id}</SheetTitle>
                <SheetDescription>
                  Rental: {selectedDispute.rentalId} • {selectedDispute.parties}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                <div className="space-y-6">
                  {/* Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="mt-1">{getStatusBadge(selectedDispute.status)}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">SLA Status</label>
                          <div className="mt-1">{getSLABadge(selectedDispute.slaDeadline, selectedDispute.status)}</div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reason</label>
                        <p className="mt-1 text-sm">{selectedDispute.reason}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="mt-1 text-sm">{selectedDispute.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Evidence Checklist */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Evidence Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Documents ({selectedDispute.evidence.documents.length})
                        </label>
                        <div className="mt-2 space-y-1">
                          {selectedDispute.evidence.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Photos ({selectedDispute.evidence.photos.length})
                        </label>
                        <div className="mt-2 space-y-1">
                          {selectedDispute.evidence.photos.map((photo, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {photo}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message Feed */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Message Feed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedDispute.messages.map((message, index) => (
                          <div key={index} className="border-l-2 border-muted pl-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{message.sender}</span>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resolution Outcome */}
                  {selectedDispute.status === "Resolved" && selectedDispute.resolution && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          Resolution Outcome
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedDispute.resolution}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
