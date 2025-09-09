import { ReportsContent } from "@/components/reports/reports-content";

export default function ReportsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto p-6">
        <ReportsContent />
      </div>
    </main>
  );
}
