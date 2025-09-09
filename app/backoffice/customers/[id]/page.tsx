import { CustomerDetailsContent } from "@/components/customers/customer-details-content";

interface CustomerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailsPage({
  params,
}: CustomerDetailsPageProps) {
  const { id } = await params;
  return (
    <main className="flex-1 overflow-auto">
      <CustomerDetailsContent customerId={id} />
    </main>
  );
}
