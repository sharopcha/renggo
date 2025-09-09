"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockPayments, type Payment } from "@/lib/mock-data"
import { Search, Filter, Download, CreditCard, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

const getStatusColor = (status: Payment["status"]) => {
  switch (status) {
    case "Succeeded":
      return "bg-success text-success-foreground"
    case "Failed":
      return "bg-destructive text-destructive-foreground"
    case "Pending":
      return "bg-warning text-warning-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getTypeColor = (type: Payment["type"]) => {
  switch (type) {
    case "Charge":
      return "bg-primary text-primary-foreground"
    case "Refund":
      return "bg-chart-2 text-white"
    case "Payout":
      return "bg-success text-success-foreground"
    case "Fee":
      return "bg-warning text-warning-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function PaymentsContent() {
  const [payments] = useState<Payment[]>(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.rentalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Calculate summary stats
  const totalRevenue = payments
    .filter((p) => p.type === "Charge" && p.status === "Succeeded")
    .reduce((sum, p) => sum + p.amountEur, 0)

  const totalRefunds = payments
    .filter((p) => p.type === "Refund" && p.status === "Succeeded")
    .reduce((sum, p) => sum + p.amountEur, 0)

  const totalPayouts = payments
    .filter((p) => p.type === "Payout" && p.status === "Succeeded")
    .reduce((sum, p) => sum + p.amountEur, 0)

  const failedTransactions = payments.filter((p) => p.status === "Failed").length
  const failureRate = payments.length > 0 ? ((failedTransactions / payments.length) * 100).toFixed(1) : "0.0"

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Payouts</h1>
          <p className="text-muted-foreground">Manage transactions, payouts, and financial overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From successful charges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRefunds.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Refunded to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalPayouts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Paid to fleet owners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failureRate}%</div>
            <p className="text-xs text-muted-foreground">{failedTransactions} failed transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="fees">Fees & Taxes</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, rental, or method..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Charge">Charge</SelectItem>
                <SelectItem value="Refund">Refund</SelectItem>
                <SelectItem value="Payout">Payout</SelectItem>
                <SelectItem value="Fee">Fee</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Succeeded">Succeeded</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rental ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell>
                      {new Date(payment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(payment.type)}>{payment.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{payment.rentalId || "-"}</TableCell>
                    <TableCell className="font-medium">
                      {payment.type === "Refund" ? "-" : ""}€{payment.amountEur.toFixed(2)}
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
              <CardDescription>Scheduled and completed payouts to fleet owners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Next Payout</h4>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                    <p className="text-2xl font-bold">€2,450.00</p>
                    <p className="text-sm text-muted-foreground">Due February 1, 2025</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Last Payout</h4>
                      <Badge variant="default">Completed</Badge>
                    </div>
                    <p className="text-2xl font-bold">€1,250.00</p>
                    <p className="text-sm text-muted-foreground">January 31, 2025</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Payout History</h4>
                  {payments
                    .filter((p) => p.type === "Payout")
                    .map((payout) => (
                      <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{payout.method}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payout.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">€{payout.amountEur.toFixed(2)}</p>
                          <Badge className={getStatusColor(payout.status)}>{payout.status}</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fees & Taxes Summary</CardTitle>
              <CardDescription>Platform fees and tax information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Platform Fees</h4>
                  <p className="text-2xl font-bold">€{(totalRevenue * 0.15).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">15% of gross revenue</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Payment Processing</h4>
                  <p className="text-2xl font-bold">€{(totalRevenue * 0.029).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">2.9% + €0.30 per transaction</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">VAT Collected</h4>
                  <p className="text-2xl font-bold">€{(totalRevenue * 0.2).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">20% VAT on services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredPayments.length} of {payments.length} transactions
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
    </div>
  )
}
