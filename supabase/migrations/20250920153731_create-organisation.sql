alter table "public"."user_profiles" alter column "role" drop default;

alter type "public"."user_role" rename to "user_role__old_version_to_be_dropped";

create type "public"."user_role" as enum ('owner', 'fleet_admin', 'driver', 'renter', 'staff', 'support', 'superadmin', 'member');

create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "tax_register_number" text not null,
    "settings" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."user_profiles" alter column role type "public"."user_role" using role::text::"public"."user_role";

alter table "public"."user_profiles" alter column "role" set default 'fleet_admin'::user_role;

drop type "public"."user_role__old_version_to_be_dropped";

alter table "public"."user_profiles" add column "first_name" text;

alter table "public"."user_profiles" add column "last_name" text;

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX organizations_tax_register_number_key ON public.organizations USING btree (tax_register_number);

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."organizations" add constraint "organizations_tax_register_number_key" UNIQUE using index "organizations_tax_register_number_key";

alter table "public"."user_profiles" add constraint "user_profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_organization_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_invite_accept_create_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_role       user_role := 'member'::user_role;  -- default/fallback
  v_role_txt   text;
  v_org_id     uuid;
  v_first      text;
  v_last       text;
  v_full       text;
begin
  -- run only when email becomes confirmed
  if new.email_confirmed_at is not null
     and (tg_op = 'INSERT' or old.email_confirmed_at is null) then

    -- read metadata
    v_role_txt := nullif(new.raw_user_meta_data->>'role','');
    v_first    := nullif(new.raw_user_meta_data->>'firstName','');
    v_last     := nullif(new.raw_user_meta_data->>'lastName','');
    v_full     := trim(both ' ' from coalesce(v_first,'') || ' ' || coalesce(v_last,''));
    v_org_id   := nullif(coalesce(
                    new.raw_user_meta_data->>'organisationId',
                    new.raw_user_meta_data->>'organizationId'
                  ), '')::uuid;

    -- only adopt role if it's a valid enum label
    if v_role_txt is not null then
      perform 1
      from pg_type t
      join pg_enum e on e.enumtypid = t.oid
      where t.typname = 'user_role' and e.enumlabel = v_role_txt;

      if found then
        v_role := v_role_txt::user_role;
      end if;
    end if;

    -- link or insert profile
    if exists (select 1 from public.user_profiles up where up.email = new.email) then
      update public.user_profiles up
         set user_id         = new.id,
             role            = coalesce(up.role, v_role),
             organization_id = coalesce(up.organization_id, v_org_id),
             first_name      = coalesce(up.first_name, v_first),
             last_name       = coalesce(up.last_name,  v_last),
             full_name       = coalesce(nullif(up.full_name,''), nullif(v_full,'')),
             is_verified     = true,
             updated_at      = now()
       where up.email = new.email;

    elsif not exists (select 1 from public.user_profiles up where up.user_id = new.id) then
      insert into public.user_profiles (
        user_id, email, role, organization_id,
        first_name, last_name, full_name, is_verified
      )
      values (
        new.id, new.email, v_role, v_org_id,
        v_first, v_last, nullif(v_full,''), true
      );
    end if;
  end if;

  return new;
end;
$function$
;

drop trigger if exists on_auth_user_invite_accept on auth.users;

create trigger on_auth_user_invite_accept
after insert or update of email_confirmed_at on auth.users
for each row
execute function public.handle_invite_accept_create_profile();

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION set_updated_at();


