"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { mockCustomers, mockVehicles, mockRentals, type Customer } from "@/lib/mock-data"
import {
  User,
  Car,
  Calendar,
  CreditCard,
  Shield,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Euro,
  FileText,
  Check,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateRentalWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preSelectedVehicleId?: string
  preSelectedCustomerId?: string
}

interface WizardFormData {
  // Step 1 - Customer
  customerId: string
  additionalDrivers: Array<{
    name: string
    email: string
    phone: string
    dateOfBirth: string
    licenseNumber: string
    licenseCountry: string
    licenseExpiry: string
  }>

  // Step 2 - Vehicle & Dates
  vehicleId: string
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  pickupLocation: string
  returnLocation: string

  // Step 3 - Pricing & Extras
  insuranceTier: "Basic" | "Standard" | "Full"
  extras: {
    childSeat: number
    gps: boolean
    extraKm: number
  }
  discountCode: string

  // Step 4 - Deposit & Policies
  securityDeposit: number
  depositAction: "hold" | "charge"
  policiesAccepted: {
    mileage: boolean
    fuel: boolean
    damage: boolean
    lateFee: boolean
  }

  // Step 5 - Payment
  paymentMethod: "card" | "cash" | "bank"
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

const STEPS = [
  { id: 1, title: "Customer", icon: User },
  { id: 2, title: "Vehicle & Dates", icon: Car },
  { id: 3, title: "Pricing & Extras", icon: Euro },
  { id: 4, title: "Deposit & Policies", icon: Shield },
  { id: 5, title: "Payment", icon: CreditCard },
]

const LOCATIONS = [
  "Tallinn Airport",
  "Tallinn City Center",
  "Riga Central Station",
  "Riga Airport",
  "Riga Downtown",
  "Vilnius Airport",
  "Vilnius Central",
]

const INSURANCE_TIERS = [
  { id: "Basic", name: "Basic Coverage", price: 0, description: "Third party liability only" },
  { id: "Standard", name: "Standard Coverage", price: 15, description: "Collision damage waiver included" },
  { id: "Full", name: "Full Coverage", price: 25, description: "Comprehensive coverage with zero deductible" },
]

export function CreateRentalWizard({
  open,
  onOpenChange,
  preSelectedVehicleId,
  preSelectedCustomerId,
}: CreateRentalWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")

  const [formData, setFormData] = useState<WizardFormData>({
    customerId: preSelectedCustomerId || "",
    additionalDrivers: [],
    vehicleId: preSelectedVehicleId || "",
    pickupDate: "",
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
    pickupLocation: "",
    returnLocation: "",
    insuranceTier: "Standard",
    extras: { childSeat: 0, gps: false, extraKm: 0 },
    discountCode: "",
    securityDeposit: 200,
    depositAction: "hold",
    policiesAccepted: { mileage: false, fuel: false, damage: false, lateFee: false },
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    country: "Estonia",
    licenseNumber: "",
    licenseCountry: "Estonia",
    licenseExpiry: "",
  })

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch),
  )

  const selectedCustomer = mockCustomers.find((c) => c.id === formData.customerId)
  const selectedVehicle = mockVehicles.find((v) => v.id === formData.vehicleId)

  const getAvailableVehicles = () => {
    if (!formData.pickupDate || !formData.returnDate) return []

    return mockVehicles.filter((vehicle) => {
      if (vehicle.status !== "Available") return false

      // Check for overlapping rentals
      const hasConflict = mockRentals.some((rental) => {
        if (rental.vehicleId !== vehicle.id) return false
        if (rental.status === "Cancelled" || rental.status === "Completed") return false

        const rentalStart = new Date(rental.start)
        const rentalEnd = new Date(rental.end)
        const pickupDate = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
        const returnDate = new Date(`${formData.returnDate}T${formData.returnTime}`)

        return pickupDate < rentalEnd && returnDate > rentalStart
      })

      return !hasConflict
    })
  }

  const calculatePricing = () => {
    if (!selectedVehicle || !formData.pickupDate || !formData.returnDate) {
      return { basePrice: 0, insurancePrice: 0, extrasPrice: 0, total: 0, days: 0 }
    }

    const pickupDate = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
    const returnDate = new Date(`${formData.returnDate}T${formData.returnTime}`)
    const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))

    const basePrice = selectedVehicle.baseDailyRateEur * days
    const insurancePrice = INSURANCE_TIERS.find((t) => t.id === formData.insuranceTier)?.price || 0
    const extrasPrice = formData.extras.childSeat * 5 + (formData.extras.gps ? 10 : 0) + formData.extras.extraKm * 0.25
    const total = basePrice + insurancePrice * days + extrasPrice

    return { basePrice, insurancePrice: insurancePrice * days, extrasPrice, total, days }
  }

  const handleCreateCustomer = async () => {
    // Validate new customer form
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.licenseNumber) {
      toast.error("Please fill in all required customer fields")
      return
    }

    // Create new customer (mock implementation)
    const customerId = `cus_${Date.now()}`
    const customer: Customer = {
      id: customerId,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      verified: false,
      lifetimeSpendEur: 0,
      trips: 0,
      cancellations: 0,
      status: "Active",
      country: newCustomer.country,
      avatar: "/placeholder.svg?key=new-customer",
    }

    // Add to mock data (in real app, this would be an API call)
    mockCustomers.push(customer)

    setFormData((prev) => ({ ...prev, customerId }))
    setShowNewCustomerForm(false)
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      country: "Estonia",
      licenseNumber: "",
      licenseCountry: "Estonia",
      licenseExpiry: "",
    })

    toast.success("Customer created successfully")
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.customerId
      case 2:
        return !!(
          formData.vehicleId &&
          formData.pickupDate &&
          formData.returnDate &&
          formData.pickupLocation &&
          formData.returnLocation
        )
      case 3:
        return !!formData.insuranceTier
      case 4:
        return Object.values(formData.policiesAccepted).every(Boolean)
      case 5:
        if (formData.paymentMethod === "card") {
          return !!(formData.cardNumber && formData.cardExpiry && formData.cardCvc)
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please complete all required fields")
      return
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error("Please complete all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Create rental (mock implementation)
      const rentalId = `ren_${Date.now()}`
      const pricing = calculatePricing()

      const newRental = {
        id: rentalId,
        vehicleId: formData.vehicleId,
        customerId: formData.customerId,
        start: `${formData.pickupDate}T${formData.pickupTime}:00Z`,
        end: `${formData.returnDate}T${formData.returnTime}:00Z`,
        status: "Upcoming" as const,
        pickupCity: formData.pickupLocation.split(" ")[0],
        returnCity: formData.returnLocation.split(" ")[0],
        priceEur: pricing.total,
        pickupLocation: formData.pickupLocation,
        returnLocation: formData.returnLocation,
      }

      // Add to mock data
      mockRentals.push(newRental)

      // Create payment record
      const paymentId = `pay_${Date.now()}`
      const payment = {
        id: paymentId,
        rentalId,
        type: "Charge" as const,
        amountEur: pricing.total,
        status: "Succeeded" as const,
        method:
          formData.paymentMethod === "card"
            ? `Card •••• ${formData.cardNumber.slice(-4)}`
            : formData.paymentMethod === "cash"
              ? "Cash"
              : "Bank Transfer",
        createdAt: new Date().toISOString(),
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Rental created successfully!")
      onOpenChange(false)

      // Navigate to rental details
      router.push(`/rentals/${rentalId}`)
    } catch (error) {
      toast.error("Failed to create rental. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const pricing = calculatePricing()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle>Create New Rental</DialogTitle>

          {/* Stepper */}
          <div className="flex items-center justify-between mt-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium hidden sm:block ${
                      isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Live Summary */}
          {(selectedCustomer || selectedVehicle || pricing.total > 0) && (
            <div className="flex items-center gap-4 mt-4 p-3 bg-muted/50 rounded-lg text-sm">
              {selectedCustomer && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedCustomer.name}</span>
                </div>
              )}
              {selectedVehicle && (
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>
                    {selectedVehicle.make} {selectedVehicle.model}
                  </span>
                </div>
              )}
              {formData.pickupDate && formData.returnDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{pricing.days} days</span>
                </div>
              )}
              {pricing.total > 0 && (
                <div className="flex items-center gap-2 font-medium">
                  <Euro className="h-4 w-4" />
                  <span>€{pricing.total.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Step 1 - Customer */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Customer</h3>

                {!showNewCustomerForm ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or phone..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="grid gap-3 max-h-60 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.customerId === customer.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, customerId: customer.id }))}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                              <p className="text-sm text-muted-foreground">{customer.phone}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={customer.verified ? "default" : "secondary"}>
                                {customer.verified ? "Verified" : "Unverified"}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">{customer.trips} trips</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" onClick={() => setShowNewCustomerForm(true)} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Customer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Add New Customer</h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowNewCustomerForm(false)}>
                        Cancel
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+372 5555 5555"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newCustomer.dateOfBirth}
                          onChange={(e) => setNewCustomer((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={newCustomer.country}
                          onValueChange={(value) => setNewCustomer((prev) => ({ ...prev, country: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Estonia">Estonia</SelectItem>
                            <SelectItem value="Latvia">Latvia</SelectItem>
                            <SelectItem value="Lithuania">Lithuania</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                        <Input
                          id="licenseNumber"
                          value={newCustomer.licenseNumber}
                          onChange={(e) => setNewCustomer((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                          placeholder="License number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseCountry">License Issuing Country</Label>
                        <Select
                          value={newCustomer.licenseCountry}
                          onValueChange={(value) => setNewCustomer((prev) => ({ ...prev, licenseCountry: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Estonia">Estonia</SelectItem>
                            <SelectItem value="Latvia">Latvia</SelectItem>
                            <SelectItem value="Lithuania">Lithuania</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                        <Input
                          id="licenseExpiry"
                          type="date"
                          value={newCustomer.licenseExpiry}
                          onChange={(e) => setNewCustomer((prev) => ({ ...prev, licenseExpiry: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Button onClick={handleCreateCustomer} className="w-full">
                      Create Customer
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 - Vehicle & Dates */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Vehicle & Dates</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="pickupDate">Pickup Date *</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pickupDate: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickupTime">Pickup Time *</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={formData.pickupTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pickupTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnDate">Return Date *</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
                      min={formData.pickupDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnTime">Return Time *</Label>
                    <Input
                      id="returnTime"
                      type="time"
                      value={formData.returnTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, returnTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickupLocation">Pickup Location *</Label>
                    <Select
                      value={formData.pickupLocation}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, pickupLocation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pickup location" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="returnLocation">Return Location *</Label>
                    <Select
                      value={formData.returnLocation}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, returnLocation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select return location" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.pickupDate && formData.returnDate && (
                  <div>
                    <h4 className="font-medium mb-3">Available Vehicles</h4>
                    <div className="grid gap-3 max-h-60 overflow-y-auto">
                      {getAvailableVehicles().map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.vehicleId === vehicle.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, vehicleId: vehicle.id }))}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={vehicle.photoUrl || "/placeholder.svg"}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="w-16 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">
                                  {vehicle.make} {vehicle.model}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {vehicle.plate} • {vehicle.class}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {vehicle.odometerKm.toLocaleString()} km
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">€{vehicle.baseDailyRateEur}/day</p>
                              <Badge variant="outline">{vehicle.location}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {getAvailableVehicles().length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No vehicles available for the selected dates</p>
                        <p className="text-sm">Try different dates or locations</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 - Pricing & Extras */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pricing & Extras</h3>

                <div className="space-y-6">
                  {/* Insurance */}
                  <div>
                    <h4 className="font-medium mb-3">Insurance Coverage</h4>
                    <div className="grid gap-3">
                      {INSURANCE_TIERS.map((tier) => (
                        <div
                          key={tier.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.insuranceTier === tier.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, insuranceTier: tier.id as any }))}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{tier.name}</p>
                              <p className="text-sm text-muted-foreground">{tier.description}</p>
                            </div>
                            <p className="font-medium">{tier.price === 0 ? "Included" : `+€${tier.price}/day`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extras */}
                  <div>
                    <h4 className="font-medium mb-3">Extras</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Child Seat</p>
                          <p className="text-sm text-muted-foreground">€5 per seat</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                extras: { ...prev.extras, childSeat: Math.max(0, prev.extras.childSeat - 1) },
                              }))
                            }
                            disabled={formData.extras.childSeat === 0}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{formData.extras.childSeat}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                extras: { ...prev.extras, childSeat: prev.extras.childSeat + 1 },
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">GPS Navigation</p>
                          <p className="text-sm text-muted-foreground">€10 total</p>
                        </div>
                        <Checkbox
                          checked={formData.extras.gps}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              extras: { ...prev.extras, gps: !!checked },
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Extra Kilometers</p>
                          <p className="text-sm text-muted-foreground">€0.25 per km</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            step="50"
                            value={formData.extras.extraKm}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                extras: { ...prev.extras, extraKm: Number.parseInt(e.target.value) || 0 },
                              }))
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div>
                    <Label htmlFor="discountCode">Discount Code</Label>
                    <Input
                      id="discountCode"
                      value={formData.discountCode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, discountCode: e.target.value }))}
                      placeholder="Enter discount code"
                    />
                  </div>

                  {/* Price Breakdown */}
                  {pricing.total > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-3">Price Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base rental ({pricing.days} days)</span>
                          <span>€{pricing.basePrice.toFixed(2)}</span>
                        </div>
                        {pricing.insurancePrice > 0 && (
                          <div className="flex justify-between">
                            <span>Insurance ({formData.insuranceTier})</span>
                            <span>€{pricing.insurancePrice.toFixed(2)}</span>
                          </div>
                        )}
                        {pricing.extrasPrice > 0 && (
                          <div className="flex justify-between">
                            <span>Extras</span>
                            <span>€{pricing.extrasPrice.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>€{pricing.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 - Deposit & Policies */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Deposit & Policies</h3>

                <div className="space-y-6">
                  {/* Security Deposit */}
                  <div>
                    <h4 className="font-medium mb-3">Security Deposit</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="securityDeposit">Deposit Amount (€)</Label>
                        <Input
                          id="securityDeposit"
                          type="number"
                          min="100"
                          max="1000"
                          step="50"
                          value={formData.securityDeposit}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              securityDeposit: Number.parseInt(e.target.value) || 200,
                            }))
                          }
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Recommended: €200-500 depending on vehicle class
                        </p>
                      </div>

                      <div>
                        <Label>Deposit Action</Label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="depositAction"
                              value="hold"
                              checked={formData.depositAction === "hold"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  depositAction: e.target.value as "hold" | "charge",
                                }))
                              }
                            />
                            <span>Hold (authorize only)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="depositAction"
                              value="charge"
                              checked={formData.depositAction === "charge"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  depositAction: e.target.value as "hold" | "charge",
                                }))
                              }
                            />
                            <span>Charge now</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Policies */}
                  <div>
                    <h4 className="font-medium mb-3">Rental Policies Agreement</h4>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.policiesAccepted.mileage}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              policiesAccepted: { ...prev.policiesAccepted, mileage: !!checked },
                            }))
                          }
                        />
                        <div>
                          <p className="font-medium">Mileage Limit Policy</p>
                          <p className="text-sm text-muted-foreground">
                            I understand the daily mileage limit and overage fees
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.policiesAccepted.fuel}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              policiesAccepted: { ...prev.policiesAccepted, fuel: !!checked },
                            }))
                          }
                        />
                        <div>
                          <p className="font-medium">Fuel Policy</p>
                          <p className="text-sm text-muted-foreground">
                            I agree to return the vehicle with the same fuel level
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.policiesAccepted.damage}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              policiesAccepted: { ...prev.policiesAccepted, damage: !!checked },
                            }))
                          }
                        />
                        <div>
                          <p className="font-medium">Damage Responsibility</p>
                          <p className="text-sm text-muted-foreground">
                            I accept responsibility for any damage during the rental period
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.policiesAccepted.lateFee}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              policiesAccepted: { ...prev.policiesAccepted, lateFee: !!checked },
                            }))
                          }
                        />
                        <div>
                          <p className="font-medium">Late Return Fee</p>
                          <p className="text-sm text-muted-foreground">
                            I understand late return fees apply after the agreed time
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 - Payment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment</h3>

                <div className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <h4 className="font-medium mb-3">Payment Method</h4>
                    <div className="grid gap-3">
                      <label
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === "card" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: e.target.value as any,
                            }))
                          }
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === "cash" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === "cash"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: e.target.value as any,
                            }))
                          }
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <Euro className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Cash</p>
                            <p className="text-sm text-muted-foreground">Pay at pickup location</p>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === "bank" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === "bank"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: e.target.value as any,
                            }))
                          }
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Bank Transfer</p>
                            <p className="text-sm text-muted-foreground">Transfer to our account</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Card Details</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Expiry Date *</Label>
                            <Input
                              id="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={(e) => setFormData((prev) => ({ ...prev, cardExpiry: e.target.value }))}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvc">CVC *</Label>
                            <Input
                              id="cardCvc"
                              value={formData.cardCvc}
                              onChange={(e) => setFormData((prev) => ({ ...prev, cardCvc: e.target.value }))}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Final Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Customer</span>
                        <span>{selectedCustomer?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicle</span>
                        <span>
                          {selectedVehicle?.make} {selectedVehicle?.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dates</span>
                        <span>
                          {formData.pickupDate} to {formData.returnDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pickup</span>
                        <span>{formData.pickupLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return</span>
                        <span>{formData.returnLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance</span>
                        <span>{formData.insuranceTier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security Deposit</span>
                        <span>
                          €{formData.securityDeposit} ({formData.depositAction})
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total Due Now</span>
                        <span>€{pricing.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Payment Method</span>
                        <span className="capitalize">{formData.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Rental"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
