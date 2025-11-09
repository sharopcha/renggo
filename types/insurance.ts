export type CoverageType = 'third_party' | 'full' | 'wedding' | 'luxury' | string

export interface Insurer {
  id: string
  organization_id: string
  name: string
  contact?: Record<string, any>
  metadata?: Record<string, any>
  created_at?: string
}

export interface InsurancePolicy {
  id: string
  organization_id: string
  vehicle_id?: string | null
  insurer_id?: string | null
  policy_number: string
  policy_type_key?: CoverageType
  coverage?: Record<string, any>
  start_date: string
  end_date: string
  premium_eur?: number | null
  active?: boolean
  metadata?: Record<string, any>
  created_at?: string
}

export type ClaimStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assessing'
  | 'Approved'
  | 'Paid'
  | 'Rejected'
  | 'Closed'
  | string

export interface Claim {
  id: string
  organization_id: string
  vehicle_id?: string | null
  rental_id?: string | null
  customer_id?: string | null
  claim_number?: string | null
  policy_id?: string | null
  reported_at?: string
  incident_date?: string
  source?: string | null
  description?: string | null
  status?: ClaimStatus
  assignee?: string | null
  estimated_cost_eur?: number | null
  payout_amount_eur?: number | null
  deductible_eur?: number | null
  settlement_reference?: string | null
  metadata?: Record<string, any>
  created_at?: string
}

export interface ClaimAttachment {
  id: string
  claim_id: string
  storage_path: string
  filename?: string
  content_type?: string
  metadata?: Record<string, any>
  created_at?: string
}

export interface ClaimHistoryEntry {
  id: string
  claim_id: string
  status_from?: string
  status_to?: string
  note?: string
  changed_by?: string
  created_at?: string
}
