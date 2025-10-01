import { Database } from "@/lib/supabase/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
