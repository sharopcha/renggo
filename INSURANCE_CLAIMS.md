# Insurance & Claims Module

This document describes the database schema, helper APIs, and UI wiring for Insurance Policies and Claims.

## Database

New tables:
- public.insurers
- public.policy_types
- public.insurance_policies
- public.claims
- public.claim_attachments
- public.claim_history

Analytics views:
- public.claim_stats_vehicle
- public.claim_stats_customer
- public.claim_incident_types
- public.vehicle_policy_gap

Run migrations:
- 20251109120000_create_insurance_and_claims.sql
- 20251109124500_claims_analytics_and_incident_type.sql

## TypeScript types
- `types/insurance.ts` includes Insurer, InsurancePolicy, Claim, ClaimAttachment, ClaimHistoryEntry.

## Supabase helpers
- `lib/supabase/insurance.ts` exposes:
  - Policy: listPolicies, getVehiclePolicy, listExpiringPolicies, createPolicy
  - Claims: createClaim, listClaims, listClaimsWithRefs, updateClaimStatus, addClaimAttachment, getClaimAttachments, getClaimsForVehicle
  - Analytics: getVehicleClaimStats, getCustomerClaimStats, getCommonIncidentTypes, getVehiclesWithCoverageGaps

## UI integration
- `app/backoffice/claims/page.tsx` fetches initial claims and passes to `components/claims/claims-content.tsx`.
- `components/claims/claims-content.tsx` now accepts `initialClaims` and `organizationId`, transforms DB rows to UI cards, and supports drag-and-drop status updates (persists via `updateClaimStatus`).

## Notes
- Status mapping: DB statuses (Submitted, Under Review, Approved, Rejected, Paid, Closed) are mapped to UI buckets (new, assessing, awaiting-docs, approved, rejected).
- For attachments and detailed costs, use `claim_attachments` and extend the UI accordingly.

## Regenerate Supabase Types (optional)
You can regenerate `lib/supabase/database.types.ts` after applying the migrations to include new tables in types:

```bash
pnpm run gen-types
```
