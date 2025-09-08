"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { mockRentals, mockVehicles, mockCustomers, mockPayments } from "@/lib/mock-data"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Car,
  User,
  CreditCard,
  Camera,
  MessageSquare,
  Phone,
  Mail,
  Euro,
  Send,
  Upload,
  Edit,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface RentalDetailsContentProps {
  rentalId: string
}

export function RentalDetailsContent({ rentalId }: RentalDetailsContentProps) {
  const [messageText, setMessageText] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [refundReason, setRefundReason] = useState("")
  const [refundNote, setRefundNote] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Customer",
      text: "Hi, I have a question about the pickup location.",
      timestamp: "2025-01-15 09:30",
    },
    {
      id: 2,
      sender: "You",
      text: "Hello! I'd be happy to help. What would you like to know?",
      timestamp: "2025-01-15 09:45",
    },
  ])

  const rental = mockRentals.find((r) => r.id === rentalId)
  const vehicle = rental ? mockVehicles.find((v) => v.id === rental.vehicleId) : null
  const customer = rental ? mockCustomers.find((c) => c.id === rental.customerId) : null
  const payment = rental ? mockPayments.find((p) => p.rentalId === rental.id) : null

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

  const getStatusColor = (status: string) => {
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = () => {
    const start = new Date(rental.start)
    const end = new Date(rental.end)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      text: messageText,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages([...messages, newMessage])
    setMessageText("")
    toast({
      title: "Message sent",
      description: "Your message has been sent to the customer.",
    })
  }

  const handleRefund = () => {
    if (!refundAmount || !refundReason) return

    toast({
      title: "Refund issued",
      description: `Refund of €${refundAmount} has been processed.`,
    })

    // Reset form
    setRefundAmount("")
    setRefundReason("")
    setRefundNote("")
  }

  const rentalTimeline = [
    { status: "Booked", completed: true, date: "2025-01-10 14:30" },
    { status: "Picked Up", completed: rental.status !== "Upcoming", date: formatDateTime(rental.start) },
    {
      status: "Returned",
      completed: rental.status === "Completed",
      date: rental.status === "Completed" ? formatDateTime(rental.end) : "Pending",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/rentals">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rental Details</h1>
            <p className="text-muted-foreground">{rental.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(rental.status)}>{rental.status}</Badge>
          {(rental.status === "Upcoming" || rental.status === "Active") && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/backoffice/rentals/${rentalId}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Update Details
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Rental Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Rental Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{calculateDuration()} days</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-sm text-muted-foreground">€{rental.priceEur.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{rental.pickupCity}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="font-medium">Rental Timeline</h3>
              <div className="space-y-3">
                {rentalTimeline.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${item.completed ? "bg-primary" : "bg-muted"}`} />
                    <div>
                      <p className={`text-sm ${item.completed ? "font-medium" : "text-muted-foreground"}`}>
                        {item.status}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="space-y-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Customer
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Message Customer</SheetTitle>
                      <SheetDescription>Communicate with {customer.name} about this rental</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col h-full mt-6">
                      <div className="flex-1 space-y-4 overflow-y-auto">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="flex-1 min-h-[60px]"
                          />
                          <Button onClick={handleSendMessage} size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    const photosTab = document.querySelector('[data-value="photos"]') as HTMLElement
                    photosTab?.click()
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  View Photos
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Refund
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Process Refund</DialogTitle>
                      <DialogDescription>
                        Issue a refund for this rental. The refund will be processed to the original payment method.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="refund-amount">Refund Amount</Label>
                        <Input
                          id="refund-amount"
                          type="number"
                          placeholder="0.00"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Maximum: €{rental.priceEur.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label htmlFor="refund-reason">Reason</Label>
                        <Select value={refundReason} onValueChange={setRefundReason}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cancellation">Cancellation</SelectItem>
                            <SelectItem value="overcharge">Overcharge</SelectItem>
                            <SelectItem value="service-issue">Service Issue</SelectItem>
                            <SelectItem value="deposit-release">Deposit Release</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="refund-note">Note (Optional)</Label>
                        <Textarea
                          id="refund-note"
                          placeholder="Additional details..."
                          value={refundNote}
                          onChange={(e) => setRefundNote(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleRefund} className="w-full">
                        Issue Refund
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="photos" data-value="photos">
            Photos & Damage
          </TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <Badge variant={customer.verified ? "default" : "secondary"}>
                      {customer.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.country}</span>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Trips</p>
                    <p className="font-medium">{customer.trips}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lifetime Spend</p>
                    <p className="font-medium">€{customer.lifetimeSpendEur.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>Vehicle Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="relative h-16 w-24 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={vehicle.photoUrl || "/placeholder.svg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.plate} • {vehicle.year}
                    </p>
                    <Badge variant="outline">{vehicle.class}</Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Daily Rate</p>
                    <p className="font-medium">€{vehicle.baseDailyRateEur}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{vehicle.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Odometer</p>
                    <p className="font-medium">{vehicle.odometerKm.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-medium">{vehicle.rating} ⭐</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup</p>
                      <p className="font-medium">{formatDateTime(rental.start)}</p>
                      <p className="text-sm text-muted-foreground">{rental.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return</p>
                      <p className="font-medium">{formatDateTime(rental.end)}</p>
                      <p className="text-sm text-muted-foreground">{rental.returnLocation}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Included Kilometers</p>
                      <p className="font-medium">{calculateDuration() * 200} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Extras</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">Full Insurance</Badge>
                        <Badge variant="secondary">GPS Navigation</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Transaction details for this rental</CardDescription>
            </CardHeader>
            <CardContent>
              {payment ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{payment.method}</p>
                        <p className="text-sm text-muted-foreground">{new Date(payment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{payment.amountEur.toFixed(2)}</p>
                      <Badge variant={payment.status === "Succeeded" ? "default" : "destructive"}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Base Rental Fee</p>
                      <p className="font-medium">€{(rental.priceEur * 0.85).toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Service Fee</p>
                      <p className="font-medium">€{(rental.priceEur * 0.1).toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Insurance</p>
                      <p className="font-medium">€{(rental.priceEur * 0.05).toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Total</p>
                      <p className="font-bold">€{rental.priceEur.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No payment information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Photos & Damage Report</CardTitle>
              <CardDescription>Pre and post-trip vehicle condition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Pre-Trip Photos</h4>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Post-Trip Photos</h4>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Damage Notes</h4>
                  <Button variant="outline" size="sm">
                    Flag for Claim
                  </Button>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">No damage reported</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communication history with customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages exchanged</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>Timeline of events for this rental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2025-01-10 14:30", event: "Booking confirmed", detail: "Customer completed payment" },
                  { time: "2025-01-15 09:45", event: "Vehicle prepared", detail: "Cleaning and inspection completed" },
                  { time: "2025-01-15 10:00", event: "Vehicle picked up", detail: "Customer collected vehicle" },
                  { time: "2025-01-18 10:00", event: "Vehicle returned", detail: "Return inspection completed" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
