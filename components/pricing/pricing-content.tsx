"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

// Mock data for pricing rules
const mockRules = [
  {
    id: "1",
    name: "Weekend Premium",
    type: "percent",
    value: 25,
    scope: "fleet",
    scopeTarget: "All Vehicles",
    dateStart: "2024-01-01",
    dateEnd: "2024-12-31",
    status: "active",
    description: "25% surcharge for weekend bookings",
  },
  {
    id: "2",
    name: "Long Term Discount",
    type: "percent",
    value: -15,
    scope: "fleet",
    scopeTarget: "All Vehicles",
    dateStart: "2024-01-01",
    dateEnd: "2024-12-31",
    status: "active",
    description: "15% discount for bookings over 7 days",
  },
  {
    id: "3",
    name: "SUV Premium",
    type: "flat",
    value: 20,
    scope: "class",
    scopeTarget: "SUV",
    dateStart: "2024-01-01",
    dateEnd: "2024-12-31",
    status: "active",
    description: "€20 daily premium for SUV vehicles",
  },
  {
    id: "4",
    name: "BMW X3 Special",
    type: "percent",
    value: -10,
    scope: "vehicle",
    scopeTarget: "BMW X3 Black",
    dateStart: "2024-03-01",
    dateEnd: "2024-03-31",
    status: "scheduled",
    description: "10% discount for specific BMW X3",
  },
]

// Sample vehicles for preview
const sampleVehicles = [
  { id: "1", name: "Toyota Corolla Silver", class: "Compact", baseRate: 45 },
  { id: "2", name: "BMW X3 Black", class: "SUV", baseRate: 85 },
  { id: "3", name: "Volkswagen Golf Blue", class: "Compact", baseRate: 50 },
]

export function PricingContent() {
  const [rules, setRules] = useState(mockRules)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "percent",
    value: "",
    scope: "fleet",
    scopeTarget: "",
    dateStart: "",
    dateEnd: "",
    description: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Preview state
  const [previewVehicle, setPreviewVehicle] = useState(sampleVehicles[0])

  // Filter and sort rules
  const filteredRules = rules
    .filter(
      (rule) =>
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.scopeTarget.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const aVal = a[sortField as keyof typeof a]
      const bVal = b[sortField as keyof typeof b]
      const direction = sortDirection === "asc" ? 1 : -1
      return aVal < bVal ? -direction : aVal > bVal ? direction : 0
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.value || isNaN(Number(formData.value))) errors.value = "Valid number required"
    if (formData.scope !== "fleet" && !formData.scopeTarget) {
      errors.scopeTarget = "Target selection required for this scope"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const calculatePreview = () => {
    const basePrice = previewVehicle.baseRate * 3 // 3-day booking
    let adjustedPrice = basePrice

    // Apply the new rule being created
    if (formData.value && !isNaN(Number(formData.value))) {
      const ruleValue = Number(formData.value)
      const ruleApplies =
        formData.scope === "fleet" ||
        (formData.scope === "class" && previewVehicle.class === formData.scopeTarget) ||
        (formData.scope === "vehicle" && previewVehicle.name === formData.scopeTarget)

      if (ruleApplies) {
        if (formData.type === "percent") {
          adjustedPrice = basePrice * (1 + ruleValue / 100)
        } else {
          adjustedPrice = basePrice + ruleValue * 3 // 3 days
        }
      }
    }

    return { basePrice, adjustedPrice }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const newRule = {
      id: Date.now().toString(),
      ...formData,
      value: Number(formData.value),
      status: "active" as const,
    }

    setRules([...rules, newRule])
    setFormData({
      name: "",
      type: "percent",
      value: "",
      scope: "fleet",
      scopeTarget: "",
      dateStart: "",
      dateEnd: "",
      description: "",
    })
    setFormErrors({})
    setIsCreateModalOpen(false)
    toast.success("Pricing rule created successfully!")
  }

  const { basePrice, adjustedPrice } = calculatePreview()

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing & Discounts</h1>
          <p className="text-muted-foreground">Manage pricing rules and discounts for your fleet</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Pricing Rule</DialogTitle>
              <DialogDescription>Add a new pricing rule to adjust rates for your fleet</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekend Premium"
                  />
                  {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat Rate (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === "percent" ? "25" : "20"}
                  />
                  {formErrors.value && <p className="text-sm text-destructive">{formErrors.value}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scope">Scope</Label>
                  <Select
                    value={formData.scope}
                    onValueChange={(value) => setFormData({ ...formData, scope: value, scopeTarget: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fleet">Entire Fleet</SelectItem>
                      <SelectItem value="class">Vehicle Class</SelectItem>
                      <SelectItem value="vehicle">Specific Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.scope !== "fleet" && (
                <div className="space-y-2">
                  <Label htmlFor="scopeTarget">Target</Label>
                  <Select
                    value={formData.scopeTarget}
                    onValueChange={(value) => setFormData({ ...formData, scopeTarget: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.scope === "class" ? (
                        <>
                          <SelectItem value="Compact">Compact</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Luxury">Luxury</SelectItem>
                        </>
                      ) : (
                        sampleVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.name}>
                            {vehicle.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {formErrors.scopeTarget && <p className="text-sm text-destructive">{formErrors.scopeTarget}</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateStart">Start Date (Optional)</Label>
                  <Input
                    id="dateStart"
                    type="date"
                    value={formData.dateStart}
                    onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEnd">End Date (Optional)</Label>
                  <Input
                    id="dateEnd"
                    type="date"
                    value={formData.dateEnd}
                    onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this rule"
                />
              </div>

              <Separator />

              {/* Live Preview */}
              <div className="space-y-4">
                <h4 className="font-medium">Live Preview</h4>
                <div className="space-y-2">
                  <Label>Sample Vehicle</Label>
                  <Select
                    value={previewVehicle.id}
                    onValueChange={(id) =>
                      setPreviewVehicle(sampleVehicles.find((v) => v.id === id) || sampleVehicles[0])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - €{vehicle.baseRate}/day
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">3-Day Booking Price</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>€{basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>With Rule:</span>
                      <span
                        className={
                          adjustedPrice !== basePrice
                            ? adjustedPrice > basePrice
                              ? "text-red-600"
                              : "text-green-600"
                            : ""
                        }
                      >
                        €{adjustedPrice.toFixed(2)}
                      </span>
                    </div>
                    {adjustedPrice !== basePrice && (
                      <div className="text-sm text-muted-foreground">
                        {adjustedPrice > basePrice ? "+" : ""}€{(adjustedPrice - basePrice).toFixed(2)} difference
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Rules Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("scope")}>
                <div className="flex items-center space-x-1">
                  <span>Scope</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    {rule.description && <div className="text-sm text-muted-foreground">{rule.description}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span>{rule.type === "percent" ? "%" : "€"}</span>
                    <span className={rule.value < 0 ? "text-green-600" : rule.value > 0 ? "text-red-600" : ""}>
                      {rule.value > 0 && rule.type === "percent" ? "+" : ""}
                      {rule.value}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="capitalize">{rule.scope}</div>
                    <div className="text-sm text-muted-foreground">{rule.scopeTarget}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {rule.dateStart && rule.dateEnd ? (
                    <div className="text-sm">
                      <div>{new Date(rule.dateStart).toLocaleDateString()}</div>
                      <div>to {new Date(rule.dateEnd).toLocaleDateString()}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No limit</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={rule.status === "active" ? "default" : "secondary"}>{rule.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
