"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type SupabaseCtx = {
  user: User | null;
  claims: any | null; // shape of your custom claims; refine if you have a type
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

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError.message);
        setUser(null);
        router.push("/auth/login");
        return;
      }
      setUser(userData.user ?? null);

      // Keep your existing claims fetch (assumes you’re using custom claims)
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
      if (claimsError) {
        console.error("Error fetching claims:", claimsError.message);
        setClaims(null);
      } else {
        setClaims(claimsData?.claims?.renggo ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  React.useEffect(() => {
    // Initial load
    void refresh();

    // Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setClaims(null);
        router.push("/auth/login");
        return;
      }
      // On sign-in / token refresh, re-fetch user + claims
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        await refresh();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [refresh, router, supabase]);

  const value: SupabaseCtx = React.useMemo(
    () => ({ user, claims, loading, supabase, refresh }),
    [user, claims, loading, supabase, refresh]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const ctx = React.useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return ctx;
}