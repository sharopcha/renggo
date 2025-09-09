"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      await supabase.auth.getUser();
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/auth/login");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <Suspense fallback={null}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
