import { VehicleDetailsContent } from "@/components/vehicles/vehicle-details-content";

interface VehicleDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {

  const { id } = await params;

  return (
    <main className="flex-1 overflow-auto">
      <VehicleDetailsContent vehicleId={id} />
    </main>
  );
}
