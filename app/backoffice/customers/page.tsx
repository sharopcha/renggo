import * as React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCustomers } from "./_lib/queries";
import { createClient } from "@/lib/supabase/server";
import { Customer } from "@/types/supabase-utils";
import CustomersTable from "./_components/customers-table";
import { SearchParams } from "@/types";
import AddCustomer from "./_components/add-customer";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CustomersPage(props: IndexPageProps) {
  const supabase = await createClient();
  const queryClient = new QueryClient();
  const searchParams = await props.searchParams;

  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*");

      if (error) throw error;
      return data as Customer[];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">Customers</h1>
            <div className="text-sm text-muted-foreground">
              Manage customer accounts and verification status
            </div>
          </div>
          <AddCustomer />
        </div>
        <CustomersTable />
      </main>
    </HydrationBoundary>
  );
}
