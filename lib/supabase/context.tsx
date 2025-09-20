"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { QueryData, User } from "@supabase/supabase-js";
import { Database } from "./database.types";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type Organisation = Database["public"]["Tables"]["organizations"]["Row"];

type SupabaseCtx = {
  user: User | null;
  claims: any | null; // shape of your custom claims; refine if you have a type
  profile: UserProfile | null;
  organization: Organisation | null;
  loading: boolean;
  supabase: ReturnType<typeof createClient>;
  refresh: () => Promise<void>;
};

const SupabaseContext = React.createContext<SupabaseCtx | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [user, setUser] = React.useState<User | null>(null);
  const [claims, setClaims] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [organization, setOrganization] = React.useState<Organisation | null>(
    null
  );

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError.message);
        setUser(null);
        setClaims(null);
        setProfile(null);
        setOrganization(null);
        router.push("/auth/login");
        return;
      }

      const authedUser = userData.user ?? null;
      setUser(authedUser);

      // Keep your existing claims fetch (assumes you’re using custom claims)
      const { data: claimsData, error: claimsError } =
        await supabase.auth.getClaims();
      if (claimsError) {
        console.error("Error fetching claims:", claimsError.message);
        setClaims(null);
      } else {
        setClaims(claimsData?.claims?.renggo ?? null);
      }

      // Profile + Organization (single round-trip via nested select)
      //    Requires FK: public.user_profiles.organization_id -> public.organizations.id
      if (authedUser?.id) {
        const profileQuery = supabase
          .from("user_profiles")
          .select(
            `
              user_id,
              email,
              role,
              organization_id,
              first_name,
              last_name,
              full_name,
              is_verified,
              organization:organizations (
                id,
                name,
                tax_register_number,
                settings,
                created_at
              )
            `
          )
          .eq("user_id", authedUser.id)
          .maybeSingle();

        // Inferred type of the row (may include null)
        type ProfileWithOrg = QueryData<typeof profileQuery>;
        type ProfileRow = NonNullable<ProfileWithOrg>; // strip null

        // 3) Run the query
        const { data: row, error: profErr } = await profileQuery;

        if (profErr) {
          console.error("Error fetching user profile:", profErr.message);
          setProfile(null);
          setOrganization(null);
        } else if (row) {
          const p = row as ProfileRow;

          // ✅ No rest destructuring needed
          setProfile(p as UserProfile); // extra 'organization' field is fine
          setOrganization((p["organization"] as Organisation) ?? null);
        } else {
          setProfile(null);
          setOrganization(null);
        }
      } else {
        setProfile(null);
        setOrganization(null);
      }
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  React.useEffect(() => {
    // Initial load
    void refresh();

    // Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setClaims(null);
          setProfile(null);
          setOrganization(null);
          router.push("/auth/login");
          return;
        }
        // On sign-in / token refresh, re-fetch user + claims
        if (
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED"
        ) {
          await refresh();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [refresh, router, supabase]);

  const value: SupabaseCtx = React.useMemo(
    () => ({ user, claims, profile, organization, loading, supabase, refresh }),
    [user, claims, profile, organization, loading, supabase, refresh]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = React.useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return ctx;
}
