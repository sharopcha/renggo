"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Download, CreditCard, TrendingUp, AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react"
import { 
  fetchFilteredPayments, 
  fetchPaymentSummary, 
  fetchPayouts,
  fetchNextPayout,
  fetchLastPayout,
  type PaymentWithDetails,
  type Payout 
} from "@/lib/supabase/payments"
import { useToast } from "@/hooks/use-toast"

const getStatusColor = (status: string) => {
  switch (status) {
    case "succeeded":
      return "bg-success text-success-foreground"
    case "failed":
      return "bg-destructive text-destructive-foreground"
    case "pending":
      return "bg-warning text-warning-foreground"
    case "cancelled":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "charge":
      return "bg-primary text-primary-foreground"
    case "refund":
      return "bg-chart-2 text-white"
    case "payout":
      return "bg-success text-success-foreground"
    case "fee":
      return "bg-warning text-warning-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function PaymentsContent() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [nextPayout, setNextPayout] = useState<Payout | null>(null)
  const [lastPayout, setLastPayout] = useState<Payout | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalRefunds: 0,
    totalPayouts: 0,
    failedTransactions: 0,
    failureRate: 0,
    platformFees: 0,
    processorFees: 0,
    vatCollected: 0,
  })

  // TODO: Get organization ID from auth context
  const organizationId = "1baaf78c-3719-45bc-9cf8-d3b3b3059006"

  useEffect(() => {
    loadData()
  }, [typeFilter, statusFilter])

  async function loadData() {
    setLoading(true)
    try {
      // Fetch payments with filters
      const { data: paymentsData, error: paymentsError } = await fetchFilteredPayments(
        organizationId,
        { type: typeFilter, status: statusFilter, search: searchQuery }
      )

      if (paymentsError) {
        toast({
          title: "Error loading payments",
          description: paymentsError.message,
          variant: "destructive",
        })
      } else {
        setPayments(paymentsData)
      }

      // Fetch summary
      const { data: summaryData, error: summaryError } = await fetchPaymentSummary(organizationId)
      if (summaryError) {
        console.error("Error loading summary:", summaryError)
      } else if (summaryData) {
        setSummary(summaryData)
      }

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await fetchPayouts(organizationId)
      if (payoutsError) {
        console.error("Error loading payouts:", payoutsError)
      } else {
        setPayouts(payoutsData)
      }

      // Fetch next and last payout
      const { data: nextPayoutData } = await fetchNextPayout(organizationId)
      setNextPayout(nextPayoutData)

      const { data: lastPayoutData } = await fetchLastPayout(organizationId)
      setLastPayout(lastPayoutData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter((payment) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      payment.id.toLowerCase().includes(searchLower) ||
      payment.rental_id?.toLowerCase().includes(searchLower) ||
      payment.method_details?.toLowerCase().includes(searchLower) ||
      payment.transaction_id?.toLowerCase().includes(searchLower)
    )
  })

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`

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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">From successful charges</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary.totalRefunds)}</div>
                <p className="text-xs text-muted-foreground">Refunded to customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary.totalPayouts)}</div>
                <p className="text-xs text-muted-foreground">Paid to fleet owners</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.failureRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">{summary.failedTransactions} failed transactions</p>
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
                    <SelectItem value="charge">Charge</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="succeeded">Succeeded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.id.substring(0, 8)}</TableCell>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(payment.type)}>
                              {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {payment.rental_id ? payment.rental_id.substring(0, 8) : "-"}
                          </TableCell>
                          <TableCell>
                            {payment.rental?.customer 
                              ? `${payment.rental.customer.first_name} ${payment.rental.customer.last_name}`
                              : payment.customer
                              ? `${payment.customer.first_name} ${payment.customer.last_name}`
                              : "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {payment.type === "refund" ? "-" : ""}
                            {formatCurrency(Number(payment.amount_eur))}
                          </TableCell>
                          <TableCell>{payment.method_details || payment.method}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
                        {nextPayout ? (
                          <>
                            <p className="text-2xl font-bold">{formatCurrency(Number(nextPayout.amount_eur))}</p>
                            <p className="text-sm text-muted-foreground">
                              Due {new Date(nextPayout.scheduled_date || "").toLocaleDateString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No scheduled payouts</p>
                        )}
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Last Payout</h4>
                          <Badge variant="default">Completed</Badge>
                        </div>
                        {lastPayout ? (
                          <>
                            <p className="text-2xl font-bold">{formatCurrency(Number(lastPayout.amount_eur))}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(lastPayout.processed_date || "").toLocaleDateString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No completed payouts</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Payout History</h4>
                      {payouts.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No payout history available</p>
                      ) : (
                        payouts.map((payout) => (
                          <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{payout.method.replace("_", " ")}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(payout.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(Number(payout.amount_eur))}</p>
                              <Badge className={getStatusColor(payout.status)}>
                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
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
                      <p className="text-2xl font-bold">{formatCurrency(summary.platformFees)}</p>
                      <p className="text-sm text-muted-foreground">Collected from transactions</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Payment Processing</h4>
                      <p className="text-2xl font-bold">{formatCurrency(summary.processorFees)}</p>
                      <p className="text-sm text-muted-foreground">2.9% + €0.30 per transaction</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">VAT Collected</h4>
                      <p className="text-2xl font-bold">{formatCurrency(summary.vatCollected)}</p>
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
          </div>
        </>
      )}
    </div>
  )
}
