-- Create rental status enum
create type "public"."rental_status" as enum ('upcoming', 'active', 'completed', 'cancelled');

-- Create payment type enum
create type "public"."payment_type" as enum ('charge', 'refund', 'payout', 'fee');

-- Create payment status enum
create type "public"."payment_status" as enum ('pending', 'succeeded', 'failed', 'cancelled');

-- Create payment method enum
create type "public"."payment_method" as enum ('card', 'bank_transfer', 'cash', 'platform_fee', 'other');

-- Create rentals table
create table "public"."rentals" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "vehicle_id" uuid not null,
    "customer_id" uuid not null,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "status" rental_status not null default 'upcoming'::rental_status,
    "pickup_location" text not null,
    "return_location" text not null,
    "pickup_city" text,
    "return_city" text,
    "price_eur" numeric(10,2) not null,
    "deposit_eur" numeric(10,2) default 0,
    "insurance_eur" numeric(10,2) default 0,
    "extras_eur" numeric(10,2) default 0,
    "total_price_eur" numeric(10,2) generated always as (price_eur + deposit_eur + insurance_eur + extras_eur) stored,
    "odometer_start" integer,
    "odometer_end" integer,
    "notes" text,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

-- Create payments table
create table "public"."payments" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "rental_id" uuid,
    "customer_id" uuid,
    "type" payment_type not null,
    "amount_eur" numeric(10,2) not null,
    "status" payment_status not null default 'pending'::payment_status,
    "method" payment_method not null default 'card'::payment_method,
    "method_details" text,
    "transaction_id" text,
    "processor" text default 'stripe'::text,
    "processor_fee_eur" numeric(10,2) default 0,
    "platform_fee_eur" numeric(10,2) default 0,
    "net_amount_eur" numeric(10,2) generated always as (amount_eur - processor_fee_eur - platform_fee_eur) stored,
    "currency" text default 'EUR'::text,
    "description" text,
    "metadata" jsonb default '{}'::jsonb,
    "failed_reason" text,
    "processed_at" timestamp with time zone,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

-- Create payouts table
create table "public"."payouts" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "amount_eur" numeric(10,2) not null,
    "status" payment_status not null default 'pending'::payment_status,
    "method" payment_method not null default 'bank_transfer'::payment_method,
    "bank_account" text,
    "transaction_id" text,
    "period_start" timestamp with time zone not null,
    "period_end" timestamp with time zone not null,
    "scheduled_date" timestamp with time zone,
    "processed_date" timestamp with time zone,
    "notes" text,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_rentals_organization ON public.rentals USING btree (organization_id);
CREATE INDEX idx_rentals_vehicle ON public.rentals USING btree (vehicle_id);
CREATE INDEX idx_rentals_customer ON public.rentals USING btree (customer_id);
CREATE INDEX idx_rentals_status ON public.rentals USING btree (status);
CREATE INDEX idx_rentals_dates ON public.rentals USING btree (start_date, end_date);

CREATE INDEX idx_payments_organization ON public.payments USING btree (organization_id);
CREATE INDEX idx_payments_rental ON public.payments USING btree (rental_id);
CREATE INDEX idx_payments_customer ON public.payments USING btree (customer_id);
CREATE INDEX idx_payments_type ON public.payments USING btree (type);
CREATE INDEX idx_payments_status ON public.payments USING btree (status);
CREATE INDEX idx_payments_created ON public.payments USING btree (created_at);

CREATE INDEX idx_payouts_organization ON public.payouts USING btree (organization_id);
CREATE INDEX idx_payouts_status ON public.payouts USING btree (status);
CREATE INDEX idx_payouts_dates ON public.payouts USING btree (period_start, period_end);

-- Add primary keys
CREATE UNIQUE INDEX rentals_pkey ON public.rentals USING btree (id);
CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);
CREATE UNIQUE INDEX payouts_pkey ON public.payouts USING btree (id);

alter table "public"."rentals" add constraint "rentals_pkey" PRIMARY KEY using index "rentals_pkey";
alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";
alter table "public"."payouts" add constraint "payouts_pkey" PRIMARY KEY using index "payouts_pkey";

-- Add foreign key constraints
alter table "public"."rentals" add constraint "rentals_organization_id_fkey" 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

alter table "public"."rentals" add constraint "rentals_vehicle_id_fkey" 
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE;

alter table "public"."rentals" add constraint "rentals_customer_id_fkey" 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

alter table "public"."payments" add constraint "payments_organization_id_fkey" 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

alter table "public"."payments" add constraint "payments_rental_id_fkey" 
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE SET NULL;

alter table "public"."payments" add constraint "payments_customer_id_fkey" 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

alter table "public"."payouts" add constraint "payouts_organization_id_fkey" 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Add triggers for updated_at
CREATE TRIGGER rentals_updated_at BEFORE UPDATE ON public.rentals 
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments 
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER payouts_updated_at BEFORE UPDATE ON public.payouts 
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Grant permissions
grant all on table "public"."rentals" to "anon";
grant all on table "public"."rentals" to "authenticated";
grant all on table "public"."rentals" to "service_role";

grant all on table "public"."payments" to "anon";
grant all on table "public"."payments" to "authenticated";
grant all on table "public"."payments" to "service_role";

grant all on table "public"."payouts" to "anon";
grant all on table "public"."payouts" to "authenticated";
grant all on table "public"."payouts" to "service_role";
