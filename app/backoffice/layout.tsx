"use client";

import React, { Suspense, useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { SupabaseProvider } from "@/lib/supabase/context";
import { FeatureFlagsProvider } from "@/components/feature-flags-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Loader from "@/components/layout/loader";


export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem('sidebarOpen', JSON.stringify(!isSidebarOpen));
  }

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <SupabaseProvider>
        <FeatureFlagsProvider>
          <QueryClientProvider client={queryClient}>
            <SidebarProvider open={isSidebarOpen} onOpenChange={toggleSidebar}>
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
