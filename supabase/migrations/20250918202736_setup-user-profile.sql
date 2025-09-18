create extension if not exists "citext" with schema "public" version '1.6';

create type "public"."user_role" as enum ('owner', 'fleet_admin', 'driver', 'renter', 'staff', 'support', 'superadmin');

create table "public"."user_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "email" citext not null,
    "full_name" text,
    "avatar_url" text,
    "phone" text,
    "locale" text default 'en'::text,
    "role" user_role default 'fleet_admin'::user_role,
    "is_verified" boolean default false,
    "verification_status" text default 'unverified'::text,
    "onboarding_status" text default 'pending'::text,
    "organization_id" uuid,
    "preferences" jsonb not null default '{}'::jsonb,
    "metadata" jsonb not null default '{}'::jsonb,
    "last_login_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


CREATE INDEX idx_user_profiles_org ON public.user_profiles USING btree (organization_id);

CREATE UNIQUE INDEX uq_user_profiles_email_ci ON public.user_profiles USING btree (lower((email)::text));

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX user_profiles_user_id_key ON public.user_profiles USING btree (user_id);

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_user_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_user_id_key" UNIQUE using index "user_profiles_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  uid uuid := (event->>'user_id')::uuid;
  original_claims jsonb := coalesce(event->'claims','{}'::jsonb);
  email text := coalesce((event->'claims'->>'email'), null);

  v_org_id uuid;
  v_role text;
  new_claims jsonb;
begin
  -- 1) Prefer lookup by user_id
  select up.organization_id, up.role::text
    into v_org_id, v_role
  from public.user_profiles up
  where up.user_id = uid
  limit 1;

  -- 2) Fallback: match by email if not linked yet
  if v_role is null and email is not null then
    select up.organization_id, up.role::text
      into v_org_id, v_role
    from public.user_profiles up
    where lower(up.email) = lower(email)
    limit 1;
  end if;

  -- 3) Merge: keep existing claims, add our minimal custom block
  new_claims := original_claims;

  new_claims := jsonb_set(
      new_claims,
      '{renggo}',
      jsonb_build_object(
        'organization_id', v_org_id,     -- UUID or null
        'role', v_role,                  -- e.g. 'owner' | 'fleet_admin' | 'driver' | 'renter'
        'features', jsonb_build_object('backoffice', true)
      ),
      true
  );

  return jsonb_build_object('claims', new_claims);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  update public.user_profiles
     set user_id = null
   where user_id = old.id;
  return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_profile_id uuid;
  v_profile_user_id uuid;
begin
  -- Find existing profile by email (case-insensitive thanks to citext + index)
  select id, user_id
    into v_profile_id, v_profile_user_id
  from public.user_profiles
  where lower(email) = lower(new.email)
  limit 1;

  if v_profile_id is not null then
    -- Profile exists for that email.
    if v_profile_user_id is null then
      -- Link it to this auth user
      update public.user_profiles
         set user_id = new.id,
             last_login_at = now()
       where id = v_profile_id;
    else
      -- Already linked to a user. We won't overwrite (merge-safe).
      -- You can decide to notify/log instead of doing nothing:
      raise notice 'Profile with email % is already linked to user_id %; leaving as-is.', new.email, v_profile_user_id;
      -- Optional: still record last_login_at on the matching email
      update public.user_profiles
         set last_login_at = now()
       where id = v_profile_id;
    end if;
  else
    -- No profile yet — create a new one linked to this auth user
    insert into public.user_profiles (user_id, email, full_name, avatar_url, last_login_at)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name',
               new.raw_user_meta_data->>'name',
               null),
      nullif(new.raw_user_meta_data->>'avatar_url',''),
      now()
    );
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at := now();
  return new;
end$function$
;

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

