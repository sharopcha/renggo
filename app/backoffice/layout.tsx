"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log(data);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          router.push("/auth/login");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  return <Suspense fallback={null}>{children}</Suspense>;
}
