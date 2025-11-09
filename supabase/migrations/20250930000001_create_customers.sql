-- Create customers table
create table "public"."customers" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "phone" text,
    "avatar_url" text,
    "address" text,
    "city" text,
    "country" text,
    "postal_code" text,
    "date_of_birth" date,
    "drivers_license_number" text,
    "drivers_license_expiry" date,
    "drivers_license_verified" boolean default false,
    "is_verified" boolean default false,
    "verification_date" timestamp with time zone,
    "status" text default 'Active'::text,
    "total_trips" integer default 0,
    "total_cancellations" integer default 0,
    "lifetime_spend_eur" numeric(10,2) default 0,
    "average_rating" numeric(3,2) default 0,
    "notes" text,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_customers_organization ON public.customers USING btree (organization_id);
CREATE INDEX idx_customers_email ON public.customers USING btree (email);
CREATE INDEX idx_customers_status ON public.customers USING btree (status);

-- Add primary key
CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

-- Add foreign key constraint
alter table "public"."customers" add constraint "customers_organization_id_fkey" 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Add trigger for updated_at
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers 
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Grant permissions
grant delete on table "public"."customers" to "anon";
grant insert on table "public"."customers" to "anon";
grant references on table "public"."customers" to "anon";
grant select on table "public"."customers" to "anon";
grant trigger on table "public"."customers" to "anon";
grant truncate on table "public"."customers" to "anon";
grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";
grant insert on table "public"."customers" to "authenticated";
grant references on table "public"."customers" to "authenticated";
grant select on table "public"."customers" to "authenticated";
grant trigger on table "public"."customers" to "authenticated";
grant truncate on table "public"."customers" to "authenticated";
grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";
grant insert on table "public"."customers" to "service_role";
grant references on table "public"."customers" to "service_role";
grant select on table "public"."customers" to "service_role";
grant trigger on table "public"."customers" to "service_role";
grant truncate on table "public"."customers" to "service_role";
grant update on table "public"."customers" to "service_role";
