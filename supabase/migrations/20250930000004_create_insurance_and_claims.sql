-- Create insurers table
create table if not exists public.insurers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  contact jsonb,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Policy types (e.g. third_party, full, wedding, luxury)
create table if not exists public.policy_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  key text not null,
  title text not null,
  description text,
  created_at timestamptz default now()
);

-- Insurance policies linked to vehicles / organizations
create table if not exists public.insurance_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  insurer_id uuid references public.insurers(id) on delete set null,
  policy_number text not null,
  policy_type_key text,
  coverage jsonb,
  start_date date not null,
  end_date date not null,
  premium_eur numeric(12,2),
  active boolean default true,
  metadata jsonb,
  created_at timestamptz default now(),
  constraint policy_dates_check check (start_date <= end_date)
);

create index if not exists idx_insurance_policies_org on public.insurance_policies (organization_id);
create index if not exists idx_insurance_policies_vehicle on public.insurance_policies (vehicle_id);
create index if not exists idx_insurance_policies_end_date on public.insurance_policies (end_date);

-- Claims table
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  rental_id uuid references public.rentals(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  claim_number text unique,
  policy_id uuid references public.insurance_policies(id) on delete set null,
  reported_at timestamptz default now(),
  incident_date timestamptz,
  source text,
  description text,
  status text default 'Submitted',
  assignee text,
  estimated_cost_eur numeric(12,2),
  payout_amount_eur numeric(12,2),
  deductible_eur numeric(12,2),
  settlement_reference text,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_claims_org on public.claims (organization_id);
create index if not exists idx_claims_vehicle on public.claims (vehicle_id);
create index if not exists idx_claims_status on public.claims (status);
create index if not exists idx_claims_incident_date on public.claims (incident_date);

-- Claim attachments (photos, docs)
create table if not exists public.claim_attachments (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  storage_path text not null,
  filename text,
  content_type text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Claim timeline/history
create table if not exists public.claim_history (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  status_from text,
  status_to text,
  note text,
  changed_by text,
  created_at timestamptz default now()
);

-- Seed some basic policy types and an insurer/sample policy for the example organization
DO $$
DECLARE
  v_org uuid := (select id from public.organizations limit 1);
  v_vehicle uuid;
  v_insurer uuid;
BEGIN
  IF v_org IS NULL THEN
    RAISE NOTICE 'No organization found, skipping insurance seed';
    RETURN;
  END IF;

  INSERT INTO public.policy_types (organization_id, key, title, description)
    VALUES (v_org, 'third_party', 'Third Party', 'Basic third-party liability cover')
    ON CONFLICT DO NOTHING;

  INSERT INTO public.policy_types (organization_id, key, title, description)
    VALUES (v_org, 'full', 'Full Cover', 'Comprehensive insurance covering damages and theft')
    ON CONFLICT DO NOTHING;

  INSERT INTO public.insurers (organization_id, name, contact)
    VALUES (v_org, 'Acme Insurance Co', jsonb_build_object('phone', '+372 600 1234', 'email', 'support@acme.example'))
    ON CONFLICT DO NOTHING;

  SELECT id INTO v_insurer FROM public.insurers WHERE organization_id = v_org LIMIT 1;
  SELECT id INTO v_vehicle FROM public.vehicles WHERE organization_id = v_org LIMIT 1;

  IF v_insurer IS NOT NULL AND v_vehicle IS NOT NULL THEN
    INSERT INTO public.insurance_policies (organization_id, vehicle_id, insurer_id, policy_number, policy_type_key, coverage, start_date, end_date, premium_eur, active)
      VALUES (v_org, v_vehicle, v_insurer, 'POL-EX-0001', 'full', jsonb_build_object('type','full','limits', jsonb_build_object('damage', 10000, 'theft', 20000)), current_date - interval '30 days', current_date + interval '335 days', 450.00, true)
      ON CONFLICT DO NOTHING;
  END IF;
END $$;
