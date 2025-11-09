import { createClient } from './client'
import type { InsurancePolicy, Insurer, Claim, ClaimAttachment, ClaimHistoryEntry } from '@/types/insurance'

export async function listPolicies(organizationId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('insurance_policies')
    .select(`*, insurers:insurer_id(name, contact), vehicle_id`)
    .eq('organization_id', organizationId)
    .order('end_date', { ascending: true })
  if (error) throw error
  return data as any as InsurancePolicy[]
}

export async function getVehiclePolicy(vehicleId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('insurance_policies')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .eq('active', true)
    .limit(1)
  if (error) throw error
  return (data && data[0]) as InsurancePolicy | undefined
}

export async function listExpiringPolicies(organizationId: string, days = 30) {
  const supabase = createClient()
  const now = new Date()
  const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('insurance_policies')
    .select('*')
    .eq('organization_id', organizationId)
    .lte('end_date', cutoffStr)
    .order('end_date', { ascending: true })

  if (error) throw error
  return data as InsurancePolicy[]
}

export interface CreatePolicyInput {
  organization_id: string
  vehicle_id?: string
  insurer_id?: string
  policy_number: string
  policy_type_key?: string
  coverage?: Record<string, any>
  start_date: string
  end_date: string
  premium_eur?: number
  active?: boolean
  metadata?: Record<string, any>
}

export async function createPolicy(input: CreatePolicyInput) {
  const supabase = createClient()
  const { data, error } = await (supabase.from('insurance_policies') as any)
    .insert(input)
    .select('*')
    .single()
  if (error) throw error
  return data as InsurancePolicy
}

export interface CreateClaimInput {
  organization_id: string
  vehicle_id?: string
  rental_id?: string
  customer_id?: string
  claim_number?: string
  policy_id?: string
  incident_date?: string
  source?: string
  description?: string
  estimated_cost_eur?: number
  assignee?: string
  metadata?: Record<string, any>
}

export async function createClaim(input: CreateClaimInput) {
  const supabase = createClient()
  const { data, error } = await (supabase.from('claims') as any)
    .insert({
      ...input,
      reported_at: new Date().toISOString(),
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Claim
}

export async function listClaims(organizationId: string, opts: { status?: string; vehicle?: string; limit?: number } = {}) {
  const supabase = createClient()
  let q: any = supabase.from('claims').select('*').eq('organization_id', organizationId)
  if (opts.status) q = q.eq('status', opts.status)
  if (opts.vehicle) q = q.eq('vehicle_id', opts.vehicle)
  if (opts.limit) q = q.limit(opts.limit)
  const { data, error } = await q.order('reported_at', { ascending: false })
  if (error) throw error
  return data as Claim[]
}

export async function listClaimsWithRefs(organizationId: string, opts: { status?: string; limit?: number } = {}) {
  const supabase = createClient()
  let q: any = supabase
    .from('claims')
    // Rely on FK inference for relationships
    .select(`*, vehicles(plate, make, model), customers(first_name, last_name)`) // deno-lint-ignore
    .eq('organization_id', organizationId)

  if (opts.status) q = q.eq('status', opts.status)
  if (opts.limit) q = q.limit(opts.limit)

  const { data, error } = await q.order('reported_at', { ascending: false })
  if (error) throw error
  return data as any
}

export async function updateClaimStatus(claimId: string, status: string, changedBy?: string, note?: string) {
  const supabase = createClient()
  // Write history
  if (note || changedBy) {
    await (supabase.from('claim_history') as any).insert({ claim_id: claimId, status_to: status, note, changed_by: changedBy })
  }
  const { data, error } = await (supabase.from('claims') as any)
    .update({ status })
    .eq('id', claimId)
    .select('*')
    .single()
  if (error) throw error
  return data as Claim
}

export interface AddAttachmentInput {
  claim_id: string
  storage_path: string
  filename?: string
  content_type?: string
  metadata?: Record<string, any>
}

export async function addClaimAttachment(input: AddAttachmentInput) {
  const supabase = createClient()
  const { data, error } = await (supabase.from('claim_attachments') as any)
    .insert(input)
    .select('*')
    .single()
  if (error) throw error
  return data as ClaimAttachment
}

export async function getClaimAttachments(claimId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from('claim_attachments').select('*').eq('claim_id', claimId).order('created_at', { ascending: false })
  if (error) throw error
  return data as ClaimAttachment[]
}

export async function getClaimsForVehicle(vehicleId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from('claims').select('*').eq('vehicle_id', vehicleId).order('reported_at', { ascending: false })
  if (error) throw error
  return data as Claim[]
}

// Analytics helpers
export async function getVehicleClaimStats() {
  const supabase = createClient()
  const { data, error } = await supabase.from('claim_stats_vehicle').select('*')
  if (error) throw error
  return data as any[]
}

export async function getCustomerClaimStats() {
  const supabase = createClient()
  const { data, error } = await supabase.from('claim_stats_customer').select('*')
  if (error) throw error
  return data as any[]
}

export async function getCommonIncidentTypes() {
  const supabase = createClient()
  const { data, error } = await supabase.from('claim_incident_types').select('*')
  if (error) throw error
  return data as any[]
}

export async function getVehiclesWithCoverageGaps() {
  const supabase = createClient()
  const { data, error } = await supabase.from('vehicle_policy_gap').select('*')
  if (error) throw error
  return data as any[]
}
