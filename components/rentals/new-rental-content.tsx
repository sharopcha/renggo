"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { mockCustomers, mockVehicles } from "@/lib/mock-data"
import { ArrowLeft, ArrowRight, User, Car, Euro, Shield, CreditCard, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, title: "Customer", icon: User },
  { id: 2, title: "Vehicle & Dates", icon: Car },
  { id: 3, title: "Pricing & Extras", icon: Euro },
  { id: 4, title: "Deposit & Policies", icon: Shield },
  { id: 5, title: "Payment", icon: CreditCard },
]

export function NewRentalContent() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing")

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Customer
    customerId: "",
    newCustomer: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      country: "",
      licenseNumber: "",
      licenseCountry: "",
      licenseExpiry: "",
    },
    additionalDrivers: [] as Array<{ name: string; licenseNumber: string; licenseCountry: string }>,

    // Step 2: Vehicle & Dates
    vehicleId: "",
    startDate: "",
    startTime: "10:00",
    endDate: "",
    endTime: "10:00",
    pickupLocation: "",
    returnLocation: "",

    // Step 3: Pricing & Extras
    coverageTier: "basic",
    extras: [] as string[],

    // Step 4: Deposit & Policies
    depositMethod: "hold",
    depositAmount: 500,
    agreesToTerms: false,
    agreesToPrivacy: false,

    // Step 5: Payment
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingName: "",
  })

  // Calculate pricing
  const selectedVehicle = mockVehicles.find((v) => v.id === formData.vehicleId)
  const selectedCustomer = mockCustomers.find((c) => c.id === formData.customerId)

  const calculatePricing = () => {
    if (!selectedVehicle || !formData.startDate || !formData.endDate) {
      return { baseRate: 0, extras: 0, insurance: 0, total: 0, days: 0 }
    }

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const baseRate = selectedVehicle.baseDailyRateEur * days
    const extrasTotal = formData.extras.length * 15 * days // €15 per extra per day
    const insuranceMultiplier =
      formData.coverageTier === "premium" ? 1.3 : formData.coverageTier === "standard" ? 1.15 : 1
    const insurance = baseRate * (insuranceMultiplier - 1)
    const total = baseRate + extrasTotal + insurance

    return { baseRate, extras: extrasTotal, insurance, total, days }
  }

  const pricing = calculatePricing()

  // Warn on navigate away if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    setIsDirty(true)
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        if (customerMode === "existing") {
          return formData.customerId
        } else {
          return (
            formData.newCustomer.name &&
            formData.newCustomer.email &&
            formData.newCustomer.phone &&
            formData.newCustomer.dateOfBirth &&
            formData.newCustomer.licenseNumber &&
            formData.newCustomer.licenseExpiry
          )
        }
      case 2:
        return formData.vehicleId && formData.startDate && formData.endDate && formData.pickupLocation
      case 3:
        return formData.coverageTier
      case 4:
        return formData.agreesToTerms && formData.agreesToPrivacy
      case 5:
        return formData.paymentMethod && formData.billingName
      default:
        return false
    }
  }

  const goToStep = (stepId: number) => {
    if (stepId <= currentStep || canProceedToNext()) {
      setCurrentStep(stepId)
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreateRental = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create new rental ID
    const newRentalId = `rent_${Date.now()}`

    // Navigate to rental details and show success toast
    router.push(`/rentals/${newRentalId}`)
    toast({
      title: "Rental created",
      description: "The rental has been successfully created.",
    })

    setIsLoading(false)
    setIsDirty(false)
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Desktop: Left Rail Stepper */}
      <div className="hidden lg:block w-80 border-r bg-muted/20">
        <div className="sticky top-0 p-6">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link href="/rentals" className="hover:text-foreground">
              Rentals
            </Link>
            <span className="mx-2">/</span>
            <span>New</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight mb-8">New Rental</h1>

          {/* Vertical Stepper */}
          <div className="space-y-1">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const canNavigate = step.id <= currentStep || canProceedToNext()

              return (
                <div key={step.id} className="relative">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={!canNavigate}
                    className={`w-full flex items-center p-3 rounded-xl transition-all text-left ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : isCompleted
                          ? "text-foreground hover:bg-muted/50"
                          : canNavigate
                            ? "text-muted-foreground hover:bg-muted/50"
                            : "text-muted-foreground/50 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-medium ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                    </div>
                    <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>{step.title}</span>
                  </button>
                  {/* Connecting line */}
                  {index < steps.length - 1 && <div className="absolute left-6 top-14 w-0.5 h-4 bg-border" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Compact Header with Stepper */}
      <div className="lg:hidden sticky top-0 z-10 bg-background border-b">
        <div className="p-4">
          <nav className="text-sm text-muted-foreground mb-2">
            <Link href="/rentals" className="hover:text-foreground">
              Rentals
            </Link>
            <span className="mx-2">/</span>
            <span>New</span>
          </nav>
          <h1 className="text-xl font-bold tracking-tight mb-4">New Rental</h1>

          {/* Mobile Stepper */}
          <div className="space-y-2">
            {steps.map((step) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isActive ? "border-primary bg-primary/5" : "border-border"
                  } ${!isActive && !isCompleted ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-medium ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="h-3 w-3" /> : step.id}
                    </div>
                    <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>{step.title}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-10 bg-background border-b">
          <div className="p-6">
            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" asChild>
                <Link href="/rentals">Cancel</Link>
              </Button>
              <Button
                onClick={handleCreateRental}
                disabled={currentStep !== 5 || !canProceedToNext() || isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? "Creating..." : "Create Rental"}
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            {/* Step 1: Customer */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-6">
                      <button
                        onClick={() => setCustomerMode("existing")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          customerMode === "existing"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Existing Customer
                      </button>
                      <button
                        onClick={() => setCustomerMode("new")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          customerMode === "new"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        New Customer
                      </button>
                    </div>

                    {customerMode === "existing" ? (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="customer-select" className="text-base font-medium">
                            Select Customer
                          </Label>
                          <p className="text-sm text-muted-foreground mb-3">Search by name, email, or phone number</p>
                          <Select
                            value={formData.customerId}
                            onValueChange={(value) => updateFormData({ customerId: value })}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Choose a customer..." />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCustomers.map((customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{customer.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {customer.email} • {customer.phone}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.customerId && selectedCustomer && (
                          <Card className="bg-muted/30 border-dashed">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{selectedCustomer.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedCustomer.email} • {selectedCustomer.phone}
                                  </p>
                                  <div className="flex items-center mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      License: Valid
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-medium mb-4">Customer Information</h3>
                          <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                className="h-11 mt-2"
                                value={formData.newCustomer.name}
                                onChange={(e) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, name: e.target.value },
                                  })
                                }
                                placeholder="Enter full name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address *</Label>
                              <Input
                                id="email"
                                type="email"
                                className="h-11 mt-2"
                                value={formData.newCustomer.email}
                                onChange={(e) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, email: e.target.value },
                                  })
                                }
                                placeholder="Enter email address"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number *</Label>
                              <Input
                                id="phone"
                                className="h-11 mt-2"
                                value={formData.newCustomer.phone}
                                onChange={(e) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, phone: e.target.value },
                                  })
                                }
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dob">Date of Birth *</Label>
                              <Input
                                id="dob"
                                type="date"
                                className="h-11 mt-2"
                                value={formData.newCustomer.dateOfBirth}
                                onChange={(e) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, dateOfBirth: e.target.value },
                                  })
                                }
                              />
                            </div>
                            <div className="lg:col-span-2">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                className="h-11 mt-2"
                                value={formData.newCustomer.address}
                                onChange={(e) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, address: e.target.value },
                                  })
                                }
                                placeholder="Enter full address"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-medium mb-4">Driver's License</h3>
                          <div className="grid gap-4 lg:grid-cols-3">
                            <div>
                              <Label htmlFor="license">License Number *</Label>
                              <Input
                                id="license"
                                className="h-11 mt-2"
                                value={formData.newCustomer.licenseNumber}
                                onChange={(e) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, licenseNumber: e.target.value },
                                  })
                                }
                                placeholder="Enter license number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="licenseCountry">Issuing Country *</Label>
                              <Select
                                value={formData.newCustomer.licenseCountry}
                                onValueChange={(value) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, licenseCountry: value },
                                  })
                                }
                              >
                                <SelectTrigger className="h-11 mt-2">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Estonia">Estonia</SelectItem>
                                  <SelectItem value="Latvia">Latvia</SelectItem>
                                  <SelectItem value="Lithuania">Lithuania</SelectItem>
                                  <SelectItem value="Finland">Finland</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="licenseExpiry">Expiry Date *</Label>
                              <Input
                                id="licenseExpiry"
                                type="date"
                                className="h-11 mt-2"
                                value={formData.newCustomer.licenseExpiry}
                                onChange={(e) =>
                                  updateFormData({
                                    newCustomer: { ...formData.newCustomer, licenseExpiry: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Drivers</CardTitle>
                    <p className="text-sm text-muted-foreground">Add other people authorized to drive this vehicle</p>
                  </CardHeader>
                  <CardContent>
                    {formData.additionalDrivers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="mb-4">No additional drivers added</p>
                        <Button
                          variant="outline"
                          onClick={() =>
                            updateFormData({
                              additionalDrivers: [
                                ...formData.additionalDrivers,
                                { name: "", licenseNumber: "", licenseCountry: "" },
                              ],
                            })
                          }
                        >
                          Add Driver
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.additionalDrivers.map((driver, index) => (
                          <Card key={index} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="grid gap-3 lg:grid-cols-3">
                                <div>
                                  <Label>Full Name</Label>
                                  <Input
                                    className="h-10 mt-1"
                                    value={driver.name}
                                    onChange={(e) => {
                                      const updated = [...formData.additionalDrivers]
                                      updated[index].name = e.target.value
                                      updateFormData({ additionalDrivers: updated })
                                    }}
                                    placeholder="Enter name"
                                  />
                                </div>
                                <div>
                                  <Label>License Number</Label>
                                  <Input
                                    className="h-10 mt-1"
                                    value={driver.licenseNumber}
                                    onChange={(e) => {
                                      const updated = [...formData.additionalDrivers]
                                      updated[index].licenseNumber = e.target.value
                                      updateFormData({ additionalDrivers: updated })
                                    }}
                                    placeholder="Enter license number"
                                  />
                                </div>
                                <div>
                                  <Label>Country</Label>
                                  <div className="flex gap-2 mt-1">
                                    <Select
                                      value={driver.licenseCountry}
                                      onValueChange={(value) => {
                                        const updated = [...formData.additionalDrivers]
                                        updated[index].licenseCountry = value
                                        updateFormData({ additionalDrivers: updated })
                                      }}
                                    >
                                      <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Country" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Estonia">Estonia</SelectItem>
                                        <SelectItem value="Latvia">Latvia</SelectItem>
                                        <SelectItem value="Lithuania">Lithuania</SelectItem>
                                        <SelectItem value="Finland">Finland</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-10 px-3 bg-transparent"
                                      onClick={() => {
                                        const updated = formData.additionalDrivers.filter((_, i) => i !== index)
                                        updateFormData({ additionalDrivers: updated })
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() =>
                            updateFormData({
                              additionalDrivers: [
                                ...formData.additionalDrivers,
                                { name: "", licenseNumber: "", licenseCountry: "" },
                              ],
                            })
                          }
                        >
                          Add Another Driver
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Vehicle & Dates */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Select Vehicle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {mockVehicles
                        .filter((v) => v.status === "Available")
                        .map((vehicle) => (
                          <div
                            key={vehicle.id}
                            className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                              formData.vehicleId === vehicle.id
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "hover:border-muted-foreground"
                            }`}
                            onClick={() => updateFormData({ vehicleId: vehicle.id })}
                          >
                            <div className="aspect-video bg-muted rounded-lg mb-4" />
                            <h4 className="font-semibold text-base">
                              {vehicle.make} {vehicle.model}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {vehicle.plate} • {vehicle.year}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {vehicle.class}
                              </Badge>
                              <span className="font-semibold text-primary">€{vehicle.baseDailyRateEur}/day</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Rental Dates & Locations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label htmlFor="startDate">Pickup Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          className="h-11 mt-2"
                          value={formData.startDate}
                          onChange={(e) => updateFormData({ startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Pickup Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          className="h-11 mt-2"
                          value={formData.startTime}
                          onChange={(e) => updateFormData({ startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Return Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          className="h-11 mt-2"
                          value={formData.endDate}
                          onChange={(e) => updateFormData({ endDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">Return Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          className="h-11 mt-2"
                          value={formData.endTime}
                          onChange={(e) => updateFormData({ endTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label htmlFor="pickup">Pickup Location</Label>
                        <Select
                          value={formData.pickupLocation}
                          onValueChange={(value) => updateFormData({ pickupLocation: value })}
                        >
                          <SelectTrigger className="h-11 mt-2">
                            <SelectValue placeholder="Select pickup location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tallinn Airport">Tallinn Airport</SelectItem>
                            <SelectItem value="Tallinn City Center">Tallinn City Center</SelectItem>
                            <SelectItem value="Tartu Office">Tartu Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="return">Return Location</Label>
                        <Select
                          value={formData.returnLocation}
                          onValueChange={(value) => updateFormData({ returnLocation: value })}
                        >
                          <SelectTrigger className="h-11 mt-2">
                            <SelectValue placeholder="Select return location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tallinn Airport">Tallinn Airport</SelectItem>
                            <SelectItem value="Tallinn City Center">Tallinn City Center</SelectItem>
                            <SelectItem value="Tartu Office">Tartu Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ... existing code for steps 3-5 with updated styling ... */}
            {/* Step 3: Pricing & Extras */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Coverage Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 lg:grid-cols-3">
                      {[
                        {
                          id: "basic",
                          name: "Basic",
                          price: "Included",
                          features: ["Third-party liability", "€1000 excess"],
                        },
                        {
                          id: "standard",
                          name: "Standard",
                          price: "+15%",
                          features: ["Collision damage", "€500 excess", "Theft protection"],
                        },
                        {
                          id: "premium",
                          name: "Premium",
                          price: "+30%",
                          features: ["Full coverage", "€0 excess", "Personal accident"],
                        },
                      ].map((tier) => (
                        <div
                          key={tier.id}
                          className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            formData.coverageTier === tier.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "hover:border-muted-foreground"
                          }`}
                          onClick={() => updateFormData({ coverageTier: tier.id })}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{tier.name}</h4>
                            <span className="text-sm font-semibold text-primary">{tier.price}</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tier.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Extras</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 lg:grid-cols-2">
                      {[
                        { id: "gps", name: "GPS Navigation", price: 15 },
                        { id: "child-seat", name: "Child Seat", price: 15 },
                        { id: "additional-driver", name: "Additional Driver", price: 20 },
                        { id: "wifi", name: "Mobile WiFi", price: 10 },
                      ].map((extra) => (
                        <div key={extra.id} className="flex items-center space-x-3 p-3 rounded-lg border">
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
                          />
                          <Label htmlFor={extra.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{extra.name}</span>
                              <span className="text-sm text-muted-foreground font-medium">€{extra.price}/day</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Price Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Base rate ({pricing.days} days)</span>
                        <span className="font-medium">€{pricing.baseRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extras</span>
                        <span className="font-medium">€{pricing.extras.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance</span>
                        <span className="font-medium">€{pricing.insurance.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">€{pricing.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Deposit & Policies */}
            {currentStep === 4 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Deposit & Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Deposit Method</Label>
                    <Select
                      value={formData.depositMethod}
                      onValueChange={(value) => updateFormData({ depositMethod: value })}
                    >
                      <SelectTrigger className="h-11 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hold">Hold on Card (€{formData.depositAmount})</SelectItem>
                        <SelectItem value="charge">Charge Now (€{formData.depositAmount})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 rounded-lg border">
                      <Checkbox
                        id="terms"
                        checked={formData.agreesToTerms}
                        onCheckedChange={(checked) => updateFormData({ agreesToTerms: !!checked })}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline font-medium">
                          Terms and Conditions
                        </a>{" "}
                        and understand the rental policies, damage liability, and cancellation terms.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-lg border">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreesToPrivacy}
                        onCheckedChange={(checked) => updateFormData({ agreesToPrivacy: !!checked })}
                      />
                      <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                        I consent to the processing of my personal data as described in the
                        <a href="#" className="text-primary hover:underline font-medium">
                          {" "}
                          Privacy Policy
                        </a>
                        .
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => updateFormData({ paymentMethod: value })}
                      >
                        <SelectTrigger className="h-11 mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.paymentMethod === "card" && (
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            className="h-11 mt-2"
                            value={formData.cardNumber}
                            onChange={(e) => updateFormData({ cardNumber: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            className="h-11 mt-2"
                            value={formData.expiryDate}
                            onChange={(e) => updateFormData({ expiryDate: e.target.value })}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            className="h-11 mt-2"
                            value={formData.cvv}
                            onChange={(e) => updateFormData({ cvv: e.target.value })}
                            placeholder="123"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <Label htmlFor="billingName">Cardholder Name</Label>
                          <Input
                            id="billingName"
                            className="h-11 mt-2"
                            value={formData.billingName}
                            onChange={(e) => updateFormData({ billingName: e.target.value })}
                            placeholder="Enter cardholder name"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Rental Total</span>
                        <span className="font-medium">€{pricing.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deposit ({formData.depositMethod === "hold" ? "Hold" : "Charge"})</span>
                        <span className="font-medium">€{formData.depositAmount.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total to Pay</span>
                        <span className="text-primary">
                          €
                          {(pricing.total + (formData.depositMethod === "charge" ? formData.depositAmount : 0)).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t p-4 lg:p-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="min-w-[100px] bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="text-sm text-muted-foreground font-medium">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < 5 ? (
              <Button onClick={handleNext} disabled={!canProceedToNext()} className="min-w-[100px]">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateRental}
                disabled={!canProceedToNext() || isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? "Creating..." : "Create Rental"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
