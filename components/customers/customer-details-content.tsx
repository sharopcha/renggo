"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockCustomers, mockRentals, mockPayments } from "@/lib/mock-data"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Ban,
  Flag,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

interface CustomerDetailsContentProps {
  customerId: string
}

export function CustomerDetailsContent({ customerId }: CustomerDetailsContentProps) {
  const customer = mockCustomers.find((c) => c.id === customerId)
  const customerRentals = mockRentals.filter((r) => r.customerId === customerId)
  const customerPayments = mockPayments.filter((p) => customerRentals.some((r) => r.id === p.rentalId))

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Customer Not Found</h1>
          <p className="text-muted-foreground">The customer you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/customers">Back to Customers</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground"
      case "Banned":
        return "bg-destructive text-destructive-foreground"
      case "Suspended":
        return "bg-warning text-warning-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRentalStatusColor = (status: string) => {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Customer
          </Button>
          <Button variant="outline">
            {customer.verified ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
            {customer.verified ? "Reverify" : "Verify Customer"}
          </Button>
          <Button variant="outline">
            <Ban className="h-4 w-4 mr-2" />
            {customer.status === "Banned" ? "Unban" : "Ban Customer"}
          </Button>
        </div>
      </div>

      {/* Customer Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={customer.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                <Badge variant={customer.verified ? "default" : "secondary"}>
                  {customer.verified ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Unverified
                    </>
                  )}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Trips</span>
                    <span className="text-sm font-medium">{customer.trips}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cancellations</span>
                    <span className="text-sm font-medium">{customer.cancellations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lifetime Spend</span>
                    <span className="text-sm font-medium">€{customer.lifetimeSpendEur.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="rentals">Rental History</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="notes">Notes & Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{customer.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Account Status</p>
                  <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Identity Document</span>
                    <Badge variant={customer.verified ? "default" : "secondary"}>
                      {customer.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Driver's License</span>
                    <Badge variant={customer.verified ? "default" : "secondary"}>
                      {customer.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Number</span>
                    <Badge variant="default">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Address</span>
                    <Badge variant="default">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rentals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>All rentals by this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {customerRentals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rental ID</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerRentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell className="font-mono text-sm">{rental.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {new Date(rental.start).toLocaleDateString()} -{" "}
                              {new Date(rental.end).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{rental.pickupLocation}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRentalStatusColor(rental.status)}>{rental.status}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">€{rental.priceEur.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No rental history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Saved payment methods and transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Saved Cards</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/26</p>
                        </div>
                      </div>
                      <Badge variant="default">Primary</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Recent Transactions</h4>
                  {customerPayments.length > 0 ? (
                    <div className="space-y-2">
                      {customerPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{payment.method}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">€{payment.amountEur.toFixed(2)}</p>
                            <Badge variant={payment.status === "Succeeded" ? "default" : "destructive"}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No payment history available</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes & Risk Flags</CardTitle>
              <CardDescription>Internal notes and risk assessment for this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Flags</h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.cancellations > 2 && (
                      <Badge variant="destructive">
                        <Flag className="h-3 w-3 mr-1" />
                        High Cancellation Rate
                      </Badge>
                    )}
                    {!customer.verified && (
                      <Badge variant="secondary">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Unverified Account
                      </Badge>
                    )}
                    {customer.status === "Banned" && (
                      <Badge variant="destructive">
                        <Ban className="h-3 w-3 mr-1" />
                        Banned Account
                      </Badge>
                    )}
                    {customer.cancellations === 0 && customer.trips > 5 && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Reliable Customer
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Internal Notes</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>No internal notes recorded for this customer.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
