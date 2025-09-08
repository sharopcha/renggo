import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";



export default function Backoffice() {
  return (
    // <div className="flex h-screen bg-background">
    //   <Sidebar />
    //   <div className="flex flex-1 flex-col overflow-hidden">
    //     <Header />
    //     <main className="flex-1 overflow-auto">
    //       <DashboardContent />
    //     </main>
    //   </div>
    // </div>

        <main className="flex-1 overflow-auto">
          <DashboardContent />
        </main>
    
  );
}
