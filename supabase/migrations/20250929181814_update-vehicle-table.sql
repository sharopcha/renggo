drop trigger if exists "vehicle_classes_updated_at" on "public"."vehicle_classes";

revoke delete on table "public"."vehicle_classes" from "anon";

revoke insert on table "public"."vehicle_classes" from "anon";

revoke references on table "public"."vehicle_classes" from "anon";

revoke select on table "public"."vehicle_classes" from "anon";

revoke trigger on table "public"."vehicle_classes" from "anon";

revoke truncate on table "public"."vehicle_classes" from "anon";

revoke update on table "public"."vehicle_classes" from "anon";

revoke delete on table "public"."vehicle_classes" from "authenticated";

revoke insert on table "public"."vehicle_classes" from "authenticated";

revoke references on table "public"."vehicle_classes" from "authenticated";

revoke select on table "public"."vehicle_classes" from "authenticated";

revoke trigger on table "public"."vehicle_classes" from "authenticated";

revoke truncate on table "public"."vehicle_classes" from "authenticated";

revoke update on table "public"."vehicle_classes" from "authenticated";

revoke delete on table "public"."vehicle_classes" from "service_role";

revoke insert on table "public"."vehicle_classes" from "service_role";

revoke references on table "public"."vehicle_classes" from "service_role";

revoke select on table "public"."vehicle_classes" from "service_role";

revoke trigger on table "public"."vehicle_classes" from "service_role";

revoke truncate on table "public"."vehicle_classes" from "service_role";

revoke update on table "public"."vehicle_classes" from "service_role";

alter table "public"."vehicle_classes" drop constraint "vehicle_classes_organization_id_fkey";

alter table "public"."vehicles" drop constraint "vehicles_vehicle_class_id_fkey";

alter table "public"."vehicle_classes" drop constraint "vehicle_classes_pkey";

drop index if exists "public"."vehicle_classes_pkey";

drop table "public"."vehicle_classes";

alter table "public"."vehicles" drop column "vehicle_class_id";

alter table "public"."vehicles" add column "vehicle_class" text not null;


