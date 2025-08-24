"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Tables } from "@/lib/supabase/database.types";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type UserProfile = Tables<"profiles">;

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
  redirectTo?: string;
  redirectOnSignOut?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  redirectTo = "/dashboard",
  redirectOnSignOut = "/auth/login",
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from database
  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles") // Adjust table name as needed
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          let profile = await fetchUserProfile(session.user.id);
          
          if(!profile) {
            const { data, error } = await supabase.from('profiles').insert({
              email: session.user.email || '',
              id: session.user.id || '',
              full_name: session.user.user_metadata.full_name || '',
              profile_image_url: session.user.user_metadata.avatar_url || '',
              phone: session.user.user_metadata.phone || '',
              date_of_birth: session.user.user_metadata.date_of_birth,
            }).single()

            if (error) {
              console.error("Error creating profile:", error);
            }

            setUserProfile(data);
          } else {
            setUserProfile(profile);
          }

        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
        router.push(redirectTo);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserProfile(null);
        router.push(redirectOnSignOut);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user);
        // Optionally refresh profile on token refresh
        if (!userProfile) {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        }
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, redirectTo, redirectOnSignOut]);

  const value = {
    user,
    userProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
