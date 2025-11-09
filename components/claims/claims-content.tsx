"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { listClaimsWithRefs, updateClaimStatus } from "@/lib/supabase/insurance"
import { useSupabase } from "@/lib/supabase/context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar, Car, User, DollarSign, FileText, MessageSquare, History, X } from "lucide-react"

interface UiClaim {
  dbId: string
  id: string
  vehicle: { plate: string; model: string }
  renter: string
  incidentDate: string
  estimatedCost: number
  assignee: string
  status: string
  description: string
  photos: string[]
  costBreakdown: { parts: number; labor: number; other: number }
  notes: string
  history: { date: string; action: string; user: string }[]
}

// Removed mockClaims; data is now loaded from the database

const statusColumns = [
  { id: "new", title: "New", color: "bg-blue-100 text-blue-800" },
  { id: "assessing", title: "Assessing", color: "bg-yellow-100 text-yellow-800" },
  { id: "awaiting-docs", title: "Awaiting Docs", color: "bg-orange-100 text-orange-800" },
  { id: "approved", title: "Approved", color: "bg-green-100 text-green-800" },
  { id: "rejected", title: "Rejected", color: "bg-red-100 text-red-800" },
]

export function ClaimsContent() {
  const { organization } = useSupabase()
  const [claims, setClaims] = useState<UiClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClaim, setSelectedClaim] = useState<UiClaim | null>(null)
  const [filters, setFilters] = useState({
    status: "all",
    vehicle: "",
    renter: "",
    dateRange: "",
  })

  // Transform initialClaims from DB shape to UI shape
  useEffect(() => {
    const run = async () => {
      if (!organization?.id) {
        setClaims([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const orgId = organization?.id
        const rows = orgId ? await listClaimsWithRefs(orgId, { limit: 200 }) : []
        console.debug('ClaimsContent: fetched rows', rows?.length ?? 0, 'orgId=', orgId)
        const dbToUiStatus = (s: string) => {
          const v = (s || '').toLowerCase()
          if (v.includes('submit')) return 'new'
          if (v.includes('review') || v.includes('assess')) return 'assessing'
          if (v.includes('await')) return 'awaiting-docs'
          if (v.includes('approve') || v.includes('paid') || v.includes('close')) return 'approved'
          if (v.includes('reject')) return 'rejected'
          return 'assessing'
        }
        const transformed: UiClaim[] = (rows || []).map((c: any) => ({
          dbId: c.id,
          id: c.claim_number || c.id,
          vehicle: { plate: c.vehicles?.plate ?? '—', model: c.vehicles?.model ?? c.vehicles?.make ?? 'Vehicle' },
          renter: c.customers ? `${c.customers.first_name ?? ''} ${c.customers.last_name ?? ''}`.trim() : '—',
          incidentDate: c.incident_date ? new Date(c.incident_date).toISOString().split('T')[0] : '—',
          estimatedCost: c.estimated_cost_eur ?? 0,
          assignee: c.assignee ?? 'Unassigned',
          status: dbToUiStatus(c.status || 'Submitted'),
          description: c.description ?? '',
          photos: [],
          costBreakdown: { parts: c.estimated_cost_eur ?? 0, labor: 0, other: 0 },
          notes: '',
          history: [],
        }))
        setClaims(transformed)
        if (transformed.length) setSelectedClaim(transformed[0])
      } catch (e) {
        console.error('ClaimsContent: Failed to load claims', e)
        setClaims([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [organization?.id])

  const handleDragStart = (e: React.DragEvent, claimDbId: string) => {
    e.dataTransfer.setData("text/plain", claimDbId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const claimDbId = e.dataTransfer.getData("text/plain")
    // Optimistic UI update
    setClaims((prevClaims) => prevClaims.map((claim) => (claim.dbId === claimDbId ? { ...claim, status: newStatus } : claim)))
    try {
      if (organization?.id) {
        const uiToDbStatus = (s: string) => {
          switch (s) {
            case 'new':
              return 'Submitted'
            case 'assessing':
              return 'Under Review'
            case 'awaiting-docs':
              return 'Under Review'
            case 'approved':
              return 'Approved'
            case 'rejected':
              return 'Rejected'
            default:
              return 'Under Review'
          }
        }
        await updateClaimStatus(claimDbId, uiToDbStatus(newStatus))
      }
    } catch (err) {
      console.error('Failed to update claim status', err)
    }
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
                  {loading ? '—' : filteredClaims.filter((claim) => claim.status === column.id).length}
                </Badge>
              </div>

              <div className="space-y-3 flex-1">
                {loading ? (
                  <div className="text-xs text-muted-foreground">Loading claims…</div>
                ) : filteredClaims
                  .filter((claim) => claim.status === column.id)
                  .map((claim) => (
                    <Card
                      key={claim.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, claim.dbId)}
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
                  <Button size="sm" disabled={!selectedClaim}>Move Status</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
