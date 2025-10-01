"use client";

import React, { Suspense, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { SupabaseProvider } from "@/lib/supabase/context";
import { FeatureFlagsProvider } from "@/components/feature-flags-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";


export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Suspense fallback={null}>
      <SupabaseProvider>
        <FeatureFlagsProvider>
          <QueryClientProvider client={queryClient}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <Header />
                {children}
              </SidebarInset>
            </SidebarProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
          </QueryClientProvider>
        </FeatureFlagsProvider>
      </SupabaseProvider>
    </Suspense>
  );
}
