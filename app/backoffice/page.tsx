'use client';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function Backoffice() {
  
  const onLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  return (
    <>
      <div>Backoffice</div>
      <Button variant="ghost" onClick={() => onLogout()}>
        Logout
      </Button>
    </>
  );
}
