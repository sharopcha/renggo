import { createClient } from "@/lib/supabase/client"

// Temporary types until database types are regenerated
export interface Payment {
  id: string
  organization_id: string
  rental_id: string | null
  customer_id: string | null
  type: "charge" | "refund" | "payout" | "fee"
  amount_eur: number
  status: "pending" | "succeeded" | "failed" | "cancelled"
  method: "card" | "bank_transfer" | "cash" | "platform_fee" | "other"
  method_details: string | null
  transaction_id: string | null
  processor: string | null
  processor_fee_eur: number | null
  platform_fee_eur: number | null
  net_amount_eur: number | null
  currency: string | null
  description: string | null
  metadata: any
  failed_reason: string | null
  processed_at: string | null
  created_at: string
  updated_at: string
}

export interface Payout {
  id: string
  organization_id: string
  amount_eur: number
  status: "pending" | "succeeded" | "failed" | "cancelled"
  method: "card" | "bank_transfer" | "cash" | "platform_fee" | "other"
  bank_account: string | null
  transaction_id: string | null
  period_start: string
  period_end: string
  scheduled_date: string | null
  processed_date: string | null
  notes: string | null
  metadata: any
  created_at: string
  updated_at: string
}

export interface Rental {
  id: string
  organization_id: string
  vehicle_id: string
  customer_id: string
  start_date: string
  end_date: string
  status: "upcoming" | "active" | "completed" | "cancelled"
  pickup_location: string
  return_location: string
  pickup_city: string | null
  return_city: string | null
  price_eur: number
  deposit_eur: number | null
  insurance_eur: number | null
  extras_eur: number | null
  total_price_eur: number | null
  odometer_start: number | null
  odometer_end: number | null
  notes: string | null
  metadata: any
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  organization_id: string
  plate: string
  make: string
  model: string
  year: number
  vehicle_class: string
  photo_url: string | null
}

export interface Customer {
  id: string
  organization_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar_url: string | null
}

export interface PaymentWithDetails extends Payment {
  rental?: Rental & {
    vehicle?: Vehicle
    customer?: Customer
  }
  customer?: Customer
}

export interface PaymentSummary {
  totalRevenue: number
  totalRefunds: number
  totalPayouts: number
  totalFees: number
  platformFees: number
  processorFees: number
  vatCollected: number
  failedTransactions: number
  failureRate: number
  netEarnings: number
}

export interface PayoutWithDetails extends Payout {
  paymentsCount?: number
  totalCharges?: number
}

/**
 * Fetch all payments for an organization with related data
 */
export async function fetchPayments(organizationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      rental:rentals(
        *,
        vehicle:vehicles(*),
        customer:customers(*)
      ),
      customer:customers(*)
    `)
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return { data: [], error }
  }

  return { data: data as PaymentWithDetails[], error: null }
}

/**
 * Fetch payment summary statistics for an organization
 */
export async function fetchPaymentSummary(organizationId: string): Promise<{
  data: PaymentSummary | null
  error: any
}> {
  const supabase = createClient()

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .eq("organization_id", organizationId)

  if (error) {
    console.error("Error fetching payment summary:", error)
    return { data: null, error }
  }

  if (!payments || payments.length === 0) {
    return {
      data: {
        totalRevenue: 0,
        totalRefunds: 0,
        totalPayouts: 0,
        totalFees: 0,
        platformFees: 0,
        processorFees: 0,
        vatCollected: 0,
        failedTransactions: 0,
        failureRate: 0,
        netEarnings: 0,
      },
      error: null,
    }
  }

  const paymentsTyped = payments as unknown as Payment[]

  const succeededCharges = paymentsTyped.filter(
    (p) => p.type === "charge" && p.status === "succeeded"
  )
  const succeededRefunds = paymentsTyped.filter(
    (p) => p.type === "refund" && p.status === "succeeded"
  )
  const succeededPayouts = paymentsTyped.filter(
    (p) => p.type === "payout" && p.status === "succeeded"
  )
  const succeededFees = paymentsTyped.filter(
    (p) => p.type === "fee" && p.status === "succeeded"
  )
  const failedPayments = paymentsTyped.filter((p) => p.status === "failed")

  const totalRevenue = succeededCharges.reduce(
    (sum, p) => sum + Number(p.amount_eur),
    0
  )
  const totalRefunds = succeededRefunds.reduce(
    (sum, p) => sum + Number(p.amount_eur),
    0
  )
  const totalPayouts = succeededPayouts.reduce(
    (sum, p) => sum + Number(p.amount_eur),
    0
  )
  const totalFees = succeededFees.reduce((sum, p) => sum + Number(p.amount_eur), 0)

  const platformFees = succeededCharges.reduce(
    (sum, p) => sum + Number(p.platform_fee_eur || 0),
    0
  )
  const processorFees = succeededCharges.reduce(
    (sum, p) => sum + Number(p.processor_fee_eur || 0),
    0
  )

  // VAT is typically 20% of the rental price
  const vatCollected = totalRevenue * 0.2

  const failedTransactions = failedPayments.length
  const failureRate =
    paymentsTyped.length > 0 ? (failedTransactions / paymentsTyped.length) * 100 : 0

  const netEarnings = totalRevenue - totalRefunds - platformFees - processorFees

  return {
    data: {
      totalRevenue,
      totalRefunds,
      totalPayouts,
      totalFees,
      platformFees,
      processorFees,
      vatCollected,
      failedTransactions,
      failureRate,
      netEarnings,
    },
    error: null,
  }
}

/**
 * Fetch all payouts for an organization
 */
export async function fetchPayouts(organizationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payouts:", error)
    return { data: [], error }
  }

  return { data: data as Payout[], error: null }
}

/**
 * Fetch transactions filtered by type and status
 */
export async function fetchFilteredPayments(
  organizationId: string,
  filters: {
    type?: string
    status?: string
    search?: string
  }
) {
  const supabase = createClient()

  let query = supabase
    .from("payments")
    .select(`
      *,
      rental:rentals(
        *,
        vehicle:vehicles(*),
        customer:customers(*)
      ),
      customer:customers(*)
    `)
    .eq("organization_id", organizationId)

  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type)
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching filtered payments:", error)
    return { data: [], error }
  }

  let filteredData = data as PaymentWithDetails[]

  // Apply search filter on the client side
  if (filters.search && filters.search.trim() !== "") {
    const searchLower = filters.search.toLowerCase()
    filteredData = filteredData.filter(
      (payment) =>
        payment.id.toLowerCase().includes(searchLower) ||
        payment.rental_id?.toLowerCase().includes(searchLower) ||
        payment.method_details?.toLowerCase().includes(searchLower) ||
        payment.transaction_id?.toLowerCase().includes(searchLower)
    )
  }

  return { data: filteredData, error: null }
}

/**
 * Get next scheduled payout
 */
export async function fetchNextPayout(organizationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("status", "pending")
    .order("scheduled_date", { ascending: true })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("Error fetching next payout:", error)
    return { data: null, error }
  }

  return { data: data as Payout | null, error: null }
}

/**
 * Get last completed payout
 */
export async function fetchLastPayout(organizationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("status", "succeeded")
    .order("processed_date", { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching last payout:", error)
    return { data: null, error }
  }

  return { data: data as Payout | null, error: null }
}
