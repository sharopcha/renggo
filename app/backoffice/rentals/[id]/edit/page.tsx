import { EditRentalContent } from "@/components/rentals/edit-rental-content";

interface EditRentalPageProps {
  params: {
    id: string;
  };
}

export default function EditRentalPage({ params }: EditRentalPageProps) {
  return (
    <main className="flex-1 overflow-y-auto">
      <EditRentalContent rentalId={params.id} />
    </main>
  );
}
