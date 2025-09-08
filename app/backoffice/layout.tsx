'use client';

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      (event, session) => {
        if(event === "SIGNED_OUT") {
          router.push("/auth/login");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    }
  }, [supabase]);

  return (
    <div>
      <h1>Backoffice Layout</h1>
      {children}
    </div>
  );
}
