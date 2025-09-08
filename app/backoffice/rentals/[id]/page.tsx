import { RentalDetailsContent } from "@/components/rentals/rental-details-content";

interface RentalDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RentalDetailsPage({ params }: RentalDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="flex-1 overflow-auto">
      <RentalDetailsContent rentalId={id} />
    </main>
  );
}
