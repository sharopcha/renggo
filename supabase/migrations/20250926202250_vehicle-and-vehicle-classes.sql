create type "public"."vehicle_status" as enum ('available', 'on_trip', 'maintenance', 'inactive');

create table "public"."vehicle_classes" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."vehicles" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "vehicle_class_id" uuid,
    "plate" text not null,
    "vin" text,
    "make" text not null,
    "model" text not null,
    "year" integer not null,
    "photo_url" text,
    "odometer_km" integer default 0,
    "location" text,
    "utilization_pct" integer default 0,
    "base_daily_rate_eur" numeric(10,2),
    "lifetime_revenue_eur" numeric(10,2) default 0,
    "total_trips" integer default 0,
    "rating" numeric(3,2) default 0,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX vehicle_classes_pkey ON public.vehicle_classes USING btree (id);

CREATE UNIQUE INDEX vehicles_pkey ON public.vehicles USING btree (id);

alter table "public"."vehicle_classes" add constraint "vehicle_classes_pkey" PRIMARY KEY using index "vehicle_classes_pkey";

alter table "public"."vehicles" add constraint "vehicles_pkey" PRIMARY KEY using index "vehicles_pkey";

alter table "public"."vehicle_classes" add constraint "vehicle_classes_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."vehicle_classes" validate constraint "vehicle_classes_organization_id_fkey";

alter table "public"."vehicles" add constraint "vehicles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."vehicles" validate constraint "vehicles_organization_id_fkey";

alter table "public"."vehicles" add constraint "vehicles_vehicle_class_id_fkey" FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id) not valid;

alter table "public"."vehicles" validate constraint "vehicles_vehicle_class_id_fkey";

grant delete on table "public"."vehicle_classes" to "anon";

grant insert on table "public"."vehicle_classes" to "anon";

grant references on table "public"."vehicle_classes" to "anon";

grant select on table "public"."vehicle_classes" to "anon";

grant trigger on table "public"."vehicle_classes" to "anon";

grant truncate on table "public"."vehicle_classes" to "anon";

grant update on table "public"."vehicle_classes" to "anon";

grant delete on table "public"."vehicle_classes" to "authenticated";

grant insert on table "public"."vehicle_classes" to "authenticated";

grant references on table "public"."vehicle_classes" to "authenticated";

grant select on table "public"."vehicle_classes" to "authenticated";

grant trigger on table "public"."vehicle_classes" to "authenticated";

grant truncate on table "public"."vehicle_classes" to "authenticated";

grant update on table "public"."vehicle_classes" to "authenticated";

grant delete on table "public"."vehicle_classes" to "service_role";

grant insert on table "public"."vehicle_classes" to "service_role";

grant references on table "public"."vehicle_classes" to "service_role";

grant select on table "public"."vehicle_classes" to "service_role";

grant trigger on table "public"."vehicle_classes" to "service_role";

grant truncate on table "public"."vehicle_classes" to "service_role";

grant update on table "public"."vehicle_classes" to "service_role";

grant delete on table "public"."vehicles" to "anon";

grant insert on table "public"."vehicles" to "anon";

grant references on table "public"."vehicles" to "anon";

grant select on table "public"."vehicles" to "anon";

grant trigger on table "public"."vehicles" to "anon";

grant truncate on table "public"."vehicles" to "anon";

grant update on table "public"."vehicles" to "anon";

grant delete on table "public"."vehicles" to "authenticated";

grant insert on table "public"."vehicles" to "authenticated";

grant references on table "public"."vehicles" to "authenticated";

grant select on table "public"."vehicles" to "authenticated";

grant trigger on table "public"."vehicles" to "authenticated";

grant truncate on table "public"."vehicles" to "authenticated";

grant update on table "public"."vehicles" to "authenticated";

grant delete on table "public"."vehicles" to "service_role";

grant insert on table "public"."vehicles" to "service_role";

grant references on table "public"."vehicles" to "service_role";

grant select on table "public"."vehicles" to "service_role";

grant trigger on table "public"."vehicles" to "service_role";

grant truncate on table "public"."vehicles" to "service_role";

grant update on table "public"."vehicles" to "service_role";

CREATE TRIGGER vehicle_classes_updated_at BEFORE UPDATE ON public.vehicle_classes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION set_updated_at();


