import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

// Create a singleton instance of the Supabase client for Client Components
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
