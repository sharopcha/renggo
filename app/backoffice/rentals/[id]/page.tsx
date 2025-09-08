import { RentalDetailsContent } from "@/components/rentals/rental-details-content";

interface RentalDetailsPageProps {
  params: {
    id: string;
  };
}

export default function RentalDetailsPage({ params }: RentalDetailsPageProps) {
  return (
    <main className="flex-1 overflow-auto">
      <RentalDetailsContent rentalId={params.id} />
    </main>
  );
}
