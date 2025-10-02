import * as React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { getVehiles } from "./_lib/queries";
import { createClient } from "@/lib/supabase/server";
import { Vehicle } from "@/types/supabase-utils";
import VehiclesTable from "./_components/vehicles-table";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AddVehicle from "./_components/add-vehicle";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function VehiclesPage(props: IndexPageProps) {
  const supabase = await createClient();
  const queryClient = new QueryClient();
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  await queryClient.prefetchQuery({
    queryKey: ["vehicles"],
    staleTime: 60_000,
    queryFn: async () => {
      let query = supabase.from("vehicles").select("*");

      const modelYear = (search.modelYear ?? "").trim();
      if (modelYear !== "") {
        // numeric? treat as year match OR model substring
        const asNum = Number(modelYear);
        const isYear =
          Number.isInteger(asNum) &&
          asNum >= 1900 &&
          asNum <= new Date().getFullYear() + 1;

        // escape commas/parentheses used by PostgREST boolean expressions
        const esc = modelYear.replace(/[,()]/g, " ");

        if (isYear) {
          // year = N OR model ILIKE %N%
          query = query.or(`year.eq.${asNum},model.ilike.%${esc}%`);
        } else {
          // text → model ILIKE %text%
          query = query.ilike("model", `%${esc}%`);
        }
      }

      if (search.vehicle_class?.length > 0) {
        const vehicleClasses = search.vehicle_class?.trim()?.split(",") || [];
        if (vehicleClasses) {
          query = query.in("vehicle_class", vehicleClasses);
        }
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      return data as Vehicle[];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">Vehicles</h1>
            <div className="text-sm text-muted-foreground">
              Manage your fleet vehicles and their details
            </div>
          </div>
          <AddVehicle />
        </div>
        <VehiclesTable />
      </main>
    </HydrationBoundary>
  );
}
