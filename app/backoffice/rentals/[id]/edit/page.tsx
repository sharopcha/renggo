import { EditRentalContent } from "@/components/rentals/edit-rental-content";

interface EditRentalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRentalPage({ params }: EditRentalPageProps) {

  const { id } = await params;

  return (
    <main className="flex-1 overflow-y-auto">
      <EditRentalContent rentalId={id} />
    </main>
  );
}
