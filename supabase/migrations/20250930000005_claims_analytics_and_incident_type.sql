-- Add incident_type column to claims
alter table public.claims add column if not exists incident_type text;
create index if not exists idx_claims_incident_type on public.claims(incident_type);

-- View: vehicle claim stats
create or replace view public.claim_stats_vehicle as
select
  vehicle_id,
  count(*) as claim_count,
  sum(coalesce(estimated_cost_eur,0)) as total_estimated_cost_eur,
  sum(coalesce(payout_amount_eur,0)) as total_payout_eur,
  min(incident_date) as first_incident,
  max(incident_date) as last_incident
from public.claims
group by vehicle_id;

-- View: customer (driver/renter) claim stats
create or replace view public.claim_stats_customer as
select
  customer_id,
  count(*) as claim_count,
  sum(coalesce(estimated_cost_eur,0)) as total_estimated_cost_eur,
  sum(coalesce(payout_amount_eur,0)) as total_payout_eur
from public.claims
group by customer_id;

-- View: common incident types
create or replace view public.claim_incident_types as
select
  incident_type,
  count(*) as occurrences,
  avg(coalesce(estimated_cost_eur,0)) as avg_estimated_cost_eur
from public.claims
where incident_type is not null and incident_type <> ''
group by incident_type
order by occurrences desc;

-- View: vehicles without active policy (coverage gap)
create or replace view public.vehicle_policy_gap as
select v.id as vehicle_id, v.plate, v.organization_id
from public.vehicles v
left join lateral (
  select 1
  from public.insurance_policies p
  where p.vehicle_id = v.id
    and p.active = true
    and p.start_date <= current_date
    and p.end_date >= current_date
  limit 1
) ap on true
where ap is null;
